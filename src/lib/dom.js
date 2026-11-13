// Helpers de marcado compartidos por todas las secciones.

/** Tamaños reales de cada imagen (los imprime scripts/optimize.mjs) para evitar CLS. */
const DIM = {
  'fotos/chef-manos-nigiri': [1593, 2000], 'fotos/concepto-caligrafia-fuego': [1667, 2000],
  'fotos/feed-01': [1056, 1056], 'fotos/feed-02': [1056, 1056], 'fotos/feed-03': [1056, 1056],
  'fotos/feed-04': [1056, 1056], 'fotos/feed-05': [1056, 1056], 'fotos/feed-06': [1056, 1056],
  'fotos/feed-07': [1056, 1056], 'fotos/feed-08': [1056, 1056], 'fotos/feed-09': [1056, 1056],
  'fotos/fotografia-manos': [1741, 2000], 'fotos/hero-palillos-maki': [1889, 2000],
  'fotos/indumentaria-01': [1331, 2000], 'fotos/indumentaria-02': [1333, 2000],
  'fotos/indumentaria-03': [1530, 1530], 'fotos/indumentaria-04': [1515, 1710],
  'fotos/muestra-tela': [1080, 1320], 'fotos/packaging-caja': [2000, 1714],
  'fotos/serie-cuchillos': [1000, 880], 'fotos/territorio-01': [1350, 2000],
  'fotos/territorio-02': [1400, 950], 'fotos/territorio-03': [1072, 1584], 'fotos/territorio-04': [1072, 1584],
  'texturas/madera-quemada': [1183, 1600], 'texturas/madera-veteada': [1183, 1600],
  'texturas/papel-tinta': [1183, 1600], 'texturas/tinta-sumi': [1183, 1600],
  'aplicaciones/menu-portada': [1080, 1927], 'aplicaciones/menu-omakase': [1080, 1927],
  'aplicaciones/menu-carta': [1080, 2078], 'aplicaciones/menu-bebidas': [1201, 2046],
  'aplicaciones/tenugui': [1440, 1040], 'aplicaciones/noren': [1560, 1040],
};

export const A = (p) => `/assets/${p}`;

/** <img> WebP con srcset (960 + tamaño completo), lazy salvo que se pida eager. */
export function foto(key, alt = '', { sizes = '50vw', eager = false, cls = '', attrs = '' } = {}) {
  const [w, h] = DIM[key] || [1600, 1200];
  const has960 = key.startsWith('fotos/') || key.startsWith('texturas/');
  const small = Math.round((960 / Math.max(w, h)) * w);
  const srcset = has960 && Math.max(w, h) > 960 ? ` srcset="${A(key)}-960.webp ${small}w, ${A(key)}.webp ${w}w" sizes="${sizes}"` : '';
  return `<img src="${A(key)}.webp"${srcset} alt="${alt}" width="${w}" height="${h}" ${eager ? 'fetchpriority="high" decoding="sync"' : 'loading="lazy" decoding="async"'}${cls ? ` class="${cls}"` : ''} ${attrs} onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'falta',textContent:'${key}'}))">`;
}

/** Encabezado editorial de cada bloque (§2.4). */
export const head = (num, name) =>
  `<div class="sec-head" aria-hidden="true"><span>INKU — Manual de marca</span><span>${num} — ${name}</span></div>`;

export const ja = (t, cls = '') => `<span lang="ja" class="${cls}">${t}</span>`;

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

let toastT;
export function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('is-on');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('is-on'), 1600);
}

/** Generador pseudoaleatorio con semilla (bordes de tinta repetibles). */
export function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
