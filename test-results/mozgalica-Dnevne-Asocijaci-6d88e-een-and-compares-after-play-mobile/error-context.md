# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mozgalica.spec.js >> Dnevne Asocijacije /mozgalica >> incoming challenge link opens accept screen and compares after play
- Location: e2e\mozgalica.spec.js:153:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('accept-challenge')
    - locator resolved to <button type="button" data-testid="accept-challenge" class="mozgalica-btn mozgalica-btn--primary">Prihvati izazov</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <h2 id="consent-title">Vi birate analitiku</h2> from <aside role="dialog" aria-modal="false" class="consent-panel" data-testid="consent-panel" aria-labelledby="consent-title" aria-describedby="consent-description">…</aside> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <h2 id="consent-title">Vi birate analitiku</h2> from <aside role="dialog" aria-modal="false" class="consent-panel" data-testid="consent-panel" aria-labelledby="consent-title" aria-describedby="consent-description">…</aside> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    53 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <h2 id="consent-title">Vi birate analitiku</h2> from <aside role="dialog" aria-modal="false" class="consent-panel" data-testid="consent-panel" aria-labelledby="consent-title" aria-describedby="consent-description">…</aside> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e11]: "?"
    - generic [ref=e12]:
      - generic [ref=e13]: 💄
      - heading "Ivan te izaziva!" [level=2] [ref=e14]
      - paragraph [ref=e15]:
        - text: "Tema:"
        - strong [ref=e16]: Beauty 40+
        - text: . Riješi istu mozgalicu i saznaj možeš li pobijediti njegov rezultat.
      - generic [ref=e17]:
        - generic [ref=e18]: Rezultat izazivača · Ivan
        - generic [ref=e19]: 4/4 grupe · 7 pokušaja · 02:31
      - generic [ref=e20]:
        - button "Prihvati izazov" [ref=e21] [cursor=pointer]
        - button "Ne sada" [ref=e22] [cursor=pointer]
  - dialog "Vi birate analitiku" [ref=e23]:
    - generic [ref=e24]:
      - img [ref=e26]
      - generic [ref=e29]:
        - heading "Vi birate analitiku" [level=2] [ref=e30]
        - paragraph [ref=e31]: Nužne postavke održavaju stranicu funkcionalnom. Uz vaše dopuštenje koristimo GA4 i vlastitu analitiku kako bismo razumjeli koje stranice i upiti stvarno pomažu.
    - generic [ref=e32]:
      - button "Prihvati analitiku" [ref=e33] [cursor=pointer]
      - button "Odbij analitiku" [ref=e34] [cursor=pointer]
      - link "Politika privatnosti" [ref=e35] [cursor=pointer]:
        - /url: /privatnost
```

# Test source

```ts
  66  |     await expect(page.getByTestId("puzzle-card-digital-2020s")).toBeVisible();
  67  |     await expect(page.getByTestId("puzzle-card-digital-2010s")).toBeVisible();
  68  |     await expect(page.getByTestId("puzzle-card-gaming-2k")).toBeVisible();
  69  |     await expect(page.getByTestId("puzzle-card-nogomet-hr-2000s")).toBeVisible();
  70  |     await expect(page.getByTestId("puzzle-card-muzika-2000s")).toBeVisible();
  71  |     await expect(page.getByTestId("puzzle-card-nba-2000s")).toBeVisible();
  72  |     await expect(page.getByTestId("puzzle-card-hr-filmovi-2000s")).toBeVisible();
  73  |     await expect(page.getByTestId("puzzle-card-gaming-90s")).toBeVisible();
  74  |     await expect(page.getByTestId("puzzle-card-nogomet-hr-90s")).toBeVisible();
  75  |     await expect(page.getByTestId("puzzle-card-muzika-90s")).toBeVisible();
  76  |     await expect(page.getByTestId("puzzle-card-nba-90s")).toBeVisible();
  77  |     await expect(page.getByTestId("puzzle-card-hr-nostalgija")).toBeVisible();
  78  |     await expect(page.locator(".mz-puzzle-card")).toHaveCount(20);
  79  |   });
  80  | 
  81  |   test("start game shows 16 cards", async ({ page }) => {
  82  |     await startGame(page);
  83  |     await expect(page.getByTestId("game-grid").locator(".mz-card")).toHaveCount(16);
  84  |   });
  85  | 
  86  |   test("can select 4 cards", async ({ page }) => {
  87  |     await startGame(page);
  88  |     const group = TEST_PUZZLE.groups[0].items;
  89  |     for (const item of group) {
  90  |       await page.getByTestId(`game-card-${item}`).click();
  91  |     }
  92  |     await expect(page.getByTestId("check-selection")).toBeEnabled();
  93  |   });
  94  | 
  95  |   test("correct group is locked", async ({ page }) => {
  96  |     await startGame(page);
  97  |     await selectGroup(page, TEST_PUZZLE.groups[0].items);
  98  |     await expect(page.getByTestId("game-message")).toContainText(
  99  |       "Točno! Pronašao si grupu.",
  100 |     );
  101 |     await expect(page.getByTestId("solved-group")).toBeVisible();
  102 |     await expect(page.getByTestId("stat-groups")).toContainText("1/4");
  103 |   });
  104 | 
  105 |   test("wrong group shows error message", async ({ page }) => {
  106 |     await startGame(page);
  107 |     const wrongItems = [
  108 |       TEST_PUZZLE.groups[0].items[0],
  109 |       TEST_PUZZLE.groups[1].items[0],
  110 |       TEST_PUZZLE.groups[2].items[0],
  111 |       TEST_PUZZLE.groups[3].items[0],
  112 |     ];
  113 |     await selectGroup(page, wrongItems);
  114 |     await expect(page.getByTestId("game-message")).toContainText(
  115 |       "Nije točno, pokušaj ponovno.",
  116 |     );
  117 |     await expect(page.getByTestId("stat-attempts")).toContainText("1");
  118 |   });
  119 | 
  120 |   test("completing all groups shows result", async ({ page }) => {
  121 |     await startGame(page);
  122 |     await solveAllGroups(page);
  123 |     await expect(page.getByTestId("game-board")).toBeVisible({ timeout: 5000 });
  124 |     await expect(page.getByTestId("game-all-solutions")).toBeVisible();
  125 |     await expect(page.getByTestId("result-panel")).toBeVisible();
  126 |     await expect(page.getByTestId("solved-group")).toHaveCount(4);
  127 |     await expect(page.getByText("Bravo!")).toBeVisible();
  128 |     await expect(page.getByTestId("result-groups")).toContainText("4/4");
  129 |   });
  130 | 
  131 |   test("landing challenge demo opens invite screen with link", async ({ page }) => {
  132 |     await page.goto("/mozgalica");
  133 |     await page.getByTestId("landing-challenge-demo").click();
  134 |     await expect(page.getByTestId("challenge-invite")).toBeVisible();
  135 |     await expect(page.getByTestId("challenge-link")).toHaveValue(/\/mozgalica\?od=/);
  136 |     await expect(page.getByText("Izazovi prijatelja")).toBeVisible();
  137 |   });
  138 | 
  139 |   test("challenge friends after win shows shareable link", async ({ page }) => {
  140 |     await startGame(page);
  141 |     await solveAllGroups(page);
  142 |     await expect(page.getByTestId("result-panel")).toBeVisible({ timeout: 5000 });
  143 |     await page.getByTestId("challenge-friends").click();
  144 |     await expect(page.getByTestId("challenge-invite")).toBeVisible();
  145 |     await expect(page.getByTestId("challenge-link")).toHaveValue(/\/mozgalica\?od=/);
  146 |     await expect(page.getByTestId("challenge-link")).toHaveValue(/tema=/);
  147 | 
  148 |     const shareText = await page.getByTestId("challenge-share-text-hidden").inputValue();
  149 |     const linkMatches = shareText.match(/\/mozgalica\?od=[^\s]+/g) ?? [];
  150 |     expect(linkMatches).toHaveLength(1);
  151 |   });
  152 | 
  153 |   test("incoming challenge link opens accept screen and compares after play", async ({
  154 |     page,
  155 |   }) => {
  156 |     await page.goto(
  157 |       `/mozgalica?od=Ivan&p=7&t=151&tema=${TEST_PUZZLE_ID}`,
  158 |     );
  159 |     await expect(page.getByTestId("challenge-accept")).toBeVisible();
  160 |     await expect(page.getByText("Ivan te izaziva!")).toBeVisible();
  161 |     await expect(page.getByText(TEST_PUZZLE.title)).toBeVisible();
  162 | 
  163 |     await page.evaluate((items) => {
  164 |       sessionStorage.setItem("mozgalica-test-order", JSON.stringify(items));
  165 |     }, getMockupItems(TEST_PUZZLE_ID));
> 166 |     await page.getByTestId("accept-challenge").click();
      |                                                ^ Error: locator.click: Test timeout of 30000ms exceeded.
  167 |     await expect(page.getByTestId("game-board")).toBeVisible();
  168 |     await solveAllGroups(page);
  169 | 
  170 |     await expect(page.getByTestId("challenge-result")).toBeVisible({ timeout: 5000 });
  171 |     await expect(page.getByTestId("challenge-winner")).toBeVisible();
  172 |     await expect(page.getByTestId("notify-challenger")).toBeVisible();
  173 |     await expect(page.getByTestId("challenge-notify-hint")).toBeVisible();
  174 |   });
  175 | 
  176 |   test("result link shows comparison for challenger without playing", async ({
  177 |     page,
  178 |   }) => {
  179 |     await page.goto(
  180 |       `/mozgalica?od=Wepar&p=1&t=42&tema=${TEST_PUZZLE_ID}&rn=Marko&rp=3&rt=78`,
  181 |     );
  182 |     await expect(page.getByTestId("challenge-result")).toBeVisible();
  183 |     await expect(page.getByText("Marko je odigrao izazov")).toBeVisible();
  184 |     await expect(page.getByTestId("challenge-winner")).toBeVisible();
  185 |     await expect(page.getByTestId("notify-challenger")).toHaveCount(0);
  186 |     await expect(page.getByTestId("challenge-done")).toBeVisible();
  187 |   });
  188 | 
  189 |   test("nav Izazovi prijatelja scrolls to challenge section", async ({ page, isMobile }) => {
  190 |     await page.goto("/mozgalica");
  191 |     if (isMobile) {
  192 |       await page.getByRole("button", { name: "Otvori izbornik" }).click();
  193 |       await page.locator(".mz-mobile-nav").getByRole("button", { name: "Izazovi prijatelja" }).click();
  194 |     } else {
  195 |       await page.locator(".mz-nav").getByRole("button", { name: "Izazovi prijatelja" }).click();
  196 |     }
  197 |     await expect(page.getByTestId("landing-challenge-demo")).toBeVisible();
  198 |   });
  199 | 
  200 |   test("start-game scrolls to puzzle picker", async ({ page }) => {
  201 |     await page.goto("/mozgalica");
  202 |     await page.getByTestId("start-game").click();
  203 |     await expect(page.getByTestId("puzzle-picker")).toBeInViewport();
  204 |   });
  205 | 
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
```