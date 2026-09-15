/**
 * Pokreni PRIJE izmjene src/cjenikData.js kad se cijena stvarno mijenja.
 * Snima trenutno (uskoro zamijenjeno) stanje cjenika u cjenik-archive/, s
 * `supersededAt` = sada, tako da ostane dostupno 30 dana sukladno Odluci.
 *
 * Nakon pokretanja: uredi src/cjenikData.js (nove cijene) i bumaj
 * cjenikMeta.publishedAt / cjenikMeta.brojPohrane u src/cjenikMeta.js.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { cjenikMeta } from "../src/cjenikMeta.js";
import { nepaUsluge } from "../src/cjenikData.js";

function pad(value) {
  return String(value).padStart(2, "0");
}

function localTimestamp(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

const supersededAt = localTimestamp(new Date());
const archiveDir = resolve(process.cwd(), "cjenik-archive");
mkdirSync(archiveDir, { recursive: true });

const filename = `${supersededAt.replaceAll(":", "-")}.json`;
const filePath = resolve(archiveDir, filename);

if (existsSync(filePath)) {
  console.error(`cjenik-archive/${filename} već postoji — pričekaj barem sekundu i pokreni ponovno.`);
  process.exit(1);
}

const snapshot = {
  meta: { ...cjenikMeta, supersededAt },
  usluge: nepaUsluge,
};

writeFileSync(filePath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");

console.log(`Snimljeno: cjenik-archive/${filename}`);
console.log("Sljedeći korak: uredi src/cjenikData.js (nove cijene) i src/cjenikMeta.js (publishedAt + brojPohrane), pa pokreni npm run build i odmah deploy.");
