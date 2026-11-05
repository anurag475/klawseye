// What customers choose from in the nail designer. Everything here comes from the studio's shade cards and
// charm photos. Entries are stand-ins until those arrive:
//  - Shades: add each shade's `code` from its shade card and set `colour` to match. Once every shade has a
//    code, the "preview" note in the designer disappears.
//  - Charms: add each charm's photo to public/charms/ and set `image` to its path. Once every charm has a
//    photo, the "preview" note disappears. To add a new charm, `art` can be left out.

export type ShadeFamily = "solid" | "catEye" | "jelly";

export const shadeFamilies: { id: ShadeFamily; label: string }[] = [
  { id: "solid", label: "Solid colours" },
  { id: "catEye", label: "Cat-eye" },
  { id: "jelly", label: "Jelly" },
];

export type Shade = { id: string; family: ShadeFamily; name: string; code?: string; colour: string };

export const shades: Shade[] = [
  { id: "solid-blush", family: "solid", name: "Blush", colour: "var(--brand-blush)" },
  { id: "solid-rose", family: "solid", name: "Rose", colour: "var(--brand-rose)" },
  { id: "solid-hot-pink", family: "solid", name: "Hot pink", colour: "var(--nail-hot)" },
  { id: "solid-cherry", family: "solid", name: "Cherry", colour: "var(--nail-cherry)" },
  { id: "solid-nude", family: "solid", name: "Nude", colour: "var(--nail-nude)" },
  { id: "solid-milk", family: "solid", name: "Milk", colour: "var(--nail-milk)" },
  { id: "solid-lilac", family: "solid", name: "Lilac", colour: "var(--nail-lilac)" },
  { id: "solid-sky", family: "solid", name: "Sky", colour: "var(--nail-sky)" },
  { id: "solid-sage", family: "solid", name: "Sage", colour: "var(--nail-sage)" },
  { id: "solid-navy", family: "solid", name: "Navy", colour: "var(--primary)" },
  { id: "solid-ink", family: "solid", name: "Ink", colour: "var(--nail-ink)" },
  { id: "solid-gold", family: "solid", name: "Gold", colour: "var(--nail-gold)" },

  { id: "cateye-ruby", family: "catEye", name: "Ruby", colour: "oklch(0.42 0.17 20)" },
  { id: "cateye-plum", family: "catEye", name: "Plum", colour: "oklch(0.38 0.11 320)" },
  { id: "cateye-midnight", family: "catEye", name: "Midnight", colour: "oklch(0.3 0.08 265)" },
  { id: "cateye-emerald", family: "catEye", name: "Emerald", colour: "oklch(0.42 0.1 165)" },
  { id: "cateye-mocha", family: "catEye", name: "Mocha", colour: "oklch(0.4 0.06 50)" },
  { id: "cateye-champagne", family: "catEye", name: "Champagne", colour: "oklch(0.74 0.06 80)" },

  { id: "jelly-pink", family: "jelly", name: "Pink jelly", colour: "oklch(0.75 0.15 0)" },
  { id: "jelly-peach", family: "jelly", name: "Peach jelly", colour: "oklch(0.8 0.11 55)" },
  { id: "jelly-honey", family: "jelly", name: "Honey jelly", colour: "oklch(0.84 0.13 88)" },
  { id: "jelly-matcha", family: "jelly", name: "Matcha jelly", colour: "oklch(0.82 0.12 130)" },
  { id: "jelly-aqua", family: "jelly", name: "Aqua jelly", colour: "oklch(0.8 0.1 210)" },
  { id: "jelly-lilac", family: "jelly", name: "Lilac jelly", colour: "oklch(0.76 0.11 305)" },
];

export const shadeLabel = (shade: Shade) => (shade.code ? `${shade.code} · ${shade.name}` : shade.name);
export const shadesArePreview = shades.some(shade => !shade.code);

/** Built-in drawing used on the nail preview and in the charm browser until a charm has a photo. */
export type CharmArtName = "pearls" | "star" | "cross" | "heart" | "bow" | "cherry" | "flower";

export type CharmOption = { id: string; name: string; group: string; code?: string; image?: string; art?: CharmArtName };

export const charmOptions: CharmOption[] = [
  { id: "cross", name: "Cross", group: "Crosses", art: "cross" },
  { id: "star", name: "Star", group: "Stars", art: "star" },
  { id: "heart", name: "Heart", group: "Hearts & bows", art: "heart" },
  { id: "bow", name: "Bow", group: "Hearts & bows", art: "bow" },
  { id: "flower", name: "Flower", group: "Florals & fruit", art: "flower" },
  { id: "cherry", name: "Cherry", group: "Florals & fruit", art: "cherry" },
  { id: "pearls", name: "Pearls", group: "Pearls", art: "pearls" },
];

export const charmGroups = [...new Set(charmOptions.map(charm => charm.group))];
export const charmLabel = (charm: CharmOption) => (charm.code ? `${charm.code} · ${charm.name}` : charm.name);
export const charmsArePreview = charmOptions.some(charm => !charm.image);
