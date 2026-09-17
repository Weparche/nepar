# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web-offer.spec.js >> cinematic intro opens on demand and can be skipped
- Location: e2e\web-offer.spec.js:295:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Zatvori animaciju', exact: true })
    - locator resolved to <button type="button" class="evolution-intro__skip" aria-label="Zatvori animaciju">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <a href="/privatnost" data-discover="true" class="consent-policy-link">Politika privatnosti</a> from <aside role="dialog" aria-modal="false" class="consent-panel" data-testid="consent-panel" aria-labelledby="consent-title" aria-describedby="consent-description">…</aside> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <a href="/privatnost" data-discover="true" class="consent-policy-link">Politika privatnosti</a> from <aside role="dialog" aria-modal="false" class="consent-panel" data-testid="consent-panel" aria-labelledby="consent-title" aria-describedby="consent-description">…</aside> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    19 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <a href="/privatnost" data-discover="true" class="consent-policy-link">Politika privatnosti</a> from <aside role="dialog" aria-modal="false" class="consent-panel" data-testid="consent-panel" aria-labelledby="consent-title" aria-describedby="consent-description">…</aside> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms
    - waiting for element to be visible, enabled and stable
  - element was detached from the DOM, retrying

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
      - button "Pokreni priču o evoluciji tehnologije" [active] [ref=e376]:
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
  225 |   await page.goto("/");
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
> 300 |   await page.getByRole("button", { name: "Zatvori animaciju", exact: true }).click();
      |                                                                              ^ Error: locator.click: Test timeout of 30000ms exceeded.
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
  326 |   await expect(page.getByTestId("evolution-intro")).toHaveCount(0);
  327 |   await expect(page.getByRole("heading", { level: 1, name: /Gradimo korisne digitalne proizvode/ })).toBeVisible();
  328 |   await openEvolutionIntro(page);
  329 |   await expect(page.getByTestId("evolution-intro")).toHaveAttribute("data-active-scene", "6");
  330 |   await expect(page.getByTestId("evolution-frame")).toHaveAttribute(
  331 |     "src",
  332 |     "/evolution-frames/evolution-frame-114.webp",
  333 |   );
  334 | });
  335 | 
  336 | test("restored landing keeps its original structure and adds Auto Gubić below", async ({ page }) => {
  337 |   await page.goto("/");
  338 |   await skipEvolutionIntro(page);
  339 |   await expect(
  340 |     page.getByRole("heading", { level: 1, name: /Gradimo korisne digitalne proizvode za stvarni svijet/ }),
  341 |   ).toBeVisible();
  342 |   await expect(page.getByText("Pilot popunjenost")).toHaveCount(0);
  343 |   await expect(page.getByText("mjesta popunjeno")).toHaveCount(0);
  344 |   const serviceImages = page.locator("#usluge .service-card-art");
  345 |   await expect(serviceImages).toHaveCount(4);
  346 |   await expect.poll(() => serviceImages.evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0))).toBe(true);
  347 | 
  348 |   const projects = page.locator("#projekti");
  349 |   await projects.scrollIntoViewIfNeeded();
  350 |   await expect(projects.locator(".featured-project-card")).toHaveCount(11);
  351 |   const projectSectionHeight = await projects.evaluate((section) => section.getBoundingClientRect().height);
  352 |   expect(projectSectionHeight).toBeLessThanOrEqual(page.viewportSize().height);
  353 |   await expect(page.locator("#kontakt")).not.toHaveCSS("position", "fixed");
  354 |   const projectLink = projects.getByRole("link", { name: /Auto Gubić/ });
  355 |   await expect(projectLink).toBeVisible();
  356 |   await expect(projectLink).toHaveAttribute("href", "https://autogubic.hr/");
  357 |   await expect(projectLink).toHaveAttribute("target", "_blank");
  358 |   await expect(projectLink).toHaveAttribute("rel", /noreferrer/);
  359 |   await expect(projectLink.getByRole("heading", { name: "Auto Gubić" })).toBeVisible();
  360 |   await expect(projectLink.locator('img[src="/brand/autogubic.webp"]')).toHaveAttribute("alt", "Auto Gubić web-stranica");
  361 | 
  362 |   if ((page.viewportSize()?.width ?? 0) < 1024) {
  363 |     const heroOrder = await page.evaluate(() => {
  364 |       const projectButton = [...document.querySelectorAll('a[href="#projekti"]')]
  365 |         .find((element) => element.getClientRects().length > 0);
  366 |       const visibleOrbit = [...document.querySelectorAll(".orbital-card")]
  367 |         .find((element) => element.getClientRects().length > 0);
  368 |       return {
  369 |         orbitBottom: visibleOrbit?.getBoundingClientRect().bottom ?? 0,
  370 |         buttonTop: projectButton?.getBoundingClientRect().top ?? 0,
  371 |       };
  372 |     });
  373 |     expect(heroOrder.orbitBottom).toBeLessThan(heroOrder.buttonTop);
  374 | 
  375 |     const mobileCarouselScene = page.getByTestId("mobile-project-carousel").locator("[data-carousel-scene]");
  376 |     await page.setViewportSize({ width: 600, height: 900 });
  377 |     await expect(mobileCarouselScene).toHaveAttribute("style", /height:\s*292px/);
  378 |     await page.setViewportSize({ width: 700, height: 900 });
  379 |     await expect(mobileCarouselScene).toHaveAttribute("style", /height:\s*344px/);
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
```