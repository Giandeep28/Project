import React, { useState } from 'react';
import { BaggageClaim, Briefcase, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function BaggagePolicies({ darkMode }) {
  const [activeTab, setActiveTab] = useState('cabin');

  return (
    <div className={`min-h-screen pt-24 pb-12 ${darkMode ? 'bg-[var(--app-bg)] text-[var(--app-text)]' : 'bg-white text-slate-900'}`}>
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
        <div className="text-center mb-16">
          <BaggageClaim className="w-12 h-12 text-primary mx-auto mb-6" />
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4">Baggage Policies</h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto">Clear, comprehensive guidelines to ensure your luggage arrives with the same precision and care as you do.</p>
        </div>

        <div className="flex justify-center mb-12 border-b border-[var(--border-color)]">
          <div className="flex gap-8">
            <button 
              onClick={() => setActiveTab('cabin')}
              className={`pb-4 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'cabin' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-[var(--app-text)]'}`}
            >
              Cabin Baggage
            </button>
            <button 
              onClick={() => setActiveTab('checked')}
              className={`pb-4 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'checked' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-[var(--app-text)]'}`}
            >
              Checked Baggage
            </button>
            <button 
              onClick={() => setActiveTab('prohibited')}
              className={`pb-4 text-sm font-black uppercase tracking-widest transition-all ${activeTab === 'prohibited' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 hover:text-[var(--app-text)]'}`}
            >
              Prohibited Items
            </button>
          </div>
        </div>

        <div className="bg-white/5 border border-[var(--border-color)] rounded-3xl p-8 lg:p-12">
          {activeTab === 'cabin' && (
            <div className="animate-in fade-in zoom-in duration-300">
              <div className="flex items-start gap-6 mb-8">
                <Briefcase className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-black uppercase mb-2">Carry-On Allowances</h2>
                  <p className="text-slate-400 font-medium">All passengers are allowed one primary carry-on bag and one smaller personal item.</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 border border-[var(--border-color)] rounded-xl bg-black/20">
                  <h3 className="font-bold text-lg mb-4 text-primary">Standard Carry-On</h3>
                  <ul className="space-y-3 text-sm font-medium text-slate-300">
                    <li className="flex justify-between border-b border-white/10 pb-2"><span>Max Weight (Economy)</span> <span className="font-bold text-white">7 kg (15 lbs)</span></li>
                    <li className="flex justify-between border-b border-white/10 pb-2"><span>Max Weight (First/Business)</span> <span className="font-bold text-white">14 kg (30 lbs)</span></li>
                    <li className="flex justify-between pt-1"><span>Dimensions</span> <span className="font-bold text-white">55 x 38 x 20 cm</span></li>
                  </ul>
                </div>
                <div className="p-6 border border-[var(--border-color)] rounded-xl bg-black/20">
                  <h3 className="font-bold text-lg mb-4 text-primary">Personal Item</h3>
                  <ul className="space-y-3 text-sm font-medium text-slate-300">
                    <li className="flex justify-between border-b border-white/10 pb-2"><span>Examples</span> <span className="font-bold text-white text-right">Handbag, Laptop bag, Small backpack</span></li>
                    <li className="flex justify-between pt-1"><span>Dimensions</span> <span className="font-bold text-white">45 x 35 x 20 cm</span></li>
                  </ul>
                  <p className="mt-4 text-xs text-slate-500 italic">*Must fit perfectly under the seat in front of you.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'checked' && (
            <div className="animate-in fade-in zoom-in duration-300">
              <h2 className="text-2xl font-black uppercase mb-8 border-b border-[var(--border-color)] pb-4">Checked Baggage Limits by Class</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] text-xs uppercase tracking-widest text-slate-500">
                      <th className="pb-4 font-bold">Cabin Class</th>
                      <th className="pb-4 font-bold">Piece Concept (Routes to US/Americas)</th>
                      <th className="pb-4 font-bold">Weight Concept (All other routes)</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-white/5">
                      <td className="py-4 font-bold text-primary">Celestial First</td>
                      <td className="py-4">3 pieces (up to 32kg/70lb each)</td>
                      <td className="py-4">50 kg total weight</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-4 font-bold text-primary">Celestial Business</td>
                      <td className="py-4">2 pieces (up to 32kg/70lb each)</td>
                      <td className="py-4">40 kg total weight</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-4 font-bold">Premium Economy</td>
                      <td className="py-4">2 pieces (up to 23kg/50lb each)</td>
                      <td className="py-4">30 kg total weight</td>
                    </tr>
                    <tr>
                      <td className="py-4 font-bold">Economy</td>
                      <td className="py-4">1 piece (up to 23kg/50lb)</td>
                      <td className="py-4">20 kg total weight</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'prohibited' && (
            <div className="animate-in fade-in zoom-in duration-300">
               <div className="flex items-start gap-6 mb-8">
                <AlertTriangle className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                <div>
                  <h2 className="text-2xl font-black uppercase mb-2">Restricted & Prohibited Items</h2>
                  <p className="text-slate-400 font-medium">For the safety of all passengers and crew, the following items are strictly regulated.</p>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  'Explosives, fireworks, and flares',
                  'Flammable liquids, solids, and gases',
                  'Lithium batteries > 160Wh (Not permitted anywhere)',
                  'Toxic and infectious substances',
                  'Corrosives (e.g., car batteries, acids)',
                  'Radioactive materials',
                  'Self-balancing boards (Hoverboards)',
                  'Bear spray and mace'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-red-900/10 border border-red-900/30 rounded-xl">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="font-bold text-sm text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
