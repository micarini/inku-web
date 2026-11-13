// 11.5 · Anatomía del nigiri 握り — puente hacia el juego (pinneada 250vh)
import { gsap, canPin } from '../lib/motion.js';
import { head, ja, A, $, $$ } from '../lib/dom.js';

const T = {
  ja: '握り',
  eyebrow: 'Anatomía del nigiri',
  titulo: 'Cortado,<br>pincelado,<br>presionado<br>a mano.',
  // [clave, nombre, japonés, nota, ¿rojo?]
  capas: [
    ['neta', 'Neta', '鮪', 'el corte', false],
    ['nikiri', 'Nikiri', '煮切り', 'un solo gesto de pincel', true],
    ['wasabi', 'Wasabi', '山葵', '', false],
    ['shari', 'Shari', '舎利', 'arroz a temperatura de cuerpo', false],
  ],
};

const img = (k, alt) => `<img src="${A(`omakase/${k}`)}.webp" alt="${alt}" loading="lazy" decoding="async" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'falta falta--pieza',textContent:'${k}'}))">`;

const capaHTML = {
  neta: img('anatomia-neta', 'Corte de atún rojo'),
  // la pincelada de nikiri es SVG (no foto), color soja
  nikiri: `<svg viewBox="0 0 400 90" aria-hidden="true"><defs><filter id="nikiri-borde" x="-5%" y="-40%" width="110%" height="180%"><feTurbulence type="fractalNoise" baseFrequency="0.03 0.12" numOctaves="2" seed="3" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="9"/></filter></defs><path d="M18 52 C 90 26, 170 62, 240 40 S 350 30, 384 44" fill="none" stroke="#5a2f18" stroke-width="22" stroke-linecap="round" filter="url(#nikiri-borde)" opacity=".92"/><path d="M40 56 C 120 40, 200 64, 300 44" fill="none" stroke="#8a4a22" stroke-width="5" stroke-linecap="round" filter="url(#nikiri-borde)" opacity=".5"/></svg>`,
  wasabi: img('wasabi', 'Un punto de wasabi'),
  shari: img('anatomia-shari', 'Bola de arroz de sushi presionada a mano'),
};

export const template = `
<section id="anatomia" class="sec sec--tinta anat" data-edge data-nav="11.5" data-name="Anatomía del nigiri" aria-labelledby="anat-h">
  ${head('06', 'Anatomía')}
  <div class="anat__pin">
    <div class="anat__texto">
      <p class="eyebrow">${T.eyebrow} ${ja(T.ja)}</p>
      <h2 id="anat-h" class="titulo">${T.titulo}</h2>
    </div>
    <div class="anat__stage">
      <div class="anat__nigiri">
        ${T.capas.map(([k]) => `<div class="anat__capa anat__capa--${k}" data-k="${k}">${capaHTML[k]}</div>`).join('')}
      </div>
      <ul class="anat__labels">
        ${T.capas.map(([k, n, j, nota, rojo]) => `<li class="anat__label${rojo ? ' is-rojo' : ''}" data-k="${k}"><span class="anat__linea" aria-hidden="true"></span><span><strong>${n}</strong> · ${ja(j)}${nota ? ` — ${nota}` : ''}</span></li>`).join('')}
      </ul>
    </div>
  </div>
</section>`;

export function init() {
  const sec = $('#anatomia');
  if (!canPin()) {
    sec.classList.add('is-static');
    return;
  }
  const vh = (n) => () => (window.innerHeight * n) / 100;
  // posición de cada capa: armado → explotado
  const POS = { neta: [-2.2, -27], nikiri: [-3.4, -6], wasabi: [0.5, 8], shari: [4.4, 26] };
  const capa = (k) => $(`.anat__capa--${k}`, sec);
  const labels = $$('.anat__label', sec);
  const lineas = $$('.anat__linea', sec);

  Object.entries(POS).forEach(([k, [a]]) => gsap.set(capa(k), { y: vh(a)() }));
  gsap.set(capa('nikiri'), { opacity: 0, scaleX: 0.3, transformOrigin: '0% 50%' });
  gsap.set(capa('wasabi'), { opacity: 0 });
  labels.forEach((l) => gsap.set(l, { y: vh(POS[l.dataset.k][1])(), opacity: 0 }));
  gsap.set(lineas, { scaleX: 0, transformOrigin: '0% 50%' });

  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: { trigger: sec, start: 'top top', end: '+=250%', pin: '.anat__pin', scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true },
  });
  // 1) se separa en capas flotantes
  tl.to({}, { duration: 0.12 });
  Object.entries(POS).forEach(([k, [, b]]) => tl.to(capa(k), { y: vh(b), duration: 1 }, 0.12));
  tl.to(capa('wasabi'), { opacity: 1, duration: 0.4 }, 0.3)
    .to(capa('nikiri'), { opacity: 1, scaleX: 1, duration: 0.6, ease: 'power2.out' }, 0.55)
    // 2) etiquetas en línea fina, una por una
    .to(lineas, { scaleX: 1, duration: 0.45, stagger: 0.14, ease: 'power2.out' }, 0.75)
    .to(labels, { opacity: 1, duration: 0.4, stagger: 0.14 }, 0.8)
    .to({}, { duration: 0.7 })
    // 3) las capas se vuelven a unir
    .addLabel('unir')
    .to(labels, { opacity: 0, duration: 0.3 }, 'unir')
    .to(lineas, { scaleX: 0, duration: 0.3 }, 'unir');
  Object.entries(POS).forEach(([k, [a]]) => tl.to(capa(k), { y: vh(a), duration: 0.9 }, 'unir+=0.1'));
  tl.to(capa('wasabi'), { opacity: 0, duration: 0.3 }, 'unir+=0.6')
    // 4) el nigiri "cae" hacia la geta de la sección siguiente
    .to('.anat__nigiri', { y: vh(62), scale: 0.42, duration: 0.7, ease: 'power2.in' }, 'unir+=1.15')
    .to('.anat__nigiri', { opacity: 0, duration: 0.2 }, 'unir+=1.65')
    .to('.anat__texto', { opacity: 0, y: -30, duration: 0.5 }, 'unir+=1.15');
}
