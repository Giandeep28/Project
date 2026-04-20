import React, { useState } from 'react';
import { Crown, Users, Gauge, Calendar, PlaneTakeoff, CheckCircle2 } from 'lucide-react';

export default function CharterBooking({ darkMode }) {
  const [submitted, setSubmitted] = useState(false);

  const fleet = [
    { name: 'Gulfstream G700', capacity: '19 Guests', range: '7,500 nm', speed: 'Mach 0.925' },
    { name: 'Bombardier Global 7500', capacity: '14 Guests', range: '7,700 nm', speed: 'Mach 0.925' },
    { name: 'Embraer Praetor 600', capacity: '9 Guests', range: '4,018 nm', speed: 'Mach 0.83' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className={`min-h-screen pt-24 pb-12 ${darkMode ? 'bg-[var(--app-bg)] text-[var(--app-text)]' : 'bg-white text-slate-900'}`}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Crown className="w-12 h-12 text-primary mx-auto mb-6" />
          <h1 className="text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-6">Private Charter</h1>
          <p className="text-xl text-slate-500 font-medium">Elevate your journey with our exclusive private aviation services. Experience total privacy, bespoke catering, and seamless boarding.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 mb-24">
          <div className="space-y-8">
            <h2 className="text-2xl font-black uppercase tracking-widest text-primary border-b border-[var(--border-color)] pb-4">Our Elite Fleet</h2>
            {fleet.map((jet, idx) => (
              <div key={idx} className="p-6 border border-[var(--border-color)] rounded-2xl bg-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 hover:border-primary transition-all">
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold mb-2">{jet.name}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-400 font-medium justify-center sm:justify-start">
                    <span className="flex items-center gap-1"><Users className="w-4 h-4"/> {jet.capacity}</span>
                    <span className="flex items-center gap-1"><Gauge className="w-4 h-4"/> {jet.speed}</span>
                  </div>
                </div>
                <div className="text-center">
                  <span className="block text-xs uppercase tracking-widest text-slate-500 mb-1">Max Range</span>
                  <span className="text-lg font-bold text-primary">{jet.range}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 border border-[var(--border-color)] rounded-3xl p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-8">Request a Quote</h2>
            
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Request Received</h3>
                <p className="text-slate-400">Our Private Aviation Concierge will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Departure</label>
                    <div className="flex items-center bg-black/40 rounded-xl px-4 py-3 border border-[var(--border-color)]">
                      <PlaneTakeoff className="w-4 h-4 text-primary mr-3" />
                      <input required type="text" placeholder="City or Airport" className="bg-transparent border-none outline-none w-full text-sm font-bold" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Destination</label>
                    <div className="flex items-center bg-black/40 rounded-xl px-4 py-3 border border-[var(--border-color)]">
                      <PlaneTakeoff className="w-4 h-4 text-primary mr-3 transform rotate-90" />
                      <input required type="text" placeholder="City or Airport" className="bg-transparent border-none outline-none w-full text-sm font-bold" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Date</label>
                    <div className="flex items-center bg-black/40 rounded-xl px-4 py-3 border border-[var(--border-color)]">
                      <Calendar className="w-4 h-4 text-primary mr-3" />
                      <input required type="date" className="bg-transparent border-none outline-none w-full text-sm font-bold [color-scheme:dark]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Passengers</label>
                    <div className="flex items-center bg-black/40 rounded-xl px-4 py-3 border border-[var(--border-color)]">
                      <Users className="w-4 h-4 text-primary mr-3" />
                      <input required type="number" min="1" max="19" placeholder="1-19" className="bg-transparent border-none outline-none w-full text-sm font-bold" />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Contact Email</label>
                  <input required type="email" placeholder="vip@example.com" className="w-full bg-black/40 rounded-xl px-4 py-3 border border-[var(--border-color)] text-sm font-bold outline-none" />
                </div>

                <button type="submit" className="w-full bg-primary text-dark font-black text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-white transition-all mt-4">
                  Submit Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
