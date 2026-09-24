/**
 * Catalogue data — the single place to edit products, looks and collections.
 * Image values are asset names resolved by `src/lib/img.ts` (public/img/<name>-<width>.webp).
 */

export type Shot = {
  name: string;
  /** object-position for the crop, e.g. "50% 20%" */
  pos?: string;
  /** >1 turns the shot into a tight detail crop of the same photograph */
  zoom?: number;
};

export type Colour = { id: string; label: string; hex: string; shots: Shot[] };

export type Category = 'Tops' | 'Bottoms' | 'Outerwear' | 'Sets' | 'Dresses' | 'Accessories';
export type CollectionId = 'salt' | 'iron' | 'chalk';
export type Badge = 'New' | 'Bestseller' | 'Limited' | 'Low stock';

export type Product = {
  id: string;
  no: string;
  name: string;
  category: Category;
  collection: CollectionId;
  price: number;
  /** original price when on sale */
  was?: number;
  badge?: Badge;
  isNew?: boolean;
  colours: Colour[];
  sizes: string[];
  soldOut?: string[];
  /** units left — shown when low */
  stock?: number;
  line: string;
  description: string;
  composition: string;
  fit: string;
  care: string;
};

const ALPHA = ['XS', 'S', 'M', 'L', 'XL'];
const WAIST = ['26', '28', '30', '32', '34'];

export const products: Product[] = [
  {
    id: 'atelier-blazer',
    no: '01',
    name: 'Atelier Blazer',
    category: 'Outerwear',
    collection: 'chalk',
    price: 4900,
    badge: 'Bestseller',
    colours: [
      {
        id: 'sand',
        label: 'Sand',
        hex: '#C9B79C',
        shots: [{ name: 'hero-full' }, { name: 'hero-main' }, { name: 'hero-detail', pos: '50% 30%' }, { name: 'hero-bw' }, { name: 'hero-alt' }],
      },
    ],
    sizes: ALPHA,
    soldOut: ['XS'],
    line: 'Oversized, cut long, worn like a coat.',
    description:
      'Our signature oversized blazer in dry wool twill. Dropped, unpadded shoulders so it hangs off you, not on you. Horn buttons, half-lined, finished by hand in our Downtown workshop.',
    composition: '100% wool. Lining 100% cupro.',
    fit: 'Oversized — take your usual size. Model is 176 cm and wears S.',
    care: 'Dry clean. Steam to refresh.',
  },
  {
    id: 'heavy-tee',
    no: '02',
    name: 'Heavy Tee',
    category: 'Tops',
    collection: 'chalk',
    price: 1250,
    badge: 'Bestseller',
    colours: [
      { id: 'bone', label: 'Bone', hex: '#EDE9E1', shots: [{ name: 'p-tee-1' }, { name: 'p-tee-2', pos: '50% 20%' }] },
      { id: 'ash', label: 'Ash', hex: '#6F6A60', shots: [{ name: 'look-02', pos: '50% 22%' }, { name: 'look-07', pos: '50% 22%' }] },
      { id: 'clay', label: 'Clay', hex: '#8D6A55', shots: [{ name: 'look-03', pos: '50% 22%' }, { name: 'look-01', pos: '50% 25%' }] },
      { id: 'ink', label: 'Ink', hex: '#1B1A19', shots: [{ name: 'look-06', pos: '50% 22%' }, { name: 'look-06', pos: '50% 30%', zoom: 1.6 }] },
    ],
    sizes: ALPHA,
    line: '320 gsm Egyptian cotton. Boxy. Heavy. Yours.',
    description:
      'The tee everything else is built around. Knitted from long-staple Egyptian cotton at 320 gsm, then garment-dyed so every piece fades a little differently.',
    composition: '100% Egyptian cotton, 320 gsm.',
    fit: 'Boxy, dropped shoulder. Size down for a closer fit.',
    care: 'Wash cold, inside out. Dry flat.',
  },
  {
    id: 'saffron-cargo',
    no: '03',
    name: 'Saffron Cargo',
    category: 'Bottoms',
    collection: 'salt',
    price: 2100,
    badge: 'New',
    isNew: true,
    colours: [
      { id: 'saffron', label: 'Saffron', hex: '#C9772B', shots: [{ name: 'look-05', pos: '50% 72%' }, { name: 'look-05', pos: '50% 72%', zoom: 1.7 }] },
    ],
    sizes: WAIST,
    stock: 4,
    line: 'Parachute trouser dyed the colour of the spice market.',
    description: 'Wide, gathered-hem cargo in washed silk-touch nylon. Two bellows pockets, drawcord waist, zero chill.',
    composition: '100% recycled nylon.',
    fit: 'Wide, gathered at the ankle.',
    care: 'Machine wash cold.',
  },
  {
    id: 'olive-set',
    no: '04',
    name: 'Olive Utility Set',
    category: 'Sets',
    collection: 'iron',
    price: 4200,
    badge: 'New',
    isNew: true,
    colours: [
      { id: 'olive', label: 'Olive', hex: '#7D8468', shots: [{ name: 'p-set-bomber', pos: '50% 35%' }, { name: 'p-set-olive', pos: '50% 40%' }] },
    ],
    sizes: ALPHA,
    line: 'Bomber + cargo. One colour, head to toe.',
    description: 'A washed-nylon bomber and matching wide cargo sold together. Wear them as a set or split them up — we won’t tell.',
    composition: 'Shell 100% nylon. Lining 100% polyester.',
    fit: 'Relaxed. Bomber is cropped at the hip.',
    care: 'Machine wash cold, hang dry.',
  },
  {
    id: 'column-trouser',
    no: '05',
    name: 'Column Trouser',
    category: 'Bottoms',
    collection: 'chalk',
    price: 2200,
    colours: [
      { id: 'ink', label: 'Ink', hex: '#151414', shots: [{ name: 'look-03', pos: '50% 78%' }, { name: 'look-01', pos: '50% 70%', zoom: 1.35 }] },
    ],
    sizes: WAIST,
    line: 'High, straight, a little too long on purpose.',
    description: 'Fluid high-rise trouser in heavy crêpe that pools over the shoe. Flat front, hidden side zip.',
    composition: '70% triacetate, 30% polyester.',
    fit: 'High rise, straight leg, 84 cm inseam.',
    care: 'Cool wash. Hang to dry.',
  },
  {
    id: 'soft-sac',
    no: '06',
    name: 'Soft Sac',
    category: 'Accessories',
    collection: 'iron',
    price: 3600,
    badge: 'Limited',
    colours: [{ id: 'ink', label: 'Ink', hex: '#121212', shots: [{ name: 'p-bag-1' }, { name: 'look-04', pos: '45% 28%', zoom: 1.5 }] }],
    sizes: ['One size'],
    stock: 3,
    line: 'Slouchy calf leather. Holds your whole day.',
    description: 'Cut from a single hide of vegetable-tanned leather. No lining, no logos on the outside — just a magnetic closure and a short handle that sits under the arm.',
    composition: 'Vegetable-tanned calf leather.',
    fit: '32 × 18 × 12 cm. Handle drop 17 cm.',
    care: 'Condition twice a year. Keep dry.',
  },
  {
    id: 'nocturne-blazer',
    no: '07',
    name: 'Nocturne Blazer',
    category: 'Outerwear',
    collection: 'iron',
    price: 5200,
    colours: [{ id: 'ink', label: 'Ink', hex: '#1A1918', shots: [{ name: 'p-blazer-ink-1', pos: '50% 40%' }, { name: 'p-blazer-ink-2', pos: '50% 35%' }] }],
    sizes: ALPHA,
    line: 'A pinstripe you notice at arm’s length.',
    description: 'Tonal pinstripe wool, deep low gorge, single button. Closes like a wrap and falls to the upper thigh.',
    composition: '96% wool, 4% cashmere.',
    fit: 'Relaxed and long.',
    care: 'Dry clean.',
  },
  {
    id: 'moss-blazer',
    no: '08',
    name: 'Moss Check Blazer',
    category: 'Outerwear',
    collection: 'salt',
    price: 4600,
    was: 5400,
    colours: [{ id: 'moss', label: 'Moss', hex: '#5E6A4E', shots: [{ name: 'p-blazer-moss', pos: '50% 30%' }, { name: 'p-blazer-moss', pos: '40% 40%', zoom: 1.7 }] }],
    sizes: ALPHA,
    soldOut: ['S'],
    line: 'Vintage houndstooth energy, new cut.',
    description: 'A boyfriend blazer in micro-houndstooth wool. Patch pockets, notch lapel, slightly padded shoulder.',
    composition: '80% wool, 20% polyamide.',
    fit: 'Boyfriend fit.',
    care: 'Dry clean.',
  },
  {
    id: 'linen-overshirt',
    no: '09',
    name: 'Linen Overshirt',
    category: 'Tops',
    collection: 'salt',
    price: 2400,
    colours: [{ id: 'chalk', label: 'Chalk', hex: '#F3F1EC', shots: [{ name: 'p-shirt-1', pos: '50% 30%' }, { name: 'p-shirt-2', pos: '50% 30%' }] }],
    sizes: ALPHA,
    line: 'Washed Nile-delta linen. Summer uniform.',
    description: 'Heavy linen, stone-washed till it drapes like old cotton. Band collar, deep side vents — wear it open as a jacket.',
    composition: '100% linen.',
    fit: 'Generous, mid-thigh.',
    care: 'Machine wash 30°. Line dry.',
  },
  {
    id: 'crew-sweat',
    no: '10',
    name: 'Chalk Crew Sweat',
    category: 'Tops',
    collection: 'chalk',
    price: 1850,
    badge: 'New',
    isNew: true,
    colours: [{ id: 'chalk', label: 'Chalk', hex: '#F4F2EE', shots: [{ name: 'p-sweat' }, { name: 'p-sweat', pos: '50% 20%', zoom: 1.8 }] }],
    sizes: ALPHA,
    line: 'Brushed-back fleece. The one you’ll steal back.',
    description: 'A 420 gsm loopback crewneck with raglan sleeves and a ribbed hem that actually holds its shape.',
    composition: '100% Egyptian cotton, 420 gsm.',
    fit: 'Relaxed.',
    care: 'Wash cold.',
  },
  {
    id: 'check-coat',
    no: '11',
    name: 'Archive Check Coat',
    category: 'Outerwear',
    collection: 'iron',
    price: 6400,
    badge: 'Limited',
    colours: [
      { id: 'check', label: 'Ink / Chalk', hex: '#5A5854', shots: [{ name: 'p-coat-1', pos: '50% 35%' }, { name: 'p-coat-1', pos: '42% 70%', zoom: 1.9 }] },
    ],
    sizes: ALPHA,
    soldOut: ['L'],
    stock: 5,
    line: 'Re-cut from a 1970s pattern in our archive.',
    description: 'Double-breasted overcoat in brushed wool check. Wide lapels, raglan sleeve, hand-felled collar. 40 pieces only.',
    composition: '90% wool, 10% alpaca.',
    fit: 'Oversized.',
    care: 'Dry clean.',
  },
  {
    id: 'wide-trouser',
    no: '12',
    name: 'Balloon Trouser',
    category: 'Bottoms',
    collection: 'iron',
    price: 2300,
    colours: [{ id: 'ink', label: 'Ink', hex: '#161616', shots: [{ name: 'p-wide-trouser', pos: '50% 50%' }, { name: 'p-wide-trouser', pos: '50% 60%', zoom: 1.5 }] }],
    sizes: WAIST,
    line: 'Huge volume, pleated waist, zero regrets.',
    description: 'Deep-pleated balloon trouser in fluid twill. Elasticated back waist and tapered hem.',
    composition: '100% viscose twill.',
    fit: 'Very wide, tapered ankle.',
    care: 'Cool wash.',
  },
  {
    id: 'tee-dress',
    no: '13',
    name: 'Long Tee Dress',
    category: 'Dresses',
    collection: 'chalk',
    price: 1650,
    colours: [
      { id: 'graphite', label: 'Graphite', hex: '#4A4A4A', shots: [{ name: 'look-04', pos: '50% 30%' }, { name: 'look-04', pos: '50% 40%', zoom: 1.5 }] },
      { id: 'olive', label: 'Olive', hex: '#6B6553', shots: [{ name: 'look-07', pos: '50% 30%' }, { name: 'look-07', pos: '50% 40%', zoom: 1.5 }] },
    ],
    sizes: ALPHA,
    line: 'The Heavy Tee, stretched to mid-thigh.',
    description: 'Our 320 gsm jersey cut into a long, dropped-shoulder dress. Mineral-washed for a lived-in surface.',
    composition: '100% Egyptian cotton.',
    fit: 'Oversized, mid-thigh.',
    care: 'Wash cold, dry flat.',
  },
  {
    id: 'blazer-dress',
    no: '14',
    name: 'Blazer Dress',
    category: 'Dresses',
    collection: 'iron',
    price: 3900,
    badge: 'New',
    isNew: true,
    colours: [{ id: 'char', label: 'Charcoal', hex: '#3A3835', shots: [{ name: 'p-blazer-dress', pos: '50% 35%' }, { name: 'p-blazer-dress', pos: '50% 30%', zoom: 1.6 }] }],
    sizes: ALPHA,
    line: 'Power shoulders. That’s the whole outfit.',
    description: 'A blazer cut long enough to be a dress. Structured shoulder, single hidden button, two flap pockets.',
    composition: '64% polyester, 34% viscose, 2% elastane.',
    fit: 'Tailored through the body.',
    care: 'Dry clean.',
  },
  {
    id: 'barrel-bag',
    no: '15',
    name: 'Barrel Bag',
    category: 'Accessories',
    collection: 'salt',
    price: 2900,
    colours: [{ id: 'tan', label: 'Tan', hex: '#B06A34', shots: [{ name: 'p-bag-barrel', pos: '50% 40%' }, { name: 'p-bag-barrel', pos: '40% 30%', zoom: 1.6 }] }],
    sizes: ['One size'],
    line: 'Crossbody barrel in glazed tan leather.',
    description: 'A compact barrel bag in glazed cowhide with an adjustable strap. Fits phone, keys, cards and not much else — that’s the point.',
    composition: 'Glazed cowhide leather.',
    fit: '22 × 11 cm. Strap 110–130 cm.',
    care: 'Wipe clean.',
  },
  {
    id: 'salt-blazer',
    no: '16',
    name: 'Salt Blazer',
    category: 'Outerwear',
    collection: 'salt',
    price: 4300,
    was: 4900,
    colours: [{ id: 'salt', label: 'Salt', hex: '#ECE8E1', shots: [{ name: 'p-blazer-salt', pos: '50% 35%' }, { name: 'p-blazer-salt', pos: '50% 60%', zoom: 1.6 }] }],
    sizes: ALPHA,
    line: 'Summer-weight tailoring in off-white.',
    description: 'Unlined cotton-linen blazer with a soft shoulder. Built for evenings on the corniche.',
    composition: '55% linen, 45% cotton.',
    fit: 'Relaxed.',
    care: 'Dry clean or cool hand wash.',
  },
  {
    id: 'poplin-shirt',
    no: '17',
    name: 'Poplin Shirt',
    category: 'Tops',
    collection: 'chalk',
    price: 1950,
    colours: [{ id: 'white', label: 'White', hex: '#FAFAF7', shots: [{ name: 'p-poplin', pos: '50% 30%' }, { name: 'p-poplin', pos: '50% 30%', zoom: 1.7 }] }],
    sizes: ALPHA,
    line: 'Crisp, boxy, tucks in or doesn’t.',
    description: 'A boxy poplin shirt with a point collar and a longer back hem. Wear it with the tie, or not.',
    composition: '100% cotton poplin.',
    fit: 'Boxy.',
    care: 'Machine wash 40°.',
  },
  {
    id: 'sling-bag',
    no: '18',
    name: 'Crescent Sling',
    category: 'Accessories',
    collection: 'salt',
    price: 2400,
    badge: 'Low stock',
    colours: [{ id: 'cognac', label: 'Cognac', hex: '#9A5A2C', shots: [{ name: 'p-bag-sling', pos: '50% 50%' }, { name: 'p-bag-sling', pos: '60% 40%', zoom: 1.6 }] }],
    sizes: ['One size'],
    stock: 2,
    line: 'Half-moon, worn on the back.',
    description: 'A crescent-shaped sling in soft cognac leather that sits flat against the back.',
    composition: 'Calf leather.',
    fit: '38 × 20 cm.',
    care: 'Condition twice a year.',
  },
  {
    id: 'work-jacket',
    no: '19',
    name: 'Stone Work Jacket',
    category: 'Outerwear',
    collection: 'iron',
    price: 3800,
    colours: [{ id: 'stone', label: 'Stone', hex: '#9A958B', shots: [{ name: 'p-work-jacket', pos: '50% 30%' }, { name: 'p-work-jacket', pos: '55% 30%', zoom: 1.6 }] }],
    sizes: ALPHA,
    line: 'Garment-dyed canvas trucker.',
    description: 'A boxy work jacket in garment-dyed cotton canvas with a corduroy collar.',
    composition: '100% cotton canvas.',
    fit: 'Boxy, cropped.',
    care: 'Machine wash cold.',
  },
  {
    id: 'cloud-knit',
    no: '20',
    name: 'Cloud Knit',
    category: 'Tops',
    collection: 'salt',
    price: 2600,
    was: 3100,
    colours: [{ id: 'oat', label: 'Oat', hex: '#E3D9C7', shots: [{ name: 'p-knit' }, { name: 'p-knit', pos: '50% 60%', zoom: 1.6 }] }],
    sizes: ALPHA,
    line: 'Chunky rib knit, very soft, very oversized.',
    description: 'Hand-finished chunky rib jumper in a cotton-wool blend.',
    composition: '70% cotton, 30% wool.',
    fit: 'Oversized.',
    care: 'Hand wash, dry flat.',
  },
];

export const productById = (id: string) => products.find((p) => p.id === id);

/* ——— shop filters ——— */
export type Filter = 'all' | 'new' | Category | 'sale' | CollectionId;

export const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'new', label: 'New in' },
  { id: 'Tops', label: 'Tops' },
  { id: 'Bottoms', label: 'Bottoms' },
  { id: 'Outerwear', label: 'Outerwear' },
  { id: 'Sets', label: 'Sets' },
  { id: 'Dresses', label: 'Dresses' },
  { id: 'Accessories', label: 'Bags' },
  { id: 'sale', label: 'Sale' },
];

export const matchesFilter = (p: Product, f: Filter) => {
  if (f === 'all') return true;
  if (f === 'new') return !!p.isNew;
  if (f === 'sale') return !!p.was;
  if (f === 'salt' || f === 'iron' || f === 'chalk') return p.collection === f;
  return p.category === f;
};

/* ——— looks (signature scroll scene) ——— */
export type LookPiece = { productId: string; colourId: string; size: string };
export type Look = {
  id: string;
  no: string;
  title: string;
  mood: string;
  image: string;
  /** framing to keep the model anchored between photographs */
  frame: { x: number; y: number; scale: number; bright: number };
  tint: string;
  pieces: LookPiece[];
};

export const looks: Look[] = [
  {
    id: 'total-ink',
    no: '01',
    title: 'Total Ink',
    mood: 'Black on black. No notes.',
    image: 'look-06',
    frame: { x: 4, y: 1.5, scale: 0.96, bright: 1.15 },
    tint: '#1B1A19',
    pieces: [
      { productId: 'heavy-tee', colourId: 'ink', size: 'M' },
      { productId: 'column-trouser', colourId: 'ink', size: '28' },
    ],
  },
  {
    id: 'ash-undone',
    no: '02',
    title: 'Ash, Undone',
    mood: 'Oversized tee, old denim, new bag.',
    image: 'look-02',
    frame: { x: 4, y: 0, scale: 1, bright: 1.16 },
    tint: '#6F6A60',
    pieces: [
      { productId: 'heavy-tee', colourId: 'ash', size: 'L' },
      { productId: 'soft-sac', colourId: 'ink', size: 'One size' },
    ],
  },
  {
    id: 'clay-hour',
    no: '03',
    title: 'Clay Hour',
    mood: 'Warm top, cold line.',
    image: 'look-03',
    frame: { x: 7, y: 0, scale: 1, bright: 1.22 },
    tint: '#8D6A55',
    pieces: [
      { productId: 'heavy-tee', colourId: 'clay', size: 'M' },
      { productId: 'column-trouser', colourId: 'ink', size: '28' },
    ],
  },
  {
    id: 'night-shift',
    no: '04',
    title: 'Night Shift',
    mood: 'Same tee, heels on. Going out.',
    image: 'look-01',
    frame: { x: 3, y: 0, scale: 1.1, bright: 1.26 },
    tint: '#5B4637',
    pieces: [
      { productId: 'heavy-tee', colourId: 'clay', size: 'S' },
      { productId: 'column-trouser', colourId: 'ink', size: '26' },
    ],
  },
  {
    id: 'graphite-errand',
    no: '05',
    title: 'Graphite Errand',
    mood: 'Everything you need, under one arm.',
    image: 'look-04',
    frame: { x: 2, y: 0, scale: 1, bright: 1.1 },
    tint: '#4A4A4A',
    pieces: [
      { productId: 'tee-dress', colourId: 'graphite', size: 'S' },
      { productId: 'soft-sac', colourId: 'ink', size: 'One size' },
    ],
  },
  {
    id: 'olive-easy',
    no: '06',
    title: 'Olive, Easy',
    mood: 'One piece. Sneakers. Done.',
    image: 'look-07',
    frame: { x: 3, y: 1, scale: 0.96, bright: 1.15 },
    tint: '#6B6553',
    pieces: [{ productId: 'tee-dress', colourId: 'olive', size: 'M' }],
  },
  {
    id: 'saffron-noon',
    no: '07',
    title: 'Saffron Noon',
    mood: 'The loudest colour we make.',
    image: 'look-05',
    frame: { x: 0, y: 0, scale: 1, bright: 1.17 },
    tint: '#C9772B',
    pieces: [
      { productId: 'heavy-tee', colourId: 'bone', size: 'L' },
      { productId: 'saffron-cargo', colourId: 'saffron', size: '28' },
    ],
  },
];

/* ——— collections (lookbook) ——— */
export type Collection = {
  id: CollectionId;
  numeral: string;
  title: string;
  tagline: string;
  caption: string;
  bg: string;
  fg: string;
  images: string[];
};

export const collections: Collection[] = [
  {
    id: 'salt',
    numeral: '01',
    title: 'Salt',
    tagline: 'Linen, sun, sea air.',
    caption: 'Shot on the coast road west of Alexandria at 6am. Light layers that move before you do.',
    bg: '#D6CBBB',
    fg: '#1A1815',
    images: ['salt-2', 'salt-1', 'salt-4'],
  },
  {
    id: 'iron',
    numeral: '02',
    title: 'Iron',
    tagline: 'Downtown after dark.',
    caption: 'Black wool, leather and the city’s leftover light. Built for late nights and early flights.',
    bg: '#131211',
    fg: '#E9E4DA',
    images: ['iron-1', 'iron-3', 'iron-2'],
  },
  {
    id: 'chalk',
    numeral: '03',
    title: 'Chalk',
    tagline: 'White room. Sharp lines.',
    caption: 'Our essentials: heavy tees, clean tailoring, nothing extra.',
    bg: '#ECEAE5',
    fg: '#131211',
    images: ['chalk-1', 'chalk-2', 'chalk-4'],
  },
];

export const FREE_SHIPPING = 3000;

export const money = (n: number) => `EGP ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)}`;
