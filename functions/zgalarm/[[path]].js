// SPA deep-link fallback for the embedded ZG Alarm app.
//
// Static files live at /zgalarm/ and React Router owns paths like
// /zgalarm/karta. On hard refresh, serve the app shell for extensionless
// client routes while allowing real asset files to pass through.
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;
  const lastSegment = path.split('/').pop() || '';
  const looksLikeFile = lastSegment.includes('.');

  if (looksLikeFile || path === '/zgalarm' || path === '/zgalarm/') {
    return context.next();
  }

  const rootUrl = new URL(url.origin);
  rootUrl.pathname = '/zgalarm/';
  return context.next(new Request(rootUrl.toString(), context.request));
}
