// Reveals genéricos por atributo. El lenguaje es la tinta: máscaras y clip-path,
// nunca zoom ni rebote.
//   data-split   → títulos por línea (yPercent 100 → 0 con máscara)
//   data-reveal  → aparece (opacity + 20px)
//   data-clip    → imagen que se "pinta" con clip-path vertical (1,2 s)
//   data-stagger → sus hijos directos entran escalonados
import { gsap, ScrollTrigger, RM } from './motion.js';
import { $$ } from './dom.js';

/** SplitText por línea, casero (SplitText no viene en el paquete npm gsap@3.12.5). */
export function splitLines(el) {
  if (el.dataset.splitDone) return $$('.line__in', el);
  const original = el.innerHTML;
  el.dataset.original = original;
  // 1) envolver cada palabra, respetando <br> y spans
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((w) => {
          if (!w) return;
          if (/^\s+$/.test(w)) frag.append(' ');
          else {
            const s = document.createElement('span');
            s.className = 'w';
            s.style.display = 'inline-block';
            s.textContent = w;
            frag.append(s);
          }
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
    });
  };
  walk(el);
  // 2) agrupar por línea según offsetTop
  const words = $$('.w', el);
  const lines = [];
  let top = null;
  words.forEach((w) => {
    const t = w.offsetTop;
    if (top === null || Math.abs(t - top) > 4) {
      lines.push([]);
      top = t;
    }
    lines[lines.length - 1].push(w);
  });
  // 3) reconstruir
  el.innerHTML = '';
  lines.forEach((ws) => {
    const line = document.createElement('span');
    line.className = 'line';
    const inner = document.createElement('span');
    inner.className = 'line__in';
    ws.forEach((w, i) => {
      // conserva el span padre si la palabra venía con clase (ej. japonés en rojo)
      const p = w.dataset.wrap;
      inner.append(w.textContent + (i < ws.length - 1 ? ' ' : ''));
      void p;
    });
    line.append(inner);
    el.append(line);
  });
  el.dataset.splitDone = '1';
  return $$('.line__in', el);
}

export function initReveals(root = document) {
  const start = 'top 86%';

  $$('[data-split]', root).forEach((el) => {
    if (RM) {
      gsap.from(el, { opacity: 0, duration: 0.3, scrollTrigger: { trigger: el, start, once: true } });
      return;
    }
    const lines = splitLines(el);
    gsap.set(lines, { yPercent: 105 });
    ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => gsap.to(lines, { yPercent: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1, delay: +el.dataset.delay || 0 }),
    });
  });

  $$('[data-reveal]', root).forEach((el) => {
    gsap.set(el, RM ? { opacity: 0 } : { opacity: 0, y: 20 });
    ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: RM ? 0.3 : 1, delay: RM ? 0 : +el.dataset.delay || 0 }),
    });
  });

  $$('[data-stagger]', root).forEach((el) => {
    const kids = [...el.children];
    gsap.set(kids, RM ? { opacity: 0 } : { opacity: 0, y: 18 });
    ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => gsap.to(kids, { opacity: 1, y: 0, duration: RM ? 0.3 : 0.9, stagger: RM ? 0 : +el.dataset.stagger || 0.1 }),
    });
  });

  // Imágenes: clip-path vertical escalonado dentro de cada grupo
  const groups = new Map();
  $$('[data-clip]', root).forEach((el) => {
    const g = el.closest('[data-clip-group]') || el;
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(el);
  });
  groups.forEach((els, g) => {
    if (RM) {
      gsap.set(els, { opacity: 0 });
      ScrollTrigger.create({ trigger: g, start, once: true, onEnter: () => gsap.to(els, { opacity: 1, duration: 0.3 }) });
      return;
    }
    gsap.set(els, { clipPath: 'inset(100% 0% 0% 0%)' });
    els.forEach((el) => gsap.set(el.querySelector('img'), { scale: 1.08, transformOrigin: '50% 100%' }));
    ScrollTrigger.create({
      trigger: g,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.to(els, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'ink', stagger: 0.12 });
        gsap.to(els.map((e) => e.querySelector('img')).filter(Boolean), { scale: 1, duration: 1.6, ease: 'power3.out', stagger: 0.12 });
      },
    });
  });
}
