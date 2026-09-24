/**
 * Image pipeline. Downloads the placeholder campaign photography (Unsplash, free licence)
 * and writes responsive WebP renditions to public/img/<name>-<width>.webp.
 * To swap in real brand photography: drop files named the same way into public/img
 * (or point `src` below at local files) and re-run `npm run images`.
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const OUT = path.resolve('public/img');
const WIDTHS = [720, 1080, 1400];

// name -> unsplash photo id
const IMAGES = {
  // hero / campaign — sand blazer series
  'hero-main': 'MNwRn2MMHPM',
  'hero-detail': '2UyY8ix-Dxg',
  'hero-bw': 'hnAWDdHSgSI',
  'hero-full': '9aemur7ARHc',
  'hero-alt': 'P0PfQk_vxTw',
  // signature: one model, five looks
  'look-01': 'V0RVqZ69JEg',
  'look-02': '54EWNIGurW4',
  'look-03': 'uPJi1jMB9FY',
  'look-04': 'zEGIgG2aYyQ',
  'look-05': 'l1Qx95KnqVg',
  'look-06': 'pEcc6vGpm74',
  'look-07': 'Su_IaoGIjBg',
  // chapter I — salt (shoreline)
  'salt-1': 'nADQXDkPaKE',
  'salt-2': 'D9ngHG-BPAY',
  'salt-3': 'T1uxce_1tHM',
  'salt-4': 'WlJNORhz8-U',
  // chapter II — iron (night)
  'iron-1': 'qf3EqtPFS7g',
  'iron-2': 'W7jOp_RFX50',
  'iron-3': 'AUQHoJY2ju4',
  'iron-4': 'hUTJ_uceIcY',
  // chapter III — chalk (studio b/w)
  'chalk-1': '3GD47kbiQ_Y',
  'chalk-2': 'UzqLTRZorBg',
  'chalk-3': 'CkH8PiV2qsA',
  'chalk-4': 'LLKu9dGnXKE',
  'chalk-5': 'u1OuYQa0WtQ',
  // products
  'p-blazer-ink-1': 'oMGpPyYuOPw',
  'p-blazer-ink-2': '8RBQPiyPaps',
  'p-tee-1': '4rUYuwJ2vGw',
  'p-tee-2': 'Dddi23xkZGc',
  'p-shirt-1': 'k0ohMLEKfNM',
  'p-shirt-2': 'EfhtWVXOhUw',
  'p-bag-1': 'dfBa1wgTqKc',
  'p-bag-2': 'J9PGbtyQ08Q',
  'p-coat-1': 'TH4uTM5K6VA',
  'p-coat-2': 'QzbbXcpukpM',
  // craft / material
  'mat-wool': 'VT1l61Uw9y0',
  'mat-camel': 'K3BcdJfO0iw',
  'mat-knit': 'o9dtfshlJ60',
  'mat-hanger': '-Ah6NPOCTvI',
  'mat-rail': '7La_6VBJSa0',
  'mat-leather': 'rpUKVRCyceo',
  // shop — extended catalogue
  'p-sweat': '7cERndkOyDw',
  'p-blazer-moss': 'CqwVcsOZil4',
  'p-blazer-salt': 'U7SoZPZS1u0',
  'p-blazer-db': 'AYuGyjeEbkY',
  'p-blazer-grey': 'qw3PKqZnzdE',
  'p-poplin': 'i6PTrG-cDUQ',
  'p-work-jacket': 'fDeUJwHy9RA',
  'p-wide-trouser': '7sA1agAJDhQ',
  'p-bag-barrel': '34mc9TqRznQ',
  'p-bag-sling': 'lCYfAJPp61o',
  'p-bag-model': 'Hq5TCM2H_JE',
  'p-knit': '5MtJ_fsAR2s',
  'p-set-olive': 'UmxUs4QFhtQ',
  'p-set-bomber': 'G1pmCNNXI2k',
  'p-blazer-dress': 'IBpMxx4lqtw',
  'p-check-man': 'ID8-h2XNDoU',
};

fs.mkdirSync(OUT, { recursive: true });
const credits = [];
for (const [name, id] of Object.entries(IMAGES)) {
  credits.push(`${name}: https://unsplash.com/photos/${id}`);
  if (WIDTHS.every((w) => fs.existsSync(`${OUT}/${name}-${w}.webp`))) continue;
  const res = await fetch(`https://unsplash.com/photos/${id}/download?force=true&w=2000`);
  if (!res.ok) { console.error('failed', name, id, res.status); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  for (const w of WIDTHS) {
    await sharp(buf).rotate().resize({ width: w, withoutEnlargement: true }).webp({ quality: w > 1000 ? 74 : 70 }).toFile(`${OUT}/${name}-${w}.webp`);
  }
  console.log('ok', name);
}
fs.writeFileSync(path.join(OUT, 'CREDITS.txt'), credits.join('\n') + '\n');
