# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mozgalica.spec.js >> Dnevne Asocijacije /mozgalica >> can select 4 cards
- Location: e2e\mozgalica.spec.js:84:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByTestId('puzzle-card-digital-2010s')

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
> 16  |   await page.getByTestId(`puzzle-card-${puzzleId}`).click();
      |                                                     ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
```