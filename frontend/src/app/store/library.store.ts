import { create } from 'zustand';

/** Key a chapter uniquely by its book + order, e.g. "bhagavad-gita:3". */
const key = (bookSlug: string, order: number): string => `${bookSlug}:${order}`;

interface LibraryState {
  /** Chapters the user has paid to unlock (chapter 1 is always free). */
  unlocked: Record<string, true>;
  /** Chapters the user has opened in the reader — drives progress bars. */
  read: Record<string, true>;
  unlockChapter: (bookSlug: string, order: number) => void;
  markRead: (bookSlug: string, order: number) => void;
}

/**
 * Client-side reading state: which chapters are unlocked and which have been
 * read. In-memory for now — wire to the backend (owned chapters + progress)
 * once payments land.
 */
export const useLibraryStore = create<LibraryState>((set) => ({
  unlocked: {},
  read: {},
  unlockChapter: (bookSlug, order) =>
    set((s) => ({ unlocked: { ...s.unlocked, [key(bookSlug, order)]: true } })),
  markRead: (bookSlug, order) =>
    set((s) => ({ read: { ...s.read, [key(bookSlug, order)]: true } })),
}));

/** Whether a chapter is accessible (free first chapter or explicitly unlocked). */
export function chapterUnlocked(
  unlocked: Record<string, true>,
  bookSlug: string,
  order: number,
  isFree: boolean,
): boolean {
  return isFree || Boolean(unlocked[key(bookSlug, order)]);
}

/** Count of read chapters for a given book — used for progress bars. */
export function readCountFor(read: Record<string, true>, bookSlug: string): number {
  const prefix = `${bookSlug}:`;
  return Object.keys(read).filter((k) => k.startsWith(prefix)).length;
}
