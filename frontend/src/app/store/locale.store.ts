import { create } from 'zustand';

/** Supported app languages. English is the default; Urdu is right-to-left. */
export type Lang = 'en' | 'es' | 'fr' | 'ur' | 'ru';

export const LANGS: { code: Lang; label: string; native: string; rtl?: boolean }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'es', label: 'Spanish', native: 'Español' },
  { code: 'fr', label: 'French', native: 'Français' },
  { code: 'ur', label: 'Urdu', native: 'اردو', rtl: true },
  { code: 'ru', label: 'Russian', native: 'Русский' },
];

const LANG_KEY = 'wisora.lang';
const RTL_LANGS = new Set<Lang>(['ur']);

export function isRtl(lang: Lang): boolean {
  return RTL_LANGS.has(lang);
}

function getInitialLang(): Lang {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved && LANGS.some((l) => l.code === saved)) return saved as Lang;
  } catch {
    /* localStorage unavailable */
  }
  return 'en';
}

/** Reflect the active language on <html> (lang + text direction). */
function applyLang(lang: Lang): void {
  const root = document.documentElement;
  root.lang = lang;
  root.dir = isRtl(lang) ? 'rtl' : 'ltr';
}

interface LocaleState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const initial = getInitialLang();
applyLang(initial); // apply immediately when this module loads

export const useLocaleStore = create<LocaleState>((set) => ({
  lang: initial,
  setLang: (lang) => {
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch {
      /* ignore */
    }
    applyLang(lang);
    set({ lang });
  },
}));
