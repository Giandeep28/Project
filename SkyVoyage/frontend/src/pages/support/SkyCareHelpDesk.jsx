import React, { useState } from 'react';
import { Headphones, MessageCircle, Mail, PhoneCall, ChevronDown } from 'lucide-react';

export default function SkyCareHelpDesk({ darkMode }) {
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    { q: 'How do I modify or cancel my flight?', a: 'You can manage your booking directly through the "Manage Trip" section using your PNR and Last Name. Premium cabin tickets offer complimentary changes up to 2 hours before departure.' },
    { q: 'What are the rules for Celestial First Class Lounge Access?', a: 'Lounge access is strictly reserved for passengers traveling in Celestial First or Celestial Business, as well as SkyVoyage Platinum members regardless of cabin class.' },
    { q: 'How can I request a special meal?', a: 'Special meals must be requested at least 24 hours before your flight departure. You can secure these preferences in your Booking Dashboard.' },
    { q: 'What do I do if my baggage is delayed?', a: 'Please report any delayed baggage immediately to the SkyVoyage Baggage Services desk located in the arrivals hall before leaving the airport.' }
  ];

  return (
    <div className={`min-h-screen pt-24 pb-12 ${darkMode ? 'bg-[var(--app-bg)] text-[var(--app-text)]' : 'bg-white text-slate-900'}`}>
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-6">
            <Headphones className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">SkyCare Help Desk</h1>
          <p className="text-xl text-slate-500 font-medium">World-class support, available 24/7. How can our concierge team assist you today?</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-24">
          <div className="bg-white/5 border border-[var(--border-color)] p-8 rounded-2xl text-center hover:bg-white/10 transition-all cursor-pointer">
            <PhoneCall className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-black uppercase mb-2">Global Support</h3>
            <p className="text-sm font-medium text-slate-400 mb-4">Immediate assistance via phone.</p>
            <span className="text-xl font-bold text-primary">+1 (800) SKY-VOYG</span>
          </div>
          <div className="bg-primary/10 border border-primary/30 p-8 rounded-2xl text-center relative overflow-hidden cursor-pointer group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-2xl rounded-full group-hover:scale-150 transition-all"></div>
            <MessageCircle className="w-8 h-8 text-primary mx-auto mb-4 relative z-10" />
            <h3 className="text-lg font-black uppercase mb-2 relative z-10">Live Concierge</h3>
            <p className="text-sm font-medium text-primary/80 mb-4 relative z-10">Chat with a live agent now.</p>
            <button className="bg-primary text-dark text-xs font-black uppercase tracking-widest px-6 py-2 rounded-lg relative z-10">Start Chat</button>
          </div>
          <div className="bg-white/5 border border-[var(--border-color)] p-8 rounded-2xl text-center hover:bg-white/10 transition-all cursor-pointer">
            <Mail className="w-8 h-8 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-black uppercase mb-2">Email Desk</h3>
            <p className="text-sm font-medium text-slate-400 mb-4">For non-urgent inquiries.</p>
            <span className="text-sm font-bold text-primary">support@skyvoyage.com</span>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-black uppercase tracking-widest mb-8 text-center border-b border-[var(--border-color)] pb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-[var(--border-color)] rounded-xl bg-white/5 overflow-hidden">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                  className="w-full text-left px-6 py-5 flex justify-between items-center hover:bg-white/5 transition-all"
                >
                  <span className="font-bold text-lg">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-primary transition-all duration-300 ${openFaq === idx ? 'transform rotate-180' : ''}`} />
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-40 py-5 border-t border-[var(--border-color)]' : 'max-h-0'}`}>
                  <p className="text-slate-400 font-medium leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
