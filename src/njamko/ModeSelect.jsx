import { NJAMKO_MODES_LIST } from "./data/njamkoLevels.js";
import { assetPath } from "./assetPath.js";

const MODE_CARD_BACKGROUNDS = {
  food: "/assets/modes/food.webp",
  home: "/assets/modes/home.webp",
  sound: "/assets/modes/sound.webp",
  baby: "/assets/modes/baby.webp",
  counting: "/assets/modes/counting.webp",
};

const MODE_CARD_MOBILE_BACKGROUNDS = {
  food: "/assets/odaberi/food.webp",
  home: "/assets/odaberi/home.webp",
  sound: "/assets/odaberi/sound.webp",
  baby: "/assets/odaberi/baby.webp",
  counting: "/assets/odaberi/counting.webp",
};

function formatLevelCount(count) {
  if (count === 1) return "1 razina";
  if (count >= 2 && count <= 4) return `${count} razine`;
  return `${count} razina`;
}

export default function ModeSelect({ onSelectMode, onStartCampaign, onBack }) {
  return (
    <div className="nj-mode-select" data-testid="mode-select">
      <h1 className="nj-mode-select__title">Odaberi igru</h1>
      <p className="nj-mode-select__subtitle">
        Odaberi igru i kreni učiti kroz kratke, nježne runde.
      </p>

      <button
        type="button"
        data-testid="campaign-button"
        className="nj-campaign-card level-card-pop"
        onClick={onStartCampaign}
      >
        <span className="nj-campaign-card__mascot" aria-hidden="true">
          <img src="/njamko.png" alt="" />
        </span>
        <span className="nj-campaign-card__content">
          <span className="nj-campaign-card__label">Preporučeno</span>
          <span className="nj-campaign-card__title">Igraj kampanju</span>
          <span className="nj-campaign-card__desc">
            Putuj kroz sve igre redom i otkrivaj novu mapu.
          </span>
        </span>
      </button>

      <div className="nj-mode-select__grid">
        {NJAMKO_MODES_LIST.map((mode) => (
          <button
            key={mode.id}
            type="button"
            data-testid={`mode-${mode.id}`}
            className={`nj-mode-card nj-mode-card--${mode.id} level-card-pop`}
            style={{
              "--nj-mode-card-bg": `url("${assetPath(MODE_CARD_BACKGROUNDS[mode.id])}")`,
              "--nj-mode-card-bg-mobile": `url("${assetPath(MODE_CARD_MOBILE_BACKGROUNDS[mode.id])}")`,
            }}
            onClick={() => onSelectMode(mode.id)}
          >
            <span className="nj-mode-card__content">
              <span className="nj-mode-card__title">{mode.title}</span>
              <span className="nj-mode-card__desc">{mode.description}</span>
              <span className="nj-mode-card__badge nj-badge nj-badge--free">
                {"\u2713 Razina 1 besplatno"}
              </span>
              <span className="nj-mode-card__meta">
                {formatLevelCount(mode.levelCount ?? mode.levels.length)}
              </span>
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        data-testid="mode-select-back-home"
        className="nj-btn nj-btn--secondary nj-mode-select__back"
        onClick={onBack}
      >
        Natrag na home
      </button>
    </div>
  );
}
