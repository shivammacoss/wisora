import { Schema, model, type Document, type Model, Types } from 'mongoose';

/**
 * Admin-authored reading content for a single chapter of a book. Stored as an
 * array of blocks (a light-markdown subset the reader renders): "## heading",
 * "> verse", "- bullet", "---" divider, or a plain paragraph.
 */
export interface ChapterContentDocument extends Document {
  bookSlug: string;
  chapterOrder: number;
  blocks: string[];
  updatedBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const chapterContentSchema = new Schema<ChapterContentDocument>(
  {
    bookSlug: { type: String, required: true, trim: true, lowercase: true },
    chapterOrder: { type: Number, required: true, min: 1 },
    blocks: { type: [String], default: [] },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Exactly one content record per (book, chapter).
chapterContentSchema.index({ bookSlug: 1, chapterOrder: 1 }, { unique: true });

export const ChapterContentModel: Model<ChapterContentDocument> = model<ChapterContentDocument>(
  'ChapterContent',
  chapterContentSchema,
);
