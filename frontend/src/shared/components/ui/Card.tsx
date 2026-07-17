import { type HTMLAttributes } from 'react';
import { cn } from '@shared/utils/cn';

/** Design-system surface. Dumb & reusable — add `onClick` to make it interactive. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-sacred-100 bg-surface shadow-sm transition',
        props.onClick && 'cursor-pointer hover:-translate-y-1 hover:shadow-lg',
        className,
      )}
      {...props}
    />
  );
}
