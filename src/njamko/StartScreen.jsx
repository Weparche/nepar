import NjamkoTitle from "./NjamkoTitle.jsx";

const BADGES = [
  { icon: "👶", label: "Jednostavno za 3+" },
  { icon: "📖", label: "Bez čitanja" },
  { icon: "🔒", label: "Sigurno i privatno" },
];

export default function StartScreen({ onStart }) {
  return (
    <div className="nj-start">
      <div className="nj-start__hero">
        <NjamkoTitle className="nj-start__title" />
        <p className="nj-start__subtitle">Igraj, uči i otkrivaj životinje!</p>
        <div className="nj-start__mascot-wrap" aria-hidden="true">
          <span className="nj-start__mascot">🦁</span>
        </div>
      </div>

      <button
        type="button"
        data-testid="start-button"
        className="nj-btn nj-btn--primary nj-start__play"
        onClick={onStart}
      >
        <span className="nj-btn__icon" aria-hidden="true">
          ▶
        </span>
        Igraj
      </button>

      <footer className="nj-start__footer">
        <ul className="nj-start__badges">
          {BADGES.map(({ icon, label }) => (
            <li key={label}>
              <span aria-hidden="true">{icon}</span> {label}
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
}
