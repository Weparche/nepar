const SOURCE = 'https://raw.githubusercontent.com/Weparche/nepar/9dfc65fec9428e1ef858d1ec4109bf7235882c8c/apps/ap-jump/share-preview-v3.b64';
const IMAGE_LENGTH = 10641;

function imageHeaders() {
  return {
    'Content-Type': 'image/jpeg',
    'Content-Length': String(IMAGE_LENGTH),
    'Cache-Control': 'public, max-age=604800, s-maxage=604800, immutable',
    'X-Content-Type-Options': 'nosniff',
    'Access-Control-Allow-Origin': '*'
  };
}

export async function onRequest({ request }) {
  try {
    if (request.method === 'HEAD') {
      return new Response(null, { status: 200, headers: imageHeaders() });
    }

    if (request.method !== 'GET') {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }

    const upstream = await fetch(SOURCE, {
      headers: { 'User-Agent': 'AP-Jump-OG/1.0' },
      cf: { cacheEverything: true, cacheTtl: 604800 }
    });

    if (!upstream.ok) {
      return new Response(`OG source unavailable (${upstream.status})`, { status: 502 });
    }

    const base64 = (await upstream.text()).replace(/\s+/g, '');
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);

    if (bytes.byteLength !== IMAGE_LENGTH || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
      return new Response('Invalid OG image payload', { status: 502 });
    }

    return new Response(bytes, { status: 200, headers: imageHeaders() });
  } catch (error) {
    return new Response(`OG image error: ${error?.message || 'unknown'}`, { status: 502 });
  }
}
