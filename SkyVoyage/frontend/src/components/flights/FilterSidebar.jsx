import React from 'react';
import PriceDisplay from '../shared/PriceDisplay';
const STOPS = ['Non-stop','1 Stop','2+ Stops'];
export default function FilterSidebar({ filters, onChange, airlines, darkMode }) {
  const { stops, maxPrice, selectedAirlines, priceRange } = filters;
  const bg    = darkMode ? '#1C2333' : '#fff';
  const bdr   = darkMode ? 'rgba(255,255,255,0.06)' : '#e5e7eb';
  const text  = darkMode ? '#f0f0f0' : '#111827';
  const muted = darkMode ? 'rgba(255,255,255,0.4)' : '#6b7280';
  const gold  = '#C8A84B';
  const pillA = 'rgba(200,168,75,0.15)';
  const pillN = darkMode ? 'rgba(255,255,255,0.06)' : '#f3f4f6';

  const toggleStop    = s => onChange({...filters, stops: stops.includes(s) ? stops.filter(x=>x!==s) : [...stops,s] });
  const toggleAirline = n => onChange({...filters, selectedAirlines: selectedAirlines.includes(n) ? selectedAirlines.filter(x=>x!==n) : [...selectedAirlines,n] });
  const reset = () => onChange({ stops:[], maxPrice:priceRange[1], selectedAirlines:airlines, priceRange });

  return (
    <aside style={{ width:240, flexShrink:0, background:bg, border:`1px solid ${bdr}`, borderRadius:12, padding:20, height:'fit-content', position:'sticky', top:84 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <span style={{ fontSize:13, fontWeight:800, letterSpacing:'0.12em', textTransform:'uppercase', color:text }}>Filters</span>
        <button onClick={reset} style={{ fontSize:12, color:gold, fontWeight:600, background:'none', border:'none', cursor:'pointer', padding:0 }}>Reset all</button>
      </div>
      <div style={{ marginBottom:24 }}>
        <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:muted, marginBottom:12 }}>Stops</p>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {STOPS.map(s => { const a=stops.includes(s)||stops.length===0; return (
            <button key={s} onClick={()=>toggleStop(s)} style={{ padding:'7px 14px', borderRadius:20, fontSize:12, fontWeight:600, background:a?pillA:pillN, color:a?gold:muted, border:`1px solid ${a?gold+'60':'transparent'}`, cursor:'pointer', transition:'all 0.15s' }}>{s}</button>
          );})}
        </div>
      </div>
      <div style={{ marginBottom:24 }}>
        <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:muted, marginBottom:12 }}>Max Price</p>
        <input type="range" min={priceRange[0]} max={priceRange[1]} step={100} value={maxPrice}
          onChange={e=>onChange({...filters,maxPrice:Number(e.target.value)})}
          style={{ width:'100%', accentColor:gold, cursor:'pointer' }}/>
        <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:muted, marginTop:6 }}>
          <span><PriceDisplay amount={priceRange[0]} currency="INR" /></span>
          <span style={{ color:gold, fontWeight:600 }}><PriceDisplay amount={maxPrice} currency="INR" /></span>
        </div>
      </div>
      <div>
        <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:muted, marginBottom:12 }}>Airlines</p>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {airlines.map(name => { const chk=selectedAirlines.includes(name); return (
            <label key={name} style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={()=>toggleAirline(name)}>
              <div style={{ width:16, height:16, borderRadius:4, flexShrink:0, background:chk?gold:'transparent', border:`2px solid ${chk?gold:muted}`, display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.15s' }}>
                {chk && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="#0A0F1A" strokeWidth="2" strokeLinecap="round"/></svg>}
              </div>
              <span style={{ fontSize:12, fontWeight:chk?600:400, color:chk?text:muted, textTransform:'uppercase', letterSpacing:'0.06em', userSelect:'none' }}>{name}</span>
            </label>
          );})}
        </div>
      </div>
    </aside>
  );
}
