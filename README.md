# Berliner U-Bahn 3D (прототип)

Отдельное приложение по образцу 3d-metro.ru: чистый three.js (react-three-fiber), без подложки-карты.

* Данные: `public/data/network3d.json` (модель v4 из `ubahn-data/depth`: z относительно поверхности DGM1, g — рельеф в каждой точке трассы) и `public/data/stations.geojson` (из 2D-приложения: даты, история названий, Geisterbahnhöfe).
* Проекция: метры от центра (13.4014 E, 52.5109 N), x = восток, y = вверх, z = −север (`src/lib/geo.js`).
* Высота: «unter Straße» (y = z × Überhöhung) или «ü. NHN (Relief)» (y = (g + z − 35 м) × Überhöhung), `src/lib/model.js`.
* Цвет по линии или по глубине, уровни глубины пунктиром, сетка 1 км, шахты, пересадки, подписи (keine / ab 10 m / alle; подписи не прячутся, могут накладываться).
* Клик по линии → карточка с продольным профилем (рельеф + путь, м ü. NHN), клик по станции → карточка станции.
* Слайдер лет — логика `berlinmetro/src/lib/time.js`.

Запуск: `npm install`, затем `npm run dev` → http://localhost:5174/

Обновить данные: скопировать свежие `depth/network3d.json` и `app/berlinmetro/public/data/stations.geojson` в `public/data/`.
