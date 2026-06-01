import Confetti from "./Confetti.jsx";
import AssetImage from "./AssetImage.jsx";
import { UI_IMAGES } from "./assets.js";

export default function FinishScreen({ stars, totalRounds, onReplay, onChooseLevel }) {
  return (
    <div className="nj-finish" data-testid="finish-screen">
      <Confetti />

      <h2 className="nj-finish__bravo">Bravo!</h2>
      <p className="nj-finish__title">Završio si igru!</p>
      <p className="nj-finish__title-full">Bravo, završio si igru!</p>

      <div className="nj-finish__star-wrap finish-pulse" aria-hidden="true">
        <AssetImage
          src={UI_IMAGES.star}
          alt=""
          emoji="⭐"
          className="nj-finish__star"
        />
        <span className="nj-finish__badge">
          {stars} / {totalRounds}
        </span>
      </div>

      <p className="nj-finish__stars">{stars} zvjezdica</p>

      <div className="nj-finish__actions">
        <button
          type="button"
          data-testid="replay-button"
          className="nj-btn nj-btn--primary nj-finish__replay finish-pulse"
          onClick={onReplay}
        >
          <span className="nj-btn__icon" aria-hidden="true">
            ↻
          </span>
          Igraj opet
        </button>

        <button
          type="button"
          data-testid="choose-level-button"
          className="nj-btn nj-btn--secondary nj-finish__choose"
          onClick={onChooseLevel}
        >
          Odaberi drugi level
        </button>
      </div>
    </div>
  );
}
