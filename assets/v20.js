// Portfolio v20: black opening that turns light. Sizes the black zone to the end of the film, darkens the nav
// while it is over black, fades the window glow as the film opens, and curves the light page up over the black.
(() => {
  const $ = s => document.querySelector(s);
  // 4K footage for big screens, a 1440p copy (still sharp, ~40% smaller) for phones and small windows
  if (screen.width * (devicePixelRatio || 1) < 2000)
    document.querySelectorAll('video[src*="licht-views-loop.mp4"]').forEach(v => { v.src = v.getAttribute('src').replace('licht-views-loop.mp4', 'licht-views-loop-1440.mp4'); });
  const main = $('main'), film = $('.film'), nav = $('.lnav'), hl = $('#highlights');
  if (!main || !film) return;
  const dz = document.createElement('div'); dz.className = 'dz'; dz.setAttribute('aria-hidden', 'true'); main.prepend(dz);
  const stick = $('.film-stick'), win = $('.film-win');
  if (win && !$('.film-edge')) { const e = document.createElement('i'); e.className = 'film-edge'; win.after(e); }
  const edge = $('.film-edge');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => 1 - Math.pow(1 - t, 3);
  let H = 0;
  const size = () => { const top = main.getBoundingClientRect().top + scrollY; H = film.getBoundingClientRect().bottom + scrollY - top + 52; dz.style.setProperty('--dzh', H + 'px'); main.style.setProperty('--dzh', H + 'px'); };
  const frame = () => {
    const vh = innerHeight, r = film.getBoundingClientRect();
    // nav is dark while the black is under it
    nav && nav.classList.toggle('dk', r.bottom > 30);
    if (reduced) return;
    const p = clamp(-r.top / (r.height - vh)), o = clamp(p / .42);
    const go = (1 - o).toFixed(3);
    stick.style.setProperty('--go', go);
    // the edge follows the same window as the clip (vars live on .film-win, copy them)
    if (edge && win) ['--it', '--ib', '--ix', '--ir'].forEach(k => edge.style.setProperty(k, win.style.getPropertyValue(k)));
    edge && edge.style.setProperty('--go', go);
    if (hl) { const t = hl.getBoundingClientRect().top; hl.style.setProperty('--c2', (1 - ease(clamp((vh - t) / (vh * .85)))).toFixed(4)); }
  };
  let tick = false;
  addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; frame(); }); } }, { passive: true });
  addEventListener('resize', () => { size(); frame(); });
  addEventListener('load', () => { size(); frame(); });
  size(); frame();
})();
