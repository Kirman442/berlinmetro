// Пакет 2: сводка видов значений глубины по данным приложения (без браузера).
import fs from 'node:fs';
const LIB = process.argv[2] || '../../app/ubahn3d/src/lib/';
const D = process.argv[3] || '../../app/ubahn3d/public/data/';
const { prepare } = await import(LIB + 'model.js');
const { isoForYear, stateAt } = await import(LIB + 'time.js');
const j = (f) => JSON.parse(fs.readFileSync(D + f));
const d = prepare(j('network3d.json'), j('stations.geojson'), j('depth_sources.json'));
const cnt = (arr) => arr.reduce((m, s) => { const k = s.dq.kind + '/' + s.dq.prec; m[k] = (m[k] || 0) + 1; return m; }, {});
const open = d.stations.filter((s) => stateAt(s, isoForYear(2026)) === 'open');
console.log(JSON.stringify({
  all_records: d.stations.length, by_kind_all: cnt(d.stations),
  open_2026: open.length, by_kind_open_2026: cnt(open),
  seed_value_mismatch: d.stations.filter((s) => s.dq.mismatch).map((s) => s.id),
  non_point_sources: d.stations.filter((s) => s.dq.kind === 'quelle' && s.dq.prec !== 'punkt').map((s) => `${s.id} ${s.name}: ${s.dq.precision}`),
  derived: d.stations.filter((s) => s.dq.kind === 'abgeleitet').map((s) => s.id),
}, null, 1));
