import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, MapPin, Calendar, Percent } from 'lucide-react';

const EmptyLegsSearch = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Vertical Stack for Card Layout */}
            <div className="space-y-6">
                {/* Available Corridor */}
                <div className="group space-y-3">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[4px] ml-2">Available Corridor</label>
                    <div className="relative">
                        <MapPin size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary opacity-40 group-focus-within:opacity-100 transition-opacity" />
                        <input 
                            type="text" 
                            placeholder="Search Route Manifest"
                            className="w-full bg-white/5 border border-white/5 p-6 pl-16 rounded-2xl text-[11px] font-black tracking-widest text-white outline-none focus:bg-white/10 focus:border-primary/30 transition-all placeholder:text-slate-700"
                        />
                    </div>
                </div>

                {/* Voyage Window */}
                <div className="group space-y-3">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[4px] ml-2">Voyage Window</label>
                    <div className="relative">
                        <Calendar size={16} className="absolute left-6 top-1/2 -translate-y-1/2 opacity-80 group-focus-within:opacity-100 transition-opacity" style={{color:'#C8A84B'}} />
                        <input 
                            type="date" 
                            className="w-full bg-white/5 border border-white/5 p-6 pl-16 rounded-2xl text-[11px] font-black tracking-widest text-white outline-none focus:bg-white/10 focus:border-primary/30 transition-all"
                        />
                    </div>
                </div>

                {/* Discount Badge */}
                <div className="p-8 bg-primary/5 border border-primary/20 rounded-[2rem] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Percent size={18} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[3px] text-white">Elite Savings</span>
                    </div>
                    <span className="text-[18px] font-black text-primary tracking-tighter italic font-luxury">75% REDUCTION</span>
                </div>
            </div>

            {/* Primary CTA */}
            <button 
                onClick={() => navigate('/results')}
                className="w-full bg-primary text-black h-20 rounded-2xl font-black text-[12px] uppercase tracking-[6px] shadow-[0_20px_40px_rgba(212,175,55,0.3)] hover:scale-[1.02] hover:shadow-[0_25px_50px_rgba(212,175,55,0.4)] active:scale-95 transition-all flex items-center justify-center gap-6 group"
            >
                Search Celestial Routes
                <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-black/20 transition-all">
                    <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
            </button>
        </div>
    );
};

export default EmptyLegsSearch;
