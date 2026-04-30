import React from 'react';
import CurrencyCalculator from '../components/shared/CurrencyCalculator';

export default function CurrencyCalculatorPage({ darkMode }) {
  const bg = darkMode ? '#0A0F1A' : '#f8fafc';
  const text = darkMode ? '#f0ece4' : '#1e293b';

  return (
    <div className="min-h-screen pt-32 pb-20" style={{ background: bg, color: text }}>
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black uppercase tracking-tighter mb-4 italic">
            Universal <span className="text-primary text-[#C8A84B]">Currency</span> Hub
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
            Access real-time exchange rates across 160+ global currencies. Plan your journey with precision using our premium conversion utility.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <CurrencyCalculator darkMode={darkMode} />
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-12 text-center">
          <div>
            <h3 className="text-[#C8A84B] font-black uppercase tracking-widest text-xs mb-4">Live Markets</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Direct integration with global exchange nodes ensures you get the most accurate rates for every transaction.</p>
          </div>
          <div>
            <h3 className="text-[#C8A84B] font-black uppercase tracking-widest text-xs mb-4">Precision Grade</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Calculating down to 4 decimal places for high-value conversions and professional travel planning.</p>
          </div>
          <div>
            <h3 className="text-[#C8A84B] font-black uppercase tracking-widest text-xs mb-4">Universal Logic</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Integrated across the SkyVoyage booking engine to provide a seamless pricing experience in your preferred currency.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
