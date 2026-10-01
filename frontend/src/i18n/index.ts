import { useCallback } from 'react';
import { useLocaleStore, type Lang } from '@app/store';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import ur from './locales/ur.json';
import ru from './locales/ru.json';

/** Static UI string tables, one per supported language. */
export const resources: Record<Lang, Record<string, unknown>> = { en, es, fr, ur, ru };
export const defaultLocale: Lang = 'en';

/** Look up a dotted key (e.g. "nav.signIn") in a resource table. */
function lookup(table: Record<string, unknown>, key: string): string | undefined {
  let cur: unknown = table;
  for (const part of key.split('.')) {
    if (cur && typeof cur === 'object' && part in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof cur === 'string' ? cur : undefined;
}

/** Translate a UI key for a given language, falling back to English, then the key. */
export function translate(lang: Lang, key: string): string {
  return lookup(resources[lang], key) ?? lookup(resources.en, key) ?? key;
}

/** Hook: returns `t(key)` bound to the active language (re-renders on change). */
export function useT(): (key: string) => string {
  const lang = useLocaleStore((s) => s.lang);
  return useCallback((key: string) => translate(lang, key), [lang]);
}
