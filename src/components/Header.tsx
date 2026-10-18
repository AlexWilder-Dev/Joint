import { Link, NavLink } from 'react-router-dom';
import { Logo } from './Logo';

export function Header() {
  return (
    <header className="site-header">
      <div className="wrap site-header__row">
        <Link to="/" className="site-header__logo" aria-label="The Joint, home">
          <Logo />
        </Link>
        <nav className="site-nav" aria-label="Main">
          <NavLink to="/venues">
            Venues
          </NavLink>
          <NavLink to="/menus">Menus</NavLink>
          <NavLink to="/hire">Hire &amp; Xmas</NavLink>
        </nav>
      </div>
    </header>
  );
}
