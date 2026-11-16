// v27: the live app in the scroll window. Picks the Mac or the iPhone version of Wayline by the window's shape,
// renders it at its native size and scales it to cover the window (same zoom the video had via --vs).
(() => {
  const win = document.querySelector('.film-win'), app = win && win.querySelector('.film-app');
  if (!app) return;
  const PAGES = { mac: ['work/wayline/desk.html', 1512, 982], phone: ['work/wayline/app.html', 402, 874] };
  const btn = document.querySelector('.film-try');
  let kind = '';
  function fit() {
    const W = win.clientWidth, H = win.clientHeight, k = W / H < .9 ? 'phone' : 'mac';
    const [src, w, h] = PAGES[k];
    if (k !== kind) { kind = k; app.src = src; app.style.width = w + 'px'; app.style.height = h + 'px'; btn && (btn.dataset.dv = 'wayline:' + k); }
    const s = Math.max(W / w, H / h);
    app.style.transform = `translate(-50%,-50%) scale(${s.toFixed(4)}) scale(var(--vs,1))`;
  }
  addEventListener('resize', fit); fit();
})();
