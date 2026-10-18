import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { ActionBar } from '../components/ActionBar';
import { ArrowIcon } from '../components/Icons';
import { Gallery } from '../components/Lightbox';
import { TableRequest } from '../components/TableRequest';
import { TonightLine } from '../components/TonightLine';
import { VenueFacts } from '../components/VenueFacts';
import { VenueShot } from '../components/VenueShot';
import { haysOffer, venueById, venues, type VenueId } from '../data/joint';
import { daysLabel, londonNow, prettyTime } from '../lib/time';
import { useNow } from '../lib/useNow';
import { usePageTitle } from '../lib/usePageTitle';
import { isDark, mapsUrl, themeStyle, useVenue } from '../lib/venue';

export function VenuePage() {
  const { venueId } = useParams();
  const { setVenue } = useVenue();
  const [params] = useSearchParams();
  const bookRef = useRef<HTMLElement>(null);
  const now = londonNow(useNow());
  const venue = venueId && venueId in venueById ? venueById[venueId as VenueId] : undefined;

  useEffect(() => {
    if (venue) setVenue(venue.id);
  }, [venue, setVenue]);

  // Arriving from "Book" elsewhere (e.g. the menus page): go straight to the table request.
  const wantsBook = params.has('book');
  useEffect(() => {
    if (!wantsBook) return;
    const t = window.setTimeout(() => bookRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 350);
    return () => window.clearTimeout(t);
  }, [wantsBook, venueId]);

  usePageTitle(venue ? `${venue.name}, ${venue.kicker}` : undefined);

  if (!venue) return <Navigate to="/venues" replace />;

  const week = Object.values(
    venue.events.reduce<Record<string, { days: number[]; event: (typeof venue.events)[number] }>>((acc, e) => {
      const k = `${e.title}|${e.detail}|${e.start}|${e.end}`;
      (acc[k] ??= { days: [], event: e }).days.push(e.day);
      return acc;
    }, {}),
  ).sort((a, b) => ((a.days[0] + 6) % 7) - ((b.days[0] + 6) % 7));
  const others = venues.filter((v) => v.id !== venue.id);
  const book = () => bookRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="themed grain" style={themeStyle(venue)} data-dark={isDark(venue)}>
      <section className="vhead">
        <div className="wrap">
          <div className="vhead__top">
            <Link to="/venues" className="type" style={{ fontSize: 14 }}>
              ← All four Joints
            </Link>
            <span className="type muted" style={{ fontSize: 14 }}>
              {venue.services.join(' · ')}
            </span>
          </div>
          <p className="eyebrow">{venue.kicker}</p>
          <motion.h1
            className="display vhead__name"
            style={{ fontSize: `clamp(44px, ${Math.min(19, 150 / Math.max(...venue.name.split(' ').map((w) => w.length)))}vw, 168px)` }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {venue.name}
          </motion.h1>
        </div>
      </section>

      <div className="wrap vgrid">
        <div>
          <p className="lede" style={{ marginTop: 0 }}>
            <strong>{venue.line}</strong>
          </p>
          {venue.blurb.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <ul className="highlights">
            {venue.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <TonightLine venue={venue} />
          <VenueFacts venue={venue} />
          <div className="actions">
            {venue.phone && (
              <a className="btn" href={`tel:${venue.phone.tel}`}>
                Call {venue.phone.display}
              </a>
            )}
            <a className="btn" href={mapsUrl(venue)} target="_blank" rel="noreferrer">
              Directions
            </a>
            {venue.order.map((o) => (
              <a key={o.href} className="btn" href={o.href} target="_blank" rel="noreferrer">
                Order on {o.label}
              </a>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gap: 26, alignContent: 'start' }}>
          <VenueShot venue={venue} eager />
          {venue.gettingThere && (
            <div>
              <h2 className="display" style={{ fontSize: 28 }}>
                Getting there
              </h2>
              {venue.gettingThere.map((g) => (
                <p key={g} style={{ margin: '8px 0 0' }}>
                  {g}
                </p>
              ))}
            </div>
          )}
          {venue.events.length > 0 && (
            <div>
              <h2 className="display" style={{ fontSize: 28, marginBottom: 6 }}>
                The week
              </h2>
              <ul className="week">
                {week.map(({ days, event: e }) => (
                  <li key={e.title + days.join()} data-today={days.includes(now.day)}>
                    <span className="week__day">{daysLabel(days)}</span>
                    <span>
                      <span className="week__what">{e.title}</span>
                      {e.start && e.end && ` ${prettyTime(e.start)}–${prettyTime(e.end)}`}
                      {e.detail && <span className="week__detail" style={{ display: 'block' }}>{e.detail}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <section className="section" style={{ paddingTop: 10 }} aria-labelledby="menus-h">
        <div className="wrap">
          <div className="section__head">
            <h2 className="display section__title" id="menus-h">
              {venue.menus.length ? 'On the menu' : 'At the huts'}
            </h2>
          </div>
          {venue.menus.length ? (
            <div className="routes">
              {venue.menus.map((m) => (
                <div className="route" key={m.id}>
                  <Link to={`/menus/${venue.id}?m=${m.id}`}>
                    <span className="route__title">{m.label}</span>
                    <span className="route__line">
                      {m.served && m.served !== m.label ? `${m.served} · ` : ''}
                      {m.sections.map((s) => s.title.toLowerCase()).join(', ')}
                    </span>
                    <span className="route__arrow" aria-hidden="true">
                      <ArrowIcon />
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="hays-offer" style={{ paddingTop: 0 }}>
              {[haysOffer.burgerHut, haysOffer.sweetHut].map((h) => (
                <div className="hut" key={h.title}>
                  <h3 className="display">{h.title}</h3>
                  {h.lines.map((l) => (
                    <p key={l}>{l}</p>
                  ))}
                </div>
              ))}
              <p className="type muted" style={{ fontSize: 14, margin: 0 }}>
                {haysOffer.note}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="section" ref={bookRef} id="book" style={{ scrollMarginTop: 70, paddingTop: 10 }} aria-labelledby="book-h">
        <div className="wrap vgrid" style={{ paddingTop: 0 }}>
          <div>
            <p className="eyebrow">{venue.booking.mode === 'walk-in' ? 'Walk in' : 'Table request'}</p>
            <h2 className="display section__title" id="book-h">
              {venue.booking.mode === 'walk-in' ? 'Bringing a crowd?' : `Book ${venue.name}`}
            </h2>
            <p className="muted">
              {venue.booking.mode === 'walk-in'
                ? 'No need to book for a burger. Groups of 10 to 15 can request a table.'
                : 'Tell us when and how many, and anything we should know.'}
            </p>
            <p style={{ marginTop: 20 }}>
              <Link className="textlink" to={`/hire?venue=${venue.id}`}>
                Private hire or Christmas at {venue.name}
              </Link>
            </p>
          </div>
          <TableRequest venue={venue} />
        </div>
      </section>

      {venue.photos.gallery.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }} aria-label={`${venue.name} photos`}>
          <div className="wrap">
            <Gallery shots={venue.photos.gallery} label={`${venue.name} photos`} />
            {(venue.id === 'bermondsey' || venue.id === 'hays') && (
              <p className="type muted" style={{ fontSize: 13, marginTop: 10 }}>
                Food photographed at Brixton and Greenwich.
              </p>
            )}
          </div>
        </section>
      )}

      <section className="section section--tight" aria-label="The other Joints" style={{ paddingBottom: 90 }}>
        <div className="wrap">
          <p className="eyebrow">No two are the same</p>
          <div className="routes">
            {others.map((o) => (
              <div className="route" key={o.id}>
                <Link to={`/${o.id}`}>
                  <span className="route__title">{o.name}</span>
                  <span className="route__line">{o.kicker}</span>
                  <span className="route__arrow" aria-hidden="true">
                    <ArrowIcon />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="actionbar-spacer" aria-hidden="true" />
      <ActionBar venue={venue} onBook={book} />
    </div>
  );
}
