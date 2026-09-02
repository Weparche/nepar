import { expect, test } from "@playwright/test";

async function analyticsEvents(page) {
  return page.evaluate(() => (window.dataLayer || [])
    .map((entry) => Array.from(entry))
    .filter((entry) => entry[0] === "event")
    .map((entry) => entry[1]));
}

test("missing Worker opens the explicit mail fallback without reporting a generated lead", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("nepar-consent-v1", JSON.stringify({
      version: 1,
      analytics: true,
      updatedAt: new Date().toISOString(),
    }));
  });
  await page.route("https://www.googletagmanager.com/**", (route) => (
    route.fulfill({ status: 200, contentType: "application/javascript", body: "" })
  ));

  await page.goto("/web?utm_source=chatgpt&utm_medium=paid&utm_campaign=web_hr");
  await page.getByLabel("Ime").fill("Test Korisnik");
  await page.getByLabel("E-mail").fill("test@example.com");
  await page.getByLabel("Što trebate?").fill("Testni projekt bez konfiguriranog Workera.");
  await page.locator('#upit button[type="submit"]').click();

  await expect(page.getByText("Otvorili smo vašu e-mail aplikaciju. Poruku još trebate poslati.")).toBeVisible();
  await expect(page.getByText("Upit je poslan.")).toHaveCount(0);
  await expect.poll(async () => (await analyticsEvents(page)).filter((name) => name === "click_email").length).toBe(1);
  expect((await analyticsEvents(page)).filter((name) => name === "generate_lead")).toHaveLength(0);
});
