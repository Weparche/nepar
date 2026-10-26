import { z } from 'zod';
import { createDemoSchema, researchedLeadSchema, sourceReferenceSchema, type DemoContent } from './schema';
import { assetManifestSchema } from './health-trust-v3-contract';
import { canonical } from './health-trust-v3-qa';

export function displayFields(c: DemoContent): Record<string, string> {
  const fields: Record<string,string> = {};
  const collect = (path: string, value: unknown) => {
    if (typeof value === 'string' && value) fields[path] = value;
    else if (value && typeof value === 'object') for (const [key,item] of Object.entries(value)) if (!['sourceField', 'imageUrl'].includes(key)) collect(`${path}.${key}`,item);
  };
  for (const key of ['brand', 'contact', 'hero', 'services', 'proofPoints', 'about'] as const) collect(key,c[key]);
  if (c.v3?.hero.origin.namedPerson) fields['v3.hero.origin.namedPerson'] = c.v3.hero.origin.namedPerson;
  return fields;
}
export const preparedPackageSchema = z.object({
  packageVersion: z.literal(1), lead: researchedLeadSchema,
  brief: z.object({ directionReason: z.string().min(10), intent: z.string().min(10), audience: z.string().min(5) }).strict(),
  payload: createDemoSchema, assetManifest: assetManifestSchema,
  prompts: z.array(z.object({ id: z.string().min(1), prompt: z.string().min(10), masterAssetId: z.string().optional() }).strict()).min(1),
  evidence: z.array(z.object({ path: z.string().min(1), value: z.string().min(1), kind: z.enum(['fact','editorial']), sources: z.array(sourceReferenceSchema) }).strict()),
}).strict().superRefine((pkg, ctx) => {
  const fail = (message: string) => ctx.addIssue({ code: 'custom', message });
  if (!pkg.payload.designVersion || !pkg.payload.content.v3) fail('Prepared packages require V3.');
  if (pkg.payload.slug !== pkg.lead.slug || pkg.payload.businessName !== pkg.lead.businessName || pkg.payload.content.brand.name !== pkg.lead.businessName) fail('Lead and demo identity differ.');
  if (canonical(pkg.assetManifest) !== canonical(pkg.payload.content.v3?.assetManifest)) fail('Asset manifest differs from payload.');
  const fields = displayFields(pkg.payload.content);
  const editorialPaths = /^(hero\.(headline|description)|about\.(title|body))$/;
  if (new Set(pkg.evidence.map(e => e.path)).size !== pkg.evidence.length) fail('Duplicate evidence path.');
  for (const [path,value] of Object.entries(fields)) {
    const ev = pkg.evidence.find(e => e.path === path);
    if (!ev || ev.value !== value) { fail(`Missing or stale evidence: ${path}`); continue; }
    if (ev.kind === 'editorial' && !editorialPaths.test(path)) fail(`Factual field cannot be editorial: ${path}`);
    if (ev.kind === 'fact' && !ev.sources.length) fail(`Source required: ${path}`);
  }
  for (const ev of pkg.evidence) if (!(ev.path in fields)) fail(`Unknown evidence field: ${ev.path}`);
  const c = pkg.payload.content;
  if (c.contact.phone !== pkg.lead.publicPhone || c.contact.email !== pkg.lead.publicEmail) fail('Contacts differ from researched lead.');
});
export type PreparedPackage = z.infer<typeof preparedPackageSchema>;
