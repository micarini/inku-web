// 02 · Índice 目次
import { head, ja } from '../lib/dom.js';

const T = {
  titulo: 'Índice',
  tituloJa: '目次',
  // [número, nombre, ancla]
  items: [
    ['01', 'Concepto', '#concepto'],
    ['02', 'Logotipo', '#logotipo'],
    ['03', 'Color', '#paleta'],
    ['04', 'Tipografía', '#tipografia'],
    ['05', 'Recursos gráficos', '#recursos'],
    ['06', 'Fotografía', '#fotografia'],
    ['07', 'Aplicaciones', '#aplicaciones'],
    ['08', 'Indumentaria', '#indumentaria'],
    ['09', 'Redes sociales', '#feed'],
  ],
  omakase: ['Tu omakase', 'お任せ', '#omakase'],
};

export const template = `
<section id="indice" class="sec sec--tinta indice" data-edge data-nav="02" data-name="Índice" aria-labelledby="indice-h">
  ${head('00', 'Índice')}
  <div class="wrap indice__grid">
    <div class="indice__titulo">
      <h2 id="indice-h" class="titulo" data-split>${T.titulo}</h2>
      <p class="ja" data-reveal>${ja(T.tituloJa)}</p>
    </div>
    <nav aria-label="Índice del manual">
      <ol class="indice__lista" data-stagger="0.06">
        ${T.items.map(([n, t, h]) => `<li><a href="${h}" data-cursor="Ir"><span class="indice__n">${n}</span><span class="indice__t">${t}</span></a></li>`).join('')}
        <li class="indice__omakase"><a href="${T.omakase[2]}" data-cursor="Jugar"><img class="indice__sello" src="/assets/sello/sello-inku.svg" alt="" width="250" height="520"><span class="indice__t">${T.omakase[0]} ${ja(T.omakase[1], 'indice__ja')}</span></a></li>
      </ol>
    </nav>
  </div>
</section>`;

export function init() {}
