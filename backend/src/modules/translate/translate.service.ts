import crypto from 'crypto';
import { logger } from '@common/utils/logger';
import { TranslationModel } from './translate.model';

/** Languages we translate into. English is the source and never translated. */
const SUPPORTED = new Set(['es', 'fr', 'ur', 'ru']);
/** How many provider requests to run at once (keeps us under rate limits). */
const CONCURRENCY = 6;

function hash(text: string): string {
  return crypto.createHash('sha1').update(text).digest('hex');
}

/**
 * Translate a batch of strings into the target language, using a MongoDB cache
 * so each unique string is fetched from the provider only once.
 */
export class TranslateService {
  async translateBatch(texts: string[], target: string): Promise<string[]> {
    if (target === 'en' || !SUPPORTED.has(target)) return texts;

    const unique = Array.from(new Set(texts.filter((t) => t && t.trim().length > 0)));
    if (unique.length === 0) return texts;

    const keys = unique.map(hash);
    const cached = await TranslationModel.find({ key: { $in: keys }, lang: target }).exec();
    const byKey = new Map(cached.map((c) => [c.key, c.text]));

    const result = new Map<string, string>(); // source -> translated
    const misses: string[] = [];
    unique.forEach((u, i) => {
      const hit = byKey.get(keys[i]);
      if (hit !== undefined) result.set(u, hit);
      else misses.push(u);
    });

    // Translate cache misses with a small concurrency pool.
    for (let i = 0; i < misses.length; i += CONCURRENCY) {
      const slice = misses.slice(i, i + CONCURRENCY);
      await Promise.all(
        slice.map(async (text) => {
          const translated = await translateOne(text, target);
          result.set(text, translated);
          if (translated !== text) {
            try {
              await TranslationModel.updateOne(
                { key: hash(text), lang: target },
                { $set: { source: text, text: translated } },
                { upsert: true },
              ).exec();
            } catch {
              /* duplicate key race → fine, another request cached it */
            }
          }
        }),
      );
    }

    // Preserve original order and pass through blanks / untranslated.
    return texts.map((t) => (t && result.has(t) ? (result.get(t) as string) : t));
  }
}

/**
 * Translate a single string. Uses the official Google API when a key is set
 * (GOOGLE_TRANSLATE_API_KEY) for production quality/volume; otherwise the free
 * MyMemory API. On any failure the original text is returned so reading never
 * breaks.
 */
async function translateOne(text: string, target: string): Promise<string> {
  try {
    const key = process.env.GOOGLE_TRANSLATE_API_KEY;
    return key ? await viaGoogleApi(text, target, key) : await viaMyMemory(text, target);
  } catch (err) {
    logger.warn(`translate failed (${target}): ${(err as Error).message}`);
    return text;
  }
}

/** Official Google Cloud Translation v2 (used when an API key is set). */
async function viaGoogleApi(text: string, target: string, key: string): Promise<string> {
  const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q: text, source: 'en', target, format: 'text' }),
  });
  if (!res.ok) throw new Error(`google api ${res.status}`);
  const data = (await res.json()) as {
    data?: { translations?: { translatedText?: string }[] };
  };
  return data.data?.translations?.[0]?.translatedText ?? text;
}

/** Longest query MyMemory accepts per request (bytes-ish); we chunk under it. */
const MYMEMORY_MAX = 480;

/**
 * Free MyMemory API — no key, supports every target language we use. Long text
 * is split on sentence boundaries to stay under the per-request limit, then
 * rejoined. Set MYMEMORY_EMAIL to raise the daily quota.
 */
async function viaMyMemory(text: string, target: string): Promise<string> {
  const email = process.env.MYMEMORY_EMAIL;
  const parts = chunkText(text, MYMEMORY_MAX);
  const out: string[] = [];
  for (const part of parts) {
    const url =
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(part)}` +
      `&langpair=en|${encodeURIComponent(target)}${email ? `&de=${encodeURIComponent(email)}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`mymemory ${res.status}`);
    const data = (await res.json()) as { responseData?: { translatedText?: string } };
    const tr = data.responseData?.translatedText;
    // MyMemory returns warnings (quota, invalid) inside translatedText — reject.
    if (!tr || /MYMEMORY WARNING|QUERY LENGTH|INVALID|NO QUERY/i.test(tr)) {
      throw new Error(`mymemory: ${tr ?? 'empty'}`);
    }
    out.push(tr);
  }
  return out.join(' ');
}

/** Split text into chunks no longer than `max`, preferring sentence breaks. */
function chunkText(text: string, max: number): string[] {
  if (text.length <= max) return [text];
  const sentences = text.split(/(?<=[.!?。！？۔])\s+/);
  const chunks: string[] = [];
  let cur = '';
  for (const s of sentences) {
    if (s.length > max) {
      if (cur.trim()) chunks.push(cur.trim());
      cur = '';
      for (let i = 0; i < s.length; i += max) chunks.push(s.slice(i, i + max));
    } else if ((cur + ' ' + s).trim().length > max) {
      if (cur.trim()) chunks.push(cur.trim());
      cur = s;
    } else {
      cur = cur ? `${cur} ${s}` : s;
    }
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks;
}
