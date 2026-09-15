# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: digital-price-list.spec.js >> /digitalni-cjenik has Croatian static SEO, one H1, and the official source
- Location: e2e\digital-price-list.spec.js:23:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/digitalni-cjenik
Call log:
  - navigating to "http://127.0.0.1:4173/digitalni-cjenik", waiting until "load"

```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | const workerBase = "https://analytics.nepar.test";
  4  | 
  5  | async function mockWorker(page, checkerResult) {
  6  |   const contacts = [];
  7  |   await page.route(`${workerBase}/**`, async (route) => {
  8  |     const request = route.request();
  9  |     if (request.url().endsWith("/api/digitalni-cjenik/check")) {
  10 |       await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(checkerResult) });
  11 |       return;
  12 |     }
  13 |     if (request.url().endsWith("/analytics/pageview")) {
  14 |       await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
  15 |       return;
  16 |     }
  17 |     contacts.push(JSON.parse(request.postData() || "{}"));
  18 |     await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
  19 |   });
  20 |   return contacts;
  21 | }
  22 | 
  23 | test("/digitalni-cjenik has Croatian static SEO, one H1, and the official source", async ({ page }) => {
  24 |   const errors = [];
  25 |   page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
> 26 |   await page.goto("/digitalni-cjenik");
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/digitalni-cjenik
  27 |   await expect(page).toHaveTitle("Digitalni cjenik XML/CSV od 1.10.2026. | NEPAR");
  28 |   await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Nova obveza digitalnih cjenika/);
  29 |   await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://nepar.hr/digitalni-cjenik");
  30 |   await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  31 |   await expect(page.getByRole("link", { name: "Narodne novine" })).toHaveAttribute("href", /101_1213/);
  32 |   const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  33 |   expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
  34 |   expect(errors).toEqual([]);
  35 | });
  36 | 
  37 | test("checker displays concrete yellow findings and prefills the lead form", async ({ page }) => {
  38 |   const contacts = await mockWorker(page, {
  39 |     status: "yellow",
  40 |     message: "Na stranici postoje informacije o cijenama ili cjeniku, ali automatska provjera nije pronašla javno dostupan XML ili CSV dokument.",
  41 |     details: { reachable: true, https: true, csvFound: false, xmlFound: false, pricePageFound: true, csvUrl: null, xmlUrl: null, pricePageUrl: "https://primjer.hr/cjenik.pdf" },
  42 |   });
  43 |   await page.goto("/digitalni-cjenik");
  44 |   await page.getByLabel("Provjerite digitalni cjenik svoje web stranice").fill("primjer.hr");
  45 |   await page.getByRole("button", { name: "Provjeri", exact: true }).click();
  46 |   const result = page.locator('[aria-live="polite"]');
  47 |   await expect(result).toContainText("Pronašli smo cjenik, ali ne i XML/CSV");
  48 |   await expect(result).toContainText("/cjenik.pdf");
  49 |   await expect(result).toContainText("CSV: nije pronađen");
  50 |   await result.getByRole("button", { name: "Zatraži implementaciju" }).click();
  51 |   await expect(page.getByLabel("Web stranica")).toHaveValue("https://primjer.hr");
  52 |   await page.getByLabel("Ime ili naziv tvrtke").fill("Test obrt");
  53 |   await page.getByLabel("E-mail").fill("test@example.com");
  54 |   await page.getByLabel("Platforma").selectOption("WordPress");
  55 |   await page.getByLabel("Poruka").fill("Trebam implementaciju.");
  56 |   await page.getByRole("button", { name: "Pošalji upit" }).click();
  57 |   await expect(page.getByText("Upit je poslan. Javit ćemo se uskoro.")).toBeVisible();
  58 |   expect(contacts).toHaveLength(1);
  59 |   expect(contacts[0]).toMatchObject({ formName: "digitalni_cjenik", leadSource: "digitalni-cjenik", website: "https://primjer.hr" });
  60 | });
  61 | 
  62 | test("checker renders a green CSV result without leaking the checked domain into analytics", async ({ page }) => {
  63 |   await page.addInitScript(() => localStorage.setItem("nepar-consent-v1", JSON.stringify({ version: 1, analytics: true, updatedAt: new Date().toISOString() })));
  64 |   await page.route("https://www.googletagmanager.com/**", (route) => route.fulfill({ status: 200, contentType: "application/javascript", body: "" }));
  65 |   await mockWorker(page, {
  66 |     status: "green", message: "Na web stranici pronađen je javno dostupan CSV ili XML dokument.",
  67 |     details: { reachable: true, https: true, csvFound: true, xmlFound: false, pricePageFound: true, csvUrl: "https://primjer.hr/cjenik.csv", xmlUrl: null, pricePageUrl: "https://primjer.hr/cjenik.csv" },
  68 |   });
  69 |   await page.goto("/digitalni-cjenik");
  70 |   await page.getByLabel("Provjerite digitalni cjenik svoje web stranice").fill("https://primjer.hr");
  71 |   await page.getByRole("button", { name: "Provjeri", exact: true }).click();
  72 |   await expect(page.locator('[aria-live="polite"]')).toContainText("Pronađen CSV: /cjenik.csv");
  73 |   const events = await page.evaluate(() => (window.dataLayer || []).map((entry) => Array.from(entry)).filter((entry) => entry[0] === "event"));
  74 |   const resultEvent = events.find((entry) => entry[1] === "price_list_check_result");
  75 |   expect(resultEvent?.[2]).toEqual({ result: "green" });
  76 | });
  77 | 
```