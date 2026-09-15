# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web-offer.spec.js >> hero media assets are served with explicit MIME types
- Location: e2e\web-offer.spec.js:501:1

# Error details

```
Error: apiRequestContext.get: connect ECONNREFUSED 127.0.0.1:4173
Call log:
  - → GET http://127.0.0.1:4173/brand/hero-desktop.webm
    - user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.7778.96 Safari/537.36
    - accept: */*
    - accept-encoding: gzip,deflate,br

```

# Test source

```ts
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
  438 | });
  439 | 
  440 | test("hero reloads only the new source after a breakpoint change", async ({ page }) => {
  441 |   await installControlledHeroIdle(page);
  442 |   await page.addInitScript(() => {
  443 |     const nativeLoad = HTMLMediaElement.prototype.load;
  444 |     window.__heroLoadCalls = 0;
  445 |     HTMLMediaElement.prototype.load = function load() {
  446 |       if (this.classList.contains("hero-background-video")) window.__heroLoadCalls += 1;
  447 |       return nativeLoad.call(this);
  448 |     };
  449 |   });
  450 |   const videoRequests = [];
  451 |   page.on("request", (request) => {
  452 |     const pathname = new URL(request.url()).pathname;
  453 |     if (heroVideoPattern.test(pathname)) videoRequests.push(pathname);
  454 |   });
  455 | 
  456 |   await page.goto("/");
  457 |   const hero = page.locator("#top");
  458 |   const initialMobile = (page.viewportSize()?.width ?? 0) < 768;
  459 |   const initialKey = initialMobile ? "mobile" : "desktop";
  460 |   const nextKey = initialMobile ? "desktop" : "mobile";
  461 |   await page.evaluate(() => window.__runHeroIdleCallbacks());
  462 |   await expect.poll(() => hero.locator("video").getAttribute("data-source-key")).toBe(initialKey);
  463 |   await expect.poll(() => hero.locator("video").evaluate((video) => new URL(video.currentSrc).pathname))
  464 |     .toBe(`/brand/hero-${initialKey}.webm`);
  465 | 
  466 |   const requestsBeforeSwitch = videoRequests.length;
  467 |   const loadCallsBeforeSwitch = await page.evaluate(() => window.__heroLoadCalls);
  468 |   await page.setViewportSize(initialMobile ? { width: 1440, height: 900 } : { width: 390, height: 844 });
  469 |   await expect(hero.locator("video")).toHaveAttribute("data-source-key", nextKey);
  470 |   await expect(hero.locator("video")).not.toHaveClass(/hero-background-video--visible/);
  471 |   await expect(hero.locator("video source")).toHaveCount(0);
  472 |   await page.evaluate(() => window.__runHeroIdleCallbacks());
  473 |   await expect(hero.locator("video source").nth(0)).toHaveAttribute("src", `/brand/hero-${nextKey}.webm`);
  474 |   await expect.poll(() => hero.locator("video").evaluate((video) => new URL(video.currentSrc).pathname))
  475 |     .toBe(`/brand/hero-${nextKey}.webm`);
  476 |   await expect.poll(() => page.evaluate(() => window.__heroLoadCalls)).toBeGreaterThan(loadCallsBeforeSwitch);
  477 |   expect(videoRequests.slice(requestsBeforeSwitch).some((path) => path.includes(initialKey))).toBe(false);
  478 | 
  479 |   await page.locator("#projekti").scrollIntoViewIfNeeded();
  480 |   await expect.poll(() => hero.locator("video").evaluate((video) => video.paused)).toBe(true);
  481 |   await hero.scrollIntoViewIfNeeded();
  482 |   await expect.poll(() => hero.locator("video").evaluate((video) => video.paused)).toBe(false);
  483 | 
  484 |   await page.evaluate(() => {
  485 |     let mockedVisibilityState = "visible";
  486 |     Object.defineProperty(document, "visibilityState", {
  487 |       configurable: true,
  488 |       get: () => mockedVisibilityState,
  489 |     });
  490 |     window.__setHeroVisibility = (state) => {
  491 |       mockedVisibilityState = state;
  492 |       document.dispatchEvent(new Event("visibilitychange"));
  493 |     };
  494 |   });
  495 |   await page.evaluate(() => window.__setHeroVisibility("hidden"));
  496 |   await expect.poll(() => hero.locator("video").evaluate((video) => video.paused)).toBe(true);
  497 |   await page.evaluate(() => window.__setHeroVisibility("visible"));
  498 |   await expect.poll(() => hero.locator("video").evaluate((video) => video.paused)).toBe(false);
  499 | });
  500 | 
  501 | test("hero media assets are served with explicit MIME types", async ({ request }) => {
  502 |   for (const [asset, contentType] of [
  503 |     ["/brand/hero-desktop.webm", "video/webm"],
  504 |     ["/brand/hero-mobile.webm", "video/webm"],
  505 |     ["/brand/hero-desktop.mp4", "video/mp4"],
  506 |     ["/brand/hero-mobile.mp4", "video/mp4"],
  507 |     ["/nepar-background-desktop-2400x900.webp", "image/webp"],
  508 |     ["/nepar-background-mobile-900x1600.webp", "image/webp"],
  509 |   ]) {
> 510 |     const response = await request.get(asset);
      |                                    ^ Error: apiRequestContext.get: connect ECONNREFUSED 127.0.0.1:4173
  511 |     expect(response.ok(), asset).toBe(true);
  512 |     expect(response.headers()["content-type"], asset).toContain(contentType);
  513 |   }
  514 | });
  515 | 
  516 | test("offer data keeps one recommendation per kind and redesign priced above new development", () => {
  517 |   for (const locale of Object.values(webOfferContent)) {
  518 |     const groups = [locale.buildPackages, locale.redesignPackages, locale.maintenancePackages, locale.socialPackages];
  519 |     for (const packages of groups) {
  520 |       expect(packages.filter((item) => item.recommended)).toHaveLength(1);
  521 |     }
  522 | 
  523 |     locale.redesignPackages.forEach((item, index) => {
  524 |       expect(item.price).toBeGreaterThan(locale.buildPackages[index].price);
  525 |       expect(item.priceFrom).toBe(true);
  526 |     });
  527 | 
  528 |     expect(locale.socialPackages.map((item) => item.price)).toEqual([300, 450, 650]);
  529 |     expect(locale.socialPackages.find((item) => item.recommended).id).toBe("social-business");
  530 |     for (const item of locale.socialPackages) {
  531 |       expect(item.billingCycle).toBe("monthly");
  532 |       const includedText = item.included.join(" ").toLowerCase();
  533 |       expect(includedText).not.toMatch(/meta ads|meta oglas/);
  534 |     }
  535 |   }
  536 | });
  537 | 
  538 | test("pricing shows new development, redesign migration, and optional annual maintenance", async ({ page }) => {
  539 |   await page.goto(servicePath);
  540 |   await expect(page.getByRole("heading", { level: 1, name: "Izrada web-stranica za obrte i tvrtke." })).toBeVisible();
  541 |   await expect(page.getByText("Održavanje nije obavezno", { exact: false }).first()).toBeVisible();
  542 | 
  543 |   for (const [name, price] of [["Web Basic", "300 €"], ["Web Business", "500 €"], ["Web Pro", "700 €"]]) {
  544 |     const card = page.locator("article.offer-card").filter({ hasText: name }).first();
  545 |     await expect(card).toContainText(price);
  546 |     await expect(card).toContainText("jednokratno");
  547 |   }
  548 | 
  549 |   await page.locator("#redesign-offer-tab").click();
  550 |   await expect(page.getByText("Migracija sadržaja postojećeg weba uključena je prema opsegu paketa.")).toBeVisible();
  551 |   for (const [name, price] of [["Redizajn Basic", "od 800 €"], ["Redizajn Business", "od 1.100 €"], ["Redizajn Pro", "od 1.500 €"]]) {
  552 |     const card = page.locator("article.offer-card").filter({ hasText: name }).first();
  553 |     await expect(card).toContainText(price);
  554 |     await expect(card).toContainText("jednokratno");
  555 |   }
  556 |   await expect(page.locator("article.offer-card").filter({ hasText: "Redizajn Business" })).toContainText("Preporučeno");
  557 |   await expect(page.getByText("Redizajn postojeće web-stranice", { exact: true })).toHaveCount(0);
  558 | 
  559 |   await page.locator("#maintenance-offer-tab").click();
  560 |   for (const [name, price] of [["Održavanje Basic", "200 €"], ["Održavanje Business", "400 €"], ["Održavanje Pro", "600 €"]]) {
  561 |     const card = page.locator("article.offer-card").filter({ hasText: name }).first();
  562 |     await expect(card).toContainText(price);
  563 |     await expect(card).toContainText("godišnje");
  564 |   }
  565 | 
  566 |   const proCard = page.locator("article.offer-card").filter({ hasText: "Održavanje Pro" });
  567 |   await expect(proCard).toContainText("Proaktivni partner");
  568 |   await expect(proCard).toContainText("4 proaktivna tehnička ili UX poboljšanja godišnje");
  569 |   await expect(proCard).toContainText("Kvartalni pregled weba i performansi");
  570 |   await expect(proCard).toContainText("Prvi odgovor unutar 1 radnog dana");
  571 |   await expect(proCard).toContainText("50 € mjesečni ekvivalent");
  572 |   await expect(proCard).toContainText("Naplata jednom godišnje");
  573 |   await expect(proCard.getByText(/do 30 minuta implementacije/)).toBeHidden();
  574 |   await proCard.getByText("Sve uključeno").click();
  575 |   await expect(proCard.getByText(/do 30 minuta implementacije/)).toBeVisible();
  576 | 
  577 |   for (const id of ["maintenance-basic", "maintenance-business"]) {
  578 |     await expect(page.locator(`[data-package-id="${id}"]`)).not.toContainText("mjesečni ekvivalent");
  579 |   }
  580 | 
  581 |   const bodyText = await page.locator("body").innerText();
  582 |   expect(bodyText).not.toMatch(/mjesečno plaćanje|pilot ponuda|mjesečna pretplata/i);
  583 |   await expectNoHorizontalOverflow(page);
  584 |   await expectHeadingOrder(page);
  585 |   await expectTouchTargets(page);
  586 | });
  587 | 
  588 | test("social packages show monthly pricing, keep ad budget and management separate, and cover scope boundaries", async ({ page }) => {
  589 |   await page.goto(servicePath);
  590 |   await page.locator("#social-offer-tab").click();
  591 |   await expect(page.getByRole("heading", { name: "Facebook i Instagram bez praznog hoda" })).toBeVisible();
  592 | 
  593 |   for (const [name, price] of [["Social Basic", "300 €"], ["Social Business", "450 €"], ["Social Pro", "650 €"]]) {
  594 |     const card = page.locator("article.offer-card").filter({ hasText: name }).first();
  595 |     await expect(card).toContainText(price);
  596 |     await expect(card).toContainText("/ mj.");
  597 |   }
  598 |   await expect(page.locator("article.offer-card").filter({ hasText: "Social Business" })).toContainText("Preporučeno");
  599 |   await expect(page.locator("article.offer-card").filter({ hasText: "Social Basic" })).not.toContainText("Preporučeno");
  600 |   await expect(page.locator("article.offer-card").filter({ hasText: "Social Pro" })).not.toContainText("Preporučeno");
  601 | 
  602 |   const basicCard = page.locator("article.offer-card").filter({ hasText: "Social Basic" }).first();
  603 |   await expect(basicCard).not.toContainText(/dolaz(imo|ak) na lokaciju/i);
  604 | 
  605 |   const socialPanel = page.locator("#drustvene-mreze");
  606 |   await expect(socialPanel).toContainText("Budžet za Meta oglase nikad nije uključen");
  607 |   await expect(socialPanel).not.toContainText("TikTok");
  608 | 
  609 |   await page.locator("#dodatne-usluge").scrollIntoViewIfNeeded();
  610 |   await expect(page.locator("#dodatne-usluge")).toContainText("Content session na lokaciji");
```