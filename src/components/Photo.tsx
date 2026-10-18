import photos from '../data/photos.json';

type Manifest = Record<string, { w: number; h: number; sizes: number[]; tone: string; source: string }>;
const manifest = photos as Manifest;

interface Props {
  slug: string;
  alt: string;
  sizes?: string;
  className?: string;
  eager?: boolean;
}

/** The Joint's own photography, resized by scripts/prepare-images.mjs. */
export function Photo({ slug, alt, sizes = '(min-width: 900px) 50vw, 100vw', className, eager }: Props) {
  const p = manifest[slug];
  if (!p) return null;
  const base = `${import.meta.env.BASE_URL}img/${slug}`;
  const srcSet = p.sizes.map((w) => `${base}-${w}.webp ${Math.min(w, p.w)}w`).join(', ');
  const fallback = p.sizes.includes(1280) ? 1280 : p.sizes[p.sizes.length - 1];
  return (
    <img
      className={className}
      src={`${base}-${fallback}.webp`}
      srcSet={srcSet}
      sizes={sizes}
      width={p.w}
      height={p.h}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      style={{ backgroundColor: p.tone }}
    />
  );
}
