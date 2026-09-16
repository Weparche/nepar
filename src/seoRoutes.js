/**
 * Čista funkcija, nula ovisnosti o Viteu — koriste je i vite.config.js (build plugin)
 * i scripts/prerender.mjs (postbuild korak), pa prerender ne mora importirati
 * vite.config.js izravno i povlačiti Vite pluginove/side-effecte sa sobom.
 */
import { resolve } from "node:path";

export function routeOutputPath(outDir, routePath) {
  if (routePath === "/") return resolve(outDir, "index.html");
  if (routePath === "/404") return resolve(outDir, "404.html");
  return resolve(outDir, `${routePath.slice(1)}.html`);
}
