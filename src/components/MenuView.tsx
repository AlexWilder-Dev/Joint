import { Fragment, type ReactNode } from 'react';
import type { Diet, Menu, MenuItem, MenuSection } from '../data/joint';
import { Brush } from './Brush';

interface Props {
  menu: Menu;
  query: string;
  diet: Diet | null;
}

export const sectionId = (menu: Menu, s: MenuSection) =>
  `m-${menu.id}-${s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

function highlight(text: string, q: string): ReactNode {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {highlight(text.slice(i + q.length), q)}
    </>
  );
}

export function filterSections(menu: Menu, query: string, diet: Diet | null) {
  const q = query.trim().toLowerCase();
  const keep = (it: MenuItem) =>
    (!diet || it.diet?.includes(diet)) &&
    (!q || it.name.toLowerCase().includes(q) || (it.desc ?? '').toLowerCase().includes(q));
  return menu.sections
    .map((s) => ({ ...s, items: s.items.filter(keep) }))
    .filter((s) => s.items.length > 0);
}

const isCaps = (t: string) => t === t.toUpperCase();

/** A menu as real text, set the way the venue's own printed menu is set. */
export function MenuView({ menu, query, diet }: Props) {
  const sections = filterSections(menu, query, diet);
  const q = query.trim();
  return (
    <div className={`menu menu--${menu.style}`}>
      {menu.served && <p className="menu__served">{menu.served}</p>}
      {menu.style === 'sheet' && <p className="menu__served muted" style={{ fontWeight: 400 }}>Prices in £, as printed.</p>}
      {sections.length === 0 && <p className="menu__empty">Nothing on this menu matches “{q}”.</p>}
      {sections.map((s) => (
        <section key={s.title} id={sectionId(menu, s)} className="menu__section" aria-label={s.title}>
          <div className="menu__section-head">
            {menu.style === 'typewriter' && !isCaps(s.title) ? (
              <Brush as="h3">{s.title}</Brush>
            ) : (
              <h3 className={menu.style === 'typewriter' ? 'menu__section-title--caps' : 'menu__section-title'}>{s.title}</h3>
            )}
            {s.note && <span className="type muted" style={{ fontSize: 14 }}>{s.note}</span>}
          </div>
          <ul className={`menu__items ${s.items.length > 5 ? 'menu__items--two' : ''}`}>
            {s.items.map((it) => (
              <li className="menu__item" key={it.name + (it.price ?? '')}>
                <div className={`menu__line ${(it.price?.length ?? 0) > 11 ? 'menu__line--stack' : ''}`}>
                  <span className="menu__name">
                    {highlight(it.name, q)}
                    {it.diet?.map((d) => (
                      <Fragment key={d}>
                        <abbr className="menu__diet" title={d === 'v' ? 'Vegetarian' : 'Vegan'}>
                          {d}
                        </abbr>
                      </Fragment>
                    ))}
                  </span>
                  {it.price && (
                    <>
                      <span className="menu__leader" aria-hidden="true" />
                      <span className="menu__price">{it.price}</span>
                    </>
                  )}
                </div>
                {it.desc && <p className="menu__desc">{highlight(it.desc, q)}</p>}
              </li>
            ))}
          </ul>
        </section>
      ))}
      {menu.footnotes.map((f) => (
        <p className="menu__foot" key={f}>
          {f}
        </p>
      ))}
    </div>
  );
}
