import type { Venue } from '../data/joint';
import { describeOpen, dayLabel, londonNow, nextEvent, openState, prettyTime } from './time';
import { GREENWICH_TERRACE, londonClock, sunTimes } from './sun';

export interface Tonight {
  label: string;
  main: string;
  sub?: string;
  /** one short line for the venue switch */
  short: string;
  live: boolean;
  sun?: { sunrise: Date; sunset: Date; now: Date };
}

function countdown(ms: number) {
  const mins = Math.max(0, Math.round(ms / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m} min`;
  return m ? `${h}h ${m}m` : `${h}h`;
}

/** What's worth knowing about a venue right now, worked out in the browser from the data file. */
export function tonightFor(v: Venue, at: Date = new Date()): Tonight {
  const now = londonNow(at);
  const label = `${now.minutes >= 17 * 60 ? 'Tonight' : 'Today'} at ${v.name}`;
  const main = v.hours?.[0];
  const open = main ? openState(main, now) : undefined;
  const openText = open ? describeOpen(open, now.day) : undefined;
  const live = open?.kind === 'open';

  if (v.id === 'brixton') {
    const bottomless = v.events.find((e) => e.day === now.day);
    if (bottomless) {
      return {
        label,
        main: 'Bottomless brunch today',
        sub: '£35pp for 2 hours, Sunday to Friday. Food must be ordered separate.',
        short: 'Bottomless brunch today',
        live: false,
      };
    }
    return {
      label,
      main: 'No bottomless today',
      sub: 'It runs Sunday to Friday, £35pp for 2 hours. Back tomorrow. Brunch, lunch and dinner as usual.',
      short: 'Brunch, lunch & dinner daily',
      live: false,
    };
  }

  if (v.id === 'greenwich') {
    const times = sunTimes(now.year, now.month, now.dayOfMonth, GREENWICH_TERRACE.lat, GREENWICH_TERRACE.lon);
    const music = nextEvent(v.events, now);
    const musicText = music
      ? music.inDays === 0
        ? `Live music tonight, ${prettyTime(music.event.start!)}–${prettyTime(music.event.end!)}: ${music.event.detail}.`
        : `Live music ${music.inDays === 1 ? 'tomorrow' : dayLabel(music.inDays, now)}, ${prettyTime(music.event.start!)}–${prettyTime(music.event.end!)}.`
      : undefined;
    if (times && at < times.sunset) {
      const clock = londonClock(times.sunset);
      return {
        label,
        main: `Sunset ${clock} over Canary Wharf`,
        sub: [`That’s ${countdown(times.sunset.getTime() - at.getTime())} from now, from the roof terrace.`, musicText]
          .filter(Boolean)
          .join(' '),
        short: `Sunset ${clock} from the roof`,
        live,
        sun: { ...times, now: at },
      };
    }
    return {
      label,
      main: live ? `Sun’s down. ${openText}` : openText ?? 'Roof terrace and patio',
      sub: [times ? `It set at ${londonClock(times.sunset)}.` : undefined, musicText].filter(Boolean).join(' '),
      short: music?.inDays === 0 ? 'Live music tonight' : openText ?? '',
      live,
      sun: times ? { ...times, now: at } : undefined,
    };
  }

  if (v.id === 'bermondsey') {
    const kitchen = v.hours?.find((h) => h.label === 'Kitchen');
    const kitchenText = kitchen ? describeOpen(openState(kitchen, now), now.day).replace(/^Open now/, 'Kitchen open') : '';
    const ev = v.events.find((e) => e.day === now.day);
    if (ev) {
      return {
        label,
        main: ev.day === 5 ? 'Live music tonight' : 'DJ tonight',
        sub: `${ev.detail} at Bermondsey Bar & Kitchen. ${kitchenText}.`,
        short: ev.day === 5 ? 'Live music tonight' : 'DJ Saturday',
        live,
      };
    }
    return {
      label,
      main: openText ?? 'Open daily',
      sub: `${kitchenText}. Live music Fridays, DJs Saturdays, the big games on two giant screens.`,
      short: openText ?? 'Open daily',
      live,
    };
  }

  // Hays Galleria
  const hutText = open ? describeOpen(open, now.day).replace(/^Open now/, 'Burger Hut open') : '';
  return {
    label,
    main: hutText,
    sub: 'The Sweet Hut keeps the same hours: churros and mini pancakes. Walk in and order by QR from your table.',
    short: open?.kind === 'open' ? `Open now, till ${prettyTime(open.until)}` : hutText,
    live,
  };
}
