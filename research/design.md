# Design notes

**Palette.** Everything comes from The Joint's own material:
- **Black:** the Brixton fascia (and #000 on their site).
- **Paper:** the off-white of their typewritten Brixton menus and whitewashed scaffold-board tables.
- **Hot pink #FF69B4:** their site's buttons, and the section heads on the Brixton menus.
- **Navy:** the rim of the enamel plates every dish is photographed on.
- **Sunset amber and dusk navy:** Greenwich, taken straight from the roof-terrace shots.
- **Contrast:** checked at 5:1 or better for all text pairs.

**Type.**
- **Oswald and DM Sans:** the two families in thejointldn.com's CSS (Oswald uppercase for headings, DM Sans for body).
- **Courier Prime:** stands in for the typewriter face on the Brixton menus and the "Brunch.. BBQ.. Bar.." fascia lettering.
- **The logo:** traced from their PNG into SVG so it stays sharp and takes each venue's colour. The pig doodle that dots the i is kept.

**Layout.**
- **No full-bleed hero.** The page opens on a black signboard, like the shopfront, with their own line: "No two Joint locations are the same."
- **The venue boards come next.** Each is a signboard you can switch between.

**Each venue keeps its own character.** The picked venue re-themes the panel and its pages: CSS colour properties animate between venues, and each venue gets its own photo treatment.

| Venue | Look | Photo treatment | Menu style |
|---|---|---|---|
| Brixton | paper + pink | a paper-clipped print, as on their menus | typewriter, with brush-stroke labels |
| Greenwich | dusk + sunset | wide skyline | heavy caps between double rules, like their printed sheets |
| Bermondsey | black + pink | double rules, from its bar menu | heavy caps between double rules |
| Hays | white + navy rim | an enamel plate | (no menu published) |

**Signature interactions.**
1. **The venue switch.** The pig from the logo hops to the Joint you pick. Menu, hours, contact and what's on swap with it, and your pick follows you across pages.
2. **A "tonight" line, worked out in the browser:**
   - **Greenwich:** today's sunset over Canary Wharf from the terrace (NOAA solar maths, London time) with a sun arc, plus the next Thursday music night.
   - **Bermondsey:** Live Music Friday or DJ Saturday, plus the kitchen's open state.
   - **Brixton:** whether today is a bottomless brunch day.
   - **Hays:** whether the huts are open.

**Photos.** Only their own: the Greenwich Peninsula shoot (Justine Trickett) and the Brixton August 2023 shoot, from their media library. Neither Bermondsey nor Hays has a venue photo of its own, so those pages show Joint food, labelled as shot at Brixton/Greenwich.
