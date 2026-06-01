import { formatTime, pickChallengeWinner } from "./puzzle.js";

export default function ChallengeResult({
  challenger,
  responder,
  onRematch,
  onShare,
  onBack,
}) {
  const winner = pickChallengeWinner(challenger, responder);
  const challengerTime = formatTime(challenger.elapsedSeconds);
  const responderTime = formatTime(responder.elapsedSeconds);

  let winnerText = "Remi!";
  if (winner === "challenger") {
    winnerText = `Pobjednik: ${challenger.name}`;
  } else if (winner === "responder") {
    winnerText = `Pobjednik: ${responder.name}`;
  }

  return (
    <div className="mz-challenge" data-testid="challenge-result">
      <button
        type="button"
        className="mz-back-btn mz-challenge__back"
        onClick={onBack}
        aria-label="Natrag"
      >
        ←
      </button>
      <h2 className="mz-challenge__title">Rezultat izazova</h2>
      <p className="mz-challenge__subtitle">
        {challenger.name} te izazvao — evo usporedbe.
      </p>

      <div className="mz-challenge__compare">
        <div className="mz-challenge__row">
          <div>
            <div className="mz-challenge__player-name">{challenger.name}</div>
            <div className="mz-challenge__player-stats">4/4 grupe</div>
          </div>
          <div className="mz-challenge__player-stats">
            {challenger.attempts} pokušaja · {challengerTime}
          </div>
        </div>
        <div className="mz-challenge__row">
          <div>
            <div className="mz-challenge__player-name">{responder.name}</div>
            <div className="mz-challenge__player-stats">4/4 grupe</div>
          </div>
          <div className="mz-challenge__player-stats">
            {responder.attempts} pokušaja · {responderTime}
          </div>
        </div>
      </div>

      <div className="mz-challenge__winner" data-testid="challenge-winner">
        {winnerText}
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
