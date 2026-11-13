// 07 · Paleta (capítulo 03 · Color)
import { head, ja, $, $$, toast } from '../lib/dom.js';

const T = {
  titulo: 'Paleta',
  tituloJa: '色',
  cuerpo: 'Construida sobre el negro tinta y el crema del papel. El rojo es el sello: un solo acento, nunca protagonista.',
  ayuda: 'Tocá una franja para copiar su HEX',
  copiado: 'Copiado',
  // [clave, nombre, HEX, uso, proporción de uso real]
  colores: [
    ['tinta', 'Negro tinta', '#0C0C0A', 'Fondo principal', 40],
    ['madera', 'Madera', '#2B261E', 'Fondos secundarios', 22],
    ['washi', 'Papel washi', '#F4EFE3', 'Texto y negativo', 22],
    ['ciruelo', 'Bordó ciruelo', '#380706', 'Patrón · textiles', 10],
    ['sello', 'Rojo sello', '#C42A26', 'Acento · sello', 6],
  ],
};

export const template = `
<section id="paleta" class="sec sec--tinta paleta" data-edge data-nav="07" data-name="Paleta" aria-labelledby="paleta-h">
  ${head('03', 'Color')}
  <div class="paleta__texto">
    <h2 id="paleta-h" class="titulo titulo--s" data-split>${T.titulo}</h2>
    <p class="ja" data-reveal>${ja(T.tituloJa)}</p>
    <p class="cuerpo" data-reveal>${T.cuerpo}</p>
    <p class="nota" data-reveal>${T.ayuda}</p>
  </div>
  <ul class="paleta__franjas">
    ${T.colores.map(([k, n, hex, uso, pct]) => `
    <li class="franja franja--${k}" style="--pct:${pct}">
      <button type="button" data-hex="${hex}" data-cursor="Copiar" aria-label="${n}, ${hex}. ${uso}. Copiar HEX">
        <span class="franja__pct">${pct} %</span>
        <span class="franja__info">
          <strong>${n}</strong>
          <span class="franja__hex">${hex}</span>
          <span class="franja__uso">${uso}</span>
        </span>
      </button>
    </li>`).join('')}
  </ul>
</section>`;

export function init() {
  const sec = $('#paleta');
  const franjas = $$('.franja', sec);
  const open = (f) => franjas.forEach((x) => x.classList.toggle('is-open', x === f));
  franjas.forEach((f) => {
    const btn = f.querySelector('button');
    f.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && open(f));
    btn.addEventListener('focus', () => open(f));
    btn.addEventListener('click', async () => {
      open(f);
      try {
        await navigator.clipboard.writeText(btn.dataset.hex);
        toast(`${T.copiado} ${btn.dataset.hex}`);
      } catch {
        toast(btn.dataset.hex);
      }
    });
  });
  sec.querySelector('.paleta__franjas').addEventListener('pointerleave', (e) => e.pointerType === 'mouse' && open(null));
}
