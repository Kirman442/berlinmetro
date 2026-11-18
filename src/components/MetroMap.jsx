import { useMemo, useState, useCallback } from 'react';
import Map, { Source, Layer, NavigationControl } from 'react-map-gl/maplibre';
import CrispPopup from './CrispPopup';
import 'maplibre-gl/dist/maplibre-gl.css';
import { INITIAL_VIEW, MAX_BOUNDS, LABEL_FONT } from '../lib/config';
import { nameAt, stateAt, sectionOpenAt, interruptionAt } from '../lib/time';
import { StationPopup, SectionPopup } from './Popups';
import MapAttribution from './MapAttribution';

const sectionLayer = {
  id: 'sections',
  type: 'line',
  layout: { 'line-cap': 'round', 'line-join': 'round' },
  paint: {
    'line-color': ['get', 'color'],
    'line-width': ['interpolate', ['linear'], ['zoom'], 10, 2.5, 14, 6],
  },
};
// широкая невидимая линия, чтобы по участку было легко попасть кликом
const sectionHitLayer = {
  id: 'sections-hit',
  type: 'line',
  paint: { 'line-color': '#000', 'line-opacity': 0, 'line-width': 14 },
};
const stationLayer = {
  id: 'stations',
  type: 'circle',
  paint: {
    'circle-radius': ['interpolate', ['linear'], ['zoom'],
      10, ['case', ['==', ['get', 'state'], 'interrupted'], 4, 3],
      14, ['case', ['==', ['get', 'state'], 'interrupted'], 8, 7]],
    'circle-color': ['case', ['==', ['get', 'state'], 'interrupted'], '#ffffff', ['get', 'color']],
    'circle-stroke-color': ['case', ['==', ['get', 'state'], 'interrupted'], ['get', 'color'], '#ffffff'],
    'circle-stroke-width': ['case', ['==', ['get', 'state'], 'interrupted'], 2.5, 1.5],
  },
};
// Подписи: одна на узел (центр всех точек станции с этим названием), при нехватке места MapLibre
// пробует другие позиции вокруг точки, а при конфликте оставляет более важную (пересадки, затем остальные).
const labelLayer = {
  id: 'station-labels',
  type: 'symbol',
  minzoom: 10,
  layout: {
    // у станции без остановок — вторая строка: «Geisterbahnhof» / «ohne Halt»
    'text-field': ['case', ['!=', ['get', 'note'], ''],
      ['format', ['get', 'label'], {}, '\n', {}, ['get', 'note'], { 'font-scale': 0.85, 'text-color': '#8a5a00' }],
      ['get', 'label']],
    'text-font': LABEL_FONT,
    'text-size': ['interpolate', ['linear'], ['zoom'], 10, ['case', ['>', ['get', 'rank'], 1], 11, 10], 14, 13],
    'text-variable-anchor': ['top', 'bottom', 'right', 'left', 'top-right', 'top-left', 'bottom-right', 'bottom-left'],
    'text-radial-offset': ['interpolate', ['linear'], ['zoom'], 10, 0.7, 14, 1.0],
    'text-justify': 'auto',
    'text-padding': 1,
    'symbol-sort-key': ['-', 0, ['get', 'rank']],
    // на мелком масштабе — только пересадочные узлы, остальные с зума 12
    'text-allow-overlap': false,
  },
  filter: ['any', ['>', ['get', 'rank'], 1], ['>=', ['zoom'], 12]],
  paint: { 'text-color': '#222', 'text-halo-color': '#fff', 'text-halo-width': 1.4 },
};

const labelPaintDark = { 'text-color': '#eee', 'text-halo-color': '#1b1b1b', 'text-halo-width': 1.4 };

export default function MetroMap({ data, iso, hiddenLines, mapStyle, dark }) {
  const [popup, setPopup] = useState(null);
  const [cursor, setCursor] = useState('');

  // Состояние сети на выбранную дату считается в JS: данных мало (≈200 станций), это мгновенно
  const sections = useMemo(() => ({
    type: 'FeatureCollection',
    features: data.sections.features.filter(
      (f) => !hiddenLines.has(f.properties.line) && sectionOpenAt(f.properties, iso),
    ),
  }), [data, iso, hiddenLines]);

  const stations = useMemo(() => ({
    type: 'FeatureCollection',
    features: data.stations.features
      .filter((f) => !hiddenLines.has(f.properties.line))
      .map((f) => {
        const state = stateAt(f.properties, iso);
        if (state === 'hidden') return null;
        const name = nameAt(f.properties, iso);
        const it = state === 'interrupted' ? interruptionAt(f.properties, iso) : null;
        const note = it ? (it.type === 'geisterbahnhof' ? 'Geisterbahnhof' : 'ohne Halt') : '';
        return { ...f, properties: { id: f.properties.id, color: f.properties.color, line: f.properties.line, state, name, note } };
      })
      .filter(Boolean),
  }), [data, iso, hiddenLines]);

  // одна подпись на узел: центр точек с одинаковым названием, rank = число линий
  const labels = useMemo(() => {
    const groups = new globalThis.Map();
    for (const f of stations.features) {
      const g = groups.get(f.properties.name) || { pts: [], lines: new Set(), note: null };
      g.pts.push(f.geometry.coordinates); g.lines.add(f.properties.line);
      // «ohne Halt» только если не останавливается ни одна линия узла
      g.note = f.properties.note && g.note !== '' ? f.properties.note : '';
      groups.set(f.properties.name, g);
    }
    return {
      type: 'FeatureCollection',
      features: [...groups].map(([name, g]) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [g.pts.reduce((a, p) => a + p[0], 0) / g.pts.length, g.pts.reduce((a, p) => a + p[1], 0) / g.pts.length] },
        properties: { label: name, rank: g.lines.size, note: g.note || '' },
      })),
    };
  }, [stations]);

  const byId = useMemo(() => Object.fromEntries(data.stations.features.map((f) => [f.properties.id, f])), [data]);

  const onClick = useCallback((e) => {
    const f = e.features && e.features[0];
    if (!f) { setPopup(null); return; }
    if (f.layer.id === 'stations') {
      const st = byId[f.properties.id];
      setPopup({ kind: 'station', lngLat: st.geometry.coordinates, station: st.properties });
    } else {
      setPopup({ kind: 'section', lngLat: [e.lngLat.lng, e.lngLat.lat], section: f.properties });
    }
  }, [byId]);

  return (
    <Map
      initialViewState={INITIAL_VIEW}
      maxBounds={MAX_BOUNDS}
      mapStyle={mapStyle}
      cooperativeGestures
      fadeDuration={0}
      attributionControl={false}
      interactiveLayerIds={['stations', 'sections-hit']}
      onClick={onClick}
      onMouseEnter={() => setCursor('pointer')}
      onMouseLeave={() => setCursor('')}
      cursor={cursor}
      style={{ position: 'absolute', inset: 0 }}
    >
      <NavigationControl position="top-left" showCompass={false} />
      <MapAttribution />
      <Source id="sections" type="geojson" data={sections}>
        <Layer {...sectionHitLayer} />
        <Layer {...sectionLayer} />
      </Source>
      <Source id="stations" type="geojson" data={stations}>
        <Layer {...stationLayer} />
      </Source>
      <Source id="station-labels" type="geojson" data={labels}>
        <Layer {...labelLayer} paint={dark ? labelPaintDark : labelLayer.paint} />
      </Source>
      {popup && (
        <CrispPopup
          key={`${popup.lngLat[0]},${popup.lngLat[1]}`}
          longitude={popup.lngLat[0]}
          latitude={popup.lngLat[1]}
          onClose={() => setPopup(null)}
          closeOnClick={false}
          maxWidth="300px"
        >
          {popup.kind === 'station'
            ? <StationPopup station={popup.station} iso={iso} />
            : <SectionPopup section={popup.section} />}
        </CrispPopup>
      )}
    </Map>
  );
}
