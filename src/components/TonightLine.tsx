import type { Venue } from '../data/joint';
import { tonightFor } from '../lib/tonight';
import { useNow } from '../lib/useNow';
import { SunArc } from './SunArc';

export function TonightLine({ venue }: { venue: Venue }) {
  const now = useNow();
  const t = tonightFor(venue, now);
  return (
    <div className="tonight" aria-live="polite">
      <span className="tonight__label">{t.label}</span>
      <span className="tonight__main">{t.main}</span>
      {t.sub && <span className="tonight__sub">{t.sub}</span>}
      {venue.id === 'greenwich' && t.sun && <SunArc sunrise={t.sun.sunrise} sunset={t.sun.sunset} now={t.sun.now} />}
    </div>
  );
}
