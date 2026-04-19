import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ApiClient     from '../ApiClient';
import FilterSidebar from '../components/flights/FilterSidebar';
import FlightCard    from '../components/flights/FlightCard';

const SORT = [
  { key:'cheapest', label:'Cheapest',   stat: fs => `₹${Math.min(...fs.map(f=>f.price)).toLocaleString()}`, fn:(a,b)=>a.price-b.price },
  { key:'fastest',  label:'Fastest',    stat: fs => fs.reduce((a,b)=>parseInt(a.duration)<parseInt(b.duration)?a:b).duration, fn:(a,b)=>parseInt(a.duration)-parseInt(b.duration) },
  { key:'best',     label:'Best Score', stat: fs => `${fs.reduce((a,b)=>parseFloat(a.score)>parseFloat(b.score)?a:b).score}/10`, fn:(a,b)=>parseFloat(b.score)-parseFloat(a.score) },
];

function Skeleton({ darkMode }) {
  const bg = darkMode ? '#1C2333' : '#fff';
  const sh = darkMode ? 'rgba(255,255,255,0.06)' : '#f3f4f6';
  return (
    <div style={{ background:bg, border:`1px solid ${sh}`, borderRadius:14, padding:20 }}>
      {[100,60,80].map((w,i)=>(
        <div key={i} style={{ height:i===0?24:14, width:`${w}%`, background:sh, borderRadius:6, marginBottom:12, animation:'pulse 1.5s ease-in-out infinite', opacity:0.6 }}/>
      ))}
      <style>{`@keyframes pulse{0%,100%{opacity:0.6}50%{opacity:0.3}}`}</style>
    </div>
  );
}

export default function SearchResults({ darkMode }) {
  const [params]   = useSearchParams();
  const origin     = params.get('origin') || '';
  const dest       = params.get('dest')   || '';
  const date       = params.get('date')   || '';
  const guests     = params.get('guests') || '1';
  const mode       = params.get('mode')   || 'charter';

  const [flights, setFlights]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [sortKey, setSortKey]     = useState('cheapest');
  const [selectedId, setSelectedId] = useState(null);

  const airlines   = useMemo(() => [...new Set(flights.map(f=>f.airline))].sort(), [flights]);
  const priceRange = useMemo(() => flights.length ? [Math.min(...flights.map(f=>f.price)), Math.max(...flights.map(f=>f.price))] : [3000,50000], [flights]);

  const [filters, setFilters] = useState({ stops:[], maxPrice:50000, selectedAirlines:[], priceRange:[3000,50000] });

  useEffect(() => {
    if (flights.length) setFilters(f => ({ ...f, maxPrice:priceRange[1], selectedAirlines:airlines, priceRange }));
  }, [flights.length]);

  useEffect(() => {
    if (!origin || !dest) { setLoading(false); return; }
    setLoading(true);
    ApiClient.searchFlights({ origin, dest, date, guests, mode })
      .then(d => setFlights(Array.isArray(d)?d:[]))
      .catch(() => setFlights([]))
      .finally(() => setLoading(false));
  }, [origin, dest, date, guests, mode]);

  const shown = useMemo(() => {
    let list = flights.filter(f => {
      if (filters.stops.length>0) {
        const ok = filters.stops.some(s => s==='Non-stop'?f.stops===0:s==='1 Stop'?f.stops===1:f.stops>=2);
        if (!ok) return false;
      }
      if (f.price > filters.maxPrice) return false;
      if (filters.selectedAirlines.length && !filters.selectedAirlines.includes(f.airline)) return false;
      return true;
    });
    const s = SORT.find(s=>s.key===sortKey);
    return s ? [...list].sort(s.fn) : list;
  }, [flights, filters, sortKey]);

  const pageBg = darkMode ? '#0A0F1A' : '#f1f3f5';
  const text   = darkMode ? '#f0ece4' : '#111827';
  const muted  = darkMode ? 'rgba(255,255,255,0.4)' : '#6b7280';
  const tabBg  = darkMode ? '#1C2333' : '#fff';
  const tabBdr = darkMode ? 'rgba(255,255,255,0.06)' : '#e5e7eb';

  return (
    <div style={{ background:pageBg, minHeight:'100vh', paddingTop:80 }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'32px 24px' }}>
        <div style={{ marginBottom:28 }}>
          <h1 style={{ fontFamily:'"Playfair Display",serif', fontSize:32, fontWeight:900, textTransform:'uppercase', letterSpacing:'0.04em', color:text, marginBottom:6 }}>
            {origin && dest ? `${origin} → ${dest}` : 'Select Departure Flight'}
          </h1>
          <p style={{ fontSize:14, color:muted }}>{loading ? 'Searching live routes…' : `${shown.length} flight${shown.length!==1?'s':''} available${date?` for ${date}`:''}`}</p>
        </div>
        <div style={{ display:'flex', gap:20, alignItems:'flex-start' }}>
          <FilterSidebar filters={filters} onChange={setFilters} airlines={airlines} darkMode={darkMode}/>
          <div style={{ flex:1, minWidth:0 }}>
            {/* Sort tabs */}
            <div style={{ background:tabBg, border:`1px solid ${tabBdr}`, borderRadius:12, overflow:'hidden', marginBottom:16, display:'grid', gridTemplateColumns:'1fr 1fr 1fr' }}>
              {SORT.map(({ key, label, stat }) => {
                const active = sortKey === key;
                const val = flights.length ? stat(flights) : '—';
                return (
                  <button key={key} onClick={()=>setSortKey(key)} style={{ padding:'16px 20px', border:'none', cursor:'pointer', background:'transparent', borderBottom:`3px solid ${active?'#3B3DBF':'transparent'}`, borderRight:`1px solid ${tabBdr}`, transition:'all 0.15s' }}>
                    <p style={{ fontSize:10, fontWeight:700, letterSpacing:'0.16em', textTransform:'uppercase', color:active?'#3B3DBF':muted, marginBottom:4 }}>{label}</p>
                    <p style={{ fontSize:15, fontWeight:800, color:active?'#3B3DBF':text }}>{val}</p>
                  </button>
                );
              })}
            </div>
            {/* Cards */}
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {loading ? Array.from({length:4},(_,i)=><Skeleton key={i} darkMode={darkMode}/>)
               : shown.length===0
                 ? <div style={{ textAlign:'center', padding:'60px 20px', background:tabBg, borderRadius:14, border:`1px solid ${tabBdr}` }}>
                     <p style={{ fontSize:32 }}>✈️</p>
                     <p style={{ fontSize:16, fontWeight:600, color:text, marginTop:12 }}>No flights found</p>
                     <p style={{ fontSize:13, color:muted, marginTop:6 }}>Try adjusting your filters.</p>
                   </div>
                 : shown.map(f => (
                   <div key={f.id} onClick={()=>setSelectedId(f.id)}>
                     <FlightCard flight={f} darkMode={darkMode} isSelected={selectedId===f.id}/>
                   </div>
                 ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
