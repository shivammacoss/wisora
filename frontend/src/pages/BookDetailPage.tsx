import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { getBookBySlug, type Chapter } from '@features/books';
import { ChapterRow, PaywallModal } from '@features/book';
import { useChapterCheckout } from '@features/payments';
import { CurrencySelector } from '@features/landing/components/ui/CurrencySelector';
import { chapterUnlocked, useCurrencyStore, useLibraryStore, toPaymentCurrency } from '@app/store';
import { AppHeader } from '@shared/components/ui/AppHeader';
import { BookCover } from '@shared/components/ui/BookCover';
import { ROUTES } from '@shared/constants';

/** Book detail — hero + chapter list with per-chapter paywall. */
export default function BookDetailPage(): JSX.Element {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const book = getBookBySlug(bookId);

  const currency = useCurrencyStore((s) => s.currency);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);
  const unlocked = useLibraryStore((s) => s.unlocked);
  const read = useLibraryStore((s) => s.read);
  const unlockChapter = useLibraryStore((s) => s.unlockChapter);

  const [paywallChapter, setPaywallChapter] = useState<Chapter | null>(null);

  // Grant access after a confirmed payment (real or demo), then open the reader.
  // Declared before the early return below to satisfy the Rules of Hooks.
  const checkout = useChapterCheckout({
    onSuccess: (chapter) => {
      if (!book) return;
      unlockChapter(book.slug, chapter.order);
      setPaywallChapter(null);
      navigate(ROUTES.reader(book.slug, String(chapter.order)));
    },
  });

  if (!book) {
    return (
      <div className="min-h-screen bg-cream">
        <AppHeader />
        <main className="mx-auto max-w-3xl px-6 py-20 text-center">
          <p className="text-body">Book not found.</p>
          <Link to={ROUTES.library} className="mt-4 inline-block font-medium text-gold-deep underline">
            ← Back to your library
          </Link>
        </main>
      </div>
    );
  }

  const openReader = (chapter: Chapter): void =>
    navigate(ROUTES.reader(book.slug, String(chapter.order)));

  return (
    <div className="min-h-screen bg-cream">
      <AppHeader />

      {/* hero — unified golden theme banner across all books */}
      <div className="bg-gradient-to-br from-amber-200 via-gold to-gold-deep">
        <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">
          <button
            type="button"
            onClick={() => navigate(ROUTES.library)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/70 transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" /> Library
          </button>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 flex flex-col items-start gap-5 sm:flex-row sm:items-center"
          >
            <BookCover
              book={book}
              className="h-28 w-28 shrink-0 rounded-3xl shadow-lift ring-1 ring-white/40"
              symbolClassName="h-16 w-16 text-4xl"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-ink/60">
                {book.tradition}
              </p>
              <h1 className="mt-1 font-serif text-4xl font-extrabold text-ink md:text-5xl">
                {book.title}
              </h1>
            </div>
          </motion.div>

          <p className="mt-5 max-w-2xl leading-relaxed text-ink/80">{book.description}</p>
        </div>
      </div>

      {/* chapters */}
      <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-serif text-2xl font-bold text-ink">
            Chapters <span className="text-base font-normal text-muted">({book.chapters.length})</span>
          </h2>
          <CurrencySelector value={currency} onChange={setCurrency} />
        </div>

        <ul className="mt-6 flex flex-col gap-3">
          {book.chapters.map((chapter) => {
            const isUnlocked = chapterUnlocked(unlocked, book.slug, chapter.order, chapter.isFree);
            return (
              <ChapterRow
                key={chapter.order}
                book={book}
                chapter={chapter}
                unlocked={isUnlocked}
                read={Boolean(read[`${book.slug}:${chapter.order}`])}
                currencySymbol={currency.symbol}
                onRead={() => openReader(chapter)}
                onUnlock={() => setPaywallChapter(chapter)}
              />
            );
          })}
        </ul>
      </main>

      <PaywallModal
        open={paywallChapter !== null}
        book={book}
        chapter={paywallChapter}
        currencySymbol={currency.symbol}
        processing={checkout.processing}
        error={checkout.error}
        onClose={() => {
          checkout.clearError();
          setPaywallChapter(null);
        }}
        onPay={() =>
          paywallChapter && checkout.start(book, paywallChapter, toPaymentCurrency(currency.code))
        }
      />
    </div>
  );
}
