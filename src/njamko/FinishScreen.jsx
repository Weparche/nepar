import Confetti from "./Confetti.jsx";

export default function FinishScreen({
  stars,
  totalRounds,
  modeId,
  levelId,
  onReplay,
  onNextLevel,
  onNextGame,
  onChooseLevel,
  onChooseMode,
}) {
  const isFoodMode = modeId === "food";
  const isLastFoodLevel = isFoodMode && levelId === 5;

  return (
    <div
      className={`nj-finish${isFoodMode ? " nj-finish--food" : ""}`}
      data-testid="finish-screen"
    >
      <Confetti />

      <h2 className="nj-finish__bravo">Bravo!</h2>
      <p className="nj-finish__title">Završio si igru!</p>

      <div className="nj-finish__stats">
        <p className="nj-finish__stat-label">Razina završena</p>
        <p className="nj-finish__stat-value">
          {totalRounds}/{totalRounds} rundi
        </p>
      </div>

      <div className="nj-finish__stars-row" aria-label={`${stars} zvjezdica`}>
        {Array.from({ length: stars }, (_, index) => (
          <span key={index} className="nj-finish__star-item star-pop" aria-hidden="true">
            ⭐
          </span>
        ))}
      </div>

      <div className="nj-finish__actions">
        {isFoodMode ? (
          <>
            <button
              type="button"
              data-testid={isLastFoodLevel ? "next-game-button" : "next-level-button"}
              className="nj-btn nj-btn--primary nj-finish__primary finish-pulse"
              onClick={isLastFoodLevel ? onNextGame : onNextLevel}
            >
              {isLastFoodLevel ? "Sljedeća igra" : "Sljedeća razina"}
            </button>

            <button
              type="button"
              data-testid="replay-button"
              className="nj-btn nj-btn--secondary nj-finish__choose"
              onClick={onReplay}
            >
              Ponovi istu
            </button>
          </>
        ) : (
          <button
            type="button"
            data-testid="replay-button"
            className="nj-btn nj-btn--primary nj-finish__replay finish-pulse"
            onClick={onReplay}
          >
            <span className="nj-btn__icon" aria-hidden="true">
              ↻
            </span>
            Igraj opet
          </button>
        )}

        <button
          type="button"
          data-testid="choose-level-button"
          className="nj-btn nj-btn--secondary nj-finish__choose"
          onClick={onChooseLevel}
        >
          Odaberi drugu razinu
        </button>

        <button
          type="button"
          data-testid="choose-mode-button"
          className="nj-btn nj-btn--secondary nj-finish__choose"
          onClick={onChooseMode}
        >
          Odaberi drugu igru
        </button>
      </div>
    </div>
  );
}
