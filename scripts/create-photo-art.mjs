// Apply the exact identities to the two approved photographic product mockups.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const sourceDir = 'scripts/assets';
const outputDir = 'public/design-work';
await mkdir(outputDir, { recursive: true });

const ink = '#0B0B0C';
const oruviInk = '#183C34';
const oruviCream = '#F4EFDF';
const oruviOrange = '#E65B3A';

function kaeduasLockup(color, scale, subline = '') {
  const bars = [0, 9.5, 18.5, 27.5].map((offset, i) =>
    `<rect x="${offset}" y="${5.5 + i * 24}" width="72" height="17"/>`
  ).join('');
  return `<g transform="scale(${scale})" fill="${color}">${bars}<text x="118" y="64" font-family="Arial,Helvetica,sans-serif" font-size="46" font-weight="600" letter-spacing="8">KAEDUAS</text>${subline ? `<text x="120" y="92" font-family="Arial,Helvetica,sans-serif" font-size="11" letter-spacing="3">${subline}</text>` : ''}</g>`;
}
function svg(width, height, content) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${content}</svg>`);
}

const kaeduasOverlay = svg(1408, 768, `
  <g transform="translate(500 370)" opacity=".92">${kaeduasLockup(ink, .4, 'STUDIO GOODS')}</g>
  <g transform="translate(930 335)" opacity=".94">${kaeduasLockup(ink, .54, 'CREATIVE PRACTICE / SOUTH AFRICA')}</g>
`);
await sharp(`${sourceDir}/kaeduas-applications.jpg`)
  .composite([{ input: kaeduasOverlay }])
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(`${outputDir}/kaeduas-applications-branded.jpg`);

const oruviOverlay = svg(928, 1152, `
  <g font-family="Arial,Helvetica,sans-serif" text-anchor="middle" fill="${oruviInk}">
    <text x="464" y="672" font-size="42" font-weight="700" letter-spacing="6">ORUVI</text>
    <line x1="397" y1="699" x2="531" y2="699" stroke="${oruviOrange}" stroke-width="3"/>
    <text x="464" y="732" font-size="11" font-weight="700" letter-spacing="2">BOTANICAL SODA</text>
    <text x="464" y="756" font-size="9" letter-spacing="1">GRAPEFRUIT + BUCHU</text>
    <circle cx="464" cy="788" r="14" fill="${oruviOrange}"/>
    <path d="M464 776C456 784 458 795 464 801C471 794 471 783 464 776Z" fill="${oruviCream}"/>
    <text x="464" y="824" font-size="8" font-weight="700" letter-spacing="1.5">A LITTLE BRIGHTER</text>
    <text x="284" y="636" font-size="16" font-weight="700" letter-spacing="2">ORUVI</text>
    <text x="284" y="657" font-size="6.5" letter-spacing=".7">GINGER + LEMON</text>
    <text x="667" y="624" font-size="16" font-weight="700" letter-spacing="2">ORUVI</text>
    <text x="667" y="645" font-size="6.5" letter-spacing=".7">MINT + LIME</text>
  </g>
`);
await sharp(`${sourceDir}/oruvi-campaign.jpg`)
  .composite([{ input: oruviOverlay }])
  .jpeg({ quality: 92, mozjpeg: true })
  .toFile(`${outputDir}/oruvi-packaging.jpg`);

console.log('Branded the Kaeduas and ORUVI product mockups.');
