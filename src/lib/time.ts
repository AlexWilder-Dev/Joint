import type { HoursBlock, HoursRange, WeeklyEvent } from '../data/joint';

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface LondonNow {
  day: number;
  minutes: number;
  /** yyyy-mm-dd in London */
  date: string;
  year: number;
  month: number;
  dayOfMonth: number;
}

/** Wall-clock time in London, whatever the viewer's own time zone. */
export function londonNow(at: Date = new Date()): LondonNow {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(at);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const year = Number(get('year'));
  const month = Number(get('month'));
  const dayOfMonth = Number(get('day'));
  return {
    day: DAY_SHORT.indexOf(get('weekday')),
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
    date: `${get('year')}-${get('month')}-${get('day')}`,
    year,
    month,
    dayOfMonth,
  };
}

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/** "23:00" -> "11pm", "22:30" -> "10:30pm", "12:00" -> "12pm" */
export function prettyTime(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 && h < 24 ? 'pm' : 'am';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return m ? `${h12}:${String(m).padStart(2, '0')}${suffix}` : `${h12}${suffix}`;
}

export function rangeFor(block: HoursBlock, day: number): HoursRange | undefined {
  return block.ranges.find((r) => r.days.includes(day));
}

export type OpenState =
  | { kind: 'open'; until: string }
  | { kind: 'later'; opens: string }
  | { kind: 'closed'; next?: { day: number; opens: string } };

export function openState(block: HoursBlock, now: LondonNow = londonNow()): OpenState {
  const today = rangeFor(block, now.day);
  if (today) {
    const o = toMinutes(today.open);
    const c = toMinutes(today.close);
    if (now.minutes >= o && now.minutes < c) return { kind: 'open', until: today.close };
    if (now.minutes < o) return { kind: 'later', opens: today.open };
  }
  for (let i = 1; i <= 7; i++) {
    const d = (now.day + i) % 7;
    const r = rangeFor(block, d);
    if (r) return { kind: 'closed', next: { day: d, opens: r.open } };
  }
  return { kind: 'closed' };
}

export function describeOpen(state: OpenState, nowDay: number) {
  if (state.kind === 'open') return `Open now, till ${prettyTime(state.until)}`;
  if (state.kind === 'later') return `Opens ${prettyTime(state.opens)} today`;
  if (state.next) {
    const when = state.next.day === (nowDay + 1) % 7 ? 'tomorrow' : DAY_NAMES[state.next.day];
    return `Closed now, opens ${prettyTime(state.next.opens)} ${when}`;
  }
  return 'Closed';
}

/** Collapse ranges into readable rows: "Mon–Wed  12pm–10:30pm". */
export function hoursRows(block: HoursBlock) {
  const order = [1, 2, 3, 4, 5, 6, 0];
  return block.ranges
    .map((r) => {
      const sorted = order.filter((d) => r.days.includes(d));
      let label: string;
      if (sorted.length === 7) label = 'Every day';
      else if (sorted.length === 1) label = DAY_SHORT[sorted[0]];
      else {
        const idx = sorted.map((d) => order.indexOf(d));
        const contiguous = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
        label = contiguous
          ? `${DAY_SHORT[sorted[0]]}–${DAY_SHORT[sorted[sorted.length - 1]]}`
          : sorted.map((d) => DAY_SHORT[d]).join(', ');
      }
      return { label, time: `${prettyTime(r.open)}–${prettyTime(r.close)}`, days: r.days, first: order.indexOf(sorted[0]) };
    })
    .sort((a, b) => a.first - b.first);
}

export function nextEvent(events: WeeklyEvent[], now: LondonNow = londonNow()) {
  for (let i = 0; i < 7; i++) {
    const d = (now.day + i) % 7;
    const e = events.find((ev) => ev.day === d);
    if (!e) continue;
    if (i === 0 && e.end && now.minutes >= toMinutes(e.end)) continue;
    return { event: e, inDays: i };
  }
  return undefined;
}

/** Date of the London calendar day `offset` days from now, as a short label like "Thu 23 Oct". */
export function dayLabel(offset: number, now: LondonNow = londonNow()) {
  const d = new Date(Date.UTC(now.year, now.month - 1, now.dayOfMonth + offset, 12));
  return new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' }).format(d);
}

export function daysUntil(isoDate: string, now: LondonNow = londonNow()) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const target = Date.UTC(y, m - 1, d);
  const today = Date.UTC(now.year, now.month - 1, now.dayOfMonth);
  return Math.round((target - today) / 86400000);
}

/** Days as a short label: [0..5] -> "Sun–Fri", [4] -> "Thu", [5, 6] -> "Fri–Sat". */
export function daysLabel(days: number[]) {
  if (days.length === 7) return 'Every day';
  for (const order of [[1, 2, 3, 4, 5, 6, 0], [0, 1, 2, 3, 4, 5, 6]]) {
    const idx = order.filter((d) => days.includes(d)).map((d) => order.indexOf(d));
    if (idx.every((v, i) => i === 0 || v === idx[i - 1] + 1)) {
      const first = order[idx[0]];
      const last = order[idx[idx.length - 1]];
      return first === last ? DAY_SHORT[first] : `${DAY_SHORT[first]}–${DAY_SHORT[last]}`;
    }
  }
  return days.map((d) => DAY_SHORT[d]).join(', ');
}
