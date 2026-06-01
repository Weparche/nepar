import AssetImage from "./AssetImage.jsx";

export default function MainCharacter({
  label,
  emoji,
  image,
  bounce,
  popIn,
}) {
  const classes = [
    "nj-main-character",
    popIn ? "animal-pop-in" : "",
    bounce ? "animal-bounce" : "animal-idle",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div data-testid="main-character" className={classes}>
      <AssetImage
        src={image}
        alt={label}
        emoji={emoji}
        className="nj-main-character__visual"
      />
      {label && label !== "Zvuk" && (
        <span className="nj-main-character__name">{label}</span>
      )}
    </div>
  );
}
