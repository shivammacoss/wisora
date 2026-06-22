import { type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@features/landing';
import { UserMenu } from './UserMenu';
import { ROUTES } from '@shared/constants';

interface AppHeaderProps {
  /** Override the right-side cluster. Defaults to the user avatar menu. */
  right?: ReactNode;
}

/** Sticky in-app header: brand mark (→ library) on the left, actions on the right. */
export function AppHeader({ right }: AppHeaderProps): JSX.Element {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <button
          type="button"
          onClick={() => navigate(ROUTES.library)}
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          aria-label="Go to your library"
        >
          <Logo size={48} />
        </button>
        <div className="flex items-center gap-3">{right ?? <UserMenu />}</div>
      </div>
    </header>
  );
}
