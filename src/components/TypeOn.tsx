import type { CSSProperties } from 'react';

/**
 * Text that types itself out like the typewriter faces on their menus. Works because the face is monospaced:
 * the box widens one character per step.
 */
export function TypeOn({ text, play, startAt = 0, step = 0.024 }: { text: string; play: boolean; startAt?: number; step?: number }) {
  if (!play) return <>{text}</>;
  const n = Array.from(text).length;
  const style = {
    '--w': `calc(${n} * (1ch + 0.04em) + 0.14em)`,
    animation: `typeon ${Math.round(n * step * 1000)}ms steps(${n}, end) ${startAt}s forwards, caret 0.5s step-end ${startAt}s 4`,
  } as CSSProperties;
  return (
    <span className="typeon" style={style} aria-label={text}>
      <span aria-hidden="true">{text}</span>
    </span>
  );
}
