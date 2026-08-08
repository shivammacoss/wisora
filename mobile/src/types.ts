/** Shared content types — mirror the web app's models. */
export interface Chapter {
  order: number;
  title: string;
  readingTimeMins: number;
  /** Chapter 1 is free; the rest are paid on the web (all readable in this app for now). */
  isFree: boolean;
  /** One-line distilled summary shown in the reader's "Essence" callout. */
  essence?: string;
  /**
   * Chapter body as an array of blocks (a light-markdown subset):
   *   "## heading" · "### subheading" · "> quote" · ">> verse" · "~ transliteration"
   *   "- bullet" · "---" divider. Plain strings are paragraphs; **bold** / *italic* inline.
   */
  content?: string[];
}

export interface Book {
  slug: string;
  title: string;
  /** Poetic alternate name (e.g. "Song of God"). */
  subtitle: string;
  tradition: string;
  description: string;
  /** Label for the chapter count — "Chapters" | "Surahs" | "Sections". */
  unit: string;
  /** Translation lineage, e.g. "Sanskrit to English". */
  language: string;
  /** Emoji cover. */
  cover: string;
  chapters: Chapter[];
}
