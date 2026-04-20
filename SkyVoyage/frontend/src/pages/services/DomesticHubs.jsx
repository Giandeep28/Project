import React from 'react';
import { Building2, Navigation, Coffee, ShieldCheck } from 'lucide-react';

export default function DomesticHubs({ darkMode }) {
  const hubs = [
    {
      city: 'Delhi (DEL)',
      terminal: 'Terminal 3 - SkyVoyage Exclusive',
      features: ['24/7 Celestial Lounge', 'Priority Security Lane', 'Private Check-in Suites'],
      connections: '150+ Domestic Flights Daily'
    },
    {
      city: 'Mumbai (BOM)',
      terminal: 'Terminal 2 - SkyVoyage Hub',
      features: ['Outdoor Terrace Lounge', 'Spa Services', 'Direct Tarmac Access'],
      connections: '120+ Domestic Flights Daily'
    },
    {
      city: 'Bangalore (BLR)',
      terminal: 'Terminal 2 (The Garden)',
      features: ['Business Center', 'Culinary Dining', 'Shower Suites'],
      connections: '90+ Domestic Flights Daily'
    }
  ];

  return (
    <div className={`min-h-screen pt-24 pb-12 ${darkMode ? 'bg-[var(--app-bg)] text-[var(--app-text)]' : 'bg-white text-slate-900'}`}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mb-16 border-b border-[var(--border-color)] pb-12">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-6">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Domestic Hubs</h1>
          <p className="text-xl text-slate-500 max-w-2xl font-medium">Experience seamless connections and unparalleled comfort across our strategically located primary hubs.</p>
        </div>

        <div className="space-y-8">
          {hubs.map((hub, idx) => (
            <div key={idx} className="flex flex-col lg:flex-row gap-8 p-8 border border-[var(--border-color)] rounded-2xl bg-white/5 hover:bg-white/10 transition-all items-center">
              <div className="lg:w-1/3 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-[var(--border-color)] pb-8 lg:pb-0 lg:pr-8">
                <Navigation className="w-12 h-12 text-primary mx-auto lg:mx-0 mb-4" />
                <h3 className="text-3xl font-black">{hub.city}</h3>
                <p className="text-sm text-primary font-bold uppercase tracking-widest mt-2">{hub.terminal}</p>
                <div className="mt-4 text-sm text-slate-400 font-medium">{hub.connections}</div>
              </div>
              <div className="lg:w-2/3 grid sm:grid-cols-2 gap-6 w-full">
                {hub.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-4 bg-black/20 p-4 rounded-xl">
                    {fIdx % 2 === 0 ? <Coffee className="w-5 h-5 text-primary" /> : <ShieldCheck className="w-5 h-5 text-primary" />}
                    <span className="font-bold text-sm tracking-wide">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
