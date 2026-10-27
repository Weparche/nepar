import { expect, test } from "@playwright/test";

test("homepage marketing links point directly to the Publisher domain", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('a[href="https://digitalnicjenik.nepar.hr/"]').first()).toBeAttached();
  await expect(page.locator('a[href="/digitalni-cjenik"]')).toHaveCount(0);
  await expect(page.locator('a[href="/cjenik"]').first()).toBeAttached();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
