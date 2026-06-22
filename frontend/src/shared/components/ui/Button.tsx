import { type ButtonHTMLAttributes } from 'react';
import { cn } from '@shared/utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
}

/** Design-system button. Dumb & reusable — no business logic. */
export function Button({ variant = 'primary', className, ...props }: ButtonProps): JSX.Element {
  return (
    <button
      className={cn(
        'rounded px-4 py-2 font-medium transition disabled:opacity-50',
        variant === 'primary' && 'bg-sacred-500 text-white hover:bg-sacred-700',
        variant === 'ghost' && 'text-sacred-700 hover:bg-sacred-100',
        className,
      )}
      {...props}
    />
  );
}
