export default function SoundToggle({ enabled, onToggle, compact = false }) {
  return (
    <button
      type="button"
      className={`nj-sound-toggle${enabled ? " nj-sound-toggle--on" : ""}${
        compact ? " nj-sound-toggle--compact" : ""
      }`}
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Isključi zvuk" : "Uključi zvuk"}
      title={enabled ? "Zvuk uključen" : "Zvuk isključen"}
    >
      <span className="nj-sound-toggle__icon" aria-hidden="true">
        {enabled ? "🔊" : "🔇"}
      </span>
      {!compact && <span className="nj-sound-toggle__label">Zvuk</span>}
    </button>
  );
}
