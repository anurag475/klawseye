const galleryImages = [
  "/WhatsApp Image 2026-10-13 at 1.39.19 PM (1).jpeg",
  "/WhatsApp Image 2026-10-13 at 1.39.19 PM.jpeg",
  "/WhatsApp Image 2026-10-13 at 1.40.11 PM (1).jpeg",
  "/WhatsApp Image 2026-10-13 at 1.40.11 PM.jpeg",
  "/WhatsApp Image 2026-10-13 at 1.41.18 PM.jpeg",
  "/WhatsApp Image 2026-10-13 at 1.49.46 PM.jpeg",
  "/WhatsApp Image 2026-10-13 at 1.50.12 PM.jpeg",
  "/WhatsApp Image 2026-10-13 at 1.51.19 PM.jpeg",
  "/WhatsApp Image 2026-10-13 at 12.13.04 AM.jpeg",
];

// Shop categories, in display order (set by the studio). The homepage groups sets under these and the
// navigation's Shop menu links to each one.
export const categories = [
  { slug: "beach-please", name: "BEACH PLEASE", blurb: "Sun, sea and summer-ready sets." },
  { slug: "whimsy-corner", name: "WHIMSY CORNER", blurb: "Playful, dreamy and a little bit magical." },
  { slug: "y2k-vibes", name: "Y2K VIBES", blurb: "Chrome, sparkle and early-2000s attitude." },
  { slug: "inspired-by", name: "INSPIRED BY", blurb: "Characters, artists and personalities." },
  { slug: "dark-side", name: "DARK SIDE", blurb: "Grunge and goth." },
  { slug: "everyday-klaws", name: "EVERYDAY KLAWS", blurb: "Clean girl and minimalist." },
  { slug: "maximalist", name: "MAXIMALIST", blurb: "More charms, more chrome, more everything." },
  { slug: "desi-klaws", name: "DESI KLAWS", blurb: "Ethnic and traditional." },
] as const;

export type CategoryName = (typeof categories)[number]["name"];

export const sizeOptions = [
  "Size: S (15, 11, 12, 11, 8mm)",
  "Size: M (16, 12, 13, 12, 9mm)",
  "Size: L (17, 13, 14, 13, 10mm)",
  "Custom Sizing",
] as const;

// Every set is handmade to order; the FAQ, bag and banner all read these.
export const preparationTime = "2–4 weeks";
export const preparationTimeBusy = "up to 5 weeks";
export const prepDisclaimer = "Each set is handmade to order. Please allow 2–4 weeks for preparation before dispatch. During busy periods, this may extend to 5 weeks. Express shipping does not reduce the preparation time.";
export const wearsPerSet = "6+";
/** Standard shipping charge, per order. */
export const shippingCharge = 85;

/** Delivery choices offered at checkout, charged per order. */
export const shippingOptions = [
  { id: "standard", label: "Standard Shipping", detail: "Pan India", price: shippingCharge },
  { id: "express-south", label: "Express Shipping", detail: "South India", price: 450 },
  { id: "express-north", label: "Express Shipping", detail: "North India & metro cities (commercial areas)", price: 350 },
] as const;

export type ShippingId = (typeof shippingOptions)[number]["id"];

export const shippingOptionOf = (id: ShippingId) => shippingOptions.find(option => option.id === id)!;

/** Optional add-on offered at checkout. Not a shop product, so it has no page of its own. */
export const nailRemover = { name: "Pain-Free Press-On Nail Remover", price: 150 };

/** What the order costs once the customer's checkout choices are applied. */
export function orderCharges(subtotal: number, shipping: ShippingId, withRemover: boolean) {
  const shippingPrice = shippingOptionOf(shipping).price;
  const addOnPrice = withRemover ? nailRemover.price : 0;
  return { shippingPrice, addOnPrice, total: subtotal + addOnPrice + shippingPrice };
}

export type Product = {
  id: number;
  name: string;
  /** Leave out until the studio confirms it; the set then shows "Price soon" and DM-to-order. */
  price?: number;
  image: string;
  /** Handmade sets belong to a category. Accessories such as the sizing kit don't. */
  category?: CategoryName;
  /** Extra categories the set is also listed under. */
  alsoIn?: CategoryName[];
  description: string;
  badge?: string;
  /** Real-life photos of the set, shown after the studio photo and its close-up. */
  realLifeImages?: string[];
  /** Point the close-up slide zooms into, as a CSS position. Defaults to the centre of the photo. */
  zoomFocus?: string;
  /** Kept in stock: no size to choose and no preparation time. */
  readyToShip?: boolean;
};

export const formatPrice = (price?: number) => (price === undefined ? "Price soon" : `₹${price.toLocaleString("en-IN")}`);

export const products: Product[] = [
  { id: 100, name: "SIZING KIT", price: 149, image: "/sets/sizing-kit.svg", description: "Find your perfect fit before you order a set. Ready to ship, so it skips the handmade preparation time.", readyToShip: true },

  // Studio sets
  { id: 11, name: "A TOUCH OF MAGIC", price: 1699, image: "/sets/a-touch-of-magic.jpg", category: "MAXIMALIST", description: "Hand-painted sparkles, silver glitter swirls and lily florals in navy, lavender and nude." },
  { id: 18, name: "BLUE NOVA", price: 799, image: "/sets/blue-nova.jpg", category: "Y2K VIBES", description: "Baby blue, glossy black and pearly white almonds with black stars, polka dots, stripes and silver studs." },
  { id: 17, name: "BARBIE REEF", price: 1899, image: "/sets/barbie-reef.jpg", category: "BEACH PLEASE", description: "Shimmery pink almonds with a 3D dolphin, seashells, iridescent lilies, pearls and gold beads." },
  { id: 16, name: "BANANA BABY", price: 1799, image: "/sets/banana-baby.jpg", category: "MAXIMALIST", alsoIn: ["WHIMSY CORNER"], description: "Coffin set in butter yellow, peach and pink with 3D monkeys, banana slices, polka dots, white florals and pearls." },
  { id: 15, name: "AURORA DRIFT", price: 1499, image: "/sets/aurora-drift.jpg", category: "BEACH PLEASE", alsoIn: ["WHIMSY CORNER"], description: "Turquoise and cocoa marble almonds with iridescent shell ridges, a pearly orange swirl, silver stars and gold beads." },
  { id: 14, name: "AQUA REGALIA", price: 2699, image: "/sets/aqua-regalia.jpg", category: "MAXIMALIST", alsoIn: ["DESI KLAWS"], description: "Turquoise, cognac and nude stilettos layered with sculpted gold filigree, opal and aqua cabochons and gold beading." },
  { id: 13, name: "AMBER BLOOM", price: 1899, image: "/sets/amber-bloom.jpg", category: "MAXIMALIST", description: "Tortoiseshell and molten gold with 3D blooms, a sculpted starfish, pearls and gold beading." },
  { id: 12, name: "AFTERGLOW", price: 1299, image: "/sets/afterglow.jpg", category: "Y2K VIBES", description: "Peachy nude almonds with midnight-blue glitter, chrome-framed hearts, silver starbursts and chrome French tips." },

  // Placeholder sets until the studio sends final photos, names and prices.
  { id: 0, name: "LIQUID CHROME SIREN", price: 2199, image: galleryImages[0]!, category: "Y2K VIBES", description: "3D silver droplets, molten chrome accents", badge: "BESTSELLER" },
  { id: 1, name: "STRAWBERRY MILK TARTAN", price: 1899, image: galleryImages[1]!, category: "WHIMSY CORNER", description: "Blush gingham with hand-sculpted pearl bows" },
  { id: 2, name: "GOTHIC CELESTIAL EYE", price: 2499, image: galleryImages[2]!, category: "DARK SIDE", description: "Gold wire wrapped amulets", badge: "SIGNATURE ART" },
  { id: 3, name: "OCEAN GLASS MERMAID", price: 2299, image: galleryImages[3]!, category: "BEACH PLEASE", description: "Turquoise stones, liquid gold cages, opalescent chrome base." },
  { id: 4, name: "CYBER PUNKETTE", price: 1999, image: galleryImages[4]!, category: "DARK SIDE", description: "Black French tip gradient with 3D sculpted thorn bands & crimson aura." },
  { id: 5, name: "CHERUB TEARS", price: 1699, image: galleryImages[5]!, category: "WHIMSY CORNER", description: "Soft blush pink aura gradient with iridescent raindrop pearls." },
  { id: 6, name: "CYBERIA CHROME", price: 2299, image: galleryImages[6]!, category: "MAXIMALIST", description: "Mirror finish liquid silver chrome with tribal sculpted 3D barbs." },
  { id: 7, name: "GINGHAM DREAM", price: 1899, image: galleryImages[7]!, category: "WHIMSY CORNER", description: "Official KLAWSEYE pink check tartan with miniature hand-painted ribbons.", badge: "SIGNATURE CHECK" },
  { id: 9, name: "MATCHA JELLY DROPS", price: 1599, image: galleryImages[0]!, category: "EVERYDAY KLAWS", description: "Glassy syrup jelly finish with sculpted clear water droplet accents." },
  { id: 10, name: "MIDNIGHT VELVET", price: 1999, image: galleryImages[1]!, category: "DARK SIDE", description: "Magnetic shifting cat-eye aura with embedded Swarovski micro-crystals." },
];

export const sets = products.filter(product => product.category);
export const sizingKit = products.find(product => product.readyToShip)!;

export const productSlug = (product: Product) => product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const findProductBySlug = (slug: string) => products.find(product => productSlug(product) === slug);

const inCategory = (product: Product, name: CategoryName) => product.category === name || Boolean(product.alsoIn?.includes(name));
export const setsInCategory = (name: CategoryName) => sets.filter(product => inCategory(product, name));
