import { test, expect } from "@playwright/test";
import { getLevelById } from "../src/njamko/data/njamkoLevels.js";

async function openLevelSelect(page) {
  await page.goto("/njamko");
  await expect(page.getByTestId("njamko-page")).toBeVisible();
  await page.getByTestId("start-button").click();
  await expect(page.getByTestId("level-select")).toBeVisible();
}

async function startLevel(page, levelTestId) {
  await openLevelSelect(page);
  await page.getByTestId(levelTestId).click();
  await expect(page.getByTestId("game-screen")).toBeVisible();
}

async function selectCorrectAnswer(page, round) {
  await page
    .getByRole("button", {
      name: new RegExp(`Odaberi .+ ${round.correctAnswer}`, "i"),
    })
    .click();
}

async function completeLevel(page, levelId) {
  const level = getLevelById(levelId);
  for (let index = 0; index < level.rounds.length; index += 1) {
    const round = level.rounds[index];
    if (round.mode === "sound") {
      await page.getByTestId("sound-button").click();
      await expect(page.getByTestId("sound-text")).toContainText(round.soundText);
    }
    await selectCorrectAnswer(page, round);
    await expect(page.getByTestId("feedback-message")).toContainText("Bravo!");
    if (index < level.rounds.length - 1) {
      await expect(page.getByTestId("feedback-message")).toHaveCount(0, {
        timeout: 3000,
      });
    }
  }
}

test.describe("Njamko platform /njamko", () => {
  test("opens start screen and navigates to level select", async ({ page }) => {
    await page.goto("/njamko");
    await expect(page.getByRole("heading", { name: "Njamko", level: 1 })).toBeVisible();
    await expect(page.getByText("Igraj, uči i otkrivaj životinje!")).toBeVisible();
    await page.getByTestId("start-button").click();
    await expect(page.getByTestId("level-select")).toBeVisible();
    await expect(page.getByTestId("level-food")).toBeVisible();
    await expect(page.getByTestId("level-home")).toBeVisible();
    await expect(page.getByTestId("level-sound")).toBeVisible();
    await expect(page.getByTestId("level-baby")).toBeVisible();
  });

  test("food level handles wrong and correct answers", async ({ page }) => {
    await startLevel(page, "level-food");
    const round = getLevelById("food").rounds[0];
    const wrong = round.options.find((option) => option.name !== round.correctAnswer);

    await expect(page.getByText(round.question)).toBeVisible();
    await page.getByRole("button", { name: new RegExp(`Odaberi hranu ${wrong.name}`, "i") }).click();
    await expect(page.getByTestId("feedback-message")).toContainText("Probaj opet.");

    await page.waitForTimeout(900);
    await selectCorrectAnswer(page, round);
    await expect(page.getByTestId("feedback-message")).toContainText("Bravo!");
  });

  test("home level advances progress after first round", async ({ page }) => {
    await startLevel(page, "level-home");
    const level = getLevelById("home");

    await expect(page.getByText("1 / 4")).toBeVisible();
    await selectCorrectAnswer(page, level.rounds[0]);
    await expect(page.getByTestId("feedback-message")).toContainText("Bravo!");
    await expect(page.getByText("2 / 4")).toBeVisible({ timeout: 3000 });
  });

  test("sound level reveals sound text and accepts correct animal", async ({ page }) => {
    await startLevel(page, "level-sound");
    const round = getLevelById("sound").rounds[0];

    await page.getByTestId("sound-button").click();
    await expect(page.getByTestId("sound-text")).toContainText(round.soundText);
    await selectCorrectAnswer(page, round);
    await expect(page.getByTestId("feedback-message")).toContainText("Bravo!");
  });

  test("baby level completes all rounds and shows finish screen", async ({ page }) => {
    await startLevel(page, "level-baby");
    await completeLevel(page, "baby");
    await expect(page.getByTestId("finish-screen")).toBeVisible({ timeout: 5000 });
    await expect(page.locator(".nj-finish__title")).toHaveText("Završio si igru!");
    await expect(page.getByText("4 zvjezdica")).toBeVisible();
    await expect(page.getByTestId("choose-level-button")).toBeVisible();
  });

  test("390x844 mobile layout stays intact", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openLevelSelect(page);

    const cards = page.getByTestId("level-food");
    await expect(cards).toBeVisible();
    const cardBox = await cards.boundingBox();
    expect(cardBox?.height).toBeGreaterThanOrEqual(120);

    await page.getByTestId("level-food").click();
    await expect(page.getByTestId("main-character")).toBeVisible();
    await expect(page.getByTestId("option-card")).toHaveCount(3);

    const optionBox = await page.getByTestId("option-card").first().boundingBox();
    expect(optionBox?.height).toBeGreaterThanOrEqual(56);
  });

  test("1440x900 desktop layout is centered", async ({ page }) => {
    test.skip(test.info().project.name !== "desktop-1440", "1440p only");

    await page.goto("/njamko");
    await page.getByTestId("start-button").click();

    const container = page.locator(".njamko__container");
    const containerBox = await container.boundingBox();
    const viewport = page.viewportSize();

    expect(containerBox?.width).toBeLessThanOrEqual(720);
    expect(containerBox?.x ?? 0).toBeGreaterThan(300);
    expect((containerBox?.x ?? 0) + (containerBox?.width ?? 0)).toBeLessThan(
      (viewport?.width ?? 1440) - 300,
    );
  });

  test("back button returns to level select", async ({ page }) => {
    await startLevel(page, "level-food");
    await page.getByRole("button", { name: "Natrag na izbor levela" }).click();
    await expect(page.getByTestId("level-select")).toBeVisible();
  });
});

const SCREENSHOT_OPTS = { fullPage: true, maxDiffPixelRatio: 0.03 };

test.describe("Njamko screenshots", () => {
  test("start screen screenshot", async ({ page }) => {
    test.skip(test.info().project.name !== "desktop", "Desktop snapshot");
    await page.goto("/njamko");
    await expect(page.getByTestId("start-button")).toBeVisible();
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("njamko-start-desktop.png", SCREENSHOT_OPTS);
  });

  test("start screen mobile screenshot", async ({ page }) => {
    test.skip(test.info().project.name !== "mobile", "Mobile snapshot");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/njamko");
    await expect(page.getByTestId("start-button")).toBeVisible();
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("njamko-start-mobile.png", SCREENSHOT_OPTS);
  });

  test("level select screenshot", async ({ page }) => {
    test.skip(test.info().project.name !== "desktop", "Desktop snapshot");
    await openLevelSelect(page);
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("njamko-level-select-desktop.png", SCREENSHOT_OPTS);
  });

  test("level select mobile screenshot", async ({ page }) => {
    test.skip(test.info().project.name !== "mobile", "Mobile snapshot");
    await page.setViewportSize({ width: 390, height: 844 });
    await openLevelSelect(page);
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("njamko-level-select-mobile.png", SCREENSHOT_OPTS);
  });

  test("food level screenshot", async ({ page }) => {
    test.skip(test.info().project.name !== "desktop", "Desktop snapshot");
    await startLevel(page, "level-food");
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("njamko-level-food-desktop.png", SCREENSHOT_OPTS);
  });

  test("food level mobile screenshot", async ({ page }) => {
    test.skip(test.info().project.name !== "mobile", "Mobile snapshot");
    await page.setViewportSize({ width: 390, height: 844 });
    await startLevel(page, "level-food");
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("njamko-level-food-mobile.png", SCREENSHOT_OPTS);
  });

  test("home level screenshot", async ({ page }) => {
    test.skip(test.info().project.name !== "desktop", "Desktop snapshot");
    await startLevel(page, "level-home");
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("njamko-level-home-desktop.png", SCREENSHOT_OPTS);
  });

  test("home level mobile screenshot", async ({ page }) => {
    test.skip(test.info().project.name !== "mobile", "Mobile snapshot");
    await page.setViewportSize({ width: 390, height: 844 });
    await startLevel(page, "level-home");
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("njamko-level-home-mobile.png", SCREENSHOT_OPTS);
  });

  test("sound level screenshot", async ({ page }) => {
    test.skip(test.info().project.name !== "desktop", "Desktop snapshot");
    await startLevel(page, "level-sound");
    await page.getByTestId("sound-button").click();
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("njamko-level-sound-desktop.png", SCREENSHOT_OPTS);
  });

  test("sound level mobile screenshot", async ({ page }) => {
    test.skip(test.info().project.name !== "mobile", "Mobile snapshot");
    await page.setViewportSize({ width: 390, height: 844 });
    await startLevel(page, "level-sound");
    await page.getByTestId("sound-button").click();
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("njamko-level-sound-mobile.png", SCREENSHOT_OPTS);
  });

  test("baby level screenshot", async ({ page }) => {
    test.skip(test.info().project.name !== "desktop", "Desktop snapshot");
    await startLevel(page, "level-baby");
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("njamko-level-baby-desktop.png", SCREENSHOT_OPTS);
  });

  test("baby level mobile screenshot", async ({ page }) => {
    test.skip(test.info().project.name !== "mobile", "Mobile snapshot");
    await page.setViewportSize({ width: 390, height: 844 });
    await startLevel(page, "level-baby");
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("njamko-level-baby-mobile.png", SCREENSHOT_OPTS);
  });

  test("finish screen screenshot", async ({ page }) => {
    test.skip(test.info().project.name !== "desktop", "Desktop snapshot");
    await startLevel(page, "level-baby");
    await completeLevel(page, "baby");
    await expect(page.getByTestId("finish-screen")).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("njamko-finish-desktop.png", SCREENSHOT_OPTS);
  });

  test("finish screen mobile screenshot", async ({ page }) => {
    test.skip(test.info().project.name !== "mobile", "Mobile snapshot");
    await page.setViewportSize({ width: 390, height: 844 });
    await startLevel(page, "level-baby");
    await completeLevel(page, "baby");
    await expect(page.getByTestId("finish-screen")).toBeVisible({ timeout: 5000 });
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("njamko-finish-mobile.png", SCREENSHOT_OPTS);
  });
});
