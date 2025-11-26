
import React from 'react';
export default function ShantiFlower({level=0}) {
  // simple flower-like unicode
  const petals = ["🌸","🌼","🌺","🌷"];
  const idx = Math.min(Math.floor(level*petals.length), petals.length-1);
  return (
    <div style={{fontSize:44, textAlign:'center'}}>{petals[idx]}</div>
  )
}
