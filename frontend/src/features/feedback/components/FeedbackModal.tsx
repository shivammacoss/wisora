import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import { CheckCircle2, X } from 'lucide-react';
import { feedbackApi } from '../api/feedback.api';

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

function errMsg(e: unknown): string {
  if (axios.isAxiosError(e)) {
    if (!e.response) return 'Cannot reach the server. Is the backend running?';
    if (e.response.status === 401) return 'Please sign in with an account to send feedback.';
    return e.response.data?.error?.message ?? 'Could not send feedback.';
  }
  return 'Something went wrong.';
}

/** Simple modal for a signed-in user to send feedback to the Wisora team. */
export function FeedbackModal({ open, onClose }: FeedbackModalProps): JSX.Element {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSubject('');
    setMessage('');
    setError(null);
    setDone(false);
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const submit = async (): Promise<void> => {
    if (subject.trim().length < 2 || message.trim().length < 2) {
      setError('Please fill in a subject and message.');
      return;
    }
    setSending(true);
    setError(null);
    try {
      await feedbackApi.submit(subject.trim(), message.trim());
      setDone(true);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Send feedback"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-md rounded-2xl border border-hairline bg-surface p-7 shadow-xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted transition-colors hover:bg-cream hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>

            {done ? (
              <div className="py-6 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
                <h2 className="mt-3 font-serif text-xl font-bold text-ink">Thank you!</h2>
                <p className="mt-1 text-sm text-muted">
                  Your feedback has reached the team. We’ll reply if it needs a response.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-5 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-gold-deep"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-serif text-2xl font-bold text-ink">Send feedback</h2>
                <p className="mt-1 text-sm text-muted">
                  Tell us what you love or what could be better. We read everything.
                </p>
                <div className="mt-5 space-y-3">
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Subject"
                    className="w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-base text-ink placeholder:text-muted focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
                  />
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message…"
                    rows={4}
                    className="w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-base text-ink placeholder:text-muted focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
                  />
                  {error && <p className="text-sm font-medium text-red-600">{error}</p>}
                  <button
                    type="button"
                    onClick={submit}
                    disabled={sending}
                    className="w-full rounded-full bg-gold py-3 text-sm font-semibold text-white transition-colors hover:bg-gold-deep disabled:opacity-50"
                  >
                    {sending ? 'Sending…' : 'Send feedback'}
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
