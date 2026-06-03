# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mozgalica.spec.js >> Dnevne Asocijacije /mozgalica >> incoming challenge link opens accept screen and compares after play
- Location: e2e\mozgalica.spec.js:148:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('challenge-accept')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByTestId('challenge-accept')

```

```yaml
- banner:
  - link "Njamko početna":
    - /url: /
    - img "Njamko"
  - navigation "Glavna navigacija":
    - link "Igra":
      - /url: "#igra"
    - link "Kako radi":
      - /url: "#kako-radi"
    - link "Razine":
      - /url: "#razine"
    - link "Plus":
      - /url: "#plus"
    - link "Za roditelje":
      - /url: "#roditelji"
  - link "Igraj Njamko":
    - /url: /njamko?igra=1
- main:
  - heading "Njamko - vesela edukativna igra za djecu" [level=1]
  - paragraph: "Montessori-inspirirana edukativna igra za djecu od 3 godine: mirno, jednostavno i pametno učenje kroz izbor."
  - list "Sigurnosne prednosti":
    - listitem: Bez reklama
    - listitem: Bez prijave
    - listitem: Djeca 3+
  - link "Igraj Njamko":
    - /url: /njamko?igra=1
  - region "Sigurno za djecu, jasno za roditelje":
    - text: 3+
    - heading "Sigurno za djecu, jasno za roditelje" [level=2]
    - list "Sigurnosne prednosti Njamka":
      - listitem:
        - strong: Bez reklama
        - text: Igra ne prekida dijete oglasima niti ga vodi na vanjski sadržaj.
      - listitem:
        - strong: Bez prijave
        - text: Dijete ne mora imati profil, račun ni lozinku za igranje.
      - listitem:
        - strong: Podaci ostaju na uređaju
        - text: Napredak se čuva lokalno, bez stvaranja dječjih profila.
      - listitem:
        - strong: Kupnju potvrđuje roditelj
        - text: Dodatne razine su iza roditeljskog kutka, ne iza dječjeg klika.
  - heading "Montessori-inspirirano učenje kroz igru" [level=2]
  - paragraph: "Njamko pomaže djeci da samostalno otkrivaju svijet životinja, hrane i prirode. Svaka aktivnost je jednostavna, mirna i jasna: dijete promatra, bira i uči vlastitim tempom."
  - article:
    - heading "Jednostavno" [level=3]
    - paragraph: Velike kartice, veliki gumbi i jasna pitanja.
  - article:
    - heading "Edukativno" [level=3]
    - paragraph: Djeca povezuju pojmove i uče kroz ponavljanje.
  - article:
    - heading "Veselo" [level=3]
    - paragraph: Mekane animacije, zvjezdice i prijateljske poruke.
  - heading "Počni besplatno, otključaj više kada želiš" [level=2]
  - article:
    - heading "Besplatno" [level=3]
    - paragraph: 0 €
    - list:
      - listitem: ✓ 4 besplatne razine
      - listitem: ✓ 40 edukativnih rundi
      - listitem: ✓ svi modovi dostupni
      - listitem: ✓ bez prijave
      - listitem: ✓ bez reklama
    - link "Igraj besplatno":
      - /url: /njamko?igra=1
  - article:
    - heading "Njamko Plus" [level=3]
    - paragraph: 4,99 €
    - text: jednokratno
    - list:
      - listitem: ✓ 16 dodatnih razina
      - listitem: ✓ 160 novih rundi
      - listitem: ✓ svi modovi otključani
      - listitem: ✓ bez reklama
      - listitem: ✓ bez pretplate
    - link "Otključaj Njamko Plus":
      - /url: /njamko?igra=1
  - paragraph: Kupnju uvijek potvrđuje roditelj.
  - heading "Četiri igre u jednom veselom svijetu" [level=2]
  - article:
    - heading "Nahrani životinju" [level=3]
    - paragraph: Odaberi što životinja voli jesti.
    - paragraph: "Primjer: Zeko → Mrkva"
  - article:
    - heading "Pronađi dom" [level=3]
    - paragraph: Pomogni životinji pronaći gdje živi.
    - paragraph: "Primjer: Riba → Voda"
  - article:
    - heading "Pogodi zvuk" [level=3]
    - paragraph: Poslušaj zvuk i odaberi pravu životinju.
    - paragraph: "Primjer: Muuu! → Krava"
  - article:
    - heading "Mama i beba" [level=3]
    - paragraph: Spoji bebu životinje s mamom.
    - paragraph: "Primjer: Pile → Kokoš"
  - heading "Kako dijete igra?" [level=2]
  - list:
    - listitem:
      - heading "Odaberi igru" [level=3]
      - paragraph: Dijete bira jedan od četiri vesela moda.
    - listitem:
      - heading "Riješi zadatak" [level=3]
      - paragraph: Velike slike i jasna pitanja vode kroz rundu.
    - listitem:
      - heading "Skupi zvjezdice" [level=3]
      - paragraph: Svaki točan odgovor donosi zvjezdice i pohvalu.
  - heading "Zašto roditelji vole Njamko?" [level=2]
  - paragraph: Njamko nije samo još jedna glasna dječja igrica. Osmišljen je kao mirna, Montessori-inspirirana edukativna igra s velikim slikama, jednostavnim izborima i pozitivnim poticanjem samostalnog razmišljanja.
  - heading "Što Njamko nema" [level=3]
  - list "Što Njamko nema":
    - listitem: ✓ bez reklama u igri
    - listitem: ✓ bez chata
    - listitem: ✓ bez dječjih profila
    - listitem: ✓ bez društvenih mreža
    - listitem: ✓ bez prijave
    - listitem: ✓ bez vanjskih poveznica za djecu
  - paragraph: Roditeljski kutak čuva dodatne razine iza kratke provjere, tako da kupnju uvijek potvrđuje odrasla osoba.
  - heading "Često postavljana pitanja" [level=2]
  - article:
    - button "Za koju dob je Njamko?"
  - article:
    - button "Treba li dijete znati čitati?"
  - article:
    - button "Ima li reklama?"
  - article:
    - button "Je li potrebna prijava?"
  - article:
    - button "Što se plaća?"
- contentinfo:
  - img "Njamko"
  - paragraph: Vesela edukativna igra za djecu.
  - navigation "Podnožje":
    - link "Igraj":
      - /url: /njamko?igra=1
    - link "O igri":
      - /url: "#igra"
    - link "Privatnost":
      - /url: "#privatnost"
    - link "Uvjeti korištenja":
      - /url: "#uvjeti"
    - link "Kolačići":
      - /url: "#kolacici"
    - link "Kontakt":
      - /url: "#kontakt"
  - link "Instagram":
    - /url: https://instagram.com/
  - link "Facebook":
    - /url: https://facebook.com/
  - link "YouTube":
    - /url: https://youtube.com/
  - link "Igraj Njamko":
    - /url: /njamko?igra=1
```

# Test source

```ts
  54  |     await page.goto("/mozgalica");
  55  |     await expect(page.getByTestId("puzzle-picker")).toBeVisible();
  56  |     const puzzleCardIds = await page.locator(".mz-puzzle-card").evaluateAll((cards) =>
  57  |       cards.map((card) => card.getAttribute("data-testid")),
  58  |     );
  59  |     expect(puzzleCardIds.slice(0, 5)).toEqual([
  60  |       "puzzle-card-digital-2010s",
  61  |       "puzzle-card-music-2010s",
  62  |       "puzzle-card-film-2010s",
  63  |       "puzzle-card-world-2010s",
  64  |       "puzzle-card-croatia-2010s",
  65  |     ]);
  66  |     await expect(page.getByTestId("puzzle-card-digital-2010s")).toBeVisible();
  67  |     await expect(page.getByTestId("puzzle-card-gaming-2k")).toBeVisible();
  68  |     await expect(page.getByTestId("puzzle-card-nogomet-hr-2000s")).toBeVisible();
  69  |     await expect(page.getByTestId("puzzle-card-muzika-2000s")).toBeVisible();
  70  |     await expect(page.getByTestId("puzzle-card-nba-2000s")).toBeVisible();
  71  |     await expect(page.getByTestId("puzzle-card-hr-filmovi-2000s")).toBeVisible();
  72  |     await expect(page.getByTestId("puzzle-card-gaming-90s")).toBeVisible();
  73  |     await expect(page.getByTestId("puzzle-card-nogomet-hr-90s")).toBeVisible();
  74  |     await expect(page.getByTestId("puzzle-card-muzika-90s")).toBeVisible();
  75  |     await expect(page.getByTestId("puzzle-card-nba-90s")).toBeVisible();
  76  |     await expect(page.getByTestId("puzzle-card-hr-nostalgija")).toBeVisible();
  77  |   });
  78  | 
  79  |   test("start game shows 16 cards", async ({ page }) => {
  80  |     await startGame(page);
  81  |     await expect(page.getByTestId("game-grid").locator(".mz-card")).toHaveCount(16);
  82  |   });
  83  | 
  84  |   test("can select 4 cards", async ({ page }) => {
  85  |     await startGame(page);
  86  |     const group = TEST_PUZZLE.groups[0].items;
  87  |     for (const item of group) {
  88  |       await page.getByTestId(`game-card-${item}`).click();
  89  |     }
  90  |     await expect(page.getByTestId("check-selection")).toBeEnabled();
  91  |   });
  92  | 
  93  |   test("correct group is locked", async ({ page }) => {
  94  |     await startGame(page);
  95  |     await selectGroup(page, TEST_PUZZLE.groups[0].items);
  96  |     await expect(page.getByTestId("game-message")).toContainText(
  97  |       "Točno! Pronašao si grupu.",
  98  |     );
  99  |     await expect(page.getByTestId("solved-group")).toBeVisible();
  100 |     await expect(page.getByTestId("stat-groups")).toContainText("1/4");
  101 |   });
  102 | 
  103 |   test("wrong group shows error message", async ({ page }) => {
  104 |     await startGame(page);
  105 |     const wrongItems = [
  106 |       TEST_PUZZLE.groups[0].items[0],
  107 |       TEST_PUZZLE.groups[1].items[0],
  108 |       TEST_PUZZLE.groups[2].items[0],
  109 |       TEST_PUZZLE.groups[3].items[0],
  110 |     ];
  111 |     await selectGroup(page, wrongItems);
  112 |     await expect(page.getByTestId("game-message")).toContainText(
  113 |       "Nije točno, pokušaj ponovno.",
  114 |     );
  115 |     await expect(page.getByTestId("stat-attempts")).toContainText("1");
  116 |   });
  117 | 
  118 |   test("completing all groups shows result", async ({ page }) => {
  119 |     await startGame(page);
  120 |     await solveAllGroups(page);
  121 |     await expect(page.getByTestId("result-panel")).toBeVisible({ timeout: 5000 });
  122 |     await expect(page.getByText("Bravo!")).toBeVisible();
  123 |     await expect(page.getByTestId("result-groups")).toContainText("4/4");
  124 |   });
  125 | 
  126 |   test("landing challenge demo opens invite screen with link", async ({ page }) => {
  127 |     await page.goto("/mozgalica");
  128 |     await page.getByTestId("landing-challenge-demo").click();
  129 |     await expect(page.getByTestId("challenge-invite")).toBeVisible();
  130 |     await expect(page.getByTestId("challenge-link")).toHaveValue(/\/mozgalica\?od=/);
  131 |     await expect(page.getByText("Izazovi prijatelja")).toBeVisible();
  132 |   });
  133 | 
  134 |   test("challenge friends after win shows shareable link", async ({ page }) => {
  135 |     await startGame(page);
  136 |     await solveAllGroups(page);
  137 |     await expect(page.getByTestId("result-panel")).toBeVisible({ timeout: 5000 });
  138 |     await page.getByTestId("challenge-friends").click();
  139 |     await expect(page.getByTestId("challenge-invite")).toBeVisible();
  140 |     await expect(page.getByTestId("challenge-link")).toHaveValue(/\/mozgalica\?od=/);
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
> 154 |     await expect(page.getByTestId("challenge-accept")).toBeVisible();
      |                                                        ^ Error: expect(locator).toBeVisible() failed
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
  241 |     await expect(page).toHaveScreenshot("landing-desktop.png", {
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
```