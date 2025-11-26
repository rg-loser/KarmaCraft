
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json, os, threading, time

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")
os.makedirs(DATA_DIR, exist_ok=True)

def load_json(name, default):
    path = os.path.join(DATA_DIR, name)
    if not os.path.exists(path):
        with open(path, "w") as f:
            json.dump(default, f, indent=2)
        return default
    with open(path, "r") as f:
        try:
            return json.load(f)
        except:
            return default

def save_json(name, obj):
    path = os.path.join(DATA_DIR, name)
    with open(path, "w") as f:
        json.dump(obj, f, indent=2)

# initialize files
for fname, default in [("agami.json", []), ("sanchita.json", []), ("prarabdha.json", []), ("schedule.json", {}), ("system_state.json", {"mental_state":0, "palah":0})]:
    load_json(fname, default)

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='/')
CORS(app)

# --- simple karma engine helpers ---
def compute_result_from_action(action):
    # action: {description, produces, expectation_strength}
    produces = action.get("produces", "instant")
    note = action.get("description", "") + (" [tyag]" if float(action.get("expectation_strength",0))<=0.001 else (" [lean-tyag]" if float(action.get("expectation_strength",0))<0.5 else " [expectation]"))
    res = {"note": note, "outcome": produces, "at_palah": load_json("system_state.json", {})["palah"]}
    return res

def schedule_result(result):
    sched = load_json("schedule.json", {})
    key = str(result["at_palah"])
    sched.setdefault(key, []).append(result)
    save_json("schedule.json", sched)

def process_result(r):
    # updates buckets and mental state
    sstate = load_json("system_state.json", {"mental_state":0, "palah":0})
    mental = sstate.get("mental_state",0)
    outcome = r.get("outcome","instant")
    if outcome == "instant":
        mental += 1
        sanchita = load_json("sanchita.json", [])
        sanchita.append(r)
        save_json("sanchita.json", sanchita)
    elif outcome == "delayed":
        # schedule resolution next palah
        next_p = sstate.get("palah",0) + 1
        resolved = {"note": r["note"] + " [resolved]", "outcome": "instant", "at_palah": next_p}
        sched = load_json("schedule.json", {})
        sched.setdefault(str(next_p), []).append(resolved)
        save_json("schedule.json", sched)
        prarabdha = load_json("prarabdha.json", [])
        prarabdha.append(r)
        save_json("prarabdha.json", prarabdha)
    else: # mental
        if "help" in r.get("note","").lower() or "good" in r.get("note","").lower():
            mental += 2
        else:
            mental -= 2
        sanchita = load_json("sanchita.json", [])
        sanchita.append(r)
        save_json("sanchita.json", sanchita)
    sstate["mental_state"] = mental
    save_json("system_state.json", sstate)

def run_scheduled_processing(start_palah, steps=10):
    # processes schedule from start_palah up to steps and returns logs
    logs = []
    sched = load_json("schedule.json", {})
    sstate = load_json("system_state.json", {"mental_state":0, "palah":0})
    for t in range(start_palah, start_palah + steps + 1):
        key = str(t)
        if key in sched:
            items = sched[key]
            for r in items:
                logs.append(f"[Time {t}] Processing: {r.get('note')} ({r.get('outcome')})")
                process_result(r)
            del sched[key]
    save_json("schedule.json", sched)
    return logs

# --- API endpoints ---
@app.route("/api/profile", methods=["POST"])
def create_profile():
    body = request.json
    state = load_json("system_state.json", {"mental_state":0, "palah":0})
    state["profile"] = body
    save_json("system_state.json", state)
    return jsonify({"status":"ok","profile":body})

@app.route("/api/action", methods=["POST"])
def add_action():
    body = request.json
    agami = load_json("agami.json", [])
    agami.append(body)
    save_json("agami.json", agami)
    # produce result and schedule
    res = compute_result_from_action(body)
    schedule_result(res)
    return jsonify({"status":"ok","action":body,"scheduled_result":res})

@app.route("/api/run_falah", methods=["POST"])
def run_falah():
    data = request.json or {}
    start = int(data.get("start", load_json("system_state.json", {}).get("palah",0)))
    steps = int(data.get("steps", 5))
    logs = run_scheduled_processing(start, steps)
    return jsonify({"status":"ok","logs":logs})

@app.route("/api/stats", methods=["GET"])
def stats():
    return jsonify({
        "agami": load_json("agami.json", []),
        "sanchita": load_json("sanchita.json", []),
        "prarabdha": load_json("prarabdha.json", []),
        "schedule": load_json("schedule.json", {}),
        "system_state": load_json("system_state.json", {"mental_state":0, "palah":0})
    })

@app.route("/api/shanti", methods=["GET"])
def shanti():
    agami = load_json("agami.json", [])
    sstate = load_json("system_state.json", {"mental_state":0, "palah":0})
    if not agami:
        return jsonify({"shanti": sstate.get("mental_state",0) > 0})
    sum_expect = sum([float(a.get("expectation_strength",0)) for a in agami])
    avg = sum_expect / len(agami)
    adjusted = avg - (0.1 * (sstate.get("mental_state",0) / 10.0))
    return jsonify({"shanti": adjusted <= 0.4, "avg_expectation": avg, "mental_state": sstate.get("mental_state",0)})

@app.route("/api/lessons", methods=["GET"])
def lessons():
    # simplified lessons content
    lessons = [
        {"id":1, "title":"What is Karma?", "content":"Karma means action. Actions create results."},
        {"id":2, "title":"What is Falah?", "content":"Falah is the result of your actions; immediate or delayed."},
        {"id":3, "title":"What is Tyāg?", "content":"Tyāg is letting go of expectation; it increases shanti."},
        {"id":4, "title":"Wants vs Desires", "content":"Wants are basic; desires are deeper urges."}
    ]
    return jsonify({"lessons": lessons})

@app.route("/api/reset", methods=["POST"])
def reset():
    for fname in ["agami.json","sanchita.json","prarabdha.json","schedule.json","system_state.json"]:
        save_json(fname, [] if fname!="system_state.json" else {"mental_state":0,"palah":0})
    return jsonify({"status":"reset"})

# serve frontend
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    # serve built frontend if exists, otherwise simple message
    dist = os.path.join(BASE_DIR, "..", "frontend", "dist")
    if path != "" and os.path.exists(os.path.join(dist, path)):
        return send_from_directory(dist, path)
    index = os.path.join(dist, "index.html")
    if os.path.exists(index):
        return send_from_directory(dist, "index.html")
    return jsonify({"status":"backend running"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
