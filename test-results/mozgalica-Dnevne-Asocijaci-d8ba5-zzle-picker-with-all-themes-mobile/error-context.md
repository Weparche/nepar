# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mozgalica.spec.js >> Dnevne Asocijacije /mozgalica >> landing shows puzzle picker with all themes
- Location: e2e\mozgalica.spec.js:53:3

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 3
+ Received  + 3

  Array [
+   "puzzle-card-zene-40-beauty",
+   "puzzle-card-zene-40-dom",
+   "puzzle-card-zene-40-wellness",
    "puzzle-card-digital-2020s",
    "puzzle-card-croatia-2020s",
-   "puzzle-card-internet-2020s",
-   "puzzle-card-world-2020s",
-   "puzzle-card-tech-2020s",
  ]
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - banner [ref=e4]:
      - generic [ref=e5]:
        - link "Dnevne Asocijacije" [ref=e6] [cursor=pointer]:
          - /url: /mozgalica
          - generic [ref=e7]:
            - generic [ref=e12]: "?"
            - generic [ref=e13]:
              - text: Dnevne
              - text: Asocijacije
        - button "Igraj danas" [ref=e15] [cursor=pointer]
        - button "Otvori izbornik" [ref=e16] [cursor=pointer]:
          - img [ref=e17]
    - generic [ref=e18]:
      - generic [ref=e19]:
        - heading "Mozgalica za žene 40+." [level=1] [ref=e20]
        - paragraph [ref=e21]: Poveži 16 pojmova u 4 skrivene grupe, od ruža, SPF-a i retinola do čišćenja doma, wellnessa i malih rituala koji čuvaju mir u danu.
        - generic [ref=e22]:
          - button "Odaberi mozgalicu" [ref=e23] [cursor=pointer]
          - button "Kako se igra" [ref=e24] [cursor=pointer]
      - generic [ref=e25]:
        - paragraph [ref=e26]: Primjer kartica
        - generic [ref=e27]:
          - generic [ref=e28]: Primer
          - generic [ref=e29]: Maskara
          - generic [ref=e30]: Retinol
          - generic [ref=e31]: Ruž
          - generic [ref=e32]: Puder
          - generic [ref=e33]: Sjenilo
          - generic [ref=e34]: Hijaluron
          - generic [ref=e35]: Parfem
          - generic [ref=e36]: Korektor
          - generic [ref=e37]: Olovka
          - generic [ref=e38]: SPF
          - generic [ref=e39]: Maramice
          - generic [ref=e40]: Fiksator
          - generic [ref=e41]: Gel za obrve
          - generic [ref=e42]: Serum
          - generic [ref=e43]: Puder u kamenu
    - generic [ref=e44]:
      - generic [ref=e45]:
        - paragraph [ref=e46]: Odaberi temu
        - heading "Mozgalice po temama" [level=2] [ref=e47]
        - paragraph [ref=e48]: Svaka tema ima 16 pojmova u 4 skrivene grupe. Klikni karticu i odmah kreće igra, bez registracije.
      - generic [ref=e49]:
        - generic [ref=e50]:
          - heading "Za žene 40+" [level=3] [ref=e51]
          - paragraph [ref=e52]: Šminka, njega, dom, čišćenje, wellness i male svakodnevne pobjede
        - generic [ref=e53]:
          - button "40+ Beauty 40+ Sminka, njega koze i mali rituali koji rade razliku Odabrano" [pressed] [ref=e54] [cursor=pointer]:
            - generic [ref=e55]: 40+
            - generic [ref=e56]: 💄
            - heading "Beauty 40+" [level=3] [ref=e57]
            - paragraph [ref=e58]: Sminka, njega koze i mali rituali koji rade razliku
            - generic [ref=e59]:
              - generic [ref=e60]: Make-up baza
              - generic [ref=e61]: Oci i obrve
              - generic [ref=e62]: Njega koze
              - generic [ref=e63]: Torba za izlazak
            - generic [ref=e64]:
              - text: Odabrano
              - generic [ref=e65]: →
          - button "40+ Dom i čišćenje 40+ Kuhinja, kupaonica, rublje i trikovi za uredan dom Igraj" [ref=e66] [cursor=pointer]:
            - generic [ref=e67]: 40+
            - generic [ref=e68]: 🧼
            - heading "Dom i čišćenje 40+" [level=3] [ref=e69]
            - paragraph [ref=e70]: Kuhinja, kupaonica, rublje i trikovi za uredan dom
            - generic [ref=e71]:
              - generic [ref=e72]: Kuhinja
              - generic [ref=e73]: Kupaonica
              - generic [ref=e74]: Rublje
              - generic [ref=e75]: Organizacija
            - generic [ref=e76]:
              - text: Igraj
              - generic [ref=e77]: →
          - button "40+ Wellness 40+ Zdravlje, odmor, prijateljice i vrijeme za sebe Igraj" [ref=e78] [cursor=pointer]:
            - generic [ref=e79]: 40+
            - generic [ref=e80]: 🌿
            - heading "Wellness 40+" [level=3] [ref=e81]
            - paragraph [ref=e82]: Zdravlje, odmor, prijateljice i vrijeme za sebe
            - generic [ref=e83]:
              - generic [ref=e84]: Malo mira
              - generic [ref=e85]: Kretanje
              - generic [ref=e86]: Zdravlje
              - generic [ref=e87]: Druzenje
            - generic [ref=e88]:
              - text: Igraj
              - generic [ref=e89]: →
      - generic [ref=e90]:
        - generic [ref=e91]:
          - heading "2020-e" [level=3] [ref=e92]
          - paragraph [ref=e93]: AI, TikTok, pandemija, Hrvatska i tehnologija
        - generic [ref=e94]:
          - button "2020-e Digitalne 2020-e AI, kratki video i alati za rad od kuće Igraj" [ref=e95] [cursor=pointer]:
            - generic [ref=e96]: 2020-e
            - generic [ref=e97]: 🤖
            - heading "Digitalne 2020-e" [level=3] [ref=e98]
            - paragraph [ref=e99]: AI, kratki video i alati za rad od kuće
            - generic [ref=e100]:
              - generic [ref=e101]: Umjetna inteligencija
              - generic [ref=e102]: Video trendovi
              - generic [ref=e103]: Rad na daljinu
              - generic [ref=e104]: Digitalni alati
            - generic [ref=e105]:
              - text: Igraj
              - generic [ref=e106]: →
          - button "2020-e Hrvatska u 2020-ima Euro, Schengen, potres i Eurosong Igraj" [ref=e107] [cursor=pointer]:
            - generic [ref=e108]: 2020-e
            - generic [ref=e109]: 🇭🇷
            - heading "Hrvatska u 2020-ima" [level=3] [ref=e110]
            - paragraph [ref=e111]: Euro, Schengen, potres i Eurosong
            - generic [ref=e112]:
              - generic [ref=e113]: Nova valuta
              - generic [ref=e114]: Slobodno kretanje
              - generic [ref=e115]: Potres
              - generic [ref=e116]: Glazbeni uspjeh
            - generic [ref=e117]:
              - text: Igraj
              - generic [ref=e118]: →
          - button "2020-e Internet kultura 2020-ih Memeovi, influenceri i viralni sadržaj Igraj" [ref=e119] [cursor=pointer]:
            - generic [ref=e120]: 2020-e
            - generic [ref=e121]: 🌐
            - heading "Internet kultura 2020-ih" [level=3] [ref=e122]
            - paragraph [ref=e123]: Memeovi, influenceri i viralni sadržaj
            - generic [ref=e124]:
              - generic [ref=e125]: Meme kultura
              - generic [ref=e126]: Društvene mreže
              - generic [ref=e127]: Novi mediji
              - generic [ref=e128]: Viralni sadržaj
            - generic [ref=e129]:
              - text: Igraj
              - generic [ref=e130]: →
          - button "2020-e Svijet 2020-ih Pandemija, rat, inflacija i klima Igraj" [ref=e131] [cursor=pointer]:
            - generic [ref=e132]: 2020-e
            - generic [ref=e133]: 🌍
            - heading "Svijet 2020-ih" [level=3] [ref=e134]
            - paragraph [ref=e135]: Pandemija, rat, inflacija i klima
            - generic [ref=e136]:
              - generic [ref=e137]: Pandemija
              - generic [ref=e138]: Rat u Ukrajini
              - generic [ref=e139]: Poskupljenja
              - generic [ref=e140]: Klimatske promjene
            - generic [ref=e141]:
              - text: Igraj
              - generic [ref=e142]: →
          - button "2020-e Tehnologija 2020-ih EV, kripto, SpaceX i nosiva tehnologija Igraj" [ref=e143] [cursor=pointer]:
            - generic [ref=e144]: 2020-e
            - generic [ref=e145]: 🚀
            - heading "Tehnologija 2020-ih" [level=3] [ref=e146]
            - paragraph [ref=e147]: EV, kripto, SpaceX i nosiva tehnologija
            - generic [ref=e148]:
              - generic [ref=e149]: Elektromobilnost
              - generic [ref=e150]: Kripto svijet
              - generic [ref=e151]: Svemirska utrka
              - generic [ref=e152]: Nosiva tehnologija
            - generic [ref=e153]:
              - text: Igraj
              - generic [ref=e154]: →
      - generic [ref=e155]:
        - generic [ref=e156]:
          - heading "2010-e" [level=3] [ref=e157]
          - paragraph [ref=e158]: Digitalna era, hitovi, filmovi, svijet i Hrvatska
        - generic [ref=e159]:
          - button "2010-e Digitalne 2010-e Društvene mreže, streaming i smartphone era Igraj" [ref=e160] [cursor=pointer]:
            - generic [ref=e161]: 2010-e
            - generic [ref=e162]: 📱
            - heading "Digitalne 2010-e" [level=3] [ref=e163]
            - paragraph [ref=e164]: Društvene mreže, streaming i smartphone era
            - generic [ref=e165]:
              - generic [ref=e166]: Društvene mreže
              - generic [ref=e167]: Streaming
              - generic [ref=e168]: Dostava i prijevoz
              - generic [ref=e169]: Smartphone
            - generic [ref=e170]:
              - text: Igraj
              - generic [ref=e171]: →
          - button "2010-e Glazba 2010-ih Hitovi, playliste i viralni plesovi Igraj" [ref=e172] [cursor=pointer]:
            - generic [ref=e173]: 2010-e
            - generic [ref=e174]: 🎧
            - heading "Glazba 2010-ih" [level=3] [ref=e175]
            - paragraph [ref=e176]: Hitovi, playliste i viralni plesovi
            - generic [ref=e177]:
              - generic [ref=e178]: Ljetni hit
              - generic [ref=e179]: Pop diva
              - generic [ref=e180]: Slušanje glazbe
              - generic [ref=e181]: Internet hit
            - generic [ref=e182]:
              - text: Igraj
              - generic [ref=e183]: →
          - button "2010-e Filmovi i serije 2010-ih Marvel, HBO i animirani hitovi Igraj" [ref=e184] [cursor=pointer]:
            - generic [ref=e185]: 2010-e
            - generic [ref=e186]: 🎬
            - heading "Filmovi i serije 2010-ih" [level=3] [ref=e187]
            - paragraph [ref=e188]: Marvel, HBO i animirani hitovi
            - generic [ref=e189]:
              - generic [ref=e190]: Frozen
              - generic [ref=e191]: Game of Thrones
              - generic [ref=e192]: Marvel
              - generic [ref=e193]: Joker
            - generic [ref=e194]:
              - text: Igraj
              - generic [ref=e195]: →
          - button "2010-e Svijet 2010-ih Sport, politika i klimatski pokreti Igraj" [ref=e196] [cursor=pointer]:
            - generic [ref=e197]: 2010-e
            - generic [ref=e198]: 🌍
            - heading "Svijet 2010-ih" [level=3] [ref=e199]
            - paragraph [ref=e200]: Sport, politika i klimatski pokreti
            - generic [ref=e201]:
              - generic [ref=e202]: Svjetsko prvenstvo
              - generic [ref=e203]: Olimpijske igre
              - generic [ref=e204]: Politika
              - generic [ref=e205]: Klimatske promjene
            - generic [ref=e206]:
              - text: Igraj
              - generic [ref=e207]: →
          - button "2010-e Hrvatska 2010-ih EU, Vatreni i domaća pop scena Igraj" [ref=e208] [cursor=pointer]:
            - generic [ref=e209]: 2010-e
            - generic [ref=e210]: 🇭🇷
            - heading "Hrvatska 2010-ih" [level=3] [ref=e211]
            - paragraph [ref=e212]: EU, Vatreni i domaća pop scena
            - generic [ref=e213]:
              - generic [ref=e214]: EU
              - generic [ref=e215]: Svjetsko prvenstvo
              - generic [ref=e216]: Hrvatska glazbena scena
              - generic [ref=e217]: Online život
            - generic [ref=e218]:
              - text: Igraj
              - generic [ref=e219]: →
      - generic [ref=e220]:
        - generic [ref=e221]:
          - heading "2000-e i 90-e" [level=3] [ref=e222]
          - paragraph [ref=e223]: Gaming, sport, glazba, NBA i nostalgija
        - generic [ref=e224]:
          - 'button "Gaming 2K Gaming 2000-ih: PC klasici, PS2 i online era Igraj" [ref=e225] [cursor=pointer]':
            - generic [ref=e226]: 🎮
            - heading "Gaming 2K" [level=3] [ref=e227]
            - paragraph [ref=e228]: "Gaming 2000-ih: PC klasici, PS2 i online era"
            - generic [ref=e229]:
              - generic [ref=e230]: PC klasici
              - generic [ref=e231]: PlayStation 2
              - generic [ref=e232]: Nintendo era
              - generic [ref=e233]: LAN i internet
            - generic [ref=e234]:
              - text: Igraj
              - generic [ref=e235]: →
          - button "Nogomet HR 2000-ih Vatreni, izbornici, HNL i velika natjecanja Igraj" [ref=e236] [cursor=pointer]:
            - generic [ref=e237]: ⚽
            - heading "Nogomet HR 2000-ih" [level=3] [ref=e238]
            - paragraph [ref=e239]: Vatreni, izbornici, HNL i velika natjecanja
            - generic [ref=e240]:
              - generic [ref=e241]: Vatreni 2000-ih
              - generic [ref=e242]: Izbornici
              - generic [ref=e243]: HNL klubovi
              - generic [ref=e244]: Velika natjecanja
            - generic [ref=e245]:
              - text: Igraj
              - generic [ref=e246]: →
          - button "Muzika 2000-ih Domaca scena, strani hitovi i digitalni mediji Igraj" [ref=e247] [cursor=pointer]:
            - generic [ref=e248]: 🎵
            - heading "Muzika 2000-ih" [level=3] [ref=e249]
            - paragraph [ref=e250]: Domaca scena, strani hitovi i digitalni mediji
            - generic [ref=e251]:
              - generic [ref=e252]: Domaci pop
              - generic [ref=e253]: Rock scena
              - generic [ref=e254]: Strani hitovi
              - generic [ref=e255]: Digitalna era
            - generic [ref=e256]:
              - text: Igraj
              - generic [ref=e257]: →
          - button "NBA 2000-ih Dynastije, superzvijezde i košarkaška pop kultura Igraj" [ref=e258] [cursor=pointer]:
            - generic [ref=e259]: 🏀
            - heading "NBA 2000-ih" [level=3] [ref=e260]
            - paragraph [ref=e261]: Dynastije, superzvijezde i košarkaška pop kultura
            - generic [ref=e262]:
              - generic [ref=e263]: Lakers era
              - generic [ref=e264]: Spurs era
              - generic [ref=e265]: Zvijezde lige
              - generic [ref=e266]: NBA kultura
            - generic [ref=e267]:
              - text: Igraj
              - generic [ref=e268]: →
          - button "HR filmovi 2000-ih Domaći filmovi, glumci i festivalska scena Igraj" [ref=e269] [cursor=pointer]:
            - generic [ref=e270]: 🎬
            - heading "HR filmovi 2000-ih" [level=3] [ref=e271]
            - paragraph [ref=e272]: Domaći filmovi, glumci i festivalska scena
            - generic [ref=e273]:
              - generic [ref=e274]: Filmovi
              - generic [ref=e275]: Redatelji
              - generic [ref=e276]: Glumci
              - generic [ref=e277]: Filmska scena
            - generic [ref=e278]:
              - text: Igraj
              - generic [ref=e279]: →
          - button "Gaming 90-ih Konzole, likovi i legendarni naslovi Igraj" [ref=e280] [cursor=pointer]:
            - generic [ref=e281]: 🎮
            - heading "Gaming 90-ih" [level=3] [ref=e282]
            - paragraph [ref=e283]: Konzole, likovi i legendarni naslovi
            - generic [ref=e284]:
              - generic [ref=e285]: Konzole
              - generic [ref=e286]: Likovi iz igara
              - generic [ref=e287]: Klasični naslovi
              - generic [ref=e288]: Gejmerska kultura
            - generic [ref=e289]:
              - text: Igraj
              - generic [ref=e290]: →
          - button "Nogomet HR 90-ih Zlatni dečki, klubovi i veliki turniri Igraj" [ref=e291] [cursor=pointer]:
            - generic [ref=e292]: ⚽
            - heading "Nogomet HR 90-ih" [level=3] [ref=e293]
            - paragraph [ref=e294]: Zlatni dečki, klubovi i veliki turniri
            - generic [ref=e295]:
              - generic [ref=e296]: Zlatni dečki
              - generic [ref=e297]: Italia '90
              - generic [ref=e298]: Klubovi
              - generic [ref=e299]: Veliki trenuci
            - generic [ref=e300]:
              - text: Igraj
              - generic [ref=e301]: →
          - button "Muzika 90-ih Domaca scena, rock i svjetski hitovi Igraj" [ref=e302] [cursor=pointer]:
            - generic [ref=e303]: 🎵
            - heading "Muzika 90-ih" [level=3] [ref=e304]
            - paragraph [ref=e305]: Domaca scena, rock i svjetski hitovi
            - generic [ref=e306]:
              - generic [ref=e307]: Domaca pop
              - generic [ref=e308]: Hrvatski rock
              - generic [ref=e309]: Svjetske ikone
              - generic [ref=e310]: Formati i mediji
            - generic [ref=e311]:
              - text: Igraj
              - generic [ref=e312]: →
          - button "NBA 90-ih Dynastije, rivalstva i košarkaška kultura Igraj" [ref=e313] [cursor=pointer]:
            - generic [ref=e314]: 🏀
            - heading "NBA 90-ih" [level=3] [ref=e315]
            - paragraph [ref=e316]: Dynastije, rivalstva i košarkaška kultura
            - generic [ref=e317]:
              - generic [ref=e318]: Chicago Bulls
              - generic [ref=e319]: LA Lakers
              - generic [ref=e320]: Rivali erne
              - generic [ref=e321]: NBA kultura
            - generic [ref=e322]:
              - text: Igraj
              - generic [ref=e323]: →
          - button "HR nostalgija Auti, TV, brendovi i kvizovi iz djetinjstva Igraj" [ref=e324] [cursor=pointer]:
            - generic [ref=e325]: 📺
            - heading "HR nostalgija" [level=3] [ref=e326]
            - paragraph [ref=e327]: Auti, TV, brendovi i kvizovi iz djetinjstva
            - generic [ref=e328]:
              - generic [ref=e329]: Auti nostalgija
              - generic [ref=e330]: Stara televizija
              - generic [ref=e331]: Domaći brendovi
              - generic [ref=e332]: TV kvizovi
            - generic [ref=e333]:
              - text: Igraj
              - generic [ref=e334]: →
    - generic [ref=e335]:
      - heading "Kako se igra?" [level=2] [ref=e336]
      - paragraph [ref=e337]: Jednostavna pravila, zabavna igra — svaki dan nova mozgalica.
      - generic [ref=e338]:
        - article [ref=e339]:
          - generic [ref=e340]: "1"
          - heading "Odaberi 4 pojma" [level=3] [ref=e341]
          - paragraph [ref=e342]: Pronađi četiri riječi koje imaju nešto zajedničko i dodirni ih.
        - article [ref=e343]:
          - generic [ref=e344]: "2"
          - heading "Provjeri vezu" [level=3] [ref=e345]
          - paragraph [ref=e346]: Klikni „Provjeri odabir” i saznaj jesi li pogodio skrivenu grupu.
        - article [ref=e347]:
          - generic [ref=e348]: "3"
          - heading "Podijeli rezultat" [level=3] [ref=e349]
          - paragraph [ref=e350]: Riješi sve četiri grupe i izazovi prijatelje da vide tko je brži.
    - generic [ref=e351]:
      - heading "Izazovi prijateljicu" [level=2] [ref=e352]
      - paragraph [ref=e353]: Pošalji link, ona igra istu mozgalicu, a pobjednica se vidi nakon usporedbe rezultata.
      - generic [ref=e354]:
        - generic [ref=e355]:
          - generic [ref=e356]:
            - generic [ref=e357]: "1"
            - text: Riješi igru i dobiješ link
          - generic [ref=e358]:
            - generic [ref=e359]: "2"
            - text: Prijateljica otvara link i igra
          - generic [ref=e360]:
            - generic [ref=e361]: "3"
            - text: Usporedba, tko je brži i precizniji?
        - button "Pogledaj primjer linka" [ref=e362] [cursor=pointer]
    - generic [ref=e363]:
      - heading "Jedna mala igra za svaki dan" [level=2] [ref=e364]
      - paragraph [ref=e365]: Dovoljno da pokrene mozak, premalo da pojede cijelo popodne.
      - generic [ref=e366]:
        - article [ref=e367]:
          - generic [ref=e368]: ☕
          - heading "Kratka pauza" [level=3] [ref=e369]
          - paragraph [ref=e370]: Riješi je uz kavu, bez žurbe.
        - article [ref=e371]:
          - generic [ref=e372]: 💄
          - heading "Teme iz života" [level=3] [ref=e373]
          - paragraph [ref=e374]: Šminka, njega, dom i wellness.
        - article [ref=e375]:
          - generic [ref=e376]: ⏱️
          - heading "Samo nekoliko minuta" [level=3] [ref=e377]
          - paragraph [ref=e378]: Dovoljno kratko za svaki dan.
        - article [ref=e379]:
          - generic [ref=e380]: 👭
          - heading "Za podijeliti" [level=3] [ref=e381]
          - paragraph [ref=e382]: Pošalji izazov prijateljici.
    - contentinfo [ref=e383]:
      - generic [ref=e384]:
        - generic [ref=e390]: "?"
        - navigation "Podnožje" [ref=e391]:
          - link "O igri" [ref=e392] [cursor=pointer]:
            - /url: "#kako-se-igra"
          - link "Pravila" [ref=e393] [cursor=pointer]:
            - /url: "#kako-se-igra"
          - link "Kontakt" [ref=e394] [cursor=pointer]:
            - /url: mailto:nepar@nepar.hr
          - link "Privatnost" [ref=e395] [cursor=pointer]:
            - /url: /privatnost
          - link "Uvjeti korištenja" [ref=e396] [cursor=pointer]:
            - /url: /
          - button "Postavke privatnosti" [ref=e397] [cursor=pointer]
        - paragraph [ref=e398]: © 2026 Dnevne Asocijacije · nepar.hr
  - dialog "Vi birate analitiku" [ref=e399]:
    - generic [ref=e400]:
      - img [ref=e402]
      - generic [ref=e405]:
        - heading "Vi birate analitiku" [level=2] [ref=e406]
        - paragraph [ref=e407]: Nužne postavke održavaju stranicu funkcionalnom. Uz vaše dopuštenje koristimo GA4 i vlastitu analitiku kako bismo razumjeli koje stranice i upiti stvarno pomažu.
    - generic [ref=e408]:
      - button "Prihvati analitiku" [ref=e409] [cursor=pointer]
      - button "Odbij analitiku" [ref=e410] [cursor=pointer]
      - link "Politika privatnosti" [ref=e411] [cursor=pointer]:
        - /url: /privatnost
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
> 59  |     expect(puzzleCardIds.slice(0, 5)).toEqual([
      |                                       ^ Error: expect(received).toEqual(expected) // deep equality
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
  149 |     const linkMatches = shareText.match(/\/mozgalica\?od=[^\s]+/g) ?? [];
  150 |     expect(linkMatches).toHaveLength(1);
  151 |   });
  152 | 
  153 |   test("incoming challenge link opens accept screen and compares after play", async ({
  154 |     page,
  155 |   }) => {
  156 |     await page.goto(
  157 |       `/mozgalica?od=Ivan&p=7&t=151&tema=${TEST_PUZZLE_ID}`,
  158 |     );
  159 |     await expect(page.getByTestId("challenge-accept")).toBeVisible();
```