export default function AnimalCard({ emoji, name, bounce }) {
  return (
    <div
      data-testid="animal-card"
      className={`nj-animal-card${bounce ? " nj-animal-card--bounce" : ""}`}
      aria-hidden="true"
    >
      <span className="nj-animal-card__emoji">{emoji}</span>
      <span className="nj-animal-card__name">{name}</span>
    </div>
  );
}
