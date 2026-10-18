// A paper clip, as on the photos pinned to their printed menus.

export function Clip({ className = 'clip' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 22 56" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <path d="M15 20 V44 C15 50 7 50 7 44 V10 C7 2 19 2 19 10 V40" />
    </svg>
  );
}
