import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState, type FormEvent } from 'react';
import type { Venue } from '../data/joint';
import { londonNow, prettyTime, rangeFor, toMinutes } from '../lib/time';

function slotsFor(venue: Venue, isoDate: string) {
  const block = venue.hours?.find((h) => h.label === 'Kitchen') ?? venue.hours?.[0];
  if (!block || !isoDate) return null;
  const day = new Date(`${isoDate}T12:00:00Z`).getUTCDay();
  const r = rangeFor(block, day);
  if (!r) return [];
  const out: string[] = [];
  for (let m = toMinutes(r.open); m <= toMinutes(r.close) - 60; m += 30) {
    out.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
  }
  return out;
}

const longDate = (iso: string) =>
  new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(
    new Date(`${iso}T12:00:00Z`),
  );

/** Table request for one venue. Front-end only: it shows what would be sent, and sends nothing. */
export function TableRequest({ venue }: { venue: Venue }) {
  const walkIn = venue.booking.mode === 'walk-in';
  const minPeople = venue.booking.mode === 'walk-in' ? venue.booking.groupMin : 1;
  const maxPeople = venue.booking.mode === 'walk-in' ? venue.booking.groupMax : 30;
  const today = londonNow().date;

  const [people, setPeople] = useState(walkIn ? minPeople : 2);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState('');
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);

  const slots = useMemo(() => {
    const all = slotsFor(venue, date);
    if (!all || date !== today) return all;
    const now = londonNow().minutes;
    return all.filter((s) => toMinutes(s) > now + 30);
  }, [venue, date, today]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!first.trim()) next.first = 'Add your first name.';
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Add an email we can reply to.';
    if (!date) next.date = 'Pick a date.';
    if (!time) next.time = slots && slots.length === 0 ? 'Closed that day: pick another date.' : 'Pick a time.';
    setErrors(next);
    if (Object.keys(next).length === 0) setSent(true);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      {sent ? (
        <motion.div
          key="sent"
          className="confirm"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          role="status"
        >
          <h3 className="display confirm__title">Request in, {first.trim()}.</h3>
          <dl>
            <dt>Where</dt>
            <dd>{venue.name}</dd>
            <dt>When</dt>
            <dd>
              {longDate(date)}, {prettyTime(time)}
            </dd>
            <dt>Who</dt>
            <dd>
              {people} {people === 1 ? 'person' : 'people'}
            </dd>
            <dt>Reply to</dt>
            <dd>{email}</dd>
            {message.trim() && (
              <>
                <dt>Note</dt>
                <dd>{message.trim()}</dd>
              </>
            )}
          </dl>
          <p className="confirm__note">
            Demo site: nothing was sent. On the live site this request goes to {venue.email}.
          </p>
          <div>
            <button type="button" className="btn btn--small" onClick={() => setSent(false)}>
              Change something
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.form key="form" className="form" onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {venue.booking.mode === 'request' && venue.booking.external && (
            <p style={{ margin: 0, fontSize: 15 }} className="muted">
              {venue.booking.note}{' '}
              <a href={venue.booking.external.href} target="_blank" rel="noreferrer">
                {venue.booking.external.label}
              </a>
              .
            </p>
          )}
          <div className="form__row">
            <div className="field">
              <label htmlFor={`${venue.id}-people`}>{walkIn ? 'Group size' : 'People'}</label>
              <div className="stepper">
                <button type="button" aria-label="Fewer people" onClick={() => setPeople((p) => Math.max(minPeople, p - 1))} disabled={people <= minPeople}>
                  –
                </button>
                <output id={`${venue.id}-people`} aria-live="polite">
                  {people}
                </output>
                <button type="button" aria-label="More people" onClick={() => setPeople((p) => Math.min(maxPeople, p + 1))} disabled={people >= maxPeople}>
                  +
                </button>
              </div>
            </div>
            <div className="field">
              <label htmlFor={`${venue.id}-date`}>Date</label>
              <input
                id={`${venue.id}-date`}
                type="date"
                min={today}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setTime('');
                }}
              />
              {errors.date && <span className="field__error">{errors.date}</span>}
            </div>
          </div>

          <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
            <legend>Time</legend>
            {slots === null ? (
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} aria-label="Time" />
            ) : slots.length === 0 ? (
              <span className="field__hint">{date === today ? 'No more tables today: pick another date.' : 'Closed that day.'}</span>
            ) : (
              <div className="slots">
                {slots.map((s) => (
                  <button type="button" key={s} className="slot" aria-pressed={time === s} onClick={() => setTime(s)}>
                    {prettyTime(s)}
                  </button>
                ))}
              </div>
            )}
            {errors.time && <span className="field__error">{errors.time}</span>}
          </fieldset>

          <div className="form__row">
            <div className="field">
              <label htmlFor={`${venue.id}-first`}>First name</label>
              <input id={`${venue.id}-first`} autoComplete="given-name" value={first} onChange={(e) => setFirst(e.target.value)} />
              {errors.first && <span className="field__error">{errors.first}</span>}
            </div>
            <div className="field">
              <label htmlFor={`${venue.id}-last`}>Last name</label>
              <input id={`${venue.id}-last`} autoComplete="family-name" value={last} onChange={(e) => setLast(e.target.value)} />
            </div>
          </div>
          <div className="field">
            <label htmlFor={`${venue.id}-email`}>Email</label>
            <input id={`${venue.id}-email`} type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            {errors.email && <span className="field__error">{errors.email}</span>}
          </div>
          <div className="field">
            <label htmlFor={`${venue.id}-msg`}>Anything else</label>
            <textarea id={`${venue.id}-msg`} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Birthdays, allergies, the match…" />
          </div>
          <div>
            <button type="submit" className="btn btn--solid">
              {walkIn ? 'Request a group table' : 'Request a table'}
            </button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
