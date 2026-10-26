import { z } from 'zod';
import { ASSET_PROVENANCE } from './models';

export const DESIGN_VERSION = 'health-trust-v3' as const;
const https = z.url().max(2048).refine(v => new URL(v).protocol === 'https:');
export const digestSchema = z.string().regex(/^[a-f0-9]{64}$/);
export const imageVariantSchema = z.object({
  url: https, width: z.number().int().positive().max(16384), height: z.number().int().positive().max(16384),
  focalPoint: z.object({ x: z.number().min(0).max(1), y: z.number().min(0).max(1) }).strict(),
}).strict();
export const responsiveImageSchema = z.object({
  desktop: imageVariantSchema, mobile: imageVariantSchema, alt: z.string().trim().min(1).max(180),
  origin: z.object({
    provenance: z.enum(ASSET_PROVENANCE), sourceUrl: https, verifiedAt: z.iso.datetime().optional(),
    masterAssetId: z.string().min(1).max(160).optional(), depictsNamedPerson: z.boolean(), namedPerson: z.string().min(1).max(120).optional(),
  }).strict(),
}).strict().superRefine((image, ctx) => {
  const o = image.origin;
  if (o.depictsNamedPerson && !o.namedPerson) ctx.addIssue({ code: 'custom', path: ['origin'], message: 'Named portrait requires namedPerson.' });
  if (o.provenance === 'ai-generated-decorative' && (o.namedPerson || o.depictsNamedPerson || !o.masterAssetId)) ctx.addIssue({ code: 'custom', path: ['origin'], message: 'Generated decoration requires a master and cannot identify a real person.' });
  if (!['ai-generated-decorative', 'legacy-unverified'].includes(o.provenance) && !o.verifiedAt) ctx.addIssue({ code: 'custom', path: ['origin'], message: 'Real asset requires verification.' });
});
export const assetManifestSchema = z.array(z.object({
  url: https, sha256: digestSchema, kind: z.enum(['image', 'font']),
}).strict()).min(1).max(32).superRefine((assets, ctx) => {
  if (new Set(assets.map(a => a.url)).size !== assets.length) ctx.addIssue({ code: 'custom', message: 'Duplicate manifest URL.' });
});
export const v3ContentSchema = z.object({
  hero: responsiveImageSchema, heroRole: z.enum(['pet', 'doctor', 'clinic']), support: responsiveImageSchema.optional(),
  fonts: z.object({ serif: https, sans: https, serifExtended: https, sansExtended: https }).strict(), assetManifest: assetManifestSchema,
}).strict().superRefine((v, ctx) => {
  const urls = new Set(v.assetManifest.map(a => a.url));
  const required = [v.hero.desktop.url, v.hero.mobile.url, ...Object.values(v.fonts), ...(v.support ? [v.support.desktop.url, v.support.mobile.url] : [])];
  for (const url of required) if (!urls.has(url)) ctx.addIssue({ code: 'custom', path: ['assetManifest'], message: `Missing asset: ${url}` });
});
export type ResponsiveImage = z.infer<typeof responsiveImageSchema>;
export type ImageVariant = z.infer<typeof imageVariantSchema>;

const judgmentSchema = z.object({
  score: z.number().min(0).max(100), reviewer: z.literal('gpt-6-astra'), checkedAt: z.iso.datetime(),
  reviewFingerprint: digestSchema, rationale: z.string().trim().min(20).max(2000),
  findings: z.array(z.object({ severity: z.enum(['minor', 'critical']), detail: z.string().trim().min(1).max(1000) }).strict()).max(30),
}).strict();
export const v3QaSchema = z.object({
  contentFingerprint: digestSchema,
  captures: z.array(z.object({
    viewport: z.enum(['desktop', 'mobile']), technicalScore: z.number().min(0).max(100), geometryScore: z.number().min(0).max(100),
    screenshotSha256: digestSchema, referenceSha256: digestSchema.optional(), designJudgment: judgmentSchema.optional(),
  }).strict()).length(2),
}).strict().superRefine((v, ctx) => {
  if (new Set(v.captures.map(c => c.viewport)).size !== 2) ctx.addIssue({ code: 'custom', message: 'One desktop and one mobile capture required.' });
});
export type V3Qa = z.infer<typeof v3QaSchema>;
