// 09 · Recursos gráficos (capítulo 05, página washi) + bloque de patrón
import { gsap, canPin } from '../lib/motion.js';
import { head, ja, $ } from '../lib/dom.js';

const T = {
  titulo: 'Recursos gráficos',
  tituloJa: '図案',
  cuerpo: 'Sellos, flores de ciruelo y koi: el vocabulario ilustrado de la marca. Se usan de a uno, con aire alrededor.',
  // [archivo, nombre]
  items: [
    ['/assets/sello/sello-inku.svg', 'Sello インク'],
    ['/assets/sello/sello-sumi.svg', 'Sello 墨 · sumi'],
    ['/assets/ilustraciones/koi-circulo-tinta.png', 'Emblema del pez'],
    ['/assets/ilustraciones/sol-ola.png', 'Sol y ola'],
    ['/assets/ilustraciones/ciruelo-flores.png', 'Flor de ciruelo'],
    ['/assets/ilustraciones/ciruelo-flor.png', 'Flor de ciruelo, variante'],
    ['/assets/ilustraciones/koi-circulo.png', 'Koi en círculo'],
    ['/assets/ilustraciones/ciruelo-rama.png', 'Rama de ciruelo'],
  ],
  patron: 'Patrón de ciruelo — bordó sobre bordó. Tenugui, forros, packaging y fondos.',
};

export const template = `
<section id="recursos" class="sec sec--washi recursos" data-edge data-nav="09" data-name="Recursos gráficos" aria-labelledby="recursos-h">
  ${head('05', 'Recursos gráficos')}
  <div class="wrap recursos__in">
    <div class="recursos__head">
      <h2 id="recursos-h" class="titulo titulo--s" data-split>${T.titulo}</h2>
      <p class="ja" data-reveal>${ja(T.tituloJa)}</p>
      <p class="cuerpo" data-reveal>${T.cuerpo}</p>
    </div>
    <ul class="recursos__grid" data-stagger="0.07">
      ${T.items.map(([src, n]) => `<li class="recurso" tabindex="0" data-cursor="Entintar"><img src="${src}" alt="${n.replace(/"/g, '')}" loading="lazy" width="240" height="240"><span class="recurso__n">${n}</span></li>`).join('')}
    </ul>
  </div>
</section>

<section id="patron" class="sec sec--ciruelo patron" data-edge data-nav="09" data-name="Recursos · Patrón" aria-label="Patrón de ciruelo">
  ${head('05', 'Recursos gráficos')}
  <div class="patron__bg" aria-hidden="true"></div>
  <img class="patron__logo" src="/assets/logo/inku-principal.svg" alt="INKU" width="779" height="570" loading="lazy" data-reveal>
  <p class="patron__pie" data-reveal>${T.patron}</p>
</section>`;

export function init() {
  if (canPin()) {
    gsap.fromTo('.patron__bg', { yPercent: -12 }, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: $('#patron'), start: 'top bottom', end: 'bottom top', scrub: true } });
  }
}
