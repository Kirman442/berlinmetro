export const LINES = [
  { id: 'U1', color: '#52B447' },
  { id: 'U2', color: '#FF3300' },
  { id: 'U3', color: '#15AC99' },
  { id: 'U4', color: '#FFCD00' },
  { id: 'U5', color: '#7D533D' },
  { id: 'U6', color: '#8070B7' },
  { id: 'U7', color: '#0B9ADA' },
  { id: 'U8', color: '#055A99' },
  { id: 'U9', color: '#FF7300' },
];

// Подложки OpenFreeMap: бесплатно, без ключа, общий набор шрифтов (нужен для подписей станций)
export const BASEMAPS = [
  { id: 'positron', label: 'Hell', url: 'https://tiles.openfreemap.org/styles/positron' },
  { id: 'liberty', label: 'Farbig', url: 'https://tiles.openfreemap.org/styles/liberty' },
  { id: 'dark', label: 'Dunkel', url: 'https://tiles.openfreemap.org/styles/dark' },
];
export const LABEL_FONT = ['Noto Sans Regular'];

export const START_YEAR = 1900;
export const END_YEAR = new Date().getFullYear();

export const INITIAL_VIEW = { longitude: 13.4014, latitude: 52.5109, zoom: 11 };
export const MAX_BOUNDS = [
  [12.9, 52.3],
  [13.9, 52.72],
];
