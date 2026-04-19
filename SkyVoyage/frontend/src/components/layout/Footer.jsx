import React from 'react';
import { Plane, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="pt-32 pb-12 border-t border-[var(--border-color)] bg-[var(--app-bg)] text-[var(--app-text)]">
      <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-16 mb-24">
        <div className="lg:col-span-12 mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
            <div>
              <span className="text-4xl">✈️</span>
              <h2 className="text-3xl font-black tracking-tighter mt-4 uppercase">
                SKYVOYAGE<br />
                <span className="text-primary tracking-[8px] text-[10px] font-black uppercase block mt-2">Excellence in Air</span>
              </h2>
            </div>
            <div className="flex gap-12">
              <div className="text-center">
                <span className="block text-3xl font-black text-primary">150+</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Destinations</span>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-black text-primary">2.1M</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Happy Miles</span>
              </div>
              <div className="text-center">
                <span className="block text-3xl font-black text-primary">A+</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Safety Rating</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-8">Flight Services</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-[var(--app-text)] transition-all uppercase">International Routes</a></li>
            <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-[var(--app-text)] transition-all uppercase">Domestic Hubs</a></li>
            <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-[var(--app-text)] transition-all uppercase">Charter Booking</a></li>
            <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-[var(--app-text)] transition-all uppercase">Cargo Express</a></li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-8">Support Hub</h4>
          <ul className="space-y-4">
            <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-[var(--app-text)] transition-all uppercase">SkyCare Help Desk</a></li>
            <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-[var(--app-text)] transition-all uppercase">Baggage Policies</a></li>
            <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-[var(--app-text)] transition-all uppercase">Refund Request</a></li>
            <li><a href="#" className="text-sm font-bold text-slate-500 hover:text-[var(--app-text)] transition-all uppercase">Special Assistance</a></li>
          </ul>
        </div>

        <div className="lg:col-span-6 border-l border-[var(--border-color)] pl-12 invisible lg:visible">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-8">Celestial Letter</h4>
          <p className="text-sm text-slate-500 mb-8 max-w-md font-medium leading-relaxed">Join our inner circle for privileged access to seasonal flash deals and premium travel guides.</p>
          <div className="flex gap-4 max-w-md">
            <input type="email" placeholder="Email Dashboard" className="flex-1 bg-white/5 border border-[var(--border-color)] p-5 rounded-2xl font-bold outline-none focus:border-primary transition-all text-[var(--app-text)]" />
            <button className="bg-primary text-dark px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all">Join Now</button>
          </div>
        </div>

      </div>

      <div className="container mx-auto px-6 lg:px-12 border-t border-white/5 pt-12 flex flex-col lg:flex-row justify-between items-center gap-8">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">© 2026 SkyVoyage Airlines. Designed for Excellence.</p>
        <div className="flex gap-8">
          {/* Icons temporarily removed due to library export issues */}
        </div>
      </div>
    </footer>
  );
}
