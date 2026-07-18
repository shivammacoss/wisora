import type { Book } from '../types';
import { gitaChapters } from './gita.chapters';
import { quranSurahs } from './quran.surahs';
import { bibleChapters } from './bible.chapters';
import { taoChapters } from './tao.chapters';
import { guruGranthSahibChapters } from './guru-granth-sahib.chapters';
import { dhammapadaChapters } from './dhammapada.chapters';

// Cover artwork (shown across the library grid + popular reads).
import gitaCover from '@assets/images/Bhagavad_book.png';
import bibleCover from '@assets/images/Bible_book.png';
import quranCover from '@assets/images/Quran_book.png';
import taoCover from '@assets/images/TaoTeChing_book.png';
import dhammapadaCover from '@assets/images/Dhammapada_book.png';
import guruGranthCover from '@assets/images/Guru_Granth_book.png';

/**
 * Mock catalog so the UI works end-to-end before the backend is wired up.
 * Each book's chapters (with real summaries) live in their own data file.
 * Replace this with React Query hooks hitting /books + /chapters later.
 */
export const BOOKS: Book[] = [
  {
    slug: 'bhagavad-gita',
    title: 'The Bhagavad Gita',
    tradition: 'Hinduism',
    description: 'Krishna’s counsel to Arjuna on duty, devotion, and the eternal self.',
    subtitle: 'Song of God',
    unit: 'Chapters',
    language: 'Sanskrit to English',
    cover: '🕉️',
    accent: 'from-amber-400 to-orange-500',
    image: gitaCover,
    chapters: gitaChapters,
  },
  {
    slug: 'the-bible',
    title: 'The Bible',
    tradition: 'Christianity',
    description: 'The Gospel of John — light, life, and the Word made flesh.',
    subtitle: 'Gospel of John',
    unit: 'Chapters',
    language: 'Greek to English',
    cover: '✝️',
    accent: 'from-sky-400 to-indigo-500',
    image: bibleCover,
    chapters: bibleChapters,
  },
  {
    slug: 'the-quran',
    title: 'The Quran',
    tradition: 'Islam',
    description: 'Revelations on mercy, justice, and submission to the One.',
    subtitle: 'Noble Book',
    unit: 'Surahs',
    language: 'Arabic to English',
    cover: '☪️',
    accent: 'from-emerald-400 to-teal-600',
    image: quranCover,
    chapters: quranSurahs,
  },
  {
    slug: 'tao-te-ching',
    title: 'The Tao Te Ching',
    tradition: 'Taoism',
    description: 'Lao Tzu on the Way, effortless action, and natural harmony.',
    subtitle: 'Way and Its Power',
    unit: 'Chapters',
    language: 'Classical Chinese to English',
    cover: '☯️',
    accent: 'from-slate-400 to-gray-600',
    image: taoCover,
    chapters: taoChapters,
  },
  {
    slug: 'dhammapada',
    title: 'The Dhammapada',
    tradition: 'Buddhism',
    description: 'The Buddha’s verses on the mind, craving, and the path to peace.',
    subtitle: 'Path of Truth',
    unit: 'Chapters',
    language: 'Pali to English',
    cover: '☸️',
    accent: 'from-rose-400 to-pink-600',
    image: dhammapadaCover,
    chapters: dhammapadaChapters,
  },
  {
    slug: 'guru-granth-sahib',
    title: 'The Guru Granth Sahib',
    tradition: 'Sikhism',
    description: 'The eternal Guru — oneness, honest living, and selfless service.',
    subtitle: 'Eternal Guru',
    unit: 'Sections',
    language: 'Gurmukhi to English',
    cover: '☬',
    accent: 'from-blue-600 to-indigo-800',
    image: guruGranthCover,
    chapters: guruGranthSahibChapters,
  },
];

export const getBooks = (): Book[] => BOOKS;

export const getBookBySlug = (slug: string | undefined): Book | undefined =>
  BOOKS.find((b) => b.slug === slug);
