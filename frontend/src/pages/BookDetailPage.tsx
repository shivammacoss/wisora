import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ListOrdered } from 'lucide-react';
import { getBookBySlug, type Chapter } from '@features/books';
import { ChapterRow, PaywallModal } from '@features/book';
import { ChapterContentEditor, ChapterManager, chaptersApi, type ManagedChapter } from '@features/chapters';
import { useChapterCheckout } from '@features/payments';
import { CurrencySelector } from '@features/landing/components/ui/CurrencySelector';
import { chapterUnlocked, useAuthStore, useCurrencyStore, useLibraryStore, toPaymentCurrency } from '@app/store';
import { AppHeader } from '@shared/components/ui/AppHeader';
import { TraditionIcon } from '@shared/components/ui/TraditionIcon';
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
  // Admins read every chapter free — no paywall.
  const isAdmin = useAuthStore((s) => s.user?.role === 'admin');

  const [paywallChapter, setPaywallChapter] = useState<Chapter | null>(null);
  const [editChapter, setEditChapter] = useState<Chapter | null>(null);
  // Backend-managed chapter list (null → use bundled). Kept in sync by the manager.
  const [managed, setManaged] = useState<ManagedChapter[] | null>(null);
  const [manageOpen, setManageOpen] = useState(false);

  // Prefer the backend-managed list when a book has one; otherwise bundled.
  useEffect(() => {
    if (!bookId) return;
    let alive = true;
    chaptersApi
      .list(bookId)
      .then((list) => {
        if (alive && list.length > 0) setManaged(list);
      })
      .catch(() => {
        /* backend unreachable → bundled fallback */
      });
    return () => {
      alive = false;
    };
  }, [bookId]);

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

  // Chapters to show: the backend-managed list (mapped) or the bundled list.
  const displayChapters: Chapter[] = managed
    ? managed.map((m) => ({
        order: m.order,
        title: m.title,
        readingTimeMins: m.readingTimeMins,
        isFree: m.isFree,
        essence: m.essence ?? undefined,
      }))
    : book.chapters;

  return (
    <div className="min-h-screen bg-cream">
      <AppHeader showBack />

      <main className="mx-auto max-w-3xl px-6 py-10 md:py-14">
        {/* book header — plain (no gold banner) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start gap-5 sm:flex-row sm:items-center"
        >
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border border-gold/25 bg-gradient-to-br from-gold/15 to-gold/5 shadow-soft">
            <TraditionIcon tradition={book.tradition} className="h-12 w-12 text-gold" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-deep">
              {book.subtitle}
            </p>
            <h1 className="mt-1 font-serif text-4xl font-extrabold text-ink md:text-5xl">
              {book.title}
            </h1>
          </div>
        </motion.div>

        <p className="mt-5 max-w-2xl leading-relaxed text-body">{book.description}</p>

        {/* chapters */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-serif text-2xl font-bold text-ink">
            Chapters <span className="text-base font-normal text-muted">({displayChapters.length})</span>
          </h2>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <button
                type="button"
                onClick={() => setManageOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-cream-surface px-4 py-2 text-sm font-semibold text-gold-deep transition-colors hover:border-gold/50 hover:bg-gold/10"
              >
                <ListOrdered className="h-4 w-4" /> Manage chapters
              </button>
            )}
            <CurrencySelector value={currency} onChange={setCurrency} />
          </div>
        </div>

        <ul className="mt-6 flex flex-col gap-3">
          {displayChapters.map((chapter) => {
            const isUnlocked =
              isAdmin || chapterUnlocked(unlocked, book.slug, chapter.order, chapter.isFree);
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
                onEditContent={isAdmin ? () => setEditChapter(chapter) : undefined}
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

      {/* admin: chapter content editor */}
      {editChapter && (
        <ChapterContentEditor
          book={book}
          chapter={editChapter}
          onClose={() => setEditChapter(null)}
        />
      )}

      {/* admin: chapter list manager (add / delete / reorder) */}
      {manageOpen && (
        <ChapterManager
          book={book}
          onClose={() => setManageOpen(false)}
          onChanged={(list) => setManaged(list)}
        />
      )}
    </div>
  );
}
