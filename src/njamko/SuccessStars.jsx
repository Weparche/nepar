const STAR_COUNT = 6;

export default function SuccessStars({ visible }) {
  if (!visible) return null;

  return (
    <div className="nj-stars" aria-hidden="true">
      {Array.from({ length: STAR_COUNT }, (_, index) => (
        <span
          key={index}
          className={`star star-${index + 1} star-pop`}
        >
          ⭐
        </span>
      ))}
    </div>
  );
}
