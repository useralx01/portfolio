// v21: laptop + phone mockups you can open. Tap the phone or the Mac: that device comes to the centre
// with the real app running inside, to scroll and tap through. Frames are Apple's official bezels.
(() => {
  const root = document.documentElement, de = root.lang === 'de', base = de ? '../' : '';
  const T = de ? { close: 'Schließen', phone: 'iPhone', mac: 'Mac', open: 'In neuem Tab öffnen', load: 'App wird geladen…', off: 'Die Demo ist gerade offline.' }
               : { close: 'Close', phone: 'iPhone', mac: 'Mac', open: 'Open in a new tab', load: 'Loading the app…', off: 'The demo is offline right now.' };
  // where each live app is right now (its tunnel address changes, a small text file always has the current one)
  const APPS = {
    homing: { name: 'Homing', src: 'https://useralx01.github.io/homing/live.txt' },
    tradelabs: { name: 'TradeLabs', src: 'https://useralx01.github.io/homing/tradelabs.txt' },
  };
  // screen hole of each frame (Apple bezel PNGs) and the size the app sees inside it, in CSS pixels
  const DEV = {
    phone: { img: base + 'media/dev/iphone.webp', ratio: 1350 / 2760, hole: [72 / 1350, 69 / 2760, 1206 / 1350, 2622 / 2760], w: 402, h: 874, top: 54 },
    mac: { img: base + 'media/dev/macbook.webp', ratio: 3860 / 2540, hole: [418 / 3860, 288 / 2540, 3024 / 3860, 1964 / 2540], w: 1512, h: 982, top: 34 },
  };
  const url = {};
  const getUrl = k => url[k] || (url[k] = fetch(APPS[k].src + '?' + Date.now()).then(r => r.ok ? r.text() : '').then(t => {
    t = t.trim(); if (!/^https:\/\/[a-z0-9-]+\.trycloudflare\.com$/.test(t)) throw 0; return t;
  }));

  let box, stage, frame, scr, ifr, note, tabs, newTab, cur = null, lastFocus = null;
  function build() {
    box = document.createElement('div'); box.className = 'dv'; box.hidden = true;
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
    box.innerHTML = `<div class="dv-top"><div class="dv-tabs" role="tablist"><button type="button" data-d="phone" role="tab">${T.phone}</button><button type="button" data-d="mac" role="tab">${T.mac}</button></div>
      <a class="dv-new" target="_blank" rel="noopener">${T.open} <span aria-hidden="true">↗</span></a>
      <button type="button" class="dv-x" aria-label="${T.close}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
      <div class="dv-stage"><div class="dv-dev"><div class="dv-scr"><p class="dv-note"></p><iframe title="" loading="eager" referrerpolicy="strict-origin-when-cross-origin"></iframe></div><img class="dv-frame" alt=""></div></div>`;
    document.body.append(box);
    stage = box.querySelector('.dv-stage'); frame = box.querySelector('.dv-dev'); scr = box.querySelector('.dv-scr');
    ifr = box.querySelector('iframe'); note = box.querySelector('.dv-note'); tabs = [...box.querySelectorAll('.dv-tabs button')]; newTab = box.querySelector('.dv-new');
    box.querySelector('.dv-x').addEventListener('click', close);
    tabs.forEach(b => b.addEventListener('click', () => show(cur.app, b.dataset.d)));
    box.addEventListener('click', e => { if (e.target === stage) close(); });
    addEventListener('keydown', e => { if (!box.hidden && e.key === 'Escape') close(); });
    addEventListener('resize', () => { if (!box.hidden) fit(); });
  }
  function fit() {
    const d = DEV[cur.dev], r = stage.getBoundingClientRect();
    const maxW = r.width - 32, maxH = r.height - 24;
    let w = Math.min(maxW, maxH * d.ratio); const h = w / d.ratio;
    frame.style.width = w + 'px'; frame.style.height = h + 'px';
    const [hx, hy, hw, hh] = d.hole;
    Object.assign(scr.style, { left: hx * 100 + '%', top: hy * 100 + '%', width: hw * 100 + '%', height: hh * 100 + '%' });
    const s = (w * hw) / d.w;
    Object.assign(ifr.style, { width: d.w + 'px', height: (d.h - d.top) + 'px', top: d.top * s + 'px', transform: `scale(${s})` });
  }
  function show(app, dev) {
    cur = { app, dev };
    const d = DEV[dev];
    box.dataset.dev = dev; frame.querySelector('.dv-frame').src = d.img;
    tabs.forEach(b => b.setAttribute('aria-selected', b.dataset.d === dev));
    box.setAttribute('aria-label', APPS[app].name);
    ifr.title = APPS[app].name; note.textContent = T.load; box.classList.remove('ready');
    fit();
    getUrl(app).then(u => {
      if (cur.app !== app) return;
      newTab.href = u;
      if (ifr.dataset.u !== u) { ifr.dataset.u = u; ifr.onload = () => box.classList.add('ready'); ifr.src = u; } else box.classList.add('ready');
    }).catch(() => { note.textContent = T.off; newTab.removeAttribute('href'); });
  }
  function open(app, dev) {
    if (!box) build();
    lastFocus = document.activeElement;
    if (cur && cur.app !== app) { ifr.removeAttribute('src'); delete ifr.dataset.u; }
    box.hidden = false; root.classList.add('dv-on');
    show(app, dev);
    tabs.find(b => b.dataset.d === dev).focus({ preventScroll: true });
  }
  function close() {
    box.hidden = true; root.classList.remove('dv-on');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  document.querySelectorAll('[data-dv]').forEach(b => b.addEventListener('click', e => {
    e.preventDefault(); const [app, dev] = b.dataset.dv.split(':'); open(app, dev);
  }));
})();
