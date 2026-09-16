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
  brojPohrane: 1,
  publishedAt: "2026-09-15T22:45:00",
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
  return [
    slug(meta.oblikProdajnogObjekta),
    slug(meta.adresaProdajnogObjekta),
    meta.oznakaProdajnogObjekta,
    String(meta.brojPohrane).padStart(2, "0"),
    date,
    time.replaceAll(":", "-"),
  ].join("_") + `.${ext}`;
}
