import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(process.env.DESIGN_PROJECT_ROOT || process.cwd());
const baseUrl = process.env.DESIGN_BASE_URL || "http://127.0.0.1:4173";
const outputDir = path.join(root, ".design", "captures");
const targets = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
];

await fs.mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });

try {
  for (const target of targets) {
    const context = await browser.newContext({
      viewport: { width: target.width, height: target.height },
      deviceScaleFactor: 1,
      colorScheme: "light",
      reducedMotion: "reduce",
    });
    await context.addInitScript(() => {
      localStorage.setItem("nepar-consent-v1", JSON.stringify({
        version: 1,
        analytics: false,
        updatedAt: "2026-01-01T00:00:00.000Z",
      }));
    });
    const page = await context.newPage();
    await page.goto(new URL("/web", baseUrl).href, { waitUntil: "networkidle" });
    await page.locator("h1").waitFor({ state: "visible" });
    await page.evaluate(async () => {
      await document.fonts?.ready;
      const initiallyRequestedImages = [...document.images].filter((image) => image.loading !== "lazy");
      await Promise.all(initiallyRequestedImages.map((image) => image.complete
        ? Promise.resolve()
        : new Promise((resolve) => image.addEventListener("load", resolve, { once: true }))));
    });
    await page.screenshot({
      path: path.join(outputDir, `${target.name}-approved.png`),
      fullPage: false,
      animations: "disabled",
    });
    const reasons = page.locator(".web-reasons");
    await reasons.scrollIntoViewIfNeeded();
    await page.waitForFunction(() => [...document.querySelectorAll(".web-reason__media img")]
      .every((image) => image.complete && image.naturalWidth > 0));
    await reasons.screenshot({
      path: path.join(outputDir, `${target.name}-reasons.png`),
      animations: "disabled",
    });
    const pricing = page.locator(".web-pricing");
    await pricing.scrollIntoViewIfNeeded();
    for (const packageCard of await page.locator(".web-package").all()) {
      await packageCard.scrollIntoViewIfNeeded();
    }
    await page.waitForFunction(() => [...document.querySelectorAll(".web-package__media img")]
      .every((image) => image.complete && image.naturalWidth > 0));
    await pricing.screenshot({
      path: path.join(outputDir, `${target.name}-pricing.png`),
      animations: "disabled",
    });
    await context.close();
  }
} finally {
  await browser.close();
}

console.log("Captured consent-free approved desktop and mobile review frames.");
