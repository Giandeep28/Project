import React from 'react';
import { Link } from 'react-router-dom';

const Icon = ({ d, size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);

export function FlightsMegaMenu({ dark, closeMenu }) {
  const bg     = dark ? '#111827' : '#ffffff';
  const border = dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0';
  const text   = dark ? 'rgba(255,255,255,0.85)' : '#111827';
  const muted  = dark ? 'rgba(255,255,255,0.4)' : '#6b7280';
  const hover  = dark ? 'rgba(200,168,75,0.08)' : '#fafaf5';
  const gold   = '#C8A84B';
  const cardBg = dark ? '#1C2333' : '#f9f8f3';

  const col = (label, items) => (
    <div>
      <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:muted, marginBottom:18 }}>{label}</p>
      <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:4 }}>
        {items.map(({ icon, label: lbl, path }) => (
          <li key={lbl}>
            <Link to={path} onClick={closeMenu} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 10px',
              borderRadius:8, color:text, textDecoration:'none', fontSize:14, fontWeight:500, transition:'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = hover}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{ color:gold, display:'flex', flexShrink:0 }}><Icon d={icon}/></span>
              {lbl}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr 200px', gap:24,
      padding:'28px 40px 32px', background:bg, borderTop:`1px solid ${border}` }}>
      {col('Flight Services', [
        { icon:'M21 16V14L13 9V3.5A1.5 1.5 0 0012 2a1.5 1.5 0 00-1.5 1.5V9L3 14v2l8.5-2.5V19L10 20.5V22l2-.5 2 .5v-1.5L12.5 19v-5.5z', label:'One-Way Flights', path:'/flights?type=oneway' },
        { icon:'M23 4v6h-6M1 20v-6h6M3.5 9A9 9 0 0120.5 15M20.5 15A9 9 0 013.5 9', label:'Round-Trip Flights', path:'/flights?type=return' },
        { icon:'M9 18V6m0 0L5 10m4-4l4 4M15 6v12m0 0l4-4m-4 4l-4-4', label:'Multi-City Routes', path:'/flights?type=multi' },
        { icon:'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z', label:'Charter Special', path:'/flights?type=charter' },
      ])}
      {col('Domestic Routes', [
        { icon:'M3 21h18M9 8h6M9 12h6M9 16h6M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16', label:'Delhi to Mumbai', path:'/flights?origin=DEL&dest=BOM' },
        { icon:'M3 21h18M9 8h6M9 12h6M9 16h6M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16', label:'Bengaluru to Delhi', path:'/flights?origin=BLR&dest=DEL' },
        { icon:'M3 21h18M9 8h6M9 12h6M9 16h6M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16', label:'Mumbai to Goa', path:'/flights?origin=BOM&dest=GOI' },
        { icon:'M3 21h18M9 8h6M9 12h6M9 16h6M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16', label:'Chennai to Kolkata', path:'/flights?origin=MAA&dest=CCU' },
      ])}
      {col('International Hubs', [
        { icon:'M12 2a10 10 0 100 20A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20', label:'London Heathrow', path:'/flights?dest=LHR' },
        { icon:'M12 2a10 10 0 100 20A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20', label:'Dubai International', path:'/flights?dest=DXB' },
        { icon:'M12 2a10 10 0 100 20A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20', label:'Singapore Changi', path:'/flights?dest=SIN' },
        { icon:'M12 2a10 10 0 100 20A10 10 0 0012 2zM2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20', label:'New York JFK', path:'/flights?dest=JFK' },
      ])}
      <div style={{ background:cardBg, borderRadius:12, padding:'20px 18px', display:'flex', flexDirection:'column', gap:12 }}>
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:gold }}>SkyPriority</p>
        <p style={{ fontSize:13, color:muted, lineHeight:1.55 }}>Unlock premium lounge access and priority boarding with our loyalty tier.</p>
        <Link to="/loyalty" onClick={closeMenu} style={{ display:'inline-flex', alignItems:'center', justifyContent:'center',
          background:gold, color:'#0A0F1A', fontWeight:700, fontSize:11, letterSpacing:'0.14em',
          textTransform:'uppercase', padding:'11px 16px', borderRadius:8, textDecoration:'none' }}>
          Upgrade Now
        </Link>
      </div>
    </div>
  );
}

export function BookingMegaMenu({ dark, closeMenu }) {
  const bg    = dark ? '#111827' : '#ffffff';
  const border= dark ? 'rgba(255,255,255,0.06)' : '#f0f0f0';
  const text  = dark ? 'rgba(255,255,255,0.85)' : '#111827';
  const muted = dark ? 'rgba(255,255,255,0.4)' : '#6b7280';
  const hover = dark ? 'rgba(200,168,75,0.08)' : '#fafaf5';
  const gold  = '#C8A84B';

  const items = [
    { icon:'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z', label:'Manage Booking', path:'/booking/manage', desc:'View or modify existing reservations' },
    { icon:'M21 16V14L13 9V3.5A1.5 1.5 0 0012 2a1.5 1.5 0 00-1.5 1.5V9L3 14v2l8.5-2.5V19z', label:'Check In Online', path:'/booking/checkin', desc:'Start online check-in up to 48h before' },
    { icon:'M23 4v6h-6M1 20v-6h6M3.5 9A9 9 0 0120.5 15', label:'Reschedule Flight', path:'/booking/reschedule', desc:'Flexible date and time changes' },
    { icon:'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z', label:'Add Extras', path:'/booking/extras', desc:'Seat upgrades, baggage, lounge access' },
    { icon:'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6', label:'Currency Hub', path:'/currency-calculator', desc:'Universal converter & live market rates' },
  ];

  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8,
      padding:'28px 40px 32px', background:bg, borderTop:`1px solid ${border}` }}>
      {items.map(({ icon, label, path, desc }) => (
        <Link key={label} to={path} target="_blank" rel="noopener noreferrer" onClick={closeMenu} style={{ display:'flex', flexDirection:'column', gap:8,
          padding:'16px 14px', borderRadius:10, textDecoration:'none', transition:'background 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.background = hover}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
          <span style={{ color:gold }}><Icon d={icon} size={20}/></span>
          <span style={{ fontSize:13, fontWeight:600, color:text }}>{label}</span>
          <span style={{ fontSize:12, color:muted, lineHeight:1.5 }}>{desc}</span>
        </Link>
      ))}
    </div>
  );
}
