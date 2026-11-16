import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* ============ tabs ============ */

const TABS = ['trip', 'pass', 'days'];
let current = 'trip';

function setTab(tab) {
  if (!TABS.includes(tab)) return;
  current = tab;
  document.body.dataset.tab = tab;
  document.querySelectorAll('[data-screen]').forEach((el) => {
    el.classList.toggle('is-active', el.dataset.screen === tab);
  });
  document.querySelectorAll('.tab').forEach((btn) => {
    const on = btn.dataset.tab === tab;
    btn.classList.toggle('is-on', on);
    btn.setAttribute('aria-selected', String(on));
  });
  if (window.parent && window.parent !== window) {
    window.parent.postMessage({ wayline: 'tab', tab }, '*');
  }
  window.dispatchEvent(new CustomEvent('wayline:tab', { detail: tab }));
}

document.addEventListener('click', (e) => {
  const tab = e.target.closest('button.tab[data-tab]');
  if (tab) return setTab(tab.dataset.tab);
  const go = e.target.closest('[data-go]');
  if (go) return setTab(go.dataset.go);
});

window.addEventListener('message', (e) => {
  if (e.data && e.data.wayline === 'get') {
    window.parent.postMessage({ wayline: 'tab', tab: current }, '*');
  }
  if (e.data && e.data.wayline === 'show' && TABS.includes(e.data.tab)) setTab(e.data.tab);
});

/* ============ globe ============ */

const globeEl = document.getElementById('globe');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setClearColor(0x07080c, 1);
globeEl.prepend(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
camera.position.set(0, 0, 4.9);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.07;
controls.rotateSpeed = 0.45;
controls.minPolarAngle = 1.0;
controls.maxPolarAngle = Math.PI - 1.0;

function ll(lat, lon) {
  const polar = (90 - lat) * Math.PI / 180;
  const phi = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(-Math.cos(phi) * Math.sin(polar), Math.cos(polar), Math.sin(phi) * Math.sin(polar));
}

const world = new THREE.Group();
world.position.y = -0.12;
scene.add(world);

const TL = new THREE.TextureLoader();
const nightTex = TL.load('https://unpkg.com/three-globe@2.31.0/example/img/earth-night.jpg');
const dayTex = TL.load('https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg');
dayTex.colorSpace = THREE.SRGBColorSpace;
nightTex.colorSpace = THREE.SRGBColorSpace;
nightTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

// Earth: warm city lights, a cool limb and soft light from the upper left so it reads as a ball, not a disc.
const earthMat = new THREE.ShaderMaterial({
  uniforms: { map: { value: nightTex }, day: { value: dayTex }, sun: { value: new THREE.Vector3(-0.55, 0.65, 0.5).normalize() } },
  vertexShader: `
    varying vec2 vUv; varying vec3 vN; varying vec3 vV;
    void main() {
      vUv = uv;
      vN = normalize(normalMatrix * normal);
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vV = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: `
    uniform sampler2D map, day; uniform vec3 sun;
    varying vec2 vUv; varying vec3 vN; varying vec3 vV;
    void main() {
      vec3 c = texture2D(map, vUv).rgb;
      float lum = dot(c, vec3(.299, .587, .114));
      vec3 lights = vec3(1.0, .8, .52) * smoothstep(.05, .4, lum) * 2.4;
      vec3 d = texture2D(day, vUv).rgb;
      vec3 base = d * vec3(.55, .7, 1.0) * .26;
      float ndv = max(dot(vN, vV), 0.0);
      float lit = smoothstep(-.25, 1.0, dot(vN, sun));
      vec3 col = base * (.2 + 1.0 * lit) + lights * (1.0 - .2 * lit);
      float rim = pow(1.0 - ndv, 3.2);
      col += vec3(.30, .55, 1.0) * rim * .75;
      col *= .55 + .45 * smoothstep(0.0, .35, ndv);
      gl_FragColor = vec4(col, 1.0);
    }`,
});
world.add(new THREE.Mesh(new THREE.SphereGeometry(1, 128, 96), earthMat));

// Thin atmosphere halo just outside the limb.
const halo = new THREE.Mesh(
  new THREE.SphereGeometry(1.045, 96, 64),
  new THREE.ShaderMaterial({
    vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vN = normalize(normalMatrix*normal); vec4 mv = modelViewMatrix*vec4(position,1.); vV = normalize(-mv.xyz); gl_Position = projectionMatrix*mv; }',
    fragmentShader: 'varying vec3 vN; varying vec3 vV; void main(){ float d = dot(vN, vV); float a = pow(clamp(-d / 0.29, 0.0, 1.0), 2.2); gl_FragColor = vec4(vec3(.35,.6,1.)*a*.5, 1.); }',
    side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
  }),
);
halo.position.copy(world.position);
scene.add(halo);

// faint stars far behind
{
  const g = new THREE.BufferGeometry(), P = [];
  let h = 7; const r = () => { h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; };
  for (let i = 0; i < 260; i++) { const v = new THREE.Vector3(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1).normalize().multiplyScalar(30); P.push(v.x, v.y, v.z); }
  g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0x9fb0d0, size: 1.1, sizeAttenuation: false, transparent: true, opacity: .4 })));
}

function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'); const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(255,255,255,1)'); grd.addColorStop(.16, 'rgba(200,225,255,.9)');
  grd.addColorStop(.42, 'rgba(111,168,255,.2)'); grd.addColorStop(1, 'rgba(111,168,255,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const glowTex = glowTexture();
const sprite = (s) => { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false })); m.scale.setScalar(s); return m; };

// Route Berlin to Tokyo Haneda: a raised great circle.
const BER = ll(52.52, 13.405), HND = ll(35.549, 139.78);
const omega = Math.acos(BER.dot(HND));
const N = 240, pts = [];
for (let i = 0; i <= N; i++) {
  const t = i / N, a = Math.sin((1 - t) * omega) / Math.sin(omega), b = Math.sin(t * omega) / Math.sin(omega);
  pts.push(new THREE.Vector3().addScaledVector(BER, a).addScaledVector(HND, b).multiplyScalar(1.004 + 0.2 * Math.sin(Math.PI * t)));
}
const arc = new THREE.CatmullRomCurve3(pts);
const arcMat = (a) => new THREE.ShaderMaterial({
  uniforms: { prog: { value: 0 }, alpha: { value: a } },
  vertexShader: 'varying float u; void main(){ u = uv.x; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
  fragmentShader: 'uniform float prog, alpha; varying float u; void main(){ if (u > prog) discard; float f = smoothstep(0., .35, u) * .75 + .25; float head = smoothstep(prog - .08, prog, u) * .6; gl_FragColor = vec4(mix(vec3(.44,.66,1.), vec3(1.), .35 + head) * (f + head) * alpha, 1.); }',
  transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
});
const arcGlow = new THREE.Mesh(new THREE.TubeGeometry(arc, N, 0.016, 12, false), arcMat(0.16));
const arcCore = new THREE.Mesh(new THREE.TubeGeometry(arc, N, 0.0042, 12, false), arcMat(1));
world.add(arcGlow, arcCore);

const ends = [];
for (const p of [BER, HND]) {
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.0115, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  dot.position.copy(p).multiplyScalar(1.004);
  const g = sprite(0.12); g.position.copy(dot.position);
  world.add(dot, g); ends.push(dot);
}
// a ring that pulses on Tokyo
const ring = new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 64), new THREE.MeshBasicMaterial({ color: 0x9cc2ff, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }));
ring.position.copy(HND).multiplyScalar(1.006); ring.lookAt(HND.clone().multiplyScalar(2)); world.add(ring);

const mover = sprite(0.17); mover.visible = false; world.add(mover);

// Frame the route: midpoint toward the camera, north up, then tip it back so the arc rises over the horizon.
function orient(point) {
  const q1 = new THREE.Quaternion().setFromUnitVectors(point.clone().normalize(), new THREE.Vector3(0, 0, 1));
  const north = new THREE.Vector3(0, 1, 0).applyQuaternion(q1);
  const q2 = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.atan2(north.x, north.y));
  return q2.multiply(q1);
}
const tip = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.42);
const mid = BER.clone().add(HND).normalize();
const qEnd = tip.clone().multiply(orient(mid));
const qStart = tip.clone().multiply(orient(ll(30, -40)));
world.quaternion.copy(qStart);

const labels = [document.getElementById('lb-ber'), document.getElementById('lb-hnd')];
const INTRO = 2400, DRAW0 = 1300, DRAW = 1500, LOOP = 3200;
const t0 = performance.now();
const ease = (x) => 1 - Math.pow(1 - x, 4);
const easeIO = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

function resize() {
  const w = Math.max(1, globeEl.clientWidth), h = Math.max(1, globeEl.clientHeight);
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(globeEl); resize();

const tmp = new THREE.Vector3(), nrm = new THREE.Vector3(), toCam = new THREE.Vector3();
function frame(now) {
  const el = now - t0;
  world.quaternion.slerpQuaternions(qStart, qEnd, easeIO(Math.min(1, el / INTRO)));

  const dp = Math.min(1, Math.max(0, (el - DRAW0) / DRAW)), de = ease(dp);
  arcGlow.material.uniforms.prog.value = de; arcCore.material.uniforms.prog.value = de;
  if (dp > 0) {
    const u = ((el - DRAW0 - DRAW) % LOOP) / LOOP;
    mover.position.copy(arc.getPointAt(dp < 1 ? Math.min(0.999, de) : Math.min(0.999, easeIO(u))));
    mover.visible = true;
  }
  if (dp >= 1) {
    const k = ((el - DRAW0 - DRAW) % 2200) / 2200;
    ring.scale.setScalar(0.02 + 0.07 * k); ring.material.opacity = 0.7 * (1 - k);
  }

  controls.update();
  renderer.render(scene, camera);

  // city labels follow their dots, hidden on the far side
  const w = globeEl.clientWidth, h = globeEl.clientHeight;
  ends.forEach((d, i) => {
    d.getWorldPosition(tmp);
    nrm.copy(tmp).sub(world.position).normalize();
    const facing = nrm.dot(toCam.copy(camera.position).sub(tmp).normalize());
    tmp.project(camera);
    const x = (tmp.x + 1) / 2 * w, y = (1 - tmp.y) / 2 * h;
    const left = x > w - 70;
    labels[i].classList.toggle('lft', left);
    labels[i].style.transform = `translate(${(left ? x - labels[i].offsetWidth : x).toFixed(1)}px, ${(y - 7).toFixed(1)}px)`;
    labels[i].classList.toggle('on', facing > 0.15 && el > DRAW0 + (i ? DRAW : 0));
  });
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* ============ start ============ */

setTab('trip');
