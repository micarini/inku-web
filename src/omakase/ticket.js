// El ticket en vivo: una hoja washi que se va escribiendo. Al sellar se completa
// (fecha japonesa, n.º de pedido, pie y sello) y se puede descargar como PNG.
import { toPng } from 'html-to-image';
import { gsap, RM } from '../lib/motion.js';
import { TEXTOS as T, STEPS, PIE, find } from './data.js';

const SECS = [
  ['nigiri', 'Nigiri', '握り'],
  ['maki', 'Maki', '巻物'],
  ['sides', 'Acompañamientos', '薬味'],
  ['nikiri', 'Nikiri', '煮切り'],
  ['drink', 'Bebida', '飲み物'],
];

export const ticketHTML = `
<article class="ticket" id="om-ticket" aria-label="${T.ticketTab}">
  <header class="ticket__head">
    <img src="/assets/logo/inku-wordmark-tinta.svg" alt="INKU" width="340" height="159">
    <p><span lang="ja">お品書き</span> · Bill of fare</p>
  </header>
  <div class="ticket__meta">
    <p class="ticket__titulo">${T.ticketTitulo}</p>
    <p class="ticket__sub" hidden>${T.ticketChef}</p>
    <p class="ticket__fecha" hidden><span lang="ja" class="ticket__dia"></span><span class="ticket__no"></span></p>
  </div>
  <div class="ticket__body">
    <p class="ticket__vacio">${T.ticketVacio}</p>
    ${SECS.map(([k, n, j]) => `<section class="ticket__sec" data-sec="${k}" hidden><h3>${n} <span lang="ja">${j}</span></h3><ol></ol></section>`).join('')}
  </div>
  <p class="ticket__ika" hidden>${T.ticketIka} <span lang="ja">インク</span></p>
  <footer class="ticket__foot" hidden>
    <p><span lang="ja">${PIE[0].split(' · ')[0]}</span> · ${PIE[0].split(' · ').slice(1).join(' · ')}</p>
    <p>${PIE[1]}</p>
  </footer>
  <img class="ticket__sello" src="/assets/sello/sello-inku.svg" alt="Sello INKU" width="250" height="520" hidden>
</article>`;

/** Lista de renglones que debería tener el ticket para un estado dado. */
function lines(s) {
  const out = { nigiri: [], maki: [], sides: [], nikiri: [], drink: [] };
  s.nigiri.forEach((id, slot) => {
    if (!id) return;
    const p = find('nigiri', id);
    out.nigiri.push({ key: `n${slot}`, ja: p.ja, nombre: p.nombre });
  });
  if (s.maki) { const p = find('maki', s.maki); out.maki.push({ key: `m-${p.id}`, ja: p.ja, nombre: p.nombre }); }
  ['gari', 'wasabi'].forEach((id) => { if (s[id]) { const p = find('sides', id); out.sides.push({ key: `s-${id}`, ja: p.ja, nombre: p.nombre }); } });
  if (s.nikiri) out.nikiri.push({ key: 'nikiri', ja: T.nikiriJa, nombre: T.nikiriTitulo, nota: T.nikiriLinea });
  if (s.drink) { const p = find('drink', s.drink); out.drink.push({ key: `d-${p.id}`, ja: p.ja, nombre: p.nombre }); }
  return out;
}

const liHTML = (l) =>
  `<span class="ticket__n"></span><span class="ticket__ja" lang="ja">${l.ja}</span><span class="ticket__nombre">${l.nombre}${l.nota ? ` <em>— ${l.nota}</em>` : ''}</span><span class="ticket__puntos" aria-hidden="true"></span>`;

export function createTicket(root) {
  const el = root.querySelector('.ticket');
  const q = (s) => el.querySelector(s);
  let orderNo = '0000';

  function sync(s, { instant = false } = {}) {
    const want = lines(s);
    let total = 0;
    SECS.forEach(([k]) => {
      const sec = q(`[data-sec="${k}"]`);
      const ol = sec.querySelector('ol');
      const have = new Map([...ol.children].filter((li) => !li.classList.contains('is-out')).map((li) => [li.dataset.key, li]));
      // quitar: la línea se tacha y desaparece
      have.forEach((li, key) => {
        if (want[k].some((l) => l.key === key)) return;
        li.classList.add('is-out');
        if (RM || instant) li.remove();
        else gsap.to(li, { height: 0, opacity: 0, duration: 0.3, delay: 0.3, ease: 'power2.inOut', onComplete: () => li.remove() });
      });
      // agregar: se "escribe" de izquierda a derecha (0,4 s)
      want[k].forEach((l, i) => {
        if (have.has(l.key)) return;
        const li = document.createElement('li');
        li.dataset.key = l.key;
        li.innerHTML = liHTML(l);
        const ref = [...ol.children].filter((c) => !c.classList.contains('is-out'))[i] || null;
        ol.insertBefore(li, ref);
        if (RM || instant) return;
        gsap.fromTo(li, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.4, ease: 'power2.out', clearProps: 'clipPath' });
      });
      // renumerar
      [...ol.children].filter((c) => !c.classList.contains('is-out')).forEach((li, i) => {
        li.querySelector('.ticket__n').textContent = String(i + 1).padStart(2, '0');
      });
      sec.hidden = want[k].length === 0 && ![...ol.children].length;
      if (want[k].length) sec.hidden = false;
      total += want[k].length;
    });
    q('.ticket__vacio').hidden = total > 0;
    q('.ticket__sub').hidden = s.mode !== 'chef';
    return total;
  }

  /** Completa el ticket al sellar. */
  function finalize(s) {
    const d = new Date();
    orderNo = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
    q('.ticket__dia').textContent = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    q('.ticket__no').textContent = `No. ${orderNo}`;
    q('.ticket__fecha').hidden = false;
    q('.ticket__foot').hidden = false;
    q('.ticket__ika').hidden = !s.nigiri.includes('ika');
    const sello = q('.ticket__sello');
    sello.hidden = false;
    el.classList.add('is-final');
    if (!RM) gsap.fromTo(sello, { scale: 1.4, opacity: 0, rotate: -4 }, { scale: 1, opacity: 1, rotate: -4, duration: 0.18, ease: 'power3.in', delay: 0.9 });
    return orderNo;
  }

  function reset() {
    el.classList.remove('is-final');
    ['.ticket__fecha', '.ticket__foot', '.ticket__ika', '.ticket__sello'].forEach((s) => (q(s).hidden = true));
    el.querySelectorAll('ol').forEach((ol) => (ol.innerHTML = ''));
    el.querySelectorAll('.ticket__sec').forEach((s) => (s.hidden = true));
    q('.ticket__vacio').hidden = false;
    q('.ticket__sub').hidden = true;
  }

  /**
   * PNG en 2× con html-to-image. Las fuentes de Google vienen en cientos de subsets;
   * se pide un subset solo con los caracteres del ticket (parámetro text=) y se embebe.
   */
  async function download() {
    const name = `inku-omakase-${orderNo}.png`;
    let fontEmbedCSS;
    try {
      const chars = [...new Set(el.innerText.replace(/\s/g, ''))].join('');
      const url = `https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&text=${encodeURIComponent(chars)}`;
      let css = await (await fetch(url)).text();
      const urls = [...new Set([...css.matchAll(/url\((https:[^)]+)\)/g)].map((m) => m[1]))];
      await Promise.all(urls.map(async (u) => {
        const blob = await (await fetch(u)).blob();
        const data = await new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(blob); });
        css = css.split(u).join(data);
      }));
      fontEmbedCSS = css;
    } catch {
      fontEmbedCSS = undefined; // sin red: se usan las fuentes del sistema
    }
    const opts = { pixelRatio: 2, backgroundColor: '#F4EFE3', cacheBust: false, style: { transform: 'none', margin: '0' } };
    if (fontEmbedCSS) opts.fontEmbedCSS = fontEmbedCSS; else opts.skipFonts = true;
    await toPng(el, opts); // primera pasada: calienta imágenes y fuentes (Safari)
    const dataUrl = await toPng(el, opts);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = name;
    document.body.append(a);
    a.click();
    a.remove();
    return name;
  }

  void STEPS;
  return { el, sync, finalize, reset, download };
}
