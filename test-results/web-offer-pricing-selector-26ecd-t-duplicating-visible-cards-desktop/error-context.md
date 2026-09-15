# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web-offer.spec.js >> pricing selector switches between all four offer kinds without duplicating visible cards
- Location: e2e\web-offer.spec.js:627:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/usluge/izrada-web-stranica
Call log:
  - navigating to "http://127.0.0.1:4173/usluge/izrada-web-stranica", waiting until "load"

```

# Test source

```ts
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
  620 |     await expect(page.locator(".faq-list summary").filter({ hasText: question })).toBeVisible();
  621 |   }
  622 | 
  623 |   await expectNoHorizontalOverflow(page);
  624 |   await expectHeadingOrder(page);
  625 | });
  626 | 
  627 | test("pricing selector switches between all four offer kinds without duplicating visible cards", async ({ page }) => {
> 628 |   await page.goto(servicePath);
      |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/usluge/izrada-web-stranica
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
  721 |   await businessCard.getByRole("button", { name: "Pošalji upit za paket" }).click();
  722 | 
  723 |   const dialog = page.getByRole("dialog", { name: "Pošaljite upit" });
  724 |   await expect(dialog).toBeVisible();
  725 |   await expect(dialog).toContainText("Web Business");
  726 |   await expect(dialog).toContainText("Nova web-stranica");
  727 |   await expect(dialog).toContainText("500 € · jednokratno");
  728 |   await expect(page.locator("#inquiry-name")).toBeFocused();
```