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
  await page.goto("/digitalni-cjenik");
  await expect(page).toHaveTitle("Digitalni cjenik XML/CSV od 1.10.2026. | NEPAR");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Nova obveza digitalnih cjenika/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://nepar.hr/digitalni-cjenik");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Narodne novine" })).toHaveAttribute("href", /101_1213/);
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
  expect(errors).toEqual([]);
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
