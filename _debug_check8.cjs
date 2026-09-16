const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:4174/digitalni-cjenik', { waitUntil: 'networkidle' });
  await page.addScriptTag({ url: 'http://localhost:8400/detect.js' });
  await page.waitForTimeout(1500);
  const summary = await page.evaluate(() => {
    if (typeof window.impeccableScan === 'function') {
      const res = window.impeccableScan();
      try {
        return JSON.parse(JSON.stringify(res, (k, v) => {
          if (v instanceof Element) return '<element:' + v.tagName + (v.className? '.'+String(v.className).split(' ').join('.'):'') + '>';
          return v;
        }));
      } catch (e) { return 'SERIALIZE_ERROR:' + String(e); }
    }
    return 'NO_impeccableScan_FUNCTION';
  });
  console.log(JSON.stringify(summary, null, 2));
  await browser.close();
})();
