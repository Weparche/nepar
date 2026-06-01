export function MozgalicaLogo({ compact = false }) {
  return (
    <div className="mz-logo">
      <div className="mz-logo__icon" aria-hidden="true">
        <span className="mz-logo__sq mz-logo__sq--1" />
        <span className="mz-logo__sq mz-logo__sq--2" />
        <span className="mz-logo__sq mz-logo__sq--3" />
        <span className="mz-logo__sq mz-logo__sq--4">?</span>
      </div>
      {!compact && (
        <span className="mz-logo__text">
          Dnevne
          <br />
          Asocijacije
        </span>
      )}
    </div>
  );
}
