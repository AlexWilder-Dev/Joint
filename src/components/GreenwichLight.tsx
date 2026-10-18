import { motion } from 'framer-motion';
import { useState } from 'react';
import { londonNow } from '../lib/time';
import { GREENWICH_TERRACE, londonClock, sunTimes } from '../lib/sun';
import { useNow } from '../lib/useNow';
import { Photo } from './Photo';

type Light = 'day' | 'sunset' | 'night';

const SHOTS: Record<Light, { slug: string; alt: string; label: string }> = {
  day: { slug: 'gw-day', alt: 'The Greenwich roof terrace by day, the O2 next door', label: 'by day' },
  sunset: { slug: 'gw-sunset', alt: 'The Greenwich roof terrace at sunset, Canary Wharf on the skyline', label: 'at sunset' },
  night: { slug: 'gw-o2-night', alt: 'The Greenwich roof terrace after dark, the O2 lit up behind', label: 'after dark' },
};

export function lightNow(at: Date): Light {
  const n = londonNow(at);
  const sun = sunTimes(n.year, n.month, n.dayOfMonth, GREENWICH_TERRACE.lat, GREENWICH_TERRACE.lon);
  if (!sun) return 'day';
  const t = at.getTime();
  if (t < sun.sunrise.getTime() || t >= sun.sunset.getTime() + 45 * 60000) return 'night';
  if (t >= sun.sunset.getTime() - 90 * 60000) return 'sunset';
  return 'day';
}

/** The same roof terrace by day, at sunset and after dark: it shows whichever light Greenwich is in right now. */
export function GreenwichLight({ eager }: { eager?: boolean }) {
  const now = useNow();
  const auto = lightNow(now);
  const [picked, setPicked] = useState<Light | null>(null);
  const light = picked ?? auto;
  return (
    <figure className="shot shot--wide shot--light">
      <div className="light-stage">
        {(Object.keys(SHOTS) as Light[]).map((k) => (
          <motion.div
            key={k}
            className="light-stage__layer"
            initial={false}
            animate={{ opacity: k === light ? 1 : 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden={k !== light}
          >
            <Photo slug={SHOTS[k].slug} alt={k === light ? SHOTS[k].alt : ''} eager={eager} />
          </motion.div>
        ))}
      </div>
      <figcaption className="light-caption">
        <span>
          The roof terrace, {SHOTS[light].label}
          {light === auto ? ` · ${londonClock(now)} in Greenwich now` : ''}
        </span>
        <span className="seg seg--light" role="group" aria-label="See the terrace">
          {(Object.keys(SHOTS) as Light[]).map((k) => (
            <button key={k} type="button" aria-pressed={k === light} onClick={() => setPicked(k === auto ? null : k)}>
              {k === 'day' ? 'Day' : k === 'sunset' ? 'Sunset' : 'Night'}
              {k === auto && <span className="seg__now">now</span>}
            </button>
          ))}
        </span>
      </figcaption>
    </figure>
  );
}
