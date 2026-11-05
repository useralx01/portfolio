// The four project logos as live metal (geometry and studio light in metal3d.js).
// One WebGL renderer draws every logo on the page and copies each frame into that logo's own
// canvas, so there is never more than one GL context. Logos sway gently, lean toward the cursor
// when you hover them, and only draw while on screen. No WebGL: the still pictures stay.
import * as M from './metal3d.js';
const { THREE } = M;

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const els = [...document.querySelectorAll('[data-mark]')];

const makers = {
  overlink: () => M.chainMark(M.steel()),
  tradelabs: () => M.hexMark(M.steel()),
  licht: () => M.starMark(M.chrome()),
  pocketlm: () => M.pagesMark(M.steel({ color: 0x80858c, roughness: 0.15 })),
};
// Per logo: size in frame, resting pose.
const pose = {
  overlink: { s: 1.5, rx: -0.12, ry: 0.35 },
  tradelabs: { s: 1.45, rx: -0.1, ry: 0.3 },
  licht: { s: 1.75, rx: -0.05, ry: 0.25 },
  pocketlm: { s: 1.18, rx: 0, ry: 0 },
};

function start() {
  const gl = M.renderer(document.createElement('canvas'));
  gl.setPixelRatio(1);
  const env = M.studio(gl);
  const t0 = performance.now();
  let raf = 0, last = 0;

  const items = els.map(el => {
    const kind = el.dataset.mark;
    const canvas = el.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const scene = new THREE.Scene();
    scene.environment = env;
    const cam = new THREE.PerspectiveCamera(24, 1, 0.1, 50);
    cam.position.set(0, 0.35, 8);
    cam.lookAt(0, 0, 0);
    const obj = makers[kind]();
    const P = pose[kind];
    const roll = obj.rotation.z, baseX = obj.rotation.x, baseY = obj.rotation.y;
    obj.scale.multiplyScalar(P.s);
    const holder = new THREE.Group();
    holder.add(obj);
    scene.add(holder);
    const shadow = M.contactShadow(2.6, 0.42, 0.2);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.42;
    scene.add(shadow);
    const it = { el, kind, canvas, ctx, scene, cam, obj, holder, roll, baseX, baseY, P, on: false, w: 0, h: 0,
      gx: 0, gy: 0, x: 0, y: 0, hover: 0, hoverGoal: 0, phase: Math.random() * 6,
      // Opening: logos in the top row turn in from edge-on, one after another.
      intro: el.closest('.lineup') && scrollY < 40 && !reduced ? [...el.closest('.lineup').children].indexOf(el.closest('li')) * 0.14 : -1 };
    const host = el.closest('a, .pj') || el;
    host.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = el.getBoundingClientRect();
      it.gx = clamp((e.clientX - r.left) / r.width * 2 - 1, -1, 1);
      it.gy = clamp((e.clientY - r.top) / r.height * 2 - 1, -1, 1);
      it.hoverGoal = 1; kick();
    });
    host.addEventListener('pointerleave', () => { it.gx = it.gy = 0; it.hoverGoal = 0; kick(); });
    return it;
  });

  const size = it => {
    const r = it.el.getBoundingClientRect();
    const dpr = Math.min(devicePixelRatio || 1, 2);
    it.w = Math.max(1, Math.round(r.width * dpr)); it.h = Math.max(1, Math.round(r.height * dpr));
    if (it.canvas.width !== it.w || it.canvas.height !== it.h) { it.canvas.width = it.w; it.canvas.height = it.h; }
    it.cam.aspect = it.w / it.h;
    // Keep the logo the same size in tall frames.
    it.cam.position.z = it.cam.aspect < 1 ? 8 / it.cam.aspect : 8;
    it.cam.updateProjectionMatrix();
  };

  const draw = (it, t, dt) => {
    const k = 1 - Math.pow(0.004, dt);
    it.x += (it.gx - it.x) * k; it.y += (it.gy - it.y) * k;
    it.hover += (it.hoverGoal - it.hover) * k;
    let sway = reduced ? 0 : Math.sin(t * 0.45 + it.phase) * 0.28;
    // Logos beside a project turn as you scroll past them.
    if (it.el.classList.contains('mark-sm') && !reduced) {
      const r = it.el.getBoundingClientRect();
      sway = sway * 0.4 + ((innerHeight - r.top) / (innerHeight + r.height) - 0.5) * 1.6;
    }
    const { P } = it;
    if (it.kind === 'pocketlm') {
      M.fanPages(it.obj, reduced ? 0.5 : 0.35 + 0.35 * Math.sin(t * 0.5 + it.phase) + it.hover * 0.3);
      it.holder.rotation.set(it.y * 0.25, sway * 0.6 + it.x * 0.45, 0);
    } else {
      it.obj.rotation.set(it.baseX, it.baseY, it.roll);
      it.holder.rotation.set(P.rx + it.y * 0.3, P.ry + sway + it.x * 0.6, 0);
    }
    if (it.intro >= 0) {
      const e = 1 - Math.pow(1 - clamp((t - it.intro) / 1.6, 0, 1), 4);
      it.holder.rotation.y += (1 - e) * -Math.PI * 0.85;
      it.holder.scale.setScalar(0.82 + 0.18 * e);
      if (e >= 1) it.intro = -1;
    }
    it.holder.position.y = reduced ? 0 : Math.sin(t * 0.8 + it.phase) * 0.04 + it.hover * 0.08;
    if (it.intro < 0) it.holder.scale.setScalar(1 + it.hover * 0.04);
    it.obj.traverse?.(m => { if (m.material?.envMapRotation) m.material.envMapRotation.set(0, t * 0.06 + it.x * 0.8, 0); });
    it.scene.children[1].material.opacity = 0.2 * (1 - it.hover * 0.3);
    gl.setSize(it.w, it.h, false);
    gl.render(it.scene, it.cam);
    it.ctx.clearRect(0, 0, it.w, it.h);
    it.ctx.drawImage(gl.domElement, 0, 0, it.w, it.h);
    it.el.classList.add('gl-on');
  };

  const step = now => {
    raf = 0;
    const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
    const t = (now - t0) / 1000;
    let any = false;
    for (const it of items) if (it.on) { draw(it, t, dt); any = true; }
    if (any && !reduced) raf = requestAnimationFrame(step); else last = 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(step); };

  const io = new IntersectionObserver(entries => {
    for (const en of entries) {
      const it = items.find(i => i.el === en.target);
      it.on = en.isIntersecting;
      if (it.on) size(it);
    }
    kick();
  }, { rootMargin: '120px 0px' });
  items.forEach(it => io.observe(it.el));
  const ro = new ResizeObserver(() => { items.forEach(it => it.on && size(it)); kick(); });
  items.forEach(it => ro.observe(it.el));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); });
}

function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

if (els.length && M.webglOK()) {
  try { start(); } catch (e) { console.warn('3D logos off, keeping the stills.', e); }
}
