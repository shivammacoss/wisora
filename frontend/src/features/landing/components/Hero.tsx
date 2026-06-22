import { motion } from 'framer-motion';
import { ArrowRight, UserPlus } from 'lucide-react';
import { Button } from './ui/Button';
import { fadeUp, staggerContainer } from '../lib/motion';

interface HeroProps {
  onSignUp: () => void;
  onExploreLibrary: () => void;
}

/** Centered hero: serif headline, subcopy and the primary CTAs. */
export function Hero({ onSignUp, onExploreLibrary }: HeroProps): JSX.Element {
  return (
    <section id="top" className="relative overflow-hidden">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 pb-16 pt-2 text-center sm:pb-20 sm:pt-6 md:pb-28"
      >
        <motion.h1
          variants={fadeUp}
          className="text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl sm:leading-[1.05] md:text-7xl"
        >
          Ancient wisdom,
          <br className="hidden sm:block" /> one chapter at a time.
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-5 max-w-md text-base leading-relaxed text-body sm:mt-6 sm:max-w-3xl sm:text-lg"
        >
          Read summaries of the Gita, Bible, Quran, Tao Te Ching, and more — in just 5 minutes a day.
          First chapter free. ₹1 per chapter for lifetime access.
        </motion.p>

        {/* CTAs — full-width stacked pills on mobile, inline from sm up */}
        <motion.div
          variants={fadeUp}
          className="mt-8 flex w-full max-w-xs flex-col gap-3 sm:mt-9 sm:max-w-none sm:flex-row sm:justify-center"
        >
          <Button
            size="lg"
            variant="gold"
            leftIcon={<UserPlus className="h-5 w-5" />}
            onClick={onSignUp}
            className="w-full sm:w-auto"
          >
            Sign Up
          </Button>
          <Button
            size="lg"
            variant="outline"
            rightIcon={<ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />}
            onClick={onExploreLibrary}
            className="w-full sm:w-auto"
          >
            Explore Library
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
