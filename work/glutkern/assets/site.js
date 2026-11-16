(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // ---------- intro (once per visit) ----------
  const intro = document.querySelector(".intro");
  const seen = sessionStorage.getItem("gk-intro");
  const ready = () => requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add("ready")));
  if (reduce || seen) { intro.remove(); ready(); }
  else {
    sessionStorage.setItem("gk-intro", 1);
    let ended = false;
    const end = () => { if (ended) return; ended = true; intro.classList.add("out"); setTimeout(ready, 250); setTimeout(() => intro.remove(), 1000); };
    const t = setTimeout(end, 1900);
    ["wheel", "keydown", "pointerdown", "touchstart"].forEach(e =>
      addEventListener(e, () => { clearTimeout(t); end(); }, { once: true, passive: true }));
  }

  // ---------- smooth wheel scrolling (mouse and trackpad on desktop; touch stays native) ----------
  const glide = (() => {
    if (reduce || !matchMedia("(hover: hover) and (pointer: fine)").matches) return null;
    let target = scrollY, cur = scrollY, raf = 0, last = 0;
    const max = () => document.documentElement.scrollHeight - innerHeight;
    const run = now => {
      const dt = Math.min(.05, last ? (now - last) / 1000 : 1 / 60); last = now;
      cur += (target - cur) * (1 - Math.exp(-dt * 9));
      if (Math.abs(target - cur) < .4) cur = target;
      scrollTo(0, cur);
      raf = cur !== target ? requestAnimationFrame(run) : 0;
      if (!raf) last = 0;
    };
    const to = y => { if (!raf) cur = scrollY; target = clamp(y, 0, max()); if (!raf) raf = requestAnimationFrame(run); };
    addEventListener("wheel", e => {
      if (e.ctrlKey || e.defaultPrevented) return;
      e.preventDefault();
      const d = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
      to((raf ? target : scrollY) + d);
    }, { passive: false });
    // keyboard, scrollbar or anything else that scrolls: follow it, don't fight it
    addEventListener("scroll", () => { if (!raf) target = cur = scrollY; }, { passive: true });
    return { to };
  })();
  document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    const el = document.querySelector(a.getAttribute("href"));
    if (!el) return;
    e.preventDefault();
    const y = a.getAttribute("href") === "#top" ? 0 : el.getBoundingClientRect().top + scrollY - 40;
    glide ? glide.to(y) : scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
  }));

  // ---------- scroll-driven state ----------
  const filmEl = document.querySelector(".film");
  const steps = [...filmEl.querySelectorAll(".step")];
  const chaps = [...filmEl.querySelectorAll(".chapters li")];
  const cue = document.querySelector(".scrollcue");
  const nav = document.querySelector(".nav");
  let lastY = scrollY;

  const progress = el => {
    const r = el.getBoundingClientRect();
    return clamp(-r.top / (r.height - innerHeight), 0, 1);
  };

  const onScroll = () => {
    const p = progress(filmEl);
    steps.forEach(st => st.classList.toggle("on", p >= +st.dataset.from && p < +st.dataset.to));
    const k = chaps.reduce((a, c, i) => p >= +c.dataset.at - .02 ? i : a, 0);
    chaps.forEach((c, i) => c.classList.toggle("on", i === k));
    cue.classList.toggle("gone", scrollY > 40);
    const fr = filmEl.getBoundingClientRect();
    nav.classList.toggle("on-film", fr.bottom > 60 && p < .95);
    const y = scrollY;
    nav.classList.toggle("hide", y > lastY && y > 200);
    lastY = y;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- statement lights up word by word ----------
  const lu = document.querySelector(".lightup");
  lu.innerHTML = lu.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(" ");
  const words = [...lu.querySelectorAll(".w")];
  const light = () => {
    const r = lu.getBoundingClientRect();
    const p = clamp((innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.45), 0, 1);
    const k = Math.round(p * words.length);
    words.forEach((w, i) => w.classList.toggle("lit", i < k));
  };
  addEventListener("scroll", light, { passive: true });
  light();

  // ---------- add to bag ----------
  const toast = document.querySelector(".toast");
  let tt;
  const say = m => { toast.textContent = m; toast.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove("on"), 2200); };
  document.querySelectorAll(".add").forEach(b => b.addEventListener("click", () => {
    const name = b.closest(".bag").querySelector("h3").textContent;
    const on = b.classList.toggle("added");
    b.firstChild.textContent = on ? "In your bag" : "Add to bag";
    say(on ? name + " is in your bag" : name + " removed");
  }));

  // ---------- subscribe ----------
  const form = document.querySelector(".sub");
  const mail = form.querySelector("input");
  const hint = form.querySelector(".hint");
  const ok = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  mail.addEventListener("input", () => { if (ok(mail.value)) { mail.classList.remove("bad"); hint.textContent = ""; } });
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!ok(mail.value.trim())) {
      mail.classList.add("bad");
      hint.textContent = mail.value ? "That email looks off. Check it once more." : "Add your email first.";
      mail.focus();
      return;
    }
    document.querySelector(".beans").classList.add("sent");
  });
})();
