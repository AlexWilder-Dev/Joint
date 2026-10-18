import type { Venue } from '../data/joint';
import { mapsUrl } from '../lib/venue';
import { MailIcon, PhoneIcon, PinIcon, TableIcon } from './Icons';

/** Thumb-reach bar on phones: call, directions, book. */
export function ActionBar({ venue, onBook }: { venue: Venue; onBook: () => void }) {
  return (
    <nav className="actionbar" aria-label={`${venue.name} quick actions`}>
      {venue.phone ? (
        <a href={`tel:${venue.phone.tel}`}>
          <PhoneIcon />
          Call
        </a>
      ) : (
        <a href={`mailto:${venue.email}`}>
          <MailIcon />
          Email
        </a>
      )}
      <a href={mapsUrl(venue)} target="_blank" rel="noreferrer">
        <PinIcon />
        Directions
      </a>
      <button type="button" className="is-primary" onClick={onBook}>
        <TableIcon />
        {venue.booking.mode === 'walk-in' ? 'Groups' : 'Book'}
      </button>
    </nav>
  );
}
