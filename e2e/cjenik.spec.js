import { expect, test } from "@playwright/test";
import { nepaUsluge } from "../src/cjenikData.js";
import { cjenikMeta, canonicalCjenikFilename } from "../src/cjenikMeta.js";
import { retainedSnapshots } from "../scripts/cjenikArchive.js";

const archived = retainedSnapshots("cjenik-archive");

test("/cjenik has crawlable static content, official fields, and NEPAR services", async ({ page }) => {
  const staticResponse = await page.request.get("/cjenik");
  const staticHtml = await staticResponse.text();
  expect(staticHtml).toContain("data-nepar-static-content");
  expect(staticHtml).toContain("Web Basic");
  expect(staticHtml).toContain("cijena na dan 21. 9. 2026.");
  expect(staticHtml).toContain("cijena na dan 10. 9. 2026.");
  expect(staticHtml).toContain("Izrada web-stranica");
  expect(staticHtml).toContain("Usluge digitalnog cjenika");
  expect(staticHtml).toContain("Jednokratno");
  expect(staticHtml).toContain('id="cjenik-od-note"');
  // Each category table must announce its own name, not one generic caption shared by all of them.
  expect(staticHtml).toContain("digitalni cjenik usluga — Izrada web-stranica");
  expect(staticHtml).toContain("digitalni cjenik usluga — Usluge digitalnog cjenika");
  // The "as-of" date must be human-formatted, never the raw ISO value from cjenikMeta.
  expect(staticHtml).not.toContain(cjenikMeta.publishedAt);
  // The static (non-JS/crawler) snapshot must link the canonical filename too, not just /cjenik.csv.
  expect(staticHtml).toContain(`/cjenici/${canonicalCjenikFilename(cjenikMeta, "csv")}`);
  expect(staticHtml).toContain(`/cjenici/${canonicalCjenikFilename(cjenikMeta, "xml")}`);
  // Legal footnote paragraphs must carry a typographic measure in the static snapshot too.
  expect(staticHtml).toMatch(/<p id="cjenik-od-note" class="[^"]*\bmax-w-prose\b[^"]*"/);

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
  await expect(page.getByRole("link", { name: "Vodič za baznu cijenu" })).toHaveAttribute("href", "https://digitalnicjenik.nepar.hr/vodici/sidrena-cijena/");
  await expect(page.getByRole("link", { name: "Tehnički zahtjevi XML/CSV digitalnog cjenika" })).toHaveAttribute("href", "https://digitalnicjenik.nepar.hr/specifikacija-csv-xml/");
});

test("current CSV follows NN 132 and preserves all actual prices", async ({ page }) => {
  const csv = await (await page.request.get("/cjenik.csv")).text();
  expect(csv.split(/\r?\n/)[0]).toBe("Naziv usluge;Maloprodajna cijena;Poseban oblik prodaje;Bazna cijena");
  expect(csv).toContain("Web Basic;300.00;NE;300.00");
  expect(csv).toContain("NEPAR Web Link – godišnja pretplata;19.90;NE;19.90");
  expect(csv).toContain("NEPAR Publisher – godišnja pretplata;49.90;NE;49.90");
  expect(csv).toContain("Redizajn Basic (početna cijena);800.00;NE;800.00");
  expect(csv).not.toContain("nepar_cijena_od");
  expect(csv.trim().split(/\r?\n/)).toHaveLength(nepaUsluge.length + 1);
});

test("current XML follows NN 132", async ({ page }) => {
  const xml = await (await page.request.get("/cjenik.xml")).text();
  expect(xml).toContain('<cjenik format="nn-132-2026">');
  expect(xml).toContain("<naziv_usluge>Web Basic</naziv_usluge>");
  expect(xml).toContain("<bazna_cijena>300.00</bazna_cijena>");
  expect(xml).toContain("<poseban_oblik_prodaje>NE</poseban_oblik_prodaje>");
  expect(xml).not.toContain("<nepar_cijena_od>");
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

test("/cjenik/arhiva lists retained previous publications, still served unchanged", async ({ page }) => {
  const staticResponse = await page.request.get("/cjenik/arhiva");
  const staticHtml = await staticResponse.text();
  expect(staticHtml).toContain("data-nepar-static-content");
  if (!archived.length) expect(staticHtml).toContain("Nema starijih verzija");
  for (const snapshot of archived) {
    const csvName = canonicalCjenikFilename(snapshot.meta, "csv");
    expect(staticHtml).toContain(`/cjenici/${csvName}`);
    const response = await page.request.get(`/cjenici/${csvName}`);
    expect(response.ok()).toBeTruthy();
    // Arhivska objava bez formatVersion zadržava izvorni oblik (bez stupca datuma).
    if (!snapshot.meta.formatVersion) expect((await response.text()).split("\n")[0]).not.toContain("datum_referentne_cijene");
  }
  expect(staticHtml).not.toContain(cjenikMeta.publishedAt);

  await page.goto("/cjenik/arhiva");
  await expect(page).toHaveTitle("Arhiva digitalnog cjenika | Nepar Solutions");
  await expect(page.getByRole("link", { name: /Natrag na trenutni cjenik/ })).toHaveAttribute("href", "/cjenik");
});

test("every NEPAR usluga has a stable id, a sidrena cijena and the date it applies to", () => {
  for (const usluga of nepaUsluge) {
    expect(usluga.id).toMatch(/^[a-z0-9-]+$/);
    expect(typeof usluga.sidrenaCijena).toBe("number");
    expect(usluga.datumReferentneCijene).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    // Usluga uvedena nakon 10. 9. 2026.: sidrena = cijena s datuma prvog uvrštenja (MINGO pojašnjenje).
    if (usluga.novaStavka) expect(usluga.datumReferentneCijene > "2026-09-10").toBe(true);
    else expect(usluga.datumReferentneCijene).toBe("2026-09-10");
  }
});
