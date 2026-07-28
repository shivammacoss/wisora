import { Bird, BookOpen, Flame, Flower2, Moon } from 'lucide-react';

/**
 * Gold outline glyph per tradition — lucide icons where they fit, custom SVGs
 * for yin-yang (Taoism) and the dharma wheel (Buddhism). Shared by the library
 * cards and the book-detail header so the mark is identical everywhere.
 */
export function TraditionIcon({
  tradition,
  className,
}: {
  tradition: string;
  className?: string;
}): JSX.Element {
  switch (tradition) {
    case 'Hinduism':
      return <Flower2 className={className} strokeWidth={1.5} />;
    case 'Christianity':
      return <Bird className={className} strokeWidth={1.5} />;
    case 'Islam':
      return <Moon className={className} strokeWidth={1.5} />;
    case 'Sikhism':
      return <Flame className={className} strokeWidth={1.5} />;
    case 'Taoism':
      return <YinYang className={className} />;
    case 'Buddhism':
      return <DharmaWheel className={className} />;
    default:
      return <BookOpen className={className} strokeWidth={1.5} />;
  }
}

/** Yin-yang mark (Taoism) — not available in lucide. */
function YinYang({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a5 5 0 0 0 0 10 5 5 0 0 1 0 10" />
      <circle cx="12" cy="7" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Dharma wheel (Buddhism) — not available in lucide. */
function DharmaWheel({ className }: { className?: string }): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.64 5.64l2.12 2.12M16.24 16.24l2.12 2.12M18.36 5.64l-2.12 2.12M7.76 16.24l-2.12 2.12" />
    </svg>
  );
}
