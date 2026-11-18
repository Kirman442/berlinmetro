# Сборка данных для веб-приложения: станции + участки линий между станциями с датами открытия.
# Запуск из папки ubahn-data:  python scripts/build_app_data.py <папка_вывода>
import json, math, sys, os
OUT = sys.argv[1] if len(sys.argv) > 1 else 'app-data'
os.makedirs(OUT, exist_ok=True)
ST = json.load(open('stations/stations.json', encoding='utf-8'))['stations']
R = json.load(open('osm/osm_routes.geojson', encoding='utf-8'))['features']
COLORS = {'U1': '#52B447', 'U2': '#FF3300', 'U3': '#15AC99', 'U4': '#FFCD00', 'U5': '#7D533D',
          'U6': '#8070B7', 'U7': '#0B9ADA', 'U8': '#055A99', 'U9': '#FF7300'}

def d(a, b): return math.hypot((a[0] - b[0]) * 67800, (a[1] - b[1]) * 111200)

def chain(parts):
    parts = [list(p) for p in parts if len(p) >= 2]
    if not parts: return []
    out = [parts[0]]
    for p in parts[1:]:
        cur = out[-1]
        if len(out) == 1 and cur is out[0] and len(cur) == len(parts[0]):
            opts = [(d(cur[-1], p[0]), 0), (d(cur[-1], p[-1]), 1), (d(cur[0], p[0]), 2), (d(cur[0], p[-1]), 3)]
        else:
            opts = [(d(cur[-1], p[0]), 0), (d(cur[-1], p[-1]), 1)]
        dist, mode = min(opts)
        if mode >= 2: cur.reverse()
        q = p[::-1] if mode in (1, 3) else p
        if dist < 40: cur.extend(q[1:])
        else: out.append(q)
    return out

# --- станции для приложения
st_feats = []
for s in ST:
    p = {k: s.get(k) for k in ('id', 'name', 'line', 'opened', 'closed', 'names', 'interruptions',
                               'relocations', 'situation', 'district', 'wiki_de', 'wikidata', 'depth_m')}
    p['color'] = COLORS.get(s['line'])
    st_feats.append({'type': 'Feature', 'geometry': {'type': 'Point', 'coordinates': s['coord']}, 'properties': p})

# --- участки: самый длинный маршрут каждой линии, разрезанный по станциям
import csv
OVR = {}
if os.path.exists('stations/section_overrides.csv'):
    for r in csv.DictReader(open('stations/section_overrides.csv', encoding='utf-8-sig'), delimiter=';'):
        OVR[(r['line'], frozenset((r['from'], r['to'])))] = r['opened']
sec_feats = []
report = []
done = set()
for f in sorted(R, key=lambda f: -sum(len(x) for x in f['geometry']['coordinates'])):  # обе направления, длинный первым
    l = f['properties']['_line']
    if l not in COLORS: continue
    stl = [s for s in ST if s['line'] == l and s['opened']]
    # закрытая станция рядом с действующей того же имени (старый Richard-Wagner-Platz) не режет линию
    stl = [s for s in stl if not (s.get('closed') and any(o is not s and not o.get('closed') and d(o['coord'], s['coord']) < 400 for o in stl))]
    for poly in chain(f['geometry']['coordinates']):
        cum = [0.0]
        for a, b in zip(poly, poly[1:]): cum.append(cum[-1] + d(a, b))
        anchors = []
        for s in stl:
            pts = [s['coord']] + s.get('platform_points', [])
            i = min(range(len(poly)), key=lambda i: min(d(poly[i], q) for q in pts))
            if min(d(poly[i], q) for q in pts) < 200: anchors.append((cum[i], i, s))
        anchors.sort(key=lambda a: a[0])
        # закрытые станции на трассе (Osthafen, Nürnberger Platz) остаются точками, но не режут даты участков
        # «вставные» станции: открыты позже обоих соседей → участок существовал раньше
        dates = [a[2]['opened'] for a in anchors]
        eff = list(dates)
        for k in range(1, len(anchors) - 1):
            if dates[k] > dates[k - 1] and dates[k] > dates[k + 1]:
                eff[k] = max(dates[k - 1], dates[k + 1])
        for k in range(len(anchors) - 1):
            (c0, i0, s0), (c1, i1, s1) = anchors[k], anchors[k + 1]
            if i1 <= i0: continue
            key = (l, frozenset((s0['name'], s1['name'])))
            if key in done: continue
            done.add(key)
            opened = OVR.get(key, max(eff[k], eff[k + 1]))
            geom = [[round(x, 6), round(y, 6)] for x, y in poly[i0:i1 + 1]]
            sec_feats.append({'type': 'Feature', 'geometry': {'type': 'LineString', 'coordinates': geom},
                              'properties': {'line': l, 'color': COLORS[l], 'from': s0['name'], 'to': s1['name'],
                                             'opened': opened, 'length_m': round(c1 - c0)}})
            report.append(f"{l};{s0['name']};{s1['name']};{opened};{round(c1 - c0)}")
# --- запасной путь: станции, до которых маршруты OSM не дошли (например, U6 север на ремонте = railway=construction)
import heapq
T = json.load(open('osm/osm_track_segments.geojson', encoding='utf-8'))['features']
K = lambda c: (round(c[0], 6), round(c[1], 6))
G = {}
for t in T:
    cs = t['geometry']['coordinates']
    for a, b in zip(cs, cs[1:]):
        w = d(a, b); G.setdefault(K(a), []).append((K(b), w)); G.setdefault(K(b), []).append((K(a), w))
nodes = list(G)
# склеиваем узлы ближе 15 м (стыки путей разных объектов OSM)
grid = {}
for n in nodes: grid.setdefault((int(n[0] * 3000), int(n[1] * 5000)), []).append(n)
for n in nodes:
    gx, gy = int(n[0] * 3000), int(n[1] * 5000)
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1):
            for m in grid.get((gx + dx, gy + dy), []):
                if m != n and d(m, n) < 15: G[n].append((m, d(m, n)))
def nearest_node(c):
    n = min(nodes, key=lambda n: d(n, c)); return n if d(n, c) < 250 else None
def path(a, b):
    dist = {a: 0}; prev = {}; q = [(0, a)]
    while q:
        w, u = heapq.heappop(q)
        if u == b: break
        if w > dist.get(u, 1e18): continue
        for v, ww in G.get(u, []):
            if w + ww < dist.get(v, 1e18): dist[v] = w + ww; prev[v] = u; heapq.heappush(q, (w + ww, v))
    if b not in dist: return None
    out = [b]
    while out[-1] != a: out.append(prev[out[-1]])
    return out[::-1], dist[b]
covered = {(f['properties']['line'], n) for f in sec_feats for n in (f['properties']['from'], f['properties']['to'])}
for l in COLORS:
    stl = [s for s in ST if s['line'] == l and s['opened'] and not s.get('closed')]
    miss = [s for s in stl if (l, s['name']) not in covered]
    if not miss: continue
    have = [s for s in stl if (l, s['name']) in covered]
    # цепочка: от ближайшей покрытой станции к непокрытым по принципу ближайшего соседа
    cur = min(have, key=lambda h: min(d(h['coord'], m['coord']) for m in miss)) if have else miss.pop(0)
    seq = [cur]
    while miss:
        nx = min(miss, key=lambda m: d(m['coord'], seq[-1]['coord'])); miss.remove(nx); seq.append(nx)
    for s0, s1 in zip(seq, seq[1:]):
        a, b = nearest_node(s0['coord']), nearest_node(s1['coord'])
        r = path(a, b) if a and b else None
        if not r or r[1] > 3 * d(s0['coord'], s1['coord']) + 500:
            report.append(f"{l};{s0['name']};{s1['name']};НЕТ ГЕОМЕТРИИ;"); continue
        key = (l, frozenset((s0['name'], s1['name'])))
        opened = OVR.get(key, max(s0['opened'], s1['opened']))
        sec_feats.append({'type': 'Feature', 'geometry': {'type': 'LineString', 'coordinates': [list(c) for c in r[0]]},
                          'properties': {'line': l, 'color': COLORS[l], 'from': s0['name'], 'to': s1['name'],
                                         'opened': opened, 'length_m': round(r[1]), 'source': 'osm_tracks'}})
        report.append(f"{l};{s0['name']};{s1['name']};{opened};{round(r[1])};из путей OSM")
for name, feats in (('stations', st_feats), ('sections', sec_feats)):
    with open(os.path.join(OUT, name + '.geojson'), 'w', encoding='utf-8') as fh:
        json.dump({'type': 'FeatureCollection', 'features': feats}, fh, ensure_ascii=False, separators=(',', ':'))
with open(os.path.join(OUT, 'sections.csv'), 'w', encoding='utf-8-sig') as fh:
    fh.write('line;from;to;opened;length_m\n' + '\n'.join(report) + '\n')
print(len(st_feats), 'stations,', len(sec_feats), 'sections')
