/* Wayline for Mac: nav follows the scroll, the pass rises in when you reach it */
(function () {
  'use strict';
  var sc = document.getElementById('scroller');
  var links = document.querySelectorAll('.topnav a');
  var ids = ['trip', 'pass', 'days'];
  var passIn = false;

  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    var t = document.getElementById(a.getAttribute('href').slice(1));
    if (t) sc.scrollTo({ top: t.offsetTop - (t.id === 'trip' ? 0 : 64), behavior: 'smooth' });
  });

  function onScroll() {
    var y = sc.scrollTop + 300, cur = 'trip';
    ids.forEach(function (id) { var el = document.getElementById(id); if (el && el.offsetTop <= y) cur = id; });
    links.forEach(function (l) { l.classList.toggle('on', l.getAttribute('href') === '#' + cur); });
    if (!passIn && cur !== 'trip') { passIn = true; window.dispatchEvent(new CustomEvent('wayline:tab', { detail: 'pass' })); }
  }
  sc.addEventListener('scroll', onScroll, { passive: true });

  // the stage can ask this page to scroll a bit (wheel over a not-yet-focused device)
  window.addEventListener('message', function (e) {
    if (e.data && e.data.wayline === 'scrollBy') sc.scrollBy({ top: e.data.dy, behavior: 'auto' });
  });
})();
