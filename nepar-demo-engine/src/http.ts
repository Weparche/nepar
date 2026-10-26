import { timingSafeEqual } from 'node:crypto';
import type { ApiErrorBody } from './models';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

export function json(value: unknown, status = 200): Response {
  return Response.json(value, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export function errorResponse(error: unknown, requestId: string): Response {
  const known = error instanceof ApiError;
  const status = known ? error.status : 500;
  const body: ApiErrorBody = {
    ok: false,
    error: {
      code: known ? error.code : 'INTERNAL_ERROR',
      message: known ? error.message : 'Dogodila se neočekivana pogreška.',
      requestId,
      ...(known && error.details !== undefined ? { details: error.details } : {}),
    },
  };
  if (!known) {
    console.error(JSON.stringify({ event: 'unhandled_error', requestId, error: error instanceof Error ? error.message : String(error) }));
  }
  return json(body, status);
}

export async function readJsonBody(request: Request, maxBytes: number): Promise<unknown> {
  const contentType = request.headers.get('content-type')?.split(';')[0].trim();
  if (contentType !== 'application/json') {
    throw new ApiError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Content-Type mora biti application/json.');
  }

  const declaredLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new ApiError(413, 'PAYLOAD_TOO_LARGE', `Payload smije imati najviše ${maxBytes} bajtova.`);
  }

  const reader = request.body?.getReader();
  if (!reader) throw new ApiError(400, 'INVALID_JSON', 'JSON tijelo je obavezno.');

  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > maxBytes) {
      await reader.cancel('payload-too-large');
      throw new ApiError(413, 'PAYLOAD_TOO_LARGE', `Payload smije imati najviše ${maxBytes} bajtova.`);
    }
    chunks.push(value);
  }

  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new ApiError(400, 'INVALID_JSON', 'Tijelo nije valjan JSON.');
  }
}

export async function readBodyBytes(request: Request, maxBytes: number): Promise<Uint8Array> {
  const declaredLength = Number(request.headers.get('content-length') ?? '0');
  if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    throw new ApiError(413, 'PAYLOAD_TOO_LARGE', `Payload smije imati najviše ${maxBytes} bajtova.`);
  }
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError(400, 'PAYLOAD_EMPTY', 'Tijelo zahtjeva je prazno.');
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > maxBytes) {
      await reader.cancel('payload-too-large');
      throw new ApiError(413, 'PAYLOAD_TOO_LARGE', `Payload smije imati najviše ${maxBytes} bajtova.`);
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

export async function isAuthorized(request: Request, expectedToken: string): Promise<boolean> {
  const authorization = request.headers.get('authorization') ?? '';
  const provided = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  const encoder = new TextEncoder();
  const [providedHash, expectedHash] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(provided)),
    crypto.subtle.digest('SHA-256', encoder.encode(expectedToken || 'missing-admin-token')),
  ]);
  return Boolean(expectedToken && provided && timingSafeEqual(new Uint8Array(providedHash), new Uint8Array(expectedHash)));
}

export function parsePositiveInt(value: string | undefined, fallback: number, maximum: number): number {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) && parsed > 0 && parsed <= maximum ? parsed : fallback;
}
