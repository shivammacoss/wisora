import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Image as ImageIcon, Plus, Search, TrendingUp } from 'lucide-react';
import { getBooks, type Book } from '@features/books';
import { useAuthStore, useLibraryStore, readCountFor } from '@app/store';
import { UserMenu } from '@shared/components/ui/UserMenu';
import { ROUTES } from '@shared/constants';
import libraryBanner from '@assets/images/library_banner.png';

/** Signed-in dashboard: topbar + banner + book strip + popular reads. */
export default function LibraryPage(): JSX.Element {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const read = useLibraryStore((s) => s.read);
  const allBooks = getBooks();

  const [query, setQuery] = useState('');
  const firstName = user?.name?.split(' ')[0] ?? 'reader';

  const books = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allBooks;
    return allBooks.filter(
      (b) => b.title.toLowerCase().includes(q) || b.tradition.toLowerCase().includes(q),
    );
  }, [allBooks, query]);

  const openBook = (slug: string): void => navigate(ROUTES.bookDetail(slug));
  const popular = allBooks.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#eceef4]">
      {/* topbar */}
      <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-black/5 bg-white px-5 py-3.5">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for your next book…"
            className="w-full rounded-xl border border-hairline bg-cream/40 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-muted focus:border-gold focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
          />
        </div>
        <div className="ml-auto">
          <UserMenu />
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-5 lg:p-7">
        {/* ── Featured banner ── */}
        <section aria-label="Featured banner" className="overflow-hidden rounded-3xl shadow-sm">
          <img
            src={libraryBanner}
            alt="Featured banner"
            className="block h-auto w-full object-cover"
          />
        </section>

        {/* ── Your books strip ── */}
        <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink">Your books</h2>
            <p className="text-sm text-muted">
              Welcome back, {firstName} — pick up where you left off.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
            {books.map((book) => (
              <BookTile
                key={book.slug}
                book={book}
                onOpen={() => openBook(book.slug)}
                read={readCountFor(read, book.slug)}
              />
            ))}

            {/* explore-more tile */}
            <button
              type="button"
              onClick={() => navigate(ROUTES.library)}
              className="flex min-h-[150px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-hairline text-muted transition-colors hover:border-gold/50 hover:text-gold-deep"
            >
              <Plus className="h-6 w-6" />
              <span className="text-xs font-semibold">Explore more</span>
            </button>
          </div>
        </section>

        {/* ── Popular reads ── */}
        <section className="overflow-hidden rounded-3xl border border-black/5 bg-gradient-to-br from-white via-white to-cream/50 p-6 shadow-sm sm:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-ink">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold/15">
                  <TrendingUp className="h-4 w-4 text-gold-deep" />
                </span>
                Popular reads
              </h2>
              <p className="mt-1 text-sm text-muted">
                Most-read scriptures across the Wisora community.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(ROUTES.library)}
              className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-gold-deep transition-all hover:gap-2 sm:inline-flex"
            >
              View all <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((b, i) => (
              <PopularCard key={b.slug} book={b} rank={i + 1} onClick={() => openBook(b.slug)} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

/* ───────── small building blocks ───────── */

function BookTile({
  book,
  onOpen,
  read,
}: {
  book: Book;
  onOpen: () => void;
  read: number;
}): JSX.Element {
  const total = book.chapters.length;
  const pct = total ? Math.round((read / total) * 100) : 0;
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group text-left"
    >
      {book.image ? (
        <img
          src={book.image}
          alt={`${book.title} cover`}
          className="h-44 w-full rounded-2xl object-cover shadow-sm"
        />
      ) : (
        // Empty cover placeholder — set `image` on the book in books.data.ts to fill it.
        <div className="flex h-44 w-full flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-hairline bg-cream/40 text-muted/60">
          <ImageIcon className="h-7 w-7" strokeWidth={1.5} />
          <span className="text-[11px] font-medium">Add cover</span>
        </div>
      )}
      <p className="mt-2 truncate text-sm font-semibold text-ink group-hover:text-gold-deep">
        {book.title}
      </p>
      <p className="truncate text-xs text-muted">{book.tradition}</p>
      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-hairline">
        <div className="h-full rounded-full bg-gold" style={{ width: `${pct}%` }} />
      </div>
    </motion.button>
  );
}

function PopularCard({
  book,
  rank,
  onClick,
}: {
  book: Book;
  rank: number;
  onClick: () => void;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
    >
      <span className="relative shrink-0">
        {book.image ? (
          <img
            src={book.image}
            alt={`${book.title} cover`}
            className="h-20 w-16 rounded-xl object-cover shadow-sm"
          />
        ) : (
          // Empty cover placeholder — set `image` on the book in books.data.ts to fill it.
          <div className="flex h-20 w-16 items-center justify-center rounded-xl border-2 border-dashed border-hairline bg-cream/40 text-muted/60">
            <ImageIcon className="h-5 w-5" strokeWidth={1.5} />
          </div>
        )}
        <span className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-xs font-bold text-white shadow">
          {rank}
        </span>
      </span>
      <div className="min-w-0 flex-1">
        <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold-deep">
          <TrendingUp className="h-3 w-3" /> Trending
        </span>
        <h3 className="mt-1.5 truncate font-serif text-base font-bold text-ink group-hover:text-gold-deep">
          {book.title}
        </h3>
        <p className="truncate text-xs text-muted">
          {book.tradition} · {book.chapters.length} chapters
        </p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-1" />
    </button>
  );
}
