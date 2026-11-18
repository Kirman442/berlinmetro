import { layers, namedFlavor } from '@protomaps/basemaps';

// Подложка Protomaps из собственного файла public/tiles/berlin.pmtiles (вырезка Берлина, scripts/fetch_basemap.ps1).
// Шрифты тоже свои: public/fonts. Внешних запросов за картой нет.
const BASE = `${window.location.origin}${import.meta.env.BASE_URL}`;
export const TILES_URL = `${BASE}tiles/berlin.pmtiles`;

// «Hell» подогнан под OpenFreeMap Positron (светло-серый фон, серо-голубая вода, белые улицы)
const POSITRON = {
  ...namedFlavor('light'),
  background: '#f2f3f0', earth: '#f2f3f0',
  park_a: '#e6e9e5', park_b: '#e6e9e5', wood_a: '#e6e9e5', wood_b: '#e6e9e5', scrub_a: '#eceee9', scrub_b: '#eceee9',
  hospital: '#eceeea', industrial: '#eceeea', school: '#eceeea', zoo: '#e6e9e5', military: '#eceeea',
  aerodrome: '#eceeea', pedestrian: '#f7f7f5', sand: '#efefea', beach: '#efefea', glacier: '#ffffff', pier: '#f2f3f0',
  water: '#c2c8ca', buildings: '#e4e4df', railway: '#d8d8d8', boundaries: '#c8c8c8',
  landcover: {
    barren: '#f2f3f0', farmland: '#eeefeb', forest: '#e6e9e5', glacier: '#ffffff',
    grassland: '#e9ece6', scrub: '#eceee9', urban_area: '#f2f3f0',
  },
  pois: undefined, // без иконок POI — не нужен спрайт
};
const DARK = { ...namedFlavor('dark'), pois: undefined };

export const BASEMAPS = [
  { id: 'positron', label: 'Hell', flavor: POSITRON, dark: false },
  { id: 'dark', label: 'Dunkel', flavor: DARK, dark: true },
];

export function basemapStyle(b) {
  return {
    version: 8,
    glyphs: `${BASE}fonts/{fontstack}/{range}.pbf`,
    sources: {
      protomaps: {
        type: 'vector',
        url: `pmtiles://${TILES_URL}`,
        attribution: '<a href="https://protomaps.com" target="_blank" rel="noreferrer">Protomaps</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>',
      },
    },
    layers: layers('protomaps', b.flavor, { lang: 'de' }),
  };
}

export async function tilesAvailable() {
  try {
    const r = await fetch(TILES_URL, { method: 'HEAD', cache: 'no-cache' });
    return r.ok && !(r.headers.get('content-type') || '').includes('text/html');
  } catch {
    return false;
  }
}

// Только для разработки: пока файл не вырезан, показываем подложку прямо с OpenFreeMap
export const devFallbackStyle = (b) => `https://tiles.openfreemap.org/styles/${b.id}`;
