import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import { ArrowDown, ArrowUp, Loader2, Plus, Trash2, X } from 'lucide-react';
import type { Book } from '@features/books';
import { chaptersApi, type ManagedChapter, type SeedChapter } from '../api/chapters.api';

interface ChapterManagerProps {
  book: Book;
  onClose: () => void;
  /** Called after any change so the book detail page can refresh its list. */
  onChanged?: (chapters: ManagedChapter[]) => void;
}

function errMsg(e: unknown): string {
  if (axios.isAxiosError(e)) {
    if (!e.response) return 'Cannot reach the server. Is the backend running?';
    if (e.response.status === 403) return 'Admin access required.';
    return e.response.data?.error?.message ?? 'Request failed.';
  }
  return 'Something went wrong.';
}

/** Map the book's bundled chapters into the seed payload for first-time init. */
function seedFromBundled(book: Book): SeedChapter[] {
  return book.chapters.map((c) => ({
    order: c.order,
    title: c.title,
    essence: c.essence,
    readingTimeMins: c.readingTimeMins,
    isFree: c.isFree,
    blocks: c.content ?? [],
  }));
}

/**
 * Admin-only manager for a book's chapter list: add, delete and reorder.
 * On first open it seeds the backend list from the bundled chapters, so the
 * admin always sees the current chapters and edits from there.
 */
export function ChapterManager({ book, onClose, onChanged }: ChapterManagerProps): JSX.Element {
  const [chapters, setChapters] = useState<ManagedChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const apply = (list: ManagedChapter[]): void => {
    setChapters(list);
    onChanged?.(list);
  };

  // Load (and, if empty, seed) the managed list.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        let list = await chaptersApi.list(book.slug);
        if (list.length === 0) list = await chaptersApi.init(book.slug, seedFromBundled(book));
        if (alive) apply(list);
      } catch (e) {
        if (alive) setError(errMsg(e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book.slug]);

  const move = async (index: number, dir: -1 | 1): Promise<void> => {
    const target = index + dir;
    if (target < 0 || target >= chapters.length) return;
    const ids = chapters.map((c) => c.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    setBusy(true);
    setError(null);
    try {
      apply(await chaptersApi.reorder(book.slug, ids));
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (c: ManagedChapter): Promise<void> => {
    if (!confirm(`Delete "${c.title}"? This cannot be undone.`)) return;
    setBusy(true);
    setError(null);
    try {
      apply(await chaptersApi.remove(book.slug, c.order));
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  const add = async (): Promise<void> => {
    const title = newTitle.trim();
    if (title.length < 1) return;
    setBusy(true);
    setError(null);
    try {
      await chaptersApi.add(book.slug, { title });
      apply(await chaptersApi.list(book.slug));
      setNewTitle('');
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Manage chapters"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-hairline bg-surface shadow-xl"
        >
          <header className="flex items-center justify-between border-b border-hairline px-6 py-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-ink">Manage chapters</h2>
              <p className="text-xs text-muted">{book.title}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1.5 text-muted transition-colors hover:bg-cream hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          {/* add chapter */}
          <div className="flex items-center gap-2 border-b border-hairline px-6 py-3">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && add()}
              placeholder="New chapter title…"
              className="min-w-0 flex-1 rounded-xl border border-hairline bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
            />
            <button
              type="button"
              onClick={add}
              disabled={busy || newTitle.trim().length < 1}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gold-deep disabled:opacity-40"
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>

          {error && <p className="px-6 pt-3 text-sm text-red-600">{error}</p>}

          {/* list */}
          <div className="flex-1 overflow-y-auto px-6 py-3">
            {loading ? (
              <p className="flex items-center justify-center gap-2 py-10 text-sm text-muted">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading chapters…
              </p>
            ) : chapters.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted">No chapters yet. Add one above.</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {chapters.map((c, i) => (
                  <li
                    key={c.id}
                    className="flex items-center gap-3 rounded-xl border border-hairline bg-cream-surface/50 px-3 py-2.5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-surface font-serif text-sm text-gold-deep">
                      {c.order}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{c.title}</span>
                    <div className="flex shrink-0 items-center gap-0.5">
                      <button
                        type="button"
                        disabled={busy || i === 0}
                        onClick={() => move(i, -1)}
                        aria-label="Move up"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-body transition-colors hover:bg-cream disabled:opacity-25"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        disabled={busy || i === chapters.length - 1}
                        onClick={() => move(i, 1)}
                        aria-label="Move down"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-body transition-colors hover:bg-cream disabled:opacity-25"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => remove(c)}
                        aria-label="Delete chapter"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-body transition-colors hover:bg-red-500/10 hover:text-red-600 disabled:opacity-25"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <footer className="border-t border-hairline px-6 py-3 text-right">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-hairline px-5 py-2 text-sm font-semibold text-body transition-colors hover:bg-cream-surface"
            >
              Done
            </button>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
