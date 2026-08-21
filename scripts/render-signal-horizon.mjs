import { copyFile, mkdtemp, rm, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const publicDir = path.join(projectRoot, "public");
const brandDir = path.join(publicDir, "brand");
const workDir = await mkdtemp(path.join(tmpdir(), "nepar-hero-"));

const FRAME_COUNT = 192;
const FRAME_RATE = 24;
const DURATION_SECONDS = 8;
const DURATION_TOLERANCE = 0.01;

const variants = [
  {
    key: "desktop",
    input: path.join(brandDir, "hero-desktop.mp4"),
    output: path.join(brandDir, "hero-desktop.webm"),
    poster: path.join(publicDir, "nepar-background-desktop-2400x900.webp"),
    width: 1920,
    height: 1080,
    maxVideoBytes: 500 * 1024,
    maxPosterBytes: 60 * 1024,
    posterWidth: 2400,
    posterHeight: 900,
    posterFilter: "scale=2400:1350:flags=lanczos,crop=2400:900:0:225",
    posterQuality: 78,
  },
  {
    key: "mobile",
    input: path.join(brandDir, "hero-mobile.mp4"),
    output: path.join(brandDir, "hero-mobile.webm"),
    poster: path.join(publicDir, "nepar-background-mobile-900x1600.webp"),
    width: 1080,
    height: 1920,
    maxVideoBytes: 700 * 1024,
    maxPosterBytes: 35 * 1024,
    posterWidth: 900,
    posterHeight: 1600,
    posterFilter: "scale=900:1600:flags=lanczos",
    posterQuality: 76,
  },
];

function run(command, args, { capture = false } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit",
    });
    let stdout = "";
    let stderr = "";
    if (capture) {
      child.stdout.on("data", (chunk) => { stdout += chunk; });
      child.stderr.on("data", (chunk) => { stderr += chunk; });
    }
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve(stdout);
      else reject(new Error(`${command} exited with code ${code}${stderr ? `\n${stderr}` : ""}`));
    });
  });
}

function runFfmpeg(args) {
  return run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args]);
}

async function probe(filePath) {
  const output = await run(
    "ffprobe",
    ["-v", "error", "-count_frames", "-show_streams", "-show_format", "-of", "json", filePath],
    { capture: true },
  );
  return JSON.parse(output);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function assertDimensions(stream, width, height, label) {
  assert(
    stream.width === width && stream.height === height,
    `${label}: expected ${width}x${height}, received ${stream.width}x${stream.height}`,
  );
}

async function validateInput(variant) {
  const metadata = await probe(variant.input);
  const video = metadata.streams.find(({ codec_type: type }) => type === "video");
  assert(video, `${variant.key}: source video stream is missing`);
  assertDimensions(video, variant.width, variant.height, `${variant.key} source`);
  const inputFrames = Number(video.nb_read_frames);
  assert(
    inputFrames === FRAME_COUNT || inputFrames === FRAME_COUNT + 1,
    `${variant.key}: expected ${FRAME_COUNT} frames plus an optional inclusive loop endpoint, received ${video.nb_read_frames}`,
  );
  if (inputFrames === FRAME_COUNT + 1) {
    console.warn(`${variant.key}: source contains an inclusive frame at 8.000 s; encoding frames 0-${FRAME_COUNT - 1} for a seamless 8.000 s loop`);
  }
}

async function validateVideo(variant, filePath) {
  const metadata = await probe(filePath);
  const videos = metadata.streams.filter(({ codec_type: type }) => type === "video");
  const audioCount = metadata.streams.filter(({ codec_type: type }) => type === "audio").length;
  assert(videos.length === 1, `${variant.key}: expected one video stream, received ${videos.length}`);
  assert(audioCount === 0, `${variant.key}: expected zero audio streams, received ${audioCount}`);

  const [video] = videos;
  assert(video.codec_name === "vp9", `${variant.key}: expected VP9, received ${video.codec_name}`);
  assert(video.pix_fmt === "yuv420p", `${variant.key}: expected yuv420p, received ${video.pix_fmt}`);
  assertDimensions(video, variant.width, variant.height, variant.key);
  assert(
    video.avg_frame_rate === `${FRAME_RATE}/1`,
    `${variant.key}: expected 24/1 fps, received ${video.avg_frame_rate}`,
  );
  assert(
    Number(video.nb_read_frames) === FRAME_COUNT,
    `${variant.key}: expected ${FRAME_COUNT} output frames, received ${video.nb_read_frames}`,
  );

  const colorFields = [
    ["color_space", video.color_space],
    ["color_transfer", video.color_transfer],
    ["color_primaries", video.color_primaries],
  ];
  for (const [field, value] of colorFields) {
    if (!value || value === "unknown") {
      console.warn(`${variant.key}: ffprobe did not expose ${field}; continuing after frame/container validation`);
    } else {
      assert(value === "bt709", `${variant.key}: expected ${field}=bt709, received ${value}`);
    }
  }

  const duration = Number(metadata.format.duration);
  assert(Number.isFinite(duration), `${variant.key}: format.duration is unavailable`);
  assert(
    Math.abs(duration - DURATION_SECONDS) <= DURATION_TOLERANCE,
    `${variant.key}: expected 8.000 s, received ${metadata.format.duration}`,
  );
  const size = (await stat(filePath)).size;
  assert(size <= variant.maxVideoBytes, `${variant.key}: ${size} B exceeds ${variant.maxVideoBytes} B budget`);
  return { size, duration, frames: Number(video.nb_read_frames) };
}

async function validatePoster(variant, filePath) {
  const metadata = await probe(filePath);
  const video = metadata.streams.find(({ codec_type: type }) => type === "video");
  assert(
    video?.codec_name === "webp",
    `${variant.key} poster: expected WebP, received ${video?.codec_name ?? "no stream"}`,
  );
  assertDimensions(video, variant.posterWidth, variant.posterHeight, `${variant.key} poster`);
  const size = (await stat(filePath)).size;
  assert(
    size <= variant.maxPosterBytes,
    `${variant.key} poster: ${size} B exceeds ${variant.maxPosterBytes} B budget`,
  );
  return { size };
}

async function renderVariant(variant) {
  await validateInput(variant);
  const videoOutput = path.join(workDir, `hero-${variant.key}.webm`);
  const posterOutput = path.join(workDir, `hero-${variant.key}.webp`);

  await runFfmpeg([
    "-i",
    variant.input,
    "-map",
    "0:v:0",
    "-vf",
    `select='lt(n,${FRAME_COUNT})',setpts=N/(${FRAME_RATE}*TB),scale=${variant.width}:${variant.height}:flags=lanczos,setsar=1,format=yuv420p`,
    "-an",
    "-c:v",
    "libvpx-vp9",
    "-b:v",
    "0",
    "-crf",
    "28",
    "-deadline",
    "good",
    "-cpu-used",
    "2",
    "-row-mt",
    "1",
    "-r",
    String(FRAME_RATE),
    "-fps_mode",
    "cfr",
    "-frames:v",
    String(FRAME_COUNT),
    "-color_primaries",
    "bt709",
    "-color_trc",
    "bt709",
    "-colorspace",
    "bt709",
    videoOutput,
  ]);

  await runFfmpeg([
    "-i",
    videoOutput,
    "-frames:v",
    "1",
    "-vf",
    variant.posterFilter,
    "-c:v",
    "libwebp",
    "-quality",
    String(variant.posterQuality),
    "-compression_level",
    "6",
    posterOutput,
  ]);

  const video = await validateVideo(variant, videoOutput);
  const poster = await validatePoster(variant, posterOutput);
  await copyFile(videoOutput, variant.output);
  await copyFile(posterOutput, variant.poster);
  return { key: variant.key, video, poster };
}

try {
  const results = [];
  for (const variant of variants) results.push(await renderVariant(variant));
  console.log(JSON.stringify(results, null, 2));
} finally {
  await rm(workDir, { recursive: true, force: true });
}
