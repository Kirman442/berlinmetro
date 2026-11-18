import { formatDate, nameAt, stateAt, yearOf, INTERRUPTION_LABEL } from '../lib/time';

const LineBadge = ({ line, color }) => (
  <span className="badge" style={{ background: color }}>{line}</span>
);

export function StationPopup({ station, iso }) {
  const nameNow = nameAt(station, iso);
  const state = stateAt(station, iso);
  const former = (station.names || []).filter((n) => n.name !== nameNow);
  return (
    <div className="popup">
      <h3>
        <LineBadge line={station.line} color={station.color} /> {nameNow}
      </h3>
      {nameNow !== station.name && <p className="muted">heute: {station.name}</p>}
      {state === 'interrupted' && <p className="warn">Zu diesem Zeitpunkt ohne Halt</p>}
      <dl>
        <dt>Eröffnet</dt>
        <dd>{formatDate(station.opened)}</dd>
        {station.closed && (<><dt>Geschlossen</dt><dd>{formatDate(station.closed)}</dd></>)}
        {station.situation && (<><dt>Lage</dt><dd>{station.situation}</dd></>)}
        {station.district && (<><dt>Ortsteil</dt><dd>{station.district}</dd></>)}
      </dl>
      {former.length > 0 && (
        <>
          <h4>Namen</h4>
          <ul>
            {(station.names || []).map((n) => (
              <li key={n.name + n.valid_from}>
                {n.name} <span className="muted">({yearOf(n.valid_from)}–{n.valid_to ? yearOf(n.valid_to) : 'heute'})</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {(station.interruptions || []).length > 0 && (
        <>
          <h4>Unterbrechungen</h4>
          <ul>
            {station.interruptions.map((it) => (
              <li key={it.type + it.start}>
                {INTERRUPTION_LABEL[it.type] || it.type} <span className="muted">({yearOf(it.start)}–{yearOf(it.end)})</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {(station.relocations || []).map((r) => (
        <p key={r.date} className="muted">Seit {yearOf(r.date)}: {r.note}</p>
      ))}
      {station.wiki_de && (
        <a href={`https://de.wikipedia.org/wiki/${encodeURIComponent(station.wiki_de.replace(/ /g, '_'))}`} target="_blank" rel="noreferrer">
          Wikipedia
        </a>
      )}
    </div>
  );
}

export function SectionPopup({ section }) {
  return (
    <div className="popup">
      <h3>
        <LineBadge line={section.line} color={section.color} /> {section.from} – {section.to}
      </h3>
      <dl>
        <dt>Eröffnet</dt>
        <dd>{formatDate(section.opened)}</dd>
        <dt>Länge</dt>
        <dd>{(section.length_m / 1000).toFixed(2).replace('.', ',')} km</dd>
      </dl>
    </div>
  );
}
