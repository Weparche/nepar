# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: njamko.spec.js >> Njamko platform >> 2f. reset kampanje trazi potvrdu i brise progress
- Location: e2e\njamko.spec.js:342:3

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: locator.click: Test timeout of 120000ms exceeded.
Call log:
  - waiting for getByTestId('campaign-stop-food')
    - locator resolved to <button type="button" aria-label="Nahrani životinju" data-testid="campaign-stop-food" class="nj-campaign-stop nj-campaign-stop--active">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is not stable
    - retrying click action
      - waiting 100ms
    214 × waiting for element to be visible, enabled and stable
        - element is visible, enabled and stable
        - scrolling into view if needed
        - done scrolling
        - <p id="consent-description">Nužne postavke održavaju stranicu funkcionalnom. …</p> from <aside role="dialog" aria-modal="false" class="consent-panel" data-testid="consent-panel" aria-labelledby="consent-title" aria-describedby="consent-description">…</aside> subtree intercepts pointer events
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
        - paragraph [ref=e7]: Razina 1 kampanje
        - heading "Odaberi stajalište" [level=1] [ref=e8]
        - paragraph [ref=e9]: Prati Njamka kroz četiri igre razine 1.
      - generic "Karta Njamko kampanje" [ref=e10]:
        - generic "Stajališta razine 1" [ref=e11]:
          - button "Nahrani životinju" [ref=e12] [cursor=pointer]:
            - generic [ref=e14]: Nahrani životinju
          - button "Pronađi dom" [disabled] [ref=e15]:
            - generic [ref=e17]: Pronađi dom
          - button "Pogodi zvuk" [disabled] [ref=e18]:
            - generic [ref=e20]: Pogodi zvuk
          - button "Mama i beba" [disabled] [ref=e21]:
            - generic [ref=e23]: Mama i beba
      - generic [ref=e25]:
        - button "Resetiraj kampanju" [disabled] [ref=e26] [cursor=pointer]
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
  60  |   await page.locator(`[data-answer="${round.correctAnswer}"]`).click();
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
> 112 |   await page.getByTestId(stopTestId).click();
      |                                      ^ Error: locator.click: Test timeout of 120000ms exceeded.
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
  161 |     await expect(page.getByRole("heading", { name: "Odaberi igru", level: 1 })).toBeVisible();
  162 |     await expect(page.getByTestId("start-button")).toHaveCount(0);
  163 |   });
  164 | 
  165 |   test("1b. natrag na home vodi na landing", async ({ page }) => {
  166 |     await openModeSelect(page);
  167 |     await page.getByTestId("mode-select-back-home").click();
  168 |     await expect(page.getByTestId("landing-page")).toBeVisible();
  169 |   });
  170 | 
  171 |   test("2. mode select radi", async ({ page }) => {
  172 |     await openModeSelect(page);
  173 |     await expect(page.getByTestId("campaign-button")).toBeVisible();
  174 |     await expect(page.getByTestId("mode-food")).toBeVisible();
  175 |     await expect(page.getByTestId("mode-home")).toBeVisible();
  176 |     await expect(page.getByTestId("mode-sound")).toBeVisible();
  177 |     await expect(page.getByTestId("mode-baby")).toBeVisible();
  178 |     await expect(page.getByTestId("mode-counting")).toBeVisible();
  179 |     await page.getByTestId("mode-food").click();
  180 |     await expect(page.getByTestId("level-select")).toBeVisible();
  181 |   });
  182 | 
  183 |   test("2a. counting mode ima dvije free i tri Plus misije", async ({ page }) => {
  184 |     await page.setViewportSize({ width: 390, height: 844 });
  185 |     await openCountingLevelSelect(page);
  186 |     await expect(page.getByText("Broji s Njamkom")).toBeVisible();
  187 |     await expect(page.getByTestId("level-card-1")).toContainText("Besplatno");
  188 |     await expect(page.getByTestId("level-card-2")).toContainText("Besplatno");
  189 |     await expect(page.getByTestId("level-card-3")).toContainText("Plus");
  190 |     await expect(page.getByTestId("level-card-5")).toContainText("Plus");
  191 |     await page.getByTestId("level-card-2").click();
  192 |     await expect(page.getByTestId("counting-game-screen")).toBeVisible();
  193 |     await expect(page.getByTestId("counting-expected-number")).toContainText("4");
  194 |     await page.getByLabel("Natrag na izbor razine").click();
  195 |     await page.getByTestId("level-card-3").click();
  196 |     await expect(page.getByTestId("parental-gate")).toBeVisible();
  197 |     await assertNoHorizontalScroll(page);
  198 |   });
  199 | 
  200 |   test("2b. campaignSteps imaju ispravan redoslijed i postojece levele", () => {
  201 |     expect(campaignSteps).toHaveLength(20);
  202 |     for (let index = 0; index < campaignSteps.length; index += 1) {
  203 |       const step = campaignSteps[index];
  204 |       const levelId = Math.floor(index / CAMPAIGN_MODE_ORDER.length) + 1;
  205 |       const modeId = CAMPAIGN_MODE_ORDER[index % CAMPAIGN_MODE_ORDER.length];
  206 |       expect(step).toEqual({
  207 |         modeId,
  208 |         levelId,
  209 |         stepNumber: index + 1,
  210 |         totalSteps: 20,
  211 |       });
  212 |       expect(getLevel(step.modeId, step.levelId)).toBeTruthy();
```