import { ChapterContentModel, type ChapterContentDocument } from './chapters.model';

export interface ChapterContent {
  bookSlug: string;
  chapterOrder: number;
  blocks: string[];
  updatedAt: Date | null;
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
    blocks: string[],
    userId: string,
  ): Promise<ChapterContent> {
    const doc = await ChapterContentModel.findOneAndUpdate(
      { bookSlug: bookSlug.toLowerCase(), chapterOrder },
      { blocks, updatedBy: userId },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).exec();
    return toPublic(doc);
  }
}

function toPublic(doc: ChapterContentDocument): ChapterContent {
  return {
    bookSlug: doc.bookSlug,
    chapterOrder: doc.chapterOrder,
    blocks: doc.blocks,
    updatedAt: doc.updatedAt,
  };
}
