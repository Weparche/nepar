export default function ChallengeResult({ onRematch, onShare }) {
  return (
    <div className="mz-challenge" data-testid="challenge-result">
      <h2 className="mz-challenge__title">Ivan te izazvao!</h2>

      <div className="mz-challenge__compare">
        <div className="mz-challenge__row">
          <div>
            <div className="mz-challenge__player-name">Ivan</div>
            <div className="mz-challenge__player-stats">4/4 grupe</div>
          </div>
          <div className="mz-challenge__player-stats">7 pokušaja · 02:31</div>
        </div>
        <div className="mz-challenge__row">
          <div>
            <div className="mz-challenge__player-name">Marko</div>
            <div className="mz-challenge__player-stats">4/4 grupe</div>
          </div>
          <div className="mz-challenge__player-stats">8 pokušaja · 03:14</div>
        </div>
      </div>

      <div className="mz-challenge__winner" data-testid="challenge-winner">
        Pobjednik: Ivan
      </div>

      <div className="mz-challenge__actions">
        <button
          type="button"
          className="mozgalica-btn mozgalica-btn--primary"
          onClick={onRematch}
          data-testid="rematch"
        >
          Revanš
        </button>
        <button
          type="button"
          className="mozgalica-btn mozgalica-btn--secondary"
          onClick={onShare}
          data-testid="challenge-share"
        >
          Podijeli
        </button>
      </div>
    </div>
  );
}
