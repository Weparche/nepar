import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { buildDemoPayload } from '../src/generation';
import { researchedLeadSchema } from '../src/schema';

interface CliOptions { lead: string; api: string; token: string; attach: boolean }

function options(argv: string[]): CliOptions {
  const value = (name: string) => argv[argv.indexOf(name) + 1];
  const lead = value('--lead');
  if (!lead) throw new Error('Usage: npm run generate -- --lead ./fixtures/fabela-research.json [--api URL] [--token TOKEN] [--no-attach]');
  return {
    lead,
    api: value('--api') || process.env.DEMO_ENGINE_URL || 'http://127.0.0.1:8787',
    token: value('--token') || process.env.DEMO_ENGINE_ADMIN_TOKEN || '',
    attach: !argv.includes('--no-attach'),
  };
}

async function apiRequest(url: string, token: string, init: RequestInit): Promise<Response> {
  const response = await fetch(url, { ...init, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...init.headers } });
  return response;
}

async function main(): Promise<void> {
  const cli = options(process.argv.slice(2));
  if (!cli.token) throw new Error('Set DEMO_ENGINE_ADMIN_TOKEN or pass --token.');
  const raw = JSON.parse(await readFile(resolve(cli.lead), 'utf8')) as unknown;
  const lead = researchedLeadSchema.parse(raw);
  let leadId: number | undefined;

  const leadResponse = await apiRequest(`${cli.api}/__admin/leads`, cli.token, { method: 'POST', body: JSON.stringify({ ...lead, status: 'researched' }) });
  if (leadResponse.ok) {
    const body = await leadResponse.json() as { lead: { id: number } };
    leadId = body.lead.id;
  } else if (leadResponse.status === 409) {
    const list = await apiRequest(`${cli.api}/__admin/leads`, cli.token, { method: 'GET' });
    const body = await list.json() as { leads: Array<{ id: number; slug: string }> };
    leadId = body.leads.find((item) => item.slug === lead.slug)?.id;
  } else {
    throw new Error(`Lead API ${leadResponse.status}: ${await leadResponse.text()}`);
  }

  const payload = await buildDemoPayload(lead);
  payload.leadId = leadId;
  payload.attachDomain = cli.attach;
  const idempotencyKey = `generate:${lead.slug}:${createHash('sha256').update(JSON.stringify(payload)).digest('hex').slice(0, 24)}`;
  const demoResponse = await apiRequest(`${cli.api}/__admin/demos`, cli.token, {
    method: 'POST',
    headers: { 'Idempotency-Key': idempotencyKey },
    body: JSON.stringify(payload),
  });
  if (!demoResponse.ok) throw new Error(`Demo API ${demoResponse.status}: ${await demoResponse.text()}`);
  const result = await demoResponse.json() as { demo: { url: string; slug: string }; replayed: boolean };
  process.stdout.write(`${JSON.stringify({ ok: true, slug: result.demo.slug, url: result.demo.url, replayed: result.replayed }, null, 2)}\n`);
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});

