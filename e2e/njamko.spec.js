import { test, expect } from "@playwright/test";
import { getLevelById, NJAMKO_LEVELS } from "../src/njamko/data/njamkoLevels.js";

async function assertNoHorizontalScroll(page) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
}

async function assertNoPageScroll(page) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    scrollHeight: document.documentElement.scrollHeight,
    clientHeight: document.documentElement.clientHeight,
  }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
  expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.clientHeight + 1);
}

async function assertInViewport(page, locator) {
  const box = await locator.boundingBox();
  const viewport = page.viewportSize();
  expect(box).not.toBeNull();
  expect(box.y).toBeGreaterThanOrEqual(-1);
  expect(box.y + box.height).toBeLessThanOrEqual((viewport?.height ?? 0) + 1);
}

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
        timeout: 5000,
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

  test("each level has 10 rounds", () => {
    for (const level of NJAMKO_LEVELS) {
      expect(level.rounds).toHaveLength(10);
      for (const round of level.rounds) {
        expect(round.options).toHaveLength(3);
        expect(round.options.filter((option) => option.name === round.correctAnswer)).toHaveLength(1);
      }
    }
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
    const total = level.rounds.length;

    await expect(page.getByText(`1 / ${total}`)).toBeVisible();
    await selectCorrectAnswer(page, level.rounds[0]);
    await expect(page.getByTestId("feedback-message")).toContainText("Bravo!");
    await expect(page.getByText(`2 / ${total}`)).toBeVisible({ timeout: 5000 });
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
    test.setTimeout(120_000);

    await startLevel(page, "level-baby");
    const level = getLevelById("baby");
    await completeLevel(page, "baby");
    await expect(page.getByTestId("finish-screen")).toBeVisible({ timeout: 10_000 });
    await assertNoPageScroll(page);
    await assertInViewport(page, page.getByTestId("replay-button"));
    await expect(page.locator(".nj-finish__title")).toHaveText("Završio si igru!");
    await expect(page.getByText(`${level.rounds.length} zvjezdica`)).toBeVisible();
    await expect(page.getByTestId("choose-level-button")).toBeVisible();
  });

  test("390x844 mobile layout stays intact", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/njamko");
    await assertNoPageScroll(page);

    const startButton = page.getByTestId("start-button");
    const startBox = await startButton.boundingBox();
    expect(startBox?.height).toBeGreaterThanOrEqual(56);
    await assertInViewport(page, startButton);

    await startButton.click();
    await expect(page.getByTestId("level-select")).toBeVisible();
    await assertNoPageScroll(page);

    for (const levelId of ["level-food", "level-home", "level-sound", "level-baby"]) {
      const card = page.getByTestId(levelId);
      await expect(card).toBeVisible();
      await assertInViewport(page, card);
    }

    const cards = page.getByTestId("level-food");
    const cardBox = await cards.boundingBox();
    expect(cardBox?.height).toBeGreaterThanOrEqual(56);

    await page.getByTestId("level-food").click();
    await expect(page.getByTestId("main-character")).toBeVisible();
    await expect(page.getByTestId("option-card")).toHaveCount(3);
    await assertNoPageScroll(page);
    await assertInViewport(page, page.getByTestId("option-card").first());

    const optionBox = await page.getByTestId("option-card").first().boundingBox();
    expect(optionBox?.height).toBeGreaterThanOrEqual(56);

    await expect(page.getByRole("button", { name: /Zvuk/i })).toBeVisible();
  });

  test("390x844 fits every screen without page scroll", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto("/njamko");
    await assertNoPageScroll(page);

    await page.getByTestId("start-button").click();
    await assertNoPageScroll(page);

    const levelIds = ["level-food", "level-home", "level-sound", "level-baby"];
    for (const levelId of levelIds) {
      await page.getByTestId(levelId).click();
      await expect(page.getByTestId("game-screen")).toBeVisible();
      await assertNoPageScroll(page);

      if (levelId === "level-sound") {
        await page.getByTestId("sound-button").click();
        await expect(page.getByTestId("sound-text")).toBeVisible();
        await assertNoPageScroll(page);
      }

      await page.getByRole("button", { name: "Natrag na izbor levela" }).click();
      await expect(page.getByTestId("level-select")).toBeVisible();
      await assertNoPageScroll(page);
    }
  });

  test("768x1024 tablet layout is centered and airy", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await openLevelSelect(page);
    await assertNoHorizontalScroll(page);

    const levelSelect = page.locator(".nj-level-select");
    const levelBox = await levelSelect.boundingBox();
    const viewport = page.viewportSize();
    expect(levelBox?.width ?? 0).toBeLessThanOrEqual(640);
    const levelCenter = (levelBox?.x ?? 0) + (levelBox?.width ?? 0) / 2;
    expect(levelCenter).toBeGreaterThan((viewport?.width ?? 768) * 0.35);
    expect(levelCenter).toBeLessThan((viewport?.width ?? 768) * 0.65);

    await page.getByTestId("level-food").click();
    await expect(page.getByTestId("game-screen")).toBeVisible();
    await assertNoHorizontalScroll(page);

    const panel = page.locator(".nj-game__panel");
    const panelBox = await panel.boundingBox();
    expect(panelBox?.width ?? 0).toBeLessThanOrEqual(680);
    const panelCenter = (panelBox?.x ?? 0) + (panelBox?.width ?? 0) / 2;
    expect(panelCenter).toBeGreaterThan((viewport?.width ?? 768) * 0.35);
    expect(panelCenter).toBeLessThan((viewport?.width ?? 768) * 0.65);
  });

  test("wrong answer allows another tap before feedback clears", async ({ page }) => {
    await startLevel(page, "level-food");
    const round = getLevelById("food").rounds[0];
    const wrong = round.options.find((option) => option.name !== round.correctAnswer);

    await page.getByRole("button", { name: new RegExp(`Odaberi hranu ${wrong.name}`, "i") }).click();
    await expect(page.getByTestId("feedback-message")).toContainText("Probaj opet.");

    await selectCorrectAnswer(page, round);
    await expect(page.getByTestId("feedback-message")).toContainText("Bravo!");
  });

  test("correct answer blocks taps during success animation", async ({ page }) => {
    await startLevel(page, "level-food");
    const round = getLevelById("food").rounds[0];

    await selectCorrectAnswer(page, round);
    await expect(page.getByTestId("feedback-message")).toContainText("Bravo!");

    const other = round.options.find((option) => option.name !== round.correctAnswer);
    await expect(
      page.getByRole("button", { name: new RegExp(`Odaberi hranu ${other.name}`, "i") }),
    ).toBeDisabled();
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

    await page.getByTestId("level-food").click();
    const panel = page.locator(".nj-game__panel");
    const panelBox = await panel.boundingBox();
    expect(panelBox?.width ?? 0).toBeLessThanOrEqual(680);
    const panelCenter = (panelBox?.x ?? 0) + (panelBox?.width ?? 0) / 2;
    expect(panelCenter).toBeGreaterThan((viewport?.width ?? 1440) * 0.4);
    expect(panelCenter).toBeLessThan((viewport?.width ?? 1440) * 0.6);
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
    test.setTimeout(120_000);

    await startLevel(page, "level-baby");
    await completeLevel(page, "baby");
    await expect(page.getByTestId("finish-screen")).toBeVisible({ timeout: 10_000 });
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("njamko-finish-desktop.png", SCREENSHOT_OPTS);
  });

  test("finish screen mobile screenshot", async ({ page }) => {
    test.skip(test.info().project.name !== "mobile", "Mobile snapshot");
    test.setTimeout(120_000);

    await page.setViewportSize({ width: 390, height: 844 });
    await startLevel(page, "level-baby");
    await completeLevel(page, "baby");
    await expect(page.getByTestId("finish-screen")).toBeVisible({ timeout: 10_000 });
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("njamko-finish-mobile.png", SCREENSHOT_OPTS);
  });
});
