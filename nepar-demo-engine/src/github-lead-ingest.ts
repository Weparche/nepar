import { z } from 'zod';
import type { RuntimeEnv } from './models';
import { createLeadSchema } from './schema';

interface GitHubQueueEnv {
  GITHUB_LEAD_QUEUE_REPO?: string;
  GITHUB_LEAD_QUEUE_ISSUE?: string;
  GITHUB_LEAD_QUEUE_OWNER?: string;
  GITHUB_LEAD_QUEUE_OWNER_ID?: string;
}

type QueueEnv = RuntimeEnv & GitHubQueueEnv;

const RESERVED_SUBDOMAINS = new Set([
  'www', 'api', 'mail', 'smtp', 'ftp', 'admin', 'app', 'cdn', 'assets',
  'kids', 'animationstudios', 'sales', 'status', 'support', 'demo',
]);

const leadBatchSchema = z.object({
  type: z.literal('nepar-lead-batch-v1'),
  batchId: z.string().trim().min(8).max(128).regex(/^[A-Za-z0-9._:-]+$/),
  leads: z.array(createLeadSchema).min(1).max(10),
}).strict();

type LeadBatch = z.infer<typeof leadBatchSchema>;

interface GitHubComment {
  id: number;
  body: string | null;
  created_at: string;
  author_association: string;
  user: { login: string; id: number } | null;
}

export interface GitHubLeadIngestResult {
  commentsSeen: number;
  commentsProcessed: number;
  inserted: number;
  skipped: number;
  failed: number;
}

function queueConfig(env: QueueEnv) {
  const issue = Number(env.GITHUB_LEAD_QUEUE_ISSUE || '14');
  const ownerId = Number(env.GITHUB_LEAD_QUEUE_OWNER_ID || '154843953');
  if (!Number.isInteger(issue) || issue <= 0) throw new Error('GITHUB_LEAD_QUEUE_ISSUE is invalid');
  if (!Number.isInteger(ownerId) || ownerId <= 0) throw new Error('GITHUB_LEAD_QUEUE_OWNER_ID is invalid');
  return {
    repo: env.GITHUB_LEAD_QUEUE_REPO || 'Weparche/nepar',
    issue,
    owner: env.GITHUB_LEAD_QUEUE_OWNER || 'Weparche',
    ownerId,
  };
}

function extractJson(body: string): unknown {
  if (body.length > 60_000) throw new Error('Queue comment exceeds 60 KB');
  const fenced = body.match(/```json\s*([\s\S]*?)```/i);
  return JSON.parse((fenced?.[1] ?? body).trim());
}

async function lastSeenTimestamp(env: QueueEnv): Promise<string | undefined> {
  const row = await env.DB.prepare(
    `SELECT github_created_at FROM github_lead_ingest_events ORDER BY github_created_at DESC LIMIT 1`,
  ).first<{ github_created_at: string }>();
  if (!row?.github_created_at) return undefined;
  const parsed = Date.parse(row.github_created_at);
  return Number.isFinite(parsed) ? new Date(parsed - 1_000).toISOString() : undefined;
}

async function fetchQueueComments(env: QueueEnv): Promise<GitHubComment[]> {
  const config = queueConfig(env);
  const since = await lastSeenTimestamp(env);
  const params = new URLSearchParams({ per_page: '100' });
  if (since) params.set('since', since);
  const response = await fetch(
    `https://api.github.com/repos/${config.repo}/issues/${config.issue}/comments?${params}`,
    {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'nepar-demo-engine/lead-ingest',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  );
  if (!response.ok) throw new Error(`GitHub queue fetch failed: HTTP ${response.status}`);
  const raw = await response.json();
  if (!Array.isArray(raw)) throw new Error('GitHub queue returned a non-array response');
  return raw.filter((value): value is GitHubComment => Boolean(
    value && typeof value === 'object'
    && Number.isInteger((value as GitHubComment).id)
    && typeof (value as GitHubComment).created_at === 'string',
  ));
}

async function alreadySeen(env: QueueEnv, commentId: number): Promise<boolean> {
  const row = await env.DB.prepare(
    `SELECT comment_id FROM github_lead_ingest_events WHERE comment_id = ? LIMIT 1`,
  ).bind(commentId).first<{ comment_id: number }>();
  return Boolean(row);
}

async function batchAlreadyProcessed(env: QueueEnv, batchId: string): Promise<boolean> {
  const row = await env.DB.prepare(
    `SELECT comment_id FROM github_lead_ingest_events WHERE batch_id = ? AND status = 'processed' LIMIT 1`,
  ).bind(batchId).first<{ comment_id: number }>();
  return Boolean(row);
}

async function recordQueueEvent(
  env: QueueEnv,
  comment: GitHubComment,
  status: 'processed' | 'failed' | 'ignored',
  batchId: string | null,
  inserted: number,
  skipped: number,
  errorText?: string,
): Promise<void> {
  const config = queueConfig(env);
  await env.DB.prepare(
    `INSERT OR IGNORE INTO github_lead_ingest_events
      (comment_id, issue_number, batch_id, status, inserted_count, skipped_count, error_text, github_created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ).bind(
    comment.id,
    config.issue,
    batchId,
    status,
    inserted,
    skipped,
    errorText?.slice(0, 1_000) ?? null,
    comment.created_at,
  ).run();
}

async function insertLead(env: QueueEnv, lead: LeadBatch['leads'][number], batch: LeadBatch, commentId: number): Promise<'inserted' | 'skipped'> {
  if (RESERVED_SUBDOMAINS.has(lead.slug)) return 'skipped';
  const existing = await env.DB.prepare(`SELECT id FROM leads WHERE slug = ? LIMIT 1`).bind(lead.slug).first<{ id: number }>();
  if (existing) return 'skipped';

  try {
    const created = await env.DB.prepare(
      `INSERT INTO leads (
        business_name, slug, website_url, google_business_url, instagram_url, facebook_url,
        public_email, public_phone, city, industry, source, score, score_reasons_json,
        research_json, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id`,
    ).bind(
      lead.businessName,
      lead.slug,
      lead.websiteUrl ?? null,
      lead.googleBusinessUrl ?? null,
      lead.instagramUrl ?? null,
      lead.facebookUrl ?? null,
      lead.publicEmail ?? null,
      lead.publicPhone ?? null,
      lead.city ?? null,
      lead.industry,
      lead.source,
      lead.score,
      JSON.stringify(lead.scoreReasons),
      JSON.stringify(lead),
      lead.status,
    ).first<{ id: number }>();

    if (!created?.id) throw new Error(`D1 did not return an id for lead ${lead.slug}`);
    await env.DB.prepare(
      `INSERT INTO workflow_events (lead_id, demo_id, event_type, payload_json, requires_human_action)
       VALUES (?, NULL, 'github_lead_ingested', ?, 0)`,
    ).bind(created.id, JSON.stringify({ batchId: batch.batchId, githubCommentId: commentId })).run();
    return 'inserted';
  } catch (error) {
    if (String(error).includes('UNIQUE')) return 'skipped';
    throw error;
  }
}

export async function ingestGitHubLeadQueue(env: QueueEnv): Promise<GitHubLeadIngestResult> {
  const config = queueConfig(env);
  const comments = await fetchQueueComments(env);
  const result: GitHubLeadIngestResult = { commentsSeen: comments.length, commentsProcessed: 0, inserted: 0, skipped: 0, failed: 0 };

  for (const comment of comments) {
    if (await alreadySeen(env, comment.id)) continue;

    const authorized = comment.user?.login === config.owner
      && comment.user?.id === config.ownerId
      && comment.author_association === 'OWNER';

    if (!authorized) {
      await recordQueueEvent(env, comment, 'ignored', null, 0, 0, 'Comment author is not the configured repository owner');
      continue;
    }

    let batch: LeadBatch;
    try {
      batch = leadBatchSchema.parse(extractJson(comment.body || ''));
    } catch (error) {
      result.failed += 1;
      await recordQueueEvent(env, comment, 'failed', null, 0, 0, error instanceof Error ? error.message : String(error));
      continue;
    }

    if (await batchAlreadyProcessed(env, batch.batchId)) {
      await recordQueueEvent(env, comment, 'ignored', batch.batchId, 0, batch.leads.length, 'Duplicate batchId');
      result.skipped += batch.leads.length;
      continue;
    }

    let inserted = 0;
    let skipped = 0;
    for (const lead of batch.leads) {
      const status = await insertLead(env, lead, batch, comment.id);
      if (status === 'inserted') inserted += 1;
      else skipped += 1;
    }

    await recordQueueEvent(env, comment, 'processed', batch.batchId, inserted, skipped);
    result.commentsProcessed += 1;
    result.inserted += inserted;
    result.skipped += skipped;
  }

  return result;
}
