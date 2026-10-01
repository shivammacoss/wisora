import { useEffect, useState } from 'react';
import { useLocaleStore } from '@app/store';
import { translateTexts } from '@shared/lib/translateClient';

/**
 * Translate an ordered list of strings into the active language. Returns the
 * originals immediately (and while a batch is in flight), then swaps to the
 * translations once they resolve. English is a no-op.
 */
export function useTranslated(texts: string[]): string[] {
  const lang = useLocaleStore((s) => s.lang);
  const sig = lang + '|' + JSON.stringify(texts);
  const [state, setState] = useState<{ sig: string; values: string[] }>({
    sig: 'en|[]',
    values: texts,
  });

  useEffect(() => {
    if (lang === 'en') return;
    let alive = true;
    translateTexts(texts, lang).then((res) => {
      if (alive) setState({ sig, values: res });
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig]);

  if (lang === 'en') return texts;
  // Show originals until this exact batch (lang + texts) has resolved.
  return state.sig === sig ? state.values : texts;
}

/** Convenience wrapper for a single string. */
export function useTranslatedText(text: string | undefined | null): string {
  const arr = useTranslated(text ? [text] : []);
  return text ? (arr[0] ?? text) : '';
}
