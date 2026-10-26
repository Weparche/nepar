import type { DesignSystemKey, HealthTrustArtDirection } from './models';
import { createDemoSchema, type CreateDemoInput, type DemoContent, type ResearchedLead, type VisualAsset } from './schema';

export interface CopyProvider {
  build(lead: ResearchedLead, designSystemKey: DesignSystemKey, artDirection?: HealthTrustArtDirection): Promise<DemoContent>;
}

const INDUSTRY_RULES: Array<[RegExp, DesignSystemKey]> = [
  [/auto|mehan|servis|detailing|gume|vulkan|vuč|towing/i, 'automotive-performance'],
  [/veter|zdrav|dental|ordin|clinic|klinika|terap/i, 'health-trust'],
  [/salon|beauty|kozmet|wellness|frizer|nokti|masaž/i, 'beauty-editorial'],
  [/hotel|apart|villa|vila|restoran|smještaj|hostel|konoba/i, 'hospitality-immersive'],
  [/elektr|instal|stolar|grad|majstor|obrt|krov|fasad/i, 'trade-local'],
  [/račun|odvjet|konzult|savjet|agenc|b2b|ured/i, 'professional-authority'],
];
export function chooseDesignSystem(industry: string): DesignSystemKey {
  return INDUSTRY_RULES.find(([pattern]) => pattern.test(industry))?.[1] ?? 'professional-authority';
}

const REAL_BUSINESS_PROVENANCE = new Set(['business-website', 'business-social', 'client-provided']);
function isVerifiedRealAsset(asset: VisualAsset): boolean {
  return Boolean(asset.verifiedAt && REAL_BUSINESS_PROVENANCE.has(asset.provenance));
}

export function chooseHealthTrustArtDirection(lead: ResearchedLead): { artDirection: HealthTrustArtDirection; reason: string } {
  const doctorPortrait = lead.visualAssets.find((asset) =>
    asset.role === 'doctor' && asset.heroEligible && asset.depictsNamedPerson && Boolean(asset.namedPerson) && isVerifiedRealAsset(asset));
  const clinicAssets = lead.visualAssets.filter((asset) =>
    (asset.role === 'clinic' || asset.role === 'equipment') && asset.heroEligible && isVerifiedRealAsset(asset));
  if (doctorPortrait) return {
    artDirection: 'doctor-first',
    reason: `Verified real portrait available for ${doctorPortrait.namedPerson}; professional can safely lead the first viewport.`,
  };
  if (clinicAssets.length) return {
    artDirection: 'clinic-first',
    reason: `${clinicAssets.length} verified clinic/facility asset${clinicAssets.length === 1 ? '' : 's'} available; no verified named-person portrait selected.`,
  };
  return { artDirection: 'pet-first', reason: 'No stronger verified doctor or clinic visual path; use the warm pet-first default.' };
}

const ANGLES: Record<DesignSystemKey, { headline: (name: string) => string; description: string; accent: string; tone: 'light' | 'dark' | 'mixed' }> = {
  'automotive-performance': { headline: (name) => `${name}. Precizno do sljedećeg zahvata.`, description: 'Jasan pregled usluga i izravan kontakt, prilagođen odluci u pokretu.', accent: '#e5b90b', tone: 'dark' },
  'health-trust': { headline: (name) => `${name}. Stručna skrb uz jasan prvi korak.`, description: 'Provjerene usluge, kontakt i najvažnije činjenice dostupni su odmah.', accent: '#174b36', tone: 'light' },
  'beauty-editorial': { headline: (name) => `${name}, u ritmu vašeg termina.`, description: 'Usluge, atmosfera i kontakt složeni su u profinjeno mobilno iskustvo.', accent: '#8b3046', tone: 'light' },
  'hospitality-immersive': { headline: (name) => `${name}. Mjesto koje počinje prije dolaska.`, description: 'Fotografija, lokacija i kontakt vode gosta prema jednostavnom sljedećem koraku.', accent: '#b9784f', tone: 'dark' },
  'trade-local': { headline: (name) => `${name}. Jasno što radite i kako vas dobiti.`, description: 'Izravna prezentacija usluga i kontakt podataka za ljude koji trebaju brzo rješenje.', accent: '#2563eb', tone: 'light' },
  'professional-authority': { headline: (name) => `${name}, stručnost predstavljena bez viška.`, description: 'Usluge, kontekst i kontakt u preglednoj strukturi koja gradi povjerenje činjenicama.', accent: '#2455a6', tone: 'light' },
};

function firstFact(lead: ResearchedLead, pattern: RegExp): string | undefined {
  const entry = Object.entries(lead.facts).find(([field]) => pattern.test(field));
  return entry ? String(entry[1]) : undefined;
}
function healthHeadline(lead: ResearchedLead, direction?: HealthTrustArtDirection): string {
  if (direction === 'clinic-first') return 'Stručna skrb. Mirna i jasna ambulanta.';
  if (direction === 'doctor-first') return 'Skrb kojoj možete pristupiti s povjerenjem.';
  return 'Pažljiva skrb za vaše ljubimce.';
}
function healthDescription(lead: ResearchedLead): string {
  const experience = firstFact(lead, /experience|godina|years/i);
  return `${lead.businessName}${lead.city ? ` u ${lead.city}` : ''} predstavlja provjerene usluge i izravan kontakt${experience ? ` uz javno navedeno iskustvo: ${experience}` : ''}.`;
}
function neutralAbout(lead: ResearchedLead): string {
  const leadProfessional = firstFact(lead, /team\.lead|doctor|vet|lead_professional|\.lead$/i);
  return [
    `${lead.businessName} je ${lead.industry.toLowerCase()}${lead.city ? ` u ${lead.city}` : ''}.`,
    leadProfessional ? `Javno navedeni stručni voditelj je ${leadProfessional}.` : '',
    'Demo prikazuje samo podatke i usluge vezane uz provjerene izvore.',
  ].filter(Boolean).join(' ');
}
function chooseHeroAsset(lead: ResearchedLead, direction?: HealthTrustArtDirection): VisualAsset | undefined {
  if (direction === 'doctor-first') return lead.visualAssets.find((a) => a.role === 'doctor' && a.heroEligible && a.depictsNamedPerson && isVerifiedRealAsset(a));
  if (direction === 'clinic-first') return lead.visualAssets.find((a) => (a.role === 'clinic' || a.role === 'equipment') && a.heroEligible && isVerifiedRealAsset(a));
  if (direction === 'pet-first') return lead.visualAssets.find((a) => a.role === 'pet' && a.heroEligible) || lead.visualAssets.find((a) => a.kind === 'hero' && a.heroEligible);
  return lead.visualAssets.find((a) => a.kind === 'hero' && a.heroEligible);
}

export class DeterministicCopyProvider implements CopyProvider {
  async build(lead: ResearchedLead, designSystemKey: DesignSystemKey, artDirection?: HealthTrustArtDirection): Promise<DemoContent> {
    const angle = ANGLES[designSystemKey];
    const sourceFields = new Set(lead.sources.map((source) => source.field));
    const proofPoints = Object.entries(lead.facts)
      .filter(([field]) => sourceFields.has(field)).slice(0, 5)
      .map(([field, value]) => ({ value: String(value), label: humanizeField(field), sourceField: field }));
    const primaryHref = lead.publicPhone ? `tel:${lead.publicPhone}` : lead.publicEmail ? `mailto:${lead.publicEmail}` : '#kontakt';
    const address = Object.entries(lead.facts).find(([field]) => /(^|\.)(address|location)$/i.test(field))?.[1];
    const hero = chooseHeroAsset(lead, artDirection);
    return {
      brand: { name: lead.businessName, industry: lead.industry, location: lead.city },
      contact: { phone: lead.publicPhone, email: lead.publicEmail, website: lead.websiteUrl, address: typeof address === 'string' ? address : undefined },
      hero: {
        headline: designSystemKey === 'health-trust' ? healthHeadline(lead, artDirection) : angle.headline(lead.businessName),
        description: designSystemKey === 'health-trust' ? healthDescription(lead) : angle.description,
        imageUrl: hero?.url,
      },
      primaryCta: { label: lead.publicPhone ? 'Nazovite ambulantu' : lead.publicEmail ? 'Pošaljite upit' : 'Kontakt', href: primaryHref },
      secondaryCta: { label: 'Pogledajte usluge', href: '#usluge' },
      services: lead.services,
      proofPoints,
      about: { title: designSystemKey === 'health-trust' ? 'O ambulanti' : `O poslovanju ${lead.businessName}`, body: neutralAbout(lead) },
      sources: lead.sources,
      visual: { accent: angle.accent, tone: angle.tone, imagePosition: 'center' },
      assets: lead.visualAssets,
      verifiedObservations: lead.verifiedObservations,
    };
  }
}

const DEFAULT_HEALTH_TRUST_ASSETS: VisualAsset[] = [
  {
    kind: 'hero', role: 'pet',
    url: 'https://nepar.hr/health-trust-default/hero.webp',
    alt: 'Reprezentativna fotografija veterinarske ambulante (generički prikaz, nije stvarna lokacija)',
    sourceUrl: 'https://nepar.hr/health-trust-default/',
    provenance: 'nepar-owned',
    verifiedAt: '2026-08-24T00:00:00.000Z',
    depictsNamedPerson: false,
    heroEligible: true,
  },
  {
    kind: 'gallery', role: 'clinic',
    url: 'https://nepar.hr/health-trust-default/about.webp',
    alt: 'Reprezentativna fotografija ordinacije s dijagnostičkom opremom (generički prikaz, nije stvarna lokacija)',
    sourceUrl: 'https://nepar.hr/health-trust-default/',
    provenance: 'nepar-owned',
    verifiedAt: '2026-08-24T00:00:00.000Z',
    depictsNamedPerson: false,
    heroEligible: false,
  },
];

export async function buildDemoPayload(lead: ResearchedLead, provider: CopyProvider = new DeterministicCopyProvider()): Promise<CreateDemoInput> {
  const designSystemKey = chooseDesignSystem(lead.industry);
  // Leads ingested without their own photography (e.g. the GitHub research queue) get a
  // neutral, clearly-labelled generic image rather than an empty placeholder. Never used
  // for doctor-first/clinic-first selection: chooseHealthTrustArtDirection still requires
  // real verified imagery for those, this only backstops the pet-first default.
  const effectiveLead = designSystemKey === 'health-trust' && lead.visualAssets.length === 0
    ? { ...lead, visualAssets: DEFAULT_HEALTH_TRUST_ASSETS }
    : lead;
  const selection = designSystemKey === 'health-trust' ? chooseHealthTrustArtDirection(effectiveLead) : undefined;
  const content = await provider.build(effectiveLead, designSystemKey, selection?.artDirection);
  return createDemoSchema.parse({
    slug: lead.slug,
    businessName: lead.businessName,
    designSystemKey,
    artDirection: selection?.artDirection,
    artDirectionReason: selection?.reason,
    generationVersion: 'deterministic-v2',
    sourceUrl: lead.websiteUrl,
    leadEmail: lead.publicEmail,
    content,
    attachDomain: true,
    outreach: {
      prospectName: lead.businessName,
      recipientEmail: lead.publicEmail,
      verifiedObservations: lead.verifiedObservations,
      proposedServiceAngle: lead.proposedServiceAngle,
    },
  });
}

function humanizeField(field: string): string {
  const label = field.split('.').at(-1)?.replaceAll('_', ' ') || field;
  const translations: Record<string, string> = { location: 'Lokacija', address: 'Adresa', contact: 'Kontakt', services: 'Usluge', experience: 'Iskustvo', years: 'Godine iskustva', lead: 'Stručni voditelj', diagnostics: 'Dijagnostika' };
  return translations[label] || label.charAt(0).toUpperCase() + label.slice(1);
}
