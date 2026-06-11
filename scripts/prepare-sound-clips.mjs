import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import ffmpegPath from "ffmpeg-static";
import { parseFile } from "music-metadata";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");
const soundsDir = join(rootDir, "public", "assets", "sounds");
const outputDir = join(soundsDir, "short");
const clipDurationSeconds = 1.95;
const maxDurationSeconds = 2;
const durationToleranceSeconds = 0.05;

const clips = [
  ["krava", "cow.mp3"],
  ["pas", "dragon-studio-free-dog-bark-419014.mp3"],
  ["macka", "dragon-studio-cat-meow-401729.mp3"],
  ["konj", "dragon-studio-horse-neigh-390297.mp3"],
  ["patka", "iedurodrigues-duck-quack-112941.mp3"],
  ["ovca", "stu9-sheep-352668.mp3"],
  ["pijetao", "freesound_community-rooster-call-cock-a-doodle-doo-46096.mp3"],
  ["svinja", "pewnaosoba7-pig-125132.mp3"],
  ["zaba", "stu9-frog-1-352709.mp3"],
  ["pcela", "delon_boomkin-bee-landing-on-flower-374609.mp3"],
  ["kokos", "dragon-studio-chicken-sounds-487676.mp3"],
  ["koza", "dragon-studio-goat-baa-390303.mp3"],
  ["magarac", "stu9-donkey-352696.mp3"],
  ["guska", "freesound_community-081283_goose-86642.mp3"],
  ["purica", "freesound_community-albundyx-mexican-turkey-106743.mp3"],
  ["golub", "freesound_community-pigeon-82804.mp3"],
  ["mis", "freesounds123-mouse-animal-sound-367490.mp3"],
  ["zmija", "freesound_community-snake-hiss-95241.mp3"],
  ["cvrcak", "freesound_community-synth-cricket-93979.mp3"],
  ["komarac", "homemade_sfx-mosquito-splat-272434.mp3"],
  ["sova", "lazychillzone-owl-hooting-223549.mp3"],
  ["vuk", "dragon-studio-wolf-howl-2-359870.mp3"],
  ["medvjed", "universfield-bear-191995.mp3"],
  ["lisica", "l3hrja-fox-calling-243999.mp3"],
  ["jez", "freesound_community-hedgehog-smell-and-run-36189.mp3"],
  ["vrana", "dragon-studio-crow-calls-raspy-echoing-472377.mp3"],
  ["jelen", "dragon-studio-deer-grunt-472371.mp3"],
  ["dabar", "dragon-studio-wet-splash-sfx-443134.mp3"],
  ["vjeverica", "freesound_community-squirrel-89831.mp3"],
  ["sismis", "the-vampires-monster-bat-chirping-type-2-355965.mp3"],
  ["lav", "ribhavagrawal-lion-roaring-sfx-293295.mp3"],
  ["tigar", "dffdv-tiger-roar-loudly-193229.mp3"],
  ["slon", "freesound_community-elephant-trumpets-growls-6047.mp3"],
  ["majmun", "u_zpj3vbdres-monkey-128368.mp3"],
  ["papiga", "dragon-studio-macaw-call-382715.mp3"],
  ["krokodil", "dragon-studio-crocodile-hissing-372480.mp3"],
  ["deva", "rzalmanialmani-camel-male-sound-effect-370202.mp3"],
  ["hijena", "dragon-studio-hyena-laugh-1-515980.mp3"],
  ["gorila", "delon_boomkin-gorilla-426263.mp3"],
  ["nosorog", "sondangsirait419-badak-220048.mp3"],
  ["dupin", "dragon-studio-dolphin-clicking-487655.mp3"],
  ["kit", "dragon-studio-whale-song-382729.mp3"],
  ["pingvin", "sondangsirait419-pinguin-220042.mp3"],
  ["tuljan", "freesound_community-sound-of-a-seal-14648.mp3"],
  ["galeb", "soundreality-seagull-city-372653.mp3"],
  ["orao", "u_jfkxueyart-eagle-281163.mp3"],
  ["rakun", "freesound_community-180530-raccoons-scream-growl-bark-whine-falls-out-of-tree-2am-toronto-22865.mp3"],
  ["ris", "844316__thekingofgeeks360__wild-cats-siberian-lynx-huff.wav"],
  ["cagalj", "freesound_community-jackals-63938.mp3"],
];

function runFfmpeg(args) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(ffmpegPath, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolvePromise();
        return;
      }

      reject(new Error(`ffmpeg failed with code ${code}:\n${stderr}`));
    });
  });
}

async function main() {
  if (!ffmpegPath) {
    throw new Error("ffmpeg-static did not provide an ffmpeg binary path.");
  }

  await mkdir(outputDir, { recursive: true });

  for (const [slug, sourceName] of clips) {
    const input = join(soundsDir, sourceName);
    const output = join(outputDir, `${slug}.mp3`);

    if (!existsSync(input)) {
      throw new Error(`Missing source sound for ${slug}: ${input}`);
    }

    await runFfmpeg([
      "-y",
      "-i",
      input,
      "-t",
      String(clipDurationSeconds),
      "-af",
      "afade=t=out:st=1.8:d=0.15",
      "-ar",
      "44100",
      "-ac",
      "1",
      "-b:a",
      "96k",
      output,
    ]);

    const metadata = await parseFile(output);
    const duration = metadata.format.duration ?? 0;

    if (duration > maxDurationSeconds + durationToleranceSeconds) {
      throw new Error(`${output} is too long: ${duration.toFixed(3)}s`);
    }

    console.log(`${slug}.mp3 ${duration.toFixed(3)}s`);
  }

  console.log(`Generated ${clips.length} short sound clips in ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
