import fs from 'node:fs';
import { prepare, isUnderground } from '/home/user/ubahn3d/src/lib/model.js';
import { isoForYear, stateAt } from '/home/user/ubahn3d/src/lib/time.js';
const D = '/home/user/ubahn3d/public/data/';
const d = prepare(JSON.parse(fs.readFileSync(D + 'network3d.json')), JSON.parse(fs.readFileSync(D + 'stations.geojson')));
const out = {};
for (const y of [new Date().getFullYear(), 1902, 1900]) {
  const iso = isoForYear(y);
  const open = d.stations.filter((s) => stateAt(s, iso) === 'open');
  const oldKeys = new Set(open.map((s) => s.wikidata || s.name));
  const nodes = new Set(open.map((s) => s.node));
  const byLine = {};
  for (const s of open) { (byLine[s.line] ||= { rec: 0, nodes: new Set() }).rec++; byLine[s.line].nodes.add(s.node); }
  out[y] = { records: open.length, oldCounter: oldKeys.size, nodes: nodes.size, byLine: Object.fromEntries(Object.entries(byLine).map(([k, v]) => [k, `${v.rec}/${v.nodes.size}`])) };
}
out.nolle = d.stations.filter((s) => /Nollendorf|Schloßstraße|Jungfernheide/.test(s.name)).map((s) => `${s.id}:${s.node}`);
out.underground = d.stations.filter(isUnderground).length;
console.log(JSON.stringify(out, null, 1));
