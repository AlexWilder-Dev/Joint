import type { Venue } from '../data/joint';
import { hoursRows, londonNow } from '../lib/time';
import { mapsUrl } from '../lib/venue';
import { useNow } from '../lib/useNow';

/** Hours, address, phone and email, with today's row picked out. */
export function VenueFacts({ venue }: { venue: Venue }) {
  const now = londonNow(useNow());
  return (
    <div className="facts">
      <div className="facts__row">
        <span className="facts__key">Hours</span>
        <div className="facts__val">
          {venue.hours ? (
            venue.hours.map((block) => (
              <div className="hours__block" key={block.label}>
                {venue.hours!.length > 1 && <div className="hours__title">{block.label}</div>}
                <ul className="hours">
                  {hoursRows(block).map((row) => (
                    <li key={row.label} data-today={row.days.includes(now.day)}>
                      <span>{row.label}</span>
                      <span>{row.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <span>{venue.hoursNote}</span>
          )}
        </div>
      </div>
      <div className="facts__row">
        <span className="facts__key">Where</span>
        <div className="facts__val">
          <a href={mapsUrl(venue)} target="_blank" rel="noreferrer">
            {venue.address.map((l) => (
              <span key={l} style={{ display: 'block' }}>
                {l}
              </span>
            ))}
          </a>
        </div>
      </div>
      {venue.phone && (
        <div className="facts__row">
          <span className="facts__key">Call</span>
          <div className="facts__val">
            <a href={`tel:${venue.phone.tel}`}>{venue.phone.display}</a>
            {venue.phone.label && <div className="muted" style={{ fontSize: 14 }}>{venue.phone.label}</div>}
          </div>
        </div>
      )}
      <div className="facts__row">
        <span className="facts__key">Email</span>
        <div className="facts__val">
          <a href={`mailto:${venue.email}`}>{venue.email}</a>
          {venue.extraEmail && (
            <div className="muted" style={{ fontSize: 14, marginTop: 4 }}>
              {venue.extraEmail.label}: <a href={`mailto:${venue.extraEmail.address}`}>{venue.extraEmail.address}</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
