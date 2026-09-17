# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web-offer.spec.js >> hero reloads only the new source after a breakpoint change
- Location: e2e\web-offer.spec.js:440:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false

Call Log:
- Timeout 5000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - main [ref=e3]:
    - navigation [ref=e5]:
      - link "Nepar Solutions logo" [ref=e6] [cursor=pointer]:
        - /url: "#top"
        - img "Nepar Solutions logo" [ref=e8]
      - group "Language" [ref=e10]:
        - button "HR" [pressed] [ref=e11] [cursor=pointer]: HR
        - button "ENG" [ref=e13] [cursor=pointer]
      - button "Otvori navigaciju" [ref=e14]:
        - img [ref=e15]
    - generic [ref=e18]:
      - generic [ref=e19]:
        - img [ref=e20]
        - generic [ref=e22]: DIGITALNA RJEŠENJA KOJA RADE
      - heading "Gradimo korisne digitalne proizvode za stvarni svijet." [level=1] [ref=e23]
      - paragraph [ref=e24]: Web aplikacije, AI alati, portali i specijalizirana rješenja od ideje do produkcije.
      - generic [ref=e25]:
        - heading "Izdvojeni projekti" [level=2] [ref=e26]
        - generic [ref=e28]:
          - button "Prethodni projekt" [ref=e30]:
            - img [ref=e31]
          - button "Sljedeći projekt" [ref=e33]:
            - img [ref=e34]
          - img [ref=e38]
          - link "BezStruje.hr Obavijesti o prekidima i kvarovima u opskrbi. Bezstruje.hr prikaz Bezstruje.hr logo" [ref=e44] [cursor=pointer]:
            - /url: https://bezstruje.hr
            - generic [ref=e45]:
              - img [ref=e47]
              - generic [ref=e49]:
                - heading "BezStruje.hr" [level=3] [ref=e50]
                - paragraph [ref=e51]: Obavijesti o prekidima i kvarovima u opskrbi.
            - generic [ref=e52]:
              - img "Bezstruje.hr prikaz" [ref=e53]
              - img "Bezstruje.hr logo" [ref=e55]
          - link "VidimoSe.hr Dječji rođendani, pozivnice i igraonice. Sve na jednom mjestu! Vidimose.hr digitalna pozivnica" [ref=e58] [cursor=pointer]:
            - /url: https://vidimose.hr
            - generic [ref=e59]:
              - img [ref=e61]
              - generic [ref=e63]:
                - heading "VidimoSe.hr" [level=3] [ref=e64]
                - paragraph [ref=e65]: Dječji rođendani, pozivnice i igraonice. Sve na jednom mjestu!
            - img "Vidimose.hr digitalna pozivnica" [ref=e68]
          - link "KPDinfo.com KPD 2026 AI tražilica za točne KPD šifre. KPDinfo.com prikaz" [ref=e71] [cursor=pointer]:
            - /url: https://kpdinfo.com
            - generic [ref=e72]:
              - img [ref=e74]
              - generic [ref=e77]:
                - heading "KPDinfo.com" [level=3] [ref=e78]
                - paragraph [ref=e79]: KPD 2026 AI tražilica za točne KPD šifre.
            - img "KPDinfo.com prikaz" [ref=e81]
          - link "GeoAdrese.net Pretraga adresa, koordinate i prostorni podaci. GeoAdrese.com.hr prikaz" [ref=e92] [cursor=pointer]:
            - /url: https://geoadrese.net
            - generic [ref=e93]:
              - img [ref=e95]
              - generic [ref=e98]:
                - heading "GeoAdrese.net" [level=3] [ref=e99]
                - paragraph [ref=e100]: Pretraga adresa, koordinate i prostorni podaci.
            - generic [ref=e102]:
              - img "GeoAdrese.com.hr prikaz" [ref=e103]
              - img [ref=e105]
          - link "KadigraHrvatska.hr Fanhub navijača Hrvatske — Postani izbornik. KadigraHrvatska.hr prikaz" [ref=e110] [cursor=pointer]:
            - /url: https://kadigrahrvatska.hr
            - generic [ref=e111]:
              - img [ref=e113]
              - generic [ref=e119]:
                - heading "KadigraHrvatska.hr" [level=3] [ref=e120]
                - paragraph [ref=e121]: Fanhub navijača Hrvatske — Postani izbornik.
            - img "KadigraHrvatska.hr prikaz" [ref=e123]
          - link "VremenskaPrognoza.hr Točna vremenska prognoza za Hrvatsku — temperature, oborine i upozorenja. VremenskaPrognoza.hr prikaz" [ref=e127] [cursor=pointer]:
            - /url: https://vremenskaprognoza.hr
            - generic [ref=e128]:
              - img [ref=e130]
              - generic [ref=e135]:
                - heading "VremenskaPrognoza.hr" [level=3] [ref=e136]
                - paragraph [ref=e137]: Točna vremenska prognoza za Hrvatsku — temperature, oborine i upozorenja.
            - img "VremenskaPrognoza.hr prikaz" [ref=e139]
          - generic [ref=e142]:
            - button "Prikaži BezStruje.hr" [ref=e143]
            - button "Prikaži VidimoSe.hr" [ref=e145]
            - button "Prikaži KPDinfo.com" [ref=e147]
            - button "Prikaži GeoAdrese.net" [ref=e149]
            - button "Prikaži KadigraHrvatska.hr" [ref=e151]
            - button "Prikaži VremenskaPrognoza.hr" [ref=e153]
      - generic [ref=e155]:
        - link "Pregled projekata" [ref=e156] [cursor=pointer]:
          - /url: "#projekti"
          - text: Pregled projekata
          - img [ref=e157]
        - link "Kontakt" [ref=e159] [cursor=pointer]:
          - /url: /kontakt
          - text: Kontakt
          - img [ref=e160]
      - generic [ref=e163]:
        - generic [ref=e164]:
          - img [ref=e165]
          - text: Praktični proizvodi
        - generic [ref=e168]:
          - img [ref=e169]
          - text: Brza izvedba
        - generic [ref=e172]:
          - img [ref=e173]
          - text: Fokus na rezultat
    - region "Product proof" [ref=e176]:
      - generic [ref=e178]:
        - generic [ref=e179]:
          - img [ref=e180]
          - generic [ref=e182]:
            - paragraph [ref=e183]: 20+
            - paragraph [ref=e184]: Portali i platforme
        - generic [ref=e185]:
          - img [ref=e186]
          - generic [ref=e188]:
            - paragraph [ref=e189]: 40+
            - paragraph [ref=e190]: Web aplikacija
        - generic [ref=e191]:
          - img [ref=e192]
          - generic [ref=e204]:
            - paragraph [ref=e205]: 15+
            - paragraph [ref=e206]: AI alata i asistenata
        - generic [ref=e207]:
          - img [ref=e208]
          - generic [ref=e210]:
            - paragraph [ref=e211]: 30+
            - paragraph [ref=e212]: Integracija i API-ja
    - generic [ref=e214]:
      - paragraph [ref=e215]: NN 101/2026 · od 1.10.2026. Trgovci i pružatelji usluga s web stranicom moraju objaviti digitalni XML/CSV cjenik.
      - link "Digitalni cjenik 2026 i sidrena cijena" [ref=e216] [cursor=pointer]:
        - /url: /digitalni-cjenik
        - text: Digitalni cjenik 2026 i sidrena cijena
        - img [ref=e217]
    - generic [ref=e220]:
      - generic [ref=e221]:
        - paragraph [ref=e222]: ŠTO RADIMO?
        - heading "Rješenja koja donose vrijednost." [level=2] [ref=e223]
        - paragraph [ref=e224]: Od ideje do stabilnog proizvoda, brzo i fokusirano na korisnika.
      - generic [ref=e225]:
        - article [ref=e226]:
          - generic [ref=e228]:
            - generic [ref=e229]:
              - img [ref=e231]
              - heading "Web aplikacije" [level=3] [ref=e234]
            - paragraph [ref=e235]: Pretvaramo ideje u brze, sigurne i skalabilne web aplikacije prilagođene vašem poslovanju — od prototipa do produkcije.
        - article [ref=e236]:
          - generic [ref=e238]:
            - generic [ref=e239]:
              - img [ref=e241]
              - heading "Portali i alati" [level=3] [ref=e245]
            - paragraph [ref=e246]: Specijalizirani portali i pametni alati koji rješavaju prave probleme vaših korisnika — brže, jednostavnije, učinkovitije.
        - article [ref=e247]:
          - generic [ref=e249]:
            - generic [ref=e250]:
              - img [ref=e252]
              - heading "AI i automatizacija" [level=3] [ref=e255]
            - paragraph [ref=e256]: AI asistenti i automatizacija koja preuzima repetitivne zadatke, ubrzava procese i oslobađa vaš tim za ono što je zaista važno.
        - article [ref=e257]:
          - generic [ref=e259]:
            - generic [ref=e260]:
              - img [ref=e262]
              - heading "Mape i podaci" [level=3] [ref=e266]
            - paragraph [ref=e267]: Geo rješenja, pretraga adresa i prostorne analize integrirane direktno u vaš sustav — precizno, pouzdano i u stvarnom vremenu.
    - generic [ref=e269]:
      - generic [ref=e270]:
        - generic [ref=e271]:
          - paragraph [ref=e272]: PRODUCT LAB
          - heading "IZDVOJENI PROJEKTI" [level=2] [ref=e273]
        - paragraph [ref=e274]: 11 proizvoda · stvarni radovi
      - list "IZDVOJENI PROJEKTI" [ref=e275]:
        - listitem [ref=e276]:
          - link "Bezstruje.hr prikaz BezStruje.hr" [ref=e277] [cursor=pointer]:
            - /url: https://bezstruje.hr
            - img "Bezstruje.hr prikaz" [ref=e279]
            - heading "BezStruje.hr" [level=3] [ref=e282]:
              - text: Bez
              - generic [ref=e283]: Struje.hr
        - listitem [ref=e284]:
          - link "Vidimose.hr digitalna pozivnica VidimoSe.hr" [ref=e285] [cursor=pointer]:
            - /url: https://vidimose.hr
            - img "Vidimose.hr digitalna pozivnica" [ref=e287]
            - heading "VidimoSe.hr" [level=3] [ref=e290]:
              - text: Vidimo
              - generic [ref=e291]: Se.hr
        - listitem [ref=e292]:
          - link "KPDinfo.com KPDinfo.com" [ref=e293] [cursor=pointer]:
            - /url: https://kpdinfo.com
            - img "KPDinfo.com" [ref=e295]
            - heading "KPDinfo.com" [level=3] [ref=e298]:
              - text: K
              - generic [ref=e299]: P
              - generic [ref=e300]: Dinfo.com
        - listitem [ref=e301]:
          - link "GeoAdrese.com.hr prikaz GeoAdrese.net" [ref=e302] [cursor=pointer]:
            - /url: https://geoadrese.net
            - img "GeoAdrese.com.hr prikaz" [ref=e304]
            - heading "GeoAdrese.net" [level=3] [ref=e307]:
              - text: Geo
              - generic [ref=e308]: Adrese.net
        - listitem [ref=e309]:
          - link "KadigraHrvatska.hr prikaz KadigraHrvatska.hr" [ref=e310] [cursor=pointer]:
            - /url: https://kadigrahrvatska.hr
            - img "KadigraHrvatska.hr prikaz" [ref=e312]
            - heading "KadigraHrvatska.hr" [level=3] [ref=e315]:
              - text: Kadigra
              - generic [ref=e316]: Hrvatska.hr
        - listitem [ref=e317]:
          - link "VremenskaPrognoza.hr prikaz VremenskaPrognoza.hr" [ref=e318] [cursor=pointer]:
            - /url: https://vremenskaprognoza.hr
            - img "VremenskaPrognoza.hr prikaz" [ref=e320]
            - heading "VremenskaPrognoza.hr" [level=3] [ref=e323]:
              - text: Vremenska
              - generic [ref=e324]: Prognoza.hr
        - listitem [ref=e325]:
          - link "Njamko Njamko" [ref=e326] [cursor=pointer]:
            - /url: https://njamko.nepar.hr
            - img "Njamko" [ref=e328]
            - heading "Njamko" [level=3] [ref=e331]
        - listitem [ref=e332]:
          - link "Bajkoteka" [ref=e333] [cursor=pointer]:
            - /url: https://bajkoteka.nepar.hr
            - heading "Bajkoteka" [level=3] [ref=e337]
        - listitem [ref=e338]:
          - link "Handyman" [ref=e339] [cursor=pointer]:
            - /url: https://handyman.nepar.hr
            - heading "Handyman" [level=3] [ref=e343]
        - listitem [ref=e344]:
          - article [ref=e345]:
            - heading "Hackosaur" [level=3] [ref=e349]
        - listitem [ref=e350]:
          - link "Auto Gubić web-stranica Auto Gubić" [ref=e351] [cursor=pointer]:
            - /url: https://autogubic.hr/
            - img "Auto Gubić web-stranica" [ref=e353]
            - heading "Auto Gubić" [level=3] [ref=e356]:
              - text: Auto
              - generic [ref=e357]: Gubić
    - generic [ref=e359]:
      - generic [ref=e360]:
        - paragraph [ref=e361]: JASNA PONUDA
        - heading "Web-stranica koja pripada vašem poslovanju" [level=2] [ref=e362]
        - paragraph [ref=e363]: Izradu plaćate jednokratno, a održavanje birate samo ako vam treba. Opseg, cijena i broj dorada poznati su prije početka rada.
      - generic [ref=e364]:
        - strong [ref=e365]: Paketi izrade kreću od 300 € jednokratno.
        - generic [ref=e366]: Održavanje nije obavezno i ugovara se zasebno.
      - generic [ref=e367]:
        - generic [ref=e368]:
          - paragraph [ref=e369]: Paketi web-stranica
          - paragraph [ref=e370]: Usporedite opseg, cijene i što je uključeno u svaki paket.
        - link "Pogledaj pakete" [ref=e371] [cursor=pointer]:
          - /url: /usluge/izrada-web-stranica#paketi
          - text: Pogledaj pakete
          - img [ref=e372]
    - generic [ref=e375]:
      - button "Pokreni priču o evoluciji tehnologije" [ref=e376]:
        - generic [ref=e378]:
          - img [ref=e380]
          - text: Pokreni animaciju
      - generic [ref=e382]:
        - paragraph [ref=e383]: O NAMA
        - heading "Tehnička izvedba, jasna komunikacija i fokus na proizvod koji radi." [level=2] [ref=e384]
        - paragraph [ref=e385]: Nepar Solutions spaja razvoj web aplikacija, AI rješenja, portala, integracija i rada s podacima u jedan praktičan proces.
        - list "O NAMA" [ref=e386]:
          - listitem [ref=e387]:
            - generic [ref=e388]: "01"
            - generic [ref=e389]:
              - heading "Razumijemo problem" [level=3] [ref=e390]
              - paragraph [ref=e391]: Cilj, korisnici i realan opseg prije prve linije koda.
          - listitem [ref=e392]:
            - generic [ref=e393]: "02"
            - generic [ref=e394]:
              - heading "Gradimo i provjeravamo" [level=3] [ref=e395]
              - paragraph [ref=e396]: Jasne faze, vidljiv napredak i provjera na stvarnim uređajima.
          - listitem [ref=e397]:
            - generic [ref=e398]: "03"
            - generic [ref=e399]:
              - heading "Isporučujemo proizvod" [level=3] [ref=e400]
              - paragraph [ref=e401]: Stabilna objava, vlasništvo i konkretan sljedeći korak.
    - generic [ref=e404]:
      - generic [ref=e405]:
        - img [ref=e409]
        - generic [ref=e414]:
          - heading "Imate ideju? Pretvorimo je u proizvod." [level=2] [ref=e415]
          - paragraph [ref=e416]: Od prvog razgovora do lansiranja, tu smo da vaša ideja postane stvarnost.
      - link "Javite se i pokrenimo projekt" [ref=e417] [cursor=pointer]:
        - /url: /kontakt
        - text: Javite se i pokrenimo projekt
        - img [ref=e418]
    - generic [ref=e423]:
      - generic [ref=e425]:
        - paragraph [ref=e426]: Poslovni podaci
        - paragraph [ref=e427]: Nepar, obrt za digitalna rješenja i usluge
        - generic [ref=e428]:
          - generic [ref=e429]: vl. Ivan Gorupić
          - generic [ref=e430]: "MBO: 99267101"
          - link "nepar@nepar.hr" [ref=e431] [cursor=pointer]:
            - /url: mailto:nepar@nepar.hr
      - generic [ref=e432]:
        - paragraph [ref=e433]: © 2026 Nepar Solutions. Digitalna rješenja po mjeri.
        - generic [ref=e434]:
          - link "Digitalni cjenik 2026." [ref=e435] [cursor=pointer]:
            - /url: /digitalni-cjenik
          - link "Cjenik" [ref=e436] [cursor=pointer]:
            - /url: /cjenik
          - link "Privatnost" [ref=e437] [cursor=pointer]:
            - /url: /privatnost
          - button "Postavke privatnosti" [ref=e438] [cursor=pointer]
          - link "Povratak na vrh" [ref=e439] [cursor=pointer]:
            - /url: "#top"
  - dialog "Vi birate analitiku" [ref=e440]:
    - generic [ref=e441]:
      - img [ref=e443]
      - generic [ref=e446]:
        - heading "Vi birate analitiku" [level=2] [ref=e447]
        - paragraph [ref=e448]: Nužne postavke održavaju stranicu funkcionalnom. Uz vaše dopuštenje koristimo GA4 i vlastitu analitiku kako bismo razumjeli koje stranice i upiti stvarno pomažu.
    - generic [ref=e449]:
      - button "Prihvati analitiku" [ref=e450] [cursor=pointer]
      - button "Odbij analitiku" [ref=e451] [cursor=pointer]
      - link "Politika privatnosti" [ref=e452] [cursor=pointer]:
        - /url: /privatnost
```

# Test source

```ts
  380 |   }
  381 | 
  382 |   await expectNoHorizontalOverflow(page);
  383 |   await expectTouchTargets(page);
  384 | });
  385 | 
  386 | test("hero video is poster-first and loads only the active breakpoint source", async ({ page }) => {
  387 |   await installControlledHeroIdle(page);
  388 |   const videoRequests = [];
  389 |   page.on("request", (request) => {
  390 |     const pathname = new URL(request.url()).pathname;
  391 |     if (heroVideoPattern.test(pathname)) videoRequests.push(pathname);
  392 |   });
  393 |   await page.goto("/");
  394 |   const hero = page.locator("#top");
  395 |   const isMobileViewport = (page.viewportSize()?.width ?? 0) < 768;
  396 |   const sourceKey = isMobileViewport ? "mobile" : "desktop";
  397 |   const webmPath = `/brand/hero-${sourceKey}.webm`;
  398 |   const mp4Path = `/brand/hero-${sourceKey}.mp4`;
  399 | 
  400 |   await expect(hero.locator(".hero-background-poster")).toBeVisible();
  401 |   await expect(hero.locator('picture img[src="/nepar-background-desktop-2400x900.webp"]')).toBeVisible();
  402 |   await expect(hero.locator("video")).toHaveCount(1);
  403 |   await expect(hero.locator("video source")).toHaveCount(0);
  404 |   expect(videoRequests).toEqual([]);
  405 | 
  406 |   await page.evaluate(() => window.__runHeroIdleCallbacks());
  407 |   const sources = hero.locator("video source");
  408 |   await expect(sources).toHaveCount(2);
  409 |   await expect(sources.nth(0)).toHaveAttribute("src", webmPath);
  410 |   await expect(sources.nth(0)).toHaveAttribute("type", "video/webm; codecs=vp9");
  411 |   await expect(sources.nth(1)).toHaveAttribute("src", mp4Path);
  412 |   await expect(sources.nth(1)).toHaveAttribute("type", 'video/mp4; codecs="hvc1"');
  413 |   await expect.poll(() => videoRequests.includes(webmPath)).toBe(true);
  414 |   expect(videoRequests.some((path) => path.includes(sourceKey === "mobile" ? "desktop" : "mobile"))).toBe(false);
  415 |   await expect.poll(() => hero.locator("video").evaluate((video) => new URL(video.currentSrc).pathname)).toBe(webmPath);
  416 |   await expect(hero.locator("video")).toHaveClass(/hero-background-video--visible/);
  417 |   await expect(hero.locator(".hero-background-poster")).toBeVisible();
  418 | 
  419 |   for (const eventName of ["error", "abort", "emptied"]) {
  420 |     await hero.locator("video").dispatchEvent(eventName);
  421 |     await expect(hero.locator("video")).not.toHaveClass(/hero-background-video--visible/);
  422 |     await expect(hero.locator(".hero-background-poster")).toBeVisible();
  423 |     await hero.locator("video").dispatchEvent("playing");
  424 |     await expect(hero.locator("video")).toHaveClass(/hero-background-video--visible/);
  425 |   }
  426 | });
  427 | 
  428 | test("hero keeps the poster when autoplay is rejected", async ({ page }) => {
  429 |   await page.addInitScript(() => {
  430 |     HTMLMediaElement.prototype.play = () => Promise.reject(new DOMException("Autoplay blocked", "NotAllowedError"));
  431 |   });
  432 |   await page.goto("/");
  433 |   const hero = page.locator("#top");
  434 |   await expect(hero.locator("video")).toHaveCount(1);
  435 |   await page.waitForTimeout(600);
  436 |   await expect(hero.locator("video")).not.toHaveClass(/hero-background-video--visible/);
  437 |   await expect(hero.locator(".hero-background-poster")).toBeVisible();
  438 | });
  439 | 
  440 | test("hero reloads only the new source after a breakpoint change", async ({ page }) => {
  441 |   await installControlledHeroIdle(page);
  442 |   await page.addInitScript(() => {
  443 |     const nativeLoad = HTMLMediaElement.prototype.load;
  444 |     window.__heroLoadCalls = 0;
  445 |     HTMLMediaElement.prototype.load = function load() {
  446 |       if (this.classList.contains("hero-background-video")) window.__heroLoadCalls += 1;
  447 |       return nativeLoad.call(this);
  448 |     };
  449 |   });
  450 |   const videoRequests = [];
  451 |   page.on("request", (request) => {
  452 |     const pathname = new URL(request.url()).pathname;
  453 |     if (heroVideoPattern.test(pathname)) videoRequests.push(pathname);
  454 |   });
  455 | 
  456 |   await page.goto("/");
  457 |   const hero = page.locator("#top");
  458 |   const initialMobile = (page.viewportSize()?.width ?? 0) < 768;
  459 |   const initialKey = initialMobile ? "mobile" : "desktop";
  460 |   const nextKey = initialMobile ? "desktop" : "mobile";
  461 |   await page.evaluate(() => window.__runHeroIdleCallbacks());
  462 |   await expect.poll(() => hero.locator("video").getAttribute("data-source-key")).toBe(initialKey);
  463 |   await expect.poll(() => hero.locator("video").evaluate((video) => new URL(video.currentSrc).pathname))
  464 |     .toBe(`/brand/hero-${initialKey}.webm`);
  465 | 
  466 |   const requestsBeforeSwitch = videoRequests.length;
  467 |   const loadCallsBeforeSwitch = await page.evaluate(() => window.__heroLoadCalls);
  468 |   await page.setViewportSize(initialMobile ? { width: 1440, height: 900 } : { width: 390, height: 844 });
  469 |   await expect(hero.locator("video")).toHaveAttribute("data-source-key", nextKey);
  470 |   await expect(hero.locator("video")).not.toHaveClass(/hero-background-video--visible/);
  471 |   await expect(hero.locator("video source")).toHaveCount(0);
  472 |   await page.evaluate(() => window.__runHeroIdleCallbacks());
  473 |   await expect(hero.locator("video source").nth(0)).toHaveAttribute("src", `/brand/hero-${nextKey}.webm`);
  474 |   await expect.poll(() => hero.locator("video").evaluate((video) => new URL(video.currentSrc).pathname))
  475 |     .toBe(`/brand/hero-${nextKey}.webm`);
  476 |   await expect.poll(() => page.evaluate(() => window.__heroLoadCalls)).toBeGreaterThan(loadCallsBeforeSwitch);
  477 |   expect(videoRequests.slice(requestsBeforeSwitch).some((path) => path.includes(initialKey))).toBe(false);
  478 | 
  479 |   await page.locator("#projekti").scrollIntoViewIfNeeded();
> 480 |   await expect.poll(() => hero.locator("video").evaluate((video) => video.paused)).toBe(true);
      |                                                                                    ^ Error: expect(received).toBe(expected) // Object.is equality
  481 |   await hero.scrollIntoViewIfNeeded();
  482 |   await expect.poll(() => hero.locator("video").evaluate((video) => video.paused)).toBe(false);
  483 | 
  484 |   await page.evaluate(() => {
  485 |     let mockedVisibilityState = "visible";
  486 |     Object.defineProperty(document, "visibilityState", {
  487 |       configurable: true,
  488 |       get: () => mockedVisibilityState,
  489 |     });
  490 |     window.__setHeroVisibility = (state) => {
  491 |       mockedVisibilityState = state;
  492 |       document.dispatchEvent(new Event("visibilitychange"));
  493 |     };
  494 |   });
  495 |   await page.evaluate(() => window.__setHeroVisibility("hidden"));
  496 |   await expect.poll(() => hero.locator("video").evaluate((video) => video.paused)).toBe(true);
  497 |   await page.evaluate(() => window.__setHeroVisibility("visible"));
  498 |   await expect.poll(() => hero.locator("video").evaluate((video) => video.paused)).toBe(false);
  499 | });
  500 | 
  501 | test("hero media assets are served with explicit MIME types", async ({ request }) => {
  502 |   for (const [asset, contentType] of [
  503 |     ["/brand/hero-desktop.webm", "video/webm"],
  504 |     ["/brand/hero-mobile.webm", "video/webm"],
  505 |     ["/brand/hero-desktop.mp4", "video/mp4"],
  506 |     ["/brand/hero-mobile.mp4", "video/mp4"],
  507 |     ["/nepar-background-desktop-2400x900.webp", "image/webp"],
  508 |     ["/nepar-background-mobile-900x1600.webp", "image/webp"],
  509 |   ]) {
  510 |     const response = await request.get(asset);
  511 |     expect(response.ok(), asset).toBe(true);
  512 |     expect(response.headers()["content-type"], asset).toContain(contentType);
  513 |   }
  514 | });
  515 | 
  516 | test("offer data keeps one recommendation per kind and redesign priced above new development", () => {
  517 |   for (const locale of Object.values(webOfferContent)) {
  518 |     const groups = [locale.buildPackages, locale.redesignPackages, locale.maintenancePackages, locale.socialPackages];
  519 |     for (const packages of groups) {
  520 |       expect(packages.filter((item) => item.recommended)).toHaveLength(1);
  521 |     }
  522 | 
  523 |     locale.redesignPackages.forEach((item, index) => {
  524 |       expect(item.price).toBeGreaterThan(locale.buildPackages[index].price);
  525 |       expect(item.priceFrom).toBe(true);
  526 |     });
  527 | 
  528 |     expect(locale.socialPackages.map((item) => item.price)).toEqual([300, 450, 650]);
  529 |     expect(locale.socialPackages.find((item) => item.recommended).id).toBe("social-business");
  530 |     for (const item of locale.socialPackages) {
  531 |       expect(item.billingCycle).toBe("monthly");
  532 |       const includedText = item.included.join(" ").toLowerCase();
  533 |       expect(includedText).not.toMatch(/meta ads|meta oglas/);
  534 |     }
  535 |   }
  536 | });
  537 | 
  538 | test("pricing shows new development, redesign migration, and optional annual maintenance", async ({ page }) => {
  539 |   await page.goto(servicePath);
  540 |   await expect(page.getByRole("heading", { level: 1, name: "Izrada web-stranica za obrte i tvrtke." })).toBeVisible();
  541 |   await expect(page.getByText("Održavanje nije obavezno", { exact: false }).first()).toBeVisible();
  542 | 
  543 |   for (const [name, price] of [["Web Basic", "300 €"], ["Web Business", "500 €"], ["Web Pro", "700 €"]]) {
  544 |     const card = page.locator("article.offer-card").filter({ hasText: name }).first();
  545 |     await expect(card).toContainText(price);
  546 |     await expect(card).toContainText("jednokratno");
  547 |   }
  548 | 
  549 |   await page.locator("#redesign-offer-tab").click();
  550 |   await expect(page.getByText("Migracija sadržaja postojećeg weba uključena je prema opsegu paketa.")).toBeVisible();
  551 |   for (const [name, price] of [["Redizajn Basic", "od 800 €"], ["Redizajn Business", "od 1.100 €"], ["Redizajn Pro", "od 1.500 €"]]) {
  552 |     const card = page.locator("article.offer-card").filter({ hasText: name }).first();
  553 |     await expect(card).toContainText(price);
  554 |     await expect(card).toContainText("jednokratno");
  555 |   }
  556 |   await expect(page.locator("article.offer-card").filter({ hasText: "Redizajn Business" })).toContainText("Preporučeno");
  557 |   await expect(page.getByText("Redizajn postojeće web-stranice", { exact: true })).toHaveCount(0);
  558 | 
  559 |   await page.locator("#maintenance-offer-tab").click();
  560 |   for (const [name, price] of [["Održavanje Basic", "200 €"], ["Održavanje Business", "400 €"], ["Održavanje Pro", "600 €"]]) {
  561 |     const card = page.locator("article.offer-card").filter({ hasText: name }).first();
  562 |     await expect(card).toContainText(price);
  563 |     await expect(card).toContainText("godišnje");
  564 |   }
  565 | 
  566 |   const proCard = page.locator("article.offer-card").filter({ hasText: "Održavanje Pro" });
  567 |   await expect(proCard).toContainText("Proaktivni partner");
  568 |   await expect(proCard).toContainText("4 proaktivna tehnička ili UX poboljšanja godišnje");
  569 |   await expect(proCard).toContainText("Kvartalni pregled weba i performansi");
  570 |   await expect(proCard).toContainText("Prvi odgovor unutar 1 radnog dana");
  571 |   await expect(proCard).toContainText("50 € mjesečni ekvivalent");
  572 |   await expect(proCard).toContainText("Naplata jednom godišnje");
  573 |   await expect(proCard.getByText(/do 30 minuta implementacije/)).toBeHidden();
  574 |   await proCard.getByText("Sve uključeno").click();
  575 |   await expect(proCard.getByText(/do 30 minuta implementacije/)).toBeVisible();
  576 | 
  577 |   for (const id of ["maintenance-basic", "maintenance-business"]) {
  578 |     await expect(page.locator(`[data-package-id="${id}"]`)).not.toContainText("mjesečni ekvivalent");
  579 |   }
  580 | 
```