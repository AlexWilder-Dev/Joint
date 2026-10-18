import { motion } from 'framer-motion';
import { useId } from 'react';
import { Logo, PIG, WORD } from './Logo';
import { LOGO_STROKES, LOGO_THE_BOX } from './logoStrokes';

/** Seconds into the opening sequence when the first stroke starts, and how long the whole word takes. */
export const DRAW_START = 0.25;
export const DRAW_SPAN = 0.9;
export const PIG_LANDS = DRAW_START + DRAW_SPAN - 0.05;

const total = LOGO_STROKES.reduce((n, s) => n + s.length, 0);
// Strokes overlap a little, like a quick hand: each starts before the last one finishes.
const timings = (() => {
  let at = DRAW_START;
  return LOGO_STROKES.map((s) => {
    const duration = Math.max(0.08, (s.length / total) * DRAW_SPAN * 1.35);
    const t = { delay: at, duration };
    at += duration * 0.74;
    return t;
  });
})();

/**
 * The wordmark written out in one marker stroke along its own centre line, then the pig drops onto the i.
 * When `play` is false it is simply the logo.
 */
export function LogoDraw({ play }: { play: boolean }) {
  const mask = `ink-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  if (!play) return <Logo />;
  return (
    <svg viewBox="0 0 1524 956" role="img" aria-label="The Joint" fill="currentColor">
      <defs>
        <mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width="1524" height="956">
          <motion.rect
            {...LOGO_THE_BOX}
            fill="#fff"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: DRAW_START - 0.1, duration: 0.35 }}
          />
          {LOGO_STROKES.map((s, i) => (
            <motion.path
              key={s.name}
              d={s.d}
              fill="none"
              stroke="#fff"
              strokeWidth={56}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                pathLength: { delay: timings[i].delay, duration: timings[i].duration, ease: [0.45, 0, 0.3, 1] },
                opacity: { delay: timings[i].delay, duration: 0.01 },
              }}
            />
          ))}
        </mask>
      </defs>
      <path fillRule="evenodd" d={WORD} mask={`url(#${mask})`} />
      <motion.path
        d={PIG}
        initial={{ y: -320, opacity: 0, rotate: -14 }}
        animate={{ y: [-320, 0, -46, 0], opacity: [0, 1, 1, 1], rotate: [-14, 6, -3, 0] }}
        transition={{ delay: PIG_LANDS, duration: 0.55, times: [0, 0.55, 0.78, 1], ease: 'easeOut' }}
        style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
      />
    </svg>
  );
}
