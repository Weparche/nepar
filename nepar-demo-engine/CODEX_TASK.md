# Codex task: NEPAR Demo Engine — productionize the 10 demos/day sales pipeline

## Context

NEPAR wants an internal outbound sales engine that can prepare up to 10 high-quality personalized demo websites per workday for Croatian SMB prospects. Each approved prospect gets a temporary subdomain such as `fabela.nepar.hr`. The demo is sent only after human approval.

The current MVP in this directory already provides:

- Cloudflare Worker multi-tenant routing by hostname
- D1 schema for demos and page-view events
- admin API to create/list/archive demos
- Cloudflare Workers Custom Domain attach/detach through the official API
- seven-day default expiry
- scheduled cleanup
- one premium local-service renderer

Do not rewrite this blindly. Inspect it first, run typecheck/tests, preserve working behavior, and improve incrementally.

## Primary goal

Turn the MVP into a reliable internal production tool that supports this workflow:

`lead -> verified public data -> vertical template -> generated content/assets -> demo -> Playwright QA -> screenshot -> human approval -> email -> visit/reply/conversion tracking`

The first production milestone is NOT fully autonomous emailing. The system must stop at an approval gate before any prospect email can be sent.

## Required architecture

Keep the runtime Cloudflare-native unless there is a strong technical reason not to:

- Cloudflare Worker as public/admin API runtime
- D1 for demo/lead/workflow state
- R2 for generated images/screenshots when needed
- Cloudflare Workers Custom Domains for temporary `slug.nepar.hr` hostnames
- Playwright for visual/functional QA
- TypeScript

Avoid one deployment per prospect. One Worker must serve all demo hostnames.

## Cloudflare domain behavior

Use the official Workers Domains API:

- attach: `PUT /accounts/{account_id}/workers/domains`
- detach: `DELETE /accounts/{account_id}/workers/domains/{domain_id}`
- attach body contains `hostname`, `service`, and `zone_name` or `zone_id`

Do not use wildcard Custom Domains: Workers Custom Domains require exact hostnames. The current Cloudflare limit is 100 Custom Domains per zone, so retain automatic expiry/cleanup and design for a rolling pool of active demos.

Never overwrite or take over reserved/production subdomains such as:

- `www.nepar.hr`
- `kids.nepar.hr`
- `animationstudios.nepar.hr`
- `sales.nepar.hr`
- any hostname already in Cloudflare DNS/Workers that is not owned by this engine

Before attaching a hostname, detect conflicts and fail safely.

## Workstream 1 — harden the existing Worker

1. Run TypeScript typecheck and fix any errors.
2. Add unit/integration tests for:
   - hostname -> slug resolution
   - reserved subdomains
   - expired demo handling
   - admin authorization
   - payload validation
   - safe URL/color rendering
   - Cloudflare attach/detach success and failure paths
3. Add structured API errors with stable error codes.
4. Add input size limits and strict validation for demo payloads.
5. Add idempotency for `POST /__admin/demos` so retries do not create inconsistent state.
6. Add a safe rollback path if D1 creation succeeds but Custom Domain attachment fails.
7. Keep `X-Robots-Tag: noindex, nofollow, noarchive` and meta robots on every prospect demo.
8. Do not expose admin secrets or Cloudflare IDs to public responses.

## Workstream 2 — richer demo data model

Add migrations without destroying existing data.

Add/normalize entities for:

### leads

- id
- business_name
- slug
- website_url
- google_business_url if available
- instagram_url if available
- facebook_url if available
- public_email
- public_phone
- city
- industry
- source
- score
- score_reasons_json
- research_json
- status (`new`, `researched`, `approved_for_demo`, `demo_ready`, `sent`, `replied`, `won`, `lost`, `rejected`)
- timestamps

### demos

Keep current fields and add where useful:

- lead_id
- design_system_key
- generation_version
- qa_status
- qa_report_json
- desktop_screenshot_key
- mobile_screenshot_key
- approved_at
- sent_at
- first_viewed_at
- last_viewed_at
- view_count

### demo_events

Support at least:

- page_view
- primary_cta_click
- secondary_cta_click
- phone_click
- email_click

Do not add invasive tracking or fingerprinting.

## Workstream 3 — vertical design systems

Build a small number of excellent reusable design systems, not dozens of generic AI templates.

Start with these six:

1. `automotive-performance`
   - repair shops, detailing, tyres, towing
   - strong technical/industrial visual language
2. `health-trust`
   - veterinary, dental, private clinics
   - clean, calm, trust-heavy
3. `beauty-editorial`
   - salons, cosmetics, wellness
   - editorial, refined, image-led
4. `hospitality-immersive`
   - apartments, villas, small hotels, restaurants
   - photography-led, booking/contact-first
5. `trade-local`
   - electricians, installers, carpenters, construction, handyman
   - direct, proof-heavy, conversion-first
6. `professional-authority`
   - accountants, lawyers, consultants, B2B services
   - restrained, authoritative, typography-led

Each design system must be clearly different in typography, spacing, hero composition, card treatment and content rhythm. Avoid the repeated AI pattern of gradient hero + three identical cards.

Reuse NEPAR quality standards where applicable, but demos should visually represent the prospect, not look like a reskinned nepar.hr.

## Workstream 4 — content schema

Create a strict TypeScript/Zod-style schema or equivalent validation layer for generated demo content.

Required fields should support:

- brand/business name
- industry
- verified contact data
- location
- hero copy
- CTA
- services
- proof points
- about copy
- source references for factual claims
- visual direction
- image assets

Every factual business claim must have provenance in the internal generation/research object. Do not render claims such as ratings, years in business, prices, certifications or awards unless verified.

If information cannot be verified, write neutral conversion copy rather than fabricating facts.

## Workstream 5 — generation package

Create a CLI/internal generation package that takes a researched lead JSON and outputs a validated demo payload.

Example command shape:

```bash
npm run generate -- --lead ./fixtures/fabela-research.json
```

Expected behavior:

1. validate lead research
2. choose design system based on industry
3. build structured copy
4. select/provide asset references
5. validate all outbound links/contact data
6. POST the payload to the demo engine admin API
7. return the preview/custom-domain URL

For this milestone, it is acceptable for AI copy/image generation calls to be represented behind provider interfaces with a deterministic fixture/mock implementation. Do not hard-code an external paid AI provider into core domain logic.

## Workstream 6 — Playwright QA

Create an automated QA command that opens the generated demo URL and checks both desktop and mobile.

At minimum test:

- 1440x1000 desktop
- 390x844 mobile
- no horizontal overflow
- no console errors
- no broken images
- page returns 200
- title exists
- primary CTA exists and target is valid
- phone/mail links match verified source data when present
- no placeholder markers such as `TODO`, `Lorem ipsum`, `zamijeni`, `placeholder`
- no obviously empty sections
- navigation anchors work
- key content remains visible above/below folds as intended

Save screenshots and a machine-readable QA report.

If `.impeccable` guidance exists at repository root and is applicable, use it for design review. Do not change existing NEPAR production design files unless required.

## Workstream 7 — internal approval dashboard

Build a minimal internal dashboard under the demo engine, protected by the existing admin auth mechanism or a stronger Cloudflare Access-compatible architecture.

Required views/actions:

### Leads

- list leads by status/score
- open research summary
- approve/reject for demo

### Demos

- preview URL
- desktop/mobile screenshots
- QA status
- expiry
- page-view count / first viewed / last viewed
- regenerate
- approve for outreach
- archive

No public signup. This is an internal NEPAR tool.

## Workstream 8 — outreach boundary

Do NOT automatically send email in this task.

Prepare a clean integration boundary/event for a later Gmail sender:

`demo_approved_for_outreach`

Store all data needed to draft an email:

- prospect name/business
- public recipient email
- demo URL
- one or two verified observations about the existing online presence
- proposed service angle

The future Gmail integration must still require an explicit human send/approval step unless a later task changes that requirement.

## Workstream 9 — expiry and domain pool

Retain seven-day default expiry but make it configurable per demo.

Cleanup must:

1. detach Cloudflare Custom Domain
2. mark demo expired
3. keep historical lead/demo analytics in D1
4. keep screenshots unless retention policy later removes them
5. never delete unrelated Cloudflare domains

Add a safety guard that refuses new domain attachment when the engine believes it is near the configured active-domain ceiling. Default operational ceiling: 80 active demo domains, leaving headroom below Cloudflare's 100-domain zone limit.

## Security requirements

- never commit Cloudflare tokens or admin tokens
- use Worker secrets for tokens
- reject unauthenticated admin API calls
- sanitize/validate URLs rendered into HTML
- keep CSP and noindex protections
- do not proxy arbitrary remote HTML through the Worker
- do not allow a generated payload to inject raw HTML/JS
- add rate limiting strategy/documentation for admin endpoints
- ensure deletes/expiry only act on domain IDs stored for demos owned by this engine

## Repository hygiene

The parent repository contains an existing NEPAR production frontend. Keep all new code isolated under `nepar-demo-engine/` unless a small root-level config change is absolutely necessary.

Do not modify or delete existing production files as part of this task.

## Deliverables

1. working TypeScript code
2. D1 migrations
3. at least six distinct design systems
4. deterministic fixtures for testing
5. Playwright QA suite
6. internal dashboard MVP
7. Cloudflare domain conflict safeguards
8. README with exact local + production setup
9. architecture notes explaining major decisions
10. final verification report containing commands run and their results

## Acceptance criteria

A developer with Cloudflare credentials should be able to:

1. clone repo and enter `nepar-demo-engine/`
2. install dependencies
3. create/bind D1
4. set Worker secrets
5. deploy the Worker
6. create a researched test lead
7. generate a demo
8. receive `slug.nepar.hr`
9. run Playwright QA and obtain desktop/mobile screenshots
10. approve the demo in the internal dashboard
11. see the demo automatically expire and its Custom Domain detach later

No email is sent automatically in this milestone.

## Start here

Before changing code:

1. read `README.md`
2. read `src/index.ts`
3. read `migrations/0001_init.sql`
4. inspect repository-root `.impeccable` and existing Playwright conventions
5. run the current typecheck
6. write a concise implementation plan
7. execute the plan and verify it end-to-end
