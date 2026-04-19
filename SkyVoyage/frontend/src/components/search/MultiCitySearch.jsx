import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Plus, Minus, Send, MapPin, Calendar } from 'lucide-react';

/**
 * MultiCitySearch - Refactored for the luxury booking hub card.
 * Uses compact vertical segments with business logic preservation.
 */
const MultiCitySearch = () => {
    const { dispatch } = useApp();
    const navigate = useNavigate();
    
    // Preserve existing state logic
    const [legs, setLegs] = useState([
        { id: 1, from: '', to: '', date: '' },
        { id: 2, from: '', to: '', date: '' }
    ]);

    const addLeg = () => {
        if (legs.length < 5) {
            setLegs([...legs, { id: Date.now(), from: '', to: '', date: '' }]);
        }
    };

    const removeLeg = (id) => {
        if (legs.length > 2) {
            setLegs(legs.filter(leg => leg.id !== id));
        }
    };

    const updateLeg = (id, field, value) => {
        setLegs(legs.map(leg => (leg.id === id ? { ...leg, [field]: value } : leg)));
    };

    const handleSearch = () => {
        const hasMissing = legs.some(leg => !leg.from || !leg.to || !leg.date);
        if (hasMissing) {
            dispatch({ type: 'ADD_NOTIFICATION', payload: { msg: 'Complete all voyage segments.', type: 'warning' }});
            return;
        }
        navigate('/results');
    };

    return (
        <div className="space-y-8 animate-fade-in relative">
            <div className="space-y-6 max-h-[440px] overflow-y-auto pr-3 scrollbar-v-thin">
                {legs.map((leg, index) => (
                    <div key={leg.id} className="bg-white/5 p-8 rounded-[2rem] border border-white/5 relative space-y-6 group">
                        {/* Segment Header */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                <span className="text-[9px] font-black text-primary uppercase tracking-[4px]">Segment 0{index + 1}</span>
                            </div>
                            {legs.length > 2 && (
                                <button onClick={() => removeLeg(leg.id)} className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/5 text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all">
                                    <Minus size={14} />
                                </button>
                            )}
                        </div>

                        {/* Origin & Date Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative group/input">
                                <MapPin size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary opacity-40 group-focus-within/input:opacity-100 transition-opacity" />
                                <input 
                                    type="text" 
                                    placeholder="Origin Hub"
                                    className="w-full bg-white/5 border border-white/5 p-4 pl-12 rounded-xl text-[10px] font-black tracking-widest text-white outline-none focus:bg-white/10 focus:border-primary/30 transition-all placeholder:text-slate-700"
                                    value={leg.from}
                                    onChange={(e) => updateLeg(leg.id, 'from', e.target.value)}
                                />
                            </div>
                            <div className="relative group/input">
                                <Calendar size={14} className="absolute left-5 top-1/2 -translate-y-1/2 opacity-80 group-focus-within/input:opacity-100 transition-opacity" style={{color:'#C8A84B'}} />
                                <input 
                                    type="date" 
                                    className="w-full bg-white/5 border border-white/5 p-4 pl-12 rounded-xl text-[10px] font-black tracking-widest text-white outline-none focus:bg-white/10 focus:border-primary/30 transition-all"
                                    value={leg.date}
                                    onChange={(e) => updateLeg(leg.id, 'date', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Arrival (Full Width) */}
                        <div className="relative group/input">
                            <MapPin size={14} className="absolute left-5 top-1/2 -translate-y-1/2 text-primary opacity-40 rotate-180 group-focus-within/input:opacity-100 transition-opacity" />
                            <input 
                                type="text" 
                                placeholder="Destination Hub"
                                className="w-full bg-white/5 border border-white/5 p-4 pl-12 rounded-xl text-[10px] font-black tracking-widest text-white outline-none focus:bg-white/10 focus:border-primary/30 transition-all placeholder:text-slate-700"
                                value={leg.to}
                                onChange={(e) => updateLeg(leg.id, 'to', e.target.value)}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Global Actions */}
            <div className="space-y-4">
                <button 
                    onClick={addLeg}
                    disabled={legs.length >= 5}
                    className="w-full py-6 border border-white/5 bg-white/5 rounded-2xl flex items-center justify-center gap-4 text-[9px] font-black uppercase tracking-[4px] text-slate-500 hover:text-white hover:bg-white/10 hover:border-primary/30 transition-all disabled:opacity-20 group"
                >
                    <div className="p-1 rounded bg-slate-800 group-hover:bg-primary transition-colors">
                        <Plus size={12} className="text-white group-hover:text-black" />
                    </div>
                    Append Flight Path
                </button>

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
        </div>
    );
};

export default MultiCitySearch;
