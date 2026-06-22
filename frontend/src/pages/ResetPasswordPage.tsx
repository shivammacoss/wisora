import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Logo } from '@features/landing';
import { authApi } from '@features/auth';
import { Button } from '@features/landing/components/ui/Button';
import { ROUTES } from '@shared/constants';

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) return 'Cannot reach the server. Is the backend running on :8080?';
    return err.response.data?.error?.message ?? 'Request failed. Please try again.';
  }
  return 'Something went wrong. Please try again.';
}

/** Target of the password-reset email link: /reset-password?token=… */
export default function ResetPasswordPage(): JSX.Element {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4">
      <Link to={ROUTES.home} className="mb-8">
        <Logo size={64} />
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md rounded-2xl border border-hairline bg-white p-8 shadow-xl"
      >
        {!token ? (
          <div className="text-center">
            <h1 className="font-serif text-2xl font-bold text-ink">Invalid reset link</h1>
            <p className="mt-2 text-sm text-muted">
              This link is missing its token. Please request a new password reset.
            </p>
            <Button variant="gold" className="mt-6 w-full" onClick={() => navigate(ROUTES.home)}>
              Back to login
            </Button>
          </div>
        ) : done ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
            <h1 className="mt-4 font-serif text-2xl font-bold text-ink">Password updated</h1>
            <p className="mt-2 text-sm text-muted">
              Your password has been changed. You can now log in with your new password.
            </p>
            <Button variant="gold" className="mt-6 w-full" onClick={() => navigate(ROUTES.home)}>
              Go to login
            </Button>
          </div>
        ) : (
          <>
            <h1 className="font-serif text-2xl font-bold text-ink">Choose a new password</h1>
            <p className="mt-1 text-sm text-muted">Enter and confirm your new password below.</p>

            <form onSubmit={submit} className="mt-6 space-y-3">
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password (min 8 characters)"
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-line bg-white px-4 py-3 pr-11 text-base text-ink placeholder:text-muted focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted transition-colors hover:text-ink"
                >
                  {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <input
                type={show ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Confirm new password"
                autoComplete="new-password"
                className="w-full rounded-xl border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-muted focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
              />

              {error && <p className="text-sm font-medium text-red-600">{error}</p>}

              <Button type="submit" variant="gold" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Updating…' : 'Update password'}
              </Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
