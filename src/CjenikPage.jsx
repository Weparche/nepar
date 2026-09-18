import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, FileCode2, FileText } from "lucide-react";
import { Background, Navbar, SiteFooter, siteContent } from "./SiteChrome.jsx";
import { usePageMeta } from "./usePageMeta.js";
import { nepaUsluge } from "./cjenikData.js";
import { cjenikMeta, canonicalCjenikFilename } from "./cjenikMeta.js";
import { formatCjenikDisplayPrice, formatCjenikDate, groupByCategory } from "./cjenikRender.js";

const CJENIK_CATEGORY = "Usluge digitalnog cjenika";

const categoryLabelsEn = {
  "Izrada web-stranica": "Website development",
  Redizajn: "Redesign",
  Održavanje: "Maintenance",
  "Social media": "Social media",
  "Dodatne usluge": "Add-ons",
  [CJENIK_CATEGORY]: "Digital price-list services",
};

const naplataLabelsHr = {
  jednokratno: "Jednokratno",
  godišnje: "Godišnje",
  mjesečno: "Mjesečno",
  "po satu": "Po satu",
};

const naplataLabelsEn = {
  jednokratno: "One-time",
  godišnje: "Annual",
  mjesečno: "Monthly",
  "po satu": "Hourly",
};

const content = {
  hr: {
    title: "NEPAR — digitalni cjenik usluga",
    lead: "Prema Odluci NN 101/2026-1213, ovo je strojno čitljiv cjenik svih NEPAR usluga.",
    tableHeaders: ["Usluga", "Naplata", "Maloprodajna cijena", "Posebni oblik prodaje", "Sidrena cijena"],
    odNoteId: "cjenik-od-note",
    odNote: "* Cijena je početna (\"od\") — konačna cijena ovisi o opsegu ili platformi. Odluka ne definira posebnu semantiku za početnu cijenu; ovo je NEPAR-ovo tehničko pojašnjenje, vidljivo i u strojnom zapisu kao dodatno polje nepar_cijena_od.",
    newServiceNote: "Usluge bez sidrene cijene uvedene su nakon 10.9.2026., a Odluka NN 101/2026-1212 za njih ne definira sidrenu cijenu.",
    sidrenaGuideLink: "Vodič za sidrenu cijenu",
    xmlCsvGuideLink: "Tehnički zahtjevi XML/CSV digitalnog cjenika",
    cjenikCategoryNote: "Ovo su usluge koje NEPAR nudi drugim tvrtkama za implementaciju digitalnog cjenika na njihovoj web-stranici — nisu dio NEPAR-ove web ili social ponude iznad.",
    noSidrena: "— (nova usluga)",
    noSpecial: "—",
    downloadsTitle: "Preuzimanje",
    csv: "Preuzmite /cjenik.csv",
    xml: "Preuzmite /cjenik.xml",
    canonicalLabel: "Kanonska datoteka (naziv sukladan Odluci)",
    archiveLink: "Arhiva prethodnih verzija",
    tableScrollLabel: "Tablica cjenika, pomičite vodoravno za više stupaca",
    published: (meta) => `Objavljeno: ${formatCjenikDate(meta.publishedAt, "hr")} · Broj pohrane: ${meta.brojPohrane}`,
    objekt: (meta) => `Prodajni objekt: ${meta.oblikProdajnogObjekta}, ${meta.adresaProdajnogObjekta} (oznaka ${meta.oznakaProdajnogObjekta})`,
    categoryLabel: (kategorija) => kategorija,
    naplataLabel: (naplata) => naplataLabelsHr[naplata] || naplata,
    mobileFields: { naplata: "Naplata", price: "Maloprodajna cijena", special: "Posebni oblik prodaje", sidrena: "Sidrena cijena" },
  },
  en: {
    title: "NEPAR — digital service price list",
    lead: "Under Croatian Decision NN 101/2026-1213, this is a machine-readable price list of all NEPAR services.",
    tableHeaders: ["Service", "Billing", "Retail price", "Special sale format", "Reference price"],
    odNoteId: "cjenik-od-note",
    odNote: "* This is a starting (\"from\") price — the final price depends on scope or platform. The Decision does not define \"starting price\" semantics; this is a NEPAR technical clarification, also present in the machine file as the nepar_cijena_od field.",
    newServiceNote: "Services without a reference price were introduced after 10 September 2026, and Decision NN 101/2026-1212 does not define one for them.",
    sidrenaGuideLink: "Reference-price guide",
    xmlCsvGuideLink: "XML/CSV digital price list technical requirements",
    cjenikCategoryNote: "These are services NEPAR sells to other businesses to implement a digital price list on their own website — they are not part of NEPAR's own web or social offering above.",
    noSidrena: "— (new service)",
    noSpecial: "—",
    downloadsTitle: "Downloads",
    csv: "Download /cjenik.csv",
    xml: "Download /cjenik.xml",
    canonicalLabel: "Canonical file (name required by the Decision)",
    archiveLink: "Archive of previous versions",
    tableScrollLabel: "Price list table, scroll horizontally for more columns",
    published: (meta) => `Published: ${formatCjenikDate(meta.publishedAt, "en")} · Storage number: ${meta.brojPohrane}`,
    objekt: (meta) => `Point of sale: ${meta.oblikProdajnogObjekta}, ${meta.adresaProdajnogObjekta} (code ${meta.oznakaProdajnogObjekta})`,
    categoryLabel: (kategorija) => categoryLabelsEn[kategorija] || kategorija,
    naplataLabel: (naplata) => naplataLabelsEn[naplata] || naplata,
    mobileFields: { naplata: "Billing", price: "Retail price", special: "Special sale format", sidrena: "Reference price" },
  },
};

function CjenikTable({ usluge, copy, lang, categoryLabel }) {
  return (
    <>
      <div className="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white sm:block" tabIndex={0} role="region" aria-label={`${copy.tableScrollLabel}: ${categoryLabel}`}>
        <table className="min-w-[820px] w-full text-left text-sm">
          <caption className="sr-only">{copy.title} — {categoryLabel}</caption>
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              {copy.tableHeaders.map((header) => (
                <th key={header} className="px-5 py-4 font-semibold">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-700">
            {usluge.map((usluga) => (
              <tr key={usluga.id}>
                <td className="px-5 py-4 font-semibold">
                  {usluga.naziv}
                  {usluga.cijenaOd && <sup aria-describedby={copy.odNoteId}> *</sup>}
                </td>
                <td className="px-5 py-4">{copy.naplataLabel(usluga.naplata)}</td>
                <td className="px-5 py-4 tabular-nums">{formatCjenikDisplayPrice(usluga, lang)}</td>
                <td className="px-5 py-4">{usluga.posebnaProdajaNaziv || copy.noSpecial}</td>
                <td className="px-5 py-4 tabular-nums">
                  {usluga.sidrenaCijena == null ? copy.noSidrena : formatCjenikDisplayPrice({ ...usluga, cijena: usluga.sidrenaCijena, cijenaOd: false }, lang)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <dl className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white sm:hidden">
        {usluge.map((usluga) => (
          <div key={usluga.id} className="grid grid-cols-2 gap-x-4 gap-y-2 p-5 text-sm">
            <dt className="col-span-2 font-semibold text-slate-950">
              {usluga.naziv}
              {usluga.cijenaOd && <sup aria-describedby={copy.odNoteId}> *</sup>}
            </dt>
            <dt className="text-slate-500">{copy.mobileFields.naplata}</dt>
            <dd className="text-right text-slate-700">{copy.naplataLabel(usluga.naplata)}</dd>
            <dt className="text-slate-500">{copy.mobileFields.price}</dt>
            <dd className="text-right tabular-nums text-slate-950">{formatCjenikDisplayPrice(usluga, lang)}</dd>
            <dt className="text-slate-500">{copy.mobileFields.special}</dt>
            <dd className="text-right text-slate-700">{usluga.posebnaProdajaNaziv || copy.noSpecial}</dd>
            <dt className="text-slate-500">{copy.mobileFields.sidrena}</dt>
            <dd className="text-right tabular-nums text-slate-700">
              {usluga.sidrenaCijena == null ? copy.noSidrena : formatCjenikDisplayPrice({ ...usluga, cijena: usluga.sidrenaCijena, cijenaOd: false }, lang)}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}

export default function CjenikPage() {
  const [lang, setLang] = useState("hr");
  const copy = content[lang];
  usePageMeta("/cjenik", lang);
  const groups = groupByCategory(nepaUsluge);
  const coreGroups = groups.filter((group) => group.kategorija !== CJENIK_CATEGORY);
  const cjenikGroup = groups.find((group) => group.kategorija === CJENIK_CATEGORY);

  return (
    <main id="top" className="site-main font-sans text-slate-800">
      <Background />
      <Navbar lang={lang} setLang={setLang} copy={siteContent[lang]} />
      <section className="content-section px-4 pt-28 sm:pt-36">
        <div className="section-shell max-w-5xl">
          <h1 className="text-4xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-5xl">{copy.title}</h1>
          <p className="mt-5 max-w-prose text-lg leading-8 text-slate-600">{copy.lead}</p>
          <p className="mt-4 max-w-prose text-sm text-slate-500">{copy.published(cjenikMeta)}</p>
          <p className="mt-1 max-w-prose text-sm text-slate-500">{copy.objekt(cjenikMeta)}</p>
        </div>
      </section>

      {coreGroups.map((group) => (
        <section key={group.kategorija} className="content-section px-4">
          <div className="section-shell max-w-5xl">
            <h2 className="mb-4 text-xl font-semibold text-slate-950">{copy.categoryLabel(group.kategorija)}</h2>
            <CjenikTable usluge={group.usluge} copy={copy} lang={lang} categoryLabel={copy.categoryLabel(group.kategorija)} />
          </div>
        </section>
      ))}

      {cjenikGroup && (
        <section className="content-section px-4">
          <div className="section-shell max-w-5xl border-t-2 border-slate-950 pt-8">
            <h2 className="text-xl font-semibold text-slate-950">{copy.categoryLabel(cjenikGroup.kategorija)}</h2>
            <p className="mt-2 max-w-prose text-sm leading-6 text-slate-600">{copy.cjenikCategoryNote}</p>
            <div className="mt-4">
              <CjenikTable usluge={cjenikGroup.usluge} copy={copy} lang={lang} categoryLabel={copy.categoryLabel(cjenikGroup.kategorija)} />
            </div>
          </div>
        </section>
      )}

      <section className="content-section px-4">
        <div className="section-shell max-w-5xl">
          <p id={copy.odNoteId} className="max-w-prose text-xs leading-5 text-slate-500">{copy.odNote}</p>
          <p className="mt-2 max-w-prose text-xs leading-5 text-slate-500">{copy.newServiceNote}</p>
          <Link to="/digitalni-cjenik/sidrena-cijena" className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900">{copy.sidrenaGuideLink}<ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </section>

      <section className="content-section px-4">
        <div className="section-shell max-w-5xl">
          <div className="section-heading"><h2>{copy.downloadsTitle}</h2></div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a className="button button-secondary" href="/cjenik.csv" download><FileText size={18} aria-hidden="true" />{copy.csv}</a>
            <a className="button button-secondary" href="/cjenik.xml" download><FileCode2 size={18} aria-hidden="true" />{copy.xml}</a>
          </div>
          <p className="mt-5 max-w-prose text-sm text-slate-600">
            {copy.canonicalLabel}: {" "}
            <a className="font-mono text-xs font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900" href={`/cjenici/${canonicalCjenikFilename(cjenikMeta, "csv")}`}>
              {canonicalCjenikFilename(cjenikMeta, "csv")}
            </a>
            {" · "}
            <a className="font-mono text-xs font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900" href={`/cjenici/${canonicalCjenikFilename(cjenikMeta, "xml")}`}>
              {canonicalCjenikFilename(cjenikMeta, "xml")}
            </a>
          </p>
          <a href="/cjenik/arhiva" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900">
            {copy.archiveLink}<ArrowRight size={16} aria-hidden="true" />
          </a>
          <div>
            <Link to="/digitalni-cjenik/xml-csv" className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900">{copy.xmlCsvGuideLink}<ArrowRight size={15} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
      <SiteFooter copy={siteContent[lang]} lang={lang} />
    </main>
  );
}
