// Builds schema.org JSON-LD for The Joint and each venue from src/data/joint.ts.
// Injected into index.html at build time (vite.config.ts) so crawlers see it without running the app.
import { brand, venues, type HoursBlock, type Venue } from '../src/data/joint';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function openingHours(block: HoursBlock) {
  return block.ranges.map((r) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: r.days.map((d) => `https://schema.org/${DAYS[d]}`),
    opens: r.open,
    closes: r.close,
  }));
}

function postcode(v: Venue) {
  return v.address[v.address.length - 1].replace(/^London\s+/, '');
}

export function structuredData(site: string) {
  const restaurants = venues.map((v) => ({
    '@type': 'Restaurant',
    '@id': `${site}#/${v.id}`,
    name: `The Joint ${v.name}`,
    description: v.blurb[0],
    url: `${site}#/${v.id}`,
    hasMenu: v.menus.length ? `${site}#/menus/${v.id}` : undefined,
    servesCuisine: ['Barbecue', 'Burgers', 'Brunch'],
    image: `${site}img/${v.photos.hero}-1280.webp`,
    email: v.email,
    telephone: v.phone ? v.phone.tel : undefined,
    acceptsReservations: v.booking.mode === 'request' ? 'True' : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: v.address.slice(0, -1).join(', '),
      addressLocality: 'London',
      postalCode: postcode(v),
      addressCountry: 'GB',
    },
    openingHoursSpecification: v.hours ? openingHours(v.hours[0]) : undefined,
    parentOrganization: { '@id': `${site}#org` },
  }));

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${site}#org`,
        name: 'The Joint',
        url: site,
        logo: `${site}icon-512.png`,
        foundingDate: String(brand.founded),
        email: brand.generalEmail,
        sameAs: [brand.instagram, brand.tiktok, brand.x],
      },
      ...restaurants,
    ],
  };
}
