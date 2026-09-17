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
    title: "Automatizacija digitalnog cjenika: ERP, web i XML/CSV | NEPAR",
    h1: "Automatizacija digitalnog cjenika: promijenite cijenu jednom, objavite je svugdje",
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
