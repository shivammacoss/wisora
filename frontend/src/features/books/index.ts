/** Public API of the books feature (data + types; UI lives in library/book). */
export { getBooks, getBookBySlug } from './data/books.data';
export type { Book, Chapter } from './types';
