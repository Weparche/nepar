import { PUZZLES } from "./puzzles.js";

export default function PuzzlePicker({ onSelect, selectedId }) {
  return (
    <section className="mz-section" id="mozgalice" data-testid="puzzle-picker">
      <h2 className="mz-section__title">Odaberi mozgalicu</h2>
      <p className="mz-section__subtitle">
        Svaka tema ima 16 pojmova u 4 skrivene grupe. Izaberi onu koja te najviše
        vuče — ili probaj sve.
      </p>
      <div className="mz-puzzle-grid">
        {PUZZLES.map((puzzle) => (
          <button
            key={puzzle.id}
            type="button"
            className={`mz-puzzle-card${
              selectedId === puzzle.id ? " mz-puzzle-card--selected" : ""
            }`}
            onClick={() => onSelect(puzzle.id)}
            data-testid={`puzzle-card-${puzzle.id}`}
          >
            <div className="mz-puzzle-card__icon" aria-hidden="true">
              {puzzle.icon}
            </div>
            <h3 className="mz-puzzle-card__title">{puzzle.title}</h3>
            <p className="mz-puzzle-card__subtitle">{puzzle.subtitle}</p>
            <div className="mz-puzzle-card__tags">
              {puzzle.groups.map((group) => (
                <span key={group.name} className="mz-puzzle-card__tag">
                  {group.name}
                </span>
              ))}
            </div>
            <span className="mz-puzzle-card__cta">Igraj →</span>
          </button>
        ))}
      </div>
    </section>
  );
}
