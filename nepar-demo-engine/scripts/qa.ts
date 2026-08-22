import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { chromium, type Browser, type Page } from '@playwright/test';
import { qaReportSchema, researchedLeadSchema, type QaReport, type ResearchedLead } from '../src/schema';

interface Options {
  url: string;
  slug: string;
  api?: string;
  token?: string;
  lead?: string;
  output: string;
}

function parseOptions(argv: string[]): Options {
  const value = (name: string): string | undefined => {
    const index = argv.indexOf(name);
    return index >= 0 ? argv[index + 1] : undefined;
  };
  const url = value('--url');
  if (!url) throw new Error('Usage: npm run qa -- --url URL [--slug SLUG] [--lead FILE] [--api URL] [--token TOKEN]');
  const parsed = new URL(url);
  return {
    url,
    slug: value('--slug') || parsed.searchParams.get('demo') || parsed.hostname.split('.')[0],
    api: value('--api') || process.env.DEMO_ENGINE_URL,
    token: value('--token') || process.env.DEMO_ENGINE_ADMIN_TOKEN,
    lead: value('--lead'),
    output: value('--output') || 'qa-output',
  };
}

async function checkViewport(
  browser: Browser,
  options: Options,
  name: 'desktop' | 'mobile',
  width: number,
  height: number,
  lead?: ResearchedLead,
): Promise<{ viewport: QaReport['viewports'][number]; consoleErrors: string[]; brokenImages: string[]; screenshotPath: string }> {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const consoleErrors: string[] = [];
  const brokenImages: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text().slice(0, 1_000)); });
  page.on('pageerror', (error) => consoleErrors.push(error.message.slice(0, 1_000)));
  page.on('response', (response) => {
    if (response.request().resourceType() === 'image' && !response.ok() && response.url().startsWith('http')) {
      brokenImages.push(response.url());
    }
  });

  const response = await page.goto(options.url, { waitUntil: 'networkidle', timeout: 45_000 });
  const checks: QaReport['viewports'][number]['checks'] = [];
  const check = (checkName: string, passed: boolean, detail?: string) => checks.push({ name: checkName, passed, ...(detail ? { detail } : {}) });
  check('page_returns_200', response?.status() === 200, `HTTP ${response?.status() ?? 'no response'}`);
  check('title_exists', (await page.title()).trim().length > 0);
  check('no_horizontal_overflow', await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), await page.evaluate(() => `${document.documentElement.scrollWidth}/${document.documentElement.clientWidth}`));

  const primary = page.locator('[data-primary-cta]').first();
  const primaryCount = await primary.count();
  check('primary_cta_exists', primaryCount === 1);
  if (primaryCount) {
    const href = await primary.getAttribute('href');
    check('primary_cta_target_valid', Boolean(href && !href.startsWith('javascript:')), href || 'missing href');
  }

  const bodyText = await page.locator('body').innerText();
  check('no_placeholder_markers', !/TODO|Lorem ipsum|zamijeni|placeholder/i.test(bodyText));
  const emptySections = await page.locator('main section').evaluateAll((sections) => sections.filter((section) => !(section.textContent || '').trim()).length);
  check('no_empty_sections', emptySections === 0, `${emptySections} empty sections`);

  const brokenAnchors = await page.locator('a[href^="#"]').evaluateAll((anchors) => anchors
    .map((anchor) => anchor.getAttribute('href'))
    .filter((href) => href && href !== '#' && !document.querySelector(href)));
  check('navigation_anchors_resolve', brokenAnchors.length === 0, brokenAnchors.join(', '));

  const visibleHeadings = await page.locator('main h1, main h2').evaluateAll((headings) => headings.filter((heading) => {
    const rect = heading.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }).length);
  check('key_content_visible', visibleHeadings >= 3, `${visibleHeadings} visible headings`);

  if (lead?.publicPhone) check('verified_phone_matches', bodyText.includes(lead.publicPhone), lead.publicPhone);
  if (lead?.publicEmail) check('verified_email_matches', bodyText.includes(lead.publicEmail), lead.publicEmail);

  const screenshotPath = resolve(options.output, `${options.slug}-${name}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await page.close();
  return { viewport: { name, width, height, checks }, consoleErrors, brokenImages, screenshotPath };
}

async function uploadScreenshot(options: Options, viewport: 'desktop' | 'mobile', path: string): Promise<string | undefined> {
  if (!options.api || !options.token) return undefined;
  const response = await fetch(`${options.api}/__admin/demos/${encodeURIComponent(options.slug)}/screenshots/${viewport}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${options.token}`, 'Content-Type': 'image/png' },
    body: await readFile(path),
  });
  if (!response.ok) throw new Error(`Screenshot upload ${response.status}: ${await response.text()}`);
  return (await response.json() as { key: string }).key;
}

async function main(): Promise<void> {
  const options = parseOptions(process.argv.slice(2));
  await mkdir(resolve(options.output), { recursive: true });
  const lead = options.lead
    ? researchedLeadSchema.parse(JSON.parse(await readFile(resolve(options.lead), 'utf8')) as unknown)
    : undefined;
  const browser = await chromium.launch({ headless: true });
  try {
    const [desktop, mobile] = await Promise.all([
      checkViewport(browser, options, 'desktop', 1440, 1000, lead),
      checkViewport(browser, options, 'mobile', 390, 844, lead),
    ]);
    const [desktopKey, mobileKey] = await Promise.all([
      uploadScreenshot(options, 'desktop', desktop.screenshotPath),
      uploadScreenshot(options, 'mobile', mobile.screenshotPath),
    ]);
    desktop.viewport.screenshotKey = desktopKey;
    mobile.viewport.screenshotKey = mobileKey;
    const consoleErrors = [...desktop.consoleErrors, ...mobile.consoleErrors].slice(0, 30);
    const brokenImages = [...new Set([...desktop.brokenImages, ...mobile.brokenImages])].slice(0, 30);
    const passed = [...desktop.viewport.checks, ...mobile.viewport.checks].every((item) => item.passed)
      && consoleErrors.length === 0 && brokenImages.length === 0;
    const report = qaReportSchema.parse({
      status: passed ? 'passed' : 'failed',
      checkedAt: new Date().toISOString(),
      url: options.url,
      viewports: [desktop.viewport, mobile.viewport],
      consoleErrors,
      brokenImages,
    });
    const reportPath = resolve(options.output, `${options.slug}-report.json`);
    await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    if (options.api && options.token) {
      const response = await fetch(`${options.api}/__admin/demos/${encodeURIComponent(options.slug)}/qa`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${options.token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });
      if (!response.ok) throw new Error(`QA report API ${response.status}: ${await response.text()}`);
    }
    process.stdout.write(`${JSON.stringify({ ok: passed, report: basename(reportPath), screenshots: [desktop.screenshotPath, mobile.screenshotPath] }, null, 2)}\n`);
    if (!passed) process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
