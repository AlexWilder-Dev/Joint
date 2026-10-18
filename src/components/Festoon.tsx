import { motion } from 'framer-motion';

const BULBS = 13;
const SPANS = 3;
const SAG = 16;

/** Where a bulb hangs on a wire draped in three loops across the board (u from 0 to 1). */
function hang(u: number) {
  const s = Math.min(SPANS - 1, Math.floor(u * SPANS));
  const t = u * SPANS - s;
  return 4 + SAG * 4 * t * (1 - t);
}

/**
 * The festoon bulbs strung over 6th Avenue in Brixton Village and over the Greenwich terrace,
 * flickering on along the top of the board.
 */
export function Festoon({ play, startAt = 0 }: { play: boolean; startAt?: number }) {
  const wire = Array.from({ length: SPANS }, (_, s) => {
    const x0 = (s / SPANS) * 1000;
    const x1 = ((s + 1) / SPANS) * 1000;
    return `M${x0} 4 Q${(x0 + x1) / 2} ${4 + SAG * 2} ${x1} 4`;
  }).join(' ');
  return (
    <div className="festoon" aria-hidden="true">
      <svg viewBox="0 0 1000 40" preserveAspectRatio="none" className="festoon__wire">
        <path d={wire} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      {Array.from({ length: BULBS }, (_, i) => {
        const u = (i + 0.5) / BULBS;
        const order = [6, 2, 9, 0, 11, 4, 7, 1, 12, 3, 10, 5, 8][i] ?? i;
        return (
          <span key={i} className="festoon__bulb" style={{ left: `${u * 100}%`, top: `${hang(u)}px` }}>
            <motion.span
              className="festoon__glass"
              initial={play ? { opacity: 0.12 } : false}
              animate={play ? { opacity: [0.12, 1, 0.35, 1] } : { opacity: 1 }}
              transition={play ? { delay: startAt + order * 0.035, duration: 0.32, times: [0, 0.3, 0.55, 1] } : undefined}
            />
          </span>
        );
      })}
    </div>
  );
}
