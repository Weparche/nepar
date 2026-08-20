import { mkdtemp, rm, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const publicDir = path.join(projectRoot, "public");
const workDir = await mkdtemp(path.join(tmpdir(), "nepar-signal-horizon-"));
const duration = 8;
const fps = 24;

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const process = spawn("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], {
      cwd: projectRoot,
      stdio: "inherit",
    });
    process.on("error", reject);
    process.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`ffmpeg exited with code ${code}`));
    });
  });
}

function signalFilter({ width, height, still = false, mobile = false }) {
  const phase = still ? "0" : `(6.283185307179586*T/${duration})`;
  const gateStart = mobile ? 0.16 : 0.34;
  const gate = `pow(clip((X/W-${gateStart})/${1 - gateStart},0,1),1.35)`;
  const envelope = mobile
    ? `exp(-pow((X/W-0.78)/0.66,2))*exp(-pow((Y/H-0.62)/0.72,2))`
    : `exp(-pow((X/W-0.78)/0.56,2))*exp(-pow((Y/H-0.52)/0.78,2))`;
  const fieldGate = `(${gate})*(${envelope})`;
  const bend = mobile ? 2.25 : 4.1;
  const bendTwo = mobile ? 2.0 : 3.7;
  const centerOne = `0.40-0.075*cos(${phase})+0.070*sin(${bend}*(X/W-0.48)+0.20*sin(${phase}))`;
  const centerTwo = `0.67+0.075*cos(${phase})+0.060*sin(${bendTwo}*(X/W-0.48)+1.05-0.16*sin(${phase}))`;
  const distanceOne = `(Y/H-(${centerOne}))`;
  const distanceTwo = `(Y/H-(${centerTwo}))`;
  const outerOne = `(${fieldGate})*exp(-pow(${distanceOne},2)/0.025)`;
  const coreOne = `(${fieldGate})*exp(-pow(${distanceOne},2)/0.0055)`;
  const outerTwo = `(${fieldGate})*exp(-pow(${distanceTwo},2)/0.026)`;
  const coreTwo = `(${fieldGate})*exp(-pow(${distanceTwo},2)/0.006)`;
  const shadowOne = `(${fieldGate})*exp(-pow((${distanceOne})-0.072,2)/0.010)`;
  const shadowTwo = `(${fieldGate})*exp(-pow((${distanceTwo})+0.072,2)/0.011)`;
  const pulse = still ? "0" : `pow((1-cos(${phase}))/2,6)`;
  const meeting = `(${pulse})*(${gate})*exp(-(pow((X/W-0.73)/0.28,2)+pow((Y/H-0.535)/0.25,2)))`;
  const atmosphere = `(${gate})*exp(-(pow((X/W-0.84)/0.58,2)+pow((Y/H-0.50)/0.78,2)))`;

  const red = `clip(248-10*(${atmosphere})-34*(${outerOne})-32*(${coreOne})-26*(${outerTwo})-20*(${coreTwo})-15*(${shadowOne})-13*(${shadowTwo})+34*(${meeting}),0,255)`;
  const green = `clip(251-4*(${atmosphere})-12*(${outerOne})-14*(${coreOne})-40*(${outerTwo})-30*(${coreTwo})-13*(${shadowOne})-17*(${shadowTwo})+31*(${meeting}),0,255)`;
  const blue = `clip(254-1*(${atmosphere})-2*(${outerOne})-1*(${outerTwo})-4*(${shadowOne})-3*(${shadowTwo})+9*(${meeting}),0,255)`;

  return [
    `format=gbrp`,
    `geq=r='${red}':g='${green}':b='${blue}'`,
    `gradfun=strength=0.55:radius=16`,
    `format=yuv444p10le`,
    `scale=${width}:${height}:flags=lanczos`,
    `setsar=1`,
  ].join(",");
}

async function encodeWithinBudget({ input, output, codecArgs, crfValues, maxBytes }) {
  for (const crf of crfValues) {
    await runFfmpeg(["-i", input, ...codecArgs(crf), output]);
    const { size } = await stat(output);
    if (size <= maxBytes) return { crf, size };
  }
  const { size } = await stat(output);
  return { crf: crfValues.at(-1), size };
}

try {
  const master = path.join(workDir, "signal-horizon-master.mkv");
  const desktopPoster = path.join(publicDir, "nepar-background-desktop-2400x900.webp");
  const mobilePoster = path.join(publicDir, "nepar-background-mobile-900x1600.webp");
  const webm = path.join(publicDir, "hero.webm");
  const mp4 = path.join(publicDir, "hero.mp4");

  await runFfmpeg([
    "-f",
    "lavfi",
    "-i",
    `nullsrc=s=480x270:r=${fps}:d=${duration}`,
    "-vf",
    signalFilter({ width: 1920, height: 1080 }),
    "-c:v",
    "ffv1",
    "-level",
    "3",
    "-pix_fmt",
    "yuv444p10le",
    master,
  ]);

  const webmResult = await encodeWithinBudget({
    input: master,
    output: webm,
    maxBytes: 1_800_000,
    crfValues: [34, 36, 38, 40],
    codecArgs: (crf) => [
      "-an",
      "-c:v",
      "libvpx-vp9",
      "-b:v",
      "0",
      "-crf",
      String(crf),
      "-deadline",
      "good",
      "-cpu-used",
      "2",
      "-row-mt",
      "1",
      "-pix_fmt",
      "yuv420p",
    ],
  });

  const mp4Result = await encodeWithinBudget({
    input: master,
    output: mp4,
    maxBytes: 3_000_000,
    crfValues: [24, 26, 28, 30],
    codecArgs: (crf) => [
      "-an",
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      String(crf),
      "-profile:v",
      "high",
      "-level",
      "4.1",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
    ],
  });

  await runFfmpeg([
    "-ss",
    "0",
    "-i",
    master,
    "-frames:v",
    "1",
    "-vf",
    "scale=2400:1350:flags=lanczos,crop=2400:900:0:225",
    "-c:v",
    "libwebp",
    "-quality",
    "82",
    "-compression_level",
    "6",
    desktopPoster,
  ]);

  await runFfmpeg([
    "-f",
    "lavfi",
    "-i",
    "nullsrc=s=225x400:r=1:d=1",
    "-frames:v",
    "1",
    "-vf",
    signalFilter({ width: 900, height: 1600, still: true, mobile: true }),
    "-c:v",
    "libwebp",
    "-quality",
    "78",
    "-compression_level",
    "6",
    mobilePoster,
  ]);

  const desktopPosterSize = (await stat(desktopPoster)).size;
  const mobilePosterSize = (await stat(mobilePoster)).size;
  console.log(
    JSON.stringify(
      {
        webm: { ...webmResult, path: webm },
        mp4: { ...mp4Result, path: mp4 },
        desktopPoster: { size: desktopPosterSize, path: desktopPoster },
        mobilePoster: { size: mobilePosterSize, path: mobilePoster },
      },
      null,
      2,
    ),
  );
} finally {
  await rm(workDir, { recursive: true, force: true });
}
