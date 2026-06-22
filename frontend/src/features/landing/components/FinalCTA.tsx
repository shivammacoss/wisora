import { type FormEvent, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/Button';
import { fadeUp } from '../lib/motion';

interface FinalCTAProps {
  onContinueGuest: () => void;
  onContinueGoogle: () => void;
  onMagicLink: (email: string) => void;
}

/** Closing CTA band with guest/Google buttons and a magic-link email field. */
export function FinalCTA({
  onContinueGuest,
  onContinueGoogle,
  onMagicLink,
}: FinalCTAProps): JSX.Element {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (email.trim()) onMagicLink(email.trim());
  };

  return (
    <section className="bg-gradient-to-b from-cream via-cream-surface to-amber-50 py-24 md:py-32">
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

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button size="lg" variant="gold" onClick={onContinueGuest}>
            Continue as Guest
          </Button>
          <Button size="lg" variant="white" onClick={onContinueGoogle}>
            <GoogleGlyph />
            Continue with Google
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
            className="flex-1 rounded-full border border-hairline bg-white px-5 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-gold"
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

/** Small inline Google "G" mark. */
function GoogleGlyph(): JSX.Element {
  return (
    <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18A13.6 13.6 0 0 1 10.96 24c0-1.45.25-2.86.7-4.18v-5.7H4.34A22 22 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 9.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 3.18 29.93 1 24 1 15.4 1 7.96 5.93 4.34 13.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}
