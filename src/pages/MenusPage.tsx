import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ActionBar } from '../components/ActionBar';
import { MenuView, filterSections, sectionId } from '../components/MenuView';
import { SearchIcon } from '../components/Icons';
import { haysOffer, venueById, venues, type Diet, type VenueId } from '../data/joint';
import { usePageTitle } from '../lib/usePageTitle';
import { isDark, themeStyle, useVenue } from '../lib/venue';

export function MenusPage() {
  const { venueId } = useParams();
  const { venue: picked, setVenue } = useVenue();
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [diet, setDiet] = useState<Diet | null>(null);
  const [active, setActive] = useState<string | null>(null);
  const jumpRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const venue = venueId && venueId in venueById ? venueById[venueId as VenueId] : undefined;

  useEffect(() => {
    if (venue) setVenue(venue.id);
  }, [venue, setVenue]);

  usePageTitle(venue ? `${venue.name} menus` : 'Menus');

  const menu = useMemo(() => {
    if (!venue || !venue.menus.length) return undefined;
    return venue.menus.find((m) => m.id === params.get('m')) ?? venue.menus[0];
  }, [venue, params]);

  const has = (d: Diet) => !!menu?.sections.some((s) => s.items.some((i) => i.diet?.includes(d)));
  const visible = menu ? filterSections(menu, query, diet) : [];
  const filtering = !!query.trim() || !!diet;
  const visibleKey = visible.map((s) => s.title).join('|');

  // Light up the chip for the section you're reading, and keep it in view in the chip row.
  useEffect(() => {
    if (!menu) return;
    const els = visible.map((s) => document.getElementById(sectionId(menu, s))).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const seen = new Map<string, boolean>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting));
        const first = els.find((el) => seen.get(el.id));
        if (first) setActive(first.id);
      },
      { rootMargin: '-180px 0px -45% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // visibleKey stands in for the visible sections
  }, [menu, visibleKey]);

  useEffect(() => {
    const row = jumpRef.current;
    const chip = row?.querySelector<HTMLElement>('[aria-current="true"]');
    if (row && chip) row.scrollTo({ left: chip.offsetLeft - 16, behavior: 'smooth' });
  }, [active]);

  if (!venueId) return <Navigate to={`/menus/${picked.id}`} replace />;
  if (!venue) return <Navigate to="/menus" replace />;

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
            {has('v') && (
              <label className="toggle">
                <input type="checkbox" checked={diet === 'v'} onChange={(e) => setDiet(e.target.checked ? 'v' : null)} />
                Veggie
              </label>
            )}
            {has('vg') && (
              <label className="toggle">
                <input type="checkbox" checked={diet === 'vg'} onChange={(e) => setDiet(e.target.checked ? 'vg' : null)} />
                Vegan
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
                      setDiet(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            )}
            {visible.length > 1 && (
              <div className="chips" ref={jumpRef} style={{ paddingTop: venue.menus.length > 1 ? 0 : 10 }} aria-label="Jump to">
                {visible.map((s) => (
                  <a
                    key={s.title}
                    className="chip"
                    aria-current={active === sectionId(menu, s) ? 'true' : undefined}
                    href={`#${sectionId(menu, s)}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(sectionId(menu, s))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    {s.title.charAt(0).toUpperCase() + s.title.slice(1).toLowerCase()}
                    {filtering && <span className="chip__count"> {s.items.length}</span>}
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
            <MenuView menu={menu} query={query} diet={diet} />
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
      <div className="actionbar-spacer" aria-hidden="true" />
      <ActionBar venue={venue} onBook={() => navigate(`/${venue.id}?book`)} />
    </div>
  );
}
