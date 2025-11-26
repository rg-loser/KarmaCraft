
import React, { useEffect, useState } from 'react';
import API from '../api/client';

export default function Lessons({back}){
  const [lessons, setLessons] = useState([]);
  useEffect(()=>{ API.get('/lessons').then(r=>setLessons(r.data.lessons)).catch(()=>{}) },[]);
  return (
    <div>
      <button onClick={back} style={{marginBottom:8}}>Back</button>
      <div className="card">
        <h2>Lessons</h2>
        {lessons.map(l=>(
          <div key={l.id} style={{padding:8, borderBottom:'1px solid #f1f5f9'}}>
            <h4>{l.title}</h4>
            <p>{l.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
