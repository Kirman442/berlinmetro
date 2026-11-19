// Скопировано из 2D-приложения (berlinmetro/src/lib/time.js) без изменений логики.
// Даты — ISO-строки 'YYYY-MM-DD' (иногда только 'YYYY'), сравнение строк = сравнение дат.

export const normDate = (d) => (d == null ? null : d.length === 4 ? `${d}-01-01` : d);
export const isoForYear = (year) => `${year}-12-31`;
export const yearOf = (d) => (d ? Number(d.slice(0, 4)) : null);

export const formatDate = (d) => {
  if (!d) return '';
  if (d.length === 4) return d;
  const [y, m, day] = d.split('-');
  return `${day}.${m}.${y}`;
};

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
  if (station.map_from && normDate(station.map_from) > iso) return 'hidden';
  for (const it of station.interruptions || []) {
    const start = normDate(it.start);
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

export const sectionOpenAt = (p, iso) => normDate(p.opened) <= iso && !(p.closed && normDate(p.closed) <= iso);

export const interruptionAt = (station, iso) => {
  for (const it of station.interruptions || []) {
    const end = it.end && it.end.length === 4 ? `${it.end}-12-31` : normDate(it.end) || '9999';
    if (normDate(it.start) <= iso && iso < end) return it;
  }
  return null;
};
