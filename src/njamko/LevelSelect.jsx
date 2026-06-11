import { useState } from "react";
import { assetPath } from "./assetPath.js";
import { getMode } from "./data/njamkoLevels.js";
import { canPlayLevel, getLevelStatus } from "./njamkoStorage.js";

const FOOD_LEVEL_MOBILE_BACKGROUNDS = {
  1: assetPath("/assets/backgrounds/food-level-1-container-mobile.webp"),
  2: assetPath("/assets/backgrounds/food-level-2-container-mobile.webp"),
  3: assetPath("/assets/backgrounds/food-level-3-container-mobile.webp"),
  4: assetPath("/assets/backgrounds/food-level-4-container-mobile.webp"),
  5: assetPath("/assets/backgrounds/food-level-5-container-mobile.webp"),
};

const HOME_LEVEL_MOBILE_BACKGROUNDS = {
  1: assetPath("/assets/backgrounds/home-level-1-container-mobile.webp"),
  2: assetPath("/assets/backgrounds/home-level-2-container-mobile.webp"),
  3: assetPath("/assets/backgrounds/home-level-3-container-mobile.webp"),
  4: assetPath("/assets/backgrounds/home-level-4-container-mobile.webp"),
  5: assetPath("/assets/backgrounds/home-level-5-container-mobile.webp"),
};

const SOUND_LEVEL_MOBILE_BACKGROUNDS = {
  1: assetPath("/assets/backgrounds/sound-level-1-container-mobile.webp"),
  2: assetPath("/assets/backgrounds/sound-level-2-container-mobile.webp"),
  3: assetPath("/assets/backgrounds/sound-level-3-container-mobile.webp"),
  4: assetPath("/assets/backgrounds/sound-level-4-container-mobile.webp"),
  5: assetPath("/assets/backgrounds/sound-level-5-container-mobile.webp"),
};

const BABY_LEVEL_MOBILE_BACKGROUNDS = {
  1: assetPath("/assets/backgrounds/baby-level-1-container-mobile.webp"),
  2: assetPath("/assets/backgrounds/baby-level-2-container-mobile.webp"),
  3: assetPath("/assets/backgrounds/baby-level-3-container-mobile.webp"),
  4: assetPath("/assets/backgrounds/baby-level-4-container-mobile.webp"),
  5: assetPath("/assets/backgrounds/baby-level-5-container-mobile.webp"),
};

const COUNTING_LEVEL_MOBILE_BACKGROUNDS = {
  1: assetPath("/assets/backgrounds/counting-level-1.webp"),
  2: assetPath("/assets/backgrounds/counting-level-2.webp"),
  3: assetPath("/assets/backgrounds/counting-level-3.webp"),
  4: assetPath("/assets/backgrounds/counting-level-4.webp"),
  5: assetPath("/assets/backgrounds/counting-level-5.webp"),
};

const LEVEL_MOBILE_BACKGROUNDS = {
  food: FOOD_LEVEL_MOBILE_BACKGROUNDS,
  home: HOME_LEVEL_MOBILE_BACKGROUNDS,
  sound: SOUND_LEVEL_MOBILE_BACKGROUNDS,
  baby: BABY_LEVEL_MOBILE_BACKGROUNDS,
  counting: COUNTING_LEVEL_MOBILE_BACKGROUNDS,
};

const STATUS_LABELS = {
  free: { icon: "✅", text: "Besplatno", className: "nj-badge--free" },
  locked: { icon: "🔒", text: "Plus", className: "nj-badge--plus" },
  unlocked: { icon: "⭐", text: "Otključano", className: "nj-badge--unlocked" },
};

export default function LevelSelect({
  modeId,
  plusUnlocked,
  onSelectLevel,
  onLearnMore,
  onBack,
}) {
  const mode = getMode(modeId);
  const [wiggleLevelId, setWiggleLevelId] = useState(null);
  if (!mode) return null;

  const handleLevelClick = (level) => {
    const playable = canPlayLevel(level);
    if (!playable) {
      setWiggleLevelId(level.id);
      setTimeout(() => setWiggleLevelId(null), 450);
    }
    onSelectLevel(level.id, playable);
  };

  return (
    <div className="nj-level-picker" data-testid="level-select">
      <header className="nj-level-picker__header">
        <h1 className="nj-level-picker__title">
          <span aria-hidden="true">{mode.icon}</span> {mode.title}
        </h1>
        <p className="nj-level-picker__subtitle">{mode.levelSelectSubtitle}</p>
      </header>

      <div className="nj-level-picker__list">
        {mode.levels.map((level) => {
          const status = getLevelStatus(level);
          const badge = STATUS_LABELS[status];
          const mobileBackground = LEVEL_MOBILE_BACKGROUNDS[modeId]?.[level.id] ?? null;
          const activityCount =
            modeId === "counting"
              ? `${level.tasks?.length ?? level.rounds.length} mini-zadatka`
              : `${level.rounds.length} rundi`;

          return (
            <button
              key={level.id}
              type="button"
              data-testid={`level-card-${level.id}`}
              data-mode-id={modeId}
              data-level-id={level.id}
              data-level-status={status}
              className={`nj-level-row level-card-pop${status === "locked" ? " nj-level-row--locked" : ""}${wiggleLevelId === level.id ? " locked-wiggle" : ""}`}
              style={mobileBackground ? { "--nj-level-row-bg-mobile": `url("${mobileBackground}")` } : undefined}
              onClick={() => handleLevelClick(level)}
            >
              <span className="nj-level-row__number" aria-hidden="true">
                {level.id}
              </span>
              <span className="nj-level-row__info">
                <span className="nj-level-row__title">{level.title}</span>
                <span className="nj-level-row__theme">{level.theme}</span>
                <span className="nj-level-row__rounds">{activityCount}</span>
              </span>
              <span className={`nj-level-row__badge nj-badge ${badge.className}`}>
                <span aria-hidden="true">{badge.icon}</span> {badge.text}
              </span>
            </button>
          );
        })}
      </div>

      {!plusUnlocked && (
        <div className="nj-plus-info" data-testid="plus-info-card">
          <h2 className="nj-plus-info__title">Njamko Plus</h2>
          <p className="nj-plus-info__text">
            Otključaj dodatne igre, razine i nove runde za još više učenja.
          </p>
          <p className="nj-plus-info__price">4,99 €</p>
          <button type="button" className="nj-btn nj-btn--secondary nj-plus-info__cta" onClick={onLearnMore}>
            Saznaj više
          </button>
        </div>
      )}

      <button type="button" className="nj-btn nj-btn--secondary nj-level-picker__back" onClick={onBack}>
        Natrag
      </button>
    </div>
  );
}
