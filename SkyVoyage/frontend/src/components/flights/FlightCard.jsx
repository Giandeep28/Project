import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FlightCard({ flight, darkMode, isSelected }) {
  const navigate  = useNavigate();
  const [exp, setExp] = useState(false);
  const { id,airline,airlineCode,logo,logoColor,flightNo,origin,dest,departure,arrival,duration,stops,stopLabel,price,cabinBag,reschedule,badge,score } = flight;
  const bg   = darkMode ? '#1C2333' : '#fff';
  const bdr  = darkMode ? 'rgba(255,255,255,0.06)' : '#e5e7eb';
  const text = darkMode ? '#f0ece4' : '#111827';
  const muted= darkMode ? 'rgba(255,255,255,0.4)' : '#6b7280';
  const stopClr = stops===0 ? {bg:'#DCFCE7',text:'#166534'} : stops===1 ? {bg:'#FEF9C3',text:'#854D0E'} : {bg:'#FEE2E2',text:'#991B1B'};

  return (
    <div style={{ background:bg, border:`${isSelected?2:1}px solid ${isSelected?'#3B3DBF':bdr}`, borderRadius:14, overflow:'hidden', transition:'border-color 0.2s', boxShadow:isSelected?'0 0 0 3px rgba(59,61,191,0.12)':'none', position:'relative' }}>
      {badge && <div style={{ position:'absolute', top:0, right:0, background:'#3B3DBF', color:'#fff', fontSize:9, fontWeight:800, letterSpacing:'0.14em', padding:'5px 12px', borderBottomLeftRadius:8 }}>{badge}</div>}
      <div style={{ display:'grid', gridTemplateColumns:'130px 1fr auto', alignItems:'center', padding:'20px 20px 16px', gap:16 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {logo ? <img src={logo} alt={airline} style={{ height:28, objectFit:'contain', objectPosition:'left' }}/> :
            <div style={{ width:48, height:28, borderRadius:6, background:logoColor||'#374151', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:900, color:'#fff' }}>{airlineCode}</div>}
          <div>
            <p style={{ fontSize:13, fontWeight:600, color:text, marginBottom:2 }}>{airline}</p>
            <p style={{ fontSize:11, color:muted }}>{flightNo}</p>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:0 }}>
          <div style={{ textAlign:'center', minWidth:80 }}>
            <p style={{ fontSize:22, fontWeight:800, color:text, lineHeight:1 }}>{departure.replace(' AM','').replace(' PM','')}</p>
            <p style={{ fontSize:10, fontWeight:600, color:muted, marginTop:4, letterSpacing:'0.08em', textTransform:'uppercase' }}>{origin}</p>
          </div>
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'0 12px' }}>
            <p style={{ fontSize:11, color:muted }}>{duration}</p>
            <div style={{ display:'flex', alignItems:'center', width:'100%', gap:4 }}>
              <div style={{ flex:1, height:1, background:bdr }}/>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="2"><path d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9L2 14v2l8.5-2.5V19L9 20.5V22l2.5-.5 2.5.5v-1.5L12.5 19v-5.5L21 16z"/></svg>
              <div style={{ flex:1, height:1, background:bdr }}/>
            </div>
            <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:10, background:stopClr.bg, color:stopClr.text }}>{stopLabel}</span>
          </div>
          <div style={{ textAlign:'center', minWidth:80 }}>
            <p style={{ fontSize:22, fontWeight:800, color:text, lineHeight:1 }}>{arrival.replace(' AM','').replace(' PM','')}</p>
            <p style={{ fontSize:10, fontWeight:600, color:muted, marginTop:4, letterSpacing:'0.08em', textTransform:'uppercase' }}>{dest}</p>
          </div>
        </div>
        <div style={{ textAlign:'right', minWidth:130 }}>
          <p style={{ fontSize:10, color:muted, marginBottom:4 }}>Includes taxes & fees</p>
          <p style={{ fontSize:26, fontWeight:900, color:text, lineHeight:1, marginBottom:10 }}>₹{price.toLocaleString()}</p>
          <button onClick={()=>navigate(`/booking?flightId=${id}`)}
            style={{ width:'100%', padding:'10px 0', background:'#3B3DBF', color:'#fff', borderRadius:8, border:'none', fontSize:12, fontWeight:700, cursor:'pointer', transition:'background 0.15s' }}
            onMouseEnter={e=>e.currentTarget.style.background='#2F32A0'}
            onMouseLeave={e=>e.currentTarget.style.background='#3B3DBF'}>
            Select Flight
          </button>
        </div>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 20px 14px', borderTop:`1px solid ${bdr}` }}>
        <div style={{ display:'flex', gap:20 }}>
          {cabinBag && <span style={{ fontSize:12, color:muted, display:'flex', alignItems:'center', gap:5 }}>📦 Includes Cabin Bag</span>}
          {reschedule && <span style={{ fontSize:12, color:muted, display:'flex', alignItems:'center', gap:5 }}>🕐 Reschedule available</span>}
        </div>
        <button onClick={()=>setExp(e=>!e)} style={{ fontSize:12, fontWeight:600, color:'#3B3DBF', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
          Flight Details
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ transform:exp?'rotate(180deg)':'none', transition:'transform 0.2s' }}>
            <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      {exp && (
        <div style={{ borderTop:`1px solid ${bdr}`, padding:'16px 20px', background:darkMode?'rgba(255,255,255,0.02)':'#fafafa', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:16 }}>
          {[['Flight No.',flightNo],['Aircraft','Airbus A320'],['Class','Economy'],['Baggage','15 kg'],['Meal','Buy on board'],['Score',`${score}/10`]].map(([l,v])=>(
            <div key={l}><p style={{ fontSize:10, color:muted, textTransform:'uppercase', letterSpacing:'0.14em', marginBottom:3 }}>{l}</p><p style={{ fontSize:13, fontWeight:600, color:text }}>{v}</p></div>
          ))}
        </div>
      )}
    </div>
  );
}
