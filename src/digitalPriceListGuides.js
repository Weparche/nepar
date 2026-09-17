const SITE_URL = "https://nepar.hr";
const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export const DIGITAL_PRICE_LIST_GUIDE_PATHS = [
  "/digitalni-cjenik/sidrena-cijena",
  "/digitalni-cjenik/xml-csv",
  "/digitalni-cjenik/automatizacija",
];

export const digitalPriceListGuideSources = [
  {
    label: "NN 101/2026-1212 — Odluka o isticanju dodatne cijene",
    href: "https://narodne-novine.nn.hr/clanci/sluzbeni/2026_09_101_1212.html",
  },
  {
    label: "NN 101/2026-1213 — Odluka o objavi cjenika proizvoda i usluga",
    href: "https://narodne-novine.nn.hr/clanci/sluzbeni/2026_09_101_1213.html",
  },
  {
    label: "Hrvatska obrtnička komora — obavijest o novim obvezama",
    href: "https://www.hok.hr/aktualno/danasnja-cijena-svih-proizvoda-i-usluga-postaje-sidrena-cijena-vazna-obavijest",
  },
  {
    label: "Ministarstvo gospodarstva — 11. paket mjera i sidrena cijena",
    href: "https://mingo.gov.hr/vijesti/vlada-rh-usvojila-11-paket-mjera-energetske-mjere-vrijedne-170-14-milijuna-eura-sidrena-cijena-prosiruje-se-na-sve-proizvode-i-usluge/10430",
  },
  {
    label: "Hrvatska gospodarska komora — webinar o mjerama izravne kontrole cijena",
    href: "https://hgk.hr/webinar-mjere-izravne-kontrole-cijena-isticanje-dodatne-cijene-i-objava-cjenika-proizvoda-i-usluga-najava",
  },
];

const commonEngine = {
  eyebrow: "NEPAR DIGITAL PRICE ENGINE",
  title: "Jedan izvor cijena, svi potrebni izlazi",
  body: "NEPAR Digital Price Engine povezuje postojeći strukturirani izvor cijena s vašom web stranicom. Iz jedne promjene može objaviti cjenik za posjetitelje, XML/CSV datoteke, arhivu prethodnih verzija i podatke dostupne automatiziranom dohvatom.",
  bullets: [
    "ERP, poslovni program, API ili strukturirani CSV/XML kao izvor",
    "javni web prikaz cijena bez dvostrukog ručnog prepisivanja",
    "XML/CSV endpointi i 30-dnevna dostupnost prethodnih verzija",
    "integracija u postojeći WordPress, Wix, React/Next/Vite ili custom web",
  ],
};

const guides = {
  "/digitalni-cjenik/sidrena-cijena": {
    slug: "sidrena-cijena",
    title: "Sidrena cijena 2026: što znači i kako se ističe | NEPAR",
    description: "Što je sidrena odnosno dodatna cijena od 1.10.2026., kako se razlikuje od digitalnog XML/CSV cjenika i što NN 101/2026-1212 traži od trgovaca i pružatelja usluga.",
    eyebrow: "VODIČ · NN 101/2026-1212",
    h1: "Sidrena cijena 2026: što znači i kako se razlikuje od digitalnog cjenika",
    lead: "Od 1. listopada 2026. primjenjuje se Odluka NN 101/2026-1212 o isticanju dodatne cijene. U javnosti se ta referentna cijena često naziva sidrena cijena. To je zasebna obveza od objave XML/CSV digitalnog cjenika iz Odluke 1213.",
    answer: "Najkraće: sidrena odnosno dodatna cijena je referentna cijena koja se ističe uz aktualnu cijenu, dok je digitalni cjenik strojno čitljiva XML ili CSV objava cijena na web stranici. Od 1.10.2026. te dvije obveze mogu postojati istodobno, ali imaju različitu pravnu i tehničku svrhu.",
    sections: [
      {
        heading: "Što je sidrena odnosno dodatna cijena?",
        paragraphs: [
          "Odluka NN 101/2026-1212 propisuje isticanje dodatne maloprodajne cijene uz važeću cijenu proizvoda ili usluge. Za većinu proizvoda i usluga referentna je cijena koja je bila na snazi 10. rujna 2026.",
          "Iznimka: trgovci odnosno pružatelji usluga koji su prema ranijoj mjeri već isticali dodatnu cijenu za određene kategorije proizvoda nastavljaju s cijenom koja je bila na snazi 2. svibnja 2025. za te kategorije. Datum 10. rujna 2026. zato nije univerzalan za svaki proizvod ili uslugu bez iznimke.",
          "Dodatna cijena mora biti jasno istaknuta uz aktualnu cijenu tamo gdje se cijena prikazuje prema pravilima Odluke. Ako cijene oglašavate na vlastitoj web stranici, i web prikaz treba promatrati odvojeno od tehničke obveze XML/CSV cjenika.",
        ],
      },
      {
        heading: "Sidrena cijena i digitalni cjenik nisu ista stvar",
        paragraphs: [
          "Odluka 1212 uređuje način isticanja dodatne cijene. Odluka 1213 uređuje objavu cjenika proizvoda i usluga u strojno čitljivom XML ili CSV formatu za trgovce i pružatelje usluga koji imaju uspostavljene mrežne stranice.",
          "Zato samo postojanje XML datoteke ne rješava automatski način vizualnog isticanja cijena, kao što ni ispravno prikazana sidrena cijena na webu ne zamjenjuje obvezu strojno čitljivog cjenika kada se Odluka 1213 primjenjuje.",
        ],
      },
      {
        heading: "Kako to riješiti na web stranici bez dvostrukog održavanja?",
        paragraphs: [
          "Najstabilniji pristup je imati jedan izvor istine za cijene. Ako poslovni program, ERP, blagajna ili drugi sustav može izvesti strukturirane podatke, web prikaz i XML/CSV mogu se generirati iz istog izvora.",
          "Time se smanjuje rizik da aktualna cijena na webu, sidrena cijena i strojno čitljivi cjenik završe s različitim vrijednostima.",
        ],
      },
    ],
    faq: [
      ["Je li sidrena cijena isto što i XML/CSV cjenik?", "Ne. Sidrena odnosno dodatna cijena uređena je Odlukom NN 101/2026-1212, a objava digitalnog XML/CSV cjenika Odlukom NN 101/2026-1213."],
      ["Koji je datum važan za sidrenu cijenu?", "Za većinu proizvoda i usluga Odluka 1212 kao dodatnu cijenu veže cijenu koja je bila na snazi 10. rujna 2026. Trgovci koji su prema ranijoj mjeri već isticali dodatnu cijenu za određene kategorije proizvoda nastavljaju s cijenom koja je bila na snazi 2. svibnja 2025. za te kategorije."],
      ["Vrijedi li obveza samo za webshopove?", "Ne. Pravilo o dodatnoj cijeni nije ograničeno samo na online prodaju. Način primjene ovisi o tome gdje i kako trgovac ili pružatelj usluge ističe odnosno oglašava cijene."],
      ["Može li se sidrena cijena automatski prikazivati na webu?", "Da, ako postoji pouzdan strukturirani izvor podataka koji sadrži aktualnu i odgovarajuću dodatnu cijenu. Tada ih web integracija može prikazivati iz istog izvora."],
      ["Moram li dodati posebno polje u bazu podataka za sidrenu cijenu?", "Ne kao zakonski zahtjev. To je samo jedna implementacijska opcija. Bitno je da obvezni podatak ispravno objavite i, gdje je primjenjivo, prikažete uz cijenu — interna pohrana bira se prema mogućnostima postojećeg sustava."],
    ],
    keywords: ["sidrena cijena", "dodatna cijena 2026", "NN 101/2026-1212", "digitalni cjenik", "1.10.2026"],
  },
  "/digitalni-cjenik/xml-csv": {
    slug: "xml-csv",
    title: "XML/CSV digitalni cjenik 2026: format, arhiva i obveze | NEPAR",
    description: "Vodič za XML/CSV digitalni cjenik prema NN 101/2026-1213: tko ga objavljuje, što mora sadržavati, 30-dnevna dostupnost, ažuriranje i automatizirani dohvat.",
    eyebrow: "VODIČ · NN 101/2026-1213",
    h1: "XML/CSV digitalni cjenik 2026: što mora biti javno dostupno na webu",
    lead: "Odluka NN 101/2026-1213 od 1. listopada 2026. uvodi objavu važećih cjenika proizvoda i usluga u strojno čitljivom .xml ili .csv formatu za trgovce i pružatelje usluga koji imaju uspostavljene mrežne stranice.",
    answer: "Najkraće: PDF, slika ili obična HTML tablica nisu zamjena za strojno čitljivi cjenik. Odluka traži XML ili CSV pogodan za automatsku obradu, dostupnost prethodnih objava 30 dana i tehničko rješenje koje softverskim alatima omogućuje automatizirano prikupljanje podataka.",
    sections: [
      {
        heading: "Tko prema Odluci 1213 objavljuje digitalni cjenik?",
        paragraphs: [
          "Tekst Odluke obvezu objave veže uz trgovca odnosno pružatelja usluge koji ima uspostavljenu mrežnu stranicu. Odluka nije formulirana samo za klasične webshopove, pa je bitno razlikovati postojanje vlastite web stranice od same mogućnosti online plaćanja.",
          "Za granične poslovne modele i posebne djelatnosti primjenjivost treba provjeriti prema stvarnoj djelatnosti i službenim pojašnjenjima nadležnih tijela.",
        ],
      },
      {
        heading: "Koji podaci ulaze u cjenik?",
        paragraphs: [
          "Za usluge Odluka navodi naziv usluge, maloprodajnu cijenu te podatke povezane s posebnim oblikom prodaje i dodatnom odnosno sidrenom cijenom kada su primjenjivi. Za proizvode je skup podataka širi i uključuje, među ostalim, naziv, šifru, marku, jedinicu mjere, cijenu, EAN odnosno barkod i raspoloživost. Barkod, marka i jedinica mjere nisu univerzalno obvezni podaci za pružatelje usluga.",
          "Naziv datoteke ima propisane elemente: oblik, adresu i oznaku prodajnog objekta, broj pohrane te vremensku oznaku s datumom i vremenom slanja. Odluka ne propisuje točan separator, slug format ni encoding naziva — produkcijsko rješenje treba imati stabilnu naming konvenciju, ali ona je tehnička implementacija, a ne doslovan zakonski format.",
        ],
      },
      {
        heading: "Ažuriranje, 30-dnevna arhiva i automatizirani dohvat",
        paragraphs: [
          "Odluka razlikuje dinamiku ažuriranja za trgovce i pružatelje usluga. Kod promjene cijena važno je da objava bude ažurna u propisanom roku, a prethodno objavljeni cjenici ostaju dostupni 30 dana.",
          "Uz javnu XML/CSV datoteku potrebno je omogućiti i tehnički način kojim softverski alati mogu automatizirano dohvaćati podatke. Zato stabilni javni URL-ovi i predvidljiva struktura imaju praktičnu vrijednost, ne samo SEO vrijednost.",
        ],
      },
      {
        heading: "Kako izgleda dobra implementacija?",
        paragraphs: [
          "Dobra implementacija ima ljudima čitljivu stranicu cjenika, strojno čitljivi XML ili CSV, arhivu prethodnih verzija i jasan način automatiziranog dohvata. Sve to treba generirati iz istog pouzdanog izvora cijena kada je to tehnički moguće.",
          "NEPAR-ov vlastiti cjenik koristi upravo taj obrazac: javnu stranicu /cjenik, aktualne /cjenik.csv i /cjenik.xml datoteke te /cjenik/arhiva.",
        ],
      },
    ],
    faq: [
      ["Je li PDF cjenik dovoljan?", "Ne kao zamjena za obvezu iz Odluke 1213. Odluka izričito navodi objavu u .xml ili .csv formatu pogodnom za automatsku obradu."],
      ["Moram li imati i XML i CSV?", "Odluka navodi XML ili CSV. Tehničko rješenje može ponuditi oba formata, ali osnovni tekst Odluke ne traži nužno oba istodobno."],
      ["Koliko dugo moraju biti dostupne stare verzije?", "Prethodno objavljeni cjenici trebaju ostati dostupni 30 dana u skladu s Odlukom 1213."],
      ["Treba li omogućiti automatizirani dohvat?", "Da. Odluka propisuje tehnička rješenja koja omogućuju prikupljanje podataka softverskim alatima odnosno automatiziranim programima."],
      ["Mora li se sve ručno ažurirati?", "Ne. Ako postojeći sustav cijena daje pouzdan strukturirani izvor ili API, objavu web cjenika i XML/CSV datoteka moguće je automatizirati."],
    ],
    keywords: ["XML cjenik", "CSV cjenik", "digitalni cjenik 2026", "NN 101/2026-1213", "30 dana cjenik", "automatizirani dohvat cijena"],
  },
  "/digitalni-cjenik/automatizacija": {
    slug: "automatizacija",
    title: "Automatizacija digitalnog cjenika: ERP, web i XML/CSV | NEPAR",
    description: "Kako automatizirati digitalni cjenik iz ERP-a, poslovnog programa, API-ja ili strukturiranog izvora: web prikaz, XML/CSV, arhiva i automatizirani dohvat bez dvostrukog unosa.",
    eyebrow: "TEHNIČKI VODIČ · NEPAR DIGITAL PRICE ENGINE",
    h1: "Automatizacija digitalnog cjenika: promijenite cijenu jednom, objavite je svugdje",
    lead: "Najveći operativni problem digitalnog cjenika nije izrada jedne CSV datoteke, nego održavanje više prikaza cijena bez nesklada. Ako cijene već postoje u ERP-u, poslovnom programu, Excelu, webshopu, POS/blagajničkom sustavu ili drugom strukturiranom izvoru, taj sustav može postati izvor istine za web.",
    answer: "Najkraće: cijenu ne treba prepisivati ručno na više mjesta ako vaš postojeći sustav može pouzdano izvesti strukturirane podatke. Integracijski sloj može iz istog izvora generirati javni cjenik, XML/CSV, 30-dnevnu arhivu i endpoint za automatizirani dohvat, uz prikaz aktualne i dodatne cijene gdje je primjenjivo.",
    sections: [
      {
        heading: "Arhitektura: jedan izvor istine",
        paragraphs: [
          "Izvor cijena može biti ERP, blagajna/POS, poslovni program, Excel, webshop, API ili strukturirani izvoz. Bitno je da izvor pouzdano sadrži podatke potrebne za objavu i da se promjene mogu dohvatiti bez ručnog prepisivanja.",
          "NEPAR integracija tada djeluje kao sloj između poslovnog sustava i web stranice: normalizira podatke, generira javni prikaz i strojno čitljive izlaze te zadržava prethodne objave.",
          "Odluka propisuje rezultat — automatizirani dohvat podataka o cijenama — a ne konkretnu tehnologiju. Cron raspored, API, webhook ili pozadinski Worker su moguće tehničke implementacije tog rezultata, ne zakonom propisane tehnologije.",
        ],
      },
      {
        heading: "Što se automatski objavljuje?",
        paragraphs: [
          "Iz iste verzije podataka mogu nastati korisniku čitljiva stranica cjenika, aktualna XML/CSV datoteka, vremenski označena arhivska verzija i stabilan javni endpoint za automatizirani dohvat.",
          "Ako izvor sadrži podatke potrebne za dodatnu odnosno sidrenu cijenu, isti podatkovni tok može hraniti i web prikaz tih vrijednosti. Pravna pravila i tehnička objava ipak ostaju dvije zasebne stvari koje treba provjeravati odvojeno.",
        ],
      },
      {
        heading: "Što ako koristim WordPress, Wix ili React?",
        paragraphs: [
          "Platforma web stranice ne mora biti sustav u kojem vodite cijene. WordPress može prikazivati podatke iz vanjskog izvora bez WooCommercea, a React/Next/Vite ili custom web mogu koristiti API ili server-side endpoint. Kod Wixa način povezivanja ovisi o postojećoj strukturi i dostupnim integracijama.",
          "Ključ je prvo identificirati stvarni izvor cijena, način pristupa tim podacima i učestalost promjene. Tek nakon toga ima smisla odabrati način objave na webu.",
        ],
      },
      {
        heading: "Što NEPAR Digital Price Engine radi",
        paragraphs: [
          "NEPAR Digital Price Engine zamišljen je kao integracijski sloj, a ne kao još jedno mjesto na kojem korisnik ručno održava isti cjenik. Cilj je koristiti postojeći izvor podataka kad god on može dati dovoljno pouzdanu strukturiranu informaciju.",
          "Za svaki projekt prvo se provjerava izvor podataka i postojeći web. Nakon toga definiraju se javni prikaz, XML/CSV izlazi, arhiva, način automatiziranog dohvata i monitoring dostupnosti.",
        ],
      },
    ],
    faq: [
      ["Moram li ručno održavati cijene i u NEPAR-u?", "Cilj integracije je upravo suprotan: koristiti vaš postojeći sustav kao izvor istine kada on može dati odgovarajući strukturirani izvor ili API."],
      ["Treba li mi WooCommerce?", "Ne. WordPress može koristiti vanjski izvor cijena i bez WooCommercea. WooCommerce je samo jedan mogući izvor podataka."],
      ["Može li izvor biti Excel?", "Može biti dio procesa ako se iz njega pouzdano dobiva strukturirani CSV/XML ili drugi automatizirani izvoz. Ručno slanje nove Excel datoteke pri svakoj promjeni nije isto što i puna automatizacija."],
      ["Što se događa kada promijenim cijenu u poslovnom programu?", "Ovisi o mogućnostima izvora. Ako postoji API, webhook ili redoviti strukturirani izvoz, integracija može preuzeti promjenu i osvježiti web prikaz, XML/CSV i arhivsku verziju prema dogovorenom procesu."],
      ["Može li se povezati postojeća web stranica?", "Da, ako su dostupni potrebni tehnički pristupi. NEPAR implementira na postojećim WordPress, Wix, React/Next/Vite i custom webovima, uz procjenu konkretnog sustava."],
    ],
    keywords: ["automatizacija digitalnog cjenika", "ERP cjenik web", "digitalni cjenik API", "XML CSV automatizacija", "NEPAR Digital Price Engine"],
  },
};

for (const guide of Object.values(guides)) {
  guide.engine = commonEngine;
  guide.sources = digitalPriceListGuideSources;
}

function normalizePath(path) {
  if (!path) return "/";
  return path !== "/" ? path.replace(/\/+$/, "") : "/";
}

export function isDigitalPriceListGuidePath(path) {
  return DIGITAL_PRICE_LIST_GUIDE_PATHS.includes(normalizePath(path));
}

export function getDigitalPriceListGuide(path) {
  return guides[normalizePath(path)] || null;
}

export function getDigitalPriceListGuideSeoPage(path) {
  const normalized = normalizePath(path);
  const guide = guides[normalized];
  if (!guide) return null;
  return {
    path: normalized,
    canonicalPath: normalized,
    indexable: true,
    robots: "index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1",
    image: "/brand/web-app-manifest-512x512.png",
    imageAlt: "NEPAR Digital Price Engine — digitalni cjenik 2026",
    imageWidth: 512,
    imageHeight: 512,
    lang: "hr",
    title: guide.title,
    description: guide.description,
  };
}

export function getDigitalPriceListGuideStructuredData(path) {
  const normalized = normalizePath(path);
  const guide = guides[normalized];
  if (!guide) return null;
  const canonicalUrl = `${SITE_URL}${normalized}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: "Nepar Solutions",
        legalName: "Nepar, obrt za digitalna rješenja i usluge",
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/brand/nepar_logo.png`,
        email: "nepar@nepar.hr",
      },
      {
        "@type": "TechArticle",
        "@id": `${canonicalUrl}#article`,
        headline: guide.h1,
        description: guide.description,
        keywords: guide.keywords,
        mainEntityOfPage: canonicalUrl,
        inLanguage: "hr",
        datePublished: "2026-09-17",
        dateModified: "2026-09-17",
        author: { "@id": ORGANIZATION_ID },
        publisher: { "@id": ORGANIZATION_ID },
        citation: guide.sources.map((source) => source.href),
        about: guide.keywords.slice(0, 4).map((name) => ({ "@type": "Thing", name })),
      },
      {
        "@type": "FAQPage",
        "@id": `${canonicalUrl}#faq`,
        mainEntity: guide.faq.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/digitalni-cjenik#price-engine`,
        name: "NEPAR Digital Price Engine",
        serviceType: "Automatizacija i implementacija digitalnog cjenika",
        provider: { "@id": ORGANIZATION_ID },
        areaServed: { "@type": "Country", name: "Hrvatska" },
        url: `${SITE_URL}/digitalni-cjenik`,
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Naslovnica", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Digitalni cjenik 2026", item: `${SITE_URL}/digitalni-cjenik` },
          { "@type": "ListItem", position: 3, name: guide.h1, item: canonicalUrl },
        ],
      },
    ],
  };
}
