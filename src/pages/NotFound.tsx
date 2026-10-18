import { Link } from 'react-router-dom';
import { Pig } from '../components/Pig';

export function NotFound() {
  return (
    <div className="wrap notfound">
      <div style={{ width: 120 }}>
        <Pig />
      </div>
      <h1 className="display" style={{ fontSize: 'clamp(40px, 12vw, 90px)' }}>
        Wrong turn in the market
      </h1>
      <Link className="btn btn--solid" to="/">
        Back to The Joint
      </Link>
    </div>
  );
}
