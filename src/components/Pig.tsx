// A one-line pig in the spirit of the doodle that dots the i in The Joint's logo.

interface Props {
  className?: string;
}

export function Pig({ className }: Props) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 23 C12 11 33 5 46 12 C50 14 53 17 56 19.5 C57.5 21 57 23.5 55 24 C52 24.6 49.5 24 48 23" />
      <path d="M48 23 C41 28.5 21 29.5 12.5 26" />
      <path d="M44 11.5 L46.5 6 L49.5 13" />
      <path d="M11 22 C7.5 21.5 5.5 18.5 7.5 16.5 C9.5 15 11 18 8.5 19" />
      <path d="M18 28 L17 34.5 M24 29 L24 35 M39 28 L40 34.5 M45 26 L47 32.5" />
      <circle cx="49.5" cy="16" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}
