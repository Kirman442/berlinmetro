import { toXZ } from './geo';
import { LINE_COLOR } from './config';
import { sectionOpenAt } from './time';

// Опорная высота для режима «абсолютно» (м ü. NHN): примерно средний уровень улиц Берлина
export const H0 = 35;
export const DEPTH_MAX = 22;   // для шкалы цвета «по глубине»

// network3d.json: станции z (м относительно поверхности), ground (DGM1, м NHN);
// участки xyz [lon, lat, z относительно g], g — рельеф DGM1 в каждой точке (модель v4)
// Herkunft und Genauigkeit eines Tiefenwerts (Paket 2). Quelle: depth_sources.json aus depths_seed_v2.csv.
//   kind: 'quelle' (numerische Angabe einer Quelle), 'abgeleitet' (aus einer Quelle abgeleitet),
//         'osm' (Modellschätzung aus OSM-Ebenenangabe), 'lage' (Modellschätzung nach Bauart/Lage)
//   prec: 'punkt' (Einzelwert), 'ca' (ca./rund), 'spanne' (z. B. 4–5 m), 'schaetzung'
// Es wird keine Fehlergröße erfunden; fehlt eine Angabe, bleibt das Feld leer.
export const DQ_KIND = {
  quelle: 'Quellenangabe',
  abgeleitet: 'abgeleitet',
  osm: 'Modellschätzung (OSM-Ebene)',
  lage: 'Modellschätzung (nach Lage/Bauart)',
  unbekannt: 'Herkunft unbekannt',
};
export function depthQuality(s, entry) {
  const src = s.src || '';
  if (entry && /gemessen/.test(src)) {
    const m = entry.precision.match(/(\d+(?:[.,]\d+)?)\s*[–-]\s*(\d+(?:[.,]\d+)?)/);
    const range = m ? [Number(m[1].replace(',', '.')), Number(m[2].replace(',', '.'))] : null;
    const prec = range ? 'spanne' : /^(ca\.?|rund|etwa)$/i.test(entry.precision) ? 'ca' : 'punkt';
    return {
      kind: 'quelle', prec, range, precision: entry.precision, reference: entry.reference, source: entry.source,
      mismatch: Math.abs(entry.depth_m - s.z) > 0.05,
    };
  }
  if (/abgeleitet/.test(src)) return { kind: 'abgeleitet', prec: 'ca', source: src.replace(/^abgeleitet\s*/, '').replace(/[()]/g, '') || null };
  if (/OSM/.test(src)) return { kind: 'osm', prec: 'schaetzung' };
  if (/Lage/.test(src)) return { kind: 'lage', prec: 'schaetzung' };
  return { kind: /gemessen/.test(src) ? 'quelle' : 'unbekannt', prec: 'schaetzung' };
}

export function prepare(net, geo, sources) {
  const props = Object.fromEntries(geo.features.map((f) => [f.properties.id, f.properties]));
  const seed = sources?.entries || {};
  const stations = net.stations.map((s) => {
    const [x, zz] = toXZ(s.lon, s.lat);
    const p = props[s.id] || {};
    const dq = depthQuality(s, seed[`${s.line}|${s.name}`]);
    return {
      ...p, ...s, x, zz, color: LINE_COLOR[s.line],
      abs: s.ground + s.z,
      dq,
      // measured: es gibt eine Quellenangabe (nicht: instrumentell gemessen); exact: Einzelwert ohne ca./Spanne
      measured: dq.kind === 'quelle',
      exact: dq.kind === 'quelle' && dq.prec === 'punkt',
    };
  });
  const sections = net.sections.map((s, i) => {
    const pts = s.xyz.map(([lon, lat, z], k) => { const [x, zz] = toXZ(lon, lat); return { x, zz, z, g: s.g[k], gd: s.g_dgm ? s.g_dgm[k] : s.g[k] }; });
    let len = 0;
    const dist = [0];
    for (let k = 1; k < pts.length; k++) { len += Math.hypot(pts[k].x - pts[k - 1].x, pts[k].zz - pts[k - 1].zz); dist.push(len); }
    const zs = pts.map((p) => p.z);
    return { ...s, i, pts, dist, color: LINE_COLOR[s.line], length_m: len, zmin: Math.min(...zs), zmax: Math.max(...zs) };
  });
  assignNodes(stations);
  // пересадки: станции разных линий ближе 300 м
  const transfers = [];
  for (let a = 0; a < stations.length; a++) {
    for (let b = a + 1; b < stations.length; b++) {
      const A = stations[a]; const B = stations[b];
      if (A.line === B.line) continue;
      if (Math.hypot(A.x - B.x, A.zz - B.zz) < 300) transfers.push([A.id, B.id]);
    }
  }
  return { stations, sections, transfers };
}

// Станционный узел (Bahnhof) ≠ запись линии/уровня. Записи объединяются в один узел, если у них
// одинаковый Wikidata ID или одинаковое название и расстояние ≤ NODE_RADIUS (напр. U1-Nu Nollendorfplatz
// без wikidata). Объединение транзитивное (union-find), не зависит от порядка записей. Имя без близости
// и близость без имени не объединяют. Уровни не сливаются — меняется только ключ `node` для подсчёта.
// (Сведено с сохранённым вариантом ветки ubahn3d-fremd-2026-11-19; на текущих данных оба дают одинаковые группы.)
export const NODE_RADIUS = 500;
export function assignNodes(stations) {
  const parent = stations.map((_, i) => i);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const union = (a, b) => { const ra = find(a); const rb = find(b); if (ra !== rb) parent[Math.max(ra, rb)] = Math.min(ra, rb); };
  for (let a = 0; a < stations.length; a++) {
    for (let b = a + 1; b < stations.length; b++) {
      const A = stations[a]; const B = stations[b];
      if (A.wikidata && A.wikidata === B.wikidata) union(a, b);
      else if (A.name === B.name && Math.hypot(A.x - B.x, A.zz - B.zz) <= NODE_RADIUS) union(a, b);
    }
  }
  stations.forEach((s, i) => { const r = stations[find(i)]; s.node = r.wikidata ? `wd:${r.wikidata}` : `id:${r.id}`; });
  return stations;
}

// подземная станция: глубже уровня улицы и в тоннеле (Einschnitt — открытая выемка, не подземная)
export const isUnderground = (s) => s.z < 0 && (/Tunnel/.test(s.situation || '') || !s.situation);

// высота в сцене
export const makeY = (mode, exag) => (mode === 'abs'
  ? (rel, ground) => (ground + rel - H0) * exag
  : (rel) => rel * exag);
export const surfaceY = (mode, exag) => (mode === 'abs' ? (ground) => (ground - H0) * exag : () => 0);

// Линия на дату: цепочка открытых участков от одного конца до другого (самая длинная)
export function lineChain(sections, line, iso, hidden) {
  const segs = sections.filter((s) => s.line === line && sectionOpenAt(s, iso) && !hidden?.has(line));
  if (!segs.length) return null;
  const adj = new Map();
  const add = (n, e) => { if (!adj.has(n)) adj.set(n, []); adj.get(n).push(e); };
  segs.forEach((s) => { add(s.from, { s, to: s.to, rev: false }); add(s.to, { s, to: s.from, rev: true }); });
  let best = [];
  const dfs = (node, used, path, len) => {
    let ext = false;
    for (const e of adj.get(node) || []) {
      if (used.has(e.s)) continue;
      ext = true;
      used.add(e.s); path.push(e);
      dfs(e.to, used, path, len + e.s.length_m);
      path.pop(); used.delete(e.s);
    }
    if (!ext && len > (best.len || 0)) { best = [...path]; best.len = len; }
  };
  const ends = [...adj.keys()].filter((n) => adj.get(n).length === 1);
  (ends.length ? ends : [...adj.keys()]).forEach((n) => dfs(n, new Set(), [], 0));
  return best;
}

// Профиль линии: точки [расстояние м, рельеф NHN, путь NHN] и станции по пути
export function lineProfile(chain, stations) {
  const pts = [];
  const marks = [];
  let off = 0;
  chain.forEach((e, k) => {
    const s = e.s;
    const P = e.rev ? [...s.pts].reverse() : s.pts;
    const D = e.rev ? s.dist.map((d) => s.length_m - d).reverse() : s.dist;
    P.forEach((p, j) => { if (k && !j) return; pts.push([off + D[j], p.gd, p.g + p.z]); });
    const from = e.rev ? s.to : s.from;
    if (!k) marks.push({ name: from, d: off });
    off += s.length_m;
    marks.push({ name: e.to, d: off });
  });
  const line = chain[0].s.line;
  const byName = Object.fromEntries(stations.filter((s) => s.line === line).map((s) => [s.name, s]));
  return { pts, marks: marks.map((m) => ({ ...m, st: byName[m.name] })).filter((m) => m.st), total: off };
}
