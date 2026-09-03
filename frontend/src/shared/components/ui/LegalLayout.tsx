import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@features/landing';
import { ThemeToggle } from './ThemeToggle';
import { ROUTES } from '@shared/constants';

/** Shared, public page shell for legal documents (privacy, terms). */
export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-hairline bg-cream/85 px-5 py-3 backdrop-blur-md">
        <Link
          to={ROUTES.home}
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          aria-label="Wisora home"
        >
          <Logo size={40} />
        </Link>
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        <h1 className="font-serif text-4xl font-extrabold text-ink md:text-5xl">{title}</h1>
        <p className="mt-2 text-sm text-muted">Last updated: {updated}</p>
        <div className="mt-8">{children}</div>
      </main>

      <footer className="border-t border-hairline px-6 py-8 text-center text-sm text-muted">
        © {new Date().getFullYear()} Wisora ·{' '}
        <Link to={ROUTES.privacyPolicy} className="text-gold-deep hover:underline">
          Privacy
        </Link>{' '}
        ·{' '}
        <Link to={ROUTES.terms} className="text-gold-deep hover:underline">
          Terms
        </Link>{' '}
        ·{' '}
        <a href="mailto:support@wisora.org" className="text-gold-deep hover:underline">
          support@wisora.org
        </a>
      </footer>
    </div>
  );
}

/** Section heading inside a legal page. */
export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <section className="mt-8">
      <h2 className="font-serif text-xl font-bold text-ink">{heading}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-body">{children}</div>
    </section>
  );
}
