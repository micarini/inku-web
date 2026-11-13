// 03 · Concepto インク — "Tinta."
import { gsap, RM, canPin } from '../lib/motion.js';
import { foto, head, ja, $, $$ } from '../lib/dom.js';

const T = {
  kata: ['イ', 'ン', 'ク'],
  titulo: 'Tinta.',
  cuerpo:
    'INKU (<span lang="ja">インク</span>) significa tinta en japonés. El nombre sostiene un doble sentido: la tinta de calamar (<em>ika-sumi</em>), un ingrediente real de la cocina japonesa, y el <em>sumi</em>, la tinta negra de la caligrafía y la pintura sumi-e.',
  remate: 'Comida y gesto, sabor y trazo.',
  nota: '“Sepia” es literalmente la tinta de la sepia, pariente del calamar.',
  notaLabel: 'Nota al margen',
  altFoto: 'Una caligrafía en tinta sumi enmarcada detrás del fuego de la barra',
};

// Cada carácter se revela con un trazo de pincel: una máscara SVG en zigzag
// (stroke grueso + borde irregular) que se "pinta" con el scroll.
const CELL = 300;
const zig = (i) => {
  const x = i * CELL;
  return `M${x - 20} 50 L${x + CELL + 10} 96 L${x - 10} 176 L${x + CELL + 10} 236 L${x - 10} 322`;
};

export const template = `
<section id="concepto" class="sec sec--tinta concepto" data-edge data-nav="03" data-name="Concepto" aria-labelledby="concepto-h">
  ${head('01', 'Concepto')}
  <div class="concepto__grid">
    <div class="concepto__texto">
      <svg class="concepto__kata" viewBox="0 0 ${CELL * 3} 350" role="img" aria-label="インク, INKU en katakana">
        <defs>
          <filter id="kata-rough" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="4" result="n"/>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="18"/>
          </filter>
          ${T.kata.map((_, i) => `<mask id="kata-m${i}" maskUnits="userSpaceOnUse" x="${i * CELL - 30}" y="-10" width="${CELL + 60}" height="370"><path class="kata-stroke" d="${zig(i)}" pathLength="1" fill="none" stroke="#fff" stroke-width="112" stroke-linecap="round" stroke-linejoin="round" filter="url(#kata-rough)"/></mask>`).join('')}
        </defs>
        ${T.kata.map((c, i) => `<text x="${i * CELL + CELL / 2}" y="268" text-anchor="middle" mask="url(#kata-m${i})" lang="ja">${c}</text>`).join('')}
      </svg>
      <h2 id="concepto-h" class="titulo titulo--s" data-split>${T.titulo}</h2>
      <p class="cuerpo" data-reveal>${T.cuerpo}</p>
      <p class="remate" data-reveal>${T.remate}</p>
      <aside class="concepto__nota" data-reveal>
        <span class="eyebrow">${T.notaLabel}</span>
        <p class="nota">${T.nota}</p>
      </aside>
    </div>
    <div class="concepto__foto foto" data-clip>
      ${foto('fotos/concepto-caligrafia-fuego', T.altFoto, { sizes: '(min-width: 768px) 47vw, 100vw' })}
    </div>
  </div>
</section>`;

export function init() {
  const strokes = $$('.kata-stroke');
  if (RM) return;
  gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.to(strokes, {
    strokeDashoffset: 0,
    ease: 'none',
    stagger: 0.28,
    scrollTrigger: { trigger: '.concepto__kata', start: 'top 82%', end: 'top 22%', scrub: 0.6 },
  });
  if (canPin()) {
    gsap.fromTo('.concepto__foto img', { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: $('#concepto'), start: 'top bottom', end: 'bottom top', scrub: true } });
  }
  void ja;
}
