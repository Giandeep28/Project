import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Flame, AlertCircle, Plus, Minus, Check, X } from 'lucide-react';
import PriceDisplay from '../shared/PriceDisplay';
import { meals as staticMeals } from '../../data/mealsData';
import useCurrency from '../../context/useCurrency';

// ── FSSAI ICON COMPONENTS ──────────────────────────────────
const VegIcon = ({ size = 14 }) => (
  <div style={{ 
    width: size, height: size, border: '2px solid #008237', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff',
    borderRadius: 2, flexShrink: 0
  }}>
    <div style={{ width: size * 0.6, height: size * 0.6, background: '#008237', borderRadius: '50%' }} />
  </div>
);

const NonVegIcon = ({ size = 14 }) => (
  <div style={{ 
    width: size, height: size, border: '2px solid #8B4513', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff',
    borderRadius: 2, flexShrink: 0
  }}>
    <div style={{ width: size * 0.6, height: size * 0.6, background: '#8B4513', borderRadius: '50%' }} />
  </div>
);

// ── IMAGE COMPONENT WITH SHIMMER ──────────────────────────
const FoodImage = ({ keyword, name, category, darkMode }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Using featured source for better quality and keyword matching
  const imgUrl = `https://source.unsplash.com/featured/400x250?${keyword.replace(/ /g, ',')}`;

  return (
    <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: darkMode ? '#1a202c' : '#f3f4f6', overflow: 'hidden' }}>
      {!loaded && !error && (
        <div style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          background: darkMode ? '#2d3748' : '#e2e8f0',
          animation: 'shimmer 1.5s infinite linear',
          backgroundImage: `linear-gradient(90deg, transparent, ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.4)'}, transparent)`,
          backgroundSize: '200% 100%'
        }} />
      )}
      {error ? (
        <div style={{ 
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: category === 'vegetarian' ? 'linear-gradient(135deg, #dcfce7, #bbf7d0)' : 'linear-gradient(135deg, #fee2e2, #fecaca)'
        }}>
          <span style={{ fontSize: 32 }}>{category === 'vegetarian' ? '🥗' : '🍗'}</span>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'rgba(0,0,0,0.4)', marginTop: 4 }}>{name}</span>
        </div>
      ) : (
        <img 
          src={imgUrl} 
          alt={name}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          style={{ 
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', 
            objectFit: 'cover', opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease'
          }}
        />
      )}
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

// ── FILTER DATA ──────────────────────────────────────────
const FILTERS = [
  { key: 'All', label: 'All' },
  { key: 'Veg', label: 'Veg' },
  { key: 'Non-Veg', label: 'Non-Veg' },
  { key: 'Jain', label: 'Jain' },
  { key: 'Vegan', label: 'Vegan' },
  { key: 'Low Calorie', label: 'Low Calorie' },
  { key: 'Kids', label: 'Kids' },
];

export default function MealSelection({ flight, passengers, onBack, onConfirm, darkMode }) {
  const { rates, convert } = useCurrency();
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedMeals, setSelectedMeals] = useState({}); // { passengerIdx: mealId }
  const [currentPassengerIdx, setCurrentPassengerIdx] = useState(0);

  // Filter Logic
  const filteredMeals = useMemo(() => {
    return staticMeals.filter(meal => {
      if (activeFilter === 'All') return true;
      if (activeFilter === 'Veg') return meal.category === 'vegetarian';
      if (activeFilter === 'Non-Veg') return meal.category === 'non_vegetarian';
      if (activeFilter === 'Jain') return meal.tags.includes('jain') || meal.subCategory === 'jain';
      if (activeFilter === 'Vegan') return meal.tags.includes('vegan') || meal.subCategory === 'vegan';
      if (activeFilter === 'Low Calorie') return meal.tags.includes('low_calorie') || meal.subCategory === 'low_calorie';
      if (activeFilter === 'Kids') return meal.tags.includes('kids') || meal.subCategory === 'kids';
      return true;
    });
  }, [activeFilter]);

  const vegMeals = filteredMeals.filter(m => m.category === 'vegetarian');
  const nonVegMeals = filteredMeals.filter(m => m.category === 'non_vegetarian');

  const calculateTotal = () => {
    return Object.values(selectedMeals).reduce((acc, mealId) => {
      if (mealId === 'SKIP') return acc;
      const meal = staticMeals.find(m => m.id === mealId);
      return acc + (meal ? meal.price : 0);
    }, 0);
  };

  const handleSelectMeal = (mealId) => {
    setSelectedMeals(prev => ({
      ...prev,
      [currentPassengerIdx]: mealId
    }));
  };

  const currentSelection = selectedMeals[currentPassengerIdx];

  const gold = '#C8A84B';
  const themeBg = darkMode ? '#0A0F1A' : '#f1f5f9';
  const cardBg = darkMode ? '#1C2333' : '#ffffff';
  const text = darkMode ? '#f0ece4' : '#111827';
  const muted = darkMode ? '#9ca3af' : '#6b7280';
  const bdr = darkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0';

  return (
    <div style={{ background: themeBg, minHeight: '100vh', paddingBottom: 120, color: text }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
        
        {/* Wizard Progress */}
        <div style={{ display: 'flex', gap: 24, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 800, marginBottom: 48, justifyContent: 'center', opacity: 0.6 }}>
          <span style={{ color: muted }}>1. Passengers</span>
          <span style={{ color: muted }}>—</span>
          <span style={{ color: muted }}>2. Seats</span>
          <span style={{ color: muted }}>—</span>
          <span style={{ color: gold }}>3. Meals</span>
          <span style={{ color: muted }}>—</span>
          <span style={{ color: muted }}>4. Payment</span>
        </div>

        {/* Header & Passenger Selector */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontSize: 36, fontWeight: 900, fontFamily: '"Playfair Display",serif', textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: 16 }}>
            In-Flight Gourmet
          </h1>
          <p style={{ color: muted, marginBottom: 32, fontSize: 15 }}>Select a curated meal for each passenger on this journey.</p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
            {passengers.map((p, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentPassengerIdx(i)}
                style={{ 
                  padding: '10px 24px', borderRadius: 12, border: `2px solid ${currentPassengerIdx === i ? gold : bdr}`,
                  background: currentPassengerIdx === i ? gold : cardBg,
                  color: currentPassengerIdx === i ? '#000' : text,
                  fontWeight: 800, fontSize: 13, cursor: 'pointer', transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: currentPassengerIdx === i ? '0 10px 20px rgba(200, 168, 75, 0.2)' : 'none'
                }}
              >
                {selectedMeals[i] && selectedMeals[i] !== 'SKIP' ? '🍱 ' : ''}
                {p.name || `Passenger ${i + 1}`}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 40, overflowX: 'auto', padding: '4px', justifyContent: 'center', scrollbarWidth: 'none' }}>
          {FILTERS.map(f => (
            <button 
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              style={{ 
                padding: '10px 24px', borderRadius: 30, border: `1.5px solid ${activeFilter === f.key ? gold : bdr}`,
                background: activeFilter === f.key ? gold : 'transparent',
                color: activeFilter === f.key ? '#000' : text,
                fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', transition: '0.2s',
                boxShadow: activeFilter === f.key ? `0 4px 12px ${gold}44` : 'none'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* No Meal Row */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => handleSelectMeal('SKIP')}
          style={{ 
            background: cardBg, border: `2px solid ${currentSelection === 'SKIP' ? gold : 'transparent'}`,
            borderRadius: 16, padding: '20px 28px', marginBottom: 48, cursor: 'pointer',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: '0.3s',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ 
              width: 24, height: 24, borderRadius: '50%', border: `2px solid ${currentSelection === 'SKIP' ? gold : muted}`, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' 
            }}>
              {currentSelection === 'SKIP' && <div style={{ width: 12, height: 12, background: gold, borderRadius: '50%' }} />}
            </div>
            <div>
              <p style={{ fontWeight: 900, margin: '0 0 2px 0', fontSize: 16 }}>✕ No Meal Selection</p>
              <p style={{ fontSize: 13, color: muted, margin: 0 }}>Skip in-flight meal for this passenger</p>
            </div>
          </div>
          <span style={{ fontWeight: 900, color: '#10b981', fontSize: 14, letterSpacing: '0.05em' }}>COMPLIMENTARY</span>
        </motion.div>

        {/* MEAL SECTIONS */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeFilter}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Vegetarian Section */}
            {vegMeals.length > 0 && (
              <div style={{ marginBottom: 60 }}>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: 16, padding: '12px 20px', 
                  background: darkMode ? 'rgba(0, 130, 55, 0.1)' : '#dcfce7', 
                  borderLeft: '6px solid #008237', borderRadius: '4px 12px 12px 4px', marginBottom: 32 
                }}>
                   <VegIcon size={20} />
                   <h2 style={{ fontSize: 20, fontWeight: 900, textTransform: 'uppercase', color: darkMode ? '#4ade80' : '#008237', letterSpacing: '0.1em', margin: 0 }}>Vegetarian</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: 32 }}>
                  {vegMeals.map(meal => <MealCard key={meal.id} meal={meal} isSelected={currentSelection === meal.id} onSelect={() => handleSelectMeal(meal.id)} darkMode={darkMode} />)}
                </div>
              </div>
            )}

            {/* Non-Vegetarian Section */}
            {nonVegMeals.length > 0 && (
              <div>
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: 16, padding: '12px 20px', 
                  background: darkMode ? 'rgba(139, 69, 19, 0.1)' : '#fee2e2', 
                  borderLeft: '6px solid #8B4513', borderRadius: '4px 12px 12px 4px', marginBottom: 32 
                }}>
                   <NonVegIcon size={20} />
                   <h2 style={{ fontSize: 20, fontWeight: 900, textTransform: 'uppercase', color: darkMode ? '#f87171' : '#8B4513', letterSpacing: '0.1em', margin: 0 }}>Non-Vegetarian</h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(440px, 1fr))', gap: 32 }}>
                  {nonVegMeals.map(meal => <MealCard key={meal.id} meal={meal} isSelected={currentSelection === meal.id} onSelect={() => handleSelectMeal(meal.id)} darkMode={darkMode} />)}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer Summary */}
        <div style={{ 
          position: 'fixed', bottom: 0, left: 0, right: 0, 
          background: darkMode ? 'rgba(28, 35, 51, 0.95)' : 'rgba(255, 255, 255, 0.95)', 
          backdropFilter: 'blur(10px)', borderTop: `1px solid ${bdr}`, padding: '24px 0', 
          boxShadow: '0 -20px 50px rgba(0,0,0,0.15)', zIndex: 1000 
        }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 800, color: muted, marginBottom: 6, letterSpacing: '0.1em' }}>Meals Total Selection</p>
              <p style={{ fontSize: 32, fontWeight: 900, color: gold, margin: 0 }}><PriceDisplay amount={calculateTotal()} currency="INR" /></p>
            </div>
            <div style={{ display: 'flex', gap: 16 }}>
              <button onClick={onBack} style={{ padding: '14px 28px', borderRadius: 12, border: `2px solid ${bdr}`, background: 'transparent', color: text, fontWeight: 800, cursor: 'pointer', transition: '0.2s' }}>Back</button>
              <button 
                onClick={() => {
                  const totalINR = calculateTotal();
                  onConfirm(selectedMeals, convert(totalINR, 'INR', 'USD'));
                }}
                style={{ 
                  padding: '14px 48px', borderRadius: 12, border: 'none', background: gold, color: '#000', 
                  fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer',
                  boxShadow: `0 10px 25px ${gold}44`, transition: '0.3s'
                }}
              >
                Confirm Selection →
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── REDESIGNED MEAL CARD ──────────────────────────────────
function MealCard({ meal, isSelected, onSelect, darkMode }) {
  const cardBg = darkMode ? '#1C2333' : '#ffffff';
  const text = darkMode ? '#f0ece4' : '#111827';
  const muted = darkMode ? '#9ca3af' : '#6b7280';
  const bdr = darkMode ? 'rgba(255,255,255,0.06)' : '#f1f5f9';
  const accent = meal.category === 'vegetarian' ? '#008237' : '#8B4513';
  const gold = '#C8A84B';

  return (
    <motion.div 
      initial={false}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ 
        background: cardBg, borderRadius: 20, overflow: 'hidden', cursor: 'pointer',
        border: `2.5px solid ${isSelected ? accent : 'transparent'}`,
        boxShadow: isSelected ? `0 20px 40px ${accent}22` : '0 8px 30px rgba(0,0,0,0.06)',
        display: 'grid', gridTemplateColumns: '190px 1fr', transition: 'border-color 0.3s'
      }}
      onClick={onSelect}
    >
      {/* Image Part */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <FoodImage keyword={meal.imageKeyword} name={meal.name} category={meal.category} darkMode={darkMode} />
        
        {/* Badges */}
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 10 }}>
          {meal.tags.includes('bestseller') && (
            <motion.div 
              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              style={{ background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 900, padding: '4px 10px', borderRadius: 6, textTransform: 'uppercase', boxShadow: '0 4px 10px rgba(239,68,68,0.3)' }}
            >
              Bestseller
            </motion.div>
          )}
          {meal.tags.includes('premium') && (
            <motion.div 
              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
              style={{ background: gold, color: '#000', fontSize: 10, fontWeight: 900, padding: '4px 10px', borderRadius: 6, textTransform: 'uppercase', boxShadow: '0 4px 10px rgba(200,168,75,0.3)' }}
            >
              Premium
            </motion.div>
          )}
        </div>
      </div>

      {/* Content Part */}
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          {meal.category === 'vegetarian' ? <VegIcon size={14} /> : <NonVegIcon size={14} />}
          <h3 style={{ fontSize: 17, fontWeight: 900, margin: 0, flex: 1, letterSpacing: '-0.02em' }}>{meal.name}</h3>
        </div>
        
        <p style={{ fontSize: 13, color: muted, marginBottom: 16, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '3em' }}>
          {meal.description}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, padding: '10px 0', borderTop: `1px solid ${bdr}`, borderBottom: `1px solid ${bdr}`, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: muted }}>
            <Flame size={14} style={{ color: '#f97316' }} /> {meal.calories} kcal
          </div>
          {meal.allergens.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: '#ef4444' }}>
              <AlertCircle size={14} /> {meal.allergens[0]}{meal.allergens.length > 1 ? ` +${meal.allergens.length-1}` : ''}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: text }}>₹{meal.price}</span>
          
          <div onClick={(e) => e.stopPropagation()}>
            {isSelected ? (
              <motion.div 
                initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                style={{ display: 'flex', alignItems: 'center', gap: 14, background: accent, color: '#fff', padding: '8px 16px', borderRadius: 12, boxShadow: `0 8px 15px ${accent}44` }}
              >
                <button onClick={() => onSelect()} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, display: 'flex' }}><Minus size={16} /></button>
                <span style={{ fontWeight: 900, fontSize: 15 }}>1</span>
                <button style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'not-allowed', padding: 0, opacity: 0.5, display: 'flex' }}><Plus size={16} /></button>
              </motion.div>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSelect}
                style={{ 
                  background: 'transparent', border: `2px solid ${accent}`, color: accent, 
                  padding: '8px 24px', borderRadius: 12, fontWeight: 900, fontSize: 13, cursor: 'pointer', transition: '0.2s',
                  textTransform: 'uppercase', letterSpacing: '0.05em'
                }}
              >
                + ADD
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
