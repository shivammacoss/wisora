import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, LogOut, Sparkles, Unlock } from 'lucide-react';
import { useAuthStore, useLibraryStore } from '@app/store';
import { getBooks } from '@features/books';
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

/** Reader profile: identity card, reading stats, and account actions. */
export default function ProfilePage(): JSX.Element {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isGuest = useAuthStore((s) => s.isGuest);
  const logout = useAuthStore((s) => s.logout);

  const read = useLibraryStore((s) => s.read);
  const unlocked = useLibraryStore((s) => s.unlocked);

  const chaptersRead = Object.keys(read).length;
  const chaptersUnlocked = Object.keys(unlocked).length;
  const booksStarted = new Set(Object.keys(read).map((k) => k.split(':')[0])).size;
  const totalBooks = getBooks().length;

  const name = user?.name ?? 'Guest';

  const signOut = (): void => {
    logout();
    navigate(ROUTES.home);
  };

  const stats = [
    { icon: BookOpen, label: 'Chapters read', value: chaptersRead },
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

          {/* stats */}
          <div className="grid grid-cols-1 divide-y divide-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="px-6 py-6 text-center">
                <Icon className="mx-auto h-5 w-5 text-gold" />
                <p className="mt-2 text-3xl font-bold tabular-nums text-ink">{value}</p>
                <p className="text-sm text-muted">{label}</p>
              </div>
            ))}
          </div>
        </motion.section>

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
