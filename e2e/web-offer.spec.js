import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { webOfferContent } from "../src/webOfferContent.js";

const servicePath = "/usluge/izrada-web-stranica";
const heroVideoPattern = /\/brand\/hero-(desktop|mobile)\.(webm|mp4)$/;

async function installControlledHeroIdle(page) {
  await page.addInitScript(() => {
    const callbacks = new Map();
    let nextId = 0;
    window.requestIdleCallback = (callback) => {
      nextId += 1;
      callbacks.set(nextId, callback);
      return nextId;
    };
    window.cancelIdleCallback = (id) => callbacks.delete(id);
    window.__runHeroIdleCallbacks = () => {
      const pending = [...callbacks.values()];
      callbacks.clear();
      pending.forEach((callback) => callback({ didTimeout: false, timeRemaining: () => 50 }));
    };
  });
}

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
      ".button, .nav-cta, .nav-link, .mobile-nav-link, .menu-button, .language-toggle button, .project-tile, .footer-contact, .faq-list summary, .offer-selector button, .offer-card-disclosure summary",
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
  const skipButton = page.getByRole("button", { name: "Zatvori animaciju", exact: true });
  if (await skipButton.isVisible().catch(() => false)) await skipButton.click();
}

async function openEvolutionIntro(page) {
  const about = page.locator("#onama");
  await about.scrollIntoViewIfNeeded();
  await about.getByRole("button", { name: "Pokreni priču o evoluciji tehnologije" }).click();
  await expect(page.getByTestId("evolution-intro")).toBeVisible();
}

async function scrollEvolutionIntro(page, sceneIndex) {
  await page.getByTestId("evolution-intro").evaluate((intro, index) => {
    intro.scrollTo({ top: intro.clientHeight * index, left: 0, behavior: "auto" });
  }, sceneIndex);
}

async function evolutionFrameTime(page) {
  return Number(await page.getByTestId("evolution-frame").getAttribute("data-frame-time"));
}

test("cinematic intro follows scene markers and completes after the final viewport", async ({ page }) => {
  await page.goto("/");
  await openEvolutionIntro(page);

  const intro = page.getByTestId("evolution-intro");
  const frame = page.getByTestId("evolution-frame");
  await expect(intro).toBeVisible();
  await expect(intro).toHaveAttribute("data-active-scene", "0");
  await expect(page.getByTestId("evolution-copy")).toContainText("Računalo je počelo");
  await expect(page.getByRole("button", { name: "Zatvori animaciju", exact: true })).toBeVisible();
  await expect(page.getByTestId("landing-page")).toHaveAttribute("inert", "");

  await scrollEvolutionIntro(page, 2);
  await expect(intro).toHaveAttribute("data-active-scene", "2");
  await expect(page.getByText("Internet je povezao cijeli svijet.", { exact: true })).toBeVisible();
  await expect.poll(async () => {
    const currentTime = await evolutionFrameTime(page);
    return Math.abs(currentTime - 8.1);
  }).toBeLessThanOrEqual(0.5);

  await scrollEvolutionIntro(page, 3);
  await expect(intro).toHaveAttribute("data-active-scene", "3");
  await expect(page.getByText("Cloud je rad preselio na svaki uređaj.", { exact: true })).toBeVisible();
  await expect.poll(async () => {
    const currentTime = await evolutionFrameTime(page);
    return Math.abs(currentTime - 10.3);
  }).toBeLessThanOrEqual(0.5);

  await scrollEvolutionIntro(page, 4);
  await expect(intro).toHaveAttribute("data-active-scene", "4");
  await expect(page.getByText("Digitalni alati postali su radno okruženje.", { exact: true })).toBeVisible();
  await expect.poll(async () => {
    const currentTime = await evolutionFrameTime(page);
    return Math.abs(currentTime - 13);
  }).toBeLessThanOrEqual(0.5);

  await scrollEvolutionIntro(page, 5);
  await expect(intro).toHaveAttribute("data-active-scene", "5");
  await expect(page.getByText("AI danas razumije, automatizira i stvara.", { exact: true })).toBeVisible();
  await expect.poll(async () => {
    const currentTime = await evolutionFrameTime(page);
    return Math.abs(currentTime - 16);
  }).toBeLessThanOrEqual(0.5);

  await scrollEvolutionIntro(page, 6);
  await expect(intro).toHaveAttribute("data-active-scene", "6");
  await expect(page.getByTestId("evolution-copy")).toHaveCount(0);
  await expect.poll(() => evolutionFrameTime(page)).toBeGreaterThanOrEqual(17.95);
  await expect(frame).toHaveAttribute("src", "/evolution-loop.webp");
  await expect(frame).toHaveAttribute("data-frame-time", "18.80");
  await expect(intro).toBeVisible();

  await scrollEvolutionIntro(page, 7.1);
  await expect(intro).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1, name: /Gradimo korisne digitalne proizvode/ })).toBeVisible();
});

test("every discrete mouse-wheel gesture advances exactly one visual scene", async ({ page }) => {
  await page.goto("/");
  await openEvolutionIntro(page);
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
  await openEvolutionIntro(page);
  const hasTouch = await page.evaluate(() => "ontouchstart" in window);
  test.skip(!hasTouch, "touch emulation not enabled for this project");

  const intro = page.getByTestId("evolution-intro");
  await expect(intro).toHaveAttribute("data-active-scene", "0");

  const swipeUp = async (distance) => {
    await page.evaluate((swipeDistance) => {
      const target = document.querySelector('[data-testid="evolution-intro"]');
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
  await expect.poll(() => page.getByTestId("evolution-intro").evaluate((intro) => intro.scrollTop)).toBe(
    await page.evaluate(() => window.innerHeight),
  );
});

test("wheel alignment never briefly reverses the active scene", async ({ page }) => {
  await page.goto("/");
  await openEvolutionIntro(page);
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
  await expect.poll(() => page.getByTestId("evolution-intro").evaluate((intro) => intro.scrollTop)).toBe(
    await page.evaluate(() => window.innerHeight),
  );
});

test("scene 2 to 3 is slightly quicker and the extended final brand segment loops", async ({ page }) => {
  await page.goto("/");
  await openEvolutionIntro(page);
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

  await scrollEvolutionIntro(page, 6);
  await expect(intro).toHaveAttribute("data-active-scene", "6");
  await expect.poll(() => evolutionFrameTime(page)).toBeGreaterThanOrEqual(17.95);
  const loopFrame = page.getByTestId("evolution-frame");
  await expect(loopFrame).toHaveAttribute("src", "/evolution-loop.webp");
  await expect.poll(() => loopFrame.evaluate((element) => element.complete && element.naturalWidth > 0)).toBe(true);
});

test("mobile shows an animated brand title on every scene except the final loop", async ({ page }) => {
  await page.goto("/");
  await openEvolutionIntro(page);
  const intro = page.getByTestId("evolution-intro");
  const brandTitle = page.getByRole("button", { name: "Nepar Solutions — zatvori animaciju" });

  const isMobileViewport = (page.viewportSize()?.width ?? 0) <= 700;
  if (!isMobileViewport) {
    await expect(brandTitle).toBeHidden();
    await scrollEvolutionIntro(page, 6);
    await expect(brandTitle).toBeHidden();
    return;
  }

  await expect(intro).toHaveAttribute("data-active-scene", "0");
  await expect(brandTitle).toBeVisible();
  await expect(brandTitle).toHaveText("Nepar Solutions");

  await scrollEvolutionIntro(page, 6);
  await expect(intro).toHaveAttribute("data-active-scene", "6");
  await expect(brandTitle).toBeHidden();

  await scrollEvolutionIntro(page, 5);
  await expect(intro).toHaveAttribute("data-active-scene", "5");
  await expect(brandTitle).toBeVisible();

  // force:true — the button lives on a sticky, scroll-jacked overlay that's
  // already fully on-screen; Playwright's default scrollIntoViewIfNeeded
  // pre-click step nudges window scroll, which fights the intro's own
  // IntersectionObserver-driven scene detection and flickers the button
  // out of the DOM. No real tap ever triggers that extra scroll.
  await brandTitle.click({ force: true });
  await expect(intro).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1, name: /Gradimo korisne digitalne proizvode/ })).toBeVisible();
});

test("cinematic intro opens on demand and can be skipped", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("evolution-intro")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1, name: /Gradimo korisne digitalne proizvode/ })).toBeVisible();
  await openEvolutionIntro(page);
  await page.getByRole("button", { name: "Zatvori animaciju", exact: true }).click();

  await expect(page.getByTestId("evolution-intro")).toHaveCount(0);
  await page.reload();
  await expect(page.getByTestId("evolution-intro")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1, name: /Gradimo korisne digitalne proizvode/ })).toBeVisible();
});

test("reduced motion keeps the home visible and opens a static final frame", async ({ page }) => {
  const videoRequests = [];
  page.on("request", (request) => {
    const pathname = new URL(request.url()).pathname;
    if (heroVideoPattern.test(pathname)) videoRequests.push(pathname);
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const hero = page.locator("#top");
  await expect(hero.locator('picture source[media="(max-width: 767px)"]')).toHaveAttribute(
    "srcset",
    "/nepar-background-mobile-900x1600.webp",
  );
  await expect(hero.locator(".hero-background-poster")).toBeVisible();
  await expect(hero.locator('picture img[src="/nepar-background-desktop-2400x900.webp"]')).toBeVisible();
  await expect(hero.locator("video")).toHaveCount(0);
  await page.waitForTimeout(600);
  expect(videoRequests).toEqual([]);
  await expect(page.getByTestId("evolution-intro")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1, name: /Gradimo korisne digitalne proizvode/ })).toBeVisible();
  await openEvolutionIntro(page);
  await expect(page.getByTestId("evolution-intro")).toHaveAttribute("data-active-scene", "6");
  await expect(page.getByTestId("evolution-frame")).toHaveAttribute(
    "src",
    "/evolution-frames/evolution-frame-114.webp",
  );
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
  await expect(projects.locator(".featured-project-card")).toHaveCount(11);
  const projectSectionHeight = await projects.evaluate((section) => section.getBoundingClientRect().height);
  expect(projectSectionHeight).toBeLessThanOrEqual(page.viewportSize().height);
  await expect(page.locator("#kontakt")).not.toHaveCSS("position", "fixed");
  const projectLink = projects.getByRole("link", { name: /Auto Gubić/ });
  await expect(projectLink).toBeVisible();
  await expect(projectLink).toHaveAttribute("href", "https://autogubic.hr/");
  await expect(projectLink).toHaveAttribute("target", "_blank");
  await expect(projectLink).toHaveAttribute("rel", /noreferrer/);
  await expect(projectLink.getByRole("heading", { name: "Auto Gubić" })).toBeVisible();
  await expect(projectLink.locator('img[src="/brand/autogubic.webp"]')).toHaveAttribute("alt", "Auto Gubić web-stranica");

  if ((page.viewportSize()?.width ?? 0) < 1024) {
    const heroOrder = await page.evaluate(() => {
      const projectButton = [...document.querySelectorAll('a[href="#projekti"]')]
        .find((element) => element.getClientRects().length > 0);
      const visibleOrbit = [...document.querySelectorAll(".orbital-card")]
        .find((element) => element.getClientRects().length > 0);
      return {
        orbitBottom: visibleOrbit?.getBoundingClientRect().bottom ?? 0,
        buttonTop: projectButton?.getBoundingClientRect().top ?? 0,
      };
    });
    expect(heroOrder.orbitBottom).toBeLessThan(heroOrder.buttonTop);

    const mobileCarouselScene = page.getByTestId("mobile-project-carousel").locator("[data-carousel-scene]");
    await page.setViewportSize({ width: 600, height: 900 });
    await expect(mobileCarouselScene).toHaveAttribute("style", /height:\s*292px/);
    await page.setViewportSize({ width: 700, height: 900 });
    await expect(mobileCarouselScene).toHaveAttribute("style", /height:\s*344px/);
  }

  await expectNoHorizontalOverflow(page);
  await expectTouchTargets(page);
});

test("hero video is poster-first and loads only the active breakpoint source", async ({ page }) => {
  await installControlledHeroIdle(page);
  const videoRequests = [];
  page.on("request", (request) => {
    const pathname = new URL(request.url()).pathname;
    if (heroVideoPattern.test(pathname)) videoRequests.push(pathname);
  });
  await page.goto("/");
  const hero = page.locator("#top");
  const isMobileViewport = (page.viewportSize()?.width ?? 0) < 768;
  const sourceKey = isMobileViewport ? "mobile" : "desktop";
  const webmPath = `/brand/hero-${sourceKey}.webm`;
  const mp4Path = `/brand/hero-${sourceKey}.mp4`;

  await expect(hero.locator(".hero-background-poster")).toBeVisible();
  await expect(hero.locator('picture img[src="/nepar-background-desktop-2400x900.webp"]')).toBeVisible();
  await expect(hero.locator("video")).toHaveCount(1);
  await expect(hero.locator("video source")).toHaveCount(0);
  expect(videoRequests).toEqual([]);

  await page.evaluate(() => window.__runHeroIdleCallbacks());
  const sources = hero.locator("video source");
  await expect(sources).toHaveCount(2);
  await expect(sources.nth(0)).toHaveAttribute("src", webmPath);
  await expect(sources.nth(0)).toHaveAttribute("type", "video/webm; codecs=vp9");
  await expect(sources.nth(1)).toHaveAttribute("src", mp4Path);
  await expect(sources.nth(1)).toHaveAttribute("type", 'video/mp4; codecs="hvc1"');
  await expect.poll(() => videoRequests.includes(webmPath)).toBe(true);
  expect(videoRequests.some((path) => path.includes(sourceKey === "mobile" ? "desktop" : "mobile"))).toBe(false);
  await expect.poll(() => hero.locator("video").evaluate((video) => new URL(video.currentSrc).pathname)).toBe(webmPath);
  await expect(hero.locator("video")).toHaveClass(/hero-background-video--visible/);
  await expect(hero.locator(".hero-background-poster")).toBeVisible();

  for (const eventName of ["error", "abort", "emptied"]) {
    await hero.locator("video").dispatchEvent(eventName);
    await expect(hero.locator("video")).not.toHaveClass(/hero-background-video--visible/);
    await expect(hero.locator(".hero-background-poster")).toBeVisible();
    await hero.locator("video").dispatchEvent("playing");
    await expect(hero.locator("video")).toHaveClass(/hero-background-video--visible/);
  }
});

test("hero keeps the poster when autoplay is rejected", async ({ page }) => {
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException("Autoplay blocked", "NotAllowedError"));
  });
  await page.goto("/");
  const hero = page.locator("#top");
  await expect(hero.locator("video")).toHaveCount(1);
  await page.waitForTimeout(600);
  await expect(hero.locator("video")).not.toHaveClass(/hero-background-video--visible/);
  await expect(hero.locator(".hero-background-poster")).toBeVisible();
});

test("hero reloads only the new source after a breakpoint change", async ({ page }) => {
  await installControlledHeroIdle(page);
  await page.addInitScript(() => {
    const nativeLoad = HTMLMediaElement.prototype.load;
    window.__heroLoadCalls = 0;
    HTMLMediaElement.prototype.load = function load() {
      if (this.classList.contains("hero-background-video")) window.__heroLoadCalls += 1;
      return nativeLoad.call(this);
    };
  });
  const videoRequests = [];
  page.on("request", (request) => {
    const pathname = new URL(request.url()).pathname;
    if (heroVideoPattern.test(pathname)) videoRequests.push(pathname);
  });

  await page.goto("/");
  const hero = page.locator("#top");
  const initialMobile = (page.viewportSize()?.width ?? 0) < 768;
  const initialKey = initialMobile ? "mobile" : "desktop";
  const nextKey = initialMobile ? "desktop" : "mobile";
  await page.evaluate(() => window.__runHeroIdleCallbacks());
  await expect.poll(() => hero.locator("video").getAttribute("data-source-key")).toBe(initialKey);
  await expect.poll(() => hero.locator("video").evaluate((video) => new URL(video.currentSrc).pathname))
    .toBe(`/brand/hero-${initialKey}.webm`);

  const requestsBeforeSwitch = videoRequests.length;
  const loadCallsBeforeSwitch = await page.evaluate(() => window.__heroLoadCalls);
  await page.setViewportSize(initialMobile ? { width: 1440, height: 900 } : { width: 390, height: 844 });
  await expect(hero.locator("video")).toHaveAttribute("data-source-key", nextKey);
  await expect(hero.locator("video")).not.toHaveClass(/hero-background-video--visible/);
  await expect(hero.locator("video source")).toHaveCount(0);
  await page.evaluate(() => window.__runHeroIdleCallbacks());
  await expect(hero.locator("video source").nth(0)).toHaveAttribute("src", `/brand/hero-${nextKey}.webm`);
  await expect.poll(() => hero.locator("video").evaluate((video) => new URL(video.currentSrc).pathname))
    .toBe(`/brand/hero-${nextKey}.webm`);
  await expect.poll(() => page.evaluate(() => window.__heroLoadCalls)).toBeGreaterThan(loadCallsBeforeSwitch);
  expect(videoRequests.slice(requestsBeforeSwitch).some((path) => path.includes(initialKey))).toBe(false);

  await page.locator("#projekti").scrollIntoViewIfNeeded();
  await expect.poll(() => hero.locator("video").evaluate((video) => video.paused)).toBe(true);
  await hero.scrollIntoViewIfNeeded();
  await expect.poll(() => hero.locator("video").evaluate((video) => video.paused)).toBe(false);

  await page.evaluate(() => {
    let mockedVisibilityState = "visible";
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => mockedVisibilityState,
    });
    window.__setHeroVisibility = (state) => {
      mockedVisibilityState = state;
      document.dispatchEvent(new Event("visibilitychange"));
    };
  });
  await page.evaluate(() => window.__setHeroVisibility("hidden"));
  await expect.poll(() => hero.locator("video").evaluate((video) => video.paused)).toBe(true);
  await page.evaluate(() => window.__setHeroVisibility("visible"));
  await expect.poll(() => hero.locator("video").evaluate((video) => video.paused)).toBe(false);
});

test("hero media assets are served with explicit MIME types", async ({ request }) => {
  for (const [asset, contentType] of [
    ["/brand/hero-desktop.webm", "video/webm"],
    ["/brand/hero-mobile.webm", "video/webm"],
    ["/brand/hero-desktop.mp4", "video/mp4"],
    ["/brand/hero-mobile.mp4", "video/mp4"],
    ["/nepar-background-desktop-2400x900.webp", "image/webp"],
    ["/nepar-background-mobile-900x1600.webp", "image/webp"],
  ]) {
    const response = await request.get(asset);
    expect(response.ok(), asset).toBe(true);
    expect(response.headers()["content-type"], asset).toContain(contentType);
  }
});

test("offer data keeps one recommendation per kind and redesign priced above new development", () => {
  for (const locale of Object.values(webOfferContent)) {
    const groups = [locale.buildPackages, locale.redesignPackages, locale.maintenancePackages, locale.socialPackages];
    for (const packages of groups) {
      expect(packages.filter((item) => item.recommended)).toHaveLength(1);
    }

    locale.redesignPackages.forEach((item, index) => {
      expect(item.price).toBeGreaterThan(locale.buildPackages[index].price);
      expect(item.priceFrom).toBe(true);
    });

    expect(locale.socialPackages.map((item) => item.price)).toEqual([300, 450, 650]);
    expect(locale.socialPackages.find((item) => item.recommended).id).toBe("social-business");
    for (const item of locale.socialPackages) {
      expect(item.billingCycle).toBe("monthly");
      const includedText = item.included.join(" ").toLowerCase();
      expect(includedText).not.toMatch(/meta ads|meta oglas/);
    }
  }
});

test("pricing shows new development, redesign migration, and optional annual maintenance", async ({ page }) => {
  await page.goto(servicePath);
  await expect(page.getByRole("heading", { level: 1, name: "Izrada web-stranica za obrte i tvrtke." })).toBeVisible();
  await expect(page.getByText("Održavanje nije obavezno", { exact: false }).first()).toBeVisible();

  for (const [name, price] of [["Web Basic", "300 €"], ["Web Business", "500 €"], ["Web Pro", "700 €"]]) {
    const card = page.locator("article.offer-card").filter({ hasText: name }).first();
    await expect(card).toContainText(price);
    await expect(card).toContainText("jednokratno");
  }

  await page.locator("#redesign-offer-tab").click();
  await expect(page.getByText("Migracija sadržaja postojećeg weba uključena je prema opsegu paketa.")).toBeVisible();
  for (const [name, price] of [["Redizajn Basic", "od 800 €"], ["Redizajn Business", "od 1.100 €"], ["Redizajn Pro", "od 1.500 €"]]) {
    const card = page.locator("article.offer-card").filter({ hasText: name }).first();
    await expect(card).toContainText(price);
    await expect(card).toContainText("jednokratno");
  }
  await expect(page.locator("article.offer-card").filter({ hasText: "Redizajn Business" })).toContainText("Preporučeno");
  await expect(page.getByText("Redizajn postojeće web-stranice", { exact: true })).toHaveCount(0);

  await page.locator("#maintenance-offer-tab").click();
  for (const [name, price] of [["Održavanje Basic", "200 €"], ["Održavanje Business", "400 €"], ["Održavanje Pro", "600 €"]]) {
    const card = page.locator("article.offer-card").filter({ hasText: name }).first();
    await expect(card).toContainText(price);
    await expect(card).toContainText("godišnje");
  }

  const proCard = page.locator("article.offer-card").filter({ hasText: "Održavanje Pro" });
  await expect(proCard).toContainText("Proaktivni partner");
  await expect(proCard).toContainText("4 proaktivna tehnička ili UX poboljšanja godišnje");
  await expect(proCard).toContainText("Kvartalni pregled weba i performansi");
  await expect(proCard).toContainText("Prvi odgovor unutar 1 radnog dana");
  await expect(proCard).toContainText("50 € mjesečni ekvivalent");
  await expect(proCard).toContainText("Naplata jednom godišnje");
  await expect(proCard.getByText(/do 30 minuta implementacije/)).toBeHidden();
  await proCard.getByText("Sve uključeno").click();
  await expect(proCard.getByText(/do 30 minuta implementacije/)).toBeVisible();

  for (const id of ["maintenance-basic", "maintenance-business"]) {
    await expect(page.locator(`[data-package-id="${id}"]`)).not.toContainText("mjesečni ekvivalent");
  }

  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(/mjesečno plaćanje|pilot ponuda|mjesečna pretplata/i);
  await expectNoHorizontalOverflow(page);
  await expectHeadingOrder(page);
  await expectTouchTargets(page);
});

test("social packages show monthly pricing, keep ad budget and management separate, and cover scope boundaries", async ({ page }) => {
  await page.goto(servicePath);
  await page.locator("#social-offer-tab").click();
  await expect(page.getByRole("heading", { name: "Facebook i Instagram bez praznog hoda" })).toBeVisible();

  for (const [name, price] of [["Social Basic", "300 €"], ["Social Business", "450 €"], ["Social Pro", "650 €"]]) {
    const card = page.locator("article.offer-card").filter({ hasText: name }).first();
    await expect(card).toContainText(price);
    await expect(card).toContainText("/ mj.");
  }
  await expect(page.locator("article.offer-card").filter({ hasText: "Social Business" })).toContainText("Preporučeno");
  await expect(page.locator("article.offer-card").filter({ hasText: "Social Basic" })).not.toContainText("Preporučeno");
  await expect(page.locator("article.offer-card").filter({ hasText: "Social Pro" })).not.toContainText("Preporučeno");

  const basicCard = page.locator("article.offer-card").filter({ hasText: "Social Basic" }).first();
  await expect(basicCard).not.toContainText(/dolaz(imo|ak) na lokaciju/i);

  const socialPanel = page.locator("#drustvene-mreze");
  await expect(socialPanel).toContainText("Budžet za Meta oglase nikad nije uključen");
  await expect(socialPanel).not.toContainText("TikTok");

  await page.locator("#dodatne-usluge").scrollIntoViewIfNeeded();
  await expect(page.locator("#dodatne-usluge")).toContainText("Content session na lokaciji");
  await expect(page.locator("#dodatne-usluge")).toContainText("Upravljanje Meta Ads kampanjama");

  for (const question of [
    "Moramo li sami pripremati objave?",
    "Dolazite li fotografirati i snimati kod nas?",
    "Je li budžet za Facebook i Instagram oglase uključen?",
    "Objavljuje li se isti sadržaj na Facebooku i Instagramu?",
    "Odgovarate li na poruke i komentare?",
  ]) {
    await expect(page.locator(".faq-list summary").filter({ hasText: question })).toBeVisible();
  }

  await expectNoHorizontalOverflow(page);
  await expectHeadingOrder(page);
});

test("pricing selector switches between all four offer kinds without duplicating visible cards", async ({ page }) => {
  await page.goto(servicePath);
  const websiteTab = page.locator("#website-offer-tab");
  const redesignTab = page.locator("#redesign-offer-tab");
  const maintenanceTab = page.locator("#maintenance-offer-tab");
  const socialTab = page.locator("#social-offer-tab");

  await expect(websiteTab).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".offer-card:visible")).toHaveCount(3);
  await redesignTab.click();
  await expect(redesignTab).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".offer-card:visible")).toHaveCount(3);
  await expect(page.getByRole("heading", { name: "Redizajn i migracija postojeće web-stranice" })).toBeVisible();
  await maintenanceTab.click();
  await expect(maintenanceTab).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".offer-card:visible")).toHaveCount(3);
  await expect(page.getByRole("heading", { name: "Godišnje održavanje web-stranice" })).toBeVisible();
  await socialTab.click();
  await expect(socialTab).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".offer-card:visible")).toHaveCount(3);
  await expect(page.getByRole("heading", { name: "Facebook i Instagram bez praznog hoda" })).toBeVisible();

  await socialTab.press("ArrowLeft");
  await expect(maintenanceTab).toBeFocused();
  await expect(maintenanceTab).toHaveAttribute("aria-selected", "true");
});

test("offer hashes resolve correctly and selector updates the URL without a scroll jump", async ({ page }) => {
  for (const [hash, selectedId] of [
    ["#redizajn", "#redesign-offer-tab"],
    ["#odrzavanje", "#maintenance-offer-tab"],
    ["#drustvene-mreze", "#social-offer-tab"],
    ["", "#website-offer-tab"],
    ["#nepoznato", "#website-offer-tab"],
  ]) {
    await page.goto(`${servicePath}${hash}`);
    await expect(page.locator(selectedId)).toHaveAttribute("aria-selected", "true");
  }

  await page.goto(servicePath);
  await expect(page.locator(".offer-selector")).toBeVisible();
  await page.waitForTimeout(1000);
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    const selectorTop = document.querySelector(".offer-selector").getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, Math.max(0, selectorTop - 120));
  });
  const before = await page.evaluate(() => window.scrollY);
  await page.evaluate(() => document.querySelector("#redesign-offer-tab").click());
  await expect(page).toHaveURL(/#redizajn$/);
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - before)).toBeLessThanOrEqual(1);
  await page.locator("#website-offer-tab").click();
  await expect(page).toHaveURL(new RegExp(`${servicePath}$`));
});

test("mobile contact keeps the form before supporting proof", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/kontakt");
  await expect(page.getByRole("heading", { level: 1, name: /Pišite nam/ })).toBeVisible();
  const formBox = await page.locator(".contact-brief-form").boundingBox();
  const proofBox = await page.locator(".contact-brief-proof").boundingBox();
  expect(formBox.y).toBeLessThan(proofBox.y);
  await expectNoHorizontalOverflow(page);
});

test("English content stays aligned with the new model", async ({ page }) => {
  await page.goto(servicePath);
  await page.getByRole("button", { name: "ENG" }).click();
  await expect(page.getByRole("heading", { name: "Website development packages" })).toBeVisible();
  await expect(page.getByText("The website belongs to the client after payment.", { exact: false }).first()).toBeVisible();
  await page.locator("#redesign-offer-tab").click();
  await expect(page.getByRole("heading", { name: "Existing website redesign and migration" })).toBeVisible();
  await expect(page.locator("article.offer-card").filter({ hasText: "Redesign Business" })).toContainText("from €1,100");
  await page.locator("#maintenance-offer-tab").click();
  await expect(page.getByRole("heading", { name: "Annual website maintenance" })).toBeVisible();
  await expect(page.locator("article.offer-card").filter({ hasText: "Maintenance Pro" })).toContainText("€50 monthly equivalent");
  await expect(page.locator("article.offer-card").filter({ hasText: "Maintenance Pro" })).toContainText("Billed once per year");

  const bodyText = await page.locator("body").innerText();
  expect(bodyText).not.toMatch(/monthly payment|pilot offer|monthly subscription/i);

  await page.locator("#social-offer-tab").click();
  await expect(page.getByRole("heading", { name: "Facebook and Instagram, without the dead air" })).toBeVisible();
  for (const [name, price] of [["Social Basic", "€300"], ["Social Business", "€450"], ["Social Pro", "€650"]]) {
    const card = page.locator("article.offer-card").filter({ hasText: name }).first();
    await expect(card).toContainText(price);
    await expect(card).toContainText("/ month");
  }
  await expect(page.locator("article.offer-card").filter({ hasText: "Social Business" })).toContainText("Recommended");
});

test("package inquiry dialog carries the selected commercial model", async ({ page }) => {
  await page.goto(servicePath);
  const businessCard = page.locator("article.offer-card").filter({ hasText: "Web Business" }).first();
  await businessCard.getByRole("button", { name: "Pošalji upit za paket" }).click();

  const dialog = page.getByRole("dialog", { name: "Pošaljite upit" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Web Business");
  await expect(dialog).toContainText("Nova web-stranica");
  await expect(dialog).toContainText("500 € · jednokratno");
  await expect(page.locator("#inquiry-name")).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(businessCard.getByRole("button", { name: "Pošalji upit za paket" })).toBeFocused();

  await page.locator("#redesign-offer-tab").click();
  const redesignCard = page.locator("article.offer-card").filter({ hasText: "Redizajn Business" });
  await redesignCard.getByRole("button", { name: "Pošalji upit za redizajn" }).click();
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Redizajn i migracija");
  await expect(dialog).toContainText("od 1.100 € · jednokratno");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();

  await page.locator("#social-offer-tab").click();
  const socialCard = page.locator("article.offer-card").filter({ hasText: "Social Business" });
  await socialCard.getByRole("button", { name: "Zatraži ponudu" }).click();
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Social Business");
  await expect(dialog).toContainText("Vođenje Facebooka i Instagrama");
  await expect(dialog).toContainText("450 € / mj.");
});

test("390px layout stacks all four selector controls and stays within the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(servicePath);
  const tabs = page.locator(".offer-selector [role=tab]");
  await expect(tabs).toHaveCount(4);
  const boxes = await tabs.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().toJSON()));
  expect(boxes[0].bottom).toBeLessThanOrEqual(boxes[1].top);
  expect(boxes[1].bottom).toBeLessThanOrEqual(boxes[2].top);
  expect(boxes[2].bottom).toBeLessThanOrEqual(boxes[3].top);
  await expectNoHorizontalOverflow(page);
  await expectTouchTargets(page);
});

test("768px layout arranges the four selector controls in a 2x2 grid without overflow", async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(servicePath);
  const tabs = page.locator(".offer-selector [role=tab]");
  await expect(tabs).toHaveCount(4);
  const boxes = await tabs.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().toJSON()));
  expect(boxes[0].top).toBeCloseTo(boxes[1].top, 0);
  expect(boxes[2].top).toBeCloseTo(boxes[3].top, 0);
  expect(boxes[0].bottom).toBeLessThanOrEqual(boxes[2].top);
  await expectNoHorizontalOverflow(page);
  await expectTouchTargets(page);
});

test("legacy route redirects and keeps its anchor", async ({ page }) => {
  await page.goto("/usluge/web-stranica-bez-pocetnog-troska#paketi");
  await expect(page).toHaveURL(/\/usluge\/izrada-web-stranica#paketi$/);
  await expect(page.getByRole("heading", { name: "Paketi izrade web-stranice" })).toBeVisible();
});

test("landing, pricing, and contact have no serious accessibility violations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of ["/", servicePath, "/kontakt"]) {
    await page.goto(path);
    await expect(page.locator("h1")).toBeVisible();
    await page.waitForTimeout(1000);
    const results = await new AxeBuilder({ page }).analyze();
    const serious = results.violations.filter(({ impact }) => impact === "serious" || impact === "critical");
    expect(serious, `${path}: ${serious.map((item) => item.id).join(", ")}`).toEqual([]);
  }
});
