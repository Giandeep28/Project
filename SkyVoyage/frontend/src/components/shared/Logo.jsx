import React from 'react';

export default function Logo({ size = 'md', light = false }) {
  const sizes = { sm:{box:28,font:13,gap:8}, md:{box:36,font:16,gap:10}, lg:{box:48,font:22,gap:14} };
  const { box, font, gap } = sizes[size] || sizes.md;
  const gold = '#C8A84B';
  const dark = '#0A0F1A';

  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap, userSelect:'none' }}>
      <svg width={box} height={box} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="40" height="40" rx="10" fill={gold}/>
        <rect x="8" y="25" width="24" height="3" rx="1" fill={dark} opacity="0.9"/>
        <path d="M8 24 L11 14 L17 20 L20 10 L23 20 L29 14 L32 24 Z" fill={dark}/>
        <circle cx="14" cy="26.5" r="1.2" fill={gold}/>
        <circle cx="20" cy="26.5" r="1.2" fill={gold}/>
        <circle cx="26" cy="26.5" r="1.2" fill={gold}/>
      </svg>
      <span style={{
        fontFamily:'"Playfair Display",Georgia,serif', fontWeight:700,
        fontStyle:'italic', fontSize:font, letterSpacing:'0.04em',
        color: light ? '#fff' : gold, lineHeight:1,
      }}>
        Sky<span style={{ color: light ? 'rgba(255,255,255,0.85)' : dark, fontStyle:'normal', fontWeight:800 }}>VOYAGE</span>
      </span>
    </span>
  );
}
