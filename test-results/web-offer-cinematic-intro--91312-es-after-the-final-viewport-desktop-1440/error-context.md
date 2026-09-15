# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web-offer.spec.js >> cinematic intro follows scene markers and completes after the final viewport
- Location: e2e\web-offer.spec.js:83:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/
Call log:
  - navigating to "http://127.0.0.1:4173/", waiting until "load"

```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | import AxeBuilder from "@axe-core/playwright";
  3   | import { webOfferContent } from "../src/webOfferContent.js";
  4   | 
  5   | const servicePath = "/usluge/izrada-web-stranica";
  6   | const heroVideoPattern = /\/brand\/hero-(desktop|mobile)\.(webm|mp4)$/;
  7   | 
  8   | async function installControlledHeroIdle(page) {
  9   |   await page.addInitScript(() => {
  10  |     const callbacks = new Map();
  11  |     let nextId = 0;
  12  |     window.requestIdleCallback = (callback) => {
  13  |       nextId += 1;
  14  |       callbacks.set(nextId, callback);
  15  |       return nextId;
  16  |     };
  17  |     window.cancelIdleCallback = (id) => callbacks.delete(id);
  18  |     window.__runHeroIdleCallbacks = () => {
  19  |       const pending = [...callbacks.values()];
  20  |       callbacks.clear();
  21  |       pending.forEach((callback) => callback({ didTimeout: false, timeRemaining: () => 50 }));
  22  |     };
  23  |   });
  24  | }
  25  | 
  26  | async function expectNoHorizontalOverflow(page) {
  27  |   const dimensions = await page.evaluate(() => ({
  28  |     viewport: document.documentElement.clientWidth,
  29  |     content: document.documentElement.scrollWidth,
  30  |   }));
  31  |   expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
  32  | }
  33  | 
  34  | async function expectHeadingOrder(page) {
  35  |   const levels = await page.locator("h1, h2, h3, h4, h5, h6").evaluateAll((headings) =>
  36  |     headings.map((heading) => Number(heading.tagName.slice(1))),
  37  |   );
  38  |   expect(levels[0]).toBe(1);
  39  |   for (let index = 1; index < levels.length; index += 1) {
  40  |     expect(levels[index] - levels[index - 1]).toBeLessThanOrEqual(1);
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
> 84  |   await page.goto("/");
      |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/
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
  141 |   await page.goto("/");
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
```