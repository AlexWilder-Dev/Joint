import { useEffect } from 'react';
import { VenuePanel } from '../components/VenuePanel';
import { VenueSwitch } from '../components/VenueSwitch';
import { brand } from '../data/joint';

export function VenuesPage() {
  useEffect(() => {
    document.title = 'Four Joints | The Joint London';
  }, []);
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
