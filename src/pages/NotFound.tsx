import { Link } from 'react-router-dom';
import { Pig } from '../components/Pig';
import { usePageTitle } from '../lib/usePageTitle';

export function NotFound() {
  usePageTitle('Page not found');
  return (
    <div className="wrap notfound">
      <div style={{ width: 120 }}>
        <Pig />
      </div>
      <h1 className="display" style={{ fontSize: 'clamp(40px, 12vw, 90px)' }}>
        Wrong turn in the market
      </h1>
      <div className="actions" style={{ marginTop: 0 }}>
        <Link className="btn btn--solid" to="/">
          Back to The Joint
        </Link>
        <Link className="btn" to="/menus">
          Menus
        </Link>
        <Link className="btn" to="/venues">
          All four Joints
        </Link>
      </div>
    </div>
  );
}
