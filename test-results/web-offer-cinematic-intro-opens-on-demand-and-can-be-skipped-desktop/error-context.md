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
      - <aside role="dialog" aria-modal="false" class="consent-panel" data-testid="consent-panel" aria-labelledby="consent-title" aria-describedby="consent-description">…</aside> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <aside role="dialog" aria-modal="false" class="consent-panel" data-testid="consent-panel" aria-labelledby="consent-title" aria-describedby="consent-description">…</aside> intercepts pointer events
    - retrying click action
      - waiting 100ms
    19 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <aside role="dialog" aria-modal="false" class="consent-panel" data-testid="consent-panel" aria-labelledby="consent-title" aria-describedby="consent-description">…</aside> intercepts pointer events
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
      - button "Pokreni priču o evoluciji tehnologije" [active] [ref=e406]:
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