import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightLeft, Calculator, TrendingUp, RefreshCw, Info } from 'lucide-react';
import useCurrency from '../../context/useCurrency';

export default function CurrencyCalculator({ darkMode }) {
  const { rates, convert } = useCurrency();
  const [amount, setAmount] = useState(100);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [result, setResult] = useState(0);

  // Get list of available currency codes from rates
  const currencyCodes = rates && Object.keys(rates).length > 0 
    ? [...Object.keys(rates)].sort() 
    : ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'AED', 'SGD', 'CAD', 'AUD'];

  useEffect(() => {
    setResult(convert(amount, from, to));
  }, [amount, from, to, convert]);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const bg = darkMode ? 'rgba(28, 35, 51, 0.6)' : 'rgba(255, 255, 255, 0.8)';
  const accent = '#C8A84B';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-[2rem] border backdrop-blur-xl shadow-2xl transition-all ${darkMode ? 'border-white/10' : 'border-slate-200'}`}
      style={{ background: bg }}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C8A84B]/20 flex items-center justify-center text-[#C8A84B]">
            <Calculator size={20} />
          </div>
          <div>
            <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-500 mb-0.5">Universal Utility</h3>
            <h2 className="text-xl font-black tracking-tighter">Currency Converter</h2>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
          <TrendingUp size={12} /> Live Rates
        </div>
      </div>

      <div className="space-y-6">
        {/* Amount Input */}
        <div>
          <label className="text-[10px] font-bold uppercase text-slate-500 ml-4 mb-2 block">Amount to Convert</label>
          <div className="relative group">
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className={`w-full bg-black/20 border-2 border-transparent group-hover:border-[#C8A84B]/30 focus:border-[#C8A84B]/50 rounded-2xl py-4 px-6 text-2xl font-black outline-none transition-all ${darkMode ? 'text-white' : 'text-slate-900'}`}
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-500">{from}</div>
          </div>
        </div>

        {/* Currency Selection Grid */}
        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-500 ml-2">From</label>
            <select 
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className={`w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:border-[#C8A84B]/50 appearance-none cursor-pointer ${darkMode ? 'text-white' : 'text-slate-900'}`}
            >
              {currencyCodes.map(code => <option key={code} value={code}>{code}</option>)}
            </select>
          </div>

          <button 
            onClick={swap}
            className="w-10 h-10 rounded-full bg-[#C8A84B] text-[#000] flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all mt-6"
          >
            <ArrowRightLeft size={16} strokeWidth={3} />
          </button>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase text-slate-500 ml-2">To</label>
            <select 
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className={`w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold outline-none focus:border-[#C8A84B]/50 appearance-none cursor-pointer ${darkMode ? 'text-white' : 'text-slate-900'}`}
            >
              {currencyCodes.map(code => <option key={code} value={code}>{code}</option>)}
            </select>
          </div>
        </div>

        {/* Result Area */}
        <div className="mt-8 pt-8 border-t border-white/5">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-500 mb-2">Estimated Result</p>
              <motion.div 
                key={result}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-black tracking-tighter text-[#C8A84B]"
              >
                {result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xl text-slate-500">{to}</span>
              </motion.div>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold uppercase text-slate-500 mb-1">Exchange Rate</p>
              <p className="text-xs font-bold text-slate-400">1 {from} = {(result / (amount || 1)).toFixed(4)} {to}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-[#C8A84B]/5 border border-[#C8A84B]/10 rounded-2xl flex gap-3">
        <Info className="w-4 h-4 text-[#C8A84B] shrink-0 mt-0.5" />
        <p className="text-[10px] leading-relaxed text-slate-500 font-medium italic">
          Market rates fluctuate. The actual conversion at the time of booking may vary slightly based on final payment processing.
        </p>
      </div>
    </motion.div>
  );
}
