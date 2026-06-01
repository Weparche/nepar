import AssetImage from "./AssetImage.jsx";
import { getFoodImageSrc } from "./assets.js";

export default function FoodCard({
  name,
  emoji,
  onSelect,
  shake,
  flying,
  disabled,
}) {
  const classes = [
    "nj-food-card",
    shake ? "card-shake" : "",
    flying ? "food-fly" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      data-testid="food-card"
      className={classes}
      aria-label={`Odaberi hranu ${name}`}
      onClick={() => onSelect(name)}
      disabled={disabled}
    >
      <AssetImage
        src={getFoodImageSrc(name)}
        alt=""
        emoji={emoji}
        className="nj-food-card__visual"
      />
      <span className="nj-food-card__name">{name}</span>
    </button>
  );
}
