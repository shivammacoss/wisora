import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Heart, LogOut, Sparkles, Unlock } from 'lucide-react';
import { parseChapterKey, useAuthStore, useLibraryStore } from '@app/store';
import { getBooks, getBookBySlug } from '@features/books';
import { AppHeader } from '@shared/components/ui/AppHeader';
import { Button } from '@features/landing/components/ui/Button';
import { ROUTES } from '@shared/constants';

function initialsOf(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'G'
  );
}

interface LikedChapter {
  bookSlug: string;
  order: number;
  bookTitle: string;
  chapterTitle: string;
}

/** Reader profile: identity card, reading stats, liked chapters, account actions. */
export default function ProfilePage(): JSX.Element {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isGuest = useAuthStore((s) => s.isGuest);
  const logout = useAuthStore((s) => s.logout);

  const read = useLibraryStore((s) => s.read);
  const unlocked = useLibraryStore((s) => s.unlocked);
  const liked = useLibraryStore((s) => s.liked);

  const chaptersRead = Object.keys(read).length;
  const chaptersUnlocked = Object.keys(unlocked).length;
  const booksStarted = new Set(Object.keys(read).map((k) => k.split(':')[0])).size;
  const totalBooks = getBooks().length;

  // Resolve each liked key back to its book + chapter so we can list them.
  const likedChapters: LikedChapter[] = Object.keys(liked)
    .map(parseChapterKey)
    .map(({ bookSlug, order }) => {
      const book = getBookBySlug(bookSlug);
      const chapter = book?.chapters.find((c) => c.order === order);
      return book && chapter
        ? { bookSlug, order, bookTitle: book.title, chapterTitle: chapter.title }
        : null;
    })
    .filter((c): c is LikedChapter => c !== null);

  const name = user?.name ?? 'Guest';

  const signOut = (): void => {
    logout();
    navigate(ROUTES.home);
  };

  const stats = [
    { icon: BookOpen, label: 'Chapters read', value: chaptersRead },
    { icon: Heart, label: 'Chapters liked', value: likedChapters.length },
    { icon: Unlock, label: 'Chapters unlocked', value: chaptersUnlocked },
    { icon: Sparkles, label: 'Books started', value: `${booksStarted}/${totalBooks}` },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <AppHeader />

      <main className="mx-auto max-w-3xl px-6 py-10 md:py-14">
        <button
          type="button"
          onClick={() => navigate(ROUTES.library)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> Library
        </button>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 overflow-hidden rounded-3xl border border-hairline bg-surface shadow-soft"
        >
          {/* identity header */}
          <div className="flex items-center gap-5 bg-cream-surface px-6 py-8 sm:px-8">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-deep text-2xl font-bold text-white shadow-lift">
              {initialsOf(name)}
            </span>
            <div className="min-w-0">
              <h1 className="font-serif text-3xl font-extrabold text-ink">{name}</h1>
              <p className="mt-0.5 truncate text-body">
                {isGuest ? 'Browsing as a guest' : user?.email}
              </p>
              {isGuest && (
                <span className="mt-2 inline-block rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold-deep">
                  Guest session — sign up to save your progress
                </span>
              )}
            </div>
          </div>

          {/* stats — hairline grid via a 1px gap over the border colour */}
          <div className="grid grid-cols-2 gap-px border-t border-hairline bg-hairline lg:grid-cols-4">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-surface px-4 py-6 text-center">
                <Icon className="mx-auto h-5 w-5 text-gold" />
                <p className="mt-2 text-3xl font-bold tabular-nums text-ink">{value}</p>
                <p className="text-sm text-muted">{label}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* liked chapters */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-hairline bg-surface shadow-soft">
          <h2 className="flex items-center gap-2 border-b border-hairline px-6 py-4 font-serif text-lg font-bold text-ink">
            <Heart className="h-4 w-4 fill-gold text-gold" /> Liked chapters
          </h2>

          {likedChapters.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-muted">
              No liked chapters yet. Tap the heart while reading to save one here.
            </p>
          ) : (
            <ul className="divide-y divide-hairline">
              {likedChapters.map((c) => (
                <li key={`${c.bookSlug}:${c.order}`}>
                  <button
                    type="button"
                    onClick={() => navigate(ROUTES.reader(c.bookSlug, String(c.order)))}
                    className="flex w-full items-center gap-3 px-6 py-4 text-left transition-colors hover:bg-cream-surface"
                  >
                    <Heart className="h-4 w-4 shrink-0 fill-gold text-gold" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-ink">{c.chapterTitle}</span>
                      <span className="block truncate text-xs text-muted">{c.bookTitle}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button
            variant="gold"
            leftIcon={<BookOpen className="h-4 w-4" />}
            onClick={() => navigate(ROUTES.library)}
          >
            Back to reading
          </Button>
          <Button variant="outline" leftIcon={<LogOut className="h-4 w-4" />} onClick={signOut}>
            Sign out
          </Button>
        </div>
      </main>
    </div>
  );
}
