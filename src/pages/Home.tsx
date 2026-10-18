import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Brush } from '../components/Brush';
import { Clip } from '../components/Clip';
import { Festoon } from '../components/Festoon';
import { ArrowIcon } from '../components/Icons';
import { Logo } from '../components/Logo';
import { LogoDraw, PIG_LANDS } from '../components/LogoDraw';
import { Photo } from '../components/Photo';
import { VenuePanel } from '../components/VenuePanel';
import { TypeOn } from '../components/TypeOn';
import { VenueSwitch } from '../components/VenueSwitch';
import { awards, brand, hire, instagramLines, monthlySpecial, occasions } from '../data/joint';
import { WOW } from '../lib/flags';
import { momentFor, type Moment } from '../lib/moment';
import { daysUntil } from '../lib/time';
import { useNow } from '../lib/useNow';
import { usePageTitle } from '../lib/usePageTitle';
import { useVenue } from '../lib/venue';

const OPENING_SEEN = 'joint:opening-seen';
const MOMENT_SHOWN = 'joint:moment-shown';
const OPENING_MS = 1750;

type Phase = 'playing' | 'skipped' | 'done';

/**
 * First visit only: the board's bulbs come on, the logo writes itself, the pig lands on the i and the sign types out.
 * Any tap or key skips it. Add ?intro to the home URL to see it again.
 */
function useOpening(): Phase {
  const reduce = useReducedMotion();
  const [params] = useSearchParams();
  const [phase, setPhase] = useState<Phase>(() => {
    if (!WOW || reduce) return 'done';
    if (params.has('intro')) return 'playing';
    try {
      return localStorage.getItem(OPENING_SEEN) ? 'done' : 'playing';
    } catch {
      return 'playing';
    }
  });
  useEffect(() => {
    if (phase !== 'playing') return;
    try {
      localStorage.setItem(OPENING_SEEN, '1');
    } catch {
      /* storage unavailable */
    }
    const end = window.setTimeout(() => setPhase('done'), OPENING_MS);
    const skip = () => setPhase((p) => (p === 'playing' ? 'skipped' : p));
    window.addEventListener('pointerdown', skip);
    window.addEventListener('keydown', skip);
    return () => {
      window.clearTimeout(end);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', skip);
    };
  }, [phase]);
  return phase;
}

/** After the opening, once per visit: move to the Joint that makes most sense right now. */
function useMoment(phase: Phase, setVenue: (id: Moment['venue']) => void) {
  const [params] = useSearchParams();
  const [moment, setMoment] = useState<Moment | null>(null);
  useEffect(() => {
    if (!WOW || phase === 'playing') return;
    let shown = false;
    try {
      shown = !!sessionStorage.getItem(MOMENT_SHOWN);
    } catch {
      /* storage unavailable */
    }
    if (shown && !params.has('intro')) return;
    const m = momentFor(new Date());
    if (!m) return;
    const t = window.setTimeout(() => {
      try {
        sessionStorage.setItem(MOMENT_SHOWN, '1');
      } catch {
        /* storage unavailable */
      }
      setVenue(m.venue);
      setMoment(m);
    }, 320);
    return () => window.clearTimeout(t);
  }, [phase]);
  return [moment, setMoment] as const;
}

/** Rises into place at the end of the opening; renders its children untouched otherwise. */
function Rise({ phase, delay, children }: { phase: Phase; delay: number; children: ReactNode }) {
  if (!WOW) return <>{children}</>;
  return (
    <motion.div
      key={phase === 'skipped' ? 'still' : 'in'}
      initial={phase === 'playing' ? { opacity: 0, y: 16 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function MomentLine({ moment }: { moment: Moment }) {
  const live = momentFor(useNow());
  const text = live && live.venue === moment.venue ? live.text : moment.text;
  return (
    <motion.p className="moment" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} role="status">
      <span className="moment__label">Right now</span>
      <span>{text}</span>
    </motion.p>
  );
}

export function Home() {
  // A fresh mount when the query changes, so /#/?intro replays the opening on an already-open page.
  const { search } = useLocation();
  return <HomeContent key={search} />;
}

function HomeContent() {
  usePageTitle();
  const { venue, setVenue } = useVenue();
  const panelRef = useRef<HTMLDivElement>(null);
  const [why, setWhy] = useState<string | null>(null);
  const xmasDays = daysUntil(hire.christmasOpens);
  const phase = useOpening();
  const playing = phase === 'playing';
  const [moment, setMoment] = useMoment(phase, setVenue);

  const reveal = () => {
    if (window.matchMedia('(max-width: 899px)').matches) {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <section className="fascia" aria-labelledby="promise">
        <div className="wrap">
          {WOW ? (
            <div className="fascia__board fascia__board--lit" key={phase === 'skipped' ? 'still' : 'in'}>
              <Festoon play={playing} />
              <div className="fascia__logo">
                <LogoDraw play={playing} />
              </div>
              <p className="fascia__sign">
                <TypeOn text={brand.tagline} play={playing} startAt={PIG_LANDS + 0.05} />
              </p>
            </div>
          ) : (
            <div className="fascia__board">
              <motion.div
                className="fascia__logo"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Logo />
              </motion.div>
              <p className="fascia__sign">{brand.tagline}</p>
            </div>
          )}
          <Rise phase={phase} delay={1.0}>
          <div className="fascia__intro">
          <h1 className="fascia__promise" id="promise">
            No two Joint locations are <em>the same.</em>
          </h1>
          <p className="fascia__sub">
            Four in London since the {brand.founded} pop-up in Brixton. A market brunch spot, a roof bar at a golf range, the
            kitchen in a Bermondsey bar, and a burger hut by the river. Pick yours.
          </p>
          </div>
          </Rise>

          <Rise phase={phase} delay={1.2}>
          <div className="chips" role="group" aria-label="I’m after…" style={{ paddingTop: 0, paddingBottom: 14 }}>
            <span className="type" style={{ flex: 'none', alignSelf: 'center', fontSize: 14, color: '#cfc8ba' }}>
              I’m after:
            </span>
            {occasions.map((o) => (
              <button
                key={o.label}
                type="button"
                className="chip"
                style={{ borderColor: 'rgba(244,238,226,.35)', color: 'var(--cream)' }}
                onClick={() => {
                  setVenue(o.venue);
                  setWhy(o.why);
                  setMoment(null);
                  reveal();
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
          <VenueSwitch
            onPick={() => {
              setWhy(null);
              setMoment(null);
            }}
          />
          </Rise>
          {WOW && !why && moment && moment.venue === venue.id && <MomentLine moment={moment} />}
          {why && (
            <motion.p
              key={why}
              className="type"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ margin: '-6px 0 0', paddingBottom: 18, color: 'var(--pink)' }}
              role="status"
            >
              {why}
            </motion.p>
          )}
        </div>
      </section>

      <div ref={panelRef} style={{ scrollMarginTop: 60 }}>
        <VenuePanel />
      </div>

      <section className="section special grain" aria-labelledby="special">
        <div className="wrap">
          <div className="special__card">
            <div>
              <Brush large as="p">
                {monthlySpecial.label}
              </Brush>
              <h2 className="display special__name" id="special" style={{ marginTop: 18 }}>
                {monthlySpecial.name}
              </h2>
            </div>
            <div style={{ display: 'grid', gap: 16 }}>
              <p className="special__desc">{monthlySpecial.desc}</p>
              <ul className="special__parts" aria-label="What’s in it">
                {['2 × 4oz patties', 'mustard-seared', 'American cheese', 'dill pickles', 'sesame brioche'].map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section dark grain" aria-labelledby="receipts">
        <div className="wrap">
          <div className="section__head">
            <p className="eyebrow">Awards, press, telly</p>
            <h2 className="display section__title" id="receipts">
              The receipts
            </h2>
          </div>
          <ul className="ledger">
            {awards.verified.map((a) => (
              <li key={a.title}>
                <span>
                  <span className="ledger__what">{a.title}</span>
                  <br />
                  {a.detail}
                </span>
                <a className="ledger__tag ledger__tag--ok" href={a.href} target="_blank" rel="noreferrer">
                  On the record
                </a>
              </li>
            ))}
            {awards.claims.map((c) => (
              <li key={c}>
                <span className="ledger__what">{c}</span>
                <span className="ledger__tag">Award</span>
              </li>
            ))}
            <li>
              <span>
                Seen on <span className="ledger__what">{awards.tv}</span>
              </span>
              <span className="ledger__tag">TV</span>
            </li>
            <li>
              <span>
                Read about us in <span className="ledger__what">{awards.press.join(', ').replace(/, ([^,]*)$/, ' and $1')}</span>
              </span>
              <span className="ledger__tag">Press</span>
            </li>
          </ul>

          <div className="quotes" style={{ marginTop: 34 }} aria-label="What they wrote">
            {awards.quotes.map((q) => (
              <figure className="quote" key={q.text}>
                <blockquote>“{q.text}”</blockquote>
                <figcaption>
                  <a href={q.href} target="_blank" rel="noreferrer">
                    {q.who}
                  </a>
                  , {q.when}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="section grain" aria-labelledby="story">
        <div className="wrap story">
          <figure className="shot shot--clip" style={{ maxWidth: 420, transform: 'rotate(1.4deg)' }}>
            <Clip />
            <Photo slug="brixton-sign" alt="The Joint’s round sign under the 6th Avenue street sign in Brixton Village" sizes="(min-width: 900px) 420px, 90vw" />
            <figcaption>Brixton Village, where it started</figcaption>
          </figure>
          <div>
            <p className="eyebrow">Since {brand.founded}</p>
            <h2 className="display section__title" id="story">
              The pop-up that stayed
            </h2>
            {brand.about.map((p) => (
              <p className="lede" key={p}>
                {p}
              </p>
            ))}
            <ul className="formula" aria-label="The formula">
              {brand.formula.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section themed" style={{ ['--bg' as string]: '#fbf8f2' }} aria-labelledby="bring">
        <div className="wrap">
          <div className="section__head">
            <p className="eyebrow">Christmas, hire, catering</p>
            <h2 className="display section__title" id="bring">
              We’ll bring the burgers
            </h2>
          </div>
          <div className="countdown">
            <span className="countdown__num">{xmasDays > 0 ? xmasDays : 'Open'}</span>
            <p className="countdown__text">
              <strong>{xmasDays > 0 ? `${xmasDays === 1 ? 'Day' : 'Days'} till Christmas bookings open` : 'Christmas bookings are open'}</strong>
              {xmasDays > 0 ? 'Bookings open 1 November. Request the Christmas brochure now.' : 'Ask your local Joint for the Christmas brochure.'}
            </p>
          </div>
          <ul className="routes">
            {hire.types.map((t) => (
              <li className="route" key={t.id}>
                <Link to={`/hire/${t.id}`}>
                  <span className="route__title">
                    {t.title}
                    {t.id === 'christmas' && xmasDays > 0 && <span className="route__badge">1 Nov</span>}
                  </span>
                  <span className="route__line">{t.line}</span>
                  <span className="route__arrow" aria-hidden="true">
                    <ArrowIcon />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="truck">
            <p className="eyebrow" style={{ margin: 0 }}>
              The food truck has done
            </p>
            <ul className="truck__list">
              {hire.events.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--tight grain" aria-labelledby="insta">
        <div className="wrap">
          <div className="section__head">
            <p className="eyebrow">In our own words</p>
            <h2 className="display" id="insta" style={{ fontSize: 'clamp(30px, 7vw, 48px)' }}>
              Lately on <a href={brand.instagram} target="_blank" rel="noreferrer">@thejointldn</a>
            </h2>
          </div>
          <div className="insta">
            {instagramLines.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                <p>{l.text}</p>
                <span>{l.date}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
