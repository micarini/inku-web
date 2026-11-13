// 00 · Intro / loader (≈2,5 s, se salta con click o tecla).
// El marcado está en index.html para que se vea antes de que cargue el JS.
import { gsap, RM } from '../lib/motion.js';
import { $ } from '../lib/dom.js';

const HERO_IMG = '/assets/fotos/territorio-03.webp';

/** Espera de verdad: fuentes + imagen del hero decodificada. */
function assetsReady() {
  const img = new Image();
  img.src = HERO_IMG;
  const decoded = img.decode ? img.decode().catch(() => {}) : new Promise((r) => (img.onload = img.onerror = r));
  const fonts = Promise.all([
    document.fonts.load('400 1em "Shippori Mincho"', 'Aインク'),
    document.fonts.load('400 1em "Zen Kaku Gothic New"', 'A'),
    document.fonts.ready,
  ]).catch(() => {});
  // tope de seguridad: nunca más de 8 s en el loader
  return Promise.race([Promise.all([decoded, fonts]), new Promise((r) => setTimeout(r, 8000))]);
}

export function runLoader() {
  const el = $('#loader');
  const ready = assetsReady();
  gsap.set('.loader__sello', { xPercent: -50, yPercent: -50, left: '50%', top: '50%' });
  return new Promise((resolve) => {
    let done = false;
    const finish = (fast = false) => {
      if (done) return;
      done = true;
      window.removeEventListener('keydown', onKey);
      el.removeEventListener('click', onClick);
      ready.then(() => {
        document.body.classList.remove('is-loading');
        resolve();
        gsap.to(el, { opacity: 0, duration: fast || RM ? 0.3 : 0.9, ease: 'power2.inOut', onComplete: () => el.remove() });
      });
    };
    const onKey = () => { tl.kill(); finish(true); };
    const onClick = () => { tl.kill(); finish(true); };
    window.addEventListener('keydown', onKey);
    el.addEventListener('click', onClick);

    const tl = gsap.timeline({ onComplete: () => finish() });
    if (RM) {
      gsap.set('.loader__path', { strokeDashoffset: 0 });
      tl.to('.loader__sello', { opacity: 1, duration: 0.3 }).to({}, { duration: 0.5 });
      return;
    }
    tl.to('.loader__path--a', { strokeDashoffset: 0, duration: 1.25, ease: 'power2.inOut' }, 0.15)
      .to('.loader__path--b', { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, 0.3)
      // golpe del sello: scale 1.15 → 1, opacity 0 → 1 en 0,25 s
      .fromTo('.loader__sello', { opacity: 0, scale: 1.15 }, { opacity: 1, scale: 1, duration: 0.25, ease: 'power3.in' }, 1.55)
      // sacudón seco de 2px
      .to(el, { keyframes: [{ x: 2, y: 1, duration: 0.04 }, { x: -2, y: -1, duration: 0.04 }, { x: 1, y: 0, duration: 0.04 }, { x: 0, y: 0, duration: 0.04 }], ease: 'none' }, 1.8)
      .to({}, { duration: 0.55 });
  });
}
