import type { Config } from 'tailwindcss';
import flattenColorPalette from 'tailwindcss/lib/util/flattenColorPalette';

/** Exposes every Tailwind color as a global CSS variable (e.g. var(--blue-500)). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addVariablesForColors({ addBase, theme }: any): void {
  const allColors = flattenColorPalette(theme('colors'));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val]),
  );
  addBase({ ':root': newVars });
}

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Wisora brand palette — sacred + warm.
        sacred: {
          50: '#faf6ef',
          100: '#f1e7d3',
          500: '#c79a4b',
          700: '#8a6a2e',
          900: '#4a3815',
        },
        // Landing-page design tokens (warm, book-app feel).
        gold: {
          DEFAULT: '#D4A017', // primary gold
          deep: '#B8860B', // deep gold (hover)
        },
        cream: {
          DEFAULT: '#FAFAF7', // page background
          surface: '#FBF6EC', // soft cream surface
        },
        ink: '#1A1A1A', // heading text / dark CTA
        body: '#4B5563', // body text
        muted: '#9CA3AF', // muted text
        hairline: '#E5E7EB', // light border
      },
      fontFamily: {
        // Headings: warm serif. Body & UI: Inter.
        serif: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(0 0 0 / 0.04), 0 4px 16px -4px rgb(0 0 0 / 0.06)',
        lift: '0 8px 30px -8px rgb(0 0 0 / 0.12)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        aurora: {
          from: { backgroundPosition: '50% 50%, 50% 50%' },
          to: { backgroundPosition: '350% 50%, 350% 50%' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        aurora: 'aurora 60s linear infinite',
      },
    },
  },
  plugins: [addVariablesForColors],
} satisfies Config;
