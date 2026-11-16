// v25: the eclipse opening and the project scenes. The intro draws the eclipse rim as one line, the light
// blooms out of it, then the words rise. Scrolling looks through the black disc into Homing, and every next
// project opens through a growing circle of the same light.
(() => {
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const ec = $('.ec'); if (!ec) return;
  const root = document.documentElement, pin = $('.ec-pin', ec), scenes = $$('.ec-scene', ec), intro = scenes[0];
  const ring = $('.ec-ring', ec), mark = $('.ec-mark', ec), line = $('.ec-line', ec), nav = $('.lnav');
  const anchors = $$('.ec-a', ec);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = t => 1 - Math.pow(1 - t, 3), inout = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const N = scenes.length - 1, HOLD0 = .45, OPEN = .95, HOLD = .65;
  let vw, vh, cx, cy, discR, rMax;

  function layout() {
    vw = innerWidth; vh = pin.clientHeight || innerHeight;
    const phone = vw < 820;
    discR = Math.round(phone ? Math.min(vw * .27, vh * .15) : Math.min(vh * .2, vw * .15, 210));
    cx = vw / 2; cy = phone ? vh * .36 : vh * .4;
    rMax = Math.hypot(Math.max(cx, vw - cx), Math.max(cy, vh - cy)) + 40;
    pin.style.setProperty('--cx', cx + 'px'); pin.style.setProperty('--cy', cy + 'px');
    pin.style.setProperty('--ms', (discR / .26).toFixed(1) + 'px');
    if (reduced) return;
    ec.style.height = ((HOLD0 + N * (OPEN + HOLD)) * vh + vh) + 'px';
    anchors.forEach((a, k) => a.style.top = (k === 0 ? 0 : (HOLD0 + (k - 1) * (OPEN + HOLD) + OPEN) * vh) + 'px');
    drawLine(lineT);
  }

  /* intro: one neon line draws the rim clockwise from the top, the glow blooms out of it */
  let lineT = 0;
  function drawLine(t) {
    lineT = t;
    const s = discR / .26, dpr = Math.min(2, devicePixelRatio || 1), c = line;
    if (c.width !== Math.round(s * dpr)) { c.width = c.height = Math.round(s * dpr); }
    const g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, s, s);
    if (t <= 0) return;
    const a0 = -Math.PI / 2, a1 = a0 + Math.PI * 2 * t;
    g.lineCap = 'round';
    for (const [w, blur, col] of [[3, 22, 'rgba(160,188,255,.9)'], [2, 8, 'rgba(230,238,255,1)'], [1.4, 0, '#fff']]) {
      g.beginPath(); g.arc(s / 2, s / 2, discR + .5, a0, a1); g.lineWidth = w; g.shadowBlur = blur; g.shadowColor = col; g.strokeStyle = col; g.stroke();
    }
  }
  function playIntro() {
    if (reduced) { mark.classList.add('lit'); intro.classList.add('in'); return; }
    const T = 1250, t0 = performance.now();
    const step = now => {
      const t = clamp((now - t0) / T); drawLine(inout(t));
      if (t < 1) return requestAnimationFrame(step);
      mark.classList.add('lit');
      line.style.transition = 'opacity 1s ease .25s'; line.style.opacity = '0';
      setTimeout(() => intro.classList.add('in'), 250);
    };
    setTimeout(() => requestAnimationFrame(step), 250);
  }

  /* scroll: each scene opens through a circle */
  let dark = null;
  function frame() {
    if (reduced) return;
    const y = -ec.getBoundingClientRect().top;
    let cur = 0;
    let ringR = 0, ringO = 0;
    for (let k = 1; k <= N; k++) {
      const sc = scenes[k], s0 = (HOLD0 + (k - 1) * (OPEN + HOLD)) * vh;
      const t = clamp((y - s0) / (OPEN * vh));
      const ox = k === 1 ? cx : vw / 2, oy = k === 1 ? cy : vh / 2;
      const r0 = k === 1 ? discR : 0, r = r0 + (rMax - r0) * inout(t);
      if (t <= 0) { sc.classList.remove('on', 'in'); continue; }
      sc.classList.add('on');
      sc.style.clipPath = t >= 1 ? 'none' : `circle(${r.toFixed(1)}px at ${ox}px ${oy}px)`;
      const d = $('.sc-d', sc); d && d.style.setProperty('--ds', (1.1 - .1 * ease(t)).toFixed(4));
      if (t > .55) sc.classList.add('in'); else if (t < .25) sc.classList.remove('in');
      if (t >= .5) cur = k;
      if (t > 0 && t < 1) {
        ringR = r; ringO = k === 1 ? clamp(t * 6) * (1 - clamp((t - .55) / .45)) : clamp(t * 10) * (1 - clamp((t - .55) / .45));
        ring.style.left = ox + 'px'; ring.style.top = oy + 'px';
      }
      if (k === 1) {
        // inside the disc the scene appears first, then the disc grows; the eclipse light rides the edge
        sc.style.opacity = clamp(t * 5).toFixed(3);
        mark.style.transform = `translate(-50%,-50%) scale(${(r / discR).toFixed(4)})`;
        mark.style.opacity = (1 - clamp(t * 3)).toFixed(3);
      }
    }
    if (y <= (HOLD0 * vh)) { mark.style.transform = ''; mark.style.opacity = ''; }
    ring.style.width = ring.style.height = (2 * ringR).toFixed(1) + 'px';
    ring.style.transform = 'translate(-50%,-50%)';
    ring.style.opacity = ringO.toFixed(3);
    // hide the intro words as the first circle opens
    intro.querySelector('.ec-hero').style.opacity = (1 - clamp((y - HOLD0 * vh * .3) / (vh * .5))).toFixed(3);
    const inEc = y < ec.offsetHeight - vh * .5;
    const dk = inEc && scenes[cur].hasAttribute('data-dark');
    if (dk !== dark) { dark = dk; nav && nav.classList.toggle('dk', dk); }
  }

  let ticking = false;
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; frame(); }); } };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { layout(); frame(); });
  layout(); frame();
  if (document.readyState === 'complete') playIntro(); else addEventListener('load', playIntro);
  // links to a scene land where it is fully open
  $$('a[href^="#p-"]').forEach(a => a.addEventListener('click', e => {
    const t = document.getElementById(a.getAttribute('href').slice(1)); if (!t) return;
    e.preventDefault(); scrollTo({ top: ec.offsetTop + t.offsetTop + 2, behavior: reduced ? 'auto' : 'smooth' });
  }));
})();
