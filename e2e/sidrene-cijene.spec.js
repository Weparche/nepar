import { expect, test } from "@playwright/test";

test("legacy sidrene-cijene SPA fallback opens the migrated guide for both variants", async ({ page }) => {
  const destination = "https://digitalnicjenik.nepar.hr/vodici/sidrena-cijena/";
  await page.route("https://digitalnicjenik.nepar.hr/**", route => route.fulfill({ contentType: "text/html", body: "<h1>Sidrena cijena</h1>" }));
  for (const path of ["/sidrene-cijene", "/sidrene-cijene/"]) {
    await page.goto(path);
    await expect(page).toHaveURL(destination);
    await expect(page.getByRole("heading", { name: "Sidrena cijena" })).toBeVisible();
  }
});
