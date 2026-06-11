/**
 * Export Mama i beba rounds for external editing (e.g. ChatGPT).
 * Run: node scripts/export-baby-rounds.mjs
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import babyPedagogy from "../docs/mama-i-beba-pedagoski-sredeno-v2.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const outJson = join(__dirname, "../docs/mama-i-beba-kartice.json");
const outMd = join(__dirname, "../docs/mama-i-beba-kartice.md");

const payload = {
  igra: babyPedagogy.igra,
  ukupnoRundi: babyPedagogy.ukupnoRundi,
  napomena: babyPedagogy.napomena,
  runde: babyPedagogy.runde,
};

writeFileSync(outJson, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

const md = [
  "# Mama i beba — sve kartice (50 rundi)",
  "",
  "Format: **Beba** → točna mama + 2 distraktora (druge mame).",
  "",
  "| Razina | Runda | Beba | Mama (točno) | Distraktor 1 | Distraktor 2 |",
  "| --- | --- | --- | --- | --- | --- |",
  ...babyPedagogy.runde.map(
    (round) =>
      `| ${round.razina} | ${round.runda} | ${round.beba} ${round.bebaEmoji ?? ""} | ${round.mama} ${round.mamaEmoji ?? ""} | ${round.distraktori[0]?.naziv ?? ""} ${round.distraktori[0]?.emoji ?? ""} | ${round.distraktori[1]?.naziv ?? ""} ${round.distraktori[1]?.emoji ?? ""} |`,
  ),
  "",
  ...babyPedagogy.runde.flatMap((round) => [
    `## Razina ${round.razina}, runda ${round.runda} — ${round.beba} ${round.bebaEmoji ?? ""}`,
    "",
    `- **Tema razine:** ${round.razinaTema}`,
    `- **Prompt:** ${round.prompt}`,
    `- **Pitanje:** ${round.pitanje}`,
    `- **Točna mama:** ${round.mama} ${round.mamaEmoji ?? ""}`,
    `- **Slika bebe:** ${round.bebaSlika ?? "emoji only"}${round.bebaSlika && !round.bebaSlikaPostoji ? " ⚠️ NEDOSTAJE" : ""}`,
    `- **Slika mame:** ${round.mamaSlika ?? "emoji only"}${round.mamaSlika && !round.mamaSlikaPostoji ? " ⚠️ NEDOSTAJE" : ""}`,
    `- **Mobile pozadina:** \`${round.mobilePozadina ?? "—"}\`${round.mobilePozadinaPostoji ? "" : round.mobilePozadina ? " ⚠️ NEDOSTAJE" : ""}`,
    "",
    "| Odgovor | Emoji | Slika |",
    "| --- | --- | --- |",
    `| ${round.mama} (točno) | ${round.mamaEmoji ?? ""} | ${round.mamaSlika ?? "—"}${round.mamaSlika && !round.mamaSlikaPostoji ? " ⚠️" : ""} |`,
    ...round.distraktori.map(
      (option) =>
        `| ${option.naziv} | ${option.emoji} | ${option.slika ?? "—"}${option.slika && !option.slikaPostoji ? " ⚠️" : ""} |`,
    ),
    "",
  ]),
].join("\n");

writeFileSync(outMd, md, "utf8");
console.log(`Wrote ${outJson}`);
console.log(`Wrote ${outMd}`);
