const SOURCE = 'https://raw.githubusercontent.com/Weparche/nepar/39aefce306003f2939066616b9fe098cb0267451/apps/ap-jump/ap-jump-share.jpg';

function headers(length) {
  return {
    'Content-Type': 'image/jpeg',
    'Content-Length': String(length),
    'Cache-Control': 'public, max-age=604800, s-maxage=604800, immutable',
    'X-Content-Type-Options': 'nosniff',
    'Access-Control-Allow-Origin': '*'
  };
}

export async function onRequest({ request }) {
  try {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }

    const upstream = await fetch(SOURCE, {
      headers: { 'User-Agent': 'AP-Jump-Link-Preview/1.0' },
      cf: { cacheEverything: true, cacheTtl: 604800 }
    });

    if (!upstream.ok) {
      return new Response(`Image source unavailable (${upstream.status})`, { status: 502 });
    }

    const buffer = await upstream.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    if (bytes.byteLength < 10000 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
      return new Response('Invalid JPEG payload', { status: 502 });
    }

    if (request.method === 'HEAD') {
      return new Response(null, { status: 200, headers: headers(bytes.byteLength) });
    }

    return new Response(buffer, { status: 200, headers: headers(bytes.byteLength) });
  } catch (error) {
    return new Response(`Image proxy error: ${error?.message || 'unknown'}`, { status: 502 });
  }
}
