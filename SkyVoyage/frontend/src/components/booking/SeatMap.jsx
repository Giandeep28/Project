import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
    Plane, 
    ChevronRight, 
    User, 
    Check, 
    X, 
    Star, 
    Info, 
    Plus, 
    Minus, 
    RefreshCw,
    Shield
} from 'lucide-react';
import PriceDisplay from '../shared/PriceDisplay';
import { motion } from 'framer-motion';

const SeatMap = () => {
    const { state, dispatch } = useApp();
    const { selectedSeats = {}, activePassenger = 0, selectedFlight = null, searchParams = { passengers: 2 } } = state;
    const [zoom, setZoom] = useState(1);


    // Dynamic passenger count based on context
    const passengerCount = searchParams?.passengers || 2;
    const passengers = Array.from({ length: passengerCount }, (_, i) => ({
        id: i + 1,
        name: i === 0 ? 'Voyager Elite' : `Passenger ${i + 1}`,
        type: 'Adult'
    }));

    const seatClasses = [
        { name: 'First Class', color: 'from-[#d4af37] to-[#8b7322]', price: 5519, class: 'First' },
        { name: 'Business Class', color: 'from-[#1e3a8a] to-[#0f172a]', price: 3250, class: 'Business' },
        { name: 'Premium Economy', color: 'bg-[#581c87]', price: 1850, class: 'Premium Economy' },
        { name: 'Economy', color: 'bg-[#115e59]', price: 850, class: 'Economy' }
    ];

    const generateSeats = (rows, labelStart, type) => {
        const layout = type === 'First' ? ['A', '', 'D', 'F', '', 'K'] : ['A', 'B', 'C', '', 'D', 'E', 'F', '', 'H', 'J', 'K'];
        return Array.from({ length: rows }, (_, i) => {
            const rowNum = labelStart + i;
            return layout.map(col => {
                if (col === '') return { type: 'aisle' };
                const id = `${rowNum}${col}`;
                const isOccupied = Math.random() > 0.85;
                return { id, type: 'seat', class: type, occupied: isOccupied, premium: Math.random() > 0.7 };
            });
        });
    };

    const sections = [
        { type: 'First', rows: generateSeats(3, 1, 'First') },
        { type: 'Business', rows: generateSeats(5, 5, 'Business') },
        { type: 'Premium Economy', rows: generateSeats(4, 12, 'Premium Economy') },
        { type: 'Economy', rows: generateSeats(15, 20, 'Economy') }
    ];

    const handleSeatClick = (seat) => {
        if (seat.occupied) return;
        dispatch({ 
            type: 'SET_SEAT_SELECTION', 
            payload: { index: activePassenger, seatId: seat.id, seatData: seat } 
        });
    };

    const handleAssignFreeSeat = () => {
        for (const section of sections) {
            if (section.type === 'Economy') {
                for (const row of section.rows) {
                    for (const seat of row) {
                        if (seat.type === 'seat' && !seat.occupied && !seat.premium && !Object.values(selectedSeats).includes(seat.id)) {
                            handleSeatClick(seat);
                            return;
                        }
                    }
                }
            }
        }
    };

    const handleConfirm = () => {
        if (Object.keys(selectedSeats).length === passengerCount) {
            dispatch({ type: 'CONFIRM_SEATS', payload: { nextStep: 'booking' } });
            // For routing parity in SearchResults
            window.dispatchEvent(new CustomEvent('seats-confirmed', { 
                detail: { flightId: selectedFlight?.flightNumber } 
            }));
        }
    };

    // Derived seat data for active passenger display
    const currentSeatId = selectedSeats[activePassenger];
    // Find seat data in sections (simulation helper)
    const findSeat = (id) => {
        for (const s of sections) {
            for (const r of s.rows) {
                const found = r.find(st => st.id === id);
                if (found) return found;
            }
        }
        return null;
    };
    const currentSeatData = findSeat(currentSeatId);

    const getSeatPrice = (seat) => {
        if (!seat) return 0;
        if (seat.class === 'First') return 5519;
        if (seat.class === 'Business') return 3250;
        if (seat.class === 'Premium Economy') return 1850;
        if (seat.class === 'Economy') return seat.premium ? 850 : 0;
        return 0;
    };
    const currentPrice = getSeatPrice(currentSeatData);
    const totalPrice = currentPrice + 20; // Simulated add-on priority boarding

    return (
        <div className="fixed inset-0 bg-[var(--app-bg)] text-[var(--app-text)] overflow-hidden font-body select-none z-[50]">
            {/* Grid Overlay Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(circle, var(--color-primary) 1px, transparent 1px)`, backgroundSize: '30px 30px' }}>
            </div>

            {/* 1. Top Navigation / Progress Bar */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-6 bg-black/40 backdrop-blur-xl px-10 py-4 rounded-full border border-[var(--border-color)] shadow-2xl">
                {['Flight', 'Seats', 'Add-ons', 'Payment'].map((step, idx) => (
                    <React.Fragment key={step}>
                        {idx > 0 && <ChevronRight size={14} className="opacity-20" />}
                        <div className={`text-[10px] font-black uppercase tracking-[3px] transition-all duration-500 px-6 py-2 rounded-full
                            ${step === 'Seats' ? 'bg-gradient-to-r from-[#d4af37] to-[#b8972e] text-black shadow-[0_0_30px_rgba(212,175,55,0.4)] scale-110' : 'text-slate-500'}`}>
                            {step}
                        </div>
                    </React.Fragment>
                ))}
            </div>

            {/* 2. Left Panel: Flight & Passenger Info */}
            <aside className="fixed left-0 top-0 bottom-0 w-80 bg-gradient-to-r from-black/80 to-transparent border-r border-[var(--border-color)] p-10 pt-32 z-40 overflow-y-auto pb-40 scrollbar-hide">

                <div className="mb-12">
                    <h2 className="font-luxury text-4xl text-primary tracking-tighter mb-2">SkyVoyage</h2>
                    <h3 className="text-sm font-black uppercase tracking-[4px]">Flight {selectedFlight?.flightNumber || 'SV102'}</h3>
                    <div className="mt-6 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Route Discovery Map Active</p>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Boeing 787 Dreamliner Fleet</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[4px] text-primary mb-6">Passenger Matrix</p>
                    {passengers.map((p, idx) => (
                        <div 
                            key={p.id}
                            onClick={() => dispatch({ type: 'SET_ACTIVE_PASSENGER', payload: idx })}
                            className={`group p-5 rounded-2xl border transition-all duration-500 cursor-pointer flex items-center justify-between
                                ${activePassenger === idx ? 'border-[#d4af37] bg-[#d4af37]/10 shadow-[0_0_20px_rgba(212,175,55,0.1)]' : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all
                                    ${selectedSeats[idx] ? 'bg-primary text-dark' : 'bg-white/10 text-slate-500'}`}>
                                    {selectedSeats[idx] ? <Check size={14} strokeWidth={4} /> : <User size={14} />}
                                </div>
                                <div>
                                    <p className={`text-[11px] font-black uppercase tracking-widest ${activePassenger === idx ? 'text-white' : 'text-slate-400'}`}>
                                        {p.name}
                                    </p>
                                    <p className="text-[9px] font-bold text-slate-600 uppercase mt-1">
                                        {selectedSeats[idx] ? `Suite ${selectedSeats[idx]}` : 'Select Seat'}
                                    </p>
                                </div>
                            </div>
                            <div className={`w-2 h-2 rounded-full transition-all ${activePassenger === idx ? 'bg-primary animate-pulse shadow-[0_0_10px_#d4af37]' : 'bg-white/10'}`}></div>
                        </div>
                    ))}
                </div>
            </aside>

            {/* 3. Center Panel: The Interactive Fuselage */}
            <main className="flex-1 h-full pl-80 pr-80 flex items-center justify-center relative">
                {/* Zoom Controls */}
                <div className="absolute top-32 right-12 z-50 flex flex-col gap-3">
                    <button onClick={() => setZoom(z => Math.min(z + 0.1, 1.5))} className="w-12 h-12 glass-panel flex items-center justify-center text-primary border-primary/20 hover:bg-primary/20 transition-all rounded-xl cursor-pointer"><Plus size={20} /></button>
                    <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.5))} className="w-12 h-12 glass-panel flex items-center justify-center text-primary border-primary/20 hover:bg-primary/20 transition-all rounded-xl cursor-pointer"><Minus size={20} /></button>
                    <button onClick={() => setZoom(1)} className="w-12 h-12 glass-panel flex items-center justify-center text-primary border-primary/20 hover:bg-primary/20 transition-all rounded-xl cursor-pointer"><RefreshCw size={18} /></button>
                </div>

                <div className="w-full h-full overflow-auto flex items-start justify-center pt-48 pb-60 transition-transform duration-500 scrollbar-hide" style={{ transform: `scale(${zoom})` }}>
                    <div className="relative w-[500px] bg-gradient-to-b from-[#111] to-[#000814] rounded-t-[250px] border-x border-t border-[#d4af37]/20 shadow-[0_0_100px_rgba(212,175,55,0.05)] pt-40 pb-20">
                        {/* Nose Detail */}
                        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-40 h-20 bg-black/40 border border-white/10 rounded-full blur-[1px] flex items-center justify-center">
                            <div className="flex gap-4">
                                <div className="w-6 h-2 bg-white/5 rounded-full"></div>
                                <div className="w-6 h-2 bg-white/5 rounded-full"></div>
                            </div>
                        </div>

                        {/* Seat Map */}
                        <div className="px-10 space-y-16">
                            {sections.map(section => (
                                <div key={section.type} className="space-y-6">
                                    <div className="flex items-center gap-4 px-6 opacity-30">
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/20"></div>
                                        <span className="text-[8px] font-black uppercase tracking-[4px]">{section.type} Section</span>
                                        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/20"></div>
                                    </div>
                                    <div className="space-y-3">
                                        {section.rows.map((row, rIdx) => (
                                            <div key={rIdx} className="flex justify-between items-center px-4">
                                                <div className="w-6 text-[9px] font-black text-slate-700">{rIdx + 1}</div>
                                                <div className="flex gap-2">
                                                    {row.map((seat, sIdx) => {
                                                        if (seat.type === 'aisle') return <div key={sIdx} className="w-8"></div>;
                                                        
                                                        const isSelectedBySelf = Object.values(selectedSeats).includes(seat.id);
                                                        const isSelectedByActive = selectedSeats[activePassenger] === seat.id;

                                                        return (
                                                            <div 
                                                                key={seat.id}
                                                                onClick={() => handleSeatClick(seat)}
                                                                className={`w-10 h-11 rounded-[6px] relative flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg
                                                                    ${seat.occupied ? 'bg-white/5 border border-white/5 opacity-40 grayscale cursor-not-allowed text-transparent' : 
                                                                      isSelectedByActive ? 'ring-4 ring-[#d4af37] ring-offset-4 ring-offset-[#000814] scale-110 z-10 shadow-[0_0_30px_#d4af37]' :
                                                                      isSelectedBySelf ? 'bg-primary/40 border border-primary text-white' :
                                                                      'hover:ring-2 hover:ring-[#d4af37]/50'} 
                                                                    ${seat.class === 'First' ? 'bg-gradient-to-b from-[#d4af37] to-[#8b7322] border-[#d4af37]/30' :
                                                                      seat.class === 'Business' ? 'bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] border-[#1e3a8a]/30' :
                                                                      seat.class === 'Premium Economy' ? 'bg-[#581c87] border-[#581c87]/30' :
                                                                      'bg-[#115e59] border-[#115e59]/30'}`}
                                                            >
                                                                {/* Headrest Detail */}
                                                                <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-black/20 rounded-full"></div>
                                                                
                                                                {seat.occupied ? (
                                                                    <X size={12} className="text-white/40" />
                                                                ) : isSelectedByActive ? (
                                                                    <Check size={16} strokeWidth={4} className="text-dark" />
                                                                ) : seat.premium ? (
                                                                    <Star size={10} className="text-white/40" fill="currentColor" />
                                                                ) : (
                                                                    <span className="text-[7px] font-black tracking-tighter opacity-30">{seat.id}</span>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="w-6 text-[9px] font-black text-slate-700 text-right">{rIdx + 1}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* 4. Right Panel: Selected Seat Details */}
            <aside className="fixed right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-black/80 to-transparent p-10 pt-32 z-40 overflow-y-auto pb-40 scrollbar-hide">
                <div className="glass-panel p-8 rounded-[32px] border-[#d4af37]/30 bg-[#0a0a0a]/80 shadow-2xl">
                    <h4 className="font-luxury text-2xl text-primary mb-8 tracking-tighter">Selected Seat Details</h4>
                    
                    {currentSeatId ? (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="pb-6 border-b border-white/5">
                                <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-500 mb-2">Reference HUB</p>
                                <div className="flex items-center justify-between">
                                    <h5 className="text-3xl font-black italic tracking-tighter text-white">{currentSeatId}</h5>
                                    <span className="text-[10px] font-black uppercase text-primary px-3 py-1 bg-primary/10 rounded-full">{currentSeatData?.class || 'Elite'}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-[11px] font-bold">
                                    <span className="text-slate-500 uppercase tracking-widest">Type</span>
                                    <span className="text-[var(--app-text)] italic">{currentSeatData?.class === 'Economy' ? 'Standard Seating' : 'Premium Recliner'}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] font-bold">
                                    <span className="text-slate-500 uppercase tracking-widest">Seat Price</span>
                                    <span className="text-[var(--app-text)]">{currentPrice === 0 ? 'Complimentary' : <PriceDisplay amount={currentPrice} currency="INR" />}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] font-bold">
                                    <span className="text-slate-500 uppercase tracking-widest">Add-ons</span>
                                    <span className="text-primary italic">Priority Boarding (+<PriceDisplay amount={20} currency="INR" />)</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                <div className="flex justify-between items-end mb-8">
                                    <p className="text-[10px] font-black uppercase tracking-[3px] text-slate-500">Total Price</p>
                                    <p className="text-4xl font-black text-[var(--app-text)] italic tracking-tighter"><PriceDisplay amount={totalPrice} currency="INR" /></p>
                                </div>

                                <button 
                                    onClick={handleConfirm}
                                    disabled={Object.keys(selectedSeats).length < passengerCount}
                                    className={`w-full py-6 rounded-2xl font-black text-[11px] uppercase tracking-[4px] shadow-[0_20px_40px_rgba(212,175,55,0.2)] transition-all duration-500 flex items-center justify-center gap-3
                                        ${Object.keys(selectedSeats).length === passengerCount ? 'bg-gradient-to-r from-[#d4af37] to-[#b5942f] text-dark hover:scale-105 hover:shadow-[0_25px_50px_rgba(212,175,55,0.3)] cursor-pointer' : 'bg-white/5 text-slate-500 cursor-not-allowed opacity-50'}`}
                                >
                                    Confirm & Continue <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="py-20 text-center space-y-6">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                <Info className="text-slate-600" size={32} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[4px] text-slate-500 leading-relaxed">
                                Please select a suitable berth <br/> for <span className="text-primary">{passengers[activePassenger]?.name}</span>
                            </p>
                            <button 
                                onClick={handleAssignFreeSeat}
                                className="w-full mt-4 py-4 rounded-xl border border-white/10 hover:border-primary/50 text-[10px] font-black uppercase tracking-[2px] text-[var(--app-text)] bg-white/5 hover:bg-primary/10 transition-all flex items-center justify-center gap-2"
                            >
                                <Check size={14} className="text-primary" /> Assign Free Seat
                            </button>
                        </div>
                    )}
                </div>

                <div className="mt-10 p-8 border border-white/5 rounded-[32px] space-y-6 flex items-center justify-between cursor-pointer group" onClick={() => dispatch({ type: 'SET_CURRENT_STEP', payload: 'results' })}>
                    <div className="flex items-center gap-4">
                        <Shield size={20} className="text-primary opacity-50" />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest group-hover:text-primary transition-colors">Abort Selection</p>
                            <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Return to Flight List</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* 5. Bottom Legend Bar */}
            <footer className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-3xl border-t border-[var(--border-color)] p-6 z-50 overflow-x-auto no-scrollbar">
                <div className="flex items-center justify-center gap-10 whitespace-nowrap min-w-max">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-b from-[#d4af37] to-[#8b7322] rounded-sm"></div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">First Class</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] rounded-sm"></div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Business Class</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#581c87] rounded-sm"></div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Premium Econ</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-[#115e59] rounded-sm flex items-center justify-center font-bold text-[6px] text-white">0</div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Economy (Free)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Star size={10} className="text-slate-500" fill="currentColor" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Premium</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <X size={10} className="text-slate-600" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Blocked</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SeatMap;
