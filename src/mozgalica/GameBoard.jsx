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

  return (
    <div className="mz-game" data-testid="game-board">
      <div className="mz-game-theme" data-testid="game-theme">
        {puzzleTitle}
      </div>
      <div className="mz-game-header">
        <button
          type="button"
          className="mz-back-btn"
          onClick={onBack}
          aria-label="Natrag na početnu"
        >
          ←
        </button>
        <div className="mz-game-stats">
          <span className="mz-stat" data-testid="stat-attempts">
            Pokušaji: <strong>{attempts}</strong>
          </span>
          <span className="mz-stat" data-testid="stat-time">
            Vrijeme: <strong>{formatTime(elapsedSeconds)}</strong>
          </span>
          <span className="mz-stat" data-testid="stat-groups">
            Grupe: <strong>{solvedGroups.length}/4</strong>
          </span>
        </div>
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
