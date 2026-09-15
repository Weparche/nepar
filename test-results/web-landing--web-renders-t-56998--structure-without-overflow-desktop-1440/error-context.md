# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web-landing.spec.js >> /web renders the locked acquisition structure without overflow
- Location: e2e\web-landing.spec.js:56:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/web?utm_source=chatgpt&utm_medium=paid&utm_campaign=web_hr
Call log:
  - navigating to "http://127.0.0.1:4173/web?utm_source=chatgpt&utm_medium=paid&utm_campaign=web_hr", waiting until "load"

```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | import AxeBuilder from "@axe-core/playwright";
  3   | 
  4   | const workerBase = "https://analytics.nepar.test";
  5   | 
  6   | async function persistConsent(page, analytics = true) {
  7   |   await page.addInitScript((enabled) => {
  8   |     localStorage.setItem("nepar-consent-v1", JSON.stringify({
  9   |       version: 1,
  10  |       analytics: enabled,
  11  |       updatedAt: new Date().toISOString(),
  12  |     }));
  13  |   }, analytics);
  14  | }
  15  | 
  16  | async function mockLandingNetwork(page, { contactStatus = 200, contactDelay = 0 } = {}) {
  17  |   const contactRequests = [];
  18  |   const pageviewRequests = [];
  19  | 
  20  |   await page.route("https://www.googletagmanager.com/**", (route) => (
  21  |     route.fulfill({ status: 200, contentType: "application/javascript", body: "" })
  22  |   ));
  23  |   await page.route(`${workerBase}/**`, async (route) => {
  24  |     const request = route.request();
  25  |     if (request.url() === `${workerBase}/analytics/pageview`) {
  26  |       pageviewRequests.push(JSON.parse(request.postData() || "{}"));
  27  |       await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
  28  |       return;
  29  |     }
  30  |     contactRequests.push(JSON.parse(request.postData() || "{}"));
  31  |     if (contactDelay) await new Promise((resolve) => setTimeout(resolve, contactDelay));
  32  |     await route.fulfill({
  33  |       status: contactStatus,
  34  |       contentType: "application/json",
  35  |       body: contactStatus >= 200 && contactStatus < 300 ? '{"ok":true}' : '{"error":"failed"}',
  36  |     });
  37  |   });
  38  | 
  39  |   return { contactRequests, pageviewRequests };
  40  | }
  41  | 
  42  | async function analyticsEvents(page) {
  43  |   return page.evaluate(() => (window.dataLayer || [])
  44  |     .map((entry) => Array.from(entry))
  45  |     .filter((entry) => entry[0] === "event")
  46  |     .map((entry) => ({ name: entry[1], params: entry[2] || {} })));
  47  | }
  48  | 
  49  | async function fillLandingForm(page) {
  50  |   await page.getByLabel("Ime").fill("Test Korisnik");
  51  |   await page.getByLabel("E-mail").fill("test@example.com");
  52  |   await page.getByLabel(/Telefon/).fill("+385 91 123 4567");
  53  |   await page.getByLabel("Što trebate?").fill("Profesionalnu web-stranicu za mali obrt.");
  54  | }
  55  | 
  56  | test("/web renders the locked acquisition structure without overflow", async ({ page }) => {
  57  |   await persistConsent(page, false);
> 58  |   await page.goto("/web?utm_source=chatgpt&utm_medium=paid&utm_campaign=web_hr");
      |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/web?utm_source=chatgpt&utm_medium=paid&utm_campaign=web_hr
  59  | 
  60  |   await expect(page.getByRole("heading", { level: 1, name: "Profesionalna web stranica za vaš posao. Sada od 240 €." })).toBeVisible();
  61  |   await expect(page.getByText("Brza, moderna i optimizirana za Google. Bez mjesečne pretplate — stranica je vaša.")).toBeVisible();
  62  |   await expect(page.locator('.web-header a[href="#upit"]')).toHaveText("Zatraži ponudu");
  63  |   await expect(page.locator('.web-header a[href="#reference"]')).toHaveText("Reference");
  64  |   await expect(page.locator('.web-header a[href="#cijene"]')).toHaveText("Cijene");
  65  | 
  66  |   const projectTitles = await page.locator(".web-project h3").allTextContents();
  67  |   expect(projectTitles).toEqual(["Auto Gubić", "BezStruje.hr", "VremenskaPrognoza.hr"]);
  68  |   const reasonImages = page.locator(".web-reason__media img");
  69  |   await expect(reasonImages).toHaveCount(3);
  70  |   const expectedReasonVariant = page.viewportSize().width <= 720 ? "mobile" : "desktop";
  71  |   for (const reasonImage of await reasonImages.all()) {
  72  |     await expect.poll(() => reasonImage.evaluate((image) => image.currentSrc)).toContain(`-${expectedReasonVariant}.webp`);
  73  |   }
  74  |   const projectLinks = page.locator("a.web-project");
  75  |   await expect(projectLinks).toHaveCount(3);
  76  |   await expect(projectLinks.nth(0)).toHaveAttribute("href", "https://autogubic.hr/");
  77  |   await expect(projectLinks.nth(1)).toHaveAttribute("href", "https://bezstruje.hr");
  78  |   await expect(projectLinks.nth(2)).toHaveAttribute("href", "https://vremenskaprognoza.hr");
  79  |   for (const projectLink of await projectLinks.all()) {
  80  |     await expect(projectLink).toHaveAttribute("target", "_blank");
  81  |     await expect(projectLink).toHaveAttribute("rel", /noopener/);
  82  |     await expect(projectLink).toHaveAttribute("rel", /noreferrer/);
  83  |   }
  84  |   await expect(page.locator(".web-package")).toHaveCount(3);
  85  |   await expect(page.locator(".web-package--featured")).toContainText("Business");
  86  |   await expect(page.locator(".web-package").nth(0)).toContainText("300 €240 €");
  87  |   await expect(page.locator(".web-package").nth(1)).toContainText("500 €400 €");
  88  |   await expect(page.locator(".web-package").nth(2)).toContainText("700 €560 €");
  89  |   await expect(page.locator(".web-package__discount")).toHaveCount(3);
  90  |   await page.locator(".web-pricing").scrollIntoViewIfNeeded();
  91  |   const packageImages = page.locator(".web-package__media img");
  92  |   await expect(packageImages).toHaveCount(3);
  93  |   const expectedPackageVariant = page.viewportSize().width <= 720 ? "mobile" : "desktop";
  94  |   for (const packageImage of await packageImages.all()) {
  95  |     await expect.poll(() => packageImage.evaluate((image) => image.currentSrc)).toContain(`-${expectedPackageVariant}.webp`);
  96  |   }
  97  |   await expect(page.locator(".web-process__list li")).toHaveCount(4);
  98  |   await expect(page.locator(".web-faq details")).toHaveCount(4);
  99  |   await expect(page.locator('#upit button[type="submit"]')).toHaveText(/Zatraži ponudu/);
  100 | 
  101 |   const dimensions = await page.evaluate(() => ({
  102 |     viewport: document.documentElement.clientWidth,
  103 |     content: document.documentElement.scrollWidth,
  104 |   }));
  105 |   expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
  106 | 
  107 |   const axe = await new AxeBuilder({ page }).analyze();
  108 |   const serious = axe.violations.filter(({ impact }) => impact === "serious" || impact === "critical");
  109 |   expect(serious, serious.map(({ id }) => id).join(", ")).toEqual([]);
  110 | });
  111 | 
  112 | test("successful submit emits one start_lead, one request, and exactly one generate_lead", async ({ page }) => {
  113 |   await persistConsent(page, true);
  114 |   const network = await mockLandingNetwork(page, { contactDelay: 120 });
  115 |   const longContent = `hero-${"x".repeat(220)}`;
  116 |   await page.goto(`/web?utm_source=%20chat%00gpt%20&utm_medium=paid&utm_campaign=web_hr&utm_content=${longContent}&utm_term=izrada%20weba&unknown=ignore-me`);
  117 |   await fillLandingForm(page);
  118 | 
  119 |   await expect.poll(async () => (await analyticsEvents(page)).filter(({ name }) => name === "start_lead").length).toBe(1);
  120 |   await page.locator('#upit button[type="submit"]').evaluate((button) => {
  121 |     button.click();
  122 |     button.click();
  123 |   });
  124 | 
  125 |   await expect(page.getByText("Upit je poslan.")).toBeVisible();
  126 |   await expect.poll(async () => (await analyticsEvents(page)).filter(({ name }) => name === "generate_lead").length).toBe(1);
  127 |   expect(network.contactRequests).toHaveLength(1);
  128 |   expect(network.contactRequests[0].formName).toBe("web_landing");
  129 |   expect(network.contactRequests[0].phone).toBe("+385 91 123 4567");
  130 |   expect(network.contactRequests[0].attribution).toEqual({
  131 |     utm_source: "chatgpt",
  132 |     utm_medium: "paid",
  133 |     utm_campaign: "web_hr",
  134 |     utm_content: longContent.slice(0, 160),
  135 |     utm_term: "izrada weba",
  136 |     landing_path: "/web",
  137 |   });
  138 | 
  139 |   const generateEvents = (await analyticsEvents(page)).filter(({ name }) => name === "generate_lead");
  140 |   expect(generateEvents).toHaveLength(1);
  141 |   expect(generateEvents[0].params).not.toHaveProperty("unknown");
  142 | });
  143 | 
  144 | test("configured Worker error preserves fields and never opens mail automatically", async ({ page }) => {
  145 |   await persistConsent(page, true);
  146 |   await mockLandingNetwork(page, { contactStatus: 502 });
  147 |   await page.goto("/web?utm_source=chatgpt&utm_medium=paid&utm_campaign=web_hr");
  148 |   await fillLandingForm(page);
  149 |   await page.locator('#upit button[type="submit"]').click();
  150 | 
  151 |   await expect(page.getByText("Upit trenutačno nije moguće poslati.")).toBeVisible();
  152 |   await expect(page).toHaveURL(/\/web\?utm_source=chatgpt/);
  153 |   await expect(page.getByLabel("Ime")).toHaveValue("Test Korisnik");
  154 |   await expect(page.getByLabel("E-mail")).toHaveValue("test@example.com");
  155 |   await expect(page.getByLabel(/Telefon/)).toHaveValue("+385 91 123 4567");
  156 |   await expect(page.getByLabel("Što trebate?")).toHaveValue("Profesionalnu web-stranicu za mali obrt.");
  157 |   await expect(page.getByRole("link", { name: "Pošalji e-mailom" })).toHaveAttribute("href", /^mailto:/);
  158 |   expect((await analyticsEvents(page)).filter(({ name }) => name === "generate_lead")).toHaveLength(0);
```