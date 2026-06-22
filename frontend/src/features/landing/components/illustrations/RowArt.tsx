/**
 * Warm spot illustrations for the alternating feature rows.
 * NOTE: placeholder SVGs — replace with final brand artwork.
 */

const baseClass = 'h-full w-full';

/** Row 1 — open book glowing with gold light. */
export function OpenBookArt(): JSX.Element {
  return (
    <svg viewBox="0 0 360 300" fill="none" className={baseClass} role="img" aria-label="An open book glowing with warm golden light">
      <defs>
        <radialGradient id="ob-glow" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#FDE8B0" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FDE8B0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="180" cy="140" r="140" fill="url(#ob-glow)" />
      <path d="M180 110c-30-22-72-22-102-12v128c30-10 72-10 102 12z" fill="#FBF6EC" stroke="#E7D7B0" strokeWidth="2" />
      <path d="M180 110c30-22 72-22 102-12v128c-30-10-72-10-102 12z" fill="#FDF5E4" stroke="#E7D7B0" strokeWidth="2" />
      <path d="M180 110v128" stroke="#D4A017" strokeWidth="2.5" />
      {[140, 156, 172].map((y) => (
        <line key={`l${y}`} x1="98" y1={y} x2="166" y2={y - 4} stroke="#E0CFA6" strokeWidth="3" strokeLinecap="round" />
      ))}
      {[140, 156, 172].map((y) => (
        <line key={`r${y}`} x1="194" y1={y - 4} x2="262" y2={y} stroke="#E0CFA6" strokeWidth="3" strokeLinecap="round" />
      ))}
      <g fill="#D4A017">
        <path d="M180 60l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" />
        <path d="M120 80l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" opacity="0.7" />
        <path d="M250 86l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" opacity="0.7" />
      </g>
    </svg>
  );
}

/** Row 2 — a single gold coin dropping into a book. */
export function CoinArt(): JSX.Element {
  return (
    <svg viewBox="0 0 360 300" fill="none" className={baseClass} role="img" aria-label="A single gold coin dropping into a book">
      <defs>
        <linearGradient id="coin-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#D4A017" />
        </linearGradient>
      </defs>
      {/* book */}
      <rect x="96" y="150" width="168" height="110" rx="12" fill="#FBF6EC" stroke="#E7D7B0" strokeWidth="2" />
      <path d="M180 150v110" stroke="#E0CFA6" strokeWidth="2" />
      <path d="M110 150c20-8 50-8 70 6 20-14 50-14 70-6" fill="none" stroke="#E0CFA6" strokeWidth="2" />
      {/* slot highlight */}
      <ellipse cx="180" cy="156" rx="40" ry="8" fill="#F4E4BE" />
      {/* falling coin */}
      <g>
        <ellipse cx="180" cy="92" rx="38" ry="38" fill="url(#coin-g)" />
        <ellipse cx="180" cy="92" rx="29" ry="29" fill="none" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" />
        <text x="180" y="103" textAnchor="middle" fontFamily="Fraunces, serif" fontSize="34" fontWeight="700" fill="#fff">
          ₹
        </text>
      </g>
      {/* motion lines */}
      <g stroke="#D4A017" strokeWidth="3" strokeLinecap="round" opacity="0.5">
        <line x1="150" y1="40" x2="150" y2="58" />
        <line x1="180" y1="32" x2="180" y2="52" />
        <line x1="210" y1="40" x2="210" y2="58" />
      </g>
    </svg>
  );
}

/** Row 3 — a progress chart rising toward a lotus. */
export function ProgressArt(): JSX.Element {
  return (
    <svg viewBox="0 0 360 300" fill="none" className={baseClass} role="img" aria-label="A rising progress chart topped with a lotus flower">
      <rect x="60" y="60" width="240" height="180" rx="16" fill="#FBF6EC" stroke="#E7D7B0" strokeWidth="2" />
      {/* bars */}
      {[
        { x: 96, h: 50 },
        { x: 140, h: 84 },
        { x: 184, h: 116 },
        { x: 228, h: 150 },
      ].map((b) => (
        <rect key={b.x} x={b.x} y={220 - b.h} width="28" height={b.h} rx="8" fill="#FCD34D" />
      ))}
      {/* trend line */}
      <path d="M110 196l44-30 44-26 44-34" fill="none" stroke="#D4A017" strokeWidth="3.5" strokeLinecap="round" />
      {/* lotus on top of last bar */}
      <g transform="translate(242 56)">
        <path d="M0 8c0-12 9-20 9-20s-1 15-9 20z" fill="#F9A8D4" />
        <path d="M0 8c0-12-9-20-9-20s1 15 9 20z" fill="#F9A8D4" />
        <path d="M0 8c6-10 18-14 18-14s-6 13-18 14z" fill="#FBCFE8" />
        <path d="M0 8c-6-10-18-14-18-14s6 13 18 14z" fill="#FBCFE8" />
        <ellipse cx="0" cy="9" rx="10" ry="4" fill="#FDE68A" />
      </g>
    </svg>
  );
}
