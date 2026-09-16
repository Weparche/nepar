const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:4174/digitalni-cjenik', { waitUntil: 'networkidle' });
  await page.addScriptTag({ url: 'http://localhost:8400/detect.js' });
  await page.waitForTimeout(1500);
  const summary = await page.evaluate(() => {
    const res = window.impeccableScan();
    const counts = {};
    let total = 0;
    const tagCounts = {};
    for (const item of res) {
      for (const f of item.findings) {
        counts[f.type] = (counts[f.type]||0)+1;
        total++;
      }
      const tag = item.el.tagName;
      tagCounts[tag] = (tagCounts[tag]||0)+1;
    }
    return { total, counts, tagCounts };
  });
  console.log(JSON.stringify(summary, null, 2));
  await browser.close();
})();
