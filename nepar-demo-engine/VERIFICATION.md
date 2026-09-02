# Verification record

Verified locally on 2026-08-22 from `feat/nepar-demo-engine`.

## Automated gates

- `npm install`: completed with zero reported vulnerabilities.
- `npm run check:types`: generated Worker types are current.
- `npm run typecheck`: passed.
- `npm test`: 15 of 15 Vitest tests passed in the Cloudflare Workers test runtime.
- `npm run deploy -- --dry-run`: passed; bundle size was 627.37 KiB (102.71 KiB gzip).
- `npm run verify`: passed as the combined final gate.

The test suite covers hostname routing, reserved slugs, authentication, validation and provenance, content safety, expiry, idempotency and key-reuse conflicts, domain attach/DNS conflict/detach behavior, create rollback, and all six design-system renderers.

## Local end-to-end checks

- D1 migrations `0001_mvp.sql` and `0002_production_pipeline.sql` were applied to the local database. A fresh isolated migration is also exercised by the test runtime.
- `examples/fabela.json` was generated through the lead and demo APIs with domain attachment disabled for local development.
- The public Fabela page passed Playwright QA at 1440 x 1000 and 390 x 844. The checks include HTTP status, title, horizontal overflow, browser-console errors, image loading, CTA/contact presence, unresolved template markers, empty sections, anchor targets, and heading structure.
- The internal dashboard passed Playwright QA at desktop and mobile sizes. The mobile check also verifies the detail drawer's `aria-hidden`/`inert` lifecycle, Escape-to-close behavior, absence of raw machine statuses, horizontal overflow, and browser-console errors.
- Approval was verified as a human-action workflow event. The response reported `emailSent: false`; the engine does not send outreach automatically.
- Scheduled expiry was verified: the demo became `expired`, its attached-domain reference was cleared, and view/screenshot evidence remained retained.

Local visual evidence is written to the ignored `qa-output/` directory:

- `fabela-desktop.png`
- `fabela-mobile.png`
- `fabela-report.json`
- `dashboard-desktop.png`
- `dashboard-mobile.png`

## Production boundary

No remote Cloudflare resources were mutated and no real `fabela.nepar.hr` custom domain was attached during this run. The Workers Custom Domains request paths and rollback behavior are covered by deterministic tests; a real attach requires production Cloudflare credentials, the deployed D1/R2 resources, and the production database identifier described in `README.md`.
