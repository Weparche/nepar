export default function SoundToggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      className={`nj-sound-toggle${enabled ? " nj-sound-toggle--on" : ""}`}
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Isključi zvuk" : "Uključi zvuk"}
      title={enabled ? "Zvuk uključen" : "Zvuk isključen"}
    >
      <span className="nj-sound-toggle__icon" aria-hidden="true">
        {enabled ? "🔊" : "🔇"}
      </span>
      <span className="nj-sound-toggle__label">Zvuk</span>
    </button>
  );
}
