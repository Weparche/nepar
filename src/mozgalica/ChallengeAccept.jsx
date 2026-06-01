import { formatTime, getPuzzleById } from "./puzzle.js";

export default function ChallengeAccept({ challenge, onAccept, onDecline }) {
  const time = formatTime(challenge.elapsedSeconds);
  const puzzle = getPuzzleById(challenge.puzzleId);

  return (
    <div className="mz-challenge-accept" data-testid="challenge-accept">
      <div className="mz-challenge-accept__icon" aria-hidden="true">
        {puzzle.icon}
      </div>
      <h2 className="mz-challenge-accept__title">
        {challenge.name} te izaziva!
      </h2>
      <p className="mz-challenge-accept__text">
        Tema: <strong>{puzzle.title}</strong>. Riješi istu mozgalicu i saznaj
        možeš li pobijediti njegov rezultat.
      </p>

      <div className="mz-challenge-accept__stats">
        <div className="mz-challenge-accept__stat-label">
          Rezultat izazivača · {challenge.name}
        </div>
        <div className="mz-challenge-accept__stat-value">
          4/4 grupe · {challenge.attempts} pokušaja · {time}
        </div>
      </div>

      <div className="mz-challenge-accept__actions">
        <button
          type="button"
          className="mozgalica-btn mozgalica-btn--primary"
          onClick={onAccept}
          data-testid="accept-challenge"
        >
          Prihvati izazov
        </button>
        <button
          type="button"
          className="mozgalica-btn mozgalica-btn--secondary"
          onClick={onDecline}
          data-testid="decline-challenge"
        >
          Ne sada
        </button>
      </div>
    </div>
  );
}
