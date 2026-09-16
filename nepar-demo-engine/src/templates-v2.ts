import type { DemoRow } from './models';
import type { DemoContent } from './schema';
import { renderHealthTrustDemo } from './health-trust';
import { renderHealthTrustV3 } from './health-trust-v3';
import { DESIGN_VERSION } from './health-trust-v3-contract';
import { pageHeaders, renderDemo as renderLegacyDemo, renderNotFound } from './templates';

export function renderDemo(demo: DemoRow, content: DemoContent): string {
  if (demo.design_version) {
    if (demo.design_version !== DESIGN_VERSION || demo.design_system_key !== 'health-trust') throw new Error('Unknown renderer version.');
    return renderHealthTrustV3(demo, content);
  }
  if (demo.design_system_key === 'health-trust') return renderHealthTrustDemo(demo, content);
  return renderLegacyDemo(demo, content);
}

export { pageHeaders, renderNotFound };
