import { escapeHtml } from './schema';
import type { DemoRow, RuntimeEnv } from './models';

export interface OutreachJson {
  prospectName: string;
  recipientEmail?: string;
  verifiedObservations: string[];
  proposedServiceAngle: string;
}

export interface ComposedEmail {
  to: string;
  subject: string;
  html: string;
  text: string;
}

const SENDER = { email: 'nepar@nepar.hr', name: 'Nepar' };

export function parseOutreachJson(demo: DemoRow): OutreachJson | null {
  if (!demo.outreach_json) return null;
  try {
    const raw = JSON.parse(demo.outreach_json) as Partial<OutreachJson>;
    if (!raw.prospectName || !Array.isArray(raw.verifiedObservations) || !raw.proposedServiceAngle) return null;
    return {
      prospectName: raw.prospectName,
      recipientEmail: raw.recipientEmail,
      verifiedObservations: raw.verifiedObservations,
      proposedServiceAngle: raw.proposedServiceAngle,
    };
  } catch {
    return null;
  }
}

export function demoUrl(demo: DemoRow, rootDomain: string): string {
  return `https://${demo.slug}.${rootDomain}`;
}

interface BrandHint { city?: string; industry?: string }

function brandHint(demo: DemoRow): BrandHint {
  try {
    const content = JSON.parse(demo.content_json) as { brand?: { location?: string; industry?: string } };
    return { city: content.brand?.location, industry: content.brand?.industry };
  } catch {
    return {};
  }
}

const CITY_LOCATIVE: Record<string, string> = {
  'Zagreb': 'Zagrebu',
  'Pula': 'Puli',
  'Poreč': 'Poreču',
  'Pazin': 'Pazinu',
  'Split': 'Splitu',
  'Rijeka': 'Rijeci',
  'Osijek': 'Osijeku',
  'Zadar': 'Zadru',
  'Varaždin': 'Varaždinu',
  'Šibenik': 'Šibeniku',
  'Dubrovnik': 'Dubrovniku',
  'Karlovac': 'Karlovcu',
};
function cityLocative(city?: string): string | undefined {
  if (!city) return undefined;
  return CITY_LOCATIVE[city] || `mjestu ${city}`;
}

function audienceNoun(industry?: string): string {
  return industry && /veter/i.test(industry) ? 'vlasnika pasa i mačaka' : 'potencijalnih klijenata';
}

function searchPhrase(industry?: string, city?: string): string {
  const base = industry && /veter/i.test(industry) ? 'dobar veterinar' : (industry?.toLowerCase() || 'ova usluga');
  const locative = cityLocative(city);
  return locative ? `${base} u ${locative}` : base;
}

export function composeOutreachEmail(demo: DemoRow, env: RuntimeEnv): ComposedEmail | null {
  const outreach = parseOutreachJson(demo);
  if (!outreach || !outreach.recipientEmail) return null;
  const url = demoUrl(demo, env.ROOT_DOMAIN);
  const { city, industry } = brandHint(demo);
  const cityLabel = cityLocative(city) || 'vašem gradu';
  const audience = audienceNoun(industry);
  const query = searchPhrase(industry, city);
  const observation = outreach.verifiedObservations[0];

  const subject = `Zašto vas ne pronalaze svi koji traže "${query}"?`;

  const paras = [
    `Koliko ${audience} u ${cityLabel} ovaj tjedan ode konkurenciji, jednostavno zato što vas nisu dovoljno lako pronašli online?`,
    `Pogledali smo javno dostupne podatke o <strong>${escapeHtml(outreach.prospectName)}</strong> i napravili konkretan, besplatan prijedlog novog weba — s vašim pravim uslugama i kontaktom, ne generičkim predloškom.`,
    observation ? escapeHtml(observation) : null,
    `Kad netko danas upita Google ili ChatGPT "${escapeHtml(query)}", cilj je da se pojavite vi, a ne netko drugi. Jasno posložena stranica povećava šansu da vas ti sustavi prepoznaju i preporuče — to, naravno, nitko ne može garantirati.`,
    `Pogledajte prijedlog ovdje (30 sekundi): <a href="${escapeHtml(url)}">${escapeHtml(url)}</a>`,
    `Ako vam ima smisla, javimo se pa popričamo.`,
  ].filter((p): p is string => Boolean(p));

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#17312d;line-height:1.6;max-width:560px">
<p>Poštovani,</p>
${paras.map((p) => `<p>${p}</p>`).join('\n')}
<p>Srdačan pozdrav,<br>Nepar<br><a href="mailto:nepar@nepar.hr">nepar@nepar.hr</a></p>
</div>`;

  const plainParas = [
    `Koliko ${audience} u ${cityLabel} ovaj tjedan ode konkurenciji, jednostavno zato što vas nisu dovoljno lako pronašli online?`,
    `Pogledali smo javno dostupne podatke o ${outreach.prospectName} i napravili konkretan, besplatan prijedlog novog weba — s vašim pravim uslugama i kontaktom, ne generičkim predloškom.`,
    observation || null,
    `Kad netko danas upita Google ili ChatGPT "${query}", cilj je da se pojavite vi, a ne netko drugi. Jasno posložena stranica povećava šansu da vas ti sustavi prepoznaju i preporuče — to, naravno, nitko ne može garantirati.`,
    `Pogledajte prijedlog ovdje (30 sekundi): ${url}`,
    `Ako vam ima smisla, javimo se pa popričamo.`,
  ].filter((p): p is string => Boolean(p));

  const text = `Poštovani,\n\n${plainParas.join('\n\n')}\n\nSrdačan pozdrav,\nNepar\nnepar@nepar.hr`;

  return { to: outreach.recipientEmail, subject, html, text };
}

export async function sendOutreachEmail(env: RuntimeEnv, email: ComposedEmail): Promise<string> {
  const response = await env.EMAIL.send({
    to: email.to,
    from: SENDER,
    subject: email.subject,
    html: email.html,
    text: email.text,
  });
  return response.messageId;
}
