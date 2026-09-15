# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: web-offer.spec.js >> 768px layout arranges the four selector controls in a 2x2 grid without overflow
- Location: e2e\web-offer.spec.js:765:1

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/usluge/izrada-web-stranica
Call log:
  - navigating to "http://127.0.0.1:4173/usluge/izrada-web-stranica", waiting until "load"

```

# Test source

```ts
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
  729 | 
  730 |   await page.keyboard.press("Escape");
  731 |   await expect(dialog).toBeHidden();
  732 |   await expect(businessCard.getByRole("button", { name: "Pošalji upit za paket" })).toBeFocused();
  733 | 
  734 |   await page.locator("#redesign-offer-tab").click();
  735 |   const redesignCard = page.locator("article.offer-card").filter({ hasText: "Redizajn Business" });
  736 |   await redesignCard.getByRole("button", { name: "Pošalji upit za redizajn" }).click();
  737 |   await expect(dialog).toBeVisible();
  738 |   await expect(dialog).toContainText("Redizajn i migracija");
  739 |   await expect(dialog).toContainText("od 1.100 € · jednokratno");
  740 |   await page.keyboard.press("Escape");
  741 |   await expect(dialog).toBeHidden();
  742 | 
  743 |   await page.locator("#social-offer-tab").click();
  744 |   const socialCard = page.locator("article.offer-card").filter({ hasText: "Social Business" });
  745 |   await socialCard.getByRole("button", { name: "Zatraži ponudu" }).click();
  746 |   await expect(dialog).toBeVisible();
  747 |   await expect(dialog).toContainText("Social Business");
  748 |   await expect(dialog).toContainText("Vođenje Facebooka i Instagrama");
  749 |   await expect(dialog).toContainText("450 € / mj.");
  750 | });
  751 | 
  752 | test("390px layout stacks all four selector controls and stays within the viewport", async ({ page }) => {
  753 |   await page.setViewportSize({ width: 390, height: 844 });
  754 |   await page.goto(servicePath);
  755 |   const tabs = page.locator(".offer-selector [role=tab]");
  756 |   await expect(tabs).toHaveCount(4);
  757 |   const boxes = await tabs.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().toJSON()));
  758 |   expect(boxes[0].bottom).toBeLessThanOrEqual(boxes[1].top);
  759 |   expect(boxes[1].bottom).toBeLessThanOrEqual(boxes[2].top);
  760 |   expect(boxes[2].bottom).toBeLessThanOrEqual(boxes[3].top);
  761 |   await expectNoHorizontalOverflow(page);
  762 |   await expectTouchTargets(page);
  763 | });
  764 | 
  765 | test("768px layout arranges the four selector controls in a 2x2 grid without overflow", async ({ page }) => {
  766 |   await page.setViewportSize({ width: 768, height: 1024 });
> 767 |   await page.goto(servicePath);
      |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://127.0.0.1:4173/usluge/izrada-web-stranica
  768 |   const tabs = page.locator(".offer-selector [role=tab]");
  769 |   await expect(tabs).toHaveCount(4);
  770 |   const boxes = await tabs.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().toJSON()));
  771 |   expect(boxes[0].top).toBeCloseTo(boxes[1].top, 0);
  772 |   expect(boxes[2].top).toBeCloseTo(boxes[3].top, 0);
  773 |   expect(boxes[0].bottom).toBeLessThanOrEqual(boxes[2].top);
  774 |   await expectNoHorizontalOverflow(page);
  775 |   await expectTouchTargets(page);
  776 | });
  777 | 
  778 | test("legacy route redirects and keeps its anchor", async ({ page }) => {
  779 |   await page.goto("/usluge/web-stranica-bez-pocetnog-troska#paketi");
  780 |   await expect(page).toHaveURL(/\/usluge\/izrada-web-stranica#paketi$/);
  781 |   await expect(page.getByRole("heading", { name: "Paketi izrade web-stranice" })).toBeVisible();
  782 | });
  783 | 
  784 | test("landing, pricing, and contact have no serious accessibility violations", async ({ page }) => {
  785 |   await page.emulateMedia({ reducedMotion: "reduce" });
  786 |   for (const path of ["/", servicePath, "/kontakt"]) {
  787 |     await page.goto(path);
  788 |     await expect(page.locator("h1")).toBeVisible();
  789 |     await page.waitForTimeout(1000);
  790 |     const results = await new AxeBuilder({ page }).analyze();
  791 |     const serious = results.violations.filter(({ impact }) => impact === "serious" || impact === "critical");
  792 |     expect(serious, `${path}: ${serious.map((item) => item.id).join(", ")}`).toEqual([]);
  793 |   }
  794 | });
  795 | 
```