import {
  PUZZLES_2010S,
  PUZZLES_2020S,
  PUZZLES_WOMEN_40,
  PUZZLES_LEGACY,
} from "./puzzles.js";

const ERA_BADGES = {
  "2020s": "2020-e",
  "2010s": "2010-e",
  women40: "40+",
};

function PuzzleCard({ puzzle, selectedId, onSelect, featured = false }) {
  const isSelected = selectedId === puzzle.id;
  const badge = ERA_BADGES[puzzle.era];

  return (
    <button
      type="button"
      className={`mz-puzzle-card${featured ? " mz-puzzle-card--featured" : ""}${
        isSelected ? " mz-puzzle-card--selected" : ""
      }`}
      onClick={() => onSelect(puzzle.id)}
      data-testid={`puzzle-card-${puzzle.id}`}
      aria-pressed={isSelected}
    >
      {badge && <span className="mz-puzzle-card__badge">{badge}</span>}
      <div className="mz-puzzle-card__icon" aria-hidden="true">
        {puzzle.icon}
      </div>
      <h3 className="mz-puzzle-card__title">{puzzle.title}</h3>
      <p className="mz-puzzle-card__subtitle">{puzzle.subtitle}</p>
      <div className="mz-puzzle-card__tags" aria-hidden="true">
        {puzzle.groups.map((group) => (
          <span key={group.name} className="mz-puzzle-card__tag">
            {group.name}
          </span>
        ))}
      </div>
      <span className="mz-puzzle-card__cta">
        {isSelected ? "Odabrano" : "Igraj"}
        <span className="mz-puzzle-card__cta-arrow" aria-hidden="true">
          →
        </span>
      </span>
    </button>
  );
}

function PuzzleGroup({ title, description, puzzles, selectedId, onSelect, featuredFirst }) {
  return (
    <div className="mz-puzzle-group">
      <div className="mz-puzzle-group__head">
        <h3 className="mz-puzzle-group__title">{title}</h3>
        <p className="mz-puzzle-group__desc">{description}</p>
      </div>
      <div
        className={`mz-puzzle-grid${
          featuredFirst ? " mz-puzzle-grid--featured" : ""
        }`}
      >
        {puzzles.map((puzzle, index) => (
          <PuzzleCard
            key={puzzle.id}
            puzzle={puzzle}
            selectedId={selectedId}
            onSelect={onSelect}
            featured={featuredFirst && index === 0}
          />
        ))}
      </div>
    </div>
  );
}

export default function PuzzlePicker({ onSelect, selectedId }) {
  return (
    <section
      className="mz-section mz-section--puzzles"
      id="mozgalice"
      data-testid="puzzle-picker"
    >
      <div className="mz-section__intro">
        <p className="mz-section__eyebrow">Odaberi temu</p>
        <h2 className="mz-section__title">Mozgalice po temama</h2>
        <p className="mz-section__subtitle">
          Svaka tema ima 16 pojmova u 4 skrivene grupe. Klikni karticu i odmah
          kreće igra, bez registracije.
        </p>
      </div>

      <PuzzleGroup
        title="Za žene 40+"
        description="Šminka, njega, dom, čišćenje, wellness i male svakodnevne pobjede"
        puzzles={PUZZLES_WOMEN_40}
        selectedId={selectedId}
        onSelect={onSelect}
        featuredFirst
      />

      <PuzzleGroup
        title="2020-e"
        description="AI, TikTok, pandemija, Hrvatska i tehnologija"
        puzzles={PUZZLES_2020S}
        selectedId={selectedId}
        onSelect={onSelect}
      />

      <PuzzleGroup
        title="2010-e"
        description="Digitalna era, hitovi, filmovi, svijet i Hrvatska"
        puzzles={PUZZLES_2010S}
        selectedId={selectedId}
        onSelect={onSelect}
      />

      <PuzzleGroup
        title="2000-e i 90-e"
        description="Gaming, sport, glazba, NBA i nostalgija"
        puzzles={PUZZLES_LEGACY}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </section>
  );
}
