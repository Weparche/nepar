# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: analytics-consent.spec.js >> Worker error never produces generate_lead
- Location: e2e\analytics-consent.spec.js:112:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/kontakt
Call log:
  - navigating to "http://127.0.0.1:4173/kontakt", waiting until "load"

```

# Test source

```ts
  15  |     if (request.url() === workerPageview) {
  16  |       workerRequests.push(JSON.parse(request.postData() || "{}"));
  17  |       await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
  18  |       return;
  19  |     }
  20  |     await route.fulfill({
  21  |       status: contactStatus,
  22  |       contentType: "application/json",
  23  |       body: contactStatus >= 200 && contactStatus < 300 ? '{"ok":true}' : '{"error":"failed"}',
  24  |     });
  25  |   });
  26  | 
  27  |   return { googleRequests, workerRequests };
  28  | }
  29  | 
  30  | async function eventNames(page) {
  31  |   return page.evaluate(() => (window.dataLayer || [])
  32  |     .map((entry) => Array.from(entry))
  33  |     .filter((entry) => entry[0] === "event")
  34  |     .map((entry) => entry[1]));
  35  | }
  36  | 
  37  | async function persistAnalyticsConsent(page) {
  38  |   await page.addInitScript(() => {
  39  |     localStorage.setItem("nepar-consent-v1", JSON.stringify({
  40  |       version: 1,
  41  |       analytics: true,
  42  |       updatedAt: new Date().toISOString(),
  43  |     }));
  44  |   });
  45  | }
  46  | 
  47  | test("Basic consent blocks requests, enables one manual page view, and blocks again after withdrawal", async ({ page }) => {
  48  |   const requests = await mockAnalytics(page);
  49  |   await page.goto("/usluge/izrada-web-stranica?private=value#paketi");
  50  |   await page.waitForTimeout(500);
  51  | 
  52  |   expect(requests.googleRequests).toHaveLength(0);
  53  |   expect(requests.workerRequests).toHaveLength(0);
  54  |   await page.getByRole("button", { name: "Odbij analitiku" }).click();
  55  |   await page.reload();
  56  |   await page.waitForTimeout(500);
  57  |   expect(requests.googleRequests).toHaveLength(0);
  58  |   expect(requests.workerRequests).toHaveLength(0);
  59  | 
  60  |   await page.evaluate(() => window.dispatchEvent(new Event("nepar:open-consent-settings")));
  61  |   await page.getByRole("button", { name: "Prihvati analitiku" }).click();
  62  |   await expect.poll(() => requests.googleRequests.length).toBe(1);
  63  |   await expect.poll(() => requests.workerRequests.length).toBe(1);
  64  |   expect(requests.workerRequests[0].path).toBe("/usluge/izrada-web-stranica");
  65  | 
  66  |   const menuButton = page.getByRole("button", { name: "Otvori navigaciju" });
  67  |   if (await menuButton.isVisible()) await menuButton.click();
  68  |   await page.getByRole("link", { name: "Kontakt", exact: true }).click();
  69  |   await expect(page).toHaveURL(/\/kontakt$/);
  70  |   await expect.poll(() => requests.workerRequests.length).toBe(2);
  71  |   expect((await eventNames(page)).filter((name) => name === "page_view")).toHaveLength(2);
  72  | 
  73  |   const beforeWithdrawal = requests.googleRequests.length;
  74  |   await page.evaluate(() => window.dispatchEvent(new Event("nepar:open-consent-settings")));
  75  |   await page.getByRole("button", { name: "Odbij analitiku" }).click();
  76  |   await page.waitForLoadState("domcontentloaded");
  77  |   await page.waitForTimeout(500);
  78  |   expect(requests.googleRequests).toHaveLength(beforeWithdrawal);
  79  |   expect(requests.workerRequests).toHaveLength(2);
  80  |   await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("nepar-consent-v1")).analytics)).toBe(false);
  81  | });
  82  | 
  83  | test("funnel fires in order and generate_lead follows only a confirmed 2xx response", async ({ page }) => {
  84  |   await persistAnalyticsConsent(page);
  85  |   await mockAnalytics(page);
  86  |   await page.goto("/usluge/izrada-web-stranica");
  87  |   await expect.poll(async () => (await eventNames(page)).filter((name) => name === "page_view").length).toBe(1);
  88  | 
  89  |   await page.locator("#paketi").scrollIntoViewIfNeeded();
  90  |   await expect.poll(async () => (await eventNames(page)).includes("view_packages")).toBe(true);
  91  | 
  92  |   const businessCard = page.locator('[data-package-id="business"]');
  93  |   await businessCard.getByRole("button", { name: "Pošalji upit za paket" }).click();
  94  |   await page.getByLabel("Ime i prezime").fill("Test User");
  95  |   await expect.poll(async () => (await eventNames(page)).includes("start_lead")).toBe(true);
  96  |   await page.getByLabel("E-mail adresa").fill("test@example.com");
  97  |   await page.getByLabel("Kratko opišite projekt").fill("Testna poruka bez slanja PII-ja u analitiku.");
  98  |   await page.getByRole("dialog", { name: "Pošaljite upit" })
  99  |     .getByRole("button", { name: "Pošalji upit", exact: true })
  100 |     .click();
  101 |   await expect.poll(async () => (await eventNames(page)).includes("generate_lead")).toBe(true);
  102 | 
  103 |   const funnel = (await eventNames(page)).filter((name) => [
  104 |     "page_view",
  105 |     "view_packages",
  106 |     "start_lead",
  107 |     "generate_lead",
  108 |   ].includes(name));
  109 |   expect(funnel).toEqual(["page_view", "view_packages", "start_lead", "generate_lead"]);
  110 | });
  111 | 
  112 | test("Worker error never produces generate_lead", async ({ page }) => {
  113 |   await persistAnalyticsConsent(page);
  114 |   await mockAnalytics(page, { contactStatus: 502 });
> 115 |   await page.goto("/kontakt");
      |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/kontakt
  116 |   await page.getByLabel("Ime i prezime").fill("Test User");
  117 |   await page.getByLabel("E-mail adresa").fill("test@example.com");
  118 |   await page.getByLabel("Poruka").fill("Test failure path");
  119 |   await page.getByRole("button", { name: "Pošalji poruku" }).click();
  120 |   await expect(page.getByText(/Slanje nije uspjelo/)).toBeVisible();
  121 |   expect(await eventNames(page)).not.toContain("generate_lead");
  122 | });
  123 | 
```