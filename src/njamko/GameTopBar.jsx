import SoundToggle from "./SoundToggle.jsx";

export default function GameTopBar({
  modeTitle,
  levelTitle,
  currentRound,
  totalRounds,
  soundEnabled,
  onToggleSound,
  onBack,
  variant = "default",
}) {
  const isPremium = variant === "premium";

  return (
    <header
      className={`nj-topbar${isPremium ? " nj-topbar--premium" : ""}`}
      data-testid="game-topbar"
    >
      <button
        type="button"
        className="nj-topbar__back"
        onClick={onBack}
        aria-label="Natrag na izbor razine"
      >
        {isPremium ? <span aria-hidden="true">←</span> : "← Natrag"}
      </button>

      <div className="nj-topbar__center">
        {isPremium ? (
          <p className="nj-topbar__mode-title">{modeTitle}</p>
        ) : (
          <>
            <p className="nj-topbar__level">
              {modeTitle} · {levelTitle}
            </p>
            <p className="nj-topbar__round" data-testid="game-progress">
              {currentRound}/{totalRounds}
            </p>
          </>
        )}
      </div>

      <div className="nj-topbar__actions">
        {isPremium ? (
          <>
            <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} compact />
            <span className="nj-topbar__badge" data-testid="game-progress">
              {currentRound}/{totalRounds}
            </span>
          </>
        ) : (
          <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />
        )}
      </div>
    </header>
  );
}
