import { useState } from "react";
import { ArrowLeft, FileCode2, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Background, Navbar, SiteFooter, siteContent } from "./SiteChrome.jsx";
import { usePageMeta } from "./usePageMeta.js";
import { cjenikMeta, canonicalCjenikFilename } from "./cjenikMeta.js";

const RETENTION_DAYS = 30;

const archiveModules = import.meta.glob("../cjenik-archive/*.json", { eager: true, import: "default" });

function retainedSnapshots() {
  const now = Date.now();
  return Object.values(archiveModules)
    .filter((snapshot) => now - new Date(snapshot.meta.supersededAt).getTime() <= RETENTION_DAYS * 24 * 60 * 60 * 1000)
    .sort((a, b) => new Date(b.meta.supersededAt).getTime() - new Date(a.meta.supersededAt).getTime());
}

const content = {
  hr: {
    title: "Arhiva digitalnog cjenika",
    lead: "Prema Odluci NN 101/2026-1213, prethodne objavljene verzije NEPAR cjenika ostaju dostupne 30 dana od promjene.",
    back: "Natrag na trenutni cjenik",
    currentTitle: "Trenutna verzija",
    noArchive: "Nema starijih verzija — ovo je prva objavljena verzija cjenika.",
    supersededLabel: "Zamijenjena",
    publishedLabel: "Objavljena",
    csv: "CSV",
    xml: "XML",
  },
  en: {
    title: "Digital price list archive",
    lead: "Under Croatian Decision NN 101/2026-1213, previously published NEPAR price-list versions remain available for 30 days after a change.",
    back: "Back to the current price list",
    currentTitle: "Current version",
    noArchive: "No older versions — this is the first published version of the price list.",
    supersededLabel: "Superseded",
    publishedLabel: "Published",
    csv: "CSV",
    xml: "XML",
  },
};

function VersionRow({ meta, label, copy }) {
  return (
    <li className="flex flex-col gap-2 border-b border-slate-200 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold text-slate-950">{label}</p>
        <p className="text-sm text-slate-500">
          {copy.publishedLabel}: {meta.publishedAt.replace("T", " ")}
          {meta.supersededAt && ` · ${copy.supersededLabel}: ${meta.supersededAt.replace("T", " ")}`}
        </p>
      </div>
      <div className="flex gap-3">
        <a className="button button-secondary" href={`/cjenici/${canonicalCjenikFilename(meta, "csv")}`}><FileText size={16} aria-hidden="true" />{copy.csv}</a>
        <a className="button button-secondary" href={`/cjenici/${canonicalCjenikFilename(meta, "xml")}`}><FileCode2 size={16} aria-hidden="true" />{copy.xml}</a>
      </div>
    </li>
  );
}

export default function CjenikArhivaPage() {
  const [lang, setLang] = useState("hr");
  const copy = content[lang];
  usePageMeta("/cjenik/arhiva", lang);
  const snapshots = retainedSnapshots();

  return (
    <main id="top" className="site-main font-sans text-slate-800">
      <Background />
      <Navbar lang={lang} setLang={setLang} copy={siteContent[lang]} />
      <section className="content-section px-4 pt-28 sm:pt-36">
        <div className="section-shell max-w-4xl">
          <h1 className="text-4xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-5xl">{copy.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{copy.lead}</p>
          <Link to="/cjenik" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900">
            <ArrowLeft size={16} aria-hidden="true" />{copy.back}
          </Link>
        </div>
      </section>
      <section className="content-section px-4">
        <div className="section-shell max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-slate-950">{copy.currentTitle}</h2>
          <ul className="mt-2">
            <VersionRow meta={cjenikMeta} label={copy.currentTitle} copy={copy} />
          </ul>
          {snapshots.length > 0 ? (
            <ul className="mt-6 border-t border-slate-200 pt-2">
              {snapshots.map((snapshot) => (
                <VersionRow key={snapshot.meta.supersededAt} meta={snapshot.meta} label={snapshot.meta.publishedAt.replace("T", " ")} copy={copy} />
              ))}
            </ul>
          ) : (
            <p className="mt-6 border-t border-slate-200 pt-6 text-sm text-slate-500">{copy.noArchive}</p>
          )}
        </div>
      </section>
      <SiteFooter copy={siteContent[lang]} lang={lang} />
    </main>
  );
}
