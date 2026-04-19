import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Utensils, ArrowRight } from 'lucide-react';

const Privileges = ({ darkMode }) => {
    return (
        <section className="py-32" style={{ background: darkMode ? '#0A0F1A' : '#ffffff' }}>
            <div className="container mx-auto px-6 lg:px-12">
                {/* Section Header */}
                <div className="text-center mb-24 space-y-4">
                    <span className="font-black uppercase tracking-[8px] text-[10px]" style={{ color: '#C8A84B' }}>Privileged Access</span>
                    <h2 className="text-5xl lg:text-7xl font-serif font-black italic tracking-tighter uppercase leading-tight" style={{ color: darkMode ? '#f0ece4' : '#111827' }}>
                        Exclusive <span style={{ color: '#C8A84B' }}>Ecosystem</span>
                    </h2>
                </div>

                {/* Bento Box Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-8 h-auto lg:h-[700px]">
                    
                    {/* Main Feature: EXECUTIVE CORRIDOR */}
                    <motion.div 
                        whileHover={{ scale: 0.98 }}
                        className="md:col-span-2 md:row-span-2 rounded-[3rem] relative overflow-hidden group p-12 flex flex-col justify-end min-h-[400px]"
                        style={{ border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`, background: darkMode ? '#111827' : '#f9f8f3' }}
                    >
                        <img 
                            src="/executive-corridor.png" 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" 
                            style={{ opacity: darkMode ? 0.35 : 0.4 }}
                            alt="Executive Lounge"
                        />
                        <div className="absolute inset-0" style={{ background: darkMode ? 'linear-gradient(to top, rgba(10,15,26,0.9), transparent)' : 'linear-gradient(to top, rgba(255,255,255,0.95), transparent)' }}></div>
                        <div className="relative z-10 space-y-6">
                            <h3 className="text-4xl lg:text-5xl font-serif font-black italic tracking-tighter uppercase" style={{ color: darkMode ? '#f0ece4' : '#111827' }}>Executive <br /> Corridor</h3>
                            <p className="opacity-90 font-bold uppercase tracking-[3px] text-[10px] max-w-xs leading-relaxed" style={{ color: darkMode ? '#f0ece4' : '#111827' }}>
                                Curated private terminals at over 80 international hubs. Zero-wait entry protocols.
                            </p>
                            <button className="text-[10px] font-black uppercase tracking-widest pb-2 transition-all flex items-center gap-2" style={{ color: '#C8A84B', borderBottom: '1px solid rgba(200,168,75,0.4)', width: 'fit-content' }}>
                                Explore Membership Hub <ArrowRight size={12} />
                            </button>
                        </div>
                    </motion.div>

                    {/* Feature 2: SCHOLAR ASCENT */}
                    <motion.div 
                        whileHover={{ scale: 0.98 }}
                        className="md:col-span-2 md:row-span-1 rounded-[3rem] relative overflow-hidden group p-10 flex flex-col justify-center min-h-[250px]"
                        style={{ border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`, background: darkMode ? '#111827' : '#f9f8f3' }}
                    >
                        <img 
                            src="/scholar-ascent.png" 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" 
                            style={{ opacity: darkMode ? 0.35 : 0.4 }}
                            alt="Scholar Ascent"
                        />
                        <div className="absolute inset-0" style={{ background: darkMode ? 'linear-gradient(to right, rgba(10,15,26,0.9), transparent)' : 'linear-gradient(to right, rgba(255,255,255,0.9), transparent)' }}></div>
                        <div className="relative z-10 space-y-4">
                            <span className="font-black uppercase tracking-[4px] text-[9px]" style={{ color: '#C8A84B' }}>Celestial Tier</span>
                            <h3 className="text-3xl font-serif font-black italic tracking-tighter uppercase" style={{ color: darkMode ? '#f0ece4' : '#111827' }}>Scholar Ascent</h3>
                            <p className="opacity-90 font-bold uppercase tracking-[3px] text-[10px] max-w-sm" style={{ color: darkMode ? '#f0ece4' : '#111827' }}>
                                Exclusive mentorship and networking hubs at 35,000 feet. Connect with the world's elite creators.
                            </p>
                        </div>
                    </motion.div>

                    {/* Feature 3: GLOBAL RESIDENCY */}
                    <motion.div 
                        whileHover={{ scale: 0.98 }}
                        className="md:col-span-1 md:row-span-1 rounded-[3rem] relative overflow-hidden flex flex-col items-center justify-center text-center p-8 group min-h-[250px]"
                        style={{ border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}`, background: darkMode ? '#111827' : '#f9f8f3' }}
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800" 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" 
                            style={{ opacity: darkMode ? 0.35 : 0.4 }}
                            alt="Global Residency"
                        />
                        <div className="absolute inset-0" style={{ background: darkMode ? 'rgba(10,15,26,0.5)' : 'rgba(255,255,255,0.5)' }}></div>
                        
                       <div className="space-y-4 relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 bg-white/10 group-hover:bg-[#C8A84B] group-hover:text-black"
                                style={{ color: '#C8A84B', backdropFilter: 'blur(10px)' }}>
                                <Globe size={28} />
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-[4px]" style={{ color: darkMode ? '#f0ece4' : '#111827' }}>Global Residency</h4>
                       </div>
                    </motion.div>

                    {/* Feature 4: SIGNATURE DINING */}
                    <motion.div 
                        whileHover={{ scale: 0.98 }}
                        className="md:col-span-1 md:row-span-1 rounded-[3rem] relative overflow-hidden flex flex-col items-center justify-center text-center p-8 group min-h-[250px]"
                        style={{ background: '#C8A84B', color: '#0A0F1A' }}
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=800" 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" 
                            style={{ opacity: 0.35, mixBlendMode: 'multiply' }}
                            alt="Signature Dining"
                        />
                       <div className="space-y-4 relative z-10 flex flex-col items-center">
                            <Utensils size={32} className="opacity-90" />
                            <h4 className="text-sm font-black uppercase tracking-[4px]">Signature <br /> Dining</h4>
                            <span className="block italic font-serif text-[11px] font-bold tracking-widest opacity-90">MICHELIN STARRED</span>
                       </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default Privileges;
