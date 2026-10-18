import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { venueById, type Venue, type VenueId } from '../data/joint';

const KEY = 'joint:venue';

const VenueContext = createContext<{ venue: Venue; setVenue: (id: VenueId) => void } | null>(null);

function readStored(): VenueId {
  try {
    const v = localStorage.getItem(KEY);
    if (v && v in venueById) return v as VenueId;
  } catch {
    /* storage unavailable */
  }
  return 'brixton';
}

/** The venue you last picked follows you from page to page. */
export function VenueProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<VenueId>(readStored);
  const setVenue = useCallback((next: VenueId) => {
    setId(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage unavailable */
    }
  }, []);
  const value = useMemo(() => ({ venue: venueById[id], setVenue }), [id, setVenue]);
  return <VenueContext.Provider value={value}>{children}</VenueContext.Provider>;
}

export function useVenue() {
  const ctx = useContext(VenueContext);
  if (!ctx) throw new Error('useVenue outside VenueProvider');
  return ctx;
}

export function themeStyle(v: Venue): React.CSSProperties {
  return {
    ['--bg' as string]: v.theme.bg,
    ['--surface' as string]: v.theme.surface,
    ['--ink' as string]: v.theme.ink,
    ['--muted' as string]: v.theme.muted,
    ['--accent' as string]: v.theme.accent,
    ['--accent-ink' as string]: v.theme.accentInk,
    ['--on-accent' as string]: v.theme.onAccent,
    ['--rule' as string]: v.theme.rule,
  };
}

export const isDark = (v: Venue) => v.id === 'greenwich' || v.id === 'bermondsey';

export const mapsUrl = (v: Venue) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.mapQuery)}`;
