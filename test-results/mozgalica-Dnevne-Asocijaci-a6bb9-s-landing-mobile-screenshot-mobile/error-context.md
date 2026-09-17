# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mozgalica.spec.js >> Dnevne Asocijacije screenshots >> landing mobile screenshot
- Location: e2e\mozgalica.spec.js:251:3

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  Expected an image 393px by 6213px, received 393px by 9942px. 374023 pixels (ratio 0.10 of all image pixels) are different.

  Snapshot: landing-mobile.png

Call log:
  - Expect "toHaveScreenshot(landing-mobile.png)" with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - Expected an image 393px by 6213px, received 393px by 9942px. 374023 pixels (ratio 0.10 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - Expected an image 393px by 6213px, received 393px by 9942px. 374023 pixels (ratio 0.10 of all image pixels) are different.

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
  156 |     await page.goto(
  157 |       `/mozgalica?od=Ivan&p=7&t=151&tema=${TEST_PUZZLE_ID}`,
  158 |     );
  159 |     await expect(page.getByTestId("challenge-accept")).toBeVisible();
  160 |     await expect(page.getByText("Ivan te izaziva!")).toBeVisible();
  161 |     await expect(page.getByText(TEST_PUZZLE.title)).toBeVisible();
  162 | 
  163 |     await page.evaluate((items) => {
  164 |       sessionStorage.setItem("mozgalica-test-order", JSON.stringify(items));
  165 |     }, getMockupItems(TEST_PUZZLE_ID));
  166 |     await page.getByTestId("accept-challenge").click();
  167 |     await expect(page.getByTestId("game-board")).toBeVisible();
  168 |     await solveAllGroups(page);
  169 | 
  170 |     await expect(page.getByTestId("challenge-result")).toBeVisible({ timeout: 5000 });
  171 |     await expect(page.getByTestId("challenge-winner")).toBeVisible();
  172 |     await expect(page.getByTestId("notify-challenger")).toBeVisible();
  173 |     await expect(page.getByTestId("challenge-notify-hint")).toBeVisible();
  174 |   });
  175 | 
  176 |   test("result link shows comparison for challenger without playing", async ({
  177 |     page,
  178 |   }) => {
  179 |     await page.goto(
  180 |       `/mozgalica?od=Wepar&p=1&t=42&tema=${TEST_PUZZLE_ID}&rn=Marko&rp=3&rt=78`,
  181 |     );
  182 |     await expect(page.getByTestId("challenge-result")).toBeVisible();
  183 |     await expect(page.getByText("Marko je odigrao izazov")).toBeVisible();
  184 |     await expect(page.getByTestId("challenge-winner")).toBeVisible();
  185 |     await expect(page.getByTestId("notify-challenger")).toHaveCount(0);
  186 |     await expect(page.getByTestId("challenge-done")).toBeVisible();
  187 |   });
  188 | 
  189 |   test("nav Izazovi prijatelja scrolls to challenge section", async ({ page, isMobile }) => {
  190 |     await page.goto("/mozgalica");
  191 |     if (isMobile) {
  192 |       await page.getByRole("button", { name: "Otvori izbornik" }).click();
  193 |       await page.locator(".mz-mobile-nav").getByRole("button", { name: "Izazovi prijatelja" }).click();
  194 |     } else {
  195 |       await page.locator(".mz-nav").getByRole("button", { name: "Izazovi prijatelja" }).click();
  196 |     }
  197 |     await expect(page.getByTestId("landing-challenge-demo")).toBeVisible();
  198 |   });
  199 | 
  200 |   test("start-game scrolls to puzzle picker", async ({ page }) => {
  201 |     await page.goto("/mozgalica");
  202 |     await page.getByTestId("start-game").click();
  203 |     await expect(page.getByTestId("puzzle-picker")).toBeInViewport();
  204 |   });
  205 | 
  206 |   test("mobile viewport layout is intact", async ({ page, isMobile }) => {
  207 |     test.skip(!isMobile, "Mobile-only layout check");
  208 |     await page.goto("/mozgalica");
  209 |     await expect(page.getByTestId("landing-header")).toBeVisible();
  210 |     await expect(page.getByTestId("hero-title")).toBeVisible();
  211 |     await startGame(page);
  212 |     const box = await page.getByTestId("game-grid").boundingBox();
  213 |     expect(box?.width).toBeGreaterThan(0);
  214 |     await expect(page.getByTestId("check-selection")).toBeVisible();
  215 |   });
  216 | 
  217 |   test("1440p desktop layout uses wide content and readable game grid", async ({
  218 |     page,
  219 |   }) => {
  220 |     test.skip(test.info().project.name !== "desktop-1440", "1440p only");
  221 |     await page.goto("/mozgalica");
  222 | 
  223 |     const hero = await page.getByTestId("landing-hero").boundingBox();
  224 |     expect(hero?.width).toBeGreaterThan(1100);
  225 | 
  226 |     await startGame(page);
  227 |     const grid = await page.getByTestId("game-grid").boundingBox();
  228 |     expect(grid?.width).toBeGreaterThan(520);
  229 |     expect(grid?.width).toBeLessThan(720);
  230 | 
  231 |     const card = await page.getByTestId("game-grid").locator(".mz-card").first().boundingBox();
  232 |     expect(card?.height).toBeGreaterThanOrEqual(84);
  233 |   });
  234 | });
  235 | 
  236 | test.describe("Dnevne Asocijacije screenshots", () => {
  237 |   test.beforeEach(async ({ page }) => {
  238 |     await prepareScreenshotPage(page);
  239 |   });
  240 | 
  241 |   test("landing desktop screenshot", async ({ page, isMobile }) => {
  242 |     test.skip(isMobile, "Desktop-only screenshot");
  243 |     await page.goto("/mozgalica");
  244 |     await expect(page.getByTestId("hero-title")).toBeVisible();
  245 |     await page.waitForTimeout(500);
  246 |     await expect(page).toHaveScreenshot("landing-desktop.png", {
  247 |       fullPage: true,
  248 |     });
  249 |   });
  250 | 
  251 |   test("landing mobile screenshot", async ({ page, isMobile }) => {
  252 |     test.skip(!isMobile, "Mobile-only screenshot");
  253 |     await page.goto("/mozgalica");
  254 |     await expect(page.getByTestId("hero-title")).toBeVisible();
  255 |     await page.waitForTimeout(500);
> 256 |     await expect(page).toHaveScreenshot("landing-mobile.png", {
      |                        ^ Error: expect(page).toHaveScreenshot(expected) failed
  257 |       fullPage: true,
  258 |     });
  259 |   });
  260 | 
  261 |   test("game mobile screenshot", async ({ page, isMobile }) => {
  262 |     test.skip(!isMobile, "Mobile-only screenshot");
  263 |     await startGame(page);
  264 |     await page.waitForTimeout(500);
  265 |     await expect(page).toHaveScreenshot("game-mobile.png", {
  266 |       fullPage: true,
  267 |     });
  268 |   });
  269 | 
  270 |   test("result screenshot", async ({ page, isMobile }) => {
  271 |     await startGame(page);
  272 |     await solveAllGroups(page);
  273 |     await expect(page.getByTestId("result-panel")).toBeVisible({ timeout: 5000 });
  274 |     await page.waitForTimeout(500);
  275 |     await expect(page).toHaveScreenshot(
  276 |       isMobile ? "result-mobile.png" : "result-desktop.png",
  277 |       { fullPage: true },
  278 |     );
  279 |   });
  280 | 
  281 |   test("challenge invite screenshot", async ({ page, isMobile }) => {
  282 |     await startGame(page);
  283 |     await solveAllGroups(page);
  284 |     await expect(page.getByTestId("result-panel")).toBeVisible({ timeout: 5000 });
  285 |     await page.getByTestId("challenge-friends").click();
  286 |     await expect(page.getByTestId("challenge-invite")).toBeVisible();
  287 |     await page.waitForTimeout(500);
  288 |     await expect(page).toHaveScreenshot(
  289 |       isMobile ? "challenge-invite-mobile.png" : "challenge-invite-desktop.png",
  290 |       { fullPage: true },
  291 |     );
  292 |   });
  293 | 
  294 |   test("landing 1440p screenshot", async ({ page }) => {
  295 |     test.skip(test.info().project.name !== "desktop-1440", "1440p only");
  296 |     await page.goto("/mozgalica");
  297 |     await expect(page.getByTestId("hero-title")).toBeVisible();
  298 |     await page.waitForTimeout(500);
  299 |     await expect(page).toHaveScreenshot("landing-1440.png", { fullPage: true });
  300 |   });
  301 | 
  302 |   test("game 1440p screenshot", async ({ page }) => {
  303 |     test.skip(test.info().project.name !== "desktop-1440", "1440p only");
  304 |     await startGame(page);
  305 |     await page.waitForTimeout(500);
  306 |     await expect(page).toHaveScreenshot("game-1440.png", { fullPage: true });
  307 |   });
  308 | 
  309 |   test("result 1440p screenshot", async ({ page }) => {
  310 |     test.skip(test.info().project.name !== "desktop-1440", "1440p only");
  311 |     await startGame(page);
  312 |     await solveAllGroups(page);
  313 |     await expect(page.getByTestId("result-panel")).toBeVisible({ timeout: 5000 });
  314 |     await page.waitForTimeout(500);
  315 |     await expect(page).toHaveScreenshot("result-1440.png", { fullPage: true });
  316 |   });
  317 | });
  318 | 
```