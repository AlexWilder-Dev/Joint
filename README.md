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
