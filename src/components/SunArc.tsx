import { motion } from 'framer-motion';
import { londonClock } from '../lib/sun';

interface Props {
  sunrise: Date;
  sunset: Date;
  now: Date;
}

/** Today's arc of the sun over the terrace, with where it is right now. */
export function SunArc({ sunrise, sunset, now }: Props) {
  const W = 320;
  const H = 96;
  const r = 120;
  const cx = W / 2;
  const cy = 140;
  const alpha = 0.9; // half the visible sweep, in radians
  const span = sunset.getTime() - sunrise.getTime();
  const f = Math.min(1, Math.max(0, (now.getTime() - sunrise.getTime()) / span));
  const at = (t: number) => {
    const ang = -Math.PI / 2 - alpha + 2 * alpha * t;
    return { x: cx + r * Math.cos(ang), y: cy + r * Math.sin(ang) };
  };
  const start = at(0);
  const end = at(1);
  const sun = at(f);
  const arc = `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`;
  const horizonY = start.y;
  return (
    <svg className="sunarc" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Sunrise ${londonClock(sunrise)}, sunset ${londonClock(sunset)}`}>
      <path className="sunarc__path" d={arc} fill="none" strokeWidth={2} />
      <motion.path
        className="sunarc__done"
        d={arc}
        fill="none"
        strokeWidth={3}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: f }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <line className="sunarc__horizon" x1={start.x - 10} x2={end.x + 10} y1={horizonY} y2={horizonY} strokeWidth={1.5} />
      <motion.circle
        r={8}
        fill="var(--accent)"
        initial={{ cx: start.x, cy: start.y }}
        animate={{ cx: sun.x, cy: sun.y, opacity: f >= 1 ? 0.35 : 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
      <text className="sunarc__label" x={start.x} y={horizonY + 16} textAnchor="middle">
        {londonClock(sunrise)}
      </text>
      <text className="sunarc__label" x={end.x} y={horizonY + 16} textAnchor="middle">
        {londonClock(sunset)}
      </text>
    </svg>
  );
}
