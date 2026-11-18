import { LINES, BASEMAPS } from '../lib/config';

export default function Legend({ stats, hiddenLines, toggleLine, basemap, setBasemap }) {
  return (
    <div className="legend">
      <h2>U-Bahn-Linien</h2>
      <ul className="lines">
        {LINES.map((l) => {
          const off = hiddenLines.has(l.id);
          const n = stats.byLine[l.id] || 0;
          return (
            <li key={l.id}>
              <button type="button" className={off ? 'off' : ''} onClick={() => toggleLine(l.id)} aria-pressed={!off}>
                <span className="swatch" style={{ background: l.color }} />
                <b>{l.id}</b>
                <span className="muted">{n ? `${n} Bhf.` : '–'}</span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="stats">
        <b>{stats.stations}</b> Bahnhöfe · <b>{stats.km.toFixed(1).replace('.', ',')}</b> km
      </p>
      {stats.ghost > 0 && (
        <div className="ghost-note">
          <span className="ring" aria-hidden="true" />
          <p>
            <b>{stats.ghost} Geisterbahnhöfe</b> – Züge aus West-Berlin fuhren unter Ost-Berlin ohne Halt durch (1961–1990).
          </p>
        </div>
      )}
      {stats.closedNoStop > 0 && (
        <div className="ghost-note">
          <span className="ring" aria-hidden="true" />
          <p><b>{stats.closedNoStop}</b> {stats.closedNoStop === 1 ? 'Bahnhof' : 'Bahnhöfe'} vorübergehend ohne Halt (stillgelegt).</p>
        </div>
      )}
      {!stats.ghost && !stats.closedNoStop && <p className="hint"><span className="ring small" aria-hidden="true" /> leerer Kreis = Bahnhof ohne Halt</p>}
      <div className="basemaps">
        {BASEMAPS.map((b) => (
          <button key={b.id} type="button" className={b.id === basemap.id ? 'active' : ''} onClick={() => setBasemap(b)}>
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}
