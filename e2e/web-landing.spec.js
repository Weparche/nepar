import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const workerBase = "https://analytics.nepar.test";

async function persistConsent(page, analytics = true) {
  await page.addInitScript((enabled) => {
    localStorage.setItem("nepar-consent-v1", JSON.stringify({
      version: 1,
      analytics: enabled,
      updatedAt: new Date().toISOString(),
    }));
  }, analytics);
}

async function mockLandingNetwork(page, { contactStatus = 200, contactDelay = 0 } = {}) {
  const contactRequests = [];
  const pageviewRequests = [];

  await page.route("https://www.googletagmanager.com/**", (route) => (
    route.fulfill({ status: 200, contentType: "application/javascript", body: "" })
  ));
  await page.route(`${workerBase}/**`, async (route) => {
    const request = route.request();
    if (request.url() === `${workerBase}/analytics/pageview`) {
      pageviewRequests.push(JSON.parse(request.postData() || "{}"));
      await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
      return;
    }
    contactRequests.push(JSON.parse(request.postData() || "{}"));
    if (contactDelay) await new Promise((resolve) => setTimeout(resolve, contactDelay));
    await route.fulfill({
      status: contactStatus,
      contentType: "application/json",
      body: contactStatus >= 200 && contactStatus < 300 ? '{"ok":true}' : '{"error":"failed"}',
    });
  });

  return { contactRequests, pageviewRequests };
}

async function analyticsEvents(page) {
  return page.evaluate(() => (window.dataLayer || [])
    .map((entry) => Array.from(entry))
    .filter((entry) => entry[0] === "event")
    .map((entry) => ({ name: entry[1], params: entry[2] || {} })));
}

async function fillLandingForm(page) {
  await page.getByLabel("Ime").fill("Test Korisnik");
  await page.getByLabel("E-mail").fill("test@example.com");
  await page.getByLabel(/Telefon/).fill("+385 91 123 4567");
  await page.getByLabel("Što trebate?").fill("Profesionalnu web-stranicu za mali obrt.");
}

test("/web renders the locked acquisition structure without overflow", async ({ page }) => {
  await persistConsent(page, false);
  await page.goto("/web?utm_source=chatgpt&utm_medium=paid&utm_campaign=web_hr");

  await expect(page.getByRole("heading", { level: 1, name: "Profesionalna web stranica za vaš posao. Od 300 €." })).toBeVisible();
  await expect(page.getByText("Brza, moderna i optimizirana za Google. Bez mjesečne pretplate — stranica je vaša.")).toBeVisible();
  await expect(page.locator('.web-header a[href="#upit"]')).toHaveText("Zatraži ponudu");
  await expect(page.locator('.web-header a[href="#reference"]')).toHaveText("Reference");
  await expect(page.locator('.web-header a[href="#cijene"]')).toHaveText("Cijene");

  const projectTitles = await page.locator(".web-project h3").allTextContents();
  expect(projectTitles).toEqual(["Auto Gubić", "BezStruje.hr", "VremenskaPrognoza.hr"]);
  const projectLinks = page.locator("a.web-project");
  await expect(projectLinks).toHaveCount(3);
  await expect(projectLinks.nth(0)).toHaveAttribute("href", "https://autogubic.hr/");
  await expect(projectLinks.nth(1)).toHaveAttribute("href", "https://bezstruje.hr");
  await expect(projectLinks.nth(2)).toHaveAttribute("href", "https://vremenskaprognoza.hr");
  for (const projectLink of await projectLinks.all()) {
    await expect(projectLink).toHaveAttribute("target", "_blank");
    await expect(projectLink).toHaveAttribute("rel", /noopener/);
    await expect(projectLink).toHaveAttribute("rel", /noreferrer/);
  }
  await expect(page.locator(".web-package")).toHaveCount(3);
  await expect(page.locator(".web-package--featured")).toContainText("Business");
  await expect(page.locator(".web-package").nth(0)).toContainText("300 €");
  await expect(page.locator(".web-package").nth(1)).toContainText("500 €");
  await expect(page.locator(".web-package").nth(2)).toContainText("700 €");
  await expect(page.locator(".web-process__list li")).toHaveCount(4);
  await expect(page.locator(".web-faq details")).toHaveCount(4);
  await expect(page.locator('#upit button[type="submit"]')).toHaveText(/Zatraži ponudu/);

  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);

  const axe = await new AxeBuilder({ page }).analyze();
  const serious = axe.violations.filter(({ impact }) => impact === "serious" || impact === "critical");
  expect(serious, serious.map(({ id }) => id).join(", ")).toEqual([]);
});

test("successful submit emits one start_lead, one request, and exactly one generate_lead", async ({ page }) => {
  await persistConsent(page, true);
  const network = await mockLandingNetwork(page, { contactDelay: 120 });
  const longContent = `hero-${"x".repeat(220)}`;
  await page.goto(`/web?utm_source=%20chat%00gpt%20&utm_medium=paid&utm_campaign=web_hr&utm_content=${longContent}&utm_term=izrada%20weba&unknown=ignore-me`);
  await fillLandingForm(page);

  await expect.poll(async () => (await analyticsEvents(page)).filter(({ name }) => name === "start_lead").length).toBe(1);
  await page.locator('#upit button[type="submit"]').evaluate((button) => {
    button.click();
    button.click();
  });

  await expect(page.getByText("Upit je poslan.")).toBeVisible();
  await expect.poll(async () => (await analyticsEvents(page)).filter(({ name }) => name === "generate_lead").length).toBe(1);
  expect(network.contactRequests).toHaveLength(1);
  expect(network.contactRequests[0].formName).toBe("web_landing");
  expect(network.contactRequests[0].phone).toBe("+385 91 123 4567");
  expect(network.contactRequests[0].attribution).toEqual({
    utm_source: "chatgpt",
    utm_medium: "paid",
    utm_campaign: "web_hr",
    utm_content: longContent.slice(0, 160),
    utm_term: "izrada weba",
    landing_path: "/web",
  });

  const generateEvents = (await analyticsEvents(page)).filter(({ name }) => name === "generate_lead");
  expect(generateEvents).toHaveLength(1);
  expect(generateEvents[0].params).not.toHaveProperty("unknown");
});

test("configured Worker error preserves fields and never opens mail automatically", async ({ page }) => {
  await persistConsent(page, true);
  await mockLandingNetwork(page, { contactStatus: 502 });
  await page.goto("/web?utm_source=chatgpt&utm_medium=paid&utm_campaign=web_hr");
  await fillLandingForm(page);
  await page.locator('#upit button[type="submit"]').click();

  await expect(page.getByText("Upit trenutačno nije moguće poslati.")).toBeVisible();
  await expect(page).toHaveURL(/\/web\?utm_source=chatgpt/);
  await expect(page.getByLabel("Ime")).toHaveValue("Test Korisnik");
  await expect(page.getByLabel("E-mail")).toHaveValue("test@example.com");
  await expect(page.getByLabel(/Telefon/)).toHaveValue("+385 91 123 4567");
  await expect(page.getByLabel("Što trebate?")).toHaveValue("Profesionalnu web-stranicu za mali obrt.");
  await expect(page.getByRole("link", { name: "Pošalji e-mailom" })).toHaveAttribute("href", /^mailto:/);
  expect((await analyticsEvents(page)).filter(({ name }) => name === "generate_lead")).toHaveLength(0);

  await page.evaluate(() => {
    document.addEventListener("click", (event) => {
      if (event.target.closest?.('a[href^="mailto:"]')) event.preventDefault();
    }, true);
  });
  await page.getByRole("link", { name: "Pošalji e-mailom" }).click();
  await expect.poll(async () => (await analyticsEvents(page)).filter(({ name }) => name === "click_email").length).toBe(1);
  expect((await analyticsEvents(page)).filter(({ name }) => name === "generate_lead")).toHaveLength(0);
});
