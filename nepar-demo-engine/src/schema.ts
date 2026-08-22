import { z } from 'zod';
import { DESIGN_SYSTEM_KEYS, LEAD_STATUSES } from './models';

const MAX_TEXT = 2_000;
const httpUrl = z.string().trim().url().max(2_048).refine((value) => {
  const protocol = new URL(value).protocol;
  return protocol === 'https:' || protocol === 'http:';
}, 'URL must use http or https');
const httpsUrl = httpUrl.refine((value) => new URL(value).protocol === 'https:', 'URL must use https');
const optionalHttpUrl = z.union([httpUrl, z.literal('')]).transform((value) => value || undefined).optional();
const optionalEmail = z.union([z.email().max(254), z.literal('')]).transform((value) => value || undefined).optional();
const optionalPhone = z.union([
  z.string().trim().min(6).max(32).regex(/^\+?[0-9 ()/.-]+$/),
  z.literal(''),
]).transform((value) => value || undefined).optional();
const safeText = z.string().trim().min(1).max(MAX_TEXT);

export const slugSchema = z.string().trim().toLowerCase().regex(
  /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/,
  'Slug must contain lowercase letters, numbers and internal hyphens only',
);

export const sourceReferenceSchema = z.object({
  field: z.string().trim().min(1).max(80),
  url: httpUrl,
  note: z.string().trim().max(500).optional(),
  verifiedAt: z.iso.datetime(),
}).strict();

export const demoContentSchema = z.object({
  brand: z.object({
    name: safeText.max(120),
    industry: safeText.max(120),
    location: z.string().trim().max(160).optional(),
  }).strict(),
  contact: z.object({
    phone: optionalPhone,
    email: optionalEmail,
    address: z.string().trim().max(240).optional(),
    website: optionalHttpUrl,
  }).strict(),
  hero: z.object({
    headline: safeText.max(180),
    description: safeText.max(420),
    imageUrl: httpsUrl.optional(),
  }).strict(),
  primaryCta: z.object({ label: safeText.max(60), href: safeText.max(2_048) }).strict(),
  secondaryCta: z.object({ label: safeText.max(60), href: safeText.max(2_048) }).strict().optional(),
  services: z.array(z.object({
    title: safeText.max(100),
    description: safeText.max(360),
    sourceField: z.string().trim().min(1).max(80),
  }).strict()).min(1).max(8),
  proofPoints: z.array(z.object({
    value: safeText.max(80),
    label: safeText.max(160),
    sourceField: z.string().trim().max(80).optional(),
  }).strict()).max(5).default([]),
  about: z.object({ title: safeText.max(140), body: safeText.max(1_200) }).strict(),
  sources: z.array(sourceReferenceSchema).max(24),
  visual: z.object({
    accent: z.string().regex(/^#[0-9a-f]{6}$/i),
    tone: z.enum(['light', 'dark', 'mixed']),
    imagePosition: z.enum(['center', 'top', 'bottom']).default('center'),
  }).strict(),
  assets: z.array(z.object({
    kind: z.enum(['hero', 'gallery', 'logo']),
    url: httpsUrl,
    alt: safeText.max(180),
    sourceUrl: httpUrl,
  }).strict()).max(12).default([]),
  verifiedObservations: z.array(safeText.max(360)).max(2).default([]),
}).strict().superRefine((content, context) => {
  const verifiedFields = new Set(content.sources.map((source) => source.field));
  for (const proof of content.proofPoints) {
    if (!proof.sourceField || !verifiedFields.has(proof.sourceField)) {
      context.addIssue({
        code: 'custom',
        path: ['proofPoints'],
        message: `Proof point "${proof.value}" must reference a verified source field`,
      });
    }
  }
  for (const service of content.services) {
    if (!verifiedFields.has(service.sourceField)) {
      context.addIssue({
        code: 'custom',
        path: ['services'],
        message: `Service "${service.title}" must reference a verified source field`,
      });
    }
  }
});

export type DemoContent = z.infer<typeof demoContentSchema>;

export const researchedLeadSchema = z.object({
  businessName: safeText.max(120),
  slug: slugSchema,
  websiteUrl: optionalHttpUrl,
  googleBusinessUrl: optionalHttpUrl,
  instagramUrl: optionalHttpUrl,
  facebookUrl: optionalHttpUrl,
  publicEmail: optionalEmail,
  publicPhone: optionalPhone,
  city: z.string().trim().max(120).optional(),
  industry: safeText.max(120),
  source: safeText.max(120),
  score: z.number().int().min(0).max(100),
  scoreReasons: z.array(safeText.max(240)).max(12),
  services: z.array(z.object({
    title: safeText.max(100),
    description: safeText.max(360),
    sourceField: z.string().trim().min(1).max(80),
  }).strict()).min(1).max(8),
  facts: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  sources: z.array(sourceReferenceSchema).max(24),
  visualAssets: z.array(z.object({
    kind: z.enum(['hero', 'gallery', 'logo']),
    url: httpsUrl,
    alt: safeText.max(180),
    sourceUrl: httpUrl,
  }).strict()).max(12).default([]),
  verifiedObservations: z.array(safeText.max(360)).max(2).default([]),
  proposedServiceAngle: safeText.max(420),
}).strict().superRefine((lead, context) => {
  const verifiedFields = new Set(lead.sources.map((source) => source.field));
  for (const service of lead.services) {
    if (!verifiedFields.has(service.sourceField)) {
      context.addIssue({ code: 'custom', path: ['services'], message: `Service "${service.title}" is missing provenance` });
    }
  }
});

export type ResearchedLead = z.infer<typeof researchedLeadSchema>;

export const createLeadSchema = researchedLeadSchema.extend({
  status: z.enum(LEAD_STATUSES).default('researched'),
}).strict();

export const createDemoSchema = z.object({
  slug: slugSchema,
  businessName: safeText.max(120),
  leadId: z.number().int().positive().optional(),
  designSystemKey: z.enum(DESIGN_SYSTEM_KEYS),
  generationVersion: z.string().trim().min(1).max(80).default('fixture-v1'),
  sourceUrl: optionalHttpUrl,
  leadEmail: optionalEmail,
  content: demoContentSchema,
  expiresAt: z.iso.datetime().optional(),
  expiresInDays: z.number().int().min(1).max(30).optional(),
  attachDomain: z.boolean().default(true),
  outreach: z.object({
    prospectName: safeText.max(120),
    recipientEmail: z.email().max(254).optional(),
    verifiedObservations: z.array(safeText.max(360)).max(2),
    proposedServiceAngle: safeText.max(420),
  }).strict(),
}).strict();

export type CreateDemoInput = z.infer<typeof createDemoSchema>;

export const qaReportSchema = z.object({
  status: z.enum(['passed', 'failed']),
  checkedAt: z.iso.datetime(),
  url: httpUrl,
  viewports: z.array(z.object({
    name: z.enum(['desktop', 'mobile']),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
    screenshotKey: z.string().trim().max(512).optional(),
    checks: z.array(z.object({
      name: z.string().trim().min(1).max(120),
      passed: z.boolean(),
      detail: z.string().trim().max(1_000).optional(),
    }).strict()),
  }).strict()).length(2),
  consoleErrors: z.array(z.string().max(1_000)).max(30),
  brokenImages: z.array(httpUrl).max(30),
}).strict();

export type QaReport = z.infer<typeof qaReportSchema>;

export const MAX_ADMIN_BODY_BYTES = 96 * 1024;
export const MAX_SCREENSHOT_BYTES = 8 * 1024 * 1024;

export function safeHref(value: string): string {
  const trimmed = value.trim();
  if (trimmed.startsWith('#') || trimmed.startsWith('/')) return trimmed;
  if (/^(tel:|mailto:)/i.test(trimmed)) return trimmed.replace(/["'<>`\s]/g, '');
  try {
    const url = new URL(trimmed);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '#kontakt';
  } catch {
    return '#kontakt';
  }
}

export function safeImageUrl(value?: string): string {
  if (!value) return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : '';
  } catch {
    return '';
  }
}

export function safeColor(value?: string): string {
  return value && /^#[0-9a-f]{6}$/i.test(value) ? value : '#2563eb';
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
