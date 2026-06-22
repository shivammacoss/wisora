import { motion } from 'framer-motion';
import { cn } from '@shared/utils/cn';

/** A single fluffy cloud built from overlapping ellipses, softly blurred. */
function Cloud({ className }: { className?: string }): JSX.Element {
  return (
    <svg viewBox="0 0 200 100" className={cn('h-auto w-full', className)} aria-hidden>
      <g fill="currentColor">
        <ellipse cx="58" cy="68" rx="52" ry="30" />
        <ellipse cx="100" cy="52" rx="44" ry="36" />
        <ellipse cx="142" cy="66" rx="48" ry="28" />
        <ellipse cx="100" cy="78" rx="82" ry="24" />
      </g>
    </svg>
  );
}

/**
 * Calm, airy cloud effect for the hero backdrop. Warm white / cream clouds that
 * drift and bob gently — keeps the brand palette (no blue sky). Responsive:
 * sizes are percentage-based so it reads well on web and mobile.
 * NOTE: purely decorative — pointer-events disabled, aria-hidden.
 */
export function Clouds({ className }: { className?: string }): JSX.Element {
  return (
    <div
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
      aria-hidden
    >
      {/* big soft cloud — top left */}
      <motion.div
        className="absolute -left-[6%] top-[8%] w-[46%] text-white blur-[2px] sm:w-[34%]"
        animate={{ x: [0, 26, 0], y: [0, -8, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Cloud />
      </motion.div>

      {/* cloud — top right */}
      <motion.div
        className="absolute right-[-4%] top-[4%] w-[40%] text-white blur-[2px] sm:w-[28%]"
        animate={{ x: [0, -22, 0], y: [0, 10, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      >
        <Cloud />
      </motion.div>

      {/* warm-tinted cloud — mid right */}
      <motion.div
        className="absolute right-[10%] top-[42%] w-[34%] text-cream-surface blur-[3px] sm:w-[24%]"
        animate={{ x: [0, 18, 0], y: [0, -6, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      >
        <Cloud />
      </motion.div>

      {/* small accent cloud — mid left */}
      <motion.div
        className="absolute left-[12%] top-[52%] w-[26%] text-white blur-[2px] sm:w-[18%]"
        animate={{ x: [0, 20, 0], y: [0, 8, 0] }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut', delay: 2.2 }}
      >
        <Cloud />
      </motion.div>

      {/* low band of clouds to softly meet the content below */}
      <motion.div
        className="absolute bottom-[-6%] left-[20%] w-[44%] text-white blur-[3px] sm:w-[30%]"
        animate={{ x: [0, -16, 0] }}
        transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <Cloud />
      </motion.div>
    </div>
  );
}
