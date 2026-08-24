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
  return demo.custom_domain_id ? `https://${demo.slug}.${rootDomain}` : `https://${demo.slug}.${rootDomain}`;
}

export function composeOutreachEmail(demo: DemoRow, env: RuntimeEnv): ComposedEmail | null {
  const outreach = parseOutreachJson(demo);
  if (!outreach || !outreach.recipientEmail) return null;
  const url = demoUrl(demo, env.ROOT_DOMAIN);
  const observations = outreach.verifiedObservations.map((line) => `<li>${escapeHtml(line)}</li>`).join('');
  const observationsText = outreach.verifiedObservations.map((line) => `- ${line}`).join('\n');
  const subject = `Prijedlog novog weba za ${outreach.prospectName}`;
  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#17312d;line-height:1.6;max-width:560px">
<p>Poštovani,</p>
<p>Pripremili smo besplatan prijedlog novog weba za <strong>${escapeHtml(outreach.prospectName)}</strong>, na temelju javno dostupnih podataka:</p>
<ul>${observations}</ul>
<p>${escapeHtml(outreach.proposedServiceAngle)}</p>
<p>Pogledajte prijedlog ovdje: <a href="${escapeHtml(url)}">${escapeHtml(url)}</a></p>
<p>Javite nam se ako Vas zanima suradnja ili imate pitanja — bez obaveze.</p>
<p>Srdačan pozdrav,<br>Nepar<br><a href="mailto:nepar@nepar.hr">nepar@nepar.hr</a></p>
</div>`;
  const text = `Poštovani,\n\nPripremili smo besplatan prijedlog novog weba za ${outreach.prospectName}, na temelju javno dostupnih podataka:\n${observationsText}\n\n${outreach.proposedServiceAngle}\n\nPogledajte prijedlog ovdje: ${url}\n\nJavite nam se ako Vas zanima suradnja ili imate pitanja — bez obaveze.\n\nSrdačan pozdrav,\nNepar\nnepar@nepar.hr`;
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
