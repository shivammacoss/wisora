import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { useAuthStore } from '@app/store';
import { ROUTES } from '@shared/constants';
import { cn } from '@shared/utils/cn';

/** Initials for the avatar (max two letters). */
function initialsOf(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || 'G'
  );
}

/** Avatar chip with a dropdown: profile + sign out. Used in the app header. */
export function UserMenu(): JSX.Element {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isGuest = useAuthStore((s) => s.isGuest);
  const logout = useAuthStore((s) => s.logout);

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const name = user?.name ?? 'Guest';

  const signOut = (): void => {
    logout();
    navigate(ROUTES.home);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-hairline bg-white py-1.5 pl-1.5 pr-3 shadow-soft transition-colors hover:border-ink/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-deep text-sm font-semibold text-white">
          {initialsOf(name)}
        </span>
        <span className="hidden max-w-[8rem] truncate text-sm font-medium text-ink sm:block">
          {name}
        </span>
        <ChevronDown
          className={cn('h-4 w-4 text-muted transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-hairline bg-white p-1.5 shadow-lift"
          >
            <div className="flex items-center gap-3 px-3 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold to-gold-deep text-base font-semibold text-white">
                {initialsOf(name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{name}</p>
                <p className="truncate text-xs text-muted">
                  {isGuest ? 'Guest session' : user?.email}
                </p>
              </div>
            </div>

            <div className="my-1 h-px bg-hairline" />

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                navigate(ROUTES.profile);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-body transition-colors hover:bg-cream hover:text-ink"
            >
              <User className="h-4 w-4" /> Profile
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={signOut}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-body transition-colors hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
