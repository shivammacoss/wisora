import { http } from '@shared/lib/axios';
import type { Lang } from '@app/store';
import type { ApiEnvelope } from '@shared/types';

/** In-memory + localStorage cache of translations, keyed by `${lang}::${text}`. */
const mem = new Map<string, string>();

function lsKey(lang: Lang): string {
  return `wisora.tr.${lang}`;
}

function loadLS(lang: Lang): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(lsKey(lang)) ?? '{}') as Record<string, string>;
  } catch {
    return {};
  }
}

function saveLS(lang: Lang, obj: Record<string, string>): void {
  try {
    localStorage.setItem(lsKey(lang), JSON.stringify(obj));
  } catch {
    /* quota / unavailable → fine, memory cache still helps this session */
  }
}

/**
 * Translate an ordered list of strings into `lang`. English passes through.
 * Cached results (memory → localStorage) are reused; only misses hit the API.
 * On any failure the originals are returned so the UI never breaks.
 */
export async function translateTexts(texts: string[], lang: Lang): Promise<string[]> {
  if (lang === 'en') return texts;

  const ls = loadLS(lang);
  const need = new Set<string>();
  for (const t of texts) {
    if (!t || !t.trim()) continue;
    const k = `${lang}::${t}`;
    if (mem.has(k)) continue;
    if (ls[t] !== undefined) {
      mem.set(k, ls[t]);
      continue;
    }
    need.add(t);
  }

  const misses = Array.from(need);
  if (misses.length > 0) {
    try {
      const { data } = await http.post<ApiEnvelope<{ translations: string[] }>>('/translate', {
        texts: misses,
        target: lang,
      });
      const out = data.data?.translations ?? misses;
      misses.forEach((src, i) => {
        const tr = out[i] ?? src;
        mem.set(`${lang}::${src}`, tr);
        ls[src] = tr;
      });
      saveLS(lang, ls);
    } catch {
      /* leave misses untranslated */
    }
  }

  return texts.map((t) => (t && t.trim() ? (mem.get(`${lang}::${t}`) ?? t) : t));
}
