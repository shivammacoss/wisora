import { cn } from '@shared/utils/cn';
import logo from '@assets/images/logo.png';

interface LogoProps {
  /** Rendered height of the logo lockup in pixels (width scales automatically). */
  size?: number;
  className?: string;
}

/** Wisora brand logo (spiral mark + wordmark) loaded from the image asset. */
export function Logo({ size = 32, className }: LogoProps): JSX.Element {
  return (
    <img
      src={logo}
      alt="Wisora"
      style={{ height: size }}
      className={cn('w-auto shrink-0', className)}
    />
  );
}
