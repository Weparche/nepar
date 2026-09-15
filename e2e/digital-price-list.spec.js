import { expect, test } from "@playwright/test";

const workerBase = "https://analytics.nepar.test";

async function mockWorker(page, checkerResult) {
  const contacts = [];
  await page.route(`${workerBase}/**`, async (route) => {
    const request = route.request();
    if (request.url().endsWith("/api/digitalni-cjenik/check")) {
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(checkerResult) });
      return;
    }
    if (request.url().endsWith("/analytics/pageview")) {
      await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
      return;
    }
    contacts.push(JSON.parse(request.postData() || "{}"));
    await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
  });
  return contacts;
}

test("/digitalni-cjenik has Croatian static SEO, one H1, and the official source", async ({ page }) => {
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  const staticResponse = await page.request.get("/digitalni-cjenik");
  const staticHtml = await staticResponse.text();
  expect(staticHtml).toContain('data-nepar-static-content');
  expect(staticHtml).toContain('NN 101/2026-1212');
  expect(staticHtml).toContain('NN 101/2026-1213');
  expect(staticHtml).toContain('Dvije povezane, ali odvojene obveze');
  expect(staticHtml).toContain('Digitalni cjenik nije obveza samo za webshopove');
  expect(staticHtml).toContain('od 129 €');
  expect(staticHtml).toContain('79,90 €');
  expect(staticHtml).toContain('139,80 €');
  expect(staticHtml).toContain('od 149 €');
  expect(staticHtml).toContain('19,90 € / godišnje');
  expect(staticHtml).toContain('Što još nije definirano');
  expect(staticHtml).toContain('primjer-usluge.csv');
  await page.goto("/digitalni-cjenik");
  await expect(page).toHaveTitle("Digitalni cjenik XML/CSV od 1.10.2026. | NEPAR");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Nova obveza digitalnih cjenika/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://nepar.hr/digitalni-cjenik");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Narodne novine", exact: true })).toHaveAttribute("href", /101_1213/);
  await expect(page.getByRole("link", { name: "NN 101/2026-1212", exact: true }).first()).toHaveAttribute("href", /101_1212/);
  await expect(page.getByRole("link", { name: "Ministarstvo gospodarstva" })).toHaveAttribute("href", /mingo\.gov\.hr/);
  await expect(page.getByRole("link", { name: "Preuzmite primjer-usluge.csv" })).toHaveAttribute("href", "/digitalni-cjenik/primjer-usluge.csv");
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
  expect(errors).toEqual([]);
});

test("pricing, FAQs, checker disclaimer, and TechArticle citations stay crawlable and responsive", async ({ page }) => {
  await page.goto("/digitalni-cjenik");
  await expect(page.getByText("od 129 €", { exact: true })).toBeVisible();
  await expect(page.getByText("79,90 €", { exact: true })).toBeVisible();
  await expect(page.getByText("139,80 €", { exact: true })).toBeVisible();
  await expect(page.getByText(/integracija je od 149 €/)).toBeVisible();
  await expect(page.getByText("19,90 € / godišnje", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "NEPAR implementira" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "WordPress opcija" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Provjera web stranice" })).toHaveCount(1);
  await expect(page.getByText("Odnosi li se nova obveza samo na webshopove?")).toBeVisible();
  await expect(page.getByText("Koja je razlika između sidrene cijene i digitalnog cjenika?")).toBeVisible();
  await expect(page.getByText("Imam samo Facebook ili Instagram. Moram li imati XML/CSV cjenik?")).toBeVisible();
  const schema = await page.locator('script[data-nepar-schema]').textContent();
  expect(schema).toContain("2026_09_101_1212");
  expect(schema).toContain("2026_09_101_1213");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole("button", { name: "Provjeri", exact: true })).toBeInViewport();
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
});

test("checker displays concrete yellow findings and prefills the lead form", async ({ page }) => {
  const contacts = await mockWorker(page, {
    status: "yellow",
    message: "Na stranici postoje informacije o cijenama ili cjeniku, ali automatska provjera nije pronašla javno dostupan XML ili CSV dokument.",
    details: { reachable: true, https: true, csvFound: false, xmlFound: false, pricePageFound: true, csvUrl: null, xmlUrl: null, pricePageUrl: "https://primjer.hr/cjenik.pdf" },
  });
  await page.goto("/digitalni-cjenik");
  await page.getByLabel("Provjerite digitalni cjenik svoje web stranice").fill("primjer.hr");
  await page.getByRole("button", { name: "Provjeri", exact: true }).click();
  const result = page.locator('[aria-live="polite"]');
  await expect(result).toContainText("Pronašli smo cjenik, ali ne i XML/CSV");
  await expect(result).toContainText("/cjenik.pdf");
  await expect(result).toContainText("CSV: nije pronađen");
  await expect(result).toContainText("Ne provjerava obvezu isticanja dodatne/sidrene cijene");
  await result.getByRole("button", { name: "Zatraži implementaciju" }).click();
  await expect(page.getByLabel("Web stranica")).toHaveValue("https://primjer.hr");
  await page.getByLabel("Ime ili naziv tvrtke").fill("Test obrt");
  await page.getByLabel("E-mail").fill("test@example.com");
  await page.getByLabel("Platforma").selectOption("WordPress");
  await page.getByLabel("Poruka").fill("Trebam implementaciju.");
  await page.getByRole("button", { name: "Pošalji upit" }).click();
  await expect(page.getByText("Upit je poslan. Javit ćemo se uskoro.")).toBeVisible();
  expect(contacts).toHaveLength(1);
  expect(contacts[0]).toMatchObject({ formName: "digitalni_cjenik", leadSource: "digitalni-cjenik", website: "https://primjer.hr" });
});

test("lead form accepts a bare www domain and sends its normalized website", async ({ page }) => {
  const contacts = await mockWorker(page, { status: "red", message: "", details: {} });
  await page.goto("/digitalni-cjenik");
  const website = page.getByLabel("Web stranica");
  await website.fill("www.mile.hr");
  await website.press("Tab");
  await expect(website).toHaveValue("https://www.mile.hr");
  await page.getByLabel("Ime ili naziv tvrtke").fill("Mile doo");
  await page.getByLabel("E-mail").fill("ig29007@gmail.com");
  await page.getByLabel("Platforma").selectOption("WordPress");
  await page.getByLabel("Poruka").fill("Digitalni cjenik");
  await page.getByRole("button", { name: "Pošalji upit" }).click();
  await expect(page.getByText("Upit je poslan. Javit ćemo se uskoro.")).toBeVisible();
  expect(contacts).toHaveLength(1);
  expect(contacts[0]).toMatchObject({ website: "https://www.mile.hr", formName: "digitalni_cjenik", leadSource: "digitalni-cjenik" });
});

test("checker renders a green CSV result without leaking the checked domain into analytics", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("nepar-consent-v1", JSON.stringify({ version: 1, analytics: true, updatedAt: new Date().toISOString() })));
  await page.route("https://www.googletagmanager.com/**", (route) => route.fulfill({ status: 200, contentType: "application/javascript", body: "" }));
  await mockWorker(page, {
    status: "green", message: "Na web stranici pronađen je javno dostupan CSV ili XML dokument.",
    details: { reachable: true, https: true, csvFound: true, xmlFound: false, pricePageFound: true, csvUrl: "https://primjer.hr/cjenik.csv", xmlUrl: null, pricePageUrl: "https://primjer.hr/cjenik.csv" },
  });
  await page.goto("/digitalni-cjenik");
  await page.getByLabel("Provjerite digitalni cjenik svoje web stranice").fill("https://primjer.hr");
  await page.getByRole("button", { name: "Provjeri", exact: true }).click();
  await expect(page.locator('[aria-live="polite"]')).toContainText("Pronađen CSV: /cjenik.csv");
  const events = await page.evaluate(() => (window.dataLayer || []).map((entry) => Array.from(entry)).filter((entry) => entry[0] === "event"));
  const resultEvent = events.find((entry) => entry[1] === "price_list_check_result");
  expect(resultEvent?.[2]).toEqual({ result: "green" });
});
