import { motion } from 'framer-motion';
import { cn } from '@shared/utils/cn';
import { fadeUp } from '../../lib/motion';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}

/** Reveal-on-scroll section heading with serif title + muted subtitle. */
export function SectionHeading({
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeadingProps): JSX.Element {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeUp}
      className={cn(
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className,
      )}
    >
      <h2 className="text-3xl font-bold tracking-tight text-ink md:text-5xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg leading-relaxed text-body">{subtitle}</p>}
    </motion.div>
  );
}
