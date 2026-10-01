import type { Lang } from '@app/store';
import { cn } from '@shared/utils/cn';

/**
 * Small inline-SVG flag for each app language. SVG (not emoji) so flags render
 * identically on Windows, which does not draw emoji flags.
 */
export function FlagIcon({ code, className }: { code: Lang; className?: string }): JSX.Element {
  return (
    <span
      className={cn(
        'inline-block h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]',
        className,
      )}
      aria-hidden
    >
      {FLAGS[code]}
    </span>
  );
}

const svg = 'h-full w-full';

const FLAGS: Record<Lang, JSX.Element> = {
  // United Kingdom — English
  en: (
    <svg viewBox="0 0 60 30" className={svg} preserveAspectRatio="xMidYMid slice">
      <clipPath id="fl-uk">
        <rect width="60" height="30" />
      </clipPath>
      <g clipPath="url(#fl-uk)">
        <rect width="60" height="30" fill="#012169" />
        <path d="M0,0 60,30 M60,0 0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 60,30 M60,0 0,30" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  ),
  // Spain
  es: (
    <svg viewBox="0 0 6 4" className={svg} preserveAspectRatio="none">
      <rect width="6" height="4" fill="#C60B1E" />
      <rect y="1" width="6" height="2" fill="#FFC400" />
    </svg>
  ),
  // France
  fr: (
    <svg viewBox="0 0 3 2" className={svg} preserveAspectRatio="none">
      <rect width="3" height="2" fill="#fff" />
      <rect width="1" height="2" fill="#0055A4" />
      <rect x="2" width="1" height="2" fill="#EF4135" />
    </svg>
  ),
  // Pakistan — Urdu
  ur: (
    <svg viewBox="0 0 60 40" className={svg} preserveAspectRatio="xMidYMid slice">
      <rect width="60" height="40" fill="#01411C" />
      <rect width="15" height="40" fill="#fff" />
      <circle cx="39" cy="20" r="9" fill="#fff" />
      <circle cx="42" cy="18" r="9" fill="#01411C" />
      <polygon
        points="47,15 48.1,18.2 51.5,18.2 48.7,20.2 49.8,23.4 47,21.4 44.2,23.4 45.3,20.2 42.5,18.2 45.9,18.2"
        fill="#fff"
      />
    </svg>
  ),
  // Russia
  ru: (
    <svg viewBox="0 0 9 6" className={svg} preserveAspectRatio="none">
      <rect width="9" height="6" fill="#fff" />
      <rect y="2" width="9" height="2" fill="#0039A6" />
      <rect y="4" width="9" height="2" fill="#D52B1E" />
    </svg>
  ),
};
