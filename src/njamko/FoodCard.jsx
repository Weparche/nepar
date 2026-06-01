export default function FoodCard({ name, emoji, onSelect, shake, disabled }) {
  return (
    <button
      type="button"
      data-testid="food-card"
      className={`nj-food-card${shake ? " nj-food-card--shake" : ""}`}
      aria-label={`Odaberi hranu ${name}`}
      onClick={() => onSelect(name)}
      disabled={disabled}
    >
      <span className="nj-food-card__emoji" aria-hidden="true">
        {emoji}
      </span>
      <span className="nj-food-card__name">{name}</span>
    </button>
  );
}
