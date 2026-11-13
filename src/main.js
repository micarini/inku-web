// INKU · Manual de marca — bootstrap: estilos, secciones, Lenis + GSAP.
import './styles/tokens.css';
import './styles/base.css';
import './styles/sections/01-hero.css';
import './styles/sections/02-indice.css';
import './styles/sections/03-concepto.css';
import './styles/sections/04-chef.css';
import './styles/sections/05-territorio.css';
import './styles/sections/06-logotipo.css';
import './styles/sections/07-paleta.css';
import './styles/sections/08-tipografia.css';
import './styles/sections/09-recursos.css';
import './styles/sections/10-fotografia.css';
import './styles/sections/11-texturas.css';
import './styles/sections/11b-anatomia.css';
import './styles/sections/12-omakase.css';
import './styles/sections/13-aplicaciones.css';
import './styles/sections/14-feed.css';
import './styles/sections/15-cierre.css';

import { ScrollTrigger, initScroll, RM } from './lib/motion.js';
import { initReveals } from './lib/reveal.js';
import { initNav, initEdges, initTrazo } from './lib/nav.js';
import { initCursor } from './lib/cursor.js';
import { runLoader } from './sections/00-loader.js';

import * as hero from './sections/01-hero.js';
import * as indice from './sections/02-indice.js';
import * as concepto from './sections/03-concepto.js';
import * as chef from './sections/04-chef.js';
import * as territorio from './sections/05-territorio.js';
import * as logotipo from './sections/06-logotipo.js';
import * as paleta from './sections/07-paleta.js';
import * as tipografia from './sections/08-tipografia.js';
import * as recursos from './sections/09-recursos.js';
import * as fotografia from './sections/10-fotografia.js';
import * as texturas from './sections/11-texturas.js';
import * as anatomia from './sections/11b-anatomia.js';
import * as omakase from './sections/12-omakase.js';
import * as aplicaciones from './sections/13-aplicaciones.js';
import * as feed from './sections/14-feed.js';
import * as cierre from './sections/15-cierre.js';

// El orden de este array es el orden de la página (y del índice del manual).
const SECCIONES = [hero, indice, concepto, chef, territorio, logotipo, paleta, tipografia, recursos, fotografia, texturas, anatomia, omakase, aplicaciones, feed];

document.getElementById('contenido').innerHTML = SECCIONES.map((s) => s.template).join('');
document.getElementById('cierre').innerHTML = cierre.template;

const loader = runLoader();
const lenis = initScroll();
lenis?.stop();
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// Los títulos se parten por línea: hace falta que las fuentes ya estén.
const fonts = Promise.race([
  Promise.all([document.fonts.load('400 1em "Shippori Mincho"'), document.fonts.load('400 1em "Zen Kaku Gothic New"'), document.fonts.ready]),
  new Promise((r) => setTimeout(r, 3500)),
]).catch(() => {});

fonts.then(() => {
  [...SECCIONES, cierre].forEach((s) => s.init());
  initEdges();
  initReveals();
  initNav();
  initTrazo();
  initCursor();
  ScrollTrigger.sort();
  ScrollTrigger.refresh();

  // las imágenes lazy cambian alturas: se recalcula una vez que cargó todo
  window.addEventListener('load', () => ScrollTrigger.refresh());
  let t;
  window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => ScrollTrigger.refresh(), 200); });

  loader.then(() => {
    lenis?.start();
    hero.intro();
    if (RM) document.documentElement.classList.add('rm');
  });
});

// Lista de assets faltantes / placeholders (criterio de aceptación): se imprime al terminar de cargar.
window.addEventListener('load', () => {
  setTimeout(() => {
    const faltan = [...document.querySelectorAll('.falta, .sin-foto')].map((n) => n.textContent.trim().slice(0, 60));
    console.info(faltan.length ? `[INKU] Assets con placeholder (${faltan.length}): ${faltan.join(', ')}` : '[INKU] Assets: no hay placeholders, todos los archivos cargaron.');
  }, 1500);
});
