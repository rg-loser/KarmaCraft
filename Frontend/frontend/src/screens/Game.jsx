
import React, { useEffect, useState } from 'react';
import API from '../api/client';
import KarmaMeter from '../components/KarmaMeter';
import ShantiFlower from '../components/ShantiFlower';

const sampleCards = [
  {id:1, text:"You see someone struggling with heavy bags.", choices:[
    {text:"Help them without expecting anything", expect:0.0, outcome:"instant", effect:{karma:2, shanti:3}},
    {text:"Help them but expect thanks", expect:0.7, outcome:"instant", effect:{karma:2, shanti:0}},
    {text:"Ignore them", expect:0.0, outcome:"mental", effect:{karma:-1, shanti:-1}}
  ]},
  {id:2, text:"You have extra savings and a friend suggests a business.", choices:[
    {text:"Invest without obsessing on returns", expect:0.2, outcome:"delayed", effect:{karma:1}},
    {text:"Invest hoping to become famous", expect:0.9, outcome:"delayed", effect:{karma:1}},
    {text:"Keep money for yourself", expect:0.0, outcome:"instant", effect:{karma:0}}
  ]}
];

export default function Game({back, profile}) {
  const [idx, setIdx] = useState(0);
  const [stats, setStats] = useState({agami:[], sanchita:[], prarabdha:[], system_state:{mental_state:0}});
  const [shantiVal, setShantiVal] = useState(0);

  useEffect(()=>{ refresh() },[]);

  function refresh(){
    API.get('/stats').then(r=>setStats(r.data)).catch(()=>{});
    API.get('/shanti').then(r=>setShantiVal(r.data.shanti?1:0)).catch(()=>{});
  }

  function playChoice(choice){
    const action = { description: choice.text, produces: choice.outcome, expectation_strength: choice.expect };
    API.post('/action', action).then(()=>{ 
      // run falah shortly and refresh
      setTimeout(()=>{ API.post('/run_falah', {start:0, steps:3}).then(()=>refresh()).catch(()=>refresh()) }, 400);
    }).catch(()=>{});
    // next card
    setIdx((idx+1) % sampleCards.length);
  }

  const card = sampleCards[idx];
  return (
    <div>
      <button onClick={back} style={{marginBottom:8}}>Back</button>
      <div className="card meters">
        <KarmaMeter label="Karma" value={stats.sanchita.length} />
        <KarmaMeter label="Expectation" value={stats.agami.length>0?stats.agami.reduce((s,a)=>s+parseFloat(a.expectation_strength||0),0).toFixed(2):0} />
        <div style={{flex:1}} className="card">
          <h4>Shanti</h4>
          <ShantiFlower level={shantiVal} />
        </div>
      </div>

      <div className="card">
        <h3>Scenario</h3>
        <p>{card.text}</p>
        <div style={{display:'flex', gap:8, flexDirection:'column'}}>
          {card.choices.map((c,i)=>(
            <button key={i} onClick={()=>playChoice(c)}>{c.text}</button>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Activity</h3>
        <p>Agami actions: {stats.agami.length} | Sanchita: {stats.sanchita.length} | Prarabdha: {stats.prarabdha.length}</p>
        <button onClick={()=>{ API.get('/shanti').then(r=>alert("Shanti: "+r.data.shanti)); }}>Check Shanti</button>
        <button onClick={()=>{ API.post('/reset').then(()=>refresh()) }}>Reset</button>
      </div>
    </div>
  )
}
