# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mozgalica.spec.js >> Dnevne Asocijacije /mozgalica >> correct group is locked
- Location: e2e\mozgalica.spec.js:95:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('game-card-Puder')
    - locator resolved to <button type="button" class="mz-card" aria-label="Puder" aria-pressed="false" data-testid="game-card-Puder">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <svg width="22" height="22" fill="none" stroke-width="2" aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" class="lucide lucide-shield-check">…</svg> from <aside role="dialog" aria-modal="false" class="consent-panel" data-testid="consent-panel" aria-labelledby="consent-title" aria-describedby="consent-description">…</aside> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <svg width="22" height="22" fill="none" stroke-width="2" aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" class="lucide lucide-shield-check">…</svg> from <aside role="dialog" aria-modal="false" class="consent-panel" data-testid="consent-panel" aria-labelledby="consent-title" aria-describedby="consent-description">…</aside> subtree intercepts pointer events
  - retrying click action
    - waiting 100ms
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - <aside role="dialog" aria-modal="false" class="consent-panel" data-testid="consent-panel" aria-labelledby="consent-title" aria-describedby="consent-description">…</aside> intercepts pointer events
  - retrying click action
    - waiting 100ms
    3 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <svg width="22" height="22" fill="none" stroke-width="2" aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" class="lucide lucide-shield-check">…</svg> from <aside role="dialog" aria-modal="false" class="consent-panel" data-testid="consent-panel" aria-labelledby="consent-title" aria-describedby="consent-description">…</aside> subtree intercepts pointer events
    - retrying click action
      - waiting 500ms
    11 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <aside role="dialog" aria-modal="false" class="consent-panel" data-testid="consent-panel" aria-labelledby="consent-title" aria-describedby="consent-description">…</aside> intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <aside role="dialog" aria-modal="false" class="consent-panel" data-testid="consent-panel" aria-labelledby="consent-title" aria-describedby="consent-description">…</aside> intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <aside role="dialog" aria-modal="false" class="consent-panel" data-testid="consent-panel" aria-labelledby="consent-title" aria-describedby="consent-description">…</aside> intercepts pointer events
     - retrying click action
       - waiting 500ms
       - waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <svg width="22" height="22" fill="none" stroke-width="2" aria-hidden="true" viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg" class="lucide lucide-shield-check">…</svg> from <aside role="dialog" aria-modal="false" class="consent-panel" data-testid="consent-panel" aria-labelledby="consent-title" aria-describedby="consent-description">…</aside> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
    3 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <aside role="dialog" aria-modal="false" class="consent-panel" data-testid="consent-panel" aria-labelledby="consent-title" aria-describedby="consent-description">…</aside> intercepts pointer events
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
      - generic [ref=e13]:
        - button "Natrag na početnu" [ref=e14] [cursor=pointer]: ← Natrag
        - paragraph [ref=e15]: Beauty 40+
      - 'progressbar "Riješene grupe: 0 od 4" [ref=e16]'
      - generic [ref=e17]:
        - generic [ref=e18]:
          - generic [ref=e19]:
            - generic [ref=e20]: Pokušaji
            - strong [ref=e21]: "0"
          - generic [ref=e22]:
            - generic [ref=e23]: Vrijeme
            - strong [ref=e24]: 00:26
          - generic [ref=e25]:
            - generic [ref=e26]: Grupe
            - strong [ref=e27]: 0/4
        - paragraph [ref=e28]:
          - text: "Odabrano:"
          - strong [ref=e29]: 1/4
      - generic [ref=e30]:
        - button "Primer" [active] [pressed] [ref=e31] [cursor=pointer]:
          - generic [ref=e32]: Primer
          - generic [ref=e33]: ✓
        - button "Maskara" [ref=e34] [cursor=pointer]:
          - generic [ref=e35]: Maskara
        - button "Retinol" [ref=e36] [cursor=pointer]:
          - generic [ref=e37]: Retinol
        - button "Ruž" [ref=e38] [cursor=pointer]:
          - generic [ref=e39]: Ruž
        - button "Puder" [ref=e40] [cursor=pointer]:
          - generic [ref=e41]: Puder
        - button "Sjenilo" [ref=e42] [cursor=pointer]:
          - generic [ref=e43]: Sjenilo
        - button "Hijaluron" [ref=e44] [cursor=pointer]:
          - generic [ref=e45]: Hijaluron
        - button "Parfem" [ref=e46] [cursor=pointer]:
          - generic [ref=e47]: Parfem
        - button "Korektor" [ref=e48] [cursor=pointer]:
          - generic [ref=e49]: Korektor
        - button "Olovka" [ref=e50] [cursor=pointer]:
          - generic [ref=e51]: Olovka
        - button "SPF" [ref=e52] [cursor=pointer]:
          - generic [ref=e53]: SPF
        - button "Maramice" [ref=e54] [cursor=pointer]:
          - generic [ref=e55]: Maramice
        - button "Fiksator" [ref=e56] [cursor=pointer]:
          - generic [ref=e57]: Fiksator
        - button "Gel za obrve" [ref=e58] [cursor=pointer]:
          - generic [ref=e59]: Gel za obrve
        - button "Serum" [ref=e60] [cursor=pointer]:
          - generic [ref=e61]: Serum
        - button "Puder u kamenu" [ref=e62] [cursor=pointer]:
          - generic [ref=e63]: Puder u kamenu
      - generic [ref=e64]:
        - button "Provjeri odabir" [disabled] [ref=e65]
        - generic [ref=e66]:
          - button "Poništi" [ref=e67] [cursor=pointer]
          - button "Promiješaj" [ref=e68] [cursor=pointer]
  - dialog "Vi birate analitiku" [ref=e69]:
    - generic [ref=e70]:
      - img [ref=e72]
      - generic [ref=e75]:
        - heading "Vi birate analitiku" [level=2] [ref=e76]
        - paragraph [ref=e77]: Nužne postavke održavaju stranicu funkcionalnom. Uz vaše dopuštenje koristimo GA4 i vlastitu analitiku kako bismo razumjeli koje stranice i upiti stvarno pomažu.
    - generic [ref=e78]:
      - button "Prihvati analitiku" [ref=e79] [cursor=pointer]
      - button "Odbij analitiku" [ref=e80] [cursor=pointer]
      - link "Politika privatnosti" [ref=e81] [cursor=pointer]:
        - /url: /privatnost
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | import {
  3   |   DEFAULT_PUZZLE_ID,
  4   |   getMockupItems,
  5   |   getPuzzleById,
  6   | } from "../src/mozgalica/puzzle.js";
  7   | 
  8   | const TEST_PUZZLE_ID = DEFAULT_PUZZLE_ID;
  9   | const TEST_PUZZLE = getPuzzleById(TEST_PUZZLE_ID);
  10  | 
  11  | async function startGame(page, puzzleId = TEST_PUZZLE_ID) {
  12  |   await page.goto("/mozgalica");
  13  |   await page.evaluate((items) => {
  14  |     sessionStorage.setItem("mozgalica-test-order", JSON.stringify(items));
  15  |   }, getMockupItems(puzzleId));
  16  |   await page.getByTestId(`puzzle-card-${puzzleId}`).click();
  17  |   await expect(page.getByTestId("game-board")).toBeVisible();
  18  | }
  19  | 
  20  | async function selectGroup(page, items) {
  21  |   for (const item of items) {
> 22  |     await page.getByTestId(`game-card-${item}`).click();
      |                                                 ^ Error: locator.click: Test timeout of 30000ms exceeded.
  23  |   }
  24  |   await page.getByTestId("check-selection").click();
  25  | }
  26  | 
  27  | async function solveAllGroups(page) {
  28  |   for (const group of TEST_PUZZLE.groups) {
  29  |     await selectGroup(page, group.items);
  30  |     await expect(page.getByText(group.name)).toBeVisible({ timeout: 5000 });
  31  |   }
  32  | }
  33  | 
  34  | async function prepareScreenshotPage(page) {
  35  |   await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
  36  |   await page.route("https://fonts.gstatic.com/**", (route) => route.abort());
  37  |   await page.addInitScript(() => {
  38  |     const fixedNow = new Date("2026-01-01T12:00:00Z").getTime();
  39  |     Date.now = () => fixedNow;
  40  |   });
  41  | }
  42  | 
  43  | test.describe("Dnevne Asocijacije /mozgalica", () => {
  44  |   test("landing page loads with hero title", async ({ page }) => {
  45  |     await page.goto("/mozgalica");
  46  |     await expect(page.getByTestId("mozgalica-page")).toBeVisible();
  47  |     await expect(page.getByTestId("hero-title")).toBeVisible();
  48  |     await expect(page.getByTestId("hero-title")).toContainText(
  49  |       "Poveži 16 pojmova u 4 skrivene grupe.",
  50  |     );
  51  |   });
  52  | 
  53  |   test("landing shows puzzle picker with all themes", async ({ page }) => {
  54  |     await page.goto("/mozgalica");
  55  |     await expect(page.getByTestId("puzzle-picker")).toBeVisible();
  56  |     const puzzleCardIds = await page.locator(".mz-puzzle-card").evaluateAll((cards) =>
  57  |       cards.map((card) => card.getAttribute("data-testid")),
  58  |     );
  59  |     expect(puzzleCardIds.slice(0, 5)).toEqual([
  60  |       "puzzle-card-digital-2020s",
  61  |       "puzzle-card-croatia-2020s",
  62  |       "puzzle-card-internet-2020s",
  63  |       "puzzle-card-world-2020s",
  64  |       "puzzle-card-tech-2020s",
  65  |     ]);
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
```