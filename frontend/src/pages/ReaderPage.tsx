import { useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { getBookBySlug } from '@features/books';
import { chapterUnlocked, useLibraryStore } from '@app/store';
import { Button } from '@features/landing/components/ui/Button';
import { AppHeader } from '@shared/components/ui/AppHeader';
import { ROUTES } from '@shared/constants';

/** Chapter reader (placeholder content) with prev/next navigation. */
export default function ReaderPage(): JSX.Element {
  const { bookId, chapterId } = useParams<{ bookId: string; chapterId: string }>();
  const navigate = useNavigate();

  const unlocked = useLibraryStore((s) => s.unlocked);
  const markRead = useLibraryStore((s) => s.markRead);

  const book = getBookBySlug(bookId);
  const order = Number(chapterId);
  const chapter = book?.chapters.find((c) => c.order === order);

  const accessible =
    book && chapter ? chapterUnlocked(unlocked, book.slug, chapter.order, chapter.isFree) : false;

  // Record progress once the chapter is open and accessible.
  useEffect(() => {
    if (book && chapter && accessible) markRead(book.slug, chapter.order);
  }, [book, chapter, accessible, markRead]);

  // Missing data → back to library. Locked chapter → back to the book's paywall.
  if (!book || !chapter) return <Navigate to={ROUTES.library} replace />;
  if (!accessible) return <Navigate to={ROUTES.bookDetail(book.slug)} replace />;

  const prev = book.chapters.find((c) => c.order === order - 1);
  const next = book.chapters.find((c) => c.order === order + 1);
  const nextAccessible = next
    ? chapterUnlocked(unlocked, book.slug, next.order, next.isFree)
    : false;

  // Accessible next chapter → open it; locked → bounce to the book's paywall.
  const goNext = (): void => {
    if (next && nextAccessible) navigate(ROUTES.reader(book.slug, String(next.order)));
    else navigate(ROUTES.bookDetail(book.slug));
  };

  return (
    <div className="min-h-screen bg-cream-surface/40">
      <AppHeader
        right={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate(ROUTES.bookDetail(book.slug))}
          >
            {book.title}
          </Button>
        }
      />

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto max-w-2xl px-6 py-14 md:py-20"
      >
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
            {book.title} · Chapter {chapter.order}
          </p>
          <h1 className="mt-3 font-serif text-4xl font-extrabold leading-tight text-ink md:text-5xl">
            {chapter.title}
          </h1>
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted">
            <Clock className="h-4 w-4" /> {chapter.readingTimeMins} min read
          </p>
          <div className="mx-auto mt-6 h-px w-16 bg-gold/40" />
        </header>

        {/* chapter body */}
        <article className="mt-10 space-y-5 text-lg leading-[1.85] text-body">
          {chapter.content && chapter.content.length > 0 ? (
            chapter.content.map((para, i) => (
              <p
                key={i}
                className={
                  i === 0
                    ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-gold-deep'
                    : undefined
                }
              >
                {para}
              </p>
            ))
          ) : (
            <p className="first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-serif first-letter:text-6xl first-letter:font-bold first-letter:leading-[0.8] first-letter:text-gold-deep">
              The distilled summary of <span className="italic">{chapter.title}</span> is being
              prepared. Your progress for this chapter has been recorded.
            </p>
          )}
        </article>

        {/* prev / next */}
        <nav className="mt-14 flex items-center justify-between border-t border-hairline pt-6">
          {prev ? (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              onClick={() => navigate(ROUTES.reader(book.slug, String(prev.order)))}
            >
              Previous
            </Button>
          ) : (
            <span />
          )}
          {next ? (
            <Button
              variant="gold"
              size="sm"
              rightIcon={<ArrowRight className="h-4 w-4" />}
              onClick={goNext}
            >
              {nextAccessible ? 'Next chapter' : 'Unlock next'}
            </Button>
          ) : (
            <Button variant="gold" size="sm" onClick={() => navigate(ROUTES.bookDetail(book.slug))}>
              Back to chapters
            </Button>
          )}
        </nav>
      </motion.main>
    </div>
  );
}
