/**
 * @typedef {"website" | "redesign" | "maintenance"} OfferKind
 */

/**
 * @typedef {Object} OfferPackage
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {boolean} [priceFrom]
 * @property {boolean} [recommended]
 * @property {string} [badge]
 * @property {string} [description]
 * @property {string[]} [highlights]
 * @property {string[]} included
 * @property {number} [monthlyEquivalent]
 * @property {string} [billingNote]
 * @property {string} payment
 * @property {string} [note]
 * @property {{label: string, cta: string, href: string}} [project]
 */

/** @type {OfferPackage[]} */
const buildPackagesHr = [
  {
    id: "basic",
    name: "Web Basic",
    price: 300,
    payment: "jednokratno",
    description: "Za obrte i male tvrtke kojima treba jednostavna, moderna i profesionalna web-stranica.",
    included: [
      "moderna one-page web-stranica",
      "do 5 sadržajnih sekcija",
      "naslovna prezentacija",
      "prikaz osnovnih usluga",
      "sekcija o tvrtki ili obrtu",
      "kontaktni podaci",
      "Google karta",
      "gumbi za telefonski poziv, e-mail ili WhatsApp",
      "responzivan prikaz za mobitele, tablete i računala",
      "napredna tehnička i on-page SEO optimizacija",
      "Google Search Console",
      "osnovna analitika posjeta",
      "povezivanje domene",
      "objava web-stranice",
      "jedan krug dorada",
    ],
    note: "Klijent dostavlja tekstove, fotografije i logotip.",
  },
  {
    id: "business",
    name: "Web Business",
    price: 500,
    payment: "jednokratno",
    badge: "Najbolji omjer cijene i koristi",
    recommended: true,
    description: "Za tvrtke koje žele ozbiljniju prezentaciju, više sadržaja i kvalitetniju pripremu za upite potencijalnih klijenata.",
    included: [
      "sve iz paketa Web Basic",
      "do 5 zasebnih podstranica ili sadržajno proširena one-page stranica",
      "detaljniji prikaz usluga ili paketa",
      "galerija fotografija",
      "kontaktni obrazac ili standardna lead forma",
      "Google karta i prošireni kontaktni blok",
      "napredna tehnička i on-page SEO optimizacija",
      "optimizirani SEO naslovi i meta opisi",
      "pravilna hijerarhija naslova i struktura sadržaja",
      "Google Search Console",
      "Google Analytics ili druga osnovna analitika",
      "praćenje klikova na poziv, WhatsApp i obrazac kada je tehnički moguće",
      "optimizacija brzine i osnovni Core Web Vitals pregled",
      "pomoć pri strukturiranju dostavljenog sadržaja",
      "pravne stranice prema pripremljenom predlošku",
      "dva kruga dorada",
    ],
  },
  {
    id: "pro",
    name: "Web Pro",
    price: 700,
    payment: "jednokratno",
    description: "Za tvrtke kojima je web važan prodajni kanal i koje žele napredniju SEO strukturu, ciljane podstranice i funkcionalnosti prilagođene poslovanju.",
    included: [
      "sve iz paketa Web Business",
      "do 8 podstranica",
      "do 3 ciljane SEO landing stranice",
      "istraživanje relevantnih ključnih pojmova",
      "napredna sadržajna i SEO arhitektura",
      "napredna tehnička i on-page SEO optimizacija",
      "prilagođeni lead ili kontaktni obrazac",
      "mogućnost generiranja WhatsApp ili e-mail upita",
      "detaljni prikaz usluga, procesa, referenci ili projekata",
      "prošireni FAQ",
      "strukturirani podaci gdje su primjenjivi",
      "naprednije praćenje konverzija",
      "optimizacija brzine i korisničkog iskustva",
      "pomoć pri uređivanju, strukturiranju i skraćivanju tekstova",
      "tri kruga dorada",
    ],
    project: {
      label: "Primjer Web Pro projekta: Auto Gubić",
      cta: "Pogledaj projekt",
      href: "https://autogubic.hr/",
    },
  },
];

/** @type {OfferPackage[]} */
const buildPackagesEn = [
  {
    id: "basic",
    name: "Web Basic",
    price: 300,
    payment: "one-time",
    description: "For trades and small businesses that need a simple, modern, and professional website.",
    included: [
      "modern one-page website",
      "up to 5 content sections",
      "homepage presentation",
      "overview of core services",
      "company or business profile section",
      "contact details",
      "Google map",
      "call, email, or WhatsApp buttons",
      "responsive layout for phones, tablets, and computers",
      "advanced technical and on-page SEO optimization",
      "Google Search Console",
      "basic visit analytics",
      "domain connection",
      "website launch",
      "one revision round",
    ],
    note: "The client provides copy, photographs, and a logo.",
  },
  {
    id: "business",
    name: "Web Business",
    price: 500,
    payment: "one-time",
    badge: "Best value",
    recommended: true,
    description: "For companies that need a stronger presentation, more content, and better preparation for potential customer inquiries.",
    included: [
      "everything in Web Basic",
      "up to 5 separate pages or an expanded one-page website",
      "detailed service or package presentation",
      "photo gallery",
      "contact form or standard lead form",
      "Google map and expanded contact block",
      "advanced technical and on-page SEO optimization",
      "optimized SEO titles and meta descriptions",
      "proper heading hierarchy and content structure",
      "Google Search Console",
      "Google Analytics or another basic analytics tool",
      "call, WhatsApp, and form click tracking where technically possible",
      "speed optimization and a basic Core Web Vitals review",
      "help structuring the supplied content",
      "legal pages based on a prepared template",
      "two revision rounds",
    ],
  },
  {
    id: "pro",
    name: "Web Pro",
    price: 700,
    payment: "one-time",
    description: "For companies that treat their website as an important sales channel and need advanced SEO structure, targeted pages, and business-specific functionality.",
    included: [
      "everything in Web Business",
      "up to 8 pages",
      "up to 3 targeted SEO landing pages",
      "relevant keyword research",
      "advanced content and SEO architecture",
      "advanced technical and on-page SEO optimization",
      "custom lead or contact form",
      "structured WhatsApp or email inquiry generation",
      "detailed services, process, references, or project presentation",
      "expanded FAQ",
      "structured data where applicable",
      "advanced conversion tracking",
      "speed and user experience optimization",
      "help editing, structuring, and shortening copy",
      "three revision rounds",
    ],
    project: {
      label: "Web Pro project example: Auto Gubić",
      cta: "View project",
      href: "https://autogubic.hr/",
    },
  },
];

/** @type {OfferPackage[]} */
const redesignPackagesHr = [
  {
    id: "redesign-basic",
    name: "Redizajn Basic",
    price: 800,
    priceFrom: true,
    payment: "jednokratno",
    description: "Za postojeću one-page stranicu kojoj treba jasniji dizajn, bolja izvedba i siguran prijelaz na novu infrastrukturu.",
    highlights: [
      "one-page redizajn postojeće web-stranice",
      "migracija dogovorenog sadržaja i fotografija",
      "hosting, DNS, SSL i objava",
    ],
    included: [
      "one-page redizajn postojeće web-stranice",
      "migracija dogovorenog sadržaja i fotografija",
      "responzivan prikaz za mobitele, tablete i računala",
      "osnovna URL preusmjerenja prema dogovorenom popisu",
      "hosting i povezivanje domene",
      "DNS upravljanje i SSL certifikat",
      "Google Search Console",
      "osnovna analitika posjeta",
      "provjera ključnih elemenata prije objave",
      "objava redizajnirane web-stranice",
    ],
  },
  {
    id: "redesign-business",
    name: "Redizajn Business",
    price: 1100,
    priceFrom: true,
    payment: "jednokratno",
    recommended: true,
    badge: "Preporučeno",
    description: "Za poslovne web-stranice s više sadržaja kojima treba kontrolirana migracija, očuvanje važnih URL-ova i planirani prijelaz.",
    highlights: [
      "migracija sadržaja do 5 podstranica",
      "do 25 URL preusmjerenja",
      "staging i planirani prijelaz",
    ],
    included: [
      "redizajn web-stranice s do 5 podstranica",
      "migracija sadržaja i fotografija prema opsegu paketa",
      "responzivan prikaz za mobitele, tablete i računala",
      "do 25 URL preusmjerenja",
      "zamjena postojećih obrazaca standardnim obrascima",
      "staging verzija prije objave",
      "planirani prijelaz uz minimalan prekid rada gdje je tehnički izvedivo",
      "hosting i povezivanje domene",
      "DNS upravljanje i SSL certifikat",
      "Google Search Console i provjera indeksiranja",
      "Google Analytics ili druga osnovna analitika",
      "provjera ključnih elemenata nakon prijelaza",
    ],
  },
  {
    id: "redesign-pro",
    name: "Redizajn Pro",
    price: 1500,
    priceFrom: true,
    payment: "jednokratno",
    description: "Za sadržajno i tehnički zahtjevnije web-stranice kojima su važni SEO kontinuitet, konverzije i detaljna provjera nakon objave.",
    highlights: [
      "do 8 podstranica i 3 SEO landing stranice",
      "do 50 URL preusmjerenja",
      "post-launch tehnička i SEO provjera",
    ],
    included: [
      "redizajn web-stranice s do 8 podstranica",
      "do 3 ciljane SEO landing stranice",
      "migracija sadržaja i fotografija prema opsegu paketa",
      "responzivan prikaz za mobitele, tablete i računala",
      "do 50 URL preusmjerenja",
      "prilagođeni lead ili kontaktni obrasci",
      "strukturirani podaci gdje su primjenjivi",
      "praćenje ključnih konverzija",
      "staging verzija i planirani prijelaz",
      "hosting, DNS upravljanje i SSL certifikat",
      "Google Search Console i analitika",
      "post-launch tehnička i SEO provjera",
    ],
  },
];

/** @type {OfferPackage[]} */
const redesignPackagesEn = [
  {
    id: "redesign-basic",
    name: "Redesign Basic",
    price: 800,
    priceFrom: true,
    payment: "one-time",
    description: "For an existing one-page website that needs clearer design, stronger execution, and a safe move to new infrastructure.",
    highlights: [
      "one-page redesign of the existing website",
      "migration of agreed copy and photographs",
      "hosting, DNS, SSL, and launch",
    ],
    included: [
      "one-page redesign of the existing website",
      "migration of agreed copy and photographs",
      "responsive layout for phones, tablets, and computers",
      "basic URL redirects from an agreed list",
      "hosting and domain connection",
      "DNS management and SSL certificate",
      "Google Search Console",
      "basic visit analytics",
      "pre-launch checks of key website elements",
      "launch of the redesigned website",
    ],
  },
  {
    id: "redesign-business",
    name: "Redesign Business",
    price: 1100,
    priceFrom: true,
    payment: "one-time",
    recommended: true,
    badge: "Recommended",
    description: "For multi-page business websites that need a controlled migration, protection of important URLs, and a planned transition.",
    highlights: [
      "content migration for up to 5 pages",
      "up to 25 URL redirects",
      "staging and a planned transition",
    ],
    included: [
      "website redesign with up to 5 pages",
      "copy and photograph migration within the package scope",
      "responsive layout for phones, tablets, and computers",
      "up to 25 URL redirects",
      "replacement of existing forms with standard forms",
      "staging version before launch",
      "planned transition with minimal downtime where technically feasible",
      "hosting and domain connection",
      "DNS management and SSL certificate",
      "Google Search Console and indexing checks",
      "Google Analytics or another basic analytics tool",
      "checks of key website elements after the transition",
    ],
  },
  {
    id: "redesign-pro",
    name: "Redesign Pro",
    price: 1500,
    priceFrom: true,
    payment: "one-time",
    description: "For more demanding websites where SEO continuity, conversion tracking, and detailed post-launch verification matter.",
    highlights: [
      "up to 8 pages and 3 SEO landing pages",
      "up to 50 URL redirects",
      "post-launch technical and SEO review",
    ],
    included: [
      "website redesign with up to 8 pages",
      "up to 3 targeted SEO landing pages",
      "copy and photograph migration within the package scope",
      "responsive layout for phones, tablets, and computers",
      "up to 50 URL redirects",
      "custom lead or contact forms",
      "structured data where applicable",
      "tracking of key conversions",
      "staging version and planned transition",
      "hosting, DNS management, and SSL certificate",
      "Google Search Console and analytics",
      "post-launch technical and SEO review",
    ],
  },
];

/** @type {OfferPackage[]} */
const maintenanceHr = [
  {
    id: "maintenance-basic",
    name: "Održavanje Basic",
    price: 200,
    payment: "godišnje",
    description: "Za hosting, sigurnost i tehničku stabilnost web-stranice bez redovitih sadržajnih izmjena.",
    highlights: [
      "hosting, DNS, SSL i CDN",
      "sigurnosna i tehnička ažuriranja",
      "nadzor dostupnosti i redoviti backup",
    ],
    included: [
      "hosting web-stranice",
      "Cloudflare infrastruktura",
      "DNS upravljanje",
      "SSL certifikat",
      "CDN i osnovna zaštita",
      "nadzor dostupnosti",
      "sigurnosna i tehnička ažuriranja",
      "redoviti backup",
      "otklanjanje grešaka nastalih radom postojećeg sustava",
      "Google Search Console",
      "praćenje indeksiranja",
      "tehnička podrška e-mailom",
    ],
    note: "Ne uključuje redovite izmjene sadržaja.",
  },
  {
    id: "maintenance-business",
    name: "Održavanje Business",
    price: 400,
    payment: "godišnje",
    description: "Za poslovanja koja povremeno mijenjaju ponudu, cijene, fotografije i drugi postojeći sadržaj.",
    highlights: [
      "do 12 manjih sadržajnih izmjena godišnje",
      "provjera obrazaca i Search Consolea",
      "prioritetnija podrška",
    ],
    included: [
      "sve iz paketa Održavanje Basic",
      "administracija sadržaja",
      "do 12 manjih izmjena godišnje",
      "izmjene postojećih tekstova, fotografija, cijena, kontakata i radnog vremena",
      "redovita provjera kontaktnih obrazaca",
      "praćenje indeksiranja i tehničkih problema u Google Search Consoleu",
      "osnovno održavanje Google Analytics postavki",
      "ažuriranje SEO naslova i meta opisa postojećih stranica",
      "povremena optimizacija brzine",
      "prioritetnija podrška",
    ],
  },
  {
    id: "maintenance-pro",
    name: "Održavanje Pro",
    price: 600,
    payment: "godišnje",
    monthlyEquivalent: 50,
    billingNote: "Naplata jednom godišnje",
    recommended: true,
    badge: "Proaktivni partner",
    description: "Za tvrtke koje žele da netko aktivno prati web, predlaže poboljšanja i reagira prioritetno.",
    highlights: [
      "4 proaktivna tehnička ili UX poboljšanja godišnje",
      "Kvartalni pregled weba i performansi",
      "Prvi odgovor unutar 1 radnog dana",
    ],
    included: [
      "hosting, Cloudflare infrastruktura, DNS, SSL i CDN",
      "nadzor dostupnosti, sigurnosna ažuriranja i redoviti backup",
      "24 manje sadržajne izmjene godišnje",
      "4 proaktivna tehnička ili UX poboljšanja godišnje, do 30 minuta implementacije po poboljšanju",
      "kvartalna provjera analitike i Google Search Consolea",
      "kvartalna provjera obrazaca i postojećih integracija",
      "kvartalna provjera Core Web Vitals pokazatelja",
      "održavanje postojećih obrazaca i integracija",
      "prioritetno otklanjanje tehničkih problema",
      "prvi odgovor i početna procjena unutar 1 radnog dana",
    ],
    note: "Proaktivna poboljšanja odnose se na postojeće sekcije, obrasce, SEO i performanse. Nove stranice i funkcionalnosti ugovaraju se zasebno.",
  },
];

/** @type {OfferPackage[]} */
const maintenanceEn = [
  {
    id: "maintenance-basic",
    name: "Maintenance Basic",
    price: 200,
    payment: "per year",
    description: "For hosting, security, and technical stability without recurring content changes.",
    highlights: [
      "hosting, DNS, SSL, and CDN",
      "security and technical updates",
      "uptime monitoring and regular backups",
    ],
    included: [
      "website hosting",
      "Cloudflare infrastructure",
      "DNS management",
      "SSL certificate",
      "CDN and basic protection",
      "uptime monitoring",
      "security and technical updates",
      "regular backups",
      "fixes for faults caused by the existing system",
      "Google Search Console",
      "indexing monitoring",
      "technical support by email",
    ],
    note: "Does not include regular content changes.",
  },
  {
    id: "maintenance-business",
    name: "Maintenance Business",
    price: 400,
    payment: "per year",
    description: "For businesses that occasionally update their offer, pricing, photographs, and other existing content.",
    highlights: [
      "up to 12 minor content changes per year",
      "form and Search Console checks",
      "higher-priority support",
    ],
    included: [
      "everything in Maintenance Basic",
      "content administration",
      "up to 12 minor changes per year",
      "updates to existing copy, photos, prices, contacts, and opening hours",
      "regular contact form checks",
      "indexing and technical issue monitoring in Google Search Console",
      "basic Google Analytics settings maintenance",
      "updates to SEO titles and meta descriptions on existing pages",
      "occasional speed optimization",
      "higher-priority support",
    ],
  },
  {
    id: "maintenance-pro",
    name: "Maintenance Pro",
    price: 600,
    payment: "per year",
    monthlyEquivalent: 50,
    billingNote: "Billed once per year",
    recommended: true,
    badge: "Proactive partner",
    description: "For companies that want an active technical partner to monitor the website, recommend improvements, and respond with priority.",
    highlights: [
      "4 proactive technical or UX improvements per year",
      "Quarterly website and performance review",
      "First response within 1 business day",
    ],
    included: [
      "hosting, Cloudflare infrastructure, DNS, SSL, and CDN",
      "uptime monitoring, security updates, and regular backups",
      "24 minor content changes per year",
      "4 proactive technical or UX improvements per year, with up to 30 minutes of implementation per improvement",
      "quarterly analytics and Google Search Console review",
      "quarterly review of forms and existing integrations",
      "quarterly Core Web Vitals review",
      "maintenance of existing forms and integrations",
      "priority resolution of technical issues",
      "first response and initial assessment within 1 business day",
    ],
    note: "Proactive improvements apply to existing sections, forms, SEO, and performance. New pages and functionality are quoted separately.",
  },
];

const additionalHr = [
  ["Dodatna podstranica", "od 80 €"],
  ["Ciljana SEO landing stranica", "od 100 €"],
  ["Google Business profil i osnovno podešavanje", "od 100 €"],
  ["Dodatna administracija sadržaja", "40 €/sat"],
  ["AI chatbot ili AI integracija", "od 500 €"],
  ["Webshop, rezervacijski sustavi i napredne funkcionalnosti", "prema ponudi"],
];

const additionalEn = [
  ["Additional page", "from €80"],
  ["Targeted SEO landing page", "from €100"],
  ["Google Business Profile and basic setup", "from €100"],
  ["Additional content administration", "€40/hour"],
  ["AI chatbot or AI integration", "from €500"],
  ["E-commerce, booking systems, and advanced functionality", "custom quote"],
];

const processHr = [
  ["Kratki razgovor i analiza potreba", "Razumijemo cilj, publiku i funkcionalnosti koje web stvarno treba."],
  ["Dogovor strukture i sadržaja", "Zaključavamo opseg, stranice, materijale i rokove prije izrade."],
  ["Dizajn i izrada", "Gradimo responzivno sučelje u postojećem identitetu ili oblikujemo novi smjer."],
  ["SEO, testiranje i objava", "Uređujemo tehnički SEO, mjerimo brzinu i provjeravamo ključne korisničke tokove."],
  ["Opcionalno održavanje", "Nakon predaje birate želite li samostalno upravljati webom ili ugovoriti podršku."],
];

const processEn = [
  ["Short conversation and needs analysis", "We clarify the goal, audience, and functionality the website genuinely needs."],
  ["Structure and content agreement", "We lock the scope, pages, supplied materials, and timeline before development."],
  ["Design and development", "We build a responsive interface within your identity or define a new direction."],
  ["SEO, testing, and launch", "We configure technical SEO, measure speed, and verify the main user journeys."],
  ["Optional maintenance", "After handover, you can manage the website yourself or choose an annual support plan."],
];

const featuredHr = {
  title: "Auto Gubić",
  category: "Web Pro · dizajn · razvoj · napredni SEO",
  description: "Moderna web-stranica za specijalizirani Volvo servis u Zagrebu, izrađena s fokusom na lokalni SEO, jasno predstavljanje usluga i jednostavno slanje servisnog upita.",
  highlights: [
    "moderna responzivna web-stranica",
    "glavna stranica i ciljane SEO podstranice",
    "tri SEO landing stranice za ključne servisne usluge",
    "napredna tehnička i on-page SEO optimizacija",
    "lokalni SEO za Volvo servis u Zagrebu",
    "prilagođeni servisni obrazac s Volvo modelom, kilometražom i VIN brojem",
    "strukturirani WhatsApp ili e-mail upit",
    "galerija, FAQ, Google karta, pravne informacije i kontakt",
  ],
  href: "https://autogubic.hr/",
  cta: "Pogledaj projekt",
  imageSrc: null,
};

const featuredEn = {
  title: "Auto Gubić",
  category: "Web Pro · design · development · advanced SEO",
  description: "A modern website for a specialized Volvo service center in Zagreb, built around local SEO, clear service presentation, and a simple service inquiry flow.",
  highlights: [
    "modern responsive website",
    "homepage and targeted SEO pages",
    "three SEO landing pages for key service categories",
    "advanced technical and on-page SEO optimization",
    "local SEO for Volvo service in Zagreb",
    "custom service form with Volvo model, mileage, and VIN",
    "structured WhatsApp or email inquiry",
    "gallery, FAQ, Google map, legal information, and contact details",
  ],
  href: "https://autogubic.hr/",
  cta: "View project",
  imageSrc: null,
};

export const webOfferContent = {
  hr: {
    buildPackages: buildPackagesHr,
    redesignPackages: redesignPackagesHr,
    maintenancePackages: maintenanceHr,
    additionalServices: additionalHr,
    processSteps: processHr,
    featuredProjects: [featuredHr],
  },
  en: {
    buildPackages: buildPackagesEn,
    redesignPackages: redesignPackagesEn,
    maintenancePackages: maintenanceEn,
    additionalServices: additionalEn,
    processSteps: processEn,
    featuredProjects: [featuredEn],
  },
};

export function formatOfferPrice(price, lang = "hr", priceFrom = false) {
  const amount = new Intl.NumberFormat(lang === "hr" ? "hr-HR" : "en-US", {
    maximumFractionDigits: 0,
  }).format(price);
  if (lang === "hr") return `${priceFrom ? "od " : ""}${amount} €`;
  return `${priceFrom ? "from " : ""}€${amount}`;
}

export function formatMonthlyEquivalent(price, lang = "hr") {
  const formattedPrice = formatOfferPrice(price, lang);
  return lang === "hr" ? `${formattedPrice} mjesečni ekvivalent` : `${formattedPrice} monthly equivalent`;
}
