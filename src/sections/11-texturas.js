// 11 · Texturas
import { head, ja, A, $, $$ } from '../lib/dom.js';

const T = {
  titulo: 'Texturas',
  tituloJa: '質感',
  ayuda: 'Pasá por un panel: la textura toma toda la sección.',
  ayudaTouch: 'Tocá un panel: la textura toma toda la sección.',
  // [archivo, nombre, uso, ¿es clara?]
  items: [
    ['madera-quemada', 'Madera quemada', 'Yakisugi. Fondo principal.', false],
    ['tinta-sumi', 'Tinta sumi', 'Overlays y transiciones.', true],
    ['papel-tinta', 'Papel y tinta', 'Menús, papelería.', true],
    ['madera-veteada', 'Madera veteada', 'Fondos secundarios.', false],
  ],
};

export const template = `
<section id="texturas" class="sec sec--tinta texturas" data-edge data-nav="11" data-name="Texturas" aria-labelledby="texturas-h">
  ${head('06', 'Fotografía')}
  <div class="texturas__bg" aria-hidden="true">
    ${T.items.map(([k]) => `<div class="texturas__capa" data-k="${k}" style="background-image:url(${A(`texturas/${k}`)}.webp)"></div>`).join('')}
  </div>
  <div class="wrap texturas__in">
    <div class="texturas__head">
      <h2 id="texturas-h" class="titulo titulo--s" data-split>${T.titulo}</h2>
      <p class="ja" data-reveal>${ja(T.tituloJa)}</p>
      <p class="nota" data-reveal><span class="solo-mouse">${T.ayuda}</span><span class="solo-touch">${T.ayudaTouch}</span></p>
    </div>
    <ul class="texturas__grid" data-clip-group>
      ${T.items.map(([k, n, uso, clara]) => `
      <li>
        <button type="button" class="textura" data-k="${k}" data-clara="${clara}" aria-pressed="false" data-cursor="Ver">
          <span class="foto" data-clip><img src="${A(`texturas/${k}`)}-960.webp" alt="Textura: ${n}" width="710" height="960" loading="lazy" decoding="async"></span>
          <strong>${n}</strong>
          <span class="textura__uso">${uso}</span>
        </button>
      </li>`).join('')}
    </ul>
  </div>
</section>`;

export function init() {
  const sec = $('#texturas');
  const capas = $$('.texturas__capa', sec);
  const btns = $$('.textura', sec);
  const set = (k) => {
    capas.forEach((c) => c.classList.toggle('is-on', c.dataset.k === k));
    btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.k === k)));
    const clara = btns.find((b) => b.dataset.k === k)?.dataset.clara === 'true';
    sec.classList.toggle('is-clara', !!k && clara);
    sec.classList.toggle('is-activa', !!k);
  };
  btns.forEach((b) => {
    b.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && set(b.dataset.k));
    b.addEventListener('focus', () => set(b.dataset.k));
    b.addEventListener('click', () => set(b.getAttribute('aria-pressed') === 'true' && !matchMedia('(hover: hover)').matches ? null : b.dataset.k));
  });
  $('.texturas__grid', sec).addEventListener('pointerleave', (e) => e.pointerType === 'mouse' && set(null));
}
