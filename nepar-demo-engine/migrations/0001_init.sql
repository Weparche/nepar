CREATE TABLE IF NOT EXISTS demos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  business_name TEXT NOT NULL,
  template_key TEXT NOT NULL DEFAULT 'premium-local-service',
  content_json TEXT NOT NULL,
  source_url TEXT,
  lead_email TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'archived')),
  custom_domain_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expires_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_demos_status_expires
  ON demos(status, expires_at);

CREATE TABLE IF NOT EXISTS demo_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  demo_id INTEGER NOT NULL,
  event_type TEXT NOT NULL,
  path TEXT,
  referrer TEXT,
  country TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (demo_id) REFERENCES demos(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_demo_events_demo_created
  ON demo_events(demo_id, created_at DESC);
