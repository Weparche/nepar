# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web-landing.spec.js >> successful submit emits one start_lead, one request, and exactly one generate_lead
- Location: e2e\web-landing.spec.js:112:1

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 1
Received: 0

Call Log:
- Timeout 5000ms exceeded while waiting on the predicate
```

# Page snapshot

```yaml
- main [ref=e3]:
  - generic [ref=e5]:
    - link "Nepar Solutions — naslovnica" [ref=e6] [cursor=pointer]:
      - /url: /
      - img "Nepar Solutions" [ref=e7]
    - navigation "Navigacija landing stranice" [ref=e8]:
      - link "Zatraži ponudu — navigacija" [ref=e9] [cursor=pointer]:
        - /url: "#upit"
        - text: Zatraži ponudu
  - region "Profesionalna web stranica za vaš posao. Sada od 240 €." [ref=e10]:
    - generic [ref=e11]:
      - generic [ref=e12]:
        - heading "Profesionalna web stranica za vaš posao. Sada od 240 €." [level=1] [ref=e13]
        - paragraph [ref=e14]: Brza, moderna i optimizirana za Google. Bez mjesečne pretplate — stranica je vaša.
        - link "Zatraži ponudu" [ref=e15] [cursor=pointer]:
          - /url: "#upit"
        - generic "Ključne informacije" [ref=e16]:
          - generic [ref=e17]:
            - img [ref=e18]
            - text: 20% popusta na sve pakete
          - generic [ref=e21]:
            - img [ref=e22]
            - text: Potpuno vlasništvo
          - generic [ref=e25]:
            - img [ref=e26]
            - text: Za tvrtke i obrte u Hrvatskoj
      - figure [ref=e30]:
        - generic [ref=e31]:
          - generic [ref=e32]: Komercijalni web u praksi
          - strong [ref=e33]: Auto Gubić
        - img "Auto Gubić web-stranica za specijalizirani Volvo servis" [ref=e34]
  - region "Pogledajte što izrađujemo" [ref=e35]:
    - generic [ref=e36]:
      - generic [ref=e37]:
        - heading "Pogledajte što izrađujemo" [level=2] [ref=e38]
        - paragraph [ref=e39]: Ne pokazujemo generičke mockupove. Ovo su stvarni proizvodi i stranice koje smo izradili.
      - generic [ref=e40]:
        - link "Pogledaj projekt Auto Gubić — otvara se u novom tabu" [ref=e41] [cursor=pointer]:
          - /url: https://autogubic.hr/
          - img "Auto Gubić web-stranica za specijalizirani Volvo servis" [ref=e43]
          - generic [ref=e44]:
            - paragraph [ref=e45]: Komercijalni web
            - generic [ref=e46]:
              - heading "Auto Gubić" [level=3] [ref=e47]
              - img [ref=e48]
            - generic [ref=e52]: Profesionalna stranica za specijalizirani Volvo servis, s lokalnim SEO-om i jasnim servisnim upitom.
        - link "Pogledaj projekt BezStruje.hr — otvara se u novom tabu" [ref=e53] [cursor=pointer]:
          - /url: https://bezstruje.hr
          - img "BezStruje.hr portal za planirane radove i kvarove" [ref=e55]
          - generic [ref=e56]:
            - paragraph [ref=e57]: Informacijski portal
            - generic [ref=e58]:
              - heading "BezStruje.hr" [level=3] [ref=e59]
              - img [ref=e60]
            - generic [ref=e64]: Portal za planirane radove, kvarove i lokacije prekida električne energije.
        - link "Pogledaj projekt VremenskaPrognoza.hr — otvara se u novom tabu" [ref=e65] [cursor=pointer]:
          - /url: https://vremenskaprognoza.hr
          - img "VremenskaPrognoza.hr prikaz prognoze za Hrvatsku" [ref=e67]
          - generic [ref=e68]:
            - paragraph [ref=e69]: Podatkovna platforma
            - generic [ref=e70]:
              - heading "VremenskaPrognoza.hr" [level=3] [ref=e71]
              - img [ref=e72]
            - generic [ref=e76]: Responzivna vremenska platforma s prognozama, upozorenjima i podacima za cijelu Hrvatsku.
  - region "Web koji radi ozbiljan posao" [ref=e77]:
    - generic [ref=e78]:
      - heading "Web koji radi ozbiljan posao" [level=2] [ref=e80]
      - generic [ref=e81]:
        - article [ref=e82]:
          - generic [ref=e84]:
            - generic [ref=e85]:
              - generic [ref=e86]: "01"
              - img [ref=e87]
            - generic [ref=e89]:
              - heading "Izgleda profesionalno" [level=3] [ref=e90]
              - paragraph [ref=e91]: Dizajn prilagođen vašem poslu, ne generički predložak koji izgleda kao svi ostali.
        - article [ref=e92]:
          - generic [ref=e94]:
            - generic [ref=e95]:
              - generic [ref=e96]: "02"
              - img [ref=e97]
            - generic [ref=e100]:
              - heading "Ljudi vas mogu pronaći" [level=3] [ref=e101]
              - paragraph [ref=e102]: SEO osnova, brzina i tehnički ispravno indeksiranje ugrađeni su od početka.
        - article [ref=e103]:
          - generic [ref=e105]:
            - generic [ref=e106]:
              - generic [ref=e107]: "03"
              - img [ref=e108]
            - generic [ref=e111]:
              - heading "Stranica je vaša" [level=3] [ref=e112]
              - paragraph [ref=e113]: Bez zaključavanja na platformu i bez obavezne mjesečne pretplate.
      - generic "Tehnička osnova" [ref=e114]:
        - generic [ref=e115]: Responsive
        - generic [ref=e116]: SEO
        - generic [ref=e117]: Analytics
        - generic [ref=e118]: HTTPS
        - generic [ref=e119]: GDPR
  - region "Od jednostavnog početka do ozbiljnog prodajnog weba" [ref=e120]:
    - generic [ref=e121]:
      - generic [ref=e122]:
        - heading "Od jednostavnog početka do ozbiljnog prodajnog weba" [level=2] [ref=e123]
        - paragraph [ref=e124]: Tri realna opsega po akcijskim cijenama, bez skrivenog najma i bez liste od petnaest stavki.
      - generic [ref=e125]:
        - article [ref=e126]:
          - generic [ref=e128]:
            - generic [ref=e130]: −20%
            - generic [ref=e131]:
              - generic [ref=e132]:
                - heading "Start" [level=3] [ref=e133]
                - generic "Akcijska cijena 240 €, redovna cijena 300 €" [ref=e134]:
                  - generic [ref=e135]: Akcijska cijena
                  - generic [ref=e136]:
                    - deletion [ref=e137]: 300 €
                    - strong [ref=e138]: 240 €
              - paragraph [ref=e139]: Jasan profesionalni početak za manji posao.
              - list [ref=e140]:
                - listitem [ref=e141]:
                  - img [ref=e142]
                  - text: Profesionalna jednostranična stranica
                - listitem [ref=e144]:
                  - img [ref=e145]
                  - text: Responsive dizajn
                - listitem [ref=e147]:
                  - img [ref=e148]
                  - text: SEO osnova
        - article [ref=e150]:
          - generic [ref=e152]:
            - generic [ref=e153]:
              - generic [ref=e154]: −20%
              - generic [ref=e155]: Najbolji omjer cijene i koristi
            - generic [ref=e156]:
              - generic [ref=e157]:
                - heading "Business" [level=3] [ref=e158]
                - generic "Akcijska cijena 400 €, redovna cijena 500 €" [ref=e159]:
                  - generic [ref=e160]: Akcijska cijena
                  - generic [ref=e161]:
                    - deletion [ref=e162]: 500 €
                    - strong [ref=e163]: 400 €
              - paragraph [ref=e164]: Najbolji omjer sadržaja, strukture i upita.
              - list [ref=e165]:
                - listitem [ref=e166]:
                  - img [ref=e167]
                  - text: Više sadržajnih stranica
                - listitem [ref=e169]:
                  - img [ref=e170]
                  - text: Naprednija struktura
                - listitem [ref=e172]:
                  - img [ref=e173]
                  - text: Kontakt i lead funkcionalnosti
        - article [ref=e175]:
          - generic [ref=e177]:
            - generic [ref=e179]: −20%
            - generic [ref=e180]:
              - generic [ref=e181]:
                - heading "Pro" [level=3] [ref=e182]
                - generic "Akcijska cijena 560 €, redovna cijena 700 €" [ref=e183]:
                  - generic [ref=e184]: Akcijska cijena
                  - generic [ref=e185]:
                    - deletion [ref=e186]: 700 €
                    - strong [ref=e187]: 560 €
              - paragraph [ref=e188]: Za web koji ima važniju prodajnu ulogu.
              - list [ref=e189]:
                - listitem [ref=e190]:
                  - img [ref=e191]
                  - text: Opsežniji web
                - listitem [ref=e193]:
                  - img [ref=e194]
                  - text: Prilagođene funkcionalnosti
                - listitem [ref=e196]:
                  - img [ref=e197]
                  - text: Naprednija optimizacija
      - generic [ref=e199]:
        - paragraph [ref=e200]:
          - strong [ref=e201]: Niste sigurni koji paket trebate?
          - text: Opišite projekt.
        - link "Recite nam što trebate" [ref=e202] [cursor=pointer]:
          - /url: "#upit"
          - text: Recite nam što trebate
          - img [ref=e203]
  - region "Od dogovora do objave" [ref=e205]:
    - generic [ref=e206]:
      - generic [ref=e207]:
        - heading "Od dogovora do objave" [level=2] [ref=e208]
        - paragraph [ref=e209]: Uvijek znate što je sljedeće i gdje je projekt.
      - list [ref=e210]:
        - listitem [ref=e211]:
          - generic [ref=e212]: "01"
          - generic [ref=e213]:
            - heading "Dogovor" [level=3] [ref=e214]
            - paragraph [ref=e215]: Kažete što trebate.
        - listitem [ref=e216]:
          - generic [ref=e217]: "02"
          - generic [ref=e218]:
            - heading "Izrada" [level=3] [ref=e219]
            - paragraph [ref=e220]: Dobivate prvi prijedlog.
        - listitem [ref=e221]:
          - generic [ref=e222]: "03"
          - generic [ref=e223]:
            - heading "Pregled" [level=3] [ref=e224]
            - paragraph [ref=e225]: Doradimo sadržaj i izgled.
        - listitem [ref=e226]:
          - generic [ref=e227]: "04"
          - generic [ref=e228]:
            - heading "Objava" [level=3] [ref=e229]
            - paragraph [ref=e230]: Web ide online i postaje vaš.
  - region "Opišite web koji trebate" [ref=e231]:
    - generic [ref=e232]:
      - generic [ref=e233]:
        - heading "Opišite web koji trebate" [level=2] [ref=e234]
        - paragraph [ref=e235]: Pošaljite osnovne informacije. Odgovorit ćemo osobno s realnom preporukom opsega i sljedećim korakom.
        - generic [ref=e236]:
          - generic [ref=e237]:
            - img [ref=e238]
            - text: Bez obaveze
          - generic [ref=e241]:
            - img [ref=e242]
            - text: Odgovara stvarna osoba
          - generic [ref=e245]:
            - img [ref=e246]
            - text: Za cijelu Hrvatsku
      - generic [ref=e252]:
        - generic [ref=e253]:
          - generic [ref=e254]:
            - text: Ime
            - textbox "Ime" [ref=e255]: Test Korisnik
          - generic [ref=e256]:
            - text: E-mail
            - textbox "E-mail" [ref=e257]: test@example.com
        - generic [ref=e258]:
          - text: Telefon
          - generic [ref=e259]: opcionalno
          - textbox "Telefon opcionalno" [ref=e260]: +385 91 123 4567
        - generic [ref=e261]:
          - text: Što trebate?
          - textbox "Što trebate?" [active] [ref=e262]:
            - /placeholder: Čime se bavite, što web treba sadržavati i koji vam je glavni cilj?
            - text: Profesionalnu web-stranicu za mali obrt.
        - button "Zatraži ponudu" [ref=e263] [cursor=pointer]:
          - text: Zatraži ponudu
          - img [ref=e264]
        - generic [ref=e267]: Bez obveze. Odgovaram osobno.
  - region "Česta pitanja" [ref=e268]:
    - generic [ref=e269]:
      - heading "Česta pitanja" [level=2] [ref=e271]
      - generic [ref=e272]:
        - group [ref=e273]:
          - generic "Koliko košta izrada?" [ref=e274] [cursor=pointer]:
            - text: Koliko košta izrada?
            - generic [ref=e275]: +
        - group [ref=e276]:
          - generic "Koliko traje?" [ref=e277] [cursor=pointer]:
            - text: Koliko traje?
            - generic [ref=e278]: +
        - group [ref=e279]:
          - generic "Moram li plaćati mjesečno održavanje?" [ref=e280] [cursor=pointer]:
            - text: Moram li plaćati mjesečno održavanje?
            - generic [ref=e281]: +
        - group [ref=e282]:
          - generic "Je li stranica moja nakon izrade?" [ref=e283] [cursor=pointer]:
            - text: Je li stranica moja nakon izrade?
            - generic [ref=e284]: +
  - region "Završni poziv na upit" [ref=e285]:
    - generic [ref=e286]:
      - heading "Trebate novu web stranicu?" [level=2] [ref=e288]
      - link "Recite nam što trebate" [ref=e289] [cursor=pointer]:
        - /url: "#upit"
        - text: Recite nam što trebate
        - img [ref=e290]
  - generic [ref=e292]:
    - generic [ref=e293]:
      - link "Nepar Solutions" [ref=e294] [cursor=pointer]:
        - /url: /
        - img "Nepar Solutions" [ref=e295]
      - link "nepar@nepar.hr" [ref=e296] [cursor=pointer]:
        - /url: mailto:nepar@nepar.hr
      - paragraph [ref=e297]: "Nepar, obrt za digitalna rješenja i usluge · vl. Ivan Gorupić · MBO: 99267101"
    - generic [ref=e298]:
      - generic [ref=e299]: © 2026 Nepar Solutions
      - generic [ref=e300]:
        - link "Privatnost" [ref=e301] [cursor=pointer]:
          - /url: /privatnost
        - button "Postavke privatnosti" [ref=e302] [cursor=pointer]
```

# Test source

```ts
  19  | 
  20  |   await page.route("https://www.googletagmanager.com/**", (route) => (
  21  |     route.fulfill({ status: 200, contentType: "application/javascript", body: "" })
  22  |   ));
  23  |   await page.route(`${workerBase}/**`, async (route) => {
  24  |     const request = route.request();
  25  |     if (request.url() === `${workerBase}/analytics/pageview`) {
  26  |       pageviewRequests.push(JSON.parse(request.postData() || "{}"));
  27  |       await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
  28  |       return;
  29  |     }
  30  |     contactRequests.push(JSON.parse(request.postData() || "{}"));
  31  |     if (contactDelay) await new Promise((resolve) => setTimeout(resolve, contactDelay));
  32  |     await route.fulfill({
  33  |       status: contactStatus,
  34  |       contentType: "application/json",
  35  |       body: contactStatus >= 200 && contactStatus < 300 ? '{"ok":true}' : '{"error":"failed"}',
  36  |     });
  37  |   });
  38  | 
  39  |   return { contactRequests, pageviewRequests };
  40  | }
  41  | 
  42  | async function analyticsEvents(page) {
  43  |   return page.evaluate(() => (window.dataLayer || [])
  44  |     .map((entry) => Array.from(entry))
  45  |     .filter((entry) => entry[0] === "event")
  46  |     .map((entry) => ({ name: entry[1], params: entry[2] || {} })));
  47  | }
  48  | 
  49  | async function fillLandingForm(page) {
  50  |   await page.getByLabel("Ime").fill("Test Korisnik");
  51  |   await page.getByLabel("E-mail").fill("test@example.com");
  52  |   await page.getByLabel(/Telefon/).fill("+385 91 123 4567");
  53  |   await page.getByLabel("Što trebate?").fill("Profesionalnu web-stranicu za mali obrt.");
  54  | }
  55  | 
  56  | test("/web renders the locked acquisition structure without overflow", async ({ page }) => {
  57  |   await persistConsent(page, false);
  58  |   await page.goto("/web?utm_source=chatgpt&utm_medium=paid&utm_campaign=web_hr");
  59  | 
  60  |   await expect(page.getByRole("heading", { level: 1, name: "Profesionalna web stranica za vaš posao. Sada od 240 €." })).toBeVisible();
  61  |   await expect(page.getByText("Brza, moderna i optimizirana za Google. Bez mjesečne pretplate — stranica je vaša.")).toBeVisible();
  62  |   await expect(page.locator('.web-header a[href="#upit"]')).toHaveText("Zatraži ponudu");
  63  |   await expect(page.locator('.web-header a[href="#reference"]')).toHaveText("Reference");
  64  |   await expect(page.locator('.web-header a[href="#cijene"]')).toHaveText("Cijene");
  65  | 
  66  |   const projectTitles = await page.locator(".web-project h3").allTextContents();
  67  |   expect(projectTitles).toEqual(["Auto Gubić", "BezStruje.hr", "VremenskaPrognoza.hr"]);
  68  |   const reasonImages = page.locator(".web-reason__media img");
  69  |   await expect(reasonImages).toHaveCount(3);
  70  |   const expectedReasonVariant = page.viewportSize().width <= 720 ? "mobile" : "desktop";
  71  |   for (const reasonImage of await reasonImages.all()) {
  72  |     await expect.poll(() => reasonImage.evaluate((image) => image.currentSrc)).toContain(`-${expectedReasonVariant}.webp`);
  73  |   }
  74  |   const projectLinks = page.locator("a.web-project");
  75  |   await expect(projectLinks).toHaveCount(3);
  76  |   await expect(projectLinks.nth(0)).toHaveAttribute("href", "https://autogubic.hr/");
  77  |   await expect(projectLinks.nth(1)).toHaveAttribute("href", "https://bezstruje.hr");
  78  |   await expect(projectLinks.nth(2)).toHaveAttribute("href", "https://vremenskaprognoza.hr");
  79  |   for (const projectLink of await projectLinks.all()) {
  80  |     await expect(projectLink).toHaveAttribute("target", "_blank");
  81  |     await expect(projectLink).toHaveAttribute("rel", /noopener/);
  82  |     await expect(projectLink).toHaveAttribute("rel", /noreferrer/);
  83  |   }
  84  |   await expect(page.locator(".web-package")).toHaveCount(3);
  85  |   await expect(page.locator(".web-package--featured")).toContainText("Business");
  86  |   await expect(page.locator(".web-package").nth(0)).toContainText("300 €240 €");
  87  |   await expect(page.locator(".web-package").nth(1)).toContainText("500 €400 €");
  88  |   await expect(page.locator(".web-package").nth(2)).toContainText("700 €560 €");
  89  |   await expect(page.locator(".web-package__discount")).toHaveCount(3);
  90  |   await page.locator(".web-pricing").scrollIntoViewIfNeeded();
  91  |   const packageImages = page.locator(".web-package__media img");
  92  |   await expect(packageImages).toHaveCount(3);
  93  |   const expectedPackageVariant = page.viewportSize().width <= 720 ? "mobile" : "desktop";
  94  |   for (const packageImage of await packageImages.all()) {
  95  |     await expect.poll(() => packageImage.evaluate((image) => image.currentSrc)).toContain(`-${expectedPackageVariant}.webp`);
  96  |   }
  97  |   await expect(page.locator(".web-process__list li")).toHaveCount(4);
  98  |   await expect(page.locator(".web-faq details")).toHaveCount(4);
  99  |   await expect(page.locator('#upit button[type="submit"]')).toHaveText(/Zatraži ponudu/);
  100 | 
  101 |   const dimensions = await page.evaluate(() => ({
  102 |     viewport: document.documentElement.clientWidth,
  103 |     content: document.documentElement.scrollWidth,
  104 |   }));
  105 |   expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport + 1);
  106 | 
  107 |   const axe = await new AxeBuilder({ page }).analyze();
  108 |   const serious = axe.violations.filter(({ impact }) => impact === "serious" || impact === "critical");
  109 |   expect(serious, serious.map(({ id }) => id).join(", ")).toEqual([]);
  110 | });
  111 | 
  112 | test("successful submit emits one start_lead, one request, and exactly one generate_lead", async ({ page }) => {
  113 |   await persistConsent(page, true);
  114 |   const network = await mockLandingNetwork(page, { contactDelay: 120 });
  115 |   const longContent = `hero-${"x".repeat(220)}`;
  116 |   await page.goto(`/web?utm_source=%20chat%00gpt%20&utm_medium=paid&utm_campaign=web_hr&utm_content=${longContent}&utm_term=izrada%20weba&unknown=ignore-me`);
  117 |   await fillLandingForm(page);
  118 | 
> 119 |   await expect.poll(async () => (await analyticsEvents(page)).filter(({ name }) => name === "start_lead").length).toBe(1);
      |                                                                                                                   ^ Error: expect(received).toBe(expected) // Object.is equality
  120 |   await page.locator('#upit button[type="submit"]').evaluate((button) => {
  121 |     button.click();
  122 |     button.click();
  123 |   });
  124 | 
  125 |   await expect(page.getByText("Upit je poslan.")).toBeVisible();
  126 |   await expect.poll(async () => (await analyticsEvents(page)).filter(({ name }) => name === "generate_lead").length).toBe(1);
  127 |   expect(network.contactRequests).toHaveLength(1);
  128 |   expect(network.contactRequests[0].formName).toBe("web_landing");
  129 |   expect(network.contactRequests[0].phone).toBe("+385 91 123 4567");
  130 |   expect(network.contactRequests[0].attribution).toEqual({
  131 |     utm_source: "chatgpt",
  132 |     utm_medium: "paid",
  133 |     utm_campaign: "web_hr",
  134 |     utm_content: longContent.slice(0, 160),
  135 |     utm_term: "izrada weba",
  136 |     landing_path: "/web",
  137 |   });
  138 | 
  139 |   const generateEvents = (await analyticsEvents(page)).filter(({ name }) => name === "generate_lead");
  140 |   expect(generateEvents).toHaveLength(1);
  141 |   expect(generateEvents[0].params).not.toHaveProperty("unknown");
  142 | });
  143 | 
  144 | test("configured Worker error preserves fields and never opens mail automatically", async ({ page }) => {
  145 |   await persistConsent(page, true);
  146 |   await mockLandingNetwork(page, { contactStatus: 502 });
  147 |   await page.goto("/web?utm_source=chatgpt&utm_medium=paid&utm_campaign=web_hr");
  148 |   await fillLandingForm(page);
  149 |   await page.locator('#upit button[type="submit"]').click();
  150 | 
  151 |   await expect(page.getByText("Upit trenutačno nije moguće poslati.")).toBeVisible();
  152 |   await expect(page).toHaveURL(/\/web\?utm_source=chatgpt/);
  153 |   await expect(page.getByLabel("Ime")).toHaveValue("Test Korisnik");
  154 |   await expect(page.getByLabel("E-mail")).toHaveValue("test@example.com");
  155 |   await expect(page.getByLabel(/Telefon/)).toHaveValue("+385 91 123 4567");
  156 |   await expect(page.getByLabel("Što trebate?")).toHaveValue("Profesionalnu web-stranicu za mali obrt.");
  157 |   await expect(page.getByRole("link", { name: "Pošalji e-mailom" })).toHaveAttribute("href", /^mailto:/);
  158 |   expect((await analyticsEvents(page)).filter(({ name }) => name === "generate_lead")).toHaveLength(0);
  159 | 
  160 |   await page.evaluate(() => {
  161 |     document.addEventListener("click", (event) => {
  162 |       if (event.target.closest?.('a[href^="mailto:"]')) event.preventDefault();
  163 |     }, true);
  164 |   });
  165 |   await page.getByRole("link", { name: "Pošalji e-mailom" }).click();
  166 |   await expect.poll(async () => (await analyticsEvents(page)).filter(({ name }) => name === "click_email").length).toBe(1);
  167 |   expect((await analyticsEvents(page)).filter(({ name }) => name === "generate_lead")).toHaveLength(0);
  168 | });
  169 | 
```