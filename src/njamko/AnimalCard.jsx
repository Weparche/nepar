import AssetImage from "./AssetImage.jsx";
import { getAnimalImageSrc } from "./assets.js";

export default function AnimalCard({
  animalName,
  emoji,
  bounce,
  popIn,
}) {
  const classes = [
    "nj-animal-card",
    popIn ? "animal-pop-in" : "",
    bounce ? "animal-bounce" : "animal-idle",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div data-testid="animal-card" className={classes}>
      <AssetImage
        src={getAnimalImageSrc(animalName)}
        alt={animalName}
        emoji={emoji}
        className="nj-animal-card__visual"
      />
      <span className="nj-animal-card__name">{animalName}</span>
    </div>
  );
}
