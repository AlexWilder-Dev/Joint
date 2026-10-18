// Everything the site says about The Joint lives here, split by venue.
// Menus are transcribed from the menu images on thejointldn.com (see research/menus/transcriptions.md),
// spelling and prices as printed. Hours, phones and events carry their source; unknowns are left out.

export type VenueId = 'brixton' | 'greenwich' | 'bermondsey' | 'hays';

export type Diet = 'v' | 'vg';

export interface MenuItem {
  name: string;
  price?: string;
  desc?: string;
  diet?: Diet[];
}

export interface MenuSection {
  title: string;
  /** small print next to the heading, e.g. "Pint/Pitcher" */
  note?: string;
  items: MenuItem[];
}

export interface Menu {
  id: string;
  label: string;
  /** when it's served, as printed */
  served?: string;
  /** visual treatment, taken from the venue's own printed menu */
  style: 'typewriter' | 'sheet';
  sections: MenuSection[];
  footnotes: string[];
  source: string;
}

/** Opening hours as structured ranges so the site can say "open now". Days: 0 = Sunday. */
export interface HoursRange {
  days: number[];
  open: string; // 24h "HH:MM"
  close: string;
}

export interface HoursBlock {
  label: string;
  ranges: HoursRange[];
  source: string;
}

export interface WeeklyEvent {
  day: number; // 0 = Sunday
  title: string;
  detail?: string;
  start?: string;
  end?: string;
  source: string;
}

export interface Venue {
  id: VenueId;
  name: string;
  /** their own nickname or framing */
  kicker: string;
  /** one line of their own copy */
  line: string;
  blurb: string[];
  highlights: string[];
  address: string[];
  mapQuery: string;
  phone?: { display: string; tel: string; label?: string; source: string };
  email: string;
  extraEmail?: { label: string; address: string };
  hours?: HoursBlock[];
  hoursNote?: string;
  services: string[];
  order: { label: string; href: string; note?: string }[];
  booking:
    | { mode: 'request'; note?: string; external?: { label: string; href: string } }
    | { mode: 'walk-in'; note: string; groupMin: number; groupMax: number };
  events: WeeklyEvent[];
  gettingThere?: string[];
  menus: Menu[];
  photos: { hero: string; heroAlt: string; gallery: { slug: string; alt: string }[] };
  hireName: string;
  social?: { label: string; href: string }[];
  theme: {
    bg: string;
    surface: string;
    ink: string;
    muted: string;
    accent: string;
    accentInk: string;
    /** text colour on an accent fill */
    onAccent: string;
    rule: string;
  };
}

// Shared Brixton drinks lists (identical on the main and brunch menus)
const brixtonBeer: MenuSection = {
  title: 'BEER & CIDER',
  note: 'Pint/Pitcher',
  items: [
    { name: 'The Joint Lager', price: '£6.7/24' },
    { name: 'Camden Hells Lager', price: '£6.8/25' },
    { name: 'Camden Pale Ale', price: '£6.8/25' },
    { name: 'Eazy session IPA', price: '£7.2/26' },
    { name: 'Corona 330ml', price: '£5.5' },
    { name: 'Alcohol free beer 330ml', price: '£5' },
    { name: 'Kopparberg 500ml', price: '£6.5', desc: 'strawberry & lime' },
  ],
};

const brixtonSpirits: MenuSection = {
  title: 'SPIRITS',
  note: '25ml/50ml',
  items: [
    { name: 'Bombay Sapphire', price: '£7/10' },
    { name: 'Below 42 vodka', price: '£7/10' },
    { name: 'Jack Daniels', price: '£7/10' },
    { name: 'Havana club 7 YR', price: '£7/10' },
    { name: 'Kraken spiced rum', price: '£7/10' },
    { name: 'Buffalo Trace Bourbon', price: '£7/10' },
    { name: 'Jameson', price: '£7/10' },
    { name: 'Evan Williams Bourbon', price: '£8/12' },
    { name: 'Henessy', price: '£8/12' },
  ],
};

const brixtonSofts: MenuSection = {
  title: 'SOFT DRINKS',
  items: [
    { name: 'Coke/Diet coke/ Coke zero', price: '£2.5' },
    { name: 'Lemonade', price: '£2.5' },
    { name: 'Artisanal Kombucha', price: '£5', desc: 'Ginger, elderflower, mango & peach' },
    { name: 'Redbull', price: '£3.3' },
    { name: 'Ginger ale', price: '£3.1' },
    { name: 'Fever tree tonic', price: '£3.1' },
    { name: 'Fever tree soda water', price: '£3.1' },
    { name: 'Sparkling/still water', price: '£2' },
  ],
};

const greenwichBreakfast: Menu = {
  id: 'breakfast',
  label: 'Breakfast',
  served: 'BREAKFAST 8AM TO 11AM',
  style: 'sheet',
  source: 'thejointldn.com/greenwich-menu, sheet 1 (Feb 2026)',
  sections: [
    {
      title: 'BREAKFAST',
      items: [
        { name: 'Bacon and egg bun', price: '5.00' },
        { name: 'Sausage and egg bun', price: '5.00' },
        { name: 'Bacon and sausage bun', price: '5.50' },
        { name: 'Double Bacon bun', price: '5.00' },
        { name: 'Double sausage bun', price: '5.00' },
        { name: 'Double egg bun', price: '4.80' },
        { name: 'Avocado and egg bun', price: '4.80' },
        { name: 'Bacon ,sausage and egg bun', price: '6.00' },
      ],
    },
    {
      title: 'PASTRIES',
      items: [
        { name: 'Freshly baked Croissant', price: '2.70' },
        { name: 'Freshly baked Pains au Chocolat', price: '2.70' },
      ],
    },
    {
      title: 'BREAKFAST DEAL',
      items: [
        { name: 'Hot drink and pastry', price: '5.00' },
        { name: 'Hot drink and breakfast bun', price: '7.50', desc: '*excluding bacon,sausage and egg bun' },
      ],
    },
  ],
  footnotes: ['*Ask your server about allergens & intolerances', '**Discretionary 12% service charge is added to the bill'],
};

export const venues: Venue[] = [
  {
    id: 'brixton',
    name: 'Brixton',
    kicker: 'The OG',
    line: 'Where it all started.',
    blurb: [
      'Our Brixton Village spot is the true OG. We’re open every single day serving up your favourite brunch, lunch, and dinner alongside a full lineup of hot and cold drinks.',
      'Pull up a chair and eat in with us, or grab it to go via takeaway, click-and-collect, or delivery.',
    ],
    highlights: [
      'Corner of 6th Avenue, Brixton Village',
      'Bottomless brunch Sunday to Friday',
      'The wall you can write on',
    ],
    address: ['Unit 87–88, Granville Arcade', 'Brixton Village', 'London SW9 8PS'],
    mapQuery: 'The Joint, Unit 87-88 Granville Arcade, Brixton Village, London SW9 8PS',
    phone: { display: '020 7095 9184', tel: '+442070959184', source: 'brixtonvillage.com/trader/the-joint' },
    email: 'Brixton@thejointldn.com',
    hoursNote: 'Open every day: brunch, lunch and dinner. Call ahead for today’s times.',
    services: ['Eat in', 'Takeaway', 'Click & collect', 'Delivery'],
    order: [
      {
        label: 'Deliveroo',
        href: 'https://deliveroo.co.uk/menu/London/brixton/the-joint-87-88-granville-arcade',
      },
    ],
    booking: { mode: 'request' },
    events: [0, 1, 2, 3, 4, 5].map((day) => ({
      day,
      title: 'Bottomless brunch',
      detail: '£35pp for 2 hours. Food must be ordered separate.',
      source: 'Brixton brunch menu',
    })),
    menus: [
      {
        id: 'mains',
        label: 'Lunch | Dinner',
        served: 'Lunch|Dinner',
        style: 'typewriter',
        source: 'thejointldn.com/brixtons-menus (main_menu_text_only)',
        sections: [
          {
            title: 'mains',
            items: [
              {
                name: 'Award winning whole smoked wings',
                price: '£6/£12',
                desc: 'choice of sauce: BBQ, hot BBQ, Korean sweet & savoury or spicy Korean',
              },
              {
                name: 'Smoked spare baby back ribs',
                price: '1/2 rack £16 | Full rack £22',
                desc: 'served with homemade coleslaw & French fries. Choice of sauce: BBQ, hot BBQ, Korean sweet & savoury or spicy Korean',
              },
              {
                name: '16hr smoked pulled pork',
                price: '£10',
                desc: 'Tender smoked pulled pork, house slaw & buttered bun. Choice of sauce: BBQ or spicy',
              },
              {
                name: 'The BJ',
                price: '£12',
                desc: 'Two quarter pounders, smoked pork belly, cheese, pickles, jalapenos & burger sauce',
              },
              {
                name: 'Crispy Bird',
                price: '£10',
                desc: 'Crispy Bird, cheese, tomato, pickles & salad & buttered bun | Choice of sauce: BBQ or spicy',
              },
              {
                name: 'Halloumi burger',
                price: '£10',
                desc: 'Grilled halloumi, pickle cucumber, pickle onion, guacamole & rocket',
              },
              {
                name: 'The Joint cheese burger',
                price: '£10',
                desc: 'Quarter pounder, American cheese, onions, tomatoes and lettuce with homemade burger sauce',
              },
              {
                name: 'Beyond meat vegan burger',
                price: '£10',
                desc: 'Served with lettuce, tomato, vegan cheese and vegan mayo',
              },
              {
                name: 'The Joint salad',
                price: '£10',
                desc: 'Mixed leaves, croutons, cherry tomatoes, cucumber, sweetcorn, avocado served with homemade salad dressing. Add grilled chicken breast £4',
              },
              {
                name: 'Crispy Bird chicken strips',
                price: '£6/£12',
                desc: 'Lightly floured crispy buttermilk chicken',
              },
            ],
          },
          {
            title: 'Sides',
            items: [
              { name: 'French fries', price: '£4.5' },
              { name: 'Sweet potato fries', price: '£5.5' },
              { name: 'Raclette cheesy fries', price: '£6.5' },
              { name: 'Avocado & Tomato garden salad', price: '£6' },
              { name: 'Coleslaw', price: '£4.5' },
              { name: 'Deep fried Mac n cheese', price: '£6' },
            ],
          },
          {
            title: 'DESSERT',
            items: [
              { name: 'Variation of homemade cakes (ask your server)', price: '£7' },
              { name: 'Ice cream (Vanilla, Chocolate or Pistachio)', price: '£3 per scoop' },
            ],
          },
        ],
        footnotes: ['*Ask your server about allergens & intolerances', '*Service charge included'],
      },
      {
        id: 'brunch',
        label: 'Brunch',
        style: 'typewriter',
        source: 'thejointldn.com/brixtons-menus (brunch_brixton_menu_text_only)',
        sections: [
          {
            title: 'brunch',
            items: [
              { name: 'Eggs Royale', price: '£12', desc: 'Smoked salmon, poached eggs, watercress & hollandaise sauce on sourdough' },
              {
                name: 'Señor',
                price: '£11',
                desc: 'Chorizo sausage, poached eggs, smashed avocado, spicy tomato sauce & hollandaise on sourdough',
              },
              { name: 'The Classic', price: '£13', desc: 'Egg, bacon, sausage, mushroom, hash brown, tomatoes, beans & toast' },
              { name: 'The Tree Hugger', price: '£12', desc: 'Egg, halloumi, mushroom, hash brown, tomatoes, beans & toast' },
              {
                name: 'American Pancakes',
                price: '£12',
                desc: 'Crispy bacon & maple OR seasonal fruits, Chantilly cream & maple',
              },
              { name: 'French Toast', price: '£12', desc: 'Crispy bacon, Chantilly cream & maple OR seasonal fruits' },
              {
                name: 'Vegan Bowl',
                price: '£10',
                desc: 'Mix of salad, avocado, chickpeas, cucumber, quinoa & toasted sesame seeds',
              },
              { name: 'Avocado on toast', price: '£8', desc: 'Smashed avocado on sourdough toast. Add egg £2' },
              {
                name: 'The Morning Glory',
                price: '£11',
                desc: 'Double sausage patty, bacon, cheese & egg muffin (choice of sauce)',
              },
              {
                name: 'Full rack of ribs',
                price: '1/2 rack £16 | Full rack £22',
                desc: 'served with homemade coleslaw & French fries. choice of sauce: BBQ, hot BBQ or Korean',
              },
              {
                name: 'Award winning whole smoked wings',
                price: '£6/£12',
                desc: 'Choice of sauce: BBQ, hot BBQ or Korean',
              },
            ],
          },
          {
            title: 'sides',
            items: [
              { name: 'Hash Brown', price: '£2.5' },
              { name: 'French fries', price: '£4.5' },
              { name: 'Sweet potato fries', price: '£5' },
              { name: 'Deep fried Mac n cheese', price: '£6' },
            ],
          },
          {
            title: 'extras',
            items: [
              { name: 'Avocado', price: '£3' },
              { name: 'Bacon', price: '£2.5' },
              { name: 'Egg', price: '£2' },
              { name: 'Sausage', price: '£2.5' },
              { name: 'Halloumi', price: '£3.5' },
              { name: 'Salmon', price: '£4' },
            ],
          },
          {
            title: 'JUICES & SMOOTHIES',
            items: [
              { name: 'Fruit juice (Apple or Orange)', price: '£3' },
              { name: 'Smoothie of the day', price: '£6' },
              { name: 'Detox delivery juice', price: '£7', desc: 'carrot, cucumber, lemon, apple & ginger' },
              { name: 'Beets me juice', price: '£7', desc: 'beetroot, carrot, apple, ginger & lemon' },
            ],
          },
          {
            title: 'BRUNCH BOOZE',
            items: [
              { name: 'Bloody Mary', price: '£9.5' },
              { name: 'Passionfruit Martini', price: '£10' },
              { name: 'Espresso Martini', price: '£10' },
              { name: 'Aperol spritz', price: '£9.5' },
              { name: 'Mimosa', price: '£8' },
              { name: 'Virgin mary', price: '£7' },
            ],
          },
          {
            title: 'COFFEE',
            items: [
              { name: 'Espresso', price: '£1.5/2.8', desc: 'single/double' },
              { name: 'Cafe Americano', price: '£2.8' },
              { name: 'Cappuccino', price: '£3.4' },
              { name: 'Latte', price: '£3.4' },
              { name: 'Flat white', price: '£3.4' },
              { name: 'Mocha', price: '£3.6' },
              { name: 'Matcha', price: '£4.2' },
              { name: 'Macchiato', price: '£2.8' },
              { name: 'Hot chocolate', price: '£3.5' },
              { name: 'Ice coffee', price: '£3.5' },
              { name: 'Selection of Teas', price: '£3' },
              { name: 'Alternative milk', price: '40p', desc: 'oat, coconut, soy or almond' },
            ],
          },
        ],
        footnotes: [
          'Sunday to Friday: Bottomless brunch £35pp for 2 hours. Food must be ordered separate.',
          '*Ask your server about allergens & intolerances',
          '*Service charge included',
        ],
      },
      {
        id: 'drinks',
        label: 'Drinks',
        style: 'typewriter',
        source: 'thejointldn.com/brixtons-menus (main_menu_text_only, drinks)',
        sections: [
          brixtonBeer,
          {
            title: 'WINE',
            note: 'WHITE 175ml/75cl',
            items: [
              {
                name: 'Boulders Beach Sauvignon Blanc (South Africa)',
                price: '£8.5/35',
                desc: 'Dry | Gooseberry | Tropical fruits.',
              },
              { name: 'Conviviale Pinot Grigio (Italy)', price: '£8.5/35', desc: 'Grapes | Honey | Hints of nuts.' },
            ],
          },
          {
            title: 'ROSÉ',
            items: [
              {
                name: 'Domaine Horgelus Rosé (France)',
                price: '£8.5/35',
                desc: 'Intense | Strawberries | Blackcurrant.',
              },
            ],
          },
          {
            title: 'RED',
            items: [
              { name: 'Rioja', price: '£9.5/38' },
              { name: 'Rib Shack red (South Africa)', price: '£8.5/35' },
              { name: 'El Dueto Chardonny', price: '£6.5/26' },
              { name: 'Chacabuco Malbec (Argentina)', price: '£8.5/35', desc: 'Full-bodied | Plums | Black Cherry.' },
              { name: 'El Dueto Merlot (Chile)', price: '£8/32', desc: 'Juicy | Soft | Plums.' },
            ],
          },
          {
            title: 'SPARKLING',
            note: '125ml/75cl',
            items: [{ name: 'Rechsteiner Prosecco (Italy)', price: '£8/35', desc: 'Apple | Pear | Fragrant.' }],
          },
          brixtonSpirits,
          {
            title: 'COCKTAILS',
            items: [
              { name: 'Gin Garden', price: '£10' },
              { name: 'Passionfruit Martini', price: '£10' },
              { name: 'Mojito', price: '£10' },
              { name: 'Aperol Spritz', price: '£10' },
              { name: 'Negroni', price: '£10' },
              { name: 'Chilly or frozen Margarita', price: '£10' },
              { name: 'Pineapple and Ginger spice', price: '£10' },
              { name: 'Old Fashioned spice', price: '£12' },
            ],
          },
          {
            title: 'SHOTS',
            items: [
              { name: 'Jägermeister', price: '£4.5' },
              { name: 'Sambucca (white or black)', price: '£4.5' },
              { name: 'PATRÓN Silver', price: '£6.5' },
              { name: 'Tequila', price: '£4.5' },
              { name: 'Jägerbomb', price: '£6.5' },
              { name: 'Soju (Korean alcohol shot/btl)', price: '£4.5/18' },
            ],
          },
          brixtonSofts,
        ],
        footnotes: ['*Ask your server about allergens & intolerances', '*Service charge included'],
      },
    ],
    photos: {
      hero: 'brixton-front',
      heroAlt: 'The Joint’s black corner shopfront on 6th Avenue, Brixton Village, with red stools outside',
      gallery: [
        { slug: 'brixton-busy', alt: 'Full tables outside The Joint, Brixton Village, on a summer evening' },
        { slug: 'brixton-table', alt: 'Burgers and wings on enamel plates at a table in the market' },
        { slug: 'brixton-sign', alt: 'The Joint’s round hanging sign under the 6th Avenue street sign' },
        { slug: 'brunch-french-toast', alt: 'French toast with berries, cream and maple' },
        { slug: 'ribs', alt: 'A rack of smoked ribs with fries and slaw on a board' },
        { slug: 'brunch-full-top', alt: 'The Classic: egg, bacon, sausage, beans, hash brown, mushroom and toast' },
      ],
    },
    hireName: 'Brixton',
    theme: {
      bg: '#f1ece2',
      surface: '#fbf8f2',
      ink: '#151413',
      muted: '#5a554d',
      accent: '#ff69b4',
      accentInk: '#b8186e',
      onAccent: '#0f0f0e',
      rule: '#151413',
    },
  },
  {
    id: 'greenwich',
    name: 'Greenwich',
    kicker: 'Roof bar at the golf range',
    line: 'Fuel your game, or wind down after hitting the greens.',
    blurb: [
      'Right alongside the Greenwich Peninsula Golf Range. Whether you’re playing the full range or a round of mini-golf, join us for everything from breakfast to dinner.',
      'Sip cocktails on the roof terrace or the downstairs patio, with Canary Wharf and the sunset in front of you.',
    ],
    highlights: ['Roof terrace and patio', 'Live music every Thursday', 'Every game on Sky Sports and TNT'],
    address: ['Greenwich Peninsula Golf Range', '265 Tunnel Avenue', 'London SE10 0QE'],
    mapQuery: 'The Joint, Greenwich Peninsula Golf Range, 265 Tunnel Avenue, London SE10 0QE',
    phone: { display: '020 8858 7448', tel: '+442088587448', source: 'greenwichpeninsula.co.uk' },
    email: 'Greenwich@thejointldn.com',
    hours: [
      {
        label: 'Open',
        ranges: [{ days: [0, 1, 2, 3, 4, 5, 6], open: '08:00', close: '23:00' }],
        source: 'greenwichpeninsula.co.uk/whats-here/food-and-drink/the-joint',
      },
      {
        label: 'Breakfast',
        ranges: [{ days: [0, 1, 2, 3, 4, 5, 6], open: '08:00', close: '11:00' }],
        source: 'Greenwich menu, sheet 1',
      },
    ],
    services: ['Eat in', 'Takeaway', 'Click & collect', 'Delivery'],
    order: [],
    booking: { mode: 'request' },
    events: [
      {
        day: 4,
        title: 'Live music',
        detail: 'Carla O’Neil, laid-back acoustic',
        start: '19:00',
        end: '22:00',
        source: 'greenwichpeninsula.co.uk',
      },
    ],
    gettingThere: [
      'Seven minutes’ walk from North Greenwich station.',
      'While the Ordnance Crescent works are on, follow the signs via Waterview Drive and allow an extra five minutes.',
      'Driving: come in via Tunnel Avenue from the south, at the Blackwall Lane junction.',
    ],
    menus: [
      greenwichBreakfast,
      {
        id: 'main',
        label: 'Main menu',
        style: 'sheet',
        source: 'thejointldn.com/greenwich-menu, sheet 2 (Feb 2026)',
        sections: [
          {
            title: 'SMALL PLATES',
            items: [
              { name: 'Deep fried Mc n Cheese bites', price: '5.50', desc: 'Served with a sweet chilli dip', diet: ['v'] },
              { name: 'Small wings', price: '6.00', desc: 'Choose your sauce- BBQ/Buffalo/Plain' },
              { name: 'Crispy mozzarella sticks', price: '5.50', desc: 'Served with a sweet chilli dip', diet: ['v'] },
              {
                name: 'Nachos',
                price: '9.00',
                desc: 'Tortilla chips, salsa, guacamole, jalapeños, sour cream & cheese *add 16hr smoked pulled pork (extra £2)',
                diet: ['v'],
              },
            ],
          },
          {
            title: 'MAIN COURSE',
            items: [
              { name: 'Joint burger', price: 'Single/Double 8.95/11.75', desc: 'Cheeseburger with lettuce, tomato, house sauce' },
              {
                name: 'The Smokey burger',
                price: 'Single/Double 9.50/12.30',
                desc: '16hr smoked pulled pork, beef patty, cheese, pickles, pickle jalapeños, house sauce',
              },
              {
                name: 'Crispy Bird burger',
                price: '10.00',
                desc: 'Crispy buttermilk chicken , cheese, tomato, pickles, salad & buttered bun',
              },
              {
                name: 'The classic hotdog',
                price: '8.80',
                desc: 'Oak smoked beef and pork sausage, caramelised onions, bacon bits, ketchup & mustard',
              },
              { name: 'Award winning wings', price: '12.00', desc: 'Choose your sauce- BBQ/Buffalo/Plain' },
              {
                name: 'Grilled chicken salad',
                price: '13.00',
                desc: 'Grilled lemon and herb chicken , tomato, cucumber, salad , fresh lemon wedge, house seasoning & house sauce. Add fries 3.50',
              },
              {
                name: 'Bacon Joint burger',
                price: 'Single/Double 9.50/12.30',
                desc: 'Cheeseburger with smoked bacon, crispy onions, lettuce, tomato, house sauce',
              },
              { name: '16hr smoked pulled pork', price: '10.00', desc: 'Tender smoked pulled pork, house slaw & buttered bun' },
              {
                name: 'Buffalo Bird burger',
                price: '10.00',
                desc: 'Crispy buttermilk chicken , buffalo sauce, slaw, pickles & buttered bun',
              },
              {
                name: 'The cheesy hotdog',
                price: '9.00',
                desc: 'Oak smoked beef and pork sausage, nacho cheese sauce, caramelised onions, bacon bits & mustard',
              },
              { name: 'Crispy Bird chicken strips', price: '10.50', desc: 'Crispy buttermilk chicken lightly floured' },
              {
                name: 'Beyond meat burger',
                price: '10.00',
                desc: 'Beyond meat patty, cheese , tomato , lettuce & bun',
                diet: ['v', 'vg'],
              },
              {
                name: 'Vegan bowl',
                price: '13.00',
                desc: 'Mix of salad, avocado, chickpeas, cucumber & quinoa',
                diet: ['v', 'vg'],
              },
            ],
          },
          {
            title: 'SIDES',
            items: [
              { name: 'Fries', price: '5.00' },
              { name: 'Truffle fries', price: '6.20', desc: 'Truffle fries with parmesan' },
              { name: 'Dirty fries', price: '6.50', desc: 'Fries, cheese, bacon bits, caramelised onion' },
              { name: 'Coleslaw', price: '3.80' },
              { name: 'Sweet potato fries', price: '5.70' },
              { name: 'Cheesy fries', price: '6.00', desc: 'Fries with a cheese sauce' },
              { name: 'House salad', price: '4.00' },
              { name: 'Grilled corn on the cob', price: '3.50' },
            ],
          },
          {
            title: 'DESSERTS',
            items: [
              { name: 'Deep fried oreos', price: '6.00' },
              { name: 'Chocolate Brownie with vanilla ice cream', price: '6.00' },
            ],
          },
        ],
        footnotes: ['*Ask your server about allergens & intolerances', '**Discretionary 12% service charge is added to the bill'],
      },
      {
        id: 'pizza',
        label: 'Pizza',
        served: 'LIMITED PIZZA MENU',
        style: 'sheet',
        source: 'thejointldn.com/greenwich-menu, sheet 3 (Feb 2026)',
        sections: [
          {
            title: 'STARTER',
            items: [
              {
                name: 'Garlic and mozzarella sharer',
                price: '8.00',
                desc: 'Flatbread, topped with mozzarella and garlic',
                diet: ['v'],
              },
            ],
          },
          {
            title: 'PIZZA',
            items: [
              { name: 'Margarita', price: '14.00', desc: 'Tomato, mozzarella & basil', diet: ['v'] },
              { name: 'Pepperoni', price: '16.00', desc: 'Pepperoni, mozzarella and tomato' },
              { name: 'La Reine', price: '16.00', desc: 'Ham, black olives, mushrooms, mozzarella and tomato' },
              { name: 'Meat feast', price: '17.00', desc: 'Pepperoni, ham, chicken mozzarella , tomato and house BBQ sauce' },
            ],
          },
          {
            title: 'DIPS AND OIL',
            items: [
              { name: 'Garlic and herb', price: '2.00' },
              { name: 'BBQ sauce', price: '2.00' },
              { name: 'Chilli oil', price: '1.50' },
            ],
          },
        ],
        footnotes: ['*Ask your server about allergens & intolerances', '**Discretionary 12% service charge is added to the bill'],
      },
    ],
    photos: {
      hero: 'gw-sunset',
      heroAlt: 'The Greenwich roof terrace at sunset, Canary Wharf on the skyline',
      gallery: [
        { slug: 'gw-music', alt: 'Live acoustic set on the terrace, golf range and Canary Wharf behind' },
        { slug: 'gw-neon', alt: 'The Joint logo on the glass above the Greenwich bar' },
        { slug: 'gw-drinks', alt: 'Cocktails, a burger and fries in baskets on the terrace' },
        { slug: 'gw-o2-night', alt: 'The terrace at night with the O2 lit up behind' },
        { slug: 'gw-day', alt: 'The roof terrace on a bright day, the O2 next door' },
        { slug: 'gw-pass', alt: 'Burgers in baskets waiting at the pass' },
      ],
    },
    hireName: 'Greenwich',
    theme: {
      bg: '#131a30',
      surface: '#1c2440',
      ink: '#f6efe4',
      muted: '#a9b0c8',
      accent: '#f6a53b',
      accentInk: '#f6a53b',
      onAccent: '#0f0f0e',
      rule: '#f6efe4',
    },
  },
  {
    id: 'bermondsey',
    name: 'Bermondsey',
    kicker: 'Inside Bermondsey Bar & Kitchen',
    line: 'Great food and even better energy.',
    blurb: [
      'Find us at Bermondsey Bar & Kitchen on Bermondsey Street. Open daily, it’s home to live music, weekend DJ sets and all the biggest games on two giant screens.',
      'The food is ours: burgers, wings, dirty fries and J’s hot sauce.',
    ],
    highlights: ['Live music Fridays', 'DJ Saturdays', 'Two giant screens'],
    address: ['Bermondsey Bar & Kitchen', '40 Bermondsey Street', 'London SE1 3UD'],
    mapQuery: 'Bermondsey Bar & Kitchen, 40 Bermondsey Street, London SE1 3UD',
    phone: {
      display: '020 7407 6079',
      tel: '+442074076079',
      label: 'Bermondsey Bar & Kitchen',
      source: 'camra.org.uk listing (Jul 2026)',
    },
    email: 'Bermondsey@thejointldn.com',
    hours: [
      {
        label: 'Bar',
        ranges: [
          { days: [1, 2, 3], open: '12:00', close: '22:30' },
          { days: [4, 5, 6], open: '12:00', close: '23:00' },
          { days: [0], open: '12:00', close: '18:00' },
        ],
        source: 'bermondseybarandkitchen.co.uk/contact',
      },
      {
        label: 'Kitchen',
        ranges: [
          { days: [1, 2, 3, 4, 5, 6], open: '12:00', close: '21:30' },
          { days: [0], open: '12:00', close: '16:00' },
        ],
        source: 'bermondseybarandkitchen.co.uk/contact',
      },
    ],
    services: ['Eat in'],
    order: [],
    booking: {
      mode: 'request',
      note: 'The bar also takes table bookings through DesignMyNight.',
      external: {
        label: 'Book with the bar',
        href: 'https://www.designmynight.com/london/bars/bermondsey/bermondsey-bar-kitchen',
      },
    },
    events: [
      { day: 5, title: 'Live music', detail: 'Live Music Fridays', source: 'bermondseybarandkitchen.co.uk/whats-on' },
      { day: 6, title: 'DJ', detail: 'DJ Saturdays', source: 'bermondseybarandkitchen.co.uk/whats-on' },
    ],
    menus: [
      {
        id: 'main',
        label: 'Main menu',
        served: 'MAIN MENU',
        style: 'sheet',
        source: 'thejointldn.com/bermondsey-menu (bermondsey_main_menu_sheet)',
        sections: [
          {
            title: 'MAIN MENU',
            items: [
              {
                name: 'JOINT BURGER - SINGLE / DOUBLE',
                price: '9.00/12.50',
                desc: 'CHEESEBURGER WITH LETTUCE, TOMATO, HOUSE SAUCE',
              },
              {
                name: 'THE SMOKEY BURGER - SINGLE / DOUBLE',
                price: '9.50/13.00',
                desc: '16HR SMOKED PULLED PORK, BEEF PATTY, CHEESE, PICKLES, PICKLE JALAPEÑOS & HOUSE SAUCE',
              },
              {
                name: 'BACON JOINT BURGER - SINGLE / DOUBLE',
                price: '9.50/13.00',
                desc: 'CHEESEBURGER WITH SMOKED BACON, CRISPY ONIONS, LETTUCE, TOMATO & HOUSE SAUCE',
              },
              { name: '16HR SMOKED PULLED PORK', price: '10.00', desc: 'TENDER SMOKED PULLED PORK & HOUSE SLAW' },
              {
                name: 'BUFFALO BIRD BURGER',
                price: '10.00',
                desc: 'CRISPY BUTTERMILK CHICKEN , BUFFALO SAUCE, SLAW & PICKLES',
              },
              {
                name: 'CRISPY BIRD BURGER',
                price: '10.00',
                desc: 'CRISPY BUTTERMILK CHICKEN , CHEESE, TOMATO, PICKLES & SALAD',
              },
              { name: 'CRISPY BIRD CHICKEN STRIPS', price: '10.50', desc: 'CRISPY BUTTERMILK CHICKEN LIGHTLY FLOURED' },
              { name: 'CHICKEN WINGS', price: '12.00', desc: 'CHOOSE YOUR SAUCE– BBQ/ HOT BBQ/ KOREAN/ PLAIN' },
              {
                name: 'NACHOS',
                price: '9.50',
                desc: 'TORTILLA CHIPS, SALSA, GUACAMOLE, JALAPEÑOS, SOUR CREAM & CHEESE (+ ADD 16HR SMOKED PULLED PORK 2.00)',
                diet: ['v'],
              },
              {
                name: 'GRILLED CHICKEN SALAD',
                price: '11.00',
                desc: 'GRILLED LEMON AND HERB CHICKEN , TOMATO, CUCUMBER, SALAD , FRESH LEMON WEDGE, HOUSE SEASONING & HOUSE SAUCE. CHOOSE YOUR SAUCE– LEMON & HERB / CAJUN / J’S HOT SAUCE',
              },
              {
                name: 'HALLOUMI BURGER',
                price: '10.00',
                desc: 'GRILLED HALLOUMI, PICKLE CUCUMBER, PICKLE ONION, GUACAMOLE & ROCKET',
                diet: ['v'],
              },
              {
                name: 'BEYOND MEAT BURGER - SINGLE / DOUBLE',
                price: '10.00 / 13.50',
                desc: 'BEYOND MEAT PATTY, CHEESE, TOMATO & LETTUCE',
                diet: ['v', 'vg'],
              },
              {
                name: 'VEGAN BOWL',
                price: '10.00',
                desc: 'MIX OF SALAD, AVOCADO, CHICKPEAS, CUCUMBER & QUINOA',
                diet: ['v', 'vg'],
              },
            ],
          },
          {
            title: 'SIDES',
            items: [
              { name: 'FRIES', price: '5.00' },
              { name: 'SWEET POTATO FRIES', price: '6.00' },
              { name: 'CHEESY FRIES', price: '6.00', desc: 'FRIES WITH A CHEESE SAUCE' },
              { name: 'TRUFFLE FRIES', price: '6.20', desc: 'TRUFFLE FRIES WITH PARMESAN' },
              { name: 'DIRTY FRIES', price: '6.50', desc: 'FRIES, CHEESE, BACON BITS, CARAMELISED ONION' },
              { name: 'COLESLAW', price: '4.00' },
              { name: 'HOUSE SALAD', price: '4.00' },
              { name: 'GRILLED CORN ON THE COB', price: '3.70' },
              { name: 'DEEP FRIED MAC N CHEESE BITES (5)', price: '5.70', desc: 'SERVED WITH SWEET CHILLI DIP' },
              { name: 'DEEP FRIED PICKLE POPS (4)', price: '5.00' },
            ],
          },
          {
            title: 'SAUCES',
            note: '0.50',
            items: [
              { name: 'J’S HOT SAUCE' },
              { name: 'LEMON & HERB' },
              { name: 'CAJUN' },
              { name: 'BBQ / HOT BBQ' },
              { name: 'KOREAN' },
            ],
          },
          {
            title: 'DESSERTS',
            items: [
              { name: 'DEEP FRIED OREOS', price: '6.00' },
              { name: 'TRIPLE CHOCOLATE BROWNIE', price: '6.00', desc: 'SERVED WITH VANILLA ICE CREAM' },
            ],
          },
        ],
        footnotes: [
          '*ASK YOUR SERVER ABOUT ALLERGENS & INTOLERANCES',
          '**DISCRETIONARY 12.5% SERVICE CHARGE IS ADDED TO THE BILL',
        ],
      },
    ],
    photos: {
      hero: 'wings-closeup',
      heroAlt: 'Award winning wings, mac n cheese bites and ribs on enamel plates',
      gallery: [
        { slug: 'burger-double', alt: 'A double cheeseburger on an enamel plate' },
        { slug: 'mac-bites', alt: 'Deep fried mac n cheese bites with a dip' },
        { slug: 'pulled-pork', alt: '16hr smoked pulled pork in a bun with slaw' },
      ],
    },
    hireName: 'Bermondsey',
    social: [{ label: '@bermondseybarkitchen', href: 'https://www.instagram.com/bermondseybarkitchen/' }],
    theme: {
      bg: '#0e0e0d',
      surface: '#1a1a18',
      ink: '#f4f1ea',
      muted: '#a7a39a',
      accent: '#ff69b4',
      accentInk: '#ff7fbf',
      onAccent: '#0f0f0e',
      rule: '#f4f1ea',
    },
  },
  {
    id: 'hays',
    name: 'Hays Galleria',
    kicker: 'The Burger Hut + the Sweet Hut',
    line: 'Need a legendary burger on the move?',
    blurb: [
      'The Joint Burger Hut sits inside Hays Bar on the river at Hay’s Galleria, London Bridge: grab and go, or pull up a chair at the bar.',
      'Don’t forget dessert. Swing by the Sweet Hut for fresh churros and fluffy mini pancakes.',
    ],
    highlights: ['Grab and go', 'Churros and mini pancakes', 'Order by QR from your table'],
    address: ['Hays on the River, Hay’s Galleria', '1 Battle Bridge Lane', 'London SE1 2HD'],
    mapQuery: 'Hays on the River, Hay’s Galleria, 1 Battle Bridge Lane, London SE1 2HD',
    email: 'Hays@thejointldn.com',
    extraEmail: { label: 'Groups & exclusive hire at the bar', address: 'haysontheriver@onecircle.co.uk' },
    hours: [
      {
        label: 'Burger Hut',
        ranges: [{ days: [0, 1, 2, 3, 4, 5, 6], open: '12:00', close: '21:00' }],
        source: 'haysontheriver.co.uk',
      },
      {
        label: 'Sweet Hut',
        ranges: [{ days: [0, 1, 2, 3, 4, 5, 6], open: '12:00', close: '21:00' }],
        source: 'haysontheriver.co.uk',
      },
      {
        label: 'Bar',
        ranges: [
          { days: [1, 2, 3, 4, 5], open: '12:00', close: '22:00' },
          { days: [0, 6], open: '11:00', close: '22:00' },
        ],
        source: 'haysontheriver.co.uk',
      },
    ],
    services: ['Grab and go', 'Order at the hut', 'QR table ordering'],
    order: [],
    booking: {
      mode: 'walk-in',
      note: 'Hays is mostly walk-in: scan the QR code at your table, or order at the hut. Groups of 10–15 can request a table.',
      groupMin: 10,
      groupMax: 15,
    },
    events: [],
    menus: [],
    photos: {
      hero: 'burger-crispy',
      heroAlt: 'A crispy chicken burger on an enamel plate',
      gallery: [
        { slug: 'gw-pass', alt: 'Burgers in baskets at the pass' },
        { slug: 'sweet-fries', alt: 'Sweet potato fries in an enamel dish' },
      ],
    },
    hireName: 'London Bridge (Hays Galleria)',
    theme: {
      bg: '#f7f5f0',
      surface: '#ffffff',
      ink: '#14213d',
      muted: '#4c5670',
      accent: '#1f3a8a',
      accentInk: '#1f3a8a',
      onAccent: '#ffffff',
      rule: '#1f3a8a',
    },
  },
];

export const venueById = Object.fromEntries(venues.map((v) => [v.id, v])) as Record<VenueId, Venue>;

/** Hays has no published item list; this is what the venue itself says is on. */
export const haysOffer = {
  burgerHut: {
    title: 'The Joint Burger Hut',
    lines: ['Hearty The Joint burgers, grab and go.', 'Order at the hut, or scan the QR code at your table.'],
  },
  sweetHut: {
    title: 'The Sweet Hut',
    lines: ['Fresh churros.', 'Fluffy mini pancakes.'],
  },
  note: 'The Hays item list isn’t published online yet, so it isn’t listed here.',
};

export const brand = {
  founded: 2013,
  tagline: 'Brunch.. BBQ.. Bar..',
  promise: 'No two Joint locations are the same.',
  formula: ['Great food.', 'Local ingredients.', 'Good vibes.'],
  about: [
    'Founded in 2013 as a humble pop-up in Brixton, The Joint was born from a simple obsession: high-quality ingredients and slow-cooked flavours.',
    'The crowds spoke, the pop-up stayed, and what started as a local secret grew into four very different places.',
  ],
  instagram: 'https://www.instagram.com/thejointldn/',
  tiktok: 'https://www.tiktok.com/@thejointldn',
  x: 'https://x.com/thejointldn',
  generalEmail: 'Info@thejointldn.com',
};

export const monthlySpecial = {
  label: 'monthly special',
  name: 'American Classic',
  desc: 'Two 4oz mustard-seared beef patties, melted American cheese, and caramelised onions. Topped with dill pickles, salad, and our signature classic sauce on a toasted sesame brioche bun.',
  source: 'thejointldn.com homepage, October 2026',
};

export const awards = {
  verified: [
    {
      title: 'Wingfest London 2015',
      detail: '1st place, Best Wild Wing (Judge’s Choice)',
      href: 'https://www.wingfest.co.uk/awards/',
    },
  ],
  claims: [
    'Winners: Wingfest & Wingjam',
    'Top 5: Best Ribs in London',
    'Winner: Best Beef Burger in London',
    'Top 10: BBQ Restaurants in the UK',
  ],
  tv: 'BBC’s Best Ever Dishes with Tom Kerridge',
  press: ['Evening Standard', 'The Guardian', 'Foodism'],
  quotes: [
    {
      text: 'Brunch and BBQ spot The Joint is not trying to be anything other than what it is.',
      who: 'SheerLuxe',
      when: 'October 2024',
      href: 'https://sheerluxe.com/culture/restaurants-bars/best-restaurants-brixton',
    },
    {
      text: 'Its 16-hour smoked pulled pork is tender and succulent',
      who: 'SheerLuxe',
      when: 'October 2024',
      href: 'https://sheerluxe.com/culture/restaurants-bars/best-restaurants-brixton',
    },
    {
      text: 'Perhaps the best brunch in Brixton',
      who: 'Teaspoon of Adventure',
      when: '2026',
      href: 'https://teaspoonofadventure.com/places-to-eat-in-brixton/',
    },
    {
      text: 'You can’t come to The Joint and not order their award-winning wings',
      who: 'Teaspoon of Adventure',
      when: '2026',
      href: 'https://teaspoonofadventure.com/places-to-eat-in-brixton/',
    },
    {
      text: 'A brilliant place in trendy Brixton market with amazing BBQ food',
      who: 'Harden’s survey, London’s top 10 American-inspired BBQ joints',
      when: '2017',
      href: 'https://www.hardens.com/uk-london/28-06-2017/londons-top-10-american-inspired-bbq-joint/',
    },
  ],
};

/** Their own captions, verbatim, from @thejointldn. */
export const instagramLines = [
  { text: 'Napkins are available. You’ll need them.', date: '31 Jul 2026', href: 'https://www.instagram.com/p/DbdG5HBk_Rm/' },
  { text: 'Some things just can’t be rushed.', date: '16 Aug 2026', href: 'https://www.instagram.com/p/DcGTmSOG3qb/' },
  {
    text: 'Crispy, tender - we’ve seen people change direction halfway down the market after spotting this.',
    date: '8 Aug 2026',
    href: 'https://www.instagram.com/p/DbxtMtjG3TN/',
  },
  { text: 'A lighter option. Still doesn’t mess about.', date: '18 Aug 2026', href: 'https://www.instagram.com/p/DcLdL6JG4p8/' },
  {
    text: '3 sliders and a pint for £15. Mondays, Tuesdays & Thursdays. No bad combos, to be fair.',
    date: '24 Aug 2026',
    href: 'https://www.instagram.com/p/Dca67W3uskH/',
  },
];

export type EnquiryType = 'christmas' | 'private-hire' | 'corporate' | 'food-truck' | 'office-delivery';

export const hire = {
  christmasOpens: '2026-11-01',
  types: [
    {
      id: 'christmas' as EnquiryType,
      title: 'Christmas',
      line: 'Specialised holiday menus tailored to your party’s size and dietary requirements, from a small gathering to a large corporate do.',
      venues: ['brixton', 'greenwich', 'bermondsey', 'hays'] as VenueId[],
    },
    {
      id: 'private-hire' as EnquiryType,
      title: 'Private hire',
      line: 'A few tables or a full takeover. Full and partial venue hire, from the sunset terraces of Greenwich to the high-energy vibes of Bermondsey.',
      venues: ['brixton', 'greenwich', 'bermondsey', 'hays'] as VenueId[],
    },
    {
      id: 'corporate' as EnquiryType,
      title: 'Event or corporate',
      line: 'Office parties to milestone celebrations, with menus designed to fit all budgets and group sizes.',
      venues: ['brixton', 'greenwich', 'bermondsey', 'hays'] as VenueId[],
    },
    {
      id: 'food-truck' as EnquiryType,
      title: 'Food truck & catering',
      line: 'The truck travels nationwide. Weddings, corporate parties, brand launches, festivals: flexible menus from our classic burgers to bespoke packages.',
      venues: [] as VenueId[],
    },
    {
      id: 'office-delivery' as EnquiryType,
      title: 'Office delivery',
      line: 'If your office is nearby, we’ll bring the burgers. Tell your local restaurant what you need.',
      venues: ['brixton', 'greenwich', 'bermondsey', 'hays'] as VenueId[],
    },
  ],
  events: ['Chelsea Flower Show', 'Royal Ascot', 'Wilderness', 'Latitude'],
  occasions: ['Weddings', 'Brand launches', 'Corporate functions', 'Festivals'],
};

/** "I'm after…" shortcuts that send people to the right Joint. Every reason is from the venue facts above. */
export const occasions: { label: string; venue: VenueId; why: string }[] = [
  { label: 'Bottomless brunch', venue: 'brixton', why: 'Sunday to Friday at Brixton, £35pp for 2 hours.' },
  { label: 'Sunset drinks', venue: 'greenwich', why: 'Roof terrace at Greenwich, Canary Wharf to the west.' },
  { label: 'Breakfast at 8', venue: 'greenwich', why: 'Greenwich serves breakfast buns from 8am to 11am.' },
  { label: 'The match', venue: 'greenwich', why: 'Greenwich shows every game on Sky Sports and TNT.' },
  { label: 'Big screens & a DJ', venue: 'bermondsey', why: 'Bermondsey: two giant screens, DJ Saturdays.' },
  { label: 'Live music', venue: 'greenwich', why: 'Thursdays at Greenwich, 7–10pm. Fridays at Bermondsey.' },
  { label: 'Lunch by London Bridge', venue: 'hays', why: 'The Burger Hut at Hays Galleria, grab and go from 12pm.' },
  { label: 'Churros', venue: 'hays', why: 'The Sweet Hut at Hays Galleria: churros and mini pancakes.' },
  { label: 'Where it started', venue: 'brixton', why: 'Brixton Village, since the 2013 pop-up.' },
];
