// Convierte assets-src/ (exportado de Figma / generado) a public/assets/ en WebP.
// Uso: node scripts/optimize.mjs
import sharp from 'sharp';
import { readdir, mkdir, copyFile, rename } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const SRC = 'assets-src', OUT = 'public/assets';
const webp = async (src, dst, long, q = 78) => {
  const img = sharp(src).rotate();
  const m = await img.metadata();
  const scale = Math.min(1, long / Math.max(m.width, m.height));
  await img.resize(Math.round(m.width * scale), Math.round(m.height * scale)).webp({ quality: q, effort: 5 }).toFile(dst);
  return [Math.round(m.width * scale), Math.round(m.height * scale)];
};
const sizes = {};
for (const dir of ['fotos', 'texturas']) {
  await mkdir(`${OUT}/${dir}`, { recursive: true });
  for (const f of (await readdir(`${SRC}/${dir}`)).filter(f => /\.(jpe?g|png)$/i.test(f))) {
    const base = f.replace(/\.\w+$/, '');
    const big = dir === 'texturas' ? 1600 : 2000;
    sizes[`${dir}/${base}`] = await webp(`${SRC}/${dir}/${f}`, `${OUT}/${dir}/${base}.webp`, big);
    await webp(`${SRC}/${dir}/${f}`, `${OUT}/${dir}/${base}-960.webp`, 960, 72);
  }
}
// Menús (hojas originales del Figma) y textiles
await mkdir(`${OUT}/aplicaciones`, { recursive: true });
for (const f of ['menu-portada', 'menu-omakase', 'menu-carta', 'menu-bebidas']) {
  const buf = await sharp(`${SRC}/orig/${f}.png`).trim({ threshold: 2 }).toBuffer();
  const m = await sharp(buf).metadata();
  await sharp(buf).webp({ quality: 90 }).toFile(`${OUT}/aplicaciones/${f}.webp`);
  sizes[`aplicaciones/${f}`] = [m.width, m.height];
}
for (const f of ['tenugui', 'noren']) {
  const m = await sharp(`${SRC}/aplicaciones/${f}.png`).metadata();
  await sharp(`${SRC}/aplicaciones/${f}.png`).webp({ quality: 88 }).toFile(`${OUT}/aplicaciones/${f}.webp`);
  sizes[`aplicaciones/${f}`] = [m.width, m.height];
}
// Patrón de ciruelo: tile repetible de 300 px (600 a 2×)
await sharp(`${SRC}/orig/pattern-fill.png`).extract({ left: 0, top: 0, width: 600, height: 600 }).png({ compressionLevel: 9, palette: true }).toFile(`${OUT}/ilustraciones/patron-ciruelo.png`);
// Omakase (fotos generadas): se convierten si existen
if (existsSync(`${SRC}/omakase`)) {
  await mkdir(`${OUT}/omakase`, { recursive: true });
  for (const f of (await readdir(`${SRC}/omakase`)).filter(f => /\.(jpe?g|png|webp)$/i.test(f))) {
    const base = f.replace(/\.\w+$/, '');
    const long = /geta|caja/.test(base) ? 1800 : 720;
    sizes[`omakase/${base}`] = await webp(`${SRC}/omakase/${f}`, `${OUT}/omakase/${base}.webp`, long, 82);
  }
}
// Open Graph 1200×630
const logo = await sharp(`${OUT}/logo/inku-principal.svg`, { density: 200 }).resize({ height: 330 }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#0C0C0A' } }).composite([{ input: logo, gravity: 'centre' }]).jpeg({ quality: 88 }).toFile('public/og.jpg');
console.log(JSON.stringify(sizes, null, 0));
