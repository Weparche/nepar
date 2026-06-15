// Same-origin reverse proxy for the embedded ZG Vrtić Radar app.
//
// The app's frontend lives statically at /zgvrticradar/ (public/zgvrticradar/),
// but its API + D1 database run on the standalone Cloudflare Pages deployment.
// This function forwards nepar.hr/zgvrticradar/api/*  ->  <UPSTREAM>/api/*
// server-side, so from the browser everything is same-origin (cookies/auth work,
// no CORS needed).
//
// NOTE: confirm UPSTREAM matches the live deployment URL of the app.
const UPSTREAM = 'https://zgvrticradar.pages.dev';

export async function onRequest({ request, params }) {
  const url = new URL(request.url);
  const sub = Array.isArray(params.path) ? params.path.join('/') : (params.path ?? '');
  const target = `${UPSTREAM}/api/${sub}${url.search}`;

  // Forward method, headers, body and cookies to the upstream API.
  const upstreamResponse = await fetch(new Request(target, request));

  const headers = new Headers(upstreamResponse.headers);

  // Re-bind any Set-Cookie to the current host by dropping the Domain attribute,
  // so session cookies issued by the upstream work on nepar.hr.
  const setCookies =
    typeof upstreamResponse.headers.getSetCookie === 'function'
      ? upstreamResponse.headers.getSetCookie()
      : [];
  if (setCookies.length > 0) {
    headers.delete('set-cookie');
    for (const cookie of setCookies) {
      headers.append('set-cookie', cookie.replace(/;\s*Domain=[^;]+/i, ''));
    }
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers,
  });
}
