import { buildShareText, formatTime } from "./puzzle.js";

export default function ResultPanel({
  attempts,
  elapsedSeconds,
  onChallenge,
  onShare,
  onPlayAgain,
}) {
  const time = formatTime(elapsedSeconds);

  return (
    <div className="mz-result" data-testid="result-panel">
      <div className="mz-result__trophy" aria-hidden="true">
        🏆
      </div>
      <h2 className="mz-result__title">Bravo!</h2>
      <p className="mz-result__text">Riješio si današnju igru!</p>

      <div className="mz-result__stats">
        <div>
          <div className="mz-result__stat-label">Grupe</div>
          <div className="mz-result__stat-value" data-testid="result-groups">
            4/4
          </div>
        </div>
        <div>
          <div className="mz-result__stat-label">Pokušaji</div>
          <div className="mz-result__stat-value" data-testid="result-attempts">
            {attempts}
          </div>
        </div>
        <div>
          <div className="mz-result__stat-label">Vrijeme</div>
          <div className="mz-result__stat-value" data-testid="result-time">
            {time}
          </div>
        </div>
        <div>
          <div className="mz-result__stat-label">Dnevni niz</div>
          <div className="mz-result__stat-value" data-testid="result-streak">
            3
          </div>
        </div>
      </div>

      <div className="mz-result__actions">
        <button
          type="button"
          className="mozgalica-btn mozgalica-btn--primary"
          onClick={onChallenge}
          data-testid="challenge-friends"
        >
          Izazovi prijatelja
        </button>
        <button
          type="button"
          className="mozgalica-btn mozgalica-btn--green"
          onClick={onShare}
          data-testid="share-result"
        >
          Podijeli rezultat
        </button>
        <button
          type="button"
          className="mozgalica-btn mozgalica-btn--secondary"
          onClick={onPlayAgain}
          data-testid="play-again"
        >
          Igraj ponovno
        </button>
      </div>

      <textarea
        readOnly
        aria-hidden="true"
        tabIndex={-1}
        style={{ position: "absolute", left: "-9999px", opacity: 0 }}
        value={buildShareText({ attempts, time })}
        data-testid="share-text-hidden"
      />
    </div>
  );
}
