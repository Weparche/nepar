const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8400/', { waitUntil: 'networkidle', timeout: 20000 });
  console.log('ROOT TITLE', await page.title());
  const links = await page.evaluate(() => Array.from(document.querySelectorAll('a[href]')).map(a => a.getAttribute('href')));
  console.log('LINKS', JSON.stringify([...new Set(links)]));
  await browser.close();
})();
