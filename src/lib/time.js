// Работа с датами истории: всё хранится как ISO-строки 'YYYY-MM-DD' (иногда только 'YYYY'),
// поэтому сравнение строк совпадает со сравнением дат.

/** 'YYYY' → 'YYYY-01-01', 'YYYY-MM-DD' без изменений */
export const normDate = (d) => (d == null ? null : d.length === 4 ? `${d}-01-01` : d);

/** Конец выбранного года: всё, что открылось в этом году, уже видно */
export const isoForYear = (year) => `${year}-12-31`;

export const yearOf = (d) => (d ? Number(d.slice(0, 4)) : null);

/** 18.02.1902 или 1902, если известен только год */
export const formatDate = (d) => {
  if (!d) return '';
  if (d.length === 4) return d;
  const [y, m, day] = d.split('-');
  return `${day}.${m}.${y}`;
};

/** Название станции на дату iso по цепочке names [{name, valid_from, valid_to}] */
export const nameAt = (station, iso) => {
  const names = station.names || [];
  for (const n of names) {
    const from = normDate(n.valid_from) || '0000';
    const to = normDate(n.valid_to) || '9999';
    if (from <= iso && iso < to) return n.name;
  }
  return station.name;
};

/** 'hidden' | 'open' | 'interrupted' (Geisterbahnhof, stillgelegt) */
export const stateAt = (station, iso) => {
  if (!station.opened || normDate(station.opened) > iso) return 'hidden';
  if (station.closed && normDate(station.closed) <= iso) return 'hidden';
  // на карте станция линии появляется вместе с участком своей линии (Wittenbergplatz U1/U3)
  if (station.map_from && normDate(station.map_from) > iso) return 'hidden';
  for (const it of station.interruptions || []) {
    const start = normDate(it.start);
    // конец перерыва часто известен только годом: считаем его концом этого года
    const end = it.end && it.end.length === 4 ? `${it.end}-12-31` : normDate(it.end) || '9999';
    if (start <= iso && iso < end) return 'interrupted';
  }
  return 'open';
};

export const INTERRUPTION_LABEL = {
  geisterbahnhof: 'Geisterbahnhof',
  stillgelegt: 'stillgelegt',
  'M-Bahn': 'M-Bahn-Betrieb',
  Kleinprofil: 'Kleinprofil',
};

// участок существует на дату iso (историческим участкам задана дата закрытия)
export const sectionOpenAt = (p, iso) => normDate(p.opened) <= iso && !(p.closed && normDate(p.closed) <= iso);

// активный перерыв на дату iso (тип: geisterbahnhof, stillgelegt …) или null
export const interruptionAt = (station, iso) => {
  for (const it of station.interruptions || []) {
    const end = it.end && it.end.length === 4 ? `${it.end}-12-31` : normDate(it.end) || '9999';
    if (normDate(it.start) <= iso && iso < end) return it;
  }
  return null;
};
