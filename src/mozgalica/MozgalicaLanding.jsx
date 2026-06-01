import { Menu, X } from "lucide-react";
import { MozgalicaLogo } from "./MozgalicaLogo.jsx";
import HowToPlay from "./HowToPlay.jsx";
import { MOCKUP_ITEMS } from "./puzzle.js";

const NAV_LINKS = [
  ["Kako se igra", "#kako-se-igra"],
  ["Izazovi prijatelja", "#izazovi"],
  ["Zašto igrati", "#zasto"],
  ["Pomoć", "#pomoc"],
];

const FEATURES = [
  { icon: "🔓", title: "Bez registracije", text: "Odmah igraj, bez računa." },
  { icon: "📅", title: "Nova igra svaki dan", text: "Svježa mozgalica svaki dan." },
  { icon: "⏱️", title: "Samo nekoliko minuta", text: "Kratka pauza za mozak." },
  { icon: "👨‍👩‍👧", title: "Za sve uzraste", text: "Zabavno za cijelu obitelj." },
];

function LandingHeader({ onStart, menuOpen, setMenuOpen }) {
  return (
    <header className="mz-header" data-testid="landing-header">
      <div className="mz-header__inner">
        <a href="/mozgalica" className="mz-logo" aria-label="Dnevne Asocijacije">
          <MozgalicaLogo />
        </a>

        <nav className="mz-nav" aria-label="Glavna navigacija">
          {NAV_LINKS.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>

        <div className="mz-header__cta">
          <button
            type="button"
            className="mozgalica-btn mozgalica-btn--primary mozgalica-btn--sm"
            onClick={onStart}
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
        {NAV_LINKS.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setMenuOpen(false)}>
            {label}
          </a>
        ))}
        <button
          type="button"
          className="mozgalica-btn mozgalica-btn--primary"
          style={{ marginTop: "0.5rem" }}
          onClick={() => {
            setMenuOpen(false);
            onStart();
          }}
        >
          Igraj danas
        </button>
      </nav>
    </header>
  );
}

function LandingContent({ onStart }) {
  return (
    <>
      <section className="mz-hero" data-testid="landing-hero">
        <div>
          <h1 className="mz-hero__title" data-testid="hero-title">
            Poveži 16 pojmova u 4 skrivene grupe.
          </h1>
          <p className="mz-hero__subtitle">
            Nova mozgalica svaki dan. Kratka je, zabavna i taman dovoljno teška da
            te natjera na razmišljanje.
          </p>
          <div className="mz-hero__actions">
            <button
              type="button"
              className="mozgalica-btn mozgalica-btn--primary"
              onClick={onStart}
              data-testid="start-game"
            >
              Igraj današnju igru
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
            {MOCKUP_ITEMS.map((item) => (
              <div key={item} className="mz-mockup__cell">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <HowToPlay />

      <section className="mz-section" id="izazovi" data-testid="challenge-section">
        <h2 className="mz-section__title">Izazovi prijatelja</h2>
        <p className="mz-section__subtitle">
          Usporedi rezultate i saznaj tko je brži i precizniji.
        </p>
        <div className="mz-challenge-preview">
          <div className="mz-vs">
            <div className="mz-vs__player">
              <div className="mz-vs__avatar">I</div>
              <div className="mz-vs__name">Ivan</div>
              <div className="mz-vs__stat">4/4 · 7 pokušaja · 02:31</div>
            </div>
            <div className="mz-vs__divider">vs</div>
            <div className="mz-vs__player">
              <div className="mz-vs__avatar">M</div>
              <div className="mz-vs__name">Marko</div>
              <div className="mz-vs__stat">4/4 · 8 pokušaja · 03:14</div>
            </div>
          </div>
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

export default function MozgalicaLanding({ onStart, menuOpen, setMenuOpen }) {
  return (
    <>
      <LandingHeader onStart={onStart} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <LandingContent onStart={onStart} />
    </>
  );
}
