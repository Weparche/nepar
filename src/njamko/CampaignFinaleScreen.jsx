export default function CampaignFinaleScreen({ onPlayAgain, onChooseMode }) {
  return (
    <section className="nj-campaign-finale" data-testid="campaign-finale-screen">
      <div className="nj-campaign-finale__mascot-wrap" aria-hidden="true">
        <img className="nj-campaign-finale__mascot" src="/njamko.png" alt="" />
      </div>
      <p className="nj-campaign-finale__eyebrow">Kampanja završena</p>
      <h1 className="nj-campaign-finale__title">Bravo, završio si kampanju!</h1>
      <p className="nj-campaign-finale__text">Njamko je obišao sve životinje!</p>
      <div className="nj-campaign-finale__actions">
        <button
          type="button"
          className="nj-btn nj-btn--primary nj-campaign-finale__button"
          onClick={onPlayAgain}
        >
          Igraj ponovno
        </button>
        <button
          type="button"
          data-testid="campaign-choose-mode-button"
          className="nj-btn nj-btn--secondary nj-campaign-finale__button"
          onClick={onChooseMode}
        >
          Odaberi igru
        </button>
      </div>
    </section>
  );
}
