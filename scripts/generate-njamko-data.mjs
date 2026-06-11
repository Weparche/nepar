/**
 * Generates src/data/njamkoLevels.js from compact content definitions.
 * Run: node scripts/generate-njamko-data.mjs
 */
import { existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import homePedagogy from "../docs/pronadi-dom-kartice-pedagoski-sredeno-v2.json" with { type: "json" };
import soundPedagogy from "../docs/pogodi-zvuk-pedagoski-sredeno-v2.json" with { type: "json" };
import babyPedagogy from "../docs/mama-i-beba-pedagoski-sredeno-v2.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "../src/data/njamkoLevels.js");
const publicRoot = join(__dirname, "../public");

const ANIMALS = {
  Zeko: { emoji: "🐰", image: "/assets/animals/rabbit.webp" },
  Majmun: { emoji: "🐵", image: "/assets/animals/monkey.webp" },
  Mačka: { emoji: "🐱", image: "/assets/animals/cat.webp" },
  Pas: { emoji: "🐶", image: "/assets/animals/dog.webp" },
  Krava: { emoji: "🐮", image: "/assets/animals/cow.webp" },
  Medo: { emoji: "🐻", image: "/assets/animals/bear.webp" },
  Miš: { emoji: "🐭", image: "/assets/animals/mouse.webp" },
  Konj: { emoji: "🐴", image: "/assets/animals/horse.webp" },
  Vjeverica: { emoji: "🐿️", image: "/assets/animals/squirrel.webp" },
  Ovca: { emoji: "🐑", image: "/assets/animals/sheep.webp" },
  Kanarinac: { emoji: "🐦" },
  Kokoš: { emoji: "🐔", emojiAlt: "🐓" },
  Patka: { emoji: "🦆" },
  Svinja: { emoji: "🐷" },
  Koza: { emoji: "🐐" },
  Magarac: { emoji: "🫏" },
  Pijetao: { emoji: "🐓" },
  Purica: { emoji: "🦃" },
  Guska: { emoji: "🪿" },
  Lama: { emoji: "🦙" },
  Noj: { emoji: "🐦" },
  Golub: { emoji: "🕊️" },
  Krtica: { emoji: "🐾" },
  Zec: { emoji: "🐰" },
  Poni: { emoji: "🐴" },
  Jelen: { emoji: "🦌" },
  Srna: { emoji: "🦌" },
  Lisica: { emoji: "🦊" },
  Jež: { emoji: "🦔" },
  Vuk: { emoji: "🐺" },
  Sova: { emoji: "🦉" },
  Dabar: { emoji: "🦫" },
  "Divlja svinja": { emoji: "🐗" },
  Medvjed: { emoji: "🐻" },
  Lav: { emoji: "🦁" },
  Tigar: { emoji: "🐯" },
  Slon: { emoji: "🐘" },
  Žirafa: { emoji: "🦒" },
  Zebra: { emoji: "🦓" },
  Panda: { emoji: "🐼" },
  Klokan: { emoji: "🦘" },
  Papiga: { emoji: "🦜" },
  Pingvin: { emoji: "🐧" },
  Kornjača: { emoji: "🐢" },
  Deva: { emoji: "🐪" },
  Koala: { emoji: "🐨" },
  Flamingo: { emoji: "🦩" },
  Kit: { emoji: "🐋" },
  Dupin: { emoji: "🐬" },
  Krokodil: { emoji: "🐊" },
  Rak: { emoji: "🦞" },
  Pčela: { emoji: "🐝" },
  Leptir: { emoji: "🦋" },
  Puž: { emoji: "🐌" },
  Riba: { emoji: "🐟" },
  Ptica: { emoji: "🐦" },
  Žaba: { emoji: "🐸" },
  Hobotnica: { emoji: "🐙" },
  "Morski konjić": { emoji: "🐠" },
  "Morski konjic": { emoji: "🐠" },
  Zmija: { emoji: "🐍" },
  Cvrčak: { emoji: "🦗" },
  Komarac: { emoji: "🦟" },
  Vrana: { emoji: "🐦‍⬛" },
  Šišmiš: { emoji: "🦇" },
  Hijena: { emoji: "🐾" },
  Gorila: { emoji: "🦍" },
  Nosorog: { emoji: "🦏" },
  Tuljan: { emoji: "🦭" },
  Galeb: { emoji: "🐦" },
  Orao: { emoji: "🦅" },
  Rakun: { emoji: "🦝" },
  Ris: { emoji: "🐈" },
  Čagalj: { emoji: "🐕" },
  "Polarni medvjed": { emoji: "🐻‍❄️" },
  Pile: { emoji: "🐥" },
  Tele: { emoji: "🐮" },
  Mačić: { emoji: "🐱" },
  Ždrijebe: { emoji: "🐴" },
  Štene: { emoji: "🐕" },
  Praščić: { emoji: "🐷" },
  Pače: { emoji: "🐤" },
  Janje: { emoji: "🐑" },
  Lavić: { emoji: "🦁" },
  Medvjedić: { emoji: "🐻" },
  Jare: { emoji: "🐐" },
  Gušče: { emoji: "🪿" },
  Psić: { emoji: "🐕" },
  "Mali jelen": { emoji: "🦌" },
  "Mala srna": { emoji: "🦌" },
  "Mala lisica": { emoji: "🦊" },
  "Mali vuk": { emoji: "🐺" },
  "Mali medo": { emoji: "🐻" },
  "Mali jež": { emoji: "🦔" },
  "Mala sova": { emoji: "🦉" },
  "Mali dabar": { emoji: "🦫" },
  "Mala vjeverica": { emoji: "🐿️" },
  "Mali zec": { emoji: "🐰" },
  Tigrić: { emoji: "🐯" },
  Slonić: { emoji: "🐘" },
  "Mala žirafa": { emoji: "🦒" },
  "Mala zebra": { emoji: "🦓" },
  "Mala panda": { emoji: "🐼" },
  "Mali klokan": { emoji: "🦘" },
  "Mali pingvin": { emoji: "🐧" },
  "Mali majmun": { emoji: "🐵" },
  "Mala kornjača": { emoji: "🐢" },
  "Mala pčela": { emoji: "🐝" },
  "Mala žaba": { emoji: "🐸" },
  Kunić: { emoji: "🐰" },
  Labud: { emoji: "🦢" },
  Paun: { emoji: "🦚" },
  Hrčak: { emoji: "🐹" },
  Zamorac: { emoji: "🐹" },
  Jazavac: { emoji: "🦡" },
  Purić: { emoji: "🐥" },
  Punoglavac: { emoji: "🐸" },
  Gusjenica: { emoji: "🐛" },
  "Ličinka pčele": { emoji: "🐝" },
  "Mali magarac": { emoji: "🫏" },
  Golubić: { emoji: "🕊️" },
  "Mali labud": { emoji: "🦢" },
  "Mali paun": { emoji: "🦚" },
  "Mali hrčak": { emoji: "🐹" },
  "Mali miš": { emoji: "🐭" },
  "Malo zamorče": { emoji: "🐹" },
  "Mali kunić": { emoji: "🐰" },
  Lane: { emoji: "🦌" },
  Jelenče: { emoji: "🦌" },
  "Mali medvjed": { emoji: "🐻" },
  "Mali jazavac": { emoji: "🦡" },
  "Mala koala": { emoji: "🐨" },
  "Mala deva": { emoji: "🐪" },
  "Mali tuljan": { emoji: "🦭" },
  "Mali dupin": { emoji: "🐬" },
  "Mali kit": { emoji: "🐋" },
  "Mali krokodil": { emoji: "🐊" },
  "Mali puž": { emoji: "🐌" },
  "Mala hobotnica": { emoji: "🐙" },
};

export const FEMININE_FOOD_ANIMALS = new Set([
  "Mačka",
  "Krava",
  "Vjeverica",
  "Ovca",
  "Kokoš",
  "Patka",
  "Svinja",
  "Koza",
  "Purica",
  "Guska",
  "Srna",
  "Lisica",
  "Sova",
  "Divlja svinja",
  "Žirafa",
  "Zebra",
  "Panda",
  "Papiga",
  "Kornjača",
  "Deva",
  "Koala",
  "Lama",
  "Krtica",
  "Pčela",
  "Ptica",
]);

export const FOODS = {
  Mrkva: { emoji: "🥕", image: "/assets/foods/carrot.webp" },
  Banana: { emoji: "🍌", image: "/assets/foods/banana.webp" },
  Riba: { emoji: "🐟", image: "/assets/foods/fish.webp" },
  Kost: { emoji: "🦴", image: "/assets/foods/bone.webp" },
  Trava: { emoji: "🌿", image: "/assets/foods/grass.webp" },
  Med: { emoji: "🍯", image: "/assets/foods/honey.webp" },
  Jabuka: { emoji: "🍎", image: "/assets/foods/apple.webp" },
  Lješnjak: { emoji: "🌰", image: "/assets/foods/hazelnut.webp" },
  Zrnje: { emoji: "🌾", image: "/assets/foods/grain.webp" },
  Kukuruz: { emoji: "🌽" },
  Bundeva: { emoji: "🎃" },
  "Lišće": { emoji: "🍃", image: "/assets/foods/leaves.webp" },
  Sijeno: { emoji: "🍂", image: "/assets/foods/hay.webp" },
  Bobice: { emoji: "🫐" },
  Meso: { emoji: "🥩" },
  Kora: { emoji: "🪵" },
  Žir: { emoji: "🌰", image: "/assets/foods/acorn.webp" },
  Bambus: { emoji: "🎋" },
  Sjemenke: { emoji: "🌾", image: "/assets/foods/seeds.webp" },
  Salata: { emoji: "🥬", image: "/assets/foods/lettuce.webp" },
  Kaktus: { emoji: "🌵" },
  Eukaliptus: { emoji: "🌴", image: "/assets/foods/eucalyptus.webp" },
  Račići: { emoji: "🦐" },
  Školjke: { emoji: "🐚" },
  Plankton: { emoji: "🦠", image: "/assets/foods/plankton.webp" },
  Alge: { emoji: "🌊", image: "/assets/foods/algae.webp" },
  Nektar: { emoji: "🌸" },
  Grane: { emoji: "🌳", image: "/assets/foods/branches.webp" },
  Kukci: { emoji: "🐛" },
  "Pseći keksić": { emoji: "🍪" },
  Sir: { emoji: "🧀" },
  Gliste: { emoji: "🪱" },
};

const HOMES = {
  Voda: { emoji: "🌊" },
  Gnijezdo: { emoji: "🪺" },
  Kućica: { emoji: "🏠" },
  Šuma: { emoji: "🌲" },
  Farma: { emoji: "🚜", image: "/assets/homes/farm.webp" },
  Staja: { emoji: "🏚️", image: "/assets/homes/barn.webp" },
  Košnica: { emoji: "🍯" },
  Bara: { emoji: "🪷", image: "/assets/homes/pond-lilies.webp" },
  Pašnjak: { emoji: "🌿" },
  Savana: { emoji: "🌅", image: "/assets/homes/savanna.webp" },
  Led: { emoji: "🧊" },
  Kokošinjac: { emoji: "🐔", image: "/assets/homes/chicken-coop.webp" },
  Svinjac: { emoji: "🐷", image: "/assets/homes/pigsty.webp" },
  Livada: { emoji: "🌿" },
  Brdo: { emoji: "⛰️" },
  Ribnjak: { emoji: "🐟", image: "/assets/homes/fish-pond.webp" },
  Dvorište: { emoji: "🏡" },
  Jazbina: { emoji: "🕳️", image: "/assets/homes/forest-burrow.webp" },
  Brana: { emoji: "🪵", image: "/assets/homes/dam.webp" },
  Rupa: { emoji: "🕳️", image: "/assets/homes/mouse-hole.webp" },
  Podzemlje: { emoji: "🕳️", image: "/assets/homes/underground.webp" },
  Stablo: { emoji: "🌳" },
  Drvo: { emoji: "🌳" },
  Rijeka: { emoji: "🏞️", image: "/assets/homes/river.webp" },
  Špilja: { emoji: "⛰️", image: "/assets/homes/mountain-cave.webp" },
  Vrt: { emoji: "🌷" },
  More: { emoji: "🌊", image: "/assets/homes/sea.webp" },
  Ocean: { emoji: "🌊" },
  "Kamenje uz more": { emoji: "🪨" },
  Plaža: { emoji: "🏖️" },
  Jezero: { emoji: "💧" },
  "Koraljni greben": { emoji: "🪸" },
  Pustinja: { emoji: "🏜️" },
  "Bambusova šuma": { emoji: "🎋" },
  Australija: { emoji: "🇦🇺" },
  Džungla: { emoji: "🌴" },
  Prašuma: { emoji: "🌴", image: "/assets/homes/rainforest.webp" },
  "Plitka voda": { emoji: "💧" },
};

function pickWrong(correct, pool, count = 2, seed = 0) {
  const unique = [...new Set(pool.filter((item) => item !== correct))];
  if (unique.length === 0) {
    return [];
  }

  const start = Math.abs(seed * 3 + correct.length) % unique.length;
  return Array.from({ length: Math.min(count, unique.length) }, (_, index) => {
    return unique[(start + index) % unique.length];
  });
}

function visualKeyForName(name, map) {
  const meta = map[name] ?? {};
  return `${meta.emoji ?? ""}|${meta.image ?? ""}`;
}

function pickWrongFromMap(correct, pool, map, count = 2, seed = 0) {
  const unique = [...new Set(pool.filter((item) => item !== correct))];
  const start = unique.length ? Math.abs(seed * 3 + correct.length) % unique.length : 0;
  const rotated = [...unique.slice(start), ...unique.slice(0, start)];
  const seenVisuals = new Set([visualKeyForName(correct, map)]);
  const selected = [];

  for (const item of rotated) {
    const visualKey = visualKeyForName(item, map);
    if (seenVisuals.has(visualKey)) continue;
    selected.push(item);
    seenVisuals.add(visualKey);
    if (selected.length === count) return selected;
  }

  for (const item of rotated) {
    if (selected.includes(item)) continue;
    selected.push(item);
    if (selected.length === count) return selected;
  }

  return selected;
}

function animalMeta(name) {
  return ANIMALS[name] ?? { emoji: "🐾" };
}

function optionFromMap(name, map) {
  const meta = map[name] ?? { emoji: "❓" };
  return { name, emoji: meta.emoji, ...(meta.image ? { image: meta.image } : {}) };
}

function existingPublicPath(relativePath) {
  if (!relativePath) return null;
  const normalized = relativePath.startsWith("/") ? relativePath.slice(1) : relativePath;
  return existsSync(join(publicRoot, normalized)) ? relativePath : null;
}

export function foodPrompt(animal) {
  return `${animal} je ${FEMININE_FOOD_ANIMALS.has(animal) ? "gladna" : "gladan"}!`;
}

export function foodQuestion(animal) {
  return `Što jede ${animal.toLowerCase()}?`;
}

const FOOD_MOBILE_BACKGROUND_SLUGS = {
  Zeko: "rabbit",
  Majmun: "monkey",
  Mačka: "cat",
  Pas: "dog",
  Krava: "cow",
  Miš: "mouse",
  Konj: "horse",
  Vjeverica: "squirrel",
  Ovca: "sheep",
  Kanarinac: "canary",
  Kokoš: "chicken",
  Patka: "duck",
  Svinja: "pig",
  Koza: "goat",
  Magarac: "donkey",
  Purica: "turkey",
  Guska: "goose",
  Lama: "llama",
  Noj: "ostrich",
  Golub: "pigeon",
  Jelen: "deer",
  Lisica: "fox",
  Jež: "hedgehog",
  Dabar: "beaver",
  Sova: "owl",
  "Divlja svinja": "wild-boar",
  Medvjed: "bear",
  Leptir: "butterfly",
  Vuk: "wolf",
  Krtica: "mole",
  Lav: "lion",
  Slon: "elephant",
  Žirafa: "giraffe",
  Zebra: "zebra",
  Panda: "panda",
  Klokan: "kangaroo",
  Papiga: "parrot",
  Pingvin: "penguin",
  Kornjača: "turtle",
  Krokodil: "crocodile",
  Deva: "camel",
  Koala: "koala",
  Flamingo: "flamingo",
  Kit: "whale",
  Dupin: "dolphin",
  Rak: "crab",
  Puž: "snail",
  Žaba: "frog",
  Hobotnica: "octopus",
  "Morski konjic": "seahorse",
};

function foodMobileRoundFields(animal) {
  const slug = FOOD_MOBILE_BACKGROUND_SLUGS[animal];
  if (!slug) return {};

  return {
    mobileBackgroundImage: `/assets/backgrounds/food-${slug}-mobile.webp`,
    mobileAnswerRow: true,
    ...(animal === "Zeko" ? { mobileLoopVideoCard: true } : {}),
  };
}

function makeFoodRound(entry) {
  const { animal, food, wrong, successText } = entry;
  const a = animalMeta(animal);
  return {
    mode: "food",
    prompt: foodPrompt(animal),
    question: foodQuestion(animal),
    successText,
    mainLabel: animal,
    mainEmoji: a.emoji,
    ...(a.image ? { mainImage: a.image } : {}),
    ...foodMobileRoundFields(animal),
    correctAnswer: food,
    options: [food, ...wrong].map((n) => optionFromMap(n, FOODS)),
  };
}

export function buildFoodLevelRounds(rounds) {
  return rounds.map((entry) => makeFoodRound(entry));
}

function buildFoodLevel(rounds) {
  return buildFoodLevelRounds(rounds);
}

const HOME_LEVEL_THEMES = {
  1: "Osnovni domovi",
  2: "Farma",
  3: "Šuma",
  4: "More i voda",
  5: "Svijet",
};

function homeOptionFromPedagogy(option) {
  return {
    name: option.naziv,
    emoji: option.emoji,
    ...(option.slika ? { image: option.slika } : {}),
  };
}

function homeRoundFromPedagogy(entry) {
  const animal = animalMeta(entry.zivotinja);
  const mainImage = entry.slikaZivotinje ?? animal.image ?? undefined;

  return {
    mode: "home",
    prompt: entry.prompt,
    question: entry.pitanje,
    mainLabel: entry.zivotinja,
    mainEmoji: entry.emoji ?? animal.emoji,
    ...(mainImage ? { mainImage } : {}),
    correctAnswer: entry.tocniOdgovor,
    options: entry.opcije.map(homeOptionFromPedagogy),
    ...(entry.mobilePozadina
      ? {
          mobileBackgroundImage: entry.mobilePozadina,
          mobileAnswerRow: true,
        }
      : {}),
  };
}

export function validateHomePedagogy(data = homePedagogy) {
  const errors = [];

  if (data.runde.length !== 50) {
    errors.push(`Expected 50 rounds, got ${data.runde.length}`);
  }

  for (const entry of data.runde) {
    const label = `L${entry.razina} r${entry.runda} (${entry.zivotinja})`;

    if (!entry.prompt || !entry.pitanje || !entry.tocniOdgovor) {
      errors.push(`${label}: missing prompt, question, or correct answer`);
    }

    if (!Array.isArray(entry.opcije) || entry.opcije.length !== 3) {
      errors.push(`${label}: expected 3 options`);
    }

    if (!entry.opcije.some((option) => option.naziv === entry.tocniOdgovor)) {
      errors.push(`${label}: correct answer "${entry.tocniOdgovor}" not in options`);
    }

    if (entry.opcije.some((option) => option.naziv === "Farma")) {
      errors.push(`${label}: "Farma" must not be an answer card`);
    }

    for (const option of entry.opcije) {
      if (option.slika && !existsSync(join(publicRoot, option.slika))) {
        errors.push(`${label}: missing home image ${option.slika}`);
      }
    }

    if (entry.mobilePozadina && !existsSync(join(publicRoot, entry.mobilePozadina))) {
      errors.push(`${label}: missing mobile background ${entry.mobilePozadina}`);
    }
  }

  if (errors.length) {
    throw new Error(`Home pedagogy validation failed:\n- ${errors.join("\n- ")}`);
  }

  return data;
}

function buildHomeLevelsFromPedagogy(data) {
  validateHomePedagogy(data);

  const byLevel = new Map();

  for (const entry of data.runde) {
    if (!byLevel.has(entry.razina)) {
      byLevel.set(entry.razina, {
        id: entry.razina,
        title: entry.razinaNaslov,
        theme: HOME_LEVEL_THEMES[entry.razina] ?? entry.razinaNaslov,
        isFree: entry.razina === 1,
        rounds: [],
      });
    }

    byLevel.get(entry.razina).rounds.push(homeRoundFromPedagogy(entry));
  }

  return [...byLevel.values()].sort((a, b) => a.id - b.id);
}

const SOUND_LEVEL_THEMES = {
  1: "Najpoznatiji zvukovi",
  2: "Domaće i dvorišne životinje",
  3: "Šuma i noćni zvukovi",
  4: "Divlje životinje svijeta",
  5: "Zvukovi i staništa životinja",
};

function soundOptionFromPedagogy(option) {
  const image = existingPublicPath(option.slika);
  return {
    name: option.naziv,
    emoji: option.emoji,
    ...(image ? { image } : {}),
  };
}

function soundRoundFromPedagogy(entry) {
  const animal = animalMeta(entry.zivotinja);
  const image = existingPublicPath(entry.slika) ?? existingPublicPath(animal.image);
  const soundSrc = existingPublicPath(entry.zvukSrc);
  const mobileBackgroundImage = existingPublicPath(entry.mobilePozadina);

  return {
    mode: "sound",
    prompt: "Tko se tako glasa?",
    question: "Poslušaj zvuk i odaberi životinju.",
    mainLabel: "Zvuk",
    mainEmoji: "🔊",
    soundText: entry.zvukTekst,
    ...(soundSrc ? { soundSrc } : {}),
    correctAnswer: entry.zivotinja,
    options: [
      {
        name: entry.zivotinja,
        emoji: entry.emoji ?? animal.emoji,
        ...(image ? { image } : {}),
      },
      ...entry.distraktori.map(soundOptionFromPedagogy),
    ],
    ...(mobileBackgroundImage
      ? {
          mobileBackgroundImage,
          mobileAnswerRow: true,
        }
      : {}),
  };
}

export function validateSoundPedagogy(data = soundPedagogy) {
  const errors = [];
  const correctAnimals = new Set();
  const levelCounts = new Map();

  if (data.runde.length !== 50) {
    errors.push(`Expected 50 rounds, got ${data.runde.length}`);
  }

  for (const entry of data.runde) {
    const label = `L${entry.razina} r${entry.runda} (${entry.zivotinja})`;

    levelCounts.set(entry.razina, (levelCounts.get(entry.razina) ?? 0) + 1);

    if (correctAnimals.has(entry.zivotinja)) {
      errors.push(`${label}: duplicate correct animal "${entry.zivotinja}"`);
    }
    correctAnimals.add(entry.zivotinja);

    if (!entry.zvukTekst || !entry.zivotinja) {
      errors.push(`${label}: missing sound text or animal`);
    }

    if (!Array.isArray(entry.distraktori) || entry.distraktori.length !== 2) {
      errors.push(`${label}: expected 2 distractors`);
    }

    const optionNames = [entry.zivotinja, ...entry.distraktori.map((option) => option.naziv)];
    if (new Set(optionNames).size !== 3) {
      errors.push(`${label}: duplicate options in round`);
    }

    if (entry.distraktori.some((option) => option.naziv === entry.zivotinja)) {
      errors.push(`${label}: correct animal among distractors`);
    }

    if (entry.mobilePozadina && !existingPublicPath(entry.mobilePozadina)) {
      errors.push(`${label}: missing mobile background ${entry.mobilePozadina}`);
    }
  }

  if (correctAnimals.size !== 50) {
    errors.push(`Expected 50 unique correct animals, got ${correctAnimals.size}`);
  }

  for (const [levelId, count] of levelCounts) {
    if (count !== 10) {
      errors.push(`Level ${levelId}: expected 10 rounds, got ${count}`);
    }
  }

  if (errors.length) {
    throw new Error(`Sound pedagogy validation failed:\n- ${errors.join("\n- ")}`);
  }

  return data;
}

function buildSoundLevelsFromPedagogy(data) {
  validateSoundPedagogy(data);

  const byLevel = new Map();

  for (const entry of data.runde) {
    if (!byLevel.has(entry.razina)) {
      byLevel.set(entry.razina, {
        id: entry.razina,
        title: entry.razinaNaslov,
        theme: SOUND_LEVEL_THEMES[entry.razina] ?? entry.razinaTema,
        isFree: entry.razina === 1,
        rounds: [],
      });
    }

    byLevel.get(entry.razina).rounds.push(soundRoundFromPedagogy(entry));
  }

  return [...byLevel.values()].sort((a, b) => a.id - b.id);
}

function babyOptionFromPedagogy(option) {
  const image = existingPublicPath(option.slika);
  return {
    name: option.naziv,
    emoji: option.emoji,
    ...(image ? { image } : {}),
  };
}

function babyRoundFromPedagogy(entry) {
  const bebaImage = existingPublicPath(entry.bebaSlika);
  const mamaImage = existingPublicPath(entry.mamaSlika) ?? existingPublicPath(animalMeta(entry.mama).image);
  const mobileBackgroundImage = existingPublicPath(entry.mobilePozadina);

  return {
    mode: "baby",
    prompt: entry.prompt,
    question: entry.pitanje,
    mainLabel: entry.beba,
    mainEmoji: entry.bebaEmoji,
    ...(bebaImage ? { mainImage: bebaImage } : {}),
    correctAnswer: entry.mama,
    options: [
      {
        name: entry.mama,
        emoji: entry.mamaEmoji,
        ...(mamaImage ? { image: mamaImage } : {}),
      },
      ...entry.distraktori.map(babyOptionFromPedagogy),
    ],
    ...(mobileBackgroundImage
      ? {
          mobileBackgroundImage,
          mobileAnswerRow: true,
        }
      : {}),
  };
}

export function validateBabyPedagogy(data = babyPedagogy) {
  const errors = [];
  const correctMothers = new Set();
  const babyMotherPairs = new Set();
  const levelCounts = new Map();

  if (data.runde.length !== 50) {
    errors.push(`Expected 50 rounds, got ${data.runde.length}`);
  }

  for (const entry of data.runde) {
    const label = `L${entry.razina} r${entry.runda} (${entry.beba}→${entry.mama})`;

    levelCounts.set(entry.razina, (levelCounts.get(entry.razina) ?? 0) + 1);

    const pairKey = `${entry.beba}→${entry.mama}`;
    if (babyMotherPairs.has(pairKey)) {
      errors.push(`${label}: duplicate baby→mother pair`);
    }
    babyMotherPairs.add(pairKey);

    if (correctMothers.has(entry.mama)) {
      errors.push(`${label}: duplicate correct mother "${entry.mama}"`);
    }
    correctMothers.add(entry.mama);

    if (!entry.beba || !entry.mama || !entry.prompt) {
      errors.push(`${label}: missing baby, mother, or prompt`);
    }

    if (!Array.isArray(entry.distraktori) || entry.distraktori.length !== 2) {
      errors.push(`${label}: expected 2 distractors`);
    }

    const optionNames = [entry.mama, ...entry.distraktori.map((option) => option.naziv)];
    if (new Set(optionNames).size !== 3) {
      errors.push(`${label}: duplicate options in round`);
    }

    if (entry.distraktori.some((option) => option.naziv === entry.mama)) {
      errors.push(`${label}: correct mother among distractors`);
    }

    if (entry.mobilePozadina && !existingPublicPath(entry.mobilePozadina)) {
      errors.push(`${label}: missing mobile background ${entry.mobilePozadina}`);
    }
  }

  if (correctMothers.size !== 50) {
    errors.push(`Expected 50 unique correct mothers, got ${correctMothers.size}`);
  }

  if (babyMotherPairs.size !== 50) {
    errors.push(`Expected 50 unique baby→mother pairs, got ${babyMotherPairs.size}`);
  }

  for (const [levelId, count] of levelCounts) {
    if (count !== 10) {
      errors.push(`Level ${levelId}: expected 10 rounds, got ${count}`);
    }
  }

  if (errors.length) {
    throw new Error(`Baby pedagogy validation failed:\n- ${errors.join("\n- ")}`);
  }

  return data;
}

function buildBabyLevelsFromPedagogy(data) {
  validateBabyPedagogy(data);

  const byLevel = new Map();

  for (const entry of data.runde) {
    if (!byLevel.has(entry.razina)) {
      byLevel.set(entry.razina, {
        id: entry.razina,
        title: entry.razinaNaslov,
        theme: entry.razinaTema,
        isFree: entry.razina === 1,
        rounds: [],
      });
    }

    byLevel.get(entry.razina).rounds.push(babyRoundFromPedagogy(entry));
  }

  return [...byLevel.values()].sort((a, b) => a.id - b.id);
}

function level(id, title, theme, isFree, pairs, builder) {
  return { id, title, theme, isFree, rounds: builder(pairs) };
}

export const FOOD_LEVEL_DEFINITIONS = [
  {
    id: 1,
    title: "Razina 1",
    theme: "Osnovne životinje",
    isFree: true,
    rounds: [
      {
        animal: "Zeko",
        food: "Mrkva",
        wrong: ["Banana", "Riba"],
        successText: "Bravo! Zeko voli hrskavu mrkvu.",
      },
      {
        animal: "Majmun",
        food: "Banana",
        wrong: ["Salata", "Riba"],
        successText: "Bravo! Majmun najviše voli bananu.",
      },
      {
        animal: "Mačka",
        food: "Riba",
        wrong: ["Mrkva", "Trava"],
        successText: "Bravo! Mačka voli ukusnu ribu.",
      },
      {
        animal: "Pas",
        food: "Pseći keksić",
        wrong: ["Banana", "Salata"],
        successText: "Bravo! Pas voli pseći keksić.",
      },
      {
        animal: "Krava",
        food: "Trava",
        wrong: ["Riba", "Med"],
        successText: "Bravo! Krava voli svježu travu.",
      },
      {
        animal: "Miš",
        food: "Sir",
        wrong: ["Riba", "Kaktus"],
        successText: "Bravo! Miš voli sir.",
      },
      {
        animal: "Konj",
        food: "Jabuka",
        wrong: ["Alge", "Med"],
        successText: "Bravo! Konj voli slatku jabuku.",
      },
      {
        animal: "Vjeverica",
        food: "Lješnjak",
        wrong: ["Riba", "Salata"],
        successText: "Bravo! Vjeverica voli lješnjak.",
      },
      {
        animal: "Ovca",
        food: "Sijeno",
        wrong: ["Banana", "Račići"],
        successText: "Bravo! Ovca voli meko sijeno.",
      },
      {
        animal: "Kanarinac",
        food: "Sjemenke",
        wrong: ["Kaktus", "Riba"],
        successText: "Bravo! Kanarinac voli sjemenke.",
      },
    ],
  },
  {
    id: 2,
    title: "Razina 2",
    theme: "Farma",
    isFree: false,
    rounds: [
      {
        animal: "Kokoš",
        food: "Kukuruz",
        wrong: ["Med", "Kaktus"],
        successText: "Bravo! Kokoš voli kukuruz.",
      },
      {
        animal: "Patka",
        food: "Sjemenke",
        wrong: ["Meso", "Kaktus"],
        successText: "Bravo! Patka voli sjemenke.",
      },
      {
        animal: "Svinja",
        food: "Bundeva",
        wrong: ["Bambus", "Riba"],
        successText: "Bravo! Svinja voli bundevu.",
      },
      {
        animal: "Koza",
        food: "Lišće",
        wrong: ["Riba", "Med"],
        successText: "Bravo! Koza voli svježe lišće.",
      },
      {
        animal: "Magarac",
        food: "Sijeno",
        wrong: ["Banana", "Riba"],
        successText: "Bravo! Magarac voli sijeno.",
      },
      {
        animal: "Purica",
        food: "Kukuruz",
        wrong: ["Med", "Kaktus"],
        successText: "Bravo! Purica voli kukuruz.",
      },
      {
        animal: "Guska",
        food: "Trava",
        wrong: ["Riba", "Med"],
        successText: "Bravo! Guska voli zelenu travu.",
      },
      {
        animal: "Lama",
        food: "Sijeno",
        wrong: ["Riba", "Kaktus"],
        successText: "Bravo! Lama voli sijeno.",
      },
      {
        animal: "Noj",
        food: "Sjemenke",
        wrong: ["Med", "Riba"],
        successText: "Bravo! Noj voli sjemenke.",
      },
      {
        animal: "Golub",
        food: "Sjemenke",
        wrong: ["Salata", "Meso"],
        successText: "Bravo! Golub voli sjemenke.",
      },
    ],
  },
  {
    id: 3,
    title: "Razina 3",
    theme: "Šuma",
    isFree: false,
    rounds: [
      {
        animal: "Jelen",
        food: "Lišće",
        wrong: ["Banana", "Riba"],
        successText: "Bravo! Jelen voli lišće.",
      },
      {
        animal: "Lisica",
        food: "Meso",
        wrong: ["Kukuruz", "Salata"],
        successText: "Bravo! Lisica voli meso.",
      },
      {
        animal: "Jež",
        food: "Jabuka",
        wrong: ["Banana", "Bambus"],
        successText: "Bravo! Jež voli slatku jabuku.",
      },
      {
        animal: "Dabar",
        food: "Kora",
        wrong: ["Banana", "Riba"],
        successText: "Bravo! Dabar gricka koru drveta.",
      },
      {
        animal: "Sova",
        food: "Kukci",
        wrong: ["Mrkva", "Bambus"],
        successText: "Bravo! Sova lovi kukce.",
      },
      {
        animal: "Divlja svinja",
        food: "Žir",
        wrong: ["Riba", "Kaktus"],
        successText: "Bravo! Divlja svinja voli žir.",
      },
      {
        animal: "Medvjed",
        food: "Med",
        wrong: ["Kaktus", "Alge"],
        successText: "Bravo! Medvjed voli med.",
      },
      {
        animal: "Leptir",
        food: "Nektar",
        wrong: ["Riba", "Kukuruz"],
        successText: "Bravo! Leptir pije nektar iz cvijeća.",
      },
      {
        animal: "Vuk",
        food: "Meso",
        wrong: ["Salata", "Banana"],
        successText: "Bravo! Vuk voli meso.",
      },
      {
        animal: "Krtica",
        food: "Gliste",
        wrong: ["Med", "Jabuka"],
        successText: "Bravo! Krtica voli gliste.",
      },
    ],
  },
  {
    id: 4,
    title: "Razina 4",
    theme: "Zoo / Savana",
    isFree: false,
    rounds: [
      {
        animal: "Lav",
        food: "Meso",
        wrong: ["Salata", "Kora"],
        successText: "Bravo! Lav voli meso.",
      },
      {
        animal: "Slon",
        food: "Grane",
        wrong: ["Riba", "Med"],
        successText: "Bravo! Slon voli grane i lišće.",
      },
      {
        animal: "Žirafa",
        food: "Lišće",
        wrong: ["Riba", "Med"],
        successText: "Bravo! Žirafa voli lišće s visokih grana.",
      },
      {
        animal: "Zebra",
        food: "Trava",
        wrong: ["Banana", "Kora"],
        successText: "Bravo! Zebra voli travu.",
      },
      {
        animal: "Panda",
        food: "Bambus",
        wrong: ["Žir", "Riba"],
        successText: "Bravo! Panda najviše voli bambus.",
      },
      {
        animal: "Klokan",
        food: "Trava",
        wrong: ["Med", "Kora"],
        successText: "Bravo! Klokan voli travu.",
      },
      {
        animal: "Papiga",
        food: "Sjemenke",
        wrong: ["Riba", "Kaktus"],
        successText: "Bravo! Papiga voli sjemenke.",
      },
      {
        animal: "Pingvin",
        food: "Riba",
        wrong: ["Kaktus", "Sjemenke"],
        successText: "Bravo! Pingvin voli ribu.",
      },
      {
        animal: "Kornjača",
        food: "Salata",
        wrong: ["Med", "Kora"],
        successText: "Bravo! Kornjača voli salatu.",
      },
      {
        animal: "Krokodil",
        food: "Meso",
        wrong: ["Nektar", "Trava"],
        successText: "Bravo! Krokodil voli meso.",
      },
    ],
  },
  {
    id: 5,
    title: "Razina 5",
    theme: "Mali izazov",
    isFree: false,
    rounds: [
      {
        animal: "Deva",
        food: "Kaktus",
        wrong: ["Banana", "Med"],
        successText: "Bravo! Deva voli kaktus.",
      },
      {
        animal: "Koala",
        food: "Eukaliptus",
        wrong: ["Bambus", "Riba"],
        successText: "Bravo! Koala voli eukaliptus.",
      },
      {
        animal: "Flamingo",
        food: "Račići",
        wrong: ["Sjemenke", "Banana"],
        successText: "Bravo! Flamingo voli račiće.",
      },
      {
        animal: "Kit",
        food: "Plankton",
        wrong: ["Trava", "Kukuruz"],
        successText: "Bravo! Kit jede plankton.",
      },
      {
        animal: "Dupin",
        food: "Riba",
        wrong: ["Banana", "Kukuruz"],
        successText: "Bravo! Dupin voli ribu.",
      },
      {
        animal: "Rak",
        food: "Alge",
        wrong: ["Jabuka", "Med"],
        successText: "Bravo! Rak voli alge.",
      },
      {
        animal: "Puž",
        food: "Salata",
        wrong: ["Riba", "Med"],
        successText: "Bravo! Puž voli salatu.",
      },
      {
        animal: "Žaba",
        food: "Kukci",
        wrong: ["Banana", "Sijeno"],
        successText: "Bravo! Žaba voli kukce.",
      },
      {
        animal: "Hobotnica",
        food: "Školjke",
        wrong: ["Trava", "Bambus"],
        successText: "Bravo! Hobotnica voli školjke.",
      },
      {
        animal: "Morski konjic",
        food: "Račići",
        wrong: ["Jabuka", "Kaktus"],
        successText: "Bravo! Morski konjic jede račiće.",
      },
    ],
  },
];

const FOOD_LEVELS = FOOD_LEVEL_DEFINITIONS.map(({ id, title, theme, isFree, rounds }) =>
  level(id, title, theme, isFree, rounds, buildFoodLevel),
);

const HOME_LEVELS = buildHomeLevelsFromPedagogy(homePedagogy);

const SOUND_LEVELS = buildSoundLevelsFromPedagogy(soundPedagogy);

const BABY_LEVELS = buildBabyLevelsFromPedagogy(babyPedagogy);

const njamkoModes = {
  food: {
    id: "food",
    title: "Nahrani životinju",
    icon: "🍎",
    description: "Odaberi što životinja voli jesti.",
    levelSelectSubtitle: "Odaberi razinu i kreni hraniti životinje.",
    levels: FOOD_LEVELS,
  },
  home: {
    id: "home",
    title: "Pronađi dom",
    icon: "🏡",
    description: "Pomogni životinji pronaći gdje živi.",
    levelSelectSubtitle: "Odaberi razinu i pomogni životinjama pronaći dom.",
    levels: HOME_LEVELS,
  },
  sound: {
    id: "sound",
    title: "Pogodi zvuk",
    icon: "🔊",
    description: "Poslušaj zvuk i odaberi životinju.",
    levelSelectSubtitle: "Odaberi razinu i pogodi tko se glasa.",
    levels: SOUND_LEVELS,
  },
  baby: {
    id: "baby",
    title: "Mama i beba",
    icon: "🐣",
    description: "Spoji bebu s mamom.",
    levelSelectSubtitle: "Odaberi razinu i spoji bebe s mamama.",
    levels: BABY_LEVELS,
  },
};

export function buildNjamkoModes() {
  return njamkoModes;
}

const file = `export function shuffleOptions(options) {
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const njamkoModes = ${JSON.stringify(njamkoModes, null, 2)};

export const NJAMKO_MODES_LIST = Object.values(njamkoModes);

export function getMode(modeId) {
  return njamkoModes[modeId] ?? null;
}

export function getLevel(modeId, levelId) {
  const mode = getMode(modeId);
  if (!mode) return null;
  return mode.levels.find((level) => level.id === levelId) ?? null;
}

export function getLevelKey(modeId, levelId) {
  return \`\${modeId}-\${levelId}\`;
}

export function countTotalRounds() {
  return NJAMKO_MODES_LIST.reduce(
    (sum, mode) =>
      sum + mode.levels.reduce((levelSum, level) => levelSum + level.rounds.length, 0),
    0,
  );
}

/** @deprecated Use getLevel(modeId, levelId) */
export function getLevelById(levelKey) {
  if (!levelKey) return null;
  const [modeId, levelIdRaw] = levelKey.split("-");
  const levelId = Number(levelIdRaw);
  const level = getLevel(modeId, levelId);
  if (!level) return null;
  const mode = getMode(modeId);
  return {
    ...level,
    modeId,
    modeTitle: mode?.title ?? "",
    key: levelKey,
  };
}

/** @deprecated */
export const NJAMKO_LEVELS = NJAMKO_MODES_LIST;
`;

const isMain =
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isMain) {
  writeFileSync(outPath, file, "utf8");

  const total = Object.values(njamkoModes).reduce(
    (s, m) => s + m.levels.reduce((ls, l) => ls + l.rounds.length, 0),
    0,
  );
  console.log(`Wrote ${outPath} (${total} rounds)`);
}
