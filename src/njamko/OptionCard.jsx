import AssetImage from "./AssetImage.jsx";

function answerSlug(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");
}

export default function OptionCard({
  name,
  emoji,
  image,
  onSelect,
  shake,
  flying,
  disabled,
  optionType = "opciju",
  premiumLayout = false,
  isCorrect = false,
  isWrong = false,
  index = 0,
}) {
  const classes = [
    "nj-option-card",
    premiumLayout ? "nj-option-card--premium" : "",
    shake ? "card-shake" : "",
    flying ? "food-fly" : "",
    isCorrect ? "nj-option-card--correct" : "",
    isWrong ? "nj-option-card--wrong" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const ariaLabel = premiumLayout ? `Odaberi ${name}` : `Odaberi ${optionType} ${name}`;

  return (
    <button
      type="button"
      data-testid={`option-card-${answerSlug(name)}`}
      data-answer={name}
      className={classes}
      style={{ "--nj-card-index": index }}
      aria-label={ariaLabel}
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
