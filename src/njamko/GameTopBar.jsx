import SoundToggle from "./SoundToggle.jsx";

export default function GameTopBar({
  levelTitle,
  currentRound,
  totalRounds,
  stars,
  soundEnabled,
  onToggleSound,
  onBack,
}) {
  const progress = Math.round((stars / totalRounds) * 100);

  return (
    <header className="nj-topbar">
      <button
        type="button"
        className="nj-topbar__back"
        onClick={onBack}
        aria-label="Natrag na izbor levela"
      >
        ← Natrag
      </button>

      <div className="nj-topbar__center">
        <p className="nj-topbar__level">{levelTitle}</p>
        <div
          className="nj-topbar__progress"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Napredak igre"
        >
          <span
            className="nj-topbar__progress-fill"
            style={{ "--nj-progress": progress / 100 }}
          />
        </div>
        <p className="nj-topbar__round">
          {currentRound} / {totalRounds}
        </p>
      </div>

      <div className="nj-topbar__actions">
        <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />
        <div className="nj-topbar__stars" aria-label={`${stars} zvjezdica`}>
          <span aria-hidden="true">⭐</span>
          <span>{stars}</span>
        </div>
      </div>
    </header>
  );
}
