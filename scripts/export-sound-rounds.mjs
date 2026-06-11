/**
 * Export Pogodi zvuk rounds for external editing (e.g. ChatGPT).
 * Run: node scripts/export-sound-rounds.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import soundPedagogy from "../docs/pogodi-zvuk-pedagoski-sredeno-v2.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const outJson = join(__dirname, "../docs/pogodi-zvuk-kartice.json");
const outMd = join(__dirname, "../docs/pogodi-zvuk-kartice.md");

const payload = {
  igra: soundPedagogy.igra,
  ukupnoRundi: soundPedagogy.ukupnoRundi,
  napomena: soundPedagogy.napomena,
  runde: soundPedagogy.runde,
};

writeFileSync(outJson, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const md = [
  "# Pogodi zvuk — sve runde (50)",
  "",
  "| Razina | Runda | Zvuk | Točno | Distraktor 1 | Distraktor 2 |",
  "| --- | --- | --- | --- | --- | --- |",
  ...soundPedagogy.runde.map(
    (round) =>
      `| ${round.razina} | ${round.runda} | ${round.zvukTekst} | ${round.zivotinja} ${round.emoji ?? ""} | ${round.distraktori[0]?.naziv ?? ""} ${round.distraktori[0]?.emoji ?? ""} | ${round.distraktori[1]?.naziv ?? ""} ${round.distraktori[1]?.emoji ?? ""} |`,
  ),
  "",
].join("\n");

writeFileSync(outMd, md, "utf8");
console.log(`Wrote ${outJson}`);
console.log(`Wrote ${outMd}`);
