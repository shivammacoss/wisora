import { motion } from 'framer-motion';
import { SectionHeading } from './ui/SectionHeading';
import { fadeUp } from '../lib/motion';

/** Mock Wisora reader UI inside a browser frame. */
export function HowItWorks(): JSX.Element {
  return (
    <section id="how-it-works" className="bg-cream-surface/60 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          title="Read, reflect, and grow — without the noise"
          subtitle="Use Wisora right in your browser. No downloads, no clutter."
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="relative mx-auto mt-16 max-w-4xl"
        >
          {/* background blob */}
          <div className="pointer-events-none absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-amber-100/70 via-cream to-rose-100/60 blur-2xl" />

          {/* Browser frame */}
          <div className="overflow-hidden rounded-3xl border border-hairline bg-white shadow-lift">
            {/* top bar */}
            <div className="flex items-center gap-2 border-b border-hairline bg-cream-surface px-5 py-3">
              <span className="h-3 w-3 rounded-full bg-rose-300" />
              <span className="h-3 w-3 rounded-full bg-amber-300" />
              <span className="h-3 w-3 rounded-full bg-emerald-300" />
              <span className="ml-4 hidden rounded-full bg-white px-4 py-1 text-xs text-muted sm:block">
                wisora.app/read/bhagavad-gita/4
              </span>
            </div>

            {/* reader body */}
            <div className="grid gap-0 sm:grid-cols-[1fr_220px]">
              {/* main column */}
              <div className="px-7 py-9 sm:px-10">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                  Bhagavad Gita · Chapter 4
                </p>
                <h3 className="mt-3 font-serif text-2xl font-bold text-ink">
                  The Yoga of Wisdom
                </h3>
                <div className="mt-5 space-y-3">
                  {['w-full', 'w-11/12', 'w-full', 'w-10/12', 'w-9/12'].map((w, i) => (
                    <div key={i} className={`h-3 rounded-full bg-hairline ${w}`} />
                  ))}
                </div>
                <div className="mt-6 rounded-2xl border-l-4 border-gold bg-cream-surface px-5 py-4">
                  <div className="h-3 w-3/4 rounded-full bg-amber-200" />
                  <div className="mt-2 h-3 w-2/3 rounded-full bg-amber-200/70" />
                </div>
                <div className="mt-6 space-y-3">
                  {['w-full', 'w-10/12'].map((w, i) => (
                    <div key={i} className={`h-3 rounded-full bg-hairline ${w}`} />
                  ))}
                </div>
              </div>

              {/* sidebar */}
              <aside className="hidden flex-col gap-3 border-l border-hairline bg-cream/60 px-5 py-9 sm:flex">
                <p className="text-xs font-semibold text-muted">CHAPTERS</p>
                {['Arjuna’s Dilemma', 'Knowledge', 'Action', 'Wisdom', 'Renunciation'].map(
                  (c, i) => (
                    <div
                      key={c}
                      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs ${
                        i === 3 ? 'bg-gold/15 font-semibold text-gold-deep' : 'text-body'
                      }`}
                    >
                      <span className="text-[10px]">{i === 0 ? '✓' : i + 1}</span>
                      {c}
                    </div>
                  ),
                )}
              </aside>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
