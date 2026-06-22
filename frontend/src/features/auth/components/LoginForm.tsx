import { type FormEvent, useState } from 'react';
import { useLogin } from '../hooks/useLogin';

/** Self-contained login form for the auth feature. */
export function LoginForm(): JSX.Element {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();

  const onSubmit = (e: FormEvent): void => {
    e.preventDefault();
    login.mutate({ email, password });
  };

  return (
    <form onSubmit={onSubmit} className="mx-auto flex max-w-sm flex-col gap-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded border border-sacred-100 px-3 py-2"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="rounded border border-sacred-100 px-3 py-2"
        required
      />
      <button
        type="submit"
        disabled={login.isPending}
        className="rounded bg-sacred-500 px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        {login.isPending ? 'Signing in…' : 'Sign in'}
      </button>
      {login.isError && <p className="text-sm text-red-600">Invalid credentials.</p>}
    </form>
  );
}
