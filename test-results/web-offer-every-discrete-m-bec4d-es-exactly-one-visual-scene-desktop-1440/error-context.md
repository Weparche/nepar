# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web-offer.spec.js >> every discrete mouse-wheel gesture advances exactly one visual scene
- Location: e2e\web-offer.spec.js:140:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/
Call log:
  - navigating to "http://127.0.0.1:4173/", waiting until "load"

```

# Test source

```ts
  41  |   }
  42  | }
  43  | 
  44  | async function expectTouchTargets(page) {
  45  |   const undersized = await page
  46  |     .locator(
  47  |       ".button, .nav-cta, .nav-link, .mobile-nav-link, .menu-button, .language-toggle button, .project-tile, .footer-contact, .faq-list summary, .offer-selector button, .offer-card-disclosure summary",
  48  |     )
  49  |     .evaluateAll((elements) =>
  50  |       elements.flatMap((element) => {
  51  |         const rect = element.getBoundingClientRect();
  52  |         if (!rect.width || !rect.height) return [];
  53  |         return rect.width >= 44 && rect.height >= 44
  54  |           ? []
  55  |           : [`${element.tagName.toLowerCase()}.${element.className}: ${rect.width}x${rect.height}`];
  56  |       }),
  57  |     );
  58  |   expect(undersized).toEqual([]);
  59  | }
  60  | 
  61  | async function skipEvolutionIntro(page) {
  62  |   const skipButton = page.getByRole("button", { name: "Zatvori animaciju", exact: true });
  63  |   if (await skipButton.isVisible().catch(() => false)) await skipButton.click();
  64  | }
  65  | 
  66  | async function openEvolutionIntro(page) {
  67  |   const about = page.locator("#onama");
  68  |   await about.scrollIntoViewIfNeeded();
  69  |   await about.getByRole("button", { name: "Pokreni priču o evoluciji tehnologije" }).click();
  70  |   await expect(page.getByTestId("evolution-intro")).toBeVisible();
  71  | }
  72  | 
  73  | async function scrollEvolutionIntro(page, sceneIndex) {
  74  |   await page.getByTestId("evolution-intro").evaluate((intro, index) => {
  75  |     intro.scrollTo({ top: intro.clientHeight * index, left: 0, behavior: "auto" });
  76  |   }, sceneIndex);
  77  | }
  78  | 
  79  | async function evolutionFrameTime(page) {
  80  |   return Number(await page.getByTestId("evolution-frame").getAttribute("data-frame-time"));
  81  | }
  82  | 
  83  | test("cinematic intro follows scene markers and completes after the final viewport", async ({ page }) => {
  84  |   await page.goto("/");
  85  |   await openEvolutionIntro(page);
  86  | 
  87  |   const intro = page.getByTestId("evolution-intro");
  88  |   const frame = page.getByTestId("evolution-frame");
  89  |   await expect(intro).toBeVisible();
  90  |   await expect(intro).toHaveAttribute("data-active-scene", "0");
  91  |   await expect(page.getByTestId("evolution-copy")).toContainText("Računalo je počelo");
  92  |   await expect(page.getByRole("button", { name: "Zatvori animaciju", exact: true })).toBeVisible();
  93  |   await expect(page.getByTestId("landing-page")).toHaveAttribute("inert", "");
  94  | 
  95  |   await scrollEvolutionIntro(page, 2);
  96  |   await expect(intro).toHaveAttribute("data-active-scene", "2");
  97  |   await expect(page.getByText("Internet je povezao cijeli svijet.", { exact: true })).toBeVisible();
  98  |   await expect.poll(async () => {
  99  |     const currentTime = await evolutionFrameTime(page);
  100 |     return Math.abs(currentTime - 8.1);
  101 |   }).toBeLessThanOrEqual(0.5);
  102 | 
  103 |   await scrollEvolutionIntro(page, 3);
  104 |   await expect(intro).toHaveAttribute("data-active-scene", "3");
  105 |   await expect(page.getByText("Cloud je rad preselio na svaki uređaj.", { exact: true })).toBeVisible();
  106 |   await expect.poll(async () => {
  107 |     const currentTime = await evolutionFrameTime(page);
  108 |     return Math.abs(currentTime - 10.3);
  109 |   }).toBeLessThanOrEqual(0.5);
  110 | 
  111 |   await scrollEvolutionIntro(page, 4);
  112 |   await expect(intro).toHaveAttribute("data-active-scene", "4");
  113 |   await expect(page.getByText("Digitalni alati postali su radno okruženje.", { exact: true })).toBeVisible();
  114 |   await expect.poll(async () => {
  115 |     const currentTime = await evolutionFrameTime(page);
  116 |     return Math.abs(currentTime - 13);
  117 |   }).toBeLessThanOrEqual(0.5);
  118 | 
  119 |   await scrollEvolutionIntro(page, 5);
  120 |   await expect(intro).toHaveAttribute("data-active-scene", "5");
  121 |   await expect(page.getByText("AI danas razumije, automatizira i stvara.", { exact: true })).toBeVisible();
  122 |   await expect.poll(async () => {
  123 |     const currentTime = await evolutionFrameTime(page);
  124 |     return Math.abs(currentTime - 16);
  125 |   }).toBeLessThanOrEqual(0.5);
  126 | 
  127 |   await scrollEvolutionIntro(page, 6);
  128 |   await expect(intro).toHaveAttribute("data-active-scene", "6");
  129 |   await expect(page.getByTestId("evolution-copy")).toHaveCount(0);
  130 |   await expect.poll(() => evolutionFrameTime(page)).toBeGreaterThanOrEqual(17.95);
  131 |   await expect(frame).toHaveAttribute("src", "/evolution-loop.webp");
  132 |   await expect(frame).toHaveAttribute("data-frame-time", "18.80");
  133 |   await expect(intro).toBeVisible();
  134 | 
  135 |   await scrollEvolutionIntro(page, 7.1);
  136 |   await expect(intro).toHaveCount(0);
  137 |   await expect(page.getByRole("heading", { level: 1, name: /Gradimo korisne digitalne proizvode/ })).toBeVisible();
  138 | });
  139 | 
  140 | test("every discrete mouse-wheel gesture advances exactly one visual scene", async ({ page }) => {
> 141 |   await page.goto("/");
      |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/
  142 |   await openEvolutionIntro(page);
  143 |   const intro = page.getByTestId("evolution-intro");
  144 |   await expect(intro).toHaveAttribute("data-active-scene", "0");
  145 | 
  146 |   const wheelStep = async (deltaY) => {
  147 |     await page.mouse.wheel(0, deltaY);
  148 |     await page.waitForTimeout(1550);
  149 |   };
  150 | 
  151 |   await wheelStep(120);
  152 |   await expect(intro).toHaveAttribute("data-active-scene", "1");
  153 |   await expect(page.getByText("Grafička sučelja približila su tehnologiju svima.", { exact: true })).toBeVisible();
  154 | 
  155 |   await wheelStep(120);
  156 |   await expect(intro).toHaveAttribute("data-active-scene", "2");
  157 |   await expect(page.getByText("Internet je povezao cijeli svijet.", { exact: true })).toBeVisible();
  158 |   await expect.poll(async () => Math.abs(await evolutionFrameTime(page) - 8.1)).toBeLessThanOrEqual(0.5);
  159 | 
  160 |   await wheelStep(-120);
  161 |   await expect(intro).toHaveAttribute("data-active-scene", "1");
  162 | });
  163 | 
  164 | test("a short touch swipe advances exactly one visual scene", async ({ page }) => {
  165 |   await page.goto("/");
  166 |   await openEvolutionIntro(page);
  167 |   const hasTouch = await page.evaluate(() => "ontouchstart" in window);
  168 |   test.skip(!hasTouch, "touch emulation not enabled for this project");
  169 | 
  170 |   const intro = page.getByTestId("evolution-intro");
  171 |   await expect(intro).toHaveAttribute("data-active-scene", "0");
  172 | 
  173 |   const swipeUp = async (distance) => {
  174 |     await page.evaluate((swipeDistance) => {
  175 |       const target = document.querySelector('[data-testid="evolution-intro"]');
  176 |       const makeTouch = (clientY) => new Touch({ identifier: 1, target, clientX: 200, clientY });
  177 |       const dispatch = (type, clientY, touches) => target.dispatchEvent(new TouchEvent(type, {
  178 |         bubbles: true,
  179 |         cancelable: true,
  180 |         touches,
  181 |         changedTouches: [makeTouch(clientY)],
  182 |       }));
  183 |       const startY = 500;
  184 |       const endY = startY - swipeDistance;
  185 |       dispatch("touchstart", startY, [makeTouch(startY)]);
  186 |       dispatch("touchmove", endY, [makeTouch(endY)]);
  187 |       dispatch("touchend", endY, []);
  188 |     }, distance);
  189 |     await page.waitForTimeout(1550);
  190 |   };
  191 | 
  192 |   // A 40px drag is far short of the ~half-viewport native scroll that used
  193 |   // to be required — one short swipe should snap exactly one scene forward.
  194 |   await swipeUp(40);
  195 |   await expect(intro).toHaveAttribute("data-active-scene", "1");
  196 |   await expect(page.getByText("Grafička sučelja približila su tehnologiju svima.", { exact: true })).toBeVisible();
  197 |   await expect.poll(() => page.getByTestId("evolution-intro").evaluate((intro) => intro.scrollTop)).toBe(
  198 |     await page.evaluate(() => window.innerHeight),
  199 |   );
  200 | });
  201 | 
  202 | test("wheel alignment never briefly reverses the active scene", async ({ page }) => {
  203 |   await page.goto("/");
  204 |   await openEvolutionIntro(page);
  205 |   await page.evaluate(() => {
  206 |     window.__evolutionSceneChanges = [];
  207 |     const intro = document.querySelector('[data-testid="evolution-intro"]');
  208 |     const observer = new MutationObserver(() => {
  209 |       window.__evolutionSceneChanges.push(intro.getAttribute("data-active-scene"));
  210 |     });
  211 |     observer.observe(intro, { attributes: true, attributeFilter: ["data-active-scene"] });
  212 |   });
  213 | 
  214 |   await page.mouse.wheel(0, 120);
  215 |   await page.waitForTimeout(450);
  216 | 
  217 |   const changes = await page.evaluate(() => window.__evolutionSceneChanges);
  218 |   expect(changes).toEqual(["1"]);
  219 |   await expect.poll(() => page.getByTestId("evolution-intro").evaluate((intro) => intro.scrollTop)).toBe(
  220 |     await page.evaluate(() => window.innerHeight),
  221 |   );
  222 | });
  223 | 
  224 | test("scene 2 to 3 is slightly quicker and the extended final brand segment loops", async ({ page }) => {
  225 |   await page.goto("/");
  226 |   await openEvolutionIntro(page);
  227 |   const intro = page.getByTestId("evolution-intro");
  228 | 
  229 |   await page.mouse.wheel(0, 120);
  230 |   await expect(intro).toHaveAttribute("data-active-scene", "1");
  231 |   await expect(page.getByTestId("evolution-copy")).toHaveCount(1);
  232 |   await page.waitForTimeout(600);
  233 |   const firstMidpoint = await evolutionFrameTime(page);
  234 |   expect(firstMidpoint).toBeGreaterThan(0.2);
  235 |   expect(firstMidpoint).toBeLessThan(3.8);
  236 |   await expect.poll(async () => Math.abs(await evolutionFrameTime(page) - 3.8)).toBeLessThanOrEqual(0.18);
  237 |   const copyLayout = await page.getByTestId("evolution-copy").evaluate((element) => {
  238 |     const rect = element.getBoundingClientRect();
  239 |     const storyRect = element.parentElement.getBoundingClientRect();
  240 |     return { left: rect.left, storyLeft: storyRect.left, right: rect.right, viewport: window.innerWidth };
  241 |   });
```