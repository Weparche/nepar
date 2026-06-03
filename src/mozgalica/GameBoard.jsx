import GameCard from "./GameCard.jsx";
import SolvedGroup from "./SolvedGroup.jsx";
import { formatTime } from "./puzzle.js";

export default function GameBoard({
  puzzleTitle,
  gridItems,
  selected,
  solvedGroups,
  attempts,
  elapsedSeconds,
  message,
  wrongItems,
  onSelect,
  onCheck,
  onDeselect,
  onShuffle,
  onBack,
}) {
  const canCheck = selected.length === 4;
  const progressPercent = (solvedGroups.length / 4) * 100;

  return (
    <div className="mz-game" data-testid="game-board">
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
            <strong>
              {solvedGroups.length}/4
            </strong>
          </span>
        </div>
        {selected.length > 0 && (
          <p className="mz-game-selection" aria-live="polite">
            Odabrano: <strong>{selected.length}/4</strong>
          </p>
        )}
      </div>

      {solvedGroups.length > 0 && (
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

      {message && (
        <div
          className={`mz-message mz-message--${message.type}`}
          role="status"
          data-testid="game-message"
        >
          {message.text}
        </div>
      )}

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
    </div>
  );
}
