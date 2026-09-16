const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://127.0.0.1:4174/digitalni-cjenik', { waitUntil: 'networkidle' });
  // click ENG toggle
  await page.locator('.language-toggle button:has-text("ENG")').first().click();
  await page.waitForTimeout(500);
  const bodyText = await page.evaluate(() => document.body.innerText);
  // find lines containing Croatian diacritics
  const lines = bodyText.split('\n').map(l => l.trim()).filter(Boolean);
  const diacriticRe = /[čćšžđČĆŠŽĐ]/;
  const flagged = lines.filter(l => diacriticRe.test(l));
  console.log('LANG_ATTR', await page.evaluate(() => document.documentElement.lang));
  console.log('TOTAL_LINES', lines.length);
  console.log('FLAGGED_LINES_COUNT', flagged.length);
  console.log(JSON.stringify(flagged, null, 2));
  await browser.close();
})();
