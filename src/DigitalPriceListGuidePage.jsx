import { useEffect } from "react";
import { ArrowRight, Check, ExternalLink, FileCode2, Network, Search } from "lucide-react";
import { ConsentSettingsLink } from "./ConsentManager.jsx";
import { Background } from "./SiteChrome.jsx";
import {
  DIGITAL_PRICE_LIST_GUIDE_PATHS,
  getDigitalPriceListGuide,
  getDigitalPriceListGuideSeoPage,
  getDigitalPriceListGuideStructuredData,
} from "./digitalPriceListGuides.js";

const SITE_URL = "https://nepar.hr";

function upsertMeta(attr, key, value) {
  let element = document.querySelector(`meta[${attr}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", value);
}

function applyGuideMeta(routePath) {
  const page = getDigitalPriceListGuideSeoPage(routePath);
  const schema = getDigitalPriceListGuideStructuredData(routePath);
  if (!page) return;
  const canonical = `${SITE_URL}${page.canonicalPath}`;
  const image = `${SITE_URL}${page.image}`;
  document.title = page.title;
  document.documentElement.lang = "hr";
  upsertMeta("name", "description", page.description);
  upsertMeta("name", "robots", page.robots);
  upsertMeta("property", "og:title", page.title);
  upsertMeta("property", "og:description", page.description);
  upsertMeta("property", "og:url", canonical);
  upsertMeta("property", "og:image", image);
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", page.title);
  upsertMeta("name", "twitter:description", page.description);
  upsertMeta("name", "twitter:image", image);

  let canonicalLink = /** @type {HTMLLinkElement | null} */ (document.querySelector('link[rel="canonical"]'));
  if (!canonicalLink) {
    canonicalLink = document.createElement("link");
    canonicalLink.rel = "canonical";
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.href = canonical;

  document.querySelectorAll("script[data-nepar-schema]").forEach((element) => element.remove());
  if (schema) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.neparSchema = "true";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  }
}

function GuideHeader() {
  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Glavna navigacija">
        <a href="/" className="brand-link" aria-label="Nepar Solutions">
          <img src="/brand/nepar_logo.png" alt="Nepar Solutions" />
        </a>
        <div className="desktop-nav">
          <a href="/digitalni-cjenik" className="nav-link">Digitalni cjenik</a>
          <a href="/cjenik" className="nav-link">NEPAR cjenik</a>
          <a href="/kontakt" className="nav-link">Kontakt</a>
        </div>
        <div className="nav-actions">
          <a href="/digitalni-cjenik" className="nav-cta">
            <Search aria-hidden="true" size={17} />
            <span>Besplatna provjera</span>
          </a>
        </div>
      </nav>
    </header>
  );
}

function GuideFooter() {
  return (
    <footer className="site-footer">
      <div className="section-shell">
        <div className="footer-main">
          <div>
            <p className="footer-label">Digitalni cjenik 2026.</p>
            <p className="footer-company">Nepar, obrt za digitalna rješenja i usluge</p>
            <div className="footer-details">
              <span>NEPAR Digital Price Engine</span>
              <a href="mailto:nepar@nepar.hr">nepar@nepar.hr</a>
            </div>
          </div>
          <a href="/digitalni-cjenik" className="footer-contact">
            Provjerite svoj web
            <ArrowRight aria-hidden="true" size={18} />
          </a>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Nepar Solutions. Digitalna rješenja po mjeri.</p>
          <div className="footer-utility-links">
            <a href="/digitalni-cjenik">Digitalni cjenik 2026.</a>
            <a href="/cjenik">Cjenik</a>
            <a href="/privatnost">Privatnost</a>
            <ConsentSettingsLink lang="hr" />
            <a href="#top">Povratak na vrh</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function isDigitalPriceListGuidePath(path) {
  const normalized = path !== "/" ? path.replace(/\/+$/, "") : "/";
  return DIGITAL_PRICE_LIST_GUIDE_PATHS.includes(normalized);
}

export default function DigitalPriceListGuidePage({ routePath }) {
  const guide = getDigitalPriceListGuide(routePath);

  useEffect(() => {
    applyGuideMeta(routePath);
  }, [routePath]);

  if (!guide) {
    return (
      <main className="not-found-page">
        <div>
          <p>404</p>
          <h1>Vodič nije pronađen.</h1>
          <a href="/digitalni-cjenik" className="button button-primary">Digitalni cjenik</a>
        </div>
      </main>
    );
  }

  const related = DIGITAL_PRICE_LIST_GUIDE_PATHS
    .filter((path) => path !== routePath)
    .map((path) => ({ path, guide: getDigitalPriceListGuide(path) }));

  return (
    <main id="top" className="site-main font-sans text-slate-800">
      <Background />
      <GuideHeader />

      <article>
        <section className="content-section px-4 pt-28 sm:pt-36">
          <div className="section-shell grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,.75fr)] lg:items-start">
            <div>
              <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
                <a href="/" className="hover:text-blue-700">Naslovnica</a>
                <span aria-hidden="true">/</span>
                <a href="/digitalni-cjenik" className="hover:text-blue-700">Digitalni cjenik</a>
                <span aria-hidden="true">/</span>
                <span className="text-slate-800">Vodič</span>
              </nav>
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-cyan-700">{guide.eyebrow}</p>
              <h1 className="mt-4 max-w-5xl text-4xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-6xl">{guide.h1}</h1>
              <p className="mt-6 max-w-4xl text-lg leading-8 text-slate-600">{guide.lead}</p>
              <div className="mt-7 max-w-4xl rounded-2xl border border-cyan-200 bg-cyan-50 p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-800">Odgovor ukratko</p>
                <p className="mt-3 text-base font-medium leading-7 text-cyan-950">{guide.answer}</p>
              </div>
            </div>

            <aside className="rounded-2xl bg-slate-950 p-6 text-white sm:p-7 lg:sticky lg:top-28">
              <div className="grid size-11 place-items-center rounded-xl bg-cyan-300 text-blue-950">
                <Search size={21} aria-hidden="true" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.025em]">Imate web? Provjerite digitalni cjenik.</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">Besplatni NEPAR checker traži javno dostupni XML/CSV i tehničke signale na vašoj domeni.</p>
              <a href="/digitalni-cjenik" className="button mt-6 w-full bg-cyan-300 text-blue-950 hover:bg-cyan-200">
                Besplatna provjera
                <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a href="/cjenik" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-white underline decoration-cyan-300 underline-offset-4 hover:text-cyan-200">
                Pogledajte NEPAR primjer
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </aside>
          </div>
        </section>

        <section className="content-section px-4 pt-0">
          <div className="section-shell max-w-5xl divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {guide.sections.map((section) => (
              <section key={section.heading} className="p-6 sm:p-9">
                <h2 className="text-2xl font-semibold tracking-[-0.025em] text-slate-950 sm:text-3xl">{section.heading}</h2>
                <div className="mt-5 space-y-4 text-base leading-7 text-slate-700">
                  {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="content-section px-4">
          <div className="section-shell overflow-hidden rounded-2xl bg-slate-950 text-white">
            <div className="grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_.85fr] lg:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">{guide.engine.eyebrow}</p>
                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{guide.engine.title}</h2>
                <p className="mt-4 max-w-3xl leading-7 text-slate-300">{guide.engine.body}</p>
                <div className="mt-6 grid gap-3">
                  {guide.engine.bullets.map((item) => (
                    <p key={item} className="flex gap-3 text-sm leading-6 text-slate-200">
                      <Check className="mt-1 shrink-0 text-cyan-300" size={17} aria-hidden="true" />
                      <span>{item}</span>
                    </p>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-cyan-300 text-blue-950"><Network size={20} aria-hidden="true" /></span>
                  <strong className="text-lg">Izvor → NEPAR → web + XML/CSV + arhiva</strong>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">Prvo provjeravamo gdje cijene stvarno nastaju. Tek zatim biramo najjednostavniji način povezivanja postojećeg sustava i web stranice.</p>
                <a href="/digitalni-cjenik" className="button button-primary mt-6 w-full">
                  Zatražite implementaciju
                  <ArrowRight size={17} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="content-section px-4">
          <div className="section-shell max-w-5xl">
            <div className="section-heading">
              <p className="text-sm font-bold text-cyan-700">FAQ</p>
              <h2>Najčešća pitanja</h2>
            </div>
            <div className="grid gap-3">
              {guide.faq.map(([question, answer]) => (
                <details key={question} className="group rounded-2xl border border-slate-200 bg-white p-5 open:border-blue-200 sm:p-6">
                  <summary className="cursor-pointer list-none pr-8 text-base font-semibold text-slate-950">{question}</summary>
                  <p className="mt-4 max-w-4xl border-t border-slate-100 pt-4 leading-7 text-slate-700">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="content-section px-4">
          <div className="section-shell max-w-5xl">
            <div className="section-heading"><h2>Službeni izvori</h2></div>
            <div className="grid gap-3">
              {guide.sources.map((source) => (
                <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-800 transition hover:border-blue-300 hover:text-blue-800">
                  <span>{source.label}</span>
                  <ExternalLink size={17} className="shrink-0" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="content-section px-4">
          <div className="section-shell">
            <div className="section-heading"><h2>Povezani vodiči</h2></div>
            <div className="grid gap-4 md:grid-cols-2">
              {related.map(({ path, guide: relatedGuide }) => (
                <a key={path} href={path} className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 sm:p-7">
                  <FileCode2 className="text-blue-700" size={24} aria-hidden="true" />
                  <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-950 group-hover:text-blue-800">{relatedGuide.h1}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{relatedGuide.description}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700">Otvori vodič <ArrowRight size={16} aria-hidden="true" /></span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </article>

      <GuideFooter />
    </main>
  );
}
