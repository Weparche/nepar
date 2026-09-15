import { expect, test } from "@playwright/test";
import { nepaUsluge } from "../src/cjenikData.js";
import { cjenikMeta, canonicalCjenikFilename } from "../src/cjenikMeta.js";

test("/cjenik has crawlable static content, official fields, and NEPAR services", async ({ page }) => {
  const staticResponse = await page.request.get("/cjenik");
  const staticHtml = await staticResponse.text();
  expect(staticHtml).toContain("data-nepar-static-content");
  expect(staticHtml).toContain("Web Basic");
  expect(staticHtml).toContain("nova usluga");
  expect(staticHtml).toContain("Izrada web-stranica");
  expect(staticHtml).toContain("Usluge digitalnog cjenika");
  expect(staticHtml).toContain("Jednokratno");
  expect(staticHtml).toContain('id="cjenik-od-note"');
  // Each category table must announce its own name, not one generic caption shared by all of them.
  expect(staticHtml).toContain("digitalni cjenik usluga: Izrada web-stranica");
  expect(staticHtml).toContain("digitalni cjenik usluga: Usluge digitalnog cjenika");
  // The "as-of" date must be human-formatted, never the raw ISO value from cjenikMeta.
  expect(staticHtml).not.toContain(cjenikMeta.publishedAt);

  await page.goto("/cjenik");
  await expect(page).toHaveTitle("NEPAR — digitalni cjenik usluga | Nepar Solutions");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://nepar.hr/cjenik");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  // "Web Basic" appears twice by design: the desktop table and the mobile dl fallback are
  // both in the DOM, toggled by CSS (hidden sm:block / sm:hidden) rather than conditional
  // rendering, so presence (not visibility, which depends on the viewport) is what matters here.
  await expect(page.getByText("Web Basic", { exact: true }).first()).toBeAttached();
  await expect(page.getByRole("link", { name: /Preuzmite \/cjenik\.csv/ })).toHaveAttribute("href", "/cjenik.csv");
  await expect(page.getByRole("link", { name: /Preuzmite \/cjenik\.xml/ })).toHaveAttribute("href", "/cjenik.xml");
  await expect(page.getByRole("link", { name: /Arhiva prethodnih verzija/ })).toHaveAttribute("href", "/cjenik/arhiva");
});

test("/cjenik.csv has the official Odluka columns plus clearly-marked NEPAR extensions", async ({ page }) => {
  const response = await page.request.get("/cjenik.csv");
  const csv = await response.text();
  const header = csv.split("\n")[0];
  expect(header).toBe("naziv_usluge,maloprodajna_cijena,posebni_oblik_prodaje,naziv_posebnog_oblika_prodaje,sidrena_cijena,nepar_cijena_od,nepar_napomena");
  expect(csv).toContain("Web Basic,300.00,false,,300.00,false,");
  expect(csv).toContain("Provjera digitalnog cjenika web-stranice,0.00,false,,,false,");
});

test("/cjenik.xml has the digitalni-cjenik root, official fields, and NEPAR extensions", async ({ page }) => {
  const response = await page.request.get("/cjenik.xml");
  const xml = await response.text();
  expect(xml).toContain("<digitalni-cjenik");
  expect(xml).toContain('oznaka-prodajnog-objekta="WEB-NEPAR-01"');
  expect(xml).toContain("<naziv_usluge>Web Basic</naziv_usluge>");
  expect(xml).toContain("<nepar_cijena_od>");
});

test("/cjenici/<canonical file> exists and matches the /cjenik.csv and /cjenik.xml aliases", async ({ page }) => {
  const csvName = canonicalCjenikFilename(cjenikMeta, "csv");
  const xmlName = canonicalCjenikFilename(cjenikMeta, "xml");
  const [canonicalCsv, aliasCsv] = await Promise.all([
    page.request.get(`/cjenici/${csvName}`).then((r) => r.text()),
    page.request.get("/cjenik.csv").then((r) => r.text()),
  ]);
  expect(canonicalCsv).toBe(aliasCsv);

  const [canonicalXml, aliasXml] = await Promise.all([
    page.request.get(`/cjenici/${xmlName}`).then((r) => r.text()),
    page.request.get("/cjenik.xml").then((r) => r.text()),
  ]);
  expect(canonicalXml).toBe(aliasXml);
});

test("/cjenik/arhiva lists the current version and states there is no history yet", async ({ page }) => {
  const staticResponse = await page.request.get("/cjenik/arhiva");
  const staticHtml = await staticResponse.text();
  expect(staticHtml).toContain("data-nepar-static-content");
  expect(staticHtml).toContain("Nema starijih verzija");
  expect(staticHtml).not.toContain(cjenikMeta.publishedAt);

  await page.goto("/cjenik/arhiva");
  await expect(page).toHaveTitle("Arhiva digitalnog cjenika | Nepar Solutions");
  await expect(page.getByRole("link", { name: /Natrag na trenutni cjenik/ })).toHaveAttribute("href", "/cjenik");
});

test("every NEPAR usluga has a stable id and either a sidrena cijena or an explicit new-service note", () => {
  for (const usluga of nepaUsluge) {
    expect(usluga.id).toMatch(/^[a-z0-9-]+$/);
    if (usluga.sidrenaCijena == null) expect(usluga.napomena).toContain("10.09.2026");
  }
});
