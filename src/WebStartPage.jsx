import { useState } from "react";
import { ArrowRight, ArrowUpRight, Check, Info, KeyRound, SearchCheck, Send, ShieldCheck } from "lucide-react";
import PackageInquiryModal from "./PackageInquiryModal.jsx";
import { Background, MotionButton, Navbar, SiteFooter, siteContent } from "./SiteChrome.jsx";
import { formatOfferPrice, webOfferContent } from "./webOfferContent.js";
import { usePageMeta } from "./usePageMeta.js";

const pageCopy = {
  hr: {
    meta: {
      title: "Izrada web-stranica — paketi i cijene | Nepar",
      description: "Paketi izrade web-stranica od 300 € jednokratno i opcionalno godišnje održavanje. Napredna tehnička i on-page SEO optimizacija uključena je u svaki paket.",
    },
    hero: {
      label: "Jasne cijene · bez skrivenog najma",
      title: "Web-stranica koja pripada vašem poslovanju.",
      description: "Od jednostavne profesionalne prezentacije do napredne SEO strukture i prilagođenih upita. Izradu plaćate jednokratno, a održavanje birate samo ako vam treba.",
      ownership: "Web-stranica je nakon plaćanja u vlasništvu klijenta. Održavanje nije obavezno i ugovara se zasebno.",
      primary: "Pogledaj pakete izrade",
      secondary: "Pošalji upit",
      facts: ["Napredni tehnički i on-page SEO", "Responzivan dizajn", "Search Console i analitika", "Dogovoreni opseg i broj dorada"],
    },
    build: {
      title: "Paketi izrade web-stranice",
      intro: "Odaberite opseg koji odgovara količini sadržaja i ulozi koju web ima u vašem poslovanju.",
      cta: "Pošalji upit za paket",
      included: "Uključeno u paket",
      seoNote: "Sve web-stranice uključuju naprednu tehničku i on-page SEO optimizaciju. Razlika između paketa je u količini sadržaja, broju podstranica, funkcionalnostima i opsegu rada.",
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
      redesign: "Cijena redizajna ovisi o postojećem sustavu, broju stranica, sadržaju i funkcionalnostima; zato je početna cijena navedena kao „od 400 €”.",
    },
    faq: {
      title: "Česta pitanja",
      items: [
        ["Tko je vlasnik web-stranice?", "Nakon završetka i plaćanja izrade, web-stranica je u vlasništvu klijenta."],
        ["Moram li ugovoriti održavanje?", "Ne. Održavanje je opcionalno. Možete samostalno upravljati hostingom i sadržajem ili kasnije odabrati godišnji paket."],
        ["Jamčite li prvo mjesto na Googleu?", "Ne. Svaki paket uključuje naprednu tehničku i on-page SEO optimizaciju, ali pozicija ovisi o konkurenciji, sadržaju, autoritetu domene i drugim čimbenicima."],
        ["Što trebam dostaviti?", "Za Web Basic dostavljate tekstove, fotografije i logotip. U većim paketima pomažemo strukturirati, urediti i skratiti dostavljeni sadržaj u opsegu paketa."],
        ["Jesu li webshop i rezervacije dio Web Pro paketa?", "Ne. Webshop, rezervacije, korisnički računi, AI funkcionalnosti i napredne integracije ugovaraju se zasebno."],
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
      title: "Website development packages and pricing | Nepar",
      description: "One-time website development packages from €300 and optional annual maintenance. Advanced technical and on-page SEO is included in every package.",
    },
    hero: {
      label: "Clear pricing · no hidden rental model",
      title: "A website that belongs to your business.",
      description: "From a clear professional presence to advanced SEO architecture and custom inquiry flows. Development is paid once, while maintenance remains your choice.",
      ownership: "The website belongs to the client after payment. Maintenance is optional and contracted separately.",
      primary: "View development packages",
      secondary: "Send an inquiry",
      facts: ["Advanced technical and on-page SEO", "Responsive design", "Search Console and analytics", "Agreed scope and revision rounds"],
    },
    build: {
      title: "Website development packages",
      intro: "Choose the scope that fits your content and the role your website plays in the business.",
      cta: "Ask about this package",
      included: "Included in the package",
      seoNote: "Every website includes advanced technical and on-page SEO optimization. Packages differ in content volume, page count, functionality, and overall scope.",
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
      redesign: "Redesign pricing depends on the existing system, page count, content, and functionality, so the starting price is shown as “from €400”.",
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        ["Who owns the website?", "After development is complete and paid, the website belongs to the client."],
        ["Do I have to purchase maintenance?", "No. Maintenance is optional. You can manage hosting and content independently or choose an annual package later."],
        ["Do you guarantee the first position on Google?", "No. Every package includes advanced technical and on-page SEO, but ranking also depends on competition, content, domain authority, and other factors."],
        ["What do I need to provide?", "For Web Basic, you provide copy, photographs, and a logo. Larger packages include help structuring, editing, and shortening supplied content within the agreed scope."],
        ["Are e-commerce and booking included in Web Pro?", "No. E-commerce, booking, user accounts, AI functionality, and advanced integrations are quoted separately."],
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
  return (
    <article className={`offer-card ${item.featured ? "is-featured" : ""}`}>
      {item.badge && <span className="status-badge">{item.badge}</span>}
      <div className="offer-card-header">
        <h3>{item.name}</h3>
        <p className="offer-price"><strong>{formatOfferPrice(item.price, lang)}</strong><span>{item.payment}</span></p>
      </div>
      {item.description && <p className="offer-description">{item.description}</p>}
      <div className="offer-included">
        <h4>{copy.included}</h4>
        <ul>{item.included.map((benefit) => <li key={benefit}><Check aria-hidden="true" size={17} />{benefit}</li>)}</ul>
      </div>
      {item.note && <p className="offer-note"><Info aria-hidden="true" size={17} />{item.note}</p>}
      {item.project && (
        <a href={item.project.href} target="_blank" rel="noreferrer" className="project-proof-link">
          <span><strong>{item.project.label}</strong><small>{item.project.cta}</small></span>
          <ArrowUpRight aria-hidden="true" size={18} />
        </a>
      )}
      <button type="button" className={item.featured ? "button button-primary" : "button button-secondary"} onClick={() => onSelect(item, offerKind)}>
        {copy.cta}<Send aria-hidden="true" size={17} />
      </button>
    </article>
  );
}

export default function WebStartPage() {
  const [lang, setLang] = useState("hr");
  const [modalOpen, setModalOpen] = useState(false);
  const [selection, setSelection] = useState(null);
  const text = pageCopy[lang];
  const offer = webOfferContent[lang];
  const chrome = siteContent[lang];

  usePageMeta({
    title: text.meta.title,
    description: text.meta.description,
    path: "/usluge/izrada-web-stranica",
    canonicalPath: "/usluge/izrada-web-stranica",
  });

  function openInquiry(item = offer.buildPackages[0], offerKind = "build") {
    setSelection({
      offerKind,
      offerName: item.name,
      priceLabel: `${formatOfferPrice(item.price, lang)} · ${item.payment}`,
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
          <aside className="ownership-panel">
            <ShieldCheck aria-hidden="true" size={28} />
            <p>{text.hero.ownership}</p>
          </aside>
        </div>
        <div className="section-shell pricing-facts">
          {text.hero.facts.map((fact) => <span key={fact}><Check aria-hidden="true" size={16} />{fact}</span>)}
        </div>
      </section>

      <section id="paketi" className="content-section offer-section">
        <div className="section-shell">
          <SectionHeading title={text.build.title} intro={text.build.intro} />
          <div className="offer-grid">
            {offer.buildPackages.map((item) => <OfferCard key={item.id} item={item} lang={lang} copy={text.build} offerKind="build" onSelect={openInquiry} />)}
          </div>
          <div className="seo-note"><SearchCheck aria-hidden="true" size={24} /><p>{text.build.seoNote}</p></div>
        </div>
      </section>

      <section id="odrzavanje" className="content-section maintenance-section">
        <div className="section-shell">
          <SectionHeading title={text.maintenance.title} intro={text.maintenance.intro} />
          <div className="offer-grid maintenance-grid">
            {offer.maintenancePackages.map((item) => <OfferCard key={item.id} item={item} lang={lang} copy={text.maintenance} offerKind="maintenance" onSelect={openInquiry} />)}
          </div>
          <div className="minor-change-note"><Info aria-hidden="true" size={22} /><p>{text.maintenance.minorChange}</p></div>
        </div>
      </section>

      <section id="dodatne-usluge" className="content-section">
        <div className="section-shell additional-layout">
          <SectionHeading title={text.additional.title} intro={text.additional.intro} />
          <dl className="additional-list">
            {offer.additionalServices.map(([service, price]) => <div key={service}><dt>{service}</dt><dd>{price}</dd></div>)}
          </dl>
          <p className="redesign-note">{text.additional.redesign}</p>
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
        offerKind={selection?.offerKind ?? "build"}
        offerName={selection?.offerName ?? offer.buildPackages[0].name}
        priceLabel={selection?.priceLabel ?? `${formatOfferPrice(offer.buildPackages[0].price, lang)} · ${offer.buildPackages[0].payment}`}
      />
      <SiteFooter copy={chrome} homeLink={false} />
    </main>
  );
}
