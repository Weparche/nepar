import type { DemoRow } from './models';
import type { DemoContent } from './schema';
import { renderHealthTrustDemo } from './health-trust';
import { pageHeaders, renderDemo as renderLegacyDemo, renderNotFound } from './templates';

export function renderDemo(demo: DemoRow, content: DemoContent): string {
  if (demo.design_system_key === 'health-trust') return renderHealthTrustDemo(demo, content);
  return renderLegacyDemo(demo, content);
}

export { pageHeaders, renderNotFound };
