import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import maplibregl from 'maplibre-gl';
import { fromXZ } from '../lib/geo';

// Схема города на поверхности (как «схема» у 3d-metro): только вода, зелень и главные улицы
// из berlin.pmtiles, без подписей. Рендерится один раз невидимой картой MapLibre в текстуру.
const TILES = `${window.location.origin}/tiles/berlin.pmtiles`;
const GREEN = ['park', 'forest', 'wood', 'grass', 'cemetery', 'garden', 'nature_reserve', 'golf_course', 'allotments', 'meadow', 'recreation_ground', 'playground'];
const STYLE = {
  version: 8,
  sources: { pm: { type: 'vector', url: `pmtiles://${TILES}` } },
  layers: [
    { id: 'bg', type: 'background', paint: { 'background-color': '#D9DDE0' } },
    { id: 'green', type: 'fill', source: 'pm', 'source-layer': 'landuse', filter: ['in', ['get', 'kind'], ['literal', GREEN]], paint: { 'fill-color': '#CBD5C7' } },
    { id: 'water', type: 'fill', source: 'pm', 'source-layer': 'water', filter: ['==', ['geometry-type'], 'Polygon'], paint: { 'fill-color': '#6E98C2' } },
    { id: 'waterline', type: 'line', source: 'pm', 'source-layer': 'water', filter: ['==', ['geometry-type'], 'LineString'],
      paint: { 'line-color': '#6E98C2', 'line-width': ['match', ['get', 'kind'], 'river', 14, 'canal', 9, 'stream', 3, 0] } },
    { id: 'watershore', type: 'line', source: 'pm', 'source-layer': 'water', filter: ['==', ['geometry-type'], 'Polygon'],
      paint: { 'line-color': '#6E98C2', 'line-width': 4 } },
    { id: 'minor', type: 'line', source: 'pm', 'source-layer': 'roads', filter: ['in', ['get', 'kind'], ['literal', ['medium_road']]],
      paint: { 'line-color': '#D0D0CB', 'line-width': 1.2 } },
    { id: 'major', type: 'line', source: 'pm', 'source-layer': 'roads', filter: ['in', ['get', 'kind'], ['literal', ['major_road', 'highway']]],
      paint: { 'line-color': '#C2B9A8', 'line-width': ['match', ['get', 'kind'], 'highway', 4, 2.6] } },
    { id: 'rail', type: 'line', source: 'pm', 'source-layer': 'roads', filter: ['==', ['get', 'kind'], 'rail'],
      paint: { 'line-color': '#C2C6CA', 'line-width': 1, 'line-dasharray': [3, 2] } },
  ],
};

const merc = (lon, lat) => maplibregl.MercatorCoordinate.fromLngLat([lon, lat]);

function renderTexture(bbox, maxPx = 4096) {
  const m0 = merc(bbox.west, bbox.north); const m1 = merc(bbox.east, bbox.south);
  const mw = m1.x - m0.x; const mh = m1.y - m0.y;
  const W = maxPx; const zoom = Math.log2(W / (mw * 512)); const H = Math.round(mh * 512 * 2 ** zoom);
  const center = new maplibregl.MercatorCoordinate((m0.x + m1.x) / 2, (m0.y + m1.y) / 2).toLngLat();
  const div = document.createElement('div');
  Object.assign(div.style, { position: 'fixed', left: '-20000px', top: '0', width: `${W}px`, height: `${H}px`, pointerEvents: 'none' });
  document.body.appendChild(div);
  return new Promise((resolve) => {
    const map = new maplibregl.Map({
      container: div, style: STYLE, center, zoom, pixelRatio: 1, interactive: false, attributionControl: false,
      fadeDuration: 0, maxCanvasSize: [W, W], canvasContextAttributes: { preserveDrawingBuffer: true, antialias: true },
    });
    let done = false;
    const finish = (ok) => {
      if (done) return; done = true;
      const c = document.createElement('canvas'); c.width = W; c.height = H;
      if (ok) c.getContext('2d').drawImage(map.getCanvas(), 0, 0, W, H);
      map.remove(); div.remove();
      window.__surface = { W, H, ok };
      resolve(ok ? { canvas: c, m0, m1 } : null);
    };
    map.on('error', (e) => console.warn('Oberfläche:', e.error?.message || e));
    map.once('idle', () => finish(true));
    setTimeout(() => finish(false), 45000);
  });
}

function planeGeometry(extent, m0, m1, n = 40) {
  const pos = []; const uv = []; const idx = [];
  for (let j = 0; j <= n; j++) {
    for (let i = 0; i <= n; i++) {
      const x = extent.x0 + ((extent.x1 - extent.x0) * i) / n;
      const z = extent.z0 + ((extent.z1 - extent.z0) * j) / n;
      pos.push(x, 0, z);
      if (m0) { const [lon, lat] = fromXZ(x, z); const m = merc(lon, lat); uv.push((m.x - m0.x) / (m1.x - m0.x), (m1.y - m.y) / (m1.y - m0.y)); } else uv.push(i / n, 1 - j / n);
    }
  }
  // треугольники против часовой стрелки при взгляде сверху → лицевая сторона смотрит вверх
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const a = j * (n + 1) + i; idx.push(a, a + n + 1, a + 1, a + 1, a + n + 1, a + n + 2); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx); g.computeVertexNormals();
  return g;
}

const EARTH = '#8A6A45';

export default function Surface({ extent, kind, opacity, depthBottom }) {
  const [tex, setTex] = useState(null);
  const bbox = useMemo(() => {
    const [west, north] = fromXZ(extent.x0, extent.z0); const [east, south] = fromXZ(extent.x1, extent.z1);
    return { west, north, east, south };
  }, [extent]);

  useEffect(() => {
    if (kind !== 'map' || tex) return undefined;
    let alive = true;
    renderTexture(bbox).then((r) => {
      if (!alive || !r) return;
      const t = new THREE.CanvasTexture(r.canvas);
      t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
      setTex({ t, m0: r.m0, m1: r.m1 });
    });
    return () => { alive = false; };
  }, [kind, bbox, tex]);

  const geo = useMemo(() => planeGeometry(extent, tex?.m0, tex?.m1), [extent, tex]);
  useEffect(() => () => geo.dispose(), [geo]);

  // срез грунта по краям: от улицы (0) до самой нижней отметки
  const walls = useMemo(() => {
    const { x0, x1, z0, z1 } = extent; const y1 = depthBottom;
    const q = (ax, az, bx, bz) => [ax, 0, az, bx, 0, bz, bx, y1, bz, ax, 0, az, bx, y1, bz, ax, y1, az];
    const pos = [...q(x0, z0, x1, z0), ...q(x1, z0, x1, z1), ...q(x1, z1, x0, z1), ...q(x0, z1, x0, z0)];
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const edge = [x0, 0, z0, x1, 0, z0, x1, 0, z0, x1, 0, z1, x1, 0, z1, x0, 0, z1, x0, 0, z1, x0, 0, z0];
    const e = new THREE.BufferGeometry(); e.setAttribute('position', new THREE.Float32BufferAttribute(edge, 3));
    return { g, e };
  }, [extent, depthBottom]);
  useEffect(() => () => { walls.g.dispose(); walls.e.dispose(); }, [walls]);

  if (kind === 'off') return null;
  const map = kind === 'map' && tex ? tex.t : null;
  return (
    <group>
      {/* сверху: схема города */}
      <mesh geometry={geo} renderOrder={1}>
        <meshBasicMaterial key={map ? map.uuid : "plain"} map={map} color={map ? '#ffffff' : '#D9DDE0'} transparent opacity={opacity} depthWrite={false} side={THREE.FrontSide} toneMapped={false} />
      </mesh>
      {/* снизу: земляной «потолок» — та же схема, тонированная в цвет грунта */}
      <mesh geometry={geo} renderOrder={1}>
        <meshBasicMaterial key={map ? map.uuid : "plain"} map={map} color={EARTH} transparent opacity={Math.min(1, opacity * 0.85)} depthWrite={false} side={THREE.BackSide} toneMapped={false} />
      </mesh>
      <mesh geometry={walls.g} renderOrder={0}>
        <meshBasicMaterial color={EARTH} transparent opacity={0.07} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={walls.e}><lineBasicMaterial color={EARTH} transparent opacity={0.8} /></lineSegments>
    </group>
  );
}
