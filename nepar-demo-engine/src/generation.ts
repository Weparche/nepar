import type { DesignSystemKey } from './models';
import { createDemoSchema, type CreateDemoInput, type DemoContent, type ResearchedLead } from './schema';

export interface CopyProvider {
  build(lead: ResearchedLead, designSystemKey: DesignSystemKey): Promise<DemoContent>;
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

const ANGLES: Record<DesignSystemKey, { headline: (name: string) => string; description: string; accent: string; tone: 'light' | 'dark' | 'mixed' }> = {
  'automotive-performance': { headline: (name) => `${name}. Precizno do sljedećeg zahvata.`, description: 'Jasan pregled usluga i izravan kontakt, prilagođen odluci u pokretu.', accent: '#e5b90b', tone: 'dark' },
  'health-trust': { headline: (name) => `${name}, uz miran i jasan prvi korak.`, description: 'Bitne informacije i kontakt dostupni su bez traženja i bez neprovjerenih obećanja.', accent: '#287f70', tone: 'light' },
  'beauty-editorial': { headline: (name) => `${name}, u ritmu vašeg termina.`, description: 'Usluge, atmosfera i kontakt složeni su u profinjeno mobilno iskustvo.', accent: '#8b3046', tone: 'light' },
  'hospitality-immersive': { headline: (name) => `${name}. Mjesto koje počinje prije dolaska.`, description: 'Fotografija, lokacija i kontakt vode gosta prema jednostavnom sljedećem koraku.', accent: '#b9784f', tone: 'dark' },
  'trade-local': { headline: (name) => `${name}. Jasno što radite i kako vas dobiti.`, description: 'Izravna prezentacija usluga i kontakt podataka za ljude koji trebaju brzo rješenje.', accent: '#2563eb', tone: 'light' },
  'professional-authority': { headline: (name) => `${name}, stručnost predstavljena bez viška.`, description: 'Usluge, kontekst i kontakt u preglednoj strukturi koja gradi povjerenje činjenicama.', accent: '#2455a6', tone: 'light' },
};

export class DeterministicCopyProvider implements CopyProvider {
  async build(lead: ResearchedLead, designSystemKey: DesignSystemKey): Promise<DemoContent> {
    const angle = ANGLES[designSystemKey];
    const sourceFields = new Set(lead.sources.map((source) => source.field));
    const proofPoints = Object.entries(lead.facts)
      .filter(([field]) => sourceFields.has(field))
      .slice(0, 4)
      .map(([field, value]) => ({ value: String(value), label: humanizeField(field), sourceField: field }));
    const primaryHref = lead.publicPhone ? `tel:${lead.publicPhone}` : lead.publicEmail ? `mailto:${lead.publicEmail}` : '#kontakt';
    return {
      brand: { name: lead.businessName, industry: lead.industry, location: lead.city },
      contact: { phone: lead.publicPhone, email: lead.publicEmail, website: lead.websiteUrl },
      hero: { headline: angle.headline(lead.businessName), description: angle.description, imageUrl: lead.visualAssets.find((asset) => asset.kind === 'hero')?.url },
      primaryCta: { label: lead.publicPhone ? 'Nazovite' : lead.publicEmail ? 'Pošaljite upit' : 'Kontakt', href: primaryHref },
      secondaryCta: { label: 'Pogledajte usluge', href: '#usluge' },
      services: lead.services,
      proofPoints,
      about: {
        title: `O poslovanju ${lead.businessName}`,
        body: lead.verifiedObservations[0] || 'Ovaj demo koristi samo dostavljene i provjerljive poslovne podatke; detalji se mogu dopuniti nakon razgovora.',
      },
      sources: lead.sources,
      visual: { accent: angle.accent, tone: angle.tone, imagePosition: 'center' },
      assets: lead.visualAssets,
      verifiedObservations: lead.verifiedObservations,
    };
  }
}

export async function buildDemoPayload(lead: ResearchedLead, provider: CopyProvider = new DeterministicCopyProvider()): Promise<CreateDemoInput> {
  const designSystemKey = chooseDesignSystem(lead.industry);
  const content = await provider.build(lead, designSystemKey);
  return createDemoSchema.parse({
    slug: lead.slug,
    businessName: lead.businessName,
    designSystemKey,
    generationVersion: 'deterministic-v1',
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
  const translations: Record<string, string> = { location: 'Lokacija', contact: 'Kontakt', services: 'Usluge' };
  return translations[label] || label.charAt(0).toUpperCase() + label.slice(1);
}
