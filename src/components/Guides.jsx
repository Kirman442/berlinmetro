import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { H0 } from '../lib/model';

// Текст как спрайт в сцене (не дёргается, масштабируется вместе со сценой)
function textSprite(text, color, px = 22, worldH = 260) {
  const c = document.createElement('canvas');
  const g = c.getContext('2d');
  const font = `600 ${px * 2}px system-ui, "Segoe UI", sans-serif`;
  g.font = font;
  const w = Math.ceil(g.measureText(text).width) + 16;
  c.width = w; c.height = Math.ceil(px * 2.6);
  g.font = font; g.fillStyle = color; g.textBaseline = 'middle'; g.fillText(text, 8, c.height / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  sp.scale.set((w / c.height) * worldH, worldH, 1);
  sp.center.set(1, 0.5);
  return sp;
}

const OCHRE = '#B7762C';

export default function Guides({ extent, mode, exag, showGrid, showLevels }) {
  const group = useMemo(() => {
    const G = new THREE.Group();
    const { x0, x1, z0, z1 } = extent;
    const w = x1 - x0; const h = z1 - z0; const cx = (x0 + x1) / 2; const cz = (z0 + z1) / 2;
    const Yrel = (m) => m * exag;
    const Yabs = (a) => (a - H0) * exag;

    if (showGrid) {
      const step = 1000;
      const size = Math.ceil(Math.max(w, h) / step) * step;
      const grid = new THREE.GridHelper(size, size / step, '#9AA4AE', '#9AA4AE');
      grid.position.set(cx, mode === 'abs' ? 0 : 0, cz);
      grid.material.transparent = true; grid.material.opacity = mode === 'abs' ? 0.18 : 0.35; grid.material.depthWrite = false;
      G.add(grid);
      const n = textSprite('N ↑', '#5A636E', 22, 420); n.center.set(0.5, 0.5); n.position.set(cx, 0, z0 - 600); G.add(n);
      const sc = textSprite(mode === 'abs' ? `Raster 1 km · Ebene ${H0} m ü. NHN` : 'Raster 1 km · Geländeniveau', '#8C959F', 18, 220);
      sc.center.set(0, 0.5); sc.position.set(x0, 0, z1 + 400); G.add(sc);
    }

    if (showLevels) {
      const levels = mode === 'abs'
        ? [20, 30, 50].map((a) => [Yabs(a), `${a} m ü. NHN`])
        : [-10, -20].map((m) => [Yrel(m), `${m} m`.replace('-', '−')]);
      const col = new THREE.Color(OCHRE);
      levels.forEach(([y, label]) => {
        const pts = [[x0, z0], [x1, z0], [x1, z1], [x0, z1], [x0, z0]].map(([x, z]) => new THREE.Vector3(x, y, z));
        const ln = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),
          new THREE.LineDashedMaterial({ color: col, dashSize: 400, gapSize: 300, transparent: true, opacity: 0.6 }));
        ln.computeLineDistances(); G.add(ln);
        const pl = new THREE.Mesh(new THREE.PlaneGeometry(w, h),
          new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.03, side: THREE.DoubleSide, depthWrite: false }));
        pl.rotation.x = -Math.PI / 2; pl.position.set(cx, y, cz); G.add(pl);
        const s = textSprite(label, OCHRE, 20, 240); s.position.set(x0 - 120, y, z1); G.add(s);
      });
      // линейка в углу: каждые 5 м
      const [top, bottom, Y] = mode === 'abs' ? [60, 15, Yabs] : [0, -25, Yrel];
      const tick = [];
      for (let m = top; m >= bottom; m -= 5) tick.push(new THREE.Vector3(x0, Y(m), z1), new THREE.Vector3(x0 + (m % 10 ? 150 : 300), Y(m), z1));
      tick.push(new THREE.Vector3(x0, Y(top), z1), new THREE.Vector3(x0, Y(bottom), z1));
      G.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(tick), new THREE.LineBasicMaterial({ color: OCHRE })));
      const tb = textSprite(mode === 'abs' ? `${bottom} m ü. NHN` : `−${-bottom} m`, OCHRE, 18, 220); tb.position.set(x0 - 120, Y(bottom), z1); G.add(tb);
      if (mode === 'abs') { const tt = textSprite(`${top} m ü. NHN`, OCHRE, 18, 220); tt.position.set(x0 - 120, Y(top), z1); G.add(tt); }
    }
    return G;
  }, [extent, mode, exag, showGrid, showLevels]);

  useEffect(() => () => group.traverse((o) => {
    o.geometry?.dispose();
    if (o.material) { o.material.map?.dispose(); o.material.dispose(); }
  }), [group]);

  return <primitive object={group} />;
}
