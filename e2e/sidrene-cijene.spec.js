import { expect, test } from "@playwright/test";

test("/sidrene-cijene has a self-canonical, correct title, and one H1", async ({ page }) => {
  const staticResponse = await page.request.get("/sidrene-cijene");
  const staticHtml = await staticResponse.text();
  expect(staticHtml).toContain("data-nepar-static-content");
  await page.goto("/sidrene-cijene");
  await expect(page).toHaveTitle("Sidrena cijena od 1.10.2026. – obveze i digitalni cjenik | NEPAR");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://nepar.hr/sidrene-cijene");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sidrena cijena od 1.10.2026. — što morate napraviti?");
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
});

test("obligation split keeps NN 101/2026-1212 website-independent and NN 101/2026-1213 website-conditioned", async ({ page }) => {
  const staticHtml = await (await page.request.get("/sidrene-cijene")).text();
  expect(staticHtml).toContain("Tko mora isticati sidrenu/dodatnu cijenu?");
  expect(staticHtml).toContain("Trgovci u maloprodaji i pružatelji usluga obuhvaćeni Odlukom NN 101/2026-1212. Ako oglašavaju cijene na svojoj mrežnoj stranici, dodatna cijena ističe se i tamo.");
  expect(staticHtml).toContain("Tko mora objaviti XML/CSV digitalni cjenik?");
  expect(staticHtml).toContain("Trgovac odnosno pružatelj usluge koji ima uspostavljenu mrežnu stranicu, prema NN 101/2026-1213.");
  // The 1212 obligation must never be stated as conditional on having a website.
  expect(staticHtml).not.toMatch(/obuhvaćeni Odlukom NN 101\/2026-1212[^.]*mrežnu stranicu/);
});

test("terminology correctly attributes 'dodatna cijena' to 1212 and 'sidrena cijena' to 1213", async ({ page }) => {
  const staticHtml = await (await page.request.get("/sidrene-cijene")).text();
  expect(staticHtml).toContain('U Odluci NN 101/2026-1212 koristi se izraz "dodatna cijena"');
  expect(staticHtml).toContain('za digitalne cjenike koristi se izraz "sidrena cijena"');
});

test("date exception and prescribed-vs-implementation facts are stated correctly", async ({ page }) => {
  const staticHtml = await (await page.request.get("/sidrene-cijene")).text();
  expect(staticHtml).toContain("10. rujna 2026.");
  expect(staticHtml).toContain("2. svibnja 2025.");
  expect(staticHtml).toContain("javno dostupnim najmanje 30 dana od objave odnosno promjene — to je zakonski zahtjev; način pohrane i URL struktura arhive nisu propisani.");
});

test("Publisher CTA and guide links point to the right destinations", async ({ page }) => {
  await page.goto("/sidrene-cijene");
  await expect(page.getByText(/Uvodna cijena: 39,90 €\/god za prvih 100/).first()).toBeVisible();
  await expect(page.getByText("Plugin 49,90")).toHaveCount(0);
  const productLinks = page.locator('a[href="https://digitalnicjenik.nepar.hr"]');
  await expect(productLinks).toHaveCount(2);
  await expect(page.getByRole("link", { name: "Provjerite obvezu digitalnog cjenika na webu →", exact: true })).toHaveAttribute("href", "/digitalni-cjenik");
  await expect(page.getByRole("link", { name: "Pročitajte detaljno →", exact: true })).toHaveAttribute("href", "/digitalni-cjenik/sidrena-cijena");
});

test("hero checker is immediately present and opens the implementation popup", async ({ page }) => {
  await page.goto("/sidrene-cijene");
  await expect(page.getByRole("heading", { name: "Provjerite digitalni cjenik svoje web stranice" })).toBeVisible();
  await expect(page.getByPlaceholder("https://vasadomena.hr")).toBeVisible();

  await page.getByRole("button", { name: "Pošaljite upit", exact: true }).first().click();
  const dialog = page.locator("dialog.inquiry-dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "Zatražite ponudu" })).toBeVisible();
  await expect(dialog.getByLabel("E-mail")).toBeVisible();
  await dialog.getByRole("button", { name: "Zatvori" }).click();
  await expect(dialog).toBeHidden();
});

test("obligation cards link to their respective supporting guides", async ({ page }) => {
  await page.goto("/sidrene-cijene");
  await expect(page.getByRole("link", { name: "Detaljan vodič za sidrenu cijenu" })).toHaveAttribute("href", "/digitalni-cjenik/sidrena-cijena");
  await expect(page.getByRole("link", { name: "Tehnički zahtjevi XML/CSV digitalnog cjenika" })).toHaveAttribute("href", "/digitalni-cjenik/xml-csv");
});

test("FAQ visible content matches JSON-LD schema and has exactly 3 questions", async ({ page }) => {
  await page.goto("/sidrene-cijene");
  await expect(page.getByText("Koja je razlika između sidrene cijene i digitalnog cjenika?")).toBeVisible();
  await expect(page.getByText("Je li 10. rujna 2026. datum sidrene cijene za sve proizvode?")).toBeVisible();
  await expect(page.getByText("Moram li dodati posebno polje u bazu podataka za sidrenu cijenu?")).toBeVisible();
  const schema = await page.locator('script[data-nepar-schema]').textContent();
  const parsed = JSON.parse(schema);
  const faqNode = parsed["@graph"].find((node) => node["@type"] === "FAQPage");
  expect(faqNode.mainEntity).toHaveLength(3);
});

test("mobile viewport has no horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/sidrene-cijene");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const dimensions = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
});
