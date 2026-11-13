// Navegación global: barra superior, progreso, bordes de tinta entre secciones,
// línea de dibujo continua y links ancla.
import { gsap, ScrollTrigger, RM, canPin, scrollToEl } from './motion.js';
import { $, $$, rng } from './dom.js';

export function initNav() {
  const bar = $('#topbar');
  bar.classList.add('is-top');
  const num = $('#nav-num');
  const name = $('#nav-name');

  // Sección actual
  $$('[data-nav]').forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'top 50%',
      end: 'bottom 50%',
      onToggle: (self) => {
        if (!self.isActive) return;
        num.textContent = sec.dataset.nav;
        name.textContent = sec.dataset.name;
      },
    });
  });

  // Se oculta al bajar, aparece al subir + línea de progreso
  const fill = $('#progress-fill');
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      gsap.set(fill, { scaleY: self.progress });
      bar.classList.toggle('is-hidden', self.direction === 1 && self.scroll() > 120);
      bar.classList.toggle('is-top', self.scroll() < 40);
    },
  });

  // Links ancla (índice, volver al inicio, etc.)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const target = document.getElementById(a.getAttribute('href').slice(1));
    if (!target) return;
    e.preventDefault();
    scrollToEl(target);
    history.replaceState(null, '', a.getAttribute('href'));
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
}

/** Borde irregular de tinta arriba de cada sección: la sección "sube" sobre la anterior. */
export function initEdges() {
  $$('.sec[data-edge]').forEach((sec, i) => {
    const r = rng(31 + i * 17);
    const N = 72;
    let d = 'M0 80 L0 46';
    let y = 46;
    for (let k = 1; k <= N; k++) {
      const x = (k / N) * 1440;
      // deriva lenta + grano fino: borde de tinta absorbida, no una onda
      y += (r() - 0.5) * 16;
      y = Math.max(14, Math.min(62, y));
      const yy = y + (r() - 0.5) * 7 + Math.sin(k * 0.21 + i) * 9;
      d += ` L${x.toFixed(1)} ${yy.toFixed(1)}`;
    }
    d += ' L1440 80 Z';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'sec__edge');
    svg.setAttribute('viewBox', '0 0 1440 80');
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = `<path d="${d}"/>`;
    sec.prepend(svg);
    if (RM) return;
    gsap.fromTo(
      svg,
      { scaleY: 0.15 },
      { scaleY: 1, ease: 'none', scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top 55%', scrub: true } },
    );
  });
}

/**
 * Línea fina continua (estilo Bec): baja por toda la página y rodea los títulos.
 * Se recalcula en cada refresh porque los pins cambian el alto del documento.
 */
export function initTrazo() {
  const main = $('#contenido');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'trazo');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  svg.append(path);
  main.append(svg);
  let len = 0;

  const build = () => {
    const W = main.clientWidth;
    const footer = $('#cierre');
    const H = main.scrollHeight + footer.offsetHeight * 0.55;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg.style.height = `${H}px`;
    const top0 = main.getBoundingClientRect().top;
    const g = Math.max(16, W * 0.04);
    const pts = [[W * 0.5, 0]];
    const r = rng(11);
    let side = 1;
    $$('.sec', main).forEach((sec) => {
      const b = sec.getBoundingClientRect();
      const y0 = b.top - top0;
      const h = b.height;
      const t = sec.querySelector('.titulo');
      if (t) {
        // rodea el título como un trazo de pincel muy delgado
        const tb = t.getBoundingClientRect();
        const ty = tb.top - top0;
        const left = tb.left - 22;
        const right = Math.min(W - g * 0.5, tb.right + 30);
        pts.push([Math.min(W - g * 0.4, right + 90), ty - 34]);
        pts.push([right + 26, ty + tb.height + 10]);
        pts.push([(left + right) / 2, ty + tb.height + 17]);
        pts.push([Math.max(g * 0.35, left - 30), ty + tb.height + 24]);
        pts.push([Math.max(g * 0.3, left - 54), ty + tb.height + 96]);
      }
      // deriva por el margen del lado contrario hasta el final de la sección
      side *= -1;
      const mx = side > 0 ? W - g * (0.45 + r() * 0.4) : g * (0.45 + r() * 0.4);
      const steps = Math.max(1, Math.round(h / 700));
      for (let k = 1; k <= steps; k++) {
        const yy = y0 + (h * (k - 0.35)) / steps;
        if (t && yy < t.getBoundingClientRect().bottom - top0 + 120) continue;
        pts.push([mx + (r() - 0.5) * g * 0.5, yy]);
      }
    });
    pts.push([W * 0.5, H - 4]);
    pts.sort((a, b) => a[1] - b[1]);
    // Catmull-Rom → Bézier
    let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const k = 0.2;
      d += ` C${(p1[0] + (p2[0] - p0[0]) * k).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) * k).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) * k).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) * k).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
    }
    path.setAttribute('d', d);
    len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = RM ? 0 : len * (1 - (st ? st.progress : 0));
  };

  let st = null;
  if (!RM) {
    st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        // la punta del trazo va un poco por delante del centro de la pantalla
        const p = Math.min(1, (self.scroll() + window.innerHeight * 0.72) / (ScrollTrigger.maxScroll(window) + window.innerHeight));
        path.style.strokeDashoffset = len * (1 - p);
      },
    });
  }
  ScrollTrigger.addEventListener('refresh', build);
  build();
  void canPin;
}
