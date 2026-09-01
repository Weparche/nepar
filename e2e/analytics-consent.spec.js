import { expect, test } from "@playwright/test";

const workerPageview = "https://analytics.nepar.test/analytics/pageview";

async function mockAnalytics(page, { contactStatus = 200 } = {}) {
  const googleRequests = [];
  const workerRequests = [];

  await page.route("https://www.googletagmanager.com/**", async (route) => {
    googleRequests.push(route.request().url());
    await route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
  });
  await page.route("https://analytics.nepar.test/**", async (route) => {
    const request = route.request();
    if (request.url() === workerPageview) {
      workerRequests.push(JSON.parse(request.postData() || "{}"));
      await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
      return;
    }
    await route.fulfill({
      status: contactStatus,
      contentType: "application/json",
      body: contactStatus >= 200 && contactStatus < 300 ? '{"ok":true}' : '{"error":"failed"}',
    });
  });

  return { googleRequests, workerRequests };
}

async function eventNames(page) {
  return page.evaluate(() => (window.dataLayer || [])
    .map((entry) => Array.from(entry))
    .filter((entry) => entry[0] === "event")
    .map((entry) => entry[1]));
}

async function persistAnalyticsConsent(page) {
  await page.addInitScript(() => {
    localStorage.setItem("nepar-consent-v1", JSON.stringify({
      version: 1,
      analytics: true,
      updatedAt: new Date().toISOString(),
    }));
  });
}

test("Basic consent blocks requests, enables one manual page view, and blocks again after withdrawal", async ({ page }) => {
  const requests = await mockAnalytics(page);
  await page.goto("/usluge/izrada-web-stranica?private=value#paketi");
  await page.waitForTimeout(500);

  expect(requests.googleRequests).toHaveLength(0);
  expect(requests.workerRequests).toHaveLength(0);
  await page.getByRole("button", { name: "Odbij analitiku" }).click();
  await page.reload();
  await page.waitForTimeout(500);
  expect(requests.googleRequests).toHaveLength(0);
  expect(requests.workerRequests).toHaveLength(0);

  await page.evaluate(() => window.dispatchEvent(new Event("nepar:open-consent-settings")));
  await page.getByRole("button", { name: "Prihvati analitiku" }).click();
  await expect.poll(() => requests.googleRequests.length).toBe(1);
  await expect.poll(() => requests.workerRequests.length).toBe(1);
  expect(requests.workerRequests[0].path).toBe("/usluge/izrada-web-stranica");

  const menuButton = page.getByRole("button", { name: "Otvori navigaciju" });
  if (await menuButton.isVisible()) await menuButton.click();
  await page.getByRole("link", { name: "Kontakt", exact: true }).click();
  await expect(page).toHaveURL(/\/kontakt$/);
  await expect.poll(() => requests.workerRequests.length).toBe(2);
  expect((await eventNames(page)).filter((name) => name === "page_view")).toHaveLength(2);

  const beforeWithdrawal = requests.googleRequests.length;
  await page.evaluate(() => window.dispatchEvent(new Event("nepar:open-consent-settings")));
  await page.getByRole("button", { name: "Odbij analitiku" }).click();
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(500);
  expect(requests.googleRequests).toHaveLength(beforeWithdrawal);
  expect(requests.workerRequests).toHaveLength(2);
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("nepar-consent-v1")).analytics)).toBe(false);
});

test("funnel fires in order and generate_lead follows only a confirmed 2xx response", async ({ page }) => {
  await persistAnalyticsConsent(page);
  await mockAnalytics(page);
  await page.goto("/usluge/izrada-web-stranica");
  await expect.poll(async () => (await eventNames(page)).filter((name) => name === "page_view").length).toBe(1);

  await page.locator("#paketi").scrollIntoViewIfNeeded();
  await expect.poll(async () => (await eventNames(page)).includes("view_packages")).toBe(true);

  const businessCard = page.locator('[data-package-id="business"]');
  await businessCard.getByRole("button", { name: "Pošalji upit za paket" }).click();
  await page.getByLabel("Ime i prezime").fill("Test User");
  await expect.poll(async () => (await eventNames(page)).includes("start_lead")).toBe(true);
  await page.getByLabel("E-mail adresa").fill("test@example.com");
  await page.getByLabel("Kratko opišite projekt").fill("Testna poruka bez slanja PII-ja u analitiku.");
  await page.getByRole("dialog", { name: "Pošaljite upit" })
    .getByRole("button", { name: "Pošalji upit", exact: true })
    .click();
  await expect.poll(async () => (await eventNames(page)).includes("generate_lead")).toBe(true);

  const funnel = (await eventNames(page)).filter((name) => [
    "page_view",
    "view_packages",
    "start_lead",
    "generate_lead",
  ].includes(name));
  expect(funnel).toEqual(["page_view", "view_packages", "start_lead", "generate_lead"]);
});

test("Worker error never produces generate_lead", async ({ page }) => {
  await persistAnalyticsConsent(page);
  await mockAnalytics(page, { contactStatus: 502 });
  await page.goto("/kontakt");
  await page.getByLabel("Ime i prezime").fill("Test User");
  await page.getByLabel("E-mail adresa").fill("test@example.com");
  await page.getByLabel("Poruka").fill("Test failure path");
  await page.getByRole("button", { name: "Pošalji poruku" }).click();
  await expect(page.getByText(/Slanje nije uspjelo/)).toBeVisible();
  expect(await eventNames(page)).not.toContain("generate_lead");
});
