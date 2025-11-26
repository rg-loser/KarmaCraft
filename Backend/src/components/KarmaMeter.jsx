
import React from 'react';

export default function KarmaMeter({value, label}) {
  return (
    <div className="meter card">
      <h4>{label}</h4>
      <div style={{fontSize:24, fontWeight:700}}>{value}</div>
    </div>
  )
}
