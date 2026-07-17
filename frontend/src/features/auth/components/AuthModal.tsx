import { useEffect, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import axios from 'axios';
import { Eye, EyeOff, X } from 'lucide-react';
import { useAuthStore } from '@app/store';
import { Button } from '@features/landing/components/ui/Button';
import { authApi } from '../api/auth.api';

/** Turn an axios/network failure into a friendly message. */
function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) return 'Cannot reach the server. Is the backend running on :8080?';
    return err.response.data?.error?.message ?? 'Request failed. Please try again.';
  }
  return 'Something went wrong. Please try again.';
}

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  /** Called after any successful sign-in (email, Google, or guest). */
  onSuccess: () => void;
}

type Mode = 'login' | 'signup' | 'forgot';

const isValidEmail = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

/** Sign-up / login / forgot-password popup wired to the real backend. */
export function AuthModal({ open, onClose, onSuccess }: AuthModalProps): JSX.Element {
  const [mode, setMode] = useState<Mode>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setSession = useAuthStore((s) => s.setSession);
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest);

  // Reset transient UI whenever the modal is opened, and close on Escape.
  useEffect(() => {
    if (!open) return;
    setError(null);
    setInfo(null);
    setDevResetUrl(null);
    setShowPassword(false);
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const switchMode = (next: Mode): void => {
    setMode(next);
    setError(null);
    setInfo(null);
    setDevResetUrl(null);
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Forgot-password: only needs the email.
    if (mode === 'forgot') {
      setLoading(true);
      try {
        const res = await authApi.forgotPassword(email.trim());
        setInfo(res.message);
        setDevResetUrl(res.devResetUrl ?? null);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (mode === 'signup' && name.trim().length < 2) {
      setError('Please enter your name.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      // Real backend call → persists to MongoDB and returns user + JWT tokens.
      const result =
        mode === 'signup'
          ? await authApi.register({ name: name.trim(), email: email.trim(), password })
          : await authApi.login({ email: email.trim(), password });

      setSession(result.user, result.tokens);
      onSuccess();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = (): void => {
    continueAsGuest();
    onSuccess();
  };

  const heading =
    mode === 'forgot'
      ? 'Reset your password'
      : mode === 'signup'
        ? 'Create your account'
        : 'Welcome back';
  const subtitle =
    mode === 'forgot'
      ? "Enter your email and we'll send you a link to reset your password."
      : mode === 'signup'
        ? 'Sign up to start reading — first chapter of every book is free.'
        : 'Log in to continue your reading journey.';
  const submitLabel = mode === 'forgot' ? 'Send reset link' : mode === 'signup' ? 'Create account' : 'Log in';

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
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden />

          {/* panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={heading}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-md rounded-2xl border border-hairline bg-surface p-8 shadow-xl"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted transition-colors hover:bg-cream hover:text-ink"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="font-serif text-2xl font-bold text-ink">{heading}</h2>
            <p className="mt-1 text-sm text-muted">{subtitle}</p>

            {/* tab switch — hidden in forgot view */}
            {mode !== 'forgot' && (
              <div className="mt-6 grid grid-cols-2 rounded-xl bg-cream p-1 text-sm font-medium">
                {(['signup', 'login'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => switchMode(m)}
                    className={`rounded-lg py-2 transition-colors ${
                      mode === m ? 'bg-surface text-ink shadow-soft' : 'text-muted hover:text-ink'
                    }`}
                  >
                    {m === 'signup' ? 'Sign Up' : 'Log In'}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              {mode === 'signup' && (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  className="w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-base text-ink placeholder:text-muted focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
                />
              )}

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                autoComplete="email"
                className="w-full rounded-xl border border-hairline bg-surface px-4 py-3 text-base text-ink placeholder:text-muted focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
              />

              {mode !== 'forgot' && (
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password (min 6 characters)"
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    className="w-full rounded-xl border border-hairline bg-surface px-4 py-3 pr-11 text-base text-ink placeholder:text-muted focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted transition-colors hover:text-ink focus-visible:text-ink focus-visible:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              )}

              {/* Forgot-password link — only in login view */}
              {mode === 'login' && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-sm font-medium text-gold-deep hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {error && <p className="text-sm font-medium text-red-600">{error}</p>}

              {info && (
                <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  {info}
                  {devResetUrl && (
                    <>
                      {' '}
                      <a
                        href={devResetUrl}
                        className="font-semibold text-emerald-900 underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open reset link (dev)
                      </a>
                    </>
                  )}
                </div>
              )}

              <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Please wait…' : submitLabel}
              </Button>
            </form>

            {mode === 'forgot' ? (
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="mt-4 w-full text-center text-sm font-medium text-muted transition-colors hover:text-ink"
              >
                ← Back to log in
              </button>
            ) : (
              <>
                {/* divider */}
                <div className="my-5 flex items-center gap-3 text-xs text-muted">
                  <span className="h-px flex-1 bg-hairline" />
                  OR
                  <span className="h-px flex-1 bg-hairline" />
                </div>

                <button
                  type="button"
                  onClick={handleGuest}
                  className="w-full rounded-full border border-hairline py-2.5 text-sm font-medium text-muted transition-colors hover:bg-cream hover:text-ink"
                >
                  Continue as guest
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
