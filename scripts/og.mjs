// Renders the brand OG image and PWA icons from SVG — pixel-exact type,
// no rasterization surprises. Run: npm run og
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
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

// 1200x630 OG card — layers, ember glow, exact typography
const og = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="0.82" cy="0.2" r="0.9">
      <stop offset="0" stop-color="#3a1d10"/>
      <stop offset="0.5" stop-color="#160f0c"/>
      <stop offset="1" stop-color="#0a0a0b"/>
    </radialGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#9E3F1E"/>
      <stop offset="0.55" stop-color="#D9612F"/>
      <stop offset="1" stop-color="#F07A45"/>
    </linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0a0a0b" stop-opacity="0"/>
      <stop offset="1" stop-color="#0a0a0b" stop-opacity="0.9"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- stacked layers, top right, clear of the type -->
  <g transform="translate(830,58)" opacity="0.98">
    <rect x="26" y="0"   width="310" height="36" rx="5" fill="#E5703C"/>
    <rect x="0"  y="58"  width="310" height="36" rx="5" fill="#C2531F"/>
    <rect x="26" y="116" width="310" height="36" rx="5" fill="#9E3F1E"/>
    <rect x="0"  y="174" width="310" height="36" rx="5" fill="#712D12"/>
  </g>

  <!-- wordmark -->
  <g font-family="Archivo, Helvetica, Arial, sans-serif">
    <text x="72" y="128" font-size="28" letter-spacing="14" font-weight="600" fill="#D9612F">KAEDUAS</text>
    <text x="72" y="278" font-size="104" font-weight="500" letter-spacing="-3" fill="#F2F0EB">Build. Create.</text>
    <text x="72" y="392" font-size="104" font-weight="500" letter-spacing="-3" fill="#F2F0EB">Entertain. Inform.</text>
    <text x="72" y="506" font-size="104" font-weight="500" letter-spacing="-3" fill="#D9612F">Scale.</text>
  </g>

  <text x="72" y="578" font-family="JetBrains Mono, monospace" font-size="21" letter-spacing="4" fill="#9B9BA3">GENERATIVE VIDEO · AI ADVERTISING · WEB SYSTEMS</text>

  <rect width="1200" height="630" fill="url(#fade)" opacity="0.25"/>
</svg>`;
await sharp(Buffer.from(og)).png({ quality: 92 }).toFile(join(pub, 'og-image.png'));

console.log('✓ icon-192.png, icon-512.png, og-image.png rendered to public/');
