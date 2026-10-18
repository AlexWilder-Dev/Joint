import { Link } from 'react-router-dom';
import { brand, venues } from '../data/joint';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="site-footer__logo">
          <Logo />
        </div>
        <p className="type" style={{ marginTop: 12 }}>
          {brand.tagline}
        </p>
        <div className="site-footer__grid">
          {venues.map((v) => (
            <div key={v.id}>
              <h3>
                <Link to={`/${v.id}`} style={{ textDecoration: 'none' }}>
                  {v.name}
                </Link>
              </h3>
              <address>
                <ul>
                  <li>{v.address[v.address.length - 1].replace('London ', '')}</li>
                  {v.phone && (
                    <li>
                      <a href={`tel:${v.phone.tel}`}>{v.phone.display}</a>
                    </li>
                  )}
                  <li>
                    <a href={`mailto:${v.email}`}>{v.email}</a>
                  </li>
                </ul>
              </address>
            </div>
          ))}
        </div>
        <div className="site-footer__grid">
          <div>
            <h3>Food truck &amp; events</h3>
            <p>
              <a href={`mailto:${brand.generalEmail}`}>{brand.generalEmail}</a>
            </p>
          </div>
          <div>
            <h3>Follow</h3>
            <ul>
              <li>
                <a href={brand.instagram} target="_blank" rel="noreferrer">
                  Instagram @thejointldn
                </a>
              </li>
              <li>
                <a href={brand.tiktok} target="_blank" rel="noreferrer">
                  TikTok @thejointldn
                </a>
              </li>
              <li>
                <a href={brand.x} target="_blank" rel="noreferrer">
                  X @thejointldn
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3>Work with us</h3>
            <p>
              <a href="https://thejointldn.com/job/" target="_blank" rel="noreferrer">
                Job enquiry form
              </a>
            </p>
          </div>
        </div>
        <div className="site-footer__base">
          <span>© {new Date().getFullYear()} The Joint. Since {brand.founded}.</span>
          <span>Site by AlexWilder-Dev</span>
        </div>
      </div>
    </footer>
  );
}
