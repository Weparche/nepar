# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: njamko.spec.js >> Njamko screenshots >> 6. Njamko Plus screen
- Location: e2e\njamko.spec.js:879:3

# Error details

```
Error: A snapshot doesn't exist at C:\Nepar\e2e\njamko.spec.js-snapshots\06-plus-screen-desktop-win32.png, writing actual.
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - generic:
      - generic: ☁️
      - generic: ☁️
      - generic: 🌤️
      - generic: 🌳
      - generic: 🌲
    - generic [ref=e6]:
      - generic [ref=e7]: ⭐
      - heading "Njamko Plus" [level=1] [ref=e8]
      - paragraph [ref=e9]: Otključaj sve dodatne razine.
      - paragraph [ref=e10]: 4,99 €
      - list [ref=e11]:
        - listitem [ref=e12]: ✅ Dodatne razine
        - listitem [ref=e13]: ✅ Nove runde za učenje
        - listitem [ref=e14]: ✅ Plus razine otključane
        - listitem [ref=e15]: ✅ Bez reklama
        - listitem [ref=e16]: ✅ Jednokratna kupnja
      - paragraph [ref=e17]: Kupnju uvijek potvrđuje roditelj. Ovo je trenutno demo otključavanje.
      - generic [ref=e18]:
        - button "Simuliraj otključavanje" [ref=e19] [cursor=pointer]
        - button "Natrag" [ref=e20] [cursor=pointer]
  - dialog "Vi birate analitiku" [ref=e21]:
    - generic [ref=e22]:
      - img [ref=e24]
      - generic [ref=e27]:
        - heading "Vi birate analitiku" [level=2] [ref=e28]
        - paragraph [ref=e29]: Nužne postavke održavaju stranicu funkcionalnom. Uz vaše dopuštenje koristimo GA4 i vlastitu analitiku kako bismo razumjeli koje stranice i upiti stvarno pomažu.
    - generic [ref=e30]:
      - button "Prihvati analitiku" [ref=e31] [cursor=pointer]
      - button "Odbij analitiku" [ref=e32] [cursor=pointer]
      - link "Politika privatnosti" [ref=e33] [cursor=pointer]:
        - /url: /privatnost
```

# Test source

```ts
  786 |         expect(round.options).toHaveLength(3);
  787 | 
  788 |         const names = round.options.map((option) => option.name);
  789 |         expect(new Set(names).size).toBe(3);
  790 | 
  791 |         const visuals = round.options.map(
  792 |           (option) => `${option.emoji}|${option.image ?? ""}`,
  793 |         );
  794 |         expect(new Set(visuals).size).toBe(3);
  795 |         expect(round.options.every((option) => option.emoji !== "❓")).toBe(true);
  796 |       }
  797 |     }
  798 | 
  799 |     expect(animals).toHaveLength(50);
  800 | 
  801 |     const mobileBackgrounds = new Set();
  802 |     for (const level of food.levels) {
  803 |       for (const round of level.rounds) {
  804 |         expect(round.mobileAnswerRow).toBe(true);
  805 |         expect(round.mobileBackgroundImage).toMatch(
  806 |           /^\/assets\/backgrounds\/food-[a-z0-9-]+-mobile\.webp$/,
  807 |         );
  808 |         mobileBackgrounds.add(round.mobileBackgroundImage);
  809 |         const assetPath = fileURLToPath(
  810 |           new URL(`../public${round.mobileBackgroundImage}`, import.meta.url),
  811 |         );
  812 |         expect(existsSync(assetPath)).toBe(true);
  813 |       }
  814 |     }
  815 |     expect(mobileBackgrounds.size).toBe(50);
  816 | 
  817 |     const keyPairs = [
  818 |       ["Zeko", "Mrkva"],
  819 |       ["Pas", "Pseći keksić"],
  820 |       ["Miš", "Sir"],
  821 |       ["Kanarinac", "Sjemenke"],
  822 |       ["Jež", "Jabuka"],
  823 |       ["Dabar", "Kora"],
  824 |       ["Leptir", "Nektar"],
  825 |       ["Slon", "Grane"],
  826 |       ["Sova", "Kukci"],
  827 |       ["Kit", "Plankton"],
  828 |       ["Krokodil", "Meso"],
  829 |       ["Morski konjic", "Račići"],
  830 |     ];
  831 | 
  832 |     for (const [animal, foodName] of keyPairs) {
  833 |       const round = food.levels
  834 |         .flatMap((level) => level.rounds)
  835 |         .find((item) => item.mainLabel === animal);
  836 |       expect(round?.correctAnswer).toBe(foodName);
  837 |     }
  838 | 
  839 |     const lav = food.levels[3].rounds.find((round) => round.mainLabel === "Lav");
  840 |     const krokodil = food.levels[3].rounds.find((round) => round.mainLabel === "Krokodil");
  841 |     expect(lav?.correctAnswer).toBe("Meso");
  842 |     expect(krokodil?.correctAnswer).toBe("Meso");
  843 | 
  844 |     expect(food.levels[4].rounds.filter((round) => round.correctAnswer === "Račići")).toHaveLength(2);
  845 |     expect(food.levels[1].rounds.filter((round) => round.correctAnswer === "Sjemenke")).toHaveLength(3);
  846 |   });
  847 | });
  848 | 
  849 | const SCREENSHOT_OPTS = { fullPage: true, maxDiffPixelRatio: 0.03 };
  850 | 
  851 | test.describe("Njamko screenshots", () => {
  852 |   test("1. mode select screen", async ({ page }) => {
  853 |     await openModeSelect(page);
  854 |     await page.waitForTimeout(400);
  855 |     await expect(page).toHaveScreenshot("02-mode-select.png", SCREENSHOT_OPTS);
  856 |   });
  857 | 
  858 |   test("2. level select screen", async ({ page }) => {
  859 |     await openFoodLevelSelect(page);
  860 |     await page.waitForTimeout(400);
  861 |     await expect(page).toHaveScreenshot("03-level-select.png", SCREENSHOT_OPTS);
  862 |   });
  863 | 
  864 |   test("4. locked level screen (level select with Plus)", async ({ page }) => {
  865 |     await openFoodLevelSelect(page);
  866 |     await expect(page.getByTestId("level-card-2")).toContainText("Plus");
  867 |     await page.waitForTimeout(400);
  868 |     await expect(page).toHaveScreenshot("04-locked-level-select.png", SCREENSHOT_OPTS);
  869 |   });
  870 | 
  871 |   test("5. parental gate", async ({ page }) => {
  872 |     await openFoodLevelSelect(page);
  873 |     await page.getByTestId("level-card-2").click();
  874 |     await expect(page.getByTestId("parental-gate")).toBeVisible();
  875 |     await page.waitForTimeout(400);
  876 |     await expect(page).toHaveScreenshot("05-parental-gate.png", SCREENSHOT_OPTS);
  877 |   });
  878 | 
  879 |   test("6. Njamko Plus screen", async ({ page }) => {
  880 |     await openFoodLevelSelect(page);
  881 |     await page.getByTestId("level-card-2").click();
  882 |     await page.getByTestId("parental-answer-input").fill("12");
  883 |     await page.getByTestId("parental-submit-button").click();
  884 |     await expect(page.getByTestId("plus-screen")).toBeVisible();
  885 |     await page.waitForTimeout(400);
> 886 |     await expect(page).toHaveScreenshot("06-plus-screen.png", SCREENSHOT_OPTS);
      |     ^ Error: A snapshot doesn't exist at C:\Nepar\e2e\njamko.spec.js-snapshots\06-plus-screen-desktop-win32.png, writing actual.
  887 |   });
  888 | 
  889 |   test("7. game screen", async ({ page }) => {
  890 |     await page.emulateMedia({ reducedMotion: "reduce" });
  891 |     await openFoodLevelSelect(page);
  892 |     await page.getByTestId("level-card-1").click();
  893 |     await expect(page.getByTestId("game-screen")).toBeVisible();
  894 |     await page.waitForTimeout(400);
  895 |     await expect(page).toHaveScreenshot("07-game-screen.png", SCREENSHOT_OPTS);
  896 |   });
  897 | 
  898 |   test("8. finish screen", async ({ page }) => {
  899 |     test.setTimeout(120_000);
  900 |     await openFoodLevelSelect(page);
  901 |     await page.getByTestId("level-card-1").click();
  902 |     await completeLevel(page, "food", 1);
  903 |     await expect(page.getByTestId("finish-screen")).toBeVisible({ timeout: 10_000 });
  904 |     await page.waitForTimeout(400);
  905 |     await expect(page).toHaveScreenshot("08-finish-screen.png", SCREENSHOT_OPTS);
  906 |   });
  907 | });
  908 | 
  909 | test.describe("Njamko viewport screenshots", () => {
  910 |   for (const viewport of [
  911 |     { name: "mobile", width: 390, height: 844 },
  912 |     { name: "tablet", width: 768, height: 1024 },
  913 |     { name: "desktop", width: 1440, height: 900 },
  914 |   ]) {
  915 |     test(`${viewport.name} level select`, async ({ page }) => {
  916 |       await page.setViewportSize({ width: viewport.width, height: viewport.height });
  917 |       await openFoodLevelSelect(page);
  918 |       await page.waitForTimeout(400);
  919 |       await expect(page).toHaveScreenshot(
  920 |         `level-select-${viewport.name}.png`,
  921 |         SCREENSHOT_OPTS,
  922 |       );
  923 |     });
  924 |   }
  925 | });
  926 | 
  927 | 
  928 | 
```