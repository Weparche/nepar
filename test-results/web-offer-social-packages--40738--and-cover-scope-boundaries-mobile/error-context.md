# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web-offer.spec.js >> social packages show monthly pricing, keep ad budget and management separate, and cover scope boundaries
- Location: e2e\web-offer.spec.js:588:1

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.faq-list summary').filter({ hasText: 'Moramo li sami pripremati objave?' })
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('.faq-list summary').filter({ hasText: 'Moramo li sami pripremati objave?' })

```

```yaml
- main:
  - navigation "Glavna navigacija":
    - link "Nepar Solutions":
      - /url: /
      - img "Nepar Solutions"
    - group "Language":
      - button "HR" [pressed]
      - button "ENG"
    - button "Otvori navigaciju"
  - paragraph: Jasne cijene · bez skrivenog najma
  - heading "Izrada web-stranica za obrte i tvrtke." [level=1]
  - paragraph: Od jednostavne profesionalne prezentacije do napredne SEO strukture i prilagođenih upita. Izradu plaćate jednokratno, a održavanje birate samo ako vam treba.
  - link "Pogledaj pakete izrade":
    - /url: "#paketi"
  - button "Pošalji upit"
  - complementary:
    - text: Izrada već od
    - strong: 300 €
    - text: jednokratno
    - paragraph: Web-stranica je nakon plaćanja u vlasništvu klijenta. Održavanje nije obavezno i ugovara se zasebno.
  - text: Napredni tehnički i on-page SEO Responzivan dizajn Search Console i analitika Dogovoreni opseg i broj dorada
  - tablist "Vrsta ponude":
    - tab "01 Nova web-stranica"
    - tab "02 Redizajn i migracija"
    - tab "03 Održavanje"
    - tab "04 Društvene mreže" [selected]
  - tabpanel "04 Društvene mreže":
    - heading "Facebook i Instagram bez praznog hoda" [level=2]
    - paragraph: Redovite objave, profesionalni vizuali i sadržaj prilagođen vašem poslovanju. Vi nam dostavite fotografije i video materijal, a mi preuzimamo planiranje, obradu, tekstove i objavu.
    - paragraph: Produkcija fotografija i videa na lokaciji nije uključena u osnovne pakete i ugovara se zasebno.
    - button "Zatraži ponudu"
    - button "Dogovori sadržajni plan"
    - article:
      - heading "Social Basic" [level=3]
      - paragraph:
        - strong: 300 €
        - text: / mj.
      - paragraph: Za tvrtke koje žele profesionalno i redovito biti prisutne na Facebooku i Instagramu.
      - list:
        - listitem: 8 profesionalnih objava mjesečno
        - listitem: Facebook + Instagram
        - listitem: Copy, vizuali i objava uključeni
      - button "Zatraži ponudu"
      - group: Sve uključeno
    - article:
      - text: Preporučeno
      - heading "Social Business" [level=3]
      - paragraph:
        - strong: 450 €
        - text: / mj.
      - paragraph: Za tvrtke koje žele aktivniji profil i redovit video sadržaj.
      - list:
        - listitem: 12 objava + 2 Reelsa mjesečno
        - listitem: Mjesečni content plan
        - listitem: Osnovni community management
      - button "Zatraži ponudu"
      - group: Sve uključeno
    - article:
      - heading "Social Pro" [level=3]
      - paragraph:
        - strong: 650 €
        - text: / mj.
      - paragraph: Za tvrtke koje žele ozbiljniji kontinuirani kanal komunikacije i aktivno poboljšavanje rezultata.
      - list:
        - listitem: Do 4 Reelsa mjesečno
        - listitem: Aktivni community management
        - listitem: Mjesečna analiza i optimizacija
      - button "Zatraži ponudu"
      - group: Sve uključeno
    - paragraph: Klijent dostavlja osnovne fotografije i video materijal, a Nepar radi selekciju, obradu, dizajn, copy i objavu. Dolazak na lokaciju i snimanje sadržaja nije uključeno — profesionalno fotografiranje i snimanje ugovara se zasebno (Content session). Budžet za Meta oglase nikad nije uključen u cijenu paketa. Kompleksne kampanje, nagradne igre, influencer suradnje i opsežna video produkcija dobivaju zasebnu ponudu, a odgovaranje na kompleksne korisničke upite, rezervacije ili stručne odgovore nije dio standardnog community managementa.
  - heading "Dodatne usluge" [level=2]
  - paragraph: Za sadržaj i funkcionalnosti izvan dogovorenog paketa dobit ćete jasnu zasebnu procjenu.
  - term: Dodatna podstranica
  - definition: od 80 €
  - term: Ciljana SEO landing stranica
  - definition: od 100 €
  - term: Google Business profil i osnovno podešavanje
  - definition: od 100 €
  - term: Dodatna administracija sadržaja
  - definition: 40 €/sat
  - term: AI chatbot ili AI integracija
  - definition: od 500 €
  - term: Content session na lokaciji (do 60 min snimanja fotografija i videa)
  - definition: od 150 €
  - term: Upravljanje Meta Ads kampanjama
  - definition: od 150 € / mj. + oglasni budžet
  - term: Webshop, rezervacijski sustavi i napredne funkcionalnosti
  - definition: prema ponudi
  - heading "Česta pitanja" [level=2]
  - group: Tko je vlasnik web-stranice?
  - group: Moram li ugovoriti održavanje?
  - group: Jamčite li prvo mjesto na Googleu?
  - group: Koliko traje izrada web-stranice?
  - group: Mogu li kasnije nadograditi web-stranicu?
  - group: Je li hosting uključen u izradu?
  - group: Što trebam dostaviti za početak?
  - group: Mogu li zadržati postojeću domenu i e-mail adrese?
  - heading "Niste sigurni koji paket odgovara vašem projektu?" [level=2]
  - paragraph: Opišite poslovanje, željeni sadržaj i cilj web-stranice. Preporučit ćemo realan opseg bez nepotrebnih stavki.
  - button "Zatraži preporuku"
  - paragraph: Poslovni podaci
  - paragraph: Nepar, obrt za digitalna rješenja i usluge
  - text: "vl. Ivan Gorupić MBO: 99267101 Koprivnička ulica 52, 10000 Zagreb"
  - link "nepar@nepar.hr":
    - /url: mailto:nepar@nepar.hr
  - link "nepar@nepar.hr":
    - /url: mailto:nepar@nepar.hr
  - paragraph: © 2026 Nepar Solutions. Digitalna rješenja po mjeri.
  - link "Digitalni cjenik 2026.":
    - /url: /digitalni-cjenik
  - link "Cjenik":
    - /url: /cjenik
  - link "Mozgalica":
    - /url: /mozgalica
  - link "Njamko":
    - /url: /njamko
  - link "Privatnost":
    - /url: /privatnost
  - button "Postavke privatnosti"
  - link "Povratak na vrh":
    - /url: /
- dialog "Vi birate analitiku":
  - heading "Vi birate analitiku" [level=2]
  - paragraph: Nužne postavke održavaju stranicu funkcionalnom. Uz vaše dopuštenje koristimo GA4 i vlastitu analitiku kako bismo razumjeli koje stranice i upiti stvarno pomažu.
  - button "Prihvati analitiku"
  - button "Odbij analitiku"
  - link "Politika privatnosti":
    - /url: /privatnost
```

# Test source

```ts
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
  581 |   const bodyText = await page.locator("body").innerText();
  582 |   expect(bodyText).not.toMatch(/mjesečno plaćanje|pilot ponuda|mjesečna pretplata/i);
  583 |   await expectNoHorizontalOverflow(page);
  584 |   await expectHeadingOrder(page);
  585 |   await expectTouchTargets(page);
  586 | });
  587 | 
  588 | test("social packages show monthly pricing, keep ad budget and management separate, and cover scope boundaries", async ({ page }) => {
  589 |   await page.goto(servicePath);
  590 |   await page.locator("#social-offer-tab").click();
  591 |   await expect(page.getByRole("heading", { name: "Facebook i Instagram bez praznog hoda" })).toBeVisible();
  592 | 
  593 |   for (const [name, price] of [["Social Basic", "300 €"], ["Social Business", "450 €"], ["Social Pro", "650 €"]]) {
  594 |     const card = page.locator("article.offer-card").filter({ hasText: name }).first();
  595 |     await expect(card).toContainText(price);
  596 |     await expect(card).toContainText("/ mj.");
  597 |   }
  598 |   await expect(page.locator("article.offer-card").filter({ hasText: "Social Business" })).toContainText("Preporučeno");
  599 |   await expect(page.locator("article.offer-card").filter({ hasText: "Social Basic" })).not.toContainText("Preporučeno");
  600 |   await expect(page.locator("article.offer-card").filter({ hasText: "Social Pro" })).not.toContainText("Preporučeno");
  601 | 
  602 |   const basicCard = page.locator("article.offer-card").filter({ hasText: "Social Basic" }).first();
  603 |   await expect(basicCard).not.toContainText(/dolaz(imo|ak) na lokaciju/i);
  604 | 
  605 |   const socialPanel = page.locator("#drustvene-mreze");
  606 |   await expect(socialPanel).toContainText("Budžet za Meta oglase nikad nije uključen");
  607 |   await expect(socialPanel).not.toContainText("TikTok");
  608 | 
  609 |   await page.locator("#dodatne-usluge").scrollIntoViewIfNeeded();
  610 |   await expect(page.locator("#dodatne-usluge")).toContainText("Content session na lokaciji");
  611 |   await expect(page.locator("#dodatne-usluge")).toContainText("Upravljanje Meta Ads kampanjama");
  612 | 
  613 |   for (const question of [
  614 |     "Moramo li sami pripremati objave?",
  615 |     "Dolazite li fotografirati i snimati kod nas?",
  616 |     "Je li budžet za Facebook i Instagram oglase uključen?",
  617 |     "Objavljuje li se isti sadržaj na Facebooku i Instagramu?",
  618 |     "Odgovarate li na poruke i komentare?",
  619 |   ]) {
> 620 |     await expect(page.locator(".faq-list summary").filter({ hasText: question })).toBeVisible();
      |                                                                                   ^ Error: expect(locator).toBeVisible() failed
  621 |   }
  622 | 
  623 |   await expectNoHorizontalOverflow(page);
  624 |   await expectHeadingOrder(page);
  625 | });
  626 | 
  627 | test("pricing selector switches between all four offer kinds without duplicating visible cards", async ({ page }) => {
  628 |   await page.goto(servicePath);
  629 |   const websiteTab = page.locator("#website-offer-tab");
  630 |   const redesignTab = page.locator("#redesign-offer-tab");
  631 |   const maintenanceTab = page.locator("#maintenance-offer-tab");
  632 |   const socialTab = page.locator("#social-offer-tab");
  633 | 
  634 |   await expect(websiteTab).toHaveAttribute("aria-selected", "true");
  635 |   await expect(page.locator(".offer-card:visible")).toHaveCount(3);
  636 |   await redesignTab.click();
  637 |   await expect(redesignTab).toHaveAttribute("aria-selected", "true");
  638 |   await expect(page.locator(".offer-card:visible")).toHaveCount(3);
  639 |   await expect(page.getByRole("heading", { name: "Redizajn i migracija postojeće web-stranice" })).toBeVisible();
  640 |   await maintenanceTab.click();
  641 |   await expect(maintenanceTab).toHaveAttribute("aria-selected", "true");
  642 |   await expect(page.locator(".offer-card:visible")).toHaveCount(3);
  643 |   await expect(page.getByRole("heading", { name: "Godišnje održavanje web-stranice" })).toBeVisible();
  644 |   await socialTab.click();
  645 |   await expect(socialTab).toHaveAttribute("aria-selected", "true");
  646 |   await expect(page.locator(".offer-card:visible")).toHaveCount(3);
  647 |   await expect(page.getByRole("heading", { name: "Facebook i Instagram bez praznog hoda" })).toBeVisible();
  648 | 
  649 |   await socialTab.press("ArrowLeft");
  650 |   await expect(maintenanceTab).toBeFocused();
  651 |   await expect(maintenanceTab).toHaveAttribute("aria-selected", "true");
  652 | });
  653 | 
  654 | test("offer hashes resolve correctly and selector updates the URL without a scroll jump", async ({ page }) => {
  655 |   for (const [hash, selectedId] of [
  656 |     ["#redizajn", "#redesign-offer-tab"],
  657 |     ["#odrzavanje", "#maintenance-offer-tab"],
  658 |     ["#drustvene-mreze", "#social-offer-tab"],
  659 |     ["", "#website-offer-tab"],
  660 |     ["#nepoznato", "#website-offer-tab"],
  661 |   ]) {
  662 |     await page.goto(`${servicePath}${hash}`);
  663 |     await expect(page.locator(selectedId)).toHaveAttribute("aria-selected", "true");
  664 |   }
  665 | 
  666 |   await page.goto(servicePath);
  667 |   await expect(page.locator(".offer-selector")).toBeVisible();
  668 |   await page.waitForTimeout(1000);
  669 |   await page.evaluate(() => {
  670 |     document.documentElement.style.scrollBehavior = "auto";
  671 |     const selectorTop = document.querySelector(".offer-selector").getBoundingClientRect().top + window.scrollY;
  672 |     window.scrollTo(0, Math.max(0, selectorTop - 120));
  673 |   });
  674 |   const before = await page.evaluate(() => window.scrollY);
  675 |   await page.evaluate(() => document.querySelector("#redesign-offer-tab").click());
  676 |   await expect(page).toHaveURL(/#redizajn$/);
  677 |   expect(Math.abs((await page.evaluate(() => window.scrollY)) - before)).toBeLessThanOrEqual(1);
  678 |   await page.locator("#website-offer-tab").click();
  679 |   await expect(page).toHaveURL(new RegExp(`${servicePath}$`));
  680 | });
  681 | 
  682 | test("mobile contact keeps the form before supporting proof", async ({ page }) => {
  683 |   await page.setViewportSize({ width: 390, height: 844 });
  684 |   await page.goto("/kontakt");
  685 |   await expect(page.getByRole("heading", { level: 1, name: /Pišite nam/ })).toBeVisible();
  686 |   const formBox = await page.locator(".contact-brief-form").boundingBox();
  687 |   const proofBox = await page.locator(".contact-brief-proof").boundingBox();
  688 |   expect(formBox.y).toBeLessThan(proofBox.y);
  689 |   await expectNoHorizontalOverflow(page);
  690 | });
  691 | 
  692 | test("English content stays aligned with the new model", async ({ page }) => {
  693 |   await page.goto(servicePath);
  694 |   await page.getByRole("button", { name: "ENG" }).click();
  695 |   await expect(page.getByRole("heading", { name: "Website development packages" })).toBeVisible();
  696 |   await expect(page.getByText("The website belongs to the client after payment.", { exact: false }).first()).toBeVisible();
  697 |   await page.locator("#redesign-offer-tab").click();
  698 |   await expect(page.getByRole("heading", { name: "Existing website redesign and migration" })).toBeVisible();
  699 |   await expect(page.locator("article.offer-card").filter({ hasText: "Redesign Business" })).toContainText("from €1,100");
  700 |   await page.locator("#maintenance-offer-tab").click();
  701 |   await expect(page.getByRole("heading", { name: "Annual website maintenance" })).toBeVisible();
  702 |   await expect(page.locator("article.offer-card").filter({ hasText: "Maintenance Pro" })).toContainText("€50 monthly equivalent");
  703 |   await expect(page.locator("article.offer-card").filter({ hasText: "Maintenance Pro" })).toContainText("Billed once per year");
  704 | 
  705 |   const bodyText = await page.locator("body").innerText();
  706 |   expect(bodyText).not.toMatch(/monthly payment|pilot offer|monthly subscription/i);
  707 | 
  708 |   await page.locator("#social-offer-tab").click();
  709 |   await expect(page.getByRole("heading", { name: "Facebook and Instagram, without the dead air" })).toBeVisible();
  710 |   for (const [name, price] of [["Social Basic", "€300"], ["Social Business", "€450"], ["Social Pro", "€650"]]) {
  711 |     const card = page.locator("article.offer-card").filter({ hasText: name }).first();
  712 |     await expect(card).toContainText(price);
  713 |     await expect(card).toContainText("/ month");
  714 |   }
  715 |   await expect(page.locator("article.offer-card").filter({ hasText: "Social Business" })).toContainText("Recommended");
  716 | });
  717 | 
  718 | test("package inquiry dialog carries the selected commercial model", async ({ page }) => {
  719 |   await page.goto(servicePath);
  720 |   const businessCard = page.locator("article.offer-card").filter({ hasText: "Web Business" }).first();
```