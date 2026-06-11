import AssetImage from "./AssetImage.jsx";

export default function MainCharacter({
  label,
  emoji,
  image,
  bounce,
  popIn,
  variant = "default",
  showGrass = false,
}) {
  const isPremium = variant === "premium" || variant === "food";
  const classes = [
    "nj-main-character",
    isPremium ? "nj-main-character--premium" : "",
    showGrass ? "nj-main-character--food" : "",
    popIn ? "animal-pop-in" : "",
    bounce ? "animal-bounce" : "animal-idle",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div data-testid="main-character" className={classes}>
      {showGrass && <div className="nj-main-character__grass" aria-hidden="true" />}

      <AssetImage
        src={image}
        alt={label}
        emoji={emoji}
        className="nj-main-character__visual"
      />

      {!isPremium && label && label !== "Zvuk" && (
        <span className="nj-main-character__name">{label}</span>
      )}
    </div>
  );
}
