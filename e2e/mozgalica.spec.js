import { test, expect } from "@playwright/test";
import { PUZZLE_GROUPS, MOCKUP_ITEMS } from "../src/mozgalica/puzzle.js";

async function startGame(page) {
  await page.goto("/mozgalica");
  await page.evaluate((items) => {
    sessionStorage.setItem("mozgalica-test-order", JSON.stringify(items));
  }, MOCKUP_ITEMS);
  await page.getByTestId("start-game").click();
  await expect(page.getByTestId("game-board")).toBeVisible();
}

async function selectGroup(page, items) {
  for (const item of items) {
    await page.getByTestId(`game-card-${item}`).click();
  }
  await page.getByTestId("check-selection").click();
}

async function solveAllGroups(page) {
  for (const group of PUZZLE_GROUPS) {
    await selectGroup(page, group.items);
    await expect(page.getByText(group.name)).toBeVisible({ timeout: 5000 });
  }
}

test.describe("Dnevne Asocijacije /mozgalica", () => {
  test("landing page loads with hero title", async ({ page }) => {
    await page.goto("/mozgalica");
    await expect(page.getByTestId("mozgalica-page")).toBeVisible();
    await expect(page.getByTestId("hero-title")).toBeVisible();
    await expect(page.getByTestId("hero-title")).toContainText(
      "Poveži 16 pojmova u 4 skrivene grupe.",
    );
  });

  test("start game shows 16 cards", async ({ page }) => {
    await startGame(page);
    await expect(page.getByTestId("game-grid").locator(".mz-card")).toHaveCount(16);
  });

  test("can select 4 cards", async ({ page }) => {
    await startGame(page);
    const group = PUZZLE_GROUPS[0].items;
    for (const item of group) {
      await page.getByTestId(`game-card-${item}`).click();
    }
    await expect(page.getByTestId("check-selection")).toBeEnabled();
  });

  test("correct group is locked", async ({ page }) => {
    await startGame(page);
    await selectGroup(page, PUZZLE_GROUPS[0].items);
    await expect(page.getByTestId("game-message")).toContainText(
      "Točno! Pronašao si grupu.",
    );
    await expect(page.getByTestId("solved-group")).toBeVisible();
    await expect(page.getByTestId("stat-groups")).toContainText("1/4");
  });

  test("wrong group shows error message", async ({ page }) => {
    await startGame(page);
    const wrongItems = [
      PUZZLE_GROUPS[0].items[0],
      PUZZLE_GROUPS[1].items[0],
      PUZZLE_GROUPS[2].items[0],
      PUZZLE_GROUPS[3].items[0],
    ];
    await selectGroup(page, wrongItems);
    await expect(page.getByTestId("game-message")).toContainText(
      "Nije točno, pokušaj ponovno.",
    );
    await expect(page.getByTestId("stat-attempts")).toContainText("1");
  });

  test("completing all groups shows result", async ({ page }) => {
    await startGame(page);
    await solveAllGroups(page);
    await expect(page.getByTestId("result-panel")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Bravo!")).toBeVisible();
    await expect(page.getByTestId("result-groups")).toContainText("4/4");
  });

  test("mobile viewport layout is intact", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile-only layout check");
    await page.goto("/mozgalica");
    await expect(page.getByTestId("landing-header")).toBeVisible();
    await expect(page.getByTestId("hero-title")).toBeVisible();
    await startGame(page);
    const box = await page.getByTestId("game-grid").boundingBox();
    expect(box?.width).toBeGreaterThan(0);
    await expect(page.getByTestId("check-selection")).toBeVisible();
  });
});

test.describe("Dnevne Asocijacije screenshots", () => {
  test("landing desktop screenshot", async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop-only screenshot");
    await page.goto("/mozgalica");
    await expect(page.getByTestId("hero-title")).toBeVisible();
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("landing-desktop.png", {
      fullPage: true,
    });
  });

  test("landing mobile screenshot", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile-only screenshot");
    await page.goto("/mozgalica");
    await expect(page.getByTestId("hero-title")).toBeVisible();
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("landing-mobile.png", {
      fullPage: true,
    });
  });

  test("game mobile screenshot", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile-only screenshot");
    await startGame(page);
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("game-mobile.png", {
      fullPage: true,
    });
  });

  test("result screenshot", async ({ page, isMobile }) => {
    await startGame(page);
    await solveAllGroups(page);
    await expect(page.getByTestId("result-panel")).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot(
      isMobile ? "result-mobile.png" : "result-desktop.png",
      { fullPage: true },
    );
  });

  test("challenge result screenshot", async ({ page, isMobile }) => {
    await startGame(page);
    await solveAllGroups(page);
    await expect(page.getByTestId("result-panel")).toBeVisible({ timeout: 5000 });
    await page.getByTestId("challenge-friends").click();
    await expect(page.getByTestId("challenge-result")).toBeVisible();
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot(
      isMobile ? "challenge-result-mobile.png" : "challenge-result-desktop.png",
      { fullPage: true },
    );
  });
});
