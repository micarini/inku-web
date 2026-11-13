// Nikiri 煮切り — "un solo gesto": trazo de pincel con grosor variable según la velocidad.
// El trazo es un path SVG relleno (contorno izquierdo + derecho), suavizado.

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/** Suaviza la polilínea (media móvil) conservando los extremos. */
function smooth(pts, passes = 2) {
  let p = pts;
  for (let k = 0; k < passes; k++) {
    p = p.map((pt, i) => {
      if (i === 0 || i === p.length - 1) return pt;
      const a = p[i - 1], b = p[i + 1];
      return { x: (a.x + pt.x * 2 + b.x) / 4, y: (a.y + pt.y * 2 + b.y) / 4, w: (a.w + pt.w * 2 + b.w) / 4 };
    });
  }
  return p;
}

/** Convierte puntos {x, y, w} en el `d` de un path relleno con puntas afinadas. */
export function strokePath(raw) {
  if (raw.length < 2) return '';
  const pts = smooth(raw);
  const n = pts.length;
  const L = [], R = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len; dy /= len;
    const t = i / (n - 1);
    // punta: entra fino, sale en pelo seco
    const taper = Math.min(1, t / 0.08) * Math.min(1, (1 - t) / 0.16);
    const h = (pts[i].w / 2) * (0.25 + 0.75 * Math.sqrt(clamp(taper, 0, 1)));
    L.push([pts[i].x - dy * h, pts[i].y + dx * h]);
    R.push([pts[i].x + dy * h, pts[i].y - dx * h]);
  }
  const f = (v) => v.toFixed(1);
  const curve = (arr) => {
    let d = '';
    for (let i = 1; i < arr.length - 1; i++) {
      const mx = (arr[i][0] + arr[i + 1][0]) / 2, my = (arr[i][1] + arr[i + 1][1]) / 2;
      d += ` Q${f(arr[i][0])} ${f(arr[i][1])} ${f(mx)} ${f(my)}`;
    }
    const last = arr[arr.length - 1];
    return `${d} L${f(last[0])} ${f(last[1])}`;
  };
  const Rr = R.slice().reverse();
  return `M${f(L[0][0])} ${f(L[0][1])}${curve(L)} L${f(Rr[0][0])} ${f(Rr[0][1])}${curve(Rr)} Z`;
}

/** Trazo del chef: de (x0,y0) a (x1,y1) con un pulso leve, como una pincelada segura. */
export function chefPoints(x0, y0, x1, y1, wMax = 30) {
  const N = 26, pts = [];
  const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len, ny = dx / len;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const wob = Math.sin(t * Math.PI * 1.6 + 0.4) * len * 0.018 + Math.sin(t * Math.PI * 4.2) * len * 0.006;
    pts.push({ x: x0 + dx * t + nx * wob, y: y0 + dy * t + ny * wob, w: wMax * (0.72 + 0.28 * Math.sin(t * Math.PI)) });
  }
  return pts;
}

/**
 * Dibujo con puntero o dedo sobre el SVG. Un solo trazo: al soltar, llama onEnd(d).
 * `enabled()` decide si se puede dibujar en este momento.
 */
export function attachDraw(svg, path, { enabled, onStart, onEnd }) {
  let pts = null, last = null, w = 26;
  const toVB = (e) => {
    const r = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    return { x: ((e.clientX - r.left) / r.width) * vb.width, y: ((e.clientY - r.top) / r.height) * vb.height };
  };
  svg.addEventListener('pointerdown', (e) => {
    if (!enabled() || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.preventDefault();
    svg.setPointerCapture(e.pointerId);
    const p = toVB(e);
    w = 26;
    pts = [{ ...p, w }];
    last = { ...p, t: performance.now() };
    onStart?.();
  });
  svg.addEventListener('pointermove', (e) => {
    if (!pts) return;
    const p = toVB(e), now = performance.now();
    const dist = Math.hypot(p.x - last.x, p.y - last.y);
    if (dist < 5) return;
    const v = dist / Math.max(1, now - last.t); // unidades de viewBox por ms
    // rápido = fino, lento = cargado de salsa
    w += (clamp(38 - v * 11, 11, 38) - w) * 0.35;
    pts.push({ ...p, w });
    last = { ...p, t: now };
    path.setAttribute('d', strokePath(pts));
  });
  const end = (e) => {
    if (!pts) return;
    try { svg.releasePointerCapture(e.pointerId); } catch { /* ya liberado */ }
    const total = pts.reduce((acc, p, i) => (i ? acc + Math.hypot(p.x - pts[i - 1].x, p.y - pts[i - 1].y) : 0), 0);
    const d = total > 90 ? strokePath(pts) : '';
    pts = null;
    if (!d) path.setAttribute('d', '');
    onEnd?.(d);
  };
  svg.addEventListener('pointerup', end);
  svg.addEventListener('pointercancel', end);
}
