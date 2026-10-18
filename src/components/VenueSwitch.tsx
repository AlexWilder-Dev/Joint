import { motion } from 'framer-motion';
import { venues, type VenueId } from '../data/joint';
import { tonightFor } from '../lib/tonight';
import { useNow } from '../lib/useNow';
import { useVenue } from '../lib/venue';
import { Pig } from './Pig';

interface Props {
  onPick?: (id: VenueId) => void;
  label?: string;
}

/**
 * Four boards, one per Joint. The pig from the logo's i sits on the one you've picked
 * and hops across when you change your mind.
 */
export function VenueSwitch({ onPick, label = 'Pick your Joint' }: Props) {
  const { venue, setVenue } = useVenue();
  const now = useNow();
  return (
    <div role="group" aria-label={label}>
      <ul className="switch">
        {venues.map((v) => {
          const t = tonightFor(v, now);
          const on = v.id === venue.id;
          return (
            <li key={v.id}>
              <button
                type="button"
                className="switch__btn"
                aria-pressed={on}
                onClick={() => {
                  setVenue(v.id);
                  onPick?.(v.id);
                }}
              >
                {on && (
                  <motion.span
                    className="switch__pig"
                    layoutId="switch-pig"
                    transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                  >
                    <motion.span
                      style={{ display: 'block' }}
                      key={v.id}
                      initial={{ y: 0, rotate: 0 }}
                      animate={{ y: [0, -12, 0, -4, 0], rotate: [0, -8, 4, 0, 0] }}
                      transition={{ duration: 0.6, times: [0, 0.35, 0.65, 0.82, 1] }}
                    >
                      <Pig />
                    </motion.span>
                  </motion.span>
                )}
                <span className="switch__name">{v.name}</span>
                <span className="switch__kicker">{v.kicker}</span>
                <span className="switch__now">
                  <span className="switch__dot" data-live={t.live} aria-hidden="true" />
                  {t.short}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
