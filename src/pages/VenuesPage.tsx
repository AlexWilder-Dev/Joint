import { VenuePanel } from '../components/VenuePanel';
import { VenueSwitch } from '../components/VenueSwitch';
import { brand } from '../data/joint';
import { usePageTitle } from '../lib/usePageTitle';

export function VenuesPage() {
  usePageTitle('Four Joints');
  return (
    <>
      <section className="fascia" aria-labelledby="venues-h">
        <div className="wrap">
          <p className="eyebrow" style={{ color: 'var(--pink)' }}>
            {brand.promise}
          </p>
          <h1 className="display" id="venues-h" style={{ fontSize: 'clamp(46px, 13vw, 110px)', margin: '0 0 22px' }}>
            Four Joints
          </h1>
          <VenueSwitch />
        </div>
      </section>
      <VenuePanel />
    </>
  );
}
