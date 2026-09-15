# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web-offer.spec.js >> restored landing keeps its original structure and adds Auto Gubić below
- Location: e2e\web-offer.spec.js:336:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/
Call log:
  - navigating to "http://127.0.0.1:4173/", waiting until "load"

```

# Test source

```ts
  237 |   const copyLayout = await page.getByTestId("evolution-copy").evaluate((element) => {
  238 |     const rect = element.getBoundingClientRect();
  239 |     const storyRect = element.parentElement.getBoundingClientRect();
  240 |     return { left: rect.left, storyLeft: storyRect.left, right: rect.right, viewport: window.innerWidth };
  241 |   });
  242 |   expect(Math.abs(copyLayout.left - copyLayout.storyLeft)).toBeLessThanOrEqual(1);
  243 |   expect(copyLayout.right).toBeLessThanOrEqual(copyLayout.viewport);
  244 | 
  245 |   await page.waitForTimeout(400);
  246 |   await page.mouse.wheel(0, 120);
  247 |   await expect(intro).toHaveAttribute("data-active-scene", "2");
  248 |   await page.waitForTimeout(1200);
  249 |   await expect.poll(async () => Math.abs(await evolutionFrameTime(page) - 8.1)).toBeLessThanOrEqual(0.18);
  250 | 
  251 |   await scrollEvolutionIntro(page, 6);
  252 |   await expect(intro).toHaveAttribute("data-active-scene", "6");
  253 |   await expect.poll(() => evolutionFrameTime(page)).toBeGreaterThanOrEqual(17.95);
  254 |   const loopFrame = page.getByTestId("evolution-frame");
  255 |   await expect(loopFrame).toHaveAttribute("src", "/evolution-loop.webp");
  256 |   await expect.poll(() => loopFrame.evaluate((element) => element.complete && element.naturalWidth > 0)).toBe(true);
  257 | });
  258 | 
  259 | test("mobile shows an animated brand title on every scene except the final loop", async ({ page }) => {
  260 |   await page.goto("/");
  261 |   await openEvolutionIntro(page);
  262 |   const intro = page.getByTestId("evolution-intro");
  263 |   const brandTitle = page.getByRole("button", { name: "Nepar Solutions — zatvori animaciju" });
  264 | 
  265 |   const isMobileViewport = (page.viewportSize()?.width ?? 0) <= 700;
  266 |   if (!isMobileViewport) {
  267 |     await expect(brandTitle).toBeHidden();
  268 |     await scrollEvolutionIntro(page, 6);
  269 |     await expect(brandTitle).toBeHidden();
  270 |     return;
  271 |   }
  272 | 
  273 |   await expect(intro).toHaveAttribute("data-active-scene", "0");
  274 |   await expect(brandTitle).toBeVisible();
  275 |   await expect(brandTitle).toHaveText("Nepar Solutions");
  276 | 
  277 |   await scrollEvolutionIntro(page, 6);
  278 |   await expect(intro).toHaveAttribute("data-active-scene", "6");
  279 |   await expect(brandTitle).toBeHidden();
  280 | 
  281 |   await scrollEvolutionIntro(page, 5);
  282 |   await expect(intro).toHaveAttribute("data-active-scene", "5");
  283 |   await expect(brandTitle).toBeVisible();
  284 | 
  285 |   // force:true — the button lives on a sticky, scroll-jacked overlay that's
  286 |   // already fully on-screen; Playwright's default scrollIntoViewIfNeeded
  287 |   // pre-click step nudges window scroll, which fights the intro's own
  288 |   // IntersectionObserver-driven scene detection and flickers the button
  289 |   // out of the DOM. No real tap ever triggers that extra scroll.
  290 |   await brandTitle.click({ force: true });
  291 |   await expect(intro).toHaveCount(0);
  292 |   await expect(page.getByRole("heading", { level: 1, name: /Gradimo korisne digitalne proizvode/ })).toBeVisible();
  293 | });
  294 | 
  295 | test("cinematic intro opens on demand and can be skipped", async ({ page }) => {
  296 |   await page.goto("/");
  297 |   await expect(page.getByTestId("evolution-intro")).toHaveCount(0);
  298 |   await expect(page.getByRole("heading", { level: 1, name: /Gradimo korisne digitalne proizvode/ })).toBeVisible();
  299 |   await openEvolutionIntro(page);
  300 |   await page.getByRole("button", { name: "Zatvori animaciju", exact: true }).click();
  301 | 
  302 |   await expect(page.getByTestId("evolution-intro")).toHaveCount(0);
  303 |   await page.reload();
  304 |   await expect(page.getByTestId("evolution-intro")).toHaveCount(0);
  305 |   await expect(page.getByRole("heading", { level: 1, name: /Gradimo korisne digitalne proizvode/ })).toBeVisible();
  306 | });
  307 | 
  308 | test("reduced motion keeps the home visible and opens a static final frame", async ({ page }) => {
  309 |   const videoRequests = [];
  310 |   page.on("request", (request) => {
  311 |     const pathname = new URL(request.url()).pathname;
  312 |     if (heroVideoPattern.test(pathname)) videoRequests.push(pathname);
  313 |   });
  314 |   await page.emulateMedia({ reducedMotion: "reduce" });
  315 |   await page.goto("/");
  316 |   const hero = page.locator("#top");
  317 |   await expect(hero.locator('picture source[media="(max-width: 767px)"]')).toHaveAttribute(
  318 |     "srcset",
  319 |     "/nepar-background-mobile-900x1600.webp",
  320 |   );
  321 |   await expect(hero.locator(".hero-background-poster")).toBeVisible();
  322 |   await expect(hero.locator('picture img[src="/nepar-background-desktop-2400x900.webp"]')).toBeVisible();
  323 |   await expect(hero.locator("video")).toHaveCount(0);
  324 |   await page.waitForTimeout(600);
  325 |   expect(videoRequests).toEqual([]);
  326 |   await expect(page.getByTestId("evolution-intro")).toHaveCount(0);
  327 |   await expect(page.getByRole("heading", { level: 1, name: /Gradimo korisne digitalne proizvode/ })).toBeVisible();
  328 |   await openEvolutionIntro(page);
  329 |   await expect(page.getByTestId("evolution-intro")).toHaveAttribute("data-active-scene", "6");
  330 |   await expect(page.getByTestId("evolution-frame")).toHaveAttribute(
  331 |     "src",
  332 |     "/evolution-frames/evolution-frame-114.webp",
  333 |   );
  334 | });
  335 | 
  336 | test("restored landing keeps its original structure and adds Auto Gubić below", async ({ page }) => {
> 337 |   await page.goto("/");
      |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/
  338 |   await skipEvolutionIntro(page);
  339 |   await expect(
  340 |     page.getByRole("heading", { level: 1, name: /Gradimo korisne digitalne proizvode za stvarni svijet/ }),
  341 |   ).toBeVisible();
  342 |   await expect(page.getByText("Pilot popunjenost")).toHaveCount(0);
  343 |   await expect(page.getByText("mjesta popunjeno")).toHaveCount(0);
  344 |   const serviceImages = page.locator("#usluge .service-card-art");
  345 |   await expect(serviceImages).toHaveCount(4);
  346 |   await expect.poll(() => serviceImages.evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0))).toBe(true);
  347 | 
  348 |   const projects = page.locator("#projekti");
  349 |   await projects.scrollIntoViewIfNeeded();
  350 |   await expect(projects.locator(".featured-project-card")).toHaveCount(11);
  351 |   const projectSectionHeight = await projects.evaluate((section) => section.getBoundingClientRect().height);
  352 |   expect(projectSectionHeight).toBeLessThanOrEqual(page.viewportSize().height);
  353 |   await expect(page.locator("#kontakt")).not.toHaveCSS("position", "fixed");
  354 |   const projectLink = projects.getByRole("link", { name: /Auto Gubić/ });
  355 |   await expect(projectLink).toBeVisible();
  356 |   await expect(projectLink).toHaveAttribute("href", "https://autogubic.hr/");
  357 |   await expect(projectLink).toHaveAttribute("target", "_blank");
  358 |   await expect(projectLink).toHaveAttribute("rel", /noreferrer/);
  359 |   await expect(projectLink.getByRole("heading", { name: "Auto Gubić" })).toBeVisible();
  360 |   await expect(projectLink.locator('img[src="/brand/autogubic.webp"]')).toHaveAttribute("alt", "Auto Gubić web-stranica");
  361 | 
  362 |   if ((page.viewportSize()?.width ?? 0) < 1024) {
  363 |     const heroOrder = await page.evaluate(() => {
  364 |       const projectButton = [...document.querySelectorAll('a[href="#projekti"]')]
  365 |         .find((element) => element.getClientRects().length > 0);
  366 |       const visibleOrbit = [...document.querySelectorAll(".orbital-card")]
  367 |         .find((element) => element.getClientRects().length > 0);
  368 |       return {
  369 |         orbitBottom: visibleOrbit?.getBoundingClientRect().bottom ?? 0,
  370 |         buttonTop: projectButton?.getBoundingClientRect().top ?? 0,
  371 |       };
  372 |     });
  373 |     expect(heroOrder.orbitBottom).toBeLessThan(heroOrder.buttonTop);
  374 | 
  375 |     const mobileCarouselScene = page.getByTestId("mobile-project-carousel").locator("[data-carousel-scene]");
  376 |     await page.setViewportSize({ width: 600, height: 900 });
  377 |     await expect(mobileCarouselScene).toHaveAttribute("style", /height:\s*292px/);
  378 |     await page.setViewportSize({ width: 700, height: 900 });
  379 |     await expect(mobileCarouselScene).toHaveAttribute("style", /height:\s*344px/);
  380 |   }
  381 | 
  382 |   await expectNoHorizontalOverflow(page);
  383 |   await expectTouchTargets(page);
  384 | });
  385 | 
  386 | test("hero video is poster-first and loads only the active breakpoint source", async ({ page }) => {
  387 |   await installControlledHeroIdle(page);
  388 |   const videoRequests = [];
  389 |   page.on("request", (request) => {
  390 |     const pathname = new URL(request.url()).pathname;
  391 |     if (heroVideoPattern.test(pathname)) videoRequests.push(pathname);
  392 |   });
  393 |   await page.goto("/");
  394 |   const hero = page.locator("#top");
  395 |   const isMobileViewport = (page.viewportSize()?.width ?? 0) < 768;
  396 |   const sourceKey = isMobileViewport ? "mobile" : "desktop";
  397 |   const webmPath = `/brand/hero-${sourceKey}.webm`;
  398 |   const mp4Path = `/brand/hero-${sourceKey}.mp4`;
  399 | 
  400 |   await expect(hero.locator(".hero-background-poster")).toBeVisible();
  401 |   await expect(hero.locator('picture img[src="/nepar-background-desktop-2400x900.webp"]')).toBeVisible();
  402 |   await expect(hero.locator("video")).toHaveCount(1);
  403 |   await expect(hero.locator("video source")).toHaveCount(0);
  404 |   expect(videoRequests).toEqual([]);
  405 | 
  406 |   await page.evaluate(() => window.__runHeroIdleCallbacks());
  407 |   const sources = hero.locator("video source");
  408 |   await expect(sources).toHaveCount(2);
  409 |   await expect(sources.nth(0)).toHaveAttribute("src", webmPath);
  410 |   await expect(sources.nth(0)).toHaveAttribute("type", "video/webm; codecs=vp9");
  411 |   await expect(sources.nth(1)).toHaveAttribute("src", mp4Path);
  412 |   await expect(sources.nth(1)).toHaveAttribute("type", 'video/mp4; codecs="hvc1"');
  413 |   await expect.poll(() => videoRequests.includes(webmPath)).toBe(true);
  414 |   expect(videoRequests.some((path) => path.includes(sourceKey === "mobile" ? "desktop" : "mobile"))).toBe(false);
  415 |   await expect.poll(() => hero.locator("video").evaluate((video) => new URL(video.currentSrc).pathname)).toBe(webmPath);
  416 |   await expect(hero.locator("video")).toHaveClass(/hero-background-video--visible/);
  417 |   await expect(hero.locator(".hero-background-poster")).toBeVisible();
  418 | 
  419 |   for (const eventName of ["error", "abort", "emptied"]) {
  420 |     await hero.locator("video").dispatchEvent(eventName);
  421 |     await expect(hero.locator("video")).not.toHaveClass(/hero-background-video--visible/);
  422 |     await expect(hero.locator(".hero-background-poster")).toBeVisible();
  423 |     await hero.locator("video").dispatchEvent("playing");
  424 |     await expect(hero.locator("video")).toHaveClass(/hero-background-video--visible/);
  425 |   }
  426 | });
  427 | 
  428 | test("hero keeps the poster when autoplay is rejected", async ({ page }) => {
  429 |   await page.addInitScript(() => {
  430 |     HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException("Autoplay blocked", "NotAllowedError"));
  431 |   });
  432 |   await page.goto("/");
  433 |   const hero = page.locator("#top");
  434 |   await expect(hero.locator("video")).toHaveCount(1);
  435 |   await page.waitForTimeout(600);
  436 |   await expect(hero.locator("video")).not.toHaveClass(/hero-background-video--visible/);
  437 |   await expect(hero.locator(".hero-background-poster")).toBeVisible();
```