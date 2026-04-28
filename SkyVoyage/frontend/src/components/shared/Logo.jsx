import React from 'react';

/**
 * Logo Component — SkyVoyage
 *
 * Dual-image strategy:
 *   Dark mode (light=true):  skyvoyage-logo-dark.png  (gold on black)
 *                            mix-blend-mode: screen on the <img> directly
 *                            → black pixels vanish, gold shines on dark bg
 *
 *   Light mode (light=false): skyvoyage-logo-light.png (gold on white)
 *                             mix-blend-mode: multiply on the <img> directly
 *                             → white pixels vanish, gold shines on white bg
 *
 * The blend mode is applied directly on <img>, NOT on a wrapper <div>.
 * This avoids creating an intermediate compositing layer which can break blending.
 *
 * Navbar passes: light={darkMode}
 *   darkMode=true  → light=true  → dark background → screen blend with dark logo
 *   darkMode=false → light=false → light background → multiply blend with light logo
 */
export default function Logo({ size = 'md', isDarkBackground = false, showTagline = false, vertical = false }) {
  const sizes = {
    sm: { icon: 28, font: 14, tagline: 6,  gap: 8  },
    md: { icon: 40, font: 20, tagline: 8,  gap: 10 },
    lg: { icon: 64, font: 32, tagline: 10, gap: 14 },
    xl: { icon: 100, font: 48, tagline: 14, gap: 20 },
  };

  const { icon, font, tagline, gap } = sizes[size] || sizes.md;
  const gold = '#C8A84B';

  // If we are on a dark background, use the 'dark' asset (gold on black) + screen blend
  // If we are on a light background, use the 'light' asset (gold on white) + multiply blend
  const logoSrc   = isDarkBackground ? '/skyvoyage-logo-dark.png' : '/skyvoyage-logo-light.png';
  const blendMode = isDarkBackground ? 'screen'                  : 'multiply';

  return (
    <div
      className="skyvoyage-logo-container"
      style={{
        display: 'inline-flex',
        flexDirection: vertical ? 'column' : 'row',
        alignItems: 'center',
        gap: vertical ? gap / 2 : gap,
        userSelect: 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ width: icon, height: icon, flexShrink: 0, position: 'relative' }}>
        <img
          src={logoSrc}
          alt="SkyVoyage Phoenix"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            mixBlendMode: blendMode,
            filter: isDarkBackground ? 'brightness(1.15) contrast(1.1)' : 'brightness(1) contrast(1)',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: vertical ? 'center' : 'flex-start',
          justifyContent: 'center',
        }}
      >
        <span
          style={{
            fontFamily: '"Playfair Display", serif',
            fontWeight: 400,
            fontSize: font,
            letterSpacing: '0.04em',
            color: gold,
            lineHeight: 1,
          }}
        >
          SkyVoyage
        </span>

        {showTagline && (
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 700,
              fontSize: tagline,
              letterSpacing: '0.35em',
              color: 'rgba(200,168,75,0.8)',
              marginTop: vertical ? 8 : 3,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
            }}
          >
            Ascend to New Heights
          </span>
        )}
      </div>
    </div>
  );
}
