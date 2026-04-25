import React from 'react';
import { Crown, Zap, Shield, Star, Gem, Compass, ChevronRight } from 'lucide-react';

export default function Privileges({ darkMode }) {
  const tiers = [
    {
      name: 'SkyVoyage Elite',
      icon: <Zap className="w-8 h-8" />,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      benefits: ['Priority Boarding', '10% More SkyMiles', 'Dedicated Check-in Line']
    },
    {
      name: 'Platinum Tier',
      icon: <Shield className="w-8 h-8" />,
      color: 'text-slate-300',
      bg: 'bg-slate-300/10',
      benefits: ['Lounge Access', '25% More SkyMiles', 'Extra Baggage Allowance', 'Upgrade Priority']
    },
    {
      name: 'Celestial Sovereign',
      icon: <Crown className="w-8 h-8" />,
      color: 'text-primary',
      bg: 'bg-primary/10',
      benefits: ['Private Jet Concierge', 'Unlimited First Class Upgrades', 'Chauffeur Drive Service', '50% More SkyMiles']
    }
  ];

  return (
    <div className={`min-h-screen pt-24 pb-12 ${darkMode ? 'bg-[var(--app-bg)] text-[var(--app-text)]' : 'bg-white text-slate-900'}`}>
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-3xl mb-8">
            <Gem className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tighter mb-6">Celestial Privileges</h1>
          <p className="text-xl text-slate-500 font-medium max-w-3xl mx-auto">Luxury isn’t a destination—it's how we treat you along the way. Discover a world of exclusivity tailored to the most discerning travelers.</p>
        </div>

        {/* Tier Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-32">
          {tiers.map((tier, idx) => (
            <div key={idx} className="p-10 border border-[var(--border-color)] rounded-[3rem] bg-white/5 hover:bg-white/10 transition-all flex flex-col h-full relative overflow-hidden group">
               <div className={`absolute top-0 right-0 w-32 h-32 ${tier.bg} blur-[80px] group-hover:scale-150 transition-all`}></div>
               <div className={`${tier.bg} ${tier.color} p-4 rounded-2xl w-fit mb-8 relative z-10`}>
                 {tier.icon}
               </div>
               <h3 className="text-3xl font-black uppercase mb-8 relative z-10">{tier.name}</h3>
               <ul className="space-y-4 mb-12 flex-1 relative z-10">
                 {tier.benefits.map((b, i) => (
                   <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-400">
                     <Star className="w-4 h-4 text-primary" /> {b}
                   </li>
                 ))}
               </ul>
               <button className="w-full py-4 border border-[var(--border-color)] rounded-2xl text-[10px] font-black uppercase tracking-[3px] hover:border-primary hover:text-primary transition-all relative z-10">Explore {tier.name}</button>
            </div>
          ))}
        </div>

        {/* Concierge Section */}
        <div className="bg-primary/5 border border-primary/20 rounded-[4rem] p-12 lg:p-20 relative overflow-hidden">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div>
               <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-8 italic">The Celestial<br/>Concierge</h2>
               <p className="text-lg text-slate-400 font-medium mb-12 leading-relaxed">
                 From securing last-minute reservations at Michelin-starred restaurants to arranging private ground transport across the globe, our 24/7 concierge desk is your ultimate travel accomplice.
               </p>
               <div className="space-y-6">
                 {[
                   { t: 'Travel Planning', d: 'Bespoke itineraries curated by regional specialists.' },
                   { t: 'Priority Access', d: 'Skip-the-line privileges at museums and luxury venues.' },
                   { t: 'Global Assistance', d: 'Personalized care in over 150 destinations.' }
                 ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                       <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                       <div>
                         <h4 className="font-black text-sm uppercase tracking-widest">{item.t}</h4>
                         <p className="text-xs text-slate-500 mt-1">{item.d}</p>
                       </div>
                    </div>
                 ))}
               </div>
             </div>
             <div className="relative">
                <div className="aspect-square bg-black/40 rounded-3xl border border-white/5 flex items-center justify-center overflow-hidden">
                  <Compass className="w-32 h-32 text-primary opacity-20 animate-[spin_10s_linear_infinite]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-10">
                    <p className="text-2xl font-black uppercase">Every detail,<br/>perfectly aligned.</p>
                    <button className="mt-6 flex items-center gap-3 text-primary text-[10px] font-black uppercase tracking-[3px]">Contact Concierge <ChevronRight className="w-4 h-4"/></button>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
