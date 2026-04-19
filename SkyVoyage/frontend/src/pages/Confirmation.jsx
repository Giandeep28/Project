import React from 'react';
import { useApp } from '../context/AppContext';
import Navbar from '../components/layout/Navbar';

const Confirmation = () => {
    const { state, dispatch } = useApp();

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <Navbar />
            <main className="container mx-auto px-6 py-32 flex flex-col items-center">
                <div className="max-w-4xl w-full">
                    {/* Header */}
                    <div className="text-center mb-16 animate-fade-in">
                        <span className="text-primary font-black uppercase tracking-[6px] text-[10px] block mb-4">Voyage Secured</span>
                        <h2 className="text-5xl font-black italic uppercase italic leading-[0.9]">Welcome Aboard,<br/><span className="text-white/20">The Horizon Awaits</span></h2>
                    </div>

                    {/* Boarding Pass */}
                    <div id="boarding-pass" className="glass-panel overflow-hidden rounded-[40px] shadow-2xl animate-slide-up group">
                        <div className="bg-primary p-10 flex justify-between items-end text-dark">
                            <div>
                                <h3 className="text-4xl font-black tracking-tighter uppercase">Boarding Pass</h3>
                                <p className="font-black text-[10px] uppercase tracking-widest opacity-60">SkyVoyage Premium Elite</p>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Flight No</span>
                                <p className="text-2xl font-black leading-none mt-1">{state.selectedFlight?.flight_number || 'SV-502'}</p>
                            </div>
                        </div>

                        <div className="p-12 grid lg:grid-cols-3 gap-12 items-start relative bg-white/5">
                            <div className="col-span-2 space-y-12">
                                <div className="flex justify-between items-center">
                                    <div className="flex-1">
                                        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Origin Hub</span>
                                        <p className="text-4xl font-black tracking-tighter text-white">{state.from || 'DEL'}</p>
                                        <p className="text-xs font-bold text-slate-500 mt-1 uppercase">Indira Gandhi Intl</p>
                                    </div>
                                    <div className="flex flex-col items-center justify-center px-10">
                                        <i className="fas fa-plane text-primary text-xl animate-pulse"></i>
                                        <div className="w-24 h-0.5 bg-primary/20 my-4"></div>
                                    </div>
                                    <div className="flex-1 text-right">
                                        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Arrival Hub</span>
                                        <p className="text-4xl font-black tracking-tighter text-white">{state.to || 'BOM'}</p>
                                        <p className="text-xs font-bold text-slate-500 mt-1 uppercase">Chhatrapati Shivaji</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/5">
                                    <div>
                                        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Passenger</span>
                                        <p className="text-sm font-black uppercase text-white">Voyager Elite</p>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Berth Alpha</span>
                                        <p className="text-sm font-black uppercase text-primary italic">{state.selectedSeat || '14A'}</p>
                                    </div>
                                    <div>
                                        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Status</span>
                                        <p className="text-sm font-black uppercase text-green-500">Authorized</p>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1 flex flex-col items-center justify-center border-l border-white/5 pl-12 h-full">
                                <div className="bg-white p-4 rounded-3xl mb-6 shadow-2xl">
                                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SKYVOYAGE-SECURE" className="w-32 h-32 grayscale brightness-0 transition-all" alt="QR Code" />
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-[3px] text-slate-600">SKY-SECURE-882291</p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-16 flex gap-6 justify-center">
                        <button className="btn-gold px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl flex items-center gap-4 hover:scale-105 transition-all">
                            <i className="fas fa-file-pdf"></i> Download E-Ticket
                        </button>
                        <button 
                            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'home' })}
                            className="bg-white/5 px-12 py-5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 hover:border-primary transition-all"
                        >
                            Return to Hub
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Confirmation;
