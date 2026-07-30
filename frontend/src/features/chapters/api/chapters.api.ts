import { http } from '@shared/lib/axios';
import type { ApiEnvelope } from '@shared/types';

/** A chapter's authored content, mirrors the backend `ChapterContent`. */
export interface ChapterContent {
  bookSlug: string;
  chapterOrder: number;
  blocks: string[];
  updatedAt: string | null;
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
    blocks: string[],
  ): Promise<ChapterContent> {
    const { data } = await http.put<ApiEnvelope<ChapterContent>>(
      `/chapters/${bookSlug}/${chapterOrder}`,
      { blocks },
    );
    return data.data as ChapterContent;
  },
};
