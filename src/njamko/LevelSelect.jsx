import { NJAMKO_LEVELS } from "./data/njamkoLevels.js";
import NjamkoTitle from "./NjamkoTitle.jsx";

export default function LevelSelect({ onSelectLevel }) {
  return (
    <div className="nj-level-select" data-testid="level-select">
      <NjamkoTitle className="nj-level-select__title" />
      <p className="nj-level-select__subtitle">Odaberi igru!</p>

      <div className="nj-level-select__grid">
        {NJAMKO_LEVELS.map((level) => (
          <button
            key={level.id}
            type="button"
            data-testid={level.testId}
            className="nj-level-card"
            onClick={() => onSelectLevel(level.id)}
          >
            <span className="nj-level-card__icon" aria-hidden="true">
              {level.icon}
            </span>
            <span className="nj-level-card__title">{level.title}</span>
            <span className="nj-level-card__desc">{level.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
