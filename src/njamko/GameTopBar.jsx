import SoundToggle from "./SoundToggle.jsx";

export default function GameTopBar({
  currentRound,
  totalRounds,
  stars,
  soundEnabled,
  onToggleSound,
}) {
  const progress = Math.round((stars / totalRounds) * 100);

  return (
    <header className="nj-topbar">
      <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />

      <div className="nj-topbar__progress-wrap">
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
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="nj-topbar__round">
          Runda {currentRound} / {totalRounds}
        </p>
      </div>

      <div className="nj-topbar__stars" aria-label={`${stars} zvjezdica`}>
        <span aria-hidden="true">⭐</span>
        <span>{stars}</span>
      </div>
    </header>
  );
}
