// Grano de papel para el ticket: tile PNG de 180 px con ruido muy tenue (repetible).
import sharp from 'sharp';
const N = 180, buf = Buffer.alloc(N * N * 4);
let s = 20261110;
const r = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
for (let i = 0; i < N * N; i++) {
  const v = r();
  buf[i * 4] = 52; buf[i * 4 + 1] = 40; buf[i * 4 + 2] = 24;
  buf[i * 4 + 3] = v > 0.5 ? Math.round((v - 0.5) * 2 * 30) : 0;
}
await sharp(buf, { raw: { width: N, height: N, channels: 4 } }).blur(0.4).png({ compressionLevel: 9 }).toFile('public/assets/texturas/grano.png');
console.log('grano.png');
