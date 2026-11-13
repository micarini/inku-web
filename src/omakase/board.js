// TU OMAKASE — tablero: pasos, tarjetas, vuelo de piezas, arrastre, teclado,
// nikiri, modo chef y cierre con la caja y el sello.
import { gsap, Draggable, Flip, ScrollTrigger, RM, isMobile } from '../lib/motion.js';
import * as S from './state.js';
import { TEXTOS as T, STEPS, LIST, CHEF, src, find } from './data.js';
import { createTicket } from './ticket.js';
import { strokePath, chefPoints, attachDraw } from './nikiri.js';

export function initBoard(sec) {
  const $ = (s) => sec.querySelector(s);
  const $$ = (s) => [...sec.querySelectorAll(s)];

  let state = S.initial();
  let busy = false; // modo chef o sellado en curso
  const ticket = createTicket(sec);

  const el = {
    pasoN: $('.om__paso-n'), pasoT: $('.om__paso-t'), pasoK: $('.om__paso-k'), pasoD: $('.om__paso-d'),
    steps: $$('.om__steps button'), cards: $('.om__cards'), extra: $('.om__extra'), ficha: $('.om__ficha'),
    stage: $('.om__stage'), scene: $('.om__scene'), geta: $('.om__geta'), slots: $$('.slot'),
    drink: $('.om__drink'), nikSvg: $('.om__nikiri'), nikPath: $('.om__nikiri .om__nikiri-trazo'), nikClip: $('.om__nikiri clipPath rect'),
    lid: $('.om__lid'), stamp: $('.om__stamp'), chefLine: $('.om__chefline'),
    next: $('.om__next'), back: $('.om__back'), chef: $('.om__chef'), tab: $('.om__tab'), tabN: $('.om__tab-n'),
    fin: $('.om__fin'), descargar: $('.om__descargar'), otra: $('.om__otra'), live: $('.om__live'), ghost: $('.om__ghost'),
  };
  const stepInfo = () => STEPS[state.step - 1];

  const say = (msg) => {
    el.live.textContent = '';
    requestAnimationFrame(() => (el.live.textContent = msg));
  };

  // ───────────────────────── Render de pasos y tarjetas ─────────────────────────
  function renderStep({ focus = false } = {}) {
    const info = stepInfo();
    sec.dataset.step = state.step;
    el.pasoN.textContent = `Paso ${state.step} / 4`;
    el.pasoT.textContent = info.titulo;
    el.pasoK.textContent = info.ja;
    el.pasoD.textContent = info.ayuda;
    renderCards();
    el.extra.hidden = info.id !== 'sides';
    updateUI();
    if (!RM) gsap.fromTo([el.pasoT, el.pasoK, el.pasoD], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 });
    if (focus) el.cards.querySelector('.card')?.focus({ preventScroll: true });
  }

  let drags = [];
  function renderCards() {
    const kind = stepInfo().id;
    drags.forEach((d) => d.kill());
    drags = [];
    el.cards.innerHTML = LIST[kind]
      .map((p) => `
      <button type="button" class="card" data-kind="${kind}" data-id="${p.id}" data-cursor="${isMobile() ? '' : 'Arrastrar'}"
        aria-label="${kind === 'sides' ? '' : 'Agregar '}${p.nombre}, ${p.desc}">
        <span class="card__img"><img src="${src(kind, p.id)}" alt="" draggable="false" onerror="this.closest('.card').classList.add('sin-foto')"><span class="card__falta" aria-hidden="true">${p.nombre}</span></span>
        <span class="card__txt"><span class="card__n">${p.corto || p.nombre}</span><span class="card__ja" lang="ja">${p.ja}</span></span>
        <span class="card__plus" aria-hidden="true"></span>
      </button>`)
      .join('');
    [...el.cards.children].forEach((card) => {
      const { id } = card.dataset;
      card.addEventListener('click', () => onCard(kind, id, card));
      const show = () => showFicha(kind, id);
      card.addEventListener('pointerenter', show);
      card.addEventListener('focus', show);
      // Arrastrar hasta un lugar concreto (mouse y touch). En la tira del celular se toca.
      if (!isMobile() && !RM) {
        drags.push(Draggable.create(card, {
          type: 'x,y',
          minimumMovement: 8,
          zIndexBoost: false,
          onDragStart() { card.classList.add('is-drag'); },
          onDragEnd() {
            card.classList.remove('is-drag');
            const hit = dropTarget(kind, this.pointerX, this.pointerY);
            const from = card.querySelector('.card__img').getBoundingClientRect();
            if (hit.ok && tryAdd(kind, id, { slot: hit.slot, from, dur: 0.35 })) gsap.set(card, { x: 0, y: 0 });
            else gsap.to(card, { x: 0, y: 0, duration: 0.45, ease: 'power3.out' });
          },
        })[0]);
      }
    });
    showFicha(null);
  }

  function showFicha(kind, id) {
    if (!kind) {
      el.ficha.classList.remove('is-on');
      return;
    }
    const p = find(kind, id);
    el.ficha.innerHTML = `<span class="om__ficha-ja" lang="ja">${p.ja}</span><span class="om__ficha-txt"><strong>${p.nombre}</strong><span>${p.desc}</span>${p.nota ? `<em>${p.nota}</em>` : ''}</span>`;
    el.ficha.classList.add('is-on');
  }

  function updateUI() {
    const kind = stepInfo().id;
    // tarjetas: anillo en las elegidas, contador de repetidas
    [...el.cards.children].forEach((card) => {
      const { id } = card.dataset;
      let on = false, full = false, n = 0;
      if (kind === 'nigiri') { n = S.countOf(state, id); on = n > 0; full = n >= 2 || state.nigiri.every(Boolean); }
      else if (kind === 'maki') on = state.maki === id;
      else if (kind === 'sides') on = state[id];
      else on = state.drink === id;
      card.classList.toggle('is-on', on);
      card.classList.toggle('is-full', full && kind === 'nigiri');
      card.setAttribute('aria-pressed', String(on));
      card.dataset.n = n > 1 ? `×${n}` : '';
    });
    // indicador de pasos
    el.steps.forEach((b, i) => {
      const n = i + 1;
      b.disabled = !S.reachable(state, n) || busy;
      b.classList.toggle('is-done', S.stepDone(state, n));
      if (n === state.step) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    // botón del paso
    const last = state.step === 4;
    el.next.textContent = last ? T.sellar : T.siguiente;
    el.next.classList.toggle('is-sellar', last);
    el.next.dataset.cursor = last ? 'Sellar' : '';
    el.next.disabled = busy || (last ? !S.complete(state) : !S.stepDone(state, state.step));
    el.back.hidden = state.step === 1;
    el.back.disabled = busy;
    el.chef.disabled = busy;
    el.tabN.textContent = S.count(state);
    // nikiri
    const canDraw = state.step === 3 && !state.nikiri && !busy;
    el.nikSvg.classList.toggle('is-drawable', canDraw);
    $('.om__nik-chef').hidden = !!state.nikiri;
    $('.om__nik-repetir').hidden = !state.nikiri;
    $('.om__nik-estado').textContent = state.nikiri ? `${T.nikiriTitulo} · ${T.nikiriJa} — ${T.nikiriLinea}. Hecho.` : T.nikiriAyuda;
  }

  // ───────────────────────── Piezas en la tabla ─────────────────────────
  const zoneOf = (kind, id, slot) =>
    kind === 'nigiri' ? el.slots[slot] : kind === 'maki' ? $('.om__zone--maki') : kind === 'drink' ? el.drink : $(`.om__zone--${id}`);

  function makePiece(kind, id, slot) {
    const p = find(kind, id);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `piece piece--${kind}`;
    b.dataset.kind = kind;
    b.dataset.id = id;
    b.dataset.cursor = 'Quitar';
    if (kind === 'nigiri') b.dataset.slot = slot;
    b.style.setProperty('--k', Math.sqrt(p.ar / 2).toFixed(3));
    b.style.setProperty('--ar', p.ar);
    b.setAttribute('aria-label', `Quitar ${p.nombre}${kind === 'nigiri' ? ` del lugar ${slot + 1}` : ''}`);
    const img = `<img src="${src(kind, id)}" alt="" draggable="false">`;
    // el maki llega cortado en tres: la misma foto recortada en tres franjas
    b.innerHTML = `<span class="piece__in">${kind === 'maki' ? `<span class="cut cut--1">${img}</span><span class="cut cut--2">${img}</span><span class="cut cut--3">${img}</span>` : img}<span class="piece__falta" aria-hidden="true">${p.corto || p.nombre}</span></span>`;
    b.querySelector('img').addEventListener('error', () => b.classList.add('sin-foto'));
    b.addEventListener('click', () => {
      if (busy || state.sealed) return;
      const hadFocus = document.activeElement === b;
      doRemove(kind, kind === 'nigiri' ? slot : id);
      // la pieza desaparece: con teclado el foco vuelve a su tarjeta (o a la primera del paso)
      if (hadFocus) (el.cards.querySelector(`.card[data-id="${id}"]`) || el.cards.querySelector('.card'))?.focus({ preventScroll: true });
    });
    return b;
  }

  function settle(piece) {
    piece.classList.add('is-set');
    if (RM) return;
    gsap.fromTo(piece.querySelector('.piece__in'), { scale: 1.04 }, { scale: 1, duration: 0.3, ease: 'power2.out' });
  }

  /** La foto vuela desde la tarjeta hasta su lugar con un arco suave. */
  function fly(imgSrc, from, piece, dur = 0.6) {
    if (RM || !from) {
      gsap.fromTo(piece, { opacity: 0 }, { opacity: 1, duration: 0.3, onComplete: () => settle(piece) });
      return;
    }
    const to = piece.getBoundingClientRect();
    const sx = window.scrollX, sy = window.scrollY;
    const f = document.createElement('img');
    f.src = imgSrc;
    f.alt = '';
    f.className = 'om-flyer';
    const w0 = Math.max(40, from.width);
    const w1 = piece.offsetWidth * (parseFloat(getComputedStyle(el.scene).scale) || 1);
    f.style.width = `${w0}px`;
    document.body.append(f);
    const x0 = from.left + from.width / 2 + sx, y0 = from.top + from.height / 2 + sy;
    const x1 = to.left + to.width / 2 + sx, y1 = to.top + to.height / 2 + sy;
    const rot = parseFloat(getComputedStyle(piece).rotate) || 0;
    const arc = Math.min(70, Math.hypot(x1 - x0, y1 - y0) * 0.16);
    const o = { p: 0 };
    gsap.set(piece, { opacity: 0 });
    gsap.set(f, { xPercent: -50, yPercent: -50, x: x0, y: y0 });
    gsap.to(o, {
      p: 1,
      duration: dur,
      ease: 'power3.out',
      onUpdate() {
        const p = o.p;
        gsap.set(f, { x: x0 + (x1 - x0) * p, y: y0 + (y1 - y0) * p - arc * Math.sin(Math.PI * p), scale: 1 + (w1 / w0 - 1) * p, rotation: rot * p });
      },
      onComplete() {
        f.remove();
        gsap.set(piece, { opacity: 1 });
        settle(piece);
      },
    });
  }

  function place(kind, id, slot, { from = null, dur = 0.6 } = {}) {
    const zone = zoneOf(kind, id, slot);
    const piece = makePiece(kind, id, slot);
    zone.append(piece);
    if (kind === 'maki') {
      // caen 3 cortes, uno tras otro
      const cuts = [...piece.querySelectorAll('.cut')];
      if (RM) gsap.fromTo(piece, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      else gsap.fromTo(cuts, { y: -64, opacity: 0 }, { y: 0, opacity: 1, duration: dur * 0.8, ease: 'power3.out', stagger: 0.12, onComplete: () => settle(piece) });
      piece.classList.add('is-set');
      return piece;
    }
    fly(src(kind, id), from, piece, dur);
    return piece;
  }

  function unplace(piece) {
    if (!piece) return;
    piece.disabled = true;
    piece.classList.add('is-out');
    if (RM) return piece.remove();
    // la pieza se levanta y sale
    gsap.to(piece, { y: -22, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: () => piece.remove() });
  }

  const cardFrom = (kind, id) => el.cards.querySelector(`.card[data-kind="${kind}"][data-id="${id}"] .card__img`)?.getBoundingClientRect() || null;

  // ───────────────────────── Acciones ─────────────────────────
  function tryAdd(kind, id, { slot = null, from = undefined, dur = 0.6, quiet = false } = {}) {
    if (state.sealed) return false;
    const p = find(kind, id);
    // maki y bebida: se elige uno solo → el anterior sale
    if ((kind === 'maki' && state.maki && state.maki !== id) || (kind === 'drink' && state.drink && state.drink !== id)) {
      unplace(zoneOf(kind, id, 0).querySelector('.piece:not(.is-out)'));
    } else if ((kind === 'maki' && state.maki === id) || (kind === 'drink' && state.drink === id)) {
      return false;
    }
    const r = S.add(state, kind, id, slot);
    if (!r) {
      if (!quiet) say(kind === 'nigiri' ? (state.nigiri.every(Boolean) ? 'La tabla ya tiene sus 8 nigiri.' : `${p.nombre} ya está dos veces.`) : 'No se puede agregar.');
      return false;
    }
    state = r.state;
    place(kind, id, r.slot, { from: from === undefined ? cardFrom(kind, id) : from, dur });
    ticket.sync(state);
    updateUI();
    if (!quiet) {
      const n = state.nigiri.filter(Boolean).length;
      say(kind === 'nigiri' ? `${p.nombre} colocado en el lugar ${r.slot + 1}, ${n} de 8` : `${p.nombre} agregado`);
    }
    return true;
  }

  function doRemove(kind, slotOrId) {
    const zone = zoneOf(kind, slotOrId, slotOrId);
    const piece = zone?.querySelector('.piece:not(.is-out)');
    if (!piece) return;
    const p = find(kind, piece.dataset.id);
    state = S.remove(state, kind, slotOrId);
    unplace(piece);
    ticket.sync(state);
    updateUI();
    say(`${p.nombre} quitado`);
  }

  function onCard(kind, id) {
    if (busy) return;
    if (kind === 'sides') return state[id] ? doRemove('sides', id) : tryAdd('sides', id);
    tryAdd(kind, id);
  }

  /** ¿Dónde cayó la tarjeta arrastrada? Lugar concreto si está cerca de uno libre. */
  function dropTarget(kind, px, py) {
    const x = px - window.scrollX, y = py - window.scrollY;
    const inside = (r, pad = 0) => x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad;
    if (kind === 'drink') return { ok: inside(el.stage.getBoundingClientRect()), slot: null };
    if (!inside(el.geta.getBoundingClientRect(), 24)) return { ok: false };
    if (kind !== 'nigiri') return { ok: true, slot: null };
    let best = null, bd = Infinity;
    el.slots.forEach((s, i) => {
      if (state.nigiri[i]) return;
      const r = s.getBoundingClientRect();
      const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
      if (d < bd) { bd = d; best = i; }
    });
    return { ok: best !== null, slot: best };
  }

  function goStep(n, opts) {
    if (busy || state.sealed) return;
    if (n < 1 || n > 4) return;
    if (!S.reachable(state, n)) return say(`Completá el paso ${state.step} para seguir.`);
    state = S.setStep(state, n);
    renderStep(opts);
    say(`Paso ${n} de 4: ${stepInfo().titulo}`);
  }

  function undoLast() {
    const kind = stepInfo().id;
    if (kind === 'nigiri') {
      const i = state.nigiri.map(Boolean).lastIndexOf(true);
      if (i >= 0) doRemove('nigiri', i);
    } else if (kind === 'maki' && state.maki) doRemove('maki', state.maki);
    else if (kind === 'sides') {
      if (state.nikiri) clearNikiri();
      else if (state.wasabi) doRemove('sides', 'wasabi');
      else if (state.gari) doRemove('sides', 'gari');
    } else if (kind === 'drink' && state.drink) doRemove('drink', state.drink);
  }

  // ───────────────────────── Nikiri: un solo gesto ─────────────────────────
  function fitNikiri() {
    const r = el.geta.getBoundingClientRect();
    const H = Math.round((1000 * r.height) / Math.max(1, r.width));
    el.nikSvg.setAttribute('viewBox', `0 0 1000 ${H}`);
    el.nikClip.setAttribute('width', 1000);
    el.nikClip.setAttribute('height', H);
    return H;
  }
  function setNikiri(d) {
    state = S.add(state, 'nikiri', d).state;
    el.nikPath.setAttribute('d', d);
    ticket.sync(state);
    updateUI();
    say(`${T.nikiriTitulo}: ${T.nikiriLinea}. Trazo hecho.`);
  }
  function clearNikiri() {
    if (!state.nikiri) return;
    state = S.remove(state, 'nikiri');
    const done = () => { el.nikPath.setAttribute('d', ''); gsap.set(el.nikPath, { opacity: 1 }); };
    if (RM) done(); else gsap.to(el.nikPath, { opacity: 0, duration: 0.4, onComplete: done });
    ticket.sync(state);
    updateUI();
    say('Trazo borrado. Podés repetir el gesto.');
  }
  /** "Que lo haga el chef": lo traza solo en 0,9 s. */
  function chefNikiri() {
    if (state.nikiri) return;
    const H = fitNikiri();
    const g = el.geta.getBoundingClientRect();
    const cs = el.slots.map((s) => {
      const r = s.getBoundingClientRect();
      return [((r.left + r.width / 2 - g.left) / g.width) * 1000, ((r.top + r.height / 2 - g.top) / g.height) * H];
    });
    const xs = cs.map((c) => c[0]), ys = cs.map((c) => c[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    const horizontal = maxX - minX > (maxY - minY) * 1.2;
    const pts = horizontal
      ? chefPoints(minX - 40, (minY + maxY) / 2 + 14, maxX + 40, (minY + maxY) / 2 - 10, 21)
      : chefPoints((minX + maxX) / 2 - 20, minY - 30, (minX + maxX) / 2 + 20, maxY + 30, 34);
    const d = strokePath(pts);
    setNikiri(d);
    if (RM) return;
    const attr = horizontal ? 'width' : 'height';
    gsap.fromTo(el.nikClip, { attr: { [attr]: 0 } }, { attr: { [attr]: horizontal ? 1000 : H }, duration: 0.9, ease: 'power2.inOut' });
  }
  attachDraw(el.nikSvg, el.nikPath, {
    enabled: () => state.step === 3 && !state.nikiri && !busy,
    onStart: () => { fitNikiri(); el.nikSvg.classList.add('is-drawing'); },
    onEnd: (d) => {
      el.nikSvg.classList.remove('is-drawing');
      if (d) setNikiri(d);
      else say('El trazo fue muy corto. Probá de nuevo.');
    },
  });

  // ───────────────────────── Atajo: "Dejalo en manos del chef" ─────────────────────────
  const wait = (s) => new Promise((r) => gsap.delayedCall(RM ? 0.02 : s, r));

  function clearBoard() {
    $$('.piece').forEach(unplace);
    el.nikPath.setAttribute('d', '');
  }

  async function runChef() {
    if (busy || state.sealed) return;
    busy = true;
    sec.classList.add('is-auto');
    clearBoard();
    state = { ...S.initial(), mode: 'chef' };
    ticket.reset();
    ticket.sync(state);
    renderStep();
    say('El chef arma tu omakase.');
    gsap.to(el.chefLine, { opacity: 1, y: 0, duration: RM ? 0.3 : 0.9 });
    await wait(0.5);
    // 8 nigiri de lo más ligero a lo más intenso: cada pieza cae en 0,45 s, 0,3 s entre una y otra
    for (const id of CHEF.nigiri) {
      tryAdd('nigiri', id, { dur: 0.45, quiet: true });
      await wait(0.3);
    }
    await wait(0.45);
    state = { ...state, step: 2 }; renderStep();
    await wait(0.3);
    tryAdd('maki', CHEF.maki, { dur: 0.45, quiet: true });
    await wait(0.75);
    state = { ...state, step: 3 }; renderStep();
    await wait(0.3);
    tryAdd('sides', 'gari', { dur: 0.45, quiet: true });
    await wait(0.3);
    tryAdd('sides', 'wasabi', { dur: 0.45, quiet: true });
    await wait(0.45);
    chefNikiri();
    await wait(1.1);
    state = { ...state, step: 4 }; renderStep();
    await wait(0.3);
    tryAdd('drink', CHEF.drink, { dur: 0.45, quiet: true });
    await wait(0.8);
    gsap.to(el.chefLine, { opacity: 0, y: 8, duration: 0.6 });
    busy = false;
    sec.classList.remove('is-auto');
    updateUI();
    say('Selección del chef lista. Podés sellar.');
    el.next.focus({ preventScroll: true });
  }

  // ───────────────────────── Final: la caja y el sello ─────────────────────────
  const shake = (target) => ({ keyframes: [{ x: 2, y: 1, duration: 0.04 }, { x: -2, y: -1, duration: 0.04 }, { x: 1, y: 0, duration: 0.04 }, { x: 0, y: 0, duration: 0.04 }], ease: 'none', targets: target });

  function doSeal() {
    if (busy || !S.complete(state)) return;
    busy = true;
    state = S.seal(state);
    sec.classList.add('is-sealing');
    updateUI();
    say('Sellando tu omakase.');
    const toFinal = () => {
      const st = Flip.getState([el.stage, ticket.el]);
      ticket.finalize(state);
      sec.classList.add('is-final');
      sec.classList.remove('is-ticket-open');
      el.fin.hidden = false;
      Flip.from(st, { duration: RM ? 0.01 : 1, ease: 'ink', nested: true });
      if (!RM) gsap.fromTo(el.fin, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.7 });
      busy = false;
      say('Sellado. Tu ticket está listo para descargar.');
      el.descargar.focus({ preventScroll: true });
    };
    gsap.set(el.lid, { visibility: 'visible' });
    if (RM) {
      gsap.set(el.lid, { yPercent: 0, opacity: 1 });
      gsap.set(el.stamp, { opacity: 1, scale: 1 });
      return toFinal();
    }
    const k1 = shake(el.stage), k2 = shake(el.stage);
    gsap.timeline()
      // la cámara se aleja apenas
      .to(el.scene, { scale: 0.92, duration: 0.7, ease: 'ink' })
      // la tapa baja desde arriba y cubre la geta (0,9 s)
      .fromTo(el.lid, { yPercent: -135, opacity: 1 }, { yPercent: 0, duration: 0.9, ease: 'ink' }, 0.15)
      .to(k1.targets, { keyframes: k1.keyframes, ease: 'none' })
      // el sello cae sobre la tapa: 1.4 → 1 en 0,18 s
      .fromTo(el.stamp, { scale: 1.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.18, ease: 'power3.in' }, '+=0.35')
      .to(k2.targets, { keyframes: k2.keyframes, ease: 'none' })
      .add(toFinal, '+=0.9');
  }

  function doReset() {
    if (busy) return;
    busy = true;
    const st = Flip.getState([el.stage, ticket.el]);
    sec.classList.remove('is-final', 'is-sealing');
    el.fin.hidden = true;
    clearBoard();
    state = S.initial();
    ticket.reset();
    ticket.sync(state, { instant: true });
    renderStep();
    Flip.from(st, { duration: RM ? 0.01 : 0.9, ease: 'ink', nested: true });
    // la tapa se levanta y la geta vuelve vacía
    const done = () => { gsap.set(el.lid, { visibility: 'hidden' }); gsap.set(el.stamp, { opacity: 0 }); busy = false; updateUI(); };
    if (RM) { gsap.set(el.scene, { scale: 1 }); done(); }
    else gsap.timeline({ onComplete: done }).to(el.lid, { yPercent: -135, duration: 0.8, ease: 'ink' }).to(el.scene, { scale: 1, duration: 0.6, ease: 'ink' }, 0.2);
    say('Tabla vacía. Armá otra.');
    el.cards.querySelector('.card')?.focus({ preventScroll: true });
  }

  // ───────────────────────── Eventos ─────────────────────────
  el.steps.forEach((b, i) => b.addEventListener('click', () => goStep(i + 1)));
  el.next.addEventListener('click', () => (state.step === 4 ? doSeal() : goStep(state.step + 1, { focus: true })));
  el.back.addEventListener('click', () => goStep(state.step - 1));
  el.chef.addEventListener('click', runChef);
  // el botón que se toca se oculta: el foco pasa al otro para no perderse (teclado)
  $('.om__nik-chef').addEventListener('click', () => { if (busy) return; chefNikiri(); $('.om__nik-repetir').focus({ preventScroll: true }); });
  $('.om__nik-repetir').addEventListener('click', () => { if (busy) return; clearNikiri(); $('.om__nik-chef').focus({ preventScroll: true }); });
  el.otra.addEventListener('click', doReset);
  el.descargar.addEventListener('click', async () => {
    el.descargar.disabled = true;
    const label = el.descargar.textContent;
    el.descargar.textContent = 'Generando…';
    try {
      const name = await ticket.download();
      say(`Ticket descargado: ${name}`);
    } catch (err) {
      console.warn('[omakase] no se pudo generar el PNG', err);
      say('No se pudo generar el ticket.');
    }
    el.descargar.textContent = label;
    el.descargar.disabled = false;
  });
  el.tab.addEventListener('click', () => {
    const open = sec.classList.toggle('is-ticket-open');
    el.tab.setAttribute('aria-expanded', String(open));
  });
  $('.om__sheet-cerrar').addEventListener('click', () => { sec.classList.remove('is-ticket-open'); el.tab.setAttribute('aria-expanded', 'false'); el.tab.focus(); });

  // Teclado: Backspace quita la última, ← → cambian de paso (Tab y Enter son nativos)
  sec.addEventListener('keydown', (e) => {
    if (e.target.closest('[contenteditable], input, textarea')) return;
    if (e.key === 'Escape' && sec.classList.contains('is-ticket-open')) return $('.om__sheet-cerrar').click();
    if (busy || state.sealed) return;
    if (e.key === 'Backspace') { e.preventDefault(); undoLast(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); goStep(state.step + 1, { focus: true }); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); goStep(state.step - 1, { focus: true }); }
  });

  // ───────────────────────── Ambiente ─────────────────────────
  // El nigiri de la anatomía "cae" y aparece apoyado en la geta; después se retira.
  ScrollTrigger.create({
    trigger: el.geta,
    start: 'top 62%',
    once: true,
    onEnter: () => {
      if (RM || state.nigiri.some(Boolean)) return;
      gsap.timeline()
        .fromTo(el.ghost, { y: -140, opacity: 0, scale: 1.25 }, { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' })
        .to(el.ghost, { opacity: 0, duration: 0.8, ease: 'power2.inOut' }, '+=1.3');
    },
  });

  // Motas de polvo muy sutiles (solo desktop con mouse, sin reduced-motion)
  const canvas = $('.om__dust');
  if (!RM && window.matchMedia('(min-width: 1280px)').matches) {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0, on = false;
    const size = () => { W = canvas.width = sec.clientWidth; H = canvas.height = sec.clientHeight; };
    const ps = Array.from({ length: 30 }, () => ({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.4, vx: (Math.random() - 0.5) * 0.00012, vy: -0.00004 - Math.random() * 0.00012, a: 0.4 + Math.random() * 0.6 }));
    const tick = () => {
      if (!on) return;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#F4EFE3';
      ps.forEach((p) => {
        p.x = (p.x + p.vx + 1) % 1;
        p.y = (p.y + p.vy + 1) % 1;
        ctx.globalAlpha = 0.15 * p.a;
        ctx.beginPath();
        ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    size();
    window.addEventListener('resize', size);
    gsap.ticker.add(tick);
    ScrollTrigger.create({ trigger: sec, start: 'top bottom', end: 'bottom top', onToggle: (self) => (on = self.isActive) });
  }

  window.addEventListener('resize', fitNikiri);
  fitNikiri();
  ticket.sync(state, { instant: true });
  renderStep();

  // para pruebas y para la consola: estado de solo lectura
  sec.__omakase = { get state() { return state; }, runChef, doSeal, doReset };
}
