import { useCallback, useEffect, useRef, useState } from "react";
import { usePageMeta } from "../usePageMeta.js";
import ChallengeAccept from "./ChallengeAccept.jsx";
import ChallengeInvite from "./ChallengeInvite.jsx";
import ChallengeResult from "./ChallengeResult.jsx";
import GameBoard from "./GameBoard.jsx";
import MozgalicaLanding from "./MozgalicaLanding.jsx";
import { MozgalicaLogo } from "./MozgalicaLogo.jsx";
import ResultPanel from "./ResultPanel.jsx";
import {
  DEFAULT_PUZZLE_ID,
  DEMO_CHALLENGE,
  buildChallengeInviteText,
  buildShareText,
  createInitialGameState,
  findBestPartialMatch,
  findMatchingGroup,
  formatTime,
  getPuzzleById,
  parseChallengeFromSearch,
  shuffleArray,
} from "./puzzle.js";
import "./mozgalica.css";

const PLAYER_NAME_KEY = "mozgalica-player-name";

function readPlayerName() {
  try {
    return localStorage.getItem(PLAYER_NAME_KEY) || "";
  } catch {
    return "";
  }
}

function writePlayerName(name) {
  try {
    localStorage.setItem(PLAYER_NAME_KEY, name);
  } catch {
    /* ignore */
  }
}

export default function MozgalicaPage() {
  usePageMeta({
    title: "Dnevne Asocijacije | Mozgalica",
    description:
      "Poveži 16 pojmova u 4 skrivene grupe. Nova mozgalica svaki dan na nepar.hr.",
    path: "/mozgalica",
  });

  const [screen, setScreen] = useState("landing");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedPuzzleId, setSelectedPuzzleId] = useState(DEFAULT_PUZZLE_ID);
  const [game, setGame] = useState(() => createInitialGameState(DEFAULT_PUZZLE_ID));
  const [playerName, setPlayerName] = useState(readPlayerName);
  const [pendingChallenge, setPendingChallenge] = useState(null);
  const [inviteStats, setInviteStats] = useState(null);
  const [inviteCopied, setInviteCopied] = useState(false);
  const timerRef = useRef(null);
  const messageTimerRef = useRef(null);
  const copyTimerRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => link.remove();
  }, []);

  useEffect(() => {
    const incoming = parseChallengeFromSearch(window.location.search);
    if (!incoming) return;

    setPendingChallenge(incoming);
    setScreen("challenge-accept");
    window.history.replaceState(null, "", "/mozgalica");
  }, []);

  useEffect(() => {
    if (screen !== "game") {
      if (timerRef.current) clearInterval(timerRef.current);
      return undefined;
    }

    timerRef.current = setInterval(() => {
      setGame((prev) => ({
        ...prev,
        elapsedSeconds: Math.floor((Date.now() - prev.startedAt) / 1000),
      }));
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screen]);

  useEffect(() => {
    if (screen !== "game" || game.solvedGroups.length !== 4) return undefined;

    const nextScreen = pendingChallenge ? "challenge-result" : "result";
    const timeout = setTimeout(() => setScreen(nextScreen), 400);
    return () => clearTimeout(timeout);
  }, [screen, game.solvedGroups.length, pendingChallenge]);

  useEffect(
    () => () => {
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    },
    [],
  );

  const handlePlayerNameChange = useCallback((name) => {
    setPlayerName(name);
    writePlayerName(name);
  }, []);

  const startGame = useCallback((puzzleId = selectedPuzzleId) => {
    setSelectedPuzzleId(puzzleId);
    setGame(createInitialGameState(puzzleId));
    setScreen("game");
    window.scrollTo(0, 0);
  }, [selectedPuzzleId]);

  const handleSelectPuzzle = useCallback((puzzleId) => {
    startGame(puzzleId);
  }, [startGame]);

  const handleSelect = useCallback((label) => {
    setGame((prev) => {
      if (prev.selected.includes(label)) {
        return {
          ...prev,
          selected: prev.selected.filter((item) => item !== label),
          message: null,
          wrongItems: [],
        };
      }
      if (prev.selected.length >= 4) return prev;
      return {
        ...prev,
        selected: [...prev.selected, label],
        message: null,
        wrongItems: [],
      };
    });
  }, []);

  const handleCheck = useCallback(() => {
    setGame((prev) => {
      if (prev.selected.length !== 4) return prev;

      const groups = getPuzzleById(prev.puzzleId).groups;
      const match = findMatchingGroup(prev.selected, groups);
      if (match) {
        if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
        messageTimerRef.current = setTimeout(() => {
          setGame((state) => ({ ...state, message: null }));
        }, 2000);

        return {
          ...prev,
          solvedGroups: [...prev.solvedGroups, match],
          gridItems: prev.gridItems.filter((item) => !match.items.includes(item)),
          selected: [],
          wrongItems: [],
          message: {
            type: "success",
            text: "Točno! Pronašao si grupu.",
          },
        };
      }

      const partial = findBestPartialMatch(prev.selected, groups);
      const isNear = partial?.count === 3;
      const attempts = prev.attempts + 1;

      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
      messageTimerRef.current = setTimeout(() => {
        setGame((state) => ({ ...state, wrongItems: [], message: null }));
      }, 1500);

      return {
        ...prev,
        attempts,
        wrongItems: [...prev.selected],
        selected: [],
        message: isNear
          ? {
              type: "near",
              text: "Blizu si — 3 od 4 pojma su povezana.",
            }
          : {
              type: "error",
              text: "Nije točno, pokušaj ponovno.",
            },
      };
    });
  }, []);

  const handleDeselect = useCallback(() => {
    setGame((prev) => ({
      ...prev,
      selected: [],
      message: null,
      wrongItems: [],
    }));
  }, []);

  const handleShuffle = useCallback(() => {
    setGame((prev) => ({
      ...prev,
      gridItems: shuffleArray(prev.gridItems),
      selected: [],
      message: null,
      wrongItems: [],
    }));
  }, []);

  const handleShare = useCallback(async () => {
    const puzzle = getPuzzleById(game.puzzleId);
    const text = buildShareText({
      attempts: game.attempts,
      time: formatTime(game.elapsedSeconds),
      puzzleTitle: puzzle.title,
    });

    if (navigator.share) {
      try {
        await navigator.share({ text, title: "Dnevne Asocijacije" });
        return;
      } catch {
        /* fall through to clipboard */
      }
    }

    await navigator.clipboard.writeText(text);
  }, [game.attempts, game.elapsedSeconds, game.puzzleId]);

  const handleChallengeShare = useCallback(async () => {
    if (!pendingChallenge) return;

    const responder = {
      name: playerName.trim() || "Ti",
      attempts: game.attempts,
      elapsedSeconds: game.elapsedSeconds,
    };
    const puzzle = getPuzzleById(pendingChallenge.puzzleId);
    const text = buildChallengeInviteText({
      name: pendingChallenge.name,
      attempts: pendingChallenge.attempts,
      time: formatTime(pendingChallenge.elapsedSeconds),
      link: window.location.href,
      puzzleTitle: puzzle.title,
    });

    const comparison = `${pendingChallenge.name}: ${pendingChallenge.attempts} pokušaja · ${formatTime(pendingChallenge.elapsedSeconds)}
${responder.name}: ${responder.attempts} pokušaja · ${formatTime(responder.elapsedSeconds)}`;

    const shareBody = `Dnevne Asocijacije — rezultat izazova\n\n${comparison}\n\n${text}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Dnevne Asocijacije — izazov",
          text: shareBody,
        });
        return;
      } catch {
        /* fall through */
      }
    }

    await navigator.clipboard.writeText(shareBody);
  }, [pendingChallenge, playerName, game.attempts, game.elapsedSeconds]);

  const goLanding = useCallback(() => {
    setScreen("landing");
    setInviteStats(null);
    window.scrollTo(0, 0);
  }, []);

  const showChallengeInvite = useCallback(() => {
    setInviteStats({
      attempts: game.attempts,
      elapsedSeconds: game.elapsedSeconds,
    });
    setScreen("challenge-invite");
    window.scrollTo(0, 0);
  }, [game.attempts, game.elapsedSeconds]);

  const showChallengeInviteDemo = useCallback((demo) => {
    setInviteStats({
      attempts: demo.attempts,
      elapsedSeconds: demo.elapsedSeconds,
      demo: true,
    });
    if (!playerName) {
      handlePlayerNameChange(demo.name);
    }
    setScreen("challenge-invite");
    window.scrollTo(0, 0);
  }, [playerName, handlePlayerNameChange]);

  const handleInviteCopied = useCallback(() => {
    setInviteCopied(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setInviteCopied(false), 2500);
  }, []);

  const handleAcceptChallenge = useCallback(() => {
    if (pendingChallenge?.puzzleId) {
      startGame(pendingChallenge.puzzleId);
      return;
    }
    startGame();
  }, [pendingChallenge, startGame]);

  const handleDeclineChallenge = useCallback(() => {
    setPendingChallenge(null);
    setScreen("landing");
    window.scrollTo(0, 0);
  }, []);

  const inviteAttempts = inviteStats?.attempts ?? game.attempts;
  const inviteElapsed = inviteStats?.elapsedSeconds ?? game.elapsedSeconds;
  const activePuzzle = getPuzzleById(game.puzzleId);

  return (
    <div className="mozgalica" data-testid="mozgalica-page">
      {inviteCopied && (
        <div className="mz-toast" role="status" data-testid="invite-copied-toast">
          Link je kopiran!
        </div>
      )}

      {screen === "landing" && (
        <MozgalicaLanding
          selectedPuzzleId={selectedPuzzleId}
          onSelectPuzzle={handleSelectPuzzle}
          onShowChallengeDemo={showChallengeInviteDemo}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
      )}

      {screen === "challenge-accept" && pendingChallenge && (
        <>
          <header className="mz-header">
            <div className="mz-header__inner">
              <MozgalicaLogo compact />
            </div>
          </header>
          <ChallengeAccept
            challenge={pendingChallenge}
            onAccept={handleAcceptChallenge}
            onDecline={handleDeclineChallenge}
          />
        </>
      )}

      {screen === "game" && (
        <>
          <header className="mz-header">
            <div className="mz-header__inner">
              <MozgalicaLogo compact />
            </div>
          </header>
          <GameBoard
            puzzleTitle={activePuzzle.title}
            gridItems={game.gridItems}
            selected={game.selected}
            solvedGroups={game.solvedGroups}
            attempts={game.attempts}
            elapsedSeconds={game.elapsedSeconds}
            message={game.message}
            wrongItems={game.wrongItems}
            onSelect={handleSelect}
            onCheck={handleCheck}
            onDeselect={handleDeselect}
            onShuffle={handleShuffle}
            onBack={goLanding}
          />
        </>
      )}

      {screen === "result" && (
        <>
          <header className="mz-header">
            <div className="mz-header__inner">
              <MozgalicaLogo compact />
            </div>
          </header>
          <ResultPanel
            puzzleTitle={activePuzzle.title}
            attempts={game.attempts}
            elapsedSeconds={game.elapsedSeconds}
            onChallenge={showChallengeInvite}
            onShare={handleShare}
            onPlayAgain={() => startGame(game.puzzleId)}
          />
        </>
      )}

      {screen === "challenge-invite" && (
        <>
          <header className="mz-header">
            <div className="mz-header__inner">
              <MozgalicaLogo compact />
            </div>
          </header>
          <ChallengeInvite
            playerName={playerName}
            onPlayerNameChange={handlePlayerNameChange}
            attempts={inviteAttempts}
            elapsedSeconds={inviteElapsed}
            puzzleId={inviteStats?.demo ? DEMO_CHALLENGE.puzzleId : game.puzzleId}
            puzzleTitle={getPuzzleById(
              inviteStats?.demo ? DEMO_CHALLENGE.puzzleId : game.puzzleId,
            ).title}
            onBack={() => {
              if (inviteStats?.demo) {
                goLanding();
              } else {
                setScreen("result");
                window.scrollTo(0, 0);
              }
            }}
            onCopied={handleInviteCopied}
          />
        </>
      )}

      {screen === "challenge-result" && pendingChallenge && (
        <>
          <header className="mz-header">
            <div className="mz-header__inner">
              <MozgalicaLogo compact />
            </div>
          </header>
          <ChallengeResult
            challenger={pendingChallenge}
            responder={{
              name: playerName.trim() || "Ti",
              attempts: game.attempts,
              elapsedSeconds: game.elapsedSeconds,
            }}
            onRematch={() => {
              const puzzleId = pendingChallenge.puzzleId;
              setPendingChallenge(null);
              startGame(puzzleId);
            }}
            onShare={handleChallengeShare}
            onBack={goLanding}
          />
        </>
      )}
    </div>
  );
}
