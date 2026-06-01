export const PUZZLES = [
  {
    id: "gaming-90s",
    title: "Gaming 90-ih",
    subtitle: "Konzole, likovi i legendarni naslovi",
    icon: "🎮",
    groups: [
      {
        name: "Konzole",
        items: ["PlayStation", "Nintendo 64", "Mega Drive", "Game Boy"],
      },
      {
        name: "Likovi iz igara",
        items: ["Mario", "Sonic", "Lara Croft", "Pac-Man"],
      },
      {
        name: "Klasični naslovi",
        items: ["Doom", "Tekken", "Warcraft", "Tetris"],
      },
      {
        name: "Gejmerska kultura",
        items: ["Joystick", "Arcade", "Floppy", "Cheat code"],
      },
    ],
  },
  {
    id: "nogomet-hr-90s",
    title: "Nogomet HR 90-ih",
    subtitle: "Zlatni dečki, klubovi i veliki turniri",
    icon: "⚽",
    groups: [
      {
        name: "Zlatni dečki",
        items: ["Šuker", "Boban", "Prosinečki", "Bilić"],
      },
      {
        name: "Italia '90",
        items: ["Jarni", "Stimac", "Mladinić", "Asanović"],
      },
      {
        name: "Klubovi",
        items: ["Dinamo", "Hajduk", "Rijeka", "Osijek"],
      },
      {
        name: "Veliki trenuci",
        items: ["Maksimir", "Poljud", "Euro '96", "SP Italija"],
      },
    ],
  },
  {
    id: "muzika-90s",
    title: "Muzika 90-ih",
    subtitle: "Domaca scena, rock i svjetski hitovi",
    icon: "🎵",
    groups: [
      {
        name: "Domaca pop",
        items: ["Gibonni", "Massimo", "Severina", "E.N.I."],
      },
      {
        name: "Hrvatski rock",
        items: ["Prljavo kaz.", "Psihomodo", "Hladno pivo", "Thompson"],
      },
      {
        name: "Svjetske ikone",
        items: ["Nirvana", "Madonna", "MJ", "Spice Girls"],
      },
      {
        name: "Formati i mediji",
        items: ["Kaseta", "CD", "MTV", "Walkman"],
      },
    ],
  },
  {
    id: "nba-90s",
    title: "NBA 90-ih",
    subtitle: "Dynastije, rivalstva i košarkaška kultura",
    icon: "🏀",
    groups: [
      {
        name: "Chicago Bulls",
        items: ["Jordan", "Pippen", "Rodman", "Kerr"],
      },
      {
        name: "LA Lakers",
        items: ["Shaq", "Kobe", "Horry", "Worthy"],
      },
      {
        name: "Rivali erne",
        items: ["Barkley", "Malone", "Stockton", "Ewing"],
      },
      {
        name: "NBA kultura",
        items: ["Air Jordan", "Slam dunk", "NBA Jam", "All-Star"],
      },
    ],
  },
  {
    id: "hr-nostalgija",
    title: "HR nostalgija",
    subtitle: "Auti, TV, brendovi i kvizovi iz djetinjstva",
    icon: "📺",
    groups: [
      {
        name: "Auti nostalgija",
        items: ["Fićo", "Stojadin", "Yugo", "Golf dvojka"],
      },
      {
        name: "Stara televizija",
        items: ["Teletekst", "Antena", "Videorekorder", "Dnevnik"],
      },
      {
        name: "Domaći brendovi",
        items: ["Vegeta", "Cedevita", "Kraš", "Franck"],
      },
      {
        name: "TV kvizovi",
        items: ["Kviskoteka", "Milijunaš", "Potjera", "Oliver Mlakar"],
      },
    ],
  },
];

export const DEFAULT_PUZZLE_ID = "gaming-90s";

export function getPuzzleById(id) {
  return PUZZLES.find((puzzle) => puzzle.id === id) ?? PUZZLES[0];
}

export function getPuzzleItems(puzzle) {
  return puzzle.groups.flatMap((group) => group.items);
}

export function getMockupItems(puzzleId = DEFAULT_PUZZLE_ID) {
  const puzzle = getPuzzleById(puzzleId);
  const items = getPuzzleItems(puzzle);
  return [
    items[0],
    items[4],
    items[8],
    items[12],
    items[1],
    items[5],
    items[9],
    items[13],
    items[2],
    items[6],
    items[10],
    items[14],
    items[3],
    items[7],
    items[11],
    items[15],
  ];
}
