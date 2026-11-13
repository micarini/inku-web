// TU OMAKASE — datos del juego. Nombres y descripciones salen de la carta real de INKU.
// Para cambiar una foto: reemplazá el PNG en assets-src/omakase/ y corré `node scripts/cutout.mjs`
// (o pisá directamente el .webp en public/assets/omakase/). `ar` es el ancho/alto de la foto.

export const TEXTOS = {
  eyebrow: 'En manos del chef',
  titulo: 'Tu omakase',
  tituloJa: 'お任せ',
  intro: 'Armá tu tabla en cuatro pasos. Al final, se sella.',
  chef: 'Dejalo en manos del chef',
  chefJa: 'お任せ',
  chefLinea: 'Una sola progresión, como un trazo de tinta.',
  siguiente: 'Siguiente →',
  anterior: '←',
  sellar: 'Sellar',
  descargar: 'Descargar ticket',
  otra: 'Armar otra',
  ticketTab: 'Tu ticket',
  ticketVacio: 'El ticket se escribe a medida que armás la tabla.',
  ticketTitulo: 'Tu omakase',
  ticketChef: 'Selección del chef',
  ticketIka: 'Elegiste la tinta.',
  finTitulo: 'Sellado.',
  finTexto: 'Tu omakase quedó firmado con el hanko de la casa.',
  nikiriTitulo: 'Nikiri',
  nikiriJa: '煮切り',
  nikiriLinea: 'un solo gesto',
  nikiriAyuda: 'Arrastrá el puntero o el dedo sobre la fila de nigiri: un solo trazo.',
  nikiriChef: 'Que lo haga el chef',
  nikiriRepetir: 'Repetir el gesto',
};

export const STEPS = [
  { id: 'nigiri', titulo: 'Elegí tus nigiri', ja: '握り', ayuda: 'Elegí 8 piezas. Cada una se puede repetir hasta 2 veces: el nigiri va de a pares.', seccion: 'Nigiri' },
  { id: 'maki', titulo: 'Elegí un rollo', ja: '巻物', ayuda: 'Uno solo. Llega cortado en tres.', seccion: 'Maki' },
  { id: 'sides', titulo: 'Terminá la tabla', ja: '薬味', ayuda: 'Sumá gari y wasabi si querés, y pincelá el nikiri.', seccion: 'Acompañamientos' },
  { id: 'drink', titulo: '¿Con qué lo acompañás?', ja: '飲み物', ayuda: 'Una bebida, fuera de la tabla, como en la barra.', seccion: 'Bebida' },
];

export const NIGIRI = [
  { id: 'maguro', nombre: 'Maguro', ja: '鮪', desc: 'tuna', ar: 1.79 },
  { id: 'otoro', nombre: 'Otoro', ja: '大トロ', desc: 'fatty bluefin tuna', ar: 1.32 },
  { id: 'sake', nombre: 'Sake', ja: '鮭', desc: 'salmon', ar: 2.09 },
  { id: 'hamachi', nombre: 'Hamachi', ja: '鰤', desc: 'yellowtail', ar: 2.04 },
  { id: 'hotate', nombre: 'Hokkaido Scallop', ja: '帆立', desc: 'hotate, finger lime', ar: 1.62 },
  { id: 'ebi', nombre: 'Botan Ebi', ja: '牡丹海老', desc: 'sweet shrimp', ar: 2.01 },
  { id: 'uni', nombre: 'Hokkaido Uni', ja: '雲丹', desc: 'sea urchin', ar: 1.1 },
  { id: 'ika', nombre: 'Ika-sumi', ja: '烏賊墨', desc: 'squid, squid ink', nota: 'La pieza de la marca.', ar: 1.74 },
];

export const MAKI = [
  { id: 'toro-takuan', nombre: 'Toro Takuan', ja: 'トロたく', desc: 'fatty tuna, pickled radish', ar: 1.86 },
  { id: 'spicy-yuzu', nombre: 'Spicy Yuzu Tuna', ja: '柚子', desc: 'tuna, yuzu, chili', ar: 2.33 },
  { id: 'cucumber', nombre: 'Cucumber Blossom', ja: '胡瓜', desc: 'vegan', ar: 2.42 },
];

export const SIDES = [
  { id: 'gari', nombre: 'Gari', ja: '甘酢生姜', desc: 'jengibre encurtido', ar: 1.03 },
  { id: 'wasabi', nombre: 'Wasabi', ja: '山葵', desc: 'recién rallado', ar: 0.96 },
];

export const DRINKS = [
  { id: 'sake', nombre: 'Junmai Daiginjo “Dassai 45”', corto: 'Dassai 45', ja: '日本酒', desc: 'smooth, fruity, polished', ar: 2.05 },
  { id: 'matcha', nombre: 'Ceremonial Matcha', corto: 'Matcha', ja: '抹茶', desc: 'whisked to order', ar: 1 },
  { id: 'umeshu', nombre: 'Sparkling Umeshu', corto: 'Umeshu', ja: '梅酒', desc: 'plum wine, ice grape', ar: 1 },
];

/** Atajo "Dejalo en manos del chef": de lo más ligero a lo más intenso. */
export const CHEF = {
  nigiri: ['hotate', 'hamachi', 'sake', 'ebi', 'maguro', 'otoro', 'uni', 'ika'],
  maki: 'toro-takuan',
  drink: 'sake',
};

export const PIE = ['完全グルテンフリー · GLUTEN-FREE · COUNTER ONLY · 10 SEATS', 'OMAKASE 145 PER GUEST'];

const PREFIX = { nigiri: 'nigiri-', maki: 'maki-', sides: '', drink: 'bebida-' };
export const src = (kind, id) => `/assets/omakase/${PREFIX[kind]}${id}.webp`;
export const LIST = { nigiri: NIGIRI, maki: MAKI, sides: SIDES, drink: DRINKS };
export const find = (kind, id) => LIST[kind].find((x) => x.id === id);
