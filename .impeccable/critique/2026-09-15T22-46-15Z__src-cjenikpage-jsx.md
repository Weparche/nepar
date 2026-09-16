---
target: src/CjenikPage.jsx and src/CjenikArhivaPage.jsx (/cjenik + /cjenik/arhiva) — third pass
total_score: 30
max_score: 36
na_heuristics: 9
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Nepar\\src\\CjenikPage.jsx"
target_fingerprint: "sha256:bd14b77bcca2a1abf460bb481f672a680eb9bf25afb6b7407953b64b3ca535a9"
target_path: "C:\\Nepar\\src\\CjenikPage.jsx"
timestamp: 2026-09-15T22-46-15Z
slug: src-cjenikpage-jsx
---
Method: dual-agent (A: design-review sub-agent · B: detector/browser-evidence sub-agent) — third pass, after two rounds of approved fixes.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Per-category aria-labels now correctly identify which table a screen-reader user is in |
| 2 | Match System / Real World | 3 | Natural Croatian long-form dates now; undercut by a timezone gap that can make the "official" timestamp silently disagree with reality |
| 3 | User Control and Freedom | 4 | Bidirectional archive↔current nav, dual CSV/XML downloads, language toggle, no traps |
| 4 | Consistency and Standards | 4 | Most-improved heuristic this round — shared date/grouping helpers, matching captions and mobile fallback across both render paths |
| 5 | Error Prevention | 2 | Unchanged across all 3 passes — `retainedSnapshots()` still has no guard against malformed `supersededAt` |
| 6 | Recognition Rather Than Recall | 4 | Asterisk→footnote link plus per-category captions remove any need to recall context |
| 7 | Flexibility and Efficiency | 3 | Good dual-audience design (human + machine) undercut by canonical-filename links being React-only — exactly the audience most likely to want them (crawlers/auditors) hits the static path instead |
| 8 | Aesthetic and Minimalist Design | 4 | Restrained layout maintained; no kicker/eyebrow regression |
| 9 | Error Recovery | n/a | Still no user-triggered error states on this static reference page |
| 10 | Help and Documentation | 3 | Footnotes do real explanatory work; still no link out to `/digitalni-cjenik` |
| **Total** | | **30/36** | **Good** |

**Trend for `src-cjenikpage-jsx`: 26 → 28 → 30 (out of 36).**

## Design Specificity Verdict

**LLM assessment:** More coherent than pass 1, still patch-on-patch at the architecture level. Consolidating `formatCjenikDate` and `groupByCategory` into single exported functions is genuine systemic progress — the first fix in three passes to address *shared logic* rather than *shared appearance*. But the actual markup generation is still two hand-maintained parallel implementations: `CjenikTable` (React component) and `renderCjenikSection` (string-template function) independently reproduce the same table+dl structure. That duplication is the root cause of every "fixed on one path, missed on the other" finding across all three passes — including two new ones this round (paragraph width, canonical-filename links). Until the two rendering paths share one markup-generating source, each visual change will keep needing manual re-sync.

**Deterministic scan (independently verified against source by both the parent session and the sub-agent):** CLI clean. Live-measured line lengths on the React `/cjenik` confirm the `max-w-prose` fix genuinely works — dropped from the previously-measured 110–171 chars/line down to ~38–78.5 chars/line at both 1280px and 390px, because `ch` scales with font-size where the old fixed-pixel `max-w-3xl` couldn't. But this fix **only reached `CjenikPage.jsx`/`CjenikArhivaPage.jsx`** — `cjenikRender.js`'s `renderCjenikHtmlBody`/`renderCjenikArhivaHtmlBody` still emit bare `<p>` tags with zero width constraint, inside a `.section-shell` bounded only to ~1240px. Since `src/main.jsx` uses `createRoot` (not `hydrateRoot`), this static markup is genuinely the first-painted DOM — real content for non-JS visitors and crawlers, not a hydration formality — so the line-length problem the last two passes tried to fix still exists there, just relocated. Same story for the Odluka-mandated canonical-filename download links: present on the React page, absent from the static snapshot. Confirmed false positives, unchanged from prior passes: `cramped-padding` (real cell padding exists), `gpt-thin-border-wide-shadow` (site-wide consent panel), `em-dash-overuse` (legitimate placeholder cells), `dark-glow` (the Impeccable toolbar's own icon color, not site content). One new finding, out of this pair's scope: `body-text-viewport-edge` fires on the shared `SiteFooter` component at 390px on both routes — real, but caused by a component neither of these two files own.

## Overall Impression

Genuine, measured progress for the third consecutive round (26→28→30), and the two fixes this round that touched shared logic (`formatCjenikDate`, `groupByCategory`) are the first to actually close a gap instead of relocating it. But the pattern holding the score back is now unmistakable across all three passes: every fix that changes *appearance* gets applied to the React component and forgotten on the static-snapshot generator, because they're two separately-maintained implementations of the same page. The two new findings this round (unconstrained static paragraphs, missing static canonical links) are exactly that pattern recurring — not new mistakes, the *same* mistake in a different fix.

## What's Working

1. **`formatCjenikDate` and `groupByCategory` are now genuinely single-sourced** in `cjenikRender.js` and consumed identically by both paths — architecture-level progress, not surface polish.
2. **Per-category accessible names are complete and identical in shape across both render paths** — a full WCAG-relevant fix, not a partial one.
3. **The static-HTML mobile `dl` fallback closes a real cross-path gap with zero JS dependency**, field-matching the React version exactly — proof the team can close these gaps when a fix specifically targets both paths.

## Priority Issues

**[P1] Static-snapshot paragraphs still have zero width constraint**
`cjenikRender.js`'s `renderCjenikHtmlBody`/`renderCjenikArhivaHtmlBody` emit plain `<p>` tags with no class at all, inside a ~1240px container — worse than the original `max-w-3xl` problem the last two passes tried to fix, just never applied here. Since this is the actual first-painted content (no hydration, `createRoot` wipes and replaces it), this affects every non-JS visitor and crawler permanently, not briefly.
Fix: add the same `max-w-prose`-equivalent measure to these paragraphs — since this path has no Tailwind classes processed the same way, either inline a `style="max-width:65ch"` or add a small scoped `<style>` block.

**[P1] Canonical-filename download links exist only on the React path**
The Odluka-mandated canonical filename (`/cjenici/<oblik>_<adresa>_<oznaka>_...`) is linked on `CjenikPage.jsx` but `renderCjenikHtmlBody` only emits the generic `/cjenik.csv`/`/cjenik.xml` links. The static path is exactly what a non-JS crawler or human auditor checking compliance sees — the one feature this page exists to demonstrate is invisible there.
Fix: port the same canonical-filename links into `renderCjenikHtmlBody`.

**[P2] `formatCjenikDate` doesn't pin a timezone**
`Intl.DateTimeFormat(locale, { dateStyle, timeStyle })` with no `timeZone` resolves to the runtime's local zone. The static snapshot is formatted once at build time in Node (likely UTC on CI/hosting); the React version is formatted per-visitor in the browser. For a page whose entire purpose is a precise legal "objavljeno" timestamp, these two can silently disagree, and a non-Croatian visitor's browser would show a shifted time.
Fix: pass `timeZone: "Europe/Zagreb"` explicitly in `formatCjenikDate`.

**[P3] Duplicate date display in archive rows**
`VersionRow`/`row()` show the identical formatted date as both the bold row label and again inline after "Objavljena:" — more noticeable now that `dateStyle:"long"` produces a longer string.

**[P3, out of scope for these two files] `body-text-viewport-edge` on the shared `SiteFooter` at mobile width**
Fires on both `/cjenik` and `/cjenik/arhiva` at 390px, but the affected markup lives in `SiteFooter`, a component neither `CjenikPage.jsx` nor `CjenikArhivaPage.jsx` owns. Noted for awareness, not attributable to this feature.

## Persona Red Flags

**Compliance-minded reader / automated auditor of the static snapshot:** this persona is most exposed by the two P1s together — an official timestamp that can silently disagree with the live page, and no canonical filenames to verify the naming convention against, when reading the raw HTML. For a page whose premise is regulatory precision, this is the persona this round should have protected hardest.

**Mobile SME owner comparing offers:** minor scan-speed tax from the duplicate date pattern; the known 640–820px tablet horizontal-scroll gap is unchanged.

## Minor Observations

- Console-log output from the browser detector silently drops the `dark-glow` finding and undercounts by one every time — a tooling bug in Impeccable itself, not this codebase; the structured `impeccableDetect()` API doesn't have this problem.
- `€0` "Provjera" row, missing `/cjenik → /digitalni-cjenik` link, `retainedSnapshots()` NaN-guard, and the 640–820px horizontal-scroll band: all confirmed unchanged from prior passes, still out of scope.

## Questions to Consider

1. Given `formatCjenikDate`/`groupByCategory` are now shared but the table/paragraph markup is still generated twice, is the next real milestone unifying rendering itself (e.g., serializing the React table via `renderToStaticMarkup` for the snapshot) rather than another round of manually porting individual fixes?
2. Should `formatCjenikDate` pin `Europe/Zagreb` unconditionally — should this page's official timestamps ever be viewer-relative at all, given they cite a specific legal filing?
3. If the static snapshot is what regulators or automated tooling actually verify against, should it be the source of truth the React page mirrors, rather than the other way around?
