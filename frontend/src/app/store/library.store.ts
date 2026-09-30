import { create } from 'zustand';

/** Key a chapter uniquely by its book + order, e.g. "bhagavad-gita:3". */
const key = (bookSlug: string, order: number): string => `${bookSlug}:${order}`;

/** A set of chapter keys, stored as an object for cheap lookups. */
type Marks = Record<string, true>;

const READ_KEY = 'wisora.read';
const LIKED_KEY = 'wisora.liked';

function loadMarks(storageKey: string): Marks {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as Marks) : {};
  } catch {
    return {}; // private mode / corrupt value
  }
}

function saveMarks(storageKey: string, marks: Marks): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(marks));
  } catch {
    /* ignore storage errors (private mode, quota) */
  }
}

interface LibraryState {
  /** Chapters the user has paid to unlock (chapter 1 is always free). */
  unlocked: Marks;
  /** Chapters the user has opened in the reader — drives progress bars. */
  read: Marks;
  /** Chapters the user has hearted in the reader — shown on their profile. */
  liked: Marks;
  unlockChapter: (bookSlug: string, order: number) => void;
  markRead: (bookSlug: string, order: number) => void;
  toggleLike: (bookSlug: string, order: number) => void;
}

/**
 * Client-side reading state. `read` and `liked` persist to localStorage so the
 * profile survives a refresh; `unlocked` stays in memory until purchases are
 * read back from the backend.
 */
export const useLibraryStore = create<LibraryState>((set) => ({
  unlocked: {},
  read: loadMarks(READ_KEY),
  liked: loadMarks(LIKED_KEY),
  unlockChapter: (bookSlug, order) =>
    set((s) => ({ unlocked: { ...s.unlocked, [key(bookSlug, order)]: true } })),
  markRead: (bookSlug, order) =>
    set((s) => {
      const read: Marks = { ...s.read, [key(bookSlug, order)]: true };
      saveMarks(READ_KEY, read);
      return { read };
    }),
  toggleLike: (bookSlug, order) =>
    set((s) => {
      const k = key(bookSlug, order);
      const liked: Marks = { ...s.liked };
      if (liked[k]) delete liked[k];
      else liked[k] = true;
      saveMarks(LIKED_KEY, liked);
      return { liked };
    }),
}));

/** Whether a chapter is accessible (free first chapter or explicitly unlocked). */
export function chapterUnlocked(
  unlocked: Marks,
  bookSlug: string,
  order: number,
  isFree: boolean,
): boolean {
  return isFree || Boolean(unlocked[key(bookSlug, order)]);
}

/** Whether the reader has hearted this chapter. */
export function chapterLiked(liked: Marks, bookSlug: string, order: number): boolean {
  return Boolean(liked[key(bookSlug, order)]);
}

/** Split a stored key back into its book slug and chapter order. */
export function parseChapterKey(k: string): { bookSlug: string; order: number } {
  const i = k.lastIndexOf(':');
  return { bookSlug: k.slice(0, i), order: Number(k.slice(i + 1)) };
}

/** Count of read chapters for a given book — used for progress bars. */
export function readCountFor(read: Marks, bookSlug: string): number {
  const prefix = `${bookSlug}:`;
  return Object.keys(read).filter((k) => k.startsWith(prefix)).length;
}
