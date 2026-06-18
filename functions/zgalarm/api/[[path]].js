// Same-origin reverse proxy for the embedded ZG Alarm app.
//
// The app's frontend lives statically at /zgalarm/ (public/zgalarm/), while
// its API and D1 database run on the standalone Cloudflare Pages deployment.
// This keeps browser calls same-origin on nepar.hr/zgalarm/api/* without
// duplicating the ZG Alarm database binding in the Nepar project.
const UPSTREAM = 'https://zg-spreman.pages.dev';

export async function onRequest({ request, params }) {
  const url = new URL(request.url);
  const sub = Array.isArray(params.path) ? params.path.join('/') : (params.path ?? '');
  const target = `${UPSTREAM}/api/${sub}${url.search}`;

  const upstreamResponse = await fetch(new Request(target, request));
  const headers = new Headers(upstreamResponse.headers);
  headers.delete('content-encoding');
  headers.delete('content-length');
  headers.delete('transfer-encoding');

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers,
  });
}
