// One-off: resize The Joint's own photography (research/images) into web sizes in public/img.
import sharp from 'sharp';
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';

const SRC = 'research/images';
const OUT = 'public/img';
mkdirSync(OUT, { recursive: true });

// slug: [source file, focal position for crops]
const photos = {
  'brixton-front': ['BrixtonVillage-TheJoint-3.jpg', 'centre'],
  'brixton-busy': ['BrixtonVillage-TheJoint-1-q9al8qtuyxv4ib85v9itntssvsrzsrslrsi4wetgek.jpg', 'centre'],
  'brixton-sign': ['TheJointAug23-73-scaled.jpg', 'centre'],
  'brixton-hanging-sign': ['TheJointAug23-71-scaled.jpg', 'centre'],
  'brixton-table': ['TheJointAug23-196-2560.jpg', 'centre'],
  'spread-overhead': ['TheJointAug23-238-2560.jpg', 'centre'],
  'spread-table': ['TheJointAug23-214-scaled.jpg', 'centre'],
  'ribs': ['TheJointAug23-207-scaled.jpg', 'centre'],
  'wings': ['TheJointAug23-173-scaled.jpg', 'centre'],
  'wings-two': ['TheJointAug23-167-scaled.jpg', 'centre'],
  'wings-closeup': ['TheJointAug23-219-1-2560.jpg', 'centre'],
  'burger-double': ['TheJointAug23-179-2560.jpg', 'centre'],
  'burger-crispy': ['TheJointAug23-227-scaled.jpg', 'centre'],
  'pulled-pork': ['TheJointAug23-198-2560.jpg', 'centre'],
  'brunch-muffin': ['TheJointAug23-90-2560.jpg', 'centre'],
  'brunch-full': ['TheJointAug23-11-scaled.jpg', 'centre'],
  'brunch-full-top': ['TheJointAug23-2-scaled.jpg', 'centre'],
  'brunch-eggs': ['TheJointAug23-124-scaled.jpg', 'centre'],
  'brunch-french-toast': ['TheJointAug23-61-scaled.jpg', 'centre'],
  'brunch-pancakes': ['TheJointAug23-18-scaled.jpg', 'centre'],
  'brunch-pancakes-fruit': ['TheJointAug23-35-scaled.jpg', 'centre'],
  'mac-bites': ['TheJointAug23-216-scaled.jpg', 'centre'],
  'sweet-fries': ['TheJointAug23-217-scaled.jpg', 'centre'],
  'gw-sunset': ['GP-TheJoint-JustineTrickett-0272-scaled.jpg', 'centre'],
  'gw-day': ['GP-TheJoint-JustineTrickett-0004-2560.jpg', 'centre'],
  'gw-dusk': ['GP-TheJoint-JustineTrickett-0310-2560.jpg', 'centre'],
  'gw-o2-night': ['GP-TheJoint-JustineTrickett-0482-1-2560.jpg', 'centre'],
  'gw-music': ['GP-TheJoint-JustineTrickett-0201-scaled.jpg', 'centre'],
  'gw-neon': ['GP-TheJoint-JustineTrickett-0303-scaled.jpg', 'north'],
  'gw-bar': ['GP-TheJoint-JustineTrickett-0348-scaled.jpg', 'centre'],
  'gw-pass': ['GP-TheJoint-JustineTrickett-0145-2560.jpg', 'centre'],
  'gw-serve': ['GP-TheJoint-JustineTrickett-0167-1-2560.jpg', 'centre'],
  'gw-drinks': ['GP-TheJoint-JustineTrickett-0039-scaled.jpg', 'centre'],
  'gw-friends': ['GP-TheJoint-JustineTrickett-0205-scaled.jpg', 'centre'],
  'gw-outdoor-bar': ['GP-TheJoint-JustineTrickett-0468-scaled.jpg', 'centre'],
};

const widths = [640, 1280, 1920];
const manifest = {};

for (const [slug, [file]] of Object.entries(photos)) {
  const input = `${SRC}/${file}`;
  if (!existsSync(input)) { console.warn('missing', input); continue; }
  const meta = await sharp(input).metadata();
  const stats = await sharp(input).resize(8, 8, { fit: 'cover' }).stats();
  const [r, g, b] = stats.channels.map((c) => Math.round(c.mean));
  const made = [];
  for (const w of widths) {
    if (w > meta.width && w !== widths[0]) continue;
    const out = `${OUT}/${slug}-${w}.webp`;
    await sharp(input).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: 74, effort: 5 }).toFile(out);
    made.push(w);
  }
  manifest[slug] = { w: meta.width, h: meta.height, sizes: made, tone: `rgb(${r} ${g} ${b})`, source: file };
  console.log(slug, made.join(','));
}

writeFileSync('src/data/photos.json', JSON.stringify(manifest, null, 2) + '\n');
console.log('wrote src/data/photos.json');
