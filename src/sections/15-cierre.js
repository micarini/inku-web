// 15 · Cierre (va dentro del <footer>)
import { CONFIG } from '../config.js';
import { ja } from '../lib/dom.js';

const T = {
  ja: 'インク',
  bajada: 'Omakase de autor',
  volver: 'Volver al inicio',
};

export const template = `
  <div class="cierre__in">
    <img class="cierre__logo" src="/assets/logo/inku-principal.svg" alt="INKU" width="779" height="570" loading="lazy" data-reveal>
    <p class="cierre__ja" data-reveal>${ja(T.ja)}</p>
    <p class="cierre__bajada" data-reveal>${T.bajada}</p>
    <a class="cierre__volver" href="#portada" data-cursor="Subir" data-reveal>
      <span>${T.volver}</span>
      <svg viewBox="0 0 220 16" preserveAspectRatio="none" aria-hidden="true"><path d="M3 9 C 40 4, 80 13, 120 7 S 190 6, 217 9" pathLength="1"/></svg>
    </a>
  </div>
  <div class="cierre__creditos" data-reveal>
    <p><span class="eyebrow">Proyecto</span>${CONFIG.alumna}</p>
    <p><span class="eyebrow">Materia</span>${CONFIG.materia} — ${CONFIG.institucion}</p>
    <p><span class="eyebrow">Año</span>${CONFIG.anio}</p>
    ${CONFIG.nota ? `<p class="cierre__nota">${CONFIG.nota}</p>` : ''}
  </div>`;

export function init() {}
