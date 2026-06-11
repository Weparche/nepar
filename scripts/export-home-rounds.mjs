/**
 * Export Pronađi dom rounds for external editing (e.g. ChatGPT).
 * Run: node scripts/export-home-rounds.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";
import homePedagogy from "../docs/pronadi-dom-kartice-pedagoski-sredeno-v2.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const outJson = join(__dirname, "../docs/pronadi-dom-kartice.json");
const outMd = join(__dirname, "../docs/pronadi-dom-kartice.md");

function assetExists(path) {
  return path ? existsSync(join(__dirname, "../public", path)) : false;
}

const rows = homePedagogy.runde.map((round) => ({
  razina: round.razina,
  razinaNaslov: round.razinaNaslov,
  runda: round.runda,
  zivotinja: round.zivotinja,
  emoji: round.emoji,
  slikaZivotinje: round.slikaZivotinje ?? null,
  slikaZivotinjePostoji: assetExists(round.slikaZivotinje),
  prompt: round.prompt,
  pitanje: round.pitanje,
  tocniOdgovor: round.tocniOdgovor,
  opcije: round.opcije.map((option) => ({
    naziv: option.naziv,
    emoji: option.emoji,
    slika: option.slika ?? null,
    slikaPostoji: assetExists(option.slika),
  })),
  mobilePozadina: round.mobilePozadina ?? null,
  mobilePozadinaPostoji: assetExists(round.mobilePozadina),
}));

const payload = {
  igra: "Pronađi dom",
  ukupnoRundi: rows.length,
  napomena:
    "Za mobile pozadine koristi habitat bez životinje (npr. staja, kućica, more). Kartice odgovora = domovi.",
  runde: rows,
};

writeFileSync(outJson, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const md = [
  "# Pronađi dom — sve kartice (50 rundi)",
  "",
  "Format: **Životinja** → točan dom + 2 distraktora.",
  "",
  ...rows.flatMap((row) => [
    `## Razina ${row.razina}, runda ${row.runda} — ${row.zivotinja} ${row.emoji}`,
    "",
    `- **Prompt:** ${row.prompt}`,
    `- **Pitanje:** ${row.pitanje}`,
    `- **Točan odgovor:** ${row.tocniOdgovor}`,
    `- **Mobile pozadina:** \`${row.mobilePozadina ?? "—"}\`${row.mobilePozadinaPostoji ? "" : " ⚠️ NEDOSTAJE"}`,
    `- **Slika životinje:** ${row.slikaZivotinje ?? "emoji only"}${row.slikaZivotinje && !row.slikaZivotinjePostoji ? " ⚠️ NEDOSTAJE" : ""}`,
    "",
    "| Odgovor | Emoji | Slika |",
    "| --- | --- | --- |",
    ...row.opcije.map(
      (option) =>
        `| ${option.naziv} | ${option.emoji} | ${option.slika ?? "—"}${option.slika && !option.slikaPostoji ? " ⚠️" : ""} |`,
    ),
    "",
  ]),
].join("\n");

writeFileSync(outMd, md, "utf8");
console.log(`Wrote ${outJson}`);
console.log(`Wrote ${outMd}`);
