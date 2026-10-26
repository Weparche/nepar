import { ApiError } from './http';
import type { RuntimeEnv } from './models';

interface CloudflareEnvelope<T> {
  success: boolean;
  result: T;
  errors?: Array<{ code?: number; message?: string }>;
}

export interface WorkerDomain {
  id: string;
  hostname: string;
  service: string;
  zone_id: string;
  zone_name: string;
}

interface DnsRecord {
  id: string;
  name: string;
  type: string;
  content: string;
}

export type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

function credentials(env: RuntimeEnv): { accountId: string; token: string } | null {
  if (!env.CF_ACCOUNT_ID || !env.WORKERS_DOMAINS_API_TOKEN) return null;
  return { accountId: env.CF_ACCOUNT_ID, token: env.WORKERS_DOMAINS_API_TOKEN };
}

async function cloudflareRequest<T>(env: RuntimeEnv, url: string, init: RequestInit | undefined, fetcher: Fetcher): Promise<T> {
  const auth = credentials(env);
  if (!auth) throw new ApiError(503, 'CLOUDFLARE_NOT_CONFIGURED', 'Cloudflare domena nije konfigurirana.');
  const response = await fetcher(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${auth.token}`,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });
  const payload = await response.json<CloudflareEnvelope<T>>();
  if (!response.ok || !payload.success) {
    const detail = payload.errors?.map((item) => item.message).filter(Boolean).join('; ');
    throw new ApiError(502, 'CLOUDFLARE_API_ERROR', detail || `Cloudflare API je vratio ${response.status}.`);
  }
  return payload.result;
}

export async function listWorkerDomains(env: RuntimeEnv, fetcher: Fetcher = fetch): Promise<WorkerDomain[]> {
  const auth = credentials(env);
  if (!auth) return [];
  return cloudflareRequest<WorkerDomain[]>(
    env,
    `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(auth.accountId)}/workers/domains?per_page=100`,
    undefined,
    fetcher,
  );
}

async function resolveZoneId(env: RuntimeEnv, fetcher: Fetcher): Promise<string> {
  if (env.CF_ZONE_ID) return env.CF_ZONE_ID;
  const auth = credentials(env);
  if (!auth) throw new ApiError(503, 'CLOUDFLARE_NOT_CONFIGURED', 'Cloudflare domena nije konfigurirana.');
  const zones = await cloudflareRequest<Array<{ id: string; name: string }>>(
    env,
    `https://api.cloudflare.com/client/v4/zones?name=${encodeURIComponent(env.ZONE_NAME)}&account.id=${encodeURIComponent(auth.accountId)}`,
    undefined,
    fetcher,
  );
  const zone = zones.find((item) => item.name.toLowerCase() === env.ZONE_NAME.toLowerCase());
  if (!zone) throw new ApiError(502, 'ZONE_NOT_FOUND', 'Cloudflare zona nije pronađena.');
  return zone.id;
}

export async function assertHostnameAvailable(env: RuntimeEnv, hostname: string, fetcher: Fetcher = fetch): Promise<void> {
  const normalized = hostname.toLowerCase();
  const domains = await listWorkerDomains(env, fetcher);
  const workerConflict = domains.find((domain) => domain.hostname.toLowerCase() === normalized);
  if (workerConflict) {
    throw new ApiError(
      409,
      workerConflict.service === env.WORKER_SERVICE ? 'DOMAIN_ALREADY_ATTACHED' : 'DOMAIN_CONFLICT',
      workerConflict.service === env.WORKER_SERVICE
        ? 'Hostname je već u vlasništvu ovog enginea.'
        : 'Hostname već koristi drugi Cloudflare Worker.',
    );
  }

  const zoneId = await resolveZoneId(env, fetcher);
  const records = await cloudflareRequest<DnsRecord[]>(
    env,
    `https://api.cloudflare.com/client/v4/zones/${encodeURIComponent(zoneId)}/dns_records?name=${encodeURIComponent(hostname)}&per_page=100`,
    undefined,
    fetcher,
  );
  if (records.length > 0) {
    throw new ApiError(409, 'DNS_CONFLICT', 'Hostname već postoji u Cloudflare DNS-u i neće biti preuzet.');
  }
}

export async function attachCustomDomain(env: RuntimeEnv, hostname: string, fetcher: Fetcher = fetch): Promise<string> {
  const auth = credentials(env);
  if (!auth) throw new ApiError(503, 'CLOUDFLARE_NOT_CONFIGURED', 'Cloudflare domena nije konfigurirana.');
  await assertHostnameAvailable(env, hostname, fetcher);
  const domain = await cloudflareRequest<WorkerDomain>(
    env,
    `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(auth.accountId)}/workers/domains`,
    {
      method: 'PUT',
      body: JSON.stringify({ hostname, service: env.WORKER_SERVICE, zone_name: env.ZONE_NAME }),
    },
    fetcher,
  );
  if (!domain.id) throw new ApiError(502, 'DOMAIN_ATTACH_INVALID_RESPONSE', 'Cloudflare nije vratio ID domene.');
  return domain.id;
}

export async function detachCustomDomain(env: RuntimeEnv, domainId: string, fetcher: Fetcher = fetch): Promise<void> {
  const auth = credentials(env);
  if (!auth) throw new ApiError(503, 'CLOUDFLARE_NOT_CONFIGURED', 'Cloudflare domena nije konfigurirana.');

  const domain = await cloudflareRequest<WorkerDomain>(
    env,
    `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(auth.accountId)}/workers/domains/${encodeURIComponent(domainId)}`,
    undefined,
    fetcher,
  );
  if (domain.service !== env.WORKER_SERVICE || domain.zone_name !== env.ZONE_NAME) {
    throw new ApiError(409, 'DOMAIN_NOT_OWNED', 'Zaštita je odbila uklanjanje domene koja nije vlasništvo enginea.');
  }

  await cloudflareRequest<Record<string, never>>(
    env,
    `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(auth.accountId)}/workers/domains/${encodeURIComponent(domainId)}`,
    { method: 'DELETE' },
    fetcher,
  );
}
