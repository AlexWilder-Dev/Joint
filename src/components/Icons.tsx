const common = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" {...common}>
    <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2" />
  </svg>
);

export const PinIcon = () => (
  <svg viewBox="0 0 24 24" {...common}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

export const TableIcon = () => (
  <svg viewBox="0 0 24 24" {...common}>
    <path d="M3 9h18M6 9v11M18 9v11M8 5h8" />
  </svg>
);

export const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" {...common}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const SearchIcon = () => (
  <svg viewBox="0 0 24 24" {...common}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16l4.5 4.5" />
  </svg>
);

export const MailIcon = () => (
  <svg viewBox="0 0 24 24" {...common}>
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="M3.5 6l8.5 7 8.5-7" />
  </svg>
);
