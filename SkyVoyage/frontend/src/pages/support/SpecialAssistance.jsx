import React, { useState } from 'react';
import { HeartHandshake, FileCheck, Dog, Activity, CheckCircle2 } from 'lucide-react';

export default function SpecialAssistance({ darkMode }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const categories = [
    { title: 'Wheelchair Support', icon: <Activity className="w-6 h-6"/>, desc: 'Assistance from check-in to your seat, including buggy services at major hubs.' },
    { title: 'Medical Clearance', icon: <FileCheck className="w-6 h-6"/>, desc: 'Submit MEDIF forms for passengers requiring oxygen, stretchers, or special medical clearance.' },
    { title: 'Traveling with Pets', icon: <Dog className="w-6 h-6"/>, desc: 'Policies and booking requests for emotional support animals and pets in the cabin/cargo.' }
  ];

  return (
    <div className={`min-h-screen pt-24 pb-12 ${darkMode ? 'bg-[var(--app-bg)] text-[var(--app-text)]' : 'bg-white text-slate-900'}`}>
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        <div className="text-center mb-16">
          <HeartHandshake className="w-12 h-12 text-primary mx-auto mb-6" />
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Special Assistance</h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">Ensuring a comfortable, safe, and dignified journey for every passenger. Because excellence in air means caring for all.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Info Side */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-widest mb-8 border-b border-[var(--border-color)] pb-4">Assistance Categories</h2>
            {categories.map((cat, idx) => (
              <div key={idx} className="flex gap-6 p-6 border border-[var(--border-color)] rounded-2xl bg-white/5 hover:border-primary/50 transition-all">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {cat.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 uppercase">{cat.title}</h3>
                  <p className="text-slate-400 font-medium text-sm leading-relaxed">{cat.desc}</p>
                </div>
              </div>
            ))}
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl mt-8">
              <h4 className="font-bold text-primary mb-2">Important Notice</h4>
              <p className="text-sm text-slate-300">To guarantee the best possible service, please submit all special assistance requests at least 48 hours prior to your scheduled departure.</p>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-5">
            <div className="bg-white/5 border border-[var(--border-color)] rounded-3xl p-8 sticky top-24">
              <h2 className="text-xl font-black uppercase tracking-widest mb-6 border-b border-[var(--border-color)] pb-4">Request Service</h2>
              
              {submitted ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Request Submitted</h3>
                  <p className="text-slate-400 text-sm">Your PNR has been updated with the special request. Our team will contact you if further documentation is needed.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Booking Reference (PNR)</label>
                    <input required type="text" placeholder="e.g. SKY123" className="w-full bg-black/40 border border-[var(--border-color)] rounded-xl px-4 py-3 font-bold text-sm outline-none uppercase" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Assistance Type</label>
                    <select required className="w-full bg-black/40 border border-[var(--border-color)] rounded-xl px-4 py-3 font-bold text-sm outline-none appearance-none [color-scheme:dark]">
                      <option value="">Select an option...</option>
                      <option value="wc">Wheelchair to Gate/Seat</option>
                      <option value="med">Medical Equipment / Oxygen</option>
                      <option value="pet">Traveling with Pet / ESA</option>
                      <option value="vis">Visual / Hearing Impairment</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Additional Details (Optional)</label>
                    <textarea rows="3" className="w-full bg-black/40 border border-[var(--border-color)] rounded-xl px-4 py-3 font-bold text-sm outline-none resize-none"></textarea>
                  </div>
                  <button type="submit" className="w-full bg-primary text-dark font-black text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-white transition-all">Submit Request</button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
