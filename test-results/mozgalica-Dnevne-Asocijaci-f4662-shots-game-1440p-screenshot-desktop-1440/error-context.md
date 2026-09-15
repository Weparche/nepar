# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mozgalica.spec.js >> Dnevne Asocijacije screenshots >> game 1440p screenshot
- Location: e2e\mozgalica.spec.js:302:3

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  53409 pixels (ratio 0.05 of all image pixels) are different.

  Snapshot: game-1440.png

Call log:
  - Expect "toHaveScreenshot(game-1440.png)" with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 53409 pixels (ratio 0.05 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 53409 pixels (ratio 0.05 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e11]: "?"
    - generic [ref=e12]:
      - generic [ref=e13]:
        - button "Natrag na početnu" [ref=e14] [cursor=pointer]: ← Natrag
        - paragraph [ref=e15]: Beauty 40+
      - 'progressbar "Riješene grupe: 0 od 4" [ref=e16]'
      - generic [ref=e18]:
        - generic [ref=e19]:
          - generic [ref=e20]: Pokušaji
          - strong [ref=e21]: "0"
        - generic [ref=e22]:
          - generic [ref=e23]: Vrijeme
          - strong [ref=e24]: 00:00
        - generic [ref=e25]:
          - generic [ref=e26]: Grupe
          - strong [ref=e27]: 0/4
      - generic [ref=e28]:
        - button "Primer" [ref=e29] [cursor=pointer]:
          - generic [ref=e30]: Primer
        - button "Maskara" [ref=e31] [cursor=pointer]:
          - generic [ref=e32]: Maskara
        - button "Retinol" [ref=e33] [cursor=pointer]:
          - generic [ref=e34]: Retinol
        - button "Ruž" [ref=e35] [cursor=pointer]:
          - generic [ref=e36]: Ruž
        - button "Puder" [ref=e37] [cursor=pointer]:
          - generic [ref=e38]: Puder
        - button "Sjenilo" [ref=e39] [cursor=pointer]:
          - generic [ref=e40]: Sjenilo
        - button "Hijaluron" [ref=e41] [cursor=pointer]:
          - generic [ref=e42]: Hijaluron
        - button "Parfem" [ref=e43] [cursor=pointer]:
          - generic [ref=e44]: Parfem
        - button "Korektor" [ref=e45] [cursor=pointer]:
          - generic [ref=e46]: Korektor
        - button "Olovka" [ref=e47] [cursor=pointer]:
          - generic [ref=e48]: Olovka
        - button "SPF" [ref=e49] [cursor=pointer]:
          - generic [ref=e50]: SPF
        - button "Maramice" [ref=e51] [cursor=pointer]:
          - generic [ref=e52]: Maramice
        - button "Fiksator" [ref=e53] [cursor=pointer]:
          - generic [ref=e54]: Fiksator
        - button "Gel za obrve" [ref=e55] [cursor=pointer]:
          - generic [ref=e56]: Gel za obrve
        - button "Serum" [ref=e57] [cursor=pointer]:
          - generic [ref=e58]: Serum
        - button "Puder u kamenu" [ref=e59] [cursor=pointer]:
          - generic [ref=e60]: Puder u kamenu
      - generic [ref=e61]:
        - button "Provjeri odabir" [disabled] [ref=e62]
        - generic [ref=e63]:
          - button "Poništi" [ref=e64] [cursor=pointer]
          - button "Promiješaj" [ref=e65] [cursor=pointer]
  - dialog "Vi birate analitiku" [ref=e66]:
    - generic [ref=e67]:
      - img [ref=e69]
      - generic [ref=e72]:
        - heading "Vi birate analitiku" [level=2] [ref=e73]
        - paragraph [ref=e74]: Nužne postavke održavaju stranicu funkcionalnom. Uz vaše dopuštenje koristimo GA4 i vlastitu analitiku kako bismo razumjeli koje stranice i upiti stvarno pomažu.
    - generic [ref=e75]:
      - button "Prihvati analitiku" [ref=e76] [cursor=pointer]
      - button "Odbij analitiku" [ref=e77] [cursor=pointer]
      - link "Politika privatnosti" [ref=e78] [cursor=pointer]:
        - /url: /privatnost
```

# Test source

```ts
  206 |   test("mobile viewport layout is intact", async ({ page, isMobile }) => {
  207 |     test.skip(!isMobile, "Mobile-only layout check");
  208 |     await page.goto("/mozgalica");
  209 |     await expect(page.getByTestId("landing-header")).toBeVisible();
  210 |     await expect(page.getByTestId("hero-title")).toBeVisible();
  211 |     await startGame(page);
  212 |     const box = await page.getByTestId("game-grid").boundingBox();
  213 |     expect(box?.width).toBeGreaterThan(0);
  214 |     await expect(page.getByTestId("check-selection")).toBeVisible();
  215 |   });
  216 | 
  217 |   test("1440p desktop layout uses wide content and readable game grid", async ({
  218 |     page,
  219 |   }) => {
  220 |     test.skip(test.info().project.name !== "desktop-1440", "1440p only");
  221 |     await page.goto("/mozgalica");
  222 | 
  223 |     const hero = await page.getByTestId("landing-hero").boundingBox();
  224 |     expect(hero?.width).toBeGreaterThan(1100);
  225 | 
  226 |     await startGame(page);
  227 |     const grid = await page.getByTestId("game-grid").boundingBox();
  228 |     expect(grid?.width).toBeGreaterThan(520);
  229 |     expect(grid?.width).toBeLessThan(720);
  230 | 
  231 |     const card = await page.getByTestId("game-grid").locator(".mz-card").first().boundingBox();
  232 |     expect(card?.height).toBeGreaterThanOrEqual(84);
  233 |   });
  234 | });
  235 | 
  236 | test.describe("Dnevne Asocijacije screenshots", () => {
  237 |   test.beforeEach(async ({ page }) => {
  238 |     await prepareScreenshotPage(page);
  239 |   });
  240 | 
  241 |   test("landing desktop screenshot", async ({ page, isMobile }) => {
  242 |     test.skip(isMobile, "Desktop-only screenshot");
  243 |     await page.goto("/mozgalica");
  244 |     await expect(page.getByTestId("hero-title")).toBeVisible();
  245 |     await page.waitForTimeout(500);
  246 |     await expect(page).toHaveScreenshot("landing-desktop.png", {
  247 |       fullPage: true,
  248 |     });
  249 |   });
  250 | 
  251 |   test("landing mobile screenshot", async ({ page, isMobile }) => {
  252 |     test.skip(!isMobile, "Mobile-only screenshot");
  253 |     await page.goto("/mozgalica");
  254 |     await expect(page.getByTestId("hero-title")).toBeVisible();
  255 |     await page.waitForTimeout(500);
  256 |     await expect(page).toHaveScreenshot("landing-mobile.png", {
  257 |       fullPage: true,
  258 |     });
  259 |   });
  260 | 
  261 |   test("game mobile screenshot", async ({ page, isMobile }) => {
  262 |     test.skip(!isMobile, "Mobile-only screenshot");
  263 |     await startGame(page);
  264 |     await page.waitForTimeout(500);
  265 |     await expect(page).toHaveScreenshot("game-mobile.png", {
  266 |       fullPage: true,
  267 |     });
  268 |   });
  269 | 
  270 |   test("result screenshot", async ({ page, isMobile }) => {
  271 |     await startGame(page);
  272 |     await solveAllGroups(page);
  273 |     await expect(page.getByTestId("result-panel")).toBeVisible({ timeout: 5000 });
  274 |     await page.waitForTimeout(500);
  275 |     await expect(page).toHaveScreenshot(
  276 |       isMobile ? "result-mobile.png" : "result-desktop.png",
  277 |       { fullPage: true },
  278 |     );
  279 |   });
  280 | 
  281 |   test("challenge invite screenshot", async ({ page, isMobile }) => {
  282 |     await startGame(page);
  283 |     await solveAllGroups(page);
  284 |     await expect(page.getByTestId("result-panel")).toBeVisible({ timeout: 5000 });
  285 |     await page.getByTestId("challenge-friends").click();
  286 |     await expect(page.getByTestId("challenge-invite")).toBeVisible();
  287 |     await page.waitForTimeout(500);
  288 |     await expect(page).toHaveScreenshot(
  289 |       isMobile ? "challenge-invite-mobile.png" : "challenge-invite-desktop.png",
  290 |       { fullPage: true },
  291 |     );
  292 |   });
  293 | 
  294 |   test("landing 1440p screenshot", async ({ page }) => {
  295 |     test.skip(test.info().project.name !== "desktop-1440", "1440p only");
  296 |     await page.goto("/mozgalica");
  297 |     await expect(page.getByTestId("hero-title")).toBeVisible();
  298 |     await page.waitForTimeout(500);
  299 |     await expect(page).toHaveScreenshot("landing-1440.png", { fullPage: true });
  300 |   });
  301 | 
  302 |   test("game 1440p screenshot", async ({ page }) => {
  303 |     test.skip(test.info().project.name !== "desktop-1440", "1440p only");
  304 |     await startGame(page);
  305 |     await page.waitForTimeout(500);
> 306 |     await expect(page).toHaveScreenshot("game-1440.png", { fullPage: true });
      |                        ^ Error: expect(page).toHaveScreenshot(expected) failed
  307 |   });
  308 | 
  309 |   test("result 1440p screenshot", async ({ page }) => {
  310 |     test.skip(test.info().project.name !== "desktop-1440", "1440p only");
  311 |     await startGame(page);
  312 |     await solveAllGroups(page);
  313 |     await expect(page.getByTestId("result-panel")).toBeVisible({ timeout: 5000 });
  314 |     await page.waitForTimeout(500);
  315 |     await expect(page).toHaveScreenshot("result-1440.png", { fullPage: true });
  316 |   });
  317 | });
  318 | 
```