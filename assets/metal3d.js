// The three project marks as real geometry in polished metal (three.js r170, vendored):
// the Overlink chain link, the TradeLabs hexagon with its pulse, and the Licht four-point star.
// Lit by a photo studio (soft boxes + black flags) so chrome reads as chrome on a light page.
import * as THREE from '../vendor/three.module.min.js';
import { RoomEnvironment } from '../vendor/RoomEnvironment.js';

export { THREE };

export function webglOK() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
  catch { return false; }
}

export function renderer(canvas) {
  const r = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  r.setClearColor(0x000000, 0);
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = THREE.NeutralToneMapping;
  r.toneMappingExposure = 1.05;
  return r;
}

// Studio: the three.js room plus black flags for dark edges, and a warm card for gold glints.
export function studio(r) {
  const pmrem = new THREE.PMREMGenerator(r);
  const room = new RoomEnvironment();
  const mat = c => new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide });
  const black = mat(0x000000), warm = mat(0xffd2a0);
  const plane = (m, w, h, x, y, z, rx, ry) => {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m);
    p.position.set(x, y, z); p.rotation.set(rx, ry, 0); room.add(p);
  };
  plane(black, 7, 16, -7.5, 2, 6, 0, Math.PI / 2.6);
  plane(black, 5, 16, 8, 2, 4, 0, -Math.PI / 2.4);
  plane(black, 4, 10, 2.5, 3, -9, 0, 0);
  plane(black, 20, 1.2, 0, -0.8, -4, -Math.PI / 2, 0);
  // Just behind the object on the floor: where the lower faces' reflections land.
  plane(mat(0xffffff), 20, 0.7, 0, -0.85, -1.4, -Math.PI / 2, 0);
  plane(black, 20, 0.5, 0, -0.85, -2.3, -Math.PI / 2, 0);
  plane(warm, 3, 3, -4, 6, 11, 0, 0.3);
  // Floor strips in front of the object light the lower faces.
  const white = mat(0xffffff);
  plane(white, 20, 1.2, 0, -0.85, 1.6, -Math.PI / 2, 0);
  plane(black, 20, 0.9, 0, -0.85, 3.0, -Math.PI / 2, 0);
  plane(warm, 20, 1.6, 0, -0.85, 5.0, -Math.PI / 2, 0);
  plane(warm, 20, 1.4, 0, -0.8, -6.4, -Math.PI / 2, 0);
  const tex = pmrem.fromScene(room, 0.03).texture;
  pmrem.dispose();
  return tex;
}

export const steel = (o = {}) => new THREE.MeshPhysicalMaterial({
  color: 0x9a9fa6, metalness: 1, roughness: 0.13, clearcoat: 1, clearcoatRoughness: 0.05, ...o
});
export const chrome = (o = {}) => new THREE.MeshPhysicalMaterial({
  color: 0xf1e6d6, metalness: 1, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.03, ...o
});

/* ---------- Overlink: one chain link (stadium centre line swept with a round tube) ---------- */
class Stadium extends THREE.Curve {
  constructor(L, R) { super(); this.L = L; this.R = R; this.P = 4 * L + 2 * Math.PI * R; }
  getPoint(t, out = new THREE.Vector3()) {
    const { L, R } = this, arc = Math.PI * R;
    let s = (((t % 1) + 1) % 1) * this.P;
    if (s < arc) { const a = -Math.PI / 2 + s / R; return out.set(L + R * Math.cos(a), R * Math.sin(a), 0); }
    s -= arc;
    if (s < 2 * L) return out.set(L - s, R, 0);
    s -= 2 * L;
    if (s < arc) { const a = Math.PI / 2 + s / R; return out.set(-L + R * Math.cos(a), R * Math.sin(a), 0); }
    return out.set(-L + (s - arc), -R, 0);
  }
}
export const LINK = { L: 0.42, R: 0.4, r: 0.185 };
export function linkGeometry() {
  return new THREE.TubeGeometry(new Stadium(LINK.L, LINK.R), 220, LINK.r, 40, true);
}
// Two interlocked links, like the Overlink logo.
export function chainMark(material) {
  const g = new THREE.Group();
  const geo = linkGeometry();
  const pitch = 2 * (LINK.L + LINK.R) - (2 * LINK.r + 0.05);
  const a = new THREE.Mesh(geo, material), b = new THREE.Mesh(geo, material);
  a.position.x = -pitch / 2; b.position.x = pitch / 2; b.rotation.x = Math.PI / 2;
  g.add(a, b);
  g.rotation.z = Math.PI / 4;
  g.scale.setScalar(0.62);
  return g;
}

/* ---------- TradeLabs: rounded hexagon ring with the pulse line through it ---------- */
const bevel = (depth, size, segs = 10) => ({ depth, bevelEnabled: true, bevelThickness: size, bevelSize: size, bevelSegments: segs, curveSegments: 48 });
export function hexMark(material) {
  const g = new THREE.Group();
  const ring = new THREE.Shape(), hole = new THREE.Path();
  const hex = (path, r) => {
    for (let i = 0; i <= 6; i++) {
      const a = Math.PI / 2 + i * Math.PI / 3;
      i ? path.lineTo(r * Math.cos(a), r * Math.sin(a)) : path.moveTo(r * Math.cos(a), r * Math.sin(a));
    }
  };
  hex(ring, 1); hex(hole, 0.8);
  ring.holes.push(hole);
  const ringGeo = new THREE.ExtrudeGeometry(ring, bevel(0.06, 0.05, 8));
  ringGeo.center();
  g.add(new THREE.Mesh(ringGeo, material));
  // The pulse: flat, up, down, flat, as one rounded tube.
  const pts = [[-0.58, 0], [-0.24, 0], [-0.1, 0.36], [0.08, -0.36], [0.22, 0], [0.58, 0]].map(([x, y]) => new THREE.Vector3(x, y, 0));
  const path = new THREE.CurvePath();
  for (let i = 0; i < pts.length - 1; i++) path.add(new THREE.LineCurve3(pts[i], pts[i + 1]));
  const pulse = new THREE.TubeGeometry(path, 200, 0.065, 20, false);
  g.add(new THREE.Mesh(pulse, material));
  for (const end of [pts[0], pts[pts.length - 1]]) {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.065, 20, 14), material);
    cap.position.copy(end); g.add(cap);
  }
  g.scale.setScalar(0.92);
  return g;
}

/* ---------- Licht: four-point star, needle tips, deep curved sides, soft bright centre ---------- */
// One smooth surface: rings from the centre out to a concave (astroid-like) outline. The body is
// thick in the middle and thins to a sharp edge, so the arms end in needles.
export function starMark(material, o = {}) {
  const { e = 0.42, w = 1, h = 1.38, H = 0.42, P = 1.8, A = 512, T = 96 } = o;
  const outline = a => {
    const c = Math.abs(Math.cos(a)), n = Math.abs(Math.sin(a));
    const R = Math.pow(Math.pow(c, e) + Math.pow(n, e), -1 / e);
    return [Math.cos(a) * R * w, Math.sin(a) * R * h];
  };
  const pos = [], idx = [];
  for (const side of [1, -1]) {
    const base = pos.length / 3;
    pos.push(0, 0, side * H);
    for (let j = 1; j <= T; j++) {
      const t = j / T;
      // Height falls fast near the centre, then tapers into a thin blade.
      const z = side * (H * Math.pow(1 - t, P) + 0.012 * (1 - t));
      for (let i = 0; i < A; i++) {
        const [x, y] = outline(i / A * Math.PI * 2);
        pos.push(x * t, y * t, z);
      }
    }
    const ring = j => base + 1 + (j - 1) * A;
    for (let i = 0; i < A; i++) {
      const i2 = (i + 1) % A;
      side > 0 ? idx.push(base, ring(1) + i, ring(1) + i2) : idx.push(base, ring(1) + i2, ring(1) + i);
    }
    for (let j = 1; j < T; j++) for (let i = 0; i < A; i++) {
      const i2 = (i + 1) % A, a0 = ring(j) + i, a1 = ring(j) + i2, b0 = ring(j + 1) + i, b1 = ring(j + 1) + i2;
      side > 0 ? idx.push(a0, b0, b1, a0, b1, a1) : idx.push(a0, b1, b0, a0, a1, b1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, material);
}

/* ---------- PocketLM: a stack of memory pages, the top ones sliding out like weights streaming ---------- */
function roundedRect(w, h, r) {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r); s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2); s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return s;
}
export function pagesMark(material) {
  const g = new THREE.Group();
  const geo = new THREE.ExtrudeGeometry(roundedRect(1.5, 1.5, 0.22), bevel(0.04, 0.035, 6));
  geo.center();
  const n = 5;
  g.pages = [];
  for (let i = 0; i < n; i++) {
    const m = new THREE.Mesh(geo, material);
    m.rotation.x = -Math.PI / 2;
    m.position.y = (i - (n - 1) / 2) * 0.24;
    g.add(m); g.pages.push(m);
  }
  g.rotation.set(0.5, -0.6, 0);
  return g;
}
// Slide the pages apart a little (0..1), like weights being paged in and out.
export function fanPages(g, k) {
  g.pages?.forEach((m, i) => { m.position.x = Math.sin(i * 1.7) * 0.32 * k; m.position.z = Math.cos(i * 1.3) * 0.18 * k; });
}

// Soft contact shadow: a blurred ellipse, no shadow maps needed.
export function contactShadow(width = 3, depth = 0.6, strength = 0.25) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, 'rgba(0,0,0,0.8)'); grd.addColorStop(0.35, 'rgba(0,0,0,0.42)');
  grd.addColorStop(0.7, 'rgba(0,0,0,0.1)'); grd.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grd; g.fillRect(0, 0, 128, 128);
  const map = new THREE.CanvasTexture(c);
  map.colorSpace = THREE.SRGBColorSpace;
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map, transparent: true, depthWrite: false, opacity: strength, toneMapped: false }));
  mesh.scale.set(width, depth * 4, 1);
  return mesh;
}

export const ease = {
  out: t => 1 - Math.pow(1 - t, 4),
  inOut: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
};
