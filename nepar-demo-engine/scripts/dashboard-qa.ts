import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';

async function capture(baseUrl: string, token: string, name: 'desktop' | 'mobile', width: number, height: number): Promise<string> {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors: string[] = [];
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`${baseUrl}/__admin`, { waitUntil: 'networkidle' });
    await page.getByLabel('Admin token').fill(token);
    await page.getByRole('button', { name: 'Poveži', exact: true }).click();
    const rows = page.locator('.row');
    await page.waitForSelector('.row', { state: 'visible', timeout: 10_000 });
    if (await rows.count() === 0) throw new Error('Dashboard has no rows after authentication.');
    await rows.first().click();
    await page.locator('#detail.open').waitFor({ state: 'visible' });
    if ((await page.locator('#detail').getAttribute('aria-hidden')) !== 'false') throw new Error('Open dossier remains hidden from assistive technology.');
    if ((await page.locator('body').innerText()).includes('demo_ready')) throw new Error('Dashboard exposes a raw machine status.');
    if (name === 'mobile') {
      if (await page.locator('.queue').getAttribute('inert') === null) throw new Error('Background queue is keyboard-active behind the mobile dossier.');
      if (!(await page.locator('.detail .close').evaluate((element) => element === document.activeElement))) throw new Error('Opening the mobile dossier did not transfer focus to its close control.');
      await page.keyboard.press('Escape');
      if ((await page.locator('#detail').getAttribute('aria-hidden')) !== 'true') throw new Error('Escape did not hide the mobile dossier.');
      if (await page.locator('#detail').getAttribute('inert') === null) throw new Error('Closed mobile dossier remains in the keyboard focus order.');
      if (!(await rows.first().evaluate((element) => element === document.activeElement))) throw new Error('Closing the mobile dossier did not restore focus to its originating row.');
      await rows.first().click();
      await page.locator('#detail.open').waitFor({ state: 'visible' });
    }
    if (errors.length) throw new Error(`Dashboard console errors: ${errors.join('; ')}`);
    const path = resolve('qa-output', `dashboard-${name}.png`);
    await page.screenshot({ path, fullPage: true });
    if (name === 'desktop') {
      await page.setViewportSize({ width: 900, height: 900 });
      await page.waitForFunction(() => document.querySelector('.queue')?.hasAttribute('inert'), undefined, { timeout: 2_000 }).catch(() => undefined);
      if (await page.locator('.queue').getAttribute('inert') === null) throw new Error('Desktop-to-narrow transition left the background keyboard-active behind an open dossier.');
      if ((await page.locator('#detail').getAttribute('aria-hidden')) !== 'false') throw new Error('Desktop-to-narrow transition hid the open dossier from assistive technology.');
    }
    return path;
  } finally {
    await browser.close();
  }
}

async function main(): Promise<void> {
  const baseUrl = process.env.DEMO_ENGINE_URL || 'http://127.0.0.1:8787';
  const token = process.env.DEMO_ENGINE_ADMIN_TOKEN || process.argv[2];
  if (!token) throw new Error('Set DEMO_ENGINE_ADMIN_TOKEN or pass the token as the first argument.');
  await mkdir(resolve('qa-output'), { recursive: true });
  const screenshots = await Promise.all([
    capture(baseUrl, token, 'desktop', 1440, 1000),
    capture(baseUrl, token, 'mobile', 390, 844),
  ]);
  process.stdout.write(`${JSON.stringify({ ok: true, screenshots }, null, 2)}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
