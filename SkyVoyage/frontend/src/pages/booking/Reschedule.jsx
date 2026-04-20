import React, { useState } from 'react';
import { Calendar, Search, RefreshCw, ArrowRight, Plane, CheckCircle2, AlertCircle, CreditCard } from 'lucide-react';

export default function Reschedule({ darkMode }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pnr, setPnr] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const handleLookup = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1200);
  };

  const handleConfirmDate = () => {
    if(!selectedDate) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1200);
  };

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 1500);
  };

  return (
    <div className={`min-h-screen pt-24 pb-12 ${darkMode ? 'bg-[var(--app-bg)] text-[var(--app-text)]' : 'bg-white text-slate-900'}`}>
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
        <div className="mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-6">
            <RefreshCw className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Flex-Reschedule</h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl">Adapt your voyage to your changing schedule. Effortlessly modify your travel dates within our flexible Celestial framework.</p>
        </div>

        <div className="bg-white/5 border border-[var(--border-color)] rounded-[3rem] p-8 lg:p-12 backdrop-blur-3xl shadow-3xl relative overflow-hidden">
          {/* Timeline */}
          <div className="flex items-center justify-between mb-16 relative">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -z-10"></div>
            <div className={`absolute top-1/2 left-0 h-[1px] bg-primary -z-10 transition-all duration-700 ${step === 1 ? 'w-0' : step === 2 ? 'w-1/3' : step === 3 ? 'w-2/3' : 'w-full'}`}></div>
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${step >= s ? 'bg-primary text-dark shadow-[0_0_15px_rgba(200,168,75,0.4)]' : 'bg-[#0A0F1A] border-2 border-[var(--border-color)] text-slate-600'}`}>
                {step > s ? <CheckCircle2 className="w-5 h-5"/> : s}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="animate-in fade-in duration-500 flex flex-col items-center">
              <form onSubmit={handleLookup} className="w-full max-w-md space-y-6">
                <div className="space-y-4">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Booking Reference</label>
                     <input required type="text" value={pnr} onChange={e => setPnr(e.target.value.toUpperCase())} placeholder="SV49B2" className="w-full bg-black/40 border-2 border-[var(--border-color)] focus:border-primary rounded-2xl px-6 py-4 font-black outline-none transition-all uppercase tracking-[4px]" maxLength={6} />
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Passenger Last Name</label>
                     <input required type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" className="w-full bg-black/40 border-2 border-[var(--border-color)] focus:border-primary rounded-2xl px-6 py-4 font-bold outline-none transition-all" />
                   </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-primary text-dark font-black px-8 py-5 rounded-2xl uppercase tracking-widest text-xs hover:bg-white transition-all">
                  {loading ? 'Validating Flex-Status...' : 'Access My Record'}
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
             <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <div className="flex flex-col lg:flex-row gap-12">
                   <div className="lg:w-1/2 space-y-8">
                      <div className="p-6 bg-primary/10 border border-primary/20 rounded-3xl">
                         <span className="text-[10px] font-black uppercase text-primary tracking-widest mb-4 block">Current Voyage</span>
                         <div className="flex justify-between items-center bg-black/30 p-5 rounded-2xl border border-white/5">
                            <div className="text-center">
                              <h4 className="text-2xl font-black">DEL</h4>
                              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Oct 24</p>
                            </div>
                            <ArrowRight className="text-primary w-6 h-6 opacity-40"/>
                            <div className="text-center">
                              <h4 className="text-2xl font-black">BOM</h4>
                              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Oct 24</p>
                            </div>
                         </div>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Select New Travel Date</label>
                        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="w-full bg-black/40 border-2 border-[var(--border-color)] focus:border-primary rounded-2xl px-6 py-5 font-black outline-none transition-all [color-scheme:dark]" />
                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex gap-4">
                           <AlertCircle className="text-yellow-500 w-5 h-5 flex-shrink-0" />
                           <p className="text-xs text-slate-400 font-medium">Re-scheduling fee of ₹1,500 applies as per the current fare rules for Celestial First.</p>
                        </div>
                      </div>
                   </div>
                   <div className="lg:w-1/2 flex flex-col justify-end gap-4">
                      <button onClick={handleConfirmDate} disabled={!selectedDate || loading} className="w-full bg-primary text-dark font-black px-8 py-5 rounded-2xl uppercase tracking-widest text-xs hover:bg-white transition-all shadow-xl">
                        {loading ? 'Searching Availability...' : 'Continue to Confirmation'}
                      </button>
                      <button onClick={() => setStep(1)} className="w-full text-slate-600 font-black text-[10px] uppercase tracking-widest border border-white/5 py-5 rounded-2xl hover:bg-white/5 transition-all">Go Back</button>
                   </div>
                </div>
             </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
               <div className="max-w-2xl mx-auto text-center">
                  <h2 className="text-3xl font-black uppercase mb-8">Confirm Re-scheduling</h2>
                  <div className="space-y-4 border border-[var(--border-color)] bg-black/20 p-8 rounded-3xl text-left mb-12">
                     <div className="flex justify-between items-center p-4 border-b border-white/5">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">New Date</span>
                        <span className="font-black text-primary uppercase">{new Date(selectedDate).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}</span>
                     </div>
                     <div className="flex justify-between items-center p-4 border-b border-white/5">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Change Fee</span>
                        <span className="font-black">₹1,500.00</span>
                     </div>
                     <div className="flex justify-between items-center p-4">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Fare Difference</span>
                        <span className="font-black">₹0.00 (Elite Protection)</span>
                     </div>
                     <div className="mt-4 p-5 bg-primary/10 rounded-2xl flex justify-between items-center">
                        <span className="font-black uppercase tracking-widest">Total Payable</span>
                        <span className="text-2xl font-black text-primary">₹1,500.00</span>
                     </div>
                  </div>
                  <button onClick={handlePayment} disabled={loading} className="w-full bg-primary text-dark font-black px-12 py-5 rounded-2xl uppercase tracking-widest text-xs hover:bg-white transition-all flex items-center justify-center gap-3 shadow-2xl">
                    <CreditCard className="w-4 h-4" /> {loading ? 'Processing Transaction...' : 'Pay & Reschedule'}
                  </button>
               </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in zoom-in duration-500 text-center py-12">
               <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
               </div>
               <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Voyage Rescheduled</h2>
               <p className="text-slate-400 font-medium mb-12 max-w-md mx-auto">Your journey has been successfully updated to the new date. A fresh confirmation has been sent to your registered email.</p>
               <div className="inline-flex gap-4 p-6 bg-black/40 rounded-3xl border border-[var(--border-color)]">
                  <div className="text-left px-4 border-r border-white/10">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">New Flight</p>
                    <p className="font-black text-primary">SV 104</p>
                  </div>
                  <div className="text-left px-4">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Reference</p>
                    <p className="font-black">{pnr || 'SV49B2'}</p>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
