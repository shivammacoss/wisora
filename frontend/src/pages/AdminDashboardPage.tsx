import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  BookOpen,
  CreditCard,
  LayoutDashboard,
  LogOut,
  type LucideIcon,
  MessageSquare,
  Send,
  Shield,
  ShieldCheck,
  ShieldOff,
  Trash2,
  Users,
} from 'lucide-react';
import { useAuthStore } from '@app/store';
import { getBooks } from '@features/books';
import { adminApi, type AdminFeedback, type AdminPayment, type AdminUser } from '@features/admin';
import { ThemeToggle } from '@shared/components/ui/ThemeToggle';
import { ROUTES } from '@shared/constants';

type Section = 'overview' | 'users' | 'payments' | 'feedback' | 'books';

const NAV: { key: Section; label: string; icon: LucideIcon }[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'users', label: 'User Management', icon: Users },
  { key: 'payments', label: 'Payments', icon: CreditCard },
  { key: 'feedback', label: 'Feedback', icon: MessageSquare },
  { key: 'books', label: 'Books', icon: BookOpen },
];

/** Admin control panel — only reachable by users whose role is `admin`. */
export default function AdminDashboardPage(): JSX.Element {
  const [section, setSection] = useState<Section>('overview');
  const navigate = useNavigate();
  const admin = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const current = NAV.find((n) => n.key === section)!;

  return (
    <div className="flex min-h-screen bg-cream">
      {/* sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-hairline bg-surface p-4 md:flex">
        <div className="flex items-center gap-2 px-2 py-3">
          <Shield className="h-6 w-6 text-gold" />
          <span className="font-serif text-lg font-bold text-ink">Wisora Admin</span>
        </div>
        <nav className="mt-4 flex flex-col gap-1">
          {NAV.map((item) => (
            <NavButton key={item.key} item={item} active={section === item.key} onClick={() => setSection(item.key)} />
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-1 border-t border-hairline pt-3">
          <button
            type="button"
            onClick={() => navigate(ROUTES.library)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-body transition-colors hover:bg-cream-surface"
          >
            <BookOpen className="h-4 w-4" /> Exit to app
          </button>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate(ROUTES.home);
            }}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-hairline bg-cream/85 px-5 py-3 backdrop-blur-md">
          <div className="min-w-0">
            <h1 className="truncate font-serif text-xl font-bold text-ink">{current.label}</h1>
            <p className="truncate text-xs text-muted">Signed in as {admin?.email}</p>
          </div>
          <ThemeToggle />
        </header>

        {/* section switcher (mobile) */}
        <div className="flex gap-2 overflow-x-auto border-b border-hairline bg-surface px-3 py-2 md:hidden">
          {NAV.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setSection(item.key)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                section === item.key ? 'bg-gold/15 text-gold-deep' : 'text-muted hover:text-ink'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <main className="flex-1 p-5 lg:p-7">
          {section === 'overview' && <OverviewSection onGo={setSection} />}
          {section === 'users' && <UsersSection currentAdminId={admin?.id} />}
          {section === 'payments' && <PaymentsSection />}
          {section === 'feedback' && <FeedbackSection />}
          {section === 'books' && <BooksSection />}
        </main>
      </div>
    </div>
  );
}

function NavButton({
  item,
  active,
  onClick,
}: {
  item: { label: string; icon: LucideIcon };
  active: boolean;
  onClick: () => void;
}): JSX.Element {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        active ? 'bg-gold/15 text-gold-deep' : 'text-body hover:bg-cream-surface'
      }`}
    >
      <Icon className="h-4 w-4" /> {item.label}
    </button>
  );
}

/* ───────── data helper ───────── */

function errMsg(e: unknown): string {
  if (axios.isAxiosError(e)) {
    if (!e.response) return 'Cannot reach the server. Is the backend running?';
    if (e.response.status === 403) return 'You do not have permission for this.';
    return e.response.data?.error?.message ?? 'Request failed.';
  }
  return 'Something went wrong.';
}

function useFetch<T>(fn: () => Promise<T>): {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // fn is recreated each render; we only want to run on mount + manual reload.
  const [tick, setTick] = useState(0);
  const reload = useCallback(() => setTick((t) => t + 1), []);
  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    fn()
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(errMsg(e)))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);
  return { data, loading, error, reload };
}

function StateWrap({
  loading,
  error,
  empty,
  children,
}: {
  loading: boolean;
  error: string | null;
  empty?: boolean;
  children: ReactNode;
}): JSX.Element {
  if (loading) return <p className="py-10 text-center text-sm text-muted">Loading…</p>;
  if (error) return <p className="py-10 text-center text-sm text-red-600">{error}</p>;
  if (empty) return <p className="py-10 text-center text-sm text-muted">Nothing here yet.</p>;
  return <>{children}</>;
}

function Card({ children, className = '' }: { children: ReactNode; className?: string }): JSX.Element {
  return (
    <div className={`rounded-2xl border border-hairline bg-surface p-5 shadow-soft ${className}`}>{children}</div>
  );
}

/* ───────── Overview ───────── */

function OverviewSection({ onGo }: { onGo: (s: Section) => void }): JSX.Element {
  const users = useFetch(adminApi.users.list);
  const feedback = useFetch(adminApi.feedback.list);
  const payments = useFetch(adminApi.payments.history);

  const stats: { label: string; value: string; go: Section; icon: LucideIcon }[] = [
    { label: 'Total users', value: users.data ? String(users.data.length) : '—', go: 'users', icon: Users },
    {
      label: 'Open feedback',
      value: feedback.data ? String(feedback.data.filter((f) => f.status === 'open').length) : '—',
      go: 'feedback',
      icon: MessageSquare,
    },
    {
      label: 'Payments',
      value: payments.data ? String(payments.data.length) : '—',
      go: 'payments',
      icon: CreditCard,
    },
    { label: 'Books', value: String(getBooks().length), go: 'books', icon: BookOpen },
  ];

  const anyError = users.error ?? feedback.error ?? payments.error;

  return (
    <div className="space-y-5">
      {anyError && (
        <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {anyError} — data below may be incomplete.
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.label}
              type="button"
              onClick={() => onGo(s.go)}
              className="rounded-2xl border border-hairline bg-surface p-5 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-lift"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/10">
                <Icon className="h-5 w-5 text-gold-deep" />
              </span>
              <p className="mt-4 font-serif text-3xl font-bold text-ink">{s.value}</p>
              <p className="text-sm text-muted">{s.label}</p>
            </button>
          );
        })}
      </div>
      <Card>
        <p className="text-sm text-body">
          Welcome to the Wisora admin panel. Use the sidebar to manage users, review payments,
          respond to reader feedback, and browse the book catalog.
        </p>
      </Card>
    </div>
  );
}

/* ───────── Users ───────── */

function UsersSection({ currentAdminId }: { currentAdminId?: string }): JSX.Element {
  const { data, loading, error, reload } = useFetch(adminApi.users.list);
  const [busy, setBusy] = useState<string | null>(null);

  const toggleRole = async (u: AdminUser): Promise<void> => {
    setBusy(u.id);
    try {
      await adminApi.users.updateRole(u.id, u.role === 'admin' ? 'user' : 'admin');
      reload();
    } catch (e) {
      alert(errMsg(e));
    } finally {
      setBusy(null);
    }
  };

  const remove = async (u: AdminUser): Promise<void> => {
    if (!confirm(`Delete ${u.email}? This cannot be undone.`)) return;
    setBusy(u.id);
    try {
      await adminApi.users.remove(u.id);
      reload();
    } catch (e) {
      alert(errMsg(e));
    } finally {
      setBusy(null);
    }
  };

  return (
    <StateWrap loading={loading} error={error} empty={data?.length === 0}>
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-hairline text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Joined</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((u) => {
              const isSelf = u.id === currentAdminId;
              return (
                <tr key={u.id} className="border-b border-hairline/60 last:border-0">
                  <td className="px-5 py-3 font-medium text-ink">{u.name}</td>
                  <td className="px-5 py-3 text-body">{u.email}</td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        u.role === 'admin'
                          ? 'bg-gold/15 text-gold-deep'
                          : 'bg-cream-surface text-muted'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        disabled={isSelf || busy === u.id}
                        onClick={() => toggleRole(u)}
                        title={u.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-body transition-colors hover:bg-cream-surface hover:text-gold-deep disabled:opacity-30"
                      >
                        {u.role === 'admin' ? <ShieldOff className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        disabled={isSelf || busy === u.id}
                        onClick={() => remove(u)}
                        title="Delete user"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-body transition-colors hover:bg-red-500/10 hover:text-red-600 disabled:opacity-30"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </StateWrap>
  );
}

/* ───────── Payments ───────── */

const CURRENCY_SYMBOL: Record<string, string> = { INR: '₹', USD: '$', EUR: '€' };

function PaymentsSection(): JSX.Element {
  const { data, loading, error } = useFetch(adminApi.payments.history);
  return (
    <StateWrap loading={loading} error={error} empty={data?.length === 0}>
      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="border-b border-hairline text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Chapter</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Provider</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((p: AdminPayment) => (
              <tr key={p.id} className="border-b border-hairline/60 last:border-0">
                <td className="px-5 py-3 text-muted">{new Date(p.createdAt).toLocaleString()}</td>
                <td className="px-5 py-3 text-body">#{p.chapterOrder}</td>
                <td className="px-5 py-3 font-medium text-ink">
                  {CURRENCY_SYMBOL[p.currency] ?? ''}
                  {(p.amount / 100).toFixed(2)}
                </td>
                <td className="px-5 py-3 capitalize text-body">{p.provider}</td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                      p.status === 'paid'
                        ? 'bg-emerald-500/15 text-emerald-600'
                        : p.status === 'failed'
                          ? 'bg-red-500/15 text-red-600'
                          : 'bg-cream-surface text-muted'
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </StateWrap>
  );
}

/* ───────── Feedback ───────── */

function FeedbackSection(): JSX.Element {
  const { data, loading, error, reload } = useFetch(adminApi.feedback.list);
  return (
    <StateWrap loading={loading} error={error} empty={data?.length === 0}>
      <div className="space-y-4">
        {data?.map((f) => (
          <FeedbackCard key={f.id} item={f} onReplied={reload} />
        ))}
      </div>
    </StateWrap>
  );
}

function FeedbackCard({ item, onReplied }: { item: AdminFeedback; onReplied: () => void }): JSX.Element {
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const send = async (): Promise<void> => {
    if (reply.trim().length < 1) return;
    setSending(true);
    setErr(null);
    try {
      await adminApi.feedback.reply(item.id, reply.trim());
      onReplied();
    } catch (e) {
      setErr(errMsg(e));
      setSending(false);
    }
  };

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-ink">{item.subject}</h3>
          <p className="text-xs text-muted">
            {item.userName} · {item.userEmail} · {new Date(item.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            item.status === 'replied' ? 'bg-emerald-500/15 text-emerald-600' : 'bg-gold/15 text-gold-deep'
          }`}
        >
          {item.status}
        </span>
      </div>
      <p className="mt-3 whitespace-pre-wrap text-sm text-body">{item.message}</p>

      {item.reply ? (
        <div className="mt-4 rounded-xl border-l-2 border-gold/50 bg-cream-surface/60 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gold-deep">Your reply</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-body">{item.reply}</p>
        </div>
      ) : (
        <div className="mt-4">
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Write a reply to this reader…"
            rows={3}
            className="w-full rounded-xl border border-hairline bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
          />
          {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
          <button
            type="button"
            onClick={send}
            disabled={sending || reply.trim().length < 1}
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gold-deep disabled:opacity-40"
          >
            <Send className="h-4 w-4" /> {sending ? 'Sending…' : 'Send reply'}
          </button>
        </div>
      )}
    </Card>
  );
}

/* ───────── Books ───────── */

function BooksSection(): JSX.Element {
  const books = getBooks();
  return (
    <div className="space-y-4">
      <p className="rounded-xl bg-gold/10 px-4 py-3 text-sm text-body">
        The full catalog is shown below. Live content editing that saves permanently needs the
        books moved to the database — that is the next step.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((b) => (
          <Card key={b.slug}>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gold-deep">
              {b.tradition}
            </p>
            <h3 className="mt-1 font-serif text-lg font-bold text-ink">{b.title}</h3>
            <p className="mt-1 text-sm text-muted">
              {b.chapters.length} {b.unit} · {b.language}
            </p>
            <p className="mt-3 line-clamp-2 text-sm text-body">{b.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
