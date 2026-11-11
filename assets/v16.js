// Portfolio v16: intro, smooth wheel scrolling, header, scroll progress, line reveals, the pinned
// sentence and the margin notes. Without JS (or with reduced motion) the page is complete and still.
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const hero = document.querySelector('.hero');

  // Split headings into lines that rise out of a mask.
  document.querySelectorAll('.lines>span').forEach(s => { s.innerHTML = `<span class="l-in">${s.innerHTML}</span>`; });
  // Split the pinned sentence into words.
  const say = document.querySelector('[data-words]');
  say.innerHTML = say.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
  const words = [...say.querySelectorAll('.w')];

  // Local time (Berlin), refreshed each minute.
  const clock = document.querySelector('[data-clock]');
  const tick1 = () => { try { clock.textContent = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Berlin', timeZoneName: 'short' }).format(new Date()); } catch {} };
  tick1(); setInterval(tick1, 30000);

  // Work list: a small preview picture follows the cursor (mouse only).
  const pv = document.querySelector('.pv');
  if (pv && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const box = pv.parentElement, img = pv.querySelector('img');
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0, shown = false;
    const loop = () => { x += (tx - x) * .16; y += (ty - y) * .16; pv.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`; raf = Math.abs(tx - x) + Math.abs(ty - y) > .3 ? requestAnimationFrame(loop) : 0; };
    document.querySelectorAll('a.item[data-pv]').forEach(a => {
      a.addEventListener('pointerenter', e => { if (e.pointerType !== 'mouse') return; if (!img.src.endsWith(a.dataset.pv)) img.src = a.dataset.pv; pv.classList.add('on');
        const r = box.getBoundingClientRect(); tx = e.clientX - r.left + 28; ty = e.clientY - r.top - 90; if (!shown) { x = tx; y = ty; shown = true; } if (!raf) raf = requestAnimationFrame(loop); });
      a.addEventListener('pointermove', e => { const r = box.getBoundingClientRect(); tx = e.clientX - r.left + 28; ty = e.clientY - r.top - 90; if (!raf) raf = requestAnimationFrame(loop); });
    });
    box.querySelector('.list').addEventListener('pointerleave', () => { pv.classList.remove('on'); shown = false; });
  }

  if (reduced) { words.forEach(w => w.classList.add('on')); return; }
  root.classList.add('rv-on');

  /* ---------- Intro ---------- */
  const reveal = () => hero.classList.add('in'), heroH = hero.querySelector('h1');
  if (root.classList.contains('intro')) {
    const stage = document.querySelector('.intro-stage');
    const t = [];
    let done = false;
    const finish = () => {
      if (done) return; done = true;
      t.forEach(clearTimeout);
      stage.classList.add('leave', 's1', 's2');
      root.classList.remove('intro');
      try { sessionStorage.setItem('v16-intro', '1'); } catch {}
      setTimeout(reveal, 380);
      setTimeout(() => { heroH.classList.add('in'); }, 420);
      setTimeout(() => { stage.style.display = 'none'; }, 1100);
      ['wheel', 'keydown', 'pointerdown', 'touchstart'].forEach(e => removeEventListener(e, skip));
    };
    const skip = e => { if (e.type === 'wheel') e.preventDefault(); finish(); };
    addEventListener('wheel', skip, { passive: false });
    ['keydown', 'pointerdown', 'touchstart'].forEach(e => addEventListener(e, skip, { passive: true }));
    requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.add('s1')));
    t.push(setTimeout(() => stage.classList.add('s2'), 650));
    t.push(setTimeout(finish, 2000));
  } else {
    requestAnimationFrame(() => { reveal(); heroH.classList.add('in'); });
  }

  /* ---------- Smooth, inertial wheel scrolling (mouse only) ---------- */
  let smooth = null;
  if (fine) {
    root.classList.add('ss');
    let target = scrollY, current = scrollY, raf = 0, last = 0, lastSet = scrollY;
    const max = () => root.scrollHeight - innerHeight;
    const step = now => {
      const dt = Math.min(64, now - (last || now - 16.7)); last = now;
      current += (target - current) * (1 - Math.pow(1 - 0.09, dt / 16.7));
      if (Math.abs(target - current) < 0.35) current = target;
      lastSet = current; scrollTo(0, current);
      raf = current === target ? 0 : requestAnimationFrame(step);
      if (!raf) last = 0;
    };
    const go = y => { target = clamp(y, 0, max()); if (!raf) { current = scrollY; raf = requestAnimationFrame(step); } };
    addEventListener('wheel', e => {
      if (e.ctrlKey || e.defaultPrevented) return;
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 36 : e.deltaMode === 2 ? innerHeight : 1;
      if (!raf) target = scrollY;
      go(target + e.deltaY * unit);
    }, { passive: false });
    addEventListener('scroll', () => {
      if (!raf) { target = current = scrollY; return; }
      if (Math.abs(scrollY - lastSet) > 3) { cancelAnimationFrame(raf); raf = 0; last = 0; target = current = scrollY; }
    }, { passive: true });
    smooth = { go };
  }
  document.addEventListener('click', e => {
    const a = e.target.closest?.('a[href^="#"]');
    if (!a) return;
    const dest = a.hash === '#top' ? document.body : document.getElementById(a.hash.slice(1));
    if (!dest) return;
    e.preventDefault();
    const y = a.hash === '#top' ? 0 : scrollY + dest.getBoundingClientRect().top - (dest.id === 'contact' ? 40 : 20);
    if (smooth) smooth.go(y); else scrollTo({ top: y, behavior: 'smooth' });
  });

  /* ---------- Reveals: headings, list rows, notes ---------- */
  const io = new IntersectionObserver(es => {
    for (const en of es) if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  }, { rootMargin: '0px 0px -12% 0px' });
  document.querySelectorAll('.sec .lines, .end .lines, .list li').forEach(n => io.observe(n));
  // Notes appear while their section is in the middle of the screen, and leave after.
  const notes = [...document.querySelectorAll('[data-note]')];
  const nio = new IntersectionObserver(es => {
    for (const en of es) en.target.querySelector('[data-note]')?.classList.toggle('on', en.isIntersecting);
  }, { rootMargin: '-35% 0px -35% 0px' });
  notes.forEach(n => nio.observe(n.parentElement));

  /* ---------- Per frame: header, progress, hero out, sentence words ---------- */
  const head = document.getElementById('top');
  const sayBox = document.querySelector('.say');
  let prevY = scrollY, tick = false;
  const paint = () => {
    tick = false;
    const y = scrollY, vh = innerHeight;
    head.classList.toggle('lined', y > 8);
    if (Math.abs(y - prevY) > 6) { head.classList.toggle('tucked', y > prevY && y > 240 && !head.contains(document.activeElement)); prevY = y; }
    root.style.setProperty('--p', (y / Math.max(1, root.scrollHeight - vh)).toFixed(4));
    hero.style.setProperty('--h', clamp(y / (vh * 0.7), 0, 1).toFixed(3));
    const r = sayBox.getBoundingClientRect();
    const p = clamp((-r.top + vh * 0.25) / (r.height - vh * 0.6), 0, 1);
    const lit = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < lit));
  };
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(paint); } }, { passive: true });
  addEventListener('resize', paint);
  paint();
})();
