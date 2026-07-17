import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@app/store';
import { cn } from '@shared/utils/cn';

/** Light/dark mode toggle. Flips the whole app via the `dark` class on <html>. */
export function ThemeToggle({ className }: { className?: string }): JSX.Element {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-surface text-ink shadow-soft transition-colors hover:border-gold/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
        className,
      )}
    >
      {isDark ? <Sun className="h-5 w-5 text-gold" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
