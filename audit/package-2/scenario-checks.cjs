// Пакет 2: проверка представления глубины для четырёх эталонных записей во всех местах UI.
// Запуск: dev-сервер на http://localhost:5174/, затем  node scenario-checks.cjs > scenario-checks.json
const { chromium } = require('playwright');
const IDS = { 'Brandenburger Tor (ca.)': 'U5-BRT', 'Bernauer Straße (Spanne)': 'U8-B', 'Gleisdreieck U1 (abgeleitet)': 'U1-Go', 'Berliner Straße U7 (OSM)': 'U7-Beo', 'Museumsinsel (rund)': 'U5-MUI', 'Alexanderplatz U5 (Angabe)': 'U5-Al' };
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('http://localhost:5174/');
  await p.waitForFunction(() => window.__app && window.__app.stations && window.__pick, null, { timeout: 60000 });
  await p.waitForTimeout(800);
  const R = { stations: {} };
  R.panel = await p.evaluate(() => ({
    stats: [...document.querySelectorAll('.stat')].map((e) => `${e.querySelector('.v').textContent} ${e.querySelector('.k').textContent} | ${e.title}`),
    scope: document.querySelector('.stats-scope')?.textContent,
    mode: [...document.querySelectorAll('.seg button')].map((b) => b.textContent).join(' / '),
    deepest: [...document.querySelectorAll('.deep li')].map((li) => li.innerText.replace(/\n/g, ' ')),
  }));
  // Namen: alle
  await p.click('text=alle'); await p.waitForTimeout(300);
  for (const [k, id] of Object.entries(IDS)) {
    await p.evaluate((id) => window.__pick.station(id), id); await p.waitForTimeout(350);
    const card = await p.evaluate(() => {
      const c = document.querySelector('.card'); if (!c) return null;
      c.querySelector('details')?.setAttribute('open', '');
      return { big: c.querySelector('.depth')?.textContent, status: c.querySelector('.depth ~ p')?.textContent, facts: [...c.querySelectorAll('dl.facts')].map((d) => d.innerText.replace(/\n/g, ' | ')) };
    });
    const name = await p.evaluate((id) => window.__app && document.querySelector('.card strong')?.textContent, id);
    const label = await p.evaluate((n) => [...document.querySelectorAll('.lbl')].filter((e) => e.textContent.startsWith(n)).map((e) => e.textContent), name);
    R.stations[k] = { id, card, label };
  }
  // Profile U5, U8, U1, U7
  for (const l of ['U5', 'U7', 'U8', 'U1']) {
    await p.evaluate((l) => window.__pick.line(l), l); await p.waitForTimeout(400);
    R[`profile_${l}`] = await p.evaluate(() => {
      const c = document.querySelector('.card');
      return { facts: c.querySelector('dl.facts')?.innerText.replace(/\n/g, ' | '), axis: c.querySelector('.axis-t')?.textContent, legend: [...c.querySelectorAll('.legend-mini')].map((e) => e.innerText.replace(/\n/g, ' · ')), dots: [...c.querySelectorAll('.prof .dot title')].map((t) => t.textContent) };
    });
  }
  for (const l of ['U5', 'U7', 'U8', 'U1']) {
    const want = { U5: ['Brandenburger', 'Museumsinsel', 'Alexanderplatz'], U7: ['Berliner Straße'], U8: ['Bernauer'], U1: ['Gleisdreieck'] }[l];
    R[`profile_${l}`].dots = R[`profile_${l}`].dots.filter((t) => want.some((w) => t.startsWith(w)));
  }
  // NHN mode + depth colour legend
  await p.click('text=ü. NHN'); await p.click('text=nach Tiefe'); await p.waitForTimeout(300);
  R.abs = await p.evaluate(() => ({ hints: [...document.querySelectorAll('.panel .hint.small')].map((e) => e.textContent), ramp: document.querySelector('.ramp-legend')?.innerText.replace(/\n/g, ' | ') }));
  R.header = await p.evaluate(() => document.querySelector('header p').textContent);
  R.errors = errs;
  console.log(JSON.stringify(R, null, 1));
  await b.close();
})();
