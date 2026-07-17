import { motion } from 'framer-motion';
import { cn } from '@shared/utils/cn';
import { fadeUp } from '../lib/motion';
import infoCard1 from '@assets/images/info_card1.png';
import infoCard2 from '@assets/images/info_card2.png';
import infoCard3 from '@assets/images/info_card3.png';

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
    art: (
      <img src={infoCard1} alt="Read with focus illustration" className="w-full rounded-2xl transition-transform duration-500 ease-out group-hover:scale-110" />
    ),
    reverse: false,
  },
  {
    title: 'Pay only for what you read',
    description:
      '₹1 per chapter. Pay in your local currency. Lifetime access — unlock once, read forever.',
    art: (
      <img src={infoCard2} alt="Pay per chapter illustration" className="w-full rounded-2xl transition-transform duration-500 ease-out group-hover:scale-110" />
    ),
    reverse: true,
  },
  {
    title: 'Track your spiritual journey',
    description:
      'Bookmarks, progress, streaks, and a private reading library that syncs across devices.',
    art: (
      <img src={infoCard3} alt="Track your journey illustration" className="w-full rounded-2xl transition-transform duration-500 ease-out group-hover:scale-110" />
    ),
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
            <div className="group rounded-3xl bg-cream p-6 shadow-soft">
              <div className="mx-auto max-w-sm overflow-hidden rounded-2xl">{row.art}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
