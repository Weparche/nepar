import { test, expect } from "@playwright/test";
import {
  DEFAULT_PUZZLE_ID,
  getMockupItems,
  getPuzzleById,
} from "../src/mozgalica/puzzle.js";

const TEST_PUZZLE_ID = DEFAULT_PUZZLE_ID;
const TEST_PUZZLE = getPuzzleById(TEST_PUZZLE_ID);

async function startGame(page, puzzleId = TEST_PUZZLE_ID) {
  await page.goto("/mozgalica");
  await page.evaluate((items) => {
    sessionStorage.setItem("mozgalica-test-order", JSON.stringify(items));
  }, getMockupItems(puzzleId));
  await page.getByTestId(`puzzle-card-${puzzleId}`).click();
  await expect(page.getByTestId("game-board")).toBeVisible();
}

async function selectGroup(page, items) {
  for (const item of items) {
    await page.getByTestId(`game-card-${item}`).click();
  }
  await page.getByTestId("check-selection").click();
}

async function solveAllGroups(page) {
  for (const group of TEST_PUZZLE.groups) {
    await selectGroup(page, group.items);
    await expect(page.getByText(group.name)).toBeVisible({ timeout: 5000 });
  }
}

async function prepareScreenshotPage(page) {
  await page.route("https://fonts.googleapis.com/**", (route) => route.abort());
  await page.route("https://fonts.gstatic.com/**", (route) => route.abort());
  await page.addInitScript(() => {
    const fixedNow = new Date("2026-01-01T12:00:00Z").getTime();
    Date.now = () => fixedNow;
  });
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

  test("landing shows puzzle picker with all themes", async ({ page }) => {
    await page.goto("/mozgalica");
    await expect(page.getByTestId("puzzle-picker")).toBeVisible();
    const puzzleCardIds = await page.locator(".mz-puzzle-card").evaluateAll((cards) =>
      cards.map((card) => card.getAttribute("data-testid")),
    );
    expect(puzzleCardIds.slice(0, 5)).toEqual([
      "puzzle-card-digital-2010s",
      "puzzle-card-music-2010s",
      "puzzle-card-film-2010s",
      "puzzle-card-world-2010s",
      "puzzle-card-croatia-2010s",
    ]);
    await expect(page.getByTestId("puzzle-card-digital-2010s")).toBeVisible();
    await expect(page.getByTestId("puzzle-card-gaming-2k")).toBeVisible();
    await expect(page.getByTestId("puzzle-card-nogomet-hr-2000s")).toBeVisible();
    await expect(page.getByTestId("puzzle-card-muzika-2000s")).toBeVisible();
    await expect(page.getByTestId("puzzle-card-nba-2000s")).toBeVisible();
    await expect(page.getByTestId("puzzle-card-hr-filmovi-2000s")).toBeVisible();
    await expect(page.getByTestId("puzzle-card-gaming-90s")).toBeVisible();
    await expect(page.getByTestId("puzzle-card-nogomet-hr-90s")).toBeVisible();
    await expect(page.getByTestId("puzzle-card-muzika-90s")).toBeVisible();
    await expect(page.getByTestId("puzzle-card-nba-90s")).toBeVisible();
    await expect(page.getByTestId("puzzle-card-hr-nostalgija")).toBeVisible();
  });

  test("start game shows 16 cards", async ({ page }) => {
    await startGame(page);
    await expect(page.getByTestId("game-grid").locator(".mz-card")).toHaveCount(16);
  });

  test("can select 4 cards", async ({ page }) => {
    await startGame(page);
    const group = TEST_PUZZLE.groups[0].items;
    for (const item of group) {
      await page.getByTestId(`game-card-${item}`).click();
    }
    await expect(page.getByTestId("check-selection")).toBeEnabled();
  });

  test("correct group is locked", async ({ page }) => {
    await startGame(page);
    await selectGroup(page, TEST_PUZZLE.groups[0].items);
    await expect(page.getByTestId("game-message")).toContainText(
      "Točno! Pronašao si grupu.",
    );
    await expect(page.getByTestId("solved-group")).toBeVisible();
    await expect(page.getByTestId("stat-groups")).toContainText("1/4");
  });

  test("wrong group shows error message", async ({ page }) => {
    await startGame(page);
    const wrongItems = [
      TEST_PUZZLE.groups[0].items[0],
      TEST_PUZZLE.groups[1].items[0],
      TEST_PUZZLE.groups[2].items[0],
      TEST_PUZZLE.groups[3].items[0],
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

  test("landing challenge demo opens invite screen with link", async ({ page }) => {
    await page.goto("/mozgalica");
    await page.getByTestId("landing-challenge-demo").click();
    await expect(page.getByTestId("challenge-invite")).toBeVisible();
    await expect(page.getByTestId("challenge-link")).toHaveValue(/\/mozgalica\?od=/);
    await expect(page.getByText("Izazovi prijatelja")).toBeVisible();
  });

  test("challenge friends after win shows shareable link", async ({ page }) => {
    await startGame(page);
    await solveAllGroups(page);
    await expect(page.getByTestId("result-panel")).toBeVisible({ timeout: 5000 });
    await page.getByTestId("challenge-friends").click();
    await expect(page.getByTestId("challenge-invite")).toBeVisible();
    await expect(page.getByTestId("challenge-link")).toHaveValue(/\/mozgalica\?od=/);
    await expect(page.getByTestId("challenge-link")).toHaveValue(/tema=/);

    const shareText = await page.getByTestId("challenge-share-text-hidden").inputValue();
    const linkMatches = shareText.match(/\/mozgalica\?od=[^\s]+/g) ?? [];
    expect(linkMatches).toHaveLength(1);
  });

  test("incoming challenge link opens accept screen and compares after play", async ({
    page,
  }) => {
    await page.goto(
      `/mozgalica?od=Ivan&p=7&t=151&tema=${TEST_PUZZLE_ID}`,
    );
    await expect(page.getByTestId("challenge-accept")).toBeVisible();
    await expect(page.getByText("Ivan te izaziva!")).toBeVisible();
    await expect(page.getByText(TEST_PUZZLE.title)).toBeVisible();

    await page.evaluate((items) => {
      sessionStorage.setItem("mozgalica-test-order", JSON.stringify(items));
    }, getMockupItems(TEST_PUZZLE_ID));
    await page.getByTestId("accept-challenge").click();
    await expect(page.getByTestId("game-board")).toBeVisible();
    await solveAllGroups(page);

    await expect(page.getByTestId("challenge-result")).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId("challenge-winner")).toBeVisible();
    await expect(page.getByTestId("notify-challenger")).toBeVisible();
    await expect(page.getByTestId("challenge-notify-hint")).toBeVisible();
  });

  test("result link shows comparison for challenger without playing", async ({
    page,
  }) => {
    await page.goto(
      `/mozgalica?od=Wepar&p=1&t=42&tema=${TEST_PUZZLE_ID}&rn=Marko&rp=3&rt=78`,
    );
    await expect(page.getByTestId("challenge-result")).toBeVisible();
    await expect(page.getByText("Marko je odigrao izazov")).toBeVisible();
    await expect(page.getByTestId("challenge-winner")).toBeVisible();
    await expect(page.getByTestId("notify-challenger")).toHaveCount(0);
    await expect(page.getByTestId("challenge-done")).toBeVisible();
  });

  test("nav Izazovi prijatelja scrolls to challenge section", async ({ page, isMobile }) => {
    await page.goto("/mozgalica");
    if (isMobile) {
      await page.getByRole("button", { name: "Otvori izbornik" }).click();
      await page.locator(".mz-mobile-nav").getByRole("button", { name: "Izazovi prijatelja" }).click();
    } else {
      await page.locator(".mz-nav").getByRole("button", { name: "Izazovi prijatelja" }).click();
    }
    await expect(page.getByTestId("landing-challenge-demo")).toBeVisible();
  });

  test("start-game scrolls to puzzle picker", async ({ page }) => {
    await page.goto("/mozgalica");
    await page.getByTestId("start-game").click();
    await expect(page.getByTestId("puzzle-picker")).toBeInViewport();
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

  test("1440p desktop layout uses wide content and readable game grid", async ({
    page,
  }) => {
    test.skip(test.info().project.name !== "desktop-1440", "1440p only");
    await page.goto("/mozgalica");

    const hero = await page.getByTestId("landing-hero").boundingBox();
    expect(hero?.width).toBeGreaterThan(1100);

    await startGame(page);
    const grid = await page.getByTestId("game-grid").boundingBox();
    expect(grid?.width).toBeGreaterThan(520);
    expect(grid?.width).toBeLessThan(720);

    const card = await page.getByTestId("game-grid").locator(".mz-card").first().boundingBox();
    expect(card?.height).toBeGreaterThanOrEqual(84);
  });
});

test.describe("Dnevne Asocijacije screenshots", () => {
  test.beforeEach(async ({ page }) => {
    await prepareScreenshotPage(page);
  });

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

  test("challenge invite screenshot", async ({ page, isMobile }) => {
    await startGame(page);
    await solveAllGroups(page);
    await expect(page.getByTestId("result-panel")).toBeVisible({ timeout: 5000 });
    await page.getByTestId("challenge-friends").click();
    await expect(page.getByTestId("challenge-invite")).toBeVisible();
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot(
      isMobile ? "challenge-invite-mobile.png" : "challenge-invite-desktop.png",
      { fullPage: true },
    );
  });

  test("landing 1440p screenshot", async ({ page }) => {
    test.skip(test.info().project.name !== "desktop-1440", "1440p only");
    await page.goto("/mozgalica");
    await expect(page.getByTestId("hero-title")).toBeVisible();
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("landing-1440.png", { fullPage: true });
  });

  test("game 1440p screenshot", async ({ page }) => {
    test.skip(test.info().project.name !== "desktop-1440", "1440p only");
    await startGame(page);
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("game-1440.png", { fullPage: true });
  });

  test("result 1440p screenshot", async ({ page }) => {
    test.skip(test.info().project.name !== "desktop-1440", "1440p only");
    await startGame(page);
    await solveAllGroups(page);
    await expect(page.getByTestId("result-panel")).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(500);
    await expect(page).toHaveScreenshot("result-1440.png", { fullPage: true });
  });
});
