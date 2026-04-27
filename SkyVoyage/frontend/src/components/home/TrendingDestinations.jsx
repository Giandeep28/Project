import React from 'react';
import { motion } from 'framer-motion';
import PriceDisplay from '../../components/shared/PriceDisplay';

const DESTINATIONS = [
    { city: 'MALDIVES', price: 445000, img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800' },
    { city: 'ST. MORITZ', price: 615000, img: 'https://images.unsplash.com/photo-1502943693086-33b5b1cfdf2f?auto=format&fit=crop&q=80&w=800' },
    { city: 'MONACO', price: 855000, img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800' }
];

const TrendingDestinations = () => {
    return (
        <section className="py-32 bg-[var(--app-bg)]">
            <div className="container mx-auto px-6 lg:px-12">
                {/* Section Header */}
                <div className="max-w-3xl mb-16 space-y-4">
                    <span className="text-primary font-black uppercase tracking-[6px] text-[10px]">Elite Navigations</span>
                    <h2 className="text-5xl lg:text-7xl font-luxury font-black text-[var(--app-text)] italic tracking-tighter uppercase leading-tight">
                        Trending <br /> <span className="text-primary">Destinations</span>
                    </h2>
                </div>

                {/* Grid Container */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {DESTINATIONS.map((dest, idx) => (
                        <motion.div 
                            key={dest.city}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            whileHover={{ y: -15 }}
                            className="group relative cursor-pointer"
                        >
                            {/* Strict 3:4 Aspect Ratio Card */}
                            <div className="aspect-[3/4] overflow-hidden rounded-[3rem] border border-[var(--border-color)] relative bg-white/5">
                                <img 
                                    src={dest.img} 
                                    alt={dest.city} 
                                    className="w-full h-full object-cover grayscale-[0.2] transition-transform duration-1000 group-hover:scale-110 group-hover:grayscale-0"
                                />
                                {/* Bottom-to-Top Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[var(--app-bg)] via-[var(--app-bg)]/40 to-transparent"></div>

                                
                                {/* Bottom Anchored Text */}
                                <div className="absolute bottom-10 left-10 right-10">
                                    <h3 className="text-3xl font-luxury font-black text-white italic mb-2">{dest.city}</h3>
                                    <div className="flex justify-between items-center border-t border-white/10 pt-4">
                                        <span className="text-primary font-black uppercase text-[10px] tracking-widest">Starts From</span>
                                        <span className="text-white font-luxury italic text-xl"><PriceDisplay amount={dest.price} currency="INR" /></span>
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrendingDestinations;
