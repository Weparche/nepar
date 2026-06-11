/**
 * Resolves public asset paths for the current Vite base URL.
 * Works on Cloudflare Pages (/) and subpath deploys (/njamko/).
 */
export function assetPath(path) {
  if (!path || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const base = import.meta.env.BASE_URL || "/";
  const normalized = path.startsWith("/") ? path.slice(1) : path;
  return `${base}${normalized}`;
}
