export default function SolvedGroup({ name, items, index }) {
  return (
    <div
      className={`mz-solved-group mz-solved-group--${index % 4}`}
      data-testid="solved-group"
    >
      <div className="mz-solved-group__name">{name}</div>
      <div className="mz-solved-group__items">
        {items.map((item) => (
          <span key={item} className="mz-solved-group__item">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
