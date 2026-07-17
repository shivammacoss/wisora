import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useThemeStore } from '@app/store';
import { AuthModal } from '@features/auth';
import { ThemeToggle } from '@shared/components/ui/ThemeToggle';
import { ROUTES } from '@shared/constants';
import heroBanner1 from '@assets/images/hero_banner1.png';
import heroBannerDark from '@assets/images/hero_banner_dark.png';
import {
  FeatureGrid,
  FeatureRows,
  FinalCTA,
  Hero,
  Logo,
  PricingCard,
} from '@features/landing';

/**
 * Login gate (the app's front door at `/`).
 * Same calm, Adobe-Podcast-inspired marketing surface, but framed as a login
 * page: no top nav, no footer — just a centred brand mark, the story, the
 * auth actions, and a closing tagline. Any "start" CTA drops the user into a
 * guest session and routes to the library.
 */
export default function LoginPage(): JSX.Element {
  const navigate = useNavigate();
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest);
  const loginWithMagicLink = useAuthStore((s) => s.loginWithMagicLink);
  const isDark = useThemeStore((s) => s.theme) === 'dark';

  // Sign-up / login popup.
  const [authOpen, setAuthOpen] = useState(false);
  const openAuth = (): void => setAuthOpen(true);
  const handleAuthSuccess = (): void => {
    setAuthOpen(false);
    navigate(ROUTES.library);
  };

  const enterAsGuest = (): void => {
    continueAsGuest();
    navigate(ROUTES.library);
  };

  const enterWithMagicLink = (email: string): void => {
    loginWithMagicLink(email);
    navigate(ROUTES.library);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Layered hero: content on top of a book illustration. Light and dark
          modes each use their own banner (same aspect ratio, so the reserved
          space matches). */}
      <div className="relative overflow-hidden bg-surface pb-[26vw] text-body dark:bg-[#222222] sm:pb-[24vw] lg:pb-[22vw]">
        {/* Theme-specific book illustration, anchored at the bottom. */}
        <img
          src={isDark ? heroBannerDark : heroBanner1}
          alt="A warm shelf of books inviting you to read"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] w-full select-none"
        />

        {/* Content layer */}
        <div className="relative z-10 w-full">
          {/* Centred brand mark replaces the navbar; theme toggle sits top-right. */}
          <header className="relative flex justify-center py-8">
            <Logo size={140} />
            <ThemeToggle className="absolute right-5 top-6 sm:right-8" />
          </header>
          <Hero onSignUp={openAuth} onExploreLibrary={openAuth} />
        </div>
      </div>

      <main>
        <FeatureGrid />
        <FeatureRows />
        <PricingCard onStartFree={openAuth} />
        <FinalCTA onContinueGuest={enterAsGuest} onMagicLink={enterWithMagicLink} />
      </main>

      {/* Closing tagline — the page ends here (no footer). */}
      <p className="mx-auto max-w-xl px-6 pb-16 text-center text-sm leading-relaxed text-muted">
        Ancient wisdom accessible, chapter by chapter, in a simple, gentle, and affordable way.
      </p>

      {/* Sign-up / login popup */}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={handleAuthSuccess} />
    </div>
  );
}
