# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: njamko.spec.js >> Njamko platform >> 2e2. kampanja prikazuje beacone za razine 2 do 5
- Location: e2e\njamko.spec.js:322:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('campaign-choose-mode-button')
    - locator resolved to <button type="button" data-testid="campaign-choose-mode-button" class="nj-btn nj-btn--secondary nj-campaign-map__small-action">Odaberi igru</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
    - waiting 20ms
    - waiting for element to be visible, enabled and stable
    - element is not stable
  2 × retrying click action
      - waiting 100ms
      - waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <a href="/privatnost" data-discover="true" class="consent-policy-link">Politika privatnosti</a> from <aside role="dialog" aria-modal="false" class="consent-panel" data-testid="consent-panel" aria-labelledby="consent-title" aria-describedby="consent-description">…</aside> subtree intercepts pointer events
  47 × retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <a href="/privatnost" data-discover="true" class="consent-policy-link">Politika privatnosti</a> from <aside role="dialog" aria-modal="false" class="consent-panel" data-testid="consent-panel" aria-labelledby="consent-title" aria-describedby="consent-description">…</aside> subtree intercepts pointer events
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
      - generic [ref=e6]:
        - paragraph [ref=e7]: Razina 2 kampanje
        - heading "Odaberi stajalište" [level=1] [ref=e8]
        - paragraph [ref=e9]: Prati Njamka kroz četiri igre razine 2.
      - generic "Karta Njamko kampanje" [ref=e10]:
        - generic "Stajališta razine 2" [ref=e11]:
          - button "Nahrani životinju" [ref=e12] [cursor=pointer]:
            - generic [ref=e14]: Nahrani životinju
          - button "Pronađi dom" [disabled] [ref=e15]:
            - generic [ref=e17]: Pronađi dom
          - button "Pogodi zvuk" [disabled] [ref=e18]:
            - generic [ref=e20]: Pogodi zvuk
          - button "Mama i beba" [disabled] [ref=e21]:
            - generic [ref=e23]: Mama i beba
      - generic [ref=e25]:
        - button "Resetiraj kampanju" [ref=e26] [cursor=pointer]
        - button "Odaberi igru" [ref=e27] [cursor=pointer]
  - dialog "Vi birate analitiku" [ref=e28]:
    - generic [ref=e29]:
      - img [ref=e31]
      - generic [ref=e34]:
        - heading "Vi birate analitiku" [level=2] [ref=e35]
        - paragraph [ref=e36]: Nužne postavke održavaju stranicu funkcionalnom. Uz vaše dopuštenje koristimo GA4 i vlastitu analitiku kako bismo razumjeli koje stranice i upiti stvarno pomažu.
    - generic [ref=e37]:
      - button "Prihvati analitiku" [ref=e38] [cursor=pointer]
      - button "Odbij analitiku" [ref=e39] [cursor=pointer]
      - link "Politika privatnosti" [ref=e40] [cursor=pointer]:
        - /url: /privatnost
```

# Test source

```ts
  238 |     await expect(page.getByTestId("campaign-stop-food")).toHaveClass(/nj-campaign-stop--active/);
  239 |     await expect(page.getByTestId("campaign-replay-step-button")).toBeDisabled();
  240 |     await launchCampaignStop(page, "campaign-stop-food");
  241 |     await expect(page.getByTestId("game-screen")).toBeVisible();
  242 |     await expect(page.getByText("Nahrani životinju")).toBeVisible();
  243 |     await completeLevel(page, "food", 1);
  244 | 
  245 |     await expect(page.getByTestId("campaign-map-screen")).toBeVisible({ timeout: 10_000 });
  246 |     await expect(page.getByTestId("campaign-stop-food")).toHaveClass(/nj-campaign-stop--completed/);
  247 |     await expect(page.getByTestId("campaign-stop-home")).toHaveClass(/nj-campaign-stop--active/);
  248 |     await assertNoHorizontalScroll(page);
  249 |     const completedStep = await page.evaluate(() =>
  250 |       localStorage.getItem("njamkoCampaignCompletedStep"),
  251 |     );
  252 |     expect(completedStep).toBe("0");
  253 | 
  254 |     const overlap = await page.evaluate(() => {
  255 |       const car = document.querySelector(".nj-campaign-car").getBoundingClientRect();
  256 |       const actions = document
  257 |         .querySelector(".nj-campaign-map__actions")
  258 |         .getBoundingClientRect();
  259 |       return !(
  260 |         car.right < actions.left ||
  261 |         car.left > actions.right ||
  262 |         car.bottom < actions.top ||
  263 |         car.top > actions.bottom
  264 |       );
  265 |     });
  266 |     expect(overlap).toBe(false);
  267 | 
  268 |     await launchCampaignStop(page, "campaign-stop-home");
  269 |     await expect(page.getByTestId("game-screen")).toBeVisible();
  270 |     await expect(page.getByText("Pronađi dom")).toBeVisible();
  271 |   });
  272 | 
  273 |   test("2d. kampanja nakon refresha nastavlja na prvi nezavršeni step", async ({ page }) => {
  274 |     test.setTimeout(120_000);
  275 |     await openModeSelect(page);
  276 |     await page.getByTestId("campaign-button").click();
  277 |     await launchCampaignStop(page, "campaign-stop-food");
  278 |     await completeLevel(page, "food", 1);
  279 |     await expect(page.getByTestId("campaign-map-screen")).toBeVisible({ timeout: 10_000 });
  280 | 
  281 |     await page.reload();
  282 |     await expect(page.getByTestId("mode-select")).toBeVisible();
  283 |     await page.getByTestId("campaign-button").click();
  284 |     await expect(page.getByTestId("campaign-map-screen")).toBeVisible();
  285 |     await expect(page.getByTestId("campaign-stop-home")).toHaveClass(/nj-campaign-stop--active/);
  286 |   });
  287 | 
  288 |   test("2e. kampanja trazi Plus na food level 2 i nastavlja isti step nakon unlocka", async ({ page }) => {
  289 |     test.setTimeout(240_000);
  290 |     await openModeSelect(page);
  291 |     await page.getByTestId("campaign-button").click();
  292 | 
  293 |     await launchCampaignStop(page, "campaign-stop-food");
  294 |     await completeLevel(page, "food", 1);
  295 |     await expect(page.getByTestId("campaign-map-screen")).toBeVisible({ timeout: 10_000 });
  296 |     await launchCampaignStop(page, "campaign-stop-home");
  297 |     await completeLevel(page, "home", 1);
  298 |     await expect(page.getByTestId("campaign-map-screen")).toBeVisible({ timeout: 10_000 });
  299 |     await launchCampaignStop(page, "campaign-stop-sound");
  300 |     await completeLevel(page, "sound", 1);
  301 |     await expect(page.getByTestId("campaign-map-screen")).toBeVisible({ timeout: 10_000 });
  302 |     await launchCampaignStop(page, "campaign-stop-baby");
  303 |     await completeLevel(page, "baby", 1);
  304 |     await expect(page.getByTestId("campaign-map-screen")).toBeVisible({ timeout: 10_000 });
  305 |     await expect(page.getByText("Razina 2 kampanje")).toBeVisible();
  306 |     await expect(page.getByTestId("campaign-stop-food")).toHaveClass(/nj-campaign-stop--active/);
  307 | 
  308 |     await page.getByTestId("campaign-stop-food").click();
  309 |     await expect(page.getByTestId("campaign-game-popup")).toBeVisible();
  310 |     await page.getByTestId("campaign-launch-step-button").click();
  311 |     await expect(page.getByTestId("parental-gate")).toBeVisible();
  312 |     await page.getByTestId("parental-answer-input").fill("12");
  313 |     await page.getByTestId("parental-submit-button").click();
  314 |     await expect(page.getByTestId("plus-screen")).toBeVisible();
  315 |     await page.getByTestId("plus-unlock-button").click();
  316 | 
  317 |     await expect(page.getByTestId("game-screen")).toBeVisible({ timeout: 5000 });
  318 |     await expect(page.getByText("Nahrani životinju")).toBeVisible();
  319 |     await expect(page.getByTestId("round-prompt")).toHaveText(getLevel("food", 2).rounds[0].prompt);
  320 |   });
  321 | 
  322 |   test("2e2. kampanja prikazuje beacone za razine 2 do 5", async ({ page }) => {
  323 |     for (const { completedStep, level } of [
  324 |       { completedStep: 3, level: 2 },
  325 |       { completedStep: 7, level: 3 },
  326 |       { completedStep: 11, level: 4 },
  327 |       { completedStep: 15, level: 5 },
  328 |     ]) {
  329 |       await openModeSelect(page);
  330 |       await page.evaluate((step) => {
  331 |         localStorage.setItem("njamkoCampaignCompletedStep", String(step));
  332 |       }, completedStep);
  333 |       await page.getByTestId("campaign-button").click();
  334 |       await expect(page.getByTestId("campaign-map-screen")).toBeVisible();
  335 |       await expect(page.getByText(`Razina ${level} kampanje`)).toBeVisible();
  336 |       await expect(page.getByTestId("campaign-stop-food")).toHaveClass(/nj-campaign-stop--active/);
  337 |       await expect(page.getByTestId("campaign-stop-home")).toHaveClass(/nj-campaign-stop--future/);
> 338 |       await page.getByTestId("campaign-choose-mode-button").click();
      |                                                             ^ Error: locator.click: Test timeout of 30000ms exceeded.
  339 |     }
  340 |   });
  341 | 
  342 |   test("2f. reset kampanje trazi potvrdu i brise progress", async ({ page }) => {
  343 |     test.setTimeout(120_000);
  344 |     await openModeSelect(page);
  345 |     await page.getByTestId("campaign-button").click();
  346 |     await launchCampaignStop(page, "campaign-stop-food");
  347 |     await completeLevel(page, "food", 1);
  348 |     await expect(page.getByTestId("campaign-map-screen")).toBeVisible({ timeout: 10_000 });
  349 | 
  350 |     await page.getByTestId("campaign-replay-step-button").click();
  351 |     await expect(page.getByTestId("campaign-reset-confirm")).toBeVisible();
  352 |     await page.getByTestId("campaign-reset-confirm-button").click();
  353 | 
  354 |     await expect(page.getByTestId("campaign-map-screen")).toBeVisible();
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
```