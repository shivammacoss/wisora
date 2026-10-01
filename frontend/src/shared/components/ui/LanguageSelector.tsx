import { useEffect, useRef, useState } from 'react';
import { Check, Globe } from 'lucide-react';
import { LANGS, useLocaleStore, type Lang } from '@app/store';
import { useT } from '@/i18n';
import { cn } from '@shared/utils/cn';

/**
 * Language picker for the app header. Switches every UI string instantly and
 * drives on-demand translation of book/chapter content. Urdu flips to RTL.
 */
export function LanguageSelector({ className }: { className?: string }): JSX.Element {
  const lang = useLocaleStore((s) => s.lang);
  const setLang = useLocaleStore((s) => s.setLang);
  const t = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const active = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  const choose = (code: Lang): void => {
    setLang(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t('common.language')}
        aria-haspopup="menu"
        aria-expanded={open}
        title={t('common.language')}
        className="inline-flex h-10 items-center gap-1.5 rounded-full border border-hairline bg-surface px-3 text-ink shadow-soft transition-colors hover:border-gold/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
      >
        <Globe className="h-5 w-5" />
        <span className="text-sm font-semibold uppercase">{active.code}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 z-50 w-44 overflow-hidden rounded-xl border border-hairline bg-surface py-1 shadow-lift"
        >
          <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
            {t('common.language')}
          </p>
          {LANGS.map((l) => (
            <button
              key={l.code}
              type="button"
              role="menuitemradio"
              aria-checked={l.code === lang}
              onClick={() => choose(l.code)}
              dir={l.rtl ? 'rtl' : 'ltr'}
              className={cn(
                'flex w-full items-center justify-between gap-2 px-3 py-2 text-sm transition-colors hover:bg-cream-surface',
                l.code === lang ? 'font-semibold text-gold-deep' : 'text-body',
              )}
            >
              <span>
                {l.native}
                {l.native !== l.label && <span className="ml-1.5 text-xs text-muted">{l.label}</span>}
              </span>
              {l.code === lang && <Check className="h-4 w-4 shrink-0 text-gold" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
