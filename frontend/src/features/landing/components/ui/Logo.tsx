import { cn } from '@shared/utils/cn';
import logo from '@assets/images/logo.png';
import logoDark from '@assets/images/logo_for_dark.png';

interface LogoProps {
  /** Rendered height of the logo lockup in pixels (width scales automatically). */
  size?: number;
  className?: string;
}

/**
 * Wisora brand logo (spiral mark + wordmark). Theme-aware: the standard logo in
 * light mode, and the dark-optimised variant in dark mode.
 */
export function Logo({ size = 32, className }: LogoProps): JSX.Element {
  return (
    <>
      <img
        src={logo}
        alt="Wisora"
        style={{ height: size }}
        className={cn('block w-auto shrink-0 dark:hidden', className)}
      />
      <img
        src={logoDark}
        alt="Wisora"
        style={{ height: size }}
        className={cn('hidden w-auto shrink-0 dark:block', className)}
      />
    </>
  );
}
