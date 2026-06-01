import AssetImage from "./AssetImage.jsx";

export default function OptionCard({
  name,
  emoji,
  image,
  onSelect,
  shake,
  flying,
  disabled,
  optionType = "opciju",
}) {
  const classes = [
    "nj-option-card",
    shake ? "card-shake" : "",
    flying ? "food-fly" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      data-testid="option-card"
      className={classes}
      aria-label={`Odaberi ${optionType} ${name}`}
      onClick={() => onSelect(name)}
      disabled={disabled}
    >
      <AssetImage
        src={image}
        alt=""
        emoji={emoji}
        className="nj-option-card__visual"
      />
      <span className="nj-option-card__name">{name}</span>
    </button>
  );
}
