import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Подписи — DOM поверх холста. Ничего не скрываем: подписи могут накладываться,
// ближняя к камере лежит сверху (z-index), как в 3d-metro. Набор меняется только
// от настроек (режим подписей, год, выбор), а не от движения камеры.
export default function Labels({ items, overlay }) {
  const { camera, size } = useThree();
  const els = useRef([]);
  const v = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const root = overlay.current;
    if (!root) return undefined;
    const old = new Map(els.current.map((e) => [e.key, e]));
    els.current = items.map((it) => {
      let e = old.get(it.key);
      if (e) old.delete(it.key);
      else { e = { key: it.key, el: document.createElement('div'), shown: false }; e.el.style.display = 'none'; root.appendChild(e.el); }
      e.el.className = `lbl${it.ghost ? ' ghost' : ''}${it.strong ? ' strong' : ''}`;
      e.el.style.setProperty('--c', it.color);
      e.el.innerHTML = `${it.text}${it.depth ? `<b>${it.depth}</b>` : ''}`;
      e.it = it;
      return e;
    });
    old.forEach((e) => e.el.remove());
    return undefined;
  }, [items, overlay]);

  useEffect(() => () => { els.current.forEach((e) => e.el.remove()); els.current = []; }, []);

  useFrame(() => {
    const W = size.width; const H = size.height;
    for (const e of els.current) {
      const { it } = e;
      v.set(it.x, it.y, it.z);
      const dist = v.distanceTo(camera.position);
      v.project(camera);
      const on = v.z < 1 && v.z > -1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1;
      if (on !== e.shown) { e.el.style.display = on ? 'block' : 'none'; e.shown = on; }
      if (!on) continue;
      e.el.style.transform = `translate(${(((v.x + 1) / 2) * W).toFixed(1)}px, ${(((1 - v.y) / 2) * H).toFixed(1)}px) translate(-50%, -135%)`;
      e.el.style.zIndex = String(it.strong ? 200000 : Math.max(1, 100000 - Math.round(dist / 5)));
    }
  });

  return null;
}
