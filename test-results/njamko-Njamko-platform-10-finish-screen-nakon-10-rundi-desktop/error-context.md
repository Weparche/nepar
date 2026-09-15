# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: njamko.spec.js >> Njamko platform >> 10. finish screen nakon 10 rundi
- Location: e2e\njamko.spec.js:468:3

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: locator.click: Test timeout of 120000ms exceeded.
Call log:
  - waiting for locator('[data-answer="Mrkva"]')
    - locator resolved to <button type="button" data-answer="Mrkva" aria-label="Odaberi Mrkva" data-testid="option-card-mrkva" class="nj-option-card nj-option-card--premium">…</button>
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
  206 × retrying click action
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
    - generic:
      - img "Zeko na livadi"
    - generic [ref=e5]:
      - banner [ref=e6]:
        - button "Natrag na izbor razine" [ref=e7] [cursor=pointer]:
          - generic [ref=e8]: ←
        - paragraph [ref=e10]: Nahrani životinju
        - generic [ref=e11]:
          - button "Isključi zvuk" [pressed] [ref=e12] [cursor=pointer]:
            - generic [ref=e13]: 🔊
          - generic [ref=e14]: 1/10
      - generic [ref=e15]:
        - generic [ref=e16]:
          - paragraph [ref=e17]: Zeko je gladan!
          - paragraph [ref=e18]: Što jede zeko?
        - generic [ref=e20]:
          - button "Odaberi Banana" [ref=e21] [cursor=pointer]:
            - generic [ref=e23]: Banana
          - button "Odaberi Mrkva" [ref=e24] [cursor=pointer]:
            - generic [ref=e26]: Mrkva
          - button "Odaberi Riba" [ref=e27] [cursor=pointer]:
            - generic [ref=e29]: Riba
  - dialog "Vi birate analitiku" [ref=e30]:
    - generic [ref=e31]:
      - img [ref=e33]
      - generic [ref=e36]:
        - heading "Vi birate analitiku" [level=2] [ref=e37]
        - paragraph [ref=e38]: Nužne postavke održavaju stranicu funkcionalnom. Uz vaše dopuštenje koristimo GA4 i vlastitu analitiku kako bismo razumjeli koje stranice i upiti stvarno pomažu.
    - generic [ref=e39]:
      - button "Prihvati analitiku" [ref=e40] [cursor=pointer]
      - button "Odbij analitiku" [ref=e41] [cursor=pointer]
      - link "Politika privatnosti" [ref=e42] [cursor=pointer]:
        - /url: /privatnost
```

# Test source

```ts
  1   | ﻿import { test, expect } from "@playwright/test";
  2   | import { existsSync } from "node:fs";
  3   | import { fileURLToPath } from "node:url";
  4   | import {
  5   |   campaignSteps,
  6   |   CAMPAIGN_MODE_ORDER,
  7   |   campaignLevelOneStops,
  8   | } from "../src/njamko/campaign.js";
  9   | import {
  10  |   countTotalRounds,
  11  |   getLevel,
  12  |   getMode,
  13  |   njamkoModes,
  14  | } from "../src/njamko/data/njamkoLevels.js";
  15  | 
  16  | async function assertNoHorizontalScroll(page) {
  17  |   const metrics = await page.evaluate(() => ({
  18  |     scrollWidth: document.documentElement.scrollWidth,
  19  |     clientWidth: document.documentElement.clientWidth,
  20  |   }));
  21  |   expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
  22  | }
  23  | 
  24  | async function openModeSelect(page) {
  25  |   await page.goto("/njamko");
  26  |   await expect(page.getByTestId("mode-select")).toBeVisible();
  27  | }
  28  | 
  29  | async function openFoodLevelSelect(page) {
  30  |   await openModeSelect(page);
  31  |   await page.getByTestId("mode-food").click();
  32  |   await expect(page.getByTestId("level-select")).toBeVisible();
  33  | }
  34  | 
  35  | async function openHomeLevelSelect(page) {
  36  |   await openModeSelect(page);
  37  |   await page.getByTestId("mode-home").click();
  38  |   await expect(page.getByTestId("level-select")).toBeVisible();
  39  | }
  40  | 
  41  | async function openSoundLevelSelect(page) {
  42  |   await openModeSelect(page);
  43  |   await page.getByTestId("mode-sound").click();
  44  |   await expect(page.getByTestId("level-select")).toBeVisible();
  45  | }
  46  | 
  47  | async function openBabyLevelSelect(page) {
  48  |   await openModeSelect(page);
  49  |   await page.getByTestId("mode-baby").click();
  50  |   await expect(page.getByTestId("level-select")).toBeVisible();
  51  | }
  52  | 
  53  | async function openCountingLevelSelect(page) {
  54  |   await openModeSelect(page);
  55  |   await page.getByTestId("mode-counting").click();
  56  |   await expect(page.getByTestId("level-select")).toBeVisible();
  57  | }
  58  | 
  59  | async function selectCorrectAnswer(page, round) {
> 60  |   await page.locator(`[data-answer="${round.correctAnswer}"]`).click();
      |                                                                ^ Error: locator.click: Test timeout of 120000ms exceeded.
  61  | }
  62  | 
  63  | async function completeLevel(page, modeId, levelId) {
  64  |   const level = getLevel(modeId, levelId);
  65  |   for (let index = 0; index < level.rounds.length; index += 1) {
  66  |     const round = level.rounds[index];
  67  |     if (round.mode === "sound") {
  68  |       await expect(page.getByTestId("sound-text")).toBeVisible();
  69  |     }
  70  |     await selectCorrectAnswer(page, round);
  71  |     await expect(page.getByTestId("feedback-message")).toContainText("Bravo!");
  72  |     if (index < level.rounds.length - 1) {
  73  |       await expect(page.getByTestId("feedback-message")).toHaveCount(0, {
  74  |         timeout: 5000,
  75  |       });
  76  |     }
  77  |   }
  78  | }
  79  | 
  80  | async function completeCountingLevel(page, levelId) {
  81  |   const level = getLevel("counting", levelId);
  82  |   for (let taskIndex = 0; taskIndex < level.tasks.length; taskIndex += 1) {
  83  |     const task = level.tasks[taskIndex];
  84  |     if (task.type === "find-number") {
  85  |       for (const number of task.sequence) {
  86  |         await page.getByTestId(`counting-shell-${number}`).click();
  87  |       }
  88  |     } else if (["collect-count", "collect-quantity", "decorate-result"].includes(task.type)) {
  89  |       for (let index = 1; index <= task.targetNumber; index += 1) {
  90  |         await page.getByTestId(`counting-collect-item-${index}`).click();
  91  |       }
  92  |     } else if (["number-path", "place-on-path", "complete-path", "build-order"].includes(task.type)) {
  93  |       for (const number of task.sequence) {
  94  |         await page.getByTestId(`counting-path-${number}`).click();
  95  |       }
  96  |     } else if (task.type === "count-visible") {
  97  |       await page.getByTestId(`counting-choice-${task.visibleCount}`).click();
  98  |     } else if (task.type === "missing-number") {
  99  |       await page.getByTestId(`counting-choice-${task.answer}`).click();
  100 |     }
  101 | 
  102 |     if (taskIndex < level.tasks.length - 1) {
  103 |       await expect(page.getByTestId("game-progress")).toHaveText(`${taskIndex + 2}/3`, { timeout: 5000 });
  104 |     }
  105 |   }
  106 |   await expect(page.getByTestId("counting-mini-sandbox")).toBeVisible({ timeout: 5000 });
  107 |   await page.getByTestId("counting-sandbox-item-1").click();
  108 |   await page.getByTestId("counting-sandbox-finish").click();
  109 | }
  110 | 
  111 | async function launchCampaignStop(page, stopTestId) {
  112 |   await page.getByTestId(stopTestId).click();
  113 |   await expect(page.getByTestId("campaign-game-popup")).toBeVisible();
  114 |   const popupIsContained = await page.evaluate(() => {
  115 |     const popup = document.querySelector("[data-testid='campaign-game-popup']").getBoundingClientRect();
  116 |     const stage = document.querySelector(".nj-campaign-map__stage").getBoundingClientRect();
  117 |     return popup.left >= stage.left && popup.right <= stage.right;
  118 |   });
  119 |   expect(popupIsContained).toBe(true);
  120 |   const popupOverlapsCar = await page.evaluate(() => {
  121 |     const popup = document.querySelector("[data-testid='campaign-game-popup']").getBoundingClientRect();
  122 |     const car = document.querySelector("[data-testid='campaign-car']").getBoundingClientRect();
  123 |     return !(
  124 |       popup.right < car.left ||
  125 |       popup.left > car.right ||
  126 |       popup.bottom < car.top ||
  127 |       popup.top > car.bottom
  128 |     );
  129 |   });
  130 |   expect(popupOverlapsCar).toBe(false);
  131 |   const popupOverlapsActions = await page.evaluate(() => {
  132 |     const popup = document.querySelector("[data-testid='campaign-game-popup']").getBoundingClientRect();
  133 |     const actions = document
  134 |       .querySelector(".nj-campaign-map__actions")
  135 |       .getBoundingClientRect();
  136 |     return !(
  137 |       popup.right < actions.left ||
  138 |       popup.left > actions.right ||
  139 |       popup.bottom < actions.top ||
  140 |       popup.top > actions.bottom
  141 |     );
  142 |   });
  143 |   expect(popupOverlapsActions).toBe(false);
  144 |   await page.getByTestId("campaign-launch-step-button").click();
  145 |   await expect(page.getByTestId("game-screen")).toBeVisible();
  146 | }
  147 | 
  148 | test.beforeEach(async ({ page }) => {
  149 |   await page.goto("/njamko");
  150 |   await page.evaluate(() => {
  151 |     localStorage.removeItem("njamkoPlusUnlocked");
  152 |     localStorage.removeItem("njamkoCampaignCompletedStep");
  153 |   });
  154 | });
  155 | 
  156 | test.describe("Njamko platform", () => {
  157 |   test("1. otvara se izravno na odabir igre", async ({ page }) => {
  158 |     await page.goto("/njamko");
  159 |     await expect(page.getByTestId("njamko-page")).toBeVisible();
  160 |     await expect(page.getByTestId("mode-select")).toBeVisible();
```