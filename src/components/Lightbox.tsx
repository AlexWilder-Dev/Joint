import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Photo } from './Photo';

interface Shot {
  slug: string;
  alt: string;
}

/** A photo grid that opens each photo uncropped: Esc closes, arrow keys and swipes move, focus goes back where it was. */
export function Gallery({ shots, label }: { shots: Shot[]; label: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const swipeX = useRef<number | null>(null);
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  const step = (by: number) => setIndex((i) => (i === null ? i : (i + by + shots.length) % shots.length));

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1);
  };
  const onDown = (e: PointerEvent) => {
    swipeX.current = e.clientX;
  };
  const onUp = (e: PointerEvent) => {
    if (swipeX.current === null) return;
    const dx = e.clientX - swipeX.current;
    swipeX.current = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  };

  const shot = index === null ? null : shots[index];
  return (
    <>
      <ul className="gallery" aria-label={label}>
        {shots.map((g, i) => (
          <li key={g.slug}>
            <button
              type="button"
              className="gallery__open"
              aria-label={`Open photo ${i + 1} of ${shots.length}: ${g.alt}`}
              onClick={(e) => {
                opener.current = e.currentTarget;
                setIndex(i);
              }}
            >
              <Photo slug={g.slug} alt="" sizes="(min-width: 900px) 33vw, 50vw" />
            </button>
          </li>
        ))}
      </ul>
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label={label}
        onClose={() => {
          setIndex(null);
          opener.current?.focus();
        }}
        onKeyDown={onKey}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIndex(null);
        }}
      >
        {shot && (
          <figure className="lightbox__figure" onPointerDown={onDown} onPointerUp={onUp}>
            <Photo slug={shot.slug} alt={shot.alt} sizes="100vw" eager />
            <figcaption>
              <span>{shot.alt}</span>
              <span className="lightbox__count">
                {index! + 1} / {shots.length}
              </span>
            </figcaption>
          </figure>
        )}
        <div className="lightbox__controls">
          <button type="button" className="btn btn--small" onClick={() => step(-1)} aria-label="Previous photo">
            Prev
          </button>
          <button type="button" className="btn btn--small" onClick={() => step(1)} aria-label="Next photo">
            Next
          </button>
          <button type="button" className="btn btn--small btn--solid" onClick={() => setIndex(null)} autoFocus>
            Close
          </button>
        </div>
      </dialog>
    </>
  );
}
