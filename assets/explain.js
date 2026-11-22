/* "How it works" explainer: scroll position -> step. No libraries. Without this script (or with reduced motion) the CSS shows every step at once. */
(function () {
  var ex = document.querySelector('.ex'); if (!ex) return;
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  ex.classList.add('on');
  var N = +ex.getAttribute('data-n'), lys = [].slice.call(ex.querySelectorAll('.ly')), lis = [].slice.call(ex.querySelectorAll('.exl li')),
    tks = [].slice.call(ex.querySelectorAll('.tk')), cur = ex.querySelector('.exi .cur'), last = -1, raf = 0;
  function pos() { var r = ex.getBoundingClientRect(), D = ex.offsetHeight - innerHeight, per = D / N; return { r: r, per: per, off: innerHeight * .12 } }
  function step() {
    raf = 0; var p = pos(), v = -p.r.top + p.off, s = v < 0 ? 0 : Math.min(N, Math.floor(v / p.per) + 1);
    if (s === last) return; last = s;
    lys.forEach(function (l) { var k = +l.getAttribute('data-s'); l.classList.toggle('on', k <= s); l.classList.toggle('cur', k === s) });
    var c = Math.max(1, s) - 1;
    lis.forEach(function (l, i) { l.classList.toggle('cur', i === c) });
    tks.forEach(function (t, i) { t.classList.toggle('done', i < s - 1); t.classList.toggle('cur', i === s - 1) });
    if (cur) cur.textContent = (c + 1 < 10 ? '0' : '') + (c + 1);
    ex.setAttribute('data-step', s);
  }
  function req() { if (!raf) raf = requestAnimationFrame(step) }
  addEventListener('scroll', req, { passive: true }); addEventListener('resize', function () { last = -1; req() });
  tks.forEach(function (t) {
    t.addEventListener('click', function () {
      var k = +t.getAttribute('data-go'), p = pos(), y = scrollY + p.r.top + (k - 1) * p.per - p.off + p.per * .5;
      scrollTo({ top: y, behavior: 'smooth' });
    });
  });
  step();
})();
