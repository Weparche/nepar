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

async function skipEvolutionIntro(page) {
  const skipButton = page.getByRole("button", { name: "Preskoči uvod i idi na web" });
  if (await skipButton.isVisible().catch(() => false)) await skipButton.click();
}

async function evolutionFrameTime(page) {
  return Number(await page.getByTestId("evolution-frame").getAttribute("data-frame-time"));
}

test("cinematic intro follows scene markers and completes after the final viewport", async ({ page }) => {
  await page.goto("/");

  const intro = page.getByTestId("evolution-intro");
  const frame = page.getByTestId("evolution-frame");
  await expect(intro).toBeVisible();
  await expect(intro).toHaveAttribute("data-active-scene", "0");
  await expect(page.getByTestId("evolution-copy")).toContainText("Računalo je počelo");
  await expect(page.getByRole("button", { name: "Preskoči uvod i idi na web" })).toBeVisible();
  await expect(page.getByTestId("landing-page")).toHaveAttribute("inert", "");

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
  await expect(intro).toHaveAttribute("data-active-scene", "2");
  await expect(page.getByText("Internet je povezao cijeli svijet.", { exact: true })).toBeVisible();
  await expect.poll(async () => {
    const currentTime = await evolutionFrameTime(page);
    return Math.abs(currentTime - 8.1);
  }).toBeLessThanOrEqual(0.5);

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 3));
  await expect(intro).toHaveAttribute("data-active-scene", "3");
  await expect(page.getByText("Cloud je rad preselio na svaki uređaj.", { exact: true })).toBeVisible();
  await expect.poll(async () => {
    const currentTime = await evolutionFrameTime(page);
    return Math.abs(currentTime - 10.3);
  }).toBeLessThanOrEqual(0.5);

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 4));
  await expect(intro).toHaveAttribute("data-active-scene", "4");
  await expect(page.getByText("Digitalni alati postali su radno okruženje.", { exact: true })).toBeVisible();
  await expect.poll(async () => {
    const currentTime = await evolutionFrameTime(page);
    return Math.abs(currentTime - 13);
  }).toBeLessThanOrEqual(0.5);

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 5));
  await expect(intro).toHaveAttribute("data-active-scene", "5");
  await expect(page.getByText("AI danas razumije, automatizira i stvara.", { exact: true })).toBeVisible();
  await expect.poll(async () => {
    const currentTime = await evolutionFrameTime(page);
    return Math.abs(currentTime - 16);
  }).toBeLessThanOrEqual(0.5);

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 6));
  await expect(intro).toHaveAttribute("data-active-scene", "6");
  await expect(page.getByTestId("evolution-copy")).toHaveCount(0);
  await expect.poll(() => evolutionFrameTime(page)).toBeGreaterThanOrEqual(17.95);
  await expect(frame).toHaveAttribute("src", "/evolution-loop.webp");
  await expect(frame).toHaveAttribute("data-frame-time", "18.60");
  await expect(intro).toBeVisible();

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 7 + 4));
  await expect(intro).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("heading", { level: 1, name: /Gradimo korisne digitalne proizvode/ })).toBeVisible();
});

test("every discrete mouse-wheel gesture advances exactly one visual scene", async ({ page }) => {
  await page.goto("/");
  const intro = page.getByTestId("evolution-intro");
  await expect(intro).toHaveAttribute("data-active-scene", "0");

  const wheelStep = async (deltaY) => {
    await page.mouse.wheel(0, deltaY);
    await page.waitForTimeout(1550);
  };

  await wheelStep(120);
  await expect(intro).toHaveAttribute("data-active-scene", "1");
  await expect(page.getByText("Grafička sučelja približila su tehnologiju svima.", { exact: true })).toBeVisible();

  await wheelStep(120);
  await expect(intro).toHaveAttribute("data-active-scene", "2");
  await expect(page.getByText("Internet je povezao cijeli svijet.", { exact: true })).toBeVisible();
  await expect.poll(async () => Math.abs(await evolutionFrameTime(page) - 8.1)).toBeLessThanOrEqual(0.5);

  await wheelStep(-120);
  await expect(intro).toHaveAttribute("data-active-scene", "1");
});

test("a short touch swipe advances exactly one visual scene", async ({ page }) => {
  await page.goto("/");
  const hasTouch = await page.evaluate(() => "ontouchstart" in window);
  test.skip(!hasTouch, "touch emulation not enabled for this project");

  const intro = page.getByTestId("evolution-intro");
  await expect(intro).toHaveAttribute("data-active-scene", "0");

  const swipeUp = async (distance) => {
    await page.evaluate((swipeDistance) => {
      const target = document.body;
      const makeTouch = (clientY) => new Touch({ identifier: 1, target, clientX: 200, clientY });
      const dispatch = (type, clientY, touches) => target.dispatchEvent(new TouchEvent(type, {
        bubbles: true,
        cancelable: true,
        touches,
        changedTouches: [makeTouch(clientY)],
      }));
      const startY = 500;
      const endY = startY - swipeDistance;
      dispatch("touchstart", startY, [makeTouch(startY)]);
      dispatch("touchmove", endY, [makeTouch(endY)]);
      dispatch("touchend", endY, []);
    }, distance);
    await page.waitForTimeout(1550);
  };

  // A 40px drag is far short of the ~half-viewport native scroll that used
  // to be required — one short swipe should snap exactly one scene forward.
  await swipeUp(40);
  await expect(intro).toHaveAttribute("data-active-scene", "1");
  await expect(page.getByText("Grafička sučelja približila su tehnologiju svima.", { exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(await page.evaluate(() => window.innerHeight));
});

test("wheel alignment never briefly reverses the active scene", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    window.__evolutionSceneChanges = [];
    const intro = document.querySelector('[data-testid="evolution-intro"]');
    const observer = new MutationObserver(() => {
      window.__evolutionSceneChanges.push(intro.getAttribute("data-active-scene"));
    });
    observer.observe(intro, { attributes: true, attributeFilter: ["data-active-scene"] });
  });

  await page.mouse.wheel(0, 120);
  await page.waitForTimeout(450);

  const changes = await page.evaluate(() => window.__evolutionSceneChanges);
  expect(changes).toEqual(["1"]);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(await page.evaluate(() => window.innerHeight));
});

test("scene 2 to 3 is slightly quicker and the extended final brand segment loops", async ({ page }) => {
  await page.goto("/");
  const intro = page.getByTestId("evolution-intro");

  await page.mouse.wheel(0, 120);
  await expect(intro).toHaveAttribute("data-active-scene", "1");
  await expect(page.getByTestId("evolution-copy")).toHaveCount(1);
  await page.waitForTimeout(600);
  const firstMidpoint = await evolutionFrameTime(page);
  expect(firstMidpoint).toBeGreaterThan(0.2);
  expect(firstMidpoint).toBeLessThan(3.8);
  await expect.poll(async () => Math.abs(await evolutionFrameTime(page) - 3.8)).toBeLessThanOrEqual(0.18);
  const copyLayout = await page.getByTestId("evolution-copy").evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const storyRect = element.parentElement.getBoundingClientRect();
    return { left: rect.left, storyLeft: storyRect.left, right: rect.right, viewport: window.innerWidth };
  });
  expect(Math.abs(copyLayout.left - copyLayout.storyLeft)).toBeLessThanOrEqual(1);
  expect(copyLayout.right).toBeLessThanOrEqual(copyLayout.viewport);

  await page.waitForTimeout(400);
  await page.mouse.wheel(0, 120);
  await expect(intro).toHaveAttribute("data-active-scene", "2");
  await page.waitForTimeout(1200);
  await expect.poll(async () => Math.abs(await evolutionFrameTime(page) - 8.1)).toBeLessThanOrEqual(0.18);

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 6));
  await expect(intro).toHaveAttribute("data-active-scene", "6");
  await expect.poll(() => evolutionFrameTime(page)).toBeGreaterThanOrEqual(17.95);
  const loopFrame = page.getByTestId("evolution-frame");
  await expect(loopFrame).toHaveAttribute("src", "/evolution-loop.webp");
  await expect.poll(() => loopFrame.evaluate((element) => element.complete && element.naturalWidth > 0)).toBe(true);
});

test("mobile shows an animated brand title on every scene except the final loop", async ({ page }) => {
  await page.goto("/");
  const intro = page.getByTestId("evolution-intro");
  const brandTitle = page.getByRole("button", { name: "Nepar Solutions — idi na web" });

  const isMobileViewport = (page.viewportSize()?.width ?? 0) <= 700;
  if (!isMobileViewport) {
    await expect(brandTitle).toBeHidden();
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 6));
    await expect(brandTitle).toBeHidden();
    return;
  }

  await expect(intro).toHaveAttribute("data-active-scene", "0");
  await expect(brandTitle).toBeVisible();
  await expect(brandTitle).toHaveText("Nepar Solutions");

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 6));
  await expect(intro).toHaveAttribute("data-active-scene", "6");
  await expect(brandTitle).toBeHidden();

  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 5));
  await expect(intro).toHaveAttribute("data-active-scene", "5");
  await expect(brandTitle).toBeVisible();

  // force:true — the button lives on a sticky, scroll-jacked overlay that's
  // already fully on-screen; Playwright's default scrollIntoViewIfNeeded
  // pre-click step nudges window scroll, which fights the intro's own
  // IntersectionObserver-driven scene detection and flickers the button
  // out of the DOM. No real tap ever triggers that extra scroll.
  await brandTitle.click({ force: true });
  await expect(intro).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("heading", { level: 1, name: /Gradimo korisne digitalne proizvode/ })).toBeVisible();
});

test("cinematic intro can be skipped and stays dismissed for the tab session", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Preskoči uvod i idi na web" }).click();

  await expect(page.getByTestId("evolution-intro")).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.reload();
  await expect(page.getByTestId("evolution-intro")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1, name: /Gradimo korisne digitalne proizvode/ })).toBeVisible();
});

test("reduced motion bypasses the cinematic intro before first paint", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.getByTestId("evolution-intro")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1, name: /Gradimo korisne digitalne proizvode/ })).toBeVisible();
});

test("restored landing keeps its original structure and adds Auto Gubić below", async ({ page }) => {
  await page.goto("/");
  await skipEvolutionIntro(page);
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
