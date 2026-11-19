import { formatDate, nameAt, stateAt, yearOf, INTERRUPTION_LABEL } from '../lib/time';
import { fmtM } from '../lib/colors';
import { DQ_KIND } from '../lib/model';

const Badge = ({ line, color }) => <span className="badge" style={{ background: color }}>{line}</span>;
const n1 = (v) => v.toFixed(1).replace('.', ',');
const n0 = (v) => Math.round(v).toString();
const LAGE = { Tunnel: 'Tunnel', Viadukt: 'Hochbahn (Viadukt)', Damm: 'Damm', Einschnitt: 'Einschnitt', Plan: 'ebenerdig' };

// Ein Format für Karte, Tooltip, Liste, Karte und Profil (Paket 2.1):
//   Einzelwert aus Quelle  −17 m      · ca./rund, abgeleitet, Schätzung  ≈ −17 m
//   Spanne aus Quelle      −4…−5 m   (Modell rechnet mit dem Mittel, hier −4,5 m)
const sgnM = (v) => fmtM(v);
export function depthNumber(s) {
  const dq = s.dq || {};
  if (dq.prec === 'spanne' && dq.range) {
    const sg = s.z < 0 ? -1 : 1;
    return `${sgnM(sg * dq.range[0])}…${sgnM(sg * dq.range[1])}`;
  }
  const v = Math.abs(s.z) < 0.5 ? '0' : fmtM(s.z);
  return `${s.exact ? '' : '≈ '}${v}`;
}
export const depthText = (s) => `${depthNumber(s)} m`;
// kurzer Status neben dem Wert
export function depthStatus(s) {
  const dq = s.dq || {};
  const k = DQ_KIND[dq.kind] || DQ_KIND.unbekannt;
  if (dq.kind === 'quelle') return dq.prec === 'spanne' ? `${k} · Spanne ${dq.precision}` : dq.prec === 'ca' ? `${k} · ${dq.precision}` : k;
  return k;
}

export function StationCard({ s, iso, transfers, onClose, onLine, onStation }) {
  const nameNow = nameAt(s, iso);
  const state = stateAt(s, iso);
  const pct = Math.min(100, (Math.max(0, -s.z) / 22) * 100);
  return (
    <div className="card">
      <button type="button" className="close" onClick={onClose} aria-label="Schließen">×</button>
      <div className="ttl"><Badge line={s.line} color={s.color} /><strong>{nameNow}</strong></div>
      {nameNow !== s.name && <p className="muted">heute: {s.name}</p>}
      {state === 'interrupted' && <p className="warn">Zu diesem Zeitpunkt ohne Halt</p>}
      <div className="depth">{depthNumber(s)}<small>{s.z < -0.5 ? ' m unter Geländeniveau' : s.z > 0.5 ? ' m über Geländeniveau' : ' m, auf Geländeniveau'}</small></div>
      {s.z < 0 && <div className="bar" aria-hidden="true"><span style={{ width: `${pct}%` }} /></div>}
      <p className={s.measured ? 'meta' : 'note'}>Höhenlage: {depthStatus(s)}</p>
      <dl className="facts">
        <dt>Gelände</dt><dd>{n1(s.ground)} m ü. NHN (DGM1, Modell)</dd>
        <dt>Höhenlage</dt><dd>≈ {n1(s.abs)} m ü. NHN (Modell)</dd>
        {s.situation && (<><dt>Lage</dt><dd>{LAGE[s.situation] || s.situation}</dd></>)}
        <dt>Eröffnet</dt><dd>{formatDate(s.opened)}</dd>
        {s.closed && (<><dt>Geschlossen</dt><dd>{formatDate(s.closed)}</dd></>)}
        {s.district && (<><dt>Ortsteil</dt><dd>{s.district}</dd></>)}
      </dl>
      <details className="src">
        <summary>Herkunft des Werts</summary>
        <dl className="facts">
          <dt>Art</dt><dd>{DQ_KIND[s.dq?.kind] || DQ_KIND.unbekannt}</dd>
          {s.dq?.precision && (<><dt>Genauigkeit</dt><dd>{s.dq.prec === 'spanne' ? `Spanne ${s.dq.precision}` : s.dq.precision === 'Angabe' ? 'Zahlenangabe ohne Zusatz' : s.dq.precision}</dd></>)}
          {s.dq?.reference && (<><dt>Bezug</dt><dd>{s.dq.reference} (laut Quelle)</dd></>)}
          {s.dq?.source && (<><dt>Quelle</dt><dd>{s.dq.source}</dd></>)}
          {s.dq?.prec === 'spanne' && (<><dt>Im Modell</dt><dd>{fmtM(s.z)} m (Mitte der Spanne)</dd></>)}
        </dl>
        <p className="hint small">
          {s.dq?.kind === 'quelle' && 'Zahl aus der genannten Quelle, nicht eigens gemessen. '}
          {(s.dq?.kind === 'osm' || s.dq?.kind === 'lage') && 'Für diesen Bahnhof gibt es keine Zahlenangabe; der Wert ist eine Modellschätzung. '}
          {s.dq?.kind === 'abgeleitet' && 'Aus Angaben der Quelle abgeleitet, keine direkte Zahlenangabe. '}
          Die Zahl beschreibt die Höhenlage des Bahnhofs im Modell gegenüber dem lokalen Geländeniveau (DGM1, geglättet); ob Bahnsteig, Schiene oder Bauwerk gemeint ist, ist nicht einheitlich festgelegt.
        </p>
      </details>
      {transfers.length > 0 && (
        <p className="meta">Umstieg: {transfers.map((o, i) => (
          <span key={o.id}>{i ? '; ' : ''}<button type="button" className="link" onClick={() => onStation(o.id)}>{o.line}</button> {depthText(o)}</span>
        ))}</p>
      )}
      {(s.names || []).length > 1 && (
        <>
          <h4>Namen</h4>
          <ul>{s.names.map((x) => <li key={x.name + x.valid_from}>{x.name} <span className="muted">({yearOf(x.valid_from)}–{x.valid_to ? yearOf(x.valid_to) : 'heute'})</span></li>)}</ul>
        </>
      )}
      {(s.interruptions || []).length > 0 && (
        <>
          <h4>Unterbrechungen</h4>
          <ul>{s.interruptions.map((it) => <li key={it.type + it.start}>{INTERRUPTION_LABEL[it.type] || it.type} <span className="muted">({yearOf(it.start)}–{yearOf(it.end)})</span></li>)}</ul>
        </>
      )}
      <div className="actions">
        <button type="button" className="chip" onClick={() => onLine(s.line)}>Profil {s.line}</button>
        {s.wiki_de && <a href={`https://de.wikipedia.org/wiki/${encodeURIComponent(s.wiki_de.replace(/ /g, '_'))}`} target="_blank" rel="noreferrer">Wikipedia</a>}
      </div>
    </div>
  );
}

const markKind = (s) => (s.exact ? 'exact' : s.dq?.kind === 'quelle' || s.dq?.kind === 'abgeleitet' ? 'approx' : 'est');

function niceStep(range) { for (const s of [5, 10, 20, 25, 50]) if (range / s <= 6) return s; return 100; }

function Profile({ prof, color, iso, onStation }) {
  const W = 320; const H = 190; const ml = 34; const mr = 8; const mt = 18; const mb = 24;
  const iw = W - ml - mr; const ih = H - mt - mb;
  const vals = prof.pts.flatMap((p) => [p[1], p[2]]);
  const lo = Math.min(...vals); const hi = Math.max(...vals);
  const step = niceStep(hi - lo + 10);
  const vmin = Math.floor((lo - 3) / step) * step; const vmax = Math.ceil((hi + 3) / step) * step;
  const X = (d) => ml + (d / prof.total) * iw;
  const Yv = (v) => mt + ((vmax - v) / (vmax - vmin)) * ih;
  const ground = prof.pts.map((p) => `${X(p[0]).toFixed(1)},${Yv(p[1]).toFixed(1)}`).join(' ');
  const track = prof.pts.map((p) => `${X(p[0]).toFixed(1)},${Yv(p[2]).toFixed(1)}`).join(' ');
  const grid = [];
  for (let v = vmin; v <= vmax; v += step) grid.push(v);
  const kmTot = prof.total / 1000; const kmStep = kmTot > 12 ? 5 : kmTot > 5 ? 2 : 1;
  const ticks = [];
  for (let k = 0; k <= kmTot + 1e-6; k += kmStep) ticks.push(k);
  return (
    <svg className="prof" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Längsprofil: Gelände und Modelltrasse, Höhe über NHN in Metern">
      <text className="axis-t" x={4} y={10}>Höhe über NHN (m)</text>
      {grid.map((v) => (
        <g key={v}><line className="gridl" x1={ml} x2={W - mr} y1={Yv(v)} y2={Yv(v)} /><text x={ml - 4} y={Yv(v) + 3} textAnchor="end">{v}</text></g>
      ))}
      {ticks.map((k) => <text key={k} x={X(k * 1000)} y={H - 8} textAnchor="middle">{k}</text>)}
      <text x={W - mr} y={H - 8} textAnchor="end">km</text>
      <polygon className="earth" points={`${X(0)},${Yv(vmin)} ${ground} ${X(prof.total)},${Yv(vmin)}`} />
      <polyline className="gline" points={ground} />
      <polyline fill="none" stroke={color} strokeWidth="2.2" strokeLinejoin="round" points={track} />
      {prof.marks.map((m) => {
        // gefüllt: Einzelwert aus Quelle · Ring mit Punkt: Quelle mit ca./Spanne oder abgeleitet · Ring: Modellschätzung
        const k = markKind(m.st);
        const cx = X(m.d); const cy = Yv(m.st.abs);
        return (
          <g key={m.name + m.d} className="dot" onClick={() => onStation(m.st.id)}>
            <circle cx={cx} cy={cy} r="3.6" fill={k === 'exact' ? color : 'var(--panel-solid)'} stroke={k === 'exact' ? 'var(--panel-solid)' : color} strokeWidth="1.5" />
            {k === 'approx' && <circle cx={cx} cy={cy} r="1.3" fill={color} />}
            <title>{`${nameAt(m.st, iso)}: ${depthText(m.st)} (${depthStatus(m.st)}), ≈ ${n1(m.st.abs)} m ü. NHN`}</title>
          </g>
        );
      })}
    </svg>
  );
}

export function LineCard({ line, color, stations, prof, iso, hidden, year, onShow, onClose, onStation }) {
  // Kennzahlen beziehen sich auf die Bahnhöfe der Linie im gewählten Jahr (nicht auf alle Punkte der Trasse)
  const nodes = new Set(stations.map((s) => s.node)).size;
  const under = stations.filter((s) => s.z < -0.5);
  const deepest = under.reduce((m, s) => (!m || s.z < m.z ? s : m), null);
  const avg = under.length ? under.reduce((a, s) => a - s.z, 0) / under.length : 0;
  const avgApprox = under.some((s) => !s.exact);
  const lowest = stations.reduce((m, s) => (!m || s.abs < m.abs ? s : m), null);
  const gr = stations.map((s) => s.ground);
  const cnt = { exact: 0, approx: 0, est: 0 };
  stations.forEach((s) => { cnt[markKind(s)]++; });
  return (
    <div className="card">
      <button type="button" className="close" onClick={onClose} aria-label="Schließen">×</button>
      <div className="ttl"><Badge line={line} color={color} /><strong>Linie {line}</strong></div>
      {hidden ? (
        <div className="note-row"><p className="note">Linie {line} ist ausgeblendet.</p><button type="button" className="chip" onClick={onShow}>Linie {line} einblenden</button></div>
      ) : !stations.length ? <p className="muted">Im Jahr {year} noch nicht in Betrieb.</p> : (
        <>
          <dl className="facts">
            <dt>Bahnhöfe</dt><dd>{nodes}{nodes !== stations.length && <span className="muted"> ({stations.length} Bahnsteig-/Ebenen-Einträge)</span>}</dd>
            {prof && (<><dt>Länge</dt><dd>{(prof.total / 1000).toFixed(1).replace('.', ',')} km (Hauptstrecke im Profil)</dd></>)}
            {deepest && (<><dt>Tiefste Station</dt><dd><button type="button" className="link" onClick={() => onStation(deepest.id)}>{nameAt(deepest, iso)}</button>, {depthText(deepest)}</dd></>)}
            {deepest && (<><dt>Ø Tiefe</dt><dd>{avgApprox ? '≈ ' : ''}{n1(avg)} m <span className="muted">({under.length} Einträge unter Geländeniveau)</span></dd></>)}
            <dt>Niedrigste Station</dt><dd>{nameAt(lowest, iso)}, ≈ {n0(lowest.abs)} m ü. NHN (absolut)</dd>
            <dt>Gelände (Stationen)</dt><dd>{n0(Math.min(...gr))}–{n0(Math.max(...gr))} m ü. NHN</dd>
          </dl>
          {prof && <Profile prof={prof} color={color} iso={iso} onStation={onStation} />}
          <div className="legend-mini">
            <span><i className="earth-sw" />Gelände (DGM1, geglättet)</span>
            <span><i style={{ background: color }} />Modelltrasse</span>
          </div>
          <div className="legend-mini">
            <span><i className="dotk" style={{ background: color, borderColor: color }} />Quellenangabe ({cnt.exact})</span>
            <span><i className="dotk ap" style={{ borderColor: color, '--c': color }} />ca./Spanne/abgeleitet ({cnt.approx})</span>
            <span><i className="dotk" style={{ borderColor: color }} />Modellschätzung ({cnt.est})</span>
          </div>
          <p className="hint small">Profil der längsten durchgehenden Strecke; Trasse zwischen den Bahnhöfen interpoliert und geglättet, kein Gleisplan.</p>
        </>
      )}
    </div>
  );
}
