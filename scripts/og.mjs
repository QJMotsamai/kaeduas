// Renders the brand OG image and PWA icons from SVG — pixel-exact type,
// no rasterization surprises. Run: npm run og
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pub = join(root, 'public');
await mkdir(pub, { recursive: true });

const strata = (fill) => `
  <g fill="${fill}">
    <rect x="16" y="20" width="56" height="11" rx="1.5"/>
    <rect x="22" y="36.5" width="56" height="11" rx="1.5"/>
    <rect x="16" y="53" width="56" height="11" rx="1.5"/>
    <rect x="22" y="69.5" width="56" height="11" rx="1.5"/>
  </g>`;

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="22" fill="#0A0A0B"/>
  ${strata('#D9612F')}
</svg>`;
await sharp(Buffer.from(favicon)).resize(512, 512).png().toFile(join(pub, 'icon-512.png'));
await sharp(Buffer.from(favicon)).resize(192, 192).png().toFile(join(pub, 'icon-192.png'));

// favicon.ico: a single 48x48 PNG wrapped in an ICO container. Browsers and
// search engines fall back to /favicon.ico when the <link> tags are missed,
// so this file must exist at the site root.
const icoPng = await sharp(Buffer.from(favicon)).resize(48, 48).png().toBuffer();
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0);            // reserved
icoHeader.writeUInt16LE(1, 2);            // type: icon
icoHeader.writeUInt16LE(1, 4);            // image count
const icoEntry = Buffer.alloc(16);
icoEntry.writeUInt8(48, 0);               // width
icoEntry.writeUInt8(48, 1);               // height
icoEntry.writeUInt16LE(1, 4);             // color planes
icoEntry.writeUInt16LE(32, 6);            // bits per pixel
icoEntry.writeUInt32LE(icoPng.length, 8); // image size
icoEntry.writeUInt32LE(22, 12);           // image offset (6 + 16)
await writeFile(join(pub, 'favicon.ico'), Buffer.concat([icoHeader, icoEntry, icoPng]));

// 1200x630 social card: the photographic studio image, art-directed with a quiet title lockup.
const hero = await sharp(join(pub, 'editorial', 'studio-hero.jpg'))
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .modulate({ saturation: 0.72, brightness: 0.78 })
  .jpeg({ quality: 90, mozjpeg: true })
  .toBuffer();
const ogOverlay = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="wash" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0B0B0C" stop-opacity=".86"/>
      <stop offset=".52" stop-color="#0B0B0C" stop-opacity=".56"/>
      <stop offset="1" stop-color="#0B0B0C" stop-opacity=".16"/>
    </linearGradient>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
      <stop offset=".42" stop-color="#0B0B0C" stop-opacity="0"/>
      <stop offset="1" stop-color="#0B0B0C" stop-opacity=".65"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#wash)"/>
  <rect width="1200" height="630" fill="url(#ground)"/>
  <g fill="#F2F0EB" transform="translate(74 66)">
    <rect x="0" y="0" width="44" height="10"/><rect x="6" y="16" width="44" height="10"/>
    <rect x="12" y="32" width="44" height="10"/><rect x="18" y="48" width="44" height="10"/>
  </g>
  <text x="150" y="107" font-family="Archivo,Helvetica,Arial,sans-serif" font-size="22" letter-spacing="8" font-weight="600" fill="#F2F0EB">KAEDUAS</text>
  <text x="74" y="320" font-family="Archivo,Helvetica,Arial,sans-serif" font-size="112" font-weight="500" letter-spacing="-4" fill="#F2F0EB">Design with</text>
  <text x="74" y="434" font-family="Georgia,serif" font-size="112" font-style="italic" letter-spacing="-3" fill="#D9612F">feeling.</text>
  <line x1="74" y1="504" x2="1126" y2="504" stroke="#F2F0EB" stroke-opacity=".38"/>
  <text x="74" y="550" font-family="JetBrains Mono,monospace" font-size="17" letter-spacing="2.6" fill="#F2F0EB">GRAPHIC DESIGN · CONTENT STRATEGY · GENERATIVE VIDEO</text>
</svg>`;
await sharp(hero)
  .composite([{ input: Buffer.from(ogOverlay), top: 0, left: 0 }])
  .png()
  .toFile(join(pub, 'og-image.png'));

console.log('✓ icon-192.png, icon-512.png, favicon.ico, og-image.png rendered to public/');
