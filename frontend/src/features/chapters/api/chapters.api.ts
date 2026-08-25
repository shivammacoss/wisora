import { http } from '@shared/lib/axios';
import type { ApiEnvelope } from '@shared/types';

/** A chapter's authored content, mirrors the backend `ChapterContent`. */
export interface ChapterContent {
  bookSlug: string;
  chapterOrder: number;
  /** Admin title override (null → use bundled title). */
  title: string | null;
  /** Admin essence override (null → use bundled essence). */
  essence: string | null;
  blocks: string[];
  updatedAt: string | null;
}

/** Payload an admin sends when saving a chapter. */
export interface SaveContentInput {
  blocks: string[];
  title?: string;
  essence?: string;
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
  /** Public: fetch authored content for a chapter (null when none yet). */
  async getContent(bookSlug: string, chapterOrder: number): Promise<ChapterContent | null> {
    const { data } = await http.get<ApiEnvelope<ChapterContent | null>>(
      `/chapters/${bookSlug}/${chapterOrder}`,
    );
    return data.data ?? null;
  },

  /** Admin only: create or replace a chapter's content. */
  async saveContent(
    bookSlug: string,
    chapterOrder: number,
    input: SaveContentInput,
  ): Promise<ChapterContent> {
    const { data } = await http.put<ApiEnvelope<ChapterContent>>(
      `/chapters/${bookSlug}/${chapterOrder}`,
      input,
    );
    return data.data as ChapterContent;
  },

  /* ── managed chapter list (admin) ── */

  /** Public: the backend-managed chapter list for a book (empty when unmanaged). */
  async list(bookSlug: string): Promise<ManagedChapter[]> {
    const { data } = await http.get<ApiEnvelope<ManagedChapter[]>>(`/chapters/${bookSlug}`);
    return data.data ?? [];
  },

  /** Admin: seed the managed list from the bundled chapters (once per book). */
  async init(bookSlug: string, chapters: SeedChapter[]): Promise<ManagedChapter[]> {
    const { data } = await http.post<ApiEnvelope<ManagedChapter[]>>(`/chapters/${bookSlug}/init`, {
      chapters,
    });
    return data.data ?? [];
  },

  /** Admin: add a new chapter at the end. */
  async add(
    bookSlug: string,
    input: { title: string; readingTimeMins?: number; isFree?: boolean },
  ): Promise<ManagedChapter> {
    const { data } = await http.post<ApiEnvelope<ManagedChapter>>(`/chapters/${bookSlug}`, input);
    return data.data as ManagedChapter;
  },

  /** Admin: delete a chapter (returns the re-numbered list). */
  async remove(bookSlug: string, order: number): Promise<ManagedChapter[]> {
    const { data } = await http.delete<ApiEnvelope<ManagedChapter[]>>(
      `/chapters/${bookSlug}/${order}`,
    );
    return data.data ?? [];
  },

  /** Admin: reorder the list to the given sequence of chapter ids. */
  async reorder(bookSlug: string, ids: string[]): Promise<ManagedChapter[]> {
    const { data } = await http.put<ApiEnvelope<ManagedChapter[]>>(`/chapters/${bookSlug}/reorder`, {
      order: ids,
    });
    return data.data ?? [];
  },
};
