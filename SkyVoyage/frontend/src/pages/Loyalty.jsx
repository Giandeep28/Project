import React from 'react';
import { useApp } from '../context/AppContext';

const Loyalty = () => {
    return (
        <div className="min-h-screen bg-[var(--app-bg)]">
            <main className="container mx-auto px-6 py-32">
                <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-12">
                    {/* Tier Card */}
                    <div className="lg:col-span-12">
                        <div className="glass-panel p-12 lg:p-20 rounded-[60px] relative overflow-hidden group border-white/5 shadow-2xl animate-fade-in">
                           <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/20 blur-[120px] rounded-full group-hover:bg-primary/40 transition-all duration-1000"></div>
                           <div className="relative z-10">
                               <span className="text-primary font-black uppercase tracking-[4px] text-[10px] block mb-6 animate-pulse">SkyMiles Recognition</span>
                               <h2 className="text-5xl lg:text-7xl font-black mb-8 italic uppercase leading-[0.9]">ELITE GOLD<br/><span className="text-white/20">MEMBERSHIP</span></h2>
                               <div className="flex items-end gap-12">
                                   <div className="flex-1">
                                       <div className="flex justify-between text-[10px] font-black uppercase mb-4 tracking-widest text-slate-500">
                                           <span>Progress to Platinum</span>
                                           <span className="text-primary italic">85% Complete</span>
                                       </div>
                                       <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                           <div className="h-full bg-primary w-[85%]"></div>
                                       </div>
                                   </div>
                                   <div className="text-right">
                                       <p className="text-6xl font-black text-primary leading-none tracking-tighter italic">125,480</p>
                                       <span className="text-[9px] font-black uppercase tracking-[4px] text-slate-500">Available Miles</span>
                                   </div>
                               </div>
                           </div>
                        </div>
                    </div>

                    {/* Left: History */}
                    <div className="lg:col-span-8 space-y-8 animate-slide-up [animation-delay:0.3s]">
                        <div className="glass-panel p-10 rounded-[40px] border-white/5">
                            <h3 className="text-2xl font-black mb-10 uppercase italic tracking-widest">Privilege History</h3>
                            <div className="space-y-6">
                                <HistoryItem 
                                    icon="fa-gift" 
                                    title="Bonus Points Awarded" 
                                    desc="Annual Anniversary Perk" 
                                    val="+5,000 MILES" 
                                    active 
                                />
                                <HistoryItem 
                                    icon="fa-plane-departure" 
                                    title="Flight DEL ➔ BOM" 
                                    desc="Booking Ref: SV-99120" 
                                    val="+2,480 MILES" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right: Quick Action */}
                    <div className="lg:col-span-4 bg-primary p-12 rounded-[40px] flex flex-col justify-between text-dark group hover:bg-white transition-all duration-500 cursor-pointer shadow-2xl animate-slide-up [animation-delay:0.4s]">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[4px] opacity-60">Quick Action</span>
                            <h3 className="text-3xl font-black mt-6 leading-tight uppercase italic">Redeem For<br/>First Class Upgrade</h3>
                        </div>
                        <i className="fas fa-arrow-right text-4xl mt-12 group-hover:translate-x-4 transition-transform"></i>
                    </div>
                </div>
            </main>
        </div>
    );
};

const HistoryItem = ({ icon, title, desc, val, active }) => (
    <div className={`flex justify-between items-center p-6 bg-white/5 rounded-3xl border border-white/5 transition-all hover:border-primary/30 ${!active && 'opacity-60'}`}>
        <div className="flex items-center gap-6">
            <div className={`text-2xl ${active ? 'text-primary' : 'text-white'}`}><i className={`fas ${icon}`}></i></div>
            <div>
                <p className="text-xs font-black uppercase tracking-widest">{title}</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-wider">{desc}</p>
            </div>
        </div>
        <span className={`text-xs font-black ${active ? 'text-primary' : 'text-white'} italic`}>{val}</span>
    </div>
);

export default Loyalty;
