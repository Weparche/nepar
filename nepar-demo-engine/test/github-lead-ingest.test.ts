import { env } from 'cloudflare:workers';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ingestGitHubLeadQueue } from '../src/github-lead-ingest';
import type { RuntimeEnv } from '../src/models';

const workerEnv = env as RuntimeEnv;

const lead = {
  businessName: 'Test Veterinarska Ambulanta',
  slug: 'test-veterinarska-ambulanta',
  websiteUrl: 'https://example.test',
  publicEmail: 'info@example.test',
  publicPhone: '+385 1 555 0101',
  city: 'Zagreb',
  industry: 'veterinarska ambulanta',
  source: 'public-web-research',
  score: 82,
  scoreReasons: ['Postojeći web ima prostor za bolju lokalnu i AI vidljivost.'],
  services: [{ title: 'Veterinarski pregledi', description: 'Pregledi kućnih ljubimaca.', sourceField: 'services' }],
  facts: { services: 'Veterinarski pregledi' },
  sources: [{ field: 'services', url: 'https://example.test/usluge', verifiedAt: '2026-08-24T06:00:00.000Z' }],
  visualAssets: [],
  verifiedObservations: ['Javno je dostupna veterinarska ambulanta u Zagrebu.'],
  proposedServiceAngle: 'Redizajn i bolja vidljivost na Googleu i AI tražilicama.',
  status: 'researched',
};

function ownerComment(id: number, body: string) {
  return {
    id,
    body,
    created_at: '2026-08-24T06:05:00.000Z',
    author_association: 'OWNER',
    user: { login: 'Weparche', id: 154843953 },
  };
}

beforeEach(async () => {
  await env.DB.batch([
    env.DB.prepare('DELETE FROM github_lead_ingest_events'),
    env.DB.prepare('DELETE FROM workflow_events'),
    env.DB.prepare('DELETE FROM leads'),
  ]);
  vi.unstubAllGlobals();
});

describe('GitHub lead ingest queue', () => {
  it('ingests one owner-authored validated batch exactly once', async () => {
    const body = `\`\`\`json\n${JSON.stringify({ type: 'nepar-lead-batch-v1', batchId: '2026-08-24-veterinari-01', leads: [lead] })}\n\`\`\``;
    vi.stubGlobal('fetch', vi.fn(async () => Response.json([ownerComment(1001, body)])));

    const first = await ingestGitHubLeadQueue(workerEnv);
    expect(first.inserted).toBe(1);
    expect(first.commentsProcessed).toBe(1);

    const second = await ingestGitHubLeadQueue(workerEnv);
    expect(second.inserted).toBe(0);

    const count = await env.DB.prepare(`SELECT COUNT(*) AS total FROM leads WHERE slug = 'test-veterinarska-ambulanta'`).first<{ total: number }>();
    expect(count?.total).toBe(1);
  });

  it('ignores comments that are not authored by the repository owner', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json([{
      ...ownerComment(1002, '{}'),
      author_association: 'NONE',
      user: { login: 'someone-else', id: 42 },
    }])));

    const result = await ingestGitHubLeadQueue(workerEnv);
    expect(result.inserted).toBe(0);
    const event = await env.DB.prepare(`SELECT status FROM github_lead_ingest_events WHERE comment_id = 1002`).first<{ status: string }>();
    expect(event?.status).toBe('ignored');
  });

  it('records malformed owner batches as failed without inserting leads', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json([ownerComment(1003, 'not json')])));
    const result = await ingestGitHubLeadQueue(workerEnv);
    expect(result.failed).toBe(1);
    const event = await env.DB.prepare(`SELECT status FROM github_lead_ingest_events WHERE comment_id = 1003`).first<{ status: string }>();
    expect(event?.status).toBe('failed');
  });
});
