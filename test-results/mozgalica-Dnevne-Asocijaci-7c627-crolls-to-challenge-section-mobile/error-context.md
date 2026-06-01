# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mozgalica.spec.js >> Dnevne Asocijacije /mozgalica >> nav Izazovi prijatelja scrolls to challenge section
- Location: e2e\mozgalica.spec.js:91:3

# Error details

```
Error: expect(locator).toBeInViewport() failed

Locator:  getByTestId('challenge-section')
Expected: in viewport
Received: viewport ratio 0
Timeout:  10000ms

Call log:
  - Expect "toBeInViewport" with timeout 10000ms
  - waiting for getByTestId('challenge-section')
    23 × locator resolved to <section id="izazovi" class="mz-section" data-testid="challenge-section">…</section>
       - unexpected value "viewport ratio 0"

```

```yaml
- heading "Izazovi prijatelja" [level=2]
- paragraph: Usporedi rezultate i saznaj tko je brži i precizniji.
- text: I Ivan 4/4 · 7 pokušaja · 02:31 vs M Marko 4/4 · 8 pokušaja · 03:14
- button "Pogledaj primjer izazova"
```

# Test source

```ts
  1   | import { test, expect } from "@playwright/test";
  2   | import { PUZZLE_GROUPS, MOCKUP_ITEMS } from "../src/mozgalica/puzzle.js";
  3   | 
  4   | async function startGame(page) {
  5   |   await page.goto("/mozgalica");
  6   |   await page.evaluate((items) => {
  7   |     sessionStorage.setItem("mozgalica-test-order", JSON.stringify(items));
  8   |   }, MOCKUP_ITEMS);
  9   |   await page.getByTestId("start-game").click();
  10  |   await expect(page.getByTestId("game-board")).toBeVisible();
  11  | }
  12  | 
  13  | async function selectGroup(page, items) {
  14  |   for (const item of items) {
  15  |     await page.getByTestId(`game-card-${item}`).click();
  16  |   }
  17  |   await page.getByTestId("check-selection").click();
  18  | }
  19  | 
  20  | async function solveAllGroups(page) {
  21  |   for (const group of PUZZLE_GROUPS) {
  22  |     await selectGroup(page, group.items);
  23  |     await expect(page.getByText(group.name)).toBeVisible({ timeout: 5000 });
  24  |   }
  25  | }
  26  | 
  27  | test.describe("Dnevne Asocijacije /mozgalica", () => {
  28  |   test("landing page loads with hero title", async ({ page }) => {
  29  |     await page.goto("/mozgalica");
  30  |     await expect(page.getByTestId("mozgalica-page")).toBeVisible();
  31  |     await expect(page.getByTestId("hero-title")).toBeVisible();
  32  |     await expect(page.getByTestId("hero-title")).toContainText(
  33  |       "Poveži 16 pojmova u 4 skrivene grupe.",
  34  |     );
  35  |   });
  36  | 
  37  |   test("start game shows 16 cards", async ({ page }) => {
  38  |     await startGame(page);
  39  |     await expect(page.getByTestId("game-grid").locator(".mz-card")).toHaveCount(16);
  40  |   });
  41  | 
  42  |   test("can select 4 cards", async ({ page }) => {
  43  |     await startGame(page);
  44  |     const group = PUZZLE_GROUPS[0].items;
  45  |     for (const item of group) {
  46  |       await page.getByTestId(`game-card-${item}`).click();
  47  |     }
  48  |     await expect(page.getByTestId("check-selection")).toBeEnabled();
  49  |   });
  50  | 
  51  |   test("correct group is locked", async ({ page }) => {
  52  |     await startGame(page);
  53  |     await selectGroup(page, PUZZLE_GROUPS[0].items);
  54  |     await expect(page.getByTestId("game-message")).toContainText(
  55  |       "Točno! Pronašao si grupu.",
  56  |     );
  57  |     await expect(page.getByTestId("solved-group")).toBeVisible();
  58  |     await expect(page.getByTestId("stat-groups")).toContainText("1/4");
  59  |   });
  60  | 
  61  |   test("wrong group shows error message", async ({ page }) => {
  62  |     await startGame(page);
  63  |     const wrongItems = [
  64  |       PUZZLE_GROUPS[0].items[0],
  65  |       PUZZLE_GROUPS[1].items[0],
  66  |       PUZZLE_GROUPS[2].items[0],
  67  |       PUZZLE_GROUPS[3].items[0],
  68  |     ];
  69  |     await selectGroup(page, wrongItems);
  70  |     await expect(page.getByTestId("game-message")).toContainText(
  71  |       "Nije točno, pokušaj ponovno.",
  72  |     );
  73  |     await expect(page.getByTestId("stat-attempts")).toContainText("1");
  74  |   });
  75  | 
  76  |   test("completing all groups shows result", async ({ page }) => {
  77  |     await startGame(page);
  78  |     await solveAllGroups(page);
  79  |     await expect(page.getByTestId("result-panel")).toBeVisible({ timeout: 5000 });
  80  |     await expect(page.getByText("Bravo!")).toBeVisible();
  81  |     await expect(page.getByTestId("result-groups")).toContainText("4/4");
  82  |   });
  83  | 
  84  |   test("landing challenge demo opens challenge screen", async ({ page }) => {
  85  |     await page.goto("/mozgalica");
  86  |     await page.getByTestId("landing-challenge-demo").click();
  87  |     await expect(page.getByTestId("challenge-result")).toBeVisible();
  88  |     await expect(page.getByText("Ivan te izazvao!")).toBeVisible();
  89  |   });
  90  | 
  91  |   test("nav Izazovi prijatelja scrolls to challenge section", async ({ page, isMobile }) => {
  92  |     await page.goto("/mozgalica");
  93  |     if (isMobile) {
  94  |       await page.getByRole("button", { name: "Otvori izbornik" }).click();
  95  |       await page.locator(".mz-mobile-nav").getByRole("button", { name: "Izazovi prijatelja" }).click();
  96  |     } else {
  97  |       await page.locator(".mz-nav").getByRole("button", { name: "Izazovi prijatelja" }).click();
  98  |     }
> 99  |     await expect(page.getByTestId("challenge-section")).toBeInViewport({ timeout: 10000 });
      |                                                         ^ Error: expect(locator).toBeInViewport() failed
  100 |   });
  101 | 
  102 |   test("mobile viewport layout is intact", async ({ page, isMobile }) => {
  103 |     test.skip(!isMobile, "Mobile-only layout check");
  104 |     await page.goto("/mozgalica");
  105 |     await expect(page.getByTestId("landing-header")).toBeVisible();
  106 |     await expect(page.getByTestId("hero-title")).toBeVisible();
  107 |     await startGame(page);
  108 |     const box = await page.getByTestId("game-grid").boundingBox();
  109 |     expect(box?.width).toBeGreaterThan(0);
  110 |     await expect(page.getByTestId("check-selection")).toBeVisible();
  111 |   });
  112 | });
  113 | 
  114 | test.describe("Dnevne Asocijacije screenshots", () => {
  115 |   test("landing desktop screenshot", async ({ page, isMobile }) => {
  116 |     test.skip(isMobile, "Desktop-only screenshot");
  117 |     await page.goto("/mozgalica");
  118 |     await expect(page.getByTestId("hero-title")).toBeVisible();
  119 |     await page.waitForTimeout(500);
  120 |     await expect(page).toHaveScreenshot("landing-desktop.png", {
  121 |       fullPage: true,
  122 |     });
  123 |   });
  124 | 
  125 |   test("landing mobile screenshot", async ({ page, isMobile }) => {
  126 |     test.skip(!isMobile, "Mobile-only screenshot");
  127 |     await page.goto("/mozgalica");
  128 |     await expect(page.getByTestId("hero-title")).toBeVisible();
  129 |     await page.waitForTimeout(500);
  130 |     await expect(page).toHaveScreenshot("landing-mobile.png", {
  131 |       fullPage: true,
  132 |     });
  133 |   });
  134 | 
  135 |   test("game mobile screenshot", async ({ page, isMobile }) => {
  136 |     test.skip(!isMobile, "Mobile-only screenshot");
  137 |     await startGame(page);
  138 |     await page.waitForTimeout(500);
  139 |     await expect(page).toHaveScreenshot("game-mobile.png", {
  140 |       fullPage: true,
  141 |     });
  142 |   });
  143 | 
  144 |   test("result screenshot", async ({ page, isMobile }) => {
  145 |     await startGame(page);
  146 |     await solveAllGroups(page);
  147 |     await expect(page.getByTestId("result-panel")).toBeVisible({ timeout: 5000 });
  148 |     await page.waitForTimeout(500);
  149 |     await expect(page).toHaveScreenshot(
  150 |       isMobile ? "result-mobile.png" : "result-desktop.png",
  151 |       { fullPage: true },
  152 |     );
  153 |   });
  154 | 
  155 |   test("challenge result screenshot", async ({ page, isMobile }) => {
  156 |     await startGame(page);
  157 |     await solveAllGroups(page);
  158 |     await expect(page.getByTestId("result-panel")).toBeVisible({ timeout: 5000 });
  159 |     await page.getByTestId("challenge-friends").click();
  160 |     await expect(page.getByTestId("challenge-result")).toBeVisible();
  161 |     await page.waitForTimeout(500);
  162 |     await expect(page).toHaveScreenshot(
  163 |       isMobile ? "challenge-result-mobile.png" : "challenge-result-desktop.png",
  164 |       { fullPage: true },
  165 |     );
  166 |   });
  167 | });
  168 | 
```