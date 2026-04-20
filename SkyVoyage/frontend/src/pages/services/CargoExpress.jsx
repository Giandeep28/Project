import React, { useState } from 'react';
import { Package, Search, ThermometerSnowflake, ShieldAlert, Truck } from 'lucide-react';

export default function CargoExpress({ darkMode }) {
  const [awb, setAwb] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);

  const handleTrack = (e) => {
    e.preventDefault();
    if(awb.length > 5) {
      setTrackingResult({
        status: 'In Transit',
        location: 'SkyVoyage Logistics Hub, LHR',
        eta: 'Oct 24, 2026 - 14:00 GMT'
      });
    }
  };

  const services = [
    { title: 'Temperature Controlled', icon: <ThermometerSnowflake className="w-8 h-8 text-blue-400"/>, desc: 'Specialized containers for perishables and pharmaceuticals.' },
    { title: 'Secure Valuables', icon: <ShieldAlert className="w-8 h-8 text-yellow-500"/>, desc: 'Armored transit and dedicated security handling for high-value goods.' },
    { title: 'Heavy & Outsized', icon: <Truck className="w-8 h-8 text-primary"/>, desc: 'Tailored solutions for industrial equipment and large-scale cargo.' }
  ];

  return (
    <div className={`min-h-screen pt-24 pb-12 ${darkMode ? 'bg-[var(--app-bg)] text-[var(--app-text)]' : 'bg-white text-slate-900'}`}>
      <div className="container mx-auto px-6 lg:px-12 mb-24">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <Package className="w-12 h-12 text-primary mx-auto mb-6" />
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-6">Cargo Express</h1>
          <p className="text-xl text-slate-500 font-medium">Global freight solutions delivered with precision, speed, and uncompromising reliability.</p>
        </div>

        {/* Tracking Widget */}
        <div className="max-w-2xl mx-auto mb-24">
          <div className="bg-white/5 border border-[var(--border-color)] p-8 rounded-3xl backdrop-blur-md">
            <h2 className="text-lg font-black uppercase tracking-widest mb-6 text-center">Track Shipment</h2>
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 mb-6">
              <input 
                type="text" 
                value={awb}
                onChange={(e) => setAwb(e.target.value)}
                placeholder="Enter 11-digit AWB Number" 
                className="flex-1 bg-black/40 border border-[var(--border-color)] rounded-xl px-6 py-4 font-bold outline-none focus:border-primary text-center sm:text-left"
                required
              />
              <button type="submit" className="bg-primary text-dark font-black px-8 py-4 rounded-xl uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2">
                <Search className="w-4 h-4" /> Track
              </button>
            </form>

            {trackingResult && (
              <div className="mt-8 p-6 bg-primary/10 border border-primary/30 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[50px] rounded-full mix-blend-screen"></div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</span>
                    <span className="font-black text-white">{trackingResult.status}</span>
                  </div>
                  <div className="border-l border-r border-primary/20">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Location</span>
                    <span className="font-black text-white">{trackingResult.location}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Est. Delivery</span>
                    <span className="font-black text-primary">{trackingResult.eta}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((svc, idx) => (
            <div key={idx} className="p-8 border border-[var(--border-color)] bg-white/5 rounded-2xl hover:border-primary/50 transition-all text-center">
              <div className="inline-flex p-4 bg-black/40 rounded-2xl mb-6 shadow-inner">{svc.icon}</div>
              <h3 className="text-lg font-black uppercase tracking-wider mb-4">{svc.title}</h3>
              <p className="text-sm font-medium text-slate-400 leading-relaxed">{svc.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
