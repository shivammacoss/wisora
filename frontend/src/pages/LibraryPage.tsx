import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Library as LibraryIcon, Sparkles } from 'lucide-react';
import { getBooks } from '@features/books';
import { BookCard } from '@features/library';
import { useAuthStore, useLibraryStore, readCountFor } from '@app/store';
import { BookCover } from '@shared/components/ui/BookCover';
import { AppHeader } from '@shared/components/ui/AppHeader';
import { ROUTES } from '@shared/constants';

/** Home for signed-in readers: continue-reading feature + a grid of books. */
export default function LibraryPage(): JSX.Element {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const read = useLibraryStore((s) => s.read);
  const books = getBooks();

  const firstName = user?.name?.split(' ')[0] ?? 'reader';

  // Aggregate progress for the stats strip + continue-reading feature.
  const withProgress = books.map((book) => {
    const total = book.chapters.length;
    const done = readCountFor(read, book.slug);
    return { book, total, done, pct: total ? Math.round((done / total) * 100) : 0 };
  });
  const chaptersRead = withProgress.reduce((sum, b) => sum + b.done, 0);
  const booksStarted = withProgress.filter((b) => b.done > 0).length;
  const inProgress = withProgress
    .filter((b) => b.done > 0 && b.done < b.total)
    .sort((a, b) => b.pct - a.pct)[0];

  const stats = [
    { icon: LibraryIcon, label: 'Books', value: books.length },
    { icon: BookOpen, label: 'Chapters read', value: chaptersRead },
    { icon: Sparkles, label: 'Books started', value: booksStarted },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <AppHeader />

      <main className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm font-medium text-gold-deep">Welcome back, {firstName} ✨</p>
          <h1 className="mt-2 font-serif text-3xl font-extrabold tracking-tight text-ink md:text-4xl">
            Your library
          </h1>

          {/* stats strip */}
          <div className="mt-6 grid max-w-xl grid-cols-3 gap-3">
            {stats.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-2xl border border-hairline bg-white p-4 shadow-soft"
              >
                <Icon className="h-4 w-4 text-gold" />
                <p className="mt-2 text-2xl font-bold tabular-nums text-ink">{value}</p>
                <p className="text-xs text-muted">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* continue reading */}
        {inProgress && (
          <motion.button
            type="button"
            onClick={() => navigate(ROUTES.bookDetail(inProgress.book.slug))}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="group mt-8 flex w-full items-center gap-5 overflow-hidden rounded-3xl border border-hairline bg-white p-5 text-left shadow-soft transition-shadow hover:shadow-lift"
          >
            <BookCover
              book={inProgress.book}
              className="h-20 w-20 shrink-0 rounded-2xl"
              symbolClassName="h-12 w-12 text-2xl"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gold-deep">
                Continue reading
              </p>
              <h2 className="mt-0.5 truncate font-serif text-xl font-bold text-ink">
                {inProgress.book.title}
              </h2>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-1.5 w-40 max-w-full overflow-hidden rounded-full bg-hairline">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold to-gold-deep"
                    style={{ width: `${inProgress.pct}%` }}
                  />
                </div>
                <span className="text-xs text-muted">
                  {inProgress.done}/{inProgress.total} chapters
                </span>
              </div>
            </div>
            <ArrowRight className="hidden h-5 w-5 shrink-0 text-muted transition-transform group-hover:translate-x-1 sm:block" />
          </motion.button>
        )}

        {/* catalog */}
        <h2 className="mt-12 font-serif text-2xl font-bold text-ink">All scriptures</h2>
        <p className="mt-1 text-sm text-body">
          The first chapter of every book is free — ₹1 per chapter for lifetime access.
        </p>

        <section
          aria-label="Books"
          className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {books.map((book) => (
            <BookCard key={book.slug} book={book} />
          ))}
        </section>
      </main>
    </div>
  );
}
