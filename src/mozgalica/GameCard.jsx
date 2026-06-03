export default function GameCard({ label, selected, wrong, onClick, disabled }) {
  const className = [
    "mz-card",
    selected && "mz-card--selected",
    wrong && "mz-card--wrong",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={label}
      data-testid={`game-card-${label}`}
    >
      <span className="mz-card__label">{label}</span>
      {selected && (
        <span className="mz-card__check" aria-hidden="true">
          ✓
        </span>
      )}
    </button>
  );
}
