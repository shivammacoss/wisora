import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@features/landing';
import { UserMenu } from './UserMenu';
import { ThemeToggle } from './ThemeToggle';
import { ROUTES } from '@shared/constants';

interface AppHeaderProps {
  /** Override the right-side cluster. Defaults to the user avatar menu. */
  right?: ReactNode;
  /** Show a back arrow (→ previous page) to the left of the brand mark. */
  showBack?: boolean;
}

/** Sticky in-app header: brand mark (→ library) on the left, actions on the right. */
export function AppHeader({ right, showBack = false }: AppHeaderProps): JSX.Element {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-1.5">
          {showBack && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate(ROUTES.library)}
            className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label="Go to your library"
          >
            <Logo size={48} />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          {right ?? <UserMenu />}
        </div>
      </div>
    </header>
  );
}
