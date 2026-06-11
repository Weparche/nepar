import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
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
  modeTitle,
  levelTitle,
  round,
  roundKey,
  shuffledOptions,
  roundNumber,
  totalRounds,
  feedback,
  selectedAnswer,
  showStars,
  isAnimating,
  soundEnabled,
  onToggleSound,
  onSelectAnswer,
  onPlaySound,
  onBack,
}) {
  const optionType = OPTION_TYPE_LABELS[round.mode] ?? "opciju";
  const isSoundLevel = round.mode === "sound";
  const isFoodLevel = round.mode === "food";
  const isPremiumLayout = true;
  const [soundRevealed, setSoundRevealed] = useState(isSoundLevel);
  const [soundPulseKey, setSoundPulseKey] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const playSoundCue = useCallback(() => {
    onPlaySound();
    setSoundPulseKey((key) => key + 1);
  }, [onPlaySound]);

  useEffect(() => {
    if (!isSoundLevel) {
      setSoundRevealed(false);
      return;
    }

    setSoundRevealed(true);
    if (!soundEnabled) return undefined;

    const timer = setTimeout(() => {
      playSoundCue();
    }, 300);

    return () => clearTimeout(timer);
  }, [roundKey, isSoundLevel, soundEnabled, playSoundCue]);

  const handlePlaySound = () => {
    playSoundCue();
    setSoundRevealed(true);
  };

  const gameClass = [
    "nj-game",
    isPremiumLayout ? "nj-game--premium" : "",
    isSoundLevel ? "nj-game--sound" : "",
    round.mobileAnswerRow ? "nj-game--mobile-answer-row" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={gameClass}
      data-testid="game-screen"
      data-sound-round={isSoundLevel ? "true" : undefined}
      data-sound-autoplay-ready={isSoundLevel && soundRevealed ? "true" : undefined}
    >
      <GameTopBar
        variant={isPremiumLayout ? "premium" : "default"}
        modeTitle={modeTitle}
        levelTitle={levelTitle}
        currentRound={roundNumber}
        totalRounds={totalRounds}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
        onBack={onBack}
      />

      <div className="nj-game__panel">
        <div className="nj-game__hints">
          <p className="nj-game__prompt" data-testid="round-prompt">
            {round.prompt}
          </p>
          {round.question && (
            <p className="nj-game__question" data-testid="round-question">
              {round.question}
            </p>
          )}
        </div>

        {isSoundLevel && (
          <div className="nj-sound-panel">
            <button
              type="button"
              data-testid="sound-button"
              className="nj-btn nj-btn--secondary nj-sound-panel__button"
              onClick={handlePlaySound}
              disabled={isAnimating}
            >
              🔊 {soundRevealed ? "Poslušaj opet" : "Poslušaj zvuk"}
            </button>
            {soundRevealed && (
              <motion.p
                key={`${roundKey}-${soundPulseKey}`}
                className="nj-sound-panel__text"
                data-testid="sound-text"
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10, scale: 0.92 }}
                animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              >
                {round.soundText}
              </motion.p>
            )}
          </div>
        )}

        <div className="nj-animal-area">
          <MainCharacter
            key={roundKey}
            variant="premium"
            showGrass={isFoodLevel}
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
          {shuffledOptions.map((option, index) => (
            <OptionCard
              key={option.name}
              index={index}
              name={option.name}
              emoji={option.emoji}
              image={option.image}
              optionType={optionType}
              premiumLayout={isPremiumLayout}
              isCorrect={feedback === "correct" && selectedAnswer === option.name}
              isWrong={feedback === "wrong" && selectedAnswer === option.name}
              onSelect={onSelectAnswer}
              shake={feedback === "wrong" && selectedAnswer === option.name}
              flying={feedback === "correct" && selectedAnswer === option.name}
              disabled={isAnimating}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
