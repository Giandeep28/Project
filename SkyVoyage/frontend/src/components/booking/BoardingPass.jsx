import React from 'react';
import { Plane, QrCode, Download, Share2 } from 'lucide-react';

export default function BoardingPass({ bookingId, flightId, seat }) {
  return (
    <div className="max-w-md mx-auto animate-in zoom-in duration-500">
      <div className="bg-[#f8f9fa] dark:bg-white rounded-[40px] overflow-hidden shadow-2xl text-dark">
        {/* Top Section */}
        <div className="bg-primary p-8 text-dark relative">
          <div className="flex justify-between items-center mb-6">
            <span className="text-[10px] font-black uppercase tracking-[4px]">Elite Boarding Pass</span>
            <Plane size={24} className="rotate-45" />
          </div>
          <div className="flex justify-between items-end border-b border-dark/10 pb-6">
            <div>
              <p className="text-3xl font-black tracking-tighter uppercase italic">SKYVOYAGE</p>
              <p className="text-[9px] font-black uppercase opacity-60">Status: Confirmed</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black uppercase">{flightId}</p>
              <p className="text-[9px] font-black uppercase opacity-60">Fleet ID</p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-10 space-y-12 relative">
          {/* Perforation Look */}
          <div className="absolute -top-4 -left-4 w-8 h-8 bg-[var(--bg-primary)] rounded-full"></div>
          <div className="absolute -top-4 -right-4 w-8 h-8 bg-[var(--bg-primary)] rounded-full"></div>
          
          <div className="grid grid-cols-2 gap-12">
            <div>
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Voyager</p>
              <p className="text-sm font-black uppercase">ALEXANDER G.</p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Suite Number</p>
              <p className="text-sm font-black uppercase text-primary bg-dark px-3 py-1 rounded-lg inline-block">{seat || '04A'}</p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Gate / Hub</p>
              <p className="text-sm font-black uppercase">G-12 / HUB-DELTA</p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">Ascension Time</p>
              <p className="text-sm font-black uppercase">09:45 AM</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-6 pt-6 border-t border-slate-100">
            <QrCode size={120} className="text-dark/80" />
            <div className="text-center">
               <p className="text-[10px] font-black uppercase tracking-[6px] text-slate-400">{bookingId}</p>
               <p className="text-[8px] font-bold text-slate-300 mt-2">CRYPTO-SECURED BY SKYVOYAGE</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-8">
        <button className="flex-1 bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
          <Download size={16} /> Save pass
        </button>
        <button className="flex-1 bg-white/5 border border-white/10 p-5 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
          <Share2 size={16} /> Share linkage
        </button>
      </div>
    </div>
  );
}
