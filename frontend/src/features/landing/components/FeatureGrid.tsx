import { motion } from 'framer-motion';
import { BookOpen, Heart, Lock, Sparkles, TrendingUp, Wallet } from 'lucide-react';
import { GradientCard } from './ui/GradientCard';
import { SectionHeading } from './ui/SectionHeading';
import { fadeUp, revealOnScroll } from '../lib/motion';

const PRIMARY = [
  {
    icon: <BookOpen className="h-6 w-6" />,
    title: 'Ancient Texts',
    description:
      'Read the Gita, Bible, Quran, Tao Te Ching, Dhammapada, and more — all in one place.',
    gradient: 'from-amber-200 to-orange-300',
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: '5–10 Minute Chapters',
    description: 'Bite-sized summaries designed for peace and understanding, not overload.',
    gradient: 'from-rose-200 to-pink-300',
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: 'Track Your Journey',
    description: 'Build a daily reading habit. Bookmarks, progress, and streaks — all synced.',
    gradient: 'from-emerald-200 to-teal-300',
  },
];

const SECONDARY = [
  {
    icon: <Wallet className="h-5 w-5 text-gold" />,
    title: 'Multi-currency',
    description: '₹1, $1, €1 — pay in your local currency.',
  },
  {
    icon: <Lock className="h-5 w-5 text-gold" />,
    title: 'Lifetime access',
    description: 'Unlock once, read forever.',
  },
  {
    icon: <Sparkles className="h-5 w-5 text-gold" />,
    title: 'Distraction-free reader',
    description: 'Focus mode, dark / sepia themes.',
  },
];

/** "Why Wisora" — 3 gradient feature cards + 3 secondary cream cards. */
export function FeatureGrid(): JSX.Element {
  return (
    <section id="about" className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          title="A calmer way to read sacred texts"
          subtitle="Designed for reflection, not rush."
        />

        {/* Primary gradient cards */}
        <motion.div {...revealOnScroll} className="mt-14 grid gap-6 md:grid-cols-3">
          {PRIMARY.map((card) => (
            <motion.div key={card.title} variants={fadeUp}>
              <GradientCard {...card} />
            </motion.div>
          ))}
        </motion.div>

        {/* Secondary cream cards */}
        <motion.div {...revealOnScroll} className="mt-6 grid gap-6 md:grid-cols-3">
          {SECONDARY.map((card) => (
            <motion.div
              key={card.title}
              variants={fadeUp}
              className="flex items-start gap-4 rounded-3xl border border-hairline bg-cream-surface p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft"
            >
              <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-soft">
                {card.icon}
              </span>
              <div>
                <h3 className="text-base font-bold text-ink">{card.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-body">{card.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
