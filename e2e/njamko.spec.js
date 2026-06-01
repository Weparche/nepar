import { test, expect } from "@playwright/test";
import { ROUNDS } from "../src/njamko/rounds.js";

async function startGame(page) {
  await page.goto("/njamko");
  await page.getByTestId("start-button").click();
  await expect(page.getByTestId("animal-card")).toBeVisible();
}

async function selectCorrectFood(page, roundIndex) {
  const round = ROUNDS[roundIndex];
  await page.getByRole("button", { name: `Odaberi hranu ${round.correctFood}` }).click();
}

async function completeAllRounds(page) {
  for (let index = 0; index < ROUNDS.length; index += 1) {
    await selectCorrectFood(page, index);
    await expect(page.getByTestId("feedback-message")).toContainText("Bravo!");
    if (index < ROUNDS.length - 1) {
      await expect(page.getByTestId("feedback-message")).toHaveCount(0, {
        timeout: 3000,
      });
    }
  }
}

test.describe("Njamko /njamko", () => {
  test("page opens and shows title", async ({ page }) => {
    await page.goto("/njamko");
    await expect(page.getByTestId("njamko-page")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Njamko", level: 1 })).toBeVisible();
  });

  test("clicking Igraj starts the game", async ({ page }) => {
    await startGame(page);
    await expect(page.getByText("Zeko je gladan!")).toBeVisible();
    await expect(page.getByText("Što zeko voli jesti?")).toBeVisible();
  });

  test("game shows animal and three food cards", async ({ page }) => {
    await startGame(page);
    await expect(page.getByTestId("animal-card")).toBeVisible();
    await expect(page.getByTestId("food-card")).toHaveCount(3);
  });

  test("wrong food shows Probaj opet", async ({ page }) => {
    await startGame(page);
    const wrongFood = ROUNDS[0].options.find(
      (option) => option.name !== ROUNDS[0].correctFood,
    );
    await page.getByRole("button", { name: `Odaberi hranu ${wrongFood.name}` }).click();
    await expect(page.getByTestId("feedback-message")).toContainText("Probaj opet.");
  });

  test("correct food shows Bravo", async ({ page }) => {
    await startGame(page);
    await selectCorrectFood(page, 0);
    await expect(page.getByTestId("feedback-message")).toContainText("Bravo!");
  });

  test("completing all rounds shows finish screen", async ({ page }) => {
    await startGame(page);
    await completeAllRounds(page);
    await expect(page.getByTestId("finish-screen")).toBeVisible({ timeout: 5000 });
    await expect(page.getByText("Bravo, nahranio si sve životinje!")).toBeVisible();
    await expect(page.getByText("8 zvjezdica")).toBeVisible();
  });

  test("390x844 mobile viewport keeps layout intact", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await startGame(page);

    const pageBox = await page.getByTestId("njamko-page").boundingBox();
    const animalBox = await page.getByTestId("animal-card").boundingBox();
    const foodBoxes = await page.getByTestId("food-card").evaluateAll((cards) =>
      cards.map((card) => {
        const rect = card.getBoundingClientRect();
        return { width: rect.width, height: rect.height, top: rect.top, bottom: rect.bottom };
      }),
    );

    expect(pageBox?.width).toBeGreaterThan(0);
    expect(animalBox?.width).toBeGreaterThan(0);
    expect(foodBoxes).toHaveLength(3);
    foodBoxes.forEach((box) => {
      expect(box.width).toBeGreaterThan(0);
      expect(box.height).toBeGreaterThanOrEqual(56);
      expect(box.bottom).toBeLessThanOrEqual(844 + 1);
    });
  });

  test("1440x900 desktop viewport is centered", async ({ page }) => {
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
});
