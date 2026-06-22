import { motion } from 'framer-motion';
import { cn } from '@shared/utils/cn';
import { CoinArt, OpenBookArt, ProgressArt } from './illustrations/RowArt';
import { fadeUp } from '../lib/motion';

interface Row {
  title: string;
  description: string;
  art: JSX.Element;
  /** When true, illustration sits on the left (text on the right). */
  reverse: boolean;
}

const ROWS: Row[] = [
  {
    title: 'Read with focus, not pressure',
    description:
      'One chapter at a time. No subscriptions, no nagging notifications. Just you and the wisdom of the ages.',
    art: <OpenBookArt />,
    reverse: false,
  },
  {
    title: 'Pay only for what you read',
    description:
      '₹1 per chapter. Pay in your local currency. Lifetime access — unlock once, read forever.',
    art: <CoinArt />,
    reverse: true,
  },
  {
    title: 'Track your spiritual journey',
    description:
      'Bookmarks, progress, streaks, and a private reading library that syncs across devices.',
    art: <ProgressArt />,
    reverse: false,
  },
];

/** Alternating illustration + text highlight rows. */
export function FeatureRows(): JSX.Element {
  return (
    <section className="bg-cream-surface/60">
      <div className="mx-auto max-w-6xl px-6">
        {ROWS.map((row) => (
          <motion.div
            key={row.title}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            className={cn(
              'grid items-center gap-10 py-16 md:grid-cols-2 md:gap-16',
              row.reverse && 'md:[&>*:first-child]:order-2',
            )}
          >
            {/* text */}
            <div>
              <h3 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">
                {row.title}
              </h3>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-body">{row.description}</p>
            </div>

            {/* illustration */}
            <div className="rounded-3xl bg-cream p-6 shadow-soft">
              <div className="mx-auto max-w-sm">{row.art}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
