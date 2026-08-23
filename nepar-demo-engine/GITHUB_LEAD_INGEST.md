# GitHub lead ingest

NEPAR Demo Engine can ingest daily researched lead batches from a dedicated GitHub issue without exposing Cloudflare or admin secrets to ChatGPT.

## Queue

- Repository: `Weparche/nepar`
- Issue: `#14` (`NEPAR Lead Ingest Queue`)
- The issue conversation is locked; the connected owner account can still append queue comments.
- Worker accepts only comments where GitHub reports all of:
  - `user.login === "Weparche"`
  - `user.id === 154843953`
  - `author_association === "OWNER"`

No GitHub API token is required by the Worker because the repository and lead data are public.

## Batch format

Each daily queue comment contains one JSON code block:

```json
{
  "type": "nepar-lead-batch-v1",
  "batchId": "2026-08-24-veterinari-01",
  "leads": [
    {
      "businessName": "Example Vet",
      "slug": "example-vet",
      "city": "Zagreb",
      "industry": "veterinarska ambulanta",
      "source": "public-web-research",
      "score": 80,
      "scoreReasons": ["..."],
      "services": [
        {
          "title": "Pregledi",
          "description": "...",
          "sourceField": "services"
        }
      ],
      "facts": { "services": "Pregledi" },
      "sources": [
        {
          "field": "services",
          "url": "https://example.hr/usluge",
          "verifiedAt": "2026-08-24T06:00:00.000Z"
        }
      ],
      "visualAssets": [],
      "verifiedObservations": ["..."],
      "proposedServiceAngle": "...",
      "status": "researched"
    }
  ]
}
```

The whole batch is Zod-validated against `createLeadSchema`; maximum batch size is 10.

## Idempotency and safety

- Every GitHub comment ID is recorded in `github_lead_ingest_events`.
- A processed comment is never processed twice.
- Repeated `batchId` values are ignored.
- Existing lead `slug` values are skipped, never overwritten.
- Reserved NEPAR subdomains are skipped.
- Malformed owner comments are recorded as `failed` and do not create leads.
- Non-owner comments are recorded as `ignored`.
- Ingest creates leads in `researched` state only. It does **not** approve a demo, approve outreach, or send email.

## Schedule

Cloudflare cron `30 7 * * *` runs the queue ingest once per day after the morning lead-research automation. Existing expiry cleanup cron remains unchanged.

## Manual trigger

After deployment, an authorized operator can trigger the same idempotent ingest manually:

```bash
curl -X POST "https://nepar-demo-engine.ig29007.workers.dev/__admin/ingest/github" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

The response reports `commentsSeen`, `commentsProcessed`, `inserted`, `skipped`, and `failed`.

## Deploy checklist

```bash
cd C:\Nepar\nepar-demo-engine
git pull --ff-only
npm run db:migrate:remote
npm run verify
npm run deploy
```

Then manually trigger `POST /__admin/ingest/github` once to verify the path before relying on the daily cron.
