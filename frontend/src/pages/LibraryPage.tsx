import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Search } from 'lucide-react';
import { getBooks, type Book } from '@features/books';
import { UserMenu } from '@shared/components/ui/UserMenu';
import { ThemeToggle } from '@shared/components/ui/ThemeToggle';
import { TraditionIcon } from '@shared/components/ui/TraditionIcon';
import { ROUTES } from '@shared/constants';
import libraryBanner from '@assets/images/banner3.png';

/** Signed-in dashboard: topbar + banner + book cards + popular reads. */
export default function LibraryPage(): JSX.Element {
  const navigate = useNavigate();
  const allBooks = getBooks();

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(allBooks.map((b) => b.tradition)))],
    [allBooks],
  );

  const books = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allBooks.filter((b) => {
      const matchesQuery =
        !q || b.title.toLowerCase().includes(q) || b.tradition.toLowerCase().includes(q);
      const matchesCategory = category === 'All' || b.tradition === category;
      return matchesQuery && matchesCategory;
    });
  }, [allBooks, query, category]);

  const openBook = (slug: string): void => navigate(ROUTES.bookDetail(slug));

  return (
    <div className="min-h-screen bg-cream">
      {/* topbar */}
      <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-hairline bg-surface/90 px-5 py-3.5 backdrop-blur">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for your next book…"
            className="w-full rounded-xl border border-hairline bg-cream/40 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-gold focus:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
          />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-7 p-5 lg:p-7">
        {/* ── Featured banner ── */}
        <section aria-label="Featured banner" className="relative overflow-hidden rounded-3xl shadow-sm">
          <img
            src={libraryBanner}
            alt="Featured banner"
            className="block h-auto w-full object-cover"
          />
          {/* minimalist headline in the banner's open (cream) space on the left */}
          <div className="pointer-events-none absolute inset-y-0 left-0 flex w-[42%] flex-col justify-center px-5 sm:px-8 md:px-10">
            <h2 className="font-serif text-lg font-bold leading-tight text-neutral-900 sm:text-2xl md:text-4xl">
              Sacred wisdom, daily.
            </h2>
            <p className="mt-1 text-[11px] font-medium text-neutral-900/70 sm:mt-2 sm:text-sm md:text-base">
              One chapter at a time.
            </p>
          </div>
        </section>

        {/* ── My Books ── */}
        <section className="rounded-3xl border border-hairline bg-surface p-6 shadow-sm sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-serif text-2xl font-bold text-ink">My Books</h2>

            {/* category filter */}
            <div className="relative shrink-0">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Filter by category"
                className="cursor-pointer appearance-none rounded-full border border-hairline bg-surface py-2 pl-4 pr-10 text-sm font-medium text-ink shadow-sm transition-colors hover:border-gold/50 focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'All' ? 'All Categories' : c}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            </div>
          </div>

          {books.length === 0 ? (
            <p className="mt-8 text-center text-sm text-muted">No books match your search.</p>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <MyBookCard key={book.slug} book={book} onRead={() => openBook(book.slug)} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/* ───────── cards ───────── */

/**
 * Library book card — a calm, gold-on-surface tile that reads like a
 * scripture plate: tradition mark, the source it's "From", the poetic
 * headline, then chapter count and translation lineage. Fully clickable.
 * Theme-aware: gold stays fixed, everything else flips with light/dark.
 */
function MyBookCard({
  book,
  onRead,
  rank,
}: {
  book: Book;
  onRead: () => void;
  rank?: number;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onRead}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-hairline bg-gradient-to-br from-surface to-cream-surface/60 p-6 text-left shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-lift focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 sm:p-7"
    >
      {/* soft gold glow in the corner */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-gold/10 blur-3xl transition-all duration-300 group-hover:bg-gold/20" />

      {rank !== undefined && (
        <span className="pointer-events-none absolute right-5 top-4 font-serif text-4xl font-bold text-gold/15">
          {rank}
        </span>
      )}

      {/* tradition mark */}
      <TraditionIcon tradition={book.tradition} className="relative h-9 w-9 text-gold" />

      {/* source */}
      <p className="relative mt-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-muted">
        From
      </p>
      <p className="relative mt-1 text-sm font-medium text-gold-deep">{book.title}</p>

      {/* poetic headline */}
      <h3 className="relative mt-2 font-serif text-2xl font-bold leading-tight text-gold sm:text-[1.7rem]">
        {book.subtitle}
      </h3>

      {/* meta */}
      <p className="relative mt-5 text-sm font-medium text-ink">
        {book.chapters.length} {book.unit}
      </p>
      <p className="relative mt-1 text-xs text-muted">{book.language}</p>
    </button>
  );
}

