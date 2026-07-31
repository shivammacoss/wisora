import { ChapterContentModel, type ChapterContentDocument } from './chapters.model';

export interface ChapterContent {
  bookSlug: string;
  chapterOrder: number;
  title: string | null;
  essence: string | null;
  blocks: string[];
  updatedAt: Date | null;
}

/** Fields an admin can author for a chapter. */
export interface ChapterContentInput {
  blocks: string[];
  title?: string;
  essence?: string;
}

/** Chapter content: read for the reader, upsert for admins. */
export class ChaptersService {
  /** Public: a chapter's authored content, or null if none exists yet. */
  async getContent(bookSlug: string, chapterOrder: number): Promise<ChapterContent | null> {
    const doc = await ChapterContentModel.findOne({
      bookSlug: bookSlug.toLowerCase(),
      chapterOrder,
    }).exec();
    return doc ? toPublic(doc) : null;
  }

  /** Admin: create or replace a chapter's content. */
  async saveContent(
    bookSlug: string,
    chapterOrder: number,
    input: ChapterContentInput,
    userId: string,
  ): Promise<ChapterContent> {
    // Empty title/essence clears the override (falls back to bundled content).
    const title = input.title?.trim() ? input.title.trim() : undefined;
    const essence = input.essence?.trim() ? input.essence.trim() : undefined;

    const set: Record<string, unknown> = { blocks: input.blocks, updatedBy: userId };
    const unset: Record<string, ''> = {};
    if (title) set.title = title;
    else unset.title = '';
    if (essence) set.essence = essence;
    else unset.essence = '';

    const doc = await ChapterContentModel.findOneAndUpdate(
      { bookSlug: bookSlug.toLowerCase(), chapterOrder },
      { $set: set, $unset: unset },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).exec();
    return toPublic(doc);
  }
}

function toPublic(doc: ChapterContentDocument): ChapterContent {
  return {
    bookSlug: doc.bookSlug,
    chapterOrder: doc.chapterOrder,
    title: doc.title ?? null,
    essence: doc.essence ?? null,
    blocks: doc.blocks,
    updatedAt: doc.updatedAt,
  };
}
