import React from 'react';
import { Plane, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../shared/Logo';

export default function Footer({ darkMode }) {
  // We force the footer to be dark for a more premium, consistent luxury feel.
  return (
    <footer className="pt-32 pb-12 border-t border-white/5 bg-[#0A0F1A] text-white">
      <div className="container mx-auto px-6 lg:px-12 grid lg:grid-cols-12 gap-16 mb-24">
        <div className="lg:col-span-12 mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
            <Logo size="xl" vertical={true} showTagline={true} isDarkBackground={true} />
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
            <li><Link to="/services/international-routes" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-500 hover:text-white transition-all uppercase">International Routes</Link></li>
            <li><Link to="/services/domestic-hubs" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-500 hover:text-white transition-all uppercase">Domestic Hubs</Link></li>
            <li><Link to="/services/charter-booking" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-500 hover:text-white transition-all uppercase">Charter Booking</Link></li>
            <li><Link to="/services/cargo-express" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-500 hover:text-white transition-all uppercase">Cargo Express</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-8">Support Hub</h4>
          <ul className="space-y-4">
            <li><Link to="/support/skycare-help-desk" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-500 hover:text-white transition-all uppercase">SkyCare Help Desk</Link></li>
            <li><Link to="/support/baggage-policies" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-500 hover:text-white transition-all uppercase">Baggage Policies</Link></li>
            <li><Link to="/support/refund-request" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-500 hover:text-white transition-all uppercase">Refund Request</Link></li>
            <li><Link to="/support/special-assistance" target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-slate-500 hover:text-white transition-all uppercase">Special Assistance</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-6 border-l border-white/10 pl-12 invisible lg:visible">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-8">Celestial Letter</h4>
          <p className="text-sm text-slate-500 mb-8 max-w-md font-medium leading-relaxed">Join our inner circle for privileged access to seasonal flash deals and premium travel guides.</p>
          <div className="flex gap-4 max-w-md">
            <input 
              type="email" 
              placeholder="Email Dashboard" 
              className="flex-1 bg-white/5 border border-white/10 p-5 rounded-2xl font-bold outline-none focus:border-primary transition-all text-[#f0ece4] placeholder:text-slate-700" 
            />
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
