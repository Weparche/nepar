import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Check,
  CheckCircle2,
  Cloud,
  Code2,
  Gauge,
  KeyRound,
  LayoutTemplate,
  SearchCheck,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { Background, MotionButton, Navbar, SiteFooter, siteContent } from "./SiteChrome.jsx";
import { formatOfferPrice, webOfferContent } from "./webOfferContent.js";
import { usePageMeta } from "./usePageMeta.js";

const copy = {
  hr: {
    meta: {
      title: "Izrada modernih i SEO optimiziranih web-stranica | Nepar",
      description: "Nepar izrađuje moderne, brze i SEO optimizirane web-stranice za obrte i tvrtke, uz jasne jednokratne cijene i opcionalno održavanje.",
    },
    hero: {
      label: "Web-stranice za obrte i tvrtke",
      title: "Moderne web-stranice koje izgledaju odlično, rade brzo i pronalaze se na Googleu.",
      description: "Izrada profesionalnih web-stranica za obrte i tvrtke, s naprednom SEO optimizacijom, jasnim cijenama i bez obaveznih mjesečnih naknada.",
      primary: "Pogledaj pakete",
      secondary: "Izdvojeni projekti",
      proofLabel: "Web Pro u praksi",
      proofTitle: "Auto Gubić",
      proofText: "Lokalni SEO, ciljane servisne stranice i prilagođeni upit za specijalizirani Volvo servis.",
      proofCta: "Pogledaj projekt",
    },
    promises: [
      ["Jednokratno plaćanje", "Web nakon plaćanja ostaje u vašem vlasništvu."],
      ["SEO u svakom paketu", "Napredna tehnička i on-page optimizacija."],
      ["Mobilno bez kompromisa", "Responzivan prikaz za svaki važan uređaj."],
      ["Mjerljiva osnova", "Search Console, analitika i dogovoreni opseg."],
    ],
    projects: {
      title: "Izdvojeni projekti",
      intro: "Ne pokazujemo generičke mockupove. Pokazujemo stvarne proizvode i konkretan opseg rada.",
      details: "Što je izvedeno",
      other: "Ostali digitalni proizvodi",
    },
    packages: {
      title: "Jasni paketi. Web je vaš.",
      intro: "Izrada se plaća jednokratno. Održavanje nije obavezno i ugovara se zasebno.",
      cta: "Usporedi sve pakete",
      from: "jednokratno",
    },
    process: {
      title: "Od prvog razgovora do objave",
      intro: "Jasan proces drži opseg, rokove i očekivanja pod kontrolom.",
    },
    custom: {
      title: "Trebate više od klasične web-stranice?",
      intro: "Webshopovi, rezervacije, korisnički računi, AI funkcionalnosti i napredne integracije izrađuju se prema individualnoj ponudi.",
      items: ["Web aplikacije i portali", "AI chatbotovi i automatizacija", "Rezervacijski i poslovni sustavi", "API, podaci i napredne integracije"],
      cta: "Opišite nam projekt",
    },
    about: {
      title: "Tehnička izvedba bez kompliciranja",
      text: "Nepar spaja dizajn, razvoj, SEO i infrastrukturu u jedan jasan proces. Dobivate dogovoreni opseg, transparentnu cijenu i web-stranicu koja nakon plaćanja pripada vama.",
    },
    final: {
      title: "Spremni za web koji radi ozbiljan posao?",
      text: "Pošaljite osnovne informacije o tvrtki i ciljevima. Javit ćemo se s preporukom paketa i sljedećim korakom.",
      cta: "Pošaljite upit",
    },
  },
  en: {
    meta: {
      title: "Modern, SEO-optimized website development | Nepar",
      description: "Nepar builds modern, fast, SEO-optimized websites for small businesses, with clear one-time pricing and optional maintenance.",
    },
    hero: {
      label: "Websites for small and growing businesses",
      title: "Modern websites that look excellent, load fast, and get found on Google.",
      description: "Professional website development with advanced SEO optimization, clear pricing, and no mandatory monthly fees.",
      primary: "View packages",
      secondary: "Featured projects",
      proofLabel: "Web Pro in practice",
      proofTitle: "Auto Gubić",
      proofText: "Local SEO, targeted service pages, and a custom inquiry flow for a specialized Volvo service center.",
      proofCta: "View project",
    },
    promises: [
      ["One-time payment", "The website is yours after payment."],
      ["SEO in every package", "Advanced technical and on-page optimization."],
      ["Mobile without compromise", "A responsive experience on every important device."],
      ["A measurable foundation", "Search Console, analytics, and an agreed scope."],
    ],
    projects: {
      title: "Featured projects",
      intro: "We do not show generic mockups. We show real products and the concrete work behind them.",
      details: "What we delivered",
      other: "Other digital products",
    },
    packages: {
      title: "Clear packages. Your website.",
      intro: "Development is paid once. Maintenance is optional and contracted separately.",
      cta: "Compare all packages",
      from: "one-time",
    },
    process: {
      title: "From the first conversation to launch",
      intro: "A clear process keeps scope, timelines, and expectations under control.",
    },
    custom: {
      title: "Need more than a standard website?",
      intro: "E-commerce, booking, user accounts, AI functionality, and advanced integrations are delivered through a custom proposal.",
      items: ["Web applications and portals", "AI chatbots and automation", "Booking and business systems", "APIs, data, and advanced integrations"],
      cta: "Tell us about your project",
    },
    about: {
      title: "Technical delivery without unnecessary complexity",
      text: "Nepar combines design, development, SEO, and infrastructure in one clear process. You receive an agreed scope, transparent pricing, and a website that belongs to you after payment.",
    },
    final: {
      title: "Ready for a website that does serious work?",
      text: "Send us the basics about your company and goals. We will respond with a package recommendation and the next step.",
      cta: "Send an inquiry",
    },
  },
};

const projectCards = [
  { title: "BezStruje.hr", image: "/brand/bezstruje.webp", href: "https://bezstruje.hr" },
  { title: "VidimoSe.hr", image: "/brand/vidimose.webp", href: "https://vidimose.hr" },
  { title: "KPDinfo.com", image: "/brand/kpdinfo.webp", href: "https://kpdinfo.com" },
  { title: "GeoAdrese.net", image: "/brand/geoadrese.webp", href: "https://geoadrese.net" },
  { title: "KadigraHrvatska.hr", image: "/brand/kadigrahrvatska.webp", href: "https://kadigrahrvatska.hr" },
];

const promiseIcons = [KeyRound, SearchCheck, Smartphone, Gauge];

function SectionHeading({ title, intro }) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}

function Hero({ lang, text, offer }) {
  const project = offer.featuredProjects[0];
  return (
    <section id="top" className="hero-section">
      <div className="section-shell hero-layout">
        <div className="hero-copy">
          <p className="hero-label"><Sparkles aria-hidden="true" size={16} />{text.label}</p>
          <h1>{text.title}</h1>
          <p className="hero-description">{text.description}</p>
          <div className="hero-actions">
            <MotionButton href="/usluge/izrada-web-stranica#paketi">
              {text.primary}<ArrowRight aria-hidden="true" size={18} />
            </MotionButton>
            <MotionButton href="#projekti" variant="secondary">
              {text.secondary}
            </MotionButton>
          </div>
          <p className="ownership-line"><ShieldCheck aria-hidden="true" size={18} />{lang === "hr" ? "Web-stranica je nakon plaćanja u vlasništvu klijenta." : "The website belongs to the client after payment."}</p>
        </div>

        <article className="hero-proof">
          <div className="hero-proof-topline">
            <span>{text.proofLabel}</span>
            <span>700 €</span>
          </div>
          <div className="hero-proof-mark" aria-hidden="true">AG</div>
          <div>
            <p className="project-category">{project.category}</p>
            <h2>{text.proofTitle}</h2>
            <p>{text.proofText}</p>
          </div>
          <a href={project.href} target="_blank" rel="noreferrer" className="text-link">
            {text.proofCta}<ArrowUpRight aria-hidden="true" size={18} />
          </a>
        </article>
      </div>
    </section>
  );
}

function PromiseStrip({ items }) {
  return (
    <section id="usluge" className="promise-section" aria-label="Ključne prednosti">
      <div className="section-shell promise-grid">
        {items.map(([title, description], index) => {
          const Icon = promiseIcons[index];
          return (
            <div key={title} className="promise-item">
              <Icon aria-hidden="true" size={22} />
              <div><h2>{title}</h2><p>{description}</p></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function FeaturedProjects({ text, project }) {
  return (
    <section id="projekti" className="content-section">
      <div className="section-shell">
        <SectionHeading title={text.title} intro={text.intro} />
        <article className={`featured-project ${project.imageSrc ? "has-image" : ""}`}>
          {project.imageSrc && <img src={project.imageSrc} alt="Auto Gubić web-stranica" />}
          <div className="featured-project-main">
            <p className="project-category">{project.category}</p>
            <h3>{project.title}</h3>
            <p className="featured-description">{project.description}</p>
            <a href={project.href} target="_blank" rel="noreferrer" className="button button-primary">
              {project.cta}<ArrowUpRight aria-hidden="true" size={18} />
            </a>
          </div>
          <div className="featured-project-details">
            <h4>{text.details}</h4>
            <ul>
              {project.highlights.map((item) => <li key={item}><Check aria-hidden="true" size={17} />{item}</li>)}
            </ul>
          </div>
        </article>

        <h3 className="subsection-title">{text.other}</h3>
        <div className="project-list">
          {projectCards.map((item) => (
            <a key={item.title} href={item.href} target="_blank" rel="noreferrer" className="project-tile">
              <img src={item.image} alt="" />
              <span>{item.title}</span>
              <ArrowUpRight aria-hidden="true" size={17} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function PackagePreview({ lang, text, packages }) {
  return (
    <section className="content-section package-preview-section">
      <div className="section-shell">
        <SectionHeading title={text.title} intro={text.intro} />
        <div className="package-preview-grid">
          {packages.map((item) => (
            <article key={item.id} className={`package-preview ${item.featured ? "is-featured" : ""}`}>
              {item.badge && <span className="status-badge">{item.badge}</span>}
              <h3>{item.name}</h3>
              <p className="price"><strong>{formatOfferPrice(item.price, lang)}</strong><span>{text.from}</span></p>
              <p>{item.description}</p>
              <ul>
                {item.included.slice(0, 4).map((benefit) => <li key={benefit}><CheckCircle2 aria-hidden="true" size={17} />{benefit}</li>)}
              </ul>
            </article>
          ))}
        </div>
        <MotionButton href="/usluge/izrada-web-stranica#paketi" variant="secondary" className="section-cta">
          {text.cta}<ArrowRight aria-hidden="true" size={18} />
        </MotionButton>
      </div>
    </section>
  );
}

function Process({ text, steps }) {
  return (
    <section id="proces" className="content-section process-section">
      <div className="section-shell process-layout">
        <SectionHeading title={text.title} intro={text.intro} />
        <ol className="process-list">
          {steps.map(([title, description], index) => (
            <li key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{title}</h3><p>{description}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CustomWork({ text }) {
  const icons = [LayoutTemplate, Bot, Code2, Cloud];
  return (
    <section className="content-section">
      <div className="section-shell custom-panel">
        <div><h2>{text.title}</h2><p>{text.intro}</p></div>
        <ul>
          {text.items.map((item, index) => {
            const Icon = icons[index];
            return <li key={item}><Icon aria-hidden="true" size={20} />{item}</li>;
          })}
        </ul>
        <MotionButton href="/kontakt" variant="secondary">{text.cta}<ArrowRight aria-hidden="true" size={18} /></MotionButton>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [lang, setLang] = useState("hr");
  const text = copy[lang];
  const chrome = siteContent[lang];
  const offer = webOfferContent[lang];

  usePageMeta({ title: text.meta.title, description: text.meta.description, path: "/", canonicalPath: "/" });

  return (
    <main className="site-main" data-testid="landing-page">
      <Background />
      <Navbar lang={lang} setLang={setLang} copy={chrome} />
      <Hero lang={lang} text={text.hero} offer={offer} />
      <PromiseStrip items={text.promises} />
      <FeaturedProjects text={text.projects} project={offer.featuredProjects[0]} />
      <PackagePreview lang={lang} text={text.packages} packages={offer.buildPackages} />
      <Process text={text.process} steps={offer.processSteps} />
      <CustomWork text={text.custom} />
      <section className="content-section about-section">
        <div className="section-shell about-layout">
          <div className="about-mark"><img src="/brand/nepar_logo.png" alt="" /></div>
          <div><h2>{text.about.title}</h2><p>{text.about.text}</p></div>
        </div>
      </section>
      <section className="final-cta-section">
        <div className="section-shell final-cta">
          <div><h2>{text.final.title}</h2><p>{text.final.text}</p></div>
          <MotionButton href="/kontakt">{text.final.cta}<ArrowRight aria-hidden="true" size={18} /></MotionButton>
        </div>
      </section>
      <SiteFooter copy={chrome} />
    </main>
  );
}
