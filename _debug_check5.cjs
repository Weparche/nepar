const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const resp = await page.goto('http://localhost:8400/', { waitUntil: 'networkidle', timeout: 20000 });
  console.log('STATUS', resp.status());
  const html = await page.content();
  console.log('HTML_LEN', html.length);
  console.log('HTML_EXCERPT', html.slice(0, 2000));
  await browser.close();
})();
