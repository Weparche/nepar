import type { DemoRow, RuntimeEnv } from './models';
import { type QaReport } from './schema';
import { DESIGN_VERSION, type V3Qa } from './health-trust-v3-contract';

export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') return `{${Object.entries(value).filter(([,v]) => v !== undefined).sort(([a],[b]) => a.localeCompare(b)).map(([k,v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(',')}}`;
  return JSON.stringify(value);
}
export async function digest(value: string | ArrayBuffer): Promise<string> {
  const bytes = typeof value === 'string' ? new TextEncoder().encode(value) : value;
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))).map(n => n.toString(16).padStart(2,'0')).join('');
}
export async function contentFingerprint(d: Pick<DemoRow, 'design_version' | 'art_direction' | 'content_json' | 'slug'>): Promise<string> {
  return digest(canonical({ designVersion: d.design_version, visualDirection: d.art_direction, slug: d.slug, content: JSON.parse(d.content_json) }));
}
export async function reviewFingerprint(v: V3Qa): Promise<string> {
  return digest(canonical({ contentFingerprint: v.contentFingerprint, captures: v.captures.map(({designJudgment: _judgment, ...capture}) => capture).sort((a,b) => a.viewport.localeCompare(b.viewport)) }));
}
export async function v3ReportReady(report: QaReport, fingerprint: string): Promise<boolean> {
  const v = report.v3;
  if (!v || v.contentFingerprint !== fingerprint || report.status !== 'passed' || report.technicalScore < 90 || report.consoleErrors.length || report.brokenImages.length) return false;
  if (new Set(report.viewports.map(v => v.name)).size !== 2 || report.viewports.some(v => v.checks.some(c => !c.passed))) return false;
  const expected = await reviewFingerprint(v);
  return v.captures.every(c => c.referenceSha256 && c.technicalScore >= 90 && c.geometryScore >= 88 && c.designJudgment && c.designJudgment.score >= 90 && c.designJudgment.reviewFingerprint === expected && !c.designJudgment.findings.some(f => f.severity === 'critical'));
}
export async function validateV3Captures(env: RuntimeEnv, d: DemoRow, report: QaReport): Promise<boolean> {
  if (d.design_version !== DESIGN_VERSION || !report.v3 || report.v3.contentFingerprint !== await contentFingerprint(d)) return false;
  for (const capture of report.v3.captures) {
    const key = capture.viewport === 'desktop' ? d.desktop_screenshot_key : d.mobile_screenshot_key;
    if (!key || report.viewports.find(v => v.name === capture.viewport)?.screenshotKey !== key) return false;
    const object = await env.ASSETS.get(key);
    if (!object || await digest(await object.arrayBuffer()) !== capture.screenshotSha256) return false;
  }
  return true;
}
