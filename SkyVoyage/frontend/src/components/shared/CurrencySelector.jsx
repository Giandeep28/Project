import React, { useState, useRef, useEffect } from 'react';
import useCurrency from '../../context/useCurrency';

const CURRENCIES = {
  Common: [
    { code: 'USD', flag: '🇺🇸', name: 'US Dollar' },
    { code: 'EUR', flag: '🇪🇺', name: 'Euro' },
    { code: 'GBP', flag: '🇬🇧', name: 'British Pound' },
    { code: 'INR', flag: '🇮🇳', name: 'Indian Rupee' },
  ],
  Asia: [
    { code: 'JPY', flag: '🇯🇵', name: 'Japanese Yen' },
    { code: 'CNY', flag: '🇨🇳', name: 'Chinese Yuan' },
    { code: 'SGD', flag: '🇸🇬', name: 'Singapore Dollar' },
    { code: 'MYR', flag: '🇲🇾', name: 'Malaysian Ringgit' },
    { code: 'THB', flag: '🇹🇭', name: 'Thai Baht' },
    { code: 'KRW', flag: '🇰🇷', name: 'South Korean Won' },
  ],
  Americas: [
    { code: 'CAD', flag: '🇨🇦', name: 'Canadian Dollar' },
    { code: 'AUD', flag: '🇦🇺', name: 'Australian Dollar' },
  ],
  MiddleEast: [
    { code: 'AED', flag: '🇦🇪', name: 'UAE Dirham' },
    { code: 'SAR', flag: '🇸🇦', name: 'Saudi Riyal' },
    { code: 'QAR', flag: '🇶🇦', name: 'Qatari Riyal' },
  ],
  Europe: [
    { code: 'CHF', flag: '🇨🇭', name: 'Swiss Franc' },
  ]
};

export default function CurrencySelector({ darkMode }) {
  const { selectedCurrency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Find active currency object
  let activeCur = { code: 'USD', flag: '🇺🇸', name: 'US Dollar' };
  for (const group of Object.values(CURRENCIES)) {
    const found = group.find(c => c.code === selectedCurrency);
    if (found) activeCur = found;
  }

  const textColor = darkMode ? 'rgba(255,255,255,0.8)' : '#374151';
  const hoverBg = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'transparent', border: '1px solid ' + (darkMode ? 'rgba(200,168,75,0.4)' : 'rgba(0,0,0,0.1)'),
          color: textColor, padding: '6px 12px', borderRadius: 20, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, letterSpacing: '0.05em',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = hoverBg}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <span>{activeCur.flag}</span>
        <span>{activeCur.code}</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute', top: 40, right: 0, zIndex: 1000,
          background: darkMode ? '#0A0F1A' : '#ffffff',
          border: '1px solid ' + (darkMode ? 'rgba(200,168,75,0.2)' : 'rgba(0,0,0,0.1)'),
          borderRadius: 12, padding: 12, width: 240, maxHeight: 400, overflowY: 'auto',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
        }}>
          {Object.entries(CURRENCIES).map(([group, curs]) => (
            <div key={group} style={{ marginBottom: 12 }}>
              <div style={{ 
                fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em',
                color: darkMode ? '#C8A84B' : '#9CA3AF', marginBottom: 6, paddingLeft: 8
              }}>{group}</div>
              {curs.map(cur => (
                <button
                  key={cur.code}
                  onClick={() => { setCurrency(cur.code); setIsOpen(false); }}
                  style={{
                    width: '100%', background: selectedCurrency === cur.code ? hoverBg : 'transparent',
                    border: 'none', color: textColor, padding: '8px', borderRadius: 6, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
                    fontSize: 13, transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => { if(selectedCurrency !== cur.code) e.currentTarget.style.background = hoverBg; }}
                  onMouseLeave={(e) => { if(selectedCurrency !== cur.code) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontSize: 16 }}>{cur.flag}</span>
                  <span style={{ fontWeight: selectedCurrency === cur.code ? 700 : 500 }}>
                    {cur.code} <span style={{ opacity: 0.6, fontWeight: 400, fontSize: 11 }}>— {cur.name}</span>
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
