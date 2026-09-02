import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  CircleDollarSign,
  ExternalLink,
  Globe2,
  Mail,
  MapPinned,
  Search,
  Send,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { ConsentSettingsLink } from "./ConsentManager.jsx";
import { getCampaignAttribution, trackEvent } from "./analytics.js";
import { usePageMeta } from "./usePageMeta.js";
import "./webLanding.css";

const projects = [
  {
    title: "Auto Gubić",
    type: "Komercijalni web",
    description: "Profesionalna stranica za specijalizirani Volvo servis, s lokalnim SEO-om i jasnim servisnim upitom.",
    image: "/brand/autogubic-landing.webp",
    alt: "Auto Gubić web-stranica za specijalizirani Volvo servis",
    href: "https://autogubic.hr/",
    className: "web-project--featured",
  },
  {
    title: "BezStruje.hr",
    type: "Informacijski portal",
    description: "Portal za planirane radove, kvarove i lokacije prekida električne energije.",
    image: "/brand/bezstruje.webp",
    alt: "BezStruje.hr portal za planirane radove i kvarove",
    href: "https://bezstruje.hr",
  },
  {
    title: "VremenskaPrognoza.hr",
    type: "Podatkovna platforma",
    description: "Responzivna vremenska platforma s prognozama, upozorenjima i podacima za cijelu Hrvatsku.",
    image: "/brand/vremenskaprognoza.webp",
    alt: "VremenskaPrognoza.hr prikaz prognoze za Hrvatsku",
    href: "https://vremenskaprognoza.hr",
  },
];

const reasons = [
  {
    title: "Izgleda profesionalno",
    description: "Dizajn prilagođen vašem poslu, ne generički predložak koji izgleda kao svi ostali.",
    Icon: Smartphone,
    imageDesktop: "/brand/reason-design-desktop.webp",
    imageMobile: "/brand/reason-design-mobile.webp",
  },
  {
    title: "Ljudi vas mogu pronaći",
    description: "SEO osnova, brzina i tehnički ispravno indeksiranje ugrađeni su od početka.",
    Icon: Search,
    imageDesktop: "/brand/reason-seo-desktop.webp",
    imageMobile: "/brand/reason-seo-mobile.webp",
  },
  {
    title: "Stranica je vaša",
    description: "Bez zaključavanja na platformu i bez obavezne mjesečne pretplate.",
    Icon: ShieldCheck,
    imageDesktop: "/brand/reason-ownership-desktop.webp",
    imageMobile: "/brand/reason-ownership-mobile.webp",
  },
];

const packages = [
  {
    name: "Start",
    price: "300 €",
    description: "Jasan profesionalni početak za manji posao.",
    features: ["Profesionalna jednostranična stranica", "Responsive dizajn", "SEO osnova"],
  },
  {
    name: "Business",
    price: "500 €",
    description: "Najbolji omjer sadržaja, strukture i upita.",
    features: ["Više sadržajnih stranica", "Naprednija struktura", "Kontakt i lead funkcionalnosti"],
    featured: true,
  },
  {
    name: "Pro",
    price: "700 €",
    description: "Za web koji ima važniju prodajnu ulogu.",
    features: ["Opsežniji web", "Prilagođene funkcionalnosti", "Naprednija optimizacija"],
  },
];

const processSteps = [
  ["Dogovor", "Kažete što trebate."],
  ["Izrada", "Dobivate prvi prijedlog."],
  ["Pregled", "Doradimo sadržaj i izgled."],
  ["Objava", "Web ide online i postaje vaš."],
];

const faqItems = [
  ["Koliko košta izrada?", "Izrada kreće od 300 €. Konačna cijena ovisi o količini sadržaja, broju stranica i potrebnim funkcionalnostima."],
  ["Koliko traje?", "Rok ovisi o opsegu, dostupnosti sadržaja i brzini povratnih informacija. Realan rok dogovaramo prije početka rada."],
  ["Moram li plaćati mjesečno održavanje?", "Ne. Održavanje nije obavezno i, ako ga trebate, ugovara se zasebno."],
  ["Je li stranica moja nakon izrade?", "Da. Nakon završetka i plaćanja izrade web-stranica je u vašem vlasništvu."],
];

/** @param {{ className?: string, children?: import("react").ReactNode, ariaLabel?: string }} props */
function CtaLink({ className = "", children, ariaLabel }) {
  return <a className={`web-button web-button--primary ${className}`.trim()} href="#upit" aria-label={ariaLabel}>{children ?? "Zatraži ponudu"}</a>;
}

function ProjectCard({ project }) {
  return (
    <a
      className={`web-project ${project.className || ""}`.trim()}
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Pogledaj projekt ${project.title} — otvara se u novom tabu`}
    >
      <div className="web-project__image-wrap">
        <img src={project.image} alt={project.alt} loading={project.className ? "eager" : "lazy"} />
      </div>
      <div className="web-project__copy">
        <p>{project.type}</p>
        <div className="web-project__title-row">
          <h3>{project.title}</h3>
          <ExternalLink aria-hidden="true" />
        </div>
        <span>{project.description}</span>
      </div>
    </a>
  );
}

function buildMailto({ name, email, phone, message, attribution }) {
  const attributionLines = Object.entries(attribution)
    .filter(([, value]) => value)
    .map(([key, value]) => `${key}: ${value}`);
  const body = [
    `Ime: ${name}`,
    `E-mail: ${email}`,
    `Telefon: ${phone || "nije naveden"}`,
    "",
    "Što trebate:",
    message,
    ...(attributionLines.length ? ["", "Atribucija:", ...attributionLines] : []),
  ].join("\n");
  return `mailto:nepar@nepar.hr?subject=${encodeURIComponent("Upit za novu web-stranicu")}&body=${encodeURIComponent(body)}`;
}

export default function WebLandingPage() {
  usePageMeta("/web", "hr");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sendError, setSendError] = useState("");
  const [fallbackNotice, setFallbackNotice] = useState("");
  const leadStartedRef = useRef(false);
  const submittingRef = useRef(false);
  const generatedLeadRef = useRef(false);
  const workerUrl = (import.meta.env.VITE_WORKER_URL || "").trim();
  const attribution = useMemo(() => getCampaignAttribution(), []);
  const mailtoHref = buildMailto({ name, email, phone, message, attribution });

  function trackLeadStart() {
    if (leadStartedRef.current) return;
    leadStartedRef.current = true;
    void trackEvent("start_lead", { form_name: "web_landing", ...attribution });
  }

  function trackEmailFallback() {
    void trackEvent("click_email", {
      form_name: "web_landing",
      link_location: "web_landing_form_fallback",
      ...attribution,
    });
  }

  function openEmailFallback() {
    setFallbackNotice("Otvorili smo vašu e-mail aplikaciju. Poruku još trebate poslati.");
    trackEmailFallback();
    window.location.href = mailtoHref;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submittingRef.current || submitted) return;
    submittingRef.current = true;
    setSending(true);
    setSendError("");
    setFallbackNotice("");

    if (!workerUrl) {
      setSending(false);
      submittingRef.current = false;
      openEmailFallback();
      return;
    }

    try {
      const response = await fetch(workerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formName: "web_landing",
          name,
          email,
          phone,
          subject: "Upit za novu web-stranicu",
          message,
          attribution,
        }),
      });
      if (!response.ok) throw new Error("send_failed");
      if (!generatedLeadRef.current) {
        generatedLeadRef.current = true;
        void trackEvent("generate_lead", { form_name: "web_landing", ...attribution });
      }
      setSubmitted(true);
    } catch {
      setSendError("Upit trenutačno nije moguće poslati.");
      submittingRef.current = false;
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="web-landing">
      <header className="web-header">
        <div className="web-shell web-header__inner">
          <Link to="/" className="web-logo" aria-label="Nepar Solutions — naslovnica">
            <img src="/brand/nepar_logo.png" alt="Nepar Solutions" />
          </Link>
          <nav aria-label="Navigacija landing stranice">
            <div className="web-header__links">
              <a href="#reference">Reference</a>
              <a href="#cijene">Cijene</a>
            </div>
            <CtaLink ariaLabel="Zatraži ponudu — navigacija" />
          </nav>
        </div>
      </header>

      <section className="web-hero" aria-labelledby="web-hero-title">
        <div className="web-shell web-hero__grid">
          <div className="web-hero__copy">
            <p className="web-eyebrow">Web-stranice za tvrtke i obrte</p>
            <h1 id="web-hero-title">Profesionalna web stranica za vaš posao. Od 300 €.</h1>
            <p className="web-hero__lead">Brza, moderna i optimizirana za Google. Bez mjesečne pretplate — stranica je vaša.</p>
            <CtaLink />
            <div className="web-trust-line" aria-label="Ključne informacije">
              <span><CircleDollarSign aria-hidden="true" />Izrada od 300 €</span>
              <span><ShieldCheck aria-hidden="true" />Potpuno vlasništvo</span>
              <span><MapPinned aria-hidden="true" />Za tvrtke i obrte u Hrvatskoj</span>
            </div>
          </div>

          <figure className="web-hero__proof">
            <div className="web-hero__proof-label"><span>Komercijalni web u praksi</span><strong>Auto Gubić</strong></div>
            <img src="/brand/autogubic-landing.webp" alt="Auto Gubić web-stranica za specijalizirani Volvo servis" />
          </figure>
        </div>
      </section>

      <section id="reference" className="web-section web-portfolio" aria-labelledby="web-portfolio-title">
        <div className="web-shell">
          <div className="web-section-heading">
            <p className="web-eyebrow">Stvarni projekti</p>
            <h2 id="web-portfolio-title">Pogledajte što izrađujemo</h2>
            <p>Ne pokazujemo generičke mockupove. Ovo su stvarni proizvodi i stranice koje smo izradili.</p>
          </div>
          <div className="web-project-grid">
            {projects.map((project) => <ProjectCard key={project.title} project={project} />)}
          </div>
        </div>
      </section>

      <section className="web-section web-reasons" aria-labelledby="web-reasons-title">
        <div className="web-shell">
          <div className="web-section-heading web-section-heading--compact">
            <p className="web-eyebrow">Zašto Nepar</p>
            <h2 id="web-reasons-title">Web koji radi ozbiljan posao</h2>
          </div>
          <div className="web-reason-grid">
            {reasons.map(({ title, description, Icon, imageDesktop, imageMobile }, index) => (
              <article key={title} className="web-reason">
                <picture className="web-reason__media" aria-hidden="true">
                  <source media="(max-width: 720px)" srcSet={imageMobile} />
                  <img src={imageDesktop} alt="" loading="lazy" />
                </picture>
                <div className="web-reason__content">
                  <div className="web-reason__meta"><span>0{index + 1}</span><Icon aria-hidden="true" /></div>
                  <div className="web-reason__copy">
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="web-tech-line" aria-label="Tehnička osnova">
            <span>Responsive</span><span>SEO</span><span>Analytics</span><span>HTTPS</span><span>GDPR</span>
          </div>
        </div>
      </section>

      <section id="cijene" className="web-section web-pricing" aria-labelledby="web-pricing-title">
        <div className="web-shell">
          <div className="web-section-heading">
            <p className="web-eyebrow">Jasna jednokratna cijena</p>
            <h2 id="web-pricing-title">Od jednostavnog početka do ozbiljnog prodajnog weba</h2>
            <p>Tri realna opsega, bez skrivenog najma i bez liste od petnaest stavki.</p>
          </div>
          <div className="web-package-grid">
            {packages.map((item) => (
              <article key={item.name} className={`web-package ${item.featured ? "web-package--featured" : ""}`.trim()}>
                {item.featured && <span className="web-package__badge">Najbolji omjer cijene i koristi</span>}
                <div className="web-package__top"><h3>{item.name}</h3><strong>{item.price}</strong></div>
                <p>{item.description}</p>
                <ul>{item.features.map((feature) => <li key={feature}><Check aria-hidden="true" />{feature}</li>)}</ul>
              </article>
            ))}
          </div>
          <div className="web-pricing__next">
            <p><strong>Niste sigurni koji paket trebate?</strong> Opišite projekt.</p>
            <a href="#upit">Recite nam što trebate<ArrowRight aria-hidden="true" /></a>
          </div>
        </div>
      </section>

      <section className="web-section web-process" aria-labelledby="web-process-title">
        <div className="web-shell web-process__layout">
          <div className="web-section-heading web-section-heading--compact">
            <p className="web-eyebrow">Bez kompliciranja</p>
            <h2 id="web-process-title">Od dogovora do objave</h2>
            <p>Uvijek znate što je sljedeće i gdje je projekt.</p>
          </div>
          <ol className="web-process__list">
            {processSteps.map(([title, description], index) => (
              <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{description}</p></div></li>
            ))}
          </ol>
        </div>
      </section>

      <section id="upit" className="web-section web-inquiry" aria-labelledby="web-inquiry-title">
        <div className="web-shell web-inquiry__layout">
          <div className="web-inquiry__intro">
            <p className="web-eyebrow">Sljedeći korak</p>
            <h2 id="web-inquiry-title">Opišite web koji trebate</h2>
            <p>Pošaljite osnovne informacije. Odgovorit ćemo osobno s realnom preporukom opsega i sljedećim korakom.</p>
            <div className="web-inquiry__trust">
              <span><ShieldCheck aria-hidden="true" />Bez obaveze</span>
              <span><Mail aria-hidden="true" />Odgovara stvarna osoba</span>
              <span><Globe2 aria-hidden="true" />Za cijelu Hrvatsku</span>
            </div>
          </div>

          <div className="web-inquiry__panel">
            {submitted ? (
              <div className="web-form-success" role="status" aria-live="polite">
                <span><Check aria-hidden="true" /></span>
                <h3>Upit je poslan.</h3>
                <p>Hvala. Javit ćemo se čim pregledamo podatke o projektu.</p>
              </div>
            ) : (
              <form
                className="web-form"
                onSubmit={handleSubmit}
                onFocusCapture={trackLeadStart}
                onInputCapture={trackLeadStart}
                onChangeCapture={trackLeadStart}
              >
                <div className="web-form__row">
                  <label>Ime<input required maxLength={120} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} /></label>
                  <label>E-mail<input required maxLength={254} type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
                </div>
                <label>Telefon <span>opcionalno</span><input maxLength={40} type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} /></label>
                <label>Što trebate?<textarea required maxLength={4000} rows={6} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Čime se bavite, što web treba sadržavati i koji vam je glavni cilj?" /></label>
                {sendError && (
                  <div className="web-form-message web-form-message--error" role="alert">
                    <span>{sendError}</span>
                    <a href={mailtoHref}>Pošalji e-mailom</a>
                  </div>
                )}
                {fallbackNotice && <p className="web-form-message web-form-message--notice" role="status" aria-live="polite">{fallbackNotice}</p>}
                <button type="submit" className="web-button web-button--primary" disabled={sending}>
                  {sending ? "Šaljem…" : "Zatraži ponudu"}<Send aria-hidden="true" />
                </button>
                <small>Bez obveze. Odgovaram osobno.</small>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="web-section web-faq" aria-labelledby="web-faq-title">
        <div className="web-shell web-faq__layout">
          <div className="web-section-heading web-section-heading--compact">
            <p className="web-eyebrow">Kratko i jasno</p>
            <h2 id="web-faq-title">Česta pitanja</h2>
          </div>
          <div className="web-faq__list">
            {faqItems.map(([question, answer]) => (
              <details key={question}><summary>{question}<span aria-hidden="true">+</span></summary><p>{answer}</p></details>
            ))}
          </div>
        </div>
      </section>

      <section className="web-final-cta" aria-label="Završni poziv na upit">
        <div className="web-shell web-final-cta__inner">
          <div><p className="web-eyebrow">Spremni za novi web?</p><h2>Trebate novu web stranicu?</h2></div>
          <CtaLink>Recite nam što trebate<ArrowRight aria-hidden="true" /></CtaLink>
        </div>
      </section>

      <footer className="web-footer">
        <div className="web-shell web-footer__top">
          <Link to="/" className="web-footer__brand"><img src="/brand/nepar_logo.png" alt="Nepar Solutions" /></Link>
          <a href="mailto:nepar@nepar.hr">nepar@nepar.hr</a>
          <p>Nepar, obrt za digitalna rješenja i usluge · vl. Ivan Gorupić · MBO: 99267101</p>
        </div>
        <div className="web-shell web-footer__bottom">
          <span>© 2026 Nepar Solutions</span>
          <div><Link to="/privatnost">Privatnost</Link><ConsentSettingsLink lang="hr" /></div>
        </div>
      </footer>
    </main>
  );
}
