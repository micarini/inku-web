// 14 · Redes sociales / Feed (capítulo 09)
import { foto, head, ja, $, $$ } from '../lib/dom.js';

const T = {
  titulo: 'Feed',
  tituloJa: 'フィード',
  cuerpo: 'Tres series que se alternan: producto en clave cálida, placas negras con una frase y proceso — manos, cuchillo, pincel.',
  usuario: 'inku.omakase',
  bio: 'Omakase de autor · 10 lugares · sin gluten',
  series: [
    ['producto', 'Producto'],
    ['placa', 'Placa'],
    ['proceso', 'Proceso'],
  ],
  // grilla 3 × 3 del manual: [imagen, serie, alt]
  posts: [
    ['fotos/feed-01', 'producto', 'Roll de salmón sobre piedra'],
    ['fotos/feed-02', 'producto', 'Sashimi de salmón con palillos'],
    ['fotos/feed-03', 'proceso', 'Cuchillos sobre madera quemada'],
    ['fotos/feed-04', 'placa', 'Placa negra con un haz de luz'],
    ['fotos/feed-05', 'placa', 'Placa negra con la frase “Un solo gesto.” y el sello'],
    ['fotos/feed-06', 'placa', 'Textura de tinta sumi'],
    ['fotos/feed-07', 'producto', 'Plato de sashimi con palillos'],
    ['fotos/feed-08', 'producto', 'Pescados plateados en un vaso'],
    ['fotos/feed-09', 'proceso', 'El chef termina una pieza'],
  ],
};

export const template = `
<section id="feed" class="sec sec--tinta feed" data-edge data-nav="14" data-name="Redes sociales" aria-labelledby="feed-h">
  ${head('09', 'Redes sociales')}
  <div class="wrap feed__in">
    <div class="feed__texto">
      <h2 id="feed-h" class="titulo titulo--s" data-split>${T.titulo}</h2>
      <p class="ja" data-reveal>${ja(T.tituloJa)}</p>
      <p class="cuerpo" data-reveal>${T.cuerpo}</p>
      <ul class="feed__leyenda" data-stagger="0.1">
        ${T.series.map(([k, n], i) => `<li><button type="button" data-serie="${k}" aria-pressed="false" data-cursor="Ver"><span class="feed__punto${i === 0 ? '' : ''}" aria-hidden="true"></span>${n}</button></li>`).join('')}
      </ul>
    </div>
    <div class="feed__tel" data-reveal>
      <div class="feed__perfil">
        <img src="/assets/logo/pez.svg" alt="" width="779" height="241" loading="lazy">
        <p><strong>${T.usuario}</strong><span>${T.bio}</span></p>
      </div>
      <ul class="feed__grid">
        ${T.posts.map(([k, s, alt]) => `<li class="feed__post" data-serie="${s}">${foto(k, alt, { sizes: '(min-width: 768px) 12vw, 30vw' })}</li>`).join('')}
      </ul>
    </div>
  </div>
</section>`;

export function init() {
  const sec = $('#feed');
  const posts = $$('.feed__post', sec);
  const btns = $$('.feed__leyenda button', sec);
  const set = (s) => {
    sec.classList.toggle('is-filtrando', !!s);
    posts.forEach((p) => p.classList.toggle('is-on', p.dataset.serie === s));
    btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.serie === s)));
  };
  btns.forEach((b) => {
    b.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && set(b.dataset.serie));
    b.addEventListener('pointerleave', (e) => e.pointerType === 'mouse' && set(null));
    b.addEventListener('focus', () => set(b.dataset.serie));
    b.addEventListener('blur', () => set(null));
    b.addEventListener('click', () => set(b.getAttribute('aria-pressed') === 'true' && !matchMedia('(hover: hover)').matches ? null : b.dataset.serie));
  });
}
