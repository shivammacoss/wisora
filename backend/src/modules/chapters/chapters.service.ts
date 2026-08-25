import { BadRequestError, NotFoundError } from '@common/errors';
import { ChapterContentModel, type ChapterContentDocument } from './chapters.model';

export interface ChapterContent {
  bookSlug: string;
  chapterOrder: number;
  title: string | null;
  essence: string | null;
  blocks: string[];
  updatedAt: Date | null;
}

/** A chapter in the backend-managed list (list/add/delete/reorder). */
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

/** Fields an admin can author for a chapter. */
export interface ChapterContentInput {
  blocks: string[];
  title?: string;
  essence?: string;
}

/** One bundled chapter used to seed the backend list on first management. */
export interface SeedChapter {
  order: number;
  title: string;
  essence?: string;
  readingTimeMins?: number;
  isFree?: boolean;
  blocks?: string[];
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

  /* ── managed chapter list (add / delete / reorder) ── */

  /** All chapters of a book from the backend-managed list (empty if unmanaged). */
  async listManaged(bookSlug: string): Promise<ManagedChapter[]> {
    const docs = await ChapterContentModel.find({ bookSlug: bookSlug.toLowerCase(), managed: true })
      .sort({ chapterOrder: 1 })
      .exec();
    return docs.map(toManaged);
  }

  /**
   * Seed the backend list from the bundled chapters (admin, once per book).
   * Preserves any existing authored content / overrides. No-op if already managed.
   */
  async initFromBundled(bookSlug: string, seeds: SeedChapter[]): Promise<ManagedChapter[]> {
    const slug = bookSlug.toLowerCase();
    const already = await ChapterContentModel.countDocuments({ bookSlug: slug, managed: true }).exec();
    if (already === 0 && seeds.length > 0) {
      const existing = await ChapterContentModel.find({ bookSlug: slug }).exec();
      const byOrder = new Map(existing.map((d) => [d.chapterOrder, d]));
      const ops = seeds.map((s) => {
        const cur = byOrder.get(s.order);
        const title = cur?.title ?? s.title;
        const essence = cur?.essence ?? s.essence;
        const blocks = cur && cur.blocks.length > 0 ? cur.blocks : (s.blocks ?? []);
        return {
          updateOne: {
            filter: { bookSlug: slug, chapterOrder: s.order },
            update: {
              $set: {
                managed: true,
                title,
                essence,
                blocks,
                readingTimeMins: s.readingTimeMins ?? 5,
                isFree: !!s.isFree,
              },
            },
            upsert: true,
          },
        };
      });
      await ChapterContentModel.bulkWrite(ops);
    }
    return this.listManaged(slug);
  }

  /** Add a new (empty) chapter at the end of the managed list. */
  async addChapter(
    bookSlug: string,
    input: { title: string; readingTimeMins?: number; isFree?: boolean },
  ): Promise<ManagedChapter> {
    const slug = bookSlug.toLowerCase();
    const last = await ChapterContentModel.findOne({ bookSlug: slug, managed: true })
      .sort({ chapterOrder: -1 })
      .exec();
    const order = (last?.chapterOrder ?? 0) + 1;
    const doc = await ChapterContentModel.create({
      bookSlug: slug,
      chapterOrder: order,
      managed: true,
      title: input.title,
      blocks: [],
      readingTimeMins: input.readingTimeMins ?? 5,
      isFree: !!input.isFree,
    });
    return toManaged(doc);
  }

  /** Delete a managed chapter and close the gap (re-number 1..n). */
  async deleteChapter(bookSlug: string, order: number): Promise<ManagedChapter[]> {
    const slug = bookSlug.toLowerCase();
    const del = await ChapterContentModel.findOneAndDelete({
      bookSlug: slug,
      chapterOrder: order,
      managed: true,
    }).exec();
    if (!del) throw new NotFoundError('Chapter not found');
    const remaining = await ChapterContentModel.find({ bookSlug: slug, managed: true })
      .sort({ chapterOrder: 1 })
      .exec();
    await resequence(remaining);
    return this.listManaged(slug);
  }

  /** Reorder the managed list to the given sequence of chapter ids. */
  async reorder(bookSlug: string, ids: string[]): Promise<ManagedChapter[]> {
    const slug = bookSlug.toLowerCase();
    const docs = await ChapterContentModel.find({ bookSlug: slug, managed: true }).exec();
    if (docs.length !== ids.length) throw new BadRequestError('Reorder list does not match');
    const byId = new Map(docs.map((d) => [d.id, d]));
    const ordered = ids.map((id) => byId.get(id));
    if (ordered.some((d) => !d)) throw new BadRequestError('Unknown chapter in reorder');
    await resequence(ordered as ChapterContentDocument[]);
    return this.listManaged(slug);
  }
}

/** Renumber docs to chapterOrder 1..n in two phases (dodges the unique index). */
async function resequence(docs: ChapterContentDocument[]): Promise<void> {
  if (docs.length === 0) return;
  await ChapterContentModel.bulkWrite(
    docs.map((d, i) => ({
      updateOne: { filter: { _id: d._id }, update: { $set: { chapterOrder: 10000 + i } } },
    })),
  );
  await ChapterContentModel.bulkWrite(
    docs.map((d, i) => ({
      updateOne: { filter: { _id: d._id }, update: { $set: { chapterOrder: i + 1 } } },
    })),
  );
}

function toManaged(doc: ChapterContentDocument): ManagedChapter {
  return {
    id: doc.id,
    bookSlug: doc.bookSlug,
    order: doc.chapterOrder,
    title: doc.title ?? `Chapter ${doc.chapterOrder}`,
    essence: doc.essence ?? null,
    readingTimeMins: doc.readingTimeMins ?? 5,
    isFree: doc.isFree ?? false,
    hasContent: (doc.blocks?.length ?? 0) > 0,
  };
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
