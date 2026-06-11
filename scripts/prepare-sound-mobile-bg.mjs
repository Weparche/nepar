import sharp from "sharp";

const src = process.argv[2];
const out = process.argv[3];

if (!src || !out) {
  console.error("Usage: node scripts/prepare-sound-mobile-bg.mjs <input.png> <output.webp>");
  process.exit(1);
}

const fitted = await sharp(src).resize(900, 1600, { fit: "inside" }).toBuffer({ resolveWithObject: true });
const { data, info } = fitted;

const targetHeight = 1600;
const extra = targetHeight - info.height;
const topPad = Math.round(extra * 0.42);
const bottomPad = extra - topPad;

const skyStrip = await sharp(data)
  .extract({ left: 0, top: 0, width: info.width, height: Math.min(24, info.height) })
  .resize(info.width, topPad)
  .toBuffer();

const grassStrip = await sharp(data)
  .extract({
    left: 0,
    top: Math.max(0, info.height - 24),
    width: info.width,
    height: Math.min(24, info.height),
  })
  .resize(info.width, bottomPad)
  .toBuffer();

await sharp({
  create: {
    width: 900,
    height: targetHeight,
    channels: 3,
    background: { r: 166, g: 214, b: 255 },
  },
})
  .composite([
    { input: skyStrip, top: 0, left: 0 },
    { input: data, top: topPad, left: 0 },
    { input: grassStrip, top: topPad + info.height, left: 0 },
  ])
  .webp({ quality: 82 })
  .toFile(out);

const meta = await sharp(out).metadata();
console.log(`Wrote ${out} (${meta.width}x${meta.height}), scene ${info.width}x${info.height}, pads top=${topPad} bottom=${bottomPad}`);
