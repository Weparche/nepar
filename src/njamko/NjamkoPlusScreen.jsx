import { useState } from "react";
import { unlockPlus } from "./njamkoStorage.js";

const BENEFITS = [
  "Dodatne razine",
  "Nove runde za učenje",
  "Plus razine otključane",
  "Bez reklama",
  "Jednokratna kupnja",
];

export default function NjamkoPlusScreen({ onUnlocked, onBack }) {
  const [unlockedMessage, setUnlockedMessage] = useState(false);

  const handleUnlock = () => {
    unlockPlus();
    setUnlockedMessage(true);
    setTimeout(() => {
      onUnlocked();
    }, 900);
  };

  return (
    <div className="nj-plus" data-testid="plus-screen">
      <div className="nj-plus__card">
        <span className="nj-plus__medal" aria-hidden="true">
          ⭐
        </span>
        <h1 className="nj-plus__title">Njamko Plus</h1>
        <p className="nj-plus__subtitle">Otključaj sve dodatne razine.</p>
        <p className="nj-plus__price" data-testid="plus-price">
          4,99 €
        </p>

        <ul className="nj-plus__benefits" data-testid="plus-benefits">
          {BENEFITS.map((benefit) => (
            <li key={benefit}>✅ {benefit}</li>
          ))}
        </ul>

        <p className="nj-plus__note">
          Kupnju uvijek potvrđuje roditelj. Ovo je trenutno demo otključavanje.
        </p>

        {unlockedMessage && (
          <p className="nj-plus__success" role="status">
            Njamko Plus je otključan!
          </p>
        )}

        <div className="nj-plus__actions">
          <button
            type="button"
            data-testid="plus-unlock-button"
            className="nj-btn nj-btn--primary"
            onClick={handleUnlock}
            disabled={unlockedMessage}
          >
            Simuliraj otključavanje
          </button>
          <button type="button" className="nj-btn nj-btn--secondary" onClick={onBack}>
            Natrag
          </button>
        </div>
      </div>
    </div>
  );
}
