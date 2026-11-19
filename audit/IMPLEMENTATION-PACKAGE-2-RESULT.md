# Пакет 2: семантика данных, источники и единицы

19.11.2026, приложение `M:\projekte\Berlin metro\ubahn-data\app\ubahn3d` (ветка `ubahn3d`, поверх пакета 1 f63c7be). Без деплоя и пуша. Официальные цвета линий не менялись, интерактивные возможности сохранены.

## Что изменено

### 2.1 Происхождение и точность

- Новый файл данных `public/data/depth_sources.json`. Его делает скрипт `audit\package-2\build-depth-sources.mjs` из `depth\depths_seed_v2.csv` (30 строк с числом; строка Osloer Straße «nur Klasse» без числа пропускается). Скрипт ничего не вычисляет и не дополняет, он только переносит `reference`, `precision` и `source`.
- `model.js`: `depthQuality()` даёт каждой записи `dq`: вид значения и точность.

| Вид (`dq.kind`) | Показ | Записей всего / открыто в 2026 |
|---|---|---|
| Quellenangabe, Einzelwert (`Angabe`) | `−11,25 m` | 25 / 24 |
| Quellenangabe, `ca.` или `rund` | `≈ −17 m` | 4 / 4 |
| Quellenangabe, Spanne (`4–5 m`) | `−4…−5 m` | 1 / 1 |
| abgeleitet (Gleisdreieck U1/U3) | `≈ +12 m` | 2 / 2 |
| Modellschätzung (OSM-Ebene) | `≈ −12 m` | 131 / 128 |
| Modellschätzung (nach Lage/Bauart) | `≈ −4 m` | 53 / 53 |

- Один формат (`depthText`) теперь используют подпись на карте, подсказка при наведении, список «Tiefste Bahnhöfe», карточка станции, карточка линии, точки профиля и счётчик max. Stationstiefe. `≈` или диапазон всегда стоит у самого числа.
- `measured` больше не означает «измерено». Теперь это «есть Quellenangabe». Новый признак `exact` = Quellenangabe без ca./rund/диапазона. Поэтому `abgeleitet` больше не попадает в точные значения.
- Карточка станции: строка «Höhenlage: Quellenangabe · ca.» сразу под числом. Раскрываемый блок «Herkunft des Werts» содержит вид, точность, Bezug (как написано в источнике), источник, а для диапазона — «Im Modell −4,5 m (Mitte der Spanne)». Фраза «Gemessene Werte gibt es bisher für 30 Bahnhöfe» удалена.
- Числовая погрешность нигде не придумывается. Знаки после запятой показываются как в исходном значении: −11,25 и −14,75 вместо округлённых −11,3 и −14,8.
- Профиль различает три вида точек: заполненная = Quellenangabe, кольцо с точкой = ca./Spanne/abgeleitet, пустое кольцо = Modellschätzung. Под профилем легенда с количеством каждого вида.

### 2.2 Вертикальная точка отсчёта

- «Bahnsteig» в карточке → «Höhenlage ≈ … m ü. NHN (Modell)». «Gleis» в профиле → «Modelltrasse».
- Под числом глубины: «m unter Geländeniveau» вместо «unter Straßenniveau». Режим высоты: «unter Gelände».
- В блоке происхождения сказано прямо: число описывает высотное положение станции в модели относительно локального уровня поверхности (DGM1, сглаженного). Что именно имеется в виду — платформа, рельс или сооружение, — единообразно не определено. Нормализацию по первоисточникам не делал: в данных её нет (см. «Открытые вопросы»).

### 2.3 Метрики

- Под тремя показателями: «Ganzes Netz zum Jahresende JJJJ, unabhängig von ausgeblendeten Linien. Linienlänge: Summe je Linie, gemeinsame Abschnitte U1/U3 doppelt.»
- «km Strecke» → «km Linienlänge» с подсказкой. Уникальная длина инфраструктуры не считается, 7,435 км не вычитаются.
- «m max. Tiefe» → «m max. Stationstiefe» (по тоннельным станциям, как в пакете 1). Если максимум взят из приблизительного источника, у числа стоит ≈ (2026: «≈17»). В подсказке — станция, значение и вид источника.
- Карточка линии:
  - Bahnhöfe: число узлов плюс число записей, если они различаются.
  - «Tiefste Station»: станция и значение в общем формате.
  - «Ø Tiefe … (N Einträge unter Geländeniveau)»: если среди них есть неточные значения, ставится ≈.
  - «Tiefster Punkt» → «Niedrigste Station … m ü. NHN (absolut)», потому что расчёт идёт по станциям.
  - «Gelände» → «Gelände (Stationen)».
  - Под профилем: «Profil der längsten durchgehenden Strecke; Trasse … interpoliert und geglättet, kein Gleisplan».
- У профиля видимая подпись оси «Höhe über NHN (m)» и `aria-label` с единицами.

### 2.4 Пояснение модели

- Заголовок страницы: «Vereinfachtes Höhenmodell … – Höhenunterschiede ×N vergrößert, Meterangaben unverändert» (раньше было «in echter Lage»).
- Под ползунком Überhöhung: «Höhenunterschiede N-fach vergrößert; Meterangaben bleiben unverändert. Kugeln und Röhren sind Symbole, nicht maßstäblich.»
- Режим «ü. NHN (Relief)» → «ü. NHN» с пояснением: абсолютные высоты с DGM1, карта при этом — ровная схематичная плоскость. В режиме «unter Gelände» есть отдельное пояснение.
- Легенда глубины:
  - заголовок «Tiefe unter Geländeniveau»;
  - деления 0 / −5 / −10 / −15 / −22 m стоят в правильных долях шкалы;
  - отдельный цвет «auf/über Geländeniveau»;
  - сказано, что шкала фиксированная, а не максимум года, и что цвет и при NHN зависит от глубины.
- «Schächte» → «Senkrechten». Под слоями пояснение: вертикали и пересадки (< 300 м) схематичны, это не реальные входы и не измеренные переходы; коричневая изнанка — символ грунта.
- Сетка в режиме «unter Gelände»: «Raster 1 km · Geländeniveau».
- Подвал: «Zahlenangaben aus Wikipedia …, sonst Modellschätzung aus OSM-Ebenen bzw. Bauart».

## Затронутые файлы

- `public/data/depth_sources.json` (новый, сгенерирован)
- `src/lib/model.js`: `DQ_KIND`, `depthQuality()`, `prepare(net, geo, sources)`, поля `dq`, `measured`, `exact`
- `src/lib/colors.js`: `fmtM` с числом знаков исходного значения (до 2)
- `src/App.jsx`: загрузка `depth_sources.json`. Если файла нет, приложение работает, а все значения показываются без источника. Также `stats.maxDepthSt`, заголовок, `year` в панель, тестовый хук `window.__pick`
- `src/components/Card.jsx`: `depthNumber`, `depthText`, `depthStatus`, карточка станции, профиль, карточка линии
- `src/components/Panel.jsx`: показатели, пояснения, легенда глубины, слои
- `src/components/Guides.jsx`: подпись сетки
- `src/index.css`: стили легенд, блока происхождения, оси профиля

`network3d.json` и `stations.geojson` не менялись. Глубины, даты и координаты не трогались.

## Проверки

Сборка `npx vite build` прошла (предупреждение о размере чанка как раньше).

По данным (`package-2/depth-quality-check.mjs` → `package-2/depth-quality-check.json`):
- точность seed: 25 Angabe, 1 ca., 3 rund, 1 диапазон — совпадает с `DATA-SEMANTICS-EVIDENCE-2026-11-18.json`;
- ни одно значение seed не расходится с `z` в `network3d.json` (`seed_value_mismatch: []`).

В браузере (headless Chromium; `package-2/scenario-checks.cjs` → `package-2/scenario-checks.json`), ошибок JS нет:

| Запись | Карточка (число · статус) | Подпись на карте | Список / профиль |
|---|---|---|---|
| Brandenburger Tor U5 (ca.) | ≈ −17 m unter Geländeniveau · Quellenangabe · ca.; Bezug «Straßenebene», Quelle «dewiki U-Bahn-Linie U5» | ≈ −17 m | список ≈ −17 m; профиль «≈ −17 m (Quellenangabe · ca.), ≈ 17,1 m ü. NHN»; max. Stationstiefe «≈17» |
| Bernauer Straße U8 (Spanne) | −4…−5 m · Quellenangabe · Spanne 4–5 m; Im Modell −4,5 m (Mitte der Spanne) | −4…−5 m | профиль «−4…−5 m (Quellenangabe · Spanne 4–5 m)» |
| Gleisdreieck U1 (abgeleitet) | ≈ +12 m über Geländeniveau · abgeleitet | ≈ +12 m | профиль «≈ +12 m (abgeleitet)» |
| Berliner Straße U7 (OSM) | ≈ −12 m · Modellschätzung (OSM-Ebene) | ≈ −12 m | список ≈ −12 m; профиль «≈ −12 m (Modellschätzung (OSM-Ebene))» |
| Museumsinsel U5 (rund) | ≈ −16 m · Quellenangabe · rund | ≈ −16 m | список ≈ −16 m |
| Alexanderplatz U5 (Angabe) | −11,25 m · Quellenangabe | −11,25 m | список −11,25 m |

- Профили U1, U5, U7, U8: ось «Höhe über NHN (m)», легенда «Modelltrasse», подсчёт точек по видам (U5: 3 · 2 · 21; U7: 3 · 0 · 38; U8: 2 · 2 · 20; U1: 1 · 1 · 12).
- U7: «Bahnhöfe 40 (41 Bahnsteig-/Ebenen-Einträge)», «Niedrigste Station Altstadt Spandau, ≈ 21 m ü. NHN (absolut)».
- Обе системы высот: при «ü. NHN» показано пояснение о плоской схематичной карте, при «unter Gelände» — о локальном уровне поверхности. Легенда глубины проверена в режиме NHN.

Подсказка при наведении использует ту же функцию `depthText`. Наведение мышью в headless-прогоне не проверялось. Скриншоты делались только для моей проверки раскладки, в audit не сохранялись.

## Открытые вопросы (нужны первоисточники, реализацию не блокируют)

1. Точка отсчёта значений (верх платформы, головка рельса, сооружение) в seed не нормализована: в `reference` записан текст вроде «Straßenoberkante», «Gelände», «Straße». Пока везде показывается нейтральная «Höhenlage (Modell)».
2. `scripts\build_3d.py` (стр. 14, 49) по-прежнему записывает в `network3d.json` для всех seed-строк `src = 'gemessen (Wikipedia)'` и отбрасывает `precision`. Приложение восстанавливает точность из `depth_sources.json` по ключу «линия|название». Правильнее переносить эти поля в самой сборке данных: задача для треда данных.
3. Senefelderplatz: в старом `depths_seed.csv` указано `ca.`, в `depths_seed_v2.csv` — `Angabe`. Приложение следует v2. Какая версия верна, нужно проверить по источнику.
4. Для Gleisdreieck (abgeleitet) источник известен только как «Wikipedia». Как именно выведено значение +12 м, в данных не записано.
