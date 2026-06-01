import Confetti from "./Confetti.jsx";
import AssetImage from "./AssetImage.jsx";
import { UI_IMAGES } from "./assets.js";
import { ROUNDS } from "./rounds.js";

export default function FinishScreen({ stars, onReplay }) {
  return (
    <div className="nj-finish" data-testid="finish-screen">
      <Confetti />

      <h2 className="nj-finish__bravo">Bravo!</h2>
      <p className="nj-finish__title">Nahranio si sve životinje!</p>
      <p className="nj-finish__title-full">
        Bravo, nahranio si sve životinje!
      </p>

      <div className="nj-finish__star-wrap finish-pulse" aria-hidden="true">
        <AssetImage
          src={UI_IMAGES.star}
          alt=""
          emoji="⭐"
          className="nj-finish__star"
        />
        <span className="nj-finish__badge">
          {stars} / {ROUNDS.length}
        </span>
      </div>

      <p className="nj-finish__stars">{stars} zvjezdica</p>

      <button
        type="button"
        data-testid="replay-button"
        className="nj-btn nj-btn--primary nj-finish__replay finish-pulse"
        onClick={onReplay}
      >
        <span className="nj-btn__icon" aria-hidden="true">
          ↻
        </span>
        Igraj ponovno
      </button>
    </div>
  );
}
