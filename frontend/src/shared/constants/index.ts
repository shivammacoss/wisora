/** Centralized route paths — import these instead of hardcoding strings. */
export const ROUTES = {
  home: '/', // login / landing
  login: '/', // alias — the home page is the login gate
  resetPassword: '/reset-password',
  library: '/library',
  bookDetail: (bookId = ':bookId') => `/book/${bookId}`,
  reader: (bookId = ':bookId', chapterId = ':chapterId') => `/book/${bookId}/chapter/${chapterId}`,
  profile: '/profile',
} as const;

/** React Query cache keys — keep them here to avoid typos and ease invalidation. */
export const QUERY_KEYS = {
  currentUser: ['currentUser'] as const,
  books: ['books'] as const,
  book: (slug: string) => ['books', slug] as const,
  chapters: (bookId: string) => ['chapters', bookId] as const,
  library: ['library'] as const,
};

export const TOKEN_STORAGE_KEY = 'wisora.tokens';
export const USER_STORAGE_KEY = 'wisora.user';
