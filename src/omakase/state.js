// Estado del juego: un objeto simple y funciones puras (devuelven un estado nuevo).
// No se guarda nada en localStorage.

export const initial = () => ({
  step: 1, // 1..4
  nigiri: Array(8).fill(null),
  maki: null,
  gari: false,
  wasabi: false,
  nikiri: null, // path d del trazo
  drink: null,
  mode: 'free', // 'free' | 'chef'
  sealed: false,
});

const MAX_REPEAT = 2;

/** Agrega una pieza. Devuelve { state, slot } o null si no se puede. */
export function add(s, kind, id, slot = null) {
  if (s.sealed) return null;
  if (kind === 'nigiri') {
    if (s.nigiri.filter((x) => x === id).length >= MAX_REPEAT) return null;
    const i = slot !== null && s.nigiri[slot] === null ? slot : s.nigiri.indexOf(null);
    if (i < 0) return null;
    const nigiri = s.nigiri.slice();
    nigiri[i] = id;
    return { state: { ...s, nigiri }, slot: i };
  }
  if (kind === 'maki') return { state: { ...s, maki: id }, slot: 0 };
  if (kind === 'sides') return { state: { ...s, [id]: true }, slot: 0 };
  if (kind === 'drink') return { state: { ...s, drink: id }, slot: 0 };
  if (kind === 'nikiri') return { state: { ...s, nikiri: id }, slot: 0 };
  return null;
}

export function remove(s, kind, slotOrId = null) {
  if (s.sealed) return s;
  if (kind === 'nigiri') {
    const nigiri = s.nigiri.slice();
    nigiri[slotOrId] = null;
    return { ...s, nigiri };
  }
  if (kind === 'maki') return { ...s, maki: null };
  if (kind === 'sides') return { ...s, [slotOrId]: false };
  if (kind === 'drink') return { ...s, drink: null };
  if (kind === 'nikiri') return { ...s, nikiri: null };
  return s;
}

export const stepDone = (s, n) =>
  n === 1 ? s.nigiri.every(Boolean) : n === 2 ? !!s.maki : n === 3 ? !!s.nikiri : n === 4 ? !!s.drink : false;

/** Se puede ir a un paso si todos los anteriores están completos. */
export const canGo = (s, n) => n >= 1 && n <= 4 && [1, 2, 3].slice(0, n - 1).every((k) => stepDone(s, k));

/** Volver atrás siempre se puede; avanzar, solo con los pasos anteriores completos. */
export const reachable = (s, n) => n >= 1 && n <= 4 && (n <= s.step || canGo(s, n));
export const setStep = (s, n) => (reachable(s, n) && !s.sealed ? { ...s, step: n } : s);

export const complete = (s) => [1, 2, 3, 4].every((n) => stepDone(s, n));

export const seal = (s) => (complete(s) ? { ...s, sealed: true } : s);

/** Cantidad de renglones del ticket (para la pestaña "Tu ticket (5)"). */
export const count = (s) =>
  s.nigiri.filter(Boolean).length + (s.maki ? 1 : 0) + (s.gari ? 1 : 0) + (s.wasabi ? 1 : 0) + (s.nikiri ? 1 : 0) + (s.drink ? 1 : 0);

export const countOf = (s, id) => s.nigiri.filter((x) => x === id).length;
