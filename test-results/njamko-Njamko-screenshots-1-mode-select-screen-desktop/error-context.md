# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: njamko.spec.js >> Njamko screenshots >> 1. mode select screen
- Location: e2e\njamko.spec.js:852:3

# Error details

```
Error: A snapshot doesn't exist at C:\Nepar\e2e\njamko.spec.js-snapshots\02-mode-select-desktop-win32.png, writing actual.
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
    - generic [ref=e5]:
      - heading "Odaberi igru" [level=1] [ref=e6]
      - paragraph [ref=e7]: Odaberi igru i kreni učiti kroz kratke, nježne runde.
      - button "Preporučeno Igraj kampanju Putuj kroz sve igre redom i otkrivaj novu mapu." [ref=e8] [cursor=pointer]:
        - generic [ref=e10]:
          - generic [ref=e11]: Preporučeno
          - generic [ref=e12]: Igraj kampanju
          - generic [ref=e13]: Putuj kroz sve igre redom i otkrivaj novu mapu.
      - generic [ref=e14]:
        - button "Nahrani životinju Odaberi što životinja voli jesti. ✓ Razina 1 besplatno 5 razina" [ref=e15] [cursor=pointer]:
          - generic [ref=e16]:
            - generic [ref=e17]: Nahrani životinju
            - generic [ref=e18]: Odaberi što životinja voli jesti.
            - generic [ref=e19]: ✓ Razina 1 besplatno
            - generic [ref=e20]: 5 razina
        - button "Pronađi dom Pomogni životinji pronaći gdje živi. ✓ Razina 1 besplatno 5 razina" [ref=e21] [cursor=pointer]:
          - generic [ref=e22]:
            - generic [ref=e23]: Pronađi dom
            - generic [ref=e24]: Pomogni životinji pronaći gdje živi.
            - generic [ref=e25]: ✓ Razina 1 besplatno
            - generic [ref=e26]: 5 razina
        - button "Pogodi zvuk Poslušaj zvuk i odaberi životinju. ✓ Razina 1 besplatno 5 razina" [ref=e27] [cursor=pointer]:
          - generic [ref=e28]:
            - generic [ref=e29]: Pogodi zvuk
            - generic [ref=e30]: Poslušaj zvuk i odaberi životinju.
            - generic [ref=e31]: ✓ Razina 1 besplatno
            - generic [ref=e32]: 5 razina
        - button "Mama i beba Spoji bebu s mamom. ✓ Razina 1 besplatno 5 razina" [ref=e33] [cursor=pointer]:
          - generic [ref=e34]:
            - generic [ref=e35]: Mama i beba
            - generic [ref=e36]: Spoji bebu s mamom.
            - generic [ref=e37]: ✓ Razina 1 besplatno
            - generic [ref=e38]: 5 razina
        - button "Broji s Njamkom Skupljaj školjke, kamenčiće i morske prijatelje dok učiš brojeve. ✓ Razina 1 besplatno 5 razina" [ref=e39] [cursor=pointer]:
          - generic [ref=e40]:
            - generic [ref=e41]: Broji s Njamkom
            - generic [ref=e42]: Skupljaj školjke, kamenčiće i morske prijatelje dok učiš brojeve.
            - generic [ref=e43]: ✓ Razina 1 besplatno
            - generic [ref=e44]: 5 razina
      - button "Natrag na home" [ref=e45] [cursor=pointer]
      - contentinfo [ref=e46]:
        - link "Privatnost" [ref=e47] [cursor=pointer]:
          - /url: /privatnost
        - button "Postavke privatnosti" [ref=e48] [cursor=pointer]
  - dialog "Vi birate analitiku" [ref=e49]:
    - generic [ref=e50]:
      - img [ref=e52]
      - generic [ref=e55]:
        - heading "Vi birate analitiku" [level=2] [ref=e56]
        - paragraph [ref=e57]: Nužne postavke održavaju stranicu funkcionalnom. Uz vaše dopuštenje koristimo GA4 i vlastitu analitiku kako bismo razumjeli koje stranice i upiti stvarno pomažu.
    - generic [ref=e58]:
      - button "Prihvati analitiku" [ref=e59] [cursor=pointer]
      - button "Odbij analitiku" [ref=e60] [cursor=pointer]
      - link "Politika privatnosti" [ref=e61] [cursor=pointer]:
        - /url: /privatnost
```

# Test source

```ts
  755 |     expect(food.levels).toHaveLength(5);
  756 | 
  757 |     const animals = [];
  758 |     const globalFoodCounts = new Map();
  759 | 
  760 |     for (const level of food.levels) {
  761 |       expect(level.rounds).toHaveLength(10);
  762 |       const levelAnimals = new Set();
  763 | 
  764 |       for (const round of level.rounds) {
  765 |         expect(round.mode).toBe("food");
  766 |         expect(round.successText).toMatch(/^Bravo!/);
  767 |         expect(round.question).toMatch(/^Što jede .+\?$/);
  768 |         expect(round.prompt).toMatch(/ je gladan!$| je gladna!$/);
  769 | 
  770 |         if (round.prompt.endsWith("gladna!")) {
  771 |           expect(round.prompt).not.toContain(" je gladan!");
  772 |         }
  773 | 
  774 |         expect(animals).not.toContain(round.mainLabel);
  775 |         animals.push(round.mainLabel);
  776 | 
  777 |         expect(levelAnimals.has(round.mainLabel)).toBe(false);
  778 |         levelAnimals.add(round.mainLabel);
  779 | 
  780 |         globalFoodCounts.set(
  781 |           round.correctAnswer,
  782 |           (globalFoodCounts.get(round.correctAnswer) ?? 0) + 1,
  783 |         );
  784 | 
  785 |         expect(round.correctAnswer).not.toBe("Miš");
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
> 855 |     await expect(page).toHaveScreenshot("02-mode-select.png", SCREENSHOT_OPTS);
      |     ^ Error: A snapshot doesn't exist at C:\Nepar\e2e\njamko.spec.js-snapshots\02-mode-select-desktop-win32.png, writing actual.
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
  886 |     await expect(page).toHaveScreenshot("06-plus-screen.png", SCREENSHOT_OPTS);
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