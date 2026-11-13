// GSAP + Lenis: un solo lugar donde se registran los plugins y se decide
// qué se anima según el dispositivo y prefers-reduced-motion.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
import { Draggable } from 'gsap/Draggable';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, Flip, Draggable);
gsap.defaults({ ease: 'power3.out', duration: 1 });

// `?reduced` en la URL fuerza el modo sin movimiento (para probarlo o presentar sin animaciones)
export const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(location.search).has('reduced');
export const isMobile = () => window.matchMedia('(max-width: 767px)').matches;
export const isDesktop = () => window.matchMedia('(min-width: 1280px)').matches;
export const finePointer = window.matchMedia('(pointer: fine)').matches;
/** Pins y scrub largos: solo de tablet para arriba y sin reduced-motion. */
export const canPin = () => !RM && !isMobile();

export const EASE_INK = 'cubic-bezier(.65,.05,.36,1)';
// --ease-ink como ease de GSAP: cubic-bezier(.65,.05,.36,1) resuelto por Newton.
function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const fx = (t) => ((ax * t + bx) * t + cx) * t;
  const fy = (t) => ((ay * t + by) * t + cy) * t;
  const dfx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    if (x <= 0 || x >= 1) return x <= 0 ? 0 : 1;
    let t = x;
    for (let i = 0; i < 6; i++) {
      const d = dfx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= (fx(t) - x) / d;
    }
    return fy(Math.min(1, Math.max(0, t)));
  };
}
gsap.registerEase('ink', bezier(0.65, 0.05, 0.36, 1));

export let lenis = null;
export function initScroll() {
  if (RM) return null;
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}
export function scrollToEl(target, opts = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4), ...opts });
  else el.scrollIntoView({ behavior: 'auto', block: 'start' });
}

export { gsap, ScrollTrigger, Flip, Draggable };
