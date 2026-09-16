const { chromium } = require('playwright');
const path = require('path');

const LIVE_PORT = 8400; // impeccable live-server: serves /detect.js, /live.js, etc.
const SITE_PORT = 4174; // local static server serving dist/ with clean-URL resolution
const LIVE_BASE = `http://localhost:${LIVE_PORT}`;
const BASE = `http://localhost:${SITE_PORT}`;
const OUT = path.join(__dirname);

(async () => {
  const browser = await chromium.launch();
  const results = {};

  // ---- Preflight + console capture on a fresh page ----
  const page = await browser.newPage();
  const consoleMsgs = [];
  page.on('console', (msg) => {
    consoleMsgs.push({ type: msg.type(), text: msg.text() });
  });
  page.on('pageerror', (err) => {
    consoleMsgs.push({ type: 'pageerror', text: String(err) });
  });

  await page.goto(`${BASE}/digitalni-cjenik`, { waitUntil: 'networkidle' });

  // Preflight: mutate document.title
  const originalTitle = await page.title();
  await page.evaluate(() => { document.title = 'IMPECCABLE_MUTATION_TEST_12345'; });
  const mutatedTitle = await page.title();
  results.preflightTitleMutation = {
    originalTitle,
    mutatedTitle,
    success: mutatedTitle === 'IMPECCABLE_MUTATION_TEST_12345',
  };

  // Preflight: append a script tag that runs and sets a global
  const scriptRan = await page.evaluate(() => {
    return new Promise((resolve) => {
      const s = document.createElement('script');
      s.textContent = 'window.__IMPECCABLE_SCRIPT_TEST__ = 42;';
      document.head.appendChild(s);
      setTimeout(() => resolve(window.__IMPECCABLE_SCRIPT_TEST__ === 42), 50);
    });
  });
  results.preflightScriptTagExec = scriptRan;

  // restore title
  await page.evaluate((t) => { document.title = t; }, originalTitle);

  results.mutationWorks = results.preflightTitleMutation.success && scriptRan;

  if (results.mutationWorks) {
    // Inject detect.js and wait, collecting console
    const before = consoleMsgs.length;
    try {
      await page.addScriptTag({ url: `${LIVE_BASE}/detect.js` });
    } catch (e) {
      results.detectJsInjectionError = String(e);
    }
    await page.waitForTimeout(3000);
    const impeccableMsgs = consoleMsgs.slice(before).filter(m => /impeccable/i.test(m.text));
    results.impeccableConsoleMessages = impeccableMsgs;
    results.allConsoleMessagesAfterInject = consoleMsgs.slice(before);
  }

  await page.close();

  // ---- Screenshots ----
  // Desktop 1280x900
  const desktopPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await desktopPage.goto(`${BASE}/digitalni-cjenik`, { waitUntil: 'networkidle' });
  await desktopPage.screenshot({ path: path.join(OUT, 'desktop_top.png') });

  // scroll to pricing section - find heading containing "Jasne opcije"
  const pricingLoc = desktopPage.getByText('Jasne opcije implementacije', { exact: false }).first();
  if (await pricingLoc.count() > 0) {
    await pricingLoc.scrollIntoViewIfNeeded();
    await desktopPage.waitForTimeout(300);
    await desktopPage.screenshot({ path: path.join(OUT, 'desktop_pricing.png') });
  } else {
    results.desktopPricingHeadingFound = false;
  }

  // scroll to example table section - "Muško šišanje" or "Bojanje kose"
  const tableLoc = desktopPage.locator('td:has-text("Muško šišanje")').first();
  if (await tableLoc.count() > 0) {
    await tableLoc.scrollIntoViewIfNeeded();
    await desktopPage.waitForTimeout(300);
    await desktopPage.screenshot({ path: path.join(OUT, 'desktop_example_table.png') });
  } else {
    results.desktopTableHeadingFound = false;
  }
  await desktopPage.close();

  // Mobile 390x844
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobilePage.goto(`${BASE}/digitalni-cjenik`, { waitUntil: 'networkidle' });
  await mobilePage.screenshot({ path: path.join(OUT, 'mobile_top.png') });

  const mPricingLoc = mobilePage.getByText('Jasne opcije implementacije', { exact: false }).first();
  if (await mPricingLoc.count() > 0) {
    await mPricingLoc.scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(300);
    await mobilePage.screenshot({ path: path.join(OUT, 'mobile_pricing.png') });
  } else {
    results.mobilePricingHeadingFound = false;
  }

  const mTableLoc = mobilePage.locator('dt:has-text("Muško šišanje")').first();
  if (await mTableLoc.count() > 0) {
    await mTableLoc.scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(300);
    await mobilePage.screenshot({ path: path.join(OUT, 'mobile_example_table.png') });
  } else {
    results.mobileTableHeadingFound = false;
  }
  await mobilePage.close();

  // Mobile 390x844 with language toggle to English
  const enPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await enPage.goto(`${BASE}/digitalni-cjenik`, { waitUntil: 'networkidle' });

  // Try to find a language toggle - look for common patterns: button/link with text EN, HR, or a lang switcher
  let toggleFound = false;
  const candidates = ['.language-toggle button:has-text("ENG")', 'button[aria-pressed]:has-text("ENG")', 'text=ENG', 'text=EN', 'text=English'];
  for (const sel of candidates) {
    const loc = enPage.locator(sel).first();
    if (await loc.count() > 0) {
      try {
        await loc.click({ timeout: 2000 });
        toggleFound = true;
        break;
      } catch (e) {}
    }
  }
  results.languageToggleFound = toggleFound;
  await enPage.waitForTimeout(500);
  await enPage.screenshot({ path: path.join(OUT, 'mobile_en_top.png') });

  // h2 heading matches either the English or Croatian pricing title (works whether toggle succeeded or not)
  const enPricingLoc = enPage.locator('h2').filter({ hasText: /Clear implementation options|Jasne opcije implementacije/ }).first();
  if (await enPricingLoc.count() > 0) {
    await enPricingLoc.scrollIntoViewIfNeeded();
    await enPage.waitForTimeout(300);
    results.enPricingHeadingText = (await enPricingLoc.textContent())?.trim();
  } else {
    results.enPricingHeadingFoundInEnglish = false;
  }
  await enPage.screenshot({ path: path.join(OUT, 'mobile_en_pricing.png') });

  // At 390px viewport the mobile <dl>/<dt> markup is the visible one (table is display:none there)
  const enTableLoc = enPage.locator('dt').filter({ hasText: /haircut|Muško šišanje/ }).first();
  if (await enTableLoc.count() > 0) {
    await enTableLoc.scrollIntoViewIfNeeded();
    await enPage.waitForTimeout(300);
    results.enTableHeadingText = (await enTableLoc.textContent())?.trim();
  } else {
    results.enTableHeadingFoundInEnglish = false;
  }
  await enPage.screenshot({ path: path.join(OUT, 'mobile_en_example_table.png') });

  // Grab full page text content to check for leftover Croatian words in English mode
  const bodyText = await enPage.evaluate(() => document.body.innerText);
  const croatianMarkers = ['Muško šišanje', 'Bojanje kose', 'Jasne opcije implementacije', 'Naručite', 'šišanje', 'kosa', 'usluga'];
  results.croatianMarkersFoundInEnglishMode = croatianMarkers.filter(m => bodyText.includes(m));

  await enPage.close();

  await browser.close();

  console.log(JSON.stringify(results, null, 2));
})().catch((e) => {
  console.error('FATAL_ERROR', e);
  process.exit(1);
});
