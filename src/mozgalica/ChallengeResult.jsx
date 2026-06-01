import { formatTime, pickChallengeWinner } from "./puzzle.js";

export default function ChallengeResult({
  challenger,
  responder,
  puzzleTitle,
  variant = "played",
  onNotifyChallenger,
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

  const subtitle =
    variant === "received"
      ? `${responder.name} je odigrao izazov „${challenger.name}” — evo usporedbe.`
      : `${challenger.name} te izazvao — pošalji mu link ispod da i on vidi rezultat.`;

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
      <p className="mz-challenge__subtitle">{subtitle}</p>
      {puzzleTitle && (
        <p className="mz-challenge__theme" data-testid="challenge-result-theme">
          Tema: {puzzleTitle}
        </p>
      )}

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

      {variant === "played" && (
        <p className="mz-challenge__notify-hint" data-testid="challenge-notify-hint">
          Izazivač ({challenger.name}) ne vidi automatski tvoj rezultat — pošalji
          mu link gumbom ispod (WhatsApp, SMS…).
        </p>
      )}

      <div className="mz-challenge__actions">
        {variant === "played" ? (
          <>
            <button
              type="button"
              className="mozgalica-btn mozgalica-btn--primary"
              onClick={onNotifyChallenger}
              data-testid="notify-challenger"
            >
              Pošalji {challenger.name} rezultat
            </button>
            <button
              type="button"
              className="mozgalica-btn mozgalica-btn--secondary"
              onClick={onShare}
              data-testid="challenge-share"
            >
              Kopiraj link s rezultatom
            </button>
            <button
              type="button"
              className="mozgalica-btn mozgalica-btn--ghost"
              onClick={onRematch}
              data-testid="rematch"
            >
              Revanš
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="mozgalica-btn mozgalica-btn--primary"
              onClick={onBack}
              data-testid="challenge-done"
            >
              Igraj i ti
            </button>
            <button
              type="button"
              className="mozgalica-btn mozgalica-btn--secondary"
              onClick={onShare}
              data-testid="challenge-share"
            >
              Podijeli rezultat
            </button>
          </>
        )}
      </div>
    </div>
  );
}
