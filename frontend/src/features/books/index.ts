/** Public API of the books feature (data + types; UI lives in library/book). */
export { getBooks, getBookBySlug } from './data/books.data';
export type { Book, Chapter } from './types';

/** A chapter is the book's "Introduction" (shown separately, not numbered). */
export function isIntroChapter(chapter: { title: string }): boolean {
  return /^introduction\b/i.test(chapter.title.trim());
}

/**
 * Split a chapter list into the introduction (if any) and the numbered
 * chapters, sorted by order. The intro is surfaced separately in the UI.
 */
export function splitIntro<T extends { title: string; order: number }>(
  chapters: T[],
): { intro: T | null; rest: T[] } {
  const intro = chapters.find(isIntroChapter) ?? null;
  const rest = chapters
    .filter((c) => !isIntroChapter(c))
    .sort((a, b) => a.order - b.order);
  return { intro, rest };
}
