// 05 · Territorio visual
import { foto, head } from '../lib/dom.js';

const T = {
  titulo: 'Territorio<br>visual',
  cuerpo: 'Un universo moody y sobrio: la mesa de un sushi bar de barra. Madera oscura, papel washi, el negro profundo de la tinta y el rojo del sello.',
  remate: 'Adulta. Silenciosa. Artesanal.',
  fotos: [
    ['fotos/territorio-01', 'La mano del chef sobre una fila de cortes de pescado en la tabla'],
    ['fotos/territorio-02', 'Textura de madera quemada yakisugi'],
    ['fotos/territorio-03', 'Un nigiri de atún sobre una piedra clara'],
    ['fotos/territorio-04', 'Interior del salón en tonos madera y terracota'],
  ],
};

export const template = `
<section id="territorio" class="sec sec--tinta territorio" data-edge data-nav="05" data-name="Territorio visual" aria-labelledby="territorio-h">
  ${head('01', 'Concepto')}
  <div class="wrap territorio__grid">
    <div class="territorio__texto">
      <h2 id="territorio-h" class="titulo titulo--s" data-split>${T.titulo}</h2>
      <p class="cuerpo" data-reveal>${T.cuerpo}</p>
      <p class="remate" data-reveal>${T.remate}</p>
    </div>
    <div class="territorio__fotos" data-clip-group>
      ${T.fotos.map(([k, alt], i) => `<figure class="foto territorio__f territorio__f--${i + 1}" data-clip>${foto(k, alt, { sizes: i === 0 ? '(min-width:768px) 28vw, 100vw' : '(min-width:768px) 29vw, 50vw' })}</figure>`).join('')}
    </div>
  </div>
</section>`;

export function init() {}
