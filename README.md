# The Joint — demo site

A speculative front-end for The Joint, the London brunch, BBQ and burger group: four venues
(Brixton Village, Greenwich Peninsula, Bermondsey, Hays Galleria), menus as real text, a table request
per venue, and one enquiry flow for Christmas, private hire, corporate, food truck and office delivery.

Demo only: static data, no backend. Forms show a confirmation and send nothing.

## Run

```sh
npm install
npm run dev       # local dev server
npm run build     # typecheck + production build into dist/
npm run preview   # serve dist/ at /Joint/
```

Built with Vite, React, TypeScript and Framer Motion. HashRouter, base path `/Joint/` for GitHub Pages (alexwilder-dev.github.io/Joint/)
(`.github/workflows/deploy.yml` builds and deploys `dist/` to Pages on push; Pages source is "GitHub Actions").

## Preview build (/Joint/preview/)

The same code with `VITE_WOW=1` (`npm run build:preview`) adds three things to the opening, without touching the live site:

1. **The sign lights up** (first visit only, about 1.7s; any tap or key skips; off with reduced motion). Festoon bulbs flicker on,
   the logo writes itself along its own centre line (`src/components/logoStrokes.ts`), the pig drops onto the i, and
   "Brunch.. BBQ.. Bar.." types out. Add `?intro` to the home URL (`/#/?intro`) to replay it.
2. **It opens on the right Joint for the moment** (`src/lib/moment.ts`): sunset countdown from the Greenwich roof, Thursday
   music, Live Music Fridays / DJ Saturdays in Bermondsey, Brixton brunch (bottomless Sunday to Friday), Hays at lunchtime.
3. **Greenwich in real light** (`src/components/GreenwichLight.tsx`): the terrace photo by day, at sunset or after dark,
   picked by London time, with buttons to flick between them.

To put these on the live site, set `VITE_WOW=1` for the main build (or make `WOW` true in `src/lib/flags.ts`).

## Where things live

- `src/data/joint.ts`: every menu, opening hour, phone, email, event and hire option, split by venue. Edit here.
- `src/lib/tonight.ts`: the per-venue "tonight" line (Greenwich sunset is computed in `src/lib/sun.ts`).
- `research/`: notes, sources, menu transcriptions and the original photos.
- `scripts/prepare-images.mjs`: resizes their photos into `public/img/` (`npm run images`).
- `scripts/make-og.mjs`: builds `public/og.jpg` (1200×630) and the favicons (`npm run og`).
- `scripts/trace-logo.mjs`: traces the logo PNG into SVG.

## Before going live

- Replace `YOUR-NTFY-TOPIC` in `index.html`.
- Brixton opening times are not published by The Joint and are left out; add them to `src/data/joint.ts`.
- Hays Galleria has no published item list; add one when there is one.

Site by AlexWilder-Dev
