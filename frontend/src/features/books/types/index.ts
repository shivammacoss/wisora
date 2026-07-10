export interface Chapter {
  order: number;
  title: string;
  readingTimeMins: number;
  /** Chapter 1 is free; the rest cost 1 unit of local currency for lifetime access. */
  isFree: boolean;
  /** Chapter summary body, as an array of paragraphs. Optional until authored. */
  content?: string[];
}

export interface Book {
  slug: string;
  title: string;
  tradition: string;
  description: string;
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
