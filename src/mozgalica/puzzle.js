export const PUZZLE_ITEMS = [
  "Fićo",
  "Stojadin",
  "Yugo",
  "Golf dvojka",
  "Teletekst",
  "Antena",
  "Videorekorder",
  "Dnevnik",
  "Vegeta",
  "Cedevita",
  "Kraš",
  "Franck",
  "Kviskoteka",
  "Milijunaš",
  "Potjera",
  "Oliver Mlakar",
];

export const PUZZLE_GROUPS = [
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
];

export const MOCKUP_ITEMS = [
  "Fićo",
  "Teletekst",
  "Vegeta",
  "Kviskoteka",
  "Stojadin",
  "Antena",
  "Cedevita",
  "Milijunaš",
  "Yugo",
  "Videorekorder",
  "Kraš",
  "Potjera",
  "Golf dvojka",
  "Dnevnik",
  "Franck",
  "Oliver Mlakar",
];

export const SHARE_URL = "https://nepar.hr/mozgalica";

export function shuffleArray(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function findMatchingGroup(selected, groups) {
  const key = [...selected].sort().join("|");
  return groups.find((g) => [...g.items].sort().join("|") === key) ?? null;
}

export function findBestPartialMatch(selected, groups) {
  let best = null;
  for (const group of groups) {
    const count = selected.filter((item) => group.items.includes(item)).length;
    if (count > (best?.count ?? 0)) {
      best = { group, count };
    }
  }
  return best;
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function buildShareText({ attempts, time }) {
  return `Dnevne Asocijacije 🧠

Riješio sam današnju igru:
✅ 4/4 grupe
🎯 ${attempts} pokušaja
⏱️ ${time}

Možeš li bolje?
${SHARE_URL}`;
}

const CHALLENGE_PARAM = {
  name: "od",
  attempts: "p",
  time: "t",
};

export function buildChallengeLink({ name, attempts, elapsedSeconds }) {
  const params = new URLSearchParams({
    [CHALLENGE_PARAM.name]: name.trim() || "Prijatelj",
    [CHALLENGE_PARAM.attempts]: String(attempts),
    [CHALLENGE_PARAM.time]: String(elapsedSeconds),
  });
  const base =
    typeof window !== "undefined"
      ? `${window.location.origin}/mozgalica`
      : SHARE_URL;
  return `${base}?${params.toString()}`;
}

export function parseChallengeFromSearch(search) {
  const params = new URLSearchParams(search);
  const name = params.get(CHALLENGE_PARAM.name);
  const attempts = Number(params.get(CHALLENGE_PARAM.attempts));
  const elapsedSeconds = Number(params.get(CHALLENGE_PARAM.time));

  if (!name || Number.isNaN(attempts) || Number.isNaN(elapsedSeconds)) {
    return null;
  }

  return { name, attempts, elapsedSeconds };
}

export function buildChallengeInviteText({ name, attempts, time, link }) {
  return `Dnevne Asocijacije 🧠

${name} te izaziva na današnju mozgalicu!
Njegov rezultat: 4/4 grupe · ${attempts} pokušaja · ${time}

Prihvati izazov i pokušaj pobijediti:
${link}`;
}

export function pickChallengeWinner(challenger, responder) {
  if (responder.attempts < challenger.attempts) return "responder";
  if (challenger.attempts < responder.attempts) return "challenger";
  if (responder.elapsedSeconds < challenger.elapsedSeconds) return "responder";
  if (challenger.elapsedSeconds < responder.elapsedSeconds) return "challenger";
  return "tie";
}

export const DEMO_CHALLENGE = {
  name: "Ivan",
  attempts: 7,
  elapsedSeconds: 151,
};

export function createInitialGameState(gridItems = null) {
  const stored =
    typeof sessionStorage !== "undefined"
      ? sessionStorage.getItem("mozgalica-test-order")
      : null;
  const items = gridItems ?? (stored ? JSON.parse(stored) : shuffleArray(PUZZLE_ITEMS));

  return {
    gridItems: items,
    selected: [],
    solvedGroups: [],
    attempts: 0,
    elapsedSeconds: 0,
    message: null,
    wrongItems: [],
    startedAt: Date.now(),
  };
}
