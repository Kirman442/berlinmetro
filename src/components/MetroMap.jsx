import { useMemo, useState, useCallback } from 'react';
import Map, { Source, Layer, Popup, NavigationControl } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { INITIAL_VIEW, MAX_BOUNDS, LABEL_FONT } from '../lib/config';
import { nameAt, stateAt, sectionOpenAt } from '../lib/time';
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
    'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 3, 14, 7],
    'circle-color': ['case', ['==', ['get', 'state'], 'interrupted'], '#ffffff', ['get', 'color']],
    'circle-stroke-color': ['case', ['==', ['get', 'state'], 'interrupted'], ['get', 'color'], '#ffffff'],
    'circle-stroke-width': ['case', ['==', ['get', 'state'], 'interrupted'], 2, 1.5],
    'circle-opacity': ['case', ['==', ['get', 'state'], 'interrupted'], 0.85, 1],
  },
};
const labelLayer = {
  id: 'station-labels',
  type: 'symbol',
  minzoom: 12.5,
  layout: {
    'text-field': ['get', 'label'],
    'text-font': LABEL_FONT,
    'text-size': 12,
    'text-offset': [0, 1.1],
    'text-anchor': 'top',
    'text-optional': true,
  },
  paint: { 'text-color': '#222', 'text-halo-color': '#fff', 'text-halo-width': 1.4 },
};

export default function MetroMap({ data, iso, hiddenLines, basemap }) {
  const [popup, setPopup] = useState(null);
  const [cursor, setCursor] = useState('');

  // Состояние сети на выбранную дату считается в JS: данных мало (≈200 станций), это мгновенно
  const sections = useMemo(() => ({
    type: 'FeatureCollection',
    features: data.sections.features.filter(
      (f) => !hiddenLines.has(f.properties.line) && sectionOpenAt(f.properties, iso),
    ),
  }), [data, iso, hiddenLines]);

  const stations = useMemo(() => {
    // на одной пересадочной станции подпись нужна один раз
    const labelled = new Set();
    return {
      type: 'FeatureCollection',
      features: data.stations.features
        .filter((f) => !hiddenLines.has(f.properties.line))
        .map((f) => {
          const state = stateAt(f.properties, iso);
          if (state === 'hidden') return null;
          const name = nameAt(f.properties, iso);
          const label = labelled.has(name) ? '' : name;
          labelled.add(name);
          return { ...f, properties: { id: f.properties.id, color: f.properties.color, line: f.properties.line, state, name, label } };
        })
        .filter(Boolean),
    };
  }, [data, iso, hiddenLines]);

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
      mapStyle={basemap.url}
      cooperativeGestures
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
        <Layer {...labelLayer} />
      </Source>
      {popup && (
        <Popup
          longitude={popup.lngLat[0]}
          latitude={popup.lngLat[1]}
          onClose={() => setPopup(null)}
          closeOnClick={false}
          maxWidth="300px"
        >
          {popup.kind === 'station'
            ? <StationPopup station={popup.station} iso={iso} />
            : <SectionPopup section={popup.section} />}
        </Popup>
      )}
    </Map>
  );
}
