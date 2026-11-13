// Recorta las fotos del juego (fondo negro) a un WebP con alfa suave:
// alfa = clave de luminancia + una elipse difusa que deja una sombra de contacto.
// Así cambiar una foto es reemplazar el archivo en assets-src/omakase y correr: node scripts/cutout.mjs
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
const SRC = 'assets-src/omakase', OUT = 'public/assets/omakase';
await mkdir(OUT, { recursive: true });
const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const report = {};
for (const f of (await readdir(SRC)).filter(f => f.endsWith('.png'))) {
  const base = f.replace('.png', '');
  const board = /geta|caja/.test(base);
  const { data, info } = await sharp(`${SRC}/${f}`).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const blur = await sharp(`${SRC}/${f}`).removeAlpha().greyscale().blur(6).raw().toBuffer();
  const T = board ? 30 : ({ wasabi: 120 }[base] || 62);
  const cols = new Uint32Array(W), rows = new Uint32Array(H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (blur[y * W + x] > T) { cols[x]++; rows[y]++; }
  const minC = H * 0.02, minR = W * 0.02;
  let x0 = 0, x1 = W - 1, y0 = 0, y1 = H - 1;
  while (x0 < W && cols[x0] < minC) x0++; while (x1 > 0 && cols[x1] < minC) x1--;
  while (y0 < H && rows[y0] < minR) y0++; while (y1 > 0 && rows[y1] < minR) y1--;
  if (board) {
    const m = 8;
    await sharp(`${SRC}/${f}`).extract({ left: x0 + m, top: y0 + m, width: x1 - x0 - 2 * m, height: y1 - y0 - 2 * m }).webp({ quality: 86 }).toFile(`${OUT}/${base}.webp`);
    report[base] = [x1 - x0 - 2 * m, y1 - y0 - 2 * m];
    continue;
  }
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, rx = (x1 - x0) / 2 * 1.1, ry = (y1 - y0) / 2 * 1.1;
  const out = Buffer.alloc(W * H * 4);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 3, o = (y * W + x) * 4;
    const l = Math.max(data[i], data[i + 1], data[i + 2]);
    const dx = Math.abs(x - cx) / rx, dy = Math.abs(y - cy) / ry;
    const d = Math.pow(dx ** 3 + dy ** 3, 1 / 3);
    const key = ss(26, 84, l);
    const shadow = 0.62 * (1 - ss(0.86, 1.22, d));
    const far = 1 - ss(1.18, 1.45, d);
    const a = Math.max(key * far, shadow);
    out[o] = data[i]; out[o + 1] = data[i + 1]; out[o + 2] = data[i + 2]; out[o + 3] = Math.round(a * 255);
  }
  const px = Math.round(rx * 1.5), py = Math.round(ry * 1.5);
  const L = Math.max(0, Math.round(cx - px)), Tp = Math.max(0, Math.round(cy - py));
  const w = Math.min(W - L, px * 2), h = Math.min(H - Tp, py * 2);
  await sharp(out, { raw: { width: W, height: H, channels: 4 } }).extract({ left: L, top: Tp, width: w, height: h }).resize({ width: Math.min(w, 760) }).webp({ quality: 84, alphaQuality: 80 }).toFile(`${OUT}/${base}.webp`);
  report[base] = [w, h, +(w / h).toFixed(3)];
}
console.log(JSON.stringify(report));
