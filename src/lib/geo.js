
// Своя проекция: метры от центра Берлина (как у 3d-metro.ru — плоская локальная система).
// Сцена three.js: x = восток, y = вверх, z = −север.
export const ORIGIN = { lon: 13.4014, lat: 52.5109 };
const phi = (ORIGIN.lat * Math.PI) / 180;
// длина градуса на широте ORIGIN (эллипсоид WGS84, ряд)
export const M_PER_DEG_LAT = 111132.954 - 559.822 * Math.cos(2 * phi) + 1.175 * Math.cos(4 * phi);
export const M_PER_DEG_LON = 111412.84 * Math.cos(phi) - 93.5 * Math.cos(3 * phi);

export const toXZ = (lon, lat) => [(lon - ORIGIN.lon) * M_PER_DEG_LON, -(lat - ORIGIN.lat) * M_PER_DEG_LAT];
export const fromXZ = (x, z) => [ORIGIN.lon + x / M_PER_DEG_LON, ORIGIN.lat - z / M_PER_DEG_LAT];


