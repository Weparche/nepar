# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: njamko.spec.js >> Njamko platform >> 9b. baby level 5 koristi mobile answer row layout
- Location: e2e\njamko.spec.js:448:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('level-card-5')
    - locator resolved to <button type="button" data-level-id="5" data-mode-id="baby" data-testid="level-card-5" data-level-status="unlocked" class="nj-level-row level-card-pop">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
      - waiting 100ms
    - waiting for element to be visible, enabled and stable
    - element is not stable
  48 × retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <button type="button" class="button button-primary">Prihvati analitiku</button> from <aside role="dialog" aria-modal="false" class="consent-panel" data-testid="consent-panel" aria-labelledby="consent-title" aria-describedby="consent-description">…</aside> subtree intercepts pointer events
  - retrying click action
    - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - generic:
      - generic: ☁️
      - generic: ☁️
      - generic: 🌤️
      - generic: 🌳
      - generic: 🌲
    - generic [ref=e5]:
      - banner [ref=e6]:
        - heading "Mama i beba" [level=1] [ref=e7]: 🐣 Mama i beba
        - paragraph [ref=e8]: Odaberi razinu i spoji bebe s mamama.
      - generic [ref=e9]:
        - button "Razina 1 Najpoznatiji parovi 10 rundi Besplatno" [ref=e10] [cursor=pointer]:
          - generic [ref=e11]: "1"
          - generic [ref=e12]:
            - generic [ref=e13]: Razina 1
            - generic [ref=e14]: Najpoznatiji parovi
            - generic [ref=e15]: 10 rundi
          - generic [ref=e16]:
            - generic [ref=e17]: ✅
            - text: Besplatno
        - button "Razina 2 Dvorište i male domaće životinje 10 rundi Otključano" [ref=e18] [cursor=pointer]:
          - generic [ref=e19]: "2"
          - generic [ref=e20]:
            - generic [ref=e21]: Razina 2
            - generic [ref=e22]: Dvorište i male domaće životinje
            - generic [ref=e23]: 10 rundi
          - generic [ref=e24]:
            - generic [ref=e25]: ⭐
            - text: Otključano
        - button "Razina 3 Šuma i livada 10 rundi Otključano" [ref=e26] [cursor=pointer]:
          - generic [ref=e27]: "3"
          - generic [ref=e28]:
            - generic [ref=e29]: Razina 3
            - generic [ref=e30]: Šuma i livada
            - generic [ref=e31]: 10 rundi
          - generic [ref=e32]:
            - generic [ref=e33]: ⭐
            - text: Otključano
        - button "Razina 4 Divlje životinje svijeta 10 rundi Otključano" [ref=e34] [cursor=pointer]:
          - generic [ref=e35]: "4"
          - generic [ref=e36]:
            - generic [ref=e37]: Razina 4
            - generic [ref=e38]: Divlje životinje svijeta
            - generic [ref=e39]: 10 rundi
          - generic [ref=e40]:
            - generic [ref=e41]: ⭐
            - text: Otključano
        - button "Razina 5 Voda, led i mali izazov 10 rundi Otključano" [ref=e42] [cursor=pointer]:
          - generic [ref=e43]: "5"
          - generic [ref=e44]:
            - generic [ref=e45]: Razina 5
            - generic [ref=e46]: Voda, led i mali izazov
            - generic [ref=e47]: 10 rundi
          - generic [ref=e48]:
            - generic [ref=e49]: ⭐
            - text: Otključano
      - button "Natrag" [ref=e50] [cursor=pointer]
  - dialog "Vi birate analitiku" [ref=e51]:
    - generic [ref=e52]:
      - img [ref=e54]
      - generic [ref=e57]:
        - heading "Vi birate analitiku" [level=2] [ref=e58]
        - paragraph [ref=e59]: Nužne postavke održavaju stranicu funkcionalnom. Uz vaše dopuštenje koristimo GA4 i vlastitu analitiku kako bismo razumjeli koje stranice i upiti stvarno pomažu.
    - generic [ref=e60]:
      - button "Prihvati analitiku" [ref=e61] [cursor=pointer]
      - button "Odbij analitiku" [ref=e62] [cursor=pointer]
      - link "Politika privatnosti" [ref=e63] [cursor=pointer]:
        - /url: /privatnost
```

# Test source

```ts
  355 |     await expect(page.getByTestId("campaign-stop-food")).toHaveClass(/nj-campaign-stop--active/);
  356 |     await expect(page.getByTestId("campaign-replay-step-button")).toBeDisabled();
  357 |     const completedStep = await page.evaluate(() =>
  358 |       localStorage.getItem("njamkoCampaignCompletedStep"),
  359 |     );
  360 |     expect(completedStep).toBeNull();
  361 |   });
  362 | 
  363 |   test("2g. browser back iz igre vraća na odabir igre", async ({ page }) => {
  364 |     await openFoodLevelSelect(page);
  365 |     await page.getByTestId("level-card-1").click();
  366 |     await expect(page.getByTestId("game-screen")).toBeVisible();
  367 | 
  368 |     await page.evaluate(() => window.history.back());
  369 | 
  370 |     await expect(page.getByTestId("mode-select")).toBeVisible();
  371 |     await expect(page.getByTestId("landing-page")).toHaveCount(0);
  372 |   });
  373 | 
  374 |   test("2h. browser back iz kampanje vraća na odabir igre", async ({ page }) => {
  375 |     await openModeSelect(page);
  376 |     await page.getByTestId("campaign-button").click();
  377 |     await expect(page.getByTestId("campaign-map-screen")).toBeVisible();
  378 | 
  379 |     await page.evaluate(() => window.history.back());
  380 | 
  381 |     await expect(page.getByTestId("mode-select")).toBeVisible();
  382 |     await expect(page.getByTestId("landing-page")).toHaveCount(0);
  383 |   });
  384 | 
  385 |   test("3. level select prikazuje 5 levela", async ({ page }) => {
  386 |     await openFoodLevelSelect(page);
  387 |     for (let i = 1; i <= 5; i += 1) {
  388 |       await expect(page.getByTestId(`level-card-${i}`)).toBeVisible();
  389 |     }
  390 |     await expect(page.getByTestId("level-card-1")).toContainText("Besplatno");
  391 |     await expect(page.getByTestId("level-card-2")).toContainText("Plus");
  392 |   });
  393 | 
  394 |   test("4. free level se može igrati", async ({ page }) => {
  395 |     await openFoodLevelSelect(page);
  396 |     await page.getByTestId("level-card-1").click();
  397 |     await expect(page.getByTestId("game-screen")).toBeVisible();
  398 |     await expect(page.getByTestId("game-progress")).toHaveText("1/10");
  399 |   });
  400 | 
  401 |   test("5. locked level traži parental gate", async ({ page }) => {
  402 |     await openFoodLevelSelect(page);
  403 |     await page.getByTestId("level-card-2").click();
  404 |     await expect(page.getByTestId("parental-gate")).toBeVisible();
  405 |   });
  406 | 
  407 |   test("6. krivi parental odgovor", async ({ page }) => {
  408 |     await openFoodLevelSelect(page);
  409 |     await page.getByTestId("level-card-2").click();
  410 |     await page.getByTestId("parental-answer-input").fill("10");
  411 |     await page.getByTestId("parental-submit-button").click();
  412 |     await expect(page.getByTestId("parental-error")).toContainText("Pokušaj ponovno.");
  413 |   });
  414 | 
  415 |   test("7. točan parental odgovor", async ({ page }) => {
  416 |     await openFoodLevelSelect(page);
  417 |     await page.getByTestId("level-card-2").click();
  418 |     await page.getByTestId("parental-answer-input").fill("12");
  419 |     await page.getByTestId("parental-submit-button").click();
  420 |     await expect(page.getByTestId("plus-screen")).toBeVisible();
  421 |     await expect(page.getByTestId("plus-price")).toContainText("4,99 €");
  422 |   });
  423 | 
  424 |   test("8. simuliraj otključavanje", async ({ page }) => {
  425 |     await openFoodLevelSelect(page);
  426 |     await page.getByTestId("level-card-2").click();
  427 |     await page.getByTestId("parental-answer-input").fill("12");
  428 |     await page.getByTestId("parental-submit-button").click();
  429 |     await page.getByTestId("plus-unlock-button").click();
  430 | 
  431 |     const unlocked = await page.evaluate(() => localStorage.getItem("njamkoPlusUnlocked"));
  432 |     expect(unlocked).toBe("true");
  433 | 
  434 |     await expect(page.getByTestId("level-select")).toBeVisible({ timeout: 5000 });
  435 |     await expect(page.getByTestId("level-card-2")).toContainText("Otključano");
  436 |   });
  437 | 
  438 |   test("9. otključani level se može igrati", async ({ page }) => {
  439 |     await page.addInitScript(() => {
  440 |       localStorage.setItem("njamkoPlusUnlocked", "true");
  441 |     });
  442 |     await openFoodLevelSelect(page);
  443 |     await page.getByTestId("level-card-2").click();
  444 |     await expect(page.getByTestId("game-screen")).toBeVisible();
  445 |     await expect(page.getByTestId("game-progress")).toHaveText("1/10");
  446 |   });
  447 | 
  448 |   test("9b. baby level 5 koristi mobile answer row layout", async ({ page }) => {
  449 |     await page.setViewportSize({ width: 390, height: 844 });
  450 |     await page.addInitScript(() => {
  451 |       localStorage.setItem("njamkoPlusUnlocked", "true");
  452 |     });
  453 |     await openModeSelect(page);
  454 |     await page.getByTestId("mode-baby").click();
> 455 |     await page.getByTestId("level-card-5").click();
      |                                            ^ Error: locator.click: Test timeout of 30000ms exceeded.
  456 | 
  457 |     const game = page.getByTestId("game-screen");
  458 |     await expect(game).toBeVisible();
  459 |     await expect(game).toHaveClass(/nj-game--mobile-answer-row/);
  460 |     await expect(page.getByTestId("round-prompt")).toHaveText("Pronađi mamu!");
  461 |     const mobileBg = await page.getByTestId("njamko-page").evaluate((element) =>
  462 |       getComputedStyle(element).getPropertyValue("--nj-mobile-round-bg-image"),
  463 |     );
  464 |     expect(mobileBg).toContain("baby-l5-r01-penguin-chick-mobile.webp");
  465 |     await assertNoHorizontalScroll(page);
  466 |   });
  467 | 
  468 |   test("10. finish screen nakon 10 rundi", async ({ page }) => {
  469 |     test.setTimeout(120_000);
  470 |     await openFoodLevelSelect(page);
  471 |     await page.getByTestId("level-card-1").click();
  472 |     await completeLevel(page, "food", 1);
  473 |     await expect(page.getByTestId("finish-screen")).toBeVisible({ timeout: 10_000 });
  474 |     await expect(page.getByText("Završio si igru!")).toBeVisible();
  475 |     await expect(page.getByText("10/10 rundi")).toBeVisible();
  476 |   });
  477 | 
  478 |   test("11. sound level", async ({ page }) => {
  479 |     await openModeSelect(page);
  480 |     await page.getByTestId("mode-sound").click();
  481 |     await page.getByTestId("level-card-1").click();
  482 |     await expect(page.getByTestId("game-screen")).toBeVisible();
  483 |     await expect(page.locator('[data-sound-autoplay-ready="true"]')).toBeVisible({
  484 |       timeout: 3000,
  485 |     });
  486 |     const round = getLevel("sound", 1).rounds[0];
  487 |     await expect(page.getByTestId("sound-text")).toHaveText(round.soundText);
  488 |     await page.getByTestId("sound-button").click();
  489 |   });
  490 | 
  491 |   test("12. mobile layout 390x844", async ({ page }) => {
  492 |     await page.setViewportSize({ width: 390, height: 844 });
  493 |     await openFoodLevelSelect(page);
  494 |     await assertNoHorizontalScroll(page);
  495 |     for (let i = 1; i <= 5; i += 1) {
  496 |       await expect(page.getByTestId(`level-card-${i}`)).toBeVisible();
  497 |     }
  498 |   });
  499 | 
  500 |   test("12b. food razine koriste mobile container background u app shellu", async ({ page }) => {
  501 |     await page.setViewportSize({ width: 390, height: 844 });
  502 |     await openFoodLevelSelect(page);
  503 | 
  504 |     for (let i = 1; i <= 5; i += 1) {
  505 |       const backgroundImage = await page
  506 |         .getByTestId(`level-card-${i}`)
  507 |         .evaluate((element) => getComputedStyle(element, "::before").backgroundImage);
  508 |       expect(backgroundImage).toContain(`food-level-${i}-container-mobile.webp`);
  509 |     }
  510 | 
  511 |     await page.setViewportSize({ width: 1440, height: 900 });
  512 |     await openFoodLevelSelect(page);
  513 |     const desktopBackgroundImage = await page
  514 |       .getByTestId("level-card-1")
  515 |       .evaluate((element) => getComputedStyle(element, "::before").backgroundImage);
  516 |     expect(desktopBackgroundImage).toContain("food-level-1-container-mobile.webp");
  517 |   });
  518 | 
  519 |   test("12c. home razine koriste mobile container background u app shellu", async ({ page }) => {
  520 |     await page.setViewportSize({ width: 390, height: 844 });
  521 |     await openHomeLevelSelect(page);
  522 | 
  523 |     for (let i = 1; i <= 5; i += 1) {
  524 |       const backgroundImage = await page
  525 |         .getByTestId(`level-card-${i}`)
  526 |         .evaluate((element) => getComputedStyle(element, "::before").backgroundImage);
  527 |       expect(backgroundImage).toContain(`home-level-${i}-container-mobile.webp`);
  528 |     }
  529 | 
  530 |     await page.setViewportSize({ width: 1440, height: 900 });
  531 |     await openHomeLevelSelect(page);
  532 |     const desktopBackgroundImage = await page
  533 |       .getByTestId("level-card-1")
  534 |       .evaluate((element) => getComputedStyle(element, "::before").backgroundImage);
  535 |     expect(desktopBackgroundImage).toContain("home-level-1-container-mobile.webp");
  536 |   });
  537 | 
  538 |   test("12d. sound razine koriste mobile container background u app shellu", async ({ page }) => {
  539 |     await page.setViewportSize({ width: 390, height: 844 });
  540 |     await openSoundLevelSelect(page);
  541 | 
  542 |     for (let i = 1; i <= 5; i += 1) {
  543 |       const backgroundImage = await page
  544 |         .getByTestId(`level-card-${i}`)
  545 |         .evaluate((element) => getComputedStyle(element, "::before").backgroundImage);
  546 |       expect(backgroundImage).toContain(`sound-level-${i}-container-mobile.webp`);
  547 |     }
  548 | 
  549 |     await page.setViewportSize({ width: 1440, height: 900 });
  550 |     await openSoundLevelSelect(page);
  551 |     const desktopBackgroundImage = await page
  552 |       .getByTestId("level-card-1")
  553 |       .evaluate((element) => getComputedStyle(element, "::before").backgroundImage);
  554 |     expect(desktopBackgroundImage).toContain("sound-level-1-container-mobile.webp");
  555 |   });
```