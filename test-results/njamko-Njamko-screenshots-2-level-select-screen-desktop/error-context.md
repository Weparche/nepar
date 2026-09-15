# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: njamko.spec.js >> Njamko screenshots >> 2. level select screen
- Location: e2e\njamko.spec.js:858:3

# Error details

```
Error: A snapshot doesn't exist at C:\Nepar\e2e\njamko.spec.js-snapshots\03-level-select-desktop-win32.png, writing actual.
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
      - banner [ref=e6]:
        - heading "Nahrani životinju" [level=1] [ref=e7]: 🍎 Nahrani životinju
        - paragraph [ref=e8]: Odaberi razinu i kreni hraniti životinje.
      - generic [ref=e9]:
        - button "Razina 1 Osnovne životinje 10 rundi Besplatno" [ref=e10] [cursor=pointer]:
          - generic [ref=e11]: "1"
          - generic [ref=e12]:
            - generic [ref=e13]: Razina 1
            - generic [ref=e14]: Osnovne životinje
            - generic [ref=e15]: 10 rundi
          - generic [ref=e16]:
            - generic [ref=e17]: ✅
            - text: Besplatno
        - button "Razina 2 Farma 10 rundi Plus" [ref=e18] [cursor=pointer]:
          - generic [ref=e19]: "2"
          - generic [ref=e20]:
            - generic [ref=e21]: Razina 2
            - generic [ref=e22]: Farma
            - generic [ref=e23]: 10 rundi
          - generic [ref=e24]:
            - generic [ref=e25]: 🔒
            - text: Plus
        - button "Razina 3 Šuma 10 rundi Plus" [ref=e26] [cursor=pointer]:
          - generic [ref=e27]: "3"
          - generic [ref=e28]:
            - generic [ref=e29]: Razina 3
            - generic [ref=e30]: Šuma
            - generic [ref=e31]: 10 rundi
          - generic [ref=e32]:
            - generic [ref=e33]: 🔒
            - text: Plus
        - button "Razina 4 Zoo / Savana 10 rundi Plus" [ref=e34] [cursor=pointer]:
          - generic [ref=e35]: "4"
          - generic [ref=e36]:
            - generic [ref=e37]: Razina 4
            - generic [ref=e38]: Zoo / Savana
            - generic [ref=e39]: 10 rundi
          - generic [ref=e40]:
            - generic [ref=e41]: 🔒
            - text: Plus
        - button "Razina 5 Mali izazov 10 rundi Plus" [ref=e42] [cursor=pointer]:
          - generic [ref=e43]: "5"
          - generic [ref=e44]:
            - generic [ref=e45]: Razina 5
            - generic [ref=e46]: Mali izazov
            - generic [ref=e47]: 10 rundi
          - generic [ref=e48]:
            - generic [ref=e49]: 🔒
            - text: Plus
      - generic [ref=e50]:
        - heading "Njamko Plus" [level=2] [ref=e51]
        - paragraph [ref=e52]: Otključaj dodatne igre, razine i nove runde za još više učenja.
        - paragraph [ref=e53]: 4,99 €
        - button "Saznaj više" [ref=e54] [cursor=pointer]
      - button "Natrag" [ref=e55] [cursor=pointer]
  - dialog "Vi birate analitiku" [ref=e56]:
    - generic [ref=e57]:
      - img [ref=e59]
      - generic [ref=e62]:
        - heading "Vi birate analitiku" [level=2] [ref=e63]
        - paragraph [ref=e64]: Nužne postavke održavaju stranicu funkcionalnom. Uz vaše dopuštenje koristimo GA4 i vlastitu analitiku kako bismo razumjeli koje stranice i upiti stvarno pomažu.
    - generic [ref=e65]:
      - button "Prihvati analitiku" [ref=e66] [cursor=pointer]
      - button "Odbij analitiku" [ref=e67] [cursor=pointer]
      - link "Politika privatnosti" [ref=e68] [cursor=pointer]:
        - /url: /privatnost
```

# Test source

```ts
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
  855 |     await expect(page).toHaveScreenshot("02-mode-select.png", SCREENSHOT_OPTS);
  856 |   });
  857 | 
  858 |   test("2. level select screen", async ({ page }) => {
  859 |     await openFoodLevelSelect(page);
  860 |     await page.waitForTimeout(400);
> 861 |     await expect(page).toHaveScreenshot("03-level-select.png", SCREENSHOT_OPTS);
      |     ^ Error: A snapshot doesn't exist at C:\Nepar\e2e\njamko.spec.js-snapshots\03-level-select-desktop-win32.png, writing actual.
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