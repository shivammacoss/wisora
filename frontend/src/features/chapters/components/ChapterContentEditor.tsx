import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check, FileUp, Loader2, X } from 'lucide-react';
import type { Book, Chapter } from '@features/books';
import { chaptersApi } from '../api/chapters.api';
import {
  ACCEPTED_DOC_TYPES,
  blocksFromText,
  parseDocumentToBlocks,
  textFromBlocks,
} from '../lib/parseDocument';

interface ChapterContentEditorProps {
  book: Book;
  chapter: Chapter;
  onClose: () => void;
  /** Called after a successful save (e.g. to refresh the reader). */
  onSaved?: (blocks: string[]) => void;
}

/**
 * Admin-only editor for a chapter's reading content. Supports typing directly
 * or uploading a document (.txt / .md / .docx). Persists to the backend.
 */
export function ChapterContentEditor({
  book,
  chapter,
  onClose,
  onSaved,
}: ChapterContentEditorProps): JSX.Element {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Load any existing content on open.
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    chaptersApi
      .getContent(book.slug, chapter.order)
      .then((content) => {
        if (!alive) return;
        const blocks = content?.blocks ?? chapter.content ?? [];
        setText(textFromBlocks(blocks));
      })
      .catch(() => alive && setError('Could not load existing content.'))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [book.slug, chapter.order, chapter.content]);

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-picking the same file
    if (!file) return;
    setError(null);
    setNotice(null);
    try {
      const blocks = await parseDocumentToBlocks(file);
      setText(textFromBlocks(blocks));
      setNotice(`Loaded ${blocks.length} lines from “${file.name}”. Review, then Save.`);
    } catch {
      setError('Could not read that file. Use a .txt, .md, or .docx document.');
    }
  };

  const save = async (): Promise<void> => {
    setSaving(true);
    setError(null);
    try {
      const blocks = blocksFromText(text);
      await chaptersApi.saveContent(book.slug, chapter.order, blocks);
      onSaved?.(blocks);
      onClose();
    } catch (err) {
      const msg =
        (err as { response?: { status?: number } }).response?.status === 403
          ? 'Only admins can edit chapter content.'
          : 'Could not save. Is the backend running and are you signed in as admin?';
      setError(msg);
      setSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[70] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={() => !saving && onClose()}
          className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
        />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="content-editor-title"
          initial={{ opacity: 0, scale: 0.96, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 14 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-hairline bg-surface shadow-lift"
        >
          {/* header */}
          <div className="flex items-start justify-between gap-4 border-b border-hairline px-6 py-4">
            <div className="min-w-0">
              <h2 id="content-editor-title" className="font-serif text-lg font-bold text-ink">
                Edit chapter content
              </h2>
              <p className="mt-0.5 truncate text-xs text-muted">
                {book.title} · Chapter {chapter.order} — {chapter.title}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              aria-label="Close"
              className="rounded-full p-1.5 text-muted transition-colors hover:bg-cream-surface hover:text-ink disabled:opacity-40"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {loading ? (
              <p className="py-10 text-center text-sm text-muted">Loading…</p>
            ) : (
              <>
                <div className="mb-3 flex flex-wrap items-center gap-3">
                  <input
                    ref={fileRef}
                    type="file"
                    accept={ACCEPTED_DOC_TYPES}
                    onChange={onPickFile}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-full border border-hairline bg-cream-surface px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-gold/50"
                  >
                    <FileUp className="h-4 w-4" /> Upload text / doc
                  </button>
                  <span className="text-xs text-muted">Accepts .txt, .md, .docx</span>
                </div>

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  spellCheck={false}
                  placeholder={
                    'Write the chapter here — one block per line.\n\n## Section heading\nA paragraph of the summary…\n> A verse or quote\n- A bullet point\n---'
                  }
                  className="h-72 w-full resize-y rounded-xl border border-hairline bg-cream/30 px-3 py-2.5 font-mono text-sm leading-relaxed text-ink placeholder:text-muted/70 focus:border-gold focus:bg-surface focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
                />

                <p className="mt-2 text-xs text-muted">
                  Formatting: <code>## heading</code>, <code>&gt; verse</code>, <code>- bullet</code>,{' '}
                  <code>---</code> divider. Plain lines become paragraphs.
                </p>

                {notice && (
                  <p className="mt-3 flex items-start gap-2 rounded-xl bg-gold/10 px-3 py-2 text-xs text-gold-deep">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {notice}
                  </p>
                )}
                {error && (
                  <p className="mt-3 flex items-start gap-2 rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-600">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
                  </p>
                )}
              </>
            )}
          </div>

          {/* footer */}
          <div className="flex items-center justify-end gap-3 border-t border-hairline px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-full border border-hairline bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-cream-surface disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving || loading}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-gold-deep disabled:opacity-40"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {saving ? 'Saving…' : 'Save content'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
