import React, { useState, useMemo } from 'react';
import { 
  Armchair, 
  Crown, 
  Check, 
  Info, 
  Wind, 
  Navigation 
} from 'lucide-react';

/**
 * MOCK DATA
 * Defined as a separate constant for clarity
 */
const SEAT_DATA = [
  // Front Section (Royal - 1-1 Config)
  { id: '1A', label: '1A', type: 'Royal', price: 12500, isOccupied: false, specs: 'Window, Extra Legroom' },
  { id: '1K', label: '1K', type: 'Royal', price: 12500, isOccupied: true, specs: 'Window, Extra Legroom' },
  { id: '2A', label: '2A', type: 'Royal', price: 11000, isOccupied: false, specs: 'Window, Standard Legroom' },
  { id: '2K', label: '2K', type: 'Royal', price: 11000, isOccupied: false, specs: 'Window, Standard Legroom' },
  
  // Main Cabin (Sky - 2-2 Config)
  { id: '3A', label: '3A', type: 'Sky', price: 4500, isOccupied: false, specs: 'Window' },
  { id: '3B', label: '3B', type: 'Sky', price: 4500, isOccupied: false, specs: 'Aisle' },
  { id: '3H', label: '3H', type: 'Sky', price: 4500, isOccupied: true, specs: 'Aisle' },
  { id: '3J', label: '3J', type: 'Sky', price: 4500, isOccupied: false, specs: 'Window' },
  
  { id: '4A', label: '4A', type: 'Sky', price: 4500, isOccupied: false, specs: 'Window' },
  { id: '4B', label: '4B', type: 'Sky', price: 4500, isOccupied: false, specs: 'Aisle' },
  { id: '4H', label: '4H', type: 'Sky', price: 4500, isOccupied: false, specs: 'Aisle' },
  { id: '4J', label: '4J', type: 'Sky', price: 4500, isOccupied: false, specs: 'Window' },
  
  { id: '5A', label: '5A', type: 'Sky', price: 4200, isOccupied: false, specs: 'Window' },
  { id: '5B', label: '5B', type: 'Sky', price: 4200, isOccupied: false, specs: 'Aisle' },
  { id: '5H', label: '5H', type: 'Sky', price: 4200, isOccupied: false, specs: 'Aisle' },
  { id: '5J', label: '5J', type: 'Sky', price: 4200, isOccupied: true, specs: 'Window' },
];

const SeatSelection = ({ onSeatSelect }) => {
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [hoveredSeat, setHoveredSeat] = useState(null);

  const handleSeatClick = (seat) => {
    if (seat.isOccupied) return;
    
    const newSelection = selectedSeat?.id === seat.id ? null : seat;
    setSelectedSeat(newSelection);
    
    if (onSeatSelect) {
      onSeatSelect(newSelection);
    }
  };

  const totalPrice = useMemo(() => {
    return selectedSeat ? selectedSeat.price : 0;
  }, [selectedSeat]);

  return (
    <div 
      id="skyvoyage-seat-module" 
      className="w-full max-w-4xl mx-auto bg-[#0B0E14] text-white p-8 rounded-[40px] shadow-2xl border border-white/5 font-sans overflow-hidden relative"
    >
      {/* Premium Overlay */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
      
      {/* Header Section */}
      <div className="flex justify-between items-start mb-12 relative z-10">
        <div>
          <span className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[6px] block mb-2">Cabin Manifest</span>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-[0.9]">
            Select Your <br/><span className="text-[#D4AF37]">Celestial</span> Berth
          </h2>
        </div>
        <div className="text-right">
          <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Total Voyage Cost</p>
          <p className="text-3xl font-black italic tracking-tighter text-[#D4AF37]">
            ₹{totalPrice.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-16 items-start">
        {/* Seat Map Display */}
        <div className="bg-black/40 backdrop-blur-xl p-10 rounded-[32px] border border-white/5 relative">
          {/* Fuselage Outline (Symbolic) */}
          <div className="absolute inset-0 border-x-2 border-t-2 border-white/5 rounded-t-[100px] pointer-events-none"></div>
          
          <div className="space-y-10 pt-10">
            {/* Royal Cabin */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 opacity-20">
                <div className="h-px flex-1 bg-white"></div>
                <span className="text-[8px] font-black uppercase tracking-[4px]">Royal Suite</span>
                <div className="h-px flex-1 bg-white"></div>
              </div>
              
              {/* Row 1 & 2 (1-1 configuration) */}
              {[1, 2].map(rowNum => (
                <div key={`row-${rowNum}`} className="flex justify-between px-8">
                  {SEAT_DATA.filter(s => s.id.startsWith(rowNum)).map(seat => (
                    <SeatButton 
                      key={seat.id}
                      seat={seat}
                      isSelected={selectedSeat?.id === seat.id}
                      onHover={setHoveredSeat}
                      onClick={() => handleSeatClick(seat)}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Main Cabin */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 opacity-20">
                <div className="h-px flex-1 bg-white"></div>
                <span className="text-[8px] font-black uppercase tracking-[4px]">Sky Cabin</span>
                <div className="h-px flex-1 bg-white"></div>
              </div>
              
              {/* Row 3, 4, 5 (2-2 configuration) */}
              {[3, 4, 5].map(rowNum => (
                <div key={`row-${rowNum}`} className="flex justify-center gap-4">
                  <div className="flex gap-3">
                    {SEAT_DATA.filter(s => s.id.startsWith(rowNum) && ['A', 'B'].some(l => s.id.includes(l))).map(seat => (
                      <SeatButton 
                        key={seat.id}
                        seat={seat}
                        isSelected={selectedSeat?.id === seat.id}
                        onHover={setHoveredSeat}
                        onClick={() => handleSeatClick(seat)}
                      />
                    ))}
                  </div>
                  
                  {/* Aisle */}
                  <div className="w-8 flex items-center justify-center opacity-10">
                    <span className="text-[10px] font-black">{rowNum}</span>
                  </div>

                  <div className="flex gap-3">
                    {SEAT_DATA.filter(s => s.id.startsWith(rowNum) && ['H', 'J'].some(l => s.id.includes(l))).map(seat => (
                      <SeatButton 
                        key={seat.id}
                        seat={seat}
                        isSelected={selectedSeat?.id === seat.id}
                        onHover={setHoveredSeat}
                        onClick={() => handleSeatClick(seat)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info & Legend Sidebar */}
        <div className="space-y-12">
          {/* Legend Panel */}
          <div className="glass-panel p-8 rounded-[24px] border border-white/5 bg-white/5">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] mb-6">Matrix Legend</h4>
            <div className="grid grid-cols-2 gap-6">
              <LegendItem color="border-[#D4AF37]" label="Available" />
              <LegendItem color="bg-[#D4AF37]" label="Selected" />
              <LegendItem color="bg-slate-800 opacity-40" label="Occupied" />
              <LegendItem icon={<Crown size={10} className="text-[#D4AF37]" />} label="Royal Suite" />
            </div>
          </div>

          {/* Dynamic Seat Inspector */}
          <div className="glass-panel p-8 rounded-[24px] border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/10 to-transparent min-h-[220px] transition-all duration-500">
            {hoveredSeat || selectedSeat ? (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex justify-between items-center mb-6">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#D4AF37] flex items-center justify-center text-[#0B0E14]">
                        {(hoveredSeat || selectedSeat).type === 'Royal' ? <Crown size={20} /> : <Armchair size={20} />}
                      </div>
                      <div>
                        <span className="text-[#D4AF37] text-[8px] font-black uppercase tracking-widest block">Unit Identifier</span>
                        <h5 className="text-2xl font-black italic tracking-tighter">{(hoveredSeat || selectedSeat).id}</h5>
                      </div>
                   </div>
                   <div className="text-right">
                      <span className="text-slate-500 text-[8px] font-black uppercase tracking-widest block">Manifest Price</span>
                      <p className="text-xl font-black text-white italic tracking-tighter">₹{(hoveredSeat || selectedSeat).price.toLocaleString()}</p>
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-black/40 rounded-xl border border-white/5 flex items-center gap-4">
                    <Navigation size={14} className="text-[#D4AF37] opacity-60" />
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Configuration</p>
                      <p className="text-[11px] font-bold">{(hoveredSeat || selectedSeat).specs}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-black/40 rounded-xl border border-white/5 flex items-center gap-4">
                    <Wind size={14} className="text-[#D4AF37] opacity-60" />
                    <div>
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-500">Climatronic</p>
                      <p className="text-[11px] font-bold">Dedicated Pure-Air Purifier</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center opacity-40">
                  <Info size={24} className="text-slate-500" />
                </div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                  Hover or select a berth <br/> to sync seat telemetry
                </p>
              </div>
            )}
          </div>

          <button 
            disabled={!selectedSeat}
            className={`w-full py-6 rounded-2xl font-black text-[11px] uppercase tracking-[4px] shadow-2xl transition-all duration-500
              ${selectedSeat 
                ? 'bg-[#D4AF37] text-[#0B0E14] shadow-[#D4AF37]/20 hover:scale-105 active:scale-95' 
                : 'bg-white/5 text-slate-700 cursor-not-allowed border border-white/5'
              }`}
          >
            Authorize Berth Transition
          </button>
        </div>
      </div>
    </div>
  );
};

const SeatButton = ({ seat, isSelected, onClick, onHover }) => {
  return (
    <button
      onMouseEnter={() => !seat.isOccupied && onHover(seat)}
      onMouseLeave={() => onHover(null)}
      onClick={onClick}
      disabled={seat.isOccupied}
      className={`
        w-10 h-11 relative rounded-[10px] transition-all duration-300 flex items-center justify-center
        ${seat.isOccupied 
          ? 'bg-slate-800 opacity-20 cursor-not-allowed border-none' 
          : isSelected 
            ? 'bg-[#D4AF37] text-[#0B0E14] ring-4 ring-[#D4AF37]/30 scale-110 shadow-[0_0_20px_#D4AF37]' 
            : 'border border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] hover:-translate-y-1'
        }
        ${seat.type === 'Royal' ? 'w-12 h-12' : ''}
      `}
    >
      {/* Visual seat details */}
      <div className={`absolute top-0.5 left-1/2 -translate-x-1/2 w-4 h-1.5 rounded-full ${isSelected ? 'bg-black/20' : 'bg-white/10'}`}></div>
      
      {seat.isOccupied ? (
        <span className="text-white/20 text-[8px] font-black">X</span>
      ) : isSelected ? (
        <Check size={16} strokeWidth={4} />
      ) : seat.type === 'Royal' ? (
        <Crown size={14} className="text-[#D4AF37]" />
      ) : (
        <Armchair size={14} className="text-slate-500" />
      )}
    </button>
  );
};

const LegendItem = ({ color, label, icon }) => (
  <div className="flex items-center gap-3">
    {icon ? (
      <div className="w-4 h-4 rounded bg-white/5 flex items-center justify-center border border-white/10">{icon}</div>
    ) : (
      <div className={`w-4 h-4 rounded border border-white/10 ${color}`}></div>
    )}
    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</span>
  </div>
);

export default SeatSelection;
