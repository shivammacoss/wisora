import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { CurrencySelector } from './ui/CurrencySelector';
import { useCurrencyStore } from '@app/store';
import { fadeUp } from '../lib/motion';

interface PricingCardProps {
  onStartFree: () => void;
}

/** "One Coin, One Chapter" — centred pricing teaser with currency selector. */
export function PricingCard({ onStartFree }: PricingCardProps): JSX.Element {
  const currency = useCurrencyStore((s) => s.currency);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);

  return (
    <section id="pricing" className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="rounded-3xl border border-gold/25 bg-cream-surface p-8 text-center shadow-soft md:p-12"
        >
          <h2 className="text-3xl font-bold tracking-tight text-ink">One Coin, One Chapter</h2>
          <p className="mt-3 text-lg text-body">First chapter free from every scripture.</p>

          <div className="mt-7 flex justify-center">
            <CurrencySelector value={currency} onChange={setCurrency} />
          </div>

          <div className="mt-8">
            <span className="font-serif text-6xl font-extrabold text-gold md:text-7xl">
              {currency.symbol}1
            </span>
            <p className="mt-2 text-sm font-medium text-muted">per chapter — lifetime access</p>
          </div>

          <div className="mt-9 flex justify-center">
            <Button size="lg" variant="gold" onClick={onStartFree}>
              Start with the free chapter
            </Button>
          </div>

          <p className="mt-5 text-sm text-muted">No subscription. No hidden fees. Ever.</p>
        </motion.div>
      </div>
    </section>
  );
}
