# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mozgalica.spec.js >> Dnevne Asocijacije /mozgalica >> landing page loads with hero title
- Location: e2e\mozgalica.spec.js:44:3

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: getByTestId('hero-title')
Expected substring: "Poveži 16 pojmova u 4 skrivene grupe."
Received string:    "Mozgalica za žene 40+."
Timeout: 5000ms

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for getByTestId('hero-title')
    14 × locator resolved to <h1 class="mz-hero__title" data-testid="hero-title">Mozgalica za žene 40+.</h1>
       - unexpected value "Mozgalica za žene 40+."

```

```yaml
- heading "Mozgalica za žene 40+." [level=1]
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
  22  |     await page.getByTestId(`game-card-${item}`).click();
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
> 48  |     await expect(page.getByTestId("hero-title")).toContainText(
      |                                                  ^ Error: expect(locator).toContainText(expected) failed
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
```