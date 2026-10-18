import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { isDark, mapsUrl, themeStyle, useVenue } from '../lib/venue';
import { PhoneIcon, PinIcon } from './Icons';
import { TonightLine } from './TonightLine';
import { VenueFacts } from './VenueFacts';
import { VenueShot } from './VenueShot';

/** The picked venue, in its own colours: tonight, hours, how to reach it, where to go next. */
export function VenuePanel() {
  const { venue } = useVenue();
  return (
    <section
      className="panel themed grain"
      style={themeStyle(venue)}
      data-dark={isDark(venue)}
      aria-labelledby="panel-name"
    >
      <div className="wrap">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={venue.id}
            className="panel__grid"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <p className="eyebrow">{venue.kicker}</p>
              <h2 className="display panel__name" id="panel-name">
                {venue.name}
              </h2>
              <p className="panel__line">{venue.line}</p>
              <TonightLine venue={venue} />
              <VenueFacts venue={venue} />
              <div className="actions">
                {venue.phone && (
                  <a className="btn" href={`tel:${venue.phone.tel}`}>
                    <PhoneIcon /> Call
                  </a>
                )}
                <a className="btn" href={mapsUrl(venue)} target="_blank" rel="noreferrer">
                  <PinIcon /> Directions
                </a>
                <Link className="btn btn--solid" to={`/${venue.id}`}>
                  {venue.booking.mode === 'walk-in' ? 'Walk-in & groups' : 'Book a table'}
                </Link>
              </div>
            </div>
            <div style={{ display: 'grid', gap: 22 }}>
              <VenueShot venue={venue} />
              <p style={{ margin: 0 }}>
                <Link className="textlink" to={`/menus/${venue.id}`}>
                  {venue.menus.length ? `${venue.name} menus` : 'What’s at the huts'}
                </Link>
                <span aria-hidden="true"> &nbsp; </span>
                <Link className="textlink" to={`/${venue.id}`}>
                  All about {venue.name}
                </Link>
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
