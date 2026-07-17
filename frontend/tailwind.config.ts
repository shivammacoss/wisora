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
        // Gold stays fixed in both themes. The rest are CSS variables that
        // flip between light and dark (defined in global.css → :root / .dark).
        gold: {
          DEFAULT: '#D4A017', // primary gold
          deep: '#B8860B', // deep gold (hover)
        },
        cream: {
          DEFAULT: 'rgb(var(--c-cream) / <alpha-value>)', // page background
          surface: 'rgb(var(--c-cream-surface) / <alpha-value>)', // soft surface
        },
        surface: 'rgb(var(--c-surface) / <alpha-value>)', // card / panel surface
        ink: 'rgb(var(--c-ink) / <alpha-value>)', // heading / strong text
        body: 'rgb(var(--c-body) / <alpha-value>)', // body text
        muted: 'rgb(var(--c-muted) / <alpha-value>)', // muted text
        hairline: 'rgb(var(--c-hairline) / <alpha-value>)', // borders
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
