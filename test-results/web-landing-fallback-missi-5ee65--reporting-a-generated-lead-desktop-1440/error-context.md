# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web-landing-fallback.spec.js >> missing Worker opens the explicit mail fallback without reporting a generated lead
- Location: e2e\web-landing-fallback.spec.js:10:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/web?utm_source=chatgpt&utm_medium=paid&utm_campaign=web_hr
Call log:
  - navigating to "http://127.0.0.1:4173/web?utm_source=chatgpt&utm_medium=paid&utm_campaign=web_hr", waiting until "load"

```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | async function analyticsEvents(page) {
  4  |   return page.evaluate(() => (window.dataLayer || [])
  5  |     .map((entry) => Array.from(entry))
  6  |     .filter((entry) => entry[0] === "event")
  7  |     .map((entry) => entry[1]));
  8  | }
  9  | 
  10 | test("missing Worker opens the explicit mail fallback without reporting a generated lead", async ({ page }) => {
  11 |   await page.addInitScript(() => {
  12 |     localStorage.setItem("nepar-consent-v1", JSON.stringify({
  13 |       version: 1,
  14 |       analytics: true,
  15 |       updatedAt: new Date().toISOString(),
  16 |     }));
  17 |   });
  18 |   await page.route("https://www.googletagmanager.com/**", (route) => (
  19 |     route.fulfill({ status: 200, contentType: "application/javascript", body: "" })
  20 |   ));
  21 | 
> 22 |   await page.goto("/web?utm_source=chatgpt&utm_medium=paid&utm_campaign=web_hr");
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/web?utm_source=chatgpt&utm_medium=paid&utm_campaign=web_hr
  23 |   await page.getByLabel("Ime").fill("Test Korisnik");
  24 |   await page.getByLabel("E-mail").fill("test@example.com");
  25 |   await page.getByLabel("Što trebate?").fill("Testni projekt bez konfiguriranog Workera.");
  26 |   await page.locator('#upit button[type="submit"]').click();
  27 | 
  28 |   await expect(page.getByText("Otvorili smo vašu e-mail aplikaciju. Poruku još trebate poslati.")).toBeVisible();
  29 |   await expect(page.getByText("Upit je poslan.")).toHaveCount(0);
  30 |   await expect.poll(async () => (await analyticsEvents(page)).filter((name) => name === "click_email").length).toBe(1);
  31 |   expect((await analyticsEvents(page)).filter((name) => name === "generate_lead")).toHaveLength(0);
  32 | });
  33 | 
```