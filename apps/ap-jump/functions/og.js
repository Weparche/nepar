export async function onRequestGet({ request, env }) {
  const sourceUrl = new URL('/ap-jump-og-v4.png.b64', request.url);

  let source;
  if (env?.ASSETS?.fetch) {
    source = await env.ASSETS.fetch(sourceUrl);
  } else {
    source = await fetch(sourceUrl.toString(), {
      cf: {
        cacheEverything: true,
        cacheTtl: 604800,
      },
    });
  }

  if (!source.ok) {
    return new Response('OG image unavailable', { status: 404 });
  }

  const base64 = (await source.text()).trim();
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Response(bytes, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=604800, s-maxage=604800',
      'Content-Length': String(bytes.byteLength),
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
