import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@app/store';
import { AuthModal } from '@features/auth';
import { ROUTES } from '@shared/constants';
import heroBanner1 from '@assets/images/hero_banner1.png';
import {
  BookShowcase,
  FeatureGrid,
  FeatureRows,
  FinalCTA,
  Hero,
  HowItWorks,
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
      {/* Layered hero: book illustration (background), content on top.
          White bg matches the illustration so its transparent top blends in. */}
      <div className="relative overflow-hidden bg-white pb-[26vw] sm:pb-[24vw] lg:pb-[22vw]">
        {/* Book illustration as the hero background, anchored at the bottom. */}
        <img
          src={heroBanner1}
          alt="A warm shelf of books inviting you to read"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] w-full select-none"
        />

        {/* Content layer */}
        <div className="relative z-10 w-full">
          {/* Centred brand mark replaces the navbar. */}
          <header className="flex justify-center py-8">
            <Logo size={140} />
          </header>
          <Hero onSignUp={openAuth} onExploreLibrary={openAuth} />
        </div>
      </div>

      <main>
        <FeatureGrid />
        <HowItWorks />
        <BookShowcase onOpenBook={openAuth} />
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
