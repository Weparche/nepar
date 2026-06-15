// SPA deep-link fallback for the embedded ZG Vrtić Radar app.
//
// The app's static files live at /zgvrticradar/ (public/zgvrticradar/) and its
// client-side router (React Router, basename /zgvrticradar) owns paths like
// /zgvrticradar/karta. On a hard refresh of such a deep link there is no matching
// static file. We can't rely on context.next() returning 404, because the root
// _redirects rule (/* -> /index.html 200) swallows the miss and returns the Nepar
// root shell. So we detect client-side routes (paths with no file extension) and
// serve the app's own shell for them, while letting real files (.js/.css/.png/…)
// fall through to the static asset pipeline.
//
// We rewrite to the directory form "/zgvrticradar/" (not "/zgvrticradar/index.html")
// to avoid Cloudflare's index.html -> "/" canonicalization 301, which would loop.
//
// Pages routes /zgvrticradar/api/* to the more specific api/[[path]].js, so the
// live API proxy is unaffected by this catch-all.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;
  const lastSegment = path.split('/').pop() || '';
  const looksLikeFile = lastSegment.includes('.');

  // Real files, and the app root itself → serve directly.
  if (looksLikeFile || path === '/zgvrticradar' || path === '/zgvrticradar/') {
    return context.next();
  }

  // Deep-link client route → serve the app shell via its canonical directory URL.
  const rootUrl = new URL(url.origin);
  rootUrl.pathname = '/zgvrticradar/';
  return context.next(new Request(rootUrl.toString(), context.request));
}
