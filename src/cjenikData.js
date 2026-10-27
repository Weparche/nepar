/**
 * Pravi izvor istine za NEPAR-ove cijene (Odluka NN 101/2026-1213: naziv usluge,
 * maloprodajna cijena, posebni oblik prodaje ako postoji + naziv, sidrena cijena).
 *
 * src/webOfferContent.js UVOZI cijene odavde (getCjenikCijena) — nikad obrnuto.
 * Ovo je jedino mjesto gdje se cijena pokrivenih usluga smije mijenjati.
 *
 * `sidrenaCijena` = cijena koja je vrijedila 10.9.2026. (Odluka NN 101/2026-1212), a
 * `datumReferentneCijene` datum na koji se ta cijena odnosi. Za usluge koje su postojale
 * tog datuma jednaka je trenutnoj `cijeni` (potvrđeno nepromijenjeno), datum 2026-09-10.
 * Za usluge uvedene nakon 10.9.2026. sidrena cijena je cijena s datuma prvog uvrštenja
 * u prodaju, uz jasno naveden taj datum (službeno pojašnjenje Ministarstva gospodarstva).
 * `novaStavka` je interni NEPAR podatak (u datoteci kao proširenje nepar_nova_stavka);
 * Odluka ga ne traži.
 */
export const nepaUsluge = [
  // -- Izrada web-stranica --
  { id: "web-basic", naziv: "Web Basic", kategorija: "Izrada web-stranica", cijena: 300, cijenaOd: false, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 300, datumReferentneCijene: "2026-09-10" },
  { id: "web-business", naziv: "Web Business", kategorija: "Izrada web-stranica", cijena: 500, cijenaOd: false, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 500, datumReferentneCijene: "2026-09-10" },
  { id: "web-pro", naziv: "Web Pro", kategorija: "Izrada web-stranica", cijena: 700, cijenaOd: false, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 700, datumReferentneCijene: "2026-09-10" },

  // -- Redizajn --
  { id: "redesign-basic", naziv: "Redizajn Basic", kategorija: "Redizajn", cijena: 800, cijenaOd: true, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 800, datumReferentneCijene: "2026-09-10" },
  { id: "redesign-business", naziv: "Redizajn Business", kategorija: "Redizajn", cijena: 1100, cijenaOd: true, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 1100, datumReferentneCijene: "2026-09-10" },
  { id: "redesign-pro", naziv: "Redizajn Pro", kategorija: "Redizajn", cijena: 1500, cijenaOd: true, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 1500, datumReferentneCijene: "2026-09-10" },

  // -- Održavanje --
  { id: "maintenance-basic", naziv: "Održavanje Basic", kategorija: "Održavanje", cijena: 200, cijenaOd: false, naplata: "godišnje", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 200, datumReferentneCijene: "2026-09-10" },
  { id: "maintenance-business", naziv: "Održavanje Business", kategorija: "Održavanje", cijena: 400, cijenaOd: false, naplata: "godišnje", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 400, datumReferentneCijene: "2026-09-10" },
  { id: "maintenance-pro", naziv: "Održavanje Pro", kategorija: "Održavanje", cijena: 600, cijenaOd: false, naplata: "godišnje", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 600, datumReferentneCijene: "2026-09-10" },

  // -- Social --
  { id: "social-basic", naziv: "Social Basic", kategorija: "Social media", cijena: 300, cijenaOd: false, naplata: "mjesečno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 300, datumReferentneCijene: "2026-09-10" },
  { id: "social-business", naziv: "Social Business", kategorija: "Social media", cijena: 450, cijenaOd: false, naplata: "mjesečno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 450, datumReferentneCijene: "2026-09-10" },
  { id: "social-pro", naziv: "Social Pro", kategorija: "Social media", cijena: 650, cijenaOd: false, naplata: "mjesečno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 650, datumReferentneCijene: "2026-09-10" },

  // -- Dodatne usluge (izostavljena stavka "prema ponudi" bez fiksne cijene) --
  { id: "addon-podstranica", naziv: "Dodatna podstranica", kategorija: "Dodatne usluge", cijena: 80, cijenaOd: true, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 80, datumReferentneCijene: "2026-09-10" },
  { id: "addon-seo-landing", naziv: "Ciljana SEO landing stranica", kategorija: "Dodatne usluge", cijena: 100, cijenaOd: true, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 100, datumReferentneCijene: "2026-09-10" },
  { id: "addon-gbp", naziv: "Google Business profil i osnovno podešavanje", kategorija: "Dodatne usluge", cijena: 100, cijenaOd: true, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 100, datumReferentneCijene: "2026-09-10" },
  { id: "addon-administracija", naziv: "Dodatna administracija sadržaja", kategorija: "Dodatne usluge", cijena: 40, cijenaOd: false, naplata: "po satu", displaySuffixHr: "/sat", displaySuffixEn: "/hour", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 40, datumReferentneCijene: "2026-09-10" },
  { id: "addon-ai-chatbot", naziv: "AI chatbot ili AI integracija", kategorija: "Dodatne usluge", cijena: 500, cijenaOd: true, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 500, datumReferentneCijene: "2026-09-10" },
  { id: "addon-content-session", naziv: "Content session na lokaciji (do 60 min snimanja fotografija i videa)", kategorija: "Dodatne usluge", cijena: 150, cijenaOd: true, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 150, datumReferentneCijene: "2026-09-10" },
  { id: "addon-meta-ads", naziv: "Upravljanje Meta Ads kampanjama", kategorija: "Dodatne usluge", cijena: 150, cijenaOd: true, naplata: "mjesečno", displaySuffixHr: " / mj. + oglasni budžet", displaySuffixEn: " / month + ad budget", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 150, datumReferentneCijene: "2026-09-10" },

  // -- Nove usluge digitalnog cjenika (uvedene nakon 10.9.2026.; sidrena cijena = cijena s datuma prvog uvrštenja). --
  // Datumi prvog uvrštenja: prva objava cjenika (broj pohrane 1, 15.9.2026.) za provjeru i integraciju,
  // 21.9.2026. (commit 4da734f) za NEPAR Publisher, 26.10.2026. (digitalnicjenik.nepar.hr d3a6107) za
  // Web Link i Web + Publisher, 27.10.2026. (broj pohrane 3) za pomoć s ugradnjom.
  // Publisher je od 26.10.2026. 49,90 €; sidrena cijena ostaje cijena s datuma prvog uvrštenja (39,90 €).
  // "Postavljanje NEPAR Publishera (prva godina)" se više ne nudi; zamijenio ga je paket Web + Publisher.
  // NEPAR ove usluge prodaje DRUGIM tvrtkama (implementacija digitalnog cjenika na
  // njihovu web-stranicu) — zasebna kategorija da se ne pomiješaju s NEPAR-ovim
  // vlastitim web/social ponudama u istoj tablici.
  { id: "cjenik-provjera", naziv: "Provjera digitalnog cjenika web-stranice", kategorija: "Usluge digitalnog cjenika", cijena: 0, cijenaOd: false, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 0, datumReferentneCijene: "2026-09-15", novaStavka: true },
  { id: "cjenik-web-link", naziv: "NEPAR Web Link – godišnja pretplata", kategorija: "Usluge digitalnog cjenika", cijena: 19.9, cijenaOd: false, naplata: "godišnje", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 19.9, datumReferentneCijene: "2026-10-26", novaStavka: true, napomena: "Digitalni cjenik za postojeći web, do 5.000 stavki, bez plugina." },
  { id: "cjenik-publisher", naziv: "NEPAR Publisher – godišnja pretplata", kategorija: "Usluge digitalnog cjenika", cijena: 49.9, cijenaOd: false, naplata: "godišnje", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 39.9, datumReferentneCijene: "2026-09-21", novaStavka: true, napomena: "Self-service putem digitalnicjenik.nepar.hr." },
  { id: "cjenik-web-publisher", naziv: "NEPAR Web + Publisher – godišnja pretplata", kategorija: "Usluge digitalnog cjenika", cijena: 79.9, cijenaOd: false, naplata: "godišnje", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 79.9, datumReferentneCijene: "2026-10-26", novaStavka: true, napomena: "Publisher uz jednostavan NEPAR web, hosting i SSL." },
  { id: "cjenik-ugradnja", naziv: "Pomoć s ugradnjom digitalnog cjenika na postojeći web", kategorija: "Usluge digitalnog cjenika", cijena: 29.9, cijenaOd: false, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 29.9, datumReferentneCijene: "2026-10-27", novaStavka: true, napomena: "Postavljanje poveznice ili gumba za digitalni cjenik." },
  { id: "cjenik-integracija-platforme", naziv: "Wix / React / Next / Vite / custom integracija", kategorija: "Usluge digitalnog cjenika", cijena: 149, cijenaOd: true, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 149, datumReferentneCijene: "2026-09-15", novaStavka: true, napomena: "Prilagođena integracija ERP/POS/webshop — individualna ponuda." },
];

export function getCjenikUsluga(id) {
  const usluga = nepaUsluge.find((item) => item.id === id);
  if (!usluga) throw new Error(`cjenikData: nepoznat id usluge "${id}"`);
  return usluga;
}

/** Vraća samo cjenovna polja — za webOfferContent.js pakete (`price`/`priceFrom`). */
export function getCjenikCijena(id) {
  const { cijena, cijenaOd } = getCjenikUsluga(id);
  return { price: cijena, priceFrom: cijenaOd };
}
