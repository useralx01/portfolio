// v21: client website tiles play their film only while on screen (loaded on first view).
(() => {
  const vids = [...document.querySelectorAll('.site-v video')];
  if (!vids.length) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) {
      if (!v.src) { v.src = v.dataset.src; v.load(); }
      if (!reduce) v.play().catch(() => {});
    } else v.pause();
  }), { rootMargin: '200px 0px', threshold: .01 });
  vids.forEach(v => io.observe(v));
})();
