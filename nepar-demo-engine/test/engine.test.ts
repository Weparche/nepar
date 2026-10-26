import { env, exports } from 'cloudflare:workers';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { attachCustomDomain, detachCustomDomain, type Fetcher } from '../src/cloudflare-domains';
import { buildDemoPayload, chooseDesignSystem } from '../src/generation';
import { isExpired, normalizeSlug, resolveSlug } from '../src/index';
import { DESIGN_SYSTEM_KEYS, type DemoRow, type RuntimeEnv } from '../src/models';
import { demoContentSchema, researchedLeadSchema, safeColor, safeHref, safeImageUrl } from '../src/schema';
import { renderDemo } from '../src/templates';

const workerEnv = env as RuntimeEnv;
const adminHeaders = {
  Authorization: 'Bearer test-admin-token-123',
  'Content-Type': 'application/json',
};

const researchedLead = researchedLeadSchema.parse({
  businessName: 'Fabela Demo',
  slug: 'fabela',
  websiteUrl: 'https://example.com/fabela',
  publicEmail: 'kontakt@example.com',
  publicPhone: '+385 1 555 0100',
  city: 'Zagreb',
  industry: 'lokalni uslužni obrt',
  source: 'synthetic-test',
  score: 72,
  scoreReasons: ['Potpuni testni kontakt.'],
  services: [{ title: 'Dogovor termina', description: 'Izravan kontakt za provjeru dostupnosti.', sourceField: 'fixture.services' }],
  facts: { 'fixture.location': 'Zagreb' },
  sources: [
    { field: 'fixture.services', url: 'https://example.com/services', verifiedAt: '2026-08-22T08:00:00.000Z' },
    { field: 'fixture.location', url: 'https://example.com/location', verifiedAt: '2026-08-22T08:00:00.000Z' },
  ],
  visualAssets: [],
  verifiedObservations: ['Sintetički QA zapis.'],
  proposedServiceAngle: 'Mobilno jasan kontakt.',
});

async function payload(attachDomain = false): Promise<Record<string, unknown>> {
  return { ...(await buildDemoPayload(researchedLead)), attachDomain };
}

async function create(body: unknown, extraHeaders: Record<string, string> = {}): Promise<Response> {
  return exports.default.fetch(new Request('http://localhost/__admin/demos', {
    method: 'POST', headers: { ...adminHeaders, ...extraHeaders }, body: JSON.stringify(body),
  }));
}

beforeEach(async () => {
  await env.DB.batch([
    env.DB.prepare('DELETE FROM workflow_events'),
    env.DB.prepare('DELETE FROM demo_events'),
    env.DB.prepare('DELETE FROM demos'),
    env.DB.prepare('DELETE FROM leads'),
  ]);
  vi.unstubAllGlobals();
});

describe('hostname and expiry rules', () => {
  it('resolves exact tenant hosts and local preview slugs', () => {
    expect(resolveSlug(new URL('https://fabela.nepar.hr/'), 'nepar.hr')).toBe('fabela');
    expect(resolveSlug(new URL('http://localhost/?demo=fabela'), 'nepar.hr')).toBe('fabela');
    expect(resolveSlug(new URL('https://deep.fabela.nepar.hr/'), 'nepar.hr')).toBeNull();
  });

  it('rejects reserved and malformed slugs', () => {
    expect(resolveSlug(new URL('https://www.nepar.hr/'), 'nepar.hr')).toBeNull();
    expect(normalizeSlug('-unsafe')).toBe('');
    expect(normalizeSlug('Fabela')).toBe('fabela');
  });

  it('handles valid, future and expired timestamps deterministically', () => {
    expect(isExpired('2026-08-21T00:00:00.000Z', Date.parse('2026-08-22T00:00:00.000Z'))).toBe(true);
    expect(isExpired('2026-08-23T00:00:00.000Z', Date.parse('2026-08-22T00:00:00.000Z'))).toBe(false);
    expect(isExpired(null)).toBe(false);
  });
});

describe('safe rendering inputs', () => {
  it('allows only safe URL and color protocols', () => {
    expect(safeHref('javascript:alert(1)')).toBe('#kontakt');
    expect(safeHref('https://example.com/path')).toBe('https://example.com/path');
    expect(safeImageUrl('http://example.com/image.jpg')).toBe('');
    expect(safeColor('red')).toBe('#2563eb');
  });

  it('rejects proof and service claims without provenance', async () => {
    const demo = await buildDemoPayload(researchedLead);
    const invalid = structuredClone(demo.content);
    invalid.services[0].sourceField = 'missing.source';
    expect(demoContentSchema.safeParse(invalid).success).toBe(false);
  });

  it('selects and renders all six vertical design systems distinctly', async () => {
    const industries = ['auto servis', 'veterinarska klinika', 'beauty salon', 'mali hotel', 'električar', 'računovodstveni ured'];
    expect(industries.map(chooseDesignSystem)).toEqual(DESIGN_SYSTEM_KEYS);
    const content = (await buildDemoPayload(researchedLead)).content;
    const base: DemoRow = {
      id: 1, slug: 'fabela', business_name: 'Fabela Demo', template_key: 'trade-local',
      content_json: JSON.stringify(content), source_url: null, lead_email: null, status: 'active',
      custom_domain_id: null, created_at: '2026-08-22', updated_at: '2026-08-22', expires_at: null,
      lead_id: null, design_system_key: 'trade-local', generation_version: 'test', qa_status: 'pending',
      qa_report_json: null, desktop_screenshot_key: null, mobile_screenshot_key: null,
      approved_at: null, sent_at: null, first_viewed_at: null, last_viewed_at: null,
      view_count: 0, idempotency_key: null, idempotency_hash: null, outreach_json: null,
    };
    const outputs = DESIGN_SYSTEM_KEYS.map((key) => renderDemo({ ...base, design_system_key: key, template_key: key }, content));
    DESIGN_SYSTEM_KEYS.forEach((key, index) => expect(outputs[index]).toContain(`data-design-system="${key}"`));
    expect(new Set(outputs).size).toBe(6);
  });
});

describe('admin API integration', () => {
  it('rejects unauthenticated admin requests with a stable code', async () => {
    const response = await exports.default.fetch(new Request('http://localhost/__admin/demos'));
    expect(response.status).toBe(401);
    expect((await response.json() as { error: { code: string } }).error.code).toBe('UNAUTHORIZED');
  });

  it('rejects reserved slugs and malformed payloads', async () => {
    const reserved = await payload();
    reserved.slug = 'www';
    const reservedResponse = await create(reserved);
    expect(reservedResponse.status).toBe(400);
    expect((await reservedResponse.json() as { error: { code: string } }).error.code).toBe('SLUG_RESERVED');

    const invalidResponse = await create({ slug: 'bad' });
    expect(invalidResponse.status).toBe(422);
    expect((await invalidResponse.json() as { error: { code: string } }).error.code).toBe('VALIDATION_FAILED');
  });

  it('replays idempotent creates without duplicating rows', async () => {
    const body = await payload();
    const first = await create(body, { 'Idempotency-Key': 'fabela-test-create-0001' });
    const second = await create(body, { 'Idempotency-Key': 'fabela-test-create-0001' });
    expect(first.status).toBe(201);
    expect(second.status).toBe(200);
    expect((await second.json() as { replayed: boolean }).replayed).toBe(true);
    const count = await env.DB.prepare('SELECT COUNT(*) AS total FROM demos').first<{ total: number }>();
    expect(count?.total).toBe(1);
  });

  it('rejects reuse of an idempotency key for a different payload', async () => {
    const body = await payload();
    expect((await create(body, { 'Idempotency-Key': 'fabela-test-create-0002' })).status).toBe(201);
    body.businessName = 'Drugi demo';
    const conflict = await create(body, { 'Idempotency-Key': 'fabela-test-create-0002' });
    expect(conflict.status).toBe(409);
    expect((await conflict.json() as { error: { code: string } }).error.code).toBe('IDEMPOTENCY_KEY_REUSED');
  });

  it('marks stored expired demos unavailable', async () => {
    const body = await payload();
    const content = body.content;
    await env.DB.prepare(
      `INSERT INTO demos (slug,business_name,template_key,content_json,status,created_at,updated_at,expires_at,design_system_key,generation_version,qa_status)
       VALUES ('fabela','Fabela Demo','trade-local',?,'active',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP,'2020-01-01T00:00:00.000Z','trade-local','test','pending')`,
    ).bind(JSON.stringify(content)).run();
    const response = await exports.default.fetch(new Request('http://localhost/?demo=fabela'));
    expect(response.status).toBe(404);
    expect(response.headers.get('x-robots-tag')).toContain('noindex');
  });

  it('rolls D1 back if Custom Domain attach fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json({ success: false, result: null, errors: [{ message: 'denied' }] }, { status: 403 })));
    const response = await create(await payload(true), { 'Idempotency-Key': 'fabela-attach-failure' });
    expect(response.status).toBe(502);
    const demo = await env.DB.prepare(`SELECT id FROM demos WHERE slug = 'fabela'`).first();
    expect(demo).toBeNull();
  });
});

describe('Cloudflare Custom Domain client', () => {
  it('checks conflicts and attaches an available hostname', async () => {
    const responses = [
      Response.json({ success: true, result: [] }),
      Response.json({ success: true, result: [] }),
      Response.json({ success: true, result: { id: 'domain-1', hostname: 'fabela.nepar.hr', service: 'nepar-demo-engine', zone_id: 'zone-test', zone_name: 'nepar.hr' } }),
    ];
    const fetcher = vi.fn(async () => responses.shift() ?? Response.json({ success: false }, { status: 500 })) as Fetcher;
    await expect(attachCustomDomain(workerEnv, 'fabela.nepar.hr', fetcher)).resolves.toBe('domain-1');
    expect(fetcher).toHaveBeenCalledTimes(3);
  });

  it('fails safely on DNS conflicts', async () => {
    const responses = [
      Response.json({ success: true, result: [] }),
      Response.json({ success: true, result: [{ id: 'dns-1', name: 'fabela.nepar.hr', type: 'A', content: '192.0.2.1' }] }),
    ];
    const fetcher = vi.fn(async () => responses.shift() ?? Response.json({ success: false }, { status: 500 })) as Fetcher;
    await expect(attachCustomDomain(workerEnv, 'fabela.nepar.hr', fetcher)).rejects.toMatchObject({ code: 'DNS_CONFLICT' });
  });

  it('detaches only domains owned by this engine', async () => {
    const owned = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => init?.method === 'DELETE'
      ? Response.json({ success: true, result: {} })
      : Response.json({ success: true, result: { id: 'domain-1', hostname: 'fabela.nepar.hr', service: 'nepar-demo-engine', zone_name: 'nepar.hr', zone_id: 'zone-test' } })) as Fetcher;
    await expect(detachCustomDomain(workerEnv, 'domain-1', owned)).resolves.toBeUndefined();
    expect(owned).toHaveBeenCalledTimes(2);

    const foreign = vi.fn(async () => Response.json({ success: true, result: { id: 'domain-2', hostname: 'sales.nepar.hr', service: 'sales', zone_name: 'nepar.hr', zone_id: 'zone-test' } })) as Fetcher;
    await expect(detachCustomDomain(workerEnv, 'domain-2', foreign)).rejects.toMatchObject({ code: 'DOMAIN_NOT_OWNED' });
  });
});
