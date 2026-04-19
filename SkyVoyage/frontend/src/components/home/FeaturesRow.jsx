import React from 'react';
import { ShieldCheck, CircleDollarSign, Wind, Headset } from 'lucide-react';

const FEATURES = [
    { label: 'SECURE BOOKING', icon: <ShieldCheck size={28} /> },
    { label: 'BEST FARE POLICY', icon: <CircleDollarSign size={28} /> },
    { label: 'PREMIUM FLEET', icon: <Wind size={28} /> },
    { label: '24/7 CONCIERGE', icon: <Headset size={28} /> }
];

const FeaturesRow = ({ darkMode }) => {
    return (
        <section className="py-16 border-y" style={{ background: darkMode ? '#0A0F1A' : '#ffffff', borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-center">
                    {FEATURES.map((item, idx) => (
                        <div key={idx} className="flex flex-col lg:flex-row items-center justify-center lg:justify-start gap-5 group cursor-crosshair transition-all duration-500">
                            <div className="p-5 rounded-2xl transition-all duration-500 shadow-[0_0_15px_rgba(200,168,75,0.15)] group-hover:shadow-[0_0_25px_rgba(200,168,75,0.3)]"
                                style={{ background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(200,168,75,0.05)', color: '#C8A84B' }}>
                                {item.icon}
                            </div>
                            <div className="flex flex-col items-center lg:items-start">
                                <span className="text-[12px] font-black uppercase tracking-[4px] transition-all duration-500"
                                    style={{ color: darkMode ? '#f0ece4' : '#111827', opacity: 0.9 }}>
                                    {item.label}
                                </span>
                                <div className="h-[2px] w-8 mt-2 transition-all duration-700 group-hover:w-full" style={{ background: '#C8A84B' }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesRow;
