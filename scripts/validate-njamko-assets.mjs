/**
 * Lists missing public asset files referenced in njamkoLevels.js.
 * Run: node scripts/validate-njamko-assets.mjs
 */
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { njamkoModes } from "../src/data/njamkoLevels.js";

const publicRoot = join(dirname(fileURLToPath(import.meta.url)), "../public");

function isMissing(path) {
  if (!path || path.startsWith("http")) return false;
  return !existsSync(join(publicRoot, path));
}

const missing = new Set();

for (const mode of Object.values(njamkoModes)) {
  for (const level of mode.levels) {
    for (const round of level.rounds) {
      for (const path of [round.mainImage, round.mobileBackgroundImage]) {
        if (isMissing(path)) missing.add(path);
      }
      for (const option of round.options ?? []) {
        if (typeof option === "object" && isMissing(option.image)) missing.add(option.image);
      }
    }
  }
}

const list = [...missing].sort();
console.log(`Missing assets: ${list.length}`);
for (const path of list) console.log(`  ${path}`);
process.exitCode = list.length ? 1 : 0;
