import React from 'react';
import { useParams } from 'react-router-dom';

export default function Placeholder({ darkMode }) {
  const { slug } = useParams();
  
  // Format slug to human-readable title
  const title = slug 
    ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Information';

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[var(--app-bg)] text-[var(--app-text)]' : 'bg-white text-slate-900'} py-24`}>
      <div className="container mx-auto px-6 text-center">
        <span className="text-6xl mb-6 block">✈️</span>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
          {title}
        </h1>
        <p className="text-lg md:text-xl font-medium text-slate-500 max-w-2xl mx-auto mb-8">
          This feature is currently under premium development to ensure the highest standard of excellence in your SkyVoyage experience.
        </p>
        <button 
          onClick={() => window.close()}
          className="bg-primary text-dark px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all inline-flex items-center gap-2"
        >
          Close Window
        </button>
      </div>
    </div>
  );
}
