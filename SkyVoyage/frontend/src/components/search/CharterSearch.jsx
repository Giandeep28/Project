import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { MapPin, Calendar, Users, Send } from 'lucide-react';

/**
 * CharterSearch - Refactored into a high-end 2x2 grid layout.
 * Maps: Origin -> Departure Point, Arrival -> Destination, 
 *       Departure -> Voyage Date, Group Size -> Passengers & Class.
 */
const CharterSearch = () => {
    const { state, dispatch } = useApp();
    const navigate = useNavigate();
    
    const [searchData, setSearchData] = useState({
        from: 'DEL',
        to: 'BOM',
        date: new Date().toISOString().split('T')[0]
    });

    const handleSearch = () => {
        // Industry-standard validation
        if (!searchData.from || !searchData.to) {
            dispatch({ 
                type: 'ADD_NOTIFICATION', 
                payload: { type: 'error', message: 'Incomplete coordinate manifest.' } 
            });
            return;
        }

        const params = new URLSearchParams(searchData).toString();
        navigate(`/results?${params}`);
    };

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Standardized 2x2 Interactive Grid */}
            <div className="grid grid-cols-2 gap-6">
                {/* Departure Point */}
                <div className="group space-y-3">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[4px] ml-2">Departure Point</label>
                    <div className="relative">
                        <MapPin size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary opacity-40 group-focus-within:opacity-100 transition-opacity" />
                        <input 
                            type="text" 
                            placeholder="Select Origin Hub"
                            value={searchData.from}
                            onChange={(e) => setSearchData(prev => ({ ...prev, from: e.target.value.toUpperCase() }))}
                            className="w-full bg-white/5 border border-white/5 p-6 pl-16 rounded-2xl text-[11px] font-black tracking-widest text-white outline-none focus:bg-white/10 focus:border-primary/30 transition-all placeholder:text-slate-700"
                        />
                    </div>
                </div>

                {/* Destination */}
                <div className="group space-y-3">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[4px] ml-2">Destination Hub</label>
                    <div className="relative">
                        <MapPin size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary opacity-40 rotate-180 group-focus-within:opacity-100 transition-opacity" />
                        <input 
                            type="text" 
                            placeholder="Discovery Hub"
                            value={searchData.to}
                            onChange={(e) => setSearchData(prev => ({ ...prev, to: e.target.value.toUpperCase() }))}
                            className="w-full bg-white/5 border border-white/5 p-6 pl-16 rounded-2xl text-[11px] font-black tracking-widest text-white outline-none focus:bg-white/10 focus:border-primary/30 transition-all placeholder:text-slate-700"
                        />
                    </div>
                </div>

                {/* Voyage Date */}
                <div className="group space-y-3">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[4px] ml-2">Departure Date</label>
                    <div className="relative">
                        <Calendar size={16} className="absolute left-6 top-1/2 -translate-y-1/2 opacity-80 group-focus-within:opacity-100 transition-opacity" style={{color:'#C8A84B'}} />
                        <input 
                            type="date" 
                            value={searchData.date}
                            onChange={(e) => setSearchData(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full bg-white/5 border border-white/5 p-6 pl-16 rounded-2xl text-[11px] font-black tracking-widest text-white outline-none focus:bg-white/10 focus:border-primary/30 transition-all"
                        />
                    </div>
                </div>


                {/* Passengers & Class */}
                <div className="group space-y-3">
                    <label className="block text-[9px] font-black text-slate-500 uppercase tracking-[4px] ml-2">Guest Configuration</label>
                    <div className="relative">
                        <Users size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-primary opacity-40 group-focus-within:opacity-100 transition-opacity" />
                        <select className="w-full bg-white/5 border border-white/5 p-6 pl-16 rounded-2xl text-[11px] font-black tracking-widest text-white outline-none focus:bg-white/10 focus:border-primary/30 transition-all appearance-none cursor-pointer">
                            <option>1 Passenger, Royal</option>
                            <option>Multi-Guest, Executive</option>
                            <option>Full Fleet Charter</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* High-Visibility CTA */}
            <button 
                onClick={handleSearch}
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

export default CharterSearch;
