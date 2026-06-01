export default function NjamkoTitle({ className = "" }) {
  const letters = [
    { char: "N", color: "#5B8DEF" },
    { char: "J", color: "#FFD93D" },
    { char: "A", color: "#FF9F43" },
    { char: "M", color: "#6C5CE7" },
    { char: "K", color: "#2ECC71" },
    { char: "O", color: "#FF6B6B" },
  ];

  return (
    <h1 className={`nj-title ${className}`.trim()} aria-label="Njamko">
      {letters.map(({ char, color }) => (
        <span
          key={char}
          className="nj-title__letter"
          style={{ color }}
          aria-hidden="true"
        >
          {char}
        </span>
      ))}
    </h1>
  );
}
