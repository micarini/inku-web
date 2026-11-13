// 12 · ★ TU OMAKASE お任せ — el momento interactivo.
// Los textos del juego están en src/omakase/data.js (TEXTOS, STEPS y las piezas).
import { head, ja, $ } from '../lib/dom.js';
import { TEXTOS as T, STEPS } from '../omakase/data.js';
import { ticketHTML } from '../omakase/ticket.js';
import { initBoard } from '../omakase/board.js';

const O = '/assets/omakase/';
const falta = (n) => `onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'falta',textContent:'${n}'}))"`;

export const template = `
<section id="omakase" class="sec om" data-edge data-nav="12" data-name="Tu omakase" data-step="1" aria-labelledby="om-h">
  ${head('★', 'Tu omakase')}
  <div class="om__bg" aria-hidden="true"></div>
  <canvas class="om__dust" aria-hidden="true"></canvas>

  <div class="om__wrap">
    <div class="om__top">
      <div>
        <p class="eyebrow">${T.eyebrow}</p>
        <h2 id="om-h" class="titulo titulo--s">${T.titulo} ${ja(T.tituloJa, 'om__ja')}</h2>
      </div>
      <button type="button" class="om__chef" data-cursor="Chef">${T.chef} ${ja(T.chefJa)}</button>
    </div>

    <div class="om__grid">
      <!-- Columna izquierda: barra de piezas del paso -->
      <aside class="om__bar" aria-label="Piezas del paso actual">
        <div class="om__paso">
          <div class="om__paso-fila">
            <p class="eyebrow om__paso-n" aria-live="off">Paso 1 / 4</p>
            <ol class="om__steps" aria-label="Pasos">
              ${STEPS.map((s, i) => `<li><button type="button" aria-label="Paso ${i + 1}: ${s.seccion}">${i + 1}</button></li>`).join('')}
            </ol>
          </div>
          <h3 class="om__paso-h"><span class="om__paso-t"></span> <span class="om__paso-k" lang="ja"></span></h3>
          <p class="om__paso-d"></p>
        </div>
        <div class="om__cards" role="group" aria-label="Piezas para elegir"></div>
        <div class="om__extra" hidden>
          <p class="om__nik-t"><strong>${T.nikiriTitulo}</strong> ${ja(T.nikiriJa)} <em>— ${T.nikiriLinea}</em></p>
          <p class="om__nik-estado"></p>
          <div class="om__nik-btns">
            <button type="button" class="om__mini om__nik-chef">${T.nikiriChef}</button>
            <button type="button" class="om__mini om__nik-repetir" hidden>${T.nikiriRepetir}</button>
          </div>
        </div>
        <div class="om__ficha" aria-hidden="true"></div>
      </aside>

      <!-- Centro: la geta -->
      <div class="om__stage">
        <div class="om__scene">
          <div class="om__drink" aria-label="Lugar de la bebida"></div>
          <div class="om__geta">
            <img class="om__geta-img" src="${O}geta.webp" alt="Geta: tabla de madera oscura vista desde arriba" width="872" height="579" ${falta('geta')}>
            <div class="om__slots" aria-label="Lugares para nigiri">
              ${Array.from({ length: 8 }, (_, i) => `<div class="slot" data-slot="${i}"><span class="slot__n" aria-hidden="true">${i + 1}</span></div>`).join('')}
            </div>
            <div class="om__zone om__zone--maki"></div>
            <div class="om__zone om__zone--gari"></div>
            <div class="om__zone om__zone--wasabi"></div>
            <svg class="om__nikiri" viewBox="0 0 1000 670" preserveAspectRatio="none" aria-hidden="true" data-cursor="Arrastrar">
              <defs>
                <clipPath id="om-nik-clip"><rect x="0" y="0" width="1000" height="670"/></clipPath>
                <filter id="om-nik-borde" x="-5%" y="-30%" width="110%" height="160%"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="9" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="5"/></filter>
              </defs>
              <g clip-path="url(#om-nik-clip)"><path class="om__nikiri-trazo" d="" fill="#2A160C" fill-opacity=".85" filter="url(#om-nik-borde)"/></g>
            </svg>
            <img class="om__ghost" src="${O}nigiri-maguro.webp" alt="" aria-hidden="true">
          </div>
          <!-- La tapa de la caja y el sello (final) -->
          <div class="om__lid" aria-hidden="true">
            <img src="${O}caja-tapa.webp" alt="" width="662" height="533" ${falta('caja-tapa')}>
            <div class="om__stamp">
              <svg viewBox="0 0 120 220" preserveAspectRatio="none"><defs><filter id="om-mancha"><feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="5" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="9"/></filter></defs><rect x="10" y="10" width="100" height="200" rx="10" fill="#C42A26" fill-opacity=".5" filter="url(#om-mancha)"/></svg>
              <img src="/assets/sello/sello-inku.svg" alt="">
            </div>
          </div>
        </div>
        <p class="om__chefline" aria-hidden="true">${T.chefLinea}</p>
      </div>

      <!-- Columna derecha: ticket en vivo + botón del paso -->
      <aside class="om__side" aria-label="Ticket">
        <button type="button" class="om__tab" aria-expanded="false" aria-controls="om-sheet">${T.ticketTab} (<span class="om__tab-n">0</span>)</button>
        <div class="om__sheet" id="om-sheet" data-lenis-prevent>
          <button type="button" class="om__sheet-cerrar" aria-label="Cerrar el ticket">Cerrar</button>
          ${ticketHTML}
        </div>
        <div class="om__actions">
          <button type="button" class="om__back" aria-label="Paso anterior" hidden>${T.anterior}</button>
          <button type="button" class="om__next" disabled>${T.siguiente}</button>
        </div>
      </aside>

      <!-- Final -->
      <div class="om__fin" hidden>
        <p class="om__fin-t">${T.finTitulo}</p>
        <p class="cuerpo">${T.finTexto}</p>
        <button type="button" class="om__btn om__descargar" data-cursor="PNG">${T.descargar}</button>
        <button type="button" class="om__btn om__btn--fino om__otra">${T.otra}</button>
      </div>
    </div>
  </div>
  <p class="vh om__live" aria-live="polite"></p>
</section>`;

export function init() {
  initBoard($('#omakase'));
}
