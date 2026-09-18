import { expect, test } from "@playwright/test";

const guides = [
  {
    path: "/digitalni-cjenik/sidrena-cijena",
    title: "Sidrena cijena 2026: što znači i kako se ističe | NEPAR",
    h1: "Sidrena cijena 2026: što znači i kako se razlikuje od digitalnog cjenika",
  },
  {
    path: "/digitalni-cjenik/xml-csv",
    title: "XML/CSV digitalni cjenik 2026: format, arhiva i obveze | NEPAR",
    h1: "XML/CSV digitalni cjenik 2026: što mora biti javno dostupno na webu",
  },
  {
    path: "/digitalni-cjenik/automatizacija",
    title: "Automatizacija digitalnog cjenika: kako povezati cijene s webom | NEPAR",
    h1: "Automatizacija digitalnog cjenika: kako povezati cijene s webom bez dvostrukog unosa",
  },
];

for (const guide of guides) {
  test(`${guide.path} is prerendered, canonical, and AI-search ready`, async ({ page }) => {
    const staticResponse = await page.request.get(guide.path);
    expect(staticResponse.ok()).toBeTruthy();
    const staticHtml = await staticResponse.text();
    expect(staticHtml).toContain("data-nepar-static-content");
    expect(staticHtml).toContain(guide.h1);
    expect(staticHtml).toContain("NEPAR Digital Price Engine");
    expect(staticHtml).toContain("TechArticle");
    expect(staticHtml).toContain("FAQPage");
    expect(staticHtml).toContain("NN 101/2026-1213");

    await page.goto(guide.path);
    await expect(page).toHaveTitle(guide.title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `https://nepar.hr${guide.path}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(guide.h1);
    await expect(page.getByRole("heading", { name: "Jedan izvor cijena, svi potrebni izlazi" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Besplatna provjera", exact: true }).first()).toHaveAttribute("href", "/digitalni-cjenik");
    const schema = await page.locator('script[data-nepar-schema]').textContent();
    expect(schema).toContain("TechArticle");
    expect(schema).toContain("NEPAR Digital Price Engine");
    expect(schema).toContain("2026_09_101_1212");
    expect(schema).toContain("2026_09_101_1213");

    await page.setViewportSize({ width: 390, height: 844 });
    const dimensions = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }));
    expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
  });
}

test("client-side navigation from /digitalni-cjenik reaches a guide without a 404", async ({ page }) => {
  await page.goto("/digitalni-cjenik");
  await page.getByRole("link", { name: "Vodič za sidrenu cijenu", exact: true }).click();
  await expect(page).toHaveURL(/\/digitalni-cjenik\/sidrena-cijena$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sidrena cijena 2026: što znači i kako se razlikuje od digitalnog cjenika");
});

test("sidrena-cijena guide states the 10 September 2026 date and its 2 May 2025 exception", async ({ page }) => {
  const staticHtml = await (await page.request.get("/digitalni-cjenik/sidrena-cijena")).text();
  expect(staticHtml).toContain("10. rujna 2026.");
  expect(staticHtml).toContain("2. svibnja 2025.");
  expect(staticHtml).toContain("Iznimka");
});

test("xml-csv guide gives products and services non-identical required fields and explains the prescribed filename elements", async ({ page }) => {
  const staticHtml = await (await page.request.get("/digitalni-cjenik/xml-csv")).text();
  expect(staticHtml).toContain("naziv usluge, maloprodajnu cijenu");
  expect(staticHtml).toContain("naziv, šifru, marku, jedinicu mjere, cijenu, EAN odnosno barkod");
  expect(staticHtml).toContain("nisu univerzalno obvezni podaci za pružatelje usluga");
  expect(staticHtml).toContain("oblik, adresu i oznaku prodajnog objekta, broj pohrane");
  expect(staticHtml).toContain("ne propisuje točan separator, slug format ni encoding naziva");
});

test("xml-csv and automatizacija intros open with a definition, not a comparison or narrative frame", async ({ page }) => {
  const xmlCsvHtml = await (await page.request.get("/digitalni-cjenik/xml-csv")).text();
  expect(xmlCsvHtml).toContain("XML/CSV digitalni cjenik je javno dostupna datoteka s cijenama");

  const automationHtml = await (await page.request.get("/digitalni-cjenik/automatizacija")).text();
  expect(automationHtml).toContain("automatizacija digitalnog cjenika znači da se cijene povlače iz postojećeg izvora");
  expect(automationHtml).toContain("automatski generiraju");
});

test("hub and its three supporting guides all have unique title and H1", async ({ page }) => {
  const pages = ["/digitalni-cjenik", ...guides.map((guide) => guide.path)];
  const titles = new Set();
  const h1s = new Set();
  for (const path of pages) {
    await page.goto(path);
    const title = await page.title();
    const h1 = await page.getByRole("heading", { level: 1 }).textContent();
    expect(titles.has(title), `duplicate title on ${path}: ${title}`).toBe(false);
    expect(h1s.has(h1), `duplicate H1 on ${path}: ${h1}`).toBe(false);
    titles.add(title);
    h1s.add(h1);
  }
});
