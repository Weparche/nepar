CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  website_url TEXT,
  google_business_url TEXT,
  instagram_url TEXT,
  facebook_url TEXT,
  public_email TEXT,
  public_phone TEXT,
  city TEXT,
  industry TEXT NOT NULL,
  source TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
  score_reasons_json TEXT NOT NULL DEFAULT '[]',
  research_json TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN (
    'new', 'researched', 'approved_for_demo', 'demo_ready', 'sent',
    'replied', 'won', 'lost', 'rejected'
  )),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_status_score
  ON leads(status, score DESC, created_at DESC);

ALTER TABLE demos ADD COLUMN lead_id INTEGER REFERENCES leads(id);
ALTER TABLE demos ADD COLUMN design_system_key TEXT NOT NULL DEFAULT 'trade-local';
ALTER TABLE demos ADD COLUMN generation_version TEXT NOT NULL DEFAULT 'fixture-v1';
ALTER TABLE demos ADD COLUMN qa_status TEXT NOT NULL DEFAULT 'pending' CHECK (qa_status IN ('pending', 'running', 'passed', 'failed'));
ALTER TABLE demos ADD COLUMN qa_report_json TEXT;
ALTER TABLE demos ADD COLUMN desktop_screenshot_key TEXT;
ALTER TABLE demos ADD COLUMN mobile_screenshot_key TEXT;
ALTER TABLE demos ADD COLUMN approved_at TEXT;
ALTER TABLE demos ADD COLUMN sent_at TEXT;
ALTER TABLE demos ADD COLUMN first_viewed_at TEXT;
ALTER TABLE demos ADD COLUMN last_viewed_at TEXT;
ALTER TABLE demos ADD COLUMN view_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE demos ADD COLUMN idempotency_key TEXT;
ALTER TABLE demos ADD COLUMN idempotency_hash TEXT;
ALTER TABLE demos ADD COLUMN outreach_json TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_demos_idempotency_key
  ON demos(idempotency_key) WHERE idempotency_key IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_demos_lead_status
  ON demos(lead_id, status, created_at DESC);

CREATE TABLE IF NOT EXISTS workflow_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id INTEGER REFERENCES leads(id),
  demo_id INTEGER REFERENCES demos(id),
  event_type TEXT NOT NULL,
  payload_json TEXT NOT NULL DEFAULT '{}',
  requires_human_action INTEGER NOT NULL DEFAULT 0,
  acted_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_workflow_events_pending
  ON workflow_events(event_type, requires_human_action, acted_at, created_at DESC);
