export interface Chapter {
  order: number;
  title: string;
  readingTimeMins: number;
  /** Chapter 1 is free; the rest cost 1 unit of local currency for lifetime access. */
  isFree: boolean;
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
  chapters: Chapter[];
}
