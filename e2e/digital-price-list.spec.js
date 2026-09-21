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
  expect(staticHtml).toContain('39,90 €');
  expect(staticHtml).toContain('NEPAR Publisher');
  expect(staticHtml).toContain('89,90 €');
  expect(staticHtml).not.toContain('Plugin 49,90');
  expect(staticHtml).not.toContain('19,90 € / godišnje');
  expect(staticHtml).not.toContain('NEPAR Digital Price Engine');
  expect(staticHtml).toContain('Što još nije definirano');
  expect(staticHtml).toContain('primjer-usluge.csv');
  await page.goto("/digitalni-cjenik");
  await expect(page).toHaveTitle("Digitalni cjenik 2026 – CSV/XML i sidrena cijena | NEPAR");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /MIKROeRAČUN\? Objavite cjenik na webu uz NEPAR Publisher/);
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

test("compliance summary separates legal requirements from NEPAR implementation choices", async ({ page }) => {
  const staticResponse = await page.request.get("/digitalni-cjenik");
  const staticHtml = await staticResponse.text();
  expect(staticHtml).toContain("Digitalni cjenik od 1.10.2026. — što je stvarno obvezno?");
  expect(staticHtml).toContain("jednom dnevno, najkasnije do 8:00, za tekući radni dan");
  expect(staticHtml).toContain("kod svake promjene, najkasnije do 8:00");
  expect(staticHtml).toContain("30 dana od objave odnosno promjene");
  expect(staticHtml).toContain("ne propisuje direktorij, ZIP arhivu, bazu podataka");
  expect(staticHtml).toContain("ne propisuje konkretan API framework, REST endpoint, cron raspored ni webhook");
  expect(staticHtml).toContain("Propis vs. NEPAR implementacija");
  expect(staticHtml).toContain("Propisane elemente naziva datoteke");
  expect(staticHtml).toContain("oblik prodajnog objekta, adresu prodajnog objekta, oznaku prodajnog objekta, broj pohrane");
  expect(staticHtml).toContain("ne propisuje točan separator, slug format ni encoding naziva");
  expect(staticHtml).toContain("Primjer NEPAR implementacije");
  expect(staticHtml).toContain("Sidrena cijena je praktičan naziv za dodatnu maloprodajnu cijenu");
  expect(staticHtml).toContain("Trgovac ili pružatelj usluge — što cjenik mora sadržavati?");
  expect(staticHtml).toContain("EAN odnosno barkod");
  expect(staticHtml).toContain("Barkod, marka, jedinica mjere i dostupnost odnose se na proizvode");
  await page.goto("/digitalni-cjenik");
  await expect(page.getByRole("link", { name: "Vodič za sidrenu cijenu", exact: true }).first()).toHaveAttribute("href", "/digitalni-cjenik/sidrena-cijena");
  await expect(page.getByRole("link", { name: "XML i CSV digitalni cjenik", exact: true }).first()).toHaveAttribute("href", "/digitalni-cjenik/xml-csv");
  await expect(page.getByRole("link", { name: "Automatizacija digitalnog cjenika", exact: true }).first()).toHaveAttribute("href", "/digitalni-cjenik/automatizacija");
});

test("FAQ visible content and JSON-LD schema come from the same source", async ({ page }) => {
  await page.goto("/digitalni-cjenik");
  await expect(page.getByText("Je li 10. rujna 2026. datum sidrene cijene za sve proizvode?")).toBeVisible();
  await expect(page.getByText("Mora li arhiva biti u /cjenik/arhiva/ direktoriju?")).toBeVisible();
  const schema = await page.locator('script[data-nepar-schema]').textContent();
  expect(schema).toContain("Je li 10. rujna 2026. datum sidrene cijene za sve proizvode?");
  expect(schema).toContain("2. svibnja 2025.");
  expect(schema).toContain("Mora li arhiva biti u /cjenik/arhiva/ direktoriju?");
});

test("checker archive signal wording reads as a technical signal, not a legal verdict", async ({ page }) => {
  await mockWorker(page, { status: "green", message: "ok", details: { reachable: true, https: true, csvFound: true, xmlFound: false, pricePageFound: true, archiveFound: true, csvUrl: "https://primjer.hr/cjenik.csv", xmlUrl: null, pricePageUrl: "https://primjer.hr/cjenik/", archiveUrl: "https://primjer.hr/cjenik/arhiva", csvLinkDiscovered: true, xmlLinkDiscovered: false, archiveLinkDiscovered: true } });
  await page.goto("/digitalni-cjenik");
  await page.getByLabel("Provjerite digitalni cjenik svoje web stranice").fill("https://primjer.hr");
  await page.getByRole("button", { name: "Provjeri", exact: true }).click();
  await expect(page.locator('[aria-live="polite"]')).toContainText("Pronađen signal arhive cjenika");
  await expect(page.locator('[aria-live="polite"]')).not.toContainText("zakonski obvezna");
});

test("pricing, FAQs, checker disclaimer, and TechArticle citations stay crawlable and responsive", async ({ page }) => {
  await page.goto("/digitalni-cjenik");
  await expect(page.getByRole("heading", { name: "NEPAR Publisher", exact: true })).toBeVisible();
  await expect(page.getByText(/Uvodna cijena: 39,90 €\/god za prvih 100/).first()).toBeVisible();
  await expect(page.getByText("Nakon toga 49,90 €/god.").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Provjera", exact: true })).toHaveCount(1);
  await expect(page.getByText("Rješava li MIKROeRAČUN i digitalni cjenik?")).toBeVisible();
  await expect(page.locator('a[href="https://digitalnicjenik.nepar.hr"]').first()).toBeVisible();
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
    details: { reachable: true, https: true, csvFound: false, xmlFound: false, pricePageFound: true, csvUrl: null, xmlUrl: null, pricePageUrl: "https://primjer.hr/cjenici/", xmlLinkDiscovered: true },
  });
  await page.goto("/digitalni-cjenik");
  await page.getByLabel("Provjerite digitalni cjenik svoje web stranice").fill("primjer.hr");
  await page.getByRole("button", { name: "Provjeri", exact: true }).click();
  const result = page.locator('[aria-live="polite"]');
  await expect(result).toContainText("Pronašli smo cjenik, ali ne i XML/CSV");
  await expect(result).toContainText("Stranica cjenika: /cjenici/");
  await expect(result).toContainText("CSV: nije pronađen");
  await expect(result).toContainText("XML: pronađen link, ali dostupnost nije potvrđena");
  await expect(result).not.toContainText("XML: nije pronađen");
  await expect(result).toContainText("Ne provjerava obvezu isticanja dodatne/sidrene cijene");
  await result.getByRole("button", { name: "Zatražite ponudu" }).click();
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
  await page.getByRole("button", { name: "Zatraži postavljanje", exact: true }).first().click();
  await expect(page.locator("dialog.inquiry-dialog")).toBeVisible();
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
    details: { reachable: true, https: true, csvFound: true, xmlFound: true, pricePageFound: true, csvUrl: "https://primjer.hr/cjenik.csv", xmlUrl: "https://primjer.hr/cjenik.xml", pricePageUrl: "https://primjer.hr/cjenici/" },
  });
  await page.goto("/digitalni-cjenik");
  await page.getByLabel("Provjerite digitalni cjenik svoje web stranice").fill("https://primjer.hr");
  await page.getByRole("button", { name: "Provjeri", exact: true }).click();
  await expect(page.locator('[aria-live="polite"]')).toContainText("Pronađen CSV: /cjenik.csv");
  await expect(page.locator('[aria-live="polite"]')).toContainText("Pronađen XML: /cjenik.xml");
  await expect(page.locator('[aria-live="polite"]')).toContainText("Stranica cjenika: /cjenici/");
  const events = await page.evaluate(() => (window.dataLayer || []).map((entry) => Array.from(entry)).filter((entry) => entry[0] === "event"));
  const resultEvent = events.find((entry) => entry[1] === "price_list_check_result");
  expect(resultEvent?.[2]).toEqual({ result: "green" });
});

test("checker prevents malformed input and gives a recoverable unavailable state", async ({ page }) => {
  let checkerCalls = 0;
  await page.route(`${workerBase}/api/digitalni-cjenik/check`, async (route) => {
    checkerCalls += 1;
    await route.fulfill({ status: 503, contentType: "application/json", body: '{"error":"unavailable"}' });
  });
  await page.goto("/digitalni-cjenik");
  const input = page.getByLabel("Provjerite digitalni cjenik svoje web stranice");
  await input.fill("https://");
  await page.getByRole("button", { name: "Provjeri", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Unesite ispravnu adresu");
  expect(checkerCalls).toBe(0);
  await input.fill("primjer.hr");
  await page.getByRole("button", { name: "Provjeri", exact: true }).click();
  const result = page.locator('[aria-live="polite"]');
  await expect(result).toContainText("Provjera trenutačno nije dostupna");
  await expect(result).toContainText("Pokušajte ponovo");
  await expect(result).not.toContainText("CSV: nije pronađen");
  expect(checkerCalls).toBe(1);
});