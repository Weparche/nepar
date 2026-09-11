import imageBase64 from '../ap-jump-og-final.txt';

function jpegBytes() {
  const clean = imageBase64.replace(/\s+/g, '');
  const binary = atob(clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function headers(length) {
  return {
    'Content-Type': 'image/jpeg',
    'Content-Length': String(length),
    'Cache-Control': 'public, max-age=604800, s-maxage=604800, immutable',
    'X-Content-Type-Options': 'nosniff',
    'Access-Control-Allow-Origin': '*'
  };
}

export function onRequestGet() {
  const bytes = jpegBytes();
  if (bytes.length < 1000 || bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[bytes.length - 2] !== 0xff || bytes[bytes.length - 1] !== 0xd9) {
    return new Response('Invalid JPEG payload', { status: 500 });
  }
  return new Response(bytes, { status: 200, headers: headers(bytes.length) });
}

export function onRequestHead() {
  const bytes = jpegBytes();
  return new Response(null, { status: 200, headers: headers(bytes.length) });
}
