import React, { useState } from 'react';
import { Globe, Plane, MapPin, ArrowRight, Star } from 'lucide-react';

export default function InternationalRoutes({ darkMode }) {
  const [selectedRegion, setSelectedRegion] = useState('Europe');

  const regions = ['Europe', 'Asia', 'Americas', 'Middle East'];
  
  const routes = {
    'Europe': [
      { dest: 'London (LHR)', duration: '7h 15m', classes: 'First, Premium, Economy' },
      { dest: 'Paris (CDG)', duration: '7h 45m', classes: 'Celestial Business, Economy' },
      { dest: 'Frankfurt (FRA)', duration: '8h 20m', classes: 'First, Economy' }
    ],
    'Asia': [
      { dest: 'Tokyo (HND)', duration: '14h 30m', classes: 'First, Celestial Business, Economy' },
      { dest: 'Singapore (SIN)', duration: '16h 00m', classes: 'Celestial Business, Premium' }
    ],
    'Americas': [
      { dest: 'New York (JFK)', duration: 'Direct', classes: 'First, Celestial Business, Premium, Economy' },
      { dest: 'Los Angeles (LAX)', duration: '6h 15m', classes: 'First, Economy' }
    ],
    'Middle East': [
      { dest: 'Dubai (DXB)', duration: '12h 40m', classes: 'First, Celestial Business' }
    ]
  };

  return (
    <div className={`min-h-screen pt-24 pb-12 ${darkMode ? 'bg-[var(--app-bg)] text-[var(--app-text)]' : 'bg-white text-slate-900'}`}>
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 border-b border-[var(--border-color)] pb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-6">
            <Globe className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">International Routes</h1>
          <p className="text-xl text-slate-500 max-w-2xl font-medium">Explore our expansive global network offering unparalleled luxury and convenience across 150+ premier destinations.</p>
        </div>

        {/* Region Selector */}
        <div className="flex flex-wrap gap-4 mb-12">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                selectedRegion === region
                  ? 'bg-primary text-dark shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-[var(--border-color)]'
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        {/* Route Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routes[selectedRegion]?.map((route, idx) => (
            <div key={idx} className="p-8 pb-10 border border-[var(--border-color)] rounded-2xl bg-white/5 hover:bg-white/10 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Plane className="w-24 h-24 transform rotate-45" />
              </div>
              <MapPin className="w-6 h-6 text-primary mb-6" />
              <h3 className="text-2xl font-bold mb-2">{route.dest}</h3>
              <div className="space-y-3 mt-6">
                <div className="flex justify-between items-center text-sm font-medium border-b border-[var(--border-color)] pb-3">
                  <span className="text-slate-500 uppercase tracking-widest text-[10px]">Flight Time</span>
                  <span className="font-bold">{route.duration}</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium border-b border-[var(--border-color)] pb-3">
                  <span className="text-slate-500 uppercase tracking-widest text-[10px]">Cabins</span>
                  <span className="font-bold text-right max-w-[150px]">{route.classes}</span>
                </div>
              </div>
              <button className="mt-8 text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all w-full">
                Search Flights <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
