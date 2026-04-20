import React, { useState } from 'react';
import { Star, Coffee, Briefcase, Crown, ShieldCheck, CheckCircle2, Search, ArrowRight, CreditCard } from 'lucide-react';

export default function Extras({ darkMode }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pnr, setPnr] = useState('');
  const [selectedExtras, setSelectedExtras] = useState([]);

  const toggleExtra = (id) => {
    setSelectedExtras(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const extras = [
    { id: 'meal', icon: <Coffee />, label: 'Celestial Gourmet Dining', price: 1200, desc: 'Chef-curated 3-course meal with fine wine pairing.' },
    { id: 'lounge', icon: <Crown />, label: 'Priority SkyLounge', price: 2500, desc: 'Access to private hubs with spa and premium bar.' },
    { id: 'baggage', icon: <Briefcase />, label: 'Extra Comfort (+10kg)', price: 1800, desc: 'Additional checked baggage allowance for long journeys.' },
    { id: 'insurance', icon: <ShieldCheck />, label: 'Voyage Protection', price: 850, desc: 'Comprehensive travel insurance and priority refund status.' }
  ];

  const total = selectedExtras.reduce((acc, curr) => acc + (extras.find(e => e.id === curr)?.price || 0), 0);

  const handleLookup = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1200);
  };

  const handleConfirm = () => {
    if (selectedExtras.length === 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1500);
  };

  return (
    <div className={`min-h-screen pt-24 pb-12 ${darkMode ? 'bg-[var(--app-bg)] text-[var(--app-text)]' : 'bg-white text-slate-900'}`}>
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-6">
            <Star className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Elevate Your Journey</h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl">Customize your voyage with our exclusive range of premium add-ons and celestial amenities.</p>
        </div>

        <div className="bg-white/5 border border-[var(--border-color)] rounded-[3rem] p-8 lg:p-12 backdrop-blur-3xl shadow-3xl">
          {step === 1 && (
            <div className="animate-in fade-in duration-500 flex flex-col items-center py-10">
              <form onSubmit={handleLookup} className="w-full max-w-md space-y-6">
                <h2 className="text-xl font-black uppercase tracking-widest text-center mb-8">Identify My Voyage</h2>
                <div className="space-y-4">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Booking Reference</label>
                     <input required type="text" value={pnr} onChange={e => setPnr(e.target.value.toUpperCase())} placeholder="e.g. SV49B2" className="w-full bg-black/40 border-2 border-[var(--border-color)] focus:border-primary rounded-2xl px-6 py-4 font-black outline-none transition-all uppercase tracking-[4px]" maxLength={6} />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Last Name</label>
                     <input required type="text" placeholder="Last name" className="w-full bg-black/40 border-2 border-[var(--border-color)] focus:border-primary rounded-2xl px-6 py-4 font-bold outline-none transition-all" />
                   </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-primary text-dark font-black px-8 py-5 rounded-2xl uppercase tracking-widest text-xs hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2">
                  {loading ? 'Fetching Itinerary...' : 'Access Marketplace'} <ArrowRight className="w-4 h-4"/>
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
             <div className="animate-in fade-in slide-in-from-bottom-8 duration-600">
                <div className="flex flex-col lg:flex-row gap-12">
                   <div className="lg:w-2/3 grid sm:grid-cols-2 gap-6">
                      {extras.map((item) => (
                        <div 
                          key={item.id} 
                          onClick={() => toggleExtra(item.id)}
                          className={`p-6 border-2 rounded-3xl cursor-pointer transition-all relative overflow-hidden group ${selectedExtras.includes(item.id) ? 'border-primary bg-primary/5' : 'border-[var(--border-color)] bg-black/20 hover:border-primary/40'}`}
                        >
                          <div className={`p-3 rounded-2xl inline-flex mb-6 ${selectedExtras.includes(item.id) ? 'bg-primary text-dark' : 'bg-white/5 text-primary'}`}>
                             {React.cloneElement(item.icon, { className: 'w-6 h-6' })}
                          </div>
                          <h3 className="text-lg font-black uppercase tracking-tight mb-2">{item.label}</h3>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">{item.desc}</p>
                          <div className="flex justify-between items-center">
                             <span className="text-lg font-black text-primary">₹{item.price.toLocaleString()}</span>
                             <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedExtras.includes(item.id) ? 'bg-primary border-primary text-dark' : 'border-white/10 group-hover:border-primary/40'}`}>
                                {selectedExtras.includes(item.id) && <CheckCircle2 className="w-4 h-4" />}
                             </div>
                          </div>
                        </div>
                      ))}
                   </div>
                   <div className="lg:w-1/3">
                      <div className="sticky top-8 bg-black/30 border border-white/5 p-8 rounded-3xl">
                         <h3 className="text-xs font-black uppercase text-slate-500 tracking-[3px] mb-8">Cart Summary</h3>
                         <div className="space-y-4 mb-8">
                            {selectedExtras.length === 0 ? (
                              <p className="text-xs text-slate-600 italic">No items selected yet.</p>
                            ) : (
                              selectedExtras.map(id => {
                                const item = extras.find(e => e.id === id);
                                return (
                                  <div key={id} className="flex justify-between items-center border-b border-white/5 pb-3">
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                                    <span className="text-xs font-black">₹{item.price.toLocaleString()}</span>
                                  </div>
                                );
                              })
                            )}
                         </div>
                         <div className="flex justify-between items-center pt-4 mb-8">
                            <span className="text-sm font-black uppercase tracking-[2px]">Total Amount</span>
                            <span className="text-3xl font-black text-primary">₹{total.toLocaleString()}</span>
                         </div>
                         <button 
                           onClick={handleConfirm} 
                           disabled={selectedExtras.length === 0 || loading}
                           className="w-full bg-primary text-dark font-black px-8 py-5 rounded-2xl uppercase tracking-widest text-xs hover:bg-white transition-all disabled:opacity-20 disabled:grayscale flex items-center justify-center gap-2"
                         >
                           <CreditCard className="w-4 h-4" /> {loading ? 'Processing...' : 'Attach to Booking'}
                         </button>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {step === 3 && (
            <div className="animate-in zoom-in duration-500 text-center py-12">
               <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="w-12 h-12 text-primary" />
               </div>
               <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Voyage Upgraded</h2>
               <p className="text-slate-400 font-medium mb-12 max-w-md mx-auto">Your selection has been successfully synchronized with PNR {pnr || 'SV49B2'}. Prepare for an unparalleled travel experience.</p>
               <div className="flex justify-center gap-4">
                  <button onClick={() => window.close()} className="bg-white/5 border border-white/10 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Close Tab</button>
                  <button onClick={() => setStep(1)} className="bg-primary text-dark px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">View Other Services</button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
