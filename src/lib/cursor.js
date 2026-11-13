// Cursor: punto de tinta de 8px que sigue al mouse con lerp. Sobre elementos
// interactivos crece a 36px; con data-cursor="Ver" muestra una palabra corta.
import { gsap, finePointer, RM } from './motion.js';

export function initCursor() {
  if (!finePointer) return;
  const c = document.getElementById('cursor');
  const dot = c.firstElementChild;
  let x = -100, y = -100, tx = -100, ty = -100;
  const read = (target) => {
    const t = target?.closest?.('[data-cursor], a, button, [role="button"], [contenteditable]');
    const label = t && !t.disabled ? t.dataset.cursor || '' : '';
    c.classList.toggle('is-on', !!t && !t.disabled);
    c.classList.toggle('has-label', !!label);
    if (dot.textContent !== label) dot.textContent = label;
  };
  window.addEventListener('pointermove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    read(e.target);
  }, { passive: true });
  // al hacer scroll sin mover el mouse cambia lo que hay debajo del punto
  let raf = 0;
  window.addEventListener('scroll', () => {
    if (raf || tx < 0) return;
    raf = requestAnimationFrame(() => { raf = 0; read(document.elementFromPoint(tx, ty)); });
  }, { passive: true });
  document.addEventListener('pointerleave', () => { tx = ty = -100; });
  const k = RM ? 1 : 0.22;
  gsap.ticker.add(() => {
    x += (tx - x) * k;
    y += (ty - y) * k;
    c.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
  });
}
