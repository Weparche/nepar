ALTER TABLE demos ADD COLUMN outreach_status TEXT NOT NULL DEFAULT 'not_sent' CHECK (outreach_status IN (
  'not_sent', 'sent', 'awaiting_customer', 'awaiting_admin', 'closed_won', 'closed_lost'
));
ALTER TABLE demos ADD COLUMN outreach_message_id TEXT;
ALTER TABLE demos ADD COLUMN outreach_sent_subject TEXT;
ALTER TABLE demos ADD COLUMN outreach_sent_body TEXT;
ALTER TABLE demos ADD COLUMN outreach_status_updated_at TEXT;

CREATE INDEX IF NOT EXISTS idx_demos_outreach_status
  ON demos(outreach_status, outreach_status_updated_at DESC);
