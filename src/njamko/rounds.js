export const ROUNDS = [
  {
    animal: "Zeko",
    animalEmoji: "🐰",
    prompt: "Zeko je gladan!",
    question: "Što zeko voli jesti?",
    correctFood: "Mrkva",
    correctFoodEmoji: "🥕",
    options: [
      { name: "Mrkva", emoji: "🥕" },
      { name: "Banana", emoji: "🍌" },
      { name: "Riba", emoji: "🐟" },
    ],
  },
  {
    animal: "Majmun",
    animalEmoji: "🐵",
    prompt: "Majmun je gladan!",
    question: "Što majmun voli jesti?",
    correctFood: "Banana",
    correctFoodEmoji: "🍌",
    options: [
      { name: "Banana", emoji: "🍌" },
      { name: "Sir", emoji: "🧀" },
      { name: "Mrkva", emoji: "🥕" },
    ],
  },
  {
    animal: "Mačka",
    animalEmoji: "🐱",
    prompt: "Mačka je gladna!",
    question: "Što mačka voli jesti?",
    correctFood: "Riba",
    correctFoodEmoji: "🐟",
    options: [
      { name: "Riba", emoji: "🐟" },
      { name: "Trava", emoji: "🌿" },
      { name: "Banana", emoji: "🍌" },
    ],
  },
  {
    animal: "Pas",
    animalEmoji: "🐶",
    prompt: "Pas je gladan!",
    question: "Što pas voli jesti?",
    correctFood: "Kost",
    correctFoodEmoji: "🦴",
    options: [
      { name: "Kost", emoji: "🦴" },
      { name: "Med", emoji: "🍯" },
      { name: "Jabuka", emoji: "🍎" },
    ],
  },
  {
    animal: "Krava",
    animalEmoji: "🐮",
    prompt: "Krava je gladna!",
    question: "Što krava voli jesti?",
    correctFood: "Trava",
    correctFoodEmoji: "🌿",
    options: [
      { name: "Trava", emoji: "🌿" },
      { name: "Riba", emoji: "🐟" },
      { name: "Kolač", emoji: "🧁" },
    ],
  },
  {
    animal: "Medo",
    animalEmoji: "🐻",
    prompt: "Medo je gladan!",
    question: "Što medo voli jesti?",
    correctFood: "Med",
    correctFoodEmoji: "🍯",
    options: [
      { name: "Med", emoji: "🍯" },
      { name: "Sir", emoji: "🧀" },
      { name: "Mrkva", emoji: "🥕" },
    ],
  },
  {
    animal: "Miš",
    animalEmoji: "🐭",
    prompt: "Miš je gladan!",
    question: "Što miš voli jesti?",
    correctFood: "Sir",
    correctFoodEmoji: "🧀",
    options: [
      { name: "Sir", emoji: "🧀" },
      { name: "Banana", emoji: "🍌" },
      { name: "Trava", emoji: "🌿" },
    ],
  },
  {
    animal: "Konj",
    animalEmoji: "🐴",
    prompt: "Konj je gladan!",
    question: "Što konj voli jesti?",
    correctFood: "Jabuka",
    correctFoodEmoji: "🍎",
    options: [
      { name: "Jabuka", emoji: "🍎" },
      { name: "Riba", emoji: "🐟" },
      { name: "Med", emoji: "🍯" },
    ],
  },
];

export function shuffleOptions(options) {
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
