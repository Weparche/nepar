const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const consoleMsgs = [];
  page.on('console', m => consoleMsgs.push(m.type()+': '+m.text()));
  page.on('pageerror', e => consoleMsgs.push('pageerror: '+e));
  page.on('requestfailed', r => consoleMsgs.push('requestfailed: '+r.url()+' '+r.failure()?.errorText));
  const resp = await page.goto('http://localhost:8400/digitalni-cjenik', { waitUntil: 'networkidle', timeout: 30000 });
  console.log('STATUS', resp.status());
  console.log('TITLE', JSON.stringify(await page.title()));
  const bodyLen = await page.evaluate(() => document.body.innerText.length);
  console.log('BODY_TEXT_LEN', bodyLen);
  const bodyExcerpt = await page.evaluate(() => document.body.innerText.slice(0, 500));
  console.log('BODY_EXCERPT', JSON.stringify(bodyExcerpt));
  console.log('CONSOLE', JSON.stringify(consoleMsgs, null, 2));
  await browser.close();
})();
