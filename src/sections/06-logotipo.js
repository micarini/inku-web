// 06 · Logotipo (capítulo 02 del manual): construcción, versiones, isologo y sello, usos incorrectos
import { gsap, ScrollTrigger, RM, canPin } from '../lib/motion.js';
import { head, ja, $, $$ } from '../lib/dom.js';

const T = {
  titulo: 'Logotipo',
  tituloJa: 'ロゴ',
  cuerpo: 'Los remates en diagonal no son decorativos: evocan el filo del cuchillo yanagiba y el corte preciso del pescado. Una sola línea horizontal, de lectura inmediata, con peso parejo en sus cuatro trazos.',
  notas: [
    ['01', 'Remates en diagonal', 'Evocan el filo del cuchillo yanagiba.'],
    ['02', 'Una sola línea horizontal', 'De lectura inmediata.'],
    ['03', 'Peso parejo', 'En sus cuatro trazos.'],
  ],
  versiones: {
    titulo: 'Versiones',
    items: [
      ['inku-wordmark.svg', 'Wordmark', 'tinta'],
      ['inku-wordmark-katakana.svg', 'Wordmark + katakana', 'tinta'],
      ['inku-sello-horizontal.svg', 'Con sello · horizontal', 'tinta'],
      ['inku-sello-vertical.svg', 'Con sello · vertical', 'tinta'],
      ['inku-principal-tinta.svg', 'Principal · positivo', 'washi'],
      ['inku-principal.svg', 'Principal · sobre bordó', 'ciruelo'],
    ],
  },
  isologo: {
    titulo: 'Isologo y sello',
    pez: ['El pez', 'Isologo. Para piezas gráficas grandes, aperturas, detalles, packaging.'],
    sello: ['El sello <span lang="ja">インク</span>', 'La firma de la marca. Siempre chico y siempre rojo.'],
  },
  usos: {
    titulo: 'Usos incorrectos',
    items: [
      ['estirar', 'No deformar ni estirar'],
      ['color', 'No cambiar los colores'],
      ['rotar', 'No rotar'],
      ['sombra', 'No aplicar sombras ni efectos'],
      ['ruido', 'No usar sobre fondos ruidosos'],
      ['proporcion', 'No alterar la proporción pez / wordmark'],
    ],
  },
};

const L = '/assets/logo/';

// Guías de construcción sobre el logo principal (viewBox 779 × 570, medido del vector).
const guias = `
<svg class="constr__guias" viewBox="0 0 779 570" aria-hidden="true">
  <g class="g g--2">
    <line x1="-60" y1="310.5" x2="839" y2="310.5"/>
    <line x1="-60" y1="516" x2="839" y2="516"/>
  </g>
  <g class="g g--3">
    ${[[51, 98.4], [128.6, 176], [352, 399.4], [562, 609.4]].map(([a, b]) => `<line x1="${a}" y1="286" x2="${a}" y2="302"/><line x1="${b}" y1="286" x2="${b}" y2="302"/><line x1="${a}" y1="294" x2="${b}" y2="294"/>`).join('')}
  </g>
  <g class="g g--1">
    <line class="rojo" x1="118" y1="503" x2="31" y2="590"/>
    <line class="rojo" x1="196" y1="418" x2="109" y2="505"/>
  </g>
</svg>`;

export const template = `
<section id="logotipo" class="sec sec--tinta constr" data-edge data-nav="06" data-name="Logotipo" aria-labelledby="logotipo-h">
  ${head('02', 'Logotipo')}
  <div class="constr__pin">
    <div class="wrap constr__grid">
      <div class="constr__texto">
        <h2 id="logotipo-h" class="titulo titulo--s" data-split>${T.titulo}</h2>
        <p class="ja" data-reveal>${ja(T.tituloJa)}</p>
        <p class="cuerpo" data-reveal>${T.cuerpo}</p>
      </div>
      <div class="constr__logo">
        <img src="${L}inku-principal.svg" alt="Logo principal de INKU: un pez sobre el wordmark INKU" width="779" height="570" loading="lazy">
        ${guias}
      </div>
      <ol class="constr__notas">
        ${T.notas.map(([n, t, d], i) => `<li class="constr__nota" data-i="${i}"><span class="eyebrow">${n}</span><strong>${t}</strong><span>${d}</span></li>`).join('')}
      </ol>
    </div>
  </div>
</section>

<section id="versiones" class="sec sec--madera versiones" data-edge data-nav="06" data-name="Logotipo · Versiones" aria-labelledby="versiones-h">
  ${head('02', 'Logotipo')}
  <div class="wrap versiones__in">
    <h2 id="versiones-h" class="titulo titulo--s" data-split>${T.versiones.titulo}</h2>
    <ul class="versiones__grid" data-stagger="0.08">
      ${T.versiones.items.map(([f, label, bg]) => `<li class="version version--${bg}" tabindex="0" data-cursor="Ver"><img src="${L}${f}" alt="${label}" loading="lazy" width="340" height="186"><span class="version__label">${label}</span></li>`).join('')}
    </ul>
  </div>
</section>

<section id="isologo" class="sec sec--washi isologo" data-edge data-nav="06" data-name="Logotipo · Isologo y sello" aria-labelledby="isologo-h">
  ${head('02', 'Logotipo')}
  <div class="wrap isologo__in">
    <h2 id="isologo-h" class="titulo titulo--s" data-split>${T.isologo.titulo}</h2>
    <div class="isologo__grid">
      <figure class="isologo__pez" data-reveal>
        <img src="${L}pez-tinta.svg" alt="Isologo: el pez de INKU en negro tinta" width="779" height="241" loading="lazy">
        <figcaption><strong>${T.isologo.pez[0]}</strong><span>${T.isologo.pez[1]}</span></figcaption>
      </figure>
      <figure class="isologo__sello" data-reveal data-delay="0.15">
        <img src="/assets/sello/sello-inku.svg" alt="Sello rojo vertical con la palabra インク" width="250" height="520" loading="lazy">
        <figcaption><strong>${T.isologo.sello[0]}</strong><span>${T.isologo.sello[1]}</span></figcaption>
      </figure>
    </div>
  </div>
</section>

<section id="usos" class="sec sec--tinta usos" data-edge data-nav="06" data-name="Logotipo · Usos incorrectos" aria-labelledby="usos-h">
  ${head('02', 'Logotipo')}
  <div class="wrap usos__in">
    <h2 id="usos-h" class="titulo titulo--s" data-split>${T.usos.titulo}</h2>
    <ul class="usos__grid" data-stagger="0.08">
      ${T.usos.items.map(([k, label]) => `<li class="uso uso--${k}"><div class="uso__celda" aria-hidden="true"><div class="uso__logo"></div></div><p><span class="uso__x" aria-hidden="true">✕</span> ${label}</p></li>`).join('')}
    </ul>
  </div>
</section>`;

export function init() {
  const sec = $('#logotipo');
  const lines = (sel) => $$(`${sel} line`, sec);
  const notas = $$('.constr__nota', sec);

  // longitud de cada guía para dibujarla con stroke-dashoffset
  $$('.constr__guias line', sec).forEach((l) => {
    const len = Math.hypot(l.x2.baseVal.value - l.x1.baseVal.value, l.y2.baseVal.value - l.y1.baseVal.value);
    l.style.strokeDasharray = len;
    l.style.strokeDashoffset = RM ? 0 : len;
  });

  if (!canPin()) {
    // sin pin: las guías se dibujan al entrar y las notas quedan apiladas
    if (!RM) {
      ScrollTrigger.create({
        trigger: '.constr__logo', start: 'top 70%', once: true,
        onEnter: () => gsap.to($$('.constr__guias line', sec), { strokeDashoffset: 0, duration: 1.2, ease: 'ink', stagger: 0.05 }),
      });
    }
    return;
  }

  gsap.set(notas, { opacity: 0.22 });
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: sec, start: 'top top', end: '+=200%', pin: '.constr__pin', scrub: 0.5, anticipatePin: 1 },
  });
  tl.to({}, { duration: 0.15 })
    .to(lines('.g--1'), { strokeDashoffset: 0, duration: 0.6, stagger: 0.15 })
    .to(notas[0], { opacity: 1, duration: 0.3 }, '<')
    .to({}, { duration: 0.25 })
    .to(lines('.g--2'), { strokeDashoffset: 0, duration: 0.7, stagger: 0.12 })
    .to(notas[1], { opacity: 1, duration: 0.3 }, '<')
    .to({}, { duration: 0.25 })
    .to(lines('.g--3'), { strokeDashoffset: 0, duration: 0.6, stagger: 0.03 })
    .to(notas[2], { opacity: 1, duration: 0.3 }, '<')
    .to({}, { duration: 0.45 });
}
