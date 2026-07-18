import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  MessageSquare,
  Moon,
  MoreVertical,
  Sun,
} from 'lucide-react';
import { getBookBySlug } from '@features/books';
import { chapterUnlocked, useLibraryStore, useThemeStore } from '@app/store';
import { ROUTES } from '@shared/constants';
import { cn } from '@shared/utils/cn';

/**
 * Chapter reader — a calm, book-like reading surface.
 * A slim top bar (chapter + title), a gold "Essence" callout, the reflection
 * body rendered from a light markdown subset, and a floating action bar
 * (prev · like · comment · theme · next). Theme-aware: gold stays fixed,
 * everything else flips between light and dark.
 */
export default function ReaderPage(): JSX.Element {
  const { bookId, chapterId } = useParams<{ bookId: string; chapterId: string }>();
  const navigate = useNavigate();

  const unlocked = useLibraryStore((s) => s.unlocked);
  const markRead = useLibraryStore((s) => s.markRead);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggle);
  const isDark = theme === 'dark';

  const [menuOpen, setMenuOpen] = useState(false);
  const [liked, setLiked] = useState(false);

  const book = getBookBySlug(bookId);
  const order = Number(chapterId);
  const chapter = book?.chapters.find((c) => c.order === order);

  const accessible =
    book && chapter ? chapterUnlocked(unlocked, book.slug, chapter.order, chapter.isFree) : false;

  // Record progress + reset per-chapter UI whenever the chapter changes.
  useEffect(() => {
    if (book && chapter && accessible) markRead(book.slug, chapter.order);
    setLiked(false);
    setMenuOpen(false);
    window.scrollTo({ top: 0 });
  }, [book, chapter, accessible, markRead]);

  // Missing data → back to library. Locked chapter → back to the book's paywall.
  if (!book || !chapter) return <Navigate to={ROUTES.library} replace />;
  if (!accessible) return <Navigate to={ROUTES.bookDetail(book.slug)} replace />;

  const prev = book.chapters.find((c) => c.order === order - 1);
  const next = book.chapters.find((c) => c.order === order + 1);
  const nextAccessible = next
    ? chapterUnlocked(unlocked, book.slug, next.order, next.isFree)
    : false;

  const goPrev = (): void => {
    if (prev) navigate(ROUTES.reader(book.slug, String(prev.order)));
  };
  // Accessible next chapter → open it; locked or none → bounce to the paywall.
  const goNext = (): void => {
    if (next && nextAccessible) navigate(ROUTES.reader(book.slug, String(next.order)));
    else navigate(ROUTES.bookDetail(book.slug));
  };

  // Split content into the essence callout + the reflection body.
  const paras = chapter.content ?? [];
  const essence = chapter.essence ?? paras[0];
  const body = chapter.essence ? paras : paras.slice(1);
  const firstParaIdx = body.findIndex((b) => blockType(b) === 'p');

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      {/* ── top bar ── */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-hairline bg-cream/85 px-4 py-3 backdrop-blur-md">
        <button
          type="button"
          onClick={() => navigate(ROUTES.bookDetail(book.slug))}
          aria-label="Back to chapters"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
            Chapter {chapter.order}
          </p>
          <h1 className="truncate font-serif text-lg font-bold leading-tight text-ink">
            {chapter.title}
          </h1>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="More options"
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
          {menuOpen && (
            <>
              <button
                type="button"
                aria-hidden
                tabIndex={-1}
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />
              <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-xl border border-hairline bg-surface py-1 shadow-lift">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.bookDetail(book.slug))}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-body transition-colors hover:bg-cream-surface"
                >
                  <BookOpen className="h-4 w-4 text-gold-deep" /> All chapters
                </button>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.library)}
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-body transition-colors hover:bg-cream-surface"
                >
                  <ArrowLeft className="h-4 w-4 text-gold-deep" /> Back to library
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* ── reading surface ── */}
      <motion.main
        key={chapter.order}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-2xl flex-1 px-6 py-9 md:py-12"
      >
        <p className="inline-flex items-center gap-1.5 text-sm text-muted">
          <Clock className="h-4 w-4" /> {chapter.readingTimeMins} min read
        </p>

        {/* Essence callout */}
        {essence && (
          <aside className="mt-6 rounded-r-2xl border-l-4 border-gold bg-gold/[0.06] px-6 py-5">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-gold-deep">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" /> Essence
            </p>
            <p className="mt-3 font-serif text-lg italic leading-relaxed text-ink/90">{essence}</p>
          </aside>
        )}

        {/* Reflection heading */}
        {body.length > 0 && (
          <div className="mb-7 mt-12">
            <div className="h-px w-full bg-hairline" />
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-muted">
              Reflection
            </p>
            <div className="mt-3 h-0.5 w-14 rounded-full bg-gold/50" />
          </div>
        )}

        {/* Body */}
        <article className="space-y-5">
          {body.length > 0 ? (
            body.map((block, i) => <Block key={i} text={block} first={i === firstParaIdx} />)
          ) : (
            <p className="text-lg leading-[1.85] text-body first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-gold-deep">
              The distilled summary of <span className="italic">{chapter.title}</span> is being
              prepared. Your progress for this chapter has been recorded.
            </p>
          )}
        </article>
      </motion.main>

      {/* ── floating action bar ── */}
      <div className="sticky bottom-0 z-30 border-t border-hairline bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-2.5">
          <ToolbarButton
            onClick={goPrev}
            disabled={!prev}
            label={prev ? 'Previous chapter' : 'No previous chapter'}
          >
            <ChevronLeft className="h-5 w-5" />
          </ToolbarButton>

          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={() => setLiked((v) => !v)}
              label={liked ? 'Unlike' : 'Like'}
              pressed={liked}
            >
              <Heart className={cn('h-5 w-5', liked ? 'fill-gold text-gold' : 'text-muted')} />
            </ToolbarButton>
            <ToolbarButton onClick={undefined} label="Comments coming soon">
              <MessageSquare className="h-5 w-5 text-muted" />
            </ToolbarButton>
            <ToolbarButton onClick={toggleTheme} label={isDark ? 'Light mode' : 'Dark mode'}>
              {isDark ? (
                <Sun className="h-5 w-5 text-gold" />
              ) : (
                <Moon className="h-5 w-5 text-muted" />
              )}
            </ToolbarButton>
          </div>

          <ToolbarButton
            onClick={goNext}
            label={next ? (nextAccessible ? 'Next chapter' : 'Unlock next chapter') : 'Back to chapters'}
          >
            <ChevronRight className="h-5 w-5" />
          </ToolbarButton>
        </div>
      </div>
    </div>
  );
}

/* ───────── toolbar ───────── */

function ToolbarButton({
  children,
  onClick,
  label,
  disabled,
  pressed,
}: {
  children: ReactNode;
  onClick?: () => void;
  label: string;
  disabled?: boolean;
  pressed?: boolean;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={pressed}
      title={label}
      className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

/* ───────── content rendering (light markdown subset) ───────── */

type BlockKind = 'h2' | 'h3' | 'verse' | 'translit' | 'quote' | 'li' | 'hr' | 'p';

function blockType(text: string): BlockKind {
  if (text.startsWith('## ')) return 'h2';
  if (text.startsWith('### ')) return 'h3';
  if (text.startsWith('>> ')) return 'verse';
  if (text.startsWith('~ ')) return 'translit';
  if (text.startsWith('> ')) return 'quote';
  if (text.startsWith('- ')) return 'li';
  if (text.trim() === '---') return 'hr';
  return 'p';
}

function Block({ text, first }: { text: string; first?: boolean }): JSX.Element {
  switch (blockType(text)) {
    // Uppercase section heading — e.g. "THE FIELD OF DHARMA".
    case 'h2':
      return (
        <h2 className="pt-6 font-sans text-base font-bold uppercase tracking-wider text-ink">
          {renderInline(text.slice(3))}
        </h2>
      );
    // Bold inline label — e.g. "Sanskrit Deep Dive".
    case 'h3':
      return (
        <h3 className="pt-2 font-sans text-base font-bold text-ink">
          {renderInline(text.slice(4))}
        </h3>
      );
    // Scripture verse in its original script — large gold serif; "\n" splits
    // lines. dir="auto" keeps right-to-left scripts (Arabic) correct.
    case 'verse':
      return (
        <p
          dir="auto"
          className="whitespace-pre-line font-serif text-2xl font-semibold leading-relaxed text-gold md:text-[1.7rem]"
        >
          {renderInline(text.slice(3))}
        </p>
      );
    // Transliteration — gold italic; "\n" splits lines.
    case 'translit':
      return (
        <p className="whitespace-pre-line font-serif text-base italic leading-relaxed text-gold-deep md:text-lg">
          {renderInline(text.slice(2))}
        </p>
      );
    // Translation / quotation.
    case 'quote':
      return (
        <p className="border-l-2 border-gold/40 pl-5 text-lg leading-[1.85] text-ink/90">
          {renderInline(text.slice(2))}
        </p>
      );
    // Word-by-word breakdown bullet.
    case 'li':
      return (
        <p className="flex gap-3 pl-1 text-lg leading-relaxed text-body">
          <span className="mt-[0.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold/60" />
          <span>{renderInline(text.slice(2))}</span>
        </p>
      );
    case 'hr':
      return <hr className="border-hairline" />;
    default:
      return (
        <p
          className={cn(
            'text-lg leading-[1.85] text-body',
            first &&
              'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-gold-deep',
          )}
        >
          {renderInline(text)}
        </p>
      );
  }
}

/** Inline formatting: **bold**, *italic*, and gold-highlighted Devanagari. */
function renderInline(text: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .filter((part) => part !== '')
    .flatMap((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return [
          <strong key={`b${i}`} className="font-semibold text-ink">
            {part.slice(2, -2)}
          </strong>,
        ];
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return [<em key={`i${i}`}>{part.slice(1, -1)}</em>];
      }
      return styleScript(part, i);
    });
}

// Unicode ranges for the scripture scripts we highlight in gold:
// Greek, Arabic, Devanagari, Gurmukhi, and CJK (Chinese).
const SCRIPT_CLASS =
  'Ͱ-Ͽἀ-῿؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿ऀ-ॿ਀-੿㐀-䶿一-鿿';
const SCRIPT_SPLIT = new RegExp(`([${SCRIPT_CLASS}]+)`, 'g');
const SCRIPT_HAS = new RegExp(`[${SCRIPT_CLASS}]`);

/** Wrap runs of original-script scripture in a gold serif span (any tradition). */
function styleScript(text: string, prefix: number): ReactNode[] {
  return text
    .split(SCRIPT_SPLIT)
    .filter((seg) => seg !== '')
    .map((seg, j) =>
      SCRIPT_HAS.test(seg) ? (
        <span key={`s${prefix}-${j}`} className="font-serif text-gold">
          {seg}
        </span>
      ) : (
        <span key={`t${prefix}-${j}`}>{seg}</span>
      ),
    );
}
