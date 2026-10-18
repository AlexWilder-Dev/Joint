// One-off: build the link-preview image (public/og.jpg, 1200x630) and the favicons from The Joint's
// own overhead food shot and their traced logo.
import sharp from 'sharp';
import { readFileSync, statSync, writeFileSync } from 'node:fs';

const logoSvg = readFileSync('research/images/logo-traced.svg', 'utf8');
const viewBox = logoSvg.match(/viewBox="([^"]+)"/)[1];
const [, , vw, vh] = viewBox.split(' ').map(Number);
const paths = logoSvg.match(/<path[\s\S]*?\/>/g).join('');
const logo = (fill, width) => {
  const height = Math.round((width * vh) / vw);
  return {
    svg: Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${viewBox}">${paths.replace(/currentColor/g, fill)}</svg>`,
    ),
    width,
    height,
  };
};

// --- og.jpg -------------------------------------------------------------
const W = 1200;
const H = 630;
const photo = await sharp('research/images/TheJointAug23-238-2560.jpg')
  .resize(W, H, { fit: 'cover', position: 'centre' })
  .modulate({ brightness: 0.97 })
  .toBuffer();

const board = { x: 48, y: 400, w: 330, h: 182 };
const mark = logo('#f4eee2', 250);
const boardSvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect x="${board.x}" y="${board.y}" width="${board.w}" height="${board.h}" fill="#0f0f0e"/>
    <rect x="${board.x + 7}" y="${board.y + 7}" width="${board.w - 14}" height="${board.h - 14}" fill="none" stroke="#f4eee2" stroke-opacity=".35" stroke-width="1.5"/>
    <rect x="${board.x}" y="${board.y + board.h}" width="${board.w}" height="6" fill="#ff69b4"/>
  </svg>`,
);

await sharp(photo)
  .composite([
    { input: boardSvg, left: 0, top: 0 },
    { input: mark.svg, left: board.x + Math.round((board.w - mark.width) / 2), top: board.y + Math.round((board.h - mark.height) / 2) },
  ])
  .jpeg({ quality: 82, mozjpeg: true, chromaSubsampling: '4:2:0' })
  .toFile('public/og.jpg');
console.log('public/og.jpg', statSync('public/og.jpg').size, 'bytes');

// --- favicons -----------------------------------------------------------
const square = (size, pad) => {
  const inner = logo('#f4eee2', Math.round(size * (1 - pad * 2)));
  return sharp({ create: { width: size, height: size, channels: 4, background: '#0f0f0e' } }).composite([
    { input: inner.svg, left: Math.round((size - inner.width) / 2), top: Math.round((size - inner.height) / 2) },
  ]);
};
await square(180, 0.1).png().toFile('public/apple-touch-icon.png');
await square(32, 0.04).png().toFile('public/favicon-32.png');
await square(512, 0.1).png().toFile('public/icon-512.png');

const fav = logo('#f4eee2', 100);
writeFileSync(
  'public/favicon.svg',
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="10" fill="#0f0f0e"/><svg x="4" y="${(64 - 56 * (vh / vw)) / 2}" width="56" height="${56 * (vh / vw)}" viewBox="${viewBox}">${paths.replace(/currentColor/g, '#f4eee2')}</svg></svg>`,
);
void fav;
console.log('favicons written');
