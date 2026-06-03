import { existsSync, lstatSync } from "node:fs";
import { resolve } from "node:path";

const distDir = resolve(process.cwd(), "dist");
const mozgalicaDir = resolve(distDir, "mozgalica");

if (existsSync(mozgalicaDir) && lstatSync(mozgalicaDir).isDirectory()) {
  console.error(
    "dist/mozgalica/ is a directory. Remove it before deploy — it causes /mozgalica redirect loops on Cloudflare/nginx.",
  );
  process.exit(1);
}
