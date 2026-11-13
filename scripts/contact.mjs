// Hoja de contacto para revisar assets: node scripts/contact.mjs out.jpg file1 file2 ...
import sharp from 'sharp';
const [out, ...files] = process.argv.slice(2);
const cell = 360, cols = Math.min(6, files.length), rows = Math.ceil(files.length / cols);
const comps = await Promise.all(files.map(async (f, i) => ({
  input: await sharp(f, { density: 150 }).resize(cell - 8, cell - 8, { fit: 'inside', background: '#777' }).flatten({ background: '#777777' }).toBuffer(),
  left: (i % cols) * cell + 4, top: Math.floor(i / cols) * cell + 4,
})));
await sharp({ create: { width: cols * cell, height: rows * cell, channels: 3, background: '#333' } }).composite(comps).jpeg({ quality: 80 }).toFile(out);
