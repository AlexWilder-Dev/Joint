import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { structuredData } from './scripts/structured-data';

const SITE = 'https://alexwilder-dev.github.io/Joint/';

/** Writes the venues' schema.org data into the static <head>, from the same data file the site uses. */
function jsonLd(): Plugin {
  return {
    name: 'joint-json-ld',
    transformIndexHtml(html) {
      const json = JSON.stringify(structuredData(SITE)).replace(/</g, '\\u003c');
      return html.replace('</head>', `    <script type="application/ld+json">${json}</script>\n  </head>`);
    },
  };
}

export default defineConfig({
  base: '/Joint/',
  plugins: [react(), jsonLd()],
});
