import React, { useState, useRef, useEffect } from 'react';

// Country to Emoji Map (Basic list)
const FLAG_MAP = {
  "India": "🇮🇳", "UAE": "🇦🇪", "United Kingdom": "🇬🇧", "Singapore": "🇸🇬",
  "USA": "🇺🇸", "Japan": "🇯🇵", "France": "🇫🇷", "Netherlands": "🇳🇱",
  "Qatar": "🇶🇦", "Thailand": "🇹🇭", "Australia": "🇦🇺", "China HK": "🇭🇰",
  "Malaysia": "🇲🇾", "Greece": "🇬🇷", "Germany": "🇩🇪", "China": "🇨🇳",
  "Canada": "🇨🇦", "Italy": "🇮🇹", "Spain": "🇪🇸", "Switzerland": "🇨🇭"
};

const getFlag = (country) => FLAG_MAP[country] || "🌍";

export default function AirportSearch({ label, placeholder, value, onChange, onQueryChange, darkMode }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const ref = useRef(null);
  const delay = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const type = (e) => {
    const q = e.target.value;
    setQuery(q);
    setHighlightedIndex(-1);
    if (onQueryChange) onQueryChange(q);
    clearTimeout(delay.current);
    
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    delay.current = setTimeout(async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/airports/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setOpen(data.length > 0);
        }
      } catch (err) {
        console.error("Failed to fetch airports", err);
      } finally {
        setLoading(false);
      }
    }, 300);
  };

  const pick = (item) => {
    setQuery("");
    if (onQueryChange) onQueryChange("");
    onChange(item);
    setResults([]);
    setOpen(false);
  };

  const clear = (e) => {
    e.stopPropagation();
    onChange(null);
    setQuery("");
    if (onQueryChange) onQueryChange("");
    setTimeout(() => {
      const input = ref.current?.querySelector('input');
      if (input) input.focus();
    }, 10);
  };

  const handleKeyDown = (e) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < results.length) {
        pick(results[highlightedIndex]);
      } else if (results.length > 0) {
        pick(results[0]);
      }
    }
  };

  const bg = darkMode ? "#1C2333" : "#fff";
  const border = darkMode ? "rgba(255,255,255,0.1)" : "#d1d5db";
  const text = darkMode ? "#f0ece4" : "#111827";
  const hover = darkMode ? "rgba(200,168,75,0.1)" : "#f5f3ff";

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <p style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#C8A84B", marginBottom: 6, opacity: 0.8 }}>
        {label}
      </p>
      
      {value ? (
        <div style={{
          width: "100%", backgroundColor: bg, border: `1px solid ${border}`, borderRadius: 10,
          padding: "11px 14px", display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer'
        }} onClick={clear}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden' }}>
            <span style={{ fontSize: 16 }}>✈️</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              [{value.code || value.iata}] — {value.city}, {value.country}
            </span>
          </div>
          <button style={{ 
            background: 'transparent', border: 'none', color: '#ef4444', 
            fontSize: 18, cursor: 'pointer', padding: '0 4px', display: 'flex', alignItems: 'center' 
          }}>
            &times;
          </button>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          <input
            value={query}
            onChange={type}
            onKeyDown={handleKeyDown}
            onFocus={(e) => { e.target.style.borderColor = "#C8A84B"; if(results.length > 0) setOpen(true); }}
            onBlur={(e) => { e.target.style.borderColor = border; }}
            placeholder={placeholder}
            autoComplete="off"
            style={{
              width: "100%", backgroundColor: bg, border: `1px solid ${border}`, borderRadius: 10,
              padding: "11px 14px", fontSize: 14, fontWeight: 500, color: text,
              outline: "none", transition: "border-color 0.2s", boxSizing: "border-box",
            }}
          />
          {loading && (
            <div style={{ position: 'absolute', right: 12, top: 12, fontSize: 12, opacity: 0.5 }}>...</div>
          )}
        </div>
      )}

      {open && results.length > 0 && !value && (
        <ul style={{
          position: "absolute", zIndex: 200, top: "100%", marginTop: 4, width: "100%",
          background: darkMode ? "#111827" : "#fff", border: `1px solid ${darkMode ? "rgba(255,255,255,0.1)" : "#e5e7eb"}`,
          borderRadius: 10, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          listStyle: "none", padding: 0, margin: 0, maxHeight: 300, overflowY: 'auto'
        }}>
          {results.map((item, idx) => {
            const isHighlighted = highlightedIndex === idx;
            return (
              <li
                key={item.code || item.iata}
                onMouseDown={(e) => { e.preventDefault(); pick(item); }}
                onMouseEnter={() => setHighlightedIndex(idx)}
                style={{
                  padding: "12px 14px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 4,
                  background: isHighlighted ? hover : "transparent", transition: "background 0.1s", borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.05)" : "#f3f4f6"}`
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: text, display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 16 }}>{getFlag(item.country)}</span>
                    [{item.code || item.iata}] — {item.city}, {item.country}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: darkMode ? 'rgba(255,255,255,0.4)' : '#6b7280', paddingLeft: 26 }}>
                  {item.name}
                </span>
                
                {item.airlines && item.airlines.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, paddingLeft: 26, marginTop: 4 }}>
                    {item.airlines.slice(0, 4).map((air, i) => (
                      <span key={i} style={{ fontSize: 8, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#C8A84B', background: 'rgba(200,168,75,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                        {air}
                      </span>
                    ))}
                    {item.airlines.length > 4 && (
                      <span style={{ fontSize: 8, fontWeight: 800, color: darkMode ? 'rgba(255,255,255,0.3)' : '#94a3b8' }}>
                        +{item.airlines.length - 4} More
                      </span>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
