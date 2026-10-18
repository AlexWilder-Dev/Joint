import { useEffect, useState } from 'react';

/** Current time, refreshed every 30 seconds so "open now" and the sunset countdown stay true. */
export function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(t);
  }, []);
  return now;
}
