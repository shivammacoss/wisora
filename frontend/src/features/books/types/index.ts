export interface Chapter {
  order: number;
  title: string;
  readingTimeMins: number;
  /** Chapter 1 is free; the rest cost 1 unit of local currency for lifetime access. */
  isFree: boolean;
  /** One-line distilled summary shown in the reader's "Essence" callout. */
  essence?: string;
  /**
   * Chapter body, as an array of blocks. Optional until authored.
   * Each string is one block; a light markdown subset controls its rendering:
   *   "## HEADING"  → section heading
   *   "> verse"     → scripture / quote block (gold serif)
   *   "- item"      → bullet line
   *   "---"         → divider
   * Plain strings render as paragraphs. Inline **bold** and *italic* are supported.
   */
  content?: string[];
}

export interface Book {
  slug: string;
  title: string;
  tradition: string;
  description: string;
  /** Poetic / alternate name shown as the card headline (e.g. "Song of God"). */
  subtitle: string;
  /** Label for the chapter count on cards — "Chapters" | "Surahs" | "Sections". */
  unit: string;
  /** Translation lineage shown on cards, e.g. "Sanskrit to English". */
  language: string;
  /** Emoji used as a lightweight cover placeholder until real artwork is added. */
  cover: string;
  /** Tailwind gradient classes for the card header. */
  accent: string;
  /**
   * Real cover artwork. Set this to show the actual book cover.
   * Put the file in src/assets/images/ and import it, e.g.:
   *   import gitaCover from '@assets/images/bhagavad-gita.jpg';
   *   image: gitaCover
   * Leave undefined to show the empty cover placeholder.
   */
  image?: string;
  chapters: Chapter[];
}
