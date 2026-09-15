# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mozgalica.spec.js >> Dnevne Asocijacije screenshots >> landing 1440p screenshot
- Location: e2e\mozgalica.spec.js:294:3

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  Expected an image 1440px by 3288px, received 1440px by 4587px. 641022 pixels (ratio 0.10 of all image pixels) are different.

  Snapshot: landing-1440.png

Call log:
  - Expect "toHaveScreenshot(landing-1440.png)" with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - Expected an image 1440px by 3288px, received 1440px by 4587px. 641022 pixels (ratio 0.10 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - Expected an image 1440px by 3288px, received 1440px by 4587px. 641022 pixels (ratio 0.10 of all image pixels) are different.

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
        - navigation "Glavna navigacija" [ref=e14]:
          - button "Kako se igra" [ref=e15] [cursor=pointer]
          - button "Izazovi prijateljicu" [ref=e16] [cursor=pointer]
          - button "Zašto igrati" [ref=e17] [cursor=pointer]
          - button "Pomoć" [ref=e18] [cursor=pointer]
        - button "Igraj danas" [ref=e20] [cursor=pointer]
    - generic [ref=e21]:
      - generic [ref=e22]:
        - heading "Mozgalica za žene 40+." [level=1] [ref=e23]
        - paragraph [ref=e24]: Poveži 16 pojmova u 4 skrivene grupe, od ruža, SPF-a i retinola do čišćenja doma, wellnessa i malih rituala koji čuvaju mir u danu.
        - generic [ref=e25]:
          - button "Odaberi mozgalicu" [ref=e26] [cursor=pointer]
          - button "Kako se igra" [ref=e27] [cursor=pointer]
      - generic [ref=e28]:
        - paragraph [ref=e29]: Primjer kartica
        - generic [ref=e30]:
          - generic [ref=e31]: Primer
          - generic [ref=e32]: Maskara
          - generic [ref=e33]: Retinol
          - generic [ref=e34]: Ruž
          - generic [ref=e35]: Puder
          - generic [ref=e36]: Sjenilo
          - generic [ref=e37]: Hijaluron
          - generic [ref=e38]: Parfem
          - generic [ref=e39]: Korektor
          - generic [ref=e40]: Olovka
          - generic [ref=e41]: SPF
          - generic [ref=e42]: Maramice
          - generic [ref=e43]: Fiksator
          - generic [ref=e44]: Gel za obrve
          - generic [ref=e45]: Serum
          - generic [ref=e46]: Puder u kamenu
    - generic [ref=e47]:
      - generic [ref=e48]:
        - paragraph [ref=e49]: Odaberi temu
        - heading "Mozgalice po temama" [level=2] [ref=e50]
        - paragraph [ref=e51]: Svaka tema ima 16 pojmova u 4 skrivene grupe. Klikni karticu i odmah kreće igra, bez registracije.
      - generic [ref=e52]:
        - generic [ref=e53]:
          - heading "Za žene 40+" [level=3] [ref=e54]
          - paragraph [ref=e55]: Šminka, njega, dom, čišćenje, wellness i male svakodnevne pobjede
        - generic [ref=e56]:
          - button "40+ Beauty 40+ Sminka, njega koze i mali rituali koji rade razliku Odabrano" [pressed] [ref=e57] [cursor=pointer]:
            - generic [ref=e58]: 40+
            - generic [ref=e59]: 💄
            - heading "Beauty 40+" [level=3] [ref=e60]
            - paragraph [ref=e61]: Sminka, njega koze i mali rituali koji rade razliku
            - generic [ref=e62]:
              - generic [ref=e63]: Make-up baza
              - generic [ref=e64]: Oci i obrve
              - generic [ref=e65]: Njega koze
              - generic [ref=e66]: Torba za izlazak
            - generic [ref=e67]:
              - text: Odabrano
              - generic [ref=e68]: →
          - button "40+ Dom i čišćenje 40+ Kuhinja, kupaonica, rublje i trikovi za uredan dom Igraj" [ref=e69] [cursor=pointer]:
            - generic [ref=e70]: 40+
            - generic [ref=e71]: 🧼
            - heading "Dom i čišćenje 40+" [level=3] [ref=e72]
            - paragraph [ref=e73]: Kuhinja, kupaonica, rublje i trikovi za uredan dom
            - generic [ref=e74]:
              - generic [ref=e75]: Kuhinja
              - generic [ref=e76]: Kupaonica
              - generic [ref=e77]: Rublje
              - generic [ref=e78]: Organizacija
            - generic [ref=e79]:
              - text: Igraj
              - generic [ref=e80]: →
          - button "40+ Wellness 40+ Zdravlje, odmor, prijateljice i vrijeme za sebe Igraj" [ref=e81] [cursor=pointer]:
            - generic [ref=e82]: 40+
            - generic [ref=e83]: 🌿
            - heading "Wellness 40+" [level=3] [ref=e84]
            - paragraph [ref=e85]: Zdravlje, odmor, prijateljice i vrijeme za sebe
            - generic [ref=e86]:
              - generic [ref=e87]: Malo mira
              - generic [ref=e88]: Kretanje
              - generic [ref=e89]: Zdravlje
              - generic [ref=e90]: Druzenje
            - generic [ref=e91]:
              - text: Igraj
              - generic [ref=e92]: →
      - generic [ref=e93]:
        - generic [ref=e94]:
          - heading "2020-e" [level=3] [ref=e95]
          - paragraph [ref=e96]: AI, TikTok, pandemija, Hrvatska i tehnologija
        - generic [ref=e97]:
          - button "2020-e Digitalne 2020-e AI, kratki video i alati za rad od kuće Igraj" [ref=e98] [cursor=pointer]:
            - generic [ref=e99]: 2020-e
            - generic [ref=e100]: 🤖
            - heading "Digitalne 2020-e" [level=3] [ref=e101]
            - paragraph [ref=e102]: AI, kratki video i alati za rad od kuće
            - generic [ref=e103]:
              - generic [ref=e104]: Umjetna inteligencija
              - generic [ref=e105]: Video trendovi
              - generic [ref=e106]: Rad na daljinu
              - generic [ref=e107]: Digitalni alati
            - generic [ref=e108]:
              - text: Igraj
              - generic [ref=e109]: →
          - button "2020-e Hrvatska u 2020-ima Euro, Schengen, potres i Eurosong Igraj" [ref=e110] [cursor=pointer]:
            - generic [ref=e111]: 2020-e
            - generic [ref=e112]: 🇭🇷
            - heading "Hrvatska u 2020-ima" [level=3] [ref=e113]
            - paragraph [ref=e114]: Euro, Schengen, potres i Eurosong
            - generic [ref=e115]:
              - generic [ref=e116]: Nova valuta
              - generic [ref=e117]: Slobodno kretanje
              - generic [ref=e118]: Potres
              - generic [ref=e119]: Glazbeni uspjeh
            - generic [ref=e120]:
              - text: Igraj
              - generic [ref=e121]: →
          - button "2020-e Internet kultura 2020-ih Memeovi, influenceri i viralni sadržaj Igraj" [ref=e122] [cursor=pointer]:
            - generic [ref=e123]: 2020-e
            - generic [ref=e124]: 🌐
            - heading "Internet kultura 2020-ih" [level=3] [ref=e125]
            - paragraph [ref=e126]: Memeovi, influenceri i viralni sadržaj
            - generic [ref=e127]:
              - generic [ref=e128]: Meme kultura
              - generic [ref=e129]: Društvene mreže
              - generic [ref=e130]: Novi mediji
              - generic [ref=e131]: Viralni sadržaj
            - generic [ref=e132]:
              - text: Igraj
              - generic [ref=e133]: →
          - button "2020-e Svijet 2020-ih Pandemija, rat, inflacija i klima Igraj" [ref=e134] [cursor=pointer]:
            - generic [ref=e135]: 2020-e
            - generic [ref=e136]: 🌍
            - heading "Svijet 2020-ih" [level=3] [ref=e137]
            - paragraph [ref=e138]: Pandemija, rat, inflacija i klima
            - generic [ref=e139]:
              - generic [ref=e140]: Pandemija
              - generic [ref=e141]: Rat u Ukrajini
              - generic [ref=e142]: Poskupljenja
              - generic [ref=e143]: Klimatske promjene
            - generic [ref=e144]:
              - text: Igraj
              - generic [ref=e145]: →
          - button "2020-e Tehnologija 2020-ih EV, kripto, SpaceX i nosiva tehnologija Igraj" [ref=e146] [cursor=pointer]:
            - generic [ref=e147]: 2020-e
            - generic [ref=e148]: 🚀
            - heading "Tehnologija 2020-ih" [level=3] [ref=e149]
            - paragraph [ref=e150]: EV, kripto, SpaceX i nosiva tehnologija
            - generic [ref=e151]:
              - generic [ref=e152]: Elektromobilnost
              - generic [ref=e153]: Kripto svijet
              - generic [ref=e154]: Svemirska utrka
              - generic [ref=e155]: Nosiva tehnologija
            - generic [ref=e156]:
              - text: Igraj
              - generic [ref=e157]: →
      - generic [ref=e158]:
        - generic [ref=e159]:
          - heading "2010-e" [level=3] [ref=e160]
          - paragraph [ref=e161]: Digitalna era, hitovi, filmovi, svijet i Hrvatska
        - generic [ref=e162]:
          - button "2010-e Digitalne 2010-e Društvene mreže, streaming i smartphone era Igraj" [ref=e163] [cursor=pointer]:
            - generic [ref=e164]: 2010-e
            - generic [ref=e165]: 📱
            - heading "Digitalne 2010-e" [level=3] [ref=e166]
            - paragraph [ref=e167]: Društvene mreže, streaming i smartphone era
            - generic [ref=e168]:
              - generic [ref=e169]: Društvene mreže
              - generic [ref=e170]: Streaming
              - generic [ref=e171]: Dostava i prijevoz
              - generic [ref=e172]: Smartphone
            - generic [ref=e173]:
              - text: Igraj
              - generic [ref=e174]: →
          - button "2010-e Glazba 2010-ih Hitovi, playliste i viralni plesovi Igraj" [ref=e175] [cursor=pointer]:
            - generic [ref=e176]: 2010-e
            - generic [ref=e177]: 🎧
            - heading "Glazba 2010-ih" [level=3] [ref=e178]
            - paragraph [ref=e179]: Hitovi, playliste i viralni plesovi
            - generic [ref=e180]:
              - generic [ref=e181]: Ljetni hit
              - generic [ref=e182]: Pop diva
              - generic [ref=e183]: Slušanje glazbe
              - generic [ref=e184]: Internet hit
            - generic [ref=e185]:
              - text: Igraj
              - generic [ref=e186]: →
          - button "2010-e Filmovi i serije 2010-ih Marvel, HBO i animirani hitovi Igraj" [ref=e187] [cursor=pointer]:
            - generic [ref=e188]: 2010-e
            - generic [ref=e189]: 🎬
            - heading "Filmovi i serije 2010-ih" [level=3] [ref=e190]
            - paragraph [ref=e191]: Marvel, HBO i animirani hitovi
            - generic [ref=e192]:
              - generic [ref=e193]: Frozen
              - generic [ref=e194]: Game of Thrones
              - generic [ref=e195]: Marvel
              - generic [ref=e196]: Joker
            - generic [ref=e197]:
              - text: Igraj
              - generic [ref=e198]: →
          - button "2010-e Svijet 2010-ih Sport, politika i klimatski pokreti Igraj" [ref=e199] [cursor=pointer]:
            - generic [ref=e200]: 2010-e
            - generic [ref=e201]: 🌍
            - heading "Svijet 2010-ih" [level=3] [ref=e202]
            - paragraph [ref=e203]: Sport, politika i klimatski pokreti
            - generic [ref=e204]:
              - generic [ref=e205]: Svjetsko prvenstvo
              - generic [ref=e206]: Olimpijske igre
              - generic [ref=e207]: Politika
              - generic [ref=e208]: Klimatske promjene
            - generic [ref=e209]:
              - text: Igraj
              - generic [ref=e210]: →
          - button "2010-e Hrvatska 2010-ih EU, Vatreni i domaća pop scena Igraj" [ref=e211] [cursor=pointer]:
            - generic [ref=e212]: 2010-e
            - generic [ref=e213]: 🇭🇷
            - heading "Hrvatska 2010-ih" [level=3] [ref=e214]
            - paragraph [ref=e215]: EU, Vatreni i domaća pop scena
            - generic [ref=e216]:
              - generic [ref=e217]: EU
              - generic [ref=e218]: Svjetsko prvenstvo
              - generic [ref=e219]: Hrvatska glazbena scena
              - generic [ref=e220]: Online život
            - generic [ref=e221]:
              - text: Igraj
              - generic [ref=e222]: →
      - generic [ref=e223]:
        - generic [ref=e224]:
          - heading "2000-e i 90-e" [level=3] [ref=e225]
          - paragraph [ref=e226]: Gaming, sport, glazba, NBA i nostalgija
        - generic [ref=e227]:
          - 'button "Gaming 2K Gaming 2000-ih: PC klasici, PS2 i online era Igraj" [ref=e228] [cursor=pointer]':
            - generic [ref=e229]: 🎮
            - heading "Gaming 2K" [level=3] [ref=e230]
            - paragraph [ref=e231]: "Gaming 2000-ih: PC klasici, PS2 i online era"
            - generic [ref=e232]:
              - generic [ref=e233]: PC klasici
              - generic [ref=e234]: PlayStation 2
              - generic [ref=e235]: Nintendo era
              - generic [ref=e236]: LAN i internet
            - generic [ref=e237]:
              - text: Igraj
              - generic [ref=e238]: →
          - button "Nogomet HR 2000-ih Vatreni, izbornici, HNL i velika natjecanja Igraj" [ref=e239] [cursor=pointer]:
            - generic [ref=e240]: ⚽
            - heading "Nogomet HR 2000-ih" [level=3] [ref=e241]
            - paragraph [ref=e242]: Vatreni, izbornici, HNL i velika natjecanja
            - generic [ref=e243]:
              - generic [ref=e244]: Vatreni 2000-ih
              - generic [ref=e245]: Izbornici
              - generic [ref=e246]: HNL klubovi
              - generic [ref=e247]: Velika natjecanja
            - generic [ref=e248]:
              - text: Igraj
              - generic [ref=e249]: →
          - button "Muzika 2000-ih Domaca scena, strani hitovi i digitalni mediji Igraj" [ref=e250] [cursor=pointer]:
            - generic [ref=e251]: 🎵
            - heading "Muzika 2000-ih" [level=3] [ref=e252]
            - paragraph [ref=e253]: Domaca scena, strani hitovi i digitalni mediji
            - generic [ref=e254]:
              - generic [ref=e255]: Domaci pop
              - generic [ref=e256]: Rock scena
              - generic [ref=e257]: Strani hitovi
              - generic [ref=e258]: Digitalna era
            - generic [ref=e259]:
              - text: Igraj
              - generic [ref=e260]: →
          - button "NBA 2000-ih Dynastije, superzvijezde i košarkaška pop kultura Igraj" [ref=e261] [cursor=pointer]:
            - generic [ref=e262]: 🏀
            - heading "NBA 2000-ih" [level=3] [ref=e263]
            - paragraph [ref=e264]: Dynastije, superzvijezde i košarkaška pop kultura
            - generic [ref=e265]:
              - generic [ref=e266]: Lakers era
              - generic [ref=e267]: Spurs era
              - generic [ref=e268]: Zvijezde lige
              - generic [ref=e269]: NBA kultura
            - generic [ref=e270]:
              - text: Igraj
              - generic [ref=e271]: →
          - button "HR filmovi 2000-ih Domaći filmovi, glumci i festivalska scena Igraj" [ref=e272] [cursor=pointer]:
            - generic [ref=e273]: 🎬
            - heading "HR filmovi 2000-ih" [level=3] [ref=e274]
            - paragraph [ref=e275]: Domaći filmovi, glumci i festivalska scena
            - generic [ref=e276]:
              - generic [ref=e277]: Filmovi
              - generic [ref=e278]: Redatelji
              - generic [ref=e279]: Glumci
              - generic [ref=e280]: Filmska scena
            - generic [ref=e281]:
              - text: Igraj
              - generic [ref=e282]: →
          - button "Gaming 90-ih Konzole, likovi i legendarni naslovi Igraj" [ref=e283] [cursor=pointer]:
            - generic [ref=e284]: 🎮
            - heading "Gaming 90-ih" [level=3] [ref=e285]
            - paragraph [ref=e286]: Konzole, likovi i legendarni naslovi
            - generic [ref=e287]:
              - generic [ref=e288]: Konzole
              - generic [ref=e289]: Likovi iz igara
              - generic [ref=e290]: Klasični naslovi
              - generic [ref=e291]: Gejmerska kultura
            - generic [ref=e292]:
              - text: Igraj
              - generic [ref=e293]: →
          - button "Nogomet HR 90-ih Zlatni dečki, klubovi i veliki turniri Igraj" [ref=e294] [cursor=pointer]:
            - generic [ref=e295]: ⚽
            - heading "Nogomet HR 90-ih" [level=3] [ref=e296]
            - paragraph [ref=e297]: Zlatni dečki, klubovi i veliki turniri
            - generic [ref=e298]:
              - generic [ref=e299]: Zlatni dečki
              - generic [ref=e300]: Italia '90
              - generic [ref=e301]: Klubovi
              - generic [ref=e302]: Veliki trenuci
            - generic [ref=e303]:
              - text: Igraj
              - generic [ref=e304]: →
          - button "Muzika 90-ih Domaca scena, rock i svjetski hitovi Igraj" [ref=e305] [cursor=pointer]:
            - generic [ref=e306]: 🎵
            - heading "Muzika 90-ih" [level=3] [ref=e307]
            - paragraph [ref=e308]: Domaca scena, rock i svjetski hitovi
            - generic [ref=e309]:
              - generic [ref=e310]: Domaca pop
              - generic [ref=e311]: Hrvatski rock
              - generic [ref=e312]: Svjetske ikone
              - generic [ref=e313]: Formati i mediji
            - generic [ref=e314]:
              - text: Igraj
              - generic [ref=e315]: →
          - button "NBA 90-ih Dynastije, rivalstva i košarkaška kultura Igraj" [ref=e316] [cursor=pointer]:
            - generic [ref=e317]: 🏀
            - heading "NBA 90-ih" [level=3] [ref=e318]
            - paragraph [ref=e319]: Dynastije, rivalstva i košarkaška kultura
            - generic [ref=e320]:
              - generic [ref=e321]: Chicago Bulls
              - generic [ref=e322]: LA Lakers
              - generic [ref=e323]: Rivali erne
              - generic [ref=e324]: NBA kultura
            - generic [ref=e325]:
              - text: Igraj
              - generic [ref=e326]: →
          - button "HR nostalgija Auti, TV, brendovi i kvizovi iz djetinjstva Igraj" [ref=e327] [cursor=pointer]:
            - generic [ref=e328]: 📺
            - heading "HR nostalgija" [level=3] [ref=e329]
            - paragraph [ref=e330]: Auti, TV, brendovi i kvizovi iz djetinjstva
            - generic [ref=e331]:
              - generic [ref=e332]: Auti nostalgija
              - generic [ref=e333]: Stara televizija
              - generic [ref=e334]: Domaći brendovi
              - generic [ref=e335]: TV kvizovi
            - generic [ref=e336]:
              - text: Igraj
              - generic [ref=e337]: →
    - generic [ref=e338]:
      - heading "Kako se igra?" [level=2] [ref=e339]
      - paragraph [ref=e340]: Jednostavna pravila, zabavna igra — svaki dan nova mozgalica.
      - generic [ref=e341]:
        - article [ref=e342]:
          - generic [ref=e343]: "1"
          - heading "Odaberi 4 pojma" [level=3] [ref=e344]
          - paragraph [ref=e345]: Pronađi četiri riječi koje imaju nešto zajedničko i dodirni ih.
        - article [ref=e346]:
          - generic [ref=e347]: "2"
          - heading "Provjeri vezu" [level=3] [ref=e348]
          - paragraph [ref=e349]: Klikni „Provjeri odabir” i saznaj jesi li pogodio skrivenu grupu.
        - article [ref=e350]:
          - generic [ref=e351]: "3"
          - heading "Podijeli rezultat" [level=3] [ref=e352]
          - paragraph [ref=e353]: Riješi sve četiri grupe i izazovi prijatelje da vide tko je brži.
    - generic [ref=e354]:
      - heading "Izazovi prijateljicu" [level=2] [ref=e355]
      - paragraph [ref=e356]: Pošalji link, ona igra istu mozgalicu, a pobjednica se vidi nakon usporedbe rezultata.
      - generic [ref=e357]:
        - generic [ref=e358]:
          - generic [ref=e359]:
            - generic [ref=e360]: "1"
            - text: Riješi igru i dobiješ link
          - generic [ref=e361]:
            - generic [ref=e362]: "2"
            - text: Prijateljica otvara link i igra
          - generic [ref=e363]:
            - generic [ref=e364]: "3"
            - text: Usporedba, tko je brži i precizniji?
        - button "Pogledaj primjer linka" [ref=e365] [cursor=pointer]
    - generic [ref=e366]:
      - heading "Jedna mala igra za svaki dan" [level=2] [ref=e367]
      - paragraph [ref=e368]: Dovoljno da pokrene mozak, premalo da pojede cijelo popodne.
      - generic [ref=e369]:
        - article [ref=e370]:
          - generic [ref=e371]: ☕
          - heading "Kratka pauza" [level=3] [ref=e372]
          - paragraph [ref=e373]: Riješi je uz kavu, bez žurbe.
        - article [ref=e374]:
          - generic [ref=e375]: 💄
          - heading "Teme iz života" [level=3] [ref=e376]
          - paragraph [ref=e377]: Šminka, njega, dom i wellness.
        - article [ref=e378]:
          - generic [ref=e379]: ⏱️
          - heading "Samo nekoliko minuta" [level=3] [ref=e380]
          - paragraph [ref=e381]: Dovoljno kratko za svaki dan.
        - article [ref=e382]:
          - generic [ref=e383]: 👭
          - heading "Za podijeliti" [level=3] [ref=e384]
          - paragraph [ref=e385]: Pošalji izazov prijateljici.
    - contentinfo [ref=e386]:
      - generic [ref=e387]:
        - generic [ref=e393]: "?"
        - navigation "Podnožje" [ref=e394]:
          - link "O igri" [ref=e395] [cursor=pointer]:
            - /url: "#kako-se-igra"
          - link "Pravila" [ref=e396] [cursor=pointer]:
            - /url: "#kako-se-igra"
          - link "Kontakt" [ref=e397] [cursor=pointer]:
            - /url: mailto:nepar@nepar.hr
          - link "Privatnost" [ref=e398] [cursor=pointer]:
            - /url: /privatnost
          - link "Uvjeti korištenja" [ref=e399] [cursor=pointer]:
            - /url: /
          - button "Postavke privatnosti" [ref=e400] [cursor=pointer]
        - paragraph [ref=e401]: © 2026 Dnevne Asocijacije · nepar.hr
  - dialog "Vi birate analitiku" [ref=e402]:
    - generic [ref=e403]:
      - img [ref=e405]
      - generic [ref=e408]:
        - heading "Vi birate analitiku" [level=2] [ref=e409]
        - paragraph [ref=e410]: Nužne postavke održavaju stranicu funkcionalnom. Uz vaše dopuštenje koristimo GA4 i vlastitu analitiku kako bismo razumjeli koje stranice i upiti stvarno pomažu.
    - generic [ref=e411]:
      - button "Prihvati analitiku" [ref=e412] [cursor=pointer]
      - button "Odbij analitiku" [ref=e413] [cursor=pointer]
      - link "Politika privatnosti" [ref=e414] [cursor=pointer]:
        - /url: /privatnost
```

# Test source

```ts
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
  294 |   test("landing 1440p screenshot", async ({ page }) => {
  295 |     test.skip(test.info().project.name !== "desktop-1440", "1440p only");
  296 |     await page.goto("/mozgalica");
  297 |     await expect(page.getByTestId("hero-title")).toBeVisible();
  298 |     await page.waitForTimeout(500);
> 299 |     await expect(page).toHaveScreenshot("landing-1440.png", { fullPage: true });
      |                        ^ Error: expect(page).toHaveScreenshot(expected) failed
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