export const DESIGN_SYSTEM_KEYS = [
  'automotive-performance',
  'health-trust',
  'beauty-editorial',
  'hospitality-immersive',
  'trade-local',
  'professional-authority',
] as const;

export type DesignSystemKey = (typeof DESIGN_SYSTEM_KEYS)[number];

export const HEALTH_TRUST_ART_DIRECTIONS = ['pet-first', 'doctor-first', 'clinic-first'] as const;
export type HealthTrustArtDirection = (typeof HEALTH_TRUST_ART_DIRECTIONS)[number];

export const ASSET_PROVENANCE = [
  'business-website',
  'business-social',
  'client-provided',
  'nepar-owned',
  'ai-generated-decorative',
  'legacy-unverified',
] as const;
export type AssetProvenance = (typeof ASSET_PROVENANCE)[number];

export const LEAD_STATUSES = [
  'new',
  'researched',
  'approved_for_demo',
  'demo_ready',
  'sent',
  'replied',
  'won',
  'lost',
  'rejected',
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];
export type DemoStatus = 'active' | 'expired' | 'archived';
export type QaStatus = 'pending' | 'running' | 'passed' | 'failed';
export type VisualQaStatus = 'pending' | 'passed' | 'needs_visual_review';
export const OUTREACH_STATUSES = ['not_sent', 'sent', 'awaiting_customer', 'awaiting_admin', 'closed_won', 'closed_lost'] as const;
export type OutreachStatus = (typeof OUTREACH_STATUSES)[number];
export type DemoEventType =
  | 'page_view'
  | 'primary_cta_click'
  | 'secondary_cta_click'
  | 'phone_click'
  | 'email_click';

export interface WorkerSecrets {
  ADMIN_TOKEN: string;
  WORKERS_DOMAINS_API_TOKEN?: string;
  CF_ACCOUNT_ID?: string;
  CF_ZONE_ID?: string;
}

export type RuntimeEnv = Env & WorkerSecrets;

export interface DemoRow {
  id: number;
  slug: string;
  business_name: string;
  template_key: string;
  content_json: string;
  source_url: string | null;
  lead_email: string | null;
  status: DemoStatus;
  custom_domain_id: string | null;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
  lead_id: number | null;
  design_system_key: DesignSystemKey;
  generation_version: string;
  qa_status: QaStatus;
  qa_report_json: string | null;
  desktop_screenshot_key: string | null;
  mobile_screenshot_key: string | null;
  approved_at: string | null;
  sent_at: string | null;
  first_viewed_at: string | null;
  last_viewed_at: string | null;
  view_count: number;
  idempotency_key: string | null;
  idempotency_hash: string | null;
  outreach_json: string | null;
  art_direction?: HealthTrustArtDirection | null;
  art_direction_reason?: string | null;
  technical_score?: number | null;
  visual_score?: number | null;
  visual_qa_status?: VisualQaStatus | null;
  outreach_status?: OutreachStatus | null;
  outreach_message_id?: string | null;
  outreach_sent_subject?: string | null;
  outreach_sent_body?: string | null;
  outreach_status_updated_at?: string | null;
}

export interface LeadRow {
  id: number;
  business_name: string;
  slug: string;
  website_url: string | null;
  google_business_url: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  public_email: string | null;
  public_phone: string | null;
  city: string | null;
  industry: string;
  source: string;
  score: number;
  score_reasons_json: string;
  research_json: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export interface ApiErrorBody {
  ok: false;
  error: { code: string; message: string; requestId: string; details?: unknown };
}
