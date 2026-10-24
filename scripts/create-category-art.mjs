import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const dir = 'public/design-work';
const previewDir = 'scratch/category-art';
await mkdir(dir, { recursive: true });
await mkdir(previewDir, { recursive: true });

const K = { ink: '#0B0B0C', bone: '#F2F0EB', ember: '#D9612F', muted: '#B9B9C0' };
const O = { green: '#183C34', deep: '#102B26', cream: '#F4EFDF', orange: '#E65B3A', lime: '#DCE989' };
const font = `font-family="Archivo,Arial,sans-serif"`;
const mono = `font-family="'JetBrains Mono',Consolas,monospace"`;
const serif = `font-family="'Instrument Serif',Georgia,serif"`;

function kaeduasMark(x = 0, y = 0, scale = 1, color = K.bone) {
  return `<g transform="translate(${x} ${y}) scale(${scale})" fill="${color}">
    <rect x="0" y="0" width="72" height="17"/><rect x="9.5" y="24" width="72" height="17"/>
    <rect x="18.5" y="48" width="72" height="17"/><rect x="27.5" y="72" width="72" height="17"/>
  </g>`;
}
function kaeduasLockup(x, y, color = K.bone) {
  return `${kaeduasMark(x, y - 30, .42, color)}<text x="${x + 50}" y="${y}" ${font} font-size="25" font-weight="600" letter-spacing="5" fill="${color}">KAEDUAS</text>`;
}
function oruviLockup(x, y, color = O.cream) {
  return `<g transform="translate(${x} ${y})" fill="${color}">
    <circle cx="19" cy="0" r="17" fill="none" stroke="${color}" stroke-width="1.7"/>
    <path d="M8 3C11 -7 22 -10 30 -5C28 5 18 10 8 3Z"/>
    <path d="M9 3L29 -5" stroke="${O.green}" stroke-width="1.3" fill="none"/>
    <text x="49" y="8" ${font} font-size="27" font-weight="700" letter-spacing="4" fill="${color}">ORUVI</text>
  </g>`;
}
function doc(content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="600" viewBox="0 0 480 600">${content}</svg>`;
}

const art = {
  'kaeduas-digital.svg': doc(`
    <rect width="480" height="600" fill="${K.ink}"/>
    <rect x="20" y="20" width="440" height="560" fill="none" stroke="${K.ember}" stroke-width="1.5"/>
    ${kaeduasLockup(42, 92)}
    <text x="42" y="153" ${mono} font-size="11" letter-spacing="2.5" fill="${K.muted}">SOCIAL / BRAND STORY</text>
    <path d="M42 186H438" stroke="${K.ember}" stroke-width="2"/>
    <text x="42" y="276" ${font} font-size="45" font-weight="500" letter-spacing="-1.8" fill="${K.bone}">MAKE EVERY</text>
    <text x="42" y="337" ${font} font-size="53" font-weight="700" letter-spacing="-2.6" fill="${K.bone}">DETAIL</text>
    <text x="42" y="398" ${font} font-size="53" font-weight="700" letter-spacing="-2.6" fill="${K.ember}">EARN</text>
    <text x="42" y="459" ${font} font-size="53" font-weight="700" letter-spacing="-2.6" fill="${K.bone}">ATTENTION.</text>
    <text x="42" y="535" ${mono} font-size="10" letter-spacing="1.8" fill="${K.muted}">DESIGN / CONTENT / MOVING IMAGE</text>
  `),
  'oruvi-digital.svg': doc(`
    <rect width="480" height="600" fill="${O.green}"/>
    <rect x="20" y="20" width="440" height="560" fill="none" stroke="${O.lime}" stroke-width="1.5"/>
    ${oruviLockup(44, 90)}
    <text x="44" y="151" ${mono} font-size="11" letter-spacing="2.2" fill="${O.lime}">GRAPEFRUIT + BUCHU</text>
    <path d="M44 178H436" stroke="${O.orange}" stroke-width="3"/>
    <text x="44" y="274" ${font} font-size="49" font-weight="600" letter-spacing="-2" fill="${O.cream}">TAKE THE</text>
    <text x="44" y="352" ${serif} font-size="75" font-style="italic" fill="${O.lime}">long way.</text>
    <text x="44" y="430" ${font} font-size="18" font-weight="600" letter-spacing="2" fill="${O.cream}">A PAUSE WITH A LITTLE SPARKLE.</text>
    <text x="44" y="536" ${mono} font-size="10" letter-spacing="1.7" fill="${O.cream}">SELF-INITIATED SPEC CONCEPT</text>
  `),
  'kaeduas-print.svg': doc(`
    <rect width="480" height="600" fill="${K.bone}"/>
    <rect x="20" y="20" width="440" height="560" fill="none" stroke="${K.ink}" stroke-width="1.5"/>
    <rect x="20" y="20" width="440" height="12" fill="${K.ember}"/>
    ${kaeduasLockup(42, 94, K.ink)}
    <text x="42" y="159" ${mono} font-size="10" letter-spacing="2" fill="#72727A">A CREATIVE PRACTICE</text>
    <text x="42" y="279" ${font} font-size="48" font-weight="600" letter-spacing="-2" fill="${K.ink}">CLEAR IDEAS.</text>
    <text x="42" y="348" ${font} font-size="42" font-weight="500" letter-spacing="-1.7" fill="${K.ink}">CONSIDERED</text>
    <text x="42" y="408" ${serif} font-size="76" font-style="italic" fill="${K.ember}">craft.</text>
    <path d="M42 451H438" stroke="${K.ink}" stroke-width="1"/>
    <text x="42" y="494" ${mono} font-size="11" letter-spacing="1.8" fill="${K.ink}">QJ MOTSAMAI / SOUTH AFRICA</text>
    <text x="42" y="535" ${mono} font-size="9" letter-spacing="1.4" fill="#72727A">STUDIO POSTER / SELF-INITIATED</text>
  `),
  'oruvi-print.svg': doc(`
    <rect width="480" height="600" fill="${O.cream}"/>
    <rect x="20" y="20" width="440" height="560" fill="none" stroke="${O.green}" stroke-width="1.5"/>
    <rect x="20" y="20" width="440" height="12" fill="${O.orange}"/>
    ${oruviLockup(44, 96, O.green)}
    <text x="44" y="159" ${mono} font-size="10" letter-spacing="2" fill="#69746B">BOTANICAL SODA / LAUNCH POSTER</text>
    <text x="44" y="274" ${font} font-size="45" font-weight="600" letter-spacing="-1.8" fill="${O.green}">A PAUSE</text>
    <text x="44" y="338" ${serif} font-size="62" font-style="italic" fill="${O.green}">with a little</text>
    <text x="44" y="414" ${font} font-size="46" font-weight="700" letter-spacing="-1.5" fill="${O.orange}">SPARKLE.</text>
    <path d="M44 451H436" stroke="${O.green}" stroke-width="1"/>
    <text x="44" y="495" ${mono} font-size="11" letter-spacing="1.6" fill="${O.green}">GRAPEFRUIT + BUCHU</text>
    <text x="44" y="536" ${mono} font-size="9" letter-spacing="1.4" fill="#69746B">SELF-INITIATED SPEC CONCEPT</text>
  `),
  'kaeduas-pos.svg': doc(`
    <rect width="480" height="600" fill="${K.ink}"/>
    <rect x="20" y="20" width="440" height="560" fill="none" stroke="${K.ember}" stroke-width="1.5"/>
    <rect x="20" y="20" width="16" height="560" fill="${K.ember}"/>
    ${kaeduasLockup(58, 94)}
    <text x="58" y="157" ${mono} font-size="10" letter-spacing="2" fill="${K.muted}">COUNTER SIGN / STUDIO GOODS</text>
    <path d="M58 185H426" stroke="${K.ember}" stroke-width="2"/>
    <text x="58" y="281" ${font} font-size="47" font-weight="600" letter-spacing="-2" fill="${K.bone}">GOOD WORK</text>
    <text x="58" y="347" ${serif} font-size="65" font-style="italic" fill="${K.ember}">starts here.</text>
    <rect x="58" y="401" width="368" height="70" fill="${K.bone}"/>
    <text x="78" y="444" ${mono} font-size="14" font-weight="600" letter-spacing="2" fill="${K.ink}">KAEDUAS / STUDIO GOODS</text>
    <text x="58" y="530" ${mono} font-size="9" letter-spacing="1.5" fill="${K.muted}">POINT-OF-SALE / STUDIO CONCEPT</text>
  `),
  'oruvi-pos.svg': doc(`
    <rect width="480" height="600" fill="${O.deep}"/>
    <rect x="20" y="20" width="440" height="560" fill="none" stroke="${O.lime}" stroke-width="1.5"/>
    <rect x="20" y="20" width="440" height="14" fill="${O.orange}"/>
    ${oruviLockup(44, 96)}
    <text x="44" y="157" ${mono} font-size="10" letter-spacing="2" fill="${O.lime}">SHELF CARD / BOTANICAL SODA</text>
    <path d="M44 185H436" stroke="${O.lime}" stroke-width="1"/>
    <text x="44" y="288" ${font} font-size="48" font-weight="600" letter-spacing="-2" fill="${O.cream}">GOOD TASTE,</text>
    <text x="44" y="355" ${serif} font-size="67" font-style="italic" fill="${O.lime}">close by.</text>
    <rect x="44" y="405" width="392" height="2" fill="${O.orange}"/>
    <text x="44" y="456" ${mono} font-size="12" letter-spacing="1.8" fill="${O.cream}">GRAPEFRUIT + BUCHU</text>
    <text x="44" y="532" ${mono} font-size="9" letter-spacing="1.5" fill="${O.cream}">SELF-INITIATED SPEC CONCEPT</text>
  `),
  'kaeduas-retail.svg': doc(`
    <rect width="480" height="600" fill="${K.ink}"/>
    <rect x="20" y="20" width="440" height="560" fill="none" stroke="${K.ember}" stroke-width="1.5"/>
    <rect x="20" y="20" width="12" height="560" fill="${K.ember}"/>
    ${kaeduasLockup(52, 94)}
    <text x="52" y="157" ${mono} font-size="10" letter-spacing="2" fill="${K.muted}">OPEN STUDIO / WAYFINDING</text>
    <path d="M52 184H428" stroke="${K.ember}" stroke-width="2"/>
    <text x="52" y="285" ${font} font-size="44" font-weight="600" letter-spacing="-1.8" fill="${K.bone}">DESIGN IN</text>
    <text x="52" y="347" ${serif} font-size="68" font-style="italic" fill="${K.ember}">the making.</text>
    <rect x="52" y="405" width="376" height="74" fill="${K.bone}"/>
    <text x="76" y="450" ${mono} font-size="14" font-weight="600" letter-spacing="2" fill="${K.ink}">COME IN  →  KAEDUAS</text>
    <text x="52" y="534" ${mono} font-size="9" letter-spacing="1.4" fill="${K.muted}">RETAIL ACTIVATION / STUDIO CONCEPT</text>
  `),
  'oruvi-retail.svg': doc(`
    <rect width="480" height="600" fill="${O.green}"/>
    <rect x="20" y="20" width="440" height="560" fill="none" stroke="${O.lime}" stroke-width="1.5"/>
    <rect x="20" y="20" width="440" height="12" fill="${O.orange}"/>
    <rect x="44" y="58" width="392" height="480" fill="${O.cream}"/>
    ${oruviLockup(88, 135, O.green)}
    <text x="88" y="197" ${mono} font-size="10" letter-spacing="2" fill="#69746B">A SMALL CHANGE OF PACE</text>
    <path d="M88 225H392" stroke="${O.orange}" stroke-width="2"/>
    <text x="88" y="316" ${font} font-size="36" font-weight="700" letter-spacing="-1" fill="${O.green}">BOTANICAL</text>
    <text x="88" y="366" ${serif} font-size="54" font-style="italic" fill="${O.green}">soda bar.</text>
    <text x="88" y="418" ${mono} font-size="11" letter-spacing="1.5" fill="${O.green}">TASTE / TAKE A MOMENT / GO</text>
    <rect x="88" y="449" width="304" height="8" fill="${O.lime}"/>
    <text x="88" y="496" ${mono} font-size="9" letter-spacing="1.4" fill="#69746B">RETAIL ACTIVATION / SPEC CONCEPT</text>
  `)
};

for (const [name, svg] of Object.entries(art)) {
  const path = `${dir}/${name}`;
  await writeFile(path, svg);
  const png = `${previewDir}/${name.replace('.svg', '.png')}`;
  await sharp(Buffer.from(svg)).png().toFile(png);
}
console.log(`Rendered ${Object.keys(art).length} typographic application studies.`);
