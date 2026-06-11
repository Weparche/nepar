export function shuffleOptions(options) {
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const COUNTING_FIND_POSITIONS = {
  5: [[22, 54], [62, 42], [42, 67], [76, 58], [30, 34]],
  6: [[21, 52], [55, 38], [78, 48], [34, 68], [66, 70], [44, 82]],
  8: [[21, 42], [48, 36], [75, 43], [32, 57], [63, 58], [24, 75], [51, 78], [78, 72]],
  10: [[21, 38], [45, 34], [70, 39], [29, 54], [55, 53], [80, 57], [24, 72], [45, 79], [66, 73], [82, 82]],
};

const COUNTING_MISSION_LEVELS = [
  {
    levelId: 1,
    title: "Školjke za ogrlicu",
    subtitle: "Broji školjke od 1 do 5.",
    theme: "Školjke i ogrlica",
    countingTheme: "shells",
    range: [1, 5],
    itemKind: "shell",
    itemName: "školjke",
    itemSingular: "školjku",
    isFree: true,
    storyGoal: "Njamko želi napraviti ogrlicu od školjki.",
    reward: "shell-necklace",
    collectTarget: 5,
    sandboxLabel: "Dodirni školjke na ogrlici.",
    tasks: [
      { type: "find-number", title: "Pronađi školjke", instruction: "Nađi broj 1.", sequenceMax: 5 },
      { type: "collect-quantity", title: "Skupi školjke", instruction: "Stavi 5 školjki u košaricu.", targetNumber: 5 },
      { type: "number-path", title: "Složi ogrlicu", instruction: "Složi red od 1 do 5.", sequenceMax: 5 },
    ],
  },
  {
    levelId: 2,
    title: "Kamenčići za kulu",
    subtitle: "Ukrašavaj kulu od pijeska.",
    theme: "Kamenčići i kula",
    countingTheme: "pebbles",
    range: [1, 5],
    itemKind: "pebble",
    itemName: "kamenčića",
    itemSingular: "kamenčić",
    isFree: true,
    storyGoal: "Njamko ukrašava kulu od pijeska.",
    reward: "sand-tower",
    collectTarget: 4,
    sandboxLabel: "Dodirni kulu, kamenčiće i zastavicu.",
    tasks: [
      { type: "find-number", title: "Koliko treba kuli?", instruction: "Kula treba 4 kamenčića.", sequence: [4] },
      { type: "collect-quantity", title: "Napuni kanticu", instruction: "Stavi 4 kamenčića u kanticu.", targetNumber: 4, availableItems: 5 },
      { type: "decorate-result", title: "Ukrasimo kulu", instruction: "Stavi kamenčiće na kulu.", targetNumber: 4, availableItems: 4 },
    ],
  },
  {
    levelId: 3,
    title: "Račići traže kućicu",
    subtitle: "Broji račiće do sigurnog kruga.",
    theme: "Mirni račići",
    countingTheme: "crabs",
    range: [1, 6],
    itemKind: "crab",
    itemName: "račića",
    itemSingular: "račića",
    isFree: false,
    storyGoal: "Račići trebaju pomoć da dođu do sigurnog pješčanog kruga.",
    reward: "crab-wave",
    collectTarget: 4,
    sandboxLabel: "Dodirni račiće da mahnu Njamku.",
    tasks: [
      { type: "count-visible", title: "Prebroji račiće", instruction: "Koliko je račića u pijesku?", visibleCount: 4, options: [3, 4, 5] },
      { type: "collect-quantity", title: "Sigurni krug", instruction: "Dovedi 4 račića u sigurni krug.", targetNumber: 4, availableItems: 6 },
      { type: "number-path", title: "Račići u redu", instruction: "Složi račiće od 1 do 6.", sequenceMax: 6 },
    ],
  },
  {
    levelId: 4,
    title: "Morske zvijezde na stazi",
    subtitle: "Popravi svjetleću brojevnu stazu.",
    theme: "Morske zvijezde",
    countingTheme: "sea-stars",
    range: [1, 8],
    itemKind: "starfish",
    itemName: "morskih zvijezda",
    itemSingular: "morsku zvijezdu",
    isFree: false,
    storyGoal: "Njamko popravlja svjetleću morsku stazu.",
    reward: "glowing-path",
    collectTarget: 8,
    sandboxLabel: "Dodirni zvijezde da zasvijetle.",
    tasks: [
      { type: "missing-number", title: "Koji broj nedostaje?", instruction: "Pronađi broj koji nedostaje.", path: [1, 2, null, 4], answer: 3, options: [2, 3, 5] },
      { type: "place-on-path", title: "Zvijezde na mjesta", instruction: "Stavi zvijezde na brojeve.", sequenceMax: 8 },
      { type: "complete-path", title: "Svjetleća staza", instruction: "Upali stazu od 1 do 8.", sequenceMax: 8 },
    ],
  },
  {
    levelId: 5,
    title: "Plažni sajam brojeva",
    subtitle: "Pronađi, skupi i složi brojeve do 10.",
    theme: "Plažni sajam",
    countingTheme: "beach-fair",
    range: [1, 10],
    itemKind: "beachball",
    itemName: "školjki",
    itemSingular: "školjku",
    isFree: false,
    storyGoal: "Njamko otvara plažni sajam, ali brojevi moraju biti spremni.",
    reward: "fair-flag",
    collectTarget: 7,
    sandboxLabel: "Dodirni štand, zastavicu i košaricu.",
    tasks: [
      { type: "find-number", title: "Broj za sajam", instruction: "Nađi broj 7.", sequence: [7] },
      { type: "collect-quantity", title: "Košarica za sajam", instruction: "Stavi 7 školjki u košaricu.", targetNumber: 7, availableItems: 10, itemKind: "shell" },
      { type: "build-order", title: "Brojevi su spremni", instruction: "Složi brojeve od 1 do 10.", sequenceMax: 10 },
    ],
  },
];

function createCountingItems(kind, maxNumber) {
  const positions = COUNTING_FIND_POSITIONS[maxNumber];
  return Array.from({ length: maxNumber }, (_, index) => {
    const number = index + 1;
    return {
      id: kind + "-" + number,
      kind,
      type: kind,
      number,
      x: positions[index][0],
      y: positions[index][1],
    };
  });
}

function createCountingSequence(config, task) {
  if (task.sequence) return task.sequence;
  const maxNumber = task.sequenceMax ?? config.range[1];
  return Array.from({ length: maxNumber }, (_, index) => index + 1);
}

function createCountingMissionTask(config, task, index) {
  const sequence = createCountingSequence(config, task);
  const itemKind = task.itemKind ?? config.itemKind;
  const maxNumber = Math.max(...sequence, task.visibleCount ?? 0, task.targetNumber ?? 0, config.range[1]);

  return {
    id: "counting-l" + config.levelId + "-task-" + (index + 1),
    modeId: "counting",
    levelId: config.levelId,
    title: task.title,
    type: task.type,
    instruction: task.instruction,
    sequence,
    range: config.range,
    itemKind,
    itemName: config.itemName,
    itemSingular: config.itemSingular,
    reward: config.reward,
    targetNumber: task.targetNumber ?? sequence.length,
    availableItems: task.availableItems ?? task.targetNumber ?? sequence.length,
    visibleCount: task.visibleCount,
    options: task.options,
    path: task.path,
    answer: task.answer,
    items: createCountingItems(itemKind, maxNumber).filter((item) => sequence.includes(item.number)),
    mobileBackgroundImage: "/assets/backgrounds/counting-level-" + config.levelId + ".webp",
  };
}

function createCountingMissionLevel(config) {
  const tasks = config.tasks.map((task, index) => createCountingMissionTask(config, task, index));

  return {
    id: config.levelId,
    missionId: "counting-l" + config.levelId,
    modeId: "counting",
    levelId: config.levelId,
    title: config.title,
    subtitle: config.subtitle,
    theme: config.theme,
    countingTheme: config.countingTheme,
    range: config.range,
    maxNumber: config.range[1],
    isFree: config.isFree,
    storyGoal: config.storyGoal,
    reward: config.reward,
    sandboxDurationMs: 12000,
    sandboxLabel: config.sandboxLabel,
    mobileBackgroundImage: "/assets/backgrounds/counting-level-" + config.levelId + ".webp",
    tasks,
    rounds: tasks,
  };
}

export const njamkoModes = {
  "food": {
    "id": "food",
    "title": "Nahrani životinju",
    "icon": "🍎",
    "description": "Odaberi što životinja voli jesti.",
    "levelSelectSubtitle": "Odaberi razinu i kreni hraniti životinje.",
    "levels": [
      {
        "id": 1,
        "title": "Razina 1",
        "theme": "Osnovne životinje",
        "isFree": true,
        "rounds": [
          {
            "mode": "food",
            "prompt": "Zeko je gladan!",
            "question": "Što jede zeko?",
            "successText": "Bravo! Zeko voli hrskavu mrkvu.",
            "mainLabel": "Zeko",
            "mainEmoji": "🐰",
            "mainImage": "/assets/animals/rabbit.webp",
            "mobileBackgroundImage": "/assets/backgrounds/food-rabbit-mobile.webp",
            "mobileAnswerRow": true,
            "mobileLoopVideoCard": true,
            "correctAnswer": "Mrkva",
            "options": [
              {
                "name": "Mrkva",
                "emoji": "🥕",
                "image": "/assets/foods/carrot.webp"
              },
              {
                "name": "Banana",
                "emoji": "🍌",
                "image": "/assets/foods/banana.webp"
              },
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Majmun je gladan!",
            "question": "Što jede majmun?",
            "successText": "Bravo! Majmun najviše voli bananu.",
            "mainLabel": "Majmun",
            "mainEmoji": "🐵",
            "mainImage": "/assets/animals/monkey.webp",
            "mobileBackgroundImage": "/assets/backgrounds/food-monkey-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Banana",
            "options": [
              {
                "name": "Banana",
                "emoji": "🍌",
                "image": "/assets/foods/banana.webp"
              },
              {
                "name": "Salata",
                "emoji": "🥬",
                "image": "/assets/foods/lettuce.webp"
              },
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Mačka je gladna!",
            "question": "Što jede mačka?",
            "successText": "Bravo! Mačka voli ukusnu ribu.",
            "mainLabel": "Mačka",
            "mainEmoji": "🐱",
            "mainImage": "/assets/animals/cat.webp",
            "mobileBackgroundImage": "/assets/backgrounds/food-cat-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Riba",
            "options": [
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              },
              {
                "name": "Mrkva",
                "emoji": "🥕",
                "image": "/assets/foods/carrot.webp"
              },
              {
                "name": "Trava",
                "emoji": "🌿",
                "image": "/assets/foods/grass.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Pas je gladan!",
            "question": "Što jede pas?",
            "successText": "Bravo! Pas voli pseći keksić.",
            "mainLabel": "Pas",
            "mainEmoji": "🐶",
            "mainImage": "/assets/animals/dog.webp",
            "mobileBackgroundImage": "/assets/backgrounds/food-dog-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Pseći keksić",
            "options": [
              {
                "name": "Pseći keksić",
                "emoji": "🍪"
              },
              {
                "name": "Banana",
                "emoji": "🍌",
                "image": "/assets/foods/banana.webp"
              },
              {
                "name": "Salata",
                "emoji": "🥬",
                "image": "/assets/foods/lettuce.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Krava je gladna!",
            "question": "Što jede krava?",
            "successText": "Bravo! Krava voli svježu travu.",
            "mainLabel": "Krava",
            "mainEmoji": "🐮",
            "mainImage": "/assets/animals/cow.webp",
            "mobileBackgroundImage": "/assets/backgrounds/food-cow-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Trava",
            "options": [
              {
                "name": "Trava",
                "emoji": "🌿",
                "image": "/assets/foods/grass.webp"
              },
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              },
              {
                "name": "Med",
                "emoji": "🍯",
                "image": "/assets/foods/honey.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Miš je gladan!",
            "question": "Što jede miš?",
            "successText": "Bravo! Miš voli sir.",
            "mainLabel": "Miš",
            "mainEmoji": "🐭",
            "mainImage": "/assets/animals/mouse.webp",
            "mobileBackgroundImage": "/assets/backgrounds/food-mouse-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Sir",
            "options": [
              {
                "name": "Sir",
                "emoji": "🧀"
              },
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              },
              {
                "name": "Kaktus",
                "emoji": "🌵"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Konj je gladan!",
            "question": "Što jede konj?",
            "successText": "Bravo! Konj voli slatku jabuku.",
            "mainLabel": "Konj",
            "mainEmoji": "🐴",
            "mainImage": "/assets/animals/horse.webp",
            "mobileBackgroundImage": "/assets/backgrounds/food-horse-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Jabuka",
            "options": [
              {
                "name": "Jabuka",
                "emoji": "🍎",
                "image": "/assets/foods/apple.webp"
              },
              {
                "name": "Alge",
                "emoji": "🌊",
                "image": "/assets/foods/algae.webp"
              },
              {
                "name": "Med",
                "emoji": "🍯",
                "image": "/assets/foods/honey.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Vjeverica je gladna!",
            "question": "Što jede vjeverica?",
            "successText": "Bravo! Vjeverica voli lješnjak.",
            "mainLabel": "Vjeverica",
            "mainEmoji": "🐿️",
            "mainImage": "/assets/animals/squirrel.webp",
            "mobileBackgroundImage": "/assets/backgrounds/food-squirrel-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Lješnjak",
            "options": [
              {
                "name": "Lješnjak",
                "emoji": "🌰",
                "image": "/assets/foods/hazelnut.webp"
              },
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              },
              {
                "name": "Salata",
                "emoji": "🥬",
                "image": "/assets/foods/lettuce.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Ovca je gladna!",
            "question": "Što jede ovca?",
            "successText": "Bravo! Ovca voli meko sijeno.",
            "mainLabel": "Ovca",
            "mainEmoji": "🐑",
            "mainImage": "/assets/animals/sheep.webp",
            "mobileBackgroundImage": "/assets/backgrounds/food-sheep-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Sijeno",
            "options": [
              {
                "name": "Sijeno",
                "emoji": "🍂",
                "image": "/assets/foods/hay.webp"
              },
              {
                "name": "Banana",
                "emoji": "🍌",
                "image": "/assets/foods/banana.webp"
              },
              {
                "name": "Račići",
                "emoji": "🦐"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Kanarinac je gladan!",
            "question": "Što jede kanarinac?",
            "successText": "Bravo! Kanarinac voli sjemenke.",
            "mainLabel": "Kanarinac",
            "mainEmoji": "🐦",
            "mobileBackgroundImage": "/assets/backgrounds/food-canary-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Sjemenke",
            "options": [
              {
                "name": "Sjemenke",
                "emoji": "🌾",
                "image": "/assets/foods/seeds.webp"
              },
              {
                "name": "Kaktus",
                "emoji": "🌵"
              },
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              }
            ]
          }
        ]
      },
      {
        "id": 2,
        "title": "Razina 2",
        "theme": "Farma",
        "isFree": false,
        "rounds": [
          {
            "mode": "food",
            "prompt": "Kokoš je gladna!",
            "question": "Što jede kokoš?",
            "successText": "Bravo! Kokoš voli kukuruz.",
            "mainLabel": "Kokoš",
            "mainEmoji": "🐔",
            "mobileBackgroundImage": "/assets/backgrounds/food-chicken-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Kukuruz",
            "options": [
              {
                "name": "Kukuruz",
                "emoji": "🌽"
              },
              {
                "name": "Med",
                "emoji": "🍯",
                "image": "/assets/foods/honey.webp"
              },
              {
                "name": "Kaktus",
                "emoji": "🌵"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Patka je gladna!",
            "question": "Što jede patka?",
            "successText": "Bravo! Patka voli sjemenke.",
            "mainLabel": "Patka",
            "mainEmoji": "🦆",
            "mobileBackgroundImage": "/assets/backgrounds/food-duck-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Sjemenke",
            "options": [
              {
                "name": "Sjemenke",
                "emoji": "🌾",
                "image": "/assets/foods/seeds.webp"
              },
              {
                "name": "Meso",
                "emoji": "🥩"
              },
              {
                "name": "Kaktus",
                "emoji": "🌵"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Svinja je gladna!",
            "question": "Što jede svinja?",
            "successText": "Bravo! Svinja voli bundevu.",
            "mainLabel": "Svinja",
            "mainEmoji": "🐷",
            "mobileBackgroundImage": "/assets/backgrounds/food-pig-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Bundeva",
            "options": [
              {
                "name": "Bundeva",
                "emoji": "🎃"
              },
              {
                "name": "Bambus",
                "emoji": "🎋"
              },
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Koza je gladna!",
            "question": "Što jede koza?",
            "successText": "Bravo! Koza voli svježe lišće.",
            "mainLabel": "Koza",
            "mainEmoji": "🐐",
            "mobileBackgroundImage": "/assets/backgrounds/food-goat-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Lišće",
            "options": [
              {
                "name": "Lišće",
                "emoji": "🍃",
                "image": "/assets/foods/leaves.webp"
              },
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              },
              {
                "name": "Med",
                "emoji": "🍯",
                "image": "/assets/foods/honey.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Magarac je gladan!",
            "question": "Što jede magarac?",
            "successText": "Bravo! Magarac voli sijeno.",
            "mainLabel": "Magarac",
            "mainEmoji": "🫏",
            "mobileBackgroundImage": "/assets/backgrounds/food-donkey-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Sijeno",
            "options": [
              {
                "name": "Sijeno",
                "emoji": "🍂",
                "image": "/assets/foods/hay.webp"
              },
              {
                "name": "Banana",
                "emoji": "🍌",
                "image": "/assets/foods/banana.webp"
              },
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Purica je gladna!",
            "question": "Što jede purica?",
            "successText": "Bravo! Purica voli kukuruz.",
            "mainLabel": "Purica",
            "mainEmoji": "🦃",
            "mobileBackgroundImage": "/assets/backgrounds/food-turkey-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Kukuruz",
            "options": [
              {
                "name": "Kukuruz",
                "emoji": "🌽"
              },
              {
                "name": "Med",
                "emoji": "🍯",
                "image": "/assets/foods/honey.webp"
              },
              {
                "name": "Kaktus",
                "emoji": "🌵"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Guska je gladna!",
            "question": "Što jede guska?",
            "successText": "Bravo! Guska voli zelenu travu.",
            "mainLabel": "Guska",
            "mainEmoji": "🪿",
            "mobileBackgroundImage": "/assets/backgrounds/food-goose-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Trava",
            "options": [
              {
                "name": "Trava",
                "emoji": "🌿",
                "image": "/assets/foods/grass.webp"
              },
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              },
              {
                "name": "Med",
                "emoji": "🍯",
                "image": "/assets/foods/honey.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Lama je gladna!",
            "question": "Što jede lama?",
            "successText": "Bravo! Lama voli sijeno.",
            "mainLabel": "Lama",
            "mainEmoji": "🦙",
            "mobileBackgroundImage": "/assets/backgrounds/food-llama-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Sijeno",
            "options": [
              {
                "name": "Sijeno",
                "emoji": "🍂",
                "image": "/assets/foods/hay.webp"
              },
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              },
              {
                "name": "Kaktus",
                "emoji": "🌵"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Noj je gladan!",
            "question": "Što jede noj?",
            "successText": "Bravo! Noj voli sjemenke.",
            "mainLabel": "Noj",
            "mainEmoji": "🐦",
            "mobileBackgroundImage": "/assets/backgrounds/food-ostrich-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Sjemenke",
            "options": [
              {
                "name": "Sjemenke",
                "emoji": "🌾",
                "image": "/assets/foods/seeds.webp"
              },
              {
                "name": "Med",
                "emoji": "🍯",
                "image": "/assets/foods/honey.webp"
              },
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Golub je gladan!",
            "question": "Što jede golub?",
            "successText": "Bravo! Golub voli sjemenke.",
            "mainLabel": "Golub",
            "mainEmoji": "🕊️",
            "mobileBackgroundImage": "/assets/backgrounds/food-pigeon-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Sjemenke",
            "options": [
              {
                "name": "Sjemenke",
                "emoji": "🌾",
                "image": "/assets/foods/seeds.webp"
              },
              {
                "name": "Salata",
                "emoji": "🥬",
                "image": "/assets/foods/lettuce.webp"
              },
              {
                "name": "Meso",
                "emoji": "🥩"
              }
            ]
          }
        ]
      },
      {
        "id": 3,
        "title": "Razina 3",
        "theme": "Šuma",
        "isFree": false,
        "rounds": [
          {
            "mode": "food",
            "prompt": "Jelen je gladan!",
            "question": "Što jede jelen?",
            "successText": "Bravo! Jelen voli lišće.",
            "mainLabel": "Jelen",
            "mainEmoji": "🦌",
            "mobileBackgroundImage": "/assets/backgrounds/food-deer-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Lišće",
            "options": [
              {
                "name": "Lišće",
                "emoji": "🍃",
                "image": "/assets/foods/leaves.webp"
              },
              {
                "name": "Banana",
                "emoji": "🍌",
                "image": "/assets/foods/banana.webp"
              },
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Lisica je gladna!",
            "question": "Što jede lisica?",
            "successText": "Bravo! Lisica voli meso.",
            "mainLabel": "Lisica",
            "mainEmoji": "🦊",
            "mobileBackgroundImage": "/assets/backgrounds/food-fox-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Meso",
            "options": [
              {
                "name": "Meso",
                "emoji": "🥩"
              },
              {
                "name": "Kukuruz",
                "emoji": "🌽"
              },
              {
                "name": "Salata",
                "emoji": "🥬",
                "image": "/assets/foods/lettuce.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Jež je gladan!",
            "question": "Što jede jež?",
            "successText": "Bravo! Jež voli slatku jabuku.",
            "mainLabel": "Jež",
            "mainEmoji": "🦔",
            "mobileBackgroundImage": "/assets/backgrounds/food-hedgehog-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Jabuka",
            "options": [
              {
                "name": "Jabuka",
                "emoji": "🍎",
                "image": "/assets/foods/apple.webp"
              },
              {
                "name": "Banana",
                "emoji": "🍌",
                "image": "/assets/foods/banana.webp"
              },
              {
                "name": "Bambus",
                "emoji": "🎋"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Dabar je gladan!",
            "question": "Što jede dabar?",
            "successText": "Bravo! Dabar gricka koru drveta.",
            "mainLabel": "Dabar",
            "mainEmoji": "🦫",
            "mobileBackgroundImage": "/assets/backgrounds/food-beaver-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Kora",
            "options": [
              {
                "name": "Kora",
                "emoji": "🪵"
              },
              {
                "name": "Banana",
                "emoji": "🍌",
                "image": "/assets/foods/banana.webp"
              },
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Sova je gladna!",
            "question": "Što jede sova?",
            "successText": "Bravo! Sova lovi kukce.",
            "mainLabel": "Sova",
            "mainEmoji": "🦉",
            "mobileBackgroundImage": "/assets/backgrounds/food-owl-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Kukci",
            "options": [
              {
                "name": "Kukci",
                "emoji": "🐛"
              },
              {
                "name": "Mrkva",
                "emoji": "🥕",
                "image": "/assets/foods/carrot.webp"
              },
              {
                "name": "Bambus",
                "emoji": "🎋"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Divlja svinja je gladna!",
            "question": "Što jede divlja svinja?",
            "successText": "Bravo! Divlja svinja voli žir.",
            "mainLabel": "Divlja svinja",
            "mainEmoji": "🐗",
            "mobileBackgroundImage": "/assets/backgrounds/food-wild-boar-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Žir",
            "options": [
              {
                "name": "Žir",
                "emoji": "🌰",
                "image": "/assets/foods/acorn.webp"
              },
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              },
              {
                "name": "Kaktus",
                "emoji": "🌵"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Medvjed je gladan!",
            "question": "Što jede medvjed?",
            "successText": "Bravo! Medvjed voli med.",
            "mainLabel": "Medvjed",
            "mainEmoji": "🐻",
            "mobileBackgroundImage": "/assets/backgrounds/food-bear-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Med",
            "options": [
              {
                "name": "Med",
                "emoji": "🍯",
                "image": "/assets/foods/honey.webp"
              },
              {
                "name": "Kaktus",
                "emoji": "🌵"
              },
              {
                "name": "Alge",
                "emoji": "🌊",
                "image": "/assets/foods/algae.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Leptir je gladan!",
            "question": "Što jede leptir?",
            "successText": "Bravo! Leptir pije nektar iz cvijeća.",
            "mainLabel": "Leptir",
            "mainEmoji": "🦋",
            "mobileBackgroundImage": "/assets/backgrounds/food-butterfly-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Nektar",
            "options": [
              {
                "name": "Nektar",
                "emoji": "🌸"
              },
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              },
              {
                "name": "Kukuruz",
                "emoji": "🌽"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Vuk je gladan!",
            "question": "Što jede vuk?",
            "successText": "Bravo! Vuk voli meso.",
            "mainLabel": "Vuk",
            "mainEmoji": "🐺",
            "mobileBackgroundImage": "/assets/backgrounds/food-wolf-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Meso",
            "options": [
              {
                "name": "Meso",
                "emoji": "🥩"
              },
              {
                "name": "Salata",
                "emoji": "🥬",
                "image": "/assets/foods/lettuce.webp"
              },
              {
                "name": "Banana",
                "emoji": "🍌",
                "image": "/assets/foods/banana.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Krtica je gladna!",
            "question": "Što jede krtica?",
            "successText": "Bravo! Krtica voli gliste.",
            "mainLabel": "Krtica",
            "mainEmoji": "🐾",
            "mobileBackgroundImage": "/assets/backgrounds/food-mole-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Gliste",
            "options": [
              {
                "name": "Gliste",
                "emoji": "🪱"
              },
              {
                "name": "Med",
                "emoji": "🍯",
                "image": "/assets/foods/honey.webp"
              },
              {
                "name": "Jabuka",
                "emoji": "🍎",
                "image": "/assets/foods/apple.webp"
              }
            ]
          }
        ]
      },
      {
        "id": 4,
        "title": "Razina 4",
        "theme": "Zoo / Savana",
        "isFree": false,
        "rounds": [
          {
            "mode": "food",
            "prompt": "Lav je gladan!",
            "question": "Što jede lav?",
            "successText": "Bravo! Lav voli meso.",
            "mainLabel": "Lav",
            "mainEmoji": "🦁",
            "mobileBackgroundImage": "/assets/backgrounds/food-lion-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Meso",
            "options": [
              {
                "name": "Meso",
                "emoji": "🥩"
              },
              {
                "name": "Salata",
                "emoji": "🥬",
                "image": "/assets/foods/lettuce.webp"
              },
              {
                "name": "Kora",
                "emoji": "🪵"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Slon je gladan!",
            "question": "Što jede slon?",
            "successText": "Bravo! Slon voli grane i lišće.",
            "mainLabel": "Slon",
            "mainEmoji": "🐘",
            "mobileBackgroundImage": "/assets/backgrounds/food-elephant-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Grane",
            "options": [
              {
                "name": "Grane",
                "emoji": "🌳",
                "image": "/assets/foods/branches.webp"
              },
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              },
              {
                "name": "Med",
                "emoji": "🍯",
                "image": "/assets/foods/honey.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Žirafa je gladna!",
            "question": "Što jede žirafa?",
            "successText": "Bravo! Žirafa voli lišće s visokih grana.",
            "mainLabel": "Žirafa",
            "mainEmoji": "🦒",
            "mobileBackgroundImage": "/assets/backgrounds/food-giraffe-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Lišće",
            "options": [
              {
                "name": "Lišće",
                "emoji": "🍃",
                "image": "/assets/foods/leaves.webp"
              },
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              },
              {
                "name": "Med",
                "emoji": "🍯",
                "image": "/assets/foods/honey.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Zebra je gladna!",
            "question": "Što jede zebra?",
            "successText": "Bravo! Zebra voli travu.",
            "mainLabel": "Zebra",
            "mainEmoji": "🦓",
            "mobileBackgroundImage": "/assets/backgrounds/food-zebra-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Trava",
            "options": [
              {
                "name": "Trava",
                "emoji": "🌿",
                "image": "/assets/foods/grass.webp"
              },
              {
                "name": "Banana",
                "emoji": "🍌",
                "image": "/assets/foods/banana.webp"
              },
              {
                "name": "Kora",
                "emoji": "🪵"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Panda je gladna!",
            "question": "Što jede panda?",
            "successText": "Bravo! Panda najviše voli bambus.",
            "mainLabel": "Panda",
            "mainEmoji": "🐼",
            "mobileBackgroundImage": "/assets/backgrounds/food-panda-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Bambus",
            "options": [
              {
                "name": "Bambus",
                "emoji": "🎋"
              },
              {
                "name": "Žir",
                "emoji": "🌰",
                "image": "/assets/foods/acorn.webp"
              },
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Klokan je gladan!",
            "question": "Što jede klokan?",
            "successText": "Bravo! Klokan voli travu.",
            "mainLabel": "Klokan",
            "mainEmoji": "🦘",
            "mobileBackgroundImage": "/assets/backgrounds/food-kangaroo-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Trava",
            "options": [
              {
                "name": "Trava",
                "emoji": "🌿",
                "image": "/assets/foods/grass.webp"
              },
              {
                "name": "Med",
                "emoji": "🍯",
                "image": "/assets/foods/honey.webp"
              },
              {
                "name": "Kora",
                "emoji": "🪵"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Papiga je gladna!",
            "question": "Što jede papiga?",
            "successText": "Bravo! Papiga voli sjemenke.",
            "mainLabel": "Papiga",
            "mainEmoji": "🦜",
            "mobileBackgroundImage": "/assets/backgrounds/food-parrot-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Sjemenke",
            "options": [
              {
                "name": "Sjemenke",
                "emoji": "🌾",
                "image": "/assets/foods/seeds.webp"
              },
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              },
              {
                "name": "Kaktus",
                "emoji": "🌵"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Pingvin je gladan!",
            "question": "Što jede pingvin?",
            "successText": "Bravo! Pingvin voli ribu.",
            "mainLabel": "Pingvin",
            "mainEmoji": "🐧",
            "mobileBackgroundImage": "/assets/backgrounds/food-penguin-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Riba",
            "options": [
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              },
              {
                "name": "Kaktus",
                "emoji": "🌵"
              },
              {
                "name": "Sjemenke",
                "emoji": "🌾",
                "image": "/assets/foods/seeds.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Kornjača je gladna!",
            "question": "Što jede kornjača?",
            "successText": "Bravo! Kornjača voli salatu.",
            "mainLabel": "Kornjača",
            "mainEmoji": "🐢",
            "mobileBackgroundImage": "/assets/backgrounds/food-turtle-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Salata",
            "options": [
              {
                "name": "Salata",
                "emoji": "🥬",
                "image": "/assets/foods/lettuce.webp"
              },
              {
                "name": "Med",
                "emoji": "🍯",
                "image": "/assets/foods/honey.webp"
              },
              {
                "name": "Kora",
                "emoji": "🪵"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Krokodil je gladan!",
            "question": "Što jede krokodil?",
            "successText": "Bravo! Krokodil voli meso.",
            "mainLabel": "Krokodil",
            "mainEmoji": "🐊",
            "mobileBackgroundImage": "/assets/backgrounds/food-crocodile-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Meso",
            "options": [
              {
                "name": "Meso",
                "emoji": "🥩"
              },
              {
                "name": "Nektar",
                "emoji": "🌸"
              },
              {
                "name": "Trava",
                "emoji": "🌿",
                "image": "/assets/foods/grass.webp"
              }
            ]
          }
        ]
      },
      {
        "id": 5,
        "title": "Razina 5",
        "theme": "Mali izazov",
        "isFree": false,
        "rounds": [
          {
            "mode": "food",
            "prompt": "Deva je gladna!",
            "question": "Što jede deva?",
            "successText": "Bravo! Deva voli kaktus.",
            "mainLabel": "Deva",
            "mainEmoji": "🐪",
            "mobileBackgroundImage": "/assets/backgrounds/food-camel-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Kaktus",
            "options": [
              {
                "name": "Kaktus",
                "emoji": "🌵"
              },
              {
                "name": "Banana",
                "emoji": "🍌",
                "image": "/assets/foods/banana.webp"
              },
              {
                "name": "Med",
                "emoji": "🍯",
                "image": "/assets/foods/honey.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Koala je gladna!",
            "question": "Što jede koala?",
            "successText": "Bravo! Koala voli eukaliptus.",
            "mainLabel": "Koala",
            "mainEmoji": "🐨",
            "mobileBackgroundImage": "/assets/backgrounds/food-koala-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Eukaliptus",
            "options": [
              {
                "name": "Eukaliptus",
                "emoji": "🌴",
                "image": "/assets/foods/eucalyptus.webp"
              },
              {
                "name": "Bambus",
                "emoji": "🎋"
              },
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Flamingo je gladan!",
            "question": "Što jede flamingo?",
            "successText": "Bravo! Flamingo voli račiće.",
            "mainLabel": "Flamingo",
            "mainEmoji": "🦩",
            "mobileBackgroundImage": "/assets/backgrounds/food-flamingo-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Račići",
            "options": [
              {
                "name": "Račići",
                "emoji": "🦐"
              },
              {
                "name": "Sjemenke",
                "emoji": "🌾",
                "image": "/assets/foods/seeds.webp"
              },
              {
                "name": "Banana",
                "emoji": "🍌",
                "image": "/assets/foods/banana.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Kit je gladan!",
            "question": "Što jede kit?",
            "successText": "Bravo! Kit jede plankton.",
            "mainLabel": "Kit",
            "mainEmoji": "🐋",
            "mobileBackgroundImage": "/assets/backgrounds/food-whale-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Plankton",
            "options": [
              {
                "name": "Plankton",
                "emoji": "🦠",
                "image": "/assets/foods/plankton.webp"
              },
              {
                "name": "Trava",
                "emoji": "🌿",
                "image": "/assets/foods/grass.webp"
              },
              {
                "name": "Kukuruz",
                "emoji": "🌽"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Dupin je gladan!",
            "question": "Što jede dupin?",
            "successText": "Bravo! Dupin voli ribu.",
            "mainLabel": "Dupin",
            "mainEmoji": "🐬",
            "mobileBackgroundImage": "/assets/backgrounds/food-dolphin-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Riba",
            "options": [
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              },
              {
                "name": "Banana",
                "emoji": "🍌",
                "image": "/assets/foods/banana.webp"
              },
              {
                "name": "Kukuruz",
                "emoji": "🌽"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Rak je gladan!",
            "question": "Što jede rak?",
            "successText": "Bravo! Rak voli alge.",
            "mainLabel": "Rak",
            "mainEmoji": "🦞",
            "mobileBackgroundImage": "/assets/backgrounds/food-crab-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Alge",
            "options": [
              {
                "name": "Alge",
                "emoji": "🌊",
                "image": "/assets/foods/algae.webp"
              },
              {
                "name": "Jabuka",
                "emoji": "🍎",
                "image": "/assets/foods/apple.webp"
              },
              {
                "name": "Med",
                "emoji": "🍯",
                "image": "/assets/foods/honey.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Puž je gladan!",
            "question": "Što jede puž?",
            "successText": "Bravo! Puž voli salatu.",
            "mainLabel": "Puž",
            "mainEmoji": "🐌",
            "mobileBackgroundImage": "/assets/backgrounds/food-snail-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Salata",
            "options": [
              {
                "name": "Salata",
                "emoji": "🥬",
                "image": "/assets/foods/lettuce.webp"
              },
              {
                "name": "Riba",
                "emoji": "🐟",
                "image": "/assets/foods/fish.webp"
              },
              {
                "name": "Med",
                "emoji": "🍯",
                "image": "/assets/foods/honey.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Žaba je gladan!",
            "question": "Što jede žaba?",
            "successText": "Bravo! Žaba voli kukce.",
            "mainLabel": "Žaba",
            "mainEmoji": "🐸",
            "mobileBackgroundImage": "/assets/backgrounds/food-frog-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Kukci",
            "options": [
              {
                "name": "Kukci",
                "emoji": "🐛"
              },
              {
                "name": "Banana",
                "emoji": "🍌",
                "image": "/assets/foods/banana.webp"
              },
              {
                "name": "Sijeno",
                "emoji": "🍂",
                "image": "/assets/foods/hay.webp"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Hobotnica je gladan!",
            "question": "Što jede hobotnica?",
            "successText": "Bravo! Hobotnica voli školjke.",
            "mainLabel": "Hobotnica",
            "mainEmoji": "🐙",
            "mobileBackgroundImage": "/assets/backgrounds/food-octopus-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Školjke",
            "options": [
              {
                "name": "Školjke",
                "emoji": "🐚"
              },
              {
                "name": "Trava",
                "emoji": "🌿",
                "image": "/assets/foods/grass.webp"
              },
              {
                "name": "Bambus",
                "emoji": "🎋"
              }
            ]
          },
          {
            "mode": "food",
            "prompt": "Morski konjic je gladan!",
            "question": "Što jede morski konjic?",
            "successText": "Bravo! Morski konjic jede račiće.",
            "mainLabel": "Morski konjic",
            "mainEmoji": "🐠",
            "mobileBackgroundImage": "/assets/backgrounds/food-seahorse-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Račići",
            "options": [
              {
                "name": "Račići",
                "emoji": "🦐"
              },
              {
                "name": "Jabuka",
                "emoji": "🍎",
                "image": "/assets/foods/apple.webp"
              },
              {
                "name": "Kaktus",
                "emoji": "🌵"
              }
            ]
          }
        ]
      }
    ]
  },
  "home": {
    "id": "home",
    "title": "Pronađi dom",
    "icon": "🏡",
    "description": "Pomogni životinji pronaći gdje živi.",
    "levelSelectSubtitle": "Odaberi razinu i pomogni životinjama pronaći dom.",
    "levels": [
      {
        "id": 1,
        "title": "Razina 1",
        "theme": "Osnovni domovi",
        "isFree": true,
        "rounds": [
          {
            "mode": "home",
            "prompt": "Riba traži svoj dom!",
            "question": "Gdje riba živi?",
            "mainLabel": "Riba",
            "mainEmoji": "🐟",
            "correctAnswer": "More",
            "options": [
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              },
              {
                "name": "Gnijezdo",
                "emoji": "🪺"
              },
              {
                "name": "Kućica",
                "emoji": "🏠"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-fish-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Ptica traži svoj dom!",
            "question": "Gdje ptica živi?",
            "mainLabel": "Ptica",
            "mainEmoji": "🐦",
            "correctAnswer": "Gnijezdo",
            "options": [
              {
                "name": "Gnijezdo",
                "emoji": "🪺"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              },
              {
                "name": "Mišja rupa",
                "emoji": "🕳️",
                "image": "/assets/homes/mouse-hole.webp"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l1-02-bird-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Pas traži svoj dom!",
            "question": "Gdje pas živi?",
            "mainLabel": "Pas",
            "mainEmoji": "🐶",
            "mainImage": "/assets/animals/dog.webp",
            "correctAnswer": "Kućica",
            "options": [
              {
                "name": "Kućica",
                "emoji": "🏠"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              },
              {
                "name": "Gnijezdo",
                "emoji": "🪺"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l1-03-dog-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Medo traži svoj dom!",
            "question": "Gdje medo živi?",
            "mainLabel": "Medo",
            "mainEmoji": "🐻",
            "mainImage": "/assets/animals/bear.webp",
            "correctAnswer": "Šuma",
            "options": [
              {
                "name": "Šuma",
                "emoji": "🌲"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              },
              {
                "name": "Košnica",
                "emoji": "🍯"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l1-04-bear-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Zeko traži svoj dom!",
            "question": "Gdje zeko živi?",
            "mainLabel": "Zeko",
            "mainEmoji": "🐰",
            "mainImage": "/assets/animals/rabbit.webp",
            "correctAnswer": "Zečja rupa",
            "options": [
              {
                "name": "Zečja rupa",
                "emoji": "🕳️",
                "image": "/assets/homes/mouse-hole.webp"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              },
              {
                "name": "Gnijezdo",
                "emoji": "🪺"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l1-05-rabbit-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Mačka traži svoj dom!",
            "question": "Gdje mačka živi?",
            "mainLabel": "Mačka",
            "mainEmoji": "🐱",
            "mainImage": "/assets/animals/cat.webp",
            "correctAnswer": "Kuća",
            "options": [
              {
                "name": "Kuća",
                "emoji": "🏠"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              },
              {
                "name": "Gnijezdo",
                "emoji": "🪺"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l1-06-cat-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Pčela traži svoj dom!",
            "question": "Gdje pčela živi?",
            "mainLabel": "Pčela",
            "mainEmoji": "🐝",
            "correctAnswer": "Košnica",
            "options": [
              {
                "name": "Košnica",
                "emoji": "🍯"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              },
              {
                "name": "Špilja",
                "emoji": "⛰️",
                "image": "/assets/homes/mountain-cave.webp"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l1-07-bee-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Miš traži svoj dom!",
            "question": "Gdje miš živi?",
            "mainLabel": "Miš",
            "mainEmoji": "🐭",
            "mainImage": "/assets/animals/mouse.webp",
            "correctAnswer": "Mišja rupa",
            "options": [
              {
                "name": "Mišja rupa",
                "emoji": "🕳️",
                "image": "/assets/homes/mouse-hole.webp"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              },
              {
                "name": "Gnijezdo",
                "emoji": "🪺"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l1-08-mouse-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Leptir traži svoj dom!",
            "question": "Gdje leptir živi?",
            "mainLabel": "Leptir",
            "mainEmoji": "🦋",
            "correctAnswer": "Cvjetna livada",
            "options": [
              {
                "name": "Cvjetna livada",
                "emoji": "🌼"
              },
              {
                "name": "Kućica",
                "emoji": "🏠"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l1-09-butterfly-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Krtica traži svoj dom!",
            "question": "Gdje krtica živi?",
            "mainLabel": "Krtica",
            "mainEmoji": "🐾",
            "correctAnswer": "Tunel pod zemljom",
            "options": [
              {
                "name": "Tunel pod zemljom",
                "emoji": "🕳️",
                "image": "/assets/homes/underground.webp"
              },
              {
                "name": "Gnijezdo",
                "emoji": "🪺"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l1-10-mole-mobile.webp",
            "mobileAnswerRow": true
          }
        ]
      },
      {
        "id": 2,
        "title": "Razina 2",
        "theme": "Farma",
        "isFree": false,
        "rounds": [
          {
            "mode": "home",
            "prompt": "Kokoš traži svoj dom!",
            "question": "Gdje kokoš živi?",
            "mainLabel": "Kokoš",
            "mainEmoji": "🐔",
            "correctAnswer": "Kokošinjac",
            "options": [
              {
                "name": "Kokošinjac",
                "emoji": "🐔",
                "image": "/assets/homes/chicken-coop.webp"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              },
              {
                "name": "Špilja",
                "emoji": "⛰️",
                "image": "/assets/homes/mountain-cave.webp"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l2-01-chicken-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Svinja traži svoj dom!",
            "question": "Gdje svinja živi?",
            "mainLabel": "Svinja",
            "mainEmoji": "🐷",
            "correctAnswer": "Svinjac",
            "options": [
              {
                "name": "Svinjac",
                "emoji": "🐷",
                "image": "/assets/homes/pigsty.webp"
              },
              {
                "name": "Gnijezdo",
                "emoji": "🪺"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l2-02-pig-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Konj traži svoj dom!",
            "question": "Gdje konj živi?",
            "mainLabel": "Konj",
            "mainEmoji": "🐴",
            "mainImage": "/assets/animals/horse.webp",
            "correctAnswer": "Staja",
            "options": [
              {
                "name": "Staja",
                "emoji": "🏚️",
                "image": "/assets/homes/barn.webp"
              },
              {
                "name": "Košnica",
                "emoji": "🍯"
              },
              {
                "name": "Bara",
                "emoji": "🪷",
                "image": "/assets/homes/pond-lilies.webp"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l2-03-horse-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Krava traži svoj dom!",
            "question": "Gdje krava živi?",
            "mainLabel": "Krava",
            "mainEmoji": "🐮",
            "mainImage": "/assets/animals/cow.webp",
            "correctAnswer": "Kravlja štala",
            "options": [
              {
                "name": "Kravlja štala",
                "emoji": "🏚️",
                "image": "/assets/homes/barn.webp"
              },
              {
                "name": "Gnijezdo",
                "emoji": "🪺"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l2-04-cow-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Ovca traži svoj dom!",
            "question": "Gdje ovca živi?",
            "mainLabel": "Ovca",
            "mainEmoji": "🐑",
            "mainImage": "/assets/animals/sheep.webp",
            "correctAnswer": "Pašnjak",
            "options": [
              {
                "name": "Pašnjak",
                "emoji": "🌿"
              },
              {
                "name": "Svinjac",
                "emoji": "🐷",
                "image": "/assets/homes/pigsty.webp"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l2-05-sheep-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Koza traži svoj dom!",
            "question": "Gdje koza živi?",
            "mainLabel": "Koza",
            "mainEmoji": "🐐",
            "correctAnswer": "Brdo",
            "options": [
              {
                "name": "Brdo",
                "emoji": "⛰️"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              },
              {
                "name": "Košnica",
                "emoji": "🍯"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l2-06-goat-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Purica traži svoj dom!",
            "question": "Gdje purica živi?",
            "mainLabel": "Purica",
            "mainEmoji": "🦃",
            "correctAnswer": "Seosko dvorište",
            "options": [
              {
                "name": "Seosko dvorište",
                "emoji": "🏡"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              },
              {
                "name": "Špilja",
                "emoji": "⛰️",
                "image": "/assets/homes/mountain-cave.webp"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l2-07-turkey-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Guska traži svoj dom!",
            "question": "Gdje guska živi?",
            "mainLabel": "Guska",
            "mainEmoji": "🪿",
            "correctAnswer": "Ribnjak",
            "options": [
              {
                "name": "Ribnjak",
                "emoji": "🪷",
                "image": "/assets/homes/pond-lilies.webp"
              },
              {
                "name": "Košnica",
                "emoji": "🍯"
              },
              {
                "name": "Pustinja",
                "emoji": "🏜️"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l2-08-goose-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Magarac traži svoj dom!",
            "question": "Gdje magarac živi?",
            "mainLabel": "Magarac",
            "mainEmoji": "🫏",
            "correctAnswer": "Staja",
            "options": [
              {
                "name": "Staja",
                "emoji": "🏚️",
                "image": "/assets/homes/barn.webp"
              },
              {
                "name": "Košnica",
                "emoji": "🍯"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l2-09-donkey-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Pijetao traži svoj dom!",
            "question": "Gdje pijetao živi?",
            "mainLabel": "Pijetao",
            "mainEmoji": "🐓",
            "correctAnswer": "Kokošinjac",
            "options": [
              {
                "name": "Kokošinjac",
                "emoji": "🐔",
                "image": "/assets/homes/chicken-coop.webp"
              },
              {
                "name": "Ribnjak",
                "emoji": "🪷",
                "image": "/assets/homes/pond-lilies.webp"
              },
              {
                "name": "Špilja",
                "emoji": "⛰️",
                "image": "/assets/homes/mountain-cave.webp"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l2-10-rooster-mobile.webp",
            "mobileAnswerRow": true
          }
        ]
      },
      {
        "id": 3,
        "title": "Razina 3",
        "theme": "Šuma",
        "isFree": false,
        "rounds": [
          {
            "mode": "home",
            "prompt": "Lisica traži svoj dom!",
            "question": "Gdje lisica živi?",
            "mainLabel": "Lisica",
            "mainEmoji": "🦊",
            "correctAnswer": "Jazbina",
            "options": [
              {
                "name": "Jazbina",
                "emoji": "🕳️",
                "image": "/assets/homes/forest-burrow.webp"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              },
              {
                "name": "Gnijezdo",
                "emoji": "🪺"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l3-01-fox-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Vjeverica traži svoj dom!",
            "question": "Gdje vjeverica živi?",
            "mainLabel": "Vjeverica",
            "mainEmoji": "🐿️",
            "mainImage": "/assets/animals/squirrel.webp",
            "correctAnswer": "Duplja u drvetu",
            "options": [
              {
                "name": "Duplja u drvetu",
                "emoji": "🌳"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              },
              {
                "name": "Košnica",
                "emoji": "🍯"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l3-02-squirrel-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Sova traži svoj dom!",
            "question": "Gdje sova živi?",
            "mainLabel": "Sova",
            "mainEmoji": "🦉",
            "correctAnswer": "Gnijezdo na drvetu",
            "options": [
              {
                "name": "Gnijezdo na drvetu",
                "emoji": "🪺"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              },
              {
                "name": "Svinjac",
                "emoji": "🐷",
                "image": "/assets/homes/pigsty.webp"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l3-03-owl-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Jež traži svoj dom!",
            "question": "Gdje jež živi?",
            "mainLabel": "Jež",
            "mainEmoji": "🦔",
            "correctAnswer": "Gnijezdo od lišća",
            "options": [
              {
                "name": "Gnijezdo od lišća",
                "emoji": "🍂"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              },
              {
                "name": "Košnica",
                "emoji": "🍯"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l3-04-hedgehog-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Vuk traži svoj dom!",
            "question": "Gdje vuk živi?",
            "mainLabel": "Vuk",
            "mainEmoji": "🐺",
            "correctAnswer": "Šuma",
            "options": [
              {
                "name": "Šuma",
                "emoji": "🌲"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              },
              {
                "name": "Košnica",
                "emoji": "🍯"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l3-05-wolf-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Jelen traži svoj dom!",
            "question": "Gdje jelen živi?",
            "mainLabel": "Jelen",
            "mainEmoji": "🦌",
            "correctAnswer": "Šumska livada",
            "options": [
              {
                "name": "Šumska livada",
                "emoji": "🌲"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              },
              {
                "name": "Svinjac",
                "emoji": "🐷",
                "image": "/assets/homes/pigsty.webp"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l3-06-deer-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Dabar traži svoj dom!",
            "question": "Gdje dabar živi?",
            "mainLabel": "Dabar",
            "mainEmoji": "🦫",
            "correctAnswer": "Brana od grana",
            "options": [
              {
                "name": "Brana od grana",
                "emoji": "🪵",
                "image": "/assets/homes/dam.webp"
              },
              {
                "name": "Špilja",
                "emoji": "⛰️",
                "image": "/assets/homes/mountain-cave.webp"
              },
              {
                "name": "Košnica",
                "emoji": "🍯"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l3-07-beaver-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Medvjed traži svoj dom!",
            "question": "Gdje medvjed živi?",
            "mainLabel": "Medvjed",
            "mainEmoji": "🐻",
            "correctAnswer": "Špilja",
            "options": [
              {
                "name": "Špilja",
                "emoji": "⛰️",
                "image": "/assets/homes/mountain-cave.webp"
              },
              {
                "name": "Brana od grana",
                "emoji": "🪵",
                "image": "/assets/homes/dam.webp"
              },
              {
                "name": "Košnica",
                "emoji": "🍯"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l3-08-bear-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Divlja svinja traži svoj dom!",
            "question": "Gdje divlja svinja živi?",
            "mainLabel": "Divlja svinja",
            "mainEmoji": "🐗",
            "correctAnswer": "Šuma",
            "options": [
              {
                "name": "Šuma",
                "emoji": "🌲"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              },
              {
                "name": "Gnijezdo",
                "emoji": "🪺"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l3-09-wild-boar-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Puž traži svoj dom!",
            "question": "Gdje puž živi?",
            "mainLabel": "Puž",
            "mainEmoji": "🐌",
            "correctAnswer": "Kućica na leđima",
            "options": [
              {
                "name": "Kućica na leđima",
                "emoji": "🐚"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              },
              {
                "name": "Košnica",
                "emoji": "🍯"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l3-10-snail-mobile.webp",
            "mobileAnswerRow": true
          }
        ]
      },
      {
        "id": 4,
        "title": "Razina 4",
        "theme": "More i voda",
        "isFree": false,
        "rounds": [
          {
            "mode": "home",
            "prompt": "Krokodil traži svoj dom!",
            "question": "Gdje krokodil živi?",
            "mainLabel": "Krokodil",
            "mainEmoji": "🐊",
            "correctAnswer": "Rijeka",
            "options": [
              {
                "name": "Rijeka",
                "emoji": "🏞️",
                "image": "/assets/homes/river.webp"
              },
              {
                "name": "Pustinja",
                "emoji": "🏜️"
              },
              {
                "name": "Gnijezdo",
                "emoji": "🪺"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l4-01-crocodile-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Dupin traži svoj dom!",
            "question": "Gdje dupin živi?",
            "mainLabel": "Dupin",
            "mainEmoji": "🐬",
            "correctAnswer": "More",
            "options": [
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              },
              {
                "name": "Šuma",
                "emoji": "🌲"
              },
              {
                "name": "Bara",
                "emoji": "🪷",
                "image": "/assets/homes/pond-lilies.webp"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l4-02-dolphin-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Kit traži svoj dom!",
            "question": "Gdje kit živi?",
            "mainLabel": "Kit",
            "mainEmoji": "🐋",
            "correctAnswer": "Ocean",
            "options": [
              {
                "name": "Ocean",
                "emoji": "🌊"
              },
              {
                "name": "Šuma",
                "emoji": "🌲"
              },
              {
                "name": "Pustinja",
                "emoji": "🏜️"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l4-03-whale-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Rak traži svoj dom!",
            "question": "Gdje rak živi?",
            "mainLabel": "Rak",
            "mainEmoji": "🦞",
            "correctAnswer": "Stijene uz obalu",
            "options": [
              {
                "name": "Stijene uz obalu",
                "emoji": "🪨"
              },
              {
                "name": "Šuma",
                "emoji": "🌲"
              },
              {
                "name": "Košnica",
                "emoji": "🍯"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l4-04-crab-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Vodena kornjača traži svoj dom!",
            "question": "Gdje vodena kornjača živi?",
            "mainLabel": "Vodena kornjača",
            "mainEmoji": "🐢",
            "correctAnswer": "Ribnjak",
            "options": [
              {
                "name": "Ribnjak",
                "emoji": "🪷",
                "image": "/assets/homes/pond-lilies.webp"
              },
              {
                "name": "Pustinja",
                "emoji": "🏜️"
              },
              {
                "name": "Gnijezdo",
                "emoji": "🪺"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l4-05-turtle-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Žaba traži svoj dom!",
            "question": "Gdje žaba živi?",
            "mainLabel": "Žaba",
            "mainEmoji": "🐸",
            "correctAnswer": "Bara",
            "options": [
              {
                "name": "Bara",
                "emoji": "🪷",
                "image": "/assets/homes/pond-lilies.webp"
              },
              {
                "name": "Pustinja",
                "emoji": "🏜️"
              },
              {
                "name": "Kokošinjac",
                "emoji": "🐔",
                "image": "/assets/homes/chicken-coop.webp"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l4-06-frog-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Patka traži svoj dom!",
            "question": "Gdje patka živi?",
            "mainLabel": "Patka",
            "mainEmoji": "🦆",
            "correctAnswer": "Jezero",
            "options": [
              {
                "name": "Jezero",
                "emoji": "💧"
              },
              {
                "name": "Špilja",
                "emoji": "⛰️",
                "image": "/assets/homes/mountain-cave.webp"
              },
              {
                "name": "Pustinja",
                "emoji": "🏜️"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l4-07-duck-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Pingvin traži svoj dom!",
            "question": "Gdje pingvin živi?",
            "mainLabel": "Pingvin",
            "mainEmoji": "🐧",
            "correctAnswer": "Ledena obala",
            "options": [
              {
                "name": "Ledena obala",
                "emoji": "🧊"
              },
              {
                "name": "Pustinja",
                "emoji": "🏜️"
              },
              {
                "name": "Prašuma",
                "emoji": "🌴"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l4-08-penguin-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Hobotnica traži svoj dom!",
            "question": "Gdje hobotnica živi?",
            "mainLabel": "Hobotnica",
            "mainEmoji": "🐙",
            "correctAnswer": "Morsko dno",
            "options": [
              {
                "name": "Morsko dno",
                "emoji": "🌊"
              },
              {
                "name": "Drvo",
                "emoji": "🌳"
              },
              {
                "name": "Pustinja",
                "emoji": "🏜️"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l4-09-octopus-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Morski konjić traži svoj dom!",
            "question": "Gdje morski konjić živi?",
            "mainLabel": "Morski konjić",
            "mainEmoji": "🐠",
            "correctAnswer": "Morska trava",
            "options": [
              {
                "name": "Morska trava",
                "emoji": "🌿"
              },
              {
                "name": "Ledena obala",
                "emoji": "🧊"
              },
              {
                "name": "Savana",
                "emoji": "🌅",
                "image": "/assets/homes/savanna.webp"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l4-10-seahorse-mobile.webp",
            "mobileAnswerRow": true
          }
        ]
      },
      {
        "id": 5,
        "title": "Razina 5",
        "theme": "Svijet",
        "isFree": false,
        "rounds": [
          {
            "mode": "home",
            "prompt": "Lav traži svoj dom!",
            "question": "Gdje lav živi?",
            "mainLabel": "Lav",
            "mainEmoji": "🦁",
            "correctAnswer": "Savana",
            "options": [
              {
                "name": "Savana",
                "emoji": "🌅",
                "image": "/assets/homes/savanna.webp"
              },
              {
                "name": "Arktički led",
                "emoji": "🧊"
              },
              {
                "name": "Pustinja",
                "emoji": "🏜️"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l5-01-lion-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Slon traži svoj dom!",
            "question": "Gdje slon živi?",
            "mainLabel": "Slon",
            "mainEmoji": "🐘",
            "correctAnswer": "Savana",
            "options": [
              {
                "name": "Savana",
                "emoji": "🌅",
                "image": "/assets/homes/savanna.webp"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              },
              {
                "name": "Arktički led",
                "emoji": "🧊"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l5-02-elephant-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Deva traži svoj dom!",
            "question": "Gdje deva živi?",
            "mainLabel": "Deva",
            "mainEmoji": "🐪",
            "correctAnswer": "Pustinja",
            "options": [
              {
                "name": "Pustinja",
                "emoji": "🏜️"
              },
              {
                "name": "Savana",
                "emoji": "🌅",
                "image": "/assets/homes/savanna.webp"
              },
              {
                "name": "Bambusova šuma",
                "emoji": "🎋"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l5-03-camel-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Panda traži svoj dom!",
            "question": "Gdje panda živi?",
            "mainLabel": "Panda",
            "mainEmoji": "🐼",
            "correctAnswer": "Bambusova šuma",
            "options": [
              {
                "name": "Bambusova šuma",
                "emoji": "🎋"
              },
              {
                "name": "Pustinja",
                "emoji": "🏜️"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l5-04-panda-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Koala traži svoj dom!",
            "question": "Gdje koala živi?",
            "mainLabel": "Koala",
            "mainEmoji": "🐨",
            "correctAnswer": "Eukaliptusovo stablo",
            "options": [
              {
                "name": "Eukaliptusovo stablo",
                "emoji": "🌳"
              },
              {
                "name": "Bambusova šuma",
                "emoji": "🎋"
              },
              {
                "name": "Arktički led",
                "emoji": "🧊"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l5-05-koala-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Klokan traži svoj dom!",
            "question": "Gdje klokan živi?",
            "mainLabel": "Klokan",
            "mainEmoji": "🦘",
            "correctAnswer": "Australska ravnica",
            "options": [
              {
                "name": "Australska ravnica",
                "emoji": "🌾"
              },
              {
                "name": "Prašuma",
                "emoji": "🌴"
              },
              {
                "name": "More",
                "emoji": "🌊",
                "image": "/assets/homes/sea.webp"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l5-06-kangaroo-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Tigar traži svoj dom!",
            "question": "Gdje tigar živi?",
            "mainLabel": "Tigar",
            "mainEmoji": "🐯",
            "correctAnswer": "Džungla",
            "options": [
              {
                "name": "Džungla",
                "emoji": "🌴"
              },
              {
                "name": "Arktički led",
                "emoji": "🧊"
              },
              {
                "name": "Pustinja",
                "emoji": "🏜️"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l5-07-tiger-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Papiga traži svoj dom!",
            "question": "Gdje papiga živi?",
            "mainLabel": "Papiga",
            "mainEmoji": "🦜",
            "correctAnswer": "Prašuma",
            "options": [
              {
                "name": "Prašuma",
                "emoji": "🌴"
              },
              {
                "name": "Pustinja",
                "emoji": "🏜️"
              },
              {
                "name": "Arktički led",
                "emoji": "🧊"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l5-08-parrot-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Flamingo traži svoj dom!",
            "question": "Gdje flamingo živi?",
            "mainLabel": "Flamingo",
            "mainEmoji": "🦩",
            "correctAnswer": "Plitko jezero",
            "options": [
              {
                "name": "Plitko jezero",
                "emoji": "💧"
              },
              {
                "name": "Pustinja",
                "emoji": "🏜️"
              },
              {
                "name": "Špilja",
                "emoji": "⛰️",
                "image": "/assets/homes/mountain-cave.webp"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l5-09-flamingo-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "home",
            "prompt": "Polarni medvjed traži svoj dom!",
            "question": "Gdje polarni medvjed živi?",
            "mainLabel": "Polarni medvjed",
            "mainEmoji": "🐻‍❄️",
            "correctAnswer": "Arktički led",
            "options": [
              {
                "name": "Arktički led",
                "emoji": "🧊"
              },
              {
                "name": "Bambusova šuma",
                "emoji": "🎋"
              },
              {
                "name": "Pustinja",
                "emoji": "🏜️"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/home-l5-10-polar-bear-mobile.webp",
            "mobileAnswerRow": true
          }
        ]
      }
    ]
  },
  "sound": {
    "id": "sound",
    "title": "Pogodi zvuk",
    "icon": "🔊",
    "description": "Poslušaj zvuk i odaberi životinju.",
    "levelSelectSubtitle": "Odaberi razinu i pogodi tko se glasa.",
    "levels": [
      {
        "id": 1,
        "title": "Razina 1",
        "theme": "Najpoznatiji zvukovi",
        "isFree": true,
        "rounds": [
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Muuu!",
            "soundSrc": "/assets/sounds/short/krava.mp3",
            "correctAnswer": "Krava",
            "options": [
              {
                "name": "Krava",
                "emoji": "🐮"
              },
              {
                "name": "Pijetao",
                "emoji": "🐓"
              },
              {
                "name": "Svinja",
                "emoji": "🐷"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l1-r01-cow-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Vau vau!",
            "soundSrc": "/assets/sounds/short/pas.mp3",
            "correctAnswer": "Pas",
            "options": [
              {
                "name": "Pas",
                "emoji": "🐶"
              },
              {
                "name": "Mačka",
                "emoji": "🐱"
              },
              {
                "name": "Patka",
                "emoji": "🦆"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l1-r02-dog-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Mijau!",
            "soundSrc": "/assets/sounds/short/macka.mp3",
            "correctAnswer": "Mačka",
            "options": [
              {
                "name": "Mačka",
                "emoji": "🐱"
              },
              {
                "name": "Pas",
                "emoji": "🐶"
              },
              {
                "name": "Miš",
                "emoji": "🐭"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l1-r03-cat-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "I-ha-ha!",
            "soundSrc": "/assets/sounds/short/konj.mp3",
            "correctAnswer": "Konj",
            "options": [
              {
                "name": "Konj",
                "emoji": "🐴"
              },
              {
                "name": "Krava",
                "emoji": "🐮"
              },
              {
                "name": "Ovca",
                "emoji": "🐑"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l1-r04-horse-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Kva kva!",
            "soundSrc": "/assets/sounds/short/patka.mp3",
            "correctAnswer": "Patka",
            "options": [
              {
                "name": "Patka",
                "emoji": "🦆"
              },
              {
                "name": "Žaba",
                "emoji": "🐸"
              },
              {
                "name": "Guska",
                "emoji": "🪿"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l1-r05-duck-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Beee!",
            "soundSrc": "/assets/sounds/short/ovca.mp3",
            "correctAnswer": "Ovca",
            "options": [
              {
                "name": "Ovca",
                "emoji": "🐑"
              },
              {
                "name": "Konj",
                "emoji": "🐴"
              },
              {
                "name": "Pčela",
                "emoji": "🐝"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l1-r06-sheep-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Kukuriku!",
            "soundSrc": "/assets/sounds/short/pijetao.mp3",
            "correctAnswer": "Pijetao",
            "options": [
              {
                "name": "Pijetao",
                "emoji": "🐓"
              },
              {
                "name": "Kokoš",
                "emoji": "🐔"
              },
              {
                "name": "Patka",
                "emoji": "🦆"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l1-r07-rooster-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Grok grok!",
            "soundSrc": "/assets/sounds/short/svinja.mp3",
            "correctAnswer": "Svinja",
            "options": [
              {
                "name": "Svinja",
                "emoji": "🐷"
              },
              {
                "name": "Krava",
                "emoji": "🐮"
              },
              {
                "name": "Pas",
                "emoji": "🐶"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l1-r08-pig-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Kre kre!",
            "soundSrc": "/assets/sounds/short/zaba.mp3",
            "correctAnswer": "Žaba",
            "options": [
              {
                "name": "Žaba",
                "emoji": "🐸"
              },
              {
                "name": "Patka",
                "emoji": "🦆"
              },
              {
                "name": "Pčela",
                "emoji": "🐝"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l1-r09-frog-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Bzzzz!",
            "soundSrc": "/assets/sounds/short/pcela.mp3",
            "correctAnswer": "Pčela",
            "options": [
              {
                "name": "Pčela",
                "emoji": "🐝"
              },
              {
                "name": "Žaba",
                "emoji": "🐸"
              },
              {
                "name": "Pijetao",
                "emoji": "🐓"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l1-r10-bee-mobile.webp",
            "mobileAnswerRow": true
          }
        ]
      },
      {
        "id": 2,
        "title": "Razina 2",
        "theme": "Domaće i dvorišne životinje",
        "isFree": false,
        "rounds": [
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Kokoda!",
            "soundSrc": "/assets/sounds/short/kokos.mp3",
            "correctAnswer": "Kokoš",
            "options": [
              {
                "name": "Kokoš",
                "emoji": "🐔"
              },
              {
                "name": "Pijetao",
                "emoji": "🐓"
              },
              {
                "name": "Guska",
                "emoji": "🪿"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l2-r01-chicken-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Meeeh!",
            "soundSrc": "/assets/sounds/short/koza.mp3",
            "correctAnswer": "Koza",
            "options": [
              {
                "name": "Koza",
                "emoji": "🐐"
              },
              {
                "name": "Konj",
                "emoji": "🐴"
              },
              {
                "name": "Svinja",
                "emoji": "🐷"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l2-r02-goat-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "I-ha!",
            "soundSrc": "/assets/sounds/short/magarac.mp3",
            "correctAnswer": "Magarac",
            "options": [
              {
                "name": "Magarac",
                "emoji": "🫏"
              },
              {
                "name": "Krava",
                "emoji": "🐮"
              },
              {
                "name": "Koza",
                "emoji": "🐐"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l2-r03-donkey-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Ga ga!",
            "soundSrc": "/assets/sounds/short/guska.mp3",
            "correctAnswer": "Guska",
            "options": [
              {
                "name": "Guska",
                "emoji": "🪿"
              },
              {
                "name": "Patka",
                "emoji": "🦆"
              },
              {
                "name": "Purica",
                "emoji": "🦃"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l2-r04-goose-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Gloglo!",
            "soundSrc": "/assets/sounds/short/purica.mp3",
            "correctAnswer": "Purica",
            "options": [
              {
                "name": "Purica",
                "emoji": "🦃"
              },
              {
                "name": "Kokoš",
                "emoji": "🐔"
              },
              {
                "name": "Pijetao",
                "emoji": "🐓"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l2-r05-turkey-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Gru gru!",
            "soundSrc": "/assets/sounds/short/golub.mp3",
            "correctAnswer": "Golub",
            "options": [
              {
                "name": "Golub",
                "emoji": "🕊️"
              },
              {
                "name": "Vrana",
                "emoji": "🐦‍⬛"
              },
              {
                "name": "Sova",
                "emoji": "🦉"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l2-r06-pigeon-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Ciju ciju!",
            "soundSrc": "/assets/sounds/short/mis.mp3",
            "correctAnswer": "Miš",
            "options": [
              {
                "name": "Miš",
                "emoji": "🐭"
              },
              {
                "name": "Mačka",
                "emoji": "🐱"
              },
              {
                "name": "Zmija",
                "emoji": "🐍"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l2-r07-mouse-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Šššš!",
            "soundSrc": "/assets/sounds/short/zmija.mp3",
            "correctAnswer": "Zmija",
            "options": [
              {
                "name": "Zmija",
                "emoji": "🐍"
              },
              {
                "name": "Miš",
                "emoji": "🐭"
              },
              {
                "name": "Žaba",
                "emoji": "🐸"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l2-r08-snake-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Cri-cri!",
            "soundSrc": "/assets/sounds/short/cvrcak.mp3",
            "correctAnswer": "Cvrčak",
            "options": [
              {
                "name": "Cvrčak",
                "emoji": "🦗"
              },
              {
                "name": "Pčela",
                "emoji": "🐝"
              },
              {
                "name": "Žaba",
                "emoji": "🐸"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l2-r09-cricket-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Zzzzzz!",
            "soundSrc": "/assets/sounds/short/komarac.mp3",
            "correctAnswer": "Komarac",
            "options": [
              {
                "name": "Komarac",
                "emoji": "🦟"
              },
              {
                "name": "Miš",
                "emoji": "🐭"
              },
              {
                "name": "Cvrčak",
                "emoji": "🦗"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l2-r10-mosquito-mobile.webp",
            "mobileAnswerRow": true
          }
        ]
      },
      {
        "id": 3,
        "title": "Razina 3",
        "theme": "Šuma i noćni zvukovi",
        "isFree": false,
        "rounds": [
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Hu hu!",
            "soundSrc": "/assets/sounds/short/sova.mp3",
            "correctAnswer": "Sova",
            "options": [
              {
                "name": "Sova",
                "emoji": "🦉"
              },
              {
                "name": "Vrana",
                "emoji": "🐦‍⬛"
              },
              {
                "name": "Vjeverica",
                "emoji": "🐿️"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l3-r01-owl-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Auuu!",
            "soundSrc": "/assets/sounds/short/vuk.mp3",
            "correctAnswer": "Vuk",
            "options": [
              {
                "name": "Vuk",
                "emoji": "🐺"
              },
              {
                "name": "Lisica",
                "emoji": "🦊"
              },
              {
                "name": "Jelen",
                "emoji": "🦌"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l3-r02-wolf-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Grrr!",
            "soundSrc": "/assets/sounds/short/medvjed.mp3",
            "correctAnswer": "Medvjed",
            "options": [
              {
                "name": "Medvjed",
                "emoji": "🐻"
              },
              {
                "name": "Vuk",
                "emoji": "🐺"
              },
              {
                "name": "Dabar",
                "emoji": "🦫"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l3-r03-bear-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Jip jip!",
            "soundSrc": "/assets/sounds/short/lisica.mp3",
            "correctAnswer": "Lisica",
            "options": [
              {
                "name": "Lisica",
                "emoji": "🦊"
              },
              {
                "name": "Jež",
                "emoji": "🦔"
              },
              {
                "name": "Sova",
                "emoji": "🦉"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l3-r04-fox-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Njušk njušk!",
            "soundSrc": "/assets/sounds/short/jez.mp3",
            "correctAnswer": "Jež",
            "options": [
              {
                "name": "Jež",
                "emoji": "🦔"
              },
              {
                "name": "Miš",
                "emoji": "🐭"
              },
              {
                "name": "Vjeverica",
                "emoji": "🐿️"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l3-r05-hedgehog-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Kra kra!",
            "soundSrc": "/assets/sounds/short/vrana.mp3",
            "correctAnswer": "Vrana",
            "options": [
              {
                "name": "Vrana",
                "emoji": "🐦‍⬛"
              },
              {
                "name": "Golub",
                "emoji": "🕊️"
              },
              {
                "name": "Sova",
                "emoji": "🦉"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l3-r06-crow-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Raaau!",
            "soundSrc": "/assets/sounds/short/jelen.mp3",
            "correctAnswer": "Jelen",
            "options": [
              {
                "name": "Jelen",
                "emoji": "🦌"
              },
              {
                "name": "Vuk",
                "emoji": "🐺"
              },
              {
                "name": "Lisica",
                "emoji": "🦊"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l3-r07-deer-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Pljus!",
            "soundSrc": "/assets/sounds/short/dabar.mp3",
            "correctAnswer": "Dabar",
            "options": [
              {
                "name": "Dabar",
                "emoji": "🦫"
              },
              {
                "name": "Vjeverica",
                "emoji": "🐿️"
              },
              {
                "name": "Medvjed",
                "emoji": "🐻"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l3-r08-beaver-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Cik cik!",
            "soundSrc": "/assets/sounds/short/vjeverica.mp3",
            "correctAnswer": "Vjeverica",
            "options": [
              {
                "name": "Vjeverica",
                "emoji": "🐿️"
              },
              {
                "name": "Jež",
                "emoji": "🦔"
              },
              {
                "name": "Vrana",
                "emoji": "🐦‍⬛"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l3-r09-squirrel-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Ciii!",
            "soundSrc": "/assets/sounds/short/sismis.mp3",
            "correctAnswer": "Šišmiš",
            "options": [
              {
                "name": "Šišmiš",
                "emoji": "🦇"
              },
              {
                "name": "Sova",
                "emoji": "🦉"
              },
              {
                "name": "Komarac",
                "emoji": "🦟"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l3-r10-bat-mobile.webp",
            "mobileAnswerRow": true
          }
        ]
      },
      {
        "id": 4,
        "title": "Razina 4",
        "theme": "Divlje životinje svijeta",
        "isFree": false,
        "rounds": [
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Roooar!",
            "soundSrc": "/assets/sounds/short/lav.mp3",
            "correctAnswer": "Lav",
            "options": [
              {
                "name": "Lav",
                "emoji": "🦁"
              },
              {
                "name": "Slon",
                "emoji": "🐘"
              },
              {
                "name": "Majmun",
                "emoji": "🐵"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l4-r01-lion-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Grrrau!",
            "soundSrc": "/assets/sounds/short/tigar.mp3",
            "correctAnswer": "Tigar",
            "options": [
              {
                "name": "Tigar",
                "emoji": "🐯"
              },
              {
                "name": "Lav",
                "emoji": "🦁"
              },
              {
                "name": "Krokodil",
                "emoji": "🐊"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l4-r02-tiger-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Truuu!",
            "soundSrc": "/assets/sounds/short/slon.mp3",
            "correctAnswer": "Slon",
            "options": [
              {
                "name": "Slon",
                "emoji": "🐘"
              },
              {
                "name": "Lav",
                "emoji": "🦁"
              },
              {
                "name": "Gorila",
                "emoji": "🦍"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l4-r03-elephant-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Uh uh ah ah!",
            "soundSrc": "/assets/sounds/short/majmun.mp3",
            "correctAnswer": "Majmun",
            "options": [
              {
                "name": "Majmun",
                "emoji": "🐵"
              },
              {
                "name": "Papiga",
                "emoji": "🦜"
              },
              {
                "name": "Slon",
                "emoji": "🐘"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l4-r04-monkey-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Kraa!",
            "soundSrc": "/assets/sounds/short/papiga.mp3",
            "correctAnswer": "Papiga",
            "options": [
              {
                "name": "Papiga",
                "emoji": "🦜"
              },
              {
                "name": "Majmun",
                "emoji": "🐵"
              },
              {
                "name": "Vrana",
                "emoji": "🐦‍⬛"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l4-r05-parrot-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Klap klap!",
            "soundSrc": "/assets/sounds/short/krokodil.mp3",
            "correctAnswer": "Krokodil",
            "options": [
              {
                "name": "Krokodil",
                "emoji": "🐊"
              },
              {
                "name": "Tigar",
                "emoji": "🐯"
              },
              {
                "name": "Papiga",
                "emoji": "🦜"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l4-r06-crocodile-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Mrrr!",
            "soundSrc": "/assets/sounds/short/deva.mp3",
            "correctAnswer": "Deva",
            "options": [
              {
                "name": "Deva",
                "emoji": "🐪"
              },
              {
                "name": "Slon",
                "emoji": "🐘"
              },
              {
                "name": "Nosorog",
                "emoji": "🦏"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l4-r07-camel-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Hi-hi-hi!",
            "soundSrc": "/assets/sounds/short/hijena.mp3",
            "correctAnswer": "Hijena",
            "options": [
              {
                "name": "Hijena",
                "emoji": "🐾"
              },
              {
                "name": "Lav",
                "emoji": "🦁"
              },
              {
                "name": "Majmun",
                "emoji": "🐵"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l4-r08-hyena-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Ugh ugh!",
            "soundSrc": "/assets/sounds/short/gorila.mp3",
            "correctAnswer": "Gorila",
            "options": [
              {
                "name": "Gorila",
                "emoji": "🦍"
              },
              {
                "name": "Majmun",
                "emoji": "🐵"
              },
              {
                "name": "Nosorog",
                "emoji": "🦏"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l4-r09-gorilla-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Frk frk!",
            "soundSrc": "/assets/sounds/short/nosorog.mp3",
            "correctAnswer": "Nosorog",
            "options": [
              {
                "name": "Nosorog",
                "emoji": "🦏"
              },
              {
                "name": "Slon",
                "emoji": "🐘"
              },
              {
                "name": "Deva",
                "emoji": "🐪"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l4-r10-rhino-mobile.webp",
            "mobileAnswerRow": true
          }
        ]
      },
      {
        "id": 5,
        "title": "Razina 5",
        "theme": "Zvukovi i staništa životinja",
        "isFree": false,
        "rounds": [
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Klik klik!",
            "soundSrc": "/assets/sounds/short/dupin.mp3",
            "correctAnswer": "Dupin",
            "options": [
              {
                "name": "Dupin",
                "emoji": "🐬"
              },
              {
                "name": "Kit",
                "emoji": "🐋"
              },
              {
                "name": "Tuljan",
                "emoji": "🦭"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l5-r01-dolphin-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Uuuuu!",
            "soundSrc": "/assets/sounds/short/kit.mp3",
            "correctAnswer": "Kit",
            "options": [
              {
                "name": "Kit",
                "emoji": "🐋"
              },
              {
                "name": "Dupin",
                "emoji": "🐬"
              },
              {
                "name": "Pingvin",
                "emoji": "🐧"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l5-r02-whale-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Aak aak!",
            "soundSrc": "/assets/sounds/short/pingvin.mp3",
            "correctAnswer": "Pingvin",
            "options": [
              {
                "name": "Pingvin",
                "emoji": "🐧"
              },
              {
                "name": "Galeb",
                "emoji": "🐦"
              },
              {
                "name": "Tuljan",
                "emoji": "🦭"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l5-r03-penguin-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Arf arf!",
            "soundSrc": "/assets/sounds/short/tuljan.mp3",
            "correctAnswer": "Tuljan",
            "options": [
              {
                "name": "Tuljan",
                "emoji": "🦭"
              },
              {
                "name": "Pingvin",
                "emoji": "🐧"
              },
              {
                "name": "Dupin",
                "emoji": "🐬"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l5-r04-seal-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Krii krii!",
            "soundSrc": "/assets/sounds/short/galeb.mp3",
            "correctAnswer": "Galeb",
            "options": [
              {
                "name": "Galeb",
                "emoji": "🐦"
              },
              {
                "name": "Golub",
                "emoji": "🕊️"
              },
              {
                "name": "Pingvin",
                "emoji": "🐧"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l5-r05-seagull-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Kiiij!",
            "soundSrc": "/assets/sounds/short/orao.mp3",
            "correctAnswer": "Orao",
            "options": [
              {
                "name": "Orao",
                "emoji": "🦅"
              },
              {
                "name": "Vrana",
                "emoji": "🐦‍⬛"
              },
              {
                "name": "Galeb",
                "emoji": "🐦"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l5-r06-eagle-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Bum bum!",
            "correctAnswer": "Noj",
            "options": [
              {
                "name": "Noj",
                "emoji": "🪶"
              },
              {
                "name": "Kokoš",
                "emoji": "🐔"
              },
              {
                "name": "Papiga",
                "emoji": "🦜"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l5-r07-ostrich-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Krr krr!",
            "soundSrc": "/assets/sounds/short/rakun.mp3",
            "correctAnswer": "Rakun",
            "options": [
              {
                "name": "Rakun",
                "emoji": "🦝"
              },
              {
                "name": "Lisica",
                "emoji": "🦊"
              },
              {
                "name": "Vjeverica",
                "emoji": "🐿️"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l5-r08-raccoon-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Grr-mijau!",
            "soundSrc": "/assets/sounds/short/ris.mp3",
            "correctAnswer": "Ris",
            "options": [
              {
                "name": "Ris",
                "emoji": "🐈"
              },
              {
                "name": "Vuk",
                "emoji": "🐺"
              },
              {
                "name": "Medvjed",
                "emoji": "🐻"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l5-r09-lynx-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "sound",
            "prompt": "Tko se tako glasa?",
            "question": "Poslušaj zvuk i odaberi životinju.",
            "mainLabel": "Zvuk",
            "mainEmoji": "🔊",
            "soundText": "Jauuu!",
            "soundSrc": "/assets/sounds/short/cagalj.mp3",
            "correctAnswer": "Čagalj",
            "options": [
              {
                "name": "Čagalj",
                "emoji": "🐕"
              },
              {
                "name": "Vuk",
                "emoji": "🐺"
              },
              {
                "name": "Lisica",
                "emoji": "🦊"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/sound-l5-r10-jackal-mobile.webp",
            "mobileAnswerRow": true
          }
        ]
      }
    ]
  },
  "baby": {
    "id": "baby",
    "title": "Mama i beba",
    "icon": "🐣",
    "description": "Spoji bebu s mamom.",
    "levelSelectSubtitle": "Odaberi razinu i spoji bebe s mamama.",
    "levels": [
      {
        "id": 1,
        "title": "Razina 1",
        "theme": "Najpoznatiji parovi",
        "isFree": true,
        "rounds": [
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Pile",
            "mainEmoji": "🐥",
            "correctAnswer": "Kokoš",
            "options": [
              {
                "name": "Kokoš",
                "emoji": "🐔"
              },
              {
                "name": "Krava",
                "emoji": "🐮"
              },
              {
                "name": "Mačka",
                "emoji": "🐱"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l1-r01-chick-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Tele",
            "mainEmoji": "🐮",
            "correctAnswer": "Krava",
            "options": [
              {
                "name": "Krava",
                "emoji": "🐮"
              },
              {
                "name": "Kokoš",
                "emoji": "🐔"
              },
              {
                "name": "Pas",
                "emoji": "🐶"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l1-r02-calf-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mačić",
            "mainEmoji": "🐱",
            "correctAnswer": "Mačka",
            "options": [
              {
                "name": "Mačka",
                "emoji": "🐱"
              },
              {
                "name": "Patka",
                "emoji": "🦆"
              },
              {
                "name": "Ovca",
                "emoji": "🐑"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l1-r03-kitten-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Štene",
            "mainEmoji": "🐕",
            "correctAnswer": "Pas",
            "options": [
              {
                "name": "Pas",
                "emoji": "🐶"
              },
              {
                "name": "Krava",
                "emoji": "🐮"
              },
              {
                "name": "Patka",
                "emoji": "🦆"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l1-r04-puppy-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Janje",
            "mainEmoji": "🐑",
            "correctAnswer": "Ovca",
            "options": [
              {
                "name": "Ovca",
                "emoji": "🐑"
              },
              {
                "name": "Mačka",
                "emoji": "🐱"
              },
              {
                "name": "Svinja",
                "emoji": "🐷"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l1-r05-lamb-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Praščić",
            "mainEmoji": "🐷",
            "correctAnswer": "Svinja",
            "options": [
              {
                "name": "Svinja",
                "emoji": "🐷"
              },
              {
                "name": "Ovca",
                "emoji": "🐑"
              },
              {
                "name": "Konj",
                "emoji": "🐴"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l1-r06-piglet-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Pače",
            "mainEmoji": "🐤",
            "correctAnswer": "Patka",
            "options": [
              {
                "name": "Patka",
                "emoji": "🦆"
              },
              {
                "name": "Svinja",
                "emoji": "🐷"
              },
              {
                "name": "Pas",
                "emoji": "🐶"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l1-r07-duckling-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Ždrijebe",
            "mainEmoji": "🐴",
            "correctAnswer": "Konj",
            "options": [
              {
                "name": "Konj",
                "emoji": "🐴"
              },
              {
                "name": "Kokoš",
                "emoji": "🐔"
              },
              {
                "name": "Svinja",
                "emoji": "🐷"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l1-r08-foal-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Jare",
            "mainEmoji": "🐐",
            "correctAnswer": "Koza",
            "options": [
              {
                "name": "Koza",
                "emoji": "🐐"
              },
              {
                "name": "Patka",
                "emoji": "🦆"
              },
              {
                "name": "Krava",
                "emoji": "🐮"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l1-r09-kid-goat-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Gušče",
            "mainEmoji": "🪿",
            "correctAnswer": "Guska",
            "options": [
              {
                "name": "Guska",
                "emoji": "🪿"
              },
              {
                "name": "Koza",
                "emoji": "🐐"
              },
              {
                "name": "Mačka",
                "emoji": "🐱"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l1-r10-gosling-mobile.webp",
            "mobileAnswerRow": true
          }
        ]
      },
      {
        "id": 2,
        "title": "Razina 2",
        "theme": "Dvorište i male domaće životinje",
        "isFree": false,
        "rounds": [
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Purić",
            "mainEmoji": "🦃",
            "correctAnswer": "Purica",
            "options": [
              {
                "name": "Purica",
                "emoji": "🦃"
              },
              {
                "name": "Golub",
                "emoji": "🐦"
              },
              {
                "name": "Hrčak",
                "emoji": "🐹"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l2-r01-turkey-poult-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mali magarac",
            "mainEmoji": "🫏",
            "correctAnswer": "Magarac",
            "options": [
              {
                "name": "Magarac",
                "emoji": "🫏"
              },
              {
                "name": "Kunić",
                "emoji": "🐰"
              },
              {
                "name": "Labud",
                "emoji": "🦢"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l2-r02-donkey-foal-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mali kunić",
            "mainEmoji": "🐰",
            "correctAnswer": "Kunić",
            "options": [
              {
                "name": "Kunić",
                "emoji": "🐰"
              },
              {
                "name": "Magarac",
                "emoji": "🫏"
              },
              {
                "name": "Purica",
                "emoji": "🦃"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l2-r03-rabbit-kit-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Golubić",
            "mainEmoji": "🐦",
            "correctAnswer": "Golub",
            "options": [
              {
                "name": "Golub",
                "emoji": "🐦"
              },
              {
                "name": "Zamorac",
                "emoji": "🐹"
              },
              {
                "name": "Paun",
                "emoji": "🦚"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l2-r04-pigeon-squab-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mali labud",
            "mainEmoji": "🦢",
            "correctAnswer": "Labud",
            "options": [
              {
                "name": "Labud",
                "emoji": "🦢"
              },
              {
                "name": "Miš",
                "emoji": "🐭"
              },
              {
                "name": "Magarac",
                "emoji": "🫏"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l2-r05-cygnet-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mali paun",
            "mainEmoji": "🦚",
            "correctAnswer": "Paun",
            "options": [
              {
                "name": "Paun",
                "emoji": "🦚"
              },
              {
                "name": "Kunić",
                "emoji": "🐰"
              },
              {
                "name": "Miš",
                "emoji": "🐭"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l2-r06-peachick-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mali hrčak",
            "mainEmoji": "🐹",
            "correctAnswer": "Hrčak",
            "options": [
              {
                "name": "Hrčak",
                "emoji": "🐹"
              },
              {
                "name": "Purica",
                "emoji": "🦃"
              },
              {
                "name": "Paun",
                "emoji": "🦚"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l2-r07-hamster-pup-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mali miš",
            "mainEmoji": "🐭",
            "correctAnswer": "Miš",
            "options": [
              {
                "name": "Miš",
                "emoji": "🐭"
              },
              {
                "name": "Labud",
                "emoji": "🦢"
              },
              {
                "name": "Magarac",
                "emoji": "🫏"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l2-r08-mouse-pup-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Malo zamorče",
            "mainEmoji": "🐹",
            "correctAnswer": "Zamorac",
            "options": [
              {
                "name": "Zamorac",
                "emoji": "🐹"
              },
              {
                "name": "Golub",
                "emoji": "🐦"
              },
              {
                "name": "Purica",
                "emoji": "🦃"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l2-r09-guinea-pig-pup-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mala kornjača",
            "mainEmoji": "🐢",
            "correctAnswer": "Kornjača",
            "options": [
              {
                "name": "Kornjača",
                "emoji": "🐢"
              },
              {
                "name": "Paun",
                "emoji": "🦚"
              },
              {
                "name": "Hrčak",
                "emoji": "🐹"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l2-r10-turtle-hatchling-mobile.webp",
            "mobileAnswerRow": true
          }
        ]
      },
      {
        "id": 3,
        "title": "Razina 3",
        "theme": "Šuma i livada",
        "isFree": false,
        "rounds": [
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Lane",
            "mainEmoji": "🦌",
            "correctAnswer": "Srna",
            "options": [
              {
                "name": "Srna",
                "emoji": "🦌"
              },
              {
                "name": "Lisica",
                "emoji": "🦊"
              },
              {
                "name": "Sova",
                "emoji": "🦉"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l3-r01-fawn-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Jelenče",
            "mainEmoji": "🦌",
            "correctAnswer": "Jelen",
            "options": [
              {
                "name": "Jelen",
                "emoji": "🦌"
              },
              {
                "name": "Dabar",
                "emoji": "🦫"
              },
              {
                "name": "Vuk",
                "emoji": "🐺"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l3-r02-deer-calf-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mala lisica",
            "mainEmoji": "🦊",
            "correctAnswer": "Lisica",
            "options": [
              {
                "name": "Lisica",
                "emoji": "🦊"
              },
              {
                "name": "Srna",
                "emoji": "🦌"
              },
              {
                "name": "Vjeverica",
                "emoji": "🐿️"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l3-r03-fox-kit-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mali vuk",
            "mainEmoji": "🐺",
            "correctAnswer": "Vuk",
            "options": [
              {
                "name": "Vuk",
                "emoji": "🐺"
              },
              {
                "name": "Zec",
                "emoji": "🐰"
              },
              {
                "name": "Dabar",
                "emoji": "🦫"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l3-r04-wolf-cub-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mali medvjed",
            "mainEmoji": "🐻",
            "correctAnswer": "Medvjed",
            "options": [
              {
                "name": "Medvjed",
                "emoji": "🐻"
              },
              {
                "name": "Sova",
                "emoji": "🦉"
              },
              {
                "name": "Zec",
                "emoji": "🐰"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l3-r05-bear-cub-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mala vjeverica",
            "mainEmoji": "🐿️",
            "correctAnswer": "Vjeverica",
            "options": [
              {
                "name": "Vjeverica",
                "emoji": "🐿️"
              },
              {
                "name": "Medvjed",
                "emoji": "🐻"
              },
              {
                "name": "Jelen",
                "emoji": "🦌"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l3-r06-squirrel-kit-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mala sova",
            "mainEmoji": "🦉",
            "correctAnswer": "Sova",
            "options": [
              {
                "name": "Sova",
                "emoji": "🦉"
              },
              {
                "name": "Lisica",
                "emoji": "🦊"
              },
              {
                "name": "Dabar",
                "emoji": "🦫"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l3-r07-owlet-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mali dabar",
            "mainEmoji": "🦫",
            "correctAnswer": "Dabar",
            "options": [
              {
                "name": "Dabar",
                "emoji": "🦫"
              },
              {
                "name": "Vuk",
                "emoji": "🐺"
              },
              {
                "name": "Vjeverica",
                "emoji": "🐿️"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l3-r08-beaver-kit-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mali zec",
            "mainEmoji": "🐰",
            "correctAnswer": "Zec",
            "options": [
              {
                "name": "Zec",
                "emoji": "🐰"
              },
              {
                "name": "Sova",
                "emoji": "🦉"
              },
              {
                "name": "Medvjed",
                "emoji": "🐻"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l3-r09-hare-leveret-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mali jazavac",
            "mainEmoji": "🦡",
            "correctAnswer": "Jazavac",
            "options": [
              {
                "name": "Jazavac",
                "emoji": "🦡"
              },
              {
                "name": "Srna",
                "emoji": "🦌"
              },
              {
                "name": "Vjeverica",
                "emoji": "🐿️"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l3-r10-badger-cub-mobile.webp",
            "mobileAnswerRow": true
          }
        ]
      },
      {
        "id": 4,
        "title": "Razina 4",
        "theme": "Divlje životinje svijeta",
        "isFree": false,
        "rounds": [
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Lavić",
            "mainEmoji": "🦁",
            "correctAnswer": "Lav",
            "options": [
              {
                "name": "Lav",
                "emoji": "🦁"
              },
              {
                "name": "Žirafa",
                "emoji": "🦒"
              },
              {
                "name": "Panda",
                "emoji": "🐼"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l4-r01-lion-cub-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Tigrić",
            "mainEmoji": "🐯",
            "correctAnswer": "Tigar",
            "options": [
              {
                "name": "Tigar",
                "emoji": "🐯"
              },
              {
                "name": "Zebra",
                "emoji": "🦓"
              },
              {
                "name": "Slon",
                "emoji": "🐘"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l4-r02-tiger-cub-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Slonić",
            "mainEmoji": "🐘",
            "correctAnswer": "Slon",
            "options": [
              {
                "name": "Slon",
                "emoji": "🐘"
              },
              {
                "name": "Lav",
                "emoji": "🦁"
              },
              {
                "name": "Klokan",
                "emoji": "🦘"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l4-r03-elephant-calf-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mala žirafa",
            "mainEmoji": "🦒",
            "correctAnswer": "Žirafa",
            "options": [
              {
                "name": "Žirafa",
                "emoji": "🦒"
              },
              {
                "name": "Tigar",
                "emoji": "🐯"
              },
              {
                "name": "Panda",
                "emoji": "🐼"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l4-r04-giraffe-calf-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mala zebra",
            "mainEmoji": "🦓",
            "correctAnswer": "Zebra",
            "options": [
              {
                "name": "Zebra",
                "emoji": "🦓"
              },
              {
                "name": "Slon",
                "emoji": "🐘"
              },
              {
                "name": "Majmun",
                "emoji": "🐵"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l4-r05-zebra-foal-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mala panda",
            "mainEmoji": "🐼",
            "correctAnswer": "Panda",
            "options": [
              {
                "name": "Panda",
                "emoji": "🐼"
              },
              {
                "name": "Lav",
                "emoji": "🦁"
              },
              {
                "name": "Deva",
                "emoji": "🐪"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l4-r06-panda-cub-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mali klokan",
            "mainEmoji": "🦘",
            "correctAnswer": "Klokan",
            "options": [
              {
                "name": "Klokan",
                "emoji": "🦘"
              },
              {
                "name": "Žirafa",
                "emoji": "🦒"
              },
              {
                "name": "Tigar",
                "emoji": "🐯"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l4-r07-kangaroo-joey-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mali majmun",
            "mainEmoji": "🐵",
            "correctAnswer": "Majmun",
            "options": [
              {
                "name": "Majmun",
                "emoji": "🐵"
              },
              {
                "name": "Zebra",
                "emoji": "🦓"
              },
              {
                "name": "Slon",
                "emoji": "🐘"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l4-r08-monkey-infant-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mala koala",
            "mainEmoji": "🐨",
            "correctAnswer": "Koala",
            "options": [
              {
                "name": "Koala",
                "emoji": "🐨"
              },
              {
                "name": "Deva",
                "emoji": "🐪"
              },
              {
                "name": "Majmun",
                "emoji": "🐵"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l4-r09-koala-joey-mobile.webp",
            "mobileAnswerRow": true
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mala deva",
            "mainEmoji": "🐪",
            "correctAnswer": "Deva",
            "options": [
              {
                "name": "Deva",
                "emoji": "🐪"
              },
              {
                "name": "Koala",
                "emoji": "🐨"
              },
              {
                "name": "Zebra",
                "emoji": "🦓"
              }
            ],
            "mobileBackgroundImage": "/assets/backgrounds/baby-l4-r10-camel-calf-mobile.webp",
            "mobileAnswerRow": true
          }
        ]
      },
      {
        "id": 5,
        "title": "Razina 5",
        "theme": "Voda, led i mali izazov",
        "isFree": false,
        "rounds": [
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mali pingvin",
            "mainEmoji": "🐧",
            "mobileBackgroundImage": "/assets/backgrounds/baby-l5-r01-penguin-chick-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Pingvin",
            "options": [
              {
                "name": "Pingvin",
                "emoji": "🐧"
              },
              {
                "name": "Dupin",
                "emoji": "🐬"
              },
              {
                "name": "Krokodil",
                "emoji": "🐊"
              }
            ]
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mali tuljan",
            "mainEmoji": "🦭",
            "mobileBackgroundImage": "/assets/backgrounds/baby-l5-r02-seal-pup-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Tuljan",
            "options": [
              {
                "name": "Tuljan",
                "emoji": "🦭"
              },
              {
                "name": "Kit",
                "emoji": "🐋"
              },
              {
                "name": "Žaba",
                "emoji": "🐸"
              }
            ]
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mali dupin",
            "mainEmoji": "🐬",
            "mobileBackgroundImage": "/assets/backgrounds/baby-l5-r03-dolphin-calf-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Dupin",
            "options": [
              {
                "name": "Dupin",
                "emoji": "🐬"
              },
              {
                "name": "Pingvin",
                "emoji": "🐧"
              },
              {
                "name": "Puž",
                "emoji": "🐌"
              }
            ]
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mali kit",
            "mainEmoji": "🐋",
            "mobileBackgroundImage": "/assets/backgrounds/baby-l5-r04-whale-calf-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Kit",
            "options": [
              {
                "name": "Kit",
                "emoji": "🐋"
              },
              {
                "name": "Krokodil",
                "emoji": "🐊"
              },
              {
                "name": "Hobotnica",
                "emoji": "🐙"
              }
            ]
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mali krokodil",
            "mainEmoji": "🐊",
            "mobileBackgroundImage": "/assets/backgrounds/baby-l5-r05-crocodile-hatchling-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Krokodil",
            "options": [
              {
                "name": "Krokodil",
                "emoji": "🐊"
              },
              {
                "name": "Tuljan",
                "emoji": "🦭"
              },
              {
                "name": "Pčela",
                "emoji": "🐝"
              }
            ]
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Punoglavac",
            "mainEmoji": "🐸",
            "mobileBackgroundImage": "/assets/backgrounds/baby-l5-r06-tadpole-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Žaba",
            "options": [
              {
                "name": "Žaba",
                "emoji": "🐸"
              },
              {
                "name": "Pingvin",
                "emoji": "🐧"
              },
              {
                "name": "Hobotnica",
                "emoji": "🐙"
              }
            ]
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Ličinka pčele",
            "mainEmoji": "🐝",
            "mobileBackgroundImage": "/assets/backgrounds/baby-l5-r07-bee-larva-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Pčela",
            "options": [
              {
                "name": "Pčela",
                "emoji": "🐝"
              },
              {
                "name": "Krokodil",
                "emoji": "🐊"
              },
              {
                "name": "Kit",
                "emoji": "🐋"
              }
            ]
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Gusjenica",
            "mainEmoji": "🐛",
            "mobileBackgroundImage": "/assets/backgrounds/baby-l5-r08-caterpillar-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Leptir",
            "options": [
              {
                "name": "Leptir",
                "emoji": "🦋"
              },
              {
                "name": "Pčela",
                "emoji": "🐝"
              },
              {
                "name": "Tuljan",
                "emoji": "🦭"
              }
            ]
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mali puž",
            "mainEmoji": "🐌",
            "mobileBackgroundImage": "/assets/backgrounds/baby-l5-r09-snail-baby-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Puž",
            "options": [
              {
                "name": "Puž",
                "emoji": "🐌"
              },
              {
                "name": "Dupin",
                "emoji": "🐬"
              },
              {
                "name": "Žaba",
                "emoji": "🐸"
              }
            ]
          },
          {
            "mode": "baby",
            "prompt": "Pronađi mamu!",
            "question": "",
            "mainLabel": "Mala hobotnica",
            "mainEmoji": "🐙",
            "mobileBackgroundImage": "/assets/backgrounds/baby-l5-r10-octopus-baby-mobile.webp",
            "mobileAnswerRow": true,
            "correctAnswer": "Hobotnica",
            "options": [
              {
                "name": "Hobotnica",
                "emoji": "🐙"
              },
              {
                "name": "Puž",
                "emoji": "🐌"
              },
              {
                "name": "Pingvin",
                "emoji": "🐧"
              }
            ]
          }
        ]
      }
    ]
  },
  "counting": {
    "id": "counting",
    "title": "Broji s Njamkom",
    "icon": "🔢",
    "description": "Skupljaj školjke, kamenčiće i morske prijatelje dok učiš brojeve.",
    "levelSelectSubtitle": "Odaberi plažnu misiju i uči brojeve kroz skupljanje.",
    "levelCount": 5,
    "levels": COUNTING_MISSION_LEVELS.map(createCountingMissionLevel)
  }
};

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
  return `${modeId}-${levelId}`;
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
