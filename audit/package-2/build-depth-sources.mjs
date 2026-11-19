// Пакет 2: переносит reference / precision / source из depth\depths_seed_v2.csv в приложение.
// Запуск из M:\projekte\Berlin metro\ubahn-data:
//   node audit\package-2\build-depth-sources.mjs depth\depths_seed_v2.csv app\ubahn3d\public\data\depth_sources.json
// Ничего не вычисляет и не дополняет: строки без числа (Osloer Straße, «nur Klasse») пропускаются.
import fs from 'node:fs';
const [, , inCsv, outJson] = process.argv;
const rows = fs.readFileSync(inCsv, 'utf8').replace(/^\uFEFF/, '').trim().split(/\r?\n/).map((l) => l.split(';'));
const head = rows.shift();
const col = Object.fromEntries(head.map((h, i) => [h.trim(), i]));
const out = {};
for (const r of rows) {
  const v = (k) => (r[col[k]] ?? '').trim();
  if (!v('depth_m')) continue;
  out[`${v('line')}|${v('name')}`] = { depth_m: Number(v('depth_m')), reference: v('reference'), precision: v('precision'), source: v('source') };
}
fs.writeFileSync(outJson, JSON.stringify({ from: 'depth/depths_seed_v2.csv', entries: out }, null, 1) + '\n');
console.log(`${Object.keys(out).length} Einträge → ${outJson}`);
