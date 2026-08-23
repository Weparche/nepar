import type { HealthTrustArtDirection, VisualQaStatus } from './models';

export interface RectMeasurement { x: number; y: number; width: number; height: number }
export interface VisualMeasurement {
  viewport: 'desktop' | 'mobile'; viewportWidth: number; viewportHeight: number;
  hero?: RectMeasurement; heroImage?: RectMeasurement; headline?: RectMeasurement;
  primaryCta?: RectMeasurement; trustStrip?: RectMeasurement; services?: RectMeasurement;
  stickyCall?: RectMeasurement; artDirection?: string;
}
export interface VisualCheck { viewport: 'desktop' | 'mobile'; name: string; passed: boolean; weight: number; detail?: string }
interface ReferenceProfile {
  heroMinPx: number; heroMaxPx: number; imageWidthMinRatio: number; headlineWidthMaxRatio: number;
  ctaTopMaxRatio: number; trustTopMaxRatio: number; servicesTopMaxRatio: number; stickyCallRequired: boolean;
}

const REFERENCE_PROFILES: Record<HealthTrustArtDirection, Record<'desktop' | 'mobile', ReferenceProfile>> = {
  'pet-first': {
    desktop: { heroMinPx: 500, heroMaxPx: 780, imageWidthMinRatio: .40, headlineWidthMaxRatio: .54, ctaTopMaxRatio: .82, trustTopMaxRatio: 1.15, servicesTopMaxRatio: 1.75, stickyCallRequired: false },
    mobile: { heroMinPx: 620, heroMaxPx: 1250, imageWidthMinRatio: .82, headlineWidthMaxRatio: .96, ctaTopMaxRatio: 1.12, trustTopMaxRatio: 1.55, servicesTopMaxRatio: 2.45, stickyCallRequired: true },
  },
  'doctor-first': {
    desktop: { heroMinPx: 500, heroMaxPx: 800, imageWidthMinRatio: .43, headlineWidthMaxRatio: .52, ctaTopMaxRatio: .82, trustTopMaxRatio: 1.15, servicesTopMaxRatio: 1.75, stickyCallRequired: false },
    mobile: { heroMinPx: 620, heroMaxPx: 1250, imageWidthMinRatio: .82, headlineWidthMaxRatio: .96, ctaTopMaxRatio: 1.15, trustTopMaxRatio: 1.55, servicesTopMaxRatio: 2.5, stickyCallRequired: true },
  },
  'clinic-first': {
    desktop: { heroMinPx: 520, heroMaxPx: 820, imageWidthMinRatio: .68, headlineWidthMaxRatio: .50, ctaTopMaxRatio: .84, trustTopMaxRatio: 1.15, servicesTopMaxRatio: 1.78, stickyCallRequired: false },
    mobile: { heroMinPx: 650, heroMaxPx: 1280, imageWidthMinRatio: .88, headlineWidthMaxRatio: .96, ctaTopMaxRatio: 1.18, trustTopMaxRatio: 1.62, servicesTopMaxRatio: 2.55, stickyCallRequired: true },
  },
};

const ratio = (value: number, denominator: number) => denominator > 0 ? value / denominator : 0;
function add(checks: VisualCheck[], viewport: 'desktop' | 'mobile', name: string, passed: boolean, weight: number, detail?: string): void {
  checks.push({ viewport, name, passed, weight, ...(detail ? { detail } : {}) });
}

export function evaluateHealthTrustVisual(artDirection: HealthTrustArtDirection, measurement: VisualMeasurement): VisualCheck[] {
  const p = REFERENCE_PROFILES[artDirection][measurement.viewport];
  const checks: VisualCheck[] = [];
  const { hero, heroImage: image, headline, primaryCta: cta, trustStrip: trust, services } = measurement;
  add(checks, measurement.viewport, 'art_direction_matches', measurement.artDirection === artDirection, 12, measurement.artDirection || 'missing');
  add(checks, measurement.viewport, 'hero_present', Boolean(hero), 12);
  add(checks, measurement.viewport, 'hero_height_matches_reference', Boolean(hero && hero.height >= p.heroMinPx && hero.height <= p.heroMaxPx), 10, hero ? `${Math.round(hero.height)}px` : 'missing');
  add(checks, measurement.viewport, 'hero_image_present', Boolean(image), 12);
  add(checks, measurement.viewport, 'hero_image_dominance', Boolean(image && ratio(image.width, measurement.viewportWidth) >= p.imageWidthMinRatio), 10, image ? `${Math.round(ratio(image.width, measurement.viewportWidth) * 100)}% viewport width` : 'missing');
  add(checks, measurement.viewport, 'headline_present', Boolean(headline), 10);
  add(checks, measurement.viewport, 'headline_width_controlled', Boolean(headline && ratio(headline.width, measurement.viewportWidth) <= p.headlineWidthMaxRatio), 8, headline ? `${Math.round(ratio(headline.width, measurement.viewportWidth) * 100)}% viewport width` : 'missing');
  add(checks, measurement.viewport, 'primary_cta_in_early_flow', Boolean(cta && ratio(cta.y, measurement.viewportHeight) <= p.ctaTopMaxRatio), 10, cta ? `y=${Math.round(cta.y)}px` : 'missing');
  add(checks, measurement.viewport, 'trust_strip_near_hero', Boolean(trust && ratio(trust.y, measurement.viewportHeight) <= p.trustTopMaxRatio), 7, trust ? `y=${Math.round(trust.y)}px` : 'missing');
  add(checks, measurement.viewport, 'services_enter_early', Boolean(services && ratio(services.y, measurement.viewportHeight) <= p.servicesTopMaxRatio), 5, services ? `y=${Math.round(services.y)}px` : 'missing');
  add(checks, measurement.viewport, 'mobile_sticky_call', !p.stickyCallRequired || Boolean(measurement.stickyCall && measurement.stickyCall.height >= 44), 4, measurement.stickyCall ? `${Math.round(measurement.stickyCall.height)}px` : 'missing');
  return checks;
}

export function scoreVisualChecks(checks: VisualCheck[]): number {
  const total = checks.reduce((sum, check) => sum + check.weight, 0);
  if (!total) return 0;
  const passed = checks.reduce((sum, check) => sum + (check.passed ? check.weight : 0), 0);
  return Math.round((passed / total) * 100);
}
export function visualStatus(score: number): VisualQaStatus { return score >= 88 ? 'passed' : 'needs_visual_review' }
export function isOutreachReady(technicalScore: number, visualScore: number, status: VisualQaStatus | null | undefined): boolean {
  return technicalScore >= 90 && visualScore >= 88 && status === 'passed';
}
export function genericVisualChecks(measurement: VisualMeasurement): VisualCheck[] {
  const checks: VisualCheck[] = [];
  add(checks, measurement.viewport, 'hero_present', Boolean(measurement.hero), 25);
  add(checks, measurement.viewport, 'headline_present', Boolean(measurement.headline), 25);
  add(checks, measurement.viewport, 'primary_cta_present', Boolean(measurement.primaryCta), 25);
  add(checks, measurement.viewport, 'services_present', Boolean(measurement.services), 25);
  return checks;
}
