/**
 * Konfiguracija i imenska konvencija za NEPAR-ov digitalni cjenik (NN 101/2026-1213).
 * Odluka traži da naziv datoteke uključuje oblik prodajnog objekta, adresu, oznaku
 * objekta, broj pohrane i vremensku oznaku (datum + vrijeme) — ne propisuje točan format,
 * pa je raspored dijelova NEPAR-ova tehnička konvencija.
 *
 * `publishedAt` i `brojPohrane` se mijenjaju ISKLJUČIVO ručno, kad se cjenik stvarno
 * promijeni (nikad automatski po buildu) — vidi scripts/archive-cjenik-snapshot.js.
 * Prije svake izmjene pokreni `npm run cjenik:archive` da se trenutna verzija sačuva.
 */
import { BUSINESS } from "./siteIdentity.js";

export const cjenikMeta = {
  oblikProdajnogObjekta: "mrežna stranica",
  adresaProdajnogObjekta: `${BUSINESS.streetAddress}, ${BUSINESS.postalCode} ${BUSINESS.addressLocality}`,
  oznakaProdajnogObjekta: "WEB-NEPAR-01",
  brojPohrane: 6,
  merchantIdentifier: "99267101",
  publishedAt: "2026-11-16T23:07:15",
  // 2 = CSV/XML uz pet podataka iz Odluke nose i datum_referentne_cijene (datum na koji se odnosi sidrena
  // cijena) te NEPAR-ovo proširenje nepar_nova_stavka. Arhivske objave bez formatVersion renderiraju se
  // u izvornom obliku (vidi src/cjenikRender.js).
  formatVersion: 3,
};

function slug(value) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

/**
 * Gradi kanonski naziv datoteke po shemi:
 * <oblik>_<adresa>_<oznaka>_<brojPohrane>_<datum>_<vrijeme>.<ext>
 */
export function canonicalCjenikFilename(meta, ext) {
  const [date, time] = meta.publishedAt.split("T");
  if (meta.formatVersion >= 3) {
    if (!meta.merchantIdentifier) throw new Error("Nedostaje identifikator trgovca");
    return [meta.merchantIdentifier, slug(meta.oblikProdajnogObjekta), slug(meta.adresaProdajnogObjekta), slug(meta.oznakaProdajnogObjekta), "USLUGE", meta.brojPohrane, date.replaceAll("-", ""), "0"+time.replaceAll(":","").slice(0,4)].join("_") + `.${ext}`;
  }
  return [
    slug(meta.oblikProdajnogObjekta),
    slug(meta.adresaProdajnogObjekta),
    meta.oznakaProdajnogObjekta,
    String(meta.brojPohrane).padStart(2, "0"),
    date,
    time.replaceAll(":", "-"),
  ].join("_") + `.${ext}`;
}
