import React from 'react';
import HeroSearch from '../search/HeroSearch';
import { motion } from 'framer-motion';

const Hero = ({ darkMode }) => {
    return (
        <section className="relative min-h-[110vh] overflow-hidden bg-[var(--app-bg)]">
            {/* Background Layer with Dark Gradient Overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=2000" 
                    alt="Luxury Flight Path" 
                    className="w-full h-full object-cover opacity-60 grayscale-[0.5]"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--app-bg)] via-[var(--app-bg)]/80 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--app-bg)]/20 via-transparent to-[var(--app-bg)]"></div>
            </div>


            <div className="container mx-auto px-6 lg:px-12 relative z-30 pt-40 pb-20">
                {/* Enforced Split-Screen Configuration */}
                <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-center w-full">
                    
                    {/* Left Column: Typography (60% Width) */}
                    <motion.div 
                        initial={{ opacity: 0, x: -60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="space-y-12 text-center lg:text-left flex-1"
                    >
                        <div className="flex items-center justify-center lg:justify-start gap-4">
                            <span className="text-primary font-black uppercase tracking-[8px] text-[11px]">Elite Charter Group</span>
                            <div className="h-px w-24 bg-primary/30"></div>
                        </div>

                        <div className="space-y-8">
                            <h1 className="text-6xl md:text-8xl lg:text-[110px] font-luxury font-black text-[var(--app-text)] leading-[0.8] tracking-tighter uppercase italic">
                                Beyond <br />
                                <span className="text-primary">The</span> Horizon
                            </h1>
                            <p className="text-[var(--app-text)] opacity-60 font-body text-base lg:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium tracking-wide">
                                Experience the pinnacle of celestial navigation. Integrated private terminals, AI-powered concierges, and zero-latency global Hub access.
                            </p>
                        </div>

                        {/* Interactive Stats Panel */}
                        <div className="flex items-center justify-center lg:justify-start gap-12 pt-8">
                            <div className="flex items-center gap-4">
                                <span className="text-3xl lg:text-4xl font-luxury text-[var(--app-text)]">150+</span>
                                <span className="text-[10px] font-black uppercase tracking-[4px] text-primary">Global Hubs</span>
                            </div>
                            <div className="w-px h-16 bg-[var(--app-text)]/10 hidden md:block"></div>
                            <div className="flex items-center gap-4">
                                <span className="text-3xl lg:text-4xl font-luxury text-[var(--app-text)]">0.9s</span>
                                <span className="text-[10px] font-black uppercase tracking-[4px] text-primary">Sync Latency</span>
                            </div>
                        </div>

                    </motion.div>

                    {/* Right Column: Floating Booking Card (Fixed Width) */}
                    <div className="flex justify-center lg:justify-end w-full lg:w-auto shrink-0">
                        <div className="w-full max-w-[500px]">
                            <HeroSearch darkMode={darkMode}/>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ambient Lighting Decorations */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-sky-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        </section>
    );
};

export default Hero;
