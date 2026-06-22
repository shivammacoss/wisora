import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { SectionHeading } from './ui/SectionHeading';
import { fadeUp, revealOnScroll } from '../lib/motion';
import book1 from '@assets/images/book1.png';
import book2 from '@assets/images/book2.png';
import book3 from '@assets/images/book3.png';

interface ShowcaseBook {
  tradition: string;
  title: string;
  /** Cover artwork image. */
  image: string;
}

const BOOKS: ShowcaseBook[] = [
  {
    tradition: 'Hindu wisdom',
    title: 'Bhagavad Gita',
    image: book1,
  },
  {
    tradition: 'Christian wisdom',
    title: 'The Bible',
    image: book2,
  },
  {
    tradition: 'Islamic wisdom',
    title: 'The Quran',
    image: book3,
  },
];

interface BookShowcaseProps {
  onOpenBook: () => void;
}

/** "Jump into a book" — Adobe "jump into a project" style preview cards. */
export function BookShowcase({ onOpenBook }: BookShowcaseProps): JSX.Element {
  return (
    <section id="library" className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          title="Jump into a book"
          subtitle="Try Wisora with the Bhagavad Gita, the Bible, or the Quran."
        />

        <motion.div
          {...revealOnScroll}
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {BOOKS.map((book) => (
            <motion.article
              key={book.title}
              variants={fadeUp}
              className="group flex flex-col rounded-2xl border border-hairline bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted">
                  {book.tradition}
                </span>
                <button
                  type="button"
                  onClick={onOpenBook}
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-white transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
                >
                  <Play className="h-3 w-3 fill-white" /> Open book
                </button>
              </div>

              {/* cover artwork */}
              <div className="mt-5 aspect-[4/5] overflow-hidden rounded-xl shadow-soft">
                <img
                  src={book.image}
                  alt={`${book.title} cover`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>

              <h3 className="mt-5 font-serif text-xl font-bold text-ink">{book.title}</h3>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
