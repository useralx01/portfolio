// Portfolio v11: smooth inertial scrolling, header that tucks away, media that grows into
// place, reveals, magnetic buttons, video players and copy-to-clipboard email. Everything is optional: without JS the page is complete.
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const span = (t, a, b) => clamp((t - a) / (b - a), 0, 1);

  // Hero entrance: only when the page is visible and already painting frames.
  if (!reduced && scrollY < 40 && !document.hidden) requestAnimationFrame(() => root.classList.add('go'));

  /* ---------- 1. Smooth, inertial wheel scrolling (mouse only) ---------- */
  let smooth = null;
  if (fine && !reduced) {
    root.classList.add('ss');
    let target = scrollY, current = scrollY, raf = 0, last = 0, lastSet = scrollY;
    const max = () => root.scrollHeight - innerHeight;
    const step = now => {
      const dt = Math.min(64, now - (last || now - 16.7)); last = now;
      current += (target - current) * (1 - Math.pow(1 - 0.092, dt / 16.7));
      if (Math.abs(target - current) < 0.35) current = target;
      lastSet = current;
      scrollTo(0, current);
      raf = current === target ? 0 : requestAnimationFrame(step);
      if (!raf) last = 0;
    };
    const go = y => { target = clamp(y, 0, max()); if (!raf) { current = scrollY; raf = requestAnimationFrame(step); } };
    addEventListener('wheel', e => {
      if (e.ctrlKey || e.defaultPrevented || document.fullscreenElement) return;
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
    const a = e.target.closest?.('a[href*="#"]');
    if (!a || a.pathname !== location.pathname) return;
    const dest = document.getElementById(a.hash.slice(1));
    if (!dest) return;
    e.preventDefault();
    let y = scrollY + dest.getBoundingClientRect().top - (dest.id === 'contact' ? 0 : 24);
    // Pinned product scenes: land where the product is shown full size.
    if (root.classList.contains('sc-on') && dest.hasAttribute('data-scene')) y = scrollY + dest.getBoundingClientRect().top + dest.offsetHeight * 0.46 - innerHeight;
    if (smooth) smooth.go(y); else scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  });

  /* ---------- 2. Header tucks away going down, returns going up; media grows in ---------- */
  const head = document.getElementById('top');
  const grows = [...document.querySelectorAll('[data-grow]')];
  let prevY = scrollY, ticking = false;
  const onScroll = () => {
    ticking = false;
    const y = scrollY;
    head.classList.toggle('lined', y > 8);
    if (Math.abs(y - prevY) > 6) { head.classList.toggle('tucked', y > prevY && y > 220 && !head.contains(document.activeElement)); prevY = y; }
    if (reduced) return;
    for (const g of grows) {
      const r = g.getBoundingClientRect();
      if (r.top > innerHeight || r.bottom < 0) continue;
      const e = 1 - Math.pow(1 - span(innerHeight - r.top, 0, innerHeight * 0.8), 3);
      g.style.transform = `translate3d(0, ${((1 - e) * 48).toFixed(1)}px, 0) scale(${(0.93 + 0.07 * e).toFixed(4)})`;
    }
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- 3. Reveals: visible by default, JS only adds the entrance ---------- */
  if ('IntersectionObserver' in window && !reduced) {
    root.classList.add('rv-on');
    const io = new IntersectionObserver(entries => {
      for (const en of entries) if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    document.querySelectorAll('.rv').forEach(n => io.observe(n));
  }

  /* ---------- 4. Lazy videos: fetch metadata only when close ---------- */
  const near = (els, fn, margin = '600px 0px') => {
    if (!('IntersectionObserver' in window)) return els.forEach(fn);
    const o = new IntersectionObserver(entries => { for (const en of entries) if (en.isIntersecting) { fn(en.target); o.unobserve(en.target); } }, { rootMargin: margin });
    els.forEach(el => o.observe(el));
  };
  near([...document.querySelectorAll('video[data-lazy]')], v => { v.preload = 'metadata'; });

  /* ---------- 6. Silent loops: play while on screen, with a pause button ---------- */
  for (const box of document.querySelectorAll('[data-loop]')) {
    const v = box.querySelector('video'), b = box.querySelector('.loop-btn');
    let user = reduced, inView = false;
    const sync = () => {
      if (!user && inView) v.play().catch(() => {}); else v.pause();
      box.classList.toggle('paused', user);
      b.setAttribute('aria-label', user ? 'Play' : 'Pause');
    };
    b.addEventListener('click', () => { user = !user; sync(); });
    if ('IntersectionObserver' in window) new IntersectionObserver(([en]) => { inView = en.isIntersecting; if (inView) v.preload = 'auto'; sync(); }, { threshold: 0.35 }).observe(box);
    else { inView = true; sync(); }
  }

  /* ---------- 7. Magnetic controls + a sheen that follows the cursor ---------- */
  if (fine && !reduced) {
    const items = [...document.querySelectorAll('[data-magnetic]')].map(n => ({ n, x: 0, y: 0, vx: 0, vy: 0, play: n.classList.contains('play') }));
    let mx = -1e4, my = -1e4, loop = 0;
    const tick = () => {
      let moving = false;
      for (const it of items) {
        const r = it.n.getBoundingClientRect();
        if (!r.width) continue;
        const k = it.play ? 0.16 : 0.24, m = it.play ? 10 : 6;
        const cx = r.left + r.width / 2 - it.x, cy = r.top + r.height / 2 - it.y;
        const dx = mx - cx, dy = my - cy;
        const inside = Math.abs(dx) < r.width / 2 + 28 && Math.abs(dy) < r.height / 2 + 24;
        const tx = inside ? clamp(dx * k, -m, m) : 0, ty = inside ? clamp(dy * k, -m * 0.7, m * 0.7) : 0;
        it.vx = it.vx * 0.62 + (tx - it.x) * 0.16; it.vy = it.vy * 0.62 + (ty - it.y) * 0.16;
        it.x += it.vx; it.y += it.vy;
        if (Math.abs(tx - it.x) > 0.05 || Math.abs(it.vx) > 0.05 || Math.abs(ty - it.y) > 0.05 || Math.abs(it.vy) > 0.05) moving = true;
        else { it.x = tx; it.y = ty; }
        it.n.style.translate = it.play ? `calc(-50% + ${it.x.toFixed(2)}px) calc(-50% + ${it.y.toFixed(2)}px)` : `${it.x.toFixed(2)}px ${it.y.toFixed(2)}px`;
      }
      loop = moving ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => { if (!loop) loop = requestAnimationFrame(tick); };
    addEventListener('pointermove', e => { if (e.pointerType !== 'mouse') return; mx = e.clientX; my = e.clientY; kick(); }, { passive: true });
    document.addEventListener('pointerleave', () => { mx = my = -1e4; kick(); });
    addEventListener('scroll', kick, { passive: true });
    for (const b of document.querySelectorAll('.btn')) {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        b.style.setProperty('--mx', (e.clientX - r.left).toFixed(0) + 'px');
        b.style.setProperty('--my', (e.clientY - r.top).toFixed(0) + 'px');
      }, { passive: true });
    }
  }

  /* ---------- 9. Email copies on click ---------- */
  for (const b of document.querySelectorAll('[data-copy]')) {
    let t = 0;
    b.addEventListener('click', async () => {
      let ok = false;
      try { await navigator.clipboard.writeText(b.dataset.copy); ok = true; } catch {}
      if (!ok) {
        // Clipboard API can be blocked in frames; the old copy command still works there.
        const t = document.createElement('textarea');
        t.value = b.dataset.copy; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;opacity:0;top:0';
        document.body.appendChild(t); t.select();
        try { ok = document.execCommand('copy'); } catch {}
        t.remove(); b.focus({ preventScroll: true });
      }
      if (!ok) { location.href = 'mailto:' + b.dataset.copy; return; }
      b.classList.add('done'); clearTimeout(t); t = setTimeout(() => b.classList.remove('done'), 2200);
    });
  }
})();

// Video players (from Overlink v96). Click to play with sound; a floating control bar
// (play/pause, elapsed, seek with time preview, time left, mute, full screen) hides while
// playing. Keyboard: space/k play, arrows seek 5 s, m mute, f full screen.
(() => {
  const players = [...document.querySelectorAll('[data-player]')];
  const fmt = s => { s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  for (const player of players) {
    const video = player.querySelector('video'), play = player.querySelector('.play'), toggle = player.querySelector('.toggle');
    const seek = player.querySelector('.seek'), wrap = player.querySelector('.seek-wrap'), tip = player.querySelector('.seek-tip');
    const now = player.querySelector('.time-now'), left = player.querySelector('.time-left');
    const mute = player.querySelector('.mute'), full = player.querySelector('.full');
    let hideTimer = 0, seeking = false;
    const paint = () => {
      const d = video.duration || 0;
      if (!seeking) seek.value = String(Math.round((d ? video.currentTime / d : 0) * 1000));
      seek.style.setProperty('--p', (Number(seek.value) / 10).toFixed(2) + '%');
      let b = 0;
      for (let i = 0; i < video.buffered.length; i++) if (video.buffered.start(i) <= video.currentTime + 0.5) b = Math.max(b, video.buffered.end(i));
      seek.style.setProperty('--b', (d ? (b / d) * 100 : 0).toFixed(2) + '%');
      seek.setAttribute('aria-valuetext', fmt(video.currentTime) + ' of ' + fmt(d));
      now.textContent = fmt(video.currentTime);
      if (d) left.textContent = '-' + fmt(d - video.currentTime);
    };
    const showBar = () => {
      player.classList.add('show-bar');
      clearTimeout(hideTimer);
      if (!video.paused) hideTimer = setTimeout(() => { if (!player.contains(document.activeElement) || document.activeElement === video) player.classList.remove('show-bar'); }, 2200);
    };
    const start = () => {
      for (const other of players) if (other !== player) other.querySelector('video').pause();
      player.classList.add('started');
      video.preload = 'auto'; video.muted = false;
      video.play()?.catch(() => { video.muted = true; video.play().catch(() => {}); });
    };
    const flip = () => { if (video.paused || video.ended) start(); else video.pause(); };
    const fullscreen = () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (player.requestFullscreen) player.requestFullscreen().catch(() => {});
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    };
    play.addEventListener('click', () => { start(); toggle.focus({ preventScroll: true }); });
    video.addEventListener('click', flip);
    video.addEventListener('dblclick', fullscreen);
    toggle.addEventListener('click', flip);
    video.addEventListener('play', () => { player.classList.add('playing'); toggle.setAttribute('aria-label', 'Pause'); showBar(); });
    video.addEventListener('pause', () => { player.classList.remove('playing'); toggle.setAttribute('aria-label', 'Play'); showBar(); });
    video.addEventListener('ended', () => player.classList.remove('playing', 'started'));
    for (const ev of ['timeupdate', 'progress', 'loadedmetadata']) video.addEventListener(ev, paint);
    video.addEventListener('volumechange', () => { player.classList.toggle('muted', video.muted); mute.setAttribute('aria-label', video.muted ? 'Unmute' : 'Mute'); });
    seek.addEventListener('input', () => { seeking = true; if (video.duration) video.currentTime = (Number(seek.value) / 1000) * video.duration; paint(); });
    seek.addEventListener('change', () => { seeking = false; });
    wrap.addEventListener('pointermove', e => {
      const r = seek.getBoundingClientRect();
      tip.textContent = fmt(clamp01((e.clientX - r.left) / r.width) * (video.duration || 0));
      wrap.style.setProperty('--tx', (e.clientX - wrap.getBoundingClientRect().left).toFixed(0) + 'px');
      wrap.classList.toggle('hovering', !!video.duration && e.pointerType === 'mouse');
    });
    wrap.addEventListener('pointerleave', () => wrap.classList.remove('hovering'));
    mute.addEventListener('click', () => { video.muted = !video.muted; });
    full.addEventListener('click', fullscreen);
    for (const ev of ['pointermove', 'pointerdown', 'focusin']) player.addEventListener(ev, showBar);
    player.addEventListener('keydown', e => {
      if (!player.classList.contains('started')) return;
      const k = e.key;
      if (k === 'k' || (k === ' ' && e.target.tagName !== 'BUTTON')) { e.preventDefault(); flip(); }
      else if ((k === 'ArrowLeft' || k === 'ArrowRight') && e.target !== seek && video.duration) { e.preventDefault(); video.currentTime = Math.min(video.duration, Math.max(0, video.currentTime + (k === 'ArrowLeft' ? -5 : 5))); showBar(); }
      else if (k === 'm') mute.click();
      else if (k === 'f') fullscreen();
    });
    paint();
  }
  function clamp01(v) { return Math.min(1, Math.max(0, v)); }
})();
