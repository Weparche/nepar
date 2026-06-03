import { useEffect, useRef } from "react";
import GameCard from "./GameCard.jsx";
import ResultPanel from "./ResultPanel.jsx";
import SolvedGroup from "./SolvedGroup.jsx";
import { formatTime } from "./puzzle.js";

export default function GameBoard({
  puzzleTitle,
  solutionGroups,
  gridItems,
  selected,
  solvedGroups,
  attempts,
  elapsedSeconds,
  message,
  wrongItems,
  completed,
  onSelect,
  onCheck,
  onDeselect,
  onShuffle,
  onBack,
  onChallenge,
  onShare,
  onPlayAgain,
  onBackToHome,
}) {
  const canCheck = selected.length === 4;
  const progressPercent = (solvedGroups.length / 4) * 100;
  const resultRef = useRef(null);

  useEffect(() => {
    if (!completed || !resultRef.current) return undefined;

    const timeout = setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 450);

    return () => clearTimeout(timeout);
  }, [completed]);

  return (
    <div
      className={`mz-game${completed ? " mz-game--completed" : ""}`}
      data-testid="game-board"
    >
      <div className="mz-game-top">
        <button
          type="button"
          className="mz-back-btn"
          onClick={onBack}
          aria-label="Natrag na početnu"
        >
          ← Natrag
        </button>
        <p className="mz-game-theme" data-testid="game-theme">
          {puzzleTitle}
        </p>
      </div>

      <div
        className="mz-game-progress"
        role="progressbar"
        aria-valuenow={solvedGroups.length}
        aria-valuemin={0}
        aria-valuemax={4}
        aria-label={`Riješene grupe: ${solvedGroups.length} od 4`}
      >
        <div
          className="mz-game-progress__fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="mz-game-header">
        <div className="mz-game-stats">
          <span className="mz-stat-pill" data-testid="stat-attempts">
            <span className="mz-stat-pill__label">Pokušaji</span>
            <strong>{attempts}</strong>
          </span>
          <span className="mz-stat-pill" data-testid="stat-time">
            <span className="mz-stat-pill__label">Vrijeme</span>
            <strong>{formatTime(elapsedSeconds)}</strong>
          </span>
          <span className="mz-stat-pill mz-stat-pill--accent" data-testid="stat-groups">
            <span className="mz-stat-pill__label">Grupe</span>
            <strong>{solvedGroups.length}/4</strong>
          </span>
        </div>
        {!completed && selected.length > 0 && (
          <p className="mz-game-selection" aria-live="polite">
            Odabrano: <strong>{selected.length}/4</strong>
          </p>
        )}
      </div>

      {!completed && solvedGroups.length > 0 && (
        <div className="mz-solved-groups">
          {solvedGroups.map((group, index) => (
            <SolvedGroup
              key={group.name}
              name={group.name}
              items={group.items}
              index={index}
            />
          ))}
        </div>
      )}

      {!completed && message && (
        <div
          className={`mz-message mz-message--${message.type}`}
          role="status"
          data-testid="game-message"
        >
          {message.text}
        </div>
      )}

      {!completed && (
        <>
          <div className="mz-grid" data-testid="game-grid">
            {gridItems.map((label) => (
              <GameCard
                key={label}
                label={label}
                selected={selected.includes(label)}
                wrong={wrongItems.includes(label)}
                onClick={() => onSelect(label)}
                disabled={false}
              />
            ))}
          </div>

          <div className="mz-game-actions">
            <button
              type="button"
              className="mozgalica-btn mozgalica-btn--primary"
              disabled={!canCheck}
              onClick={onCheck}
              data-testid="check-selection"
            >
              Provjeri odabir
            </button>
            <div className="mz-game-actions__row">
              <button
                type="button"
                className="mozgalica-btn mozgalica-btn--ghost"
                onClick={onDeselect}
                data-testid="deselect-all"
              >
                Poništi
              </button>
              <button
                type="button"
                className="mozgalica-btn mozgalica-btn--orange"
                onClick={onShuffle}
                data-testid="shuffle-cards"
              >
                Promiješaj
              </button>
            </div>
          </div>
        </>
      )}

      {completed && (
        <section
          className="mz-game-complete"
          aria-labelledby="mz-game-complete-title"
        >
          <div className="mz-game-solutions" data-testid="game-all-solutions">
            <h2 id="mz-game-complete-title" className="mz-game-solutions__title">
              Sva rješenja
            </h2>
            <p className="mz-game-solutions__subtitle">
              Čestitamo — sve 4 grupe su pronađene.
            </p>
            <div className="mz-game-solutions__list">
              {solutionGroups.map((group, index) => (
                <SolvedGroup
                  key={group.name}
                  name={group.name}
                  items={group.items}
                  index={index}
                />
              ))}
            </div>
          </div>

          <div ref={resultRef} className="mz-game-result" id="mz-game-result">
            <ResultPanel
              embedded
              puzzleTitle={puzzleTitle}
              attempts={attempts}
              elapsedSeconds={elapsedSeconds}
              onChallenge={onChallenge}
              onShare={onShare}
              onPlayAgain={onPlayAgain}
              onBackToHome={onBackToHome}
            />
          </div>
        </section>
      )}
    </div>
  );
}
