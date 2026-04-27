import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Loader2 } from 'lucide-react';
import PriceDisplay from '../shared/PriceDisplay';

export default function PaymentPrototype({ amount, onPay }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      onPay(cardData);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="p-10 glass-panel rounded-[32px] border-primary/20">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-xl font-black uppercase italic tracking-widest">Celestial Payment</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Prototype Secure Sandbox</p>
        </div>
        <CreditCard className="text-primary" size={24} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 ml-2">Premium Access Card</label>
          <input 
            type="text" 
            placeholder="XXXX XXXX XXXX XXXX" 
            required 
            className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl font-bold outline-none focus:border-primary transition-all text-white placeholder:text-slate-700" 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 ml-2">Expirations</label>
            <input 
              type="text" 
              placeholder="MM/YY" 
              required 
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl font-bold outline-none focus:border-primary transition-all text-white placeholder:text-slate-700" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase text-slate-500 mb-2 ml-2">CVC Hub</label>
            <input 
              type="password" 
              placeholder="***" 
              required 
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl font-bold outline-none focus:border-primary transition-all text-white placeholder:text-slate-700" 
            />
          </div>
        </div>

        <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-4">
          <ShieldCheck className="text-primary" size={24} />
          <p className="text-[10px] font-medium text-slate-500 leading-relaxed uppercase">
            Your credentials are encrypted via our neural network. Transaction total: <span className="text-white font-black"><PriceDisplay amount={amount || 0} /></span>
          </p>
        </div>

        <button 
          disabled={isProcessing}
          className="w-full bg-primary text-dark py-6 rounded-2xl font-black text-xs uppercase tracking-[3px] shadow-2xl hover:bg-white transition-all flex items-center justify-center gap-3"
        >
          {isProcessing ? <><Loader2 className="animate-spin" size={18} /> Validating...</> : 'Authorize Voyage'}
        </button>
      </form>
    </div>
  );
}
