
import React, { useState } from 'react';

export default function Home({goGame, goLessons, profile, setProfile}){
  const [name, setName] = useState(profile?.name || '');
  const [nature, setNature] = useState(profile?.nature || 'Calm');
  const [iccha, setIccha] = useState(profile?.iccha || 'sukhah');
  const [kamana, setKamana] = useState(profile?.kamana || 'kaam');

  function save(){
    const p = {name, nature, iccha, kamana};
    setProfile(p);
    goGame();
  }

  return (
    <div>
      <div className="card">
        <h2>Welcome {name || 'Traveller'}</h2>
        <p>Begin your Karma journey. Create a simple Atma profile:</p>
        <label>Name<input value={name} onChange={e=>setName(e.target.value)} /></label>
        <label>Nature
          <select value={nature} onChange={e=>setNature(e.target.value)}>
            <option>Calm</option><option>Curious</option><option>Fire</option><option>Balanced</option>
          </select>
        </label>
        <label>Dominant Icchā (want)
          <select value={iccha} onChange={e=>setIccha(e.target.value)}>
            <option value="sukhah">Sukha</option>
            <option value="shanti">Shanti</option>
            <option value="suraksha">Suraksha</option>
            <option value="samman">Samman</option>
          </select>
        </label>
        <label>Dominant Kāmanā (desire)
          <select value={kamana} onChange={e=>setKamana(e.target.value)}>
            <option value="kaam">Kaam</option>
            <option value="shakti">Shakti</option>
            <option value="prashansha">Prashansha</option>
            <option value="dhan">Dhan</option>
          </select>
        </label>
        <div style={{marginTop:10}} className="actions">
          <button onClick={save}>Start Journey</button>
          <button onClick={goLessons} style={{background:'#10b981'}}>Lessons</button>
        </div>
      </div>

      <div className="card">
        <h3>Quick Start</h3>
        <p>Play a few cards and watch how expectation and giving without expectation (tyāg) affect your shanti.</p>
        <div style={{display:'flex', gap:8}}>
          <button onClick={()=>{ setName('Demo'); setNature('Balanced'); setIccha('sukhah'); setKamana('kaam'); save(); }}>Demo Profile</button>
        </div>
      </div>
    </div>
  )
}
