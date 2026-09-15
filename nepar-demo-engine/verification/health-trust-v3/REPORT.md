# health-trust-v3 — verification and release

Released 14 September 2026. Live example: **https://fabela-v3.nepar.hr**.

The Worker supports all three V3 layouts. Fabela is the new production pet-first example; Goldi and Bond remain local QA specimens. No outreach was sent. The three pre-existing demos retain their content, renderer version, direction, QA report and approval. The NEPAR main site was built from its deployed commit `6fbf2df` with its production build variables; script/style hashes match. Its only HTML difference was one blank line.

## Acceptance results

| Example | Technical desktop / mobile | Geometry desktop / mobile | Astra design desktop / mobile | Critical findings |
|---|---:|---:|---:|---:|
| Fabela pet-first | 100 / 100 | 100 / 100 | 93 / 91 | 0 |
| Goldi doctor-first | 100 / 100 | 100 / 100 | 92 / 91 | 0 |
| Bond clinic-first | 100 / 100 | 100 / 100 | 93 / 92 | 0 |

The judgment rationales and minor findings are in each example's `judgment.json`. Geometry is automated composition testing, not a pixel-similarity claim. Design scores were assigned after viewing the actual screenshots and the separate ImageGen references. Mobile adaptations favor readable single-column layouts where a generated reference suggests an impractically dense arrangement. Generated reference copy, decorative arrows, fabricated contacts and synthetic clinicians were not copied into runtime content.

- `npm run verify`: generated types, TypeScript, immutable renderer checksum, **35 tests in 4 files**, and Wrangler deployment dry run passed.
- All three directions at **360, 390, 768, 1440 and 1920 px** passed the viewport matrix.
- **105 edge-case checks** passed: long content, one/eight services, email/address/no contact and missing optional supporting content across all directions and widths.
- Axe WCAG 2 A/AA and 2.1 AA reported **zero violations** on desktop and mobile. Visible keyboard focus, reduced motion and 200% text checks passed.
- Hero images are eager/high-priority; supporting photos are lazy. Responsive dimensions reserve space. No scripts or reference images appear in runtime requests.
- The final production Fabela viewport run passed, and the server accepted its current content/screenshot-bound review. Outreach approval remains a separate manual workflow; no send endpoint was invoked.
- The live primary CTA returned **302 → `tel:+38513095340`**. Old-demo preservation is recorded in `production-smoke.json`.

## Lighthouse

Lighthouse 12.8.2, headless Playwright Chromium on Windows; emulated Moto G Power, 412×823, device scale 1.75, simulated mobile throttling (150 ms RTT, 1,638.4 Kbps throughput, CPU slowdown 4×). Browser storage is reset for each run. Production uses the actual network and Cloudflare edge; final confirmation runs were sequential after concurrent browser QA finished.

| Final artifact | Performance | Accessibility | Mobile LCP | CLS |
|---|---:|---:|---:|---:|
| Local Fabela | 99 | 100 | 1.88 s | 0 |
| Local Goldi | 99 | 100 | 1.95 s | 0 |
| Local Bond | 99 | 100 | 1.88 s | 0 |
| Production Fabela confirmation 1 | 95 | 100 | 2.44 s | 0.000045 |
| Production Fabela confirmation 2 | 95 | 100 | 2.43 s | 0.000045 |

Earlier failures are retained rather than hidden: initial local Goldi/Bond LCP was 2.85/2.57 s, resolved with responsive mobile photo variants; workers.dev production runs were 2.59–2.83 s. The canonical subdomain, preconnect and optimized font delivery followed. Font data fell from 126,536 to 82,840 bytes while retaining all used weights and Croatian characters. The first measurement with those fonts was 2.55 s during concurrent QA; both subsequent isolated confirmations passed 2.5 s. These are measured lab results, not a field-performance guarantee.

## Correction and integrity

One visual correction batch fixed portrait/caption alignment, Croatian characters, missing whitespace at mobile line breaks, supporting-photo repetition and the architectural heading scale. Subsequent changes addressed measured transfer performance and were re-captured and independently checked. The accepted renderer HTML/CSS remained checksum-locked during delivery optimization.

The package and asset-manifest change invalidated the preceding Fabela review. Its final review matches the new content fingerprint, actual R2 screenshot bytes and the reference hashes. Unit tests also exercise stale content/assets/screenshots, missing or low design scores, unknown versions, conflicting direction aliases, and legacy compatibility.

## Deployment

- Worker: `nepar-demo-engine`, version `7e3b1007-45df-44b1-8a8d-81a54d577063`.
- Pages asset release: `https://9561fd35.nepar.pages.dev`, project `nepar`, production branch `main`, preserving the deployed site's source and build configuration.
- Migration: `0006_health_trust_v3.sql` applied remotely; existing rows retain null `design_version`.
- New custom domain: `fabela-v3.nepar.hr`, attached only to the new demo.
- Existing production admin secrets were preserved. A localhost-only, token-protected release bridge ran the same validated handler through the owner's authenticated D1/R2 API transport after Wrangler remote-binding transport timed out. Its routes were restricted to creating Fabela V3 and uploading its QA; no outreach route existed. The temporary bridge is shut down after release.

The six target references, prompt records, master/derived imagery, optimized assets, three prepared packages, screenshots and raw QA reports are included in the repository. Reference and verification directories are not published as runtime dependencies.

## Finding the examples and generation scope

- Fabela, pet-first: https://fabela-v3.nepar.hr (production).
- Goldi, doctor-first: run `npm run v3:preview`, then open http://127.0.0.1:8793/?demo=goldi-doctor-first-v3 (local specimen).
- Bond, clinic-first: run `npm run v3:preview`, then open http://127.0.0.1:8793/?demo=bond-clinic-first-v3 (local specimen).
- Each example's desktop/mobile screenshots and review are under `local/<slug>/` beside this report.

The standard admin generate-from-lead action and CLI `--lead` still generate `deterministic-v2` payloads without `designVersion`. V3 requires an explicit prepared package. Deploying the Worker enables its renderer; it does not switch this existing generation action to V3 or run Astra/ImageGen inside the Worker.

## 15 September: missing legacy assets repaired

Karaula was generated with null `design_version` and `generation_version: deterministic-v2`. Its HTML referenced `/health-trust-default/hero.webp` and `/health-trust-default/about.webp`, but both public URLs returned HTTP 404. Those existing repository assets had been omitted when preparing the production Pages asset release. Restored both files in the production build/source workspace and deployed Pages release `https://edfb25e7.nepar.pages.dev`. This repair does not change demo records or the Worker renderer. Future Pages builds must retain both `public/health-trust-default` and `public/health-trust-v3`.

Live asset and browser verification is recorded in `karaula-asset-repair/result.json`, with desktop/mobile screenshots. The main site's HTML and entry script/style were compared against the production baseline before the asset release.
