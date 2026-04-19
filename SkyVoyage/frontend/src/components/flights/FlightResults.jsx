import React from 'react';
import FlightCard from './FlightCard';

const FlightResults = ({ flights, loading }) => {
    if (loading) {
        return (
            <div className="space-y-6">
                {[1, 2, 3].map((n) => (
                    <div key={n} className="bg-white/5 border border-white/10 rounded-[40px] p-10 animate-pulse">
                        <div className="flex justify-between items-center mb-10">
                            <div className="flex gap-6 items-center">
                                <div className="w-16 h-16 bg-white/10 rounded-2xl"></div>
                                <div className="space-y-2">
                                    <div className="h-3 w-24 bg-white/10 rounded-full"></div>
                                    <div className="h-2 w-16 bg-white/10 rounded-full opacity-50"></div>
                                </div>
                            </div>
                            <div className="flex gap-12 items-center">
                                <div className="text-center space-y-2">
                                    <div className="h-4 w-12 bg-white/10 rounded-full"></div>
                                    <div className="h-2 w-8 bg-white/10 rounded-full mx-auto opacity-50"></div>
                                </div>
                                <div className="w-40 h-1 bg-white/10 rounded-full relative">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white/10 rounded-full"></div>
                                </div>
                                <div className="text-center space-y-2">
                                    <div className="h-4 w-12 bg-white/10 rounded-full"></div>
                                    <div className="h-2 w-8 bg-white/10 rounded-full mx-auto opacity-50"></div>
                                </div>
                            </div>
                            <div className="w-40 h-12 bg-white/10 rounded-2xl"></div>
                        </div>
                        <div className="flex justify-between border-t border-white/5 pt-6">
                            <div className="flex gap-4">
                                <div className="h-6 w-20 bg-white/5 rounded-full"></div>
                                <div className="h-6 w-20 bg-white/5 rounded-full"></div>
                            </div>
                            <div className="h-4 w-24 bg-white/5 rounded-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!flights || flights.length === 0) {
        return (
            <div className="py-40 text-center animate-fade-in">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
                    <i className="fas fa-plane-slash text-slate-700 text-3xl"></i>
                </div>
                <h3 className="text-xl font-black uppercase tracking-[4px] text-slate-500 mb-2">No Cosmic Bridges Detected</h3>
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-700">Refine your hub coordinates to re-initialize</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {flights.map((flight, i) => (
                <FlightCard key={flight.flightNumber || i} flight={flight} index={i} />
            ))}
        </div>
    );
};

export default FlightResults;
