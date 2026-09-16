---
target: digitalni-cjenik bolder+animate+UX fixes round
total_score: 25
max_score: 36
na_heuristics: 7
p0_count: 0
p1_count: 3
target_identity: "file:C:\\Nepar\\src\\DigitalPriceListPage.jsx"
target_fingerprint: "sha256:13c889a71382aa14f04dbf46f6baea15f4b1817d34bfafcf3b187bb98d101075"
target_path: "C:\\Nepar\\src\\DigitalPriceListPage.jsx"
timestamp: 2026-09-16T11-57-14Z
slug: src-digitalpricelistpage-jsx
---
Method: dual-agent (A: afc8811350742b2ff · B: a95c045007f04a2c3, partial — CLI mechanical scan completed and verified independently; the browser-injection/overlay leg of Assessment B was cut short mid-run by a session rate limit and did not finish)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Checker/lead-form loading, spinner, and `aria-live` result reveal are solid; the input itself isn't visually locked during a check, only the button. |
| 2 | Match System / Real World | 3 | Legal jargon is consistently paired with plain-language restatement. |
| 3 | User Control and Freedom | 3 | FAQ, checker retry, editable form, HR/EN toggle — nothing modal-trapped. |
| 4 | Consistency and Standards | 2 | The "answer-first" paragraph uses a colored left border (`border-l border-cyan-700`) — DESIGN.md explicitly prohibits colored side rails as decoration. Four separate dark-panel uses also read as one generic "important box" rhythm rather than a reserved device. |
| 5 | Error Prevention | 2 | Verified live: typing `not a url!!` into the checker gets silently coerced into a pseudo-valid URL and submitted rather than caught by client-side validation. |
| 6 | Recognition Rather Than Recall | 3 | Reassurance chips persist near the input; the checked URL auto-fills the lead form's website field. |
| 7 | Flexibility and Efficiency | n/a | No expert/accelerator path is meaningful for a single-visit Persuade-mode compliance page. |
| 8 | Aesthetic and Minimalist Design | 2 | The WordPress/WooCommerce reassurance is restated near-verbatim across four separate sections (confirmed: "WooCommerce" appears 16 times across the copy, "Treba li WooCommerce?" verbatim in two different places). |
| 9 | Error Recovery | 3 | Good fallback email and dual-path recovery from the checker's unavailable state; the one gap is #5 — bad input is misdiagnosed as an outage. |
| 10 | Help and Documentation | 4 | The 10-entry FAQ plus an explicit "what is not yet defined" section is unusually candid, in-context documentation for a marketing page. |
| **Total** | | **25/36** | **Good (heuristic 7 marked n/a; 69% of applicable max)** |

## Design Specificity Verdict

**LLM assessment**: Content specificity is genuinely high — exact NN decision numbers, exact effective date, real Croatian-SMB verticals, a live server-side checker tied to the actual regulation, sample CSV/XML downloads, and an FAQ that answers oddly specific edge cases (B2B-only, Facebook-only presence, "is a PDF enough"). A generic template could not be reskinned into this without a real rewrite. However, the *visual-pattern* layer is more conventional: hero + checker, alternating light/dark cards, 3-tier pricing, accordion FAQ — a familiar SaaS/agency skeleton. Two places let this slip toward generic-template territory: the hero "proof" image is an abstract stock-style stack-of-papers render rather than anything that visually *is* the regulation, and the dark-panel device is reused four times as generic section-marking rather than reserved for the two moments the system says it should mark. Verdict: strong content-level specificity, medium execution-level specificity.

**Deterministic scan**: `impeccable detect --json src/DigitalPriceListPage.jsx` returned `[]` (0 findings, exit code 0) — a clean mechanical scan, confirming no CSS-pattern-level anti-patterns (gradient text, glassmorphism, etc.) anywhere in the file. Notably, the mechanical scan does **not** catch the colored-left-border violation the design review found (`border-l border-cyan-700` as decoration) — that pattern lives at the Tailwind-utility level in a way the current ruleset doesn't flag, even though DESIGN.md's prose explicitly bans it. This is a real gap between the mechanical scan and the system's own written rules, not a false positive on either side.

**Visual overlays**: Not available this run — the browser-injection leg of Assessment B was interrupted by a session rate limit before it could complete. Assessment A separately captured real Playwright screenshots (desktop 1280×900, mobile 390×844, both HR and EN) and based its findings on those, so the report below is still grounded in actual rendered output, just without the detector's live in-page overlay.

## Overall Impression

The page is doing real work: a live technical checker, exact regulation citations, and an unusually candid "what's not yet defined" admission give it genuine authority a template couldn't fake. The two rounds of fixes already applied this session (motion, facts-strip hierarchy, WordPress pricing cleanup, persistent technical-scope notice, EN-mode localization) all land correctly and are visible in the rendered output. The remaining friction is repetition and a couple of small system-rule violations, not structural confusion: the WooCommerce reassurance is said four times, four dark panels compete for "this is important" instead of two, and the hero's proof image proves nothing visually while the caption text does all the work.

## What's Working

1. **Checker failure-state UX** — the `unavailable` (slate) vs `red` (rose) distinction, plus offering both "Pokušajte ponovo" and a direct route to the lead form, is a genuinely well-built recovery path.
2. **Cross-field memory** — `LeadForm key={checkedWebsite} initialWebsite={checkedWebsite}` auto-fills the lead form with the just-checked site, a small real reduction in user effort most compliance tools skip.
3. **"What is not yet defined" section** — openly stating the regulation doesn't prescribe a CSV delimiter or XML/XSD schema is unusually candid for a sales page and builds exactly the technical credibility the brand wants.

## Priority Issues

**[P1] Colored left-border-as-decoration on the "answer-first" paragraph.** `className="... border-l border-cyan-700 pl-4 ..."` on the plain-language TL;DR sentence is a literal instance of a pattern DESIGN.md explicitly prohibits — sitting on arguably the single highest-value sentence on the page. **Fix**: drop the border; differentiate the summary with a subtle background tint or a bold "Ukratko:" lead-in label using existing tokens. **Suggested command**: `/impeccable polish` or `/impeccable typeset`.

**[P1] WordPress/WooCommerce reassurance repeated across four sections.** The "you don't need WooCommerce" message appears in the platforms grid, the standalone WordPress block, the platform-guides Q&A, and again nearly verbatim as a separate FAQ entry (confirmed: 16 total mentions of "WooCommerce," "Treba li WooCommerce?" appears twice verbatim). **Fix**: consolidate into one authoritative statement; cut or replace the duplicate FAQ entry. **Suggested command**: `/impeccable distill`.

**[P1] Hero "proof" panel is a generic abstract image, not evidence.** The panel's actual credibility work (NN decision number, date, link to Narodne novine) is carried entirely by the caption text below an abstract stock-style paper-stack render; the surface brief stages this exact panel as the first-viewport "official source proof," and the brand's own anti-references explicitly ban stock illustrations. **Fix**: replace with something that is itself evidence — a stylized reproduction/crop of the actual Narodne novine masthead or article text. **Suggested command**: `/impeccable bolder` or a new asset pass.

**[P2] Checker's validation is more permissive than its own copy promises.** Verified live: typing `not a url!!` is silently coerced into a pseudo-valid URL by `normalizeForPrefill`/`normalizeCheckerUrl` and submitted, then misdiagnosed as a service outage rather than caught as bad input — exactly the case a stress-testing user would probe, and telling them "our service is down" when they typed gibberish damages trust in the checker's own results. **Fix**: reject hosts with spaces/percent-encoded spaces or without a plausible domain shape in `normalizeCheckerUrl` before treating a value as valid, so this case surfaces `checkerInvalid` instead. **Suggested command**: `/impeccable harden`.

**[P2] Dark "ink-reveal" panel used four times well beyond its reserved scope.** Slate-950 panels appear at the hero checker, the facts stat tile, the practice-comparison column, and the full-bleed integration-flow diagram — four uses in the first two-thirds of the page, against a system that reserves dark panels for "Product Lab and price-comparison proof," restrained. **Fix**: keep slate-950 for the checker and the actual price comparison; move the facts tile and integration-flow diagram to light-canvas treatments with a single accent color. **Suggested command**: `/impeccable quieter`.

**[P3] WordPress option priced with false precision for an unshipped product.** The "WordPress opcija" card shows a precise 139,80 € — higher than the flexible "od 129 €" ready-implementation price — while its own note discloses the plugin is "u pripremi." **Fix**: consider "od 139,80 €," or move the in-preparation caveat out of small print into the card body. **Suggested command**: `/impeccable clarify`.

## Persona Red Flags

**Jordan (confused first-timer)**: The two regulations are distinguished everywhere only by a trailing digit ("NN 101/2026-1212" vs "-1213"), styled identically wherever they appear — real risk of transposing which one governs pricing display vs. which governs the XML/CSV file. Jordan also passes four stacked restatements of the same deadline/obligations fact (eyebrow, H1, lead, answer-first paragraph) before reaching any interactive element.

**Riley (deliberate stress tester)**: Confirmed live — garbled checker input (`not a url!!`) is silently coerced into a fake-valid URL rather than rejected, and the resulting error message misattributes the cause (see P2). The lead form's `required` fields block empty strings but not whitespace-only input, so a name of just spaces would pass client-side. Rapid double-submit is correctly guarded on both the checker and the lead form.

**Casey (distracted mobile user)**: Most exposed to the WooCommerce repetition (P1) — by the third restatement while thumb-scrolling, reassurance starts reading as filler right before the pricing section that should close the sale. The pricing section's "Provjeri svoj web" button also triggers a long smooth-scroll reversal back to the hero on a small screen, which can feel disorienting mid-skim. Separately (outside this file's scope, flagged for awareness): the cookie-consent banner visually covered the checker input on first mobile load during testing — worth a note to whoever owns consent-banner placement, since it undercuts this page's most important above-the-fold element even though the cause lives in a different component.

## Minor Observations

- FAQ (10 items) and `notOnlyExamples` (10 items) are both flat lists with no sub-grouping; `<details>` progressive disclosure already mitigates the FAQ case.
- The lead form's platform `<select>` has 7 options including "Ne znam" (Don't know) as a valid answer alongside concrete platform names — a deliberate choice worth a second look rather than default inclusion.
- The lead-form submit spinner reuses the same infinite-repeat `spinTransition` as the hero checker's spinner, technically below the hero — a defensible functional-loading exception to the "no continuous animation below the hero" rule, but worth explicitly documenting as an intended exception rather than leaving it implicit.
- The "NEPAR implementira" pricing card's feature list is interrupted by an unrelated Wix/React/custom pricing aside (`extra`) before resuming — a minor sequencing hiccup.
- `displayUrl()` silently falls back to the raw value on a parse failure with no visible indication — low risk since inputs are validated upstream, but worth a defensive glance.

## Questions to Consider

- If "you don't need WooCommerce" is worth saying four times, is that a sign the underlying anxiety deserves one prominent, single treatment (a badge or banner) instead of four scattered footnotes?
- The hero's "proof" panel currently proves nothing visually on its own — if screenshotted and sent to a skeptical business partner, would the image convince anyone the regulation is real, or does all the credibility work live in the caption text?
- Given the checker is the entire mechanism that turns a visitor into a lead, is a generic "provjera trenutno nije dostupna" acceptable for both "we couldn't parse what you typed" and "our backend is down," or does this audience deserve to know which one happened?
