(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const small = () => innerWidth < 760;
  const progressOf = el => { const r = el.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1); };

  // ---------- the walk: one real filmed camera move (up the path, through the door, into the room), played by scroll ----------
  // Only frames near the scroll spot are unpacked. Between two frames the next one is laid over by the fraction, so it stays smooth.
  const walk = document.querySelector(".walk");
  const sayA = walk.querySelector(".say-a"), sayB = walk.querySelector(".say-b"), sayC = walk.querySelector(".say-c"), cue = walk.querySelector(".cue");
  (function film(el) {
    const canvas = el.querySelector("canvas.seq"), g = canvas.getContext("2d", { alpha: false });
    const n = +el.dataset.n, base = el.dataset.seq + "/" + (small() ? "m" : "d") + "/";
    const blob = new Array(n), bmp = new Array(n), busy = new Uint8Array(n);
    const KEEP = 8, END = .84;
    let cur = -1, want = 0, W = 0, H = 0, raf = 0, last = 0, decoding = 0, drawn = "";
    const fetchOne = i => blob[i] ? Promise.resolve() :
      fetch(base + String(i).padStart(3, "0") + ".webp").then(r => r.ok ? r.blob() : null)
        .then(b => { if (b) { blob[i] = b; pump(); } }).catch(() => {});
    async function loadAll() {
      const order = [], seen = new Uint8Array(n);
      for (const step of [8, 4, 2, 1]) for (let i = 0; i < n; i += step) if (!seen[i]) { seen[i] = 1; order.push(i); }
      let k = 0; const worker = async () => { while (k < order.length) await fetchOne(order[k++]); };
      await Promise.all([worker(), worker(), worker(), worker()]);
    }
    function pump() {
      const c = Math.floor(Math.max(cur, 0));
      for (let i = 0; i < n; i++) if (bmp[i] && Math.abs(i - c) > KEEP) { bmp[i].close && bmp[i].close(); bmp[i] = null; }
      while (decoding < 2) {
        let pick = -1;
        for (let d = 0; d <= KEEP && pick < 0; d++) for (const i of [c + d, c - d + 1]) if (i >= 0 && i < n && blob[i] && !bmp[i] && !busy[i]) { pick = i; break; }
        if (pick < 0) return;
        const i = pick; busy[i] = 1; decoding++;
        createImageBitmap(blob[i]).then(b => { if (Math.abs(i - Math.floor(cur)) > KEEP + 2) b.close && b.close(); else { bmp[i] = b; drawn = ""; kick(); } })
          .catch(() => {}).finally(() => { busy[i] = 0; decoding--; pump(); });
      }
    }
    const near = i => { for (let d = 0; d < n; d++) { if (bmp[i - d]) return i - d; if (bmp[i + d]) return i + d; } return -1; };
    function size() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      if (canvas.clientWidth === W && Math.abs(canvas.clientHeight - H) < 2 && canvas.width) return;
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0); g.imageSmoothingQuality = "high"; drawn = ""; kick();
    }
    function put(im, a) {
      const s = Math.max(W / im.width, H / im.height);
      g.globalAlpha = a; g.drawImage(im, (W - im.width * s) / 2, (H - im.height * s) / 2, im.width * s, im.height * s); g.globalAlpha = 1;
    }
    function tick(now) {
      const dt = Math.min(.05, last ? (now - last) / 1000 : 1 / 60); last = now;
      const p = progressOf(el); want = clamp(p / END, 0, 1) * (n - 1);
      cur = reduce || cur < 0 ? want : cur + (want - cur) * (1 - Math.exp(-dt * 8));
      if (Math.abs(want - cur) < .01) cur = want;
      pump();
      const i = Math.floor(cur), f = cur - i, key = i + ":" + (f * 40 | 0);
      if (key !== drawn) {
        if (bmp[i]) { put(bmp[i], 1); if (f > .02 && bmp[i + 1]) put(bmp[i + 1], f); drawn = key; }
        else { const j = near(Math.round(cur)); if (j >= 0) put(bmp[j], 1); }
      }
      words(p);
      raf = cur !== want || drawn !== key ? requestAnimationFrame(tick) : 0;
      if (!raf) last = 0;
    }
    function kick() { if (!raf) raf = requestAnimationFrame(tick); }
    const start = Math.round(clamp(progressOf(el) / END, 0, 1) * (n - 1));
    fetchOne(start).then(() => fetchOne(Math.min(n - 1, start + 1))).then(() => { kick(); loadAll(); });
    addEventListener("scroll", kick, { passive: true });
    addEventListener("resize", size);
    size();
  })(walk);
  // the words follow the walk: on the path, through the door, inside
  function words(p) {
    sayA.classList.toggle("on", p < .14);
    sayB.classList.toggle("on", p > .44 && p < .64);
    sayC.classList.toggle("on", p > .84);
    cue.classList.toggle("away", p > .03);
  }
  words(0);

  // ---------- nav: clear over the film, solid after, light over cream ----------
  const nav = document.querySelector(".nav"), creams = [...document.querySelectorAll(".menu,.house")];
  function navState() {
    const pastHero = walk.getBoundingClientRect().bottom < 80;
    const overCream = creams.some(s => { const r = s.getBoundingClientRect(); return r.top < 70 && r.bottom > 30; });
    nav.classList.toggle("solid", pastHero && !overCream);
    nav.classList.toggle("light", overCream);
  }

  // ---------- the story lights up word by word ----------
  const story = document.querySelector(".story"), wordsEl = story.querySelector(".words");
  (function split(node) {
    for (const ch of [...node.childNodes]) {
      if (ch.nodeType === 3) {
        const frag = document.createDocumentFragment();
        ch.textContent.split(/(\s+)/).forEach(t => {
          if (!t) return;
          if (/^\s+$/.test(t)) frag.append(t); else { const s = document.createElement("span"); s.className = "w"; s.textContent = t; frag.append(s); }
        });
        node.replaceChild(frag, ch);
      } else split(ch);
    }
  })(wordsEl);
  const ws = [...wordsEl.querySelectorAll(".w")];

  // ---------- the house: the full picture closes into a framed card ----------
  const house = document.querySelector(".house"), frame = house.querySelector(".frame");
  const ease = u => u * u * (3 - 2 * u);

  let sRaf = 0;
  function onScroll() {
    sRaf = 0; navState();
    const sp = progressOf(story);
    story.style.setProperty("--p", sp.toFixed(3));
    const lit = Math.round(clamp((sp - .08) / .74, 0, 1) * ws.length);
    ws.forEach((w, i) => w.classList.toggle("lit", i < lit));
    const hp = progressOf(house);
    const x = ease(clamp(hp / .55, 0, 1));
    frame.style.setProperty("--x", x.toFixed(4));
    frame.style.setProperty("--t", ease(clamp((hp - .45) / .3, 0, 1)).toFixed(3));
    house.style.setProperty("--x", x.toFixed(3));
  }
  addEventListener("scroll", () => { if (!sRaf) sRaf = requestAnimationFrame(onScroll); }, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  // ---------- honeys: like a menu, the picture follows the honey ----------
  const pots = [...document.querySelectorAll(".pot")], pics = [...document.querySelectorAll(".menu-pic img")];
  function openPot(p) {
    pots.forEach(q => { const on = q === p; q.classList.toggle("on", on); q.querySelector(".d-head").setAttribute("aria-expanded", on); });
    pics.forEach((im, i) => im.classList.toggle("on", i === +p.dataset.i));
  }
  pots.forEach(p => p.querySelector(".d-head").addEventListener("click", () => openPot(p)));

  // ---------- order ----------
  const cart = {}, prices = {}, names = {};
  const count = document.querySelector(".count"), lines = document.querySelector(".lines"), toast = document.querySelector(".toast");
  let tt;
  const say = m => { toast.textContent = m; toast.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("on"), 2200); };
  pots.forEach(p => { const id = p.dataset.id; names[id] = p.querySelector(".d-name").textContent; prices[id] = +p.querySelector(".price").textContent.replace(/\D/g, ""); });
  function render() {
    const ids = Object.keys(cart).filter(k => cart[k] > 0), n = ids.reduce((a, k) => a + cart[k], 0);
    count.hidden = !n; if (+count.textContent !== n) { count.textContent = n; count.classList.remove("bump"); void count.offsetWidth; count.classList.add("bump"); }
    pots.forEach(p => { const on = cart[p.dataset.id] > 0, b = p.querySelector(".add"); b.classList.toggle("added", on); b.textContent = on ? "In your order" : "Add to order"; });
    if (!n) { lines.innerHTML = '<li class="empty">Nothing yet. Pick a honey above.</li>'; return; }
    const total = ids.reduce((a, k) => a + cart[k] * prices[k], 0), free = total >= 30;
    lines.innerHTML = ids.map(k => `<li><span>${names[k]}<small>250 g</small></span><span class="qty"><button type="button" data-k="${k}" data-d="-1" aria-label="One less ${names[k]}">−</button>${cart[k]}<button type="button" data-k="${k}" data-d="1" aria-label="One more ${names[k]}">+</button></span><span>€${cart[k] * prices[k]}</span></li>`).join("")
      + `<li><span>Delivery</span><span></span><span>${free ? "free" : "€4.90"}</span></li>`
      + `<li class="total"><span>Total</span><span></span><span>€${(total + (free ? 0 : 4.9)).toFixed(2).replace(".00", "")}</span></li>`;
  }
  document.querySelectorAll(".add").forEach(b => b.addEventListener("click", () => {
    const id = b.closest(".pot").dataset.id;
    cart[id] = cart[id] ? 0 : 1; render();
    say(cart[id] ? `${names[id]} is in your order` : `${names[id]} removed`);
  }));
  lines.addEventListener("click", e => {
    const b = e.target.closest("button[data-k]"); if (!b) return;
    cart[b.dataset.k] = clamp(cart[b.dataset.k] + +b.dataset.d, 0, 12); render();
  });
  const form = document.querySelector(".send"), mail = form.querySelector("input"), msg = form.querySelector(".msg");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const n = Object.values(cart).reduce((a, b) => a + b, 0);
    msg.classList.remove("err");
    if (!n) { msg.textContent = "Add a honey first."; msg.classList.add("err"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.value.trim())) { msg.textContent = "That email doesn't look right."; msg.classList.add("err"); mail.focus(); return; }
    msg.textContent = "Thank you. This is a concept site, so nothing was sent, but this is where your confirmation would come from.";
  });
  render();
})();
