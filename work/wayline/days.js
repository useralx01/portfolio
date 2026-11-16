/* Wayline: Days screen. Builds everything inside #screen-days. */
(function () {
  'use strict';

  var root = document.getElementById('screen-days');
  if (!root) return;

  var EASE_UI = 'cubic-bezier(0.25, 1, 0.5, 1)';
  var EASE_ARRIVE = 'cubic-bezier(0.16, 1, 0.3, 1)';
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // Real Tokyo places. The first item of each day is the "next stop" (filled accent dot).
  var DAYS = [
    { date: 3, wd: 'Wed', temp: 11, cond: 'clear', km: 5.8, items: [
      { t: '15:00', name: 'Meiji Jingu', line: 'Forest shrine walk', area: 'Harajuku' },
      { t: '17:30', name: 'Nezu Museum', line: 'Garden and tea house', area: 'Aoyama' },
      { t: '19:30', name: 'Omoide Yokocho', line: 'Yakitori', area: 'Shinjuku' }
    ] },
    { date: 4, wd: 'Thu', temp: 8, cond: 'clear', km: 4.1, items: [
      { t: '07:00', name: 'Senso-ji', line: 'Temple before the crowds', area: 'Asakusa' },
      { t: '09:30', name: 'Kappabashi Street', line: 'Kitchen knives and plastic food', area: 'Taito' },
      { t: '13:00', name: 'Yanaka Ginza', line: 'Old shopping street', area: 'Yanaka' }
    ] },
    { date: 5, wd: 'Fri', temp: 12, cond: 'clear', km: 6.2, items: [
      { t: '09:00', name: 'Tsukiji Outer Market', line: 'Tamagoyaki and coffee', area: 'Chuo' },
      { t: '13:30', name: 'teamLab Planets', line: 'Art rooms, shoes off', area: 'Toyosu' },
      { t: '17:00', name: 'Shibuya Sky', line: 'Sunset over the city', area: 'Shibuya' },
      { t: '19:30', name: 'Ichiran Shibuya', line: 'Ramen, late dinner', area: 'Shibuya' }
    ] },
    { date: 6, wd: 'Sat', temp: 9, cond: 'cloudy', km: 3.4, items: [
      { t: '08:30', name: 'Hoshinoya Fuji', line: 'Onsen by the lake', area: 'Yamanashi' },
      { t: '14:00', name: 'Oshino Hakkai', line: 'Spring-fed ponds', area: 'Yamanashi' },
      { t: '19:00', name: 'Shimbashi', line: 'Salaryman bars', area: 'Minato' }
    ] },
    { date: 7, wd: 'Sun', temp: 10, cond: 'clear', km: 4.4, items: [
      { t: '10:00', name: 'Nakameguro Canal', line: 'Walk along the water', area: 'Meguro' },
      { t: '12:30', name: 'Daikanyama T-Site', line: 'Books and a long lunch', area: 'Daikanyama' },
      { t: '16:00', name: 'Yoyogi Park', line: 'Open lawns, slow afternoon', area: 'Yoyogi' }
    ] },
    { date: 8, wd: 'Mon', temp: 9, cond: 'light rain', km: 3.9, items: [
      { t: '10:00', name: 'Ueno Park', line: 'Museums and temple grounds', area: 'Ueno' },
      { t: '13:00', name: 'Ameyoko Market', line: 'Dried fish and street snacks', area: 'Ueno' },
      { t: '16:00', name: 'Tokyo Skytree', line: 'Views over the river', area: 'Sumida' }
    ] },
    { date: 9, wd: 'Tue', temp: 11, cond: 'clear', km: 5.5, items: [
      { t: '09:00', name: 'Shinjuku Gyoen', line: 'Garden in winter light', area: 'Shinjuku' },
      { t: '14:00', name: 'Omotesando', line: 'Architecture and window shops', area: 'Omotesando' },
      { t: '20:00', name: 'Golden Gai', line: 'Late drinks in tiny bars', area: 'Shinjuku' }
    ] },
    { date: 10, wd: 'Wed', temp: 7, cond: 'clear', km: 4.7, items: [
      { t: '10:00', name: 'Ginza Six', line: 'Rooftop garden and shops', area: 'Ginza' },
      { t: '13:30', name: 'Hibiya Park', line: 'Lawns and a slow lunch', area: 'Chiyoda' },
      { t: '18:00', name: 'Yurakucho', line: 'Beer and skewers', area: 'Yurakucho' }
    ] },
    { date: 11, wd: 'Thu', temp: 10, cond: 'clear', km: 4.9, items: [
      { t: '10:00', name: 'Shimokitazawa', line: 'Vintage shops and small cafes', area: 'Setagaya' },
      { t: '13:00', name: 'Local curry house', line: 'Lunch', area: 'Shimokitazawa' },
      { t: '17:00', name: 'Inokashira Park', line: 'Swan boats at dusk', area: 'Kichijoji' }
    ] },
    { date: 12, wd: 'Fri', temp: 8, cond: 'cloudy', km: 5.1, items: [
      { t: '11:00', name: 'Akihabara', line: 'Retro game arcades', area: 'Chiyoda' },
      { t: '15:00', name: 'Kanda Myojin', line: 'Shrine above the old town', area: 'Kanda' },
      { t: '19:00', name: 'Ebisu', line: 'Izakaya dinner', area: 'Ebisu' }
    ] },
    { date: 13, wd: 'Sat', temp: 9, cond: 'clear', km: 4.6, items: [
      { t: '10:00', name: 'Hamarikyu Gardens', line: 'Tidal lake and tea house', area: 'Chuo' },
      { t: '15:00', name: 'Odaiba', line: 'Seaside walk, Rainbow Bridge', area: 'Minato' },
      { t: '17:30', name: 'Roppongi Hills', line: 'City view at dusk', area: 'Roppongi' }
    ] },
    { date: 14, wd: 'Sun', temp: 10, cond: 'clear', km: 3.2, items: [
      { t: '09:00', name: 'Senso-ji', line: 'Last morning temple walk', area: 'Asakusa' },
      { t: '12:00', name: 'Sumida River walk', line: 'Ferry or a walk by the river', area: 'Sumida' },
      { t: '17:00', name: 'Shibuya Crossing', line: 'Last look at the crossing', area: 'Shibuya' }
    ] }
  ];

  // Trip is in December 2026: derive weekday labels from the date (3 Dec 2026 is a Thursday).
  var WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  DAYS.forEach(function (d) {
    d.wd = WD[new Date(2026, 11, d.date).getDay()];
  });

  var sel = 0;
  var token = 0;
  var outAnim = null;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  // ---- skeleton ----
  var wrap = el('div', 'days-wrap');
  var head = el('header', 'days-head');
  head.appendChild(el('h1', 'days-title', 'Tokyo'));
  head.appendChild(el('p', 'days-sub', '12 days · 3–14 Dec'));

  var strip = el('div', 'days-strip');
  strip.setAttribute('role', 'group');
  strip.setAttribute('aria-label', 'Choose a day');

  var bodyEl = el('div', 'days-body');
  var summary = el('p', 'days-summary');
  var scroll = el('div', 'days-scroll');
  var list = el('ol', 'tl');
  scroll.appendChild(list);
  bodyEl.appendChild(summary);
  bodyEl.appendChild(scroll);

  wrap.appendChild(head);
  wrap.appendChild(strip);
  wrap.appendChild(bodyEl);
  root.appendChild(wrap);


  // ---- small Tokyo map of the selected day's route ----
  var GEO = {
    Aoyama: [35.665, 139.716], Asakusa: [35.714, 139.796], Chiyoda: [35.694, 139.754], Chuo: [35.667, 139.771],
    Daikanyama: [35.648, 139.703], Ebisu: [35.647, 139.71], Ginza: [35.672, 139.765], Harajuku: [35.67, 139.703],
    Kanda: [35.692, 139.771], Meguro: [35.634, 139.716], Minato: [35.658, 139.751], Omotesando: [35.665, 139.712],
    Roppongi: [35.663, 139.731], Shibuya: [35.658, 139.702], Shimokitazawa: [35.661, 139.668], Shinjuku: [35.69, 139.7],
    Sumida: [35.71, 139.81], Taito: [35.712, 139.78], Toyosu: [35.649, 139.79], Ueno: [35.714, 139.774],
    Yanaka: [35.727, 139.766], Yoyogi: [35.672, 139.694], Yurakucho: [35.675, 139.763], Kichijoji: [35.703, 139.58], Setagaya: [35.646, 139.653]
  };
  var MAPW = 354, MAPH = 210, LON0 = 139.655, LON1 = 139.83, LAT0 = 35.628, LAT1 = 35.737;
  function px(g) {
    var x = (g[1] - LON0) / (LON1 - LON0), y = (LAT1 - g[0]) / (LAT1 - LAT0);
    return [Math.max(8, Math.min(MAPW - 8, x * MAPW)), Math.max(8, Math.min(MAPH - 8, y * MAPH))];
  }
  var RIVER = [[35.745, 139.802], [35.73, 139.803], [35.715, 139.799], [35.703, 139.793], [35.69, 139.789], [35.677, 139.786], [35.662, 139.778], [35.645, 139.772]];
  var mapEl = el('div', 'days-map');
  bodyEl.insertBefore(mapEl, scroll);
  function drawMap() {
    var d = DAYS[sel];
    var G = d.items.map(function (it) { return GEO[it.area]; }).filter(Boolean);
    if (G.length) {
      var la0 = Math.min.apply(null, G.map(function (g) { return g[0]; })), la1 = Math.max.apply(null, G.map(function (g) { return g[0]; }));
      var lo0 = Math.min.apply(null, G.map(function (g) { return g[1]; })), lo1 = Math.max.apply(null, G.map(function (g) { return g[1]; }));
      var cla = (la0 + la1) / 2, clo = (lo0 + lo1) / 2, K = 0.812, ASP = MAPW / MAPH;
      var spLa = Math.max((la1 - la0) * 1.9, 0.03), spLo = Math.max((lo1 - lo0) * 1.5, 0.05);
      if (spLo * K / spLa < ASP) spLo = spLa * ASP / K; else spLa = spLo * K / ASP;
      LAT0 = cla - spLa / 2; LAT1 = cla + spLa / 2; LON0 = clo - spLo / 2; LON1 = clo + spLo / 2;
    }
    var s = '<svg viewBox="0 0 ' + MAPW + ' ' + MAPH + '" aria-hidden="true">';
    for (var gx = 0; gx <= MAPW; gx += 14) for (var gy = 0; gy <= MAPH; gy += 14) s += '<circle cx="' + gx + '" cy="' + gy + '" r=".8" class="g"/>';
    if (0) s += '<path class="river" d="M' + RIVER.map(function (g) { return px(g).join(' '); }).join(' L') + '"/>';
    var P0 = d.items.map(function (it) { return GEO[it.area] ? px(GEO[it.area]) : null; }).filter(Boolean);
    Object.keys(GEO).forEach(function (k) {
      var p = px(GEO[k]);
      if (p[0] <= 8 || p[0] >= MAPW - 8 || p[1] <= 8 || p[1] >= MAPH - 8) return;
      if (P0.some(function (q) { return p[0] > q[0] - 60 && p[0] < q[0] + 14 && Math.abs(q[1] - p[1]) < 14; })) return;
      s += '<text class="dl" x="' + (p[0] + 5).toFixed(1) + '" y="' + (p[1] + 3).toFixed(1) + '">' + k + '</text>';
    });
    var P = d.items.map(function (it) { return GEO[it.area] ? px(GEO[it.area]) : null; }).filter(Boolean);
    if (P.length > 1) {
      var path = 'M' + P[0].join(' ');
      for (var i = 1; i < P.length; i++) {
        var a = P[i - 1], b = P[i], mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1];
        path += ' Q' + (mx - dy * 0.22).toFixed(1) + ' ' + (my + dx * 0.22).toFixed(1) + ' ' + b.join(' ');
      }
      s += '<path class="route" pathLength="1" d="' + path + '"/>';
    }
    P.forEach(function (p, i) {
      s += '<g class="stop' + (i === 0 ? ' first' : '') + '" transform="translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ')"><circle r="8"/><text y="3.5">' + (i + 1) + '</text></g>';
    });
    mapEl.innerHTML = s + '</svg>';
    var r = mapEl.querySelector('.route');
    if (r && r.animate && !reduce) r.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 900, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', fill: 'both' });
  }

  var dayBtns = DAYS.map(function (d, i) {
    var b = el('button', 'day');
    b.type = 'button';
    b.setAttribute('aria-label', d.wd + ' ' + d.date + ' December');
    b.setAttribute('aria-pressed', 'false');
    b.appendChild(el('span', 'wd', d.wd));
    b.appendChild(el('span', 'num', String(d.date)));
    b.addEventListener('click', function () { select(i); });
    strip.appendChild(b);
    return b;
  });

  // ---- render ----
  function updateStrip() {
    for (var i = 0; i < dayBtns.length; i++) {
      dayBtns[i].setAttribute('aria-pressed', i === sel ? 'true' : 'false');
    }
  }

  function centreStrip(smooth) {
    var b = dayBtns[sel];
    var left = b.offsetLeft - (strip.clientWidth - b.offsetWidth) / 2;
    try {
      strip.scrollTo({ left: Math.max(0, left), behavior: smooth && !reduce ? 'smooth' : 'auto' });
    } catch (e) {
      strip.scrollLeft = Math.max(0, left);
    }
  }

  function renderDay() {
    var d = DAYS[sel];
    summary.textContent = d.temp + '° ' + d.cond + ' · ' + d.items.length + ' stops · ' + d.km.toFixed(1) + ' km on foot';
    list.textContent = '';
    d.items.forEach(function (it, k) {
      var li = el('li', 'tl-li');
      var b = el('button', 'tl-item' + (k === 0 ? ' is-next' : ''));
      b.type = 'button';
      b.appendChild(el('span', 'dot', String(k + 1)));
      b.appendChild(el('span', 'time', it.t));
      var txt = el('span', 'txt');
      txt.appendChild(el('span', 'name', it.name));
      txt.appendChild(el('span', 'line', it.line));
      b.appendChild(txt);
      b.appendChild(el('span', 'area', it.area));
      li.appendChild(b);
      list.appendChild(li);
    });
    scroll.scrollTop = 0;
    drawMap();
  }

  function playRows() {
    if (reduce || !list.animate) return;
    var rows = list.querySelectorAll('.tl-li');
    for (var k = 0; k < rows.length; k++) {
      rows[k].animate(
        [
          { opacity: 0, transform: 'translateY(8px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ],
        { duration: 500, delay: k * 40, easing: EASE_ARRIVE, fill: 'backwards' }
      );
    }
  }

  // ---- day switch: crossfade out, rebuild, stagger in ----
  function select(i) {
    if (i === sel) return;
    sel = i;
    updateStrip();
    centreStrip(true);
    var my = ++token;

    if (reduce || !bodyEl.animate) {
      renderDay();
      return;
    }
    if (outAnim) outAnim.cancel();
    outAnim = bodyEl.animate(
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 160, easing: EASE_UI, fill: 'forwards' }
    );
    outAnim.onfinish = function () {
      if (my !== token) return;
      outAnim.cancel();
      outAnim = null;
      renderDay();
      playRows();
    };
  }

  // ---- entrance when the Days tab opens ----
  function enter() {
    token++;
    if (outAnim) { outAnim.cancel(); outAnim = null; }
    renderDay();
    playRows();
  }

  window.addEventListener('wayline:tab', function (e) {
    if (e && e.detail === 'days') enter();
  });

  updateStrip();
  renderDay();
})();
