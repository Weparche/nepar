# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mozgalica.spec.js >> Dnevne Asocijacije /mozgalica >> nav Izazovi prijatelja scrolls to challenge section
- Location: e2e\mozgalica.spec.js:189:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.mz-mobile-nav').getByRole('button', { name: 'Izazovi prijatelja' })

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
        - button "Zatvori izbornik" [expanded] [active] [ref=e16] [cursor=pointer]:
          - img [ref=e17]
      - navigation "Mobilna navigacija" [ref=e20]:
        - button "Kako se igra" [ref=e21] [cursor=pointer]
        - button "Izazovi prijateljicu" [ref=e22] [cursor=pointer]
        - button "Zašto igrati" [ref=e23] [cursor=pointer]
        - button "Pomoć" [ref=e24] [cursor=pointer]
        - button "Igraj danas" [ref=e25] [cursor=pointer]
    - generic [ref=e26]:
      - generic [ref=e27]:
        - heading "Mozgalica za žene 40+." [level=1] [ref=e28]
        - paragraph [ref=e29]: Poveži 16 pojmova u 4 skrivene grupe, od ruža, SPF-a i retinola do čišćenja doma, wellnessa i malih rituala koji čuvaju mir u danu.
        - generic [ref=e30]:
          - button "Odaberi mozgalicu" [ref=e31] [cursor=pointer]
          - button "Kako se igra" [ref=e32] [cursor=pointer]
      - generic [ref=e33]:
        - paragraph [ref=e34]: Primjer kartica
        - generic [ref=e35]:
          - generic [ref=e36]: Primer
          - generic [ref=e37]: Maskara
          - generic [ref=e38]: Retinol
          - generic [ref=e39]: Ruž
          - generic [ref=e40]: Puder
          - generic [ref=e41]: Sjenilo
          - generic [ref=e42]: Hijaluron
          - generic [ref=e43]: Parfem
          - generic [ref=e44]: Korektor
          - generic [ref=e45]: Olovka
          - generic [ref=e46]: SPF
          - generic [ref=e47]: Maramice
          - generic [ref=e48]: Fiksator
          - generic [ref=e49]: Gel za obrve
          - generic [ref=e50]: Serum
          - generic [ref=e51]: Puder u kamenu
    - generic [ref=e52]:
      - generic [ref=e53]:
        - paragraph [ref=e54]: Odaberi temu
        - heading "Mozgalice po temama" [level=2] [ref=e55]
        - paragraph [ref=e56]: Svaka tema ima 16 pojmova u 4 skrivene grupe. Klikni karticu i odmah kreće igra, bez registracije.
      - generic [ref=e57]:
        - generic [ref=e58]:
          - heading "Za žene 40+" [level=3] [ref=e59]
          - paragraph [ref=e60]: Šminka, njega, dom, čišćenje, wellness i male svakodnevne pobjede
        - generic [ref=e61]:
          - button "40+ Beauty 40+ Sminka, njega koze i mali rituali koji rade razliku Odabrano" [pressed] [ref=e62] [cursor=pointer]:
            - generic [ref=e63]: 40+
            - generic [ref=e64]: 💄
            - heading "Beauty 40+" [level=3] [ref=e65]
            - paragraph [ref=e66]: Sminka, njega koze i mali rituali koji rade razliku
            - generic [ref=e67]:
              - generic [ref=e68]: Make-up baza
              - generic [ref=e69]: Oci i obrve
              - generic [ref=e70]: Njega koze
              - generic [ref=e71]: Torba za izlazak
            - generic [ref=e72]:
              - text: Odabrano
              - generic [ref=e73]: →
          - button "40+ Dom i čišćenje 40+ Kuhinja, kupaonica, rublje i trikovi za uredan dom Igraj" [ref=e74] [cursor=pointer]:
            - generic [ref=e75]: 40+
            - generic [ref=e76]: 🧼
            - heading "Dom i čišćenje 40+" [level=3] [ref=e77]
            - paragraph [ref=e78]: Kuhinja, kupaonica, rublje i trikovi za uredan dom
            - generic [ref=e79]:
              - generic [ref=e80]: Kuhinja
              - generic [ref=e81]: Kupaonica
              - generic [ref=e82]: Rublje
              - generic [ref=e83]: Organizacija
            - generic [ref=e84]:
              - text: Igraj
              - generic [ref=e85]: →
          - button "40+ Wellness 40+ Zdravlje, odmor, prijateljice i vrijeme za sebe Igraj" [ref=e86] [cursor=pointer]:
            - generic [ref=e87]: 40+
            - generic [ref=e88]: 🌿
            - heading "Wellness 40+" [level=3] [ref=e89]
            - paragraph [ref=e90]: Zdravlje, odmor, prijateljice i vrijeme za sebe
            - generic [ref=e91]:
              - generic [ref=e92]: Malo mira
              - generic [ref=e93]: Kretanje
              - generic [ref=e94]: Zdravlje
              - generic [ref=e95]: Druzenje
            - generic [ref=e96]:
              - text: Igraj
              - generic [ref=e97]: →
      - generic [ref=e98]:
        - generic [ref=e99]:
          - heading "2020-e" [level=3] [ref=e100]
          - paragraph [ref=e101]: AI, TikTok, pandemija, Hrvatska i tehnologija
        - generic [ref=e102]:
          - button "2020-e Digitalne 2020-e AI, kratki video i alati za rad od kuće Igraj" [ref=e103] [cursor=pointer]:
            - generic [ref=e104]: 2020-e
            - generic [ref=e105]: 🤖
            - heading "Digitalne 2020-e" [level=3] [ref=e106]
            - paragraph [ref=e107]: AI, kratki video i alati za rad od kuće
            - generic [ref=e108]:
              - generic [ref=e109]: Umjetna inteligencija
              - generic [ref=e110]: Video trendovi
              - generic [ref=e111]: Rad na daljinu
              - generic [ref=e112]: Digitalni alati
            - generic [ref=e113]:
              - text: Igraj
              - generic [ref=e114]: →
          - button "2020-e Hrvatska u 2020-ima Euro, Schengen, potres i Eurosong Igraj" [ref=e115] [cursor=pointer]:
            - generic [ref=e116]: 2020-e
            - generic [ref=e117]: 🇭🇷
            - heading "Hrvatska u 2020-ima" [level=3] [ref=e118]
            - paragraph [ref=e119]: Euro, Schengen, potres i Eurosong
            - generic [ref=e120]:
              - generic [ref=e121]: Nova valuta
              - generic [ref=e122]: Slobodno kretanje
              - generic [ref=e123]: Potres
              - generic [ref=e124]: Glazbeni uspjeh
            - generic [ref=e125]:
              - text: Igraj
              - generic [ref=e126]: →
          - button "2020-e Internet kultura 2020-ih Memeovi, influenceri i viralni sadržaj Igraj" [ref=e127] [cursor=pointer]:
            - generic [ref=e128]: 2020-e
            - generic [ref=e129]: 🌐
            - heading "Internet kultura 2020-ih" [level=3] [ref=e130]
            - paragraph [ref=e131]: Memeovi, influenceri i viralni sadržaj
            - generic [ref=e132]:
              - generic [ref=e133]: Meme kultura
              - generic [ref=e134]: Društvene mreže
              - generic [ref=e135]: Novi mediji
              - generic [ref=e136]: Viralni sadržaj
            - generic [ref=e137]:
              - text: Igraj
              - generic [ref=e138]: →
          - button "2020-e Svijet 2020-ih Pandemija, rat, inflacija i klima Igraj" [ref=e139] [cursor=pointer]:
            - generic [ref=e140]: 2020-e
            - generic [ref=e141]: 🌍
            - heading "Svijet 2020-ih" [level=3] [ref=e142]
            - paragraph [ref=e143]: Pandemija, rat, inflacija i klima
            - generic [ref=e144]:
              - generic [ref=e145]: Pandemija
              - generic [ref=e146]: Rat u Ukrajini
              - generic [ref=e147]: Poskupljenja
              - generic [ref=e148]: Klimatske promjene
            - generic [ref=e149]:
              - text: Igraj
              - generic [ref=e150]: →
          - button "2020-e Tehnologija 2020-ih EV, kripto, SpaceX i nosiva tehnologija Igraj" [ref=e151] [cursor=pointer]:
            - generic [ref=e152]: 2020-e
            - generic [ref=e153]: 🚀
            - heading "Tehnologija 2020-ih" [level=3] [ref=e154]
            - paragraph [ref=e155]: EV, kripto, SpaceX i nosiva tehnologija
            - generic [ref=e156]:
              - generic [ref=e157]: Elektromobilnost
              - generic [ref=e158]: Kripto svijet
              - generic [ref=e159]: Svemirska utrka
              - generic [ref=e160]: Nosiva tehnologija
            - generic [ref=e161]:
              - text: Igraj
              - generic [ref=e162]: →
      - generic [ref=e163]:
        - generic [ref=e164]:
          - heading "2010-e" [level=3] [ref=e165]
          - paragraph [ref=e166]: Digitalna era, hitovi, filmovi, svijet i Hrvatska
        - generic [ref=e167]:
          - button "2010-e Digitalne 2010-e Društvene mreže, streaming i smartphone era Igraj" [ref=e168] [cursor=pointer]:
            - generic [ref=e169]: 2010-e
            - generic [ref=e170]: 📱
            - heading "Digitalne 2010-e" [level=3] [ref=e171]
            - paragraph [ref=e172]: Društvene mreže, streaming i smartphone era
            - generic [ref=e173]:
              - generic [ref=e174]: Društvene mreže
              - generic [ref=e175]: Streaming
              - generic [ref=e176]: Dostava i prijevoz
              - generic [ref=e177]: Smartphone
            - generic [ref=e178]:
              - text: Igraj
              - generic [ref=e179]: →
          - button "2010-e Glazba 2010-ih Hitovi, playliste i viralni plesovi Igraj" [ref=e180] [cursor=pointer]:
            - generic [ref=e181]: 2010-e
            - generic [ref=e182]: 🎧
            - heading "Glazba 2010-ih" [level=3] [ref=e183]
            - paragraph [ref=e184]: Hitovi, playliste i viralni plesovi
            - generic [ref=e185]:
              - generic [ref=e186]: Ljetni hit
              - generic [ref=e187]: Pop diva
              - generic [ref=e188]: Slušanje glazbe
              - generic [ref=e189]: Internet hit
            - generic [ref=e190]:
              - text: Igraj
              - generic [ref=e191]: →
          - button "2010-e Filmovi i serije 2010-ih Marvel, HBO i animirani hitovi Igraj" [ref=e192] [cursor=pointer]:
            - generic [ref=e193]: 2010-e
            - generic [ref=e194]: 🎬
            - heading "Filmovi i serije 2010-ih" [level=3] [ref=e195]
            - paragraph [ref=e196]: Marvel, HBO i animirani hitovi
            - generic [ref=e197]:
              - generic [ref=e198]: Frozen
              - generic [ref=e199]: Game of Thrones
              - generic [ref=e200]: Marvel
              - generic [ref=e201]: Joker
            - generic [ref=e202]:
              - text: Igraj
              - generic [ref=e203]: →
          - button "2010-e Svijet 2010-ih Sport, politika i klimatski pokreti Igraj" [ref=e204] [cursor=pointer]:
            - generic [ref=e205]: 2010-e
            - generic [ref=e206]: 🌍
            - heading "Svijet 2010-ih" [level=3] [ref=e207]
            - paragraph [ref=e208]: Sport, politika i klimatski pokreti
            - generic [ref=e209]:
              - generic [ref=e210]: Svjetsko prvenstvo
              - generic [ref=e211]: Olimpijske igre
              - generic [ref=e212]: Politika
              - generic [ref=e213]: Klimatske promjene
            - generic [ref=e214]:
              - text: Igraj
              - generic [ref=e215]: →
          - button "2010-e Hrvatska 2010-ih EU, Vatreni i domaća pop scena Igraj" [ref=e216] [cursor=pointer]:
            - generic [ref=e217]: 2010-e
            - generic [ref=e218]: 🇭🇷
            - heading "Hrvatska 2010-ih" [level=3] [ref=e219]
            - paragraph [ref=e220]: EU, Vatreni i domaća pop scena
            - generic [ref=e221]:
              - generic [ref=e222]: EU
              - generic [ref=e223]: Svjetsko prvenstvo
              - generic [ref=e224]: Hrvatska glazbena scena
              - generic [ref=e225]: Online život
            - generic [ref=e226]:
              - text: Igraj
              - generic [ref=e227]: →
      - generic [ref=e228]:
        - generic [ref=e229]:
          - heading "2000-e i 90-e" [level=3] [ref=e230]
          - paragraph [ref=e231]: Gaming, sport, glazba, NBA i nostalgija
        - generic [ref=e232]:
          - 'button "Gaming 2K Gaming 2000-ih: PC klasici, PS2 i online era Igraj" [ref=e233] [cursor=pointer]':
            - generic [ref=e234]: 🎮
            - heading "Gaming 2K" [level=3] [ref=e235]
            - paragraph [ref=e236]: "Gaming 2000-ih: PC klasici, PS2 i online era"
            - generic [ref=e237]:
              - generic [ref=e238]: PC klasici
              - generic [ref=e239]: PlayStation 2
              - generic [ref=e240]: Nintendo era
              - generic [ref=e241]: LAN i internet
            - generic [ref=e242]:
              - text: Igraj
              - generic [ref=e243]: →
          - button "Nogomet HR 2000-ih Vatreni, izbornici, HNL i velika natjecanja Igraj" [ref=e244] [cursor=pointer]:
            - generic [ref=e245]: ⚽
            - heading "Nogomet HR 2000-ih" [level=3] [ref=e246]
            - paragraph [ref=e247]: Vatreni, izbornici, HNL i velika natjecanja
            - generic [ref=e248]:
              - generic [ref=e249]: Vatreni 2000-ih
              - generic [ref=e250]: Izbornici
              - generic [ref=e251]: HNL klubovi
              - generic [ref=e252]: Velika natjecanja
            - generic [ref=e253]:
              - text: Igraj
              - generic [ref=e254]: →
          - button "Muzika 2000-ih Domaca scena, strani hitovi i digitalni mediji Igraj" [ref=e255] [cursor=pointer]:
            - generic [ref=e256]: 🎵
            - heading "Muzika 2000-ih" [level=3] [ref=e257]
            - paragraph [ref=e258]: Domaca scena, strani hitovi i digitalni mediji
            - generic [ref=e259]:
              - generic [ref=e260]: Domaci pop
              - generic [ref=e261]: Rock scena
              - generic [ref=e262]: Strani hitovi
              - generic [ref=e263]: Digitalna era
            - generic [ref=e264]:
              - text: Igraj
              - generic [ref=e265]: →
          - button "NBA 2000-ih Dynastije, superzvijezde i košarkaška pop kultura Igraj" [ref=e266] [cursor=pointer]:
            - generic [ref=e267]: 🏀
            - heading "NBA 2000-ih" [level=3] [ref=e268]
            - paragraph [ref=e269]: Dynastije, superzvijezde i košarkaška pop kultura
            - generic [ref=e270]:
              - generic [ref=e271]: Lakers era
              - generic [ref=e272]: Spurs era
              - generic [ref=e273]: Zvijezde lige
              - generic [ref=e274]: NBA kultura
            - generic [ref=e275]:
              - text: Igraj
              - generic [ref=e276]: →
          - button "HR filmovi 2000-ih Domaći filmovi, glumci i festivalska scena Igraj" [ref=e277] [cursor=pointer]:
            - generic [ref=e278]: 🎬
            - heading "HR filmovi 2000-ih" [level=3] [ref=e279]
            - paragraph [ref=e280]: Domaći filmovi, glumci i festivalska scena
            - generic [ref=e281]:
              - generic [ref=e282]: Filmovi
              - generic [ref=e283]: Redatelji
              - generic [ref=e284]: Glumci
              - generic [ref=e285]: Filmska scena
            - generic [ref=e286]:
              - text: Igraj
              - generic [ref=e287]: →
          - button "Gaming 90-ih Konzole, likovi i legendarni naslovi Igraj" [ref=e288] [cursor=pointer]:
            - generic [ref=e289]: 🎮
            - heading "Gaming 90-ih" [level=3] [ref=e290]
            - paragraph [ref=e291]: Konzole, likovi i legendarni naslovi
            - generic [ref=e292]:
              - generic [ref=e293]: Konzole
              - generic [ref=e294]: Likovi iz igara
              - generic [ref=e295]: Klasični naslovi
              - generic [ref=e296]: Gejmerska kultura
            - generic [ref=e297]:
              - text: Igraj
              - generic [ref=e298]: →
          - button "Nogomet HR 90-ih Zlatni dečki, klubovi i veliki turniri Igraj" [ref=e299] [cursor=pointer]:
            - generic [ref=e300]: ⚽
            - heading "Nogomet HR 90-ih" [level=3] [ref=e301]
            - paragraph [ref=e302]: Zlatni dečki, klubovi i veliki turniri
            - generic [ref=e303]:
              - generic [ref=e304]: Zlatni dečki
              - generic [ref=e305]: Italia '90
              - generic [ref=e306]: Klubovi
              - generic [ref=e307]: Veliki trenuci
            - generic [ref=e308]:
              - text: Igraj
              - generic [ref=e309]: →
          - button "Muzika 90-ih Domaca scena, rock i svjetski hitovi Igraj" [ref=e310] [cursor=pointer]:
            - generic [ref=e311]: 🎵
            - heading "Muzika 90-ih" [level=3] [ref=e312]
            - paragraph [ref=e313]: Domaca scena, rock i svjetski hitovi
            - generic [ref=e314]:
              - generic [ref=e315]: Domaca pop
              - generic [ref=e316]: Hrvatski rock
              - generic [ref=e317]: Svjetske ikone
              - generic [ref=e318]: Formati i mediji
            - generic [ref=e319]:
              - text: Igraj
              - generic [ref=e320]: →
          - button "NBA 90-ih Dynastije, rivalstva i košarkaška kultura Igraj" [ref=e321] [cursor=pointer]:
            - generic [ref=e322]: 🏀
            - heading "NBA 90-ih" [level=3] [ref=e323]
            - paragraph [ref=e324]: Dynastije, rivalstva i košarkaška kultura
            - generic [ref=e325]:
              - generic [ref=e326]: Chicago Bulls
              - generic [ref=e327]: LA Lakers
              - generic [ref=e328]: Rivali erne
              - generic [ref=e329]: NBA kultura
            - generic [ref=e330]:
              - text: Igraj
              - generic [ref=e331]: →
          - button "HR nostalgija Auti, TV, brendovi i kvizovi iz djetinjstva Igraj" [ref=e332] [cursor=pointer]:
            - generic [ref=e333]: 📺
            - heading "HR nostalgija" [level=3] [ref=e334]
            - paragraph [ref=e335]: Auti, TV, brendovi i kvizovi iz djetinjstva
            - generic [ref=e336]:
              - generic [ref=e337]: Auti nostalgija
              - generic [ref=e338]: Stara televizija
              - generic [ref=e339]: Domaći brendovi
              - generic [ref=e340]: TV kvizovi
            - generic [ref=e341]:
              - text: Igraj
              - generic [ref=e342]: →
    - generic [ref=e343]:
      - heading "Kako se igra?" [level=2] [ref=e344]
      - paragraph [ref=e345]: Jednostavna pravila, zabavna igra — svaki dan nova mozgalica.
      - generic [ref=e346]:
        - article [ref=e347]:
          - generic [ref=e348]: "1"
          - heading "Odaberi 4 pojma" [level=3] [ref=e349]
          - paragraph [ref=e350]: Pronađi četiri riječi koje imaju nešto zajedničko i dodirni ih.
        - article [ref=e351]:
          - generic [ref=e352]: "2"
          - heading "Provjeri vezu" [level=3] [ref=e353]
          - paragraph [ref=e354]: Klikni „Provjeri odabir” i saznaj jesi li pogodio skrivenu grupu.
        - article [ref=e355]:
          - generic [ref=e356]: "3"
          - heading "Podijeli rezultat" [level=3] [ref=e357]
          - paragraph [ref=e358]: Riješi sve četiri grupe i izazovi prijatelje da vide tko je brži.
    - generic [ref=e359]:
      - heading "Izazovi prijateljicu" [level=2] [ref=e360]
      - paragraph [ref=e361]: Pošalji link, ona igra istu mozgalicu, a pobjednica se vidi nakon usporedbe rezultata.
      - generic [ref=e362]:
        - generic [ref=e363]:
          - generic [ref=e364]:
            - generic [ref=e365]: "1"
            - text: Riješi igru i dobiješ link
          - generic [ref=e366]:
            - generic [ref=e367]: "2"
            - text: Prijateljica otvara link i igra
          - generic [ref=e368]:
            - generic [ref=e369]: "3"
            - text: Usporedba, tko je brži i precizniji?
        - button "Pogledaj primjer linka" [ref=e370] [cursor=pointer]
    - generic [ref=e371]:
      - heading "Jedna mala igra za svaki dan" [level=2] [ref=e372]
      - paragraph [ref=e373]: Dovoljno da pokrene mozak, premalo da pojede cijelo popodne.
      - generic [ref=e374]:
        - article [ref=e375]:
          - generic [ref=e376]: ☕
          - heading "Kratka pauza" [level=3] [ref=e377]
          - paragraph [ref=e378]: Riješi je uz kavu, bez žurbe.
        - article [ref=e379]:
          - generic [ref=e380]: 💄
          - heading "Teme iz života" [level=3] [ref=e381]
          - paragraph [ref=e382]: Šminka, njega, dom i wellness.
        - article [ref=e383]:
          - generic [ref=e384]: ⏱️
          - heading "Samo nekoliko minuta" [level=3] [ref=e385]
          - paragraph [ref=e386]: Dovoljno kratko za svaki dan.
        - article [ref=e387]:
          - generic [ref=e388]: 👭
          - heading "Za podijeliti" [level=3] [ref=e389]
          - paragraph [ref=e390]: Pošalji izazov prijateljici.
    - contentinfo [ref=e391]:
      - generic [ref=e392]:
        - generic [ref=e398]: "?"
        - navigation "Podnožje" [ref=e399]:
          - link "O igri" [ref=e400] [cursor=pointer]:
            - /url: "#kako-se-igra"
          - link "Pravila" [ref=e401] [cursor=pointer]:
            - /url: "#kako-se-igra"
          - link "Kontakt" [ref=e402] [cursor=pointer]:
            - /url: mailto:nepar@nepar.hr
          - link "Privatnost" [ref=e403] [cursor=pointer]:
            - /url: /privatnost
          - link "Uvjeti korištenja" [ref=e404] [cursor=pointer]:
            - /url: /
          - button "Postavke privatnosti" [ref=e405] [cursor=pointer]
        - paragraph [ref=e406]: © 2026 Dnevne Asocijacije · nepar.hr
  - dialog "Vi birate analitiku" [ref=e407]:
    - generic [ref=e408]:
      - img [ref=e410]
      - generic [ref=e413]:
        - heading "Vi birate analitiku" [level=2] [ref=e414]
        - paragraph [ref=e415]: Nužne postavke održavaju stranicu funkcionalnom. Uz vaše dopuštenje koristimo GA4 i vlastitu analitiku kako bismo razumjeli koje stranice i upiti stvarno pomažu.
    - generic [ref=e416]:
      - button "Prihvati analitiku" [ref=e417] [cursor=pointer]
      - button "Odbij analitiku" [ref=e418] [cursor=pointer]
      - link "Politika privatnosti" [ref=e419] [cursor=pointer]:
        - /url: /privatnost
```

# Test source

```ts
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
> 193 |       await page.locator(".mz-mobile-nav").getByRole("button", { name: "Izazovi prijatelja" }).click();
      |                                                                                                ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  256 |     await expect(page).toHaveScreenshot("landing-mobile.png", {
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
```