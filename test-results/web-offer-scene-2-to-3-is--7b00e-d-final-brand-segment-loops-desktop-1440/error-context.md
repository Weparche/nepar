# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web-offer.spec.js >> scene 2 to 3 is slightly quicker and the extended final brand segment loops
- Location: e2e\web-offer.spec.js:224:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/
Call log:
  - navigating to "http://127.0.0.1:4173/", waiting until "load"

```

# Test source

```ts
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
> 225 |   await page.goto("/");
      |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/
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
  242 |   expect(Math.abs(copyLayout.left - copyLayout.storyLeft)).toBeLessThanOrEqual(1);
  243 |   expect(copyLayout.right).toBeLessThanOrEqual(copyLayout.viewport);
  244 | 
  245 |   await page.waitForTimeout(400);
  246 |   await page.mouse.wheel(0, 120);
  247 |   await expect(intro).toHaveAttribute("data-active-scene", "2");
  248 |   await page.waitForTimeout(1200);
  249 |   await expect.poll(async () => Math.abs(await evolutionFrameTime(page) - 8.1)).toBeLessThanOrEqual(0.18);
  250 | 
  251 |   await scrollEvolutionIntro(page, 6);
  252 |   await expect(intro).toHaveAttribute("data-active-scene", "6");
  253 |   await expect.poll(() => evolutionFrameTime(page)).toBeGreaterThanOrEqual(17.95);
  254 |   const loopFrame = page.getByTestId("evolution-frame");
  255 |   await expect(loopFrame).toHaveAttribute("src", "/evolution-loop.webp");
  256 |   await expect.poll(() => loopFrame.evaluate((element) => element.complete && element.naturalWidth > 0)).toBe(true);
  257 | });
  258 | 
  259 | test("mobile shows an animated brand title on every scene except the final loop", async ({ page }) => {
  260 |   await page.goto("/");
  261 |   await openEvolutionIntro(page);
  262 |   const intro = page.getByTestId("evolution-intro");
  263 |   const brandTitle = page.getByRole("button", { name: "Nepar Solutions — zatvori animaciju" });
  264 | 
  265 |   const isMobileViewport = (page.viewportSize()?.width ?? 0) <= 700;
  266 |   if (!isMobileViewport) {
  267 |     await expect(brandTitle).toBeHidden();
  268 |     await scrollEvolutionIntro(page, 6);
  269 |     await expect(brandTitle).toBeHidden();
  270 |     return;
  271 |   }
  272 | 
  273 |   await expect(intro).toHaveAttribute("data-active-scene", "0");
  274 |   await expect(brandTitle).toBeVisible();
  275 |   await expect(brandTitle).toHaveText("Nepar Solutions");
  276 | 
  277 |   await scrollEvolutionIntro(page, 6);
  278 |   await expect(intro).toHaveAttribute("data-active-scene", "6");
  279 |   await expect(brandTitle).toBeHidden();
  280 | 
  281 |   await scrollEvolutionIntro(page, 5);
  282 |   await expect(intro).toHaveAttribute("data-active-scene", "5");
  283 |   await expect(brandTitle).toBeVisible();
  284 | 
  285 |   // force:true — the button lives on a sticky, scroll-jacked overlay that's
  286 |   // already fully on-screen; Playwright's default scrollIntoViewIfNeeded
  287 |   // pre-click step nudges window scroll, which fights the intro's own
  288 |   // IntersectionObserver-driven scene detection and flickers the button
  289 |   // out of the DOM. No real tap ever triggers that extra scroll.
  290 |   await brandTitle.click({ force: true });
  291 |   await expect(intro).toHaveCount(0);
  292 |   await expect(page.getByRole("heading", { level: 1, name: /Gradimo korisne digitalne proizvode/ })).toBeVisible();
  293 | });
  294 | 
  295 | test("cinematic intro opens on demand and can be skipped", async ({ page }) => {
  296 |   await page.goto("/");
  297 |   await expect(page.getByTestId("evolution-intro")).toHaveCount(0);
  298 |   await expect(page.getByRole("heading", { level: 1, name: /Gradimo korisne digitalne proizvode/ })).toBeVisible();
  299 |   await openEvolutionIntro(page);
  300 |   await page.getByRole("button", { name: "Zatvori animaciju", exact: true }).click();
  301 | 
  302 |   await expect(page.getByTestId("evolution-intro")).toHaveCount(0);
  303 |   await page.reload();
  304 |   await expect(page.getByTestId("evolution-intro")).toHaveCount(0);
  305 |   await expect(page.getByRole("heading", { level: 1, name: /Gradimo korisne digitalne proizvode/ })).toBeVisible();
  306 | });
  307 | 
  308 | test("reduced motion keeps the home visible and opens a static final frame", async ({ page }) => {
  309 |   const videoRequests = [];
  310 |   page.on("request", (request) => {
  311 |     const pathname = new URL(request.url()).pathname;
  312 |     if (heroVideoPattern.test(pathname)) videoRequests.push(pathname);
  313 |   });
  314 |   await page.emulateMedia({ reducedMotion: "reduce" });
  315 |   await page.goto("/");
  316 |   const hero = page.locator("#top");
  317 |   await expect(hero.locator('picture source[media="(max-width: 767px)"]')).toHaveAttribute(
  318 |     "srcset",
  319 |     "/nepar-background-mobile-900x1600.webp",
  320 |   );
  321 |   await expect(hero.locator(".hero-background-poster")).toBeVisible();
  322 |   await expect(hero.locator('picture img[src="/nepar-background-desktop-2400x900.webp"]')).toBeVisible();
  323 |   await expect(hero.locator("video")).toHaveCount(0);
  324 |   await page.waitForTimeout(600);
  325 |   expect(videoRequests).toEqual([]);
```