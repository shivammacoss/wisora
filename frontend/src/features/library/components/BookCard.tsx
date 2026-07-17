import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useLibraryStore, readCountFor } from '@app/store';
import { BookCover } from '@shared/components/ui/BookCover';
import { ROUTES } from '@shared/constants';
import type { Book } from '@features/books';

/** A book in the library grid: premium cover, title, tradition, and progress. */
export function BookCard({ book }: { book: Book }): JSX.Element {
  const navigate = useNavigate();
  const read = useLibraryStore((s) => s.read);

  const total = book.chapters.length;
  const done = readCountFor(read, book.slug);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const complete = total > 0 && done === total;

  return (
    <motion.button
      type="button"
      onClick={() => navigate(ROUTES.bookDetail(book.slug))}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface text-left shadow-soft transition-shadow duration-300 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      {/* cover */}
      <div className="relative">
        <BookCover book={book} className="h-40 w-full" symbolClassName="h-[4.5rem] w-[4.5rem] text-4xl" />
        {complete ? (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
            <Check className="h-3 w-3" /> Completed
          </span>
        ) : (
          <span className="absolute left-3 top-3 rounded-full bg-surface/85 px-2.5 py-1 text-[11px] font-semibold text-ink backdrop-blur">
            Chapter 1 free
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted">
          {book.tradition}
        </p>
        <h3 className="mt-1 font-serif text-xl font-bold text-ink transition-colors group-hover:text-gold-deep">
          {book.title}
        </h3>
        <p className="mt-1 text-sm text-muted">{total} chapters</p>

        {/* progress */}
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between text-xs font-medium text-body">
            <span>{done > 0 ? `${pct}% read` : 'Not started'}</span>
            <span className="tabular-nums text-muted">
              {done}/{total}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-hairline">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold to-gold-deep transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </motion.button>
  );
}
