# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: analytics-consent.spec.js >> funnel fires in order and generate_lead follows only a confirmed 2xx response
- Location: e2e\analytics-consent.spec.js:83:1

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
  - navigation "Glavna navigacija" [ref=e5]:
    - link "Nepar Solutions" [ref=e6] [cursor=pointer]:
      - /url: /
      - img "Nepar Solutions" [ref=e7]
    - generic [ref=e8]:
      - link "Usluge" [ref=e9] [cursor=pointer]:
        - /url: /#usluge
      - link "Projekti" [ref=e10] [cursor=pointer]:
        - /url: /#projekti
      - link "Proces" [ref=e11] [cursor=pointer]:
        - /url: /#proces
      - link "Cjenik" [ref=e12] [cursor=pointer]:
        - /url: /usluge/izrada-web-stranica#paketi
      - link "Kontakt" [ref=e13] [cursor=pointer]:
        - /url: /kontakt
    - generic [ref=e14]:
      - group "Language" [ref=e15]:
        - button "HR" [pressed] [ref=e16] [cursor=pointer]
        - button "ENG" [ref=e17] [cursor=pointer]
      - link "Pošaljite upit" [ref=e18] [cursor=pointer]:
        - /url: /kontakt
        - img [ref=e19]
        - generic [ref=e22]: Pošaljite upit
  - generic [ref=e23]:
    - generic [ref=e24]:
      - generic [ref=e25]:
        - paragraph [ref=e26]:
          - img [ref=e27]
          - text: Jasne cijene · bez skrivenog najma
        - heading "Izrada web-stranica za obrte i tvrtke." [level=1] [ref=e30]
        - paragraph [ref=e31]: Od jednostavne profesionalne prezentacije do napredne SEO strukture i prilagođenih upita. Izradu plaćate jednokratno, a održavanje birate samo ako vam treba.
        - generic [ref=e32]:
          - link "Pogledaj pakete izrade" [ref=e33] [cursor=pointer]:
            - /url: "#paketi"
            - text: Pogledaj pakete izrade
            - img [ref=e34]
          - button "Pošalji upit" [ref=e36] [cursor=pointer]:
            - text: Pošalji upit
            - img [ref=e37]
      - complementary [ref=e40]:
        - generic [ref=e41]:
          - generic [ref=e42]: Izrada već od
          - strong [ref=e43]: 300 €
          - generic [ref=e44]: jednokratno
        - generic [ref=e45]:
          - img [ref=e46]
          - paragraph [ref=e49]: Web-stranica je nakon plaćanja u vlasništvu klijenta. Održavanje nije obavezno i ugovara se zasebno.
    - generic [ref=e50]:
      - generic [ref=e51]:
        - img [ref=e52]
        - text: Napredni tehnički i on-page SEO
      - generic [ref=e54]:
        - img [ref=e55]
        - text: Responzivan dizajn
      - generic [ref=e57]:
        - img [ref=e58]
        - text: Search Console i analitika
      - generic [ref=e60]:
        - img [ref=e61]
        - text: Dogovoreni opseg i broj dorada
  - generic [ref=e64]:
    - tablist "Vrsta ponude" [ref=e65]:
      - tab "01 Nova web-stranica" [selected] [ref=e66] [cursor=pointer]:
        - generic [ref=e67]: "01"
        - text: Nova web-stranica
      - tab "02 Redizajn i migracija" [ref=e68] [cursor=pointer]:
        - generic [ref=e69]: "02"
        - text: Redizajn i migracija
      - tab "03 Održavanje" [ref=e70] [cursor=pointer]:
        - generic [ref=e71]: "03"
        - text: Održavanje
      - tab "04 Društvene mreže" [ref=e72] [cursor=pointer]:
        - generic [ref=e73]: "04"
        - text: Društvene mreže
    - tabpanel "01 Nova web-stranica" [ref=e74]:
      - generic [ref=e75]:
        - heading "Paketi izrade web-stranice" [level=2] [ref=e76]
        - paragraph [ref=e77]: Odaberite opseg koji odgovara količini sadržaja i ulozi koju web ima u vašem poslovanju.
      - generic [ref=e78]:
        - article [ref=e79]:
          - generic [ref=e80]:
            - generic [ref=e81]:
              - heading "Web Basic" [level=3] [ref=e82]
              - paragraph [ref=e83]:
                - strong [ref=e84]: 300 €
                - generic [ref=e85]: jednokratno
            - paragraph [ref=e86]: Za obrte i male tvrtke kojima treba jednostavna, moderna i profesionalna web-stranica.
            - list [ref=e87]:
              - listitem [ref=e88]:
                - img [ref=e89]
                - text: moderna one-page web-stranica
              - listitem [ref=e91]:
                - img [ref=e92]
                - text: do 5 sadržajnih sekcija
              - listitem [ref=e94]:
                - img [ref=e95]
                - text: naslovna prezentacija
            - button "Pošalji upit za paket" [ref=e97] [cursor=pointer]:
              - text: Pošalji upit za paket
              - img [ref=e98]
          - group [ref=e101]:
            - generic "Sve uključeno" [ref=e102] [cursor=pointer]:
              - text: Sve uključeno
              - generic [ref=e103]: +
        - article [ref=e104]:
          - generic [ref=e105]:
            - generic [ref=e106]: Najbolji omjer cijene i koristi
            - generic [ref=e107]:
              - heading "Web Business" [level=3] [ref=e108]
              - paragraph [ref=e109]:
                - strong [ref=e110]: 500 €
                - generic [ref=e111]: jednokratno
            - paragraph [ref=e112]: Za tvrtke koje žele ozbiljniju prezentaciju, više sadržaja i kvalitetniju pripremu za upite potencijalnih klijenata.
            - list [ref=e113]:
              - listitem [ref=e114]:
                - img [ref=e115]
                - text: sve iz paketa Web Basic
              - listitem [ref=e117]:
                - img [ref=e118]
                - text: do 5 zasebnih podstranica ili sadržajno proširena one-page stranica
              - listitem [ref=e120]:
                - img [ref=e121]
                - text: detaljniji prikaz usluga ili paketa
            - button "Pošalji upit za paket" [ref=e123] [cursor=pointer]:
              - text: Pošalji upit za paket
              - img [ref=e124]
          - group [ref=e127]:
            - generic "Sve uključeno" [ref=e128] [cursor=pointer]:
              - text: Sve uključeno
              - generic [ref=e129]: +
        - article [ref=e130]:
          - generic [ref=e131]:
            - generic [ref=e132]:
              - heading "Web Pro" [level=3] [ref=e133]
              - paragraph [ref=e134]:
                - strong [ref=e135]: 700 €
                - generic [ref=e136]: jednokratno
            - paragraph [ref=e137]: Za tvrtke kojima je web važan prodajni kanal i koje žele napredniju SEO strukturu, ciljane podstranice i funkcionalnosti prilagođene poslovanju.
            - list [ref=e138]:
              - listitem [ref=e139]:
                - img [ref=e140]
                - text: sve iz paketa Web Business
              - listitem [ref=e142]:
                - img [ref=e143]
                - text: do 8 podstranica
              - listitem [ref=e145]:
                - img [ref=e146]
                - text: do 3 ciljane SEO landing stranice
            - button "Pošalji upit za paket" [ref=e148] [cursor=pointer]:
              - text: Pošalji upit za paket
              - img [ref=e149]
          - group [ref=e152]:
            - generic "Sve uključeno" [ref=e153] [cursor=pointer]:
              - text: Sve uključeno
              - generic [ref=e154]: +
      - generic [ref=e155]:
        - img [ref=e156]
        - paragraph [ref=e160]: Sve web-stranice uključuju naprednu tehničku i on-page SEO optimizaciju. Razlika između paketa je u količini sadržaja, broju podstranica, funkcionalnostima i opsegu rada.
  - generic [ref=e162]:
    - generic [ref=e163]:
      - heading "Dodatne usluge" [level=2] [ref=e164]
      - paragraph [ref=e165]: Za sadržaj i funkcionalnosti izvan dogovorenog paketa dobit ćete jasnu zasebnu procjenu.
    - generic [ref=e166]:
      - generic [ref=e167]:
        - term [ref=e168]: Dodatna podstranica
        - definition [ref=e169]: od 80 €
      - generic [ref=e170]:
        - term [ref=e171]: Ciljana SEO landing stranica
        - definition [ref=e172]: od 100 €
      - generic [ref=e173]:
        - term [ref=e174]: Google Business profil i osnovno podešavanje
        - definition [ref=e175]: od 100 €
      - generic [ref=e176]:
        - term [ref=e177]: Dodatna administracija sadržaja
        - definition [ref=e178]: 40 €/sat
      - generic [ref=e179]:
        - term [ref=e180]: AI chatbot ili AI integracija
        - definition [ref=e181]: od 500 €
      - generic [ref=e182]:
        - term [ref=e183]: Webshop, rezervacijski sustavi i napredne funkcionalnosti
        - definition [ref=e184]: prema ponudi
      - generic [ref=e185]:
        - term [ref=e186]: Content session na lokaciji (do 60 min snimanja fotografija i videa)
        - definition [ref=e187]: od 150 €
      - generic [ref=e188]:
        - term [ref=e189]: Upravljanje Meta Ads kampanjama
        - definition [ref=e190]: od 150 € / mj. + oglasni budžet
  - generic [ref=e192]:
    - heading "Česta pitanja" [level=2] [ref=e193]
    - generic [ref=e194]:
      - group [ref=e195]:
        - generic "Tko je vlasnik web-stranice?" [ref=e196] [cursor=pointer]:
          - text: Tko je vlasnik web-stranice?
          - generic [ref=e197]: +
      - group [ref=e198]:
        - generic "Moram li ugovoriti održavanje?" [ref=e199] [cursor=pointer]:
          - text: Moram li ugovoriti održavanje?
          - generic [ref=e200]: +
      - group [ref=e201]:
        - generic "Jamčite li prvo mjesto na Googleu?" [ref=e202] [cursor=pointer]:
          - text: Jamčite li prvo mjesto na Googleu?
          - generic [ref=e203]: +
      - group [ref=e204]:
        - generic "Koliko traje izrada web-stranice?" [ref=e205] [cursor=pointer]:
          - text: Koliko traje izrada web-stranice?
          - generic [ref=e206]: +
      - group [ref=e207]:
        - generic "Mogu li kasnije nadograditi web-stranicu?" [ref=e208] [cursor=pointer]:
          - text: Mogu li kasnije nadograditi web-stranicu?
          - generic [ref=e209]: +
      - group [ref=e210]:
        - generic "Je li hosting uključen u izradu?" [ref=e211] [cursor=pointer]:
          - text: Je li hosting uključen u izradu?
          - generic [ref=e212]: +
      - group [ref=e213]:
        - generic "Što trebam dostaviti za početak?" [ref=e214] [cursor=pointer]:
          - text: Što trebam dostaviti za početak?
          - generic [ref=e215]: +
      - group [ref=e216]:
        - generic "Mogu li zadržati postojeću domenu i e-mail adrese?" [ref=e217] [cursor=pointer]:
          - text: Mogu li zadržati postojeću domenu i e-mail adrese?
          - generic [ref=e218]: +
  - generic [ref=e220]:
    - generic [ref=e221]:
      - heading "Niste sigurni koji paket odgovara vašem projektu?" [level=2] [ref=e222]
      - paragraph [ref=e223]: Opišite poslovanje, željeni sadržaj i cilj web-stranice. Preporučit ćemo realan opseg bez nepotrebnih stavki.
    - button "Zatraži preporuku" [ref=e224] [cursor=pointer]:
      - text: Zatraži preporuku
      - img [ref=e225]
  - generic [ref=e228]:
    - generic [ref=e229]:
      - generic [ref=e230]:
        - paragraph [ref=e231]: Poslovni podaci
        - paragraph [ref=e232]: Nepar, obrt za digitalna rješenja i usluge
        - generic [ref=e233]:
          - generic [ref=e234]: vl. Ivan Gorupić
          - generic [ref=e235]: "MBO: 99267101"
          - link "nepar@nepar.hr" [ref=e236] [cursor=pointer]:
            - /url: mailto:nepar@nepar.hr
      - link "nepar@nepar.hr" [ref=e237] [cursor=pointer]:
        - /url: mailto:nepar@nepar.hr
        - text: nepar@nepar.hr
        - img [ref=e238]
    - generic [ref=e241]:
      - paragraph [ref=e242]: © 2026 Nepar Solutions. Digitalna rješenja po mjeri.
      - generic [ref=e243]:
        - link "Digitalni cjenik 2026." [ref=e244] [cursor=pointer]:
          - /url: /digitalni-cjenik
        - link "Privatnost" [ref=e245] [cursor=pointer]:
          - /url: /privatnost
        - button "Postavke privatnosti" [ref=e246] [cursor=pointer]
        - link "Povratak na vrh" [ref=e247] [cursor=pointer]:
          - /url: /
```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | 
  3   | const workerPageview = "https://analytics.nepar.test/analytics/pageview";
  4   | 
  5   | async function mockAnalytics(page, { contactStatus = 200 } = {}) {
  6   |   const googleRequests = [];
  7   |   const workerRequests = [];
  8   | 
  9   |   await page.route("https://www.googletagmanager.com/**", async (route) => {
  10  |     googleRequests.push(route.request().url());
  11  |     await route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
  12  |   });
  13  |   await page.route("https://analytics.nepar.test/**", async (route) => {
  14  |     const request = route.request();
  15  |     if (request.url() === workerPageview) {
  16  |       workerRequests.push(JSON.parse(request.postData() || "{}"));
  17  |       await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
  18  |       return;
  19  |     }
  20  |     await route.fulfill({
  21  |       status: contactStatus,
  22  |       contentType: "application/json",
  23  |       body: contactStatus >= 200 && contactStatus < 300 ? '{"ok":true}' : '{"error":"failed"}',
  24  |     });
  25  |   });
  26  | 
  27  |   return { googleRequests, workerRequests };
  28  | }
  29  | 
  30  | async function eventNames(page) {
  31  |   return page.evaluate(() => (window.dataLayer || [])
  32  |     .map((entry) => Array.from(entry))
  33  |     .filter((entry) => entry[0] === "event")
  34  |     .map((entry) => entry[1]));
  35  | }
  36  | 
  37  | async function persistAnalyticsConsent(page) {
  38  |   await page.addInitScript(() => {
  39  |     localStorage.setItem("nepar-consent-v1", JSON.stringify({
  40  |       version: 1,
  41  |       analytics: true,
  42  |       updatedAt: new Date().toISOString(),
  43  |     }));
  44  |   });
  45  | }
  46  | 
  47  | test("Basic consent blocks requests, enables one manual page view, and blocks again after withdrawal", async ({ page }) => {
  48  |   const requests = await mockAnalytics(page);
  49  |   await page.goto("/usluge/izrada-web-stranica?private=value#paketi");
  50  |   await page.waitForTimeout(500);
  51  | 
  52  |   expect(requests.googleRequests).toHaveLength(0);
  53  |   expect(requests.workerRequests).toHaveLength(0);
  54  |   await page.getByRole("button", { name: "Odbij analitiku" }).click();
  55  |   await page.reload();
  56  |   await page.waitForTimeout(500);
  57  |   expect(requests.googleRequests).toHaveLength(0);
  58  |   expect(requests.workerRequests).toHaveLength(0);
  59  | 
  60  |   await page.evaluate(() => window.dispatchEvent(new Event("nepar:open-consent-settings")));
  61  |   await page.getByRole("button", { name: "Prihvati analitiku" }).click();
  62  |   await expect.poll(() => requests.googleRequests.length).toBe(1);
  63  |   await expect.poll(() => requests.workerRequests.length).toBe(1);
  64  |   expect(requests.workerRequests[0].path).toBe("/usluge/izrada-web-stranica");
  65  | 
  66  |   const menuButton = page.getByRole("button", { name: "Otvori navigaciju" });
  67  |   if (await menuButton.isVisible()) await menuButton.click();
  68  |   await page.getByRole("link", { name: "Kontakt", exact: true }).click();
  69  |   await expect(page).toHaveURL(/\/kontakt$/);
  70  |   await expect.poll(() => requests.workerRequests.length).toBe(2);
  71  |   expect((await eventNames(page)).filter((name) => name === "page_view")).toHaveLength(2);
  72  | 
  73  |   const beforeWithdrawal = requests.googleRequests.length;
  74  |   await page.evaluate(() => window.dispatchEvent(new Event("nepar:open-consent-settings")));
  75  |   await page.getByRole("button", { name: "Odbij analitiku" }).click();
  76  |   await page.waitForLoadState("domcontentloaded");
  77  |   await page.waitForTimeout(500);
  78  |   expect(requests.googleRequests).toHaveLength(beforeWithdrawal);
  79  |   expect(requests.workerRequests).toHaveLength(2);
  80  |   await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("nepar-consent-v1")).analytics)).toBe(false);
  81  | });
  82  | 
  83  | test("funnel fires in order and generate_lead follows only a confirmed 2xx response", async ({ page }) => {
  84  |   await persistAnalyticsConsent(page);
  85  |   await mockAnalytics(page);
  86  |   await page.goto("/usluge/izrada-web-stranica");
> 87  |   await expect.poll(async () => (await eventNames(page)).filter((name) => name === "page_view").length).toBe(1);
      |                                                                                                         ^ Error: expect(received).toBe(expected) // Object.is equality
  88  | 
  89  |   await page.locator("#paketi").scrollIntoViewIfNeeded();
  90  |   await expect.poll(async () => (await eventNames(page)).includes("view_packages")).toBe(true);
  91  | 
  92  |   const businessCard = page.locator('[data-package-id="business"]');
  93  |   await businessCard.getByRole("button", { name: "Pošalji upit za paket" }).click();
  94  |   await page.getByLabel("Ime i prezime").fill("Test User");
  95  |   await expect.poll(async () => (await eventNames(page)).includes("start_lead")).toBe(true);
  96  |   await page.getByLabel("E-mail adresa").fill("test@example.com");
  97  |   await page.getByLabel("Kratko opišite projekt").fill("Testna poruka bez slanja PII-ja u analitiku.");
  98  |   await page.getByRole("dialog", { name: "Pošaljite upit" })
  99  |     .getByRole("button", { name: "Pošalji upit", exact: true })
  100 |     .click();
  101 |   await expect.poll(async () => (await eventNames(page)).includes("generate_lead")).toBe(true);
  102 | 
  103 |   const funnel = (await eventNames(page)).filter((name) => [
  104 |     "page_view",
  105 |     "view_packages",
  106 |     "start_lead",
  107 |     "generate_lead",
  108 |   ].includes(name));
  109 |   expect(funnel).toEqual(["page_view", "view_packages", "start_lead", "generate_lead"]);
  110 | });
  111 | 
  112 | test("Worker error never produces generate_lead", async ({ page }) => {
  113 |   await persistAnalyticsConsent(page);
  114 |   await mockAnalytics(page, { contactStatus: 502 });
  115 |   await page.goto("/kontakt");
  116 |   await page.getByLabel("Ime i prezime").fill("Test User");
  117 |   await page.getByLabel("E-mail adresa").fill("test@example.com");
  118 |   await page.getByLabel("Poruka").fill("Test failure path");
  119 |   await page.getByRole("button", { name: "Pošalji poruku" }).click();
  120 |   await expect(page.getByText(/Slanje nije uspjelo/)).toBeVisible();
  121 |   expect(await eventNames(page)).not.toContain("generate_lead");
  122 | });
  123 | 
```