// Portfolio v17: intro, nav, reveals, highlights gallery, closer-look tabs, segmented switcher, stat count-up.
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Intro ---------- */
  if (root.classList.contains('intro')) {
    const stage = $('.intro-stage'), t = [];
    let done = false;
    const finish = () => {
      if (done) return; done = true;
      t.forEach(clearTimeout);
      stage.classList.add('leave', 's1', 's2');
      root.classList.remove('intro');
      try { sessionStorage.setItem('v17-intro', '1'); } catch {}
      setTimeout(() => $$('.hero .fu').forEach(n => n.classList.add('in')), 350);
      setTimeout(() => { stage.style.display = 'none'; }, 1100);
      ['wheel', 'keydown', 'pointerdown', 'touchstart'].forEach(e => removeEventListener(e, skip));
    };
    const skip = e => { if (e.type === 'wheel') e.preventDefault(); finish(); };
    addEventListener('wheel', skip, { passive: false });
    ['keydown', 'pointerdown', 'touchstart'].forEach(e => addEventListener(e, skip, { passive: true }));
    requestAnimationFrame(() => requestAnimationFrame(() => stage.classList.add('s1')));
    t.push(setTimeout(() => stage.classList.add('s2'), 650));
    t.push(setTimeout(finish, 2000));
  }

  /* ---------- Reveals ---------- */
  if (!reduced && 'IntersectionObserver' in window) {
    root.classList.add('fu-on');
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -10% 0px' });
    $$('.fu').forEach(n => { if (!(root.classList.contains('intro') && n.closest('.hero'))) io.observe(n); });
  }

  /* ---------- Nav: hairline once scrolled, current section greyed ---------- */
  const nav = $('.lnav'), links = $$('.lnav nav a:not(.pill)');
  addEventListener('scroll', () => nav.classList.toggle('lined', scrollY > 4), { passive: true });
  const secs = links.map(a => $(a.getAttribute('href')));
  const sio = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) links.forEach((a, i) => a.classList.toggle('cur', secs[i] === en.target)); }), { rootMargin: '-45% 0px -50% 0px' });
  secs.forEach(s => s && sio.observe(s));

  /* ---------- Highlights gallery ---------- */
  const track = $('[data-gallery]'), slides = $$('[data-slide]', track), dots = $$('.dots button'), hl = $('.hl');
  const DUR = 6500;
  let cur = 0, t0 = 0, paused = reduced, inView = false, raf = 0, lock = 0;
  const go = (i, smooth = true) => {
    cur = (i + slides.length) % slides.length; t0 = performance.now();
    lock = performance.now() + 900;
    track.scrollTo({ left: slides[cur].offsetLeft - slides[0].offsetLeft, behavior: smooth && !reduced ? 'smooth' : 'auto' });
    mark();
  };
  const mark = () => {
    dots.forEach((d, k) => { d.classList.toggle('on', k === cur); d.setAttribute('aria-selected', k === cur); d.style.setProperty('--f', 0); });
    slides.forEach((s, k) => { const v = $('video', s); if (!v) return; if (k === cur && inView && !paused) { v.preload = 'auto'; v.currentTime = 0; v.play().catch(() => {}); } else v.pause(); });
  };
  const loop = now => {
    raf = 0;
    if (!inView || paused) return;
    const f = Math.min(1, (now - t0) / DUR);
    dots[cur].style.setProperty('--f', f.toFixed(3));
    if (f >= 1) go(cur + 1);
    raf = requestAnimationFrame(loop);
  };
  const run = () => { if (!raf && inView && !paused) { t0 = performance.now() - (parseFloat(dots[cur].style.getPropertyValue('--f')) || 0) * DUR; raf = requestAnimationFrame(loop); } };
  dots.forEach((d, k) => d.addEventListener('click', () => { go(k); run(); }));
  $('.pp').addEventListener('click', () => {
    paused = !paused; hl.classList.toggle('paused', paused); $('.pp').setAttribute('aria-label', paused ? 'Play' : 'Pause');
    const v = $('video', slides[cur]); if (v) paused ? v.pause() : v.play().catch(() => {});
    run();
  });
  track.addEventListener('scroll', () => {
    if (performance.now() < lock) return;
    const x = track.scrollLeft, i = slides.reduce((b, s, k) => Math.abs(s.offsetLeft - slides[0].offsetLeft - x) < Math.abs(slides[b].offsetLeft - slides[0].offsetLeft - x) ? k : b, 0);
    if (i !== cur) { cur = i; t0 = performance.now(); mark(); }
  }, { passive: true });
  new IntersectionObserver(([en]) => { inView = en.isIntersecting; mark(); run(); }, { threshold: 0.4 }).observe(track);
  if (reduced) { hl.classList.add('paused'); }
  mark();

  /* ---------- Take a closer look ---------- */
  const tabs = $$('.cl-list button'), panels = $$('[data-panel]');
  const openP = i => { tabs.forEach((b, k) => b.setAttribute('aria-selected', k === i)); panels.forEach((p, k) => p.classList.toggle('on', k === i)); };
  tabs.forEach((b, i) => b.addEventListener('click', () => openP(i)));
  $$('[data-open]').forEach(a => a.addEventListener('click', () => openP(+a.dataset.open)));

  /* ---------- Segmented switcher ---------- */
  const seg = $('.seg'), sb = $$('button', seg), thumb = $('.seg-thumb'), sp = $$('.seg-p');
  const setSeg = i => {
    sb.forEach((b, k) => b.setAttribute('aria-selected', k === i)); sp.forEach((p, k) => p.classList.toggle('on', k === i));
    thumb.style.width = sb[i].offsetWidth + 'px'; thumb.style.transform = `translateX(${sb[i].offsetLeft}px)`;
  };
  sb.forEach((b, i) => b.addEventListener('click', () => setSeg(i)));
  const segInit = () => setSeg(Math.max(0, sb.findIndex(b => b.getAttribute('aria-selected') === 'true')));
  addEventListener('resize', segInit);
  (document.fonts?.ready || Promise.resolve()).then(segInit);

  /* ---------- Stats count up when seen ---------- */
  const cio = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return; cio.unobserve(en.target);
    const b = en.target, to = +b.dataset.count; if (reduced) return;
    const s = performance.now();
    const step = now => { const f = Math.min(1, (now - s) / 1400), e = 1 - Math.pow(1 - f, 3); b.textContent = Math.round(to * e); if (f < 1) requestAnimationFrame(step); };
    b.textContent = '0'; requestAnimationFrame(step);
  }), { threshold: 0.6 });
  $$('[data-count]').forEach(b => cio.observe(b));
})();
