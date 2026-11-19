import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { TUBE_RADIUS, STATION_RADIUS } from '../lib/config';
import { depthColor } from '../lib/colors';

const sphere = new THREE.SphereGeometry(STATION_RADIUS, 20, 14);
const ring = new THREE.TorusGeometry(STATION_RADIUS * 1.35, STATION_RADIUS * 0.16, 8, 40);
ring.rotateX(Math.PI / 2);
const selRing = new THREE.TorusGeometry(STATION_RADIUS * 1.9, STATION_RADIUS * 0.14, 8, 48);
selRing.rotateX(Math.PI / 2);

const useDispose = (objs) => useEffect(() => () => [].concat(objs).forEach((o) => o?.dispose?.()), [objs]);

// ---------- трубки участков ----------
function tubeGeometry(sec, Y, colorDepth) {
  const pts = [];
  const rel = [];
  const dist = [];
  for (let k = 0; k < sec.pts.length; k++) {
    const p = sec.pts[k];
    const v = new THREE.Vector3(p.x, Y(p.z, p.g), p.zz);
    if (pts.length && v.distanceTo(pts[pts.length - 1]) < 2) continue;
    pts.push(v); rel.push(p.z); dist.push(sec.dist[k]);
  }
  if (pts.length < 2) return null;
  const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal');
  const segs = Math.min(1500, Math.max(8, Math.round(sec.length_m / 12)));
  const radial = 8;
  const geo = new THREE.TubeGeometry(curve, segs, TUBE_RADIUS, radial, false);
  if (colorDepth) {
    // глубина вдоль трубки: интерполяция по пройденному расстоянию
    const cols = [];
    let j = 0;
    const L = dist[dist.length - 1] || 1;
    for (let i = 0; i <= segs; i++) {
      const d = (i / segs) * L;
      while (j < dist.length - 2 && dist[j + 1] < d) j++;
      const t = Math.min(1, Math.max(0, (d - dist[j]) / ((dist[j + 1] - dist[j]) || 1)));
      const c = depthColor(rel[j] + (rel[j + 1] - rel[j]) * t);
      for (let r = 0; r <= radial; r++) cols.push(c.r, c.g, c.b);
    }
    geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  }
  return geo;
}

export function Tubes({ sections, visible, Y, colorMode, focusLine, onHover, onPick }) {
  const geoms = useMemo(() => sections.map((s) => tubeGeometry(s, Y, colorMode === 'depth')), [sections, Y, colorMode]);
  useDispose(geoms);
  const mats = useMemo(() => {
    const m = {};
    const make = (key, opts) => { m[key] = new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.05, ...opts }); };
    sections.forEach((s) => {
      const c = new THREE.Color(s.color);
      make(`${s.line}`, colorMode === 'depth' ? { vertexColors: true } : { color: c, emissive: c, emissiveIntensity: 0.12 });
      make(`${s.line}-f`, { ...(colorMode === 'depth' ? { vertexColors: true } : { color: c }), transparent: true, opacity: 0.12, depthWrite: false });
    });
    return m;
  }, [sections, colorMode]);
  useDispose(Object.values(mats));

  return (
    <group>
      {sections.map((s, i) => geoms[i] && (
        <mesh
          key={i}
          geometry={geoms[i]}
          material={mats[focusLine && focusLine !== s.line ? `${s.line}-f` : s.line]}
          visible={visible[i]}
          onPointerMove={(e) => { if (!visible[i]) return; e.stopPropagation(); onHover({ kind: 'line', line: s.line, section: s, x: e.clientX, y: e.clientY }); }}
          onPointerOut={() => onHover(null)}
          onClick={(e) => { if (!visible[i] || e.delta > 5) return; e.stopPropagation(); onPick({ kind: 'line', line: s.line }); }}
        />
      ))}
    </group>
  );
}

// ---------- станции ----------
export function Stations({ stations, Y, colorMode, focusLine, selectedId, onHover, onPick }) {
  const mats = useMemo(() => {
    const cache = new Map();
    return (s, faded) => {
      const ghost = s.state === 'interrupted';
      const c = colorMode === 'depth' ? depthColor(s.z) : new THREE.Color(s.color);
      const key = `${c.getHexString()}|${ghost}|${faded}`;
      if (!cache.has(key)) {
        const op = faded ? 0.15 : ghost ? 0.3 : 1;
        cache.set(key, new THREE.MeshStandardMaterial({
          color: ghost ? '#ffffff' : c, emissive: c, emissiveIntensity: 0.18, roughness: 0.4,
          transparent: op < 1, opacity: op, depthWrite: op === 1,
        }));
      }
      return cache.get(key);
    };
  }, [colorMode]);
  const ringMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#B7762C' }), []);

  return (
    <group>
      {stations.map((s) => {
        const faded = !!focusLine && focusLine !== s.line;
        const ghost = s.state === 'interrupted';
        return (
          <group key={s.id} position={[s.x, Y(s.z, s.ground), s.zz]}>
            <mesh
              geometry={sphere}
              material={mats(s, faded)}
              userData={{ id: s.id }}
              onPointerMove={(e) => { e.stopPropagation(); onHover({ kind: 'station', id: s.id, x: e.clientX, y: e.clientY }); }}
              onPointerOut={() => onHover(null)}
              onClick={(e) => { if (e.delta > 5) return; e.stopPropagation(); onPick({ kind: 'station', id: s.id }); }}
            />
            {ghost && <mesh geometry={ring} raycast={() => null}><meshBasicMaterial color={s.color} /></mesh>}
            {selectedId === s.id && <mesh geometry={selRing} material={ringMat} raycast={() => null} />}
          </group>
        );
      })}
    </group>
  );
}

// ---------- шахты (станция ↔ поверхность) и точки на поверхности ----------
export function Shafts({ stations, Y, SY }) {
  const [lines, dots] = useMemo(() => {
    const a = [];
    const d = [];
    stations.forEach((s) => {
      const top = SY(s.ground);
      if (s.z < 0) a.push(s.x, top, s.zz, s.x, Y(s.z, s.ground), s.zz);
      d.push(s.x, top + 1, s.zz);
    });
    const g1 = new THREE.BufferGeometry(); g1.setAttribute('position', new THREE.Float32BufferAttribute(a, 3));
    const g2 = new THREE.BufferGeometry(); g2.setAttribute('position', new THREE.Float32BufferAttribute(d, 3));
    return [g1, g2];
  }, [stations, Y, SY]);
  useDispose([lines, dots]);
  return (
    <group>
      <lineSegments geometry={lines}><lineBasicMaterial color="#5A636E" transparent opacity={0.4} /></lineSegments>
      <points geometry={dots}><pointsMaterial color="#5A636E" size={4} sizeAttenuation={false} transparent opacity={0.6} /></points>
    </group>
  );
}

// ---------- пересадки (пунктир между станциями узла) ----------
export function Transfers({ pairs, byId, Y }) {
  const geo = useMemo(() => {
    const a = [];
    pairs.forEach(([i, j]) => {
      const A = byId[i]; const B = byId[j];
      if (!A || !B) return;
      a.push(A.x, Y(A.z, A.ground), A.zz, B.x, Y(B.z, B.ground), B.zz);
    });
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(a, 3));
    return g;
  }, [pairs, byId, Y]);
  useDispose(geo);
  return (
    <lineSegments geometry={geo} onUpdate={(l) => l.computeLineDistances()}>
      <lineDashedMaterial color="#1A1E23" dashSize={40} gapSize={30} transparent opacity={0.55} />
    </lineSegments>
  );
}

// ---------- поверхность над трассами в режиме «абсолютно» (рельеф DGM1 вдоль линий) ----------
export function SurfaceTraces({ sections, visible, SY }) {
  const geo = useMemo(() => {
    const a = [];
    sections.forEach((s, i) => {
      if (!visible[i]) return;
      for (let k = 1; k < s.pts.length; k++) {
        const p = s.pts[k - 1]; const q = s.pts[k];
        a.push(p.x, SY(p.gd), p.zz, q.x, SY(q.gd), q.zz);
      }
    });
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(a, 3));
    return g;
  }, [sections, visible, SY]);
  useDispose(geo);
  return <lineSegments geometry={geo}><lineBasicMaterial color="#8C7A5E" transparent opacity={0.7} /></lineSegments>;
}
