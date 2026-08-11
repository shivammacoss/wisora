import type { Book } from '../types';
import { gitaChapters } from './gita.chapters';
import { quranSurahs } from './quran.surahs';
import { bibleChapters } from './bible.chapters';
import { taoChapters } from './tao.chapters';
import { guruGranthSahibChapters } from './guru-granth-sahib.chapters';
import { dhammapadaChapters } from './dhammapada.chapters';

/** The Wisora catalog — mirrors the web app (emoji covers for the mobile build). */
export const BOOKS: Book[] = [
  {
    slug: 'bhagavad-gita',
    title: 'The Bhagavad Gita',
    subtitle: 'Song of God',
    tradition: 'Hinduism',
    description: 'Krishna’s counsel to Arjuna on duty, devotion, and the eternal self.',
    unit: 'Chapters',
    language: 'Sanskrit to English',
    cover: '🕉️',
    chapters: gitaChapters,
  },
  {
    slug: 'the-bible',
    title: 'The Bible',
    subtitle: 'Gospel of John',
    tradition: 'Christianity',
    description: 'The Gospel of John — light, life, and the Word made flesh.',
    unit: 'Chapters',
    language: 'Greek to English',
    cover: '✝️',
    chapters: bibleChapters,
  },
  {
    slug: 'dhammapada',
    title: 'The Dhammapada',
    subtitle: 'Path of Truth',
    tradition: 'Buddhism',
    description: 'The Buddha’s verses on the mind, craving, and the path to peace.',
    unit: 'Chapters',
    language: 'Pali to English',
    cover: '☸️',
    chapters: dhammapadaChapters,
  },
  {
    slug: 'guru-granth-sahib',
    title: 'The Guru Granth Sahib',
    subtitle: 'Eternal Guru',
    tradition: 'Sikhism',
    description: 'The eternal Guru — oneness, honest living, and selfless service.',
    unit: 'Sections',
    language: 'Gurmukhi to English',
    cover: '☬',
    chapters: guruGranthSahibChapters,
  },
  {
    slug: 'the-quran',
    title: 'The Quran',
    subtitle: 'Noble Book',
    tradition: 'Islam',
    description: 'Revelations on mercy, justice, and submission to the One.',
    unit: 'Surahs',
    language: 'Arabic to English',
    cover: '☪️',
    chapters: quranSurahs,
  },
  {
    slug: 'tao-te-ching',
    title: 'The Tao Te Ching',
    subtitle: 'Way and Its Power',
    tradition: 'Taoism',
    description: 'Lao Tzu on the Way, effortless action, and natural harmony.',
    unit: 'Chapters',
    language: 'Classical Chinese to English',
    cover: '☯️',
    chapters: taoChapters,
  },
];

export const getBooks = (): Book[] => BOOKS;

export const getBookBySlug = (slug: string | undefined): Book | undefined =>
  BOOKS.find((b) => b.slug === slug);
