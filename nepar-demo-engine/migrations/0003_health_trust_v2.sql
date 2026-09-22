ALTER TABLE demos ADD COLUMN art_direction TEXT CHECK (art_direction IS NULL OR art_direction IN ('pet-first', 'doctor-first', 'clinic-first'));
ALTER TABLE demos ADD COLUMN art_direction_reason TEXT;
ALTER TABLE demos ADD COLUMN technical_score INTEGER CHECK (technical_score IS NULL OR (technical_score BETWEEN 0 AND 100));
ALTER TABLE demos ADD COLUMN visual_score INTEGER CHECK (visual_score IS NULL OR (visual_score BETWEEN 0 AND 100));
ALTER TABLE demos ADD COLUMN visual_qa_status TEXT NOT NULL DEFAULT 'pending' CHECK (visual_qa_status IN ('pending', 'passed', 'needs_visual_review'));

CREATE INDEX IF NOT EXISTS idx_demos_visual_gate
  ON demos(status, qa_status, visual_qa_status, technical_score, visual_score, approved_at);
