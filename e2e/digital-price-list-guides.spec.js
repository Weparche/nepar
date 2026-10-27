import { expect, test } from "@playwright/test";
import { GUIDE_REDIRECTS } from "../src/guideRedirects.js";

test("both URL variants have exactly one direct 301 rule and leave the old sitemap", async ({ request }) => {
  const rules = (await (await request.get("/_redirects")).text()).split(/\r?\n/).filter(Boolean).map(line => line.trim().split(/\s+/));
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const [path, target] of Object.entries(GUIDE_REDIRECTS)) {
    for (const suffix of ["", "/"]) expect(rules.filter(rule => rule[0] === path + suffix)).toEqual([[path + suffix, target, "301"]]);
    expect(sitemap).not.toContain("https://nepar.hr" + path + "<");
    expect(target.endsWith("/")).toBe(true);
  }
  expect(sitemap).toContain("https://nepar.hr/cjenik<");
  expect(sitemap).toContain("https://nepar.hr/cjenik/arhiva<");
});

for (const [path, destination] of Object.entries(GUIDE_REDIRECTS).filter(([path]) => path !== "/sidrene-cijene")) {
  test(path + " SPA fallback exits directly to its final destination", async ({ page }) => {
    await page.route("https://digitalnicjenik.nepar.hr/**", route => route.fulfill({ contentType: "text/html", body: "<h1>Moved guide destination</h1>" }));
    for (const suffix of ["", "/"]) {
      await page.goto(path + suffix);
      await expect(page).toHaveURL(destination);
      await expect(page.getByRole("heading", { name: "Moved guide destination" })).toBeVisible();
    }
  });
}
