// Render the editable ORUVI SVG concept assets for inclusion in the sample PDFs.
import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';

const source = 'public/design-work';
const output = 'scratch/render';
await mkdir(output, { recursive: true });
for (const file of await readdir(source)) {
  if (!file.endsWith('.svg')) continue;
  await sharp(join(source, file)).png().toFile(join(output, file.replace(/\.svg$/, '.png')));
}
console.log(`Rendered concept artwork to ${output}/`);
