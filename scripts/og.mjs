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

// 1200x630 social card: a restrained typographic identity card, no stock imagery.
const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0B0B0C"/>
  <rect x="36" y="36" width="1128" height="558" fill="none" stroke="#2B2B2F" stroke-width="1"/>
  <g transform="translate(84 92)" fill="#D9612F">
    <rect x="0" y="0" width="76" height="18"/><rect x="10" y="26" width="76" height="18"/>
    <rect x="20" y="52" width="76" height="18"/><rect x="30" y="78" width="76" height="18"/>
  </g>
  <text x="206" y="162" font-family="Archivo,Helvetica,Arial,sans-serif" font-size="29" font-weight="600" letter-spacing="12" fill="#F2F0EB">KAEDUAS</text>
  <text x="84" y="330" font-family="Archivo,Helvetica,Arial,sans-serif" font-size="92" font-weight="500" letter-spacing="-3" fill="#F2F0EB">Graphic design.</text>
  <text x="84" y="430" font-family="Archivo,Helvetica,Arial,sans-serif" font-size="76" font-weight="500" letter-spacing="-2" fill="#D9612F">Generative video.</text>
  <line x1="84" y1="496" x2="1116" y2="496" stroke="#45454A" stroke-width="1"/>
  <text x="84" y="546" font-family="JetBrains Mono,monospace" font-size="17" letter-spacing="3" fill="#A0A0A8">QJ MOTSAMAI  /  SOUTH AFRICA</text>
</svg>`;
await sharp(Buffer.from(og)).png({ quality: 92 }).toFile(join(pub, 'og-image.png'));

console.log('✓ icon-192.png, icon-512.png, favicon.ico, og-image.png rendered to public/');
