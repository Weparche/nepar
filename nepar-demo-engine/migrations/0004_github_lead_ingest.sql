CREATE TABLE IF NOT EXISTS github_lead_ingest_events (
  comment_id INTEGER PRIMARY KEY,
  issue_number INTEGER NOT NULL,
  batch_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('processed', 'failed', 'ignored')),
  inserted_count INTEGER NOT NULL DEFAULT 0,
  skipped_count INTEGER NOT NULL DEFAULT 0,
  error_text TEXT,
  github_created_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_github_lead_ingest_batch
  ON github_lead_ingest_events(batch_id, status);

CREATE INDEX IF NOT EXISTS idx_github_lead_ingest_created
  ON github_lead_ingest_events(github_created_at DESC);
