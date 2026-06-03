import {
  DEFAULT_PUZZLE_ID,
  PUZZLES,
  PUZZLES_2010S,
  PUZZLES_LEGACY,
  getMockupItems,
  getPuzzleById,
  getPuzzleItems,
} from "./puzzles.js";

export {
  PUZZLES,
  PUZZLES_2010S,
  PUZZLES_LEGACY,
  DEFAULT_PUZZLE_ID,
  getPuzzleById,
  getPuzzleItems,
  getMockupItems,
};

const defaultPuzzle = getPuzzleById(DEFAULT_PUZZLE_ID);

export const PUZZLE_ITEMS = getPuzzleItems(defaultPuzzle);
export const PUZZLE_GROUPS = defaultPuzzle.groups;
export const MOCKUP_ITEMS = getMockupItems(DEFAULT_PUZZLE_ID);

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

export function buildShareText({ attempts, time, puzzleTitle }) {
  const themeLine = puzzleTitle ? `\n🎯 Tema: ${puzzleTitle}` : "";
  return `Dnevne Asocijacije 🧠

Riješio sam mozgalicu:${themeLine}
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
  puzzle: "tema",
  responderName: "rn",
  responderAttempts: "rp",
  responderTime: "rt",
};

export function buildChallengeLink({ name, attempts, elapsedSeconds, puzzleId }) {
  const params = new URLSearchParams({
    [CHALLENGE_PARAM.name]: name.trim() || "Prijatelj",
    [CHALLENGE_PARAM.attempts]: String(attempts),
    [CHALLENGE_PARAM.time]: String(elapsedSeconds),
    [CHALLENGE_PARAM.puzzle]: puzzleId || DEFAULT_PUZZLE_ID,
  });
  const base =
    typeof window !== "undefined"
      ? `${window.location.origin}/mozgalica`
      : SHARE_URL;
  return `${base}?${params.toString()}`;
}

export function buildChallengeResultLink({ challenger, responder, puzzleId }) {
  const params = new URLSearchParams({
    [CHALLENGE_PARAM.name]: challenger.name,
    [CHALLENGE_PARAM.attempts]: String(challenger.attempts),
    [CHALLENGE_PARAM.time]: String(challenger.elapsedSeconds),
    [CHALLENGE_PARAM.puzzle]: puzzleId || DEFAULT_PUZZLE_ID,
    [CHALLENGE_PARAM.responderName]: responder.name,
    [CHALLENGE_PARAM.responderAttempts]: String(responder.attempts),
    [CHALLENGE_PARAM.responderTime]: String(responder.elapsedSeconds),
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
  const puzzleId = params.get(CHALLENGE_PARAM.puzzle) || DEFAULT_PUZZLE_ID;

  if (!name || Number.isNaN(attempts) || Number.isNaN(elapsedSeconds)) {
    return null;
  }

  const challenger = { name, attempts, elapsedSeconds, puzzleId };

  const responderName = params.get(CHALLENGE_PARAM.responderName);
  const responderAttempts = Number(params.get(CHALLENGE_PARAM.responderAttempts));
  const responderTime = Number(params.get(CHALLENGE_PARAM.responderTime));

  if (
    responderName &&
    !Number.isNaN(responderAttempts) &&
    !Number.isNaN(responderTime)
  ) {
    return {
      type: "result",
      challenger,
      responder: {
        name: responderName,
        attempts: responderAttempts,
        elapsedSeconds: responderTime,
      },
    };
  }

  return { type: "invite", ...challenger };
}

export function buildChallengeResultShareText({
  challenger,
  responder,
  puzzleTitle,
  link,
}) {
  const winner = pickChallengeWinner(challenger, responder);
  const challengerTime = formatTime(challenger.elapsedSeconds);
  const responderTime = formatTime(responder.elapsedSeconds);

  let winnerLine = "Remi!";
  if (winner === "challenger") winnerLine = `Pobjednik: ${challenger.name} 🏆`;
  if (winner === "responder") winnerLine = `Pobjednik: ${responder.name} 🏆`;

  return `Dnevne Asocijacije — rezultat izazova 🧠

Tema: ${puzzleTitle}
${challenger.name}: ${challenger.attempts} pokušaja · ${challengerTime}
${responder.name}: ${responder.attempts} pokušaja · ${responderTime}

${winnerLine}

Pogledaj usporedbu:
${link}`;
}

export function buildChallengeInviteText({ name, attempts, time, link, puzzleTitle }) {
  return `Dnevne Asocijacije 🧠

${name} te izaziva na mozgalicu „${puzzleTitle}”!
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
  puzzleId: DEFAULT_PUZZLE_ID,
};

export function createInitialGameState(puzzleId = DEFAULT_PUZZLE_ID, gridItems = null) {
  const puzzle = getPuzzleById(puzzleId);
  const stored =
    typeof sessionStorage !== "undefined"
      ? sessionStorage.getItem("mozgalica-test-order")
      : null;
  const items =
    gridItems ??
    (stored ? JSON.parse(stored) : shuffleArray(getPuzzleItems(puzzle)));

  return {
    puzzleId: puzzle.id,
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
