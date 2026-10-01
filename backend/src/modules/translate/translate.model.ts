import { Schema, model, type Document, type Model } from 'mongoose';

/**
 * Cache of machine translations. Each unique (source text, target language) is
 * translated once and reused forever — keeps the provider cost/volume minimal
 * and makes repeat reads instant.
 */
export interface TranslationDocument extends Document {
  /** sha1 of the source text. */
  key: string;
  /** Target language code (es / fr / ur / ru). */
  lang: string;
  /** Original English text (kept for debugging / re-translation). */
  source: string;
  /** The translated text. */
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const translationSchema = new Schema<TranslationDocument>(
  {
    key: { type: String, required: true },
    lang: { type: String, required: true, index: true },
    source: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true },
);

// One cached translation per (text, language).
translationSchema.index({ key: 1, lang: 1 }, { unique: true });

export const TranslationModel: Model<TranslationDocument> = model<TranslationDocument>(
  'Translation',
  translationSchema,
);
