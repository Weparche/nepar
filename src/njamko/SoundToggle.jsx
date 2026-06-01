export default function SoundToggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      className="nj-sound-toggle"
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Isključi zvuk" : "Uključi zvuk"}
    >
      <span aria-hidden="true">{enabled ? "🔊" : "🔇"}</span>
    </button>
  );
}
