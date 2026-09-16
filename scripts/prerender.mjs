/**
 * Postbuild korak (nakon `vite build`, prije `verify-dist.js`): otvori svaku rutu iz
 * PRERENDER_PATHS u headless Chromiumu, pričeka stvaran React render, i snimi taj DOM
 * natrag u dist/<ruta>.html — jedan izvor istine (React render), bez ručno pisanih
 * string-template klonova koji se moraju ručno sinkronizirati sa svakom promjenom.
 *
 * Determinizam prije svega: svjež browser context po ruti (bez cookieja/localStoragea),
 * eksplicitan locale/timezone (hr-HR / Europe/Zagreb) da HR/EN toggle koji default-ira
 * na "hr" ne ovisi o slučaju, i provjera <html lang="hr"> prije snimanja.
 */
import { chromium } from "playwright";
import { preview } from "vite";
import { readFileSync, writeFileSync } from "node:fs";
import { PRERENDER_PATHS } from "../src/seoConfig.js";
import { routeOutputPath } from "../src/seoRoutes.js";

const ROOT_MARKER = '<div id="root"></div>';
const outDir = "dist";

async function prerenderRoute(browser, baseUrl, routePath) {
  const context = await browser.newContext({
    locale: "hr-HR",
    timezoneId: "Europe/Zagreb",
  });
  try {
    const page = await context.newPage();
    const url = `${baseUrl}${routePath === "/" ? "" : routePath}`;
    const response = await page.goto(url, { waitUntil: "domcontentloaded" });
    if (!response || !response.ok()) {
      throw new Error(`HTTP ${response?.status() ?? "no response"}`);
    }

    await page.waitForSelector("#root h1");

    // Framer Motion's scroll-triggered (whileInView) animations never fire during
    // prerender unless the page is actually scrolled, and mount-triggered ones are
    // still mid-transition (actively driven by requestAnimationFrame) right after
    // waitForSelector resolves — a one-time style clear gets overwritten by the
    // next animation frame. Scroll through the page to trigger every observer,
    // wait for transitions to settle, then clear any still-animating inline
    // opacity/transform as a final safety net. Only affects the static snapshot
    // served before hydration, not the live animated experience once JS takes over.
    await page.evaluate(async () => {
      const step = Math.max(200, Math.floor(window.innerHeight / 2));
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(700);
    await page.evaluate(() => {
      document.querySelectorAll("[style]").forEach((el) => {
        el.style.opacity = "";
        el.style.transform = "";
      });
    });

    const htmlLang = await page.getAttribute("html", "lang");
    if (htmlLang !== "hr") {
      throw new Error(`<html lang> is "${htmlLang}", expected "hr"`);
    }

    const snapshot = await page.locator("#root").innerHTML();
    const outputPath = routeOutputPath(outDir, routePath);
    const html = readFileSync(outputPath, "utf8");
    const occurrences = html.split(ROOT_MARKER).length - 1;
    if (occurrences !== 1) {
      throw new Error(`expected exactly one empty root marker, found ${occurrences}`);
    }

    const updated = html.replace(ROOT_MARKER, `<div id="root" data-nepar-static-content>${snapshot}</div>`);
    writeFileSync(outputPath, updated, "utf8");
    console.log(`Prerendered ${routePath}`);
  } finally {
    await context.close();
  }
}

async function main() {
  const server = await preview({ build: { outDir }, preview: { port: 4790 } });
  const baseUrl = server.resolvedUrls.local[0].replace(/\/$/, "");
  const browser = await chromium.launch();
  const failures = [];

  try {
    for (const routePath of PRERENDER_PATHS) {
      try {
        await prerenderRoute(browser, baseUrl, routePath);
      } catch (error) {
        failures.push(`${routePath}: ${error.message}`);
      }
    }
  } finally {
    await browser.close();
    await new Promise((resolvePromise, rejectPromise) => {
      server.httpServer.close((error) => (error ? rejectPromise(error) : resolvePromise()));
    });
  }

  if (failures.length) {
    console.error(`Prerender failed:\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
    process.exit(1);
  }
}

main();
