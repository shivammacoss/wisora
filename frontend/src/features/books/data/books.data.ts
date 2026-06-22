import type { Book, Chapter } from '../types';

/**
 * Mock catalog so the UI works end-to-end before the backend is wired up.
 * Replace this with React Query hooks hitting /books + /chapters later.
 */
const makeChapters = (titles: string[]): Chapter[] =>
  titles.map((title, i) => ({
    order: i + 1,
    title,
    readingTimeMins: 4 + (i % 4),
    isFree: i === 0, // only the first chapter is free
  }));

export const BOOKS: Book[] = [
  {
    slug: 'bhagavad-gita',
    title: 'Bhagavad Gita',
    tradition: 'Hinduism',
    description: 'Krishna’s counsel to Arjuna on duty, devotion, and the eternal self.',
    cover: '🕉️',
    accent: 'from-amber-400 to-orange-500',
    chapters: makeChapters([
      'Arjuna’s Dilemma',
      'The Yoga of Knowledge',
      'The Yoga of Action',
      'The Yoga of Wisdom',
      'The Yoga of Renunciation',
    ]),
  },
  {
    slug: 'the-bible',
    title: 'The Bible',
    tradition: 'Christianity',
    description: 'From Genesis to Revelation — covenant, grace, and redemption.',
    cover: '✝️',
    accent: 'from-sky-400 to-indigo-500',
    chapters: makeChapters([
      'In the Beginning',
      'The Exodus',
      'The Psalms',
      'The Gospels',
      'The Letters',
    ]),
  },
  {
    slug: 'the-quran',
    title: 'The Quran',
    tradition: 'Islam',
    description: 'Revelations on mercy, justice, and submission to the One.',
    cover: '☪️',
    accent: 'from-emerald-400 to-teal-600',
    chapters: makeChapters([
      'Al-Fatihah — The Opening',
      'Al-Baqarah — The Cow',
      'An-Nur — The Light',
      'Ar-Rahman — The Merciful',
      'Al-Ikhlas — Sincerity',
    ]),
  },
  {
    slug: 'tao-te-ching',
    title: 'Tao Te Ching',
    tradition: 'Taoism',
    description: 'Lao Tzu on the Way, effortless action, and natural harmony.',
    cover: '☯️',
    accent: 'from-slate-400 to-gray-600',
    chapters: makeChapters([
      'The Tao That Can Be Named',
      'Non-Action (Wu Wei)',
      'The Use of Emptiness',
      'Returning to the Root',
      'The Soft Overcomes the Hard',
    ]),
  },
  {
    slug: 'dhammapada',
    title: 'Dhammapada',
    tradition: 'Buddhism',
    description: 'The Buddha’s verses on the mind, craving, and the path to peace.',
    cover: '☸️',
    accent: 'from-rose-400 to-pink-600',
    chapters: makeChapters([
      'The Twin Verses',
      'Heedfulness',
      'The Mind',
      'Flowers',
      'The Path',
    ]),
  },
];

export const getBooks = (): Book[] => BOOKS;

export const getBookBySlug = (slug: string | undefined): Book | undefined =>
  BOOKS.find((b) => b.slug === slug);
