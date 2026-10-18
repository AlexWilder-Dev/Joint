// One-off: trace the published white logo PNG into a crisp single-colour SVG.
import sharp from 'sharp';
import potrace from 'potrace';
import { writeFileSync } from 'node:fs';

const src = 'research/images/logo-white-2.png';
const { width, height } = await sharp(src).metadata();
const scale = Number(process.env.SCALE || 6);

// Logo is white on transparent: use alpha as ink, black on white for potrace.
const ink = await sharp(src)
  .extractChannel('alpha')
  .negate()
  .resize(width * scale, height * scale, { kernel: 'lanczos3' })
  .blur(1.2)
  .png()
  .toBuffer();

potrace.trace(ink, { threshold: 140, turdSize: 20, optTolerance: Number(process.env.OPT || 0.4), color: 'currentColor', background: 'transparent' }, (err, svg) => {
  if (err) throw err;
  const out = svg
    .replace(/<svg[^>]*>/, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width * scale} ${height * scale}" role="img" aria-label="The Joint">`)
    .replace(/fill-rule="evenodd"/g, 'fill-rule="evenodd"');
  writeFileSync('research/images/logo-traced.svg', out);
  console.log('wrote research/images/logo-traced.svg', out.length);
});
