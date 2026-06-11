import { useState } from "react";

const CORRECT_ANSWER = 12;

export default function ParentalGate({ onSuccess, onBack }) {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = Number.parseInt(answer.trim(), 10);
    if (value === CORRECT_ANSWER) {
      setError(false);
      onSuccess();
      return;
    }
    setError(true);
  };

  return (
    <div className="nj-parental" data-testid="parental-gate">
      <h1 className="nj-parental__title">Roditeljski kutak</h1>
      <p className="nj-parental__text">Ovaj dio je za roditelje.</p>

      <form className="nj-parental__form" onSubmit={handleSubmit}>
        <label className="nj-parental__label" htmlFor="parental-answer">
          Koliko je 7 + 5?
        </label>
        <input
          id="parental-answer"
          type="text"
          inputMode="numeric"
          autoComplete="off"
          data-testid="parental-answer-input"
          className="nj-parental__input"
          placeholder="Odgovor"
          value={answer}
          onChange={(event) => {
            setAnswer(event.target.value);
            setError(false);
          }}
        />

        {error && (
          <p className="nj-parental__error" data-testid="parental-error" role="alert">
            Pokušaj ponovno.
          </p>
        )}

        <div className="nj-parental__actions">
          <button
            type="submit"
            data-testid="parental-submit-button"
            className="nj-btn nj-btn--primary"
          >
            Nastavi
          </button>
          <button type="button" className="nj-btn nj-btn--secondary" onClick={onBack}>
            Natrag
          </button>
        </div>
      </form>
    </div>
  );
}
