import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search } from 'lucide-react';

export default function Autocomplete({ placeholder, value, onChange, label }) {
  const [query, setQuery] = useState(value || '');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Mock data for airports - in a real app, fetch from Java backend
  const AIRPORTS = [
    { code: 'DEL', city: 'Delhi', name: 'Indira Gandhi Intl', country: 'India' },
    { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Intl', country: 'India' },
    { code: 'BLR', city: 'Bangalore', name: 'Kempegowda Intl', country: 'India' },
    { code: 'ATQ', city: 'Amritsar', name: 'Sri Guru Ram Dass Jee', country: 'India' },
    { code: 'AMD', city: 'Ahmedabad', name: 'Sardar Vallabhbhai Patel', country: 'India' },
    { code: 'DXB', city: 'Dubai', name: 'Dubai Intl', country: 'UAE' },
    { code: 'LHR', city: 'London', name: 'Heathrow Airport', country: 'UK' },
    { code: 'SIN', city: 'Singapore', name: 'Changi Airport', country: 'Singapore' },
  ];

  useEffect(() => {
    if (query.length > 1) {
      const filtered = AIRPORTS.filter(a => 
        a.city.toLowerCase().includes(query.toLowerCase()) || 
        a.code.toLowerCase().includes(query.toLowerCase()) ||
        a.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef]);

  const handleSelect = (airport) => {
    const formatted = `${airport.city} (${airport.code})`;
    setQuery(formatted);
    onChange(airport.code);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-2">{label}</label>
      <div className="relative group">
        <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-primary/40 group-focus-within:text-primary transition-colors" size={18} />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 1 && setIsOpen(true)}
          className="w-full bg-white/5 border border-white/10 p-5 pl-14 rounded-2xl font-bold outline-none focus:border-primary transition-all text-[var(--text-primary)]"
        />
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-[105%] left-0 right-0 bg-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[2000] animate-in fade-in slide-in-from-top-2 duration-200">
          {results.map((airport) => (
            <div
              key={airport.code}
              onClick={() => handleSelect(airport)}
              className="p-4 px-6 hover:bg-primary/10 cursor-pointer border-b border-white/5 last:border-none flex justify-between items-center group"
            >
              <div>
                <p className="font-bold text-sm text-[var(--text-primary)]">{airport.city}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{airport.name}</p>
              </div>
              <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-lg group-hover:bg-primary group-hover:text-dark transition-all">{airport.code}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
