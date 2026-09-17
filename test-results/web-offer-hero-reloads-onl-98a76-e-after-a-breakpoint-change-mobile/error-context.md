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
      - generic [ref=e9]:
        - link "Projekti" [ref=e10] [cursor=pointer]:
          - /url: "#projekti"
          - generic [ref=e11]: Projekti
        - link "Usluge" [ref=e12] [cursor=pointer]:
          - /url: "#usluge"
          - generic [ref=e13]: Usluge
        - link "Cjenik" [ref=e14] [cursor=pointer]:
          - /url: /usluge/izrada-web-stranica#paketi
          - img [ref=e15]
          - generic [ref=e18]: Cjenik
        - link "O nama" [ref=e19] [cursor=pointer]:
          - /url: "#onama"
          - generic [ref=e20]: O nama
        - link "Kontakt" [ref=e21] [cursor=pointer]:
          - /url: /kontakt
          - img [ref=e22]
          - generic [ref=e25]: Kontakt
      - group "Language" [ref=e27]:
        - button "HR" [pressed] [ref=e28] [cursor=pointer]: HR
        - button "ENG" [ref=e30] [cursor=pointer]
      - link "nepar@nepar.hr" [ref=e31] [cursor=pointer]:
        - /url: mailto:nepar@nepar.hr
        - img [ref=e32]
        - text: nepar@nepar.hr
    - generic [ref=e36]:
      - generic [ref=e37]:
        - generic [ref=e38]:
          - img [ref=e39]
          - generic [ref=e41]: DIGITALNA RJEŠENJA KOJA RADE
        - heading "Gradimo korisne digitalne proizvode za stvarni svijet." [level=1] [ref=e42]
        - paragraph [ref=e43]: Web aplikacije, AI alati, portali i specijalizirana rješenja od ideje do produkcije.
        - generic [ref=e44]:
          - link "Pregled projekata" [ref=e45] [cursor=pointer]:
            - /url: "#projekti"
            - text: Pregled projekata
            - img [ref=e46]
          - link "Kontakt" [ref=e48] [cursor=pointer]:
            - /url: /kontakt
            - text: Kontakt
            - img [ref=e49]
        - generic [ref=e52]:
          - generic [ref=e53]:
            - img [ref=e54]
            - text: Praktični proizvodi
          - generic [ref=e57]:
            - img [ref=e58]
            - text: Brza izvedba
          - generic [ref=e61]:
            - img [ref=e62]
            - text: Fokus na rezultat
      - generic [ref=e65]:
        - heading "Izdvojeni projekti" [level=2] [ref=e66]
        - generic [ref=e69]:
          - button "Prethodni projekt" [ref=e71]:
            - img [ref=e72]
          - button "Sljedeći projekt" [ref=e74]:
            - img [ref=e75]
          - img [ref=e79]
          - link "BezStruje.hr Obavijesti o prekidima i kvarovima u opskrbi. Bezstruje.hr prikaz Bezstruje.hr logo" [ref=e86] [cursor=pointer]:
            - /url: https://bezstruje.hr
            - generic [ref=e87]:
              - img [ref=e89]
              - generic [ref=e91]:
                - heading "BezStruje.hr" [level=3] [ref=e92]
                - paragraph [ref=e93]: Obavijesti o prekidima i kvarovima u opskrbi.
            - generic [ref=e94]:
              - img "Bezstruje.hr prikaz" [ref=e95]
              - img "Bezstruje.hr logo" [ref=e97]
          - link "VidimoSe.hr Dječji rođendani, pozivnice i igraonice. Sve na jednom mjestu! Vidimose.hr digitalna pozivnica" [ref=e100] [cursor=pointer]:
            - /url: https://vidimose.hr
            - generic [ref=e101]:
              - img [ref=e103]
              - generic [ref=e105]:
                - heading "VidimoSe.hr" [level=3] [ref=e106]
                - paragraph [ref=e107]: Dječji rođendani, pozivnice i igraonice. Sve na jednom mjestu!
            - img "Vidimose.hr digitalna pozivnica" [ref=e110]
          - link "KPDinfo.com KPD 2026 AI tražilica za točne KPD šifre. KPDinfo.com prikaz" [ref=e113] [cursor=pointer]:
            - /url: https://kpdinfo.com
            - generic [ref=e114]:
              - img [ref=e116]
              - generic [ref=e121]:
                - heading "KPDinfo.com" [level=3] [ref=e122]
                - paragraph [ref=e123]: KPD 2026 AI tražilica za točne KPD šifre.
            - img "KPDinfo.com prikaz" [ref=e125]
          - link "GeoAdrese.net Pretraga adresa, koordinate i prostorni podaci. GeoAdrese.com.hr prikaz" [ref=e136] [cursor=pointer]:
            - /url: https://geoadrese.net
            - generic [ref=e137]:
              - img [ref=e139]
              - generic [ref=e142]:
                - heading "GeoAdrese.net" [level=3] [ref=e143]
                - paragraph [ref=e144]: Pretraga adresa, koordinate i prostorni podaci.
            - generic [ref=e146]:
              - img "GeoAdrese.com.hr prikaz" [ref=e147]
              - img [ref=e149]
          - link "KadigraHrvatska.hr Fanhub navijača Hrvatske — Postani izbornik. KadigraHrvatska.hr prikaz" [ref=e154] [cursor=pointer]:
            - /url: https://kadigrahrvatska.hr
            - generic [ref=e155]:
              - img [ref=e157]
              - generic [ref=e164]:
                - heading "KadigraHrvatska.hr" [level=3] [ref=e165]
                - paragraph [ref=e166]: Fanhub navijača Hrvatske — Postani izbornik.
            - img "KadigraHrvatska.hr prikaz" [ref=e168]
          - link "VremenskaPrognoza.hr Točna vremenska prognoza za Hrvatsku — temperature, oborine i upozorenja. VremenskaPrognoza.hr prikaz" [ref=e172] [cursor=pointer]:
            - /url: https://vremenskaprognoza.hr
            - generic [ref=e173]:
              - img [ref=e175]
              - generic [ref=e181]:
                - heading "VremenskaPrognoza.hr" [level=3] [ref=e182]
                - paragraph [ref=e183]: Točna vremenska prognoza za Hrvatsku — temperature, oborine i upozorenja.
            - img "VremenskaPrognoza.hr prikaz" [ref=e185]
          - img
          - generic [ref=e187]:
            - generic [ref=e188]:
              - button "Prikaži BezStruje.hr" [ref=e189]
              - button "Prikaži VidimoSe.hr" [ref=e191]
              - button "Prikaži KPDinfo.com" [ref=e193]
              - button "Prikaži GeoAdrese.net" [ref=e195]
              - button "Prikaži KadigraHrvatska.hr" [ref=e197]
              - button "Prikaži VremenskaPrognoza.hr" [ref=e199]
            - generic [ref=e201]:
              - img [ref=e203]
              - text: Rotirajući prikaz projekata
    - region "Product proof" [ref=e206]:
      - generic [ref=e208]:
        - generic [ref=e209]:
          - img [ref=e210]
          - generic [ref=e212]:
            - paragraph [ref=e213]: 20+
            - paragraph [ref=e214]: Portali i platforme
        - generic [ref=e215]:
          - img [ref=e216]
          - generic [ref=e218]:
            - paragraph [ref=e219]: 40+
            - paragraph [ref=e220]: Web aplikacija
        - generic [ref=e221]:
          - img [ref=e222]
          - generic [ref=e234]:
            - paragraph [ref=e235]: 15+
            - paragraph [ref=e236]: AI alata i asistenata
        - generic [ref=e237]:
          - img [ref=e238]
          - generic [ref=e240]:
            - paragraph [ref=e241]: 30+
            - paragraph [ref=e242]: Integracija i API-ja
    - generic [ref=e244]:
      - paragraph [ref=e245]: NN 101/2026 · od 1.10.2026. Trgovci i pružatelji usluga s web stranicom moraju objaviti digitalni XML/CSV cjenik.
      - link "Digitalni cjenik 2026 i sidrena cijena" [ref=e246] [cursor=pointer]:
        - /url: /digitalni-cjenik
        - text: Digitalni cjenik 2026 i sidrena cijena
        - img [ref=e247]
    - generic [ref=e250]:
      - generic [ref=e251]:
        - paragraph [ref=e252]: ŠTO RADIMO?
        - heading "Rješenja koja donose vrijednost." [level=2] [ref=e253]
        - paragraph [ref=e254]: Od ideje do stabilnog proizvoda, brzo i fokusirano na korisnika.
      - generic [ref=e255]:
        - article [ref=e256]:
          - generic [ref=e258]:
            - generic [ref=e259]:
              - img [ref=e261]
              - heading "Web aplikacije" [level=3] [ref=e264]
            - paragraph [ref=e265]: Pretvaramo ideje u brze, sigurne i skalabilne web aplikacije prilagođene vašem poslovanju — od prototipa do produkcije.
        - article [ref=e266]:
          - generic [ref=e268]:
            - generic [ref=e269]:
              - img [ref=e271]
              - heading "Portali i alati" [level=3] [ref=e275]
            - paragraph [ref=e276]: Specijalizirani portali i pametni alati koji rješavaju prave probleme vaših korisnika — brže, jednostavnije, učinkovitije.
        - article [ref=e277]:
          - generic [ref=e279]:
            - generic [ref=e280]:
              - img [ref=e282]
              - heading "AI i automatizacija" [level=3] [ref=e285]
            - paragraph [ref=e286]: AI asistenti i automatizacija koja preuzima repetitivne zadatke, ubrzava procese i oslobađa vaš tim za ono što je zaista važno.
        - article [ref=e287]:
          - generic [ref=e289]:
            - generic [ref=e290]:
              - img [ref=e292]
              - heading "Mape i podaci" [level=3] [ref=e296]
            - paragraph [ref=e297]: Geo rješenja, pretraga adresa i prostorne analize integrirane direktno u vaš sustav — precizno, pouzdano i u stvarnom vremenu.
    - generic [ref=e299]:
      - generic [ref=e300]:
        - generic [ref=e301]:
          - paragraph [ref=e302]: PRODUCT LAB
          - heading "IZDVOJENI PROJEKTI" [level=2] [ref=e303]
        - paragraph [ref=e304]: 11 proizvoda · stvarni radovi
      - list "IZDVOJENI PROJEKTI" [ref=e305]:
        - listitem [ref=e306]:
          - link "Bezstruje.hr prikaz BezStruje.hr" [ref=e307] [cursor=pointer]:
            - /url: https://bezstruje.hr
            - img "Bezstruje.hr prikaz" [ref=e309]
            - heading "BezStruje.hr" [level=3] [ref=e312]:
              - text: Bez
              - generic [ref=e313]: Struje.hr
        - listitem [ref=e314]:
          - link "Vidimose.hr digitalna pozivnica VidimoSe.hr" [ref=e315] [cursor=pointer]:
            - /url: https://vidimose.hr
            - img "Vidimose.hr digitalna pozivnica" [ref=e317]
            - heading "VidimoSe.hr" [level=3] [ref=e320]:
              - text: Vidimo
              - generic [ref=e321]: Se.hr
        - listitem [ref=e322]:
          - link "KPDinfo.com KPDinfo.com" [ref=e323] [cursor=pointer]:
            - /url: https://kpdinfo.com
            - img "KPDinfo.com" [ref=e325]
            - heading "KPDinfo.com" [level=3] [ref=e328]:
              - text: K
              - generic [ref=e329]: P
              - generic [ref=e330]: Dinfo.com
        - listitem [ref=e331]:
          - link "GeoAdrese.com.hr prikaz GeoAdrese.net" [ref=e332] [cursor=pointer]:
            - /url: https://geoadrese.net
            - img "GeoAdrese.com.hr prikaz" [ref=e334]
            - heading "GeoAdrese.net" [level=3] [ref=e337]:
              - text: Geo
              - generic [ref=e338]: Adrese.net
        - listitem [ref=e339]:
          - link "KadigraHrvatska.hr prikaz KadigraHrvatska.hr" [ref=e340] [cursor=pointer]:
            - /url: https://kadigrahrvatska.hr
            - img "KadigraHrvatska.hr prikaz" [ref=e342]
            - heading "KadigraHrvatska.hr" [level=3] [ref=e345]:
              - text: Kadigra
              - generic [ref=e346]: Hrvatska.hr
        - listitem [ref=e347]:
          - link "VremenskaPrognoza.hr prikaz VremenskaPrognoza.hr" [ref=e348] [cursor=pointer]:
            - /url: https://vremenskaprognoza.hr
            - img "VremenskaPrognoza.hr prikaz" [ref=e350]
            - heading "VremenskaPrognoza.hr" [level=3] [ref=e353]:
              - text: Vremenska
              - generic [ref=e354]: Prognoza.hr
        - listitem [ref=e355]:
          - link "Njamko Njamko" [ref=e356] [cursor=pointer]:
            - /url: https://njamko.nepar.hr
            - img "Njamko" [ref=e358]
            - heading "Njamko" [level=3] [ref=e361]
        - listitem [ref=e362]:
          - link "Bajkoteka" [ref=e363] [cursor=pointer]:
            - /url: https://bajkoteka.nepar.hr
            - heading "Bajkoteka" [level=3] [ref=e367]
        - listitem [ref=e368]:
          - link "Handyman" [ref=e369] [cursor=pointer]:
            - /url: https://handyman.nepar.hr
            - heading "Handyman" [level=3] [ref=e373]
        - listitem [ref=e374]:
          - article [ref=e375]:
            - heading "Hackosaur" [level=3] [ref=e379]
        - listitem [ref=e380]:
          - link "Auto Gubić web-stranica Auto Gubić" [ref=e381] [cursor=pointer]:
            - /url: https://autogubic.hr/
            - img "Auto Gubić web-stranica" [ref=e383]
            - heading "Auto Gubić" [level=3] [ref=e386]:
              - text: Auto
              - generic [ref=e387]: Gubić
    - generic [ref=e389]:
      - generic [ref=e390]:
        - paragraph [ref=e391]: JASNA PONUDA
        - heading "Web-stranica koja pripada vašem poslovanju" [level=2] [ref=e392]
        - paragraph [ref=e393]: Izradu plaćate jednokratno, a održavanje birate samo ako vam treba. Opseg, cijena i broj dorada poznati su prije početka rada.
      - generic [ref=e394]:
        - strong [ref=e395]: Paketi izrade kreću od 300 € jednokratno.
        - generic [ref=e396]: Održavanje nije obavezno i ugovara se zasebno.
      - generic [ref=e397]:
        - generic [ref=e398]:
          - paragraph [ref=e399]: Paketi web-stranica
          - paragraph [ref=e400]: Usporedite opseg, cijene i što je uključeno u svaki paket.
        - link "Pogledaj pakete" [ref=e401] [cursor=pointer]:
          - /url: /usluge/izrada-web-stranica#paketi
          - text: Pogledaj pakete
          - img [ref=e402]
    - generic [ref=e405]:
      - button "Pokreni priču o evoluciji tehnologije" [ref=e406]:
        - generic [ref=e408]:
          - img [ref=e410]
          - text: Pokreni animaciju
      - generic [ref=e412]:
        - paragraph [ref=e413]: O NAMA
        - heading "Tehnička izvedba, jasna komunikacija i fokus na proizvod koji radi." [level=2] [ref=e414]
        - paragraph [ref=e415]: Nepar Solutions spaja razvoj web aplikacija, AI rješenja, portala, integracija i rada s podacima u jedan praktičan proces.
        - list "O NAMA" [ref=e416]:
          - listitem [ref=e417]:
            - generic [ref=e418]: "01"
            - generic [ref=e419]:
              - heading "Razumijemo problem" [level=3] [ref=e420]
              - paragraph [ref=e421]: Cilj, korisnici i realan opseg prije prve linije koda.
          - listitem [ref=e422]:
            - generic [ref=e423]: "02"
            - generic [ref=e424]:
              - heading "Gradimo i provjeravamo" [level=3] [ref=e425]
              - paragraph [ref=e426]: Jasne faze, vidljiv napredak i provjera na stvarnim uređajima.
          - listitem [ref=e427]:
            - generic [ref=e428]: "03"
            - generic [ref=e429]:
              - heading "Isporučujemo proizvod" [level=3] [ref=e430]
              - paragraph [ref=e431]: Stabilna objava, vlasništvo i konkretan sljedeći korak.
    - generic [ref=e434]:
      - generic [ref=e435]:
        - img [ref=e439]
        - generic [ref=e444]:
          - heading "Imate ideju? Pretvorimo je u proizvod." [level=2] [ref=e445]
          - paragraph [ref=e446]: Od prvog razgovora do lansiranja, tu smo da vaša ideja postane stvarnost.
      - link "Javite se i pokrenimo projekt" [ref=e447] [cursor=pointer]:
        - /url: /kontakt
        - text: Javite se i pokrenimo projekt
        - img [ref=e448]
    - generic [ref=e453]:
      - generic [ref=e455]:
        - paragraph [ref=e456]: Poslovni podaci
        - paragraph [ref=e457]: Nepar, obrt za digitalna rješenja i usluge
        - generic [ref=e458]:
          - generic [ref=e459]: vl. Ivan Gorupić
          - generic [ref=e460]: "MBO: 99267101"
          - link "nepar@nepar.hr" [ref=e461] [cursor=pointer]:
            - /url: mailto:nepar@nepar.hr
      - generic [ref=e462]:
        - paragraph [ref=e463]: © 2026 Nepar Solutions. Digitalna rješenja po mjeri.
        - generic [ref=e464]:
          - link "Digitalni cjenik 2026." [ref=e465] [cursor=pointer]:
            - /url: /digitalni-cjenik
          - link "Cjenik" [ref=e466] [cursor=pointer]:
            - /url: /cjenik
          - link "Privatnost" [ref=e467] [cursor=pointer]:
            - /url: /privatnost
          - button "Postavke privatnosti" [ref=e468] [cursor=pointer]
          - link "Povratak na vrh" [ref=e469] [cursor=pointer]:
            - /url: "#top"
  - dialog "Vi birate analitiku" [ref=e470]:
    - generic [ref=e471]:
      - img [ref=e473]
      - generic [ref=e476]:
        - heading "Vi birate analitiku" [level=2] [ref=e477]
        - paragraph [ref=e478]: Nužne postavke održavaju stranicu funkcionalnom. Uz vaše dopuštenje koristimo GA4 i vlastitu analitiku kako bismo razumjeli koje stranice i upiti stvarno pomažu.
    - generic [ref=e479]:
      - button "Prihvati analitiku" [ref=e480] [cursor=pointer]
      - button "Odbij analitiku" [ref=e481] [cursor=pointer]
      - link "Politika privatnosti" [ref=e482] [cursor=pointer]:
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