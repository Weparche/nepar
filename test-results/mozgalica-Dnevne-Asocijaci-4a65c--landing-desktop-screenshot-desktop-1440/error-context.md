# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mozgalica.spec.js >> Dnevne Asocijacije screenshots >> landing desktop screenshot
- Location: e2e\mozgalica.spec.js:236:3

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  Expected an image 1440px by 3288px, received 1440px by 2024px. 677558 pixels (ratio 0.15 of all image pixels) are different.

  Snapshot: landing-desktop.png

Call log:
  - Expect "toHaveScreenshot(landing-desktop.png)" with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - Expected an image 1440px by 3288px, received 1440px by 2024px. 677558 pixels (ratio 0.15 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - Expected an image 1440px by 3288px, received 1440px by 2024px. 677558 pixels (ratio 0.15 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - generic [ref=e5]:
      - link "Njamko početna" [ref=e6] [cursor=pointer]:
        - /url: /
        - img "Njamko" [ref=e7]
      - navigation "Glavna navigacija" [ref=e8]:
        - link "Igra" [ref=e9] [cursor=pointer]:
          - /url: "#igra"
        - link "Kako radi" [ref=e10] [cursor=pointer]:
          - /url: "#kako-radi"
        - link "Razine" [ref=e11] [cursor=pointer]:
          - /url: "#razine"
        - link "Plus" [ref=e12] [cursor=pointer]:
          - /url: "#plus"
        - link "Za roditelje" [ref=e13] [cursor=pointer]:
          - /url: "#roditelji"
      - link "Igraj Njamko" [ref=e14] [cursor=pointer]:
        - /url: /njamko?igra=1
  - main [ref=e15]:
    - generic [ref=e19]:
      - heading "Njamko - vesela edukativna igra za djecu" [level=1] [ref=e20]:
        - generic [ref=e21]: Njamko - vesela
        - generic [ref=e22]: edukativna igra
        - generic [ref=e23]: za djecu
      - paragraph [ref=e24]: "Montessori-inspirirana edukativna igra za djecu od 3 godine: mirno, jednostavno i pametno učenje kroz izbor."
      - list "Sigurnosne prednosti" [ref=e25]:
        - listitem [ref=e26]:
          - img [ref=e27]
          - generic [ref=e30]: Bez reklama
        - listitem [ref=e31]:
          - img [ref=e32]
          - generic [ref=e35]: Bez prijave
        - listitem [ref=e36]:
          - img [ref=e37]
          - generic [ref=e39]: Djeca 3+
      - link "Igraj Njamko" [ref=e41] [cursor=pointer]:
        - /url: /njamko?igra=1
        - img [ref=e42]
        - text: Igraj Njamko
    - region "Sigurno za djecu, jasno za roditelje" [ref=e44]:
      - generic [ref=e45]:
        - generic [ref=e46]:
          - generic "Primjereno za djecu od 3 godine nadalje" [ref=e47]: 3+
          - heading "Sigurno za djecu, jasno za roditelje" [level=2] [ref=e48]
        - list "Sigurnosne prednosti Njamka" [ref=e49]:
          - listitem [ref=e50]:
            - img [ref=e52]
            - generic [ref=e55]:
              - strong [ref=e56]: Bez reklama
              - generic [ref=e57]: Igra ne prekida dijete oglasima niti ga vodi na vanjski sadržaj.
          - listitem [ref=e58]:
            - img [ref=e60]
            - generic [ref=e63]:
              - strong [ref=e64]: Bez prijave
              - generic [ref=e65]: Dijete ne mora imati profil, račun ni lozinku za igranje.
          - listitem [ref=e66]:
            - img [ref=e68]
            - generic [ref=e72]:
              - strong [ref=e73]: Podaci ostaju na uređaju
              - generic [ref=e74]: Napredak se čuva lokalno, bez stvaranja dječjih profila.
          - listitem [ref=e75]:
            - img [ref=e77]
            - generic [ref=e81]:
              - strong [ref=e82]: Kupnju potvrđuje roditelj
              - generic [ref=e83]: Dodatne razine su iza roditeljskog kutka, ne iza dječjeg klika.
    - generic [ref=e85]:
      - generic [ref=e86]:
        - heading "Montessori-inspirirano učenje kroz igru" [level=2] [ref=e87]
        - paragraph [ref=e88]: "Njamko pomaže djeci da samostalno otkrivaju svijet životinja, hrane i prirode. Svaka aktivnost je jednostavna, mirna i jasna: dijete promatra, bira i uči vlastitim tempom."
      - generic "Prednosti igre" [ref=e89]:
        - article [ref=e90]:
          - img [ref=e92]
          - heading "Jednostavno" [level=3] [ref=e96]
          - paragraph [ref=e97]: Velike kartice, veliki gumbi i jasna pitanja.
        - article [ref=e98]:
          - img [ref=e100]
          - heading "Edukativno" [level=3] [ref=e104]
          - paragraph [ref=e105]: Djeca povezuju pojmove i uče kroz ponavljanje.
        - article [ref=e106]:
          - img [ref=e108]
          - heading "Veselo" [level=3] [ref=e110]
          - paragraph [ref=e111]: Mekane animacije, zvjezdice i prijateljske poruke.
      - generic [ref=e112]:
        - heading "Počni besplatno, otključaj više kada želiš" [level=2] [ref=e113]
        - generic [ref=e114]:
          - article [ref=e115]:
            - heading "Besplatno" [level=3] [ref=e116]
            - paragraph [ref=e117]: 0 €
            - list [ref=e118]:
              - listitem [ref=e119]: ✓ 4 besplatne razine
              - listitem [ref=e120]: ✓ 40 edukativnih rundi
              - listitem [ref=e121]: ✓ svi modovi dostupni
              - listitem [ref=e122]: ✓ bez prijave
              - listitem [ref=e123]: ✓ bez reklama
            - link "Igraj besplatno" [ref=e124] [cursor=pointer]:
              - /url: /njamko?igra=1
          - article [ref=e125]:
            - img [ref=e127]:
              - generic [ref=e130]: ★
            - heading "Njamko Plus" [level=3] [ref=e131]
            - paragraph [ref=e132]: 4,99 €
            - generic [ref=e133]: jednokratno
            - list [ref=e134]:
              - listitem [ref=e135]: ✓ 16 dodatnih razina
              - listitem [ref=e136]: ✓ 160 novih rundi
              - listitem [ref=e137]: ✓ svi modovi otključani
              - listitem [ref=e138]: ✓ bez reklama
              - listitem [ref=e139]: ✓ bez pretplate
            - link "Otključaj Njamko Plus" [ref=e140] [cursor=pointer]:
              - /url: /njamko?igra=1
        - paragraph [ref=e141]: Kupnju uvijek potvrđuje roditelj.
    - generic [ref=e143]:
      - heading "Četiri igre u jednom veselom svijetu" [level=2] [ref=e144]
      - generic [ref=e145]:
        - article [ref=e146]:
          - img [ref=e148]
          - generic [ref=e152]:
            - heading "Nahrani životinju" [level=3] [ref=e153]
            - paragraph [ref=e154]: Odaberi što životinja voli jesti.
            - paragraph [ref=e155]: "Primjer: Zeko → Mrkva"
        - article [ref=e156]:
          - img [ref=e158]
          - generic [ref=e163]:
            - heading "Pronađi dom" [level=3] [ref=e164]
            - paragraph [ref=e165]: Pomogni životinji pronaći gdje živi.
            - paragraph [ref=e166]: "Primjer: Riba → Voda"
        - article [ref=e167]:
          - img [ref=e169]
          - generic [ref=e172]:
            - heading "Pogodi zvuk" [level=3] [ref=e173]
            - paragraph [ref=e174]: Poslušaj zvuk i odaberi pravu životinju.
            - paragraph [ref=e175]: "Primjer: Muuu! → Krava"
        - article [ref=e176]:
          - img [ref=e178]
          - generic [ref=e187]:
            - heading "Mama i beba" [level=3] [ref=e188]
            - paragraph [ref=e189]: Spoji bebu životinje s mamom.
            - paragraph [ref=e190]: "Primjer: Pile → Kokoš"
    - generic [ref=e192]:
      - generic [ref=e193]:
        - heading "Kako dijete igra?" [level=2] [ref=e194]
        - list [ref=e195]:
          - listitem [ref=e196]:
            - generic [ref=e197]: "1"
            - generic [ref=e199]:
              - generic [ref=e200]: Nahrani
              - generic [ref=e201]: Dom
              - generic [ref=e202]: Zvuk
            - heading "Odaberi igru" [level=3] [ref=e203]
            - paragraph [ref=e204]: Dijete bira jedan od četiri vesela moda.
          - listitem [ref=e205]:
            - generic [ref=e206]: "2"
            - generic [ref=e208]:
              - generic [ref=e209]: Što jede zeko?
              - generic [ref=e210]:
                - generic [ref=e211]: 🥕
                - generic [ref=e212]: 🌿
                - generic [ref=e213]: 🦴
            - heading "Riješi zadatak" [level=3] [ref=e214]
            - paragraph [ref=e215]: Velike slike i jasna pitanja vode kroz rundu.
          - listitem [ref=e216]:
            - generic [ref=e217]: "3"
            - generic [ref=e219]:
              - generic [ref=e220]: ⭐
              - generic [ref=e221]: ⭐
              - generic [ref=e222]: ⭐
              - paragraph [ref=e223]: Bravo!
            - heading "Skupi zvjezdice" [level=3] [ref=e224]
            - paragraph [ref=e225]: Svaki točan odgovor donosi zvjezdice i pohvalu.
      - generic [ref=e226]:
        - heading "Zašto roditelji vole Njamko?" [level=2] [ref=e227]
        - paragraph [ref=e228]: Njamko nije samo još jedna glasna dječja igrica. Osmišljen je kao mirna, Montessori-inspirirana edukativna igra s velikim slikama, jednostavnim izborima i pozitivnim poticanjem samostalnog razmišljanja.
        - heading "Što Njamko nema" [level=3] [ref=e229]
        - list "Što Njamko nema" [ref=e230]:
          - listitem [ref=e231]: ✓ bez reklama u igri
          - listitem [ref=e232]: ✓ bez chata
          - listitem [ref=e233]: ✓ bez dječjih profila
          - listitem [ref=e234]: ✓ bez društvenih mreža
          - listitem [ref=e235]: ✓ bez prijave
          - listitem [ref=e236]: ✓ bez vanjskih poveznica za djecu
        - generic [ref=e237]:
          - img [ref=e238]
          - paragraph [ref=e242]: Roditeljski kutak čuva dodatne razine iza kratke provjere, tako da kupnju uvijek potvrđuje odrasla osoba.
        - img [ref=e244]
      - generic [ref=e251]:
        - heading "Često postavljana pitanja" [level=2] [ref=e252]
        - generic [ref=e253]:
          - article [ref=e254]:
            - button "Za koju dob je Njamko?" [ref=e255] [cursor=pointer]:
              - generic [ref=e256]: Za koju dob je Njamko?
              - generic [ref=e257]: +
          - article [ref=e258]:
            - button "Treba li dijete znati čitati?" [ref=e259] [cursor=pointer]:
              - generic [ref=e260]: Treba li dijete znati čitati?
              - generic [ref=e261]: +
          - article [ref=e262]:
            - button "Ima li reklama?" [ref=e263] [cursor=pointer]:
              - generic [ref=e264]: Ima li reklama?
              - generic [ref=e265]: +
          - article [ref=e266]:
            - button "Je li potrebna prijava?" [ref=e267] [cursor=pointer]:
              - generic [ref=e268]: Je li potrebna prijava?
              - generic [ref=e269]: +
          - article [ref=e270]:
            - button "Što se plaća?" [ref=e271] [cursor=pointer]:
              - generic [ref=e272]: Što se plaća?
              - generic [ref=e273]: +
  - contentinfo [ref=e274]:
    - generic [ref=e275]:
      - generic [ref=e276]:
        - img "Njamko" [ref=e277]
        - paragraph [ref=e278]: Vesela edukativna igra za djecu.
      - navigation "Podnožje" [ref=e279]:
        - link "Igraj" [ref=e280] [cursor=pointer]:
          - /url: /njamko?igra=1
        - link "O igri" [ref=e281] [cursor=pointer]:
          - /url: "#igra"
        - link "Privatnost" [ref=e282] [cursor=pointer]:
          - /url: "#privatnost"
        - link "Uvjeti korištenja" [ref=e283] [cursor=pointer]:
          - /url: "#uvjeti"
        - link "Kolačići" [ref=e284] [cursor=pointer]:
          - /url: "#kolacici"
        - link "Kontakt" [ref=e285] [cursor=pointer]:
          - /url: "#kontakt"
      - generic "Društvene mreže" [ref=e286]:
        - link "Instagram" [ref=e287] [cursor=pointer]:
          - /url: https://instagram.com/
          - img [ref=e288]
        - link "Facebook" [ref=e292] [cursor=pointer]:
          - /url: https://facebook.com/
          - img [ref=e293]
        - link "YouTube" [ref=e295] [cursor=pointer]:
          - /url: https://youtube.com/
          - img [ref=e296]
      - link "Igraj Njamko" [ref=e298] [cursor=pointer]:
        - /url: /njamko?igra=1
```

# Test source

```ts
  141 |     await expect(page.getByTestId("challenge-link")).toHaveValue(/tema=/);
  142 | 
  143 |     const shareText = await page.getByTestId("challenge-share-text-hidden").inputValue();
  144 |     const linkMatches = shareText.match(/\/mozgalica\?od=[^\s]+/g) ?? [];
  145 |     expect(linkMatches).toHaveLength(1);
  146 |   });
  147 | 
  148 |   test("incoming challenge link opens accept screen and compares after play", async ({
  149 |     page,
  150 |   }) => {
  151 |     await page.goto(
  152 |       `/mozgalica?od=Ivan&p=7&t=151&tema=${TEST_PUZZLE_ID}`,
  153 |     );
  154 |     await expect(page.getByTestId("challenge-accept")).toBeVisible();
  155 |     await expect(page.getByText("Ivan te izaziva!")).toBeVisible();
  156 |     await expect(page.getByText(TEST_PUZZLE.title)).toBeVisible();
  157 | 
  158 |     await page.evaluate((items) => {
  159 |       sessionStorage.setItem("mozgalica-test-order", JSON.stringify(items));
  160 |     }, getMockupItems(TEST_PUZZLE_ID));
  161 |     await page.getByTestId("accept-challenge").click();
  162 |     await expect(page.getByTestId("game-board")).toBeVisible();
  163 |     await solveAllGroups(page);
  164 | 
  165 |     await expect(page.getByTestId("challenge-result")).toBeVisible({ timeout: 5000 });
  166 |     await expect(page.getByTestId("challenge-winner")).toBeVisible();
  167 |     await expect(page.getByTestId("notify-challenger")).toBeVisible();
  168 |     await expect(page.getByTestId("challenge-notify-hint")).toBeVisible();
  169 |   });
  170 | 
  171 |   test("result link shows comparison for challenger without playing", async ({
  172 |     page,
  173 |   }) => {
  174 |     await page.goto(
  175 |       `/mozgalica?od=Wepar&p=1&t=42&tema=${TEST_PUZZLE_ID}&rn=Marko&rp=3&rt=78`,
  176 |     );
  177 |     await expect(page.getByTestId("challenge-result")).toBeVisible();
  178 |     await expect(page.getByText("Marko je odigrao izazov")).toBeVisible();
  179 |     await expect(page.getByTestId("challenge-winner")).toBeVisible();
  180 |     await expect(page.getByTestId("notify-challenger")).toHaveCount(0);
  181 |     await expect(page.getByTestId("challenge-done")).toBeVisible();
  182 |   });
  183 | 
  184 |   test("nav Izazovi prijatelja scrolls to challenge section", async ({ page, isMobile }) => {
  185 |     await page.goto("/mozgalica");
  186 |     if (isMobile) {
  187 |       await page.getByRole("button", { name: "Otvori izbornik" }).click();
  188 |       await page.locator(".mz-mobile-nav").getByRole("button", { name: "Izazovi prijatelja" }).click();
  189 |     } else {
  190 |       await page.locator(".mz-nav").getByRole("button", { name: "Izazovi prijatelja" }).click();
  191 |     }
  192 |     await expect(page.getByTestId("landing-challenge-demo")).toBeVisible();
  193 |   });
  194 | 
  195 |   test("start-game scrolls to puzzle picker", async ({ page }) => {
  196 |     await page.goto("/mozgalica");
  197 |     await page.getByTestId("start-game").click();
  198 |     await expect(page.getByTestId("puzzle-picker")).toBeInViewport();
  199 |   });
  200 | 
  201 |   test("mobile viewport layout is intact", async ({ page, isMobile }) => {
  202 |     test.skip(!isMobile, "Mobile-only layout check");
  203 |     await page.goto("/mozgalica");
  204 |     await expect(page.getByTestId("landing-header")).toBeVisible();
  205 |     await expect(page.getByTestId("hero-title")).toBeVisible();
  206 |     await startGame(page);
  207 |     const box = await page.getByTestId("game-grid").boundingBox();
  208 |     expect(box?.width).toBeGreaterThan(0);
  209 |     await expect(page.getByTestId("check-selection")).toBeVisible();
  210 |   });
  211 | 
  212 |   test("1440p desktop layout uses wide content and readable game grid", async ({
  213 |     page,
  214 |   }) => {
  215 |     test.skip(test.info().project.name !== "desktop-1440", "1440p only");
  216 |     await page.goto("/mozgalica");
  217 | 
  218 |     const hero = await page.getByTestId("landing-hero").boundingBox();
  219 |     expect(hero?.width).toBeGreaterThan(1100);
  220 | 
  221 |     await startGame(page);
  222 |     const grid = await page.getByTestId("game-grid").boundingBox();
  223 |     expect(grid?.width).toBeGreaterThan(520);
  224 |     expect(grid?.width).toBeLessThan(720);
  225 | 
  226 |     const card = await page.getByTestId("game-grid").locator(".mz-card").first().boundingBox();
  227 |     expect(card?.height).toBeGreaterThanOrEqual(84);
  228 |   });
  229 | });
  230 | 
  231 | test.describe("Dnevne Asocijacije screenshots", () => {
  232 |   test.beforeEach(async ({ page }) => {
  233 |     await prepareScreenshotPage(page);
  234 |   });
  235 | 
  236 |   test("landing desktop screenshot", async ({ page, isMobile }) => {
  237 |     test.skip(isMobile, "Desktop-only screenshot");
  238 |     await page.goto("/mozgalica");
  239 |     await expect(page.getByTestId("hero-title")).toBeVisible();
  240 |     await page.waitForTimeout(500);
> 241 |     await expect(page).toHaveScreenshot("landing-desktop.png", {
      |                        ^ Error: expect(page).toHaveScreenshot(expected) failed
  242 |       fullPage: true,
  243 |     });
  244 |   });
  245 | 
  246 |   test("landing mobile screenshot", async ({ page, isMobile }) => {
  247 |     test.skip(!isMobile, "Mobile-only screenshot");
  248 |     await page.goto("/mozgalica");
  249 |     await expect(page.getByTestId("hero-title")).toBeVisible();
  250 |     await page.waitForTimeout(500);
  251 |     await expect(page).toHaveScreenshot("landing-mobile.png", {
  252 |       fullPage: true,
  253 |     });
  254 |   });
  255 | 
  256 |   test("game mobile screenshot", async ({ page, isMobile }) => {
  257 |     test.skip(!isMobile, "Mobile-only screenshot");
  258 |     await startGame(page);
  259 |     await page.waitForTimeout(500);
  260 |     await expect(page).toHaveScreenshot("game-mobile.png", {
  261 |       fullPage: true,
  262 |     });
  263 |   });
  264 | 
  265 |   test("result screenshot", async ({ page, isMobile }) => {
  266 |     await startGame(page);
  267 |     await solveAllGroups(page);
  268 |     await expect(page.getByTestId("result-panel")).toBeVisible({ timeout: 5000 });
  269 |     await page.waitForTimeout(500);
  270 |     await expect(page).toHaveScreenshot(
  271 |       isMobile ? "result-mobile.png" : "result-desktop.png",
  272 |       { fullPage: true },
  273 |     );
  274 |   });
  275 | 
  276 |   test("challenge invite screenshot", async ({ page, isMobile }) => {
  277 |     await startGame(page);
  278 |     await solveAllGroups(page);
  279 |     await expect(page.getByTestId("result-panel")).toBeVisible({ timeout: 5000 });
  280 |     await page.getByTestId("challenge-friends").click();
  281 |     await expect(page.getByTestId("challenge-invite")).toBeVisible();
  282 |     await page.waitForTimeout(500);
  283 |     await expect(page).toHaveScreenshot(
  284 |       isMobile ? "challenge-invite-mobile.png" : "challenge-invite-desktop.png",
  285 |       { fullPage: true },
  286 |     );
  287 |   });
  288 | 
  289 |   test("landing 1440p screenshot", async ({ page }) => {
  290 |     test.skip(test.info().project.name !== "desktop-1440", "1440p only");
  291 |     await page.goto("/mozgalica");
  292 |     await expect(page.getByTestId("hero-title")).toBeVisible();
  293 |     await page.waitForTimeout(500);
  294 |     await expect(page).toHaveScreenshot("landing-1440.png", { fullPage: true });
  295 |   });
  296 | 
  297 |   test("game 1440p screenshot", async ({ page }) => {
  298 |     test.skip(test.info().project.name !== "desktop-1440", "1440p only");
  299 |     await startGame(page);
  300 |     await page.waitForTimeout(500);
  301 |     await expect(page).toHaveScreenshot("game-1440.png", { fullPage: true });
  302 |   });
  303 | 
  304 |   test("result 1440p screenshot", async ({ page }) => {
  305 |     test.skip(test.info().project.name !== "desktop-1440", "1440p only");
  306 |     await startGame(page);
  307 |     await solveAllGroups(page);
  308 |     await expect(page.getByTestId("result-panel")).toBeVisible({ timeout: 5000 });
  309 |     await page.waitForTimeout(500);
  310 |     await expect(page).toHaveScreenshot("result-1440.png", { fullPage: true });
  311 |   });
  312 | });
  313 | 
```