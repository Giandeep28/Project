import React from 'react';
import { Crown, Zap, Coffee, Car, ShieldCheck, Gem } from 'lucide-react';

export default function Privileges({ darkMode }) {
  const sections = [
    {
      title: 'Ground Excellence',
      icon: <Car className="w-8 h-8 text-primary" />,
      items: [
        { label: 'Chauffeur Service', desc: 'Complimentary luxury car transfers to and from the airport.' },
        { label: 'Lounge Access', desc: 'Unlimited access to Celestial Hubs and partner lounges globally.' },
        { label: 'Priority Check-in', desc: 'Exclusive suites for seamless baggage drop and security clearance.' }
      ]
    },
    {
      title: 'On-Board Luxury',
      icon: <Crown className="w-8 h-8 text-primary" />,
      items: [
        { label: 'Dine on Demand', desc: 'Multi-course gourmet meals served whenever you desire.' },
        { label: 'Amenity Kits', desc: 'Designer fragrances and skincare essentials for long-haul comfort.' },
        { label: 'Celestial Suites', desc: 'Fully-flat beds with zero-gravity seating technology.' }
      ]
    }
  ];

  return (
    <div className={`min-h-screen pt-24 pb-12 ${darkMode ? 'bg-[var(--app-bg)] text-[var(--app-text)]' : 'bg-white text-slate-900'}`}>
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <Gem className="w-12 h-12 text-primary mx-auto mb-6 animate-bounce" />
          <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter mb-6">Celestial Privileges</h1>
          <p className="text-xl text-slate-500 font-medium">Elevate your standards. Every journey with SkyVoyage is curated to provide unparalleled exclusivity and comfort.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {sections.map((sec, idx) => (
            <div key={idx} className="bg-white/5 border border-[var(--border-color)] p-10 rounded-[3rem] relative overflow-hidden backdrop-blur-3xl group">
               <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                  {sec.icon}
               </div>
               <div className="flex items-center gap-4 mb-10">
                  {sec.icon}
                  <h2 className="text-2xl font-black uppercase tracking-widest">{sec.title}</h2>
               </div>
               <div className="space-y-8">
                  {sec.items.map((item, iIdx) => (
                    <div key={iIdx} className="flex gap-6 group/item">
                       <div className="w-1 h-12 bg-primary/20 rounded-full group-hover/item:bg-primary transition-colors"></div>
                       <div>
                          <h3 className="text-lg font-bold mb-2 uppercase tracking-tight">{item.label}</h3>
                          <p className="text-sm text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          ))}
        </div>

        <div className="bg-primary p-12 lg:p-20 rounded-[4rem] flex flex-col lg:flex-row items-center justify-between text-dark group hover:bg-white transition-all duration-700 cursor-pointer shadow-[0_40px_100px_rgba(200,168,75,0.3)]">
           <div className="max-w-2xl text-center lg:text-left mb-12 lg:mb-0">
              <span className="text-[10px] font-black uppercase tracking-[5px] block mb-6 opacity-60">Membership Benefit</span>
              <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter mb-6">Upgrade to Platinum for Ultimate Flexibility</h2>
              <p className="text-lg font-bold opacity-70">Unlock free ticket re-scheduling, unlimited companion vouchers, and dedicated concierge support.</p>
           </div>
           <div className="w-24 h-24 rounded-full border-2 border-dark flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-10 h-10" />
           </div>
        </div>
      </div>
    </div>
  );
}
