import React, { useState } from 'react';

const MealImage = ({ keyword, category, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const imageUrl = `https://source.unsplash.com/400x250/?${keyword || 'food'}`;

  const getFallbackIcon = () => {
    return category === 'vegetarian' ? '🥗' : '🍗';
  };

  const getFallbackGradient = () => {
    return category === 'vegetarian' 
      ? 'linear-gradient(135deg, #dcfce7 0%, #16a34a 100%)' 
      : 'linear-gradient(135deg, #fee2e2 0%, #dc2626 100%)';
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse shimmer" />
      )}
      
      {error ? (
        <div 
          className="absolute inset-0 flex items-center justify-center text-4xl"
          style={{ background: getFallbackGradient() }}
        >
          {getFallbackIcon()}
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={alt}
          loading="lazy"
          className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}

      <style jsx>{`
        .shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
};

export default MealImage;
