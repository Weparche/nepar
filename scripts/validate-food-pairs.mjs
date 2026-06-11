/**
 * Validates Njamko level definitions before generation.
 * Run: node scripts/validate-food-pairs.mjs
 */
import {
  FOODS,
  FEMININE_FOOD_ANIMALS,
  FOOD_LEVEL_DEFINITIONS,
  buildFoodLevelRounds,
  buildNjamkoModes,
  foodPrompt,
} from "./generate-njamko-data.mjs";

const errors = [];
const warnings = [];

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function optionVisualKey(option) {
  return `${option.emoji ?? ""}|${option.image ?? ""}`;
}

function foodVisualKey(name) {
  const meta = FOODS[name];
  if (!meta) return null;
  return `${meta.emoji ?? ""}|${meta.image ?? ""}`;
}

function targetAnimal(round) {
  return round.mode === "sound" ? round.correctAnswer : round.mainLabel;
}

function validateFoodDefinitions() {
  const foodAnimals = [];
  const globalFoodCounts = new Map();

  for (const level of FOOD_LEVEL_DEFINITIONS) {
    const correctByRound = level.rounds.map((round) => round.food);
    const levelFoods = new Set();

    for (const [index, round] of level.rounds.entries()) {
      const label = `Food Level ${level.id}, runda ${index + 1} (${round.animal})`;

      for (const name of [round.food, ...round.wrong]) {
        if (!FOODS[name]) {
          addError(`${label}: hrana "${name}" nije u FOODS mapi.`);
        }
      }

      if (foodAnimals.includes(round.animal)) {
        addError(`${label}: životinja "${round.animal}" već postoji u food modu.`);
      }
      foodAnimals.push(round.animal);

      if (levelFoods.has(round.food)) {
        addWarning(`${label}: hrana "${round.food}" već je točan odgovor u istom levelu.`);
      }
      levelFoods.add(round.food);
      globalFoodCounts.set(round.food, (globalFoodCounts.get(round.food) ?? 0) + 1);

      const options = [round.food, ...round.wrong];
      const visualKeys = options.map((name) => foodVisualKey(name));
      if (new Set(visualKeys).size !== visualKeys.length) {
        addError(`${label}: opcije nemaju jedinstvene emoji/slike (${options.join(", ")}).`);
      }

      for (const wrong of round.wrong) {
        if (correctByRound.includes(wrong)) {
          addWarning(
            `${label}: distraktor "${wrong}" je točan odgovor druge runde u istom levelu.`,
          );
        }
      }

      if (!round.successText?.trim()) {
        addError(`${label}: nedostaje successText.`);
      }

      if (round.food === "Miš") {
        addError(`${label}: hrana "Miš" nije dopuštena u dječjem food modu.`);
      }
    }

    const built = buildFoodLevelRounds(level.rounds);
    for (const [index, builtRound] of built.entries()) {
      const round = level.rounds[index];
      const label = `Food Level ${level.id}, runda ${index + 1} (${round.animal})`;
      const expected = foodPrompt(round.animal);
      if (builtRound.prompt !== expected) {
        addError(`${label}: generirani prompt "${builtRound.prompt}" očekivano "${expected}".`);
      }
      const expectedFeminine = FEMININE_FOOD_ANIMALS.has(round.animal);
      if (expectedFeminine && builtRound.prompt.includes("gladan")) {
        addError(`${label}: prompt koristi muški rod umjesto ženskog.`);
      }
      if (!expectedFeminine && builtRound.prompt.includes("gladna")) {
        addError(`${label}: prompt koristi ženski rod umjesto muškog.`);
      }
    }
  }

  for (const [food, count] of globalFoodCounts.entries()) {
    if (count > 2) {
      addWarning(`Hrana "${food}" je točan odgovor ${count}× u cijelom food modu.`);
    }
  }

  const emojiOwners = new Map();
  for (const [name, meta] of Object.entries(FOODS)) {
    const key = `${meta.emoji ?? ""}|${meta.image ?? ""}`;
    if (!emojiOwners.has(key)) {
      emojiOwners.set(key, []);
    }
    emojiOwners.get(key).push(name);
  }
  for (const [key, names] of emojiOwners.entries()) {
    if (names.length > 1 && !key.includes("/assets/")) {
      addWarning(`Hrane dijele isti vizualni fallback bez slike: ${names.join(", ")} (${key}).`);
    }
  }
}

function validateGeneratedModes() {
  const modes = buildNjamkoModes();

  for (const mode of Object.values(modes)) {
    for (const level of mode.levels) {
      const levelLabel = `${mode.title} / Level ${level.id}`;

      if (level.rounds.length !== 10) {
        addError(`${levelLabel}: ima ${level.rounds.length} rundi, očekuje se 10.`);
      }

      const animals = level.rounds.map(targetAnimal);
      const duplicateAnimals = animals.filter((animal, index) => animals.indexOf(animal) !== index);
      if (duplicateAnimals.length) {
        addError(`${levelLabel}: životinje se ponavljaju (${[...new Set(duplicateAnimals)].join(", ")}).`);
      }

      const answers = level.rounds.map((round) => round.correctAnswer);
      const duplicateAnswers = answers.filter((answer, index) => answers.indexOf(answer) !== index);
      if (duplicateAnswers.length && mode.id !== "food" && mode.id !== "home") {
        addError(
          `${levelLabel}: točni odgovori se ponavljaju (${[...new Set(duplicateAnswers)].join(", ")}).`,
        );
      }

      if (mode.id === "sound") {
        const sounds = level.rounds.map((round) => round.soundText);
        const duplicateSounds = sounds.filter((sound, index) => sounds.indexOf(sound) !== index);
        if (duplicateSounds.length) {
          addError(
            `${levelLabel}: tekst zvuka se ponavlja (${[...new Set(duplicateSounds)].join(", ")}).`,
          );
        }
      }

      for (const [index, round] of level.rounds.entries()) {
        const label = `${levelLabel}, runda ${index + 1} (${targetAnimal(round)})`;
        const options = round.options ?? [];

        if (options.length !== 3) {
          addError(`${label}: očekuju se 3 opcije, pronađeno ${options.length}.`);
          continue;
        }

        const optionNames = options.map((option) => option.name);
        if (new Set(optionNames).size !== optionNames.length) {
          addError(`${label}: opcije nemaju jedinstvene nazive (${optionNames.join(", ")}).`);
        }

        const visualKeys = options.map(optionVisualKey);
        if (new Set(visualKeys).size !== visualKeys.length) {
          addError(`${label}: opcije nemaju jedinstvene emoji/slike (${optionNames.join(", ")}).`);
        }

        if (!optionNames.includes(round.correctAnswer)) {
          addError(`${label}: točan odgovor "${round.correctAnswer}" nije među opcijama.`);
        }

        for (const optionName of optionNames) {
          if (optionName !== round.correctAnswer) continue;
          const occurrences = optionNames.filter((name) => name === optionName).length;
          if (occurrences > 1) {
            addError(`${label}: točan odgovor "${round.correctAnswer}" se ponavlja u opcijama.`);
          }
        }
      }
    }
  }
}

validateFoodDefinitions();
validateGeneratedModes();

if (warnings.length) {
  console.warn("WARNINGS:");
  for (const warning of warnings) {
    console.warn(`  - ${warning}`);
  }
}

if (errors.length) {
  console.error("ERRORS:");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

const modes = buildNjamkoModes();
const totalRounds = Object.values(modes).reduce(
  (sum, mode) => sum + mode.levels.reduce((levelSum, level) => levelSum + level.rounds.length, 0),
  0,
);

console.log(
  `Njamko levels OK: ${Object.keys(modes).length} moda, ${totalRounds} rundi, ${warnings.length} upozorenja.`,
);
