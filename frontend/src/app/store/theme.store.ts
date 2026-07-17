import { create } from 'zustand';

export type Theme = 'light' | 'dark';

const THEME_KEY = 'wisora.theme';

/** Read the saved theme; default to light ("white") when unset. */
function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    /* localStorage unavailable */
  }
  return 'light';
}

/** Toggle the `dark` class on <html> — flips every CSS-variable token. */
function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
}

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  setTheme: (theme: Theme) => void;
}

const initial = getInitialTheme();
applyTheme(initial); // apply immediately when this module loads

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initial,
  toggle: () => get().setTheme(get().theme === 'dark' ? 'light' : 'dark'),
  setTheme: (theme) => {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      /* ignore */
    }
    applyTheme(theme);
    set({ theme });
  },
}));
