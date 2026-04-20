import React, { useState } from 'react';
import { CreditCard, FileSearch, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RefundRequest({ darkMode }) {
  const [step, setStep] = useState(1);
  const [pnr, setPnr] = useState('');
  const [lastName, setLastName] = useState('');

  const handleLookup = (e) => {
    e.preventDefault();
    if(pnr && lastName) {
      setStep(2);
    }
  };

  const handleConfirm = () => {
    setStep(3);
  };

  return (
    <div className={`min-h-screen pt-24 pb-12 flex flex-col justify-center ${darkMode ? 'bg-[var(--app-bg)] text-[var(--app-text)]' : 'bg-white text-slate-900'}`}>
      <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
        <div className="text-center mb-16">
          <CreditCard className="w-12 h-12 text-primary mx-auto mb-6" />
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Refund Request</h1>
          <p className="text-xl text-slate-500 font-medium">Cancel an existing reservation or check the status of an ongoing refund claim.</p>
        </div>

        <div className="bg-white/5 border border-[var(--border-color)] rounded-3xl p-8 lg:p-12">
          
          {/* Progress Bar */}
          <div className="flex justify-between items-center mb-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -z-10"></div>
            <div className={`absolute top-1/2 left-0 h-[2px] bg-primary -z-10 transition-all duration-500 ${step === 1 ? 'w-0' : step === 2 ? 'w-1/2' : 'w-full'}`}></div>
            
            {[1, 2, 3].map((s) => (
              <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs ${step >= s ? 'bg-primary text-dark' : 'bg-[#111827] border-2 border-[var(--border-color)] text-slate-500'}`}>
                {s < step ? <CheckCircle2 className="w-5 h-5"/> : s}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-2xl font-black uppercase mb-6 text-center">Locate Booking</h2>
              <form onSubmit={handleLookup} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Booking Reference (PNR)</label>
                  <input 
                    type="text" 
                    value={pnr}
                    onChange={(e) => setPnr(e.target.value.toUpperCase())}
                    placeholder="6-Character Code (e.g., AXYZ12)" 
                    className="w-full bg-black/40 border border-[var(--border-color)] rounded-xl px-6 py-4 font-bold outline-none focus:border-primary uppercase"
                    maxLength={6}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Passenger Last Name</label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name" 
                    className="w-full bg-black/40 border border-[var(--border-color)] rounded-xl px-6 py-4 font-bold outline-none focus:border-primary"
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-primary text-dark font-black px-8 py-4 rounded-xl uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2">
                   Retrieve Details <ArrowRight className="w-4 h-4"/>
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in duration-500">
              <h2 className="text-2xl font-black uppercase mb-6 border-b border-[var(--border-color)] pb-4 text-center">Booking Details</h2>
              <div className="bg-black/30 border border-primary/20 rounded-xl p-6 mb-8 text-center place-content-center">
                <span className="block text-xs uppercase tracking-widest text-slate-500 mb-1">PNR</span>
                <span className="text-2xl font-black text-primary mb-4 block">{pnr}</span>
                <span className="block text-xs uppercase tracking-widest text-slate-500 mb-1">Passenger</span>
                <span className="text-lg font-bold">{lastName.toUpperCase()}</span>
              </div>
              <div className="mb-8 p-4 bg-red-900/10 border border-red-900/30 rounded-xl text-center">
                <span className="font-bold text-red-500 block mb-2">Estimated Refund Amount</span>
                <span className="text-3xl font-black text-white">$1,250.00</span>
                <p className="text-xs text-slate-400 mt-2">Calculated based on standard economy cancellation policy.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setStep(1)} className="border border-[var(--border-color)] bg-transparent text-white font-black px-8 py-4 rounded-xl uppercase tracking-widest hover:bg-white/5 transition-all text-xs">
                  Cancel
                </button>
                <button onClick={handleConfirm} className="bg-primary text-dark font-black px-8 py-4 rounded-xl uppercase tracking-widest hover:bg-white transition-all text-xs">
                  Confirm Cancellation
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in zoom-in duration-500 text-center py-8">
              <CheckCircle2 className="w-20 h-20 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-black uppercase tracking-wider mb-4">Refund Processing</h2>
              <p className="text-slate-400 font-medium max-w-md mx-auto mb-8">Your cancellation was successful. The refund amount has been initiated back to your original payment method. Please allow 5-7 business days for the transaction to reflect.</p>
              <div className="inline-flex flex-col items-center p-4 bg-black/30 rounded-xl border border-[var(--border-color)]">
                <span className="text-xs uppercase tracking-widest text-slate-500">Transaction ID</span>
                <span className="font-bold text-primary">REF-{Math.floor(Math.random() * 1000000)}</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
