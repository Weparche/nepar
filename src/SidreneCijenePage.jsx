import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Search } from "lucide-react";
import { Background, Navbar, SiteFooter, siteContent } from "./SiteChrome.jsx";
import { trackEvent } from "./analytics.js";
import { usePageMeta } from "./usePageMeta.js";
import { digitalPriceListFaqHr, digitalPriceListFaqEn } from "./digitalPriceListFaq.js";

const PRODUCT_URL = "https://digitalnicjenik.nepar.hr";

// A plain <a href> click navigates on the same tick the click handler returns; trackEvent()
// is async and gtag()'s own network beacon can dispatch after gtag() itself returns (verified
// empirically: awaiting trackEvent() alone was not enough — the collect request for the click
// event was still lost to the navigation). Prevent the default navigation, fire the event, wait
// a short fixed delay for GA's beacon to actually leave the page, then navigate manually.
function goToProduct(event, eventName) {
  event.preventDefault();
  trackEvent(eventName).finally(() => {
    window.setTimeout(() => { window.location.href = PRODUCT_URL; }, 300);
  });
}

// Curated subset of the single FAQ source of truth (digitalPriceListFaq.js) — filtered by exact
// question text rather than a stable id, to avoid widening this page's scope into a refactor of
// the shared FAQ array (which is also consumed by DigitalPriceListPage.jsx and seoConfig.js).
// If any of these three questions is ever reworded there, this filter silently returns fewer than
// 3 items — the invariants below turn that into a loud build-time failure instead of a silently
// empty FAQ section.
const TARGET_QUESTIONS_HR = [
  "Koja je razlika između sidrene cijene i digitalnog cjenika?",
  "Je li 10. rujna 2026. datum sidrene cijene za sve proizvode?",
  "Moram li dodati posebno polje u bazu podataka za sidrenu cijenu?",
];
const TARGET_QUESTIONS_EN = [
  "What is the difference between an additional/reference price and a digital price list?",
  "Is 10 September 2026 the reference-price date for every product?",
  "Do I have to add a dedicated database field for the reference price?",
];

const faqHr = digitalPriceListFaqHr.filter(([question]) => TARGET_QUESTIONS_HR.includes(question));
const faqEn = digitalPriceListFaqEn.filter(([question]) => TARGET_QUESTIONS_EN.includes(question));
if (faqHr.length !== TARGET_QUESTIONS_HR.length) {
  throw new Error("Sidrene cijene FAQ selection is out of sync (HR) — a target question no longer matches digitalPriceListFaq.js.");
}
if (faqEn.length !== TARGET_QUESTIONS_EN.length) {
  throw new Error("Sidrene cijene FAQ selection is out of sync (EN) — a target question no longer matches digitalPriceListFaq.js.");
}

const content = {
  hr: {
    eyebrow: "NN 101/2026-1212 · primjena od 1.10.2026.",
    title: "Sidrena cijena od 1.10.2026. — što morate napraviti?",
    lead: "Od 1. listopada 2026. trgovci u maloprodaji i pružatelji usluga obuhvaćeni su pravilima o dodatnoj cijeni, bez obzira imaju li web stranicu. Imate web stranicu? Provjerite i dodatne obveze XML/CSV digitalnog cjenika.",
    ctaPrimary: "Izradi digitalni cjenik",
    ctaSecondary: "Besplatna provjera",
    obligationsTitle: "Tko je obveznik?",
    obligation1Title: "Tko mora isticati sidrenu/dodatnu cijenu?",
    obligation1Body: "Trgovci u maloprodaji i pružatelji usluga obuhvaćeni Odlukom NN 101/2026-1212. Ako oglašavaju cijene na svojoj mrežnoj stranici, dodatna cijena ističe se i tamo.",
    obligation1LinkLabel: "Detaljan vodič za sidrenu cijenu",
    obligation2Title: "Tko mora objaviti XML/CSV digitalni cjenik?",
    obligation2Body: "Trgovac odnosno pružatelj usluge koji ima uspostavljenu mrežnu stranicu, prema NN 101/2026-1213.",
    obligation2LinkLabel: "Tehnički zahtjevi XML/CSV digitalnog cjenika",
    terminologyNote: "U Odluci NN 101/2026-1212 koristi se izraz \"dodatna cijena\". U povezanoj Odluci NN 101/2026-1213 za digitalne cjenike koristi se izraz \"sidrena cijena\".",
    dateTitle: "Koji je datum?",
    dateBody: "Za većinu proizvoda i usluga referentna je cijena koja je bila na snazi 10. rujna 2026. Iznimka: trgovci koji su prema ranijoj mjeri već isticali dodatnu cijenu za određene kategorije proizvoda nastavljaju s cijenom koja je bila na snazi 2. svibnja 2025. za te kategorije.",
    whatTitle: "Što trebate napraviti",
    whatItems: [
      "Istaknite dodatnu (sidrenu) cijenu gdje je primjenjivo, uključujući na web stranici ako ondje oglašavate cijene.",
      "Ako imate web stranicu, objavite digitalni XML ili CSV cjenik prema Odluci NN 101/2026-1213.",
      "Cjenik održavajte ažurnim i javno dostupnim najmanje 30 dana od objave odnosno promjene — to je zakonski zahtjev; način pohrane i URL struktura arhive nisu propisani.",
    ],
    whatMoreLink: "Pročitajte detaljno →",
    solutionTitle: "NEPAR Digital Price Engine",
    solutionBody: "Praktični put za tehničku implementaciju zahtjeva: NEPAR Digital Price Engine povezuje postojeći izvor cijena (ERP, poslovni program, Excel, webshop) s vašom web stranicom i generira javni cjenik, XML/CSV datoteke i arhivu prethodnih verzija. Ovo je tehnička implementacija, ne pravno mišljenje niti jamstvo usklađenosti.",
    solutionLink: "Saznajte više →",
    checkerTitle: "Besplatna provjera vašeg weba",
    checkerBody: "Provjerite ima li vaša web stranica javno dostupan XML ili CSV cjenik — tehnička provjera javno dostupnih signala, ne pravna procjena.",
    checkerCta: "Provjeri svoj web",
    faqTitle: "Česta pitanja",
    finalTitle: "Spremni riješiti sidrenu cijenu i digitalni cjenik?",
    finalCta: "Izradi digitalni cjenik",
    legal: "Informacije na ovoj stranici služe kao tehnički i informativni pregled propisa i ne predstavljaju pravni savjet. Za tumačenje primjenjivosti propisa na konkretno poslovanje obratite se nadležnom tijelu ili pravnom stručnjaku.",
    faq: faqHr,
  },
  en: {
    eyebrow: "NN 101/2026-1212 · effective from 1 Oct 2026",
    title: "Reference price from 1 Oct 2026 — what you must do",
    lead: "From 1 October 2026, retail traders and service providers are covered by the additional-price rules, regardless of whether they have a website. Do you have a website? Check the additional XML/CSV digital price list obligations too.",
    ctaPrimary: "Build a digital price list",
    ctaSecondary: "Free check",
    obligationsTitle: "Who is covered?",
    obligation1Title: "Who must display the additional/reference price?",
    obligation1Body: "Retail traders and service providers covered by Decision NN 101/2026-1212. If they advertise prices on their website, the additional price must be displayed there too.",
    obligation1LinkLabel: "Detailed reference-price guide",
    obligation2Title: "Who must publish an XML/CSV digital price list?",
    obligation2Body: "A trader or service provider with an established website, under Decision NN 101/2026-1213.",
    obligation2LinkLabel: "XML/CSV digital price list technical requirements",
    terminologyNote: "Decision NN 101/2026-1212 uses the term “additional price”. The related Decision NN 101/2026-1213, for digital price lists, uses the term “reference price”.",
    dateTitle: "Which date applies?",
    dateBody: "For most products and services, the reference price is the one in effect on 10 September 2026. Exception: traders who already displayed an additional price for certain categories under an earlier measure continue with the price in effect on 2 May 2025 for those categories.",
    whatTitle: "What you need to do",
    whatItems: [
      "Display the additional (reference) price where applicable, including on your website if you advertise prices there.",
      "If you have a website, publish a digital XML or CSV price list under Decision NN 101/2026-1213.",
      "Keep the price list current and publicly available for at least 30 days from publication or change — that is a legal requirement; the storage method and archive URL structure are not prescribed.",
    ],
    whatMoreLink: "Read the full guide →",
    solutionTitle: "NEPAR Digital Price Engine",
    solutionBody: "A practical way to technically implement the requirement: NEPAR Digital Price Engine connects an existing price source (ERP, business software, a spreadsheet, a webshop) to your website and generates a public price list, XML/CSV files, and an archive of previous versions. This is a technical implementation, not legal advice or a compliance guarantee.",
    solutionLink: "Learn more →",
    checkerTitle: "Free check for your website",
    checkerBody: "Check whether your website has a publicly available XML or CSV price list — a technical check of public signals, not a legal assessment.",
    checkerCta: "Check your website",
    faqTitle: "Frequently asked questions",
    finalTitle: "Ready to sort out the reference price and digital price list?",
    finalCta: "Build a digital price list",
    legal: "Information on this page is a technical and informational overview of Croatian regulation and does not constitute legal advice. For interpretation of the regulation’s applicability to a specific business, contact the competent authority or a legal professional.",
    faq: faqEn,
  },
};

export default function SidreneCijenePage() {
  const [lang, setLang] = useState("hr");
  const copy = content[lang];
  usePageMeta("/sidrene-cijene", lang);
  useEffect(() => { trackEvent("view_sidrene_cijene"); }, []);

  return (
    <main id="top" className="site-main font-sans text-slate-800">
      <Background />
      <Navbar lang={lang} setLang={setLang} copy={siteContent[lang]} />

      <section className="content-section px-4 pt-28 sm:pt-36">
        <div className="section-shell max-w-4xl">
          <p className="text-sm font-bold text-cyan-700">{copy.eyebrow}</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-6xl">{copy.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{copy.lead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={PRODUCT_URL}
              onClick={(event) => goToProduct(event, "sidrene_cijene_primary_cta")}
              className="button button-primary"
            >
              {copy.ctaPrimary}
              <ArrowRight size={17} aria-hidden="true" />
            </a>
            <Link
              to="/digitalni-cjenik"
              onClick={() => trackEvent("sidrene_cijene_checker_cta")}
              className="button button-secondary"
            >
              {copy.ctaSecondary}
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="content-section px-4">
        <div className="section-shell max-w-4xl">
          <div className="section-heading"><h2>{copy.obligationsTitle}</h2></div>
          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-slate-950">{copy.obligation1Title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-700">{copy.obligation1Body}</p>
              <Link to="/digitalni-cjenik/sidrena-cijena" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900">{copy.obligation1LinkLabel}<ArrowRight size={15} aria-hidden="true" /></Link>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-slate-950">{copy.obligation2Title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-700">{copy.obligation2Body}</p>
              <Link to="/digitalni-cjenik/xml-csv" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900">{copy.obligation2LinkLabel}<ArrowRight size={15} aria-hidden="true" /></Link>
            </article>
          </div>
          <p className="mt-6 rounded-xl bg-cyan-50 px-5 py-4 text-sm font-medium leading-6 text-cyan-950">{copy.terminologyNote}</p>
          <div className="mt-6 border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-950">{copy.dateTitle}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">{copy.dateBody}</p>
          </div>
        </div>
      </section>

      <section className="content-section px-4">
        <div className="section-shell max-w-4xl">
          <div className="section-heading"><h2>{copy.whatTitle}</h2></div>
          <ul className="mt-7 grid gap-3">
            {copy.whatItems.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-6 text-slate-700">
                <Check className="mt-1 shrink-0 text-blue-700" size={18} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <Link to="/digitalni-cjenik/sidrena-cijena" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900">
            {copy.whatMoreLink}
          </Link>
        </div>
      </section>

      <section className="content-section px-4">
        <div className="section-shell max-w-4xl rounded-2xl border-2 border-slate-900 bg-white p-7 sm:p-10">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">{copy.solutionTitle}</h2>
          <p className="mt-4 leading-7 text-slate-600">{copy.solutionBody}</p>
          <Link to="/digitalni-cjenik" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900">
            {copy.solutionLink}
          </Link>
        </div>
      </section>

      <section className="content-section px-4">
        <div className="section-shell max-w-4xl rounded-2xl bg-slate-950 p-7 text-white sm:p-10">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-cyan-300 text-blue-950">
              <Search size={20} aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.025em]">{copy.checkerTitle}</h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-slate-300">{copy.checkerBody}</p>
            </div>
          </div>
          <Link
            to="/digitalni-cjenik"
            onClick={() => trackEvent("sidrene_cijene_checker_cta")}
            className="button mt-6 bg-cyan-300 text-blue-950 hover:bg-cyan-200"
          >
            {copy.checkerCta}
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="content-section px-4">
        <div className="section-shell max-w-4xl">
          <div className="section-heading"><h2>{copy.faqTitle}</h2></div>
          <div className="mt-7 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {copy.faq.map(([question, answer]) => (
              <details key={question} className="group p-5 sm:p-6">
                <summary className="cursor-pointer list-none pr-8 text-base font-semibold text-slate-950 marker:hidden">
                  {question}
                  <span className="float-right text-blue-700 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-4 leading-7 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section px-4">
        <div className="section-shell max-w-4xl rounded-2xl border border-slate-200 bg-white p-7 text-center sm:p-10">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">{copy.finalTitle}</h2>
          <a
            href={PRODUCT_URL}
            onClick={(event) => goToProduct(event, "sidrene_cijene_final_cta")}
            className="button button-primary mt-6 inline-flex"
          >
            {copy.finalCta}
            <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
      </section>

      <section className="px-4 pb-14">
        <div className="section-shell max-w-4xl border-t border-slate-200 pt-7 text-sm leading-6 text-slate-500">{copy.legal}</div>
      </section>

      <SiteFooter copy={siteContent[lang]} lang={lang} />
    </main>
  );
}
