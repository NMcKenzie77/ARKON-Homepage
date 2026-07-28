import { mkdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = resolve(rootDir, 'public', 'og-arkon-source.svg');
const outputPath = resolve(rootDir, 'public', 'og-arkon.png');

await mkdir(dirname(outputPath), { recursive: true });
const source = await readFile(sourcePath);

await sharp(source, { density: 144 })
  .resize(1200, 630, { fit: 'fill' })
  .png({ compressionLevel: 9, palette: true, colours: 128 })
  .toFile(outputPath);

console.log(`Generated ${outputPath}`);
