// 04 · En manos del chef お任せ
import { foto, head, ja } from '../lib/dom.js';

const T = {
  ja: 'お任せ',
  titulo: 'En manos<br>del chef.',
  cuerpo: 'INKU es un omakase de autor: el comensal se entrega a la decisión del chef. La marca transmite esa misma filosofía.',
  valores: ['Precisión', 'Intención', 'Un solo gesto'],
  altFoto: 'Las manos del chef pincelan un nigiri con nikiri antes de servirlo',
};

export const template = `
<section id="chef" class="sec sec--madera chef" data-edge data-nav="04" data-name="En manos del chef" aria-labelledby="chef-h">
  ${head('01', 'Concepto')}
  <div class="chef__grid">
    <div class="chef__foto">
      <div class="foto" data-clip>
        ${foto('fotos/chef-manos-nigiri', T.altFoto, { sizes: '(min-width: 768px) 45vw, 100vw' })}
      </div>
    </div>
    <div class="chef__texto">
      <div class="chef__bloque">
        <p class="ja" data-reveal>${ja(T.ja)}</p>
        <h2 id="chef-h" class="titulo" data-split>${T.titulo}</h2>
        <p class="cuerpo" data-reveal>${T.cuerpo}</p>
      </div>
      <ul class="chef__valores" data-stagger="0.12">
        ${T.valores.map((v, i) => `<li><span class="chef__punto${i === 2 ? ' is-rojo' : ''}" aria-hidden="true"></span>${v}</li>`).join('')}
      </ul>
    </div>
  </div>
</section>`;

export function init() {}
