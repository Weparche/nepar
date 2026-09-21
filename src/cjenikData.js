/**
 * Pravi izvor istine za NEPAR-ove cijene (Odluka NN 101/2026-1213: naziv usluge,
 * maloprodajna cijena, posebni oblik prodaje ako postoji + naziv, sidrena cijena).
 *
 * src/webOfferContent.js UVOZI cijene odavde (getCjenikCijena) — nikad obrnuto.
 * Ovo je jedino mjesto gdje se cijena pokrivenih usluga smije mijenjati.
 *
 * `sidrenaCijena` = cijena koja je vrijedila 10.9.2026. (Odluka NN 101/2026-1212).
 * Za usluge koje su postojale tog datuma jednaka je trenutnoj `cijeni` (potvrđeno
 * nepromijenjeno). Za usluge uvedene nakon 10.9.2026. ostaje `null` — Odluka ne
 * definira sidrenu cijenu za uslugu koja tog datuma nije postojala.
 */
export const nepaUsluge = [
  // -- Izrada web-stranica --
  { id: "web-basic", naziv: "Web Basic", kategorija: "Izrada web-stranica", cijena: 300, cijenaOd: false, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 300 },
  { id: "web-business", naziv: "Web Business", kategorija: "Izrada web-stranica", cijena: 500, cijenaOd: false, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 500 },
  { id: "web-pro", naziv: "Web Pro", kategorija: "Izrada web-stranica", cijena: 700, cijenaOd: false, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 700 },

  // -- Redizajn --
  { id: "redesign-basic", naziv: "Redizajn Basic", kategorija: "Redizajn", cijena: 800, cijenaOd: true, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 800 },
  { id: "redesign-business", naziv: "Redizajn Business", kategorija: "Redizajn", cijena: 1100, cijenaOd: true, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 1100 },
  { id: "redesign-pro", naziv: "Redizajn Pro", kategorija: "Redizajn", cijena: 1500, cijenaOd: true, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 1500 },

  // -- Održavanje --
  { id: "maintenance-basic", naziv: "Održavanje Basic", kategorija: "Održavanje", cijena: 200, cijenaOd: false, naplata: "godišnje", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 200 },
  { id: "maintenance-business", naziv: "Održavanje Business", kategorija: "Održavanje", cijena: 400, cijenaOd: false, naplata: "godišnje", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 400 },
  { id: "maintenance-pro", naziv: "Održavanje Pro", kategorija: "Održavanje", cijena: 600, cijenaOd: false, naplata: "godišnje", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 600 },

  // -- Social --
  { id: "social-basic", naziv: "Social Basic", kategorija: "Social media", cijena: 300, cijenaOd: false, naplata: "mjesečno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 300 },
  { id: "social-business", naziv: "Social Business", kategorija: "Social media", cijena: 450, cijenaOd: false, naplata: "mjesečno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 450 },
  { id: "social-pro", naziv: "Social Pro", kategorija: "Social media", cijena: 650, cijenaOd: false, naplata: "mjesečno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 650 },

  // -- Dodatne usluge (izostavljena stavka "prema ponudi" bez fiksne cijene) --
  { id: "addon-podstranica", naziv: "Dodatna podstranica", kategorija: "Dodatne usluge", cijena: 80, cijenaOd: true, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 80 },
  { id: "addon-seo-landing", naziv: "Ciljana SEO landing stranica", kategorija: "Dodatne usluge", cijena: 100, cijenaOd: true, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 100 },
  { id: "addon-gbp", naziv: "Google Business profil i osnovno podešavanje", kategorija: "Dodatne usluge", cijena: 100, cijenaOd: true, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 100 },
  { id: "addon-administracija", naziv: "Dodatna administracija sadržaja", kategorija: "Dodatne usluge", cijena: 40, cijenaOd: false, naplata: "po satu", displaySuffixHr: "/sat", displaySuffixEn: "/hour", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 40 },
  { id: "addon-ai-chatbot", naziv: "AI chatbot ili AI integracija", kategorija: "Dodatne usluge", cijena: 500, cijenaOd: true, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 500 },
  { id: "addon-content-session", naziv: "Content session na lokaciji (do 60 min snimanja fotografija i videa)", kategorija: "Dodatne usluge", cijena: 150, cijenaOd: true, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 150 },
  { id: "addon-meta-ads", naziv: "Upravljanje Meta Ads kampanjama", kategorija: "Dodatne usluge", cijena: 150, cijenaOd: true, naplata: "mjesečno", displaySuffixHr: " / mj. + oglasni budžet", displaySuffixEn: " / month + ad budget", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: 150 },

  // -- Nove usluge digitalnog cjenika (uvedene nakon 10.9.2026. — bez sidrene cijene). --
  // NEPAR ove usluge prodaje DRUGIM tvrtkama (implementacija digitalnog cjenika na
  // njihovu web-stranicu) — zasebna kategorija da se ne pomiješaju s NEPAR-ovim
  // vlastitim web/social ponudama u istoj tablici.
  { id: "cjenik-provjera", naziv: "Provjera digitalnog cjenika web-stranice", kategorija: "Usluge digitalnog cjenika", cijena: 0, cijenaOd: false, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: null, napomena: "Nova usluga uvedena nakon 10.09.2026.; sidrena cijena nije primjenjiva." },
  // REGULATORY TODO: sidrena za Publisher — utvrditi povijesnu cijenu / tumačenje za novouvedenu uslugu na 10.9.2026.
  { id: "cjenik-publisher", naziv: "NEPAR Publisher – godišnja pretplata", kategorija: "Usluge digitalnog cjenika", cijena: 39.9, cijenaOd: false, naplata: "godišnje", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: null, napomena: "Nova usluga uvedena nakon 10.09.2026.; sidrena cijena nije utvrđena (REGULATORY TODO). Self-service putem digitalnicjenik.nepar.hr." },
  { id: "cjenik-publisher-postavljanje", naziv: "Postavljanje NEPAR Publishera (prva godina)", kategorija: "Usluge digitalnog cjenika", cijena: 89.9, cijenaOd: false, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: null, napomena: "Nova usluga uvedena nakon 10.09.2026.; sidrena cijena nije primjenjiva." },
  { id: "cjenik-integracija-platforme", naziv: "Wix / React / Next / Vite / custom integracija", kategorija: "Usluge digitalnog cjenika", cijena: 149, cijenaOd: true, naplata: "jednokratno", posebnaProdaja: false, posebnaProdajaNaziv: null, sidrenaCijena: null, napomena: "Nova usluga uvedena nakon 10.09.2026.; sidrena cijena nije primjenjiva. Prilagođena integracija ERP/POS/webshop — individualna ponuda." },
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
