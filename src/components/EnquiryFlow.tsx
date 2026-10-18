import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { brand, hire, venueById, type EnquiryType, type VenueId } from '../data/joint';
import { daysUntil, londonNow } from '../lib/time';
import { ArrowIcon } from './Icons';

const STEPS = ['What', 'Where & when', 'You', 'Sent'];

interface Props {
  initialType?: EnquiryType;
  initialVenue?: VenueId;
}

/** One flow for Christmas, private hire, corporate, food truck and office delivery. Front-end only. */
export function EnquiryFlow({ initialType, initialVenue }: Props) {
  const [step, setStep] = useState(initialType ? 1 : 0);
  const [type, setType] = useState<EnquiryType | undefined>(initialType);
  const [venue, setVenue] = useState<VenueId | undefined>(initialVenue);
  const [hireSize, setHireSize] = useState<'partial' | 'full'>('partial');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(20);
  const [eventPlace, setEventPlace] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const top = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = top.current;
    if (el && el.getBoundingClientRect().top < 60) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  useEffect(() => {
    if (initialType) {
      setType(initialType);
      setStep(1);
    }
  }, [initialType]);

  const now = londonNow();
  const xmasDays = daysUntil(hire.christmasOpens, now);
  const chosen = hire.types.find((t) => t.id === type);
  const isTruck = type === 'food-truck';
  const inbox = isTruck || !venue ? brand.generalEmail : venueById[venue].email;

  const next = (e?: FormEvent) => {
    e?.preventDefault();
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!isTruck && !venue) errs.venue = 'Pick a venue.';
      if (isTruck && !eventPlace.trim()) errs.place = 'Where is the event?';
    }
    if (step === 2) {
      if (!name.trim()) errs.name = 'Add your name.';
      if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Add an email we can reply to.';
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStep((s) => Math.min(3, s + 1));
  };

  const restart = () => {
    setStep(0);
    setType(undefined);
    setErrors({});
  };

  return (
    <div className="flow" ref={top} style={{ scrollMarginTop: 76 }}>
      <ol className="flow__steps" aria-label="Progress">
        {STEPS.map((s, i) => (
          <li key={s} data-state={i < step ? 'done' : i === step ? 'current' : 'todo'} aria-current={i === step ? 'step' : undefined}>
            {s}
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {step === 0 && (
            <div className="choices" role="group" aria-label="What are you planning?">
              {hire.types.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className="choice"
                  aria-pressed={type === t.id}
                  onClick={() => {
                    setType(t.id);
                    setStep(1);
                  }}
                >
                  <span className="choice__title">{t.title}</span>
                  {t.id === 'christmas' && (
                    <span className="choice__badge">{xmasDays > 0 ? `Opens 1 Nov` : 'Open now'}</span>
                  )}
                  <span className="choice__line">{t.line}</span>
                </button>
              ))}
            </div>
          )}

          {step === 1 && chosen && (
            <form className="form" onSubmit={next} noValidate>
              <h3 className="display" style={{ fontSize: 30, margin: 0 }}>
                {chosen.title}
              </h3>
              {type === 'christmas' && (
                <p style={{ margin: 0 }}>
                  {xmasDays > 0
                    ? `Christmas bookings open on 1 November, ${xmasDays} ${xmasDays === 1 ? 'day' : 'days'} from now. Ask now and your local Joint can send the Christmas brochure.`
                    : 'Christmas bookings are open. Ask your local Joint for the Christmas brochure.'}
                </p>
              )}
              {isTruck ? (
                <div className="field">
                  <label htmlFor="enq-place">Where’s the event?</label>
                  <input id="enq-place" value={eventPlace} onChange={(e) => setEventPlace(e.target.value)} placeholder="Town, venue or postcode" />
                  <span className="field__hint">The truck travels nationwide.</span>
                  {errors.place && <span className="field__error">{errors.place}</span>}
                </div>
              ) : (
                <fieldset className="field" style={{ border: 0, padding: 0, margin: 0 }}>
                  <legend>{type === 'office-delivery' ? 'Your nearest Joint' : 'Which Joint?'}</legend>
                  <div className="slots">
                    {chosen.venues.map((id) => (
                      <button key={id} type="button" className="slot" aria-pressed={venue === id} onClick={() => setVenue(id)}>
                        {venueById[id].hireName}
                      </button>
                    ))}
                  </div>
                  {errors.venue && <span className="field__error">{errors.venue}</span>}
                </fieldset>
              )}
              {type === 'private-hire' && (
                <div className="field">
                  <span style={{ fontFamily: 'var(--font-type)', fontWeight: 700, fontSize: 14 }}>How much of the place?</span>
                  <div className="seg" role="group" aria-label="Hire size">
                    <button type="button" aria-pressed={hireSize === 'partial'} onClick={() => setHireSize('partial')}>
                      A few tables
                    </button>
                    <button type="button" aria-pressed={hireSize === 'full'} onClick={() => setHireSize('full')}>
                      Full takeover
                    </button>
                  </div>
                </div>
              )}
              <div className="form__row">
                <div className="field">
                  <label htmlFor="enq-date">{type === 'office-delivery' ? 'Delivery date' : 'Date'}</label>
                  <input id="enq-date" type="date" min={now.date} value={date} onChange={(e) => setDate(e.target.value)} />
                  <span className="field__hint">Rough is fine.</span>
                </div>
                <div className="field">
                  <label htmlFor="enq-guests">{type === 'office-delivery' ? 'People to feed' : 'Guests'}</label>
                  <input
                    id="enq-guests"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={2000}
                    value={guests}
                    onChange={(e) => setGuests(Math.max(1, Number(e.target.value) || 1))}
                  />
                </div>
              </div>
              <div className="flow__nav">
                <button type="button" className="btn btn--small" onClick={() => setStep(0)}>
                  Back
                </button>
                <button type="submit" className="btn btn--solid">
                  Next <ArrowIcon />
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form className="form" onSubmit={next} noValidate>
              <div className="form__row">
                <div className="field">
                  <label htmlFor="enq-name">Your name</label>
                  <input id="enq-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
                  {errors.name && <span className="field__error">{errors.name}</span>}
                </div>
                <div className="field">
                  <label htmlFor="enq-company">Company (optional)</label>
                  <input id="enq-company" autoComplete="organization" value={company} onChange={(e) => setCompany(e.target.value)} />
                </div>
              </div>
              <div className="form__row">
                <div className="field">
                  <label htmlFor="enq-email">Email</label>
                  <input id="enq-email" type="email" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  {errors.email && <span className="field__error">{errors.email}</span>}
                </div>
                <div className="field">
                  <label htmlFor="enq-phone">Phone (optional)</label>
                  <input id="enq-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
              </div>
              <div className="field">
                <label htmlFor="enq-msg">Tell us about it</label>
                <textarea
                  id="enq-msg"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isTruck ? 'Wedding, launch, festival… numbers, timings, what you’d like served' : 'Budget, dietary requirements, timings'}
                />
              </div>
              <div className="flow__nav">
                <button type="button" className="btn btn--small" onClick={() => setStep(1)}>
                  Back
                </button>
                <button type="submit" className="btn btn--solid">
                  Send enquiry
                </button>
              </div>
            </form>
          )}

          {step === 3 && chosen && (
            <div className="confirm" role="status">
              <h3 className="display confirm__title">Got it, {name.trim().split(' ')[0]}.</h3>
              <dl>
                <dt>Enquiry</dt>
                <dd>
                  {chosen.title}
                  {type === 'private-hire' ? ` (${hireSize === 'full' ? 'full takeover' : 'a few tables'})` : ''}
                </dd>
                <dt>Where</dt>
                <dd>{isTruck ? eventPlace : venue ? venueById[venue].hireName : '—'}</dd>
                {date && (
                  <>
                    <dt>When</dt>
                    <dd>
                      {new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
                        new Date(`${date}T12:00:00Z`),
                      )}
                    </dd>
                  </>
                )}
                <dt>Guests</dt>
                <dd>{guests}</dd>
                {company && (
                  <>
                    <dt>Company</dt>
                    <dd>{company}</dd>
                  </>
                )}
                <dt>Reply to</dt>
                <dd>
                  {email}
                  {phone ? `, ${phone}` : ''}
                </dd>
              </dl>
              <p className="confirm__note">Demo site: nothing was sent. On the live site this lands in {inbox}.</p>
              <div>
                <button type="button" className="btn btn--small" onClick={restart}>
                  Start another
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
