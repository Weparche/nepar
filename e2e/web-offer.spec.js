import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const servicePath = "/usluge/izrada-web-stranica";

async function expectNoHorizontalOverflow(page) {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
}

async function expectHeadingOrder(page) {
  const levels = await page.locator("h1, h2, h3, h4, h5, h6").evaluateAll((headings) =>
    headings.map((heading) => Number(heading.tagName.slice(1))),
  );
  expect(levels[0]).toBe(1);
  for (let index = 1; index < levels.length; index += 1) {
    expect(levels[index] - levels[index - 1]).toBeLessThanOrEqual(1);
  }
}

async function expectTouchTargets(page) {
  const undersized = await page
    .locator(
      ".button, .nav-cta, .nav-link, .mobile-nav-link, .menu-button, .language-toggle button, .project-tile, .footer-contact, .faq-list summary",
    )
    .evaluateAll((elements) =>
      elements.flatMap((element) => {
        const rect = element.getBoundingClientRect();
        if (!rect.width || !rect.height) return [];
        return rect.width >= 44 && rect.height >= 44
          ? []
          : [`${element.tagName.toLowerCase()}.${element.className}: ${rect.width}x${rect.height}`];
      }),
    );
  expect(undersized).toEqual([]);
}

test("restored landing keeps its original structure and adds Auto Gubić below", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: /Gradimo korisne digitalne proizvode za stvarni svijet/ }),
  ).toBeVisible();
  await expect(page.getByText("Pilot popunjenost")).toHaveCount(0);
  await expect(page.getByText("mjesta popunjeno")).toHaveCount(0);
  const serviceImages = page.locator("#usluge .service-card-art");
  await expect(serviceImages).toHaveCount(4);
  await expect.poll(() => serviceImages.evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0))).toBe(true);

  const projects = page.locator("#projekti");
  await projects.scrollIntoViewIfNeeded();
  const projectLink = projects.getByRole("link", { name: /Auto Gubić/ });
  await expect(projectLink).toBeVisible();
  await expect(projectLink).toHaveAttribute("href", "https://autogubic.hr/");
  await expect(projectLink).toHaveAttribute("target", "_blank");
  await expect(projectLink).toHaveAttribute("rel", /noreferrer/);
  await expect(projectLink.getByRole("heading", { name: "Auto Gubić" })).toBeVisible();
  await expect(projectLink.locator('img[src="/brand/autogubic.webp"]')).toHaveAttribute("alt", "Auto Gubić web-stranica");

  await expectNoHorizontalOverflow(page);
  await expectTouchTargets(page);
});

test("pricing shows one-time development and optional annual maintenance", async ({ page }) => {
  await page.goto(servicePath);
  await expect(page.getByRole("heading", { level: 1, name: "Web-stranica koja pripada vašem poslovanju." })).toBeVisible();
  await expect(page.getByText("Održavanje nije obavezno", { exact: false }).first()).toBeVisible();

  for (const [name, price] of [["Web Basic", "300 €"], ["Web Business", "500 €"], ["Web Pro", "700 €"]]) {
    const card = page.locator("article.offer-card").filter({ hasText: name }).first();
    await expect(card).toContainText(price);
    await expect(card).toContainText("jednokratno");
  }

  for (const [name, price] of [["Održavanje Basic", "200 €"], ["Održavanje Business", "400 €"], ["Održavanje Pro", "600 €"]]) {
    const card = page.locator("article.offer-card").filter({ hasText: name }).first();
    await expect(card).toContainText(price);
    await expect(card).toContainText("godišnje");
  }

  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(/\d+\s*€\s*\/\s*mj|pilot ponuda|mjesečna pretplata/i);
  await expectNoHorizontalOverflow(page);
  await expectHeadingOrder(page);
  await expectTouchTargets(page);
});

test("English content stays aligned with the new model", async ({ page }) => {
  await page.goto(servicePath);
  await page.getByRole("button", { name: "ENG" }).click();
  await expect(page.getByRole("heading", { name: "Website development packages" })).toBeVisible();
  await expect(page.getByText("The website belongs to the client after payment.", { exact: false }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Annual website maintenance" })).toBeVisible();

  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(/€\d+\s*\/\s*mo|pilot offer|monthly subscription/i);
});

test("package inquiry dialog carries the selected commercial model", async ({ page }) => {
  await page.goto(servicePath);
  const businessCard = page.locator("article.offer-card").filter({ hasText: "Web Business" }).first();
  await businessCard.getByRole("button", { name: "Pošalji upit za paket" }).click();

  const dialog = page.getByRole("dialog", { name: "Pošaljite upit" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Web Business");
  await expect(dialog).toContainText("Jednokratna izrada");
  await expect(dialog).toContainText("500 € · jednokratno");
  await expect(page.locator("#inquiry-name")).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(businessCard.getByRole("button", { name: "Pošalji upit za paket" })).toBeFocused();
});

test("legacy route redirects and keeps its anchor", async ({ page }) => {
  await page.goto("/usluge/web-stranica-bez-pocetnog-troska#paketi");
  await expect(page).toHaveURL(/\/usluge\/izrada-web-stranica#paketi$/);
  await expect(page.getByRole("heading", { name: "Paketi izrade web-stranice" })).toBeVisible();
});

test("landing and pricing have no serious accessibility violations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of ["/", servicePath]) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    await page.waitForTimeout(300);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(({ impact }) => impact === "serious" || impact === "critical");
    expect(serious, `${path}: ${serious.map((item) => item.id).join(", ")}`).toEqual([]);
  }
});
