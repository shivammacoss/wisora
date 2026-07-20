import { type FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { fadeUp } from '../lib/motion';

interface FinalCTAProps {
  onContinueGuest: () => void;
  onMagicLink: (email: string) => void;
}

/** Closing CTA band with a guest button and a magic-link email field. */
export function FinalCTA({ onContinueGuest, onMagicLink }: FinalCTAProps): JSX.Element {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (email.trim()) onMagicLink(email.trim());
  };

  return (
    <section className="bg-gradient-to-b from-cream via-cream-surface to-amber-50 py-24 dark:from-cream dark:via-cream dark:to-cream md:py-32">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={fadeUp}
        className="mx-auto max-w-3xl px-6 text-center"
      >
        <h2 className="text-4xl font-bold tracking-tight text-ink md:text-5xl">
          Begin your daily wisdom practice.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-body">
          Join readers around the world rediscovering ancient texts — five minutes at a time.
        </p>

        <div className="mt-9 flex justify-center">
          <Button size="lg" variant="gold" onClick={onContinueGuest}>
            Continue as Guest
          </Button>
        </div>

        {/* magic-link */}
        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="cta-email" className="sr-only">
            Email address
          </label>
          <input
            id="cta-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded-full border border-hairline bg-surface px-5 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <Button type="submit" variant="dark" size="lg" className="shrink-0">
            Send magic link
          </Button>
        </form>

        <p className="mt-5 text-sm text-muted">
          Login to sync your progress, bookmarks &amp; reading history across devices.
        </p>
      </motion.div>
    </section>
  );
}
