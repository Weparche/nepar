const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const resp = await page.goto('http://127.0.0.1:4174/digitalni-cjenik.html', { waitUntil: 'networkidle', timeout: 20000 });
  console.log('STATUS', resp.status());
  console.log('TITLE', await page.title());
  const hasHeading = await page.getByText('Jasne opcije implementacije', {exact:false}).count();
  console.log('PRICING_HEADING_COUNT', hasHeading);
  const hasTable = await page.getByText('Muško šišanje', {exact:false}).count();
  console.log('TABLE_TEXT_COUNT', hasTable);
  await browser.close();
})();
