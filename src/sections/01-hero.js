// 01 · Hero (portada)
import { gsap, RM, canPin } from '../lib/motion.js';
import { foto, ja, $ } from '../lib/dom.js';

const T = {
  titulo: 'Manual de marca',
  bajada: 'Omakase de autor — 2026',
  scroll: 'Desliza ↓',
  scrollJa: 'スクロール',
  altFoto: 'Un maki de salmón sostenido con palillos de madera sobre fondo negro',
};

export const template = `
<section id="portada" class="sec sec--tinta hero" data-nav="01" data-name="Portada" aria-labelledby="hero-h">
  <div class="hero__left">
    <div class="hero__lockup">
      <h1 id="hero-h" class="hero__logo">
        <span class="vh">INKU — ${T.titulo}</span>
        <span class="hero__pez" aria-hidden="true"><img src="/assets/logo/inku-principal.svg" alt="" width="779" height="570"></span>
        <span class="hero__word" aria-hidden="true"><img src="/assets/logo/inku-principal.svg" alt="" width="779" height="570"></span>
      </h1>
      <span class="hero__rule" aria-hidden="true"></span>
      <p class="hero__titulo">${T.titulo}</p>
      <p class="hero__bajada">${T.bajada}</p>
    </div>
    <p class="hero__scroll">${T.scroll} <span aria-hidden="true">/</span> ${ja(T.scrollJa)}</p>
  </div>
  <div class="hero__foto foto">
    ${foto('fotos/hero-palillos-maki', T.altFoto, { sizes: '(min-width: 768px) 53vw, 100vw', eager: true })}
  </div>
</section>`;

export function init() {
  const hero = $('#portada');
  if (!RM) {
    // estado inicial (lo revela intro() cuando termina el loader)
    gsap.set('.hero__pez', { x: -40, clipPath: 'inset(0% 100% 0% 0%)' });
    gsap.set('.hero__word', { clipPath: 'inset(0% 0% 100% 0%)' });
    gsap.set('.hero__rule', { scaleX: 0 });
    gsap.set(['.hero__titulo', '.hero__bajada', '.hero__scroll'], { opacity: 0, y: 14 });
    gsap.set('.hero__foto img', { scale: 1.08 });
  }
  if (canPin()) {
    // parallax lento de la foto y logo que se queda casi fijo hasta que sale
    gsap.to('.hero__foto img', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__left', { y: () => window.innerHeight * 0.55, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true, invalidateOnRefresh: true } });
  }
}

/** Entrada del hero: el pez entra "nadando" (40px + desenmascarado de izquierda a derecha). */
export function intro() {
  if (RM) return;
  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .to('.hero__foto img', { scale: 1, duration: 2.2, ease: 'power3.out' }, 0)
    .to('.hero__pez', { x: 0, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'ink' }, 0.1)
    .to('.hero__word', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'ink' }, 0.55)
    .to('.hero__rule', { scaleX: 1, duration: 0.9 }, 1.1)
    .to(['.hero__titulo', '.hero__bajada', '.hero__scroll'], { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, 1.2);
}
