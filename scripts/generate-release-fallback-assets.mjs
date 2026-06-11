import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicRoot = join(__dirname, "../public");

const animals = {
  "bear.webp": "&#x1F43B;",
  "cat.webp": "&#x1F431;",
  "cow.webp": "&#x1F42E;",
  "dog.webp": "&#x1F436;",
  "horse.webp": "&#x1F434;",
  "monkey.webp": "&#x1F435;",
  "mouse.webp": "&#x1F42D;",
  "rabbit.webp": "&#x1F430;",
  "sheep.webp": "&#x1F411;",
  "squirrel.webp": "&#x1F43F;&#xFE0F;",
};

const foods = {
  "apple.webp": "&#x1F34E;",
  "banana.webp": "&#x1F34C;",
  "branches.webp": "&#x1F333;",
  "carrot.webp": "&#x1F955;",
  "eucalyptus.webp": "&#x1F334;",
  "fish.webp": "&#x1F41F;",
  "honey.webp": "&#x1F36F;",
};

function iconSvg(entity, palette) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <defs>
    <radialGradient id="bg" cx="35%" cy="25%" r="80%">
      <stop stop-color="${palette.light}"/>
      <stop offset="1" stop-color="${palette.dark}"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#3a2b21" flood-opacity=".18"/>
    </filter>
  </defs>
  <rect width="256" height="256" rx="64" fill="url(#bg)"/>
  <circle cx="204" cy="48" r="28" fill="#ffffff" opacity=".24"/>
  <circle cx="48" cy="212" r="36" fill="#ffffff" opacity=".18"/>
  <text
    x="128"
    y="151"
    text-anchor="middle"
    dominant-baseline="middle"
    font-size="122"
    font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif"
    filter="url(#shadow)"
  >${entity}</text>
</svg>`;
}

async function writeIconSet(folder, entries, palette) {
  const outDir = join(publicRoot, "assets", folder);
  mkdirSync(outDir, { recursive: true });

  await Promise.all(
    Object.entries(entries).map(([fileName, entity]) =>
      sharp(Buffer.from(iconSvg(entity, palette)))
        .resize(256, 256, { fit: "cover" })
        .webp({ quality: 92 })
        .toFile(join(outDir, fileName)),
    ),
  );
}

await writeIconSet("animals", animals, { light: "#fff0b8", dark: "#9bdc77" });
await writeIconSet("foods", foods, { light: "#fff1b6", dark: "#ffb55f" });

console.log("Generated release fallback assets.");
