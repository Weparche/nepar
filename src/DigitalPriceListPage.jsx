import { useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleAlert,
  FileCode2,
  FileText,
  Globe2,
  Network,
  Search,
  Send,
} from "lucide-react";
import { Background, Navbar, SiteFooter, siteContent } from "./SiteChrome.jsx";
import { getContactWorkerUrl, submitContactLead } from "./contactLead.js";
import { trackEvent } from "./analytics.js";
import { usePageMeta } from "./usePageMeta.js";

const sourceUrl = "https://narodne-novine.nn.hr/clanci/sluzbeni/2026_09_101_1213.html";
const inputClass = "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-200";

const guideContent = {
  hr: {
    published: "Objavljeno: 15.09.2026. · Zadnje provjereno prema službenim izvorima: 15.09.2026.",
    summaryTitle: "Ukratko — što morate napraviti",
    summaryLead: "Digitalni cjenik prema NN 101/2026 je javno dostupan cjenik proizvoda ili usluga u XML ili CSV formatu, pogodan za automatsku obradu. Za pružatelje usluga mora sadržavati naziv usluge, maloprodajnu cijenu, podatak o posebnom obliku prodaje ako postoji i sidrenu cijenu.",
    summary: [["Tko?", "Trgovci i pružatelji usluga s mrežnom stranicom; konkretnu primjenjivost treba promatrati u kontekstu djelatnosti i potrošača."], ["Od kada?", "1. listopada 2026."], ["Format?", "XML ili CSV, pogodan za automatsku obradu."], ["Ažuriranje usluga?", "Kod promjene, najkasnije do 8:00 sati dana objave izmjene."], ["Arhiva?", "Objavljene verzije ostaju dostupne 30 dana od objave odnosno promjene."], ["Automatski dohvat?", "Da, kroz tehnička rješenja za softverske alate i automatizirane programe."]],
    unknownTitle: "Što još nije definirano",
    unknown: "Odluka navodi obvezne podatke, ali ne propisuje točan CSV delimiter, redoslijed stupaca ni službenu XML/XSD shemu. HOK je najavio traženje službenih pojašnjenja o obuhvatu, pojedinim djelatnostima i mogućim izuzećima. Zato ovaj vodič daje tehnički okvir, a ne pravno tumačenje.",
    examplesTitle: "Stvarni primjeri digitalnog cjenika",
    examplesLead: "Primjeri uključuju polja za usluge iz točke IV. Odluke. Struktura je NEPAR-ov tehnički primjer jer Odluka ne propisuje službenu CSV/XML shemu.",
    csv: "Preuzmite primjer-usluge.csv",
    xml: "Preuzmite primjer-usluge.xml",
    platformGuidesTitle: "Primjeri po platformama",
    platformGuides: [["Kako implementirati digitalni cjenik na WordPress?", "Strukturirani izvor cijena može generirati javni prikaz, CSV/XML datoteke i arhivu; WooCommerce nije potreban kada cijene već postoje u drugom sustavu."], ["Treba li WooCommerce?", "Ne. WooCommerce je samo jedna moguća integracija. Rješenje može koristiti poslovni program ili drugi strukturirani izvor cijena."], ["Kako na Wixu?", "Wix rješenje može povezati javno dostupne CSV/XML datoteke i vidljivi cjenik; tehnički način ovisi o postojećoj strukturi stranice."], ["Kako na React/Vite stranici?", "Rješenje obično koristi server-side ili API rutu za javni CSV/XML dohvat, prikaz cjenika i arhivu prethodnih verzija."]],
    sourcesTitle: "Provjereno prema službenim izvorima",
    sources: [["Narodne novine — NN 101/2026", sourceUrl], ["Ministarstvo gospodarstva", "https://mingo.gov.hr/vijesti/vlada-rh-usvojila-11-paket-mjera-energetske-mjere-vrijedne-170-14-milijuna-eura-sidrena-cijena-prosiruje-se-na-sve-proizvode-i-usluge/10430"], ["Hrvatska obrtnička komora", "https://www.hok.hr/aktualno/danasnja-cijena-svih-proizvoda-i-usluga-postaje-sidrena-cijena-vazna-obavijest"]],
  },
  en: {
    published: "Published: 15 Sep 2026 · Last checked against official sources: 15 Sep 2026.",
    summaryTitle: "In brief — what you need to do",
    summaryLead: "A digital price list under NN 101/2026 is a publicly available product or service price list in XML or CSV format suitable for automated processing. For service providers, it must include the service name, retail price, information about a special sale where applicable, and the reference price.",
    summary: [["Who?", "Traders and service providers with a website; applicability should be considered in the context of the activity and consumers."], ["From when?", "1 October 2026."], ["Format?", "XML or CSV suitable for automated processing."], ["Service updates?", "When a price changes, no later than 8:00 on the day the change is published."], ["Archive?", "Published versions remain available for 30 days from publication or change."], ["Automated retrieval?", "Yes, through technical solutions for software tools and automated programs."]],
    unknownTitle: "What is not yet defined",
    unknown: "The Decision lists mandatory data, but does not prescribe a CSV delimiter, column order, or official XML/XSD schema. HOK has announced it will seek official clarification on scope, individual activities, and possible exemptions. This guide therefore provides a technical framework, not legal interpretation.",
    examplesTitle: "Real digital price-list examples",
    examplesLead: "The examples include the service fields in point IV of the Decision. Their structure is a NEPAR technical example because the Decision does not prescribe an official CSV/XML schema.",
    csv: "Download primjer-usluge.csv",
    xml: "Download primjer-usluge.xml",
    platformGuidesTitle: "Examples by platform",
    platformGuides: [["How do you implement a digital price list on WordPress?", "A structured price source can generate a public display, CSV/XML files, and an archive; WooCommerce is not required when prices already exist in another system."], ["Is WooCommerce required?", "No. WooCommerce is only one integration option. The solution can use business software or another structured price source."], ["How does it work on Wix?", "A Wix implementation can connect public CSV/XML files and a visible price list; the technical approach depends on the current site structure."], ["How does it work on a React/Vite site?", "The implementation typically uses a server-side or API route for public CSV/XML retrieval, price-list display, and an archive of previous versions."]],
    sourcesTitle: "Checked against official sources",
    sources: [["Narodne novine — NN 101/2026", sourceUrl], ["Ministry of Economy", "https://mingo.gov.hr/vijesti/vlada-rh-usvojila-11-paket-mjera-energetske-mjere-vrijedne-170-14-milijuna-eura-sidrena-cijena-prosiruje-se-na-sve-proizvode-i-usluge/10430"], ["Croatian Chamber of Trades and Crafts", "https://www.hok.hr/aktualno/danasnja-cijena-svih-proizvoda-i-usluga-postaje-sidrena-cijena-vazna-obavijest"]],
  },
};

const content = {
  hr: {
    eyebrow: "NN 101/2026 · primjena od 1.10.2026.",
    title: "Digitalni cjenik XML/CSV od 1. listopada 2026.",
    lead: "Imate web stranicu i pružate usluge potrošačima? Nova Odluka propisuje objavu strojno čitljivog cjenika, dostupnost prethodnih verzija i automatizirani dohvat cijena.",
    check: "Provjeri svoju web stranicu",
    implementation: "Zatraži implementaciju",
    platformsLine: "WordPress · Wix · React / Next · custom web stranice",
    sourceTitle: "Odluka o objavi cjenika proizvoda i usluga kao mjera izravne kontrole cijena",
    sourceMeta: "NN 101/2026 · Objavljeno 11. rujna 2026. · Primjena od 1. listopada 2026.",
    facts: [
      ["XML ili CSV", "Cjenik mora biti dostupan u strojno čitljivom obliku."],
      ["30 dana", "Prethodne objavljene verzije cjenika moraju ostati dostupne."],
      ["Automatski dohvat", "Podaci moraju biti dostupni softverskim alatima i automatiziranim programima."],
      ["1.10.2026.", "Datum početka primjene Odluke."],
    ],
    practiceTitle: "Što to znači u praksi?",
    practice: "Nova Odluka izričito zahtijeva objavu cjenika u XML ili CSV formatu pogodnom za automatsku obradu.",
    old: ["Samo PDF cjenik", "Cijene napisane kao običan tekst", "Cjenik kao slika"],
    new: ["/cjenik", "/cjenik.csv", "/cjenik.xml", "/cjenik/arhiva"],
    checkerTitle: "Provjerite digitalni cjenik svoje web stranice",
    checkerLead: "Unesite adresu. Provjera se izvršava na našem serveru i gleda samo javno dostupne tehničke signale.",
    checkerButton: "Provjeri",
    checkerPlaceholder: "https://vasadomena.hr",
    checkerMissing: "Provjera trenutno nije dostupna. Pokušajte ponovo kasnije ili nam pošaljite upit.",
    checkerLoading: "Provjeravamo javno dostupne dokumente…",
    found: "Pronađeno",
    csvMissing: "CSV: nije pronađen",
    xmlMissing: "XML: nije pronađen",
    greenTitle: "Pronašli smo digitalni cjenik",
    greenBody: "Na web stranici pronađen je javno dostupan CSV ili XML dokument.",
    yellowTitle: "Pronašli smo cjenik, ali ne i XML/CSV",
    yellowBody: "Na stranici postoje informacije o cijenama ili cjeniku, ali automatska provjera nije pronašla javno dostupan XML ili CSV dokument.",
    redTitle: "Nismo pronašli digitalni cjenik",
    redBody: "Automatska provjera nije pronašla javno dostupan XML ili CSV cjenik.",
    technicalNotice: "Ovo je automatska tehnička provjera i ne predstavlja pravno mišljenje.",
    contentsTitle: "Što treba sadržavati cjenik usluga?",
    contents: ["naziv usluge", "maloprodajna cijena", "posebni oblik prodaje, ako postoji", "naziv posebnog oblika prodaje", "sidrena cijena"],
    example: "Primjer je informativan.",
    flowTitle: "Kako NEPAR to rješava",
    flow: ["Poslovni program / CSV / XML", "NEPAR integracija", "Vaša web stranica", "HTML + CSV/XML + arhiva + automatizirani dohvat"],
    platformsTitle: "Implementacija na vašoj platformi",
    platforms: [
      ["WordPress", "Plugin ili prilagođena integracija. WooCommerce nije potreban ako cijene već vodite u drugom sustavu."],
      ["Wix", "Implementacija na postojeću Wix stranicu."],
      ["React / Next / Vite", "Server-side/API ruta za CSV/XML i komponenta za prikaz cjenika."],
      ["Custom", "PHP, Node i drugi prilagođeni sustavi."],
    ],
    wordpressTitle: "WordPress digitalni cjenik",
    wordpress: "NEPAR priprema WordPress rješenje koje povezuje postojeći strukturirani cjenik s web stranicom, generira javni prikaz te omogućuje strojno čitljivi CSV/XML dohvat.",
    wordpressPrices: ["Plugin — planirano od 79,90 €", "Instalacija i podešavanje — od 49,90 €"],
    programTitle: "Već vodite cijene u poslovnom programu?",
    program: "Ako vaš poslovni program već sadrži strukturirani cjenik, cilj je iskoristiti postojeće podatke umjesto ponovnog ručnog unosa cijena na web.",
    programExamples: "Primjeri: Marketino, Minimax i drugi ERP / poslovni sustavi. Dostupnost javnog feeda provjerava se za svaki sustav zasebno.",
    faqTitle: "Česta pitanja",
    faq: [
      ["Tko mora objaviti digitalni cjenik?", "Odluka propisuje obvezu objave cjenika trgovcima odnosno pružateljima usluga koji imaju uspostavljene mrežne stranice. Kod konkretne primjenjivosti treba uzeti u obzir vrstu poslovanja i odnos prema potrošačima."],
      ["Vrijedi li za B2B tvrtke?", "Odluka je usmjerena na maloprodajne cijene i zaštitu potrošača. Za poslovanje koje je isključivo B2B preporučuje se provjeriti primjenjivost na konkretan slučaj."],
      ["Je li dovoljan PDF?", "Odluka izričito navodi objavu cjenika u .xml ili .csv formatu pogodnom za automatsku obradu."],
      ["Mora li cjenik biti na vlastitoj web stranici?", "Odluka navodi da trgovac odnosno pružatelj usluge cjenike objavljuje na svojim mrežnim stranicama."],
      ["Koliko dugo se čuvaju stare verzije?", "Objavljeni cjenici trebaju ostati dostupni 30 dana od objave odnosno promjene."],
      ["Koliko često se ažurira cjenik usluga?", "Kod promjene cijena cjenik se ažurira najkasnije do 8:00 sati dana kada se objavljuje promjena."],
      ["Treba li WooCommerce?", "Ne. Ako cijene već vodite u poslovnom sustavu ili drugom strukturiranom izvoru, obični WordPress može koristiti taj izvor."],
      ["Može li se implementirati na Wix?", "Da. Način implementacije razlikuje se od WordPressa, ali digitalni cjenik moguće je povezati i s postojećom Wix stranicom."],
    ],
    formTitle: "Zatražite implementaciju",
    formLead: "Pošaljite nekoliko podataka o postojećoj web stranici i javit ćemo se s konkretnim sljedećim korakom.",
    fields: { name: "Ime ili naziv tvrtke", email: "E-mail", phone: "Telefon (opcionalno)", website: "Web stranica", platform: "Platforma", program: "Poslovni program (opcionalno)", message: "Poruka", submit: "Pošalji upit" },
    formSuccess: "Upit je poslan. Javit ćemo se uskoro.",
    formError: "Slanje nije uspjelo. Pokušajte ponovo ili pišite na nepar@nepar.hr.",
    legal: "Informacije na ovoj stranici služe kao tehnički i informativni pregled propisa i ne predstavljaju pravni savjet. Za tumačenje primjenjivosti propisa na konkretno poslovanje obratite se nadležnom tijelu ili pravnom stručnjaku.",
  },
  en: {
    eyebrow: "NN 101/2026 · effective from 1 October 2026", title: "Digital XML/CSV price list from 1 October 2026.", lead: "Do you have a website and provide services to consumers? The new Decision requires a machine-readable price list, access to previous versions, and automated price retrieval.", check: "Check your website", implementation: "Request implementation", platformsLine: "WordPress · Wix · React / Next · custom websites", sourceTitle: "Decision on publishing product and service price lists as a direct price-control measure", sourceMeta: "NN 101/2026 · Published 11 September 2026 · Effective from 1 October 2026.",
    facts: [["XML or CSV", "The price list must be available in a machine-readable format."], ["30 days", "Previously published price-list versions must remain available."], ["Automated retrieval", "Data must be available to software tools and automated programs."], ["1 October 2026", "The date the Decision takes effect."]],
    practiceTitle: "What does this mean in practice?", practice: "The new Decision expressly requires publication of a price list in XML or CSV format suitable for automated processing.", old: ["PDF-only price list", "Prices written as ordinary text", "Price list as an image"], new: ["/price-list", "/price-list.csv", "/price-list.xml", "/price-list/archive"],
    checkerTitle: "Check your website’s digital price list", checkerLead: "Enter an address. The check runs on our server and looks only at publicly available technical signals.", checkerButton: "Check", checkerPlaceholder: "https://yourdomain.com", checkerMissing: "The checker is currently unavailable. Please try again later or send us an inquiry.", checkerLoading: "Checking publicly available documents…", found: "Found", csvMissing: "CSV: not found", xmlMissing: "XML: not found", greenTitle: "We found a digital price list", greenBody: "A publicly available CSV or XML document was found on the website.", yellowTitle: "We found a price list, but not XML/CSV", yellowBody: "The website contains price or price-list information, but the automated check did not find a publicly available XML or CSV document.", redTitle: "We did not find a digital price list", redBody: "The automated check did not find a publicly available XML or CSV price list.", technicalNotice: "This is an automated technical check and is not legal advice.",
    contentsTitle: "What should a service price list contain?", contents: ["service name", "retail price", "special sale format, if applicable", "special sale format name", "reference price"], example: "This example is for information only.", flowTitle: "How NEPAR solves this", flow: ["Business software / CSV / XML", "NEPAR integration", "Your website", "HTML + CSV/XML + archive + automated retrieval"], platformsTitle: "Implementation on your platform", platforms: [["WordPress", "A plugin or tailored integration. WooCommerce is not required when prices are already managed in another system."], ["Wix", "Implementation on an existing Wix website."], ["React / Next / Vite", "A server-side/API route for CSV/XML and a price-list display component."], ["Custom", "PHP, Node, and other tailored systems."]], wordpressTitle: "WordPress digital price list", wordpress: "NEPAR is preparing a WordPress solution that connects an existing structured price list to the website, generates a public display, and enables machine-readable CSV/XML retrieval.", wordpressPrices: ["Plugin — planned from €79.90", "Installation and setup — from €49.90"], programTitle: "Do you already manage prices in business software?", program: "If your business software already contains a structured price list, the goal is to use existing data instead of manually entering prices again on the website.", programExamples: "Examples: Marketino, Minimax, and other ERP / business systems. Availability of a public feed is verified for each system individually.", faqTitle: "Frequently asked questions",
    faq: [["Who must publish a digital price list?", "The Decision requires traders and service providers with established websites to publish a price list. Applicability depends on the type of business and its relationship with consumers."], ["Does it apply to B2B companies?", "The Decision is aimed at retail prices and consumer protection. Exclusively B2B businesses should verify applicability for their specific case."], ["Is a PDF enough?", "The Decision expressly states publication in .xml or .csv format suitable for automated processing."], ["Must the price list be on the company’s own website?", "The Decision states that traders and service providers publish price lists on their own websites."], ["How long are old versions kept?", "Published price lists should remain available for 30 days from publication or change."], ["How often is a service price list updated?", "When prices change, the list is updated by no later than 8:00 on the day the change is published."], ["Is WooCommerce required?", "No. If prices are already managed in business software or another structured source, ordinary WordPress can use that source."], ["Can it be implemented on Wix?", "Yes. The implementation differs from WordPress, but a digital price list can also be connected to an existing Wix website."]],
    formTitle: "Request implementation", formLead: "Send a few details about your current website and we will reply with a practical next step.", fields: { name: "Name or company", email: "Email", phone: "Phone (optional)", website: "Website", platform: "Platform", program: "Business software (optional)", message: "Message", submit: "Send inquiry" }, formSuccess: "Your inquiry has been sent. We will be in touch soon.", formError: "Sending failed. Please try again or email nepar@nepar.hr.", legal: "Information on this page is a technical and informational overview of the regulation and does not constitute legal advice. For interpretation of the regulation’s applicability to a specific business, contact the competent authority or a legal professional.",
  },
};

function normalizeForPrefill(value) {
  const trimmed = value.trim();
  return trimmed && !/^[a-z][a-z\d+.-]*:/i.test(trimmed) ? `https://${trimmed}` : trimmed;
}

function displayUrl(value) {
  try {
    const url = new URL(value);
    return `${url.pathname || "/"}${url.search}`;
  } catch {
    return value;
  }
}

function LeadForm({ copy, initialWebsite }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", website: initialWebsite, platform: "", businessProgram: "", message: "" });
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  const started = useRef(false);

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const start = () => {
    if (!started.current) {
      started.current = true;
      trackEvent("start_digital_price_list_lead");
    }
  };
  async function submit(event) {
    event.preventDefault();
    setSending(true);
    setNotice("");
    try {
      const sent = await submitContactLead({ ...form, subject: "Digitalni cjenik", formName: "digitalni_cjenik", leadSource: "digitalni-cjenik" });
      if (!sent) throw new Error("worker_missing");
      trackEvent("generate_digital_price_list_lead");
      setNotice(copy.formSuccess);
    } catch {
      setNotice(copy.formError);
    } finally {
      setSending(false);
    }
  }
  return <form onSubmit={submit} onFocusCapture={start} className="grid gap-4" noValidate={false}>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-1.5 text-sm font-semibold text-slate-700">{copy.fields.name}<input className={inputClass} required value={form.name} onChange={update("name")} /></label>
      <label className="grid gap-1.5 text-sm font-semibold text-slate-700">{copy.fields.email}<input className={inputClass} required type="email" value={form.email} onChange={update("email")} /></label>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-1.5 text-sm font-semibold text-slate-700">{copy.fields.phone}<input className={inputClass} type="tel" value={form.phone} onChange={update("phone")} /></label>
      <label className="grid gap-1.5 text-sm font-semibold text-slate-700">{copy.fields.website}<input className={inputClass} required type="url" value={form.website} onChange={update("website")} /></label>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-1.5 text-sm font-semibold text-slate-700">{copy.fields.platform}<select className={inputClass} required value={form.platform} onChange={update("platform")}><option value="" disabled>—</option>{["WordPress", "Wix", "React / Next / Vite", "Shopify", "Webflow", "Custom", "Ne znam"].map((value) => <option key={value}>{value}</option>)}</select></label>
      <label className="grid gap-1.5 text-sm font-semibold text-slate-700">{copy.fields.program}<input className={inputClass} value={form.businessProgram} onChange={update("businessProgram")} /></label>
    </div>
    <label className="grid gap-1.5 text-sm font-semibold text-slate-700">{copy.fields.message}<textarea className={`${inputClass} min-h-32 resize-y`} required value={form.message} onChange={update("message")} /></label>
    {notice && <p role="status" className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{notice}</p>}
    <button type="submit" disabled={sending} className="button button-primary w-full disabled:cursor-wait disabled:opacity-60 sm:w-fit"><Send size={17} aria-hidden="true" />{sending ? "…" : copy.fields.submit}</button>
  </form>;
}

export default function DigitalPriceListPage() {
  const [lang, setLang] = useState("hr");
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [checkedWebsite, setCheckedWebsite] = useState("");
  const checkerRef = useRef(null);
  const formRef = useRef(null);
  const copy = content[lang];
  const guide = guideContent[lang];

  usePageMeta("/digitalni-cjenik", lang);
  useEffect(() => { trackEvent("view_digital_price_list"); }, []);

  const goTo = (ref, trackLead = false) => {
    if (trackLead) trackEvent("start_digital_price_list_lead");
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  async function check(event) {
    event.preventDefault();
    const workerUrl = getContactWorkerUrl();
    if (!workerUrl) {
      setResult({ technical: true, status: "red", message: copy.checkerMissing, details: {} });
      return;
    }
    setChecking(true);
    setResult(null);
    trackEvent("start_price_list_check");
    try {
      const response = await fetch(`${workerUrl}/api/digitalni-cjenik/check`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
      const payload = await response.json().catch(() => null);
      if (!payload || !["green", "yellow", "red"].includes(payload.status)) throw new Error("invalid_response");
      setCheckedWebsite(normalizeForPrefill(url));
      setResult(payload);
      trackEvent("price_list_check_result", { result: payload.status });
    } catch {
      setResult({ technical: true, status: "red", message: copy.checkerMissing, details: {} });
      trackEvent("price_list_check_result", { result: "red" });
    } finally {
      setChecking(false);
    }
  }
  const resultTitle = result?.status === "green" ? copy.greenTitle : result?.status === "yellow" ? copy.yellowTitle : copy.redTitle;
  const resultBody = result?.technical || result?.message === "Unesite ispravnu adresu web stranice." ? result?.message : result?.status === "green" ? copy.greenBody : result?.status === "yellow" ? copy.yellowBody : copy.redBody;
  const statusColor = result?.status === "green" ? "border-emerald-200 bg-emerald-50" : result?.status === "yellow" ? "border-amber-200 bg-amber-50" : "border-rose-200 bg-rose-50";

  return <main id="top" className="site-main font-sans text-slate-800">
    <Background />
    <Navbar lang={lang} setLang={setLang} copy={siteContent[lang]} />
    <section className="content-section px-4 pt-32 sm:pt-40">
      <div className="section-shell grid items-end gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,.8fr)]">
        <div>
          <p className="mb-5 text-sm font-bold text-cyan-700">{copy.eyebrow}</p>
          <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-6xl">{copy.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">{copy.lead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><button className="button button-primary" onClick={() => goTo(checkerRef)}><Search size={18} aria-hidden="true" />{copy.check}</button><button className="button button-secondary" onClick={() => goTo(formRef, true)}>{copy.implementation}<ArrowRight size={18} aria-hidden="true" /></button></div>
          <p className="mt-4 text-sm font-semibold text-slate-500">{copy.platformsLine}</p>
        </div>
        <aside className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-semibold text-slate-900">{copy.sourceTitle}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">{copy.sourceMeta}</p>
          <a href={sourceUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900">Narodne novine <ArrowRight size={16} aria-hidden="true" /></a>
        </aside>
      </div>
    </section>

    <section className="content-section px-4 pt-0"><div className="section-shell grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">{copy.facts.map(([title, text]) => <article key={title} className="bg-white p-6"><h2 className="text-xl font-semibold tracking-tight text-slate-950">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></article>)}</div></section>

    <section className="content-section px-4"><div className="section-shell max-w-5xl"><p className="text-sm font-semibold text-slate-500">{guide.published}</p><div className="mt-5 border-y border-slate-200 py-8"><h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">{guide.summaryTitle}</h2><p className="mt-5 max-w-4xl text-lg leading-8 text-slate-700">{guide.summaryLead}</p><dl className="mt-8 grid divide-y divide-slate-200 border-t border-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0">{guide.summary.map(([term, detail]) => <div key={term} className="grid gap-1 py-4 pr-5 md:px-5"><dt className="text-sm font-bold text-blue-700">{term}</dt><dd className="leading-6 text-slate-700">{detail}</dd></div>)}</dl></div></div></section>

    <section className="content-section px-4"><div className="section-shell max-w-5xl"><div className="border-t-2 border-slate-950 pt-5"><h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">{guide.unknownTitle}</h2><p className="mt-4 max-w-4xl leading-7 text-slate-600">{guide.unknown}</p></div></div></section>

    <section className="content-section px-4"><div className="section-shell max-w-5xl"><div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8"><h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">{guide.examplesTitle}</h2><p className="mt-4 max-w-3xl leading-7 text-slate-600">{guide.examplesLead}</p><div className="mt-6 flex flex-col gap-3 sm:flex-row"><a className="button button-secondary" href="/digitalni-cjenik/primjer-usluge.csv" download>{guide.csv}</a><a className="button button-secondary" href="/digitalni-cjenik/primjer-usluge.xml" download>{guide.xml}</a></div></div></div></section>

    <section className="content-section px-4"><div className="section-shell"><div className="section-heading"><h2>{copy.practiceTitle}</h2><p>{copy.practice}</p></div><div className="grid overflow-hidden rounded-2xl border border-slate-200 lg:grid-cols-2"><div className="bg-slate-100 p-6 sm:p-9"><p className="text-sm font-bold text-slate-500">PDF / tekst / slika</p><ul className="mt-6 grid gap-3">{copy.old.map((item) => <li key={item} className="flex items-center gap-3 text-lg font-semibold text-slate-700"><FileText size={19} aria-hidden="true" />{item}</li>)}</ul></div><div className="bg-slate-950 p-6 text-white sm:p-9"><p className="text-sm font-bold text-cyan-300">Javno dostupni putovi</p><ul className="mt-6 grid gap-3">{copy.new.map((item) => <li key={item} className="flex items-center gap-3 font-mono text-base text-white"><FileCode2 size={19} className="text-cyan-300" aria-hidden="true" />{item}</li>)}</ul></div></div></div></section>

    <section ref={checkerRef} className="content-section scroll-mt-24 px-4"><div className="section-shell max-w-4xl"><div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10"><div className="max-w-2xl"><h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">{copy.checkerTitle}</h2><p className="mt-3 leading-7 text-slate-600">{copy.checkerLead}</p></div><form onSubmit={check} noValidate className="mt-7 flex flex-col gap-3 sm:flex-row"><label className="sr-only" htmlFor="digital-price-list-url">{copy.checkerTitle}</label><input id="digital-price-list-url" className={inputClass} required type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder={copy.checkerPlaceholder} inputMode="url" /><button className="button button-primary shrink-0" disabled={checking} type="submit">{checking ? copy.checkerLoading : copy.checkerButton}</button></form>
      {result && <div aria-live="polite" className={`mt-6 rounded-2xl border p-5 ${statusColor}`}><div className="flex gap-3"><div className="mt-0.5">{result.status === "green" ? <CheckCircle2 className="text-emerald-700" aria-hidden="true" /> : <CircleAlert className={result.status === "red" ? "text-rose-700" : "text-amber-700"} aria-hidden="true" />}</div><div><h3 className="text-lg font-bold text-slate-950">{resultTitle}</h3><p className="mt-1 leading-6 text-slate-700">{resultBody}</p><div className="mt-4 grid gap-1.5 text-sm text-slate-700">{result.details?.pricePageUrl && <span>{copy.found}: <strong>{displayUrl(result.details.pricePageUrl)}</strong></span>}{result.details?.csvUrl ? <span>Pronađen CSV: <strong>{displayUrl(result.details.csvUrl)}</strong></span> : <span>{copy.csvMissing}</span>}{result.details?.xmlUrl ? <span>Pronađen XML: <strong>{displayUrl(result.details.xmlUrl)}</strong></span> : <span>{copy.xmlMissing}</span>}</div>{["yellow", "red"].includes(result.status) && !result.technical && <button className="button button-primary mt-5" onClick={() => goTo(formRef, true)}>{copy.implementation}<ArrowRight size={17} aria-hidden="true" /></button>}<p className="mt-4 text-xs leading-5 text-slate-600">{copy.technicalNotice}</p></div></div></div>}
    </div></div></section>

    <section className="content-section px-4"><div className="section-shell grid gap-10 lg:grid-cols-[.75fr_1.25fr]"><div className="section-heading"><h2>{copy.contentsTitle}</h2><ul className="mt-7 grid gap-3">{copy.contents.map((item) => <li key={item} className="flex gap-3 text-slate-700"><Check className="mt-1 shrink-0 text-blue-700" size={18} aria-hidden="true" />{item}</li>)}</ul></div><div className="rounded-2xl border border-slate-200 bg-white"><div className="hidden overflow-x-auto sm:block"><table className="min-w-[620px] w-full text-left text-sm"><thead className="bg-slate-50 text-slate-600"><tr><th className="px-5 py-4 font-semibold">Usluga</th><th className="px-5 py-4 text-right font-semibold">Cijena</th><th className="px-5 py-4 font-semibold">Posebna ponuda</th><th className="px-5 py-4 text-right font-semibold">Sidrena cijena</th></tr></thead><tbody className="divide-y divide-slate-200 text-slate-700"><tr><td className="px-5 py-4 font-semibold">Muško šišanje</td><td className="px-5 py-4 text-right tabular-nums">15,00 €</td><td className="px-5 py-4">—</td><td className="px-5 py-4 text-right tabular-nums">15,00 €</td></tr><tr><td className="px-5 py-4 font-semibold">Bojanje kose</td><td className="px-5 py-4 text-right tabular-nums">40,00 €</td><td className="px-5 py-4">Akcija</td><td className="px-5 py-4 text-right tabular-nums">45,00 €</td></tr></tbody></table></div><div className="grid divide-y divide-slate-200 sm:hidden"><div className="p-4 text-sm"><p className="font-semibold text-slate-950">Muško šišanje</p><dl className="mt-3 grid grid-cols-2 gap-y-2 text-slate-600"><dt>Cijena</dt><dd className="text-right tabular-nums">15,00 €</dd><dt>Posebna ponuda</dt><dd className="text-right">—</dd><dt>Sidrena cijena</dt><dd className="text-right tabular-nums">15,00 €</dd></dl></div><div className="p-4 text-sm"><p className="font-semibold text-slate-950">Bojanje kose</p><dl className="mt-3 grid grid-cols-2 gap-y-2 text-slate-600"><dt>Cijena</dt><dd className="text-right tabular-nums">40,00 €</dd><dt>Posebna ponuda</dt><dd className="text-right">Akcija</dd><dt>Sidrena cijena</dt><dd className="text-right tabular-nums">45,00 €</dd></dl></div></div><p className="border-t border-slate-200 px-5 py-3 text-xs text-slate-500">{copy.example}</p></div></div></section>

    <section className="content-section px-4"><div className="section-shell"><div className="section-heading"><h2>{copy.flowTitle}</h2></div><ol className="grid gap-3 md:grid-cols-4">{copy.flow.map((item, index) => <li key={item} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-5 text-center text-sm font-bold text-slate-800 md:block"><span className="inline-grid size-8 shrink-0 place-items-center rounded-full bg-blue-700 text-xs text-white">{index + 1}</span><p className="mt-0 md:mt-4">{item}</p>{index < copy.flow.length - 1 && <ArrowDown className="ml-auto text-cyan-700 md:mx-auto md:mt-4 md:rotate-[-90deg]" size={20} aria-hidden="true" />}</li>)}</ol></div></section>

    <section className="content-section px-4"><div className="section-shell"><div className="section-heading"><h2>{copy.platformsTitle}</h2></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{copy.platforms.map(([title, text]) => <article key={title} className="border-t-2 border-slate-900 pt-5"><Globe2 size={20} className="text-cyan-700" aria-hidden="true" /><h3 className="mt-5 text-xl font-semibold text-slate-950">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p></article>)}</div></div></section>

    <section className="content-section px-4"><div className="section-shell max-w-5xl"><div className="section-heading"><h2>{guide.platformGuidesTitle}</h2></div><div className="divide-y divide-slate-200 border-y border-slate-200">{guide.platformGuides.map(([question, answer]) => <article key={question} className="py-6"><h3 className="text-xl font-semibold tracking-tight text-slate-950">{question}</h3><p className="mt-3 max-w-3xl leading-7 text-slate-600">{answer}</p></article>)}</div></div></section>

    <section className="content-section px-4"><div className="section-shell grid gap-5 lg:grid-cols-2"><article className="rounded-2xl bg-slate-950 p-7 text-white sm:p-10"><Network className="text-cyan-300" aria-hidden="true" /><h2 className="mt-8 text-3xl font-semibold tracking-[-0.03em]">{copy.wordpressTitle}</h2><p className="mt-4 max-w-2xl leading-7 text-slate-300">{copy.wordpress}</p><div className="mt-7 grid gap-3 text-sm font-bold text-cyan-200">{copy.wordpressPrices.map((price) => <p key={price}>{price}</p>)}</div><button className="button mt-8 bg-white text-slate-950 hover:bg-slate-100" onClick={() => goTo(formRef, true)}>{copy.implementation}<ArrowRight size={17} aria-hidden="true" /></button></article><article className="rounded-2xl border border-slate-200 bg-white p-7 sm:p-10"><h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950">{copy.programTitle}</h2><p className="mt-4 leading-7 text-slate-600">{copy.program}</p><p className="mt-6 border-t border-slate-200 pt-5 text-sm leading-6 text-slate-500">{copy.programExamples}</p></article></div></section>

    <section className="content-section px-4"><div className="section-shell"><div className="section-heading"><h2>{copy.faqTitle}</h2></div><div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">{copy.faq.map(([question, answer]) => <details key={question} className="group p-5 sm:p-6"><summary className="cursor-pointer list-none pr-8 text-lg font-semibold text-slate-950 marker:hidden">{question}<span className="float-right text-blue-700 group-open:rotate-45">+</span></summary><p className="mt-4 max-w-3xl leading-7 text-slate-600">{answer}</p></details>)}</div></div></section>

    <section className="content-section px-4"><div className="section-shell max-w-5xl"><div className="section-heading"><h2>{guide.sourcesTitle}</h2></div><ul className="grid gap-3">{guide.sources.map(([label, href]) => <li key={href}><a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900">{label}<ArrowRight size={16} aria-hidden="true" /></a></li>)}</ul></div></section>

    <section ref={formRef} className="content-section scroll-mt-24 px-4"><div className="section-shell max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-10"><h2 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">{copy.formTitle}</h2><p className="mt-3 max-w-2xl leading-7 text-slate-600">{copy.formLead}</p><div className="mt-8"><LeadForm key={checkedWebsite} copy={copy} initialWebsite={checkedWebsite} /></div></div></section>
    <section className="px-4 pb-14"><div className="section-shell max-w-4xl border-t border-slate-200 pt-7 text-sm leading-6 text-slate-500">{copy.legal}</div></section>
    <SiteFooter copy={siteContent[lang]} lang={lang} />
  </main>;
}
