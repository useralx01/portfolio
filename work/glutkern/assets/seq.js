// The film: one camera flight, rendered to frames and scrubbed by scroll.
// Frames load coarse-to-fine (every 16th first, then 8th, 4th, 2nd, all), so scrolling works at once and
// sharpens as the rest arrives. The shown frame eases toward the scroll position, so motion stays smooth.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const small = () => innerWidth < 760;
  const BG = "238,227,214";

  function film(el) {
    // Frames arrive as small compressed files (coarse-to-fine). Only the frames around the current scroll
    // position are unpacked into bitmaps, off the main thread; far ones are dropped again. This keeps memory
    // small on phones and never makes the browser unpack a picture in the middle of a scroll frame.
    const canvas = el.querySelector("canvas.seq"), g = canvas.getContext("2d", { alpha: false });
    const n = +el.dataset.n, base = el.dataset.seq + "/" + (small() ? "m" : "d") + "/";
    const blob = new Array(n), bmp = new Array(n), busy = new Uint8Array(n);
    const KEEP = small() ? 14 : 24, AHEAD = small() ? 8 : 12;
    let cur = 0, want = 0, shown = -1, W = 0, H = 0, raf = 0, last = 0, decoding = 0;

    const fetchOne = i => blob[i] ? Promise.resolve() :
      fetch(base + String(i).padStart(3, "0") + ".webp").then(r => r.ok ? r.blob() : null)
        .then(b => { if (b) { blob[i] = b; pump(); } }).catch(() => {});
    async function loadAll() {
      const order = [];
      for (const step of [16, 8, 4, 2, 1]) for (let i = 0; i < n; i += step) if (!order.includes(i)) order.push(i);
      let k = 0;
      const worker = async () => { while (k < order.length) await fetchOne(order[k++]); };
      await Promise.all([worker(), worker(), worker(), worker()]);
    }
    // unpack the nearest frames first, at most two at a time
    function pump() {
      const c = Math.round(cur), dir = want >= cur ? 1 : -1;
      for (let i = 0; i < n; i++) if (bmp[i] && Math.abs(i - c) > KEEP) { bmp[i].close && bmp[i].close(); bmp[i] = null; }
      while (decoding < 2) {
        let pick = -1;
        for (let d = 0; d <= AHEAD && pick < 0; d++)
          for (const i of [c + d * dir, c - d * dir]) if (i >= 0 && i < n && blob[i] && !bmp[i] && !busy[i]) { pick = i; break; }
        if (pick < 0) {   // nothing close is ready: unpack the nearest coarse frame we have, so there is always a picture
          for (let d = AHEAD + 1; d < n && pick < 0; d++)
            for (const i of [c - d, c + d]) if (i >= 0 && i < n && blob[i] && !bmp[i] && !busy[i] && Math.abs(i - c) <= KEEP * 3) { pick = i; break; }
        }
        if (pick < 0) return;
        busy[pick] = 1; decoding++;
        const i = pick;
        createImageBitmap(blob[i]).then(b => {
          if (Math.abs(i - Math.round(cur)) > KEEP * 3) b.close && b.close(); else { bmp[i] = b; kick(); }
        }).catch(() => {}).finally(() => { busy[i] = 0; decoding--; pump(); });
      }
    }
    const nearest = i => { for (let d = 0; d < n; d++) { if (bmp[i - d]) return i - d; if (bmp[i + d]) return i + d; } return -1; };

    function size() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      if (canvas.clientWidth === W && Math.abs(canvas.clientHeight - H) < 2 && canvas.width) return;
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.imageSmoothingQuality = "high";
      shown = -1; kick();
    }
    function draw(i) {
      const im = bmp[i]; if (!im) return;
      const iw = im.width, ih = im.height;
      g.fillStyle = `rgb(${BG})`; g.fillRect(0, 0, W, H);
      if (W / H >= iw / ih * .8) {                  // wide screen: fill it
        const s = Math.max(W / iw, H / ih);
        g.drawImage(im, (W - iw * s) / 2, (H - ih * s) / 2, iw * s, ih * s);
        return;
      }
      // tall screen: a wide band through the middle, its edges melting into the page
      const s = W * 1.035 / iw, w = iw * s, h = ih * s, x = (W - w) / 2, y = H * .42 - h / 2, f = h * .16;
      g.drawImage(im, x, y, w, h);
      let gr = g.createLinearGradient(0, y, 0, y + f); gr.addColorStop(0, `rgba(${BG},1)`); gr.addColorStop(1, `rgba(${BG},0)`);
      g.fillStyle = gr; g.fillRect(0, 0, W, y + f + 1);
      gr = g.createLinearGradient(0, y + h - f, 0, y + h); gr.addColorStop(0, `rgba(${BG},0)`); gr.addColorStop(1, `rgba(${BG},1)`);
      g.fillStyle = gr; g.fillRect(0, y + h - f, W, H - (y + h - f));
    }
    const progress = () => { const r = el.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1); };
    function tick(now) {
      const dt = Math.min(.05, last ? (now - last) / 1000 : 1 / 60); last = now;
      const p = progress(); want = p * (n - 1);
      el.style.setProperty("--end", clamp((p - .94) / .06, 0, 1).toFixed(3));
      cur = reduce ? want : cur + (want - cur) * (1 - Math.exp(-dt * 10));
      if (Math.abs(want - cur) < .05) cur = want;
      pump();
      const i = nearest(Math.round(cur));
      if (i >= 0 && i !== shown) { draw(i); shown = i; }
      // keep going until the wanted frame itself is on screen (it may still be unpacking)
      raf = cur !== want || (shown !== Math.round(cur) && blob[Math.round(cur)]) ? requestAnimationFrame(tick) : 0;
      if (!raf) last = 0;
    }
    function kick() { if (!raf) raf = requestAnimationFrame(tick); }
    const startAt = Math.round(progress() * (n - 1));
    cur = want = startAt;
    fetchOne(startAt).then(() => fetchOne(0)).then(() => { kick(); loadAll(); });
    addEventListener("scroll", kick, { passive: true });
    addEventListener("resize", size);
    size();
  }
  document.querySelectorAll(".film[data-seq]").forEach(film);

  // ---------- one bean, six states ----------
  // Real studio shots of the same bean on the same cream backdrop. Scroll moves between them: the outgoing
  // shot rises and lifts away, the next one settles in. A slow float keeps the object alive while you read.
  const st = document.querySelector(".stages");
  if (st) {
    const canvas = st.querySelector(".obj"), g = canvas.getContext("2d");
    const touch = !matchMedia("(hover: hover) and (pointer: fine)").matches;
    const words = [...st.querySelectorAll(".st-words span")], texts = [...st.querySelectorAll(".st-text li")];
    const no = st.querySelector(".st-no");
    const N = 6, ims = [];
    let W = 0, cur = 0, k = -1, raf = 0, last = 0, t0 = performance.now(), visible = false;
    for (let i = 0; i < N; i++) { const im = new Image(); im.decoding = "async"; im.src = `media/obj/o${i + 1}.webp`; im.onload = () => kickS(); ims.push(im); }
    const ease = u => u * u * (3 - 2 * u);
    function sizeS() { const dpr = Math.min(devicePixelRatio || 1, 2); if (canvas.clientWidth === W && canvas.width) return; W = canvas.clientWidth; canvas.width = canvas.height = Math.round(W * dpr); g.setTransform(dpr, 0, 0, dpr, 0, 0); kickS(); }
    const prog = () => { const r = st.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1); };
    function put(im, a, sc, dy) {
      if (!im.complete || !im.naturalWidth || a <= 0) return;
      g.globalAlpha = a;
      const s = W * sc;
      g.drawImage(im, (W - s) / 2, (W - s) / 2 + dy, s, s);
    }
    function frame(now) {
      const dt = Math.min(.05, last ? (now - last) / 1000 : 1 / 60); last = now;
      // when the scroll rests between two states, finish the change instead of freezing half-way
      const raw = prog() * (N - 1), want = now - lastScroll > 260 ? Math.round(raw) : raw;
      cur = reduce ? want : cur + (want - cur) * (1 - Math.exp(-dt * 7));
      const a = Math.floor(cur), f = cur - a;
      // hold each state, cross over in the middle 40% of the way
      const u = clamp((f - .3) / .4, 0, 1);
      const bob = reduce || touch ? 0 : Math.sin((now - t0) / 1400) * W * .008;
      g.globalAlpha = 1; g.fillStyle = "#fff"; g.fillRect(0, 0, W, W);   // white = invisible under multiply
      const out = ease(clamp(u / .55, 0, 1)), inn = ease(clamp((u - .45) / .55, 0, 1));
      put(ims[a], 1 - out, 1 + out * .05, bob - out * W * .04);
      if (a + 1 < N) put(ims[a + 1], inn, .95 + inn * .05, bob + (1 - inn) * W * .04);
      g.globalAlpha = 1;
      const nk = clamp(Math.round(cur), 0, N - 1);
      if (nk !== k) { k = nk; words.forEach((w, i) => w.classList.toggle("on", i === k)); texts.forEach((t, i) => t.classList.toggle("on", i === k)); no.textContent = "0" + (k + 1); }
      raf = (visible && !reduce && !touch) || Math.abs(want - cur) > .002 || now - lastScroll < 400 ? requestAnimationFrame(frame) : 0;
      if (!raf) last = 0;
    }
    function kickS() { if (!raf) raf = requestAnimationFrame(frame); }
    new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) kickS(); }).observe(st);
    let lastScroll = 0;
    addEventListener("scroll", () => { lastScroll = performance.now(); kickS(); }, { passive: true });
    addEventListener("resize", sizeS);
    sizeS();
  }
})();
