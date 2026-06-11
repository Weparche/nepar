import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  campaignSteps,
  CAMPAIGN_MODE_ORDER,
  campaignLevelOneStops,
} from "../src/njamko/campaign.js";
import {
  countTotalRounds,
  getLevel,
  getMode,
  njamkoModes,
} from "../src/njamko/data/njamkoLevels.js";

async function assertNoHorizontalScroll(page) {
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1);
}

async function openModeSelect(page) {
  await page.goto("/njamko");
  await expect(page.getByTestId("mode-select")).toBeVisible();
}

async function openFoodLevelSelect(page) {
  await openModeSelect(page);
  await page.getByTestId("mode-food").click();
  await expect(page.getByTestId("level-select")).toBeVisible();
}

async function openHomeLevelSelect(page) {
  await openModeSelect(page);
  await page.getByTestId("mode-home").click();
  await expect(page.getByTestId("level-select")).toBeVisible();
}

async function openSoundLevelSelect(page) {
  await openModeSelect(page);
  await page.getByTestId("mode-sound").click();
  await expect(page.getByTestId("level-select")).toBeVisible();
}

async function openBabyLevelSelect(page) {
  await openModeSelect(page);
  await page.getByTestId("mode-baby").click();
  await expect(page.getByTestId("level-select")).toBeVisible();
}

async function openCountingLevelSelect(page) {
  await openModeSelect(page);
  await page.getByTestId("mode-counting").click();
  await expect(page.getByTestId("level-select")).toBeVisible();
}

async function selectCorrectAnswer(page, round) {
  await page.locator(`[data-answer="${round.correctAnswer}"]`).click();
}

async function completeLevel(page, modeId, levelId) {
  const level = getLevel(modeId, levelId);
  for (let index = 0; index < level.rounds.length; index += 1) {
    const round = level.rounds[index];
    if (round.mode === "sound") {
      await expect(page.getByTestId("sound-text")).toBeVisible();
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

async function completeCountingLevel(page, levelId) {
  const level = getLevel("counting", levelId);
  for (let taskIndex = 0; taskIndex < level.tasks.length; taskIndex += 1) {
    const task = level.tasks[taskIndex];
    if (task.type === "find-number") {
      for (const number of task.sequence) {
        await page.getByTestId(`counting-shell-${number}`).click();
      }
    } else if (["collect-count", "collect-quantity", "decorate-result"].includes(task.type)) {
      for (let index = 1; index <= task.targetNumber; index += 1) {
        await page.getByTestId(`counting-collect-item-${index}`).click();
      }
    } else if (["number-path", "place-on-path", "complete-path", "build-order"].includes(task.type)) {
      for (const number of task.sequence) {
        await page.getByTestId(`counting-path-${number}`).click();
      }
    } else if (task.type === "count-visible") {
      await page.getByTestId(`counting-choice-${task.visibleCount}`).click();
    } else if (task.type === "missing-number") {
      await page.getByTestId(`counting-choice-${task.answer}`).click();
    }

    if (taskIndex < level.tasks.length - 1) {
      await expect(page.getByTestId("game-progress")).toHaveText(`${taskIndex + 2}/3`, { timeout: 5000 });
    }
  }
  await expect(page.getByTestId("counting-mini-sandbox")).toBeVisible({ timeout: 5000 });
  await page.getByTestId("counting-sandbox-item-1").click();
  await page.getByTestId("counting-sandbox-finish").click();
}

async function launchCampaignStop(page, stopTestId) {
  await page.getByTestId(stopTestId).click();
  await expect(page.getByTestId("campaign-game-popup")).toBeVisible();
  const popupIsContained = await page.evaluate(() => {
    const popup = document.querySelector("[data-testid='campaign-game-popup']").getBoundingClientRect();
    const stage = document.querySelector(".nj-campaign-map__stage").getBoundingClientRect();
    return popup.left >= stage.left && popup.right <= stage.right;
  });
  expect(popupIsContained).toBe(true);
  const popupOverlapsCar = await page.evaluate(() => {
    const popup = document.querySelector("[data-testid='campaign-game-popup']").getBoundingClientRect();
    const car = document.querySelector("[data-testid='campaign-car']").getBoundingClientRect();
    return !(
      popup.right < car.left ||
      popup.left > car.right ||
      popup.bottom < car.top ||
      popup.top > car.bottom
    );
  });
  expect(popupOverlapsCar).toBe(false);
  const popupOverlapsActions = await page.evaluate(() => {
    const popup = document.querySelector("[data-testid='campaign-game-popup']").getBoundingClientRect();
    const actions = document
      .querySelector(".nj-campaign-map__actions")
      .getBoundingClientRect();
    return !(
      popup.right < actions.left ||
      popup.left > actions.right ||
      popup.bottom < actions.top ||
      popup.top > actions.bottom
    );
  });
  expect(popupOverlapsActions).toBe(false);
  await page.getByTestId("campaign-launch-step-button").click();
  await expect(page.getByTestId("game-screen")).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/njamko");
  await page.evaluate(() => {
    localStorage.removeItem("njamkoPlusUnlocked");
    localStorage.removeItem("njamkoCampaignCompletedStep");
  });
});

test.describe("Njamko platform", () => {
  test("1. otvara se izravno na odabir igre", async ({ page }) => {
    await page.goto("/njamko");
    await expect(page.getByTestId("njamko-page")).toBeVisible();
    await expect(page.getByTestId("mode-select")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Odaberi igru", level: 1 })).toBeVisible();
    await expect(page.getByTestId("start-button")).toHaveCount(0);
  });

  test("1b. natrag na home vodi na landing", async ({ page }) => {
    await openModeSelect(page);
    await page.getByTestId("mode-select-back-home").click();
    await expect(page.getByTestId("landing-page")).toBeVisible();
  });

  test("2. mode select radi", async ({ page }) => {
    await openModeSelect(page);
    await expect(page.getByTestId("campaign-button")).toBeVisible();
    await expect(page.getByTestId("mode-food")).toBeVisible();
    await expect(page.getByTestId("mode-home")).toBeVisible();
    await expect(page.getByTestId("mode-sound")).toBeVisible();
    await expect(page.getByTestId("mode-baby")).toBeVisible();
    await expect(page.getByTestId("mode-counting")).toBeVisible();
    await page.getByTestId("mode-food").click();
    await expect(page.getByTestId("level-select")).toBeVisible();
  });

  test("2a. counting mode ima dvije free i tri Plus misije", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openCountingLevelSelect(page);
    await expect(page.getByText("Broji s Njamkom")).toBeVisible();
    await expect(page.getByTestId("level-card-1")).toContainText("Besplatno");
    await expect(page.getByTestId("level-card-2")).toContainText("Besplatno");
    await expect(page.getByTestId("level-card-3")).toContainText("Plus");
    await expect(page.getByTestId("level-card-5")).toContainText("Plus");
    await page.getByTestId("level-card-2").click();
    await expect(page.getByTestId("counting-game-screen")).toBeVisible();
    await expect(page.getByTestId("counting-expected-number")).toContainText("4");
    await page.getByLabel("Natrag na izbor razine").click();
    await page.getByTestId("level-card-3").click();
    await expect(page.getByTestId("parental-gate")).toBeVisible();
    await assertNoHorizontalScroll(page);
  });

  test("2b. campaignSteps imaju ispravan redoslijed i postojece levele", () => {
    expect(campaignSteps).toHaveLength(20);
    for (let index = 0; index < campaignSteps.length; index += 1) {
      const step = campaignSteps[index];
      const levelId = Math.floor(index / CAMPAIGN_MODE_ORDER.length) + 1;
      const modeId = CAMPAIGN_MODE_ORDER[index % CAMPAIGN_MODE_ORDER.length];
      expect(step).toEqual({
        modeId,
        levelId,
        stepNumber: index + 1,
        totalSteps: 20,
      });
      expect(getLevel(step.modeId, step.levelId)).toBeTruthy();
    }

    expect(campaignLevelOneStops).toHaveLength(4);
    for (let index = 0; index < campaignLevelOneStops.length; index += 1) {
      const stop = campaignLevelOneStops[index];
      expect(stop.stepIndex).toBe(index);
      expect(stop.modeId).toBe(CAMPAIGN_MODE_ORDER[index]);
      expect(stop.levelId).toBe(1);
      expect(getLevel(stop.modeId, stop.levelId)).toBeTruthy();
    }
  });

  test("2c. kampanja starta, sprema progress i nastavlja na sljedeću etapu", async ({ page }) => {
    test.setTimeout(150_000);
    await page.setViewportSize({ width: 390, height: 844 });
    await openModeSelect(page);
    await page.getByTestId("campaign-button").click();
    await expect(page.getByTestId("campaign-map-screen")).toBeVisible();
    await expect(page.getByTestId("game-screen")).toHaveCount(0);
    const carIsVisible = await page.evaluate(() => {
      const car = document.querySelector("[data-testid='campaign-car']").getBoundingClientRect();
      const stage = document.querySelector(".nj-campaign-map__stage").getBoundingClientRect();
      return car.left >= stage.left && car.right <= stage.right && car.top >= stage.top && car.bottom <= stage.bottom;
    });
    expect(carIsVisible).toBe(true);
    await expect(page.getByTestId("campaign-stop-food")).toHaveClass(/nj-campaign-stop--active/);
    await expect(page.getByTestId("campaign-replay-step-button")).toBeDisabled();
    await launchCampaignStop(page, "campaign-stop-food");
    await expect(page.getByTestId("game-screen")).toBeVisible();
    await expect(page.getByText("Nahrani životinju")).toBeVisible();
    await completeLevel(page, "food", 1);

    await expect(page.getByTestId("campaign-map-screen")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId("campaign-stop-food")).toHaveClass(/nj-campaign-stop--completed/);
    await expect(page.getByTestId("campaign-stop-home")).toHaveClass(/nj-campaign-stop--active/);
    await assertNoHorizontalScroll(page);
    const completedStep = await page.evaluate(() =>
      localStorage.getItem("njamkoCampaignCompletedStep"),
    );
    expect(completedStep).toBe("0");

    const overlap = await page.evaluate(() => {
      const car = document.querySelector(".nj-campaign-car").getBoundingClientRect();
      const actions = document
        .querySelector(".nj-campaign-map__actions")
        .getBoundingClientRect();
      return !(
        car.right < actions.left ||
        car.left > actions.right ||
        car.bottom < actions.top ||
        car.top > actions.bottom
      );
    });
    expect(overlap).toBe(false);

    await launchCampaignStop(page, "campaign-stop-home");
    await expect(page.getByTestId("game-screen")).toBeVisible();
    await expect(page.getByText("Pronađi dom")).toBeVisible();
  });

  test("2d. kampanja nakon refresha nastavlja na prvi nezavršeni step", async ({ page }) => {
    test.setTimeout(120_000);
    await openModeSelect(page);
    await page.getByTestId("campaign-button").click();
    await launchCampaignStop(page, "campaign-stop-food");
    await completeLevel(page, "food", 1);
    await expect(page.getByTestId("campaign-map-screen")).toBeVisible({ timeout: 10_000 });

    await page.reload();
    await expect(page.getByTestId("mode-select")).toBeVisible();
    await page.getByTestId("campaign-button").click();
    await expect(page.getByTestId("campaign-map-screen")).toBeVisible();
    await expect(page.getByTestId("campaign-stop-home")).toHaveClass(/nj-campaign-stop--active/);
  });

  test("2e. kampanja trazi Plus na food level 2 i nastavlja isti step nakon unlocka", async ({ page }) => {
    test.setTimeout(240_000);
    await openModeSelect(page);
    await page.getByTestId("campaign-button").click();

    await launchCampaignStop(page, "campaign-stop-food");
    await completeLevel(page, "food", 1);
    await expect(page.getByTestId("campaign-map-screen")).toBeVisible({ timeout: 10_000 });
    await launchCampaignStop(page, "campaign-stop-home");
    await completeLevel(page, "home", 1);
    await expect(page.getByTestId("campaign-map-screen")).toBeVisible({ timeout: 10_000 });
    await launchCampaignStop(page, "campaign-stop-sound");
    await completeLevel(page, "sound", 1);
    await expect(page.getByTestId("campaign-map-screen")).toBeVisible({ timeout: 10_000 });
    await launchCampaignStop(page, "campaign-stop-baby");
    await completeLevel(page, "baby", 1);
    await expect(page.getByTestId("campaign-map-screen")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("Razina 2 kampanje")).toBeVisible();
    await expect(page.getByTestId("campaign-stop-food")).toHaveClass(/nj-campaign-stop--active/);

    await page.getByTestId("campaign-stop-food").click();
    await expect(page.getByTestId("campaign-game-popup")).toBeVisible();
    await page.getByTestId("campaign-launch-step-button").click();
    await expect(page.getByTestId("parental-gate")).toBeVisible();
    await page.getByTestId("parental-answer-input").fill("12");
    await page.getByTestId("parental-submit-button").click();
    await expect(page.getByTestId("plus-screen")).toBeVisible();
    await page.getByTestId("plus-unlock-button").click();

    await expect(page.getByTestId("game-screen")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Nahrani životinju")).toBeVisible();
    await expect(page.getByTestId("round-prompt")).toHaveText(getLevel("food", 2).rounds[0].prompt);
  });

  test("2e2. kampanja prikazuje beacone za razine 2 do 5", async ({ page }) => {
    for (const { completedStep, level } of [
      { completedStep: 3, level: 2 },
      { completedStep: 7, level: 3 },
      { completedStep: 11, level: 4 },
      { completedStep: 15, level: 5 },
    ]) {
      await openModeSelect(page);
      await page.evaluate((step) => {
        localStorage.setItem("njamkoCampaignCompletedStep", String(step));
      }, completedStep);
      await page.getByTestId("campaign-button").click();
      await expect(page.getByTestId("campaign-map-screen")).toBeVisible();
      await expect(page.getByText(`Razina ${level} kampanje`)).toBeVisible();
      await expect(page.getByTestId("campaign-stop-food")).toHaveClass(/nj-campaign-stop--active/);
      await expect(page.getByTestId("campaign-stop-home")).toHaveClass(/nj-campaign-stop--future/);
      await page.getByTestId("campaign-choose-mode-button").click();
    }
  });

  test("2f. reset kampanje trazi potvrdu i brise progress", async ({ page }) => {
    test.setTimeout(120_000);
    await openModeSelect(page);
    await page.getByTestId("campaign-button").click();
    await launchCampaignStop(page, "campaign-stop-food");
    await completeLevel(page, "food", 1);
    await expect(page.getByTestId("campaign-map-screen")).toBeVisible({ timeout: 10_000 });

    await page.getByTestId("campaign-replay-step-button").click();
    await expect(page.getByTestId("campaign-reset-confirm")).toBeVisible();
    await page.getByTestId("campaign-reset-confirm-button").click();

    await expect(page.getByTestId("campaign-map-screen")).toBeVisible();
    await expect(page.getByTestId("campaign-stop-food")).toHaveClass(/nj-campaign-stop--active/);
    await expect(page.getByTestId("campaign-replay-step-button")).toBeDisabled();
    const completedStep = await page.evaluate(() =>
      localStorage.getItem("njamkoCampaignCompletedStep"),
    );
    expect(completedStep).toBeNull();
  });

  test("2g. browser back iz igre vraća na odabir igre", async ({ page }) => {
    await openFoodLevelSelect(page);
    await page.getByTestId("level-card-1").click();
    await expect(page.getByTestId("game-screen")).toBeVisible();

    await page.evaluate(() => window.history.back());

    await expect(page.getByTestId("mode-select")).toBeVisible();
    await expect(page.getByTestId("landing-page")).toHaveCount(0);
  });

  test("2h. browser back iz kampanje vraća na odabir igre", async ({ page }) => {
    await openModeSelect(page);
    await page.getByTestId("campaign-button").click();
    await expect(page.getByTestId("campaign-map-screen")).toBeVisible();

    await page.evaluate(() => window.history.back());

    await expect(page.getByTestId("mode-select")).toBeVisible();
    await expect(page.getByTestId("landing-page")).toHaveCount(0);
  });

  test("3. level select prikazuje 5 levela", async ({ page }) => {
    await openFoodLevelSelect(page);
    for (let i = 1; i <= 5; i += 1) {
      await expect(page.getByTestId(`level-card-${i}`)).toBeVisible();
    }
    await expect(page.getByTestId("level-card-1")).toContainText("Besplatno");
    await expect(page.getByTestId("level-card-2")).toContainText("Plus");
  });

  test("4. free level se može igrati", async ({ page }) => {
    await openFoodLevelSelect(page);
    await page.getByTestId("level-card-1").click();
    await expect(page.getByTestId("game-screen")).toBeVisible();
    await expect(page.getByTestId("game-progress")).toHaveText("1/10");
  });

  test("5. locked level traži parental gate", async ({ page }) => {
    await openFoodLevelSelect(page);
    await page.getByTestId("level-card-2").click();
    await expect(page.getByTestId("parental-gate")).toBeVisible();
  });

  test("6. krivi parental odgovor", async ({ page }) => {
    await openFoodLevelSelect(page);
    await page.getByTestId("level-card-2").click();
    await page.getByTestId("parental-answer-input").fill("10");
    await page.getByTestId("parental-submit-button").click();
    await expect(page.getByTestId("parental-error")).toContainText("Pokušaj ponovno.");
  });

  test("7. točan parental odgovor", async ({ page }) => {
    await openFoodLevelSelect(page);
    await page.getByTestId("level-card-2").click();
    await page.getByTestId("parental-answer-input").fill("12");
    await page.getByTestId("parental-submit-button").click();
    await expect(page.getByTestId("plus-screen")).toBeVisible();
    await expect(page.getByTestId("plus-price")).toContainText("4,99 €");
  });

  test("8. simuliraj otključavanje", async ({ page }) => {
    await openFoodLevelSelect(page);
    await page.getByTestId("level-card-2").click();
    await page.getByTestId("parental-answer-input").fill("12");
    await page.getByTestId("parental-submit-button").click();
    await page.getByTestId("plus-unlock-button").click();

    const unlocked = await page.evaluate(() => localStorage.getItem("njamkoPlusUnlocked"));
    expect(unlocked).toBe("true");

    await expect(page.getByTestId("level-select")).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId("level-card-2")).toContainText("Otključano");
  });

  test("9. otključani level se može igrati", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("njamkoPlusUnlocked", "true");
    });
    await openFoodLevelSelect(page);
    await page.getByTestId("level-card-2").click();
    await expect(page.getByTestId("game-screen")).toBeVisible();
    await expect(page.getByTestId("game-progress")).toHaveText("1/10");
  });

  test("9b. baby level 5 koristi mobile answer row layout", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => {
      localStorage.setItem("njamkoPlusUnlocked", "true");
    });
    await openModeSelect(page);
    await page.getByTestId("mode-baby").click();
    await page.getByTestId("level-card-5").click();

    const game = page.getByTestId("game-screen");
    await expect(game).toBeVisible();
    await expect(game).toHaveClass(/nj-game--mobile-answer-row/);
    await expect(page.getByTestId("round-prompt")).toHaveText("Pronađi mamu!");
    const mobileBg = await page.getByTestId("njamko-page").evaluate((element) =>
      getComputedStyle(element).getPropertyValue("--nj-mobile-round-bg-image"),
    );
    expect(mobileBg).toContain("baby-l5-r01-penguin-chick-mobile.webp");
    await assertNoHorizontalScroll(page);
  });

  test("10. finish screen nakon 10 rundi", async ({ page }) => {
    test.setTimeout(120_000);
    await openFoodLevelSelect(page);
    await page.getByTestId("level-card-1").click();
    await completeLevel(page, "food", 1);
    await expect(page.getByTestId("finish-screen")).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText("Završio si igru!")).toBeVisible();
    await expect(page.getByText("10/10 rundi")).toBeVisible();
  });

  test("11. sound level", async ({ page }) => {
    await openModeSelect(page);
    await page.getByTestId("mode-sound").click();
    await page.getByTestId("level-card-1").click();
    await expect(page.getByTestId("game-screen")).toBeVisible();
    await expect(page.locator('[data-sound-autoplay-ready="true"]')).toBeVisible({
      timeout: 3000,
    });
    const round = getLevel("sound", 1).rounds[0];
    await expect(page.getByTestId("sound-text")).toHaveText(round.soundText);
    await page.getByTestId("sound-button").click();
  });

  test("12. mobile layout 390x844", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openFoodLevelSelect(page);
    await assertNoHorizontalScroll(page);
    for (let i = 1; i <= 5; i += 1) {
      await expect(page.getByTestId(`level-card-${i}`)).toBeVisible();
    }
  });

  test("12b. food razine koriste mobile container background u app shellu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openFoodLevelSelect(page);

    for (let i = 1; i <= 5; i += 1) {
      const backgroundImage = await page
        .getByTestId(`level-card-${i}`)
        .evaluate((element) => getComputedStyle(element, "::before").backgroundImage);
      expect(backgroundImage).toContain(`food-level-${i}-container-mobile.webp`);
    }

    await page.setViewportSize({ width: 1440, height: 900 });
    await openFoodLevelSelect(page);
    const desktopBackgroundImage = await page
      .getByTestId("level-card-1")
      .evaluate((element) => getComputedStyle(element, "::before").backgroundImage);
    expect(desktopBackgroundImage).toContain("food-level-1-container-mobile.webp");
  });

  test("12c. home razine koriste mobile container background u app shellu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openHomeLevelSelect(page);

    for (let i = 1; i <= 5; i += 1) {
      const backgroundImage = await page
        .getByTestId(`level-card-${i}`)
        .evaluate((element) => getComputedStyle(element, "::before").backgroundImage);
      expect(backgroundImage).toContain(`home-level-${i}-container-mobile.webp`);
    }

    await page.setViewportSize({ width: 1440, height: 900 });
    await openHomeLevelSelect(page);
    const desktopBackgroundImage = await page
      .getByTestId("level-card-1")
      .evaluate((element) => getComputedStyle(element, "::before").backgroundImage);
    expect(desktopBackgroundImage).toContain("home-level-1-container-mobile.webp");
  });

  test("12d. sound razine koriste mobile container background u app shellu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openSoundLevelSelect(page);

    for (let i = 1; i <= 5; i += 1) {
      const backgroundImage = await page
        .getByTestId(`level-card-${i}`)
        .evaluate((element) => getComputedStyle(element, "::before").backgroundImage);
      expect(backgroundImage).toContain(`sound-level-${i}-container-mobile.webp`);
    }

    await page.setViewportSize({ width: 1440, height: 900 });
    await openSoundLevelSelect(page);
    const desktopBackgroundImage = await page
      .getByTestId("level-card-1")
      .evaluate((element) => getComputedStyle(element, "::before").backgroundImage);
    expect(desktopBackgroundImage).toContain("sound-level-1-container-mobile.webp");
  });

  test("12e. baby razine koriste mobile container background u app shellu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openBabyLevelSelect(page);

    for (let i = 1; i <= 5; i += 1) {
      const backgroundImage = await page
        .getByTestId(`level-card-${i}`)
        .evaluate((element) => getComputedStyle(element, "::before").backgroundImage);
      expect(backgroundImage).toContain(`baby-level-${i}-container-mobile.webp`);
    }

    await page.setViewportSize({ width: 1440, height: 900 });
    await openBabyLevelSelect(page);
    const desktopBackgroundImage = await page
      .getByTestId("level-card-1")
      .evaluate((element) => getComputedStyle(element, "::before").backgroundImage);
    expect(desktopBackgroundImage).toContain("baby-level-1-container-mobile.webp");
  });

  test("13. desktop layout 1440x900", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openFoodLevelSelect(page);
    await assertNoHorizontalScroll(page);
    const picker = page.locator(".nj-level-picker");
    const box = await picker.boundingBox();
    const viewport = page.viewportSize();
    expect(box?.width ?? 0).toBeLessThanOrEqual(760);
    const center = (box?.x ?? 0) + (box?.width ?? 0) / 2;
    expect(center).toBeGreaterThan((viewport?.width ?? 1440) * 0.35);
    expect(center).toBeLessThan((viewport?.width ?? 1440) * 0.65);
  });

  test("14. counting misija prolazi find, collect, path i sandbox zadatke", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openCountingLevelSelect(page);
    await page.getByTestId("level-card-1").click();
    await expect(page.getByTestId("counting-game-screen")).toBeVisible();
    await expect(page.getByTestId("counting-instruction")).toHaveText("Nađi broj 1.");

    for (const number of [1, 2, 3, 4, 5]) {
      await expect(page.getByTestId(`counting-shell-${number}`)).toBeVisible();
    }

    await page.getByTestId("counting-shell-2").click();
    await expect(page.getByTestId("counting-feedback-message")).toHaveText("Probaj pronaći broj 1");
    await expect(page.getByTestId("counting-expected-number")).toContainText("1");
    await expect(page.getByTestId("counting-shell-2")).toHaveClass(/nj-counting-shell--wrong/);

    await page.getByTestId("counting-shell-1").click();
    await expect(page.getByTestId("counting-expected-number")).toContainText("2");
    await expect(page.getByTestId("counting-collected-shells")).toContainText("1");

    for (const number of [2, 3, 4, 5]) {
      await page.getByTestId(`counting-shell-${number}`).click();
    }
    await expect(page.getByTestId("counting-feedback-message")).toContainText("Super!");
    await expect(page.getByTestId("game-progress")).toHaveText("2/3", { timeout: 5000 });

    await expect(page.getByTestId("counting-target-number")).toHaveText("5");
    for (const index of [1, 2, 3, 4, 5]) {
      await page.getByTestId(`counting-collect-item-${index}`).click();
    }
    await expect(page.getByTestId("counting-basket-count")).toHaveText("5/5");
    await expect(page.getByTestId("game-progress")).toHaveText("3/3", { timeout: 5000 });

    for (const number of [1, 2, 3, 4, 5]) {
      await page.getByTestId(`counting-path-${number}`).click();
    }
    await expect(page.getByTestId("counting-feedback-message")).toContainText("složio/la");
    await expect(page.getByTestId("counting-mini-sandbox")).toBeVisible({ timeout: 5000 });
    await page.getByTestId("counting-sandbox-finish").click();
    await assertNoHorizontalScroll(page);
  });

  test("15. counting level završava nakon 3 mini-zadatka", async ({ page }) => {
    test.setTimeout(60_000);
    await page.setViewportSize({ width: 390, height: 844 });
    await openCountingLevelSelect(page);
    await page.getByTestId("level-card-1").click();
    await expect(page.getByTestId("counting-game-screen")).toBeVisible();
    await completeCountingLevel(page, 1);
    await expect(page.getByTestId("finish-screen")).toBeVisible({ timeout: 10_000 });
  });

  test("ukupno 215 aktivnosti, counting ima 5 mission levela", () => {
    expect(countTotalRounds()).toBe(215);
    for (const mode of Object.values(njamkoModes).filter((item) => item.id !== "counting")) {
      expect(mode.levels).toHaveLength(5);
      expect(mode.levels[0].isFree).toBe(true);
      for (const level of mode.levels.slice(1)) {
        expect(level.isFree).toBe(false);
      }
      for (const level of mode.levels) {
        expect(level.rounds).toHaveLength(10);
        for (const round of level.rounds) {
          expect(round.options).toHaveLength(3);
          expect(
            round.options.filter((option) => option.name === round.correctAnswer),
          ).toHaveLength(1);
        }
      }
    }

    const counting = getMode("counting");
    expect(counting.levelCount).toBe(5);
    expect(counting.levels).toHaveLength(5);
    const validTaskTypes = [
      "find-number",
      "collect-quantity",
      "number-path",
      "missing-number",
      "decorate-result",
      "count-visible",
      "place-on-path",
      "complete-path",
      "build-order",
    ];
    const expectedDesign = [
      { maxNumber: 5, isFree: true, kind: "shell", types: ["find-number", "collect-quantity", "number-path"] },
      { maxNumber: 5, isFree: true, kind: "pebble", types: ["find-number", "collect-quantity", "decorate-result"] },
      { maxNumber: 6, isFree: false, kind: "crab", types: ["count-visible", "collect-quantity", "number-path"] },
      { maxNumber: 8, isFree: false, kind: "starfish", types: ["missing-number", "place-on-path", "complete-path"] },
      {
        maxNumber: 10,
        isFree: false,
        kind: "beachball",
        collectKind: "shell",
        types: ["find-number", "collect-quantity", "build-order"],
      },
    ];
    for (const level of counting.levels) {
      const design = expectedDesign[level.id - 1];
      expect(level.modeId).toBe("counting");
      expect(level.isFree).toBe(design.isFree);
      expect(level.maxNumber).toBe(design.maxNumber);
      expect(level.tasks).toHaveLength(3);
      expect(level.rounds).toHaveLength(3);
      expect(level.range).toEqual([1, design.maxNumber]);
      expect(level.storyGoal).toBeTruthy();
      expect(level.reward).toBeTruthy();
      expect(level.sandboxLabel).toBeTruthy();
      expect(level.tasks.map((task) => task.type)).toEqual(design.types);

      for (const task of level.tasks) {
        expect(validTaskTypes).toContain(task.type);
        expect(task).toEqual(
          expect.objectContaining({
            id: `counting-l${level.id}-task-${level.tasks.indexOf(task) + 1}`,
            modeId: "counting",
            levelId: level.id,
            mobileBackgroundImage: `/assets/backgrounds/counting-level-${level.id}.webp`,
          }),
        );
      }

      const sequence = Array.from({ length: design.maxNumber }, (_, index) => index + 1);
      const findTask = level.tasks.find((task) => task.type === "find-number");
      if (findTask) {
        expect(findTask.sequence.length).toBeGreaterThanOrEqual(1);
        for (const number of findTask.sequence) {
          expect(sequence).toContain(number);
        }
        expect(findTask.items).toHaveLength(findTask.sequence.length);
        const itemNumbers = findTask.items.map((item) => item.number);
        expect(new Set(itemNumbers).size).toBe(findTask.sequence.length);
        for (const number of findTask.sequence) {
          expect(findTask.items.filter((item) => item.number === number)).toHaveLength(1);
        }
        for (const item of findTask.items) {
          expect(item.kind).toBe(design.kind);
          expect(findTask.sequence).toContain(item.number);
          expect(item.x).toBeGreaterThanOrEqual(18);
          expect(item.x).toBeLessThanOrEqual(84);
          expect(item.y).toBeGreaterThanOrEqual(32);
          expect(item.y).toBeLessThanOrEqual(84);
        }
      }

      const collectTask = level.tasks.find((task) => ["collect-quantity", "decorate-result"].includes(task.type));
      if (collectTask) {
        expect(collectTask.targetNumber).toBeGreaterThanOrEqual(4);
        expect(collectTask.availableItems).toBeGreaterThanOrEqual(collectTask.targetNumber);
        expect(collectTask.itemKind).toBe(design.collectKind ?? design.kind);
      }

      for (const pathTask of level.tasks.filter((task) =>
        ["number-path", "place-on-path", "complete-path", "build-order"].includes(task.type),
      )) {
        expect(pathTask.sequence).toEqual(sequence);
        for (let index = 1; index < pathTask.sequence.length; index += 1) {
          expect(pathTask.sequence[index]).toBe(pathTask.sequence[index - 1] + 1);
        }
      }
    }
  });

  test("food mode zadovoljava pedagoška i gramatička pravila", () => {
    const food = getMode("food");
    expect(food.levels).toHaveLength(5);

    const animals = [];
    const globalFoodCounts = new Map();

    for (const level of food.levels) {
      expect(level.rounds).toHaveLength(10);
      const levelAnimals = new Set();

      for (const round of level.rounds) {
        expect(round.mode).toBe("food");
        expect(round.successText).toMatch(/^Bravo!/);
        expect(round.question).toMatch(/^Što jede .+\?$/);
        expect(round.prompt).toMatch(/ je gladan!$| je gladna!$/);

        if (round.prompt.endsWith("gladna!")) {
          expect(round.prompt).not.toContain(" je gladan!");
        }

        expect(animals).not.toContain(round.mainLabel);
        animals.push(round.mainLabel);

        expect(levelAnimals.has(round.mainLabel)).toBe(false);
        levelAnimals.add(round.mainLabel);

        globalFoodCounts.set(
          round.correctAnswer,
          (globalFoodCounts.get(round.correctAnswer) ?? 0) + 1,
        );

        expect(round.correctAnswer).not.toBe("Miš");
        expect(round.options).toHaveLength(3);

        const names = round.options.map((option) => option.name);
        expect(new Set(names).size).toBe(3);

        const visuals = round.options.map(
          (option) => `${option.emoji}|${option.image ?? ""}`,
        );
        expect(new Set(visuals).size).toBe(3);
        expect(round.options.every((option) => option.emoji !== "❓")).toBe(true);
      }
    }

    expect(animals).toHaveLength(50);

    const mobileBackgrounds = new Set();
    for (const level of food.levels) {
      for (const round of level.rounds) {
        expect(round.mobileAnswerRow).toBe(true);
        expect(round.mobileBackgroundImage).toMatch(
          /^\/assets\/backgrounds\/food-[a-z0-9-]+-mobile\.webp$/,
        );
        mobileBackgrounds.add(round.mobileBackgroundImage);
        const assetPath = fileURLToPath(
          new URL(`../public${round.mobileBackgroundImage}`, import.meta.url),
        );
        expect(existsSync(assetPath)).toBe(true);
      }
    }
    expect(mobileBackgrounds.size).toBe(50);

    const keyPairs = [
      ["Zeko", "Mrkva"],
      ["Pas", "Pseći keksić"],
      ["Miš", "Sir"],
      ["Kanarinac", "Sjemenke"],
      ["Jež", "Jabuka"],
      ["Dabar", "Kora"],
      ["Leptir", "Nektar"],
      ["Slon", "Grane"],
      ["Sova", "Kukci"],
      ["Kit", "Plankton"],
      ["Krokodil", "Meso"],
      ["Morski konjic", "Račići"],
    ];

    for (const [animal, foodName] of keyPairs) {
      const round = food.levels
        .flatMap((level) => level.rounds)
        .find((item) => item.mainLabel === animal);
      expect(round?.correctAnswer).toBe(foodName);
    }

    const lav = food.levels[3].rounds.find((round) => round.mainLabel === "Lav");
    const krokodil = food.levels[3].rounds.find((round) => round.mainLabel === "Krokodil");
    expect(lav?.correctAnswer).toBe("Meso");
    expect(krokodil?.correctAnswer).toBe("Meso");

    expect(food.levels[4].rounds.filter((round) => round.correctAnswer === "Račići")).toHaveLength(2);
    expect(food.levels[1].rounds.filter((round) => round.correctAnswer === "Sjemenke")).toHaveLength(3);
  });
});

const SCREENSHOT_OPTS = { fullPage: true, maxDiffPixelRatio: 0.03 };

test.describe("Njamko screenshots", () => {
  test("1. mode select screen", async ({ page }) => {
    await openModeSelect(page);
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("02-mode-select.png", SCREENSHOT_OPTS);
  });

  test("2. level select screen", async ({ page }) => {
    await openFoodLevelSelect(page);
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("03-level-select.png", SCREENSHOT_OPTS);
  });

  test("4. locked level screen (level select with Plus)", async ({ page }) => {
    await openFoodLevelSelect(page);
    await expect(page.getByTestId("level-card-2")).toContainText("Plus");
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("04-locked-level-select.png", SCREENSHOT_OPTS);
  });

  test("5. parental gate", async ({ page }) => {
    await openFoodLevelSelect(page);
    await page.getByTestId("level-card-2").click();
    await expect(page.getByTestId("parental-gate")).toBeVisible();
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("05-parental-gate.png", SCREENSHOT_OPTS);
  });

  test("6. Njamko Plus screen", async ({ page }) => {
    await openFoodLevelSelect(page);
    await page.getByTestId("level-card-2").click();
    await page.getByTestId("parental-answer-input").fill("12");
    await page.getByTestId("parental-submit-button").click();
    await expect(page.getByTestId("plus-screen")).toBeVisible();
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("06-plus-screen.png", SCREENSHOT_OPTS);
  });

  test("7. game screen", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await openFoodLevelSelect(page);
    await page.getByTestId("level-card-1").click();
    await expect(page.getByTestId("game-screen")).toBeVisible();
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("07-game-screen.png", SCREENSHOT_OPTS);
  });

  test("8. finish screen", async ({ page }) => {
    test.setTimeout(120_000);
    await openFoodLevelSelect(page);
    await page.getByTestId("level-card-1").click();
    await completeLevel(page, "food", 1);
    await expect(page.getByTestId("finish-screen")).toBeVisible({ timeout: 10_000 });
    await page.waitForTimeout(400);
    await expect(page).toHaveScreenshot("08-finish-screen.png", SCREENSHOT_OPTS);
  });
});

test.describe("Njamko viewport screenshots", () => {
  for (const viewport of [
    { name: "mobile", width: 390, height: 844 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1440, height: 900 },
  ]) {
    test(`${viewport.name} level select`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await openFoodLevelSelect(page);
      await page.waitForTimeout(400);
      await expect(page).toHaveScreenshot(
        `level-select-${viewport.name}.png`,
        SCREENSHOT_OPTS,
      );
    });
  }
});


