// Portfolio v18: intro, copy buttons, the project questionnaire and the review form.
// Both forms end in a filled-in email to dretagro@gmail.com (the visitor presses send); nothing is stored.
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const MAIL = 'dretagro@gmail.com';
  const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const showHero = () => $$('.hero .fu').forEach(n => n.classList.add('in'));

  /* ---------- 1. Intro: black screen, what I build word by word, count to 100, screen opens ---------- */
  const stage = $('.intro-stage');
  if (root.classList.contains('intro')) {
    const words = $$('.ix-words span'), fin = $('.ix-final span'), count = $('.ix-count b'), bar = $('.ix-bar');
    const t = [], T0 = performance.now(), TOTAL = 3000;
    let done = false, raf = 0;
    const tick = now => { const p = Math.min(1, (now - T0) / TOTAL); count.textContent = String(Math.round(p * 100)).padStart(2, '0'); bar.style.setProperty('--p', p.toFixed(3)); if (p < 1 && !done) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    const show = i => words.forEach((w, k) => { w.classList.toggle('on', k === i); w.classList.toggle('off', k < i); });
    const finish = quick => {
      if (done) return; done = true;
      t.forEach(clearTimeout); cancelAnimationFrame(raf);
      count.textContent = '100'; bar.style.setProperty('--p', 1);
      stage.classList.add('open');
      root.classList.remove('intro');
      try { sessionStorage.setItem('v18-intro', '1'); } catch {}
      setTimeout(showHero, quick ? 150 : 380);
      setTimeout(() => { stage.style.display = 'none'; }, 1200);
      ['wheel', 'keydown', 'pointerdown', 'touchstart'].forEach(e => removeEventListener(e, skip));
    };
    const skip = e => { if (e.type === 'wheel') e.preventDefault(); finish(true); };
    addEventListener('wheel', skip, { passive: false });
    ['keydown', 'pointerdown', 'touchstart'].forEach(e => addEventListener(e, skip, { passive: true }));
    [0, 1, 2, 3].forEach(i => t.push(setTimeout(() => show(i), 150 + i * 520)));
    t.push(setTimeout(() => { show(4); fin.classList.add('on'); }, 150 + 4 * 520));
    t.push(setTimeout(() => finish(false), TOTAL + 150));
  } else if (stage) stage.remove();

  /* ---------- 2. Copy buttons ---------- */
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    let ok = false;
    try { await navigator.clipboard.writeText(b.dataset.copy); ok = true; } catch {}
    if (!ok) { const x = document.createElement('textarea'); x.value = b.dataset.copy; x.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(x); x.select(); try { ok = document.execCommand('copy'); } catch {} x.remove(); }
    const u = window.SITE_TEXT?.ui || {}, label = b.dataset.label || (b.dataset.label = b.textContent);
    b.textContent = ok ? (u.copiedBtn || 'Copied') : (u.copyFail || 'Copy failed'); b.classList.toggle('done', ok);
    setTimeout(() => { b.textContent = label; b.classList.remove('done'); }, 1800);
  }));

  /* ---------- 3. Backend: own Apps Script in Licht's Google account (backend/Code.gs) ---------- */
  // Empty = no backend yet: forms fall back to the visitor's email app, booking is hidden.
  const LOCAL = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const API = (LOCAL && new URLSearchParams(location.search).get('api')) || window.PORTFOLIO_API || '';
  const T = window.SITE_TEXT, U = T.ui, LANG = T.lang;
  if (!API) $$('[data-book]').forEach(b => { b.hidden = true; });

  // Count the visit once per tab. No cookies, nothing about the visitor is stored.
  if (API) try {
    if (!sessionStorage.getItem('v18-hit')) {
      sessionStorage.setItem('v18-hit', '1');
      let ref = 'direct'; try { if (document.referrer) { const h = new URL(document.referrer).hostname; ref = h === location.hostname ? 'direct' : h; } } catch {}
      const data = JSON.stringify({ type: 'hit', path: location.pathname.replace(/^\/portfolio/, '') || '/', ref });
      navigator.sendBeacon ? navigator.sendBeacon(API, new Blob([data], { type: 'text/plain' })) : fetch(API, { method: 'POST', body: data, keepalive: true });
    }
  } catch {}

  // Real reviews, once Licht marks them "yes" in his sheet.
  const rvBox = $('.rv-list');
  if (API && rvBox) fetch(API + '?a=reviews').then(r => r.json()).then(d => {
    if (!d.ok || !d.reviews.length) return;
    rvBox.innerHTML = d.reviews.map(r => `<figure class="rv"><div class="stars s${r.stars}" aria-label="${r.stars} / 5">${'<i></i>'.repeat(5)}</div><blockquote>${esc(r.text)}</blockquote><figcaption><b>${esc(r.name)}</b>${r.role ? ' · ' + esc(r.role) : ''}${r.project ? ' · ' + esc(r.project) : ''}</figcaption></figure>`).join('');
    rvBox.hidden = false; $('.rv-empty-t')?.remove();
  }).catch(() => {});

  /* ---------- 4. Question flows ---------- */
  const FLOWS = { project: T.project, review: T.review, tester: T.tester, support: T.support, book: T.book };
  const wiz = $('#start'), body = $('.wiz-body', wiz), next = $('.wiz-next', wiz), back = $('.wiz-back', wiz);
  let flow = FLOWS.project, i = 0, ans = {}, opener = null, dir = 1, slots = null, busy = false;
  const vis = () => flow.steps.filter(s => !s.when || s.when(ans));

  const optHTML = (s, o) => {
    const multi = s.type === 'many', val = o[0];
    const checked = multi ? (ans[s.id] || []).includes(val) : ans[s.id] === val;
    return `<label class="opt${multi ? ' multi' : ''}"><input type="${multi ? 'checkbox' : 'radio'}" name="${s.id}" value="${esc(val)}"${checked ? ' checked' : ''}><span class="o-t"><b>${esc(val)}</b>${o[1] ? `<small>${esc(o[1])}</small>` : ''}</span><span class="tick" aria-hidden="true"></span></label>`;
  };
  const fieldHTML = f => {
    const v = esc(ans[f.id] || ''), common = `id="f-${f.id}" name="${f.id}"${f.req ? ' required' : ''}${f.ac ? ` autocomplete="${f.ac}"` : ''}${f.ph ? ` placeholder="${esc(f.ph)}"` : ''}`;
    return `<div class="fld"><label for="f-${f.id}">${esc(f.label)}${f.opt ? ` <small>(${U.optional})</small>` : ''}</label>${f.area ? `<textarea ${common}>${v}</textarea>` : `<input type="${f.type || 'text'}" value="${v}" ${common}>`}</div>`;
  };
  // Booking times, grouped by day, shown in the visitor's own time zone.
  const dayFmt = new Intl.DateTimeFormat(U.locale, { weekday: 'short', day: 'numeric', month: 'short' });
  const timeFmt = new Intl.DateTimeFormat(U.locale, { hour: '2-digit', minute: '2-digit' });
  const longFmt = new Intl.DateTimeFormat(U.locale, { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
  const slotsHTML = () => {
    if (!slots) return `<p class="q-hint slots-wait">${U.slotsLoading}</p>`;
    if (!slots.length) return `<p class="q-hint">${U.slotsNone}</p>`;
    const days = {}; slots.forEach(s => { const d = new Date(s), k = d.toDateString(); (days[k] = days[k] || []).push(d); });
    const keys = Object.keys(days), cur = ans._day && days[ans._day] ? ans._day : (ans.slot && days[new Date(ans.slot).toDateString()] ? new Date(ans.slot).toDateString() : keys[0]);
    let tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone.replace(/_/g, ' '); } catch {}
    return `<div class="days" role="tablist">${keys.map(k => `<button type="button" role="tab" aria-selected="${k === cur}" data-day="${esc(k)}">${esc(dayFmt.format(days[k][0]))}</button>`).join('')}</div>
      <div class="times" role="radiogroup">${days[cur].map(d => { const iso = d.toISOString(); return `<button type="button" role="radio" aria-checked="${ans.slot === iso}" data-slot="${iso}">${timeFmt.format(d)}</button>`; }).join('')}</div>
      <p class="q-note">${U.slotsTz}${tz ? ' (' + esc(tz) + ')' : ''}.</p>`;
  };
  const loadSlots = force => {
    if (slots && !force) return;
    if (force) slots = null;
    fetch(API + '?a=slots').then(r => r.json()).then(d => { slots = d.ok ? d.slots : []; }).catch(() => { slots = []; }).then(() => { if (vis()[i]?.type === 'slots') render(true); });
  };

  // Summary rows in question order: [step index, label, value]
  const pairs = () => {
    const out = [], show = v => (Array.isArray(v) ? v.length : v != null && String(v).trim());
    vis().forEach((s, k) => {
      if (s.opts && show(ans[s.id])) out.push([k, s.sum, Array.isArray(ans[s.id]) ? ans[s.id].join(', ') : ans[s.id]]);
      if (s.type === 'stars' && ans.stars) out.push([k, s.sum, '★'.repeat(ans.stars) + '☆'.repeat(5 - ans.stars)]);
      if (s.type === 'slots' && ans.slot) out.push([k, s.sum, longFmt.format(new Date(ans.slot))]);
      (s.fields || []).forEach(f => { if (show(ans[f.id])) out.push([k, f.sum || f.label, String(ans[f.id]).trim()]); });
      if (s.consent && ans.consent) out.push([k, U.agreed, s.consent]);
    });
    return out;
  };

  const render = quiet => {
    const steps = vis(), total = steps.length, useApi = API || flow.api;
    $('.wiz-name', wiz).textContent = flow.title;
    $('.wiz-bar', wiz).style.setProperty('--p', (Math.min(i, total) / total).toFixed(3));
    $('.wiz-step', wiz).textContent = i < total ? `${i + 1} ${U.of} ${total}` : i === total ? U.check : '';
    back.disabled = i === 0 || i > total;
    next.disabled = false;
    let h = '';
    if (i < total) {
      const s = steps[i];
      h = `<div class="q${dir < 0 ? ' back' : ''}${quiet ? ' still' : ''}"><p class="q-k">${esc(s.k)}</p><h2>${esc(s.q)}</h2>${s.hint ? `<p class="q-hint">${esc(s.hint)}</p>` : '<div style="height:20px"></div>'}`;
      if (s.opts) h += `<div class="opts${s.two ? ' two' : ''}" role="group" aria-label="${esc(s.q)}">${s.opts.map(o => optHTML(s, o)).join('')}</div>`;
      if (s.type === 'stars') h += `<div class="rate" role="radiogroup" aria-label="Rating">${[1, 2, 3, 4, 5].map(n => `<button type="button" role="radio" aria-checked="${ans.stars === n}" aria-label="${n} / 5" data-n="${n}" class="${(ans.stars || 0) >= n ? 'on' : ''}"><i></i></button>`).join('')}</div>`;
      if (s.type === 'slots') { h += `<div class="slots">${slotsHTML()}</div>`; loadSlots(); }
      if (s.fields) h += s.fields.map(fieldHTML).join('');
      if (s.consent) h += `<label class="opt multi" style="margin-top:20px"><input type="checkbox" name="consent"${ans.consent ? ' checked' : ''}><span class="o-t"><b style="font-weight:500;font-size:15px">${esc(s.consent)}</b></span><span class="tick" aria-hidden="true"></span></label>`;
      h += `<p class="err" role="alert">${quiet && ans._err ? esc(ans._err) : ''}</p></div>`;
      next.textContent = i === total - 1 ? U.toCheck : U.next;
    } else if (i === total) {
      h = `<div class="q${dir < 0 ? ' back' : ''}"><p class="q-k">${U.almost}</p><h2>${U.checkH}</h2><p class="q-hint">${useApi ? U.checkHintApi : U.checkHintMail}</p><dl class="sum">${pairs().map(([k, l, v]) => `<div><dt>${esc(l)}</dt><dd>${esc(v)}</dd><button type="button" data-edit="${k}">${U.edit}</button></div>`).join('')}</dl><p class="err" role="alert"></p></div>`;
      next.textContent = useApi ? U.send : U.sendMail;
    } else {
      const [dh, dp] = ans._sent === 'api' ? flow.doneApi : flow.done;
      h = `<div class="q"><svg class="done-mark" viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="36" r="30"/><path d="M24 37l8 8 16-17"/></svg><h2>${esc(dh)}</h2><p class="q-hint">${esc(dp)}</p>${ans._sent === 'api' ? '' : `<p class="q-note">${U.mailNote(MAIL)}</p>`}</div>`;
      next.textContent = T.lang === 'de' ? 'Schließen' : 'Close';
    }
    body.innerHTML = h;
    if (!quiet) {
      const first = $('input:not([type=radio]):not([type=checkbox]),textarea', body) || $('input:checked', body) || $('input,button', body);
      if (first && matchMedia('(pointer: fine)').matches) first.focus({ preventScroll: true });
      body.scrollTop = 0;
    }
    ans._err = '';
  };

  const collect = () => {
    const s = vis()[i]; if (!s) return;
    if (s.type === 'many') ans[s.id] = $$(`input[name="${s.id}"]:checked`, body).map(x => x.value);
    if (s.type === 'one') { const c = $(`input[name="${s.id}"]:checked`, body); if (c) ans[s.id] = c.value; }
    (s.fields || []).forEach(f => { ans[f.id] = $(`[name="${f.id}"]`, body).value.trim(); });
    if (s.consent) ans.consent = $('input[name=consent]', body).checked;
  };
  const validate = () => {
    const s = vis()[i], err = $('.err', body); if (!s) return true;
    $$('.fld', body).forEach(f => f.classList.remove('bad'));
    let msg = '';
    if ((s.type === 'many' && !(ans[s.id] || []).length) || (s.type === 'one' && !ans[s.id])) msg = U.pick;
    if (s.type === 'stars' && !ans.stars) msg = U.star;
    if (s.type === 'slots' && !ans.slot) msg = U.pickSlot;
    for (const f of s.fields || []) {
      const v = ans[f.id], bad = () => $(`#f-${f.id}`, body).closest('.fld').classList.add('bad');
      if (f.req && !v) { msg = msg || U.fill(f.label); bad(); }
      else if (f.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { msg = msg || U.badEmail; bad(); }
    }
    if (s.consent && !ans.consent) msg = msg || U.consentMsg;
    err.textContent = msg;
    return !msg;
  };
  const go = d => { dir = d; i += d; render(); };
  const mailText = () => flow.intro + '\n' + pairs().map(([, l, v]) => `${l}:\n${v}`).join('\n\n') + '\n';
  const copyAll = () => navigator.clipboard?.writeText(`To: ${MAIL}\nSubject: ${flow.subject(ans)}\n\n${mailText()}`);
  const viaMail = () => {
    copyAll()?.catch(() => {});
    location.href = `mailto:${MAIL}?subject=${encodeURIComponent(flow.subject(ans))}&body=${encodeURIComponent(mailText())}`;
    ans._sent = 'mail'; go(1);
  };
  const send = async () => {
    if (busy) return;
    if (!API) return viaMail();
    busy = true; next.disabled = true; next.textContent = U.sending;
    const clean = Object.fromEntries(Object.entries(ans).filter(([k]) => k[0] !== '_'));
    try {
      const r = await fetch(API, { method: 'POST', body: JSON.stringify({ type: flow.type, lang: LANG, ans: clean, rows: pairs().map(([, l, v]) => [l, v]), hp: $('.hp', wiz)?.value || '' }) });
      const d = await r.json();
      if (d.ok) { ans._sent = 'api'; go(1); }
      else if (d.error === 'taken') { ans.slot = ''; ans._err = U.slotTaken; i = vis().findIndex(s => s.type === 'slots'); loadSlots(true); render(true); }
      else throw new Error(d.error);
    } catch (e) {
      if (flow.api) { $('.err', body).textContent = U.failed.split('.')[0] + '.'; next.disabled = false; next.textContent = U.send; }
      else { $('.err', body).textContent = U.failed; setTimeout(viaMail, 900); }
    } finally { busy = false; }
  };

  next.addEventListener('click', () => {
    const total = vis().length;
    if (i > total) return close();
    if (i === total) return send();
    collect(); if (validate()) go(1);
  });
  back.addEventListener('click', () => { collect(); go(-1); });
  body.addEventListener('submit', e => e.preventDefault());
  body.addEventListener('change', e => {
    const s = vis()[i];
    if (s?.type === 'one' && e.target.type === 'radio') { collect(); $('.err', body).textContent = ''; if (!s.fields && !s.consent) setTimeout(() => { if (vis()[i] === s) go(1); }, 280); }
  });
  body.addEventListener('click', e => {
    const star = e.target.closest('.rate button');
    if (star) { ans.stars = +star.dataset.n; $$('.rate button', body).forEach(b => { b.classList.toggle('on', +b.dataset.n <= ans.stars); b.setAttribute('aria-checked', +b.dataset.n === ans.stars); }); $('.err', body).textContent = ''; }
    const day = e.target.closest('[data-day]');
    if (day) { ans._day = day.dataset.day; $('.slots', body).innerHTML = slotsHTML(); }
    const sl = e.target.closest('[data-slot]');
    if (sl) { ans.slot = sl.dataset.slot; ans._day = new Date(ans.slot).toDateString(); $$('[data-slot]', body).forEach(b => b.setAttribute('aria-checked', b === sl)); $('.err', body).textContent = ''; }
    const ed = e.target.closest('[data-edit]');
    if (ed) { dir = -1; i = +ed.dataset.edit; render(); }
    const cp = e.target.closest('[data-copyall]');
    if (cp) (copyAll() || Promise.reject()).then(() => { cp.textContent = U.copied; }, () => { cp.textContent = U.copyFail; });
  });
  wiz.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
    if (e.key === 'Enter' && !['TEXTAREA', 'BUTTON', 'A'].includes(e.target.tagName)) { e.preventDefault(); next.click(); }
    if (e.key === 'Tab') { const f = $$('button:not([disabled]):not([hidden]),input:not(.hp),textarea,a[href]', wiz).filter(x => x.offsetParent); if (!f.length) return; if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); } else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); } }
  });

  const open = which => {
    if (flow !== which || i > vis().length) { flow = which; i = 0; ans = {}; }
    if (flow.type === 'book') loadSlots(true);
    opener = document.activeElement; dir = 1;
    wiz.hidden = false; root.classList.add('wiz-open');
    requestAnimationFrame(() => wiz.classList.add('in'));
    render();
    if (location.hash !== '#start') history.pushState(null, '', '#start');
  };
  const close = () => {
    wiz.classList.remove('in'); root.classList.remove('wiz-open');
    setTimeout(() => { wiz.hidden = true; }, reduced ? 0 : 400);
    if (location.hash === '#start') history.replaceState(null, '', location.pathname + location.search);
    opener?.focus?.({ preventScroll: true });
  };
  $('.wiz-x', wiz).addEventListener('click', close);
  const pickFlow = t => FLOWS[['review', 'tester', 'support', 'book'].find(k => t.hasAttribute('data-' + k)) || 'project'];
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-start],[data-review],[data-tester],[data-support],[data-book]'); if (!t) return;
    e.preventDefault(); e.stopPropagation(); open(pickFlow(t));
  }, true);
  addEventListener('popstate', () => { if (location.hash !== '#start' && !wiz.hidden) close(); });
  const startHash = { '#start': 'project', '#tester': 'tester', '#support': 'support', '#book': API ? 'book' : 'project', '#review': 'review' }[location.hash];
  if (startHash) { root.classList.remove('intro'); stage?.remove(); showHero(); open(FLOWS[startHash]); }
})();
