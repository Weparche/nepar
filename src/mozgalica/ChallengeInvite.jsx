import { useMemo } from "react";
import {
  buildChallengeInviteText,
  buildChallengeLink,
  formatTime,
} from "./puzzle.js";

export default function ChallengeInvite({
  playerName,
  onPlayerNameChange,
  attempts,
  elapsedSeconds,
  puzzleId,
  puzzleTitle,
  onBack,
  onCopied,
}) {
  const time = formatTime(elapsedSeconds);
  const challengeLink = useMemo(
    () =>
      buildChallengeLink({
        name: playerName || "Prijatelj",
        attempts,
        elapsedSeconds,
        puzzleId,
      }),
    [playerName, attempts, elapsedSeconds, puzzleId],
  );

  const shareText = buildChallengeInviteText({
    name: playerName || "Prijatelj",
    attempts,
    time,
    link: challengeLink,
    puzzleTitle,
  });

  async function handleCopy() {
    await navigator.clipboard.writeText(challengeLink);
    onCopied?.();
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Dnevne Asocijacije — izazov",
          text: shareText,
        });
        return;
      } catch {
        /* fall through */
      }
    }
    await navigator.clipboard.writeText(shareText);
    onCopied?.();
  }

  return (
    <div className="mz-challenge-invite" data-testid="challenge-invite">
      <button
        type="button"
        className="mz-back-btn mz-challenge__back"
        onClick={onBack}
        aria-label="Natrag"
      >
        ←
      </button>

      <h2 className="mz-challenge-invite__title">Izazovi prijatelja</h2>
      <p className="mz-challenge-invite__text">
        Pošalji link prijatelju za temu „{puzzleTitle}”. Kad riješi istu
        mozgalicu, usporedit ćemo rezultate.
      </p>

      <label className="mz-challenge-invite__label" htmlFor="challenge-name">
        Tvoje ime (prikazat će se u izazovu)
      </label>
      <input
        id="challenge-name"
        type="text"
        className="mz-challenge-invite__input"
        value={playerName}
        onChange={(e) => onPlayerNameChange(e.target.value)}
        placeholder="npr. Marko"
        maxLength={24}
        data-testid="challenge-name-input"
      />

      <div className="mz-challenge-invite__stats">
        <div className="mz-challenge-invite__stat-label">
          Tvoj rezultat · {puzzleTitle}
        </div>
        <div className="mz-challenge-invite__stat-value">
          4/4 grupe · {attempts} pokušaja · {time}
        </div>
      </div>

      <label className="mz-challenge-invite__label" htmlFor="challenge-link">
        Link za prijatelja
      </label>
      <input
        id="challenge-link"
        type="text"
        readOnly
        className="mz-challenge-invite__link"
        value={challengeLink}
        data-testid="challenge-link"
        aria-label="Link za izazov"
      />

      <div className="mz-challenge-invite__actions">
        <button
          type="button"
          className="mozgalica-btn mozgalica-btn--primary"
          onClick={handleCopy}
          data-testid="copy-challenge-link"
        >
          Kopiraj link
        </button>
        <button
          type="button"
          className="mozgalica-btn mozgalica-btn--secondary"
          onClick={handleShare}
          data-testid="share-challenge-link"
        >
          Podijeli izazov
        </button>
      </div>

      <p className="mz-challenge-invite__hint" data-testid="challenge-invite-hint">
        Prijatelj otvara link, igra istu mozgalicu, a zatim vidi usporedbu s
        tvojim rezultatom.
      </p>

      <textarea
        readOnly
        aria-hidden="true"
        tabIndex={-1}
        style={{ position: "absolute", left: "-9999px", opacity: 0 }}
        value={shareText}
        data-testid="challenge-share-text-hidden"
      />
    </div>
  );
}
