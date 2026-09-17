# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web-landing-fallback.spec.js >> missing Worker opens the explicit mail fallback without reporting a generated lead
- Location: e2e\web-landing-fallback.spec.js:10:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Otvorili smo vašu e-mail aplikaciju. Poruku još trebate poslati.')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Otvorili smo vašu e-mail aplikaciju. Poruku još trebate poslati.')

```

```yaml
- main:
  - link "Nepar Solutions — naslovnica":
    - /url: /
    - img "Nepar Solutions"
  - navigation "Navigacija landing stranice":
    - link "Zatraži ponudu — navigacija":
      - /url: "#upit"
      - text: Zatraži ponudu
  - region "Profesionalna web stranica za vaš posao. Sada od 240 €.":
    - heading "Profesionalna web stranica za vaš posao. Sada od 240 €." [level=1]
    - paragraph: Brza, moderna i optimizirana za Google. Bez mjesečne pretplate — stranica je vaša.
    - link "Zatraži ponudu":
      - /url: "#upit"
    - text: 20% popusta na sve pakete Potpuno vlasništvo Za tvrtke i obrte u Hrvatskoj
    - figure:
      - text: Komercijalni web u praksi
      - strong: Auto Gubić
      - img "Auto Gubić web-stranica za specijalizirani Volvo servis"
  - region "Pogledajte što izrađujemo":
    - heading "Pogledajte što izrađujemo" [level=2]
    - paragraph: Ne pokazujemo generičke mockupove. Ovo su stvarni proizvodi i stranice koje smo izradili.
    - link "Pogledaj projekt Auto Gubić — otvara se u novom tabu":
      - /url: https://autogubic.hr/
      - img "Auto Gubić web-stranica za specijalizirani Volvo servis"
      - paragraph: Komercijalni web
      - heading "Auto Gubić" [level=3]
      - text: Profesionalna stranica za specijalizirani Volvo servis, s lokalnim SEO-om i jasnim servisnim upitom.
    - link "Pogledaj projekt BezStruje.hr — otvara se u novom tabu":
      - /url: https://bezstruje.hr
      - img "BezStruje.hr portal za planirane radove i kvarove"
      - paragraph: Informacijski portal
      - heading "BezStruje.hr" [level=3]
      - text: Portal za planirane radove, kvarove i lokacije prekida električne energije.
    - link "Pogledaj projekt VremenskaPrognoza.hr — otvara se u novom tabu":
      - /url: https://vremenskaprognoza.hr
      - img "VremenskaPrognoza.hr prikaz prognoze za Hrvatsku"
      - paragraph: Podatkovna platforma
      - heading "VremenskaPrognoza.hr" [level=3]
      - text: Responzivna vremenska platforma s prognozama, upozorenjima i podacima za cijelu Hrvatsku.
  - region "Web koji radi ozbiljan posao":
    - heading "Web koji radi ozbiljan posao" [level=2]
    - article:
      - text: "01"
      - heading "Izgleda profesionalno" [level=3]
      - paragraph: Dizajn prilagođen vašem poslu, ne generički predložak koji izgleda kao svi ostali.
    - article:
      - text: "02"
      - heading "Ljudi vas mogu pronaći" [level=3]
      - paragraph: SEO osnova, brzina i tehnički ispravno indeksiranje ugrađeni su od početka.
    - article:
      - text: "03"
      - heading "Stranica je vaša" [level=3]
      - paragraph: Bez zaključavanja na platformu i bez obavezne mjesečne pretplate.
    - text: Responsive SEO Analytics HTTPS GDPR
  - region "Od jednostavnog početka do ozbiljnog prodajnog weba":
    - heading "Od jednostavnog početka do ozbiljnog prodajnog weba" [level=2]
    - paragraph: Tri realna opsega po akcijskim cijenama, bez skrivenog najma i bez liste od petnaest stavki.
    - article:
      - text: −20%
      - heading "Start" [level=3]
      - text: Akcijska cijena
      - deletion: 300 €
      - strong: 240 €
      - paragraph: Jasan profesionalni početak za manji posao.
      - list:
        - listitem: Profesionalna jednostranična stranica
        - listitem: Responsive dizajn
        - listitem: SEO osnova
    - article:
      - text: −20% Najbolji omjer cijene i koristi
      - heading "Business" [level=3]
      - text: Akcijska cijena
      - deletion: 500 €
      - strong: 400 €
      - paragraph: Najbolji omjer sadržaja, strukture i upita.
      - list:
        - listitem: Više sadržajnih stranica
        - listitem: Naprednija struktura
        - listitem: Kontakt i lead funkcionalnosti
    - article:
      - text: −20%
      - heading "Pro" [level=3]
      - text: Akcijska cijena
      - deletion: 700 €
      - strong: 560 €
      - paragraph: Za web koji ima važniju prodajnu ulogu.
      - list:
        - listitem: Opsežniji web
        - listitem: Prilagođene funkcionalnosti
        - listitem: Naprednija optimizacija
    - paragraph:
      - strong: Niste sigurni koji paket trebate?
      - text: Opišite projekt.
    - link "Recite nam što trebate":
      - /url: "#upit"
  - region "Od dogovora do objave":
    - heading "Od dogovora do objave" [level=2]
    - paragraph: Uvijek znate što je sljedeće i gdje je projekt.
    - list:
      - listitem:
        - text: "01"
        - heading "Dogovor" [level=3]
        - paragraph: Kažete što trebate.
      - listitem:
        - text: "02"
        - heading "Izrada" [level=3]
        - paragraph: Dobivate prvi prijedlog.
      - listitem:
        - text: "03"
        - heading "Pregled" [level=3]
        - paragraph: Doradimo sadržaj i izgled.
      - listitem:
        - text: "04"
        - heading "Objava" [level=3]
        - paragraph: Web ide online i postaje vaš.
  - region "Opišite web koji trebate":
    - heading "Opišite web koji trebate" [level=2]
    - paragraph: Pošaljite osnovne informacije. Odgovorit ćemo osobno s realnom preporukom opsega i sljedećim korakom.
    - text: Bez obaveze Odgovara stvarna osoba Za cijelu Hrvatsku Ime
    - textbox "Ime": Test Korisnik
    - text: E-mail
    - textbox "E-mail": test@example.com
    - text: Telefon opcionalno
    - textbox "Telefon opcionalno"
    - text: Što trebate?
    - textbox "Što trebate?":
      - /placeholder: Čime se bavite, što web treba sadržavati i koji vam je glavni cilj?
      - text: Testni projekt bez konfiguriranog Workera.
    - alert:
      - text: Upit trenutačno nije moguće poslati.
      - link "Pošalji e-mailom":
        - /url: mailto:nepar@nepar.hr?subject=Upit%20za%20novu%20web-stranicu&body=Ime%3A%20Test%20Korisnik%0AE-mail%3A%20test%40example.com%0ATelefon%3A%20nije%20naveden%0A%0A%C5%A0to%20trebate%3A%0ATestni%20projekt%20bez%20konfiguriranog%20Workera.%0A%0AAtribucija%3A%0Autm_source%3A%20chatgpt%0Autm_medium%3A%20paid%0Autm_campaign%3A%20web_hr%0Alanding_path%3A%20%2Fweb
    - button "Zatraži ponudu"
    - text: Bez obveze. Odgovaram osobno.
  - region "Česta pitanja":
    - heading "Česta pitanja" [level=2]
    - group: Koliko košta izrada?
    - group: Koliko traje?
    - group: Moram li plaćati mjesečno održavanje?
    - group: Je li stranica moja nakon izrade?
  - region "Završni poziv na upit":
    - heading "Trebate novu web stranicu?" [level=2]
    - link "Recite nam što trebate":
      - /url: "#upit"
  - link "Nepar Solutions":
    - /url: /
    - img "Nepar Solutions"
  - link "nepar@nepar.hr":
    - /url: mailto:nepar@nepar.hr
  - paragraph: "Nepar, obrt za digitalna rješenja i usluge · vl. Ivan Gorupić · MBO: 99267101"
  - text: © 2026 Nepar Solutions
  - link "Privatnost":
    - /url: /privatnost
  - button "Postavke privatnosti"
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | async function analyticsEvents(page) {
  4  |   return page.evaluate(() => (window.dataLayer || [])
  5  |     .map((entry) => Array.from(entry))
  6  |     .filter((entry) => entry[0] === "event")
  7  |     .map((entry) => entry[1]));
  8  | }
  9  | 
  10 | test("missing Worker opens the explicit mail fallback without reporting a generated lead", async ({ page }) => {
  11 |   await page.addInitScript(() => {
  12 |     localStorage.setItem("nepar-consent-v1", JSON.stringify({
  13 |       version: 1,
  14 |       analytics: true,
  15 |       updatedAt: new Date().toISOString(),
  16 |     }));
  17 |   });
  18 |   await page.route("https://www.googletagmanager.com/**", (route) => (
  19 |     route.fulfill({ status: 200, contentType: "application/javascript", body: "" })
  20 |   ));
  21 | 
  22 |   await page.goto("/web?utm_source=chatgpt&utm_medium=paid&utm_campaign=web_hr");
  23 |   await page.getByLabel("Ime").fill("Test Korisnik");
  24 |   await page.getByLabel("E-mail").fill("test@example.com");
  25 |   await page.getByLabel("Što trebate?").fill("Testni projekt bez konfiguriranog Workera.");
  26 |   await page.locator('#upit button[type="submit"]').click();
  27 | 
> 28 |   await expect(page.getByText("Otvorili smo vašu e-mail aplikaciju. Poruku još trebate poslati.")).toBeVisible();
     |                                                                                                    ^ Error: expect(locator).toBeVisible() failed
  29 |   await expect(page.getByText("Upit je poslan.")).toHaveCount(0);
  30 |   await expect.poll(async () => (await analyticsEvents(page)).filter((name) => name === "click_email").length).toBe(1);
  31 |   expect((await analyticsEvents(page)).filter((name) => name === "generate_lead")).toHaveLength(0);
  32 | });
  33 | 
```