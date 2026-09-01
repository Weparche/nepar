import { useState } from "react";
import { CheckCircle2, Database, Mail, ShieldCheck } from "lucide-react";
import { Background, Navbar, SiteFooter, siteContent } from "./SiteChrome.jsx";
import { ConsentSettingsLink } from "./ConsentManager.jsx";
import { usePageMeta } from "./usePageMeta.js";

const privacyCopy = {
  hr: {
    title: "Privatnost bez sitnih slova.",
    intro: "Ovdje jasno opisujemo koje podatke obrađujemo, zašto ih koristimo i kako u svakom trenutku možete promijeniti svoju odluku o analitici.",
    updated: "Ažurirano 31. kolovoza 2026.",
    controllerTitle: "Tko upravlja podacima",
    controller: "Voditelj obrade je Nepar, obrt za digitalna rješenja i usluge, vl. Ivan Gorupić, MBO 99267101. Za sva pitanja javite se na nepar@nepar.hr.",
    necessaryTitle: "Nužne tehnologije",
    necessary: "Nužna lokalna pohrana pamti vaš izbor privatnosti i funkcionalne postavke. Ona ne služi oglašavanju i ne može se isključiti jer bez nje ne bismo mogli poštovati vaš odabir.",
    analyticsTitle: "Analitika samo uz privolu",
    analytics: "Tek nakon izričitog pristanka učitavamo Google Analytics 4 i aktiviramo Neparovu internu pageview analitiku. Prije pristanka nema Google zahtjeva ni internog visitor ID-ja.",
    dataTitle: "Koje podatke analitika bilježi",
    data: [
      "putanju stranice bez query i hash parametara",
      "sanitizirani izvor dolaska bez URL parametara",
      "vrstu uređaja, jezik i veličinu zaslona",
      "pseudonimni visitor ID za internu statistiku",
      "funnel događaje bez imena, e-maila, poruke ili sadržaja forme",
    ],
    retentionTitle: "Rok čuvanja",
    retention: "GA4 event podaci i pseudonimni interni visitor/dnevni zapisi čuvaju se najviše 14 kalendarskih mjeseci. Sanitizirani zbirni podaci mogu ostati dulje jer više ne sadrže visitor ID ni URL parametre.",
    processorsTitle: "Pružatelji usluga",
    processors: "Za analitiku koristimo Google Analytics 4, a za internu agregiranu statistiku Cloudflare Workers KV. Kontakt forma podatke šalje isključivo radi odgovora na vaš upit.",
    rightsTitle: "Vaš izbor i prava",
    rights: "Analitiku možete odbiti, prihvatiti ili naknadno povući. Povlačenje odmah zaustavlja buduće mjerenje i uklanja dostupne GA kolačiće. Za pristup, ispravak ili brisanje podataka povezanih s vašim upitom kontaktirajte nas e-mailom.",
    settings: "Otvori postavke privatnosti",
  },
  en: {
    title: "Privacy without fine print.",
    intro: "This page clearly explains what data we process, why we use it, and how you can change your analytics choice at any time.",
    updated: "Updated 31 August 2026.",
    controllerTitle: "Who controls the data",
    controller: "The controller is Nepar, sole proprietorship for digital solutions and services, proprietor Ivan Gorupić, MBO 99267101. Contact nepar@nepar.hr with any questions.",
    necessaryTitle: "Necessary technologies",
    necessary: "Necessary local storage remembers your privacy choice and functional preferences. It is not used for advertising and cannot be disabled because it enables us to respect your choice.",
    analyticsTitle: "Analytics only with consent",
    analytics: "Only after explicit consent do we load Google Analytics 4 and activate Nepar's internal page-view analytics. Before consent, there are no Google requests and no internal visitor ID.",
    dataTitle: "What analytics records",
    data: [
      "the page path without query or hash parameters",
      "a sanitised referrer without URL parameters",
      "device type, language, and screen size",
      "a pseudonymous visitor ID for internal statistics",
      "funnel events without names, email addresses, messages, or form content",
    ],
    retentionTitle: "Retention",
    retention: "GA4 event data and pseudonymous internal visitor/daily records are retained for no more than 14 calendar months. Sanitised aggregate data may remain longer because it contains no visitor ID or URL parameters.",
    processorsTitle: "Service providers",
    processors: "We use Google Analytics 4 for analytics and Cloudflare Workers KV for internal aggregate statistics. Contact-form data is used solely to respond to your inquiry.",
    rightsTitle: "Your choice and rights",
    rights: "You can reject, accept, or later withdraw analytics consent. Withdrawal immediately stops future measurement and removes available GA cookies. Contact us by email to request access, correction, or deletion of data linked to your inquiry.",
    settings: "Open privacy settings",
  },
};

export default function PrivacyPage() {
  const [lang, setLang] = useState("hr");
  const copy = privacyCopy[lang];
  const chrome = siteContent[lang];
  usePageMeta("/privatnost", lang);

  const sections = [
    [ShieldCheck, copy.controllerTitle, copy.controller],
    [CheckCircle2, copy.necessaryTitle, copy.necessary],
    [Database, copy.analyticsTitle, copy.analytics],
    [Database, copy.retentionTitle, copy.retention],
    [ShieldCheck, copy.processorsTitle, copy.processors],
    [Mail, copy.rightsTitle, copy.rights],
  ];

  return (
    <main className="site-main privacy-page">
      <Background />
      <Navbar lang={lang} setLang={setLang} copy={chrome} />
      <article className="privacy-shell">
        <header className="privacy-hero">
          <h1>{copy.title}</h1>
          <p>{copy.intro}</p>
          <span>{copy.updated}</span>
        </header>

        <section className="privacy-content" aria-label={lang === "hr" ? "Politika privatnosti" : "Privacy policy"}>
          {sections.slice(0, 3).map(([Icon, title, body]) => (
            <div className="privacy-section" key={title}>
              <Icon aria-hidden="true" size={22} />
              <div><h2>{title}</h2><p>{body}</p></div>
            </div>
          ))}

          <div className="privacy-section privacy-data-section">
            <Database aria-hidden="true" size={22} />
            <div>
              <h2>{copy.dataTitle}</h2>
              <ul>{copy.data.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>

          {sections.slice(3).map(([Icon, title, body]) => (
            <div className="privacy-section" key={title}>
              <Icon aria-hidden="true" size={22} />
              <div><h2>{title}</h2><p>{body}</p></div>
            </div>
          ))}
        </section>

        <div className="privacy-action">
          <ConsentSettingsLink lang={lang} className="button button-primary" />
        </div>
      </article>
      <SiteFooter copy={chrome} lang={lang} homeLink={false} />
    </main>
  );
}
