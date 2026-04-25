import React, { useState } from 'react';
import { Sparkles, Armchair, Coffee, ShieldCheck, Briefcase, Plus, Check, ShoppingBag, ArrowRight } from 'lucide-react';

export default function Extras({ darkMode }) {
  const [selected, setSelected] = useState([]);
  const [step, setStep] = useState(1);

  const catalog = [
    { id: 'lounge', name: 'Celestial Lounge Access', price: 2500, icon: <Sparkles />, desc: 'Exclusive access to our private hub lounges featuring gourmet dining and spa.' },
    { id: 'legroom', name: 'Extra Legroom Seat', price: 1200, icon: <Armchair />, desc: 'Enhanced comfort with up to 6 inches of additional stretch room.' },
    { id: 'dining', name: 'Chef Special Dining', price: 800, icon: <Coffee />, desc: 'A curated 3-course meal prepared by global culinary masters.' },
    { id: 'priority', name: 'SkyPriority Baggage', price: 600, icon: <Briefcase />, desc: 'Priority handling ensures your baggage is first on the carousel.' },
    { id: 'insurance', name: 'Elite Voyage Protection', price: 1500, icon: <ShieldCheck />, desc: 'Full coverage for flight disruptions and medical assistance.' },
  ];

  const toggle = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const total = selected.reduce((acc, curr) => acc + (catalog.find(x => x.id === curr)?.price || 0), 0);

  return (
    <div className={`min-h-screen pt-24 pb-12 ${darkMode ? 'bg-[var(--app-bg)] text-[var(--app-text)]' : 'bg-white text-slate-900'}`}>
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        {step === 1 ? (
          <div className="animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12 border-b border-[var(--border-color)] pb-12">
               <div>
                  <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Enhance Your Voyage</h1>
                  <p className="text-xl text-slate-500 font-medium max-w-2xl">Tailor your journey with our premium selection of amenities and exclusive privileges.</p>
               </div>
               <div className="bg-primary/10 p-6 rounded-3xl border border-primary/20 min-w-[280px]">
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-[3px] mb-2">Total Selection</p>
                  <p className="text-3xl font-black text-primary">₹{total.toLocaleString()}</p>
                  <button 
                    disabled={selected.length === 0} 
                    onClick={() => setStep(2)}
                    className="w-full mt-4 bg-primary text-dark font-black px-6 py-3 rounded-xl uppercase tracking-widest text-[10px] hover:bg-white transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                  >
                    Confirm Extras <ArrowRight className="w-3 h-3"/>
                  </button>
               </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               {catalog.map(item => {
                 const isActive = selected.includes(item.id);
                 return (
                   <div 
                    key={item.id} 
                    onClick={() => toggle(item.id)}
                    className={`p-8 border-2 rounded-[2rem] cursor-pointer transition-all relative group ${isActive ? 'bg-primary/5 border-primary shadow-[0_20px_40px_rgba(200,168,75,0.1)]' : 'bg-white/5 border-[var(--border-color)] hover:border-white/20'}`}
                   >
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all ${isActive ? 'bg-primary text-dark' : 'bg-black/40 text-primary'}`}>
                        {React.cloneElement(item.icon, { size: 24 })}
                     </div>
                     <h3 className="text-xl font-black uppercase tracking-tight mb-4">{item.name}</h3>
                     <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8">{item.desc}</p>
                     
                     <div className="flex justify-between items-center pt-6 border-t border-white/5">
                        <span className="text-lg font-black tracking-tight text-white">₹{item.price.toLocaleString()}</span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-primary text-dark' : 'bg-white/5 border border-white/10 group-hover:bg-white/10'}`}>
                           {isActive ? <Check size={16} strokeWidth={4} /> : <Plus size={16} />}
                        </div>
                     </div>
                   </div>
                 );
               })}
            </div>
          </div>
        ) : (
          <div className="animate-in zoom-in duration-500 flex flex-col items-center justify-center py-24 text-center">
             <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
                <ShoppingBag className="w-12 h-12 text-primary" />
             </div>
             <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Selection Secured</h2>
             <p className="text-slate-400 font-medium mb-12 max-w-md">Your premium amenities have been successfully added to your reservation SV49B2. Get ready for an elevated SkyVoyage experience.</p>
             <div className="space-y-3 w-full max-w-sm mb-12">
               {selected.map(id => (
                 <div key={id} className="flex justify-between p-4 bg-white/5 border border-[var(--border-color)] rounded-xl">
                   <span className="text-xs font-black uppercase tracking-widest">{catalog.find(x => x.id === id)?.name}</span>
                   <span className="text-xs font-bold text-primary">₹{catalog.find(x => x.id === id)?.price}</span>
                 </div>
               ))}
               <div className="flex justify-between p-5 bg-primary/10 border border-primary/20 rounded-2xl">
                 <span className="font-black uppercase tracking-widest">Total Paid</span>
                 <span className="text-xl font-black text-primary">₹{total.toLocaleString()}</span>
               </div>
             </div>
             <button onClick={() => setStep(1)} className="text-slate-500 font-bold text-xs uppercase tracking-[4px] border-b border-transparent hover:border-slate-500 transition-all pb-1">Back to Catalog</button>
          </div>
        )}
      </div>
    </div>
  );
}
