import { useParams, useSearchParams } from 'react-router-dom';
import { EnquiryFlow } from '../components/EnquiryFlow';
import { Photo } from '../components/Photo';
import { brand, hire, venueById, type EnquiryType, type VenueId } from '../data/joint';
import { daysUntil } from '../lib/time';
import { usePageTitle } from '../lib/usePageTitle';

export function HirePage() {
  const { type } = useParams();
  const [params] = useSearchParams();
  const initialType = hire.types.some((t) => t.id === type) ? (type as EnquiryType) : undefined;
  const v = params.get('venue');
  const initialVenue = v && v in venueById ? (v as VenueId) : undefined;
  const xmasDays = daysUntil(hire.christmasOpens);

  usePageTitle('Christmas, private hire, events & the food truck');

  return (
    <div className="grain">
      <section className="hire-hero">
        <div className="wrap">
          <p className="eyebrow">Christmas, hire, corporate, catering</p>
          <h1 className="display" style={{ fontSize: 'clamp(46px, 13vw, 112px)' }}>
            Planning something?
          </h1>
          <p className="lede">
            {xmasDays > 0
              ? `Christmas bookings open 1 November (${xmasDays} ${xmasDays === 1 ? 'day' : 'days'} to go). `
              : 'Christmas bookings are open. '}
            Private hire, office parties, weddings and the food truck all start here. One enquiry, sent to the right Joint.
          </p>
        </div>
      </section>
      <div className="wrap hire-grid">
        <EnquiryFlow key={`${initialType}-${initialVenue}`} initialType={initialType} initialVenue={initialVenue} />
        <aside className="hire-aside" aria-label="Good to know">
          <figure className="shot shot--wide" style={{ margin: 0 }}>
            <Photo slug="gw-music" alt="Live acoustic set on the Greenwich terrace, a full crowd at the tables" sizes="(min-width: 960px) 40vw, 100vw" />
            <figcaption>Greenwich roof terrace on a live music night</figcaption>
          </figure>
          <div>
            <h2 className="display" style={{ fontSize: 26 }}>
              Where the truck has been
            </h2>
            <p style={{ margin: '6px 0 0' }}>{hire.events.join(', ')}.</p>
          </div>
          <div>
            <h2 className="display" style={{ fontSize: 26 }}>
              What it does
            </h2>
            <p style={{ margin: '6px 0 0' }}>{hire.occasions.join(', ')}.</p>
          </div>
          <div>
            <h2 className="display" style={{ fontSize: 26 }}>
              Rather email?
            </h2>
            <p style={{ margin: '6px 0 0' }}>
              Food truck and events: <a href={`mailto:${brand.generalEmail}`}>{brand.generalEmail}</a>
              <br />
              Venues:{' '}
              {Object.values(venueById).map((x, i, all) => (
                <span key={x.id}>
                  <a href={`mailto:${x.email}`}>{x.email}</a>
                  {i < all.length - 1 ? ', ' : ''}
                </span>
              ))}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
