/**
 * Čisti generatori za NEPAR-ov digitalni cjenik. Bez ovisnosti o React-u, jer se
 * koriste i iz vite.config.js (build-time) i iz scripts/verify-dist.js (provjera).
 *
 * Službenih 5 polja iz Odluke NN 101/2026-1213 (naziv_usluge, maloprodajna_cijena,
 * posebni_oblik_prodaje, naziv_posebnog_oblika_prodaje, sidrena_cijena) uvijek dolaze
 * prva i nepromijenjena. `nepar_cijena_od`/`nepar_napomena` su NEPAR-ova dodatna,
 * jasno prefiksirana polja — Odluka ne definira semantiku "cijena od" pa se ta
 * informacija ne smije tiho izgubiti pretvaranjem u fiksan broj.
 */
function money(value) {
  return value.toFixed(2);
}

function csvField(value) {
  const text = value == null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function neparNapomena(usluga) {
  const parts = [];
  if (usluga.cijenaOd) parts.push('Cijena je početna ("od") — konačna cijena ovisi o opsegu ili platformi.');
  if (usluga.napomena) parts.push(usluga.napomena);
  return parts.join(" ");
}

export function renderCjenikCsv(usluge) {
  const header = "naziv_usluge,maloprodajna_cijena,posebni_oblik_prodaje,naziv_posebnog_oblika_prodaje,sidrena_cijena,nepar_cijena_od,nepar_napomena";
  const rows = usluge.map((usluga) => [
    csvField(usluga.naziv),
    money(usluga.cijena),
    usluga.posebnaProdaja ? "true" : "false",
    csvField(usluga.posebnaProdajaNaziv ?? ""),
    usluga.sidrenaCijena == null ? "" : money(usluga.sidrenaCijena),
    usluga.cijenaOd ? "true" : "false",
    csvField(neparNapomena(usluga)),
  ].join(","));
  return `${[header, ...rows].join("\n")}\n`;
}

export function renderCjenikXml(usluge, meta) {
  const items = usluge.map((usluga) => `  <usluga>
    <naziv_usluge>${escapeXml(usluga.naziv)}</naziv_usluge>
    <maloprodajna_cijena valuta="EUR">${money(usluga.cijena)}</maloprodajna_cijena>
    <posebni_oblik_prodaje>${usluga.posebnaProdaja ? "true" : "false"}</posebni_oblik_prodaje>
    ${usluga.posebnaProdajaNaziv ? `<naziv_posebnog_oblika_prodaje>${escapeXml(usluga.posebnaProdajaNaziv)}</naziv_posebnog_oblika_prodaje>` : "<naziv_posebnog_oblika_prodaje />"}
    ${usluga.sidrenaCijena == null ? "<sidrena_cijena />" : `<sidrena_cijena valuta="EUR">${money(usluga.sidrenaCijena)}</sidrena_cijena>`}
    <nepar_cijena_od>${usluga.cijenaOd ? "true" : "false"}</nepar_cijena_od>
    ${neparNapomena(usluga) ? `<nepar_napomena>${escapeXml(neparNapomena(usluga))}</nepar_napomena>` : "<nepar_napomena />"}
  </usluga>`).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<digitalni-cjenik
  vrsta="usluge"
  oblik-prodajnog-objekta="${escapeXml(meta.oblikProdajnogObjekta)}"
  adresa-prodajnog-objekta="${escapeXml(meta.adresaProdajnogObjekta)}"
  oznaka-prodajnog-objekta="${escapeXml(meta.oznakaProdajnogObjekta)}"
  broj-pohrane="${meta.brojPohrane}"
  objavljeno="${meta.publishedAt}"
  napomena="NN 101/2026-1213 ne propisuje službenu XML shemu ni semantiku &quot;cijena od&quot;. Polja nepar_cijena_od i nepar_napomena su NEPAR-ovo tehničko pojašnjenje dok ne postoji službena uputa."
>
${items}
</digitalni-cjenik>
`;
}

function formatEur(value, lang) {
  const amount = new Intl.NumberFormat(lang === "hr" ? "hr-HR" : "en-US", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);
  return lang === "hr" ? `${amount} €` : `€${amount}`;
}

/** Prikazna cijena za marketinški sadržaj (npr. additionalServices u webOfferContent.js). */
export function formatCjenikDisplayPrice(usluga, lang = "hr") {
  const prefix = usluga.cijenaOd ? (lang === "hr" ? "od " : "from ") : "";
  const suffix = lang === "hr" ? usluga.displaySuffixHr || "" : usluga.displaySuffixEn || "";
  return `${prefix}${formatEur(usluga.cijena, lang)}${suffix}`;
}

/**
 * Ljudski čitljiv datum/vrijeme za publishedAt/supersededAt (nikad sirovi ISO string).
 * `timeZone` je fiksiran na Europe/Zagreb jer je riječ o vremenu pravne objave, ne
 * lokalnom vremenu posjetitelja — bez toga bi build (Node/CI, obično UTC) i preglednik
 * posjetitelja mogli prikazati različito vrijeme za isti trenutak.
 */
export function formatCjenikDate(value, lang = "hr") {
  return new Intl.DateTimeFormat(lang === "hr" ? "hr-HR" : "en-GB", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Zagreb",
  }).format(new Date(value));
}

/** Dijeli usluge po `kategorija` polju, čuvajući redoslijed prvog pojavljivanja — koristi je i CjenikPage.jsx za grupiranje tablice, jedina definicija u kodu. */
export function groupByCategory(usluge) {
  const groups = [];
  for (const usluga of usluge) {
    let group = groups.find((candidate) => candidate.kategorija === usluga.kategorija);
    if (!group) {
      group = { kategorija: usluga.kategorija, usluge: [] };
      groups.push(group);
    }
    group.usluge.push(usluga);
  }
  return groups;
}
