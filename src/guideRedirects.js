/** Marketing pages only. Actual /cjenik resources and Publisher examples are independent. */
export const GUIDE_REDIRECTS = {
  "/digitalni-cjenik": "https://digitalnicjenik.nepar.hr/",
  "/digitalni-cjenik/xml-csv": "https://digitalnicjenik.nepar.hr/specifikacija-csv-xml/",
  "/digitalni-cjenik/sidrena-cijena": "https://digitalnicjenik.nepar.hr/vodici/sidrena-cijena/",
  "/sidrene-cijene": "https://digitalnicjenik.nepar.hr/vodici/sidrena-cijena/",
  "/digitalni-cjenik/automatizacija": "https://digitalnicjenik.nepar.hr/vodici/automatizacija-digitalnog-cjenika/",
};

export function getGuideRedirect(path) {
  return GUIDE_REDIRECTS[path.replace(/\/+$/, "")] || null;
}
