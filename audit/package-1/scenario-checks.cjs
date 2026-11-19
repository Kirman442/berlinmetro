const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1400, height: 860 } });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message));
  await p.goto('http://localhost:5174/');
  await p.waitForFunction(() => window.__app && window.__app.stations, null, { timeout: 60000 });
  await p.waitForTimeout(800);
  const R = {};
  const setYear = async (y) => { await p.$eval('.time input', (el, y) => { const s = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; s.call(el, String(y)); el.dispatchEvent(new Event('input', { bubbles: true })); }, y); await p.waitForTimeout(300); };
  const stats = () => p.evaluate(() => ({ stat: [...document.querySelectorAll('.stat .v')].map(e => e.textContent), lines: [...document.querySelectorAll('.lines li')].map(li => `${li.querySelector('b').textContent}:${li.querySelector('.muted').textContent}|${li.querySelector('.muted').title}`) }));
  const card = () => p.evaluate(() => document.querySelector('.card')?.innerText.replace(/\n/g, ' | ').slice(0, 220) || null);
  R.y2026 = await stats();
  R.deepest = await p.evaluate(() => [...document.querySelectorAll('.deep li')].map(li => li.innerText.replace(/\n/g, ' ')));
  await setYear(1902); R.y1902 = await stats();
  await setYear(1900); R.y1900 = await stats();
  await setYear(2026);
  // U5 profile then hide U5
  await p.click('.lines li:nth-child(5) .linkbtn'); await p.waitForTimeout(400);
  R.u5open = await card();
  await p.click('.lines li:nth-child(5) > button:first-child'); await p.waitForTimeout(400);
  R.u5hidden = await card();
  await p.click('.card .chip'); await p.waitForTimeout(400);
  R.u5reshown = (await card())?.slice(0, 80);
  // Brandenburger Tor → 2008 → 2026
  await p.click('.deep li:first-child button'); await p.waitForTimeout(500);
  R.bt2026 = (await card())?.slice(0, 80);
  await setYear(2008); R.bt2008 = await card();
  await setYear(2026); R.bt2026b = (await card())?.slice(0, 80);
  // hide U5 while BT selected
  await p.click('.lines li:nth-child(5) > button:first-child'); await p.waitForTimeout(300);
  R.btU5hidden = await card();
  await p.click('.card .chip'); await p.waitForTimeout(300);
  R.btU5restored = (await card())?.slice(0, 60);
  // all lines off
  for (let i = 1; i <= 9; i++) await p.click(`.lines li:nth-child(${i}) > button:first-child`);
  await p.waitForTimeout(300);
  R.allOff = await p.evaluate(() => document.querySelector('.empty')?.innerText.replace(/\n/g, ' | '));
  await p.click('.empty .chip'); await p.waitForTimeout(300);
  R.afterRestore = { empty: await p.evaluate(() => !!document.querySelector('.empty')), stats: (await stats()).stat };
  R.errors = errs;
  console.log(JSON.stringify(R, null, 1));
  await b.close();
})();
