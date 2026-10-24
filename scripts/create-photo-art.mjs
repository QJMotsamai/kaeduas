// Apply the exact Kaeduas and ORUVI graphic identities to photographic mockup scenes.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const designDir = 'public/design-work';
const sourceDir = 'scripts/assets';
await mkdir(designDir, { recursive: true });

const ink = '#0B0B0C';
const bone = '#F2F0EB';
const ember = '#D9612F';
const oruviInk = '#183C34';
const oruviCream = '#F4EFDF';
const oruviOrange = '#E65B3A';
const oruviLime = '#DCE989';

function kaeduasLockup(color = ink, scale = 1, subline = '') {
  const bars = [0, 9.5, 18.5, 27.5].map((offset, i) =>
    `<rect x="${i % 2 ? offset : offset}" y="${5.5 + i * 24}" width="72" height="17"/>`
  ).join('');
  return `<g transform="scale(${scale})" fill="${color}">${bars}<text x="118" y="64" font-family="Arial,Helvetica,sans-serif" font-size="46" font-weight="600" letter-spacing="8">KAEDUAS</text>${subline ? `<text x="120" y="92" font-family="Arial,Helvetica,sans-serif" font-size="11" letter-spacing="3">${subline}</text>` : ''}</g>`;
}

function oruviLockup(x, y, scale = 1, color = oruviInk) {
  return `<g transform="translate(${x} ${y}) scale(${scale})" fill="${color}">
    <circle cx="26" cy="26" r="23" fill="none" stroke="${color}" stroke-width="2"/>
    <path d="M13 29C15 17 28 10 40 15C38 27 28 37 13 29Z"/>
    <path d="M14 29L39 16" stroke="${oruviCream}" stroke-width="1.5" fill="none"/>
    <text x="61" y="36" font-family="Arial,Helvetica,sans-serif" font-size="34" font-weight="700" letter-spacing="5">ORUVI</text>
  </g>`;
}

function svgOverlay(width, height, content) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${content}</svg>`);
}

// Exact lockups on the clean fabric panel and rigid mailer, rather than generated lettering.
const kaeduasBase = `${sourceDir}/kaeduas-applications.jpg`;
const kaeduasOut = `${designDir}/kaeduas-applications-branded.jpg`;
const kaeduasOverlay = svgOverlay(1408, 768, `
  <g transform="translate(500 370)" opacity=".92">${kaeduasLockup(ink, .4, 'STUDIO GOODS')}</g>
  <g transform="translate(930 335)" opacity=".94">${kaeduasLockup(ink, .54, 'CREATIVE PRACTICE / SOUTH AFRICA')}</g>
`);
await sharp(kaeduasBase).composite([{ input: kaeduasOverlay, left: 0, top: 0 }]).jpeg({ quality: 92, mozjpeg: true }).toFile(kaeduasOut);

// A clean, exact label on the front-facing hero can.
const oruviBase = `${sourceDir}/oruvi-campaign.jpg`;
const oruviPack = `${designDir}/oruvi-packaging.jpg`;
const canLabel = svgOverlay(928, 1152, `
  <g font-family="Arial,Helvetica,sans-serif" text-anchor="middle">
    <text x="464" y="672" fill="${oruviInk}" font-size="42" font-weight="700" letter-spacing="6">ORUVI</text>
    <line x1="397" y1="699" x2="531" y2="699" stroke="${oruviOrange}" stroke-width="3"/>
    <text x="464" y="732" fill="${oruviInk}" font-size="11" font-weight="700" letter-spacing="2">BOTANICAL SODA</text>
    <text x="464" y="756" fill="${oruviInk}" font-size="9" letter-spacing="1">GRAPEFRUIT + BUCHU</text>
    <circle cx="464" cy="788" r="14" fill="${oruviOrange}"/>
    <path d="M464 776C456 784 458 795 464 801C471 794 471 783 464 776Z" fill="${oruviCream}"/>
    <text x="464" y="824" fill="${oruviInk}" font-size="8" font-weight="700" letter-spacing="1.5">A LITTLE BRIGHTER</text>
  </g>
`);
await sharp(oruviBase).composite([{ input: canLabel, left: 0, top: 0 }]).jpeg({ quality: 92, mozjpeg: true }).toFile(oruviPack);

// Social-first campaign art: photographic product scene with designed editorial typography.
const socialOverlay = svgOverlay(928, 1152, `
  <defs><linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#102B26" stop-opacity=".78"/><stop offset=".27" stop-color="#102B26" stop-opacity="0"/><stop offset=".78" stop-color="#102B26" stop-opacity="0"/><stop offset="1" stop-color="#102B26" stop-opacity=".88"/></linearGradient></defs>
  <rect width="928" height="1152" fill="url(#shade)"/>
  ${oruviLockup(55, 48, 1, oruviCream)}
  <text x="58" y="176" fill="${oruviCream}" font-family="Georgia,serif" font-size="35" font-style="italic">A pause in</text>
  <text x="58" y="222" fill="${oruviLime}" font-family="Arial,Helvetica,sans-serif" font-size="34" font-weight="700" letter-spacing="-1">your afternoon.</text>
  <text x="58" y="1090" fill="${oruviCream}" font-family="Arial,Helvetica,sans-serif" font-size="13" font-weight="600" letter-spacing="2">GRAPEFRUIT + BUCHU  ·  BOTANICAL SODA</text>
  <text x="58" y="1122" fill="${oruviCream}" font-family="Arial,Helvetica,sans-serif" font-size="9" letter-spacing="2">INDEPENDENT SPEC CONCEPT  /  ORUVI</text>
`);
await sharp(oruviBase).composite([{ input: socialOverlay, left: 0, top: 0 }]).jpeg({ quality: 92, mozjpeg: true }).toFile(`${designDir}/oruvi-digital.jpg`);

// Print adaptation: art-directed poster layout, preserving a photographic image field.
const posterSvg = svgOverlay(900, 1200, `
  <rect width="900" height="1200" fill="${oruviCream}"/>
  <rect x="24" y="24" width="852" height="1152" fill="none" stroke="${oruviInk}" stroke-width="2"/>
  <rect x="24" y="24" width="852" height="12" fill="${oruviOrange}"/>
  ${oruviLockup(66, 66, 1, oruviInk)}
  <text x="68" y="235" fill="${oruviInk}" font-family="Arial,Helvetica,sans-serif" font-size="52" font-weight="700" letter-spacing="-2">TAKE THE LONG WAY.</text>
  <text x="70" y="278" fill="${oruviInk}" font-family="Georgia,serif" font-size="22" font-style="italic">Grapefruit + buchu. A pause with a little sparkle.</text>
  <image href="data:image/jpeg;base64,PRODUCT_IMAGE" x="68" y="320" width="764" height="748" preserveAspectRatio="xMidYMid slice"/>
  <rect x="68" y="320" width="764" height="748" fill="none" stroke="${oruviInk}" stroke-width="1"/>
  <text x="68" y="1115" fill="${oruviInk}" font-family="Arial,Helvetica,sans-serif" font-size="13" font-weight="600" letter-spacing="2">ORUVI  /  BOTANICAL SODA</text>
  <text x="68" y="1146" fill="${oruviInk}" font-family="Arial,Helvetica,sans-serif" font-size="9" letter-spacing="1.5">INDEPENDENT SPEC CONCEPT — NOT CLIENT WORK</text>
`);
const productBase64 = (await sharp(oruviPack).jpeg({ quality: 82 }).toBuffer()).toString('base64');
const poster = Buffer.from(posterSvg.toString().replace('PRODUCT_IMAGE', productBase64));
await sharp(poster).jpeg({ quality: 92, mozjpeg: true }).toFile(`${designDir}/oruvi-print.jpg`);

// Add typographic identity to the blank fascia on the real counter display.
const posOverlay = svgOverlay(1408, 768, `
  <text x="824" y="141" fill="${oruviCream}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="38" font-weight="700" letter-spacing="6">ORUVI</text>
  <text x="824" y="174" fill="${oruviLime}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="12" font-weight="600" letter-spacing="3">BOTANICAL SODA</text>
  <text x="664" y="632" fill="${oruviCream}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="13" font-weight="600" letter-spacing="2">A LITTLE BRIGHTER</text>
`);
await sharp(`${sourceDir}/oruvi-pos.jpg`).composite([{ input: posOverlay, left: 0, top: 0 }]).jpeg({ quality: 92, mozjpeg: true }).toFile(`${designDir}/oruvi-point-of-sale.jpg`);

// Brand the front-facing sampling sign in the retail scene.
const retailOverlay = svgOverlay(1408, 768, `
  <text x="754" y="191" fill="${oruviInk}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="48" font-weight="700" letter-spacing="8">ORUVI</text>
  <text x="754" y="233" fill="${oruviOrange}" text-anchor="middle" font-family="Arial,Helvetica,sans-serif" font-size="15" font-weight="600" letter-spacing="3">BOTANICAL SODA BAR</text>
  <text x="754" y="282" fill="${oruviInk}" text-anchor="middle" font-family="Georgia,serif" font-size="21" font-style="italic">Open a little brighter.</text>
`);
await sharp(`${sourceDir}/oruvi-retail.jpg`).composite([{ input: retailOverlay, left: 0, top: 0 }]).jpeg({ quality: 92, mozjpeg: true }).toFile(`${designDir}/oruvi-retail-branded.jpg`);

console.log('Rendered photographic, branded artwork.');
