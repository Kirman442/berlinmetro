import { useEffect, useMemo, useState } from 'react';
import MetroMap from './components/MetroMap';
import TimeControl from './components/TimeControl';
import Legend from './components/Legend';
import { BASEMAPS, START_YEAR } from './lib/config';
import { isoForYear, stateAt, sectionOpenAt } from './lib/time';

const load = (name) => fetch(`${import.meta.env.BASE_URL}data/${name}.geojson`).then((r) => {
  if (!r.ok) throw new Error(`${name}: HTTP ${r.status}`);
  return r.json();
});

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [year, setYear] = useState(1902);
  const [playing, setPlaying] = useState(false);
  const [hiddenLines, setHiddenLines] = useState(() => new Set());
  const [basemap, setBasemap] = useState(BASEMAPS[0]);

  useEffect(() => {
    Promise.all([load('stations'), load('sections')])
      .then(([stations, sections]) => setData({ stations, sections }))
      .catch((e) => setError(e.message));
  }, []);

  const iso = isoForYear(year);

  const stats = useMemo(() => {
    const s = { stations: 0, km: 0, byLine: {} };
    if (!data) return s;
    const seen = new Set();
    for (const f of data.stations.features) {
      const p = f.properties;
      if (stateAt(p, iso) !== 'open') continue;
      s.byLine[p.line] = (s.byLine[p.line] || 0) + 1;
      seen.add(p.wikidata || p.name); // пересадочный узел считаем один раз
    }
    s.stations = seen.size;
    for (const f of data.sections.features) {
      if (sectionOpenAt(f.properties, iso)) s.km += f.properties.length_m / 1000;
    }
    return s;
  }, [data, iso]);

  const toggleLine = (id) => setHiddenLines((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  return (
    <div className="app">
      <header>
        <h1>Berliner U-Bahn {START_YEAR < year ? year : ''}</h1>
        <p>Wie das Netz gewachsen ist – Bahnhöfe, Strecken und Namen im Lauf der Zeit</p>
      </header>
      <main>
        {error && <div className="error">Daten konnten nicht geladen werden: {error}</div>}
        {data && <MetroMap data={data} iso={iso} hiddenLines={hiddenLines} basemap={basemap} />}
        {data && (
          <Legend stats={stats} hiddenLines={hiddenLines} toggleLine={toggleLine} basemap={basemap} setBasemap={setBasemap} />
        )}
        <TimeControl year={year} setYear={setYear} playing={playing} setPlaying={setPlaying} />
      </main>
    </div>
  );
}
