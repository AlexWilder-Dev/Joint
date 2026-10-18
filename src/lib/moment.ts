import type { VenueId } from '../data/joint';
import { londonNow, prettyTime } from './time';
import { GREENWICH_TERRACE, sunTimes } from './sun';

export interface Moment {
  venue: VenueId;
  text: string;
}

const countdown = (ms: number) => {
  const m = Math.max(1, Math.round(ms / 60000));
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  return m % 60 ? `${h}h ${m % 60}m` : `${h}h`;
};

/**
 * The Joint that makes most sense right now, in London, from facts in the data file:
 * sunset from the Greenwich roof, Thursday music, Live Music Fridays and DJ Saturdays in Bermondsey,
 * Brixton brunch (bottomless Sunday to Friday), Hays at lunchtime.
 */
export function momentFor(at: Date = new Date()): Moment | null {
  const now = londonNow(at);
  const t = now.minutes;
  const d = now.day;
  const weekday = d >= 1 && d <= 5;
  const sun = sunTimes(now.year, now.month, now.dayOfMonth, GREENWICH_TERRACE.lat, GREENWICH_TERRACE.lon);

  if (sun && at < sun.sunset && sun.sunset.getTime() - at.getTime() <= 150 * 60000 && t >= 8 * 60) {
    return {
      venue: 'greenwich',
      text: `Sunset over Canary Wharf in ${countdown(sun.sunset.getTime() - at.getTime())}, from the Greenwich roof terrace.`,
    };
  }
  if (t < 8 * 60 || t >= 23 * 60) return null;

  if (t < 11 * 60) {
    return weekday
      ? { venue: 'greenwich', text: `Breakfast buns at Greenwich till ${prettyTime('11:00')}, from 8am every day.` }
      : d === 0
        ? { venue: 'brixton', text: 'Sunday: bottomless brunch in Brixton, £35pp for 2 hours.' }
        : { venue: 'brixton', text: 'Saturday brunch in Brixton Village, where it all started.' };
  }
  if (t < 15 * 60) {
    if (weekday && t >= 12 * 60) {
      return { venue: 'hays', text: 'Lunch by London Bridge: the Burger Hut at Hays Galleria, grab and go.' };
    }
    return d === 6
      ? { venue: 'brixton', text: 'Saturday brunch in Brixton Village, where it all started.' }
      : { venue: 'brixton', text: 'Bottomless brunch in Brixton today, £35pp for 2 hours.' };
  }
  if (t >= 17 * 60) {
    if (d === 4 && t < 22 * 60) return { venue: 'greenwich', text: 'Thursday: live music on the Greenwich terrace, 7pm–10pm.' };
    if (d === 5 && t < 22 * 60 + 30) return { venue: 'bermondsey', text: 'Friday: Live Music Fridays at Bermondsey Bar & Kitchen.' };
    if (d === 6 && t < 22 * 60 + 30) return { venue: 'bermondsey', text: 'Saturday: DJ Saturdays at Bermondsey Bar & Kitchen.' };
    return { venue: 'greenwich', text: 'The Greenwich roof terrace is open till 11pm.' };
  }
  return { venue: 'brixton', text: 'Brixton Village: brunch, lunch and dinner, every day.' };
}
