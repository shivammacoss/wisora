import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronDown, Image as ImageIcon, Search, Share2, TrendingUp } from 'lucide-react';
import { getBooks, type Book } from '@features/books';
import { UserMenu } from '@shared/components/ui/UserMenu';
import { ThemeToggle } from '@shared/components/ui/ThemeToggle';
import { ROUTES } from '@shared/constants';
import libraryBanner from '@assets/images/banner1.png';

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
  const popular = allBooks.slice(0, 3);

  const shareBook = (book: Book): void => {
    const url = `${window.location.origin}${ROUTES.bookDetail(book.slug)}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      void navigator.share({ title: book.title, url }).catch(() => {});
    } else {
      void navigator.clipboard?.writeText(url).catch(() => {});
    }
  };

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
          {/* reading quote — sits in the open space on the left */}
          <blockquote className="pointer-events-none absolute inset-y-0 left-0 flex w-[46%] flex-col justify-center px-5 sm:px-8 md:px-10">
            <p className="font-serif text-base font-medium italic leading-snug text-ink/80 sm:text-xl md:text-2xl">
              “Wisdom begins in wonder.”
            </p>
            <footer className="mt-1.5 text-[10px] font-semibold uppercase tracking-widest text-ink/50 sm:mt-2 sm:text-xs">
              — Socrates
            </footer>
          </blockquote>
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
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {books.map((book) => (
                <MyBookCard
                  key={book.slug}
                  book={book}
                  onRead={() => openBook(book.slug)}
                  onShare={() => shareBook(book)}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Popular reads ── */}
        <section className="overflow-hidden rounded-3xl border border-hairline bg-gradient-to-br from-surface via-surface to-cream/40 p-6 shadow-sm sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2.5 font-serif text-2xl font-bold text-ink">
                <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5">
                  <TrendingUp className="h-5 w-5 text-gold-deep" />
                </span>
                Popular reads
              </h2>
              <p className="mt-1 text-sm text-muted">Most-read scriptures across the Wisora community.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate(ROUTES.library)}
              className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-gold-deep transition-all hover:gap-2 sm:inline-flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {popular.map((b, i) => (
              <MyBookCard
                key={b.slug}
                book={b}
                rank={i + 1}
                onRead={() => openBook(b.slug)}
                onShare={() => shareBook(b)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

/* ───────── cards ───────── */

function MyBookCard({
  book,
  onRead,
  onShare,
  rank,
}: {
  book: Book;
  onRead: () => void;
  onShare: () => void;
  rank?: number;
}): JSX.Element {
  return (
    <article className="flex gap-4 rounded-2xl border border-hairline bg-surface p-4 shadow-sm transition-shadow duration-300 hover:shadow-md">
      {/* cover — empty space, ready for a real cover image */}
      <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-xl border border-hairline bg-cream/40 sm:w-28">
        {book.image ? (
          <img src={book.image} alt={`${book.title} cover`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted/40">
            <ImageIcon className="h-7 w-7" />
          </div>
        )}
        {rank !== undefined && (
          <span className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-deep text-[11px] font-extrabold text-white shadow ring-2 ring-white">
            {rank}
          </span>
        )}
      </div>

      {/* content */}
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-serif text-lg font-bold leading-snug text-ink">{book.title}</h3>
        <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-muted">{book.description}</p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-3">
          <button
            type="button"
            onClick={onRead}
            className="rounded-full bg-gold/10 px-4 py-1.5 text-sm font-semibold text-gold-deep transition-colors hover:bg-gold/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Read More
          </button>
          <button
            type="button"
            onClick={onShare}
            aria-label={`Share ${book.title}`}
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-cream hover:text-gold-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
