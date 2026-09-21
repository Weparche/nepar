import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Background, Navbar, SiteFooter, siteContent } from "./SiteChrome.jsx";
import { trackEvent } from "./analytics.js";
import { usePageMeta } from "./usePageMeta.js";
import { digitalPriceListFaqHr, digitalPriceListFaqEn } from "./digitalPriceListFaq.js";
import { DigitalCjenikChecker, DigitalCjenikImplementationModal } from "./DigitalCjenikChecker.jsx";
import {
  PRODUCT_URL,
  goToProduct,
  marketingPriceEn,
  marketingPriceHr,
} from "./publisherOffer.js";

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
    contextualTitle: "Imate web stranicu?",
    contextualLead: "Sidrena cijena nije isto što i digitalni cjenik. Ako imate vlastitu web stranicu, provjerite i zasebnu obvezu objave XML/CSV cjenika.",
    contextualMikro: "Koristite MIKROeRAČUN? NEPAR Publisher može iz vašeg Excel/CSV cjenika napraviti javnu objavu za web.",
    contextualProductCta: "Isprobaj Publisher 7 dana",
    contextualGuideCta: "Provjerite obvezu digitalnog cjenika na webu",
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
    crossSellTitle: "Digitalni cjenik na webu",
    crossSellBody: "Za XML/CSV obvezu, provjeru sadržaja i tehničke zahtjeve pogledajte vodič za digitalni cjenik. NEPAR Publisher je self-service alat za objavu cjenika iz Excel/CSV — nije zamjena za isticanje sidrene cijene u poslovnom prostoru.",
    crossSellLink: "Vodič za digitalni cjenik →",
    faqTitle: "Česta pitanja",
    finalTitle: "Imate web i trebate objaviti digitalni cjenik?",
    finalLead: "Ako cijene već imate u Excelu ili CSV-u, NEPAR Publisher ih pretvara u javnu web objavu s CSV/XML datotekama i poviješću objava.",
    finalProductCta: "Učitaj cjenik i isprobaj",
    finalCustomTitle: "Složenija integracija ili prikaz sidrene cijene",
    finalCustomBody: "Za prikaz dodatne/sidrene cijene na postojećoj web stranici ili prilagođenu integraciju pošaljite upit.",
    finalCustomCta: "Pošaljite upit",
    legal: "Informacije na ovoj stranici služe kao tehnički i informativni pregled propisa i ne predstavljaju pravni savjet. Za tumačenje primjenjivosti propisa na konkretno poslovanje obratite se nadležnom tijelu ili pravnom stručnjaku.",
    faq: faqHr,
  },
  en: {
    eyebrow: "NN 101/2026-1212 · effective from 1 Oct 2026",
    title: "Reference price from 1 Oct 2026 — what you must do",
    lead: "From 1 October 2026, retail traders and service providers are covered by the additional-price rules, regardless of whether they have a website. Do you have a website? Check the additional XML/CSV digital price list obligations too.",
    contextualTitle: "Do you have a website?",
    contextualLead: "The reference price is not the same as the digital price list. If you have your own website, check the separate obligation to publish an XML/CSV price list.",
    contextualMikro: "Use MIKROeRAČUN? NEPAR Publisher can turn your Excel/CSV price list into a public web publication.",
    contextualProductCta: "Try Publisher for 7 days",
    contextualGuideCta: "Check your digital price list obligation on the web",
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
    crossSellTitle: "Digital price list on the web",
    crossSellBody: "For the XML/CSV obligation, content checks, and technical requirements, see the digital price list guide. NEPAR Publisher is a self-service tool to publish from Excel/CSV — it does not replace displaying the reference price in a physical premises.",
    crossSellLink: "Digital price list guide →",
    faqTitle: "Frequently asked questions",
    finalTitle: "Have a website and need to publish a digital price list?",
    finalLead: "If your prices are already in Excel or CSV, NEPAR Publisher turns them into a public web publication with CSV/XML files and publication history.",
    finalProductCta: "Upload your price list and try it",
    finalCustomTitle: "Complex integration or reference-price display",
    finalCustomBody: "For displaying the additional/reference price on an existing website or a tailored integration, send an inquiry.",
    finalCustomCta: "Send an inquiry",
    legal: "Information on this page is a technical and informational overview of Croatian regulation and does not constitute legal advice. For interpretation of the regulation’s applicability to a specific business, contact the competent authority or a legal professional.",
    faq: faqEn,
  },
};

export default function SidreneCijenePage() {
  const [lang, setLang] = useState("hr");
  const [implementationOpen, setImplementationOpen] = useState(false);
  const [implementationWebsite, setImplementationWebsite] = useState("");
  const copy = content[lang];
  const marketing = lang === "hr" ? marketingPriceHr : marketingPriceEn;
  usePageMeta("/sidrene-cijene", lang);
  useEffect(() => { trackEvent("view_sidrene_cijene"); }, []);

  function openImplementation(website = "") {
    setImplementationWebsite(website || "");
    setImplementationOpen(true);
    trackEvent("sidrene_cijene_implementation_cta");
  }

  return (
    <main id="top" className="site-main font-sans text-slate-800">
      <Background />
      <Navbar lang={lang} setLang={setLang} copy={siteContent[lang]} />

      <section className="content-section px-4 pt-28 sm:pt-36">
        <div className="section-shell max-w-4xl">
          <p className="text-sm font-bold text-cyan-700">{copy.eyebrow}</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-6xl">{copy.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{copy.lead}</p>
          <div className="mt-8">
            <DigitalCjenikChecker lang={lang} onRequestImplementation={openImplementation} />
          </div>
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
            <h2 className="text-xl font-semibold text-slate-950">{copy.contextualTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-700">{copy.contextualLead}</p>
            <p className="mt-3 text-sm leading-6 text-slate-700">{copy.contextualMikro}</p>
            <p className="mt-4 text-sm font-semibold text-slate-800">{marketing.launchLine}</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href={PRODUCT_URL}
                onClick={(event) => goToProduct(event, "sidrene_cijene_product_link")}
                className="button button-primary inline-flex"
              >
                {copy.contextualProductCta}
                <ArrowRight size={17} aria-hidden="true" />
              </a>
              <Link
                to="/digitalni-cjenik"
                className="text-sm font-bold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900"
              >
                {copy.contextualGuideCta} →
              </Link>
            </div>
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
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">{copy.crossSellTitle}</h2>
          <p className="mt-4 leading-7 text-slate-600">{copy.crossSellBody}</p>
          <Link to="/digitalni-cjenik" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900">
            {copy.crossSellLink}
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
        <div className="section-shell max-w-4xl rounded-2xl border border-slate-200 bg-white p-7 sm:p-10">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">{copy.finalTitle}</h2>
          <p className="mt-4 text-sm leading-6 text-slate-700">{copy.finalLead}</p>
          <p className="mt-3 text-sm font-semibold text-slate-800">{marketing.launchLine}</p>
          <p className="mt-1 text-sm text-slate-600">{marketing.afterLine}</p>
          <a
            href={PRODUCT_URL}
            onClick={(event) => goToProduct(event, "sidrene_cijene_final_product")}
            className="button button-primary mt-6 inline-flex"
          >
            {copy.finalProductCta}
            <ArrowRight size={17} aria-hidden="true" />
          </a>
          <div className="mt-8 border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-950">{copy.finalCustomTitle}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{copy.finalCustomBody}</p>
            <button type="button" className="button button-secondary mt-4" onClick={() => openImplementation()}>
              {copy.finalCustomCta}
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <section className="px-4 pb-14">
        <div className="section-shell max-w-4xl border-t border-slate-200 pt-7 text-sm leading-6 text-slate-500">{copy.legal}</div>
      </section>

      <SiteFooter copy={siteContent[lang]} lang={lang} />
      <DigitalCjenikImplementationModal
        open={implementationOpen}
        onClose={() => setImplementationOpen(false)}
        lang={lang}
        initialWebsite={implementationWebsite}
      />
    </main>
  );
}
