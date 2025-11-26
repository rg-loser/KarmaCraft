
import React, { useEffect, useState } from 'react';
import API from './api/client';
import Home from './screens/Home';
import Game from './screens/Game';
import Lessons from './screens/Lessons';

export default function App(){
  const [route, setRoute] = useState('home');
  const [profile, setProfile] = useState(null);

  useEffect(()=>{
    // try to load profile from localStorage
    const p = localStorage.getItem('karma_profile');
    if(p) setProfile(JSON.parse(p));
  },[]);

  return (
    <div className="container">
      <h1 style={{color:'#374151'}}>KarmaQuest</h1>
      {route==='home' && <Home goGame={()=>setRoute('game')} goLessons={()=>setRoute('lessons')} profile={profile} setProfile={(p)=>{setProfile(p); localStorage.setItem('karma_profile', JSON.stringify(p)); API.post('/profile', p).catch(()=>{});}} />}
      {route==='game' && <Game back={()=>setRoute('home')} profile={profile} />}
      {route==='lessons' && <Lessons back={()=>setRoute('home')} />}
      <div style={{height:40}}/>
    </div>
  )
}
