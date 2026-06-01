const COLORS = ["#FF9F43", "#6C5CE7", "#2ECC71", "#FFD93D", "#FF6B6B", "#54A0FF"];

const CONFETTI = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  x: `${(index * 17 + 5) % 100}%`,
  delay: `${(index * 0.07) % 1.6}s`,
  duration: `${2.2 + (index % 5) * 0.25}s`,
  color: COLORS[index % COLORS.length],
}));

export default function Confetti() {
  return (
    <div className="nj-confetti" aria-hidden="true">
      {CONFETTI.map(({ id, x, delay, duration, color }) => (
        <span
          key={id}
          className="confetti-fall"
          style={{
            "--x": x,
            "--delay": delay,
            "--duration": duration,
            "--color": color,
            left: x,
          }}
        />
      ))}
    </div>
  );
}
