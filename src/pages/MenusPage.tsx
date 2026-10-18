import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { MenuView, filterSections, sectionId } from '../components/MenuView';
import { SearchIcon } from '../components/Icons';
import { haysOffer, venueById, venues, type VenueId } from '../data/joint';
import { isDark, themeStyle, useVenue } from '../lib/venue';

export function MenusPage() {
  const { venueId } = useParams();
  const { venue: picked, setVenue } = useVenue();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [veggie, setVeggie] = useState(false);

  const venue = venueId && venueId in venueById ? venueById[venueId as VenueId] : undefined;

  useEffect(() => {
    if (venue) setVenue(venue.id);
  }, [venue, setVenue]);

  useEffect(() => {
    if (venue) document.title = `Menus, The Joint ${venue.name}`;
  }, [venue]);

  const menu = useMemo(() => {
    if (!venue || !venue.menus.length) return undefined;
    return venue.menus.find((m) => m.id === params.get('m')) ?? venue.menus[0];
  }, [venue, params]);

  if (!venueId) return <Navigate to={`/menus/${picked.id}`} replace />;
  if (!venue) return <Navigate to="/menus" replace />;

  const hasDiet = menu?.sections.some((s) => s.items.some((i) => i.diet?.length));
  const visible = menu ? filterSections(menu, query, veggie && !!hasDiet) : [];

  return (
    <div className="themed grain" style={themeStyle(venue)} data-dark={isDark(venue)}>
      <div className="wrap" style={{ paddingTop: 26 }}>
        <p className="eyebrow">Menus, as real text</p>
        <h1 className="display" style={{ fontSize: 'clamp(48px, 14vw, 110px)', marginBottom: 8 }}>
          {venue.name}
        </h1>
      </div>

      <div className="wrap menu-pre">
        <nav className="chips" aria-label="Venue">
          {venues.map((v) => (
            <Link key={v.id} to={`/menus/${v.id}`} className="chip chip--venue" aria-current={v.id === venue.id}>
              {v.name}
            </Link>
          ))}
        </nav>
        {menu && (
          <div className="menu-tools">
            <label className="search">
              <SearchIcon />
              <span className="sr-only">Find a dish</span>
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Find a dish, a sauce, a drink" />
            </label>
            {hasDiet && (
              <label className="toggle">
                <input type="checkbox" checked={veggie} onChange={(e) => setVeggie(e.target.checked)} />
                Veggie
              </label>
            )}
          </div>
        )}
      </div>

      {menu && (
        <div className="menu-top">
          <div className="wrap">
            {venue.menus.length > 1 && (
              <div className="chips" role="group" aria-label="Menu">
                {venue.menus.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className="chip chip--venue"
                    aria-pressed={m.id === menu.id}
                    onClick={() => {
                      setParams({ m: m.id }, { replace: true });
                      setQuery('');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            )}
            {visible.length > 1 && (
              <div className="chips" style={{ paddingTop: venue.menus.length > 1 ? 0 : 10 }} aria-label="Jump to">
                {visible.map((s) => (
                  <a
                    key={s.title}
                    className="chip"
                    href={`#${sectionId(menu, s)}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(sectionId(menu, s))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    {s.title.charAt(0).toUpperCase() + s.title.slice(1).toLowerCase()}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="wrap">
        {menu ? (
          <>
            <MenuView menu={menu} query={query} veggieOnly={veggie && !!hasDiet} />
            <p className="menu__source" style={{ marginTop: -40, paddingBottom: 60 }}>
              Transcribed from the {venue.name} menu on thejointldn.com. Prices and availability can change; ask your server.
            </p>
          </>
        ) : (
          <div className="hays-offer">
            {[haysOffer.burgerHut, haysOffer.sweetHut].map((h) => (
              <div className="hut" key={h.title}>
                <h2 className="display">{h.title}</h2>
                {h.lines.map((l) => (
                  <p key={l}>{l}</p>
                ))}
              </div>
            ))}
            <p className="type muted" style={{ fontSize: 14, margin: 0 }}>
              {haysOffer.note} Open 12pm–9pm daily.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
