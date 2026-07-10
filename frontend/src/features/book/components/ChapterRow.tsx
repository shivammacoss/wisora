import { BookOpen, Check, Lock } from 'lucide-react';
import { Button } from '@features/landing/components/ui/Button';
import type { Book, Chapter } from '@features/books';

interface ChapterRowProps {
  book: Book;
  chapter: Chapter;
  /** Accessible (free or purchased)? */
  unlocked: boolean;
  /** Already opened in the reader? */
  read: boolean;
  /** Symbol of the selected display currency (₹, $, €, …). */
  currencySymbol: string;
  /** Open the reader for an accessible chapter. */
  onRead: () => void;
  /** Request to unlock a locked chapter (opens the paywall). */
  onUnlock: () => void;
}

/** A single chapter row: free/owned chapters read; locked ones show a price. */
export function ChapterRow({
  chapter,
  unlocked,
  read,
  currencySymbol,
  onRead,
  onUnlock,
}: ChapterRowProps): JSX.Element {
  return (
    <li className="flex items-center gap-4 rounded-2xl border border-hairline bg-white p-4 shadow-soft transition-shadow duration-300 hover:shadow-lift">
      {/* order / status badge */}
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-serif text-lg ${
          read ? 'bg-emerald-100 text-emerald-700' : 'bg-cream-surface text-gold-deep'
        }`}
      >
        {read ? <Check className="h-5 w-5" /> : chapter.order}
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="truncate font-semibold text-ink">{chapter.title}</h4>
        <p className="text-sm text-muted">{chapter.readingTimeMins} min read</p>
      </div>

      {unlocked ? (
        <div className="flex items-center gap-3">
          {chapter.isFree && (
            <span className="hidden rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 sm:inline">
              Free
            </span>
          )}
          <Button
            size="sm"
            variant={read ? 'outline' : 'gold'}
            leftIcon={<BookOpen className="h-4 w-4" />}
            onClick={onRead}
          >
            {read ? 'Reread' : 'Read'}
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onUnlock}
          className="inline-flex items-center gap-2 rounded-full border border-hairline bg-cream-surface px-4 py-2 text-sm font-semibold text-ink transition-colors duration-300 hover:border-gold/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          <Lock className="h-4 w-4 text-muted" />
          {currencySymbol}1
        </button>
      )}
    </li>
  );
}
