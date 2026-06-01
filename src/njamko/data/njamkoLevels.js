export function shuffleOptions(options) {
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const FOOD_ROUNDS = [
  {
    mode: "food",
    prompt: "Zeko je gladan!",
    question: "Što zeko voli jesti?",
    mainLabel: "Zeko",
    mainEmoji: "🐰",
    mainImage: "/njamko/assets/animals/rabbit.webp",
    correctAnswer: "Mrkva",
    options: [
      { name: "Mrkva", emoji: "🥕", image: "/njamko/assets/foods/carrot.webp" },
      { name: "Banana", emoji: "🍌", image: "/njamko/assets/foods/banana.webp" },
      { name: "Riba", emoji: "🐟", image: "/njamko/assets/foods/fish.webp" },
    ],
  },
  {
    mode: "food",
    prompt: "Majmun je gladan!",
    question: "Što majmun voli jesti?",
    mainLabel: "Majmun",
    mainEmoji: "🐵",
    mainImage: "/njamko/assets/animals/monkey.webp",
    correctAnswer: "Banana",
    options: [
      { name: "Banana", emoji: "🍌", image: "/njamko/assets/foods/banana.webp" },
      { name: "Sir", emoji: "🧀", image: "/njamko/assets/foods/cheese.webp" },
      { name: "Mrkva", emoji: "🥕", image: "/njamko/assets/foods/carrot.webp" },
    ],
  },
  {
    mode: "food",
    prompt: "Mačka je gladna!",
    question: "Što mačka voli jesti?",
    mainLabel: "Mačka",
    mainEmoji: "🐱",
    mainImage: "/njamko/assets/animals/cat.webp",
    correctAnswer: "Riba",
    options: [
      { name: "Riba", emoji: "🐟", image: "/njamko/assets/foods/fish.webp" },
      { name: "Trava", emoji: "🌿", image: "/njamko/assets/foods/grass.webp" },
      { name: "Banana", emoji: "🍌", image: "/njamko/assets/foods/banana.webp" },
    ],
  },
  {
    mode: "food",
    prompt: "Pas je gladan!",
    question: "Što pas voli jesti?",
    mainLabel: "Pas",
    mainEmoji: "🐶",
    mainImage: "/njamko/assets/animals/dog.webp",
    correctAnswer: "Kost",
    options: [
      { name: "Kost", emoji: "🦴", image: "/njamko/assets/foods/bone.webp" },
      { name: "Med", emoji: "🍯", image: "/njamko/assets/foods/honey.webp" },
      { name: "Jabuka", emoji: "🍎", image: "/njamko/assets/foods/apple.webp" },
    ],
  },
];

const HOME_ROUNDS = [
  {
    mode: "home",
    prompt: "Riba traži svoj dom!",
    question: "Gdje riba živi?",
    mainLabel: "Riba",
    mainEmoji: "🐟",
    correctAnswer: "Voda",
    options: [
      { name: "Voda", emoji: "🌊" },
      { name: "Kućica", emoji: "🏠" },
      { name: "Stablo", emoji: "🌳" },
    ],
  },
  {
    mode: "home",
    prompt: "Ptica traži svoj dom!",
    question: "Gdje ptica živi?",
    mainLabel: "Ptica",
    mainEmoji: "🐦",
    correctAnswer: "Gnijezdo",
    options: [
      { name: "Gnijezdo", emoji: "🪺" },
      { name: "More", emoji: "🌊" },
      { name: "Špilja", emoji: "🪨" },
    ],
  },
  {
    mode: "home",
    prompt: "Pas traži svoj dom!",
    question: "Gdje pas živi?",
    mainLabel: "Pas",
    mainEmoji: "🐶",
    correctAnswer: "Kućica",
    options: [
      { name: "Kućica", emoji: "🏠" },
      { name: "Gnijezdo", emoji: "🪺" },
      { name: "Rijeka", emoji: "🌊" },
    ],
  },
  {
    mode: "home",
    prompt: "Medo traži svoj dom!",
    question: "Gdje medo živi?",
    mainLabel: "Medo",
    mainEmoji: "🐻",
    correctAnswer: "Šuma",
    options: [
      { name: "Šuma", emoji: "🌲" },
      { name: "Akvarij", emoji: "🐠" },
      { name: "Košara", emoji: "🧺" },
    ],
  },
];

const SOUND_ROUNDS = [
  {
    mode: "sound",
    prompt: "Tko se tako glasa?",
    question: "Poslušaj zvuk i odaberi životinju.",
    mainLabel: "Zvuk",
    mainEmoji: "🔊",
    soundText: "Muuu!",
    correctAnswer: "Krava",
    options: [
      { name: "Krava", emoji: "🐮" },
      { name: "Pas", emoji: "🐶" },
      { name: "Mačka", emoji: "🐱" },
    ],
  },
  {
    mode: "sound",
    prompt: "Tko se tako glasa?",
    question: "Poslušaj zvuk i odaberi životinju.",
    mainLabel: "Zvuk",
    mainEmoji: "🔊",
    soundText: "Vau vau!",
    correctAnswer: "Pas",
    options: [
      { name: "Pas", emoji: "🐶" },
      { name: "Konj", emoji: "🐴" },
      { name: "Miš", emoji: "🐭" },
    ],
  },
  {
    mode: "sound",
    prompt: "Tko se tako glasa?",
    question: "Poslušaj zvuk i odaberi životinju.",
    mainLabel: "Zvuk",
    mainEmoji: "🔊",
    soundText: "Mijau!",
    correctAnswer: "Mačka",
    options: [
      { name: "Mačka", emoji: "🐱" },
      { name: "Krava", emoji: "🐮" },
      { name: "Zeko", emoji: "🐰" },
    ],
  },
  {
    mode: "sound",
    prompt: "Tko se tako glasa?",
    question: "Poslušaj zvuk i odaberi životinju.",
    mainLabel: "Zvuk",
    mainEmoji: "🔊",
    soundText: "I-ha-ha!",
    correctAnswer: "Konj",
    options: [
      { name: "Konj", emoji: "🐴" },
      { name: "Riba", emoji: "🐟" },
      { name: "Medo", emoji: "🐻" },
    ],
  },
];

const BABY_ROUNDS = [
  {
    mode: "baby",
    prompt: "Pronađi mamu!",
    question: "Tko je mama malom piletu?",
    mainLabel: "Pile",
    mainEmoji: "🐥",
    correctAnswer: "Kokoš",
    options: [
      { name: "Kokoš", emoji: "🐔" },
      { name: "Krava", emoji: "🐮" },
      { name: "Mačka", emoji: "🐱" },
    ],
  },
  {
    mode: "baby",
    prompt: "Pronađi mamu!",
    question: "Tko je mama malom teletu?",
    mainLabel: "Tele",
    mainEmoji: "🐮",
    correctAnswer: "Krava",
    options: [
      { name: "Krava", emoji: "🐮" },
      { name: "Pas", emoji: "🐶" },
      { name: "Ptica", emoji: "🐦" },
    ],
  },
  {
    mode: "baby",
    prompt: "Pronađi mamu!",
    question: "Tko je mama malom mačiću?",
    mainLabel: "Mačić",
    mainEmoji: "🐱",
    correctAnswer: "Mačka",
    options: [
      { name: "Mačka", emoji: "🐱" },
      { name: "Kokoš", emoji: "🐔" },
      { name: "Konj", emoji: "🐴" },
    ],
  },
  {
    mode: "baby",
    prompt: "Pronađi mamu!",
    question: "Tko je mama malom ždrijebetu?",
    mainLabel: "Ždrijebe",
    mainEmoji: "🐴",
    correctAnswer: "Konj",
    options: [
      { name: "Konj", emoji: "🐴" },
      { name: "Riba", emoji: "🐟" },
      { name: "Miš", emoji: "🐭" },
    ],
  },
];

export const NJAMKO_LEVELS = [
  {
    id: "food",
    title: "Nahrani životinju",
    description: "Odaberi što životinja voli jesti.",
    icon: "🍎",
    testId: "level-food",
    rounds: FOOD_ROUNDS,
  },
  {
    id: "home",
    title: "Pronađi dom",
    description: "Pomogni životinji pronaći gdje živi.",
    icon: "🏡",
    testId: "level-home",
    rounds: HOME_ROUNDS,
  },
  {
    id: "sound",
    title: "Pogodi zvuk",
    description: "Poslušaj zvuk i odaberi životinju.",
    icon: "🔊",
    testId: "level-sound",
    rounds: SOUND_ROUNDS,
  },
  {
    id: "baby",
    title: "Mama i beba",
    description: "Spoji bebu s mamom.",
    icon: "🐣",
    testId: "level-baby",
    rounds: BABY_ROUNDS,
  },
];

export function getLevelById(levelId) {
  return NJAMKO_LEVELS.find((level) => level.id === levelId) ?? null;
}
