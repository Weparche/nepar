import AnimalCard from "./AnimalCard.jsx";
import FoodCard from "./FoodCard.jsx";
import GameTopBar from "./GameTopBar.jsx";

export default function GameScreen({
  round,
  foodOptions,
  roundNumber,
  totalRounds,
  stars,
  feedback,
  animalBounce,
  shakeFood,
  soundEnabled,
  onToggleSound,
  onSelectFood,
  locked,
}) {
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
            emoji={round.animalEmoji}
            name={round.animal}
            bounce={animalBounce}
          />

          {feedback && (
            <p
              data-testid="feedback-message"
              className={`nj-speech nj-speech--${feedback}`}
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
              shake={shakeFood === option.name}
              disabled={locked}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
