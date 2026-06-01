/**
 * Legal animal sound fetcher for Njamko.
 * Primary: Pixabay API (audio endpoint).
 * Secondary: Freesound API (CC0 only).
 *
 * Usage: npm run fetch:njamko-sounds
 * Requires PIXABAY_API_KEY in .env or environment.
 * Optional: FREESOUND_API_KEY for fallback.
 */

import { mkdirSync, readFileSync, writeFileSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SOUNDS_DIR = join(ROOT, "public", "njamko", "assets", "sounds");
const LICENSES_JSON = join(SOUNDS_DIR, "licenses.json");
const LICENSES_MD = join(SOUNDS_DIR, "LICENSES.md");

const MAX_DURATION_SECONDS = 15;

const ANIMALS = [
  { id: "cow", filename: "cow.mp3", query: "cow moo" },
  { id: "dog", filename: "dog.mp3", query: "dog bark" },
  { id: "cat", filename: "cat.mp3", query: "cat meow" },
  { id: "horse", filename: "horse.mp3", query: "horse neigh" },
  { id: "duck", filename: "duck.mp3", query: "duck quack" },
  { id: "sheep", filename: "sheep.mp3", query: "sheep baa" },
  { id: "rooster", filename: "rooster.mp3", query: "rooster crow" },
  { id: "pig", filename: "pig.mp3", query: "pig oink" },
  { id: "frog", filename: "frog.mp3", query: "frog croak" },
  { id: "bee", filename: "bee.mp3", query: "bee buzz" },
];

function loadEnvFile() {
  const envPath = join(ROOT, ".env");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

function printMissingKeyHelp() {
  console.error(`
Missing PIXABAY_API_KEY.

Add to your .env file (project root):

PIXABAY_API_KEY=your_pixabay_key
FREESOUND_API_KEY=your_freesound_key

Get a Pixabay API key: https://pixabay.com/api/docs/
Get a Freesound API key (optional fallback): https://freesound.org/apiv2/apply/

Then run:
  npm run fetch:njamko-sounds
`);
}

async function fetchJson(url, label) {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  const contentType = response.headers.get("content-type") ?? "";
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`${label} HTTP ${response.status}: ${body.slice(0, 200)}`);
  }

  if (!contentType.includes("application/json")) {
    const body = await response.text();
    throw new Error(`${label} returned non-JSON response: ${body.slice(0, 120)}`);
  }

  return response.json();
}

function pickPixabayHit(hits) {
  if (!Array.isArray(hits) || hits.length === 0) return null;

  const sorted = [...hits].sort((a, b) => {
    const durationA = Number(a.duration ?? 999);
    const durationB = Number(b.duration ?? 999);
    return durationA - durationB;
  });

  return (
    sorted.find((hit) => {
      const duration = Number(hit.duration ?? 0);
      return duration > 0 && duration <= MAX_DURATION_SECONDS;
    }) ?? sorted[0]
  );
}

function getPixabayAudioUrl(hit) {
  return (
    hit.audio ??
    hit.audioURL ??
    hit.audio_url ??
    hit.downloadURL ??
    hit.url ??
    null
  );
}

async function searchPixabayAudio(apiKey, query) {
  const params = new URLSearchParams({
    key: apiKey,
    q: query,
    per_page: "10",
    order: "popular",
    safesearch: "true",
  });

  const endpoints = [
    `https://pixabay.com/api/audio/?${params}`,
    `https://pixabay.com/api/sounds/?${params}`,
  ];

  let lastError = null;

  for (const url of endpoints) {
    try {
      const data = await fetchJson(url, "Pixabay audio search");
      const hit = pickPixabayHit(data.hits);
      const audioUrl = hit ? getPixabayAudioUrl(hit) : null;

      if (!hit || !audioUrl) {
        lastError = new Error("No usable Pixabay audio hit");
        continue;
      }

      return {
        source: "Pixabay",
        title: hit.title ?? hit.tags ?? query,
        author: hit.user ?? "Unknown",
        license: "Pixabay Content License",
        sourceUrl: hit.pageURL ?? hit.pageUrl ?? "https://pixabay.com/sound-effects/",
        downloadUrl: audioUrl,
        duration: Number(hit.duration ?? 0),
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("Pixabay audio search failed");
}

function isCc0License(license) {
  if (!license || typeof license !== "string") return false;
  const normalized = license.trim().toLowerCase();
  return normalized === "creative commons 0" || normalized === "cc0";
}

async function searchFreesoundAudio(apiKey, query) {
  const params = new URLSearchParams({
    query,
    filter: 'license:"Creative Commons 0"',
    fields: "id,name,username,license,previews,url,duration",
    sort: "rating_desc",
    page_size: "10",
    token: apiKey,
  });

  const data = await fetchJson(
    `https://freesound.org/apiv2/search/?${params}`,
    "Freesound search",
  );

  const results = data.results ?? [];
  const hit =
    results.find((item) => {
      if (!isCc0License(item.license)) return false;
      const duration = Number(item.duration ?? 0);
      return duration > 0 && duration <= MAX_DURATION_SECONDS;
    }) ??
    results.find((item) => isCc0License(item.license));

  if (!hit) {
    throw new Error("No CC0 Freesound result");
  }

  if (!isCc0License(hit.license)) {
    throw new Error(`Skipped Freesound result with unclear license: ${hit.license}`);
  }

  const previewUrl =
    hit.previews?.["preview-hq-mp3"] ??
    hit.previews?.["preview-lq-mp3"] ??
    null;

  if (!previewUrl) {
    throw new Error("Freesound result has no MP3 preview");
  }

  return {
    source: "Freesound",
    title: hit.name ?? query,
    author: hit.username ?? "Unknown",
    license: "Creative Commons 0",
    sourceUrl: hit.url ?? `https://freesound.org/people/${hit.username}/sounds/${hit.id}/`,
    downloadUrl: previewUrl,
    duration: Number(hit.duration ?? 0),
  };
}

async function downloadFile(url, destination) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Download failed HTTP ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 512) {
    throw new Error("Downloaded file is too small to be valid audio");
  }

  writeFileSync(destination, buffer);
}

function loadExistingLicenses() {
  if (!existsSync(LICENSES_JSON)) return {};
  try {
    return JSON.parse(readFileSync(LICENSES_JSON, "utf8"));
  } catch {
    return {};
  }
}

function writeLicensesMarkdown(licenses) {
  const lines = ["# Njamko sound licenses", ""];

  for (const [filename, meta] of Object.entries(licenses)) {
    lines.push(`## ${filename}`);
    lines.push(`Source: ${meta.source}`);
    lines.push(`Title: ${meta.title}`);
    lines.push(`Author: ${meta.author}`);
    lines.push(`License: ${meta.license}`);
    lines.push(`Original URL: ${meta.sourceUrl}`);
    lines.push(`Downloaded: ${meta.downloadedAt}`);
    lines.push("");
  }

  if (Object.keys(licenses).length === 0) {
    lines.push("_No sounds downloaded yet. Run `npm run fetch:njamko-sounds`._");
    lines.push("");
  }

  writeFileSync(LICENSES_MD, lines.join("\n"), "utf8");
}

async function fetchAnimalSound(animal, pixabayKey, freesoundKey) {
  const destination = join(SOUNDS_DIR, animal.filename);
  let metadata = null;

  if (pixabayKey) {
    try {
      metadata = await searchPixabayAudio(pixabayKey, animal.query);
      console.log(`  Pixabay: found "${metadata.title}"`);
    } catch (error) {
      console.warn(`  Pixabay: ${error.message}`);
    }
  }

  if (!metadata && freesoundKey) {
    try {
      metadata = await searchFreesoundAudio(freesoundKey, animal.query);
      console.log(`  Freesound (CC0): found "${metadata.title}"`);
    } catch (error) {
      console.warn(`  Freesound: ${error.message}`);
    }
  }

  if (!metadata) {
    console.warn(`  Skipped ${animal.filename} — no legal source found.`);
    return null;
  }

  await downloadFile(metadata.downloadUrl, destination);

  return {
    [animal.filename]: {
      animal: animal.id,
      source: metadata.source,
      title: metadata.title,
      author: metadata.author,
      license: metadata.license,
      sourceUrl: metadata.sourceUrl,
      downloadedAt: todayIsoDate(),
      durationSeconds: metadata.duration || undefined,
    },
  };
}

async function main() {
  loadEnvFile();

  const pixabayKey = process.env.PIXABAY_API_KEY?.trim();
  const freesoundKey = process.env.FREESOUND_API_KEY?.trim();

  if (!pixabayKey) {
    printMissingKeyHelp();
    process.exit(1);
  }

  mkdirSync(SOUNDS_DIR, { recursive: true });

  const licenses = loadExistingLicenses();
  let downloaded = 0;
  let skipped = 0;

  console.log("Fetching Njamko animal sounds...");
  console.log(`Output: ${SOUNDS_DIR}`);
  if (!freesoundKey) {
    console.warn("FREESOUND_API_KEY not set — Freesound CC0 fallback disabled.");
  }

  for (const animal of ANIMALS) {
    console.log(`\n[${animal.id}] ${animal.query}`);
    try {
      const entry = await fetchAnimalSound(animal, pixabayKey, freesoundKey);
      if (entry) {
        Object.assign(licenses, entry);
        downloaded += 1;
      } else {
        skipped += 1;
      }
    } catch (error) {
      skipped += 1;
      console.warn(`  Failed ${animal.filename}: ${error.message}`);
    }
  }

  writeFileSync(LICENSES_JSON, `${JSON.stringify(licenses, null, 2)}\n`, "utf8");
  writeLicensesMarkdown(licenses);

  console.log(`\nDone. Downloaded: ${downloaded}, skipped: ${skipped}.`);
  console.log(`Licenses: ${LICENSES_JSON}`);
  console.log(`Credits:  ${LICENSES_MD}`);

  if (downloaded === 0) {
    console.warn(
      "\nNo sounds were downloaded. Check API keys and try FREESOUND_API_KEY as fallback.",
    );
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`Fatal error: ${error.message}`);
  process.exit(1);
});
