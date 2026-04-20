import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../shared/Logo';
import { FlightsMegaMenu, BookingMegaMenu } from './MegaMenu';

const NAV_ITEMS = [
  { label:'FLIGHTS',     path:'/flights',    menu:'flights' },
  { label:'BOOKING HUB', path:'/booking',    menu:'booking' },
  { label:'SKYMILES',    path:'/loyalty',    menu:null },
  { label:'PRIVILEGES',  path:'/privileges', menu:null },
];

export default function Navbar({ darkMode, toggleDark, user }) {
  const location = useLocation();
  const [open, setOpen] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', h, { passive:true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => { setOpen(null); }, [location.pathname]);

  const enter = k => { clearTimeout(timer.current); setOpen(k); };
  const leave = () => { timer.current = setTimeout(() => setOpen(null), 120); };

  const navBg = darkMode
    ? scrolled ? 'rgba(10,15,26,0.97)' : 'rgba(10,15,26,0.85)'
    : scrolled ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.92)';
  const border = darkMode ? 'rgba(200,168,75,0.12)' : 'rgba(0,0,0,0.07)';
  const linkClr = darkMode ? 'rgba(200,168,75,0.9)' : '#374151';

  return (
    <>
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:100,
        background:navBg, borderBottom:`1px solid ${border}`,
        backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
        boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.25)' : 'none',
        transition:'background 0.3s, box-shadow 0.3s' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 32px',
          height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>

          <Link to="/" style={{ textDecoration:'none' }}><Logo size="md" light={darkMode}/></Link>

          <div style={{ display:'flex', alignItems:'center',
            background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
            border:`1px solid ${border}`, borderRadius:50, padding:'4px 6px', gap:2 }}>
            {NAV_ITEMS.map(({ label, path, menu }) => {
              const active = location.pathname.startsWith(path);
              const isOpen = open === menu && menu !== null;
              return (
                <div key={label} style={{ position:'relative' }}
                  onMouseEnter={() => menu ? enter(menu) : null}
                  onMouseLeave={() => menu ? leave() : null}>
                  <Link 
                    to={path} 
                    target={menu === null && path !== '/' ? "_blank" : undefined}
                    rel={menu === null && path !== '/' ? "noopener noreferrer" : undefined}
                    style={{ display:'inline-flex', alignItems:'center', gap:5,
                    padding:'8px 18px', borderRadius:50, fontSize:11, fontWeight:600,
                    letterSpacing:'0.14em', textDecoration:'none',
                    color: active || isOpen ? '#C8A84B' : linkClr,
                    background: active || isOpen ? 'rgba(200,168,75,0.1)' : 'transparent',
                    transition:'all 0.15s' }}>
                    {label}
                    {menu && (
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"
                        style={{ opacity:0.6, transform: isOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }}>
                        <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <span style={{ fontSize:10, letterSpacing:'0.2em', fontWeight:600, textTransform:'uppercase',
              color: darkMode ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)' }}>
              {darkMode ? 'Cosmic' : 'Radiant'}
            </span>
            <button onClick={toggleDark} style={{ width:44, height:24, borderRadius:12,
              background:'#C8A84B', border:'none', cursor:'pointer',
              display:'flex', alignItems:'center', padding:'0 3px' }}>
              <span style={{ width:18, height:18, borderRadius:'50%', background:'#fff',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:10,
                transform: darkMode ? 'translateX(20px)' : 'translateX(0)',
                transition:'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}>
                {darkMode ? '🌙' : '☀️'}
              </span>
            </button>
            {user?.role === 'admin' && (
              <Link to="/admin" target="_blank" rel="noopener noreferrer" style={{ fontSize:10, fontWeight:700, letterSpacing:'0.15em',
                padding:'6px 14px', borderRadius:20, border:'1px solid rgba(200,168,75,0.4)',
                color:'#C8A84B', textDecoration:'none' }}>ADMIN</Link>
            )}
            <Link to="/login" target="_blank" rel="noopener noreferrer" style={{ background:'#C8A84B', color:'#0A0F1A', fontSize:12,
              fontWeight:800, letterSpacing:'0.1em', padding:'10px 22px', borderRadius:8,
              textDecoration:'none' }}>SIGN IN</Link>
          </div>
        </div>
      </nav>

      {open && (
        <div style={{ position:'fixed', top:64, left:0, right:0, zIndex:99,
          animation:'megaFadeIn 0.18s ease forwards',
          boxShadow:'0 8px 40px rgba(0,0,0,0.25)' }}
          onMouseEnter={() => clearTimeout(timer.current)}
          onMouseLeave={leave}>
          {open === 'flights' && <FlightsMegaMenu dark={darkMode} closeMenu={() => setOpen(null)}/>}
          {open === 'booking' && <BookingMegaMenu dark={darkMode} closeMenu={() => setOpen(null)}/>}
        </div>
      )}
      <style>{`@keyframes megaFadeIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </>
  );
}
