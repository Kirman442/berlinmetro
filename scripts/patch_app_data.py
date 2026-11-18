# Нормализация данных приложения после build_app_data.py (запуск из корня приложения):
#   python scripts/patch_app_data.py
# 1) точка станции = центр её платформ (OSM/собственные точки), если они есть — иначе точки «висят» рядом с линией
# 2) исторические участки, которых нет в OSM (снесённые/перестроенные туннели), с датой закрытия
# 3) старый Richard-Wagner-Platz (Wilhelmplatz) был ответвлением линии A (сегодня U2) от Bismarckstraße/Deutsche Oper
import json, math
D = 'public/data/'
st = json.load(open(D + 'stations.geojson', encoding='utf-8'))
se = json.load(open(D + 'sections.geojson', encoding='utf-8'))
import os
# stations.json из ubahn-data (приложение лежит в ubahn-data/app/berlinmetro)
SRC = next((p for p in ('../../stations/stations.json', '../ubahn-data/stations/stations.json') if os.path.exists(p)), None)
src = {s['id']: s for s in json.load(open(SRC, encoding='utf-8'))['stations']} if SRC else None
COLORS = {'U2': '#FF3300', 'U3': '#15AC99'}
d = lambda a, b: math.hypot((a[0] - b[0]) * 67800, (a[1] - b[1]) * 111200)

for f in st['features']:
    p = f['properties']
    # Schöneberger U-Bahn (U4) endete seit 1.12.1910 in einem eigenen Bahnhof Nollendorfplatz, 1926 durch den heutigen ersetzt
    if p['id'] == 'U4-Nm':
        p['opened'] = '1910-12-01'
        p['relocations'] = [{'date': '1926-10-26', 'note': 'neuer gemeinsamer Bahnhof mit U1/U3, alter Schöneberger Bahnhof aufgegeben'}]
    if p['id'] == 'U7-RwK':
        p['line'], p['color'] = 'U2', COLORS['U2']
    pp = (src or {}).get(p['id'], {}).get('platform_points') or p.pop('platform_points', None) or []
    p.pop('platform_points', None)
    if pp and not p.get('closed') and d(pp[0], pp[-1]) < 300:
        f['geometry']['coordinates'] = [round(sum(q[0] for q in pp) / len(pp), 6), round(sum(q[1] for q in pp) / len(pp), 6)]
# Wiedereröffnung der Geisterbahnhöfe: genaue Tage statt nur Jahr
REOPEN = {'U8-Jb': '1989-11-11', 'U8-Ro': '1989-12-22', 'U8-Ap': '1990-07-01', 'U8-W': '1990-07-01',
          'U6-NA': '1990-07-01', 'U6-Ob': '1990-07-01', 'U6-SK': '1990-07-01'}
for f in st['features']:
    p = f['properties']
    for it in p.get('interruptions') or []:
        if p['id'] in REOPEN and it['type'] == 'geisterbahnhof': it['end'] = REOPEN[p['id']]
by = {f['properties']['id']: f for f in st['features']}

def length(c): return round(sum(d(a, b) for a, b in zip(c, c[1:])))
def add(line, a, b, opened, closed, coords):
    se['features'].append({'type': 'Feature', 'geometry': {'type': 'LineString', 'coordinates': coords},
        'properties': {'line': line, 'color': COLORS[line], 'from': a, 'to': b, 'opened': opened, 'closed': closed,
                       'length_m': length(coords), 'source': 'historisch'}})
se['features'] = [f for f in se['features'] if f['properties'].get('source') != 'historisch']

# Kleinprofil-Abzweig Bismarckstraße (heute Deutsche Oper) – Wilhelmplatz/Richard-Wagner-Platz, 1906–1970
rw = by['U7-RwK']['geometry']['coordinates']
add('U2', 'Deutsche Oper', 'Richard-Wagner-Platz (Kleinprofil)', '1906-05-14', '1970-01-29',
    [[13.31113, 52.511792], [13.3088, 52.5119], [13.3081, 52.5127], [13.3074, 52.5150], rw])

# Wilmersdorfer Strecke 1913–1959: Wittenbergplatz – Nürnberger Platz – Hohenzollernplatz (heutiger Tunnel, ohne Spichernstr./Augsburger Str.)
def sec(line, a, b):
    for f in se['features']:
        p = f['properties']
        if p['line'] == line and {p['from'], p['to']} == {a, b}:
            c = f['geometry']['coordinates']
            return c if p['from'] == a else c[::-1]
path = sec('U3', 'Wittenbergplatz', 'Augsburger Straße') + sec('U3', 'Augsburger Straße', 'Spichernstraße')[1:] \
    + sec('U3', 'Spichernstraße', 'Hohenzollernplatz')[1:]
nb = by['U3-Nb']['geometry']['coordinates']
i = min(range(len(path)), key=lambda i: d(path[i], nb))
by['U3-Nb']['geometry']['coordinates'] = path[i]
add('U3', 'Wittenbergplatz', 'Nürnberger Platz', '1913-10-12', '1959-07-01', path[:i + 1])
add('U3', 'Nürnberger Platz', 'Hohenzollernplatz', '1913-10-12', '1959-07-01', path[i:])

for f in se['features']:
    p = f['properties']
    if p['line'] == 'U4' and {p['from'], p['to']} == {'Viktoria-Luise-Platz', 'Nollendorfplatz'}: p['opened'] = '1910-12-01'

# 4) точка станции на своей линии: если до трассы 40–300 м, ставим на ближайшую точку трассы;
#    map_from = первое открытие участка своей линии у станции (Wittenbergplatz U1/U3 стоит с 1902, а линии U1/U3 там с 1913/1926)
for f in st['features']:
    p = f['properties']
    near = [(d(f['geometry']['coordinates'], q), q, s['properties']['opened']) for s in se['features']
            if s['properties']['line'] == p['line'] for q in s['geometry']['coordinates']]
    if not near: continue
    dist, q, _ = min(near, key=lambda t: t[0])
    if 40 < dist < 300 and not p.get('closed'): f['geometry']['coordinates'] = q
    c = f['geometry']['coordinates']
    touch = [o for _, q, o in near if d(c, q) < 60]
    if touch and min(touch) > p['opened']: p['map_from'] = min(touch)
    else: p.pop('map_from', None)

# 5) точка ровно на линии: проекция на ближайший отрезок своей линии, концы участков — ровно в точках станций
def proj(pt, a, b):
    kx, ky = 67800, 111200
    dx, dy = (b[0] - a[0]) * kx, (b[1] - a[1]) * ky
    t = max(0, min(1, (((pt[0] - a[0]) * kx) * dx + ((pt[1] - a[1]) * ky) * dy) / (dx * dx + dy * dy or 1)))
    return [round(a[0] + t * (b[0] - a[0]), 6), round(a[1] + t * (b[1] - a[1]), 6)]
for f in st['features']:
    p = f['properties']
    if p.get('closed'): continue
    c = f['geometry']['coordinates']
    cands = [proj(c, a, b) for s_ in se['features'] if s_['properties']['line'] == p['line']
             for a, b in zip(s_['geometry']['coordinates'], s_['geometry']['coordinates'][1:])]
    if cands:
        q = min(cands, key=lambda q: d(q, c))
        if d(q, c) < 300: f['geometry']['coordinates'] = q
for s_ in se['features']:
    sp, cs = s_['properties'], s_['geometry']['coordinates']
    for idx, nm in ((0, sp['from']), (-1, sp['to'])):
        opts = [f['geometry']['coordinates'] for f in st['features']
                if f['properties']['line'] == sp['line'] and nm in (f['properties']['name'], *[n['name'] for n in f['properties'].get('names') or []])]
        if opts:
            q = min(opts, key=lambda q: d(q, cs[idx]))
            if d(q, cs[idx]) < 150: cs[idx] = list(q)
    sp['length_m'] = round(sum(d(a, b) for a, b in zip(cs, cs[1:])))

for name, fc in (('stations', st), ('sections', se)):
    json.dump(fc, open(D + name + '.geojson', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))
print('ok', len(st['features']), 'stations', len(se['features']), 'sections')
