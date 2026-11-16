/* Wayline - Boarding pass screen. Builds its DOM inside #screen-pass. */
(function () {
  'use strict';

  var root = document.getElementById('screen-pass');
  if (!root || root.getAttribute('data-built') === '1') return;
  root.setAttribute('data-built', '1');

  /* seeded PRNG (mulberry32) so the barcode and QR are the same on every load */
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* PDF417-like stripes: 300 units wide, dark and light runs of 1 to 3 units */
  function barcodeSVG() {
    var r = rng(204);
    var d = '';
    var x = 0;
    var dark = true;
    while (x < 300) {
      var w = 1 + Math.floor(r() * 3);
      if (x + w > 300) w = 300 - x;
      if (dark) {
        var hh = r() < 0.12 ? 84 : 100;
        d += 'M' + x + ' ' + (100 - hh) + 'h' + w + 'v' + hh + 'h-' + w + 'z';
      }
      x += w;
      dark = !dark;
    }
    return (
      '<svg class="barcode" viewBox="0 0 300 100" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="' + d + '"/></svg>'
    );
  }

  /* 29 x 29 QR-like grid: real finder squares, separators, timing and alignment, seeded data */
  function qrSVG() {
    var N = 29;
    var r = rng(3112);
    var M = [];
    var i, j;
    for (i = 0; i < N; i++) {
      M.push([]);
      for (j = 0; j < N; j++) M[i].push(-1);
    }

    function finderCell(li, lj) {
      return li === 0 || li === 6 || lj === 0 || lj === 6 || (li >= 2 && li <= 4 && lj >= 2 && lj <= 4) ? 1 : 0;
    }

    /* three finders plus a one-module light separator around each */
    var finders = [[0, 0], [0, 22], [22, 0]];
    finders.forEach(function (f) {
      for (var a = -1; a <= 7; a++) {
        for (var b = -1; b <= 7; b++) {
          var y = f[0] + a;
          var x = f[1] + b;
          if (y < 0 || x < 0 || y >= N || x >= N) continue;
          M[y][x] = a >= 0 && a < 7 && b >= 0 && b < 7 ? finderCell(a, b) : 0;
        }
      }
    });

    /* small alignment pattern near the bottom right */
    for (i = 20; i <= 24; i++) {
      for (j = 20; j <= 24; j++) {
        var li = i - 20;
        var lj = j - 20;
        M[i][j] = li === 0 || li === 4 || lj === 0 || lj === 4 || (li === 2 && lj === 2) ? 1 : 0;
      }
    }

    /* timing rows and columns */
    for (var k = 8; k <= 20; k++) {
      M[6][k] = k % 2 === 0 ? 1 : 0;
      M[k][6] = k % 2 === 0 ? 1 : 0;
    }

    /* data modules */
    for (i = 0; i < N; i++) {
      for (j = 0; j < N; j++) {
        if (M[i][j] === -1) M[i][j] = r() < 0.5 ? 1 : 0;
      }
    }

    var d = '';
    for (i = 0; i < N; i++) {
      j = 0;
      while (j < N) {
        if (M[i][j] === 1) {
          var s = j;
          while (j < N && M[i][j] === 1) j++;
          d += 'M' + s + ' ' + i + 'h' + (j - s) + 'v1h-' + (j - s) + 'z';
        } else {
          j++;
        }
      }
    }
    return (
      '<svg class="qr" viewBox="-3 -3 35 35" shape-rendering="crispEdges" aria-hidden="true">' +
      '<path d="' + d + '"/></svg>'
    );
  }

  /* small plane seen from above, nose pointing right, drawn for this screen */
  var PLANE =
    '<svg class="plane" viewBox="0 0 24 24" aria-hidden="true"><path d="' +
    'M22 12 L14.5 10.4 L11.2 3.6 L9.4 3.6 L11 10.4 L6.2 10.4 L4.4 7.4 L3 7.4 L4 10.4 ' +
    'L4 13.6 L3 16.6 L4.4 16.6 L6.2 13.6 L11 13.6 L9.4 20.4 L11.2 20.4 L14.5 13.6 Z"/></svg>';

  root.innerHTML =
    '<div class="pass-root">' +
      '<header class="pass-head">' +
        '<h2 class="pass-title">Boarding pass</h2>' +
        '<p class="pass-sub">WL 204 · Thu 3 Dec</p>' +
      '</header>' +
      '<div class="pass-stage">' +
        '<div class="pass-tilt" role="button" tabindex="0" aria-pressed="false" aria-label="Boarding pass. Tap to flip.">' +
          '<div class="pass-flip">' +
            '<div class="pass-face pass-front">' +
              '<div class="pass-sheen"></div>' +
              '<div class="pass-top">' +
                '<div class="route">' +
                  '<span class="lbl l">Berlin</span>' +
                  '<span class="lbl r">Tokyo Haneda</span>' +
                  '<span class="code l">BER</span>' +
                  '<span class="mid"><i class="rule"></i>' + PLANE + '<i class="rule"></i></span>' +
                  '<span class="code r">HND</span>' +
                '</div>' +
                '<dl class="facts">' +
                  '<div class="fact wide"><dt>Passenger</dt><dd>A. Licht</dd></div>' +
                  '<div class="fact"><dt>Flight</dt><dd>WL 204</dd></div>' +
                  '<div class="fact"><dt>Gate</dt><dd>B12</dd></div>' +
                  '<div class="fact"><dt>Seat</dt><dd>14A</dd></div>' +
                  '<div class="fact"><dt>Boarding</dt><dd>07:05</dd></div>' +
                  '<div class="fact"><dt>Group</dt><dd>2</dd></div>' +
                '</dl>' +
              '</div>' +
              '<div class="pass-tear"><span class="dash"></span></div>' +
              '<div class="pass-bottom">' +
                '<div class="times"><div><span>Departs</span><b>07:40</b></div><div><span>Arrives</span><b>08:30<sup>+1</sup></b></div><div><span>Flight time</span><b>11h 50m</b></div></div>' +
                barcodeSVG() +
                '<p class="scan">Scan at gate</p>' +
              '</div>' +
            '</div>' +
            '<div class="pass-face pass-back">' +
              '<div class="pass-sheen"></div>' +
              '<p class="back-top">WL 204 · Thu 3 Dec</p>' +
              qrSVG() +
              '<p class="back-cap">Show this at the gate</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  var stage = root.querySelector('.pass-stage');
  var tilt = root.querySelector('.pass-tilt');
  var flip = root.querySelector('.pass-flip');
  var flipped = false;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function setFlip(v) {
    flipped = v;
    flip.classList.toggle('is-flipped', v);
    tilt.setAttribute('aria-pressed', v ? 'true' : 'false');
  }

  tilt.addEventListener('click', function () {
    setFlip(!flipped);
  });

  tilt.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setFlip(!flipped);
    }
  });

  if (!reduce) {
    tilt.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var r = stage.getBoundingClientRect();
      var px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
      var py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      tilt.style.setProperty('--ry', ((px - 0.5) * 14).toFixed(2) + 'deg');
      tilt.style.setProperty('--rx', ((0.5 - py) * 14).toFixed(2) + 'deg');
      tilt.style.setProperty('--sx', (100 - px * 100).toFixed(1) + '%');
      tilt.classList.add('is-tilting');
    });

    tilt.addEventListener('pointerleave', function () {
      tilt.classList.remove('is-tilting');
      tilt.style.setProperty('--rx', '0deg');
      tilt.style.setProperty('--ry', '0deg');
    });
  }

  /* entrance: restart the rise animation each time the Pass tab opens */
  function enter() {
    root.classList.remove('is-in');
    void root.offsetWidth;
    root.classList.add('is-in');
  }

  window.addEventListener('wayline:tab', function (e) {
    if (e && e.detail === 'pass') enter();
  });

  if (document.body && document.body.getAttribute('data-tab') === 'pass') enter();
})();
