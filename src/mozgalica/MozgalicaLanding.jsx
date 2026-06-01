import { Menu, X } from "lucide-react";
import { MozgalicaLogo } from "./MozgalicaLogo.jsx";
import HowToPlay from "./HowToPlay.jsx";
import { DEMO_CHALLENGE, getMockupItems, DEFAULT_PUZZLE_ID } from "./puzzle.js";
import PuzzlePicker from "./PuzzlePicker.jsx";

const NAV_LINKS = [
  ["Kako se igra", "kako-se-igra"],
  ["Izazovi prijatelja", "izazovi"],
  ["Zašto igrati", "zasto"],
  ["Pomoć", "pomoc"],
];

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const headerOffset = 88;
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

const FEATURES = [
  { icon: "🔓", title: "Bez registracije", text: "Odmah igraj, bez računa." },
  { icon: "📅", title: "Nova igra svaki dan", text: "Svježa mozgalica svaki dan." },
  { icon: "⏱️", title: "Samo nekoliko minuta", text: "Kratka pauza za mozak." },
  { icon: "👨‍👩‍👧", title: "Za sve uzraste", text: "Zabavno za cijelu obitelj." },
];

function LandingHeader({ onScrollToPuzzles, menuOpen, setMenuOpen }) {
  return (
    <header className="mz-header" data-testid="landing-header">
      <div className="mz-header__inner">
        <a href="/mozgalica" className="mz-logo" aria-label="Dnevne Asocijacije">
          <MozgalicaLogo />
        </a>

        <nav className="mz-nav" aria-label="Glavna navigacija">
          {NAV_LINKS.map(([label, id]) => (
            <button
              key={id}
              type="button"
              className="mz-nav-link"
              onClick={() => scrollToSection(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="mz-header__cta">
          <button
            type="button"
            className="mozgalica-btn mozgalica-btn--primary mozgalica-btn--sm"
            onClick={onScrollToPuzzles}
            data-testid="header-cta"
          >
            Igraj danas
          </button>
        </div>

        <button
          type="button"
          className="mz-menu-btn"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Zatvori izbornik" : "Otvori izbornik"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav
        className={`mz-mobile-nav${menuOpen ? " mz-mobile-nav--open" : ""}`}
        aria-label="Mobilna navigacija"
      >
        {NAV_LINKS.map(([label, id]) => (
          <button
            key={id}
            type="button"
            className="mz-mobile-nav-link"
            onClick={() => {
              setMenuOpen(false);
              scrollToSection(id);
            }}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          className="mozgalica-btn mozgalica-btn--primary"
          style={{ marginTop: "0.5rem" }}
          onClick={() => {
            setMenuOpen(false);
            onScrollToPuzzles();
          }}
        >
          Igraj danas
        </button>
      </nav>
    </header>
  );
}

function LandingContent({
  selectedPuzzleId,
  onSelectPuzzle,
  onScrollToPuzzles,
  onShowChallengeDemo,
}) {
  const mockupItems = getMockupItems(selectedPuzzleId);

  return (
    <>
      <section className="mz-hero" data-testid="landing-hero">
        <div>
          <h1 className="mz-hero__title" data-testid="hero-title">
            Poveži 16 pojmova u 4 skrivene grupe.
          </h1>
          <p className="mz-hero__subtitle">
            Odaberi temu — gaming, nogomet, muzika, NBA ili HR nostalgija. Kratka
            igra, puno uspomena iz devedesetih.
          </p>
          <div className="mz-hero__actions">
            <button
              type="button"
              className="mozgalica-btn mozgalica-btn--primary"
              onClick={onScrollToPuzzles}
              data-testid="start-game"
            >
              Odaberi mozgalicu
            </button>
            <button
              type="button"
              className="mozgalica-btn mozgalica-btn--secondary"
              onClick={() => {
                document
                  .getElementById("kako-se-igra")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              data-testid="how-to-play-cta"
            >
              Kako se igra
            </button>
          </div>
        </div>

        <div className="mz-mockup" aria-hidden="true" data-testid="hero-mockup">
          <div className="mz-mockup__grid">
            {mockupItems.map((item) => (
              <div key={item} className="mz-mockup__cell">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <PuzzlePicker selectedId={selectedPuzzleId} onSelect={onSelectPuzzle} />

      <HowToPlay />

      <section className="mz-section" id="izazovi" data-testid="challenge-section">
        <h2 className="mz-section__title">Izazovi prijatelja</h2>
        <p className="mz-section__subtitle">
          Pošalji link prijatelju — on igra istu današnju mozgalicu, a pobjednik
          se otkriva tek nakon usporedbe rezultata.
        </p>
        <div className="mz-challenge-preview">
          <div className="mz-challenge-preview__steps">
            <div className="mz-challenge-preview__step">
              <span className="mz-challenge-preview__step-num">1</span>
              Riješi igru i dobiješ link
            </div>
            <div className="mz-challenge-preview__step">
              <span className="mz-challenge-preview__step-num">2</span>
              Prijatelj otvara link i igra
            </div>
            <div className="mz-challenge-preview__step">
              <span className="mz-challenge-preview__step-num">3</span>
              Usporedba — tko je brži i precizniji?
            </div>
          </div>
          <button
            type="button"
            className="mozgalica-btn mozgalica-btn--primary mz-challenge-preview__cta"
            onClick={() => onShowChallengeDemo(DEMO_CHALLENGE)}
            data-testid="landing-challenge-demo"
          >
            Pogledaj primjer linka
          </button>
        </div>
      </section>

      <section className="mz-section" id="zasto" data-testid="features-section">
        <h2 className="mz-section__title">Jedna igra dnevno</h2>
        <p className="mz-section__subtitle">
          Dovoljno da te natjera na razmišljanje, premalo da ti oduzme cijeli dan.
        </p>
        <div className="mz-features">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="mz-feature">
              <div className="mz-feature__icon" aria-hidden="true">
                {feature.icon}
              </div>
              <h3 className="mz-feature__title">{feature.title}</h3>
              <p className="mz-feature__text">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="mz-footer" id="pomoc">
        <div className="mz-footer__inner">
          <MozgalicaLogo compact />
          <nav className="mz-footer__links" aria-label="Podnožje">
            <a href="#kako-se-igra">O igri</a>
            <a href="#kako-se-igra">Pravila</a>
            <a href="mailto:nepar@nepar.hr">Kontakt</a>
            <a href="/">Privatnost</a>
            <a href="/">Uvjeti korištenja</a>
            <a href="/">Kolačići</a>
          </nav>
          <p className="mz-footer__copy">© 2026 Dnevne Asocijacije · nepar.hr</p>
        </div>
      </footer>
    </>
  );
}

export default function MozgalicaLanding({
  selectedPuzzleId,
  onSelectPuzzle,
  onShowChallengeDemo,
  menuOpen,
  setMenuOpen,
}) {
  function scrollToPuzzles() {
    document.getElementById("mozgalice")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <LandingHeader
        onScrollToPuzzles={scrollToPuzzles}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
      <LandingContent
        selectedPuzzleId={selectedPuzzleId}
        onSelectPuzzle={onSelectPuzzle}
        onScrollToPuzzles={scrollToPuzzles}
        onShowChallengeDemo={onShowChallengeDemo}
      />
    </>
  );
}
