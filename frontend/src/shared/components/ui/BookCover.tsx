import { cn } from '@shared/utils/cn';
import type { Book } from '@features/books';

interface BookCoverProps {
  book: Pick<Book, 'cover' | 'title' | 'accent'>;
  /** Sizing + corner radius of the outer surface. */
  className?: string;
  /** Sizing of the frosted symbol disc. */
  symbolClassName?: string;
}

/**
 * Premium book cover: brand gradient, a soft top-left light sheen, a large
 * translucent serif monogram watermark, and the tradition symbol in a frosted
 * glass disc. Shared by the library grid and the book detail hero.
 */
export function BookCover({ book, className, symbolClassName }: BookCoverProps): JSX.Element {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-hidden bg-gradient-to-br',
        book.accent,
        className,
      )}
    >
      {/* light sheen */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(120% 120% at 18% 0%, rgba(255,255,255,0.40), transparent 55%)',
        }}
      />

      {/* monogram watermark */}
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-5 -right-1 select-none font-serif text-[7rem] font-black leading-none text-white/15"
      >
        {book.title.charAt(0)}
      </span>

      {/* tradition symbol in frosted disc */}
      <span
        aria-hidden
        className={cn(
          'relative flex items-center justify-center rounded-full bg-surface/25 shadow-soft ring-1 ring-white/40 backdrop-blur-sm',
          symbolClassName,
        )}
      >
        {book.cover}
      </span>
    </div>
  );
}
