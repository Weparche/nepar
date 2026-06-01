import AnimalCard from "./AnimalCard.jsx";
import FoodCard from "./FoodCard.jsx";
import GameTopBar from "./GameTopBar.jsx";
import SuccessStars from "./SuccessStars.jsx";

export default function GameScreen({
  round,
  roundKey,
  foodOptions,
  roundNumber,
  totalRounds,
  stars,
  feedback,
  selectedFoodName,
  showStars,
  isAnimating,
  soundEnabled,
  onToggleSound,
  onSelectFood,
}) {
  const bubbleClass =
    feedback === "correct" ? "success-bubble" : "try-again-bubble";

  return (
    <div className="nj-game">
      <GameTopBar
        currentRound={roundNumber}
        totalRounds={totalRounds}
        stars={stars}
        soundEnabled={soundEnabled}
        onToggleSound={onToggleSound}
      />

      <div className="nj-game__panel">
        <div className="nj-game__hints">
          <p className="nj-game__prompt">{round.prompt}</p>
          <p className="nj-game__question">{round.question}</p>
        </div>

        <div className="nj-animal-area">
          <AnimalCard
            key={roundKey}
            animalName={round.animal}
            emoji={round.animalEmoji}
            bounce={feedback === "correct" && isAnimating}
            popIn
          />

          <SuccessStars visible={showStars} />

          {feedback && (
            <p
              data-testid="feedback-message"
              className={`nj-bubble ${bubbleClass}`}
              role="status"
            >
              {feedback === "correct" ? "Bravo!" : "Probaj opet."}
            </p>
          )}
        </div>

        <div className="nj-food-grid">
          {foodOptions.map((option) => (
            <FoodCard
              key={option.name}
              name={option.name}
              emoji={option.emoji}
              onSelect={onSelectFood}
              shake={feedback === "wrong" && selectedFoodName === option.name}
              flying={
                feedback === "correct" && selectedFoodName === option.name
              }
              disabled={isAnimating}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
