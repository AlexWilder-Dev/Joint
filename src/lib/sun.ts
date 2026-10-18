// Sunrise and sunset for a given day, NOAA solar position equations.
// Used for the Greenwich roof terrace: the sun goes down behind Canary Wharf.

export const GREENWICH_TERRACE = { lat: 51.4981, lon: 0.0094 };

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/**
 * Returns the UTC instant of sunrise and sunset for the calendar day (y, m, d) at lat/lon,
 * or null if the sun doesn't rise or set that day.
 */
export function sunTimes(y: number, m: number, d: number, lat: number, lon: number) {
  const noonUtc = Date.UTC(y, m - 1, d, 12);
  const jd = noonUtc / 86400000 + 2440587.5;
  const t = (jd - 2451545) / 36525;

  const l0 = (280.46646 + t * (36000.76983 + t * 0.0003032)) % 360;
  const mAnom = 357.52911 + t * (35999.05029 - 0.0001537 * t);
  const e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
  const c =
    Math.sin(rad(mAnom)) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
    Math.sin(rad(2 * mAnom)) * (0.019993 - 0.000101 * t) +
    Math.sin(rad(3 * mAnom)) * 0.000289;
  const trueLong = l0 + c;
  const omega = 125.04 - 1934.136 * t;
  const appLong = trueLong - 0.00569 - 0.00478 * Math.sin(rad(omega));
  const meanObliq = 23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60;
  const obliq = meanObliq + 0.00256 * Math.cos(rad(omega));
  const decl = deg(Math.asin(Math.sin(rad(obliq)) * Math.sin(rad(appLong))));

  const yv = Math.tan(rad(obliq / 2)) ** 2;
  const eqTime =
    4 *
    deg(
      yv * Math.sin(2 * rad(l0)) -
        2 * e * Math.sin(rad(mAnom)) +
        4 * e * yv * Math.sin(rad(mAnom)) * Math.cos(2 * rad(l0)) -
        0.5 * yv * yv * Math.sin(4 * rad(l0)) -
        1.25 * e * e * Math.sin(2 * rad(mAnom)),
    );

  const cosH =
    Math.cos(rad(90.833)) / (Math.cos(rad(lat)) * Math.cos(rad(decl))) - Math.tan(rad(lat)) * Math.tan(rad(decl));
  if (cosH < -1 || cosH > 1) return null;
  const ha = deg(Math.acos(cosH));

  const solarNoonMin = 720 - 4 * lon - eqTime;
  const dayStart = Date.UTC(y, m - 1, d);
  return {
    sunrise: new Date(dayStart + (solarNoonMin - 4 * ha) * 60000),
    sunset: new Date(dayStart + (solarNoonMin + 4 * ha) * 60000),
  };
}

export function londonClock(at: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(at);
}
