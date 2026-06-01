import { useCallback, useEffect, useRef, useState } from "react";
import { usePageMeta } from "../usePageMeta.js";
import ChallengeResult from "./ChallengeResult.jsx";
import GameBoard from "./GameBoard.jsx";
import MozgalicaLanding from "./MozgalicaLanding.jsx";
import { MozgalicaLogo } from "./MozgalicaLogo.jsx";
import ResultPanel from "./ResultPanel.jsx";
import {
  PUZZLE_GROUPS,
  buildShareText,
  createInitialGameState,
  findBestPartialMatch,
  findMatchingGroup,
  formatTime,
  shuffleArray,
} from "./puzzle.js";
import "./mozgalica.css";

export default function MozgalicaPage() {
  usePageMeta({
    title: "Dnevne Asocijacije | Mozgalica",
    description:
      "Poveži 16 pojmova u 4 skrivene grupe. Nova mozgalica svaki dan na nepar.hr.",
    path: "/mozgalica",
  });

  const [screen, setScreen] = useState("landing");
  const [menuOpen, setMenuOpen] = useState(false);
  const [game, setGame] = useState(createInitialGameState);
  const timerRef = useRef(null);
  const messageTimerRef = useRef(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
    return () => link.remove();
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
    if (screen === "game" && game.solvedGroups.length === 4) {
      const timeout = setTimeout(() => setScreen("result"), 400);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [screen, game.solvedGroups.length]);

  useEffect(
    () => () => {
      if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
    },
    [],
  );

  const startGame = useCallback(() => {
    setGame(createInitialGameState());
    setScreen("game");
    window.scrollTo(0, 0);
  }, []);

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

      const match = findMatchingGroup(prev.selected, PUZZLE_GROUPS);
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

      const partial = findBestPartialMatch(prev.selected, PUZZLE_GROUPS);
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
    const text = buildShareText({
      attempts: game.attempts,
      time: formatTime(game.elapsedSeconds),
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
  }, [game.attempts, game.elapsedSeconds]);

  const goLanding = useCallback(() => {
    setScreen("landing");
    window.scrollTo(0, 0);
  }, []);

  const showChallenge = useCallback(() => {
    setScreen("challenge");
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mozgalica" data-testid="mozgalica-page">
      {screen === "landing" && (
        <MozgalicaLanding
          onStart={startGame}
          onShowChallenge={showChallenge}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
      )}

      {screen === "game" && (
        <>
          <header className="mz-header">
            <div className="mz-header__inner">
              <MozgalicaLogo compact />
            </div>
          </header>
          <GameBoard
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
            attempts={game.attempts}
            elapsedSeconds={game.elapsedSeconds}
            onChallenge={showChallenge}
            onShare={handleShare}
            onPlayAgain={startGame}
          />
        </>
      )}

      {screen === "challenge" && (
        <>
          <header className="mz-header">
            <div className="mz-header__inner">
              <MozgalicaLogo compact />
            </div>
          </header>
          <ChallengeResult
            onRematch={startGame}
            onShare={handleShare}
            onBack={() => {
              setScreen(game.solvedGroups.length === 4 ? "result" : "landing");
              window.scrollTo(0, 0);
            }}
          />
        </>
      )}
    </div>
  );
}
