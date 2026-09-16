const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const path of ['/', '/index.html', '/health', '/detect.js', '/live.js']) {
    const resp = await page.goto('http://localhost:8400' + path, { waitUntil: 'load', timeout: 15000 }).catch(e => ({status: () => 'ERR:'+e.message}));
    console.log(path, '->', resp.status());
  }
  await browser.close();
})();
