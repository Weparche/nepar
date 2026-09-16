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
import { canonicalCjenikFilename } from "./cjenikMeta.js";

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

export const naplataLabelsHr = {
  jednokratno: "Jednokratno",
  godišnje: "Godišnje",
  mjesečno: "Mjesečno",
  "po satu": "Po satu",
};

/** Dijeli usluge po `kategorija` polju, čuvajući redoslijed prvog pojavljivanja — koristi ga i React stranica i statični snapshot, da se logika grupiranja ne duplicira. */
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

function renderCjenikSection(usluge, kategorija) {
  const rows = usluge.map((usluga) => `      <tr>
        <td>${escapeXml(usluga.naziv)}${usluga.cijenaOd ? ' <sup aria-describedby="cjenik-od-note">*</sup>' : ""}</td>
        <td>${naplataLabelsHr[usluga.naplata] || escapeXml(usluga.naplata)}</td>
        <td>${formatEur(usluga.cijena, "hr")}</td>
        <td>${usluga.posebnaProdajaNaziv ? escapeXml(usluga.posebnaProdajaNaziv) : "—"}</td>
        <td>${usluga.sidrenaCijena == null ? "— (nova usluga)" : formatEur(usluga.sidrenaCijena, "hr")}</td>
      </tr>`).join("\n");

  const dlItems = usluge.map((usluga) => `        <div class="grid grid-cols-2 gap-x-4 gap-y-2 p-5 text-sm">
          <dt class="col-span-2 font-semibold text-slate-950">${escapeXml(usluga.naziv)}${usluga.cijenaOd ? ' <sup aria-describedby="cjenik-od-note">*</sup>' : ""}</dt>
          <dt class="text-slate-500">Naplata</dt>
          <dd class="text-right text-slate-700">${naplataLabelsHr[usluga.naplata] || escapeXml(usluga.naplata)}</dd>
          <dt class="text-slate-500">Maloprodajna cijena</dt>
          <dd class="text-right tabular-nums text-slate-950">${formatEur(usluga.cijena, "hr")}</dd>
          <dt class="text-slate-500">Posebni oblik prodaje</dt>
          <dd class="text-right text-slate-700">${usluga.posebnaProdajaNaziv ? escapeXml(usluga.posebnaProdajaNaziv) : "—"}</dd>
          <dt class="text-slate-500">Sidrena cijena</dt>
          <dd class="text-right tabular-nums text-slate-700">${usluga.sidrenaCijena == null ? "— (nova usluga)" : formatEur(usluga.sidrenaCijena, "hr")}</dd>
        </div>`).join("\n");

  return `<div class="hidden overflow-x-auto rounded-2xl border border-slate-200 bg-white sm:block" tabindex="0" role="region" aria-label="Tablica cjenika, pomičite vodoravno za više stupaca: ${escapeXml(kategorija)}">
        <table class="min-w-[820px] w-full text-left text-sm">
        <caption class="sr-only">NEPAR — digitalni cjenik usluga: ${escapeXml(kategorija)}</caption>
        <thead>
          <tr><th>Usluga</th><th>Naplata</th><th>Maloprodajna cijena</th><th>Posebni oblik prodaje</th><th>Sidrena cijena</th></tr>
        </thead>
        <tbody>
${rows}
        </tbody>
      </table>
      </div>
      <dl class="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white sm:hidden">
${dlItems}
      </dl>`;
}

export function renderCjenikHtmlBody(usluge, meta) {
  const groups = groupByCategory(usluge);
  const coreGroups = groups.filter((group) => group.kategorija !== "Usluge digitalnog cjenika");
  const cjenikGroup = groups.find((group) => group.kategorija === "Usluge digitalnog cjenika");

  const coreSections = coreGroups.map((group) => `      <h2>${escapeXml(group.kategorija)}</h2>
      ${renderCjenikSection(group.usluge, group.kategorija)}`).join("\n");

  const cjenikSection = cjenikGroup ? `      <h2>${escapeXml(cjenikGroup.kategorija)}</h2>
      <p class="max-w-prose">Ovo su usluge koje NEPAR nudi drugim tvrtkama za implementaciju digitalnog cjenika na njihovoj web-stranici — nisu dio NEPAR-ove web ili social ponude iznad.</p>
      ${renderCjenikSection(cjenikGroup.usluge, cjenikGroup.kategorija)}` : "";

  return `<main class="site-main" data-nepar-static-content>
    <article class="section-shell" lang="hr">
      <h1>NEPAR — digitalni cjenik usluga</h1>
      <p class="max-w-prose">Prema Odluci NN 101/2026-1213, ovo je strojno čitljiv cjenik svih NEPAR usluga. Objavljeno: ${formatCjenikDate(meta.publishedAt, "hr")}. Prodajni objekt: ${escapeXml(meta.oblikProdajnogObjekta)}, ${escapeXml(meta.adresaProdajnogObjekta)} (oznaka ${escapeXml(meta.oznakaProdajnogObjekta)}).</p>
${coreSections}
${cjenikSection}
      <p id="cjenik-od-note" class="max-w-prose">* Cijena je početna ("od") — konačna cijena ovisi o opsegu ili platformi. Odluka ne definira posebnu semantiku za početnu cijenu; ovo je NEPAR-ovo tehničko pojašnjenje, vidljivo i u strojnom zapisu kao dodatno polje <code>nepar_cijena_od</code>.</p>
      <p class="max-w-prose">Usluge bez sidrene cijene uvedene su nakon 10.9.2026. i za njih Odluka NN 101/2026-1212 ne definira sidrenu cijenu.</p>
      <p class="max-w-prose">
        Kanonska datoteka (naziv sukladan Odluci):
        <a href="/cjenici/${canonicalCjenikFilename(meta, "csv")}">${canonicalCjenikFilename(meta, "csv")}</a>
        · <a href="/cjenici/${canonicalCjenikFilename(meta, "xml")}">${canonicalCjenikFilename(meta, "xml")}</a>
      </p>
      <p><a href="/cjenik.csv">Preuzmite /cjenik.csv</a> · <a href="/cjenik.xml">Preuzmite /cjenik.xml</a> · <a href="/cjenik/arhiva">Arhiva prethodnih verzija</a></p>
    </article>
  </main>`;
}

/** `snapshots` = arhivirani `{ meta, usluge }` zapisi zadržani unutar 30 dana. */
export function renderCjenikArhivaHtmlBody(currentMeta, snapshots) {
  const row = (meta, label) => `      <li>
        <strong>${escapeXml(label)}</strong> — objavljeno ${formatCjenikDate(meta.publishedAt, "hr")}${meta.supersededAt ? `, zamijenjeno ${formatCjenikDate(meta.supersededAt, "hr")}` : ""}
        · <a href="/cjenici/${canonicalCjenikFilename(meta, "csv")}">CSV</a>
        · <a href="/cjenici/${canonicalCjenikFilename(meta, "xml")}">XML</a>
      </li>`;

  const archiveItems = snapshots.length
    ? snapshots.map((snapshot) => row(snapshot.meta, formatCjenikDate(snapshot.meta.publishedAt, "hr"))).join("\n")
    : "      <li>Nema starijih verzija — ovo je prva objavljena verzija cjenika.</li>";

  return `<main class="site-main" data-nepar-static-content>
    <article class="section-shell" lang="hr">
      <h1>Arhiva digitalnog cjenika</h1>
      <p class="max-w-prose">Prethodne objavljene verzije NEPAR cjenika ostaju dostupne 30 dana od promjene, sukladno Odluci NN 101/2026-1213.</p>
      <h2>Trenutna verzija</h2>
      <ul>
${row(currentMeta, "Trenutna verzija")}
      </ul>
      <h2>Prethodne verzije</h2>
      <ul>
${archiveItems}
      </ul>
      <p><a href="/cjenik">Natrag na trenutni cjenik</a></p>
    </article>
  </main>`;
}
