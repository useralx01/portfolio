/* "How it works" model engine. A page holds <section class="om" data-model="SLUG"></section> and loads
   data/models/SLUG.js (which sets window.MODELS[SLUG] = scene) before this file. No libraries.
   Scene format: see data/models/lead-automation.js (the reference scene). */
(function () {
  var LANG = (document.documentElement.lang || 'en').slice(0, 2);
  function T(x) { return x == null ? '' : typeof x === 'string' ? x : (x[LANG] || x.en || '') }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;') }

  /* ---------- isometric drawing ---------- */
  /* Camera: the plane turns around its centre (YAW) and tilts (EL). At YAW 0 and EL = 35.26 deg this is the classic isometric view. */
  var S = 50, K3 = 1.2247 * S, CX = 789.59, CY = 510.5, R2 = Math.SQRT1_2, EL0 = Math.asin(.57735), YAW = 0, EL = EL0, CS = 1, SS = 0, SE = .57735, CE = .8165;
  function setCam(yaw, el) { YAW = yaw; EL = el; CS = Math.cos(yaw); SS = Math.sin(yaw); SE = Math.sin(el); CE = Math.cos(el) }
  function rot(x, y) { var dx = x - 6, dy = y - 3.7; return [dx * CS - dy * SS, dx * SS + dy * CS] }
  function P(x, y, z) { var r = rot(x, y); return [CX + (r[0] - r[1]) * R2 * K3, CY + (r[0] + r[1]) * R2 * K3 * SE - (z || 0) * K3 * CE] }
  function depth(x, y) { var r = rot(x, y); return r[0] + r[1] }
  // a face with outward normal (nx, ny, nz) is drawn only when it faces the viewer; side faces get light/dark by which way they point on screen
  function nrm(nx, ny) { return [nx * CS - ny * SS, nx * SS + ny * CS] }
  function seen(nx, ny, nz) { var n = nrm(nx, ny); return (n[0] + n[1]) * R2 * CE + (nz || 0) * SE > .002 }
  function side(nx, ny, t) { var n = nrm(nx, ny); return n[0] - n[1] < 0 ? t[1] : t[2] }
  function pts(a) { return a.map(function (p) { var q = P(p[0], p[1], p[2]); return q[0].toFixed(1) + ',' + q[1].toFixed(1) }).join(' ') }
  function poly(a, c) { return '<polygon class="fc ' + c + '" points="' + pts(a) + '"/>' }
  function face(a, nx, ny, nz, c) { return seen(nx, ny, nz) ? poly(a, c) : '' }
  function quadX(x, y0, y1, z0, z1, c, nx) { return face([[x, y0, z0], [x, y1, z0], [x, y1, z1], [x, y0, z1]], nx || 1, 0, 0, c) }   // on a face facing +x (or -x)
  function quadY(y, x0, x1, z0, z1, c, ny) { return face([[x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]], 0, ny || 1, 0, c) }   // on a face facing +y (or -y)
  function quadZ(z, x0, x1, y0, y1, c) { return poly([[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]], c) }   // on a top face
  function box(x, y, z, w, d, h, t) {
    t = t || ['f1', 'f2', 'f3'];
    return quadY(y, x, x + w, z, z + h, side(0, -1, t), -1) + quadX(x, y, y + d, z, z + h, side(-1, 0, t), -1) +
      quadY(y + d, x, x + w, z, z + h, side(0, 1, t)) + quadX(x + w, y, y + d, z, z + h, side(1, 0, t)) + quadZ(z + h, x, x + w, y, y + d, t[0])
  }
  function seg(a, b, extra) { var p = P(a[0], a[1], a[2]), q = P(b[0], b[1], b[2]); return '<line class="ln" ' + (extra || '') + ' x1="' + p[0].toFixed(1) + '" y1="' + p[1].toFixed(1) + '" x2="' + q[0].toFixed(1) + '" y2="' + q[1].toFixed(1) + '"/>' }
  function cyl(x, y, z, r, h, fill) {
    var c = P(x, y, z), t = P(x, y, z + h), rx = r * K3, ry = rx * SE;
    return '<path class="fc ' + (fill || 'f2') + '" d="M' + (c[0] - rx) + ',' + c[1] + ' A' + rx + ',' + ry + ' 0 0 0 ' + (c[0] + rx) + ',' + c[1] + ' L' + (t[0] + rx) + ',' + t[1] + ' L' + (t[0] - rx) + ',' + t[1] + ' Z"/>' +
      '<ellipse class="fc f1" cx="' + t[0] + '" cy="' + t[1] + '" rx="' + rx + '" ry="' + ry + '"/>'
  }

  /* Object kinds. (x,y) is the back corner on the plane; the plane is 12 x 7.4 units. o = options from the scene. */
  var K = {
    building: function (x, y, o) {
      var w = o.w || 2.2, d = o.d || 1.6, h = o.h || 1.5, s = box(x, y, 0, w, d, h) + box(x + .3, y + .3, h, w * .55, d * .62, .35), i, j;
      for (i = 0; i < Math.floor(d / .5); i++) for (j = 0; j < Math.floor(h / .55); j++) s += quadX(x + w, y + .2 + i * .48, y + .5 + i * .48, .3 + j * .55, .62 + j * .55, 'f1');
      for (i = 0; i < Math.floor(w / .5); i++) s += quadY(y + d, x + .18 + i * .5, x + .48 + i * .5, .3, h - .3, 'f1');
      if (o.sign) s += quadY(y + d, x + .2, x + w - .2, h - .25, h - .05, 'bl');
      return s
    },
    house: function (x, y, o) {
      var w = o.w || 1.6, d = o.d || 1.4, h = o.h || .9, s = box(x, y, 0, w, d, h), r = h + .7;
      var t3 = ['f1', 'f2', 'f3'];
      var sa = face([[x, y, h], [x + w, y, h], [x + w, y + d / 2, r], [x, y + d / 2, r]], 0, -.7, .7, side(0, -1, t3)), sb = face([[x, y + d, h], [x + w, y + d, h], [x + w, y + d / 2, r], [x, y + d / 2, r]], 0, .7, .7, side(0, 1, t3)), fb = nrm(0, 1);
      s += (fb[0] + fb[1] > 0 ? sa + sb : sb + sa) +
        face([[x, y, h], [x, y + d, h], [x, y + d / 2, r]], -1, 0, 0, side(-1, 0, t3)) + face([[x + w, y, h], [x + w, y + d, h], [x + w, y + d / 2, r]], 1, 0, 0, side(1, 0, t3));
      s += quadY(y + d, x + w * .4, x + w * .62, 0, .55, 'f3'); return s
    },
    person: function (x, y, o) { var r = o.big ? .32 : .26, h = o.big ? 1.05 : .85, t = P(x, y, h + r * 1.25); return cyl(x, y, 0, r, h, 'f2') + '<circle class="fc f1" cx="' + t[0] + '" cy="' + t[1] + '" r="' + (r * S * .95) + '"/>' },
    people: function (x, y) { return K.person(x, y, { big: 1 }) + K.person(x + .9, y + .5, {}) },
    doc: function (x, y, o) {
      var s = box(x, y, 0, 1.3, 1.7, .08) + (o.stack ? box(x + .1, y - .12, .08, 1.3, 1.7, .08) : ''), z = o.stack ? .16 : .08, i;
      for (i = 0; i < 4; i++) s += seg([x + .3, y + .15 + i * .33, z], [x + 1.15, y + .15 + i * .33, z]);
      if (o.total) s += quadZ(z, x + .7, x + 1.15, y + 1.3, y + 1.5, 'f3');
      if (o.button) s += quadZ(z, x + .3, x + 1.15, y + 1.35, y + 1.5, 'f3');
      if (o.stamp) s += quadZ(z, x + .25, x + .6, y + 1.2, y + 1.55, 'red');
      return s
    },
    envelope: function (x, y, o) {
      var z = o.z || 0, w = 1.5, d = 1.05, h = .18, s = '', n = o.stack || 1, i;
      for (i = 0; i < n; i++) { var zz = z + i * h, xx = x + i * .14, yy = y + i * .14; s += box(xx, yy, zz, w, d, h) + seg([xx, yy, zz + h], [xx + w / 2, yy + d * .55, zz + h]) + seg([xx + w / 2, yy + d * .55, zz + h], [xx + w, yy, zz + h]) }
      return s
    },
    deal: function (x, y) { var s = box(x, y, 0, 1.6, 1.1, .12), i; for (i = 0; i < 3; i++) s += box(x + .15 + i * .48, y + .2, .12, .36, .7, .18 + i * .22); return s },
    coins: function (x, y) { return cyl(x, y, 0, .42, .16) + cyl(x, y, .16, .42, .16) + cyl(x, y, .32, .42, .16) + cyl(x + .95, y + .1, 0, .42, .16) + cyl(x + .95, y + .1, .16, .42, .16) },
    calendar: function (x, y) {
      var w = 1.3, d = .22, h = 1.25, s = box(x, y, 0, w, d, h) + quadY(y + d, x, x + w, h - .3, h, 'red'), r, c;
      for (r = 0; r < 3; r++) for (c = 0; c < 4; c++) s += quadY(y + d, x + .15 + c * .29, x + .32 + c * .29, .15 + r * .25, .29 + r * .25, r == 1 && c == 2 ? 'bl' : 'f3');
      return s + seg([x + .35, y + d / 2, h + .12], [x + .35, y + d / 2, h - .1]) + seg([x + .95, y + d / 2, h + .12], [x + .95, y + d / 2, h - .1])
    },
    sheet: function (x, y, o) {
      var w = o.w || 2, d = o.d || 1.5, s = box(x, y, 0, w, d, .08) + quadZ(.08, x, x + w, y, y + .25, 'gr'), i;
      for (i = 1; i < 5; i++) s += seg([x, y + .25 + i * (d - .25) / 5, .08], [x + w, y + .25 + i * (d - .25) / 5, .08]);
      for (i = 1; i < 4; i++) s += seg([x + i * w / 4, y, .08], [x + i * w / 4, y + d, .08]);
      if (o.mark) s += quadZ(.08, x + w / 4, x + w / 2, y + .25 + (d - .25) / 5, y + .25 + 2 * (d - .25) / 5, 'bl');
      return s
    },
    phone: function (x, y) { var s = box(x, y, 0, .75, .14, 1.4); s += quadY(y + .14, x + .06, x + .69, .08, 1.32, 'scr'); s += quadY(y + .14, x + .12, x + .63, .85, 1.1, 'f1'); return s },
    laptop: function (x, y) { var s = box(x, y, 0, 1.6, 1.1, .08); s += poly([[x, y, .08], [x + 1.6, y, .08], [x + 1.6, y - .25, 1.05], [x, y - .25, 1.05]], 'f2'); s += poly([[x + .08, y - .02, .16], [x + 1.52, y - .02, .16], [x + 1.52, y - .23, .98], [x + .08, y - .23, .98]], 'scr'); return s },
    bed: function (x, y) { return box(x, y, 0, 1.4, 2, .35) + box(x, y + .05, .35, 1.4, .5, .15, ['f1', 'f1', 'f2']) + box(x, y + .75, .35, 1.4, 1.2, .08, ['bl', 'bl', 'bl']) + box(x, y - .1, 0, 1.4, .12, .8) },
    server: function (x, y) { var s = '', i; for (i = 0; i < 3; i++) { s += box(x, y, i * .42, 1.1, 1.1, .38); s += quadY(y + 1.1, x + .15, x + .3, i * .42 + .14, i * .42 + .24, 'gr') } return s },
    folder: function (x, y) { return box(x, y, 0, 1.4, 1, .1) + box(x + .05, y - .05, .1, 1.3, .9, .06, ['f1', 'f1', 'f2']) + poly([[x, y, .16], [x + .5, y, .16], [x + .6, y - .15, .16], [x, y - .15, .16]], 'f3') },
    chat: function (x, y, o) { var s = box(x, y, 0, 1.4, .12, .9); s += poly([[x + .25, y + .12, 0], [x + .5, y + .12, 0], [x + .2, y + .12, -.25]], 'f2'); for (var i = 0; i < 3; i++) s += seg([x + .2, y + .13, .7 - i * .2], [x + 1.2 - (i == 2 ? .4 : 0), y + .13, .7 - i * .2]); return s },
    tag: function (x, y) { var s = poly([[x, y, .06], [x + 1, y, .06], [x + 1.3, y + .35, .06], [x + 1, y + .7, .06], [x, y + .7, .06]], 'f1') + quadX(x + 1, y, y + .7, 0, .06, 'f3'); var c = P(x + 1.05, y + .35, .06); return s + '<circle class="fc f3" cx="' + c[0] + '" cy="' + c[1] + '" r="4"/>' },
    block: function (x, y, o) { return box(x, y, 0, o.w || 1, o.d || 1, o.h || 1) }
  };

  /* ---------- logos (Simple Icons paths, CC0) ---------- */
  var LOGO = {
    gmail: ['#EA4335', 'M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z'],
    whatsapp: ['#25D366', 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'],
    hubspot: ['#FF7A59', 'M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.013.006v2.852a6.22 6.22 0 00-2.969 1.31l.012-.01-7.828-6.095A2.497 2.497 0 104.3 4.656l-.012.006 7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-.013-.02-2.342 2.343a1.968 1.968 0 00-.58-.095h-.002a2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l.005.014 2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207v.002a3.206 3.206 0 01-3.207 3.207z'],
    gcal: ['#4285F4', 'M18.316 5.684H24v12.632h-5.684V5.684zM5.684 24h12.632v-5.684H5.684V24zM18.316 5.684V0H1.895A1.894 1.894 0 0 0 0 1.895v16.421h5.684V5.684h12.632zM22.105 0h-3.289v5.184H24V1.895A1.894 1.894 0 0 0 22.105 0zm-3.289 23.5l4.684-4.684h-4.684V23.5zM0 22.105C0 23.152.848 24 1.895 24h3.289v-5.184H0v3.289z'],
    sheets: ['#34A853', 'M11.318 12.545H7.91v-1.909h3.41v1.91zM14.728 0v6h6l-6-6zm1.363 10.636h-3.41v1.91h3.41v-1.91zm0 3.273h-3.41v1.91h3.41v-1.91zM20.727 6.5v15.864c0 .904-.732 1.636-1.636 1.636H4.909a1.636 1.636 0 0 1-1.636-1.636V1.636C3.273.732 4.005 0 4.909 0h9.318v6.5h6.5zm-3.273 2.773H6.545v7.909h10.91v-7.91zm-6.136 4.636H7.91v1.91h3.41v-1.91z'],
    web: ['var(--blue)', 'M12 0a12 12 0 100 24 12 12 0 000-24zm7.9 7h-3.4a18 18 0 00-1.6-4.6A9.6 9.6 0 0119.9 7zM12 2.4c.9 1.3 1.6 2.9 2 4.6h-4c.4-1.7 1.1-3.3 2-4.6zM2.6 14a9.8 9.8 0 010-4h3.9a20 20 0 000 4H2.6zm.9 3h3.4c.4 1.7 1 3.2 1.6 4.6A9.6 9.6 0 013.5 17zM6.9 7H3.5a9.6 9.6 0 015-4.6C7.9 3.8 7.3 5.3 6.9 7zM12 21.6c-.9-1.3-1.6-2.9-2-4.6h4c-.4 1.7-1.1 3.3-2 4.6zm2.4-7.6H9.6a17 17 0 010-4h4.8a17 17 0 010 4zm.4 7.6c.6-1.4 1.2-2.9 1.6-4.6h3.4a9.6 9.6 0 01-5 4.6zm2.7-7.6a20 20 0 000-4h3.9a9.8 9.8 0 010 4h-3.9z'],
    call: ['var(--tx)', 'M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 013 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z'],
    ai: ['var(--tx)', 'M12 0l2.2 7.8L22 10l-7.8 2.2L12 20l-2.2-7.8L2 10l7.8-2.2z'],
    rule: ['var(--tx)', 'M3 4h18v2H3zm0 7h12v2H3zm0 7h18v2H3zm16-8l4 2-4 2z'],
    euro: ['var(--tx)', 'M15 5c-3 0-5.5 1.9-6.4 4.5H17l-.7 2H8.2a7 7 0 000 1h7.4l-.7 2H8.6A6.8 6.8 0 0015 19c1.5 0 2.9-.5 4-1.3v2.6c-1.2.6-2.6 1-4 1-4.2 0-7.7-2.8-8.8-6.8H4l.7-2h1.1a9 9 0 010-1H4l.7-2h1.5C7.3 5.5 10.8 2.7 15 2.7c1.4 0 2.8.4 4 1v2.6C17.9 5.5 16.5 5 15 5z'],
    voice: ['var(--tx)', 'M4 9h2v6H4zm4-4h2v14H8zm4 2h2v10h-2zm4 3h2v4h-2z'],
    doc: ['var(--tx)', 'M6 2h8l5 5v15H6zM14 2v5h5M9 12h7M9 15h7M9 18h4'],
    pdf: ['#E2574C', 'M6 2h8l5 5v15H6zM8 13h2.5a1.5 1.5 0 010 3H8zm0 0v5m5-5v5h1.5a2.5 2.5 0 000-5zm5 0h-2v5m0-2.5h1.6'],
    clock: ['var(--tx)', 'M12 2a10 10 0 100 20 10 10 0 000-20zm1 5h-2v6l5 3 1-1.7-4-2.3z'],
    lock: ['var(--tx)', 'M7 10V7a5 5 0 0110 0v3h1v11H6V10zm2 0h6V7a3 3 0 00-6 0z'],
    check: ['var(--ok)', 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z'],
    excel: ['#217346', 'M3 3h11v18H3zM14 6h7v12h-7M5.5 8l2 4-2 4h1.8l1.2-2.6L9.7 16h1.8l-2-4 2-4H9.7L8.5 10.6 7.3 8z'],
    chart: ['var(--tx)', 'M4 20V10h3v10zm6 0V4h3v16zm6 0v-7h3v7z'],
    link: ['var(--tx)', 'M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1m2 3.7a4 4 0 00-5.7 0l-3 3A4 4 0 0011 18.7l1-1'],
    claude: ['#D97757', 'M4.7 15.9l4.7-2.6.1-.2-.1-.1h-.2l-.8-.1-2.7-.1-2.3-.1-2.2-.1-.6-.1L0 11.9l.1-.3.5-.3.7.1 1.5.1 2.3.2 1.7.1 2.5.3h.4l.1-.2-.1-.1-.1-.1-2.4-1.6-2.6-1.7-1.3-1-.7-.5-.4-.5-.2-1 .6-.7.9.1.2.1.9.7 1.9 1.5 2.5 1.8.4.3.1-.1v-.1l-.2-.3-1.4-2.5-1.5-2.6-.7-1.1-.2-.6a3 3 0 01-.1-.8l.8-1 .4-.1 1 .1.4.4.6 1.4 1 2.2 1.6 3.1.5.9.2.9.1.3h.2v-.2l.1-1.7.2-2.1.2-2.7.1-.8.4-.9.7-.5.6.3.5.7-.1.4-.3 1.8-.6 3-.4 2h.2l.3-.3 1-1.3 1.7-2.1.7-.8.9-.9.5-.4h1l.7 1.1-.3 1.1-1 1.3-.9 1.1-1.2 1.7-.8 1.3.1.1h.2l2.8-.6 1.5-.3 1.8-.3.8.4.1.4-.3.8-1.9.5-2.3.5-3.4.8h-.1l.1.1 1.5.1.7.1h1.6l3 .2.8.5.5.6-.1.5-1.2.6-1.6-.4-3.8-.9-1.3-.3h-.2v.1l1.1 1.1 2 1.8 2.5 2.4.1.6-.3.5-.4-.1-2.3-1.8-.9-.8-2.1-1.7h-.1v.2l.5.7 2.5 3.7.1 1.1-.2.4-.6.2-.7-.1-1.4-2-1.5-2.3-1.2-2-.1.1-.7 7.6-.3.4-.8.3-.6-.5-.4-.8.4-1.7.4-2.2.4-1.8.3-2.2.2-.7v-.1h-.1l-1.8 2.5-2.7 3.7-2.2 2.3-.5.2-.9-.5.1-.8.5-.7 3-3.8 1.8-2.3 1.1-1.4v-.2h-.1L4.2 18l-1.4.2-.6-.6.1-.9.3-.3 2.1-1.4z'],
    openai: ['var(--tx)', 'M22.3 9.8a6 6 0 00-.5-4.9 6 6 0 00-6.5-2.9A6 6 0 004.9 4.2a6 6 0 00-4 2.9 6 6 0 00.7 7 6 6 0 00.5 4.9 6 6 0 006.5 2.9 6 6 0 004.5 2 6 6 0 005.7-4.2 6 6 0 004-2.9 6 6 0 00-.7-7zm-9 12.6a4.5 4.5 0 01-2.9-1l.1-.1 4.8-2.8a.8.8 0 00.4-.7v-6.8l2 1.2v5.6a4.5 4.5 0 01-4.4 4.6zM3.6 18.3a4.5 4.5 0 01-.5-3l.1.1 4.8 2.8a.8.8 0 00.8 0l5.9-3.4v2.3L9.8 20a4.5 4.5 0 01-6.2-1.7zM2.3 7.9A4.5 4.5 0 014.7 6v5.7a.8.8 0 00.4.7l5.9 3.4-2 1.2-4.9-2.8a4.5 4.5 0 01-1.8-6.3zm16.6 3.9L13 8.4l2-1.2 4.9 2.8a4.5 4.5 0 01-.7 8.1v-5.7a.8.8 0 00-.3-.6zm2-3l-.1-.1-4.8-2.8a.8.8 0 00-.8 0L9.3 9.3V7l4.9-2.8a4.5 4.5 0 016.7 4.6zM8.3 12.9l-2-1.2V6.1a4.5 4.5 0 017.4-3.4l-.1.1-4.8 2.8a.8.8 0 00-.4.7zm1.1-2.4L12 9l2.6 1.5v3L12 15l-2.6-1.5z'],
    booking: ['#003580', 'M3 2h18v20H3zM8 6h4a3 3 0 012 5.2A3 3 0 0113 17H8zm2 2v3h2a1.5 1.5 0 000-3zm0 5v2.5h2.5a1.25 1.25 0 000-2.5zM16 15.5a1.3 1.3 0 110 2.6 1.3 1.3 0 010-2.6z']
  };
  function logo(k, x, y, sz) { var l = LOGO[k] || LOGO.doc, f = /^M[^z]*[a-y]/i.test(l[1]) && (k === 'doc' || k === 'pdf' || k === 'link') ? 'fill="none" stroke="' + l[0] + '" stroke-width="1.8"' : 'fill="' + l[0] + '"'; return '<svg x="' + x + '" y="' + y + '" width="' + sz + '" height="' + sz + '" viewBox="0 0 24 24"><path ' + f + ' d="' + l[1] + '"/></svg>' }

  /* ---------- pieces ---------- */
  function pill(x, y, z, txt, sub) {
    var p = P(x, y, z), w = txt.length * 7.6 + 26;
    return '<g class="pill"><line class="ln" x1="' + p[0] + '" y1="' + (p[1] - 4) + '" x2="' + p[0] + '" y2="' + (p[1] - 20) + '" stroke-dasharray="2 3"/>' +
      '<rect x="' + (p[0] - w / 2) + '" y="' + (p[1] - 44) + '" width="' + w + '" height="24" rx="12" fill="var(--tx)"/>' +
      '<text x="' + p[0] + '" y="' + (p[1] - 27.5) + '" text-anchor="middle" font-size="13.5" font-weight="600" fill="var(--sbg)">' + esc(txt) + '</text>' +
      (sub ? '<text x="' + p[0] + '" y="' + (p[1] - 52) + '" text-anchor="middle" font-size="12.5" class="tx2">' + esc(sub) + '</text>' : '') + '</g>'
  }
  function tray(x, y, w, title, key, tiles, cls) {
    var h = tiles.length > 2 ? 150 : 86, s = '<g class="L ' + cls + '"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="10" fill="var(--tray)" stroke="var(--st2)"/>';
    tiles.forEach(function (t, i) {
      var c = i % 2, r = Math.floor(i / 2), tw = (w - 36) / 2, tx = x + 12 + c * (tw + 12), ty = y + 12 + r * 64;
      s += '<g class="L pop" data-k="' + cls + '-' + i + '" style="transition-delay:' + (.15 + i * .12) + 's"><rect x="' + tx + '" y="' + ty + '" width="' + tw + '" height="52" rx="8" fill="var(--tile)" stroke="var(--st2)"/>' + logo(t.logo, tx + 12, ty + 14, 24) +
        '<text x="' + (tx + 46) + '" y="' + (ty + 23) + '" font-size="13" font-weight="600" class="tx">' + esc(T(t.t)) + '</text><text x="' + (tx + 46) + '" y="' + (ty + 40) + '" font-size="11.5" class="tx2">' + esc(T(t.sub)) + '</text></g>'
    });
    return s + '<text data-k="' + cls + '" x="' + (x + w / 2) + '" y="' + (y + h + 30) + '" text-anchor="middle" font-size="13" font-weight="600" letter-spacing=".12em" class="tx">' + esc(title) + '</text></g>'
  }
  function fanE(fx, fy, sp, tg, cls) {
    var s = '<g class="L ' + cls + '">';
    tg.forEach(function (t, i) { var a = [fx + (i - (tg.length - 1) / 2) * sp, fy], b = P(t[0], t[1], -.3), my = (a[1] + b[1]) / 2; s += '<path class="wire" style="--len:500;transition-delay:' + (i * .05) + 's" d="M' + a[0] + ',' + a[1] + ' C' + a[0] + ',' + (my + 20) + ' ' + b[0] + ',' + (my - 10) + ' ' + b[0] + ',' + b[1] + '"/>' });
    return s + '</g>'
  }
  function edge(fn, a, b, n) { var r = [], i; for (i = 0; i < n; i++) r.push(fn(a + (b - a) * i / (n - 1))); return r }

  var LBL = {
    en: { data: 'DATA · WHAT COMES IN', logic: 'LOGIC · HOW IT THINKS', actions: 'ACTIONS · WHAT IT DOES', biz: 'YOUR BUSINESS', you: 'YOU', head: 'How it works', hintT: '↔ Swipe to turn · tap to explain', hint: 'Click anything to see what it is · drag to turn · Shift + drag or two fingers to move · pinch or Ctrl + scroll to zoom', zin: 'Zoom in', zout: 'Zoom out', fit: 'Show everything', close: 'Close', run: 'AUTOMATION' },
    de: { data: 'DATEN · WAS REINKOMMT', logic: 'LOGIK · WIE ES DENKT', actions: 'AKTIONEN · WAS ES TUT', biz: 'DEIN BETRIEB', you: 'DU', head: 'So funktioniert es', hintT: '↔ Wischen zum Drehen · tippen zum Erklären', hint: 'Klick auf alles, um zu sehen, was es ist · ziehen zum Drehen · Umschalt + ziehen oder zwei Finger zum Verschieben · zwei Finger oder Strg + Scrollen zum Zoomen', zin: 'Vergrößern', zout: 'Verkleinern', fit: 'Alles zeigen', close: 'Schließen', run: 'AUTOMATISIERUNG' }
  };

  function build(sec, M) {
    var L = LBL[LANG] || LBL.en, info = {};
    function addInfo(k, label, x) { if (x && (x.info || x.what)) info[k] = [label, T(x.title || x.t || x.name), T(x.info || x.what)] }
    sec.innerHTML = '<div class="wrap om-h"><h2>' + esc(T(M.head) || L.head) + '</h2></div><div class="rail"><div class="st"><div class="oc"><ol>' +
      M.steps.map(function (s, i) { return '<li data-go="' + (i + 1) + '"><span class="k">0' + (i + 1) + '</span><b>' + esc(T(s.t)) + '</b><p>' + esc(T(s.p)) + '</p></li>' }).join('') +
      '</ol></div><div class="os"><svg viewBox="80 120 1440 860" preserveAspectRatio="xMidYMid meet" role="img" aria-label="' + esc(T(M.aria) || L.head) + '"></svg>' +
      '<div class="zc"><button type="button" data-z="in" aria-label="' + L.zin + '">+</button><button type="button" data-z="out" aria-label="' + L.zout + '">−</button><button type="button" data-z="fit" aria-label="' + L.fit + '">⤢</button></div>' +
      '<div class="hint">' + (matchMedia('(pointer:coarse)').matches ? L.hintT : L.hint) + '</div><div class="card" hidden><button type="button" class="x" aria-label="' + L.close + '">×</button><span class="kk"></span><b></b><p></p></div></div></div></div>';
    var svg = sec.querySelector('svg'), O = {};
    M.objects.forEach(function (o) { if (!o.at) o.at = o.parts ? [o.parts[0][1], o.parts[0][2]] : [0, 0]; O[o.k] = o.c || [o.at[0] + (o.cx || .8), o.at[1] + (o.cy || .6)] });
    var order = M.objects.slice().sort(function (a, b) { return (a.at[0] + a.at[1]) - (b.at[0] + b.at[1]) }), delay = {};
    order.forEach(function (o, i) { delay[o.k] = (.05 + i * .13).toFixed(2) });
    function draw() {
    var g = '';
    g += '<g class="L on">' + box(0, 0, -.3, 12, 7.4, .3, ['pl', 'pl2', 'pl3']) + '</g>';
    // the plane label runs along whichever plane edge is nearest the viewer, never upside down
    var ed = [[[0, 7.4], [12, 7.4]], [[12, 7.4], [12, 0]], [[12, 0], [0, 0]], [[0, 0], [0, 7.4]]].map(function (e) {
      var a = P(e[0][0], e[0][1], -.3), b = P(e[1][0], e[1][1], -.3); if (b[0] < a[0]) { var t = a; a = b; b = t }
      return { a: a, ang: Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI, d: depth((e[0][0] + e[1][0]) / 2, (e[0][1] + e[1][1]) / 2) }
    }).sort(function (p, q) { return ((q.ang > 0) - (p.ang > 0)) || (q.d - p.d) })[0];
    var ang = ed.ang, lx = ed.a[0] + 10, ly = ed.a[1] + 20;
    g += '<text data-k="plane" x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" font-size="11" letter-spacing=".14em" class="tx2" transform="rotate(' + ang.toFixed(1) + ' ' + lx.toFixed(1) + ' ' + ly.toFixed(1) + ')">' + esc(T(M.planeLabel) || L.biz) + '</text>';
    if (M.plane) info.plane = [L.biz, T(M.plane.title), T(M.plane.info)];
    function gp(k) { var p = P(O[k][0], O[k][1], 0); return p[0].toFixed(1) + ',' + p[1].toFixed(1) }
    g += '<g class="L s1">' + (M.links || []).map(function (l) { return seg([O[l[0]][0], O[l[0]][1], 0], [O[l[1]][0], O[l[1]][1], 0], 'stroke-dasharray="4 5" data-a="' + l[0] + '" data-b="' + l[1] + '"') }).join('') + '</g>';
    g += '<path class="hotpath" d="' + (M.hot || []).map(function (l) { return 'M' + gp(l[0]) + ' L' + gp(l[1]) }).join(' ') + '"/>';
    M.objects.slice().sort(function (a, b) { return depth(O[a.k][0], O[a.k][1]) - depth(O[b.k][0], O[b.k][1]) }).forEach(function (o) {
      var parts = o.parts || [[o.kind, o.at[0], o.at[1], o.opt || {}]], body = parts.map(function (p) { return (K[p[0]] || K.block)(p[1], p[2], p[3] || {}) }).join('');
      var pz = o.pz != null ? o.pz : 1.2, pc = O[o.k];
      g += '<g class="L drop s1 obj' + (o.lit ? ' lit' : '') + '" data-k="' + o.k + '" style="transition-delay:' + delay[o.k] + 's">' + body + pill(pc[0], pc[1], pz, T(o.name), T(o.sub)) + '</g>';
      addInfo(o.k, L.biz, { title: o.title || o.name, info: o.info })
    });
    var TR = [['data', 160, M.data, 's2', edge(function (v) { return [v, 7.4] }, 2.2, 5.2, 6), 360], ['logic', 600, M.logic, 's3', edge(function (v) { return [v, 7.4] }, 9.2, 11.8, 6), 800], ['actions', 1040, M.actions, 's4', edge(function (v) { return [12, v] }, 3.2, 6.4, 6), 1240]];
    TR.forEach(function (t) {
      g += fanE(t[5], 800, 9, t[4], t[3]);
      g += tray(t[1], 800, 400, L[t[0]], t[0], t[2], t[3]);
      info[t[3]] = [L[t[0]], T((M.trayInfo || {})[t[0]] && M.trayInfo[t[0]].title) || L[t[0]].split(' · ')[1], T((M.trayInfo || {})[t[0]] && M.trayInfo[t[0]].info)];
      t[2].forEach(function (x, i) { addInfo(t[3] + '-' + i, L[t[0]], x) })
    });
    // automation run (top left)
    (function () {
      var R = M.run, x = 140, y = 40, w = 470, h = 70 + R.rows.length * 27, s = '<g class="L s5" data-k="run"><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="12" fill="var(--tile)" stroke="var(--st2)"/>' +
        '<text x="' + (x + 18) + '" y="' + (y + 28) + '" font-size="12" letter-spacing=".12em" font-weight="600" class="tx">' + L.run + ' · ' + esc(T(R.title).toUpperCase()) + '</text><text x="' + (x + w - 18) + '" y="' + (y + 28) + '" text-anchor="end" font-size="20" font-weight="700" class="tx">' + esc(R.total) + '</text>';
      R.rows.forEach(function (r, i) {
        var yy = y + 52 + i * 27; s += '<g class="chk" style="transition-delay:' + (i * .35) + 's"><circle cx="' + (x + 28) + '" cy="' + (yy + 4) + '" r="8" fill="var(--ok)"/><path d="M' + (x + 24) + ',' + (yy + 4) + ' l3,3 l6,-6" stroke="#fff" stroke-width="2" fill="none"/>' +
          '<text x="' + (x + 46) + '" y="' + (yy + 8.5) + '" font-size="13.5" class="tx">' + esc(T(r[0])) + '</text><text x="' + (x + w - 18) + '" y="' + (yy + 8.5) + '" text-anchor="end" font-size="12" class="tx2">' + esc(r[1]) + '</text></g>'
      });
      var a = P(O[R.to || M.objects[0].k][0], O[R.to || M.objects[0].k][1], 1.6);
      s += '<path class="wire" style="--len:700" d="M' + (x + w / 2) + ',' + (y + h) + ' C' + (x + w / 2) + ',' + (y + h + 60) + ' ' + a[0] + ',' + (a[1] - 90) + ' ' + a[0] + ',' + (a[1] - 40) + '"/>';
      g += s + '</g>'; info.run = [L.run, T(R.title), T(R.info)]
    })();
    // the owner's phone (top right)
    (function () {
      var F = M.phone, x = 1180, y = 60, s = '<g class="L s6" data-k="you"><rect x="' + x + '" y="' + y + '" width="190" height="370" rx="32" fill="#111" stroke="#333"/><rect x="' + (x + 8) + '" y="' + (y + 8) + '" width="174" height="354" rx="26" fill="#25314a"/>' +
        '<rect x="' + (x + 67) + '" y="' + (y + 16) + '" width="56" height="16" rx="8" fill="#000"/><text x="' + (x + 95) + '" y="' + (y + 82) + '" text-anchor="middle" font-size="40" font-weight="600" fill="#fff">' + esc(F.time || '09:42') + '</text>' +
        '<text x="' + (x + 95) + '" y="' + (y + 102) + '" text-anchor="middle" font-size="11" fill="#cfd6e4">' + esc(T(F.date)) + '</text>', yy = y + 124;
      F.notes.forEach(function (n) {
        var lines = T(n.p).split('\n'), hh = 52 + lines.length * 15;
        s += '<rect x="' + (x + 16) + '" y="' + yy + '" width="158" height="' + hh + '" rx="14" fill="rgba(245,245,247,.95)"/>' + logo(n.logo, x + 26, yy + 9, 14) +
          '<text x="' + (x + 46) + '" y="' + (yy + 20) + '" font-size="10.5" fill="#5f6368">' + esc(T(n.app)) + '</text><text x="' + (x + 26) + '" y="' + (yy + 39) + '" font-size="12.5" font-weight="700" fill="#1f1f1f">' + esc(T(n.t)) + '</text>' +
          lines.map(function (l, i) { return '<text x="' + (x + 26) + '" y="' + (yy + 56 + i * 15) + '" font-size="11" fill="#3c4043">' + esc(l) + '</text>' }).join('');
        yy += hh + 10
      });
      s += '<text x="' + (x + 95) + '" y="' + (y + 398) + '" text-anchor="middle" font-size="13" font-weight="600" letter-spacing=".12em" class="tx">' + L.you + '</text>';
      var a = P(O[F.to || M.objects[0].k][0], O[F.to || M.objects[0].k][1], 2.9);
      s += '<path class="wire" style="--len:500" d="M' + (x + 95) + ',' + (y + 410) + ' C' + (x + 95) + ',' + (y + 470) + ' ' + a[0] + ',' + (a[1] - 60) + ' ' + a[0] + ',' + (a[1] - 12) + '"/>';
      g += s + '</g>'; info.you = [L.you, T(F.title), T(F.info)]
    })();
    svg.innerHTML = g;
    return info
    }
    var PZ = {}; M.objects.forEach(function (o) { PZ[o.k] = o.pz != null ? o.pz : 1.2 });
    return { svg: svg, info: draw(), draw: draw, M: M, O: O, PZ: PZ }
  }

  function wire(sec, built) {
    var svg = built.svg, INFO = built.info, rail = sec.querySelector('.rail'), lis = [].slice.call(sec.querySelectorAll('.oc li')), N = 6, last = -1, os = sec.querySelector('.os'), card = os.querySelector('.card');
    var CAM = { 1: [150, 60, 1300, 760], 2: [100, 110, 1420, 900], 3: [100, 110, 1420, 900], 4: [100, 110, 1420, 900], 5: [60, 10, 1500, 990], 6: [60, 10, 1500, 990] };
    var CAMM = { 1: [360, 140, 900, 700], 2: [140, 560, 460, 420], 3: [580, 560, 460, 420], 4: [1020, 560, 460, 420], 5: [100, 20, 560, 560], 6: [1100, 40, 350, 480] };
    var vb = [150, 60, 1300, 760], anim = 0;
    function cam(q) { return (svg.clientWidth < 560 ? CAMM : CAM)[q] }
    function goCam(t) { var from = vb.slice(), t0 = performance.now(); cancelAnimationFrame(anim); (function f(now) { var k = Math.min(1, (now - t0) / 1000), e = 1 - Math.pow(1 - k, 3); vb = from.map(function (v, i) { return v + (t[i] - v) * e }); svg.setAttribute('viewBox', vb.join(' ')); if (k < 1) anim = requestAnimationFrame(f) })(t0) }
    function setVB(v) { cancelAnimationFrame(anim); vb = v; svg.setAttribute('viewBox', vb.map(function (n) { return n.toFixed(1) }).join(' ')) }
    var selKey = null, M = built.M;
    function unmark() { ['sel', 'rel', 'rl'].forEach(function (c) { [].forEach.call(svg.querySelectorAll('.' + c), function (x) { x.classList.remove(c) }) }) }
    function closeCard() { card.hidden = true; selKey = null; svg.classList.remove('focus'); unmark() }
    function applyOn(q) { for (var i = 1; i <= 6; i++)[].forEach.call(svg.querySelectorAll('.s' + i + ', .s' + i + ' .L'), function (el) { el.classList.toggle('on', i <= q) }) }
    function set(s) {
      sec.setAttribute('data-s', s); var q = Math.max(s, 1); closeCard();
      applyOn(q);
      lis.forEach(function (l, i) { l.classList.toggle('cur', i === q - 1); l.classList.toggle('past', i < q - 1) });
      goCam(cam(q));
      if (q >= 5) startPlay(); else stopPlay()
    }
    /* what belongs to a thing: its lines and what they lead to. Used to light them up and to frame the zoom. */
    function related(key) {
      var els = [], lines = [], m = /^(s[234])(-\d+)?$/.exec(key);
      function byK(k) { var e = svg.querySelector('[data-k="' + k + '"]'); if (e && isBuilt(e)) els.push(e) }
      if (m) { [].forEach.call(svg.querySelectorAll(':scope > g.' + m[1]), function (gr) { [].forEach.call(gr.querySelectorAll(':scope > .wire'), function (w) { lines.push(w) }) }) }
      else if (key === 'run' || key === 'you') { var to = key === 'run' ? (M.run.to || M.objects[0].k) : (M.phone.to || M.objects[0].k); byK(to); var gr = svg.querySelector('[data-k="' + key + '"]'); if (gr) [].forEach.call(gr.querySelectorAll('.wire'), function (w) { lines.push(w) }) }
      else if (key !== 'plane') { [].forEach.call(svg.querySelectorAll('line[data-a="' + key + '"], line[data-b="' + key + '"]'), function (l) { if (isBuilt(l)) { lines.push(l); byK(l.getAttribute('data-a') === key ? l.getAttribute('data-b') : l.getAttribute('data-a')) } }) }
      return { els: els, lines: lines }
    }
    function mark(key) {
      unmark(); var el = svg.querySelector('[data-k="' + key + '"]'); if (!el) return null; el.classList.add('sel'); svg.classList.add('focus');
      var r = related(key); r.els.forEach(function (e) { e.classList.add('rel') }); r.lines.forEach(function (l) { l.classList.add('rl') });
      return { el: el, r: r }
    }
    /* turning: redraw the whole picture for the new angle, keep what is built and selected, no build-up animation while turning */
    var rq = 0;
    function redraw() { if (rq) return; rq = requestAnimationFrame(function () { rq = 0; svg.classList.add('nt'); built.draw(); applyOn(Math.max(last, 1)); if (selKey) mark(selKey); PL.jump = true; paint(); void svg.getBoundingClientRect(); requestAnimationFrame(function () { svg.classList.remove('nt') }) }) }
    function turn(yaw, el) { setCam(yaw, Math.max(.3, Math.min(.78, el))); redraw() }
    /* the run plays itself (steps 5-6): a dot travels from thing to thing, each place lights up with when and what happened, and its row ticks off */
    var RM = matchMedia('(prefers-reduced-motion: reduce)').matches, PL = { i: -1, t: 0, on: false, jump: true }, rows = M.run.rows;
    function anchor(i) {
      var k = rows[i] && rows[i][2]; if (!k) return null;
      if (k === 'you') return { k: k, x: 1275, y: 245, cx: 1160, cy: 250, al: 'end' };
      var o = built.O[k]; if (!o) return null; var p = P(o[0], o[1], .45), q = P(o[0], o[1], built.PZ[k]);
      return { k: k, x: p[0], y: p[1], cx: q[0], cy: q[1] - 86, al: 'middle' }
    }
    function paint() {
      var i = PL.i, run = svg.querySelector('[data-k="run"]'); if (!run) return;
      svg.classList.toggle('playing', PL.on);
      [].forEach.call(run.querySelectorAll('.chk'), function (c, j) { c.classList.toggle('dn', PL.on && j <= i); c.classList.toggle('now', PL.on && j === i) });
      [].forEach.call(svg.querySelectorAll('.act'), function (x) { x.classList.remove('act') });
      var ov = svg.querySelector('g.ov');
      if (!ov) { ov = document.createElementNS('http://www.w3.org/2000/svg', 'g'); ov.setAttribute('class', 'ov jump'); ov.innerHTML = '<circle class="ring" r="9"/><circle class="dot" r="8"/><g class="obub"><rect rx="8" height="34"/><text font-size="16" font-weight="600"></text></g>'; svg.appendChild(ov); PL.jump = true }
      var a = PL.on && i >= 0 ? anchor(i) : null; ov.style.display = a ? '' : 'none';
      // the phone comes up when the run reaches you, even before step 6
      if (last < 6) [].forEach.call(svg.querySelectorAll('g.s6, g.s6 .L'), function (e) { e.classList.toggle('on', !!(a && a.k === 'you')) }); if (!a) { PL.jump = true; return }
      if (PL.jump) ov.classList.add('jump');
      var el = svg.querySelector('[data-k="' + a.k + '"]'); if (el) el.classList.add('act');
      var dot = ov.querySelector('.dot'), ring = ov.querySelector('.ring'), tr = 'translate(' + a.x.toFixed(1) + 'px,' + a.y.toFixed(1) + 'px)';
      dot.style.transform = tr; ring.style.transform = tr; ring.classList.remove('pulse'); void ring.getBoundingClientRect(); ring.classList.add('pulse');
      var cap = ov.querySelector('.obub'), tx = cap.querySelector('text'), rc = cap.querySelector('rect');
      tx.textContent = rows[i][1] + '  ·  ' + T(rows[i][0]);
      var w = tx.getComputedTextLength() + 30, x0 = a.al === 'end' ? a.cx - w : a.cx - w / 2;
      rc.setAttribute('x', x0.toFixed(1)); rc.setAttribute('y', (a.cy - 23).toFixed(1)); rc.setAttribute('width', w.toFixed(1)); tx.setAttribute('x', (x0 + 15).toFixed(1)); tx.setAttribute('y', a.cy.toFixed(1));
      cap.classList.remove('bin'); void cap.getBoundingClientRect(); cap.classList.add('bin');
      if (PL.jump) { PL.jump = false; requestAnimationFrame(function () { requestAnimationFrame(function () { ov.classList.remove('jump') }) }) }
    }
    function next() {
      clearTimeout(PL.t); if (!PL.on) return; PL.i++;
      if (PL.i >= rows.length) { PL.i = rows.length - 1; PL.t = setTimeout(function () { PL.i = -1; paint(); PL.t = setTimeout(next, 700) }, 2400); return }
      paint(); PL.t = setTimeout(next, 1900)
    }
    function startPlay() { if (PL.on || RM || !rows.some(function (r) { return r[2] })) return; PL.on = true; PL.i = -1; PL.t = setTimeout(next, 500) }
    function stopPlay() { if (!PL.on && PL.i < 0) return; PL.on = false; clearTimeout(PL.t); PL.i = -1; paint() }
    function tick() { var r = rail.getBoundingClientRect(), span = rail.offsetHeight - innerHeight, p = -r.top / span, s = p < 0 ? 0 : Math.min(N, Math.floor(p * N) + 1); if (s !== last) { last = s; set(s) }
      var vis = r.bottom > 0 && r.top < innerHeight; if (!vis) stopPlay(); else if (last >= 5 && !selKey) startPlay() }
    var raf = 0; addEventListener('scroll', function () { if (!raf) raf = requestAnimationFrame(function () { raf = 0; tick() }) }, { passive: true });
    addEventListener('resize', function () { last = -1; tick() });
    lis.forEach(function (l) { l.addEventListener('click', function () { var k = +l.dataset.go, span = rail.offsetHeight - innerHeight; scrollTo({ top: scrollY + rail.getBoundingClientRect().top + span * (k - .5) / N, behavior: 'smooth' }) }) });
    function isBuilt(el) { var l = el.closest('.L'); while (l) { if (!l.classList.contains('on')) return false; l = l.parentElement && l.parentElement.closest('.L') } return true }
    function openK(key, el) {
      var t = INFO[key]; if (!t || !t[2]) return; card.querySelector('.kk').textContent = t[0]; card.querySelector('b').textContent = t[1]; card.querySelector('p').textContent = t[2]; card.hidden = false;
      stopPlay(); selKey = key; var mk = mark(key), boxes = [el.getBBox()];
      // frame the thing together with its lines and what they lead to, and never zoom closer than ~640 units, so the thing is seen in its place
      mk.r.els.concat(mk.r.lines).forEach(function (e) { try { boxes.push(e.getBBox()) } catch (_) { } });
      var x0 = Math.min.apply(0, boxes.map(function (b) { return b.x })), y0 = Math.min.apply(0, boxes.map(function (b) { return b.y })),
        x1 = Math.max.apply(0, boxes.map(function (b) { return b.x + b.width })), y1 = Math.max.apply(0, boxes.map(function (b) { return b.y + b.height })),
        bb = { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
      var W = svg.clientWidth, H = svg.clientHeight, mob = W < 560, pad = 36, aw = mob ? W : W * .58, ah = mob ? H * .55 : H,
        sc = Math.min(aw / (bb.width + pad * 2), ah / (bb.height + pad * 2), W / (mob ? 520 : 640)), vw = W / sc, vh = H / sc, cx = bb.x + bb.width / 2, cy = bb.y + bb.height / 2,
        ox = mob ? 0 : (W * .5 - aw / 2) / sc, oy = mob ? (H * .5 - ah / 2) / sc : 0;
      goCam([cx - vw / 2 + ox, cy - vh / 2 + oy, vw, vh])
    }
    card.querySelector('.x').addEventListener('click', function () { closeCard(); goCam(cam(Math.max(last, 1))); if (last >= 5) startPlay() });
    addEventListener('keydown', function (e) { if (e.key === 'Escape' && !card.hidden) card.querySelector('.x').click() });
    var ptrs = {}, start = null, moved = 0;
    function list() { return Object.keys(ptrs).map(function (i) { return ptrs[i] }) }
    function pd() { var a = list(); return a.length > 1 ? Math.hypot(a[0][0] - a[1][0], a[0][1] - a[1][1]) : 0 }
    function mid() { var a = list(); return a.length > 1 ? [(a[0][0] + a[1][0]) / 2, (a[0][1] + a[1][1]) / 2] : a[0] }
    function zoomAt(pt, f, base, animate) {
      base = base || vb; var r = svg.getBoundingClientRect(), W = r.width, H = r.height, kk = Math.max(base[2] / W, base[3] / H),
        ux = base[0] + (base[2] - W * kk) / 2 + (pt[0] - r.left) * kk, uy = base[1] + (base[3] - H * kk) / 2 + (pt[1] - r.top) * kk, nw = Math.min(2400, Math.max(160, base[2] * f)), g = nw / base[2],
        v = [ux - (ux - base[0]) * g, uy - (uy - base[1]) * g, nw, base[3] * g]; animate ? goCam(v) : setVB(v)
    }
    // one finger / plain mouse drag = turn (left-right spins, up-down tilts); Shift, right or middle mouse drag = move; two fingers = move + pinch zoom
    var panMode = false, tol = 5;  // a finger wobbles a few px during a tap: 16 px still counts as a tap on touch
    function mkStart() { var m = mid(); start = { vb: vb.slice(), x: m[0], y: m[1], d: pd(), yaw: YAW, el: EL } }
    svg.addEventListener('contextmenu', function (e) { e.preventDefault() });
    svg.addEventListener('pointerdown', function (e) { ptrs[e.pointerId] = [e.clientX, e.clientY]; try { svg.setPointerCapture(e.pointerId) } catch (_) { } if (list().length === 1) { moved = 0; panMode = e.shiftKey || e.button === 1 || e.button === 2; tol = e.pointerType === 'mouse' ? 5 : 16 } mkStart(); svg.classList.add('drag') });
    svg.addEventListener('pointermove', function (e) {
      if (!ptrs[e.pointerId]) return; ptrs[e.pointerId] = [e.clientX, e.clientY]; var n = list().length, kk = Math.max(start.vb[2] / svg.clientWidth, start.vb[3] / svg.clientHeight), m = mid(), dx = m[0] - start.x, dy = m[1] - start.y;
      if (n === 1) {
        moved = Math.max(moved, Math.abs(dx) + Math.abs(dy)); if (moved <= tol) return;
        if (panMode) setVB([start.vb[0] - dx * kk, start.vb[1] - dy * kk, start.vb[2], start.vb[3]]);
        else { cancelAnimationFrame(anim); turn(start.yaw + dx * .009, e.pointerType === 'touch' ? start.el : start.el + dy * .004) }  // touch: sideways turns, up/down stays page scroll
      }
      else if (start.d) { moved = 99; zoomAt(m, start.d / pd(), [start.vb[0] - dx * kk, start.vb[1] - dy * kk, start.vb[2], start.vb[3]]) }
    });
    function up(e) { delete ptrs[e.pointerId]; if (!list().length) svg.classList.remove('drag'); else mkStart() }
    svg.addEventListener('pointerup', function (e) {
      var click = moved <= tol && list().length === 1; up(e); if (!click) return;
      var el = document.elementFromPoint(e.clientX, e.clientY); el = el && el.closest && el.closest('[data-k]');
      tapT = Date.now();
      if (el && svg.contains(el) && isBuilt(el) && INFO[el.getAttribute('data-k')]) openK(el.getAttribute('data-k'), el); else if (!card.hidden) closeCard()
    });
    // backup for iPhone Safari: if the touch was dropped (pointercancel), the normal click event still opens the thing
    var tapT = 0;
    svg.addEventListener('click', function (e) {
      if (Date.now() - tapT < 500) return; var el = e.target.closest && e.target.closest('[data-k]');
      if (el && svg.contains(el) && isBuilt(el) && INFO[el.getAttribute('data-k')]) openK(el.getAttribute('data-k'), el)
    });
    svg.addEventListener('pointercancel', up);
    svg.addEventListener('wheel', function (e) { if (!e.ctrlKey) return; e.preventDefault(); zoomAt([e.clientX, e.clientY], Math.exp(e.deltaY * .01)) }, { passive: false });
    os.querySelector('.zc').addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return; var r = svg.getBoundingClientRect(), c = [r.left + r.width / 2, r.top + r.height / 2];
      if (b.dataset.z === 'in') zoomAt(c, .7, null, 1); else if (b.dataset.z === 'out') zoomAt(c, 1 / .7, null, 1); else { closeCard(); setCam(0, EL0); redraw(); goCam([40, 0, 1560, 1000]) }
    });
    tick()
  }

  [].forEach.call(document.querySelectorAll('section.om[data-model]'), function (sec) {
    var M = (window.MODELS || {})[sec.getAttribute('data-model')]; if (!M) return;
    wire(sec, build(sec, M))
  });
})();
