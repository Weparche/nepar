export default function SuccessOverlay({ visible }) {
  if (!visible) return null;

  return (
    <div className="nj-success-overlay" aria-hidden="true">
      <span className="nj-star nj-star--1">⭐</span>
      <span className="nj-star nj-star--2">✨</span>
      <span className="nj-star nj-star--3">💖</span>
    </div>
  );
}
