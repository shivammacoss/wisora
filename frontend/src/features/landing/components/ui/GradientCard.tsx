import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@shared/utils/cn';

interface GradientCardProps {
  /** Tailwind gradient class pair, e.g. "from-amber-200 to-orange-300". */
  gradient: string;
  /** Icon element rendered inside a frosted white badge. */
  icon: ReactNode;
  title: string;
  description: string;
  /** Optional bottom CTA label; renders a "Label →" link affordance. */
  cta?: string;
  className?: string;
}

/**
 * Adobe-Podcast-inspired feature card: soft gradient surface, frosted icon
 * badge, serif title. Lifts gently on hover.
 */
export function GradientCard({
  gradient,
  icon,
  title,
  description,
  cta,
  className,
}: GradientCardProps): JSX.Element {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={cn(
        'group flex flex-col rounded-3xl bg-gradient-to-br p-8 shadow-soft',
        'transition-shadow duration-300 hover:shadow-lift',
        gradient,
        className,
      )}
    >
      <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 text-ink backdrop-blur">
        {icon}
      </div>
      <h3 className="text-xl font-bold tracking-tight text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink/70">{description}</p>
      {cta && (
        <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-ink/80 transition-transform duration-300 group-hover:translate-x-0.5">
          {cta} <span aria-hidden>→</span>
        </span>
      )}
    </motion.article>
  );
}
