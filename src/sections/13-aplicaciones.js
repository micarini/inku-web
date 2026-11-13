// 13 · Aplicaciones (capítulos 07 y 08): menús, packaging, indumentaria y textiles
import { gsap, Flip, RM } from '../lib/motion.js';
import { foto, head, ja, A, $, $$ } from '../lib/dom.js';

const T = {
  menus: {
    titulo: 'Menús',
    tituloJa: 'お品書き',
    cuerpo: 'Cuatro hojas: portada, omakase, carta y bebidas. Tocá una para leerla.',
    cerrar: 'Cerrar',
    // [archivo, nombre]
    items: [
      ['menu-portada', 'Portada'],
      ['menu-omakase', 'Omakase'],
      ['menu-carta', 'Carta'],
      ['menu-bebidas', 'Bebidas'],
    ],
  },
  packaging: {
    titulo: 'Packaging',
    tituloJa: '包装',
    cuerpo: 'Caja omakase para llevar: cartón negro mate con el patrón de ciruelo en relieve seco, sello rojo como único acento y envoltorio tenugui en la versión regalo.',
    alt: 'Caja omakase negra con el patrón de ciruelo en relieve y el logo INKU sobre una mesa de madera',
  },
  indumentaria: {
    titulo: 'Indumentaria',
    tituloJa: '装い',
    fotos: [
      ['fotos/indumentaria-01', 'Camisa negra de cuello mao con el sello rojo bordado en el pecho'],
      ['fotos/indumentaria-02', 'La camisa doblada: forro de puños con el patrón de ciruelo bordó'],
      ['fotos/indumentaria-03', 'Detalle del puño arremangado con el forro de ciruelo'],
    ],
    specs: [
      ['Sello <span lang="ja">インク</span> · bordado', 'Punto satén, hilo rojo #C42A26. Pecho izquierdo, 1,5 × 3,5 cm, a la altura del 2.º botón.'],
      ['Delantal largo', 'Lona pesada negro tinta. Tiras en bordó #380706. Pez bordado en crema, esquina inferior del dobladillo.'],
      ['Forros', 'Cuello y puños de camisa: patrón de ciruelo bordó. Delantal de sala: ciruelo tono sobre tono.'],
      ['Telas', 'Negro tinta · crudo · bordó. Nunca blanco puro.'],
    ],
  },
  textiles: {
    titulo: 'Textiles de servicio',
    tituloJa: '布',
    tenugui: ['Tenugui', 'Paño de barra, vincha del itamae y envoltorio de regalo. Su estampado también funciona como textura del sistema.'],
    noren: ['Noren', 'Cortina de entrada en lino negro con el isologo en crema.'],
  },
};

export const template = `
<section id="aplicaciones" class="sec sec--madera menus" data-edge data-nav="13" data-name="Aplicaciones · Menús" aria-labelledby="menus-h">
  ${head('07', 'Aplicaciones')}
  <div class="wrap menus__in">
    <div class="menus__head">
      <h2 id="menus-h" class="titulo titulo--s" data-split>${T.menus.titulo}</h2>
      <p class="ja" data-reveal>${ja(T.menus.tituloJa)}</p>
      <p class="cuerpo" data-reveal>${T.menus.cuerpo}</p>
    </div>
    <div class="menus__mesa" data-reveal>
      <ul class="menus__fan">
        ${T.menus.items.map(([k, n], i) => `<li class="menu" data-i="${i}"><button type="button" aria-label="Menú ${n}: ver en grande" data-cursor="Ver"><img src="${A(`aplicaciones/${k}`)}.webp" alt="Menú de INKU: ${n}" width="1080" height="1927" loading="lazy" decoding="async"></button></li>`).join('')}
      </ul>
      <div class="menus__nav" hidden>
        <button type="button" class="menus__btn" data-dir="-1" aria-label="Menú anterior" data-cursor="←">←</button>
        <p class="eyebrow" aria-live="polite"><span class="menus__actual"></span></p>
        <button type="button" class="menus__btn" data-dir="1" aria-label="Menú siguiente" data-cursor="→">→</button>
        <button type="button" class="menus__btn menus__cerrar" data-cursor="Cerrar">${T.menus.cerrar}</button>
      </div>
    </div>
  </div>
</section>

<section id="packaging" class="sec sec--tinta packaging" data-edge data-nav="13" data-name="Aplicaciones · Packaging" aria-labelledby="packaging-h">
  ${head('07', 'Aplicaciones')}
  <div class="packaging__grid">
    <div class="packaging__foto foto" data-clip>
      ${foto('fotos/packaging-caja', T.packaging.alt, { sizes: '(min-width: 768px) 66vw, 100vw' })}
    </div>
    <div class="packaging__texto">
      <h2 id="packaging-h" class="titulo titulo--s" data-split>${T.packaging.titulo}</h2>
      <p class="ja" data-reveal>${ja(T.packaging.tituloJa)}</p>
      <p class="cuerpo" data-reveal>${T.packaging.cuerpo}</p>
    </div>
  </div>
</section>

<section id="indumentaria" class="sec sec--tinta indum" data-edge data-nav="13" data-name="Aplicaciones · Indumentaria" aria-labelledby="indum-h">
  ${head('08', 'Indumentaria')}
  <div class="indum__fotos" data-clip-group>
    ${T.indumentaria.fotos.map(([k, alt]) => `<figure class="foto" data-clip>${foto(k, alt, { sizes: '(min-width: 768px) 34vw, 100vw' })}</figure>`).join('')}
  </div>
  <div class="wrap indum__in">
    <div>
      <h2 id="indum-h" class="titulo titulo--s" data-split>${T.indumentaria.titulo}</h2>
      <p class="ja" data-reveal>${ja(T.indumentaria.tituloJa)}</p>
    </div>
    <dl class="indum__specs" data-stagger="0.1">
      ${T.indumentaria.specs.map(([t, d]) => `<div><dt>${t}</dt><dd>${d}</dd></div>`).join('')}
    </dl>
  </div>
</section>

<section id="textiles" class="sec sec--washi textiles" data-edge data-nav="13" data-name="Aplicaciones · Textiles" aria-labelledby="textiles-h">
  ${head('08', 'Indumentaria')}
  <div class="wrap textiles__in">
    <h2 id="textiles-h" class="titulo titulo--s" data-split>${T.textiles.titulo}</h2>
    <p class="ja" data-reveal>${ja(T.textiles.tituloJa)}</p>
    <div class="textiles__grid">
      <figure data-reveal>
        <div class="foto textiles__tenugui"><img src="${A('aplicaciones/tenugui')}.webp" alt="Tenugui bordó con el patrón de ciruelo y el sello rojo en una esquina" width="1440" height="1040" loading="lazy" decoding="async"></div>
        <figcaption><strong>${T.textiles.tenugui[0]}</strong><span>${T.textiles.tenugui[1]}</span></figcaption>
      </figure>
      <figure data-reveal data-delay="0.15">
        <div class="noren" role="img" aria-label="Noren: cortina de lino negro con el pez y el wordmark INKU en crema" data-cursor="Mover">
          <span class="noren__barra"></span>
          <span class="noren__pano" style="--i:0"></span><span class="noren__pano" style="--i:1"></span><span class="noren__pano" style="--i:2"></span>
        </div>
        <figcaption><strong>${T.textiles.noren[0]}</strong><span>${T.textiles.noren[1]}</span></figcaption>
      </figure>
    </div>
  </div>
</section>`;

export function init() {
  // ── Menús: abanico → al frente con Flip, navegación ← →
  const sec = $('#aplicaciones');
  const mesa = $('.menus__mesa', sec);
  const menus = $$('.menu', sec);
  const nav = $('.menus__nav', sec);
  const actual = $('.menus__actual', sec);
  let cur = -1;

  const show = (i) => {
    const state = Flip.getState(menus);
    cur = i;
    mesa.classList.toggle('is-open', i >= 0);
    menus.forEach((m, k) => {
      m.classList.toggle('is-active', k === i);
      m.classList.toggle('is-prev', i >= 0 && k < i);
      m.classList.toggle('is-next', i >= 0 && k > i);
    });
    nav.hidden = i < 0;
    if (i >= 0) actual.textContent = `${T.menus.items[i][1]} · ${i + 1} / ${menus.length}`;
    Flip.from(state, { duration: RM ? 0.01 : 0.9, ease: 'ink', absolute: false, nested: true, zIndex: 5 });
  };
  menus.forEach((m, i) => m.querySelector('button').addEventListener('click', () => show(cur === i ? -1 : i)));
  $$('.menus__btn[data-dir]', sec).forEach((b) => b.addEventListener('click', () => show((cur + +b.dataset.dir + menus.length) % menus.length)));
  $('.menus__cerrar', sec).addEventListener('click', () => { const i = cur; show(-1); menus[i]?.querySelector('button').focus(); });
  sec.addEventListener('keydown', (e) => {
    if (cur < 0) return;
    if (e.key === 'Escape') $('.menus__cerrar', sec).click();
    if (e.key === 'ArrowRight') show((cur + 1) % menus.length);
    if (e.key === 'ArrowLeft') show((cur - 1 + menus.length) % menus.length);
  });

  // ── Noren: leve balanceo de tela al pasar el mouse (sin rebote: seno que se apaga)
  const noren = $('.noren');
  const panos = $$('.noren__pano', noren);
  let swaying = false;
  const sway = () => {
    if (RM || swaying) return;
    swaying = true;
    gsap.timeline({ onComplete: () => (swaying = false) })
      .to(panos, { skewX: (i) => [2.2, -1.6, 1.9][i], scaleY: 0.985, duration: 0.9, ease: 'sine.inOut', stagger: 0.08 })
      .to(panos, { skewX: (i) => [-1.1, 0.9, -0.8][i], scaleY: 1, duration: 1.1, ease: 'sine.inOut', stagger: 0.08 }, '-=0.5')
      .to(panos, { skewX: 0, duration: 1.4, ease: 'sine.inOut', stagger: 0.08 }, '-=0.6');
  };
  noren.addEventListener('pointerenter', sway);
  noren.addEventListener('click', sway);
}
