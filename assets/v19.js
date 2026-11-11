// Portfolio v19: intro with sound (the screen switches on: light point, line, opens), words rising out of masks,
// reading light, odometer numbers, scroll hairline, live clock, the name set big, soft press sounds.
// Sounds are real recordings (media/sfx, CC0). The intro starts by itself; the swoosh plays as the screen opens
// (browsers that block sound before the first click stay silent unless the visitor taps during the intro).
(() => {
  const root = document.documentElement, DE = root.lang === 'de';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const base = DE ? '../' : '';
  const store = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };

  /* ---------- Sound: tiny Web Audio player, off until the visitor says yes ---------- */
  const S = { ctx: null, buf: {}, on: store.get('v19-sound') !== 'off' };
  const files = { swoosh: 'swoosh', press: 'press' };
  const raw = {};
  Object.entries(files).forEach(([k, f]) => { raw[k] = fetch(base + 'media/sfx/' + f + '.mp3?v=2').then(r => r.arrayBuffer()).catch(() => null); });
  const unlock = () => {
    if (S.ctx) return S.ctx.resume?.();
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    S.ctx = new AC();
    S.ready = Promise.all(Object.entries(raw).map(([k, p]) => p.then(ab => ab && new Promise(ok => S.ctx.decodeAudioData(ab.slice(0), b => { S.buf[k] = b; ok(); }, ok)))));
  };
  const play = (k, vol = 1, delay = 0) => {
    if (!S.on || !S.ctx || !S.buf[k]) return;
    const src = S.ctx.createBufferSource(), g = S.ctx.createGain();
    src.buffer = S.buf[k]; g.gain.value = vol; src.connect(g).connect(S.ctx.destination);
    src.start(S.ctx.currentTime + delay);
  };
  const setSound = on => {
    S.on = on; store.set('v19-sound', on ? 'on' : 'off');
    $$('.snd').forEach(b => { b.setAttribute('aria-pressed', on); b.setAttribute('aria-label', on ? (DE ? 'Ton aus' : 'Sound off') : (DE ? 'Ton an' : 'Sound on')); });
    if (on) unlock();
  };

  /* ---------- Split headings into words that rise out of a mask ---------- */
  const split = el => {
    if (el.classList.contains('sp')) return;
    let i = 0;
    [...el.childNodes].forEach(n => {
      if (n.nodeType !== 3) return;
      const frag = document.createDocumentFragment();
      n.textContent.split(/( +)/).forEach(part => {
        if (!part) return;
        if (/^ +$/.test(part)) { frag.append(part); return; }
        const w = document.createElement('span'); w.className = 'wd';
        const inner = document.createElement('i'); inner.textContent = part; inner.style.setProperty('--i', i++);
        w.append(inner); frag.append(w);
      });
      n.replaceWith(frag);
    });
    el.classList.add('sp');
  };
  if (!reduced) $$('.hero h1, .h-sec, .h-big').forEach(split);

  /* ---------- Intro: the screen switches on (about 1.8 s), a soft swoosh as it opens ---------- */
  const iv = $('.iv'), showHero = () => $$('.hero .fu').forEach(n => n.classList.add('in'));
  if (iv && root.classList.contains('intro')) {
    const t0 = performance.now(); let done = false, lineT, liftT;
    const plan = open => { clearTimeout(lineT); clearTimeout(liftT); lineT = setTimeout(() => iv.classList.add('line'), Math.max(0, open - 520 - (performance.now() - t0))); liftT = setTimeout(() => lift(false), Math.max(0, open - (performance.now() - t0))); };
    // sound: wake the audio right away; browsers that block it before a click allow it after the first tap
    const wake = () => { if (!S.on) return; unlock(); S.ctx && Promise.resolve(S.ctx.resume?.()).catch(() => {}); };
    wake();
    requestAnimationFrame(() => setTimeout(() => iv.classList.add('wake'), 120));
    const lift = quick => {
      if (done) return; done = true;
      clearTimeout(lineT); clearTimeout(liftT);
      if (S.ctx && S.ctx.state === 'running') play('swoosh', .8);
      iv.classList.add('line', 'go'); root.classList.remove('intro'); root.classList.add('opening');
      try { sessionStorage.setItem('v19-intro', '1'); } catch {}
      setTimeout(showHero, quick ? 80 : 260);
      setTimeout(() => { iv.remove(); root.classList.remove('opening'); }, 1300);
      off();
    };
    plan(1750);
    const onKey = e => { if (e.key === 'Escape') lift(true); else wake(); };
    const onWheel = e => { e.preventDefault(); lift(true); };
    const onTap = () => wake();
    const off = () => { removeEventListener('wheel', onWheel); removeEventListener('keydown', onKey); removeEventListener('pointerdown', onTap, true); };
    addEventListener('wheel', onWheel, { passive: false });
    addEventListener('keydown', onKey);
    addEventListener('pointerdown', onTap, true);
    let ty = null; iv.addEventListener('touchstart', e => { ty = e.touches[0].clientY; }, { passive: true });
    iv.addEventListener('touchmove', e => { if (ty !== null && Math.abs(e.touches[0].clientY - ty) > 30) lift(true); }, { passive: true });
  } else if (iv) iv.remove();

  /* ---------- Sound toggle + soft press sound ---------- */
  $$('.snd').forEach(b => b.addEventListener('click', () => setSound(!S.on)));
  setSound(S.on);
  document.addEventListener('pointerdown', e => {
    if (!S.on) return;
    const t = e.target.closest('.pill, .wiz-next, .wiz-back, .opt, .fq summary, .cl-list button, .seg button, .dots button, .snd, .days button, .times button');
    if (t && !t.closest('.iv')) { unlock(); play('press', .5); }
  }, true);

  /* ---------- Live clock in the hero (Esslingen) ---------- */
  const clk = $('.clk');
  if (clk) {
    const f = new Intl.DateTimeFormat(DE ? 'de-DE' : 'en-GB', { timeZone: 'Europe/Berlin', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
    const upd = () => { clk.textContent = 'Esslingen, ' + f.format(new Date()) + (DE ? ' Uhr' : ''); };
    upd(); setInterval(upd, 15000);
  }

  /* ---------- Scroll hairline + reading light (one rAF loop) ---------- */
  const nav = $('.lnav');
  const lit = $('[data-lit]');
  let lw = [];
  if (lit && !reduced) {
    const wrap = node => [...node.childNodes].forEach(n => {
      if (n.nodeType === 1) return wrap(n);
      if (n.nodeType !== 3) return;
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(p => { if (!p) return; if (/^\s+$/.test(p)) frag.append(p); else { const s = document.createElement('span'); s.className = 'lw'; s.textContent = p; frag.append(s); } });
      n.replaceWith(frag);
    });
    wrap(lit); lit.classList.add('lit'); lw = $$('.lw', lit);
  }
  /* ---------- Scroll scenes, scrubbed by scroll position ---------- */
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => 1 - Math.pow(1 - t, 3), inout = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const film = $('.film'), fwin = film && $('.film-win', film), fvid = film && $('video', film);
  const hl = $('.hl-track'), hlh = $('#highlights .hl-head'), bigH = $('.big .h-big'), night = $('.night');
  let filmOn = false;
  const scenes = () => {
    const vh = innerHeight, vw = innerWidth;
    if (film && !reduced) {
      const r = film.getBoundingClientRect(), p = clamp(-r.top / (r.height - vh));
      const g = parseFloat(getComputedStyle(root).getPropertyValue('--g')) || 24;
      const tw = Math.min(1180, vw - 2 * g), th = Math.min(tw * 9 / 16, vh * .62);
      const o = inout(seg(p, 0, .42));
      const top0 = Math.min(vh * .08, 72), ix = (vw - tw) / 2, ib = vh - top0 - th;
      const S = fwin.style;
      S.setProperty('--it', (top0 * (1 - o)).toFixed(1) + 'px');
      S.setProperty('--ib', (ib * (1 - o)).toFixed(1) + 'px');
      S.setProperty('--ix', (ix * (1 - o)).toFixed(1) + 'px');
      S.setProperty('--ir', (28 * (1 - o)).toFixed(1) + 'px');
      S.setProperty('--vs', (1.12 - .12 * o).toFixed(4));
      const t = ease(seg(p, .46, .72));
      S.setProperty('--sh', (.5 * t).toFixed(3));
      film.style.setProperty('--to', t.toFixed(3));
      film.style.setProperty('--ty', (48 * (1 - t)).toFixed(1) + 'px');
      const vis = r.top < vh && r.bottom > 0;
      if (vis !== filmOn && fvid) { filmOn = vis; vis ? fvid.play().catch(() => {}) : fvid.pause(); }
    }
    if (reduced) return;
    if (hl) { const r = hl.getBoundingClientRect(), p = ease(seg(vh - r.top, 0, vh * .7)); hl.style.setProperty('--hs', (.88 + .12 * p).toFixed(4)); hlh && hlh.style.setProperty('--hy', (30 * (1 - p)).toFixed(1) + 'px'); }
    if (bigH) { const r = (bigH.closest('section') || bigH.parentElement).getBoundingClientRect(), p = ease(seg(vh - r.top, vh * .1, vh * .9)); bigH.style.setProperty('--bs', (1 + 1.25 * (1 - p)).toFixed(4)); }
    if (night) { const r = night.getBoundingClientRect(), p = ease(seg(vh - r.top, 0, vh * .8)); night.style.setProperty('--c', (1 - p).toFixed(4)); }
  };

  let ticking = false;
  const frame = () => {
    ticking = false;
    scenes();
    const max = document.documentElement.scrollHeight - innerHeight;
    nav?.style.setProperty('--sp', max > 0 ? (scrollY / max).toFixed(4) : 0);
    if (lw.length) {
      const r = lit.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * .82 - r.top) / (r.height + innerHeight * .35)));
      const n = Math.round(p * lw.length);
      lw.forEach((s, i) => s.classList.toggle('on', i < n));
    }
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }, { passive: true });
  addEventListener('resize', frame); frame();

  /* ---------- Odometer numbers ---------- */
  $$('[data-odo]').forEach(b => {
    const v = b.dataset.odo;
    if (reduced) { b.textContent = v; return; }
    b.textContent = '';
    b.classList.add('odo');
    [...v].forEach((d, i) => {
      const col = document.createElement('span'); col.className = 'oc';
      const r = document.createElement('span'); r.className = 'or'; r.style.setProperty('--i', i);
      for (let k = 0; k < 20; k++) { const s = document.createElement('span'); s.textContent = k % 10; r.append(s); }
      col.append(r); b.append(col); r.dataset.to = 10 + +d;
    });
    b.setAttribute('aria-label', v);
    new IntersectionObserver(([en], o) => { if (en.isIntersecting) { $$('.or', b).forEach(r => { r.style.transform = `translateY(${-r.dataset.to * 1.3}em)`; }); o.disconnect(); } }, { threshold: .6 }).observe(b);
  });

})();
