import { authRequest } from './http';

/** A chapter's authored content (admin overrides + blocks). */
export interface ChapterContent {
  bookSlug: string;
  chapterOrder: number;
  title: string | null;
  essence: string | null;
  blocks: string[];
  updatedAt: string | null;
}

/** A chapter in the backend-managed list (add / delete / reorder). */
export interface ManagedChapter {
  id: string;
  bookSlug: string;
  order: number;
  title: string;
  essence: string | null;
  readingTimeMins: number;
  isFree: boolean;
  hasContent: boolean;
}

/** One bundled chapter sent to seed the managed list on first management. */
export interface SeedChapter {
  order: number;
  title: string;
  essence?: string;
  readingTimeMins?: number;
  isFree?: boolean;
  blocks?: string[];
}

export const chaptersApi = {
  /** Public: fetch a chapter's authored content (null when none yet). */
  getContent: (bookSlug: string, order: number): Promise<ChapterContent | null> =>
    authRequest<ChapterContent | null>(`/chapters/${bookSlug}/${order}`).then((d) => d ?? null),

  /** Admin: create or replace a chapter's content (title / essence / blocks). */
  saveContent: (
    bookSlug: string,
    order: number,
    input: { blocks: string[]; title?: string; essence?: string },
  ): Promise<ChapterContent> =>
    authRequest<ChapterContent>(`/chapters/${bookSlug}/${order}`, { method: 'PUT', body: input }),

  /** Public: the backend-managed chapter list for a book (empty when unmanaged). */
  list: (bookSlug: string): Promise<ManagedChapter[]> =>
    authRequest<ManagedChapter[]>(`/chapters/${bookSlug}`).then((d) => d ?? []),

  /** Admin: seed the managed list from the bundled chapters (once per book). */
  init: (bookSlug: string, chapters: SeedChapter[]): Promise<ManagedChapter[]> =>
    authRequest<ManagedChapter[]>(`/chapters/${bookSlug}/init`, {
      method: 'POST',
      body: { chapters },
    }).then((d) => d ?? []),

  /** Admin: add a new chapter at the end. */
  add: (
    bookSlug: string,
    input: { title: string; readingTimeMins?: number; isFree?: boolean },
  ): Promise<ManagedChapter> =>
    authRequest<ManagedChapter>(`/chapters/${bookSlug}`, { method: 'POST', body: input }),

  /** Admin: delete a chapter (returns the re-numbered list). */
  remove: (bookSlug: string, order: number): Promise<ManagedChapter[]> =>
    authRequest<ManagedChapter[]>(`/chapters/${bookSlug}/${order}`, { method: 'DELETE' }).then(
      (d) => d ?? [],
    ),

  /** Admin: reorder the list to the given sequence of chapter ids. */
  reorder: (bookSlug: string, ids: string[]): Promise<ManagedChapter[]> =>
    authRequest<ManagedChapter[]>(`/chapters/${bookSlug}/reorder`, {
      method: 'PUT',
      body: { order: ids },
    }).then((d) => d ?? []),
};
