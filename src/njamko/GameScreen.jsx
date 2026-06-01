import FeedbackBubble from "./FeedbackBubble.jsx";
import GameTopBar from "./GameTopBar.jsx";
import MainCharacter from "./MainCharacter.jsx";
import OptionCard from "./OptionCard.jsx";
import SuccessStars from "./SuccessStars.jsx";

const OPTION_TYPE_LABELS = {
  food: "hranu",
  home: "dom",
  sound: "životinju",
  baby: "mamu",
};

export default function GameScreen({
  levelTitle,
  round,
  roundKey,
  shuffledOptions,
  roundNumber,
  totalRounds,
  stars,
  feedback,
  selectedAnswer,
  showStars,
  isAnimating,
  soundAutoplayReady,
  soundEnabled,
  onToggleSound,
  onSelectAnswer,
  onPlaySound,
  onBack,
}) {
  const optionType = OPTION_TYPE_LABELS[round.mode] ?? "opciju";
  const isSoundLevel = round.mode === "sound";

  return (
    <div
      className={`nj-game${isSoundLevel ? " nj-game--sound" : ""}`}
      data-testid="game-screen"
      data-sound-round={isSoundLevel ? "true" : undefined}
      data-sound-autoplay-ready={isSoundLevel && soundAutoplayReady ? "true" : undefined}
    >
      <GameTopBar
        levelTitle={levelTitle}
        currentRound={roundNumber}
        totalRounds={totalRounds}
        stars={stars}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        onBack={onBack}
      />

      <div className="nj-game__panel">
        <div className="nj-game__hints">
          <p className="nj-game__prompt">{round.prompt}</p>
          <p className="nj-game__question">{round.question}</p>
        </div>

        {isSoundLevel && (
          <div className="nj-sound-panel">
            <button
              type="button"
              data-testid="sound-button"
              className="nj-btn nj-btn--secondary nj-sound-panel__button"
              onClick={onPlaySound}
              disabled={isAnimating}
            >
              🔊 Poslušaj opet
            </button>
            <span className="nj-sr-only" data-testid="sound-text">
              {round.soundText}
            </span>
          </div>
        )}

        <div className="nj-animal-area">
          <MainCharacter
            key={roundKey}
            label={round.mainLabel}
            emoji={round.mainEmoji}
            image={round.mainImage}
            bounce={feedback === "correct" && isAnimating}
            popIn
          />

          <SuccessStars visible={showStars} />
          <FeedbackBubble feedback={feedback} />
        </div>

        <div className="nj-option-grid">
          {shuffledOptions.map((option) => (
            <OptionCard
              key={option.name}
              name={option.name}
              emoji={option.emoji}
              image={option.image}
              optionType={optionType}
              onSelect={onSelectAnswer}
              shake={feedback === "wrong" && selectedAnswer === option.name}
              flying={
                feedback === "correct" && selectedAnswer === option.name
              }
              disabled={isAnimating}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
