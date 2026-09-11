export async function onRequestGet() {
  const upstream = await fetch('https://raw.githubusercontent.com/Weparche/nepar/main/apps/ap-jump/ap-jump-share.jpg', {
    cf: { cacheEverything: true, cacheTtl: 604800 }
  });

  if (!upstream.ok || !upstream.body) {
    return new Response('Share image unavailable', { status: 502 });
  }

  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=604800, s-maxage=604800',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}
