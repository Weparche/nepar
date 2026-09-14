# health-trust-v3

V3 is an opt-in static HTML/CSS renderer. `designVersion: "health-trust-v3"` and `visualDirection` are required for V3. Legacy requests keep their renderer and approval rules. Conflicting direction aliases and unknown versions are rejected. The additive migration only introduces nullable `demos.design_version`.

The accepted renderer checksum lives in `reference-designs/health-trust-v3/renderer-contract.json`. `npm run verify` checks it. Future appearance changes require a new renderer and explicit version; do not update the accepted checksum.

## Local workflow

Run these commands from `nepar-demo-engine`:

```sh
npm ci
npm run v3:assets
npm run v3:packages
npx tsx scripts/generate.ts --package packages/health-trust-v3/fabela-v3.json --validate-only
npm run v3:preview
```

Open `http://127.0.0.1:8793/?demo=fabela-v3`. The other local specimens are `goldi-doctor-first-v3` and `bond-clinic-first-v3`. Goldi uses Alan Fleck's real official portrait; Bond uses real official interior photographs. These are local renderer fixtures, not outreach targets.

```sh
npx tsx scripts/v3-qa.ts --output qa-output/health-trust-v3/final
npm run qa:v3:edges
npm run qa:v3:lighthouse
npm run verify
```

`--lead` retains the existing generation flow. `--package` accepts a prepared V3 package; `--validate-only` needs neither network nor admin credentials. Actual generation uses `DEMO_ENGINE_ADMIN_TOKEN` and `--api`, with `--no-attach` for a workers.dev preview. Never put a token in version control or a shell argument.

## Assets and facts

`assets/health-trust-v3/sources` contains the locked pet master, ImageGen composition derivatives and actual source photographs. `prompts.json` records the built-in ImageGen prompts; no other model or subagent was used. `v3-assets.ts` performs deterministic resizing and WebP encoding. Public images and font subsets use SHA-derived filenames under `public/health-trust-v3`. Each responsive image declares its real dimensions and focal point. AI pets are decorative, with a shared master identity. Real people and clinic interiors retain their provenance.

Committed optimized font sources retain weights 400–600 (all weights used by V3), Latin, Latin Extended A, Romanian comma accents and capital German sharp S. This includes Croatian characters. Other scripts use the declared system fallbacks. The optional maintainer command `python scripts/v3-fonts.py` regenerates these sources with `fonttools[woff]`; ordinary `npm run v3:assets` uses the committed fonts and needs no Python. The source licenses remain alongside public fonts. V3 responses include an asset-origin preconnect header.

Prepared packages contain the research lead, brief, validated payload, manifest, prompts and evidence for displayed strings. Missing, stale, duplicated or mismatched evidence fails validation. Factual contact fields must agree with the lead. Evidence and asset provenance remain internal; the renderer outputs neither source metadata nor client JSON. Generic editorial headings are explicitly distinguished from sourced factual descriptions.

Sources: [Fabela](https://www.fabela.hr/), [Goldi team](https://goldi-vet.hr/nas-tim/), [Bond Vet Upper East Side](https://bondvet.com/c/east-86th-street-animal-hospital). Fabela facts were rechecked on 14 September 2026. The reference mockups are visual targets only: their generated copy, icons and depicted people are not factual source material.

## Review contract

Geometry uses direction-specific composition constraints: dominant photograph, intro/photo arrangement, visible contact, hero balance and credential ordering. The wide-screen image ratio is normalized to the capped 1440px content area. This is composition adherence, not a pixel-difference score. Reference hashes bind the six independent target images to the review.

Technical and geometry scores are distinct from Astra's actual screenshot judgment. A human-readable judgment file is attached using:

```sh
npx tsx scripts/v3-review.ts --report PATH/report.json --judgment PATH/judgment.json
```

The command never invents a score. Each device must have technical >=90, geometry >=88 and design judgment >=90 without critical findings. Missing judgment remains pending. Content, version, direction, manifest, screenshot and reference hashes bind the review. Screenshot replacement clears approval; the server checks current stored screenshot bytes and conditionally updates approval to avoid accepting a stale concurrent edit.

Mobile contact reserves its full height plus safe area, including at 200% text size. Phone, email and contact-anchor fallbacks are tested. No contact removes both the bar and its reserved space. Full-page browser screenshots draw a fixed bar at the initial viewport position; the first-screen captures and end-of-page tests verify its actual viewport behavior.

## Verification artifacts

Six independent ImageGen references and their prompts are in `reference-designs/health-trust-v3`. Local `qa-output/health-trust-v3` contains screenshots, viewport matrices, Axe results, independent judgments, 105 edge-case results and Lighthouse JSON. The accepted copies are delivered in `verification/health-trust-v3` with a concise report. These paths are not runtime dependencies.
