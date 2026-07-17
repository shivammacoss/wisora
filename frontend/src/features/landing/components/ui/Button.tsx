import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@shared/utils/cn';

type Variant = 'gold' | 'outline' | 'dark' | 'white';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Optional leading icon (e.g. a lucide-react icon element). */
  leftIcon?: ReactNode;
  /** Optional trailing icon (e.g. an arrow). */
  rightIcon?: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  gold: 'bg-gold text-white shadow-soft hover:bg-gold-deep',
  dark: 'bg-neutral-900 text-white shadow-soft hover:bg-black',
  outline: 'border border-ink/15 bg-surface/60 text-ink hover:border-ink/30 hover:bg-surface',
  white: 'border border-hairline bg-surface text-ink shadow-soft hover:border-ink/20',
};

const SIZES: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

/**
 * Pill-shaped landing-page button. Premium, calm, with gentle hover scale.
 * Distinct from the app's design-system Button so the marketing surface can
 * evolve independently.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'gold', size = 'md', leftIcon, rightIcon, className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(
        'group inline-flex items-center justify-center gap-2 rounded-full font-medium',
        'transition-all duration-300 ease-out hover:scale-[1.02]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
        'disabled:pointer-events-none disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
});
