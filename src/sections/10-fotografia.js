// 10 · Fotografía (capítulo 06): criterios + carrusel horizontal pinneado
import { gsap, canPin } from '../lib/motion.js';
import { foto, head, ja, $ } from '../lib/dom.js';

const T = {
  titulo: 'Fotografía',
  tituloJa: '写真',
  altPrincipal: 'Las manos del itamae presionan un nigiri de atún bajo una luz cálida lateral',
  // la regla 04 lleva el único acento rojo de la pantalla
  reglas: [
    'Una sola luz, cálida y lateral',
    'Negros profundos: la sombra también compone',
    'Madera oscura, piedra y papel como superficies',
    'Un único acento rojo por imagen',
    'Encuadres con aire: el producto nunca solo y centrado sin intención',
    'Sin texto ni marcas ajenas en la imagen',
  ],
  serie: 'La serie',
  serieAyuda: 'Seguí bajando: la serie pasa de costado.',
  // [imagen, alt, formato]
  fotos: [
    ['fotos/feed-01', 'Roll de salmón sobre piedra oscura', 'q'],
    ['fotos/territorio-01', 'La mano del chef sobre los cortes del día', 'v'],
    ['fotos/feed-02', 'Sashimi de salmón sostenido con palillos', 'q'],
    ['fotos/serie-cuchillos', 'Cuchillos japoneses colgados sobre madera quemada', 'h'],
    ['fotos/feed-07', 'Plato hondo con sashimi y palillos de madera', 'q'],
    ['fotos/territorio-03', 'Nigiri de atún sobre piedra clara', 'v'],
    ['fotos/feed-09', 'El chef termina una pieza con cuchara y fuego', 'q'],
    ['fotos/feed-08', 'Pescados plateados en un vaso sobre negro', 'q'],
  ],
};

export const template = `
<section id="fotografia" class="sec sec--tinta fotografia" data-edge data-nav="10" data-name="Fotografía" aria-labelledby="fotografia-h">
  ${head('06', 'Fotografía')}
  <div class="fotografia__grid">
    <div class="fotografia__foto foto" data-clip>
      ${foto('fotos/fotografia-manos', T.altPrincipal, { sizes: '(min-width: 768px) 49vw, 100vw' })}
    </div>
    <div class="fotografia__texto">
      <h2 id="fotografia-h" class="titulo titulo--s" data-split>${T.titulo}</h2>
      <p class="ja" data-reveal>${ja(T.tituloJa)}</p>
      <ol class="fotografia__reglas" data-stagger="0.12">
        ${T.reglas.map((r, i) => `<li><span class="fotografia__n${i === 3 ? ' is-rojo' : ''}">${String(i + 1).padStart(2, '0')}</span><span>${r}</span></li>`).join('')}
      </ol>
    </div>
  </div>
</section>

<section id="serie" class="sec sec--madera serie" data-edge data-nav="10" data-name="Fotografía · Serie" aria-labelledby="serie-h">
  ${head('06', 'Fotografía')}
  <div class="serie__pin">
    <div class="serie__head wrap">
      <h2 id="serie-h" class="titulo titulo--s">${T.serie}</h2>
      <p class="nota">${T.serieAyuda}</p>
    </div>
    <ul class="serie__track" tabindex="0" aria-label="Serie fotográfica, ${T.fotos.length} imágenes">
      ${T.fotos.map(([k, alt, f], i) => `<li class="serie__item serie__item--${f}"><figure class="foto">${foto(k, alt, { sizes: '(min-width: 768px) 30vw, 78vw' })}</figure><span class="eyebrow">${String(i + 1).padStart(2, '0')} / ${String(T.fotos.length).padStart(2, '0')}</span></li>`).join('')}
    </ul>
  </div>
</section>`;

export function init() {
  if (!canPin()) return; // en celular: scroll-snap nativo (CSS)
  const sec = $('#serie');
  const track = $('.serie__track', sec);
  sec.classList.add('is-pinned');
  const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
  gsap.to(track, {
    x: () => -dist(),
    ease: 'none',
    scrollTrigger: {
      trigger: sec,
      start: 'top top',
      end: () => `+=${dist()}`,
      pin: '.serie__pin',
      scrub: 0.6,
      invalidateOnRefresh: true,
      anticipatePin: 1,
    },
  });
}
