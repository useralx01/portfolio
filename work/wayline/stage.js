/* Wayline stage: a Mac and an iPhone floating. Click one: it turns to face you, fills the window and becomes usable. */
(function () {
  'use strict';
  var mac = document.getElementById('mac'), ph = document.getElementById('ph');
  var fm = document.querySelector('.floor-mac'), fp = document.querySelector('.floor-ph');
  var back = document.getElementById('back');
  var REST = { mac: 'rotateY(-17deg) rotateX(5deg)', ph: 'rotateY(16deg) rotateZ(-3.5deg)' };
  var live = null;

  function box(el, x, y, w, h) { el.style.left = x + 'px'; el.style.top = y + 'px'; el.style.width = w + 'px'; el.style.height = h + 'px'; }

  // Each device is laid out at its big, opened size so it stays sharp; at rest it is scaled down and turned.
  function place(dev, x, y, w, h, rot) {
    var W = innerWidth, H = innerHeight;
    var top = W < 820 ? 84 : 20, bot = W < 820 ? 44 : 20;
    var s = Math.min(W * 0.94 / w, (H - top - bot) * 0.96 / h), bw = w * s, bh = h * s;
    var bx = (W - bw) / 2, by = top + (H - top - bot - bh) / 2;
    box(dev, bx, by, bw, bh);
    dev._rest = 'translate3d(' + (x + w / 2 - W / 2).toFixed(1) + 'px,' + (y + h / 2 - H / 2).toFixed(1) + 'px,0) scale(' + (1 / s).toFixed(4) + ') ' + rot;
    if (live !== dev) dev.style.transform = dev._rest;
  }

  function layout() {
    var W = innerWidth, H = innerHeight, narrow = W < 820;
    // MacBook: 3860x2540. iPhone: 1350x2760.
    var mw = narrow ? W * 0.9 : Math.min(W * 0.6, H * 0.95), mh = mw * 2540 / 3860;
    var mx = narrow ? (W - mw) / 2 : W * 0.6 - mw / 2, my = narrow ? H * 0.2 : H * 0.5 - mh / 2 - H * 0.02;
    var phh = narrow ? H * 0.5 : mh * 0.98, phw = phh * 1350 / 2760;
    var px = narrow ? W * 0.5 - phw * 0.25 : mx - phw * 0.42, py = narrow ? my + mh * 0.55 : my + mh * 0.2;
    place(mac, mx, my, mw, mh, REST.mac); place(ph, px, py, phw, phh, REST.ph);
    box(fm, mx + mw * 0.08, my + mh * 1.06, mw * 0.84, mh * 0.1);
    box(fp, px + phw * 0.05, py + phh * 1.03, phw * 0.9, phh * 0.05);
    fit(mac, 1512); fit(ph, 402);
  }

  function fit(dev, pt) {
    var s = dev.querySelector('.scr'), f = dev.querySelector('iframe');
    f.style.transform = 'scale(' + s.offsetWidth / pt + ')';
  }

  function aim(dev) { dev.style.transform = 'none'; }

  function open(dev) {
    if (live === dev) return;
    live = dev;
    document.body.classList.add('focus');
    dev.classList.add('live');
    dev.setAttribute('aria-label', '');
    dev.querySelector('iframe').tabIndex = 0;
    aim(dev);
    setTimeout(function () { try { dev.querySelector('iframe').focus(); } catch (e) {} }, 900);
  }

  function close() {
    if (!live) return;
    var dev = live; live = null;
    dev.style.transform = dev._rest;
    dev.classList.remove('live');
    dev.querySelector('iframe').tabIndex = -1;
    document.body.classList.remove('focus');
    back.blur();
  }

  mac.addEventListener('click', function () { if (!live) open(mac); });
  ph.addEventListener('click', function () { if (!live) open(ph); });
  back.addEventListener('click', close);
  addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  // Esc pressed while the app inside has focus
  addEventListener('message', function (e) { if (e.data && e.data.wayline === 'esc') close(); });
  [mac, ph].forEach(function (d) {
    d.querySelector('iframe').addEventListener('load', function () {
      try { d.querySelector('iframe').contentWindow.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); }); } catch (err) {}
    });
  });
  // a click on the empty backdrop also goes back
  document.getElementById('scene').addEventListener('click', function (e) { if (live && e.target.id === 'scene') close(); });

  addEventListener('resize', layout);
  layout();
  document.fonts && document.fonts.ready.then(layout);
})();
