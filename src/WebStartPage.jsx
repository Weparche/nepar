import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Info, KeyRound, SearchCheck, Send, ShieldCheck } from "lucide-react";
import PackageInquiryModal from "./PackageInquiryModal.jsx";
import { Background, MotionButton, Navbar, SiteFooter, siteContent } from "./SiteChrome.jsx";
import { formatMonthlyEquivalent, formatOfferPrice, webOfferContent } from "./webOfferContent.js";
import { usePageMeta } from "./usePageMeta.js";

const pageCopy = {
  hr: {
    meta: {
      title: "Izrada i redizajn web-stranica — paketi i cijene | Nepar",
      description: "Izrada web-stranica od 300 €, redizajn s migracijom od 800 € i opcionalno godišnje održavanje. Jasno definiran opseg, vlasništvo i cijene.",
    },
    hero: {
      label: "Jasne cijene · bez skrivenog najma",
      title: "Web-stranica koja pripada vašem poslovanju.",
      description: "Od jednostavne profesionalne prezentacije do napredne SEO strukture i prilagođenih upita. Izradu plaćate jednokratno, a održavanje birate samo ako vam treba.",
      ownership: "Web-stranica je nakon plaćanja u vlasništvu klijenta. Održavanje nije obavezno i ugovara se zasebno.",
      startingPrice: "Izrada već od",
      primary: "Pogledaj pakete izrade",
      secondary: "Pošalji upit",
      facts: ["Napredni tehnički i on-page SEO", "Responzivan dizajn", "Search Console i analitika", "Dogovoreni opseg i broj dorada"],
    },
    selector: {
      label: "Vrsta ponude",
      website: "Nova web-stranica",
      redesign: "Redizajn i migracija",
      maintenance: "Održavanje",
      expand: "Sve uključeno",
    },
    build: {
      title: "Paketi izrade web-stranice",
      intro: "Odaberite opseg koji odgovara količini sadržaja i ulozi koju web ima u vašem poslovanju.",
      cta: "Pošalji upit za paket",
      included: "Uključeno u paket",
      seoNote: "Sve web-stranice uključuju naprednu tehničku i on-page SEO optimizaciju. Razlika između paketa je u količini sadržaja, broju podstranica, funkcionalnostima i opsegu rada.",
    },
    redesign: {
      title: "Redizajn i migracija postojeće web-stranice",
      intro: "Migracija sadržaja postojećeg weba uključena je prema opsegu paketa.",
      cta: "Pošalji upit za redizajn",
      included: "Kompletan opseg paketa",
      migrationScope: "Uključeni su sadržaj i fotografije prema opsegu paketa, URL preusmjerenja, hosting, DNS, SSL, analitika i Search Console. Mailboxi, proizvodi, kupci, narudžbe, payment gateway, korisničke baze, licence i nove integracije zahtijevaju zasebnu procjenu.",
    },
    maintenance: {
      title: "Godišnje održavanje web-stranice",
      intro: "Održavanje nije obavezno. Nakon završetka i plaćanja izrade web-stranica je u vlasništvu klijenta. Klijent može samostalno upravljati hostingom i sadržajem ili odabrati jedan od godišnjih paketa održavanja.",
      cta: "Pošalji upit za održavanje",
      included: "Uključeno u održavanje",
      minorChange: "Manja izmjena je promjena postojećeg teksta, fotografije, cijene, kontaktnog podatka ili sličnog sadržaja koja zahtijeva do 15 minuta rada. Novi dizajn, nove podstranice, nove funkcionalnosti i veće sadržajne promjene ugovaraju se zasebno.",
    },
    additional: {
      title: "Dodatne usluge",
      intro: "Za sadržaj i funkcionalnosti izvan dogovorenog paketa dobit ćete jasnu zasebnu procjenu.",
    },
    faq: {
      title: "Česta pitanja",
      items: [
        ["Tko je vlasnik web-stranice?", "Nakon završetka i plaćanja izrade, web-stranica je u vlasništvu klijenta."],
        ["Moram li ugovoriti održavanje?", "Ne. Održavanje je opcionalno. Možete samostalno upravljati hostingom i sadržajem ili kasnije odabrati godišnji paket."],
        ["Jamčite li prvo mjesto na Googleu?", "Ne. Svaki paket uključuje naprednu tehničku i on-page SEO optimizaciju, ali pozicija ovisi o konkurenciji, sadržaju, autoritetu domene i drugim čimbenicima."],
        ["Što trebam dostaviti?", "Za Web Basic dostavljate tekstove, fotografije i logotip. U većim paketima pomažemo strukturirati, urediti i skratiti dostavljeni sadržaj u opsegu paketa."],
        ["Jesu li webshop i rezervacije dio Web Pro paketa?", "Ne. Webshop, rezervacije, korisnički računi, AI funkcionalnosti i napredne integracije ugovaraju se zasebno."],
        ["Što uključuje migracija postojećeg weba?", "Migracija obuhvaća sadržaj i fotografije prema opsegu paketa, dogovorena URL preusmjerenja te prijelaz hostinga, DNS-a, SSL-a, analitike i Search Consolea. Mailboxi, webshop podaci, korisničke baze, licence i nove integracije procjenjuju se zasebno."],
        ["Što znači prvi odgovor unutar jednog radnog dana?", "Rok se odnosi na prvi odgovor i početnu procjenu problema. Vrijeme rješavanja ovisi o vrsti i složenosti problema."],
      ],
    },
    final: {
      title: "Niste sigurni koji paket odgovara vašem projektu?",
      text: "Opišite poslovanje, željeni sadržaj i cilj web-stranice. Preporučit ćemo realan opseg bez nepotrebnih stavki.",
      cta: "Zatraži preporuku",
    },
    backHome: "Natrag na naslovnicu",
  },
  en: {
    meta: {
      title: "Website development and redesign packages | Nepar",
      description: "Website development from €300, redesign with migration from €800, and optional annual maintenance. Clear scope, ownership, and pricing.",
    },
    hero: {
      label: "Clear pricing · no hidden rental model",
      title: "A website that belongs to your business.",
      description: "From a clear professional presence to advanced SEO architecture and custom inquiry flows. Development is paid once, while maintenance remains your choice.",
      ownership: "The website belongs to the client after payment. Maintenance is optional and contracted separately.",
      startingPrice: "Development from",
      primary: "View development packages",
      secondary: "Send an inquiry",
      facts: ["Advanced technical and on-page SEO", "Responsive design", "Search Console and analytics", "Agreed scope and revision rounds"],
    },
    selector: {
      label: "Offer type",
      website: "New website",
      redesign: "Redesign and migration",
      maintenance: "Maintenance",
      expand: "Everything included",
    },
    build: {
      title: "Website development packages",
      intro: "Choose the scope that fits your content and the role your website plays in the business.",
      cta: "Ask about this package",
      included: "Included in the package",
      seoNote: "Every website includes advanced technical and on-page SEO optimization. Packages differ in content volume, page count, functionality, and overall scope.",
    },
    redesign: {
      title: "Existing website redesign and migration",
      intro: "Migration of existing website content is included within the package scope.",
      cta: "Ask about redesign",
      included: "Complete package scope",
      migrationScope: "Included work covers copy and photographs within the package scope, URL redirects, hosting, DNS, SSL, analytics, and Search Console. Mailboxes, products, customers, orders, payment gateways, user databases, licenses, and new integrations require a separate estimate.",
    },
    maintenance: {
      title: "Annual website maintenance",
      intro: "Maintenance is optional. Once development is complete and paid, the website belongs to the client. You can manage hosting and content independently or choose an annual maintenance package.",
      cta: "Ask about maintenance",
      included: "Included in maintenance",
      minorChange: "A minor change is an update to existing copy, a photograph, price, contact detail, or similar content that requires up to 15 minutes of work. New designs, pages, functionality, and larger content changes are quoted separately.",
    },
    additional: {
      title: "Additional services",
      intro: "Content and functionality outside the agreed package receive a clear separate estimate.",
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        ["Who owns the website?", "After development is complete and paid, the website belongs to the client."],
        ["Do I have to purchase maintenance?", "No. Maintenance is optional. You can manage hosting and content independently or choose an annual package later."],
        ["Do you guarantee the first position on Google?", "No. Every package includes advanced technical and on-page SEO, but ranking also depends on competition, content, domain authority, and other factors."],
        ["What do I need to provide?", "For Web Basic, you provide copy, photographs, and a logo. Larger packages include help structuring, editing, and shortening supplied content within the agreed scope."],
        ["Are e-commerce and booking included in Web Pro?", "No. E-commerce, booking, user accounts, AI functionality, and advanced integrations are quoted separately."],
        ["What does an existing website migration include?", "Migration covers copy and photographs within the package scope, agreed URL redirects, and the transition of hosting, DNS, SSL, analytics, and Search Console. Mailboxes, e-commerce data, user databases, licenses, and new integrations are estimated separately."],
        ["What does a first response within one business day mean?", "The response time covers the first reply and initial assessment. Resolution time depends on the type and complexity of the issue."],
      ],
    },
    final: {
      title: "Not sure which package fits your project?",
      text: "Tell us about the business, desired content, and website goal. We will recommend a realistic scope without unnecessary extras.",
      cta: "Request a recommendation",
    },
    backHome: "Back to home",
  },
};

function SectionHeading({ title, intro }) {
  return <div className="section-heading"><h2>{title}</h2>{intro && <p>{intro}</p>}</div>;
}

function OfferCard({ item, lang, copy, offerKind, onSelect }) {
  const highlights = item.highlights ?? item.included.slice(0, 3);
  const remaining = item.highlights ? item.included : item.included.slice(3);

  return (
    <article className={`offer-card ${item.recommended ? "is-featured" : ""}`} data-offer-kind={offerKind} data-package-id={item.id}>
      <div className="offer-card-summary">
        {item.badge && <span className="status-badge">{item.badge}</span>}
        <div className="offer-card-header">
          <h3>{item.name}</h3>
          <p className="offer-price">
            <strong>{formatOfferPrice(item.price, lang, item.priceFrom)}</strong>
            <span>{item.payment}</span>
            {item.monthlyEquivalent && <small>{formatMonthlyEquivalent(item.monthlyEquivalent, lang)}</small>}
            {item.billingNote && <small className="offer-billing-note">{item.billingNote}</small>}
          </p>
        </div>
        {item.description && <p className="offer-description">{item.description}</p>}
        <ul className="offer-card-highlights">
          {highlights.map((benefit) => <li key={benefit}><Check aria-hidden="true" size={16} />{benefit}</li>)}
        </ul>
        <button type="button" className={item.recommended ? "button button-primary" : "button button-secondary"} onClick={() => onSelect(item, offerKind)}>
          {copy.cta}<Send aria-hidden="true" size={17} />
        </button>
      </div>
      <details className="offer-card-disclosure">
        <summary>{copy.expand}<span aria-hidden="true">+</span></summary>
        <div className="offer-card-details">
          {remaining.length > 0 && (
            <div className="offer-included">
              <h4>{copy.included}</h4>
              <ul>{remaining.map((benefit) => <li key={benefit}><Check aria-hidden="true" size={17} />{benefit}</li>)}</ul>
            </div>
          )}
          {item.note && <p className="offer-note"><Info aria-hidden="true" size={17} />{item.note}</p>}
          {item.project && (
            <a href={item.project.href} target="_blank" rel="noreferrer" className="project-proof-link">
              <span><strong>{item.project.label}</strong><small>{item.project.cta}</small></span>
              <ArrowUpRight aria-hidden="true" size={18} />
            </a>
          )}
        </div>
      </details>
    </article>
  );
}

/** @param {string} hash @returns {"website" | "redesign" | "maintenance"} */
export function resolveOfferKindFromHash(hash) {
  if (hash === "#redizajn") return "redesign";
  if (hash === "#odrzavanje") return "maintenance";
  return "website";
}

const offerKinds = ["website", "redesign", "maintenance"];

function offerHash(kind) {
  if (kind === "redesign") return "#redizajn";
  if (kind === "maintenance") return "#odrzavanje";
  return "";
}

export default function WebStartPage() {
  const [lang, setLang] = useState("hr");
  const [modalOpen, setModalOpen] = useState(false);
  const [selection, setSelection] = useState(null);
  const pendingScrollPosition = useRef(null);
  const [activeOffer, setActiveOffer] = useState(() => (
    typeof window === "undefined" ? "website" : resolveOfferKindFromHash(window.location.hash)
  ));
  const text = pageCopy[lang];
  const offer = webOfferContent[lang];
  const chrome = siteContent[lang];

  usePageMeta({
    title: text.meta.title,
    description: text.meta.description,
    path: "/usluge/izrada-web-stranica",
    canonicalPath: "/usluge/izrada-web-stranica",
  });

  useEffect(() => {
    const syncOfferWithHash = () => setActiveOffer(resolveOfferKindFromHash(window.location.hash));
    window.addEventListener("hashchange", syncOfferWithHash);
    return () => window.removeEventListener("hashchange", syncOfferWithHash);
  }, []);

  useLayoutEffect(() => {
    if (!pendingScrollPosition.current) return;
    const { x, y } = pendingScrollPosition.current;
    pendingScrollPosition.current = null;
    window.scrollTo({ left: x, top: y, behavior: "auto" });
  }, [activeOffer]);

  function selectOfferKind(kind) {
    pendingScrollPosition.current = { x: window.scrollX, y: window.scrollY };
    const nextUrl = `${window.location.pathname}${window.location.search}${offerHash(kind)}`;
    window.history.replaceState(window.history.state, "", nextUrl);
    setActiveOffer(kind);
  }

  function handleSelectorKeyDown(event) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const currentIndex = offerKinds.indexOf(activeOffer);
    let nextIndex;
    if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = offerKinds.length - 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (currentIndex - 1 + offerKinds.length) % offerKinds.length;
    else nextIndex = (currentIndex + 1) % offerKinds.length;
    const nextKind = offerKinds[nextIndex];
    selectOfferKind(nextKind);
    window.requestAnimationFrame(() => document.getElementById(`${nextKind}-offer-tab`)?.focus());
  }

  function openInquiry(item = offer.buildPackages[0], offerKind = "website") {
    setSelection({
      offerKind,
      offerName: item.name,
      priceLabel: `${formatOfferPrice(item.price, lang, item.priceFrom)} · ${item.payment}`,
    });
    setModalOpen(true);
  }

  return (
    <main className="site-main pricing-page">
      <Background />
      <Navbar lang={lang} setLang={setLang} copy={chrome} />

      <section id="top" className="pricing-hero">
        <div className="section-shell pricing-hero-layout">
          <div>
            <p className="hero-label"><KeyRound aria-hidden="true" size={16} />{text.hero.label}</p>
            <h1>{text.hero.title}</h1>
            <p className="hero-description">{text.hero.description}</p>
            <div className="hero-actions">
              <MotionButton href="#paketi">{text.hero.primary}<ArrowRight aria-hidden="true" size={18} /></MotionButton>
              <MotionButton onClick={() => openInquiry()} variant="secondary">{text.hero.secondary}<Send aria-hidden="true" size={17} /></MotionButton>
            </div>
          </div>
          <aside className="pricing-hero-proof">
            <div className="pricing-hero-price">
              <span>{text.hero.startingPrice}</span>
              <strong>{formatOfferPrice(offer.buildPackages[0].price, lang)}</strong>
              <small>{offer.buildPackages[0].payment}</small>
            </div>
            <div className="ownership-panel">
              <ShieldCheck aria-hidden="true" size={28} />
              <p>{text.hero.ownership}</p>
            </div>
          </aside>
        </div>
        <div className="section-shell pricing-facts">
          {text.hero.facts.map((fact) => <span key={fact}><Check aria-hidden="true" size={16} />{fact}</span>)}
        </div>
      </section>

      <section id="paketi" className="content-section offer-section offer-selector-section">
        <div className="section-shell">
          <div className="offer-selector" role="tablist" aria-label={text.selector.label}>
            <button
              id="website-offer-tab"
              type="button"
              role="tab"
              tabIndex={activeOffer === "website" ? 0 : -1}
              aria-selected={activeOffer === "website"}
              aria-controls="website-offer-panel"
              onClick={() => selectOfferKind("website")}
              onKeyDown={handleSelectorKeyDown}
            >
              <span>01</span>{text.selector.website}
            </button>
            <button
              id="redesign-offer-tab"
              type="button"
              role="tab"
              tabIndex={activeOffer === "redesign" ? 0 : -1}
              aria-selected={activeOffer === "redesign"}
              aria-controls="redizajn"
              onClick={() => selectOfferKind("redesign")}
              onKeyDown={handleSelectorKeyDown}
            >
              <span>02</span>{text.selector.redesign}
            </button>
            <button
              id="maintenance-offer-tab"
              type="button"
              role="tab"
              tabIndex={activeOffer === "maintenance" ? 0 : -1}
              aria-selected={activeOffer === "maintenance"}
              aria-controls="odrzavanje"
              onClick={() => selectOfferKind("maintenance")}
              onKeyDown={handleSelectorKeyDown}
            >
              <span>03</span>{text.selector.maintenance}
            </button>
          </div>

          <div
            id="website-offer-panel"
            role="tabpanel"
            aria-labelledby="website-offer-tab"
            hidden={activeOffer !== "website"}
            className="offer-selector-panel"
          >
            <SectionHeading title={text.build.title} intro={text.build.intro} />
            <div className="offer-grid pricing-package-grid">
              {offer.buildPackages.map((item) => <OfferCard key={item.id} item={item} lang={lang} copy={{ ...text.build, expand: text.selector.expand }} offerKind="website" onSelect={openInquiry} />)}
            </div>
            <div className="seo-note"><SearchCheck aria-hidden="true" size={24} /><p>{text.build.seoNote}</p></div>
          </div>

          <div
            id="redizajn"
            role="tabpanel"
            aria-labelledby="redesign-offer-tab"
            hidden={activeOffer !== "redesign"}
            className="offer-selector-panel redesign-section"
          >
            <SectionHeading title={text.redesign.title} intro={text.redesign.intro} />
            <div className="offer-grid redesign-grid pricing-package-grid">
              {offer.redesignPackages.map((item) => <OfferCard key={item.id} item={item} lang={lang} copy={{ ...text.redesign, expand: text.selector.expand }} offerKind="redesign" onSelect={openInquiry} />)}
            </div>
            <div className="migration-scope-note"><Info aria-hidden="true" size={22} /><p>{text.redesign.migrationScope}</p></div>
          </div>

          <div
            id="odrzavanje"
            role="tabpanel"
            aria-labelledby="maintenance-offer-tab"
            hidden={activeOffer !== "maintenance"}
            className="offer-selector-panel maintenance-section"
          >
            <SectionHeading title={text.maintenance.title} intro={text.maintenance.intro} />
            <div className="offer-grid maintenance-grid pricing-package-grid">
              {offer.maintenancePackages.map((item) => <OfferCard key={item.id} item={item} lang={lang} copy={{ ...text.maintenance, expand: text.selector.expand }} offerKind="maintenance" onSelect={openInquiry} />)}
            </div>
            <div className="minor-change-note"><Info aria-hidden="true" size={22} /><p>{text.maintenance.minorChange}</p></div>
          </div>
        </div>
      </section>

      <section id="dodatne-usluge" className="content-section">
        <div className="section-shell additional-layout">
          <SectionHeading title={text.additional.title} intro={text.additional.intro} />
          <dl className="additional-list">
            {offer.additionalServices.map(([service, price]) => <div key={service}><dt>{service}</dt><dd>{price}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className="content-section faq-section">
        <div className="section-shell faq-layout">
          <h2>{text.faq.title}</h2>
          <div className="faq-list">
            {text.faq.items.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}<span aria-hidden="true">+</span></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="final-cta-section">
        <div className="section-shell final-cta">
          <div><h2>{text.final.title}</h2><p>{text.final.text}</p></div>
          <MotionButton onClick={() => openInquiry()}>{text.final.cta}<ArrowRight aria-hidden="true" size={18} /></MotionButton>
        </div>
      </section>

      <PackageInquiryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        lang={lang}
        offerKind={selection?.offerKind ?? "website"}
        offerName={selection?.offerName ?? offer.buildPackages[0].name}
        priceLabel={selection?.priceLabel ?? `${formatOfferPrice(offer.buildPackages[0].price, lang, offer.buildPackages[0].priceFrom)} · ${offer.buildPackages[0].payment}`}
      />
      <SiteFooter copy={chrome} homeLink={false} />
    </main>
  );
}
