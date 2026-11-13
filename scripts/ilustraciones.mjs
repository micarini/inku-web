// Saca el fondo washi de las ilustraciones exportadas de Figma (quedan con transparencia real).
// Uso: node scripts/ilustraciones.mjs   (idempotente)
import sharp from 'sharp';
import { readdir, rename } from 'node:fs/promises';
const DIR = 'public/assets/ilustraciones';
const BG = [0xf4, 0xef, 0xe3];
for (const f of (await readdir(DIR)).filter((f) => f.endsWith('.png') && !f.startsWith('patron'))) {
  const { data, info } = await sharp(`${DIR}/${f}`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (data[3] === 0) continue; // ya es transparente
  for (let i = 0; i < data.length; i += 4) {
    // "des-componer" contra el fondo: alfa = cuánto se aleja del washi
    let a = 0;
    for (let c = 0; c < 3; c++) a = Math.max(a, (BG[c] - data[i + c]) / BG[c]);
    a = Math.min(1, Math.max(0, a * 1.02));
    if (a < 0.02) { data[i + 3] = 0; continue; }
    for (let c = 0; c < 3; c++) data[i + c] = Math.max(0, Math.min(255, Math.round((data[i + c] - BG[c] * (1 - a)) / a)));
    data[i + 3] = Math.round(a * 255);
  }
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } }).png({ compressionLevel: 9 }).toFile(`${DIR}/${f}.tmp`);
  await rename(`${DIR}/${f}.tmp`, `${DIR}/${f}`);
  console.log('ok', f);
}
