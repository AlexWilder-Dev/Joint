import type { Venue } from '../data/joint';
import { WOW } from '../lib/flags';
import { Clip } from './Clip';
import { GreenwichLight } from './GreenwichLight';
import { Photo } from './Photo';

/** Each venue's photo gets its own treatment: a clipped print, a wide skyline, double rules, an enamel plate. */
export function VenueShot({ venue, slug, alt, eager }: { venue: Venue; slug?: string; alt?: string; eager?: boolean }) {
  const s = slug ?? venue.photos.hero;
  const a = alt ?? venue.photos.heroAlt;
  if (venue.id === 'brixton') {
    return (
      <figure className="shot shot--clip">
        <Clip />
        <Photo slug={s} alt={a} eager={eager} />
        <figcaption>6th Avenue, Brixton Village</figcaption>
      </figure>
    );
  }
  if (venue.id === 'greenwich') {
    if (WOW && !slug) return <GreenwichLight eager={eager} />;
    return (
      <figure className="shot shot--wide">
        <Photo slug={s} alt={a} eager={eager} />
        <figcaption>The roof terrace, Greenwich Peninsula</figcaption>
      </figure>
    );
  }
  if (venue.id === 'bermondsey') {
    return (
      <figure className="shot shot--rules">
        <Photo slug={s} alt={a} eager={eager} />
      </figure>
    );
  }
  return (
    <figure className="shot shot--plate">
      <div className="plate">
        <Photo slug={s} alt={a} eager={eager} sizes="(min-width: 900px) 440px, 90vw" />
      </div>
    </figure>
  );
}
