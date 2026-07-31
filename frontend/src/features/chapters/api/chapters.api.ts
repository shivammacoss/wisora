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
};
