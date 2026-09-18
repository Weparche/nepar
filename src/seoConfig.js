import { webOfferContent } from "./webOfferContent.js";
import { nepaUsluge } from "./cjenikData.js";
import { BUSINESS } from "./siteIdentity.js";
import { digitalPriceListFaqHr } from "./digitalPriceListFaq.js";

export const SITE_URL = "https://nepar.hr";
export const DEFAULT_SOCIAL_IMAGE = "/brand/web-app-manifest-512x512.png";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const serviceFaq = {
  hr: [
    ["Tko je vlasnik web-stranice?", "Nakon završetka i plaćanja izrade, web-stranica je u vlasništvu klijenta."],
    ["Moram li ugovoriti održavanje?", "Ne. Održavanje je opcionalno. Možete samostalno upravljati hostingom i sadržajem ili kasnije odabrati godišnji paket."],
    ["Jamčite li prvo mjesto na Googleu?", "Ne. Svaki paket uključuje naprednu tehničku i on-page SEO optimizaciju, ali pozicija ovisi o konkurenciji, sadržaju, autoritetu domene i drugim čimbenicima."],
    ["Koliko traje izrada web-stranice?", "Rok ovisi o opsegu, dostupnosti sadržaja i brzini povratnih informacija. Realan rok dogovaramo prije početka rada."],
    ["Mogu li kasnije nadograditi web-stranicu?", "Da. Dodatne stranice, funkcionalnosti i integracije mogu se procijeniti i dodati nakon početne isporuke."],
    ["Je li hosting uključen u izradu?", "Hosting nije dio jednokratne cijene izrade. Možete ga voditi samostalno ili ugovoriti godišnje održavanje koje uključuje hosting i tehničku brigu."],
    ["Što trebam dostaviti za početak?", "Osnovne poslovne podatke, opis usluga, kontaktne podatke, logotip te dostupne fotografije i materijale."],
    ["Mogu li zadržati postojeću domenu i e-mail adrese?", "Da. Migraciju domene, DNS-a i postojećih servisa planiramo tako da se zadrži kontinuitet, a stavke izvan opsega paketa unaprijed zasebno procjenjujemo."],
  ],
  en: [
    ["Who owns the website?", "After development is complete and paid, the website belongs to the client."],
    ["Do I have to purchase maintenance?", "No. Maintenance is optional. You can manage hosting and content independently or choose an annual package later."],
    ["Do you guarantee the first position on Google?", "No. Every package includes advanced technical and on-page SEO, but ranking also depends on competition, content, domain authority, and other factors."],
    ["How long does website development take?", "Timing depends on scope, content availability, and feedback speed. We agree on a realistic schedule before work starts."],
    ["Can the website be expanded later?", "Yes. Additional pages, functionality, and integrations can be estimated and added after the initial delivery."],
    ["Is hosting included in development?", "Hosting is not part of the one-time development price. You can manage it independently or choose annual maintenance that includes hosting and technical care."],
    ["What do I need to provide to get started?", "Basic business information, service descriptions, contact details, your logo, and any available photographs and materials."],
    ["Can I keep my current domain and email addresses?", "Yes. We plan domain, DNS, and service migration to preserve continuity, and quote any work outside the package scope separately in advance."],
  ],
};

// Kept as a re-export for backward compatibility with any existing imports;
// the canonical content now lives in digitalPriceListFaq.js so the FAQPage
// schema always matches the visible on-page FAQ (see that file's header comment).
export const digitalPriceListFaq = digitalPriceListFaqHr;

export const digitalPriceListSources = [
  "https://narodne-novine.nn.hr/clanci/sluzbeni/2026_09_101_1212.html",
  "https://narodne-novine.nn.hr/clanci/sluzbeni/2026_09_101_1213.html",
  "https://hgk.hr/webinar-mjere-izravne-kontrole-cijena-isticanje-dodatne-cijene-i-objava-cjenika-proizvoda-i-usluga-najava",
  "https://mingo.gov.hr/vijesti/vlada-rh-usvojila-11-paket-mjera-energetske-mjere-vrijedne-170-14-milijuna-eura-sidrena-cijena-prosiruje-se-na-sve-proizvode-i-usluge/10430",
  "https://www.hok.hr/aktualno/danasnja-cijena-svih-proizvoda-i-usluga-postaje-sidrena-cijena-vazna-obavijest",
];

const localizedPages = {
  "/": {
    indexable: true,
    hr: {
      title: "Nepar Solutions | Web aplikacije, web-stranice i AI rješenja",
      description: "Digitalni proizvodi, web aplikacije i AI rješenja za tvrtke. Nepar razvija brza, sigurna i praktična rješenja od ideje do produkcije.",
    },
    en: {
      title: "Nepar Solutions | Web apps, websites, and AI solutions",
      description: "Digital products, web applications, websites, and AI solutions for companies, delivered from a clear idea to stable production.",
    },
    schema: "home",
  },
  "/usluge/izrada-web-stranica": {
    indexable: true,
    hr: {
      title: "Izrada web-stranica za obrte i tvrtke | Nepar Solutions",
      description: "Izrada modernih, brzih i SEO optimiziranih web-stranica od 300 €. Jasne jednokratne cijene, vlasništvo klijenta i opcionalno održavanje.",
    },
    en: {
      title: "Website development for trades and companies | Nepar Solutions",
      description: "Modern, fast, SEO-ready websites from €300, with clear one-time pricing, client ownership, and optional maintenance.",
    },
    schema: "service",
  },
  "/web": {
    indexable: false,
    prerender: false,
    robots: "noindex,follow",
    staticHtml: true,
    image: "/brand/og-web.png",
    imageAlt: "Nepar profesionalna web-stranica po akcijskoj cijeni od 240 eura",
    imageWidth: 1200,
    imageHeight: 630,
    hr: {
      title: "Profesionalna web stranica od 240 € | Nepar Solutions",
      description: "Brza, moderna i za Google optimizirana web stranica za tvrtke i obrte u Hrvatskoj. Akcijska jednokratna izrada od 240 €, bez obavezne mjesečne pretplate.",
    },
  },
  "/kontakt": {
    indexable: true,
    hr: {
      title: "Kontakt | Nepar Solutions",
      description: "Pošaljite upit za izradu web-stranice, web aplikacije ili AI rješenja. Nepar odgovara s jasnom preporukom opsega i sljedećim korakom.",
    },
    en: {
      title: "Contact | Nepar Solutions",
      description: "Send an inquiry about a website, web application, or AI solution. Nepar will respond with a clear scope recommendation and next step.",
    },
    schema: "contact",
  },
  "/digitalni-cjenik": {
    indexable: true,
    robots: "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1",
    hr: {
      title: "Digitalni cjenik 2026 – CSV/XML i sidrena cijena | NEPAR",
      description: "Digitalni cjenik 2026 prema NN 101/2026: CSV/XML, sidrena cijena, 30-dnevna arhiva i automatizirani dohvat. Provjerite obvezu i implementaciju na vašoj web stranici.",
    },
    en: {
      title: "Digital XML/CSV price list from 1 October 2026. | Nepar Solutions",
      description: "New digital price-list obligation from 1 October 2026. Find out if you need an XML/CSV price list and how to implement it on WordPress, Wix, or your website.",
    },
    schema: "digital-price-list",
  },
  "/sidrene-cijene": {
    indexable: true,
    hr: {
      title: "Sidrena cijena od 1.10.2026. — što morate napraviti | NEPAR",
      description: "Sidrena cijena i digitalni XML/CSV cjenik prema NN 101/2026: tko je obveznik, koji je datum i kako to riješiti na postojećem webu uz besplatnu provjeru.",
    },
    en: {
      title: "Reference price from 1 Oct 2026 — what you must do | NEPAR",
      description: "Reference price and digital XML/CSV price list under NN 101/2026: who is covered, which date applies, and how to fix it on your existing website with a free check.",
    },
    schema: "sidrene-cijene",
  },
  "/cjenik": {
    indexable: true,
    hr: {
      title: "NEPAR — digitalni cjenik usluga | Nepar Solutions",
      description: "Strojno čitljiv digitalni cjenik svih NEPAR usluga, sukladno Odluci NN 101/2026-1213 o objavi digitalnog cjenika proizvoda i usluga.",
    },
    en: {
      title: "NEPAR — digital service price list | Nepar Solutions",
      description: "A machine-readable digital price list of all NEPAR services, published under Croatian Decision NN 101/2026-1213.",
    },
    schema: "cjenik",
  },
  "/cjenik/arhiva": {
    indexable: true,
    hr: {
      title: "Arhiva digitalnog cjenika | Nepar Solutions",
      description: "Prethodne objavljene verzije NEPAR digitalnog cjenika, dostupne 30 dana od promjene sukladno Odluci NN 101/2026-1213.",
    },
    en: {
      title: "Digital price list archive | Nepar Solutions",
      description: "Previously published versions of the NEPAR digital price list, available for 30 days after a change under Decision NN 101/2026-1213.",
    },
    schema: "cjenik-arhiva",
  },
  "/privatnost": {
    indexable: true,
    hr: {
      title: "Privatnost i kolačići | Nepar Solutions",
      description: "Saznajte koje podatke Nepar obrađuje, kako koristi nužne i analitičke tehnologije te kako možete promijeniti ili povući svoju privolu.",
    },
    en: {
      title: "Privacy and cookies | Nepar Solutions",
      description: "Learn what data Nepar processes, how necessary and analytics technologies are used, and how to change or withdraw your consent.",
    },
    schema: "privacy",
  },
  "/mozgalica": {
    indexable: true,
    image: "/brand/og-mozgalica.png",
    imageAlt: "Dnevne Asocijacije - Mozgalica na nepar.hr",
    imageWidth: 1200,
    imageHeight: 630,
    hr: {
      title: "Mozgalica za žene 40+ | Dnevne Asocijacije",
      description: "Mozgalica za žene 40+. Poveži pojmove iz šminke, njege, doma, čišćenja i wellnessa u 4 skrivene grupe.",
    },
    en: {
      title: "Mozgalica for women 40+ | Daily Connections",
      description: "Connect words from beauty, skincare, home, cleaning, and wellness into four hidden groups.",
    },
    schema: "mozgalica",
  },
  "/njamko": {
    indexable: true,
    image: "/og-home-izbornik.png",
    imageAlt: "Njamko edukativna igra sa životinjama",
    imageWidth: 1200,
    imageHeight: 630,
    hr: {
      title: "Njamko | Igraj, uči i otkrivaj životinje",
      description: "Jednostavna dječja edukativna mini-platforma za djecu 3+. Igraj igre sa životinjama, zvukovima, domovima, bebama i brojanjem.",
    },
    en: {
      title: "Njamko | Play, learn, and discover animals",
      description: "A simple educational mini-platform for children aged 3+, with games about animals, sounds, habitats, babies, and counting.",
    },
    schema: "njamko",
  },
  "/admin": {
    indexable: false,
    prerender: false,
    hr: {
      title: "Administracija | Nepar Solutions",
      description: "Privatno administracijsko sučelje Nepar Solutions.",
    },
    en: {
      title: "Administration | Nepar Solutions",
      description: "Private Nepar Solutions administration interface.",
    },
  },
  "/404": {
    indexable: false,
    prerender: false,
    hr: {
      title: "Stranica nije pronađena | Nepar Solutions",
      description: "Tražena stranica nije pronađena.",
    },
    en: {
      title: "Page not found | Nepar Solutions",
      description: "The requested page could not be found.",
    },
  },
};

export const PRERENDER_PATHS = Object.entries(localizedPages)
  .filter(([, page]) => page.prerender ?? page.indexable)
  .map(([path]) => path);

export const SITEMAP_PATHS = Object.entries(localizedPages)
  .filter(([, page]) => page.indexable)
  .map(([path]) => path);

export const STATIC_HTML_PATHS = [...new Set([
  ...SITEMAP_PATHS,
  ...Object.entries(localizedPages).filter(([, page]) => page.staticHtml).map(([path]) => path),
  "/admin",
  "/404",
])];

export function getSeoPage(path = "/", lang = "hr") {
  const normalizedPath = path !== "/" ? path.replace(/\/+$/, "") : "/";
  const entry = localizedPages[normalizedPath] || localizedPages["/404"];
  const locale = entry[lang] ? lang : "hr";
  return {
    path: normalizedPath,
    canonicalPath: entry.canonicalPath ?? (entry.indexable ? normalizedPath : undefined),
    indexable: entry.indexable,
    robots: entry.robots || (entry.indexable ? "index,follow" : "noindex,nofollow"),
    image: entry.image || DEFAULT_SOCIAL_IMAGE,
    imageAlt: entry.imageAlt || "Nepar Solutions",
    imageWidth: entry.imageWidth || 512,
    imageHeight: entry.imageHeight || 512,
    schema: entry.schema,
    lang: locale,
    ...entry[locale],
  };
}

function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: "Nepar Solutions",
    legalName: "Nepar, obrt za digitalna rješenja i usluge",
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/brand/nepar_logo.png`,
    email: "nepar@nepar.hr",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.streetAddress,
      postalCode: BUSINESS.postalCode,
      addressLocality: BUSINESS.addressLocality,
      addressCountry: BUSINESS.addressCountry,
    },
  };
}

function serviceOffers() {
  return webOfferContent.hr.buildPackages.map((offer) => ({
    "@type": "Offer",
    name: offer.name,
    price: String(offer.price),
    priceCurrency: "EUR",
    url: `${SITE_URL}/usluge/izrada-web-stranica#paketi`,
    itemOffered: {
      "@type": "Service",
      name: offer.name,
      description: offer.description,
    },
  }));
}

function cjenikOffers() {
  return nepaUsluge.map((usluga) => ({
    "@type": "Offer",
    name: usluga.naziv,
    price: String(usluga.cijena),
    priceCurrency: "EUR",
    url: `${SITE_URL}/cjenik`,
  }));
}

export function getStructuredData(path = "/") {
  const page = getSeoPage(path, "hr");
  const canonicalUrl = page.canonicalPath ? `${SITE_URL}${page.canonicalPath === "/" ? "/" : page.canonicalPath}` : undefined;
  /** @type {Array<Record<string, any>>} */
  const graph = [organizationSchema()];

  if (page.schema === "home") {
    graph.push({
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: "Nepar Solutions",
      url: `${SITE_URL}/`,
      inLanguage: "hr",
      publisher: { "@id": ORGANIZATION_ID },
    });
  }

  if (page.schema === "service") {
    graph.push(
      {
        "@type": "Service",
        "@id": `${canonicalUrl}#service`,
        name: "Izrada web-stranica za obrte i tvrtke",
        description: page.description,
        serviceType: "Izrada web-stranica",
        areaServed: { "@type": "Country", name: "Hrvatska" },
        provider: { "@id": ORGANIZATION_ID },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Paketi izrade web-stranica",
          itemListElement: serviceOffers(),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        mainEntity: serviceFaq.hr.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Naslovnica", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Izrada web-stranica", item: canonicalUrl },
        ],
      },
    );
  }

  if (page.schema === "contact") {
    graph.push({
      "@type": "ContactPage",
      "@id": `${canonicalUrl}#page`,
      name: page.title,
      url: canonicalUrl,
      inLanguage: "hr",
      about: { "@id": ORGANIZATION_ID },
      mainEntity: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "nepar@nepar.hr",
        availableLanguage: ["Croatian", "English"],
      },
    });
  }

  if (page.schema === "digital-price-list") {
    graph.push(
      {
        "@type": "TechArticle",
        "@id": `${canonicalUrl}#article`,
        headline: "Digitalni cjenik 2026 – CSV/XML i sidrena cijena",
        description: page.description,
        keywords: ["digitalni cjenik 2026", "sidrena cijena", "CSV cjenik", "XML cjenik", "NN 101/2026", "digitalni cjenik za usluge"],
        about: [
          { "@type": "Thing", name: "Digitalni cjenik 2026" },
          { "@type": "Thing", name: "Sidrena cijena" },
          { "@type": "Thing", name: "CSV i XML cjenik" },
        ],
        mainEntityOfPage: canonicalUrl,
        inLanguage: "hr",
        datePublished: "2026-09-15",
        dateModified: "2026-09-17",
        author: { "@id": ORGANIZATION_ID },
        publisher: { "@id": ORGANIZATION_ID },
        citation: digitalPriceListSources,
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/digitalni-cjenik#price-engine`,
        name: "NEPAR Digital Price Engine",
        description: "NEPAR Digital Price Engine povezuje postojeći strukturirani izvor cijena (ERP, poslovni program, API ili CSV/XML) s web stranicom trgovca ili pružatelja usluge te automatski generira javni cjenik, XML/CSV datoteke, 30-dnevnu arhivu i automatizirani dohvat podataka.",
        serviceType: "Automatizacija i implementacija digitalnog cjenika",
        areaServed: { "@type": "Country", name: "Hrvatska" },
        provider: { "@id": ORGANIZATION_ID },
        url: `${SITE_URL}/digitalni-cjenik`,
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        mainEntity: digitalPriceListFaq.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Naslovnica", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Digitalni cjenik", item: canonicalUrl },
        ],
      },
    );
  }

  if (page.schema === "sidrene-cijene") {
    graph.push(
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#page`,
        name: page.title,
        description: page.description,
        url: canonicalUrl,
        inLanguage: "hr",
        about: [
          { "@type": "Thing", name: "Sidrena cijena" },
          { "@type": "Thing", name: "Dodatna cijena" },
          { "@type": "Thing", name: "Digitalni cjenik" },
        ],
        isPartOf: { "@id": WEBSITE_ID },
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        mainEntity: digitalPriceListFaq
          .filter(([question]) => [
            "Koja je razlika između sidrene cijene i digitalnog cjenika?",
            "Je li 10. rujna 2026. datum sidrene cijene za sve proizvode?",
            "Moram li dodati posebno polje u bazu podataka za sidrenu cijenu?",
          ].includes(question))
          .map(([question, answer]) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
      },
    );
  }

  if (page.schema === "cjenik") {
    graph.push(
      {
        "@type": "Service",
        "@id": `${canonicalUrl}#service`,
        name: "NEPAR digitalni cjenik usluga",
        description: page.description,
        provider: { "@id": ORGANIZATION_ID },
        areaServed: { "@type": "Country", name: "Hrvatska" },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "NEPAR cjenik usluga",
          itemListElement: cjenikOffers(),
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Naslovnica", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Cjenik", item: canonicalUrl },
        ],
      },
    );
  }

  if (page.schema === "cjenik-arhiva") {
    graph.push({
      "@type": "WebPage",
      "@id": `${canonicalUrl}#page`,
      name: page.title,
      description: page.description,
      url: canonicalUrl,
      inLanguage: ["hr", "en"],
      isPartOf: { "@id": WEBSITE_ID },
    });
  }

  if (page.schema === "privacy") {
    graph.push({
      "@type": "WebPage",
      "@id": `${canonicalUrl}#page`,
      name: page.title,
      description: page.description,
      url: canonicalUrl,
      inLanguage: ["hr", "en"],
      isPartOf: { "@id": WEBSITE_ID },
    });
  }

  if (page.schema === "mozgalica" || page.schema === "njamko") {
    const isNjamko = page.schema === "njamko";
    graph.push({
      "@type": "SoftwareApplication",
      "@id": `${canonicalUrl}#app`,
      name: isNjamko ? "Njamko" : "Dnevne Asocijacije — Mozgalica",
      description: page.description,
      url: canonicalUrl,
      applicationCategory: isNjamko ? "EducationalApplication" : "GameApplication",
      operatingSystem: "Web",
      inLanguage: "hr",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
      },
      publisher: { "@id": ORGANIZATION_ID },
    });
  }

  return graph.length > 1 || page.schema === "home"
    ? { "@context": "https://schema.org", "@graph": graph }
    : null;
}
