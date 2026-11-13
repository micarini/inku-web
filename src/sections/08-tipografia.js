// 08 · Tipografía (capítulo 04)
import { head, ja, $ } from '../lib/dom.js';

const T = {
  titulo: 'Tipografía',
  tituloJa: '書体',
  familias: [
    {
      cls: 'serif',
      nombre: 'Shippori Mincho',
      desc: 'Títulos y destacados. Serif de origen japonés: aporta el tono editorial y caligráfico.',
    },
    {
      cls: 'sans',
      nombre: 'Zen Kaku Gothic New',
      desc: 'Textos, menús y datos. Sans japonesa de lectura limpia que acompaña sin competir.',
    },
  ],
  kana: 'あいう アイウ 寿司 墨',
  mayus: 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ',
  minus: 'abcdefghijklmnñopqrstuvwxyz',
  acentos: 'áéíóúü ÁÉÍÓÚÜ ¿? ¡! 0123456789',
  probar: 'Probá la voz de la marca',
  placeholder: 'Un solo gesto.',
  ayuda: 'Escribí acá: el mismo texto en las dos familias.',
};

export const template = `
<section id="tipografia" class="sec sec--tinta tipo" data-edge data-nav="08" data-name="Tipografía" aria-labelledby="tipo-h">
  ${head('04', 'Tipografía')}
  <div class="wrap tipo__in">
    <div class="tipo__head">
      <h2 id="tipo-h" class="titulo titulo--s" data-split>${T.titulo}</h2>
      <p class="ja" data-reveal>${ja(T.tituloJa)}</p>
    </div>
    <div class="tipo__cols">
      ${T.familias.map((f, i) => `
      <article class="tipo__col tipo__col--${f.cls}" data-reveal data-delay="${i * 0.12}">
        <p class="eyebrow">${f.nombre}</p>
        <p class="tipo__aa" aria-hidden="true">Aa</p>
        <p class="cuerpo">${f.desc}</p>
        <p class="tipo__abc">
          ${ja(T.kana, 'tipo__kana')}<br>
          ${T.mayus}<br>${T.minus}<br>${T.acentos}
        </p>
      </article>`).join('')}
    </div>
    <div class="tipo__probar" data-reveal>
      <label class="eyebrow" id="tipo-label">${T.probar}</label>
      <div class="tipo__campo" contenteditable="true" role="textbox" aria-multiline="false" aria-labelledby="tipo-label" aria-describedby="tipo-ayuda" data-placeholder="${T.placeholder}" spellcheck="false" data-cursor="Escribir"></div>
      <p class="tipo__espejo" aria-hidden="true">${T.placeholder}</p>
      <p class="nota" id="tipo-ayuda">${T.ayuda}</p>
    </div>
  </div>
</section>`;

export function init() {
  const campo = $('.tipo__campo');
  const espejo = $('.tipo__espejo');
  const sync = () => {
    const txt = campo.textContent.replace(/\n/g, ' ').slice(0, 80);
    espejo.textContent = txt || T.placeholder;
    espejo.classList.toggle('is-vacio', !txt);
    if (!txt) campo.innerHTML = ''; // para que vuelva a verse el placeholder
  };
  campo.addEventListener('input', sync);
  campo.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') e.preventDefault();
    e.stopPropagation(); // las teclas del campo no disparan atajos globales
  });
  campo.addEventListener('paste', (e) => {
    e.preventDefault();
    const t = (e.clipboardData || window.clipboardData).getData('text/plain').replace(/\s+/g, ' ').slice(0, 80);
    document.execCommand('insertText', false, t);
  });
}
