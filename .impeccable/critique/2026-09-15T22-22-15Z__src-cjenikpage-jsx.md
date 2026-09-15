---
target: src/CjenikPage.jsx and src/CjenikArhivaPage.jsx (/cjenik + /cjenik/arhiva) — re-run after fixes
total_score: 28
max_score: 36
na_heuristics: 9
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Nepar\\src\\CjenikPage.jsx"
target_fingerprint: "sha256:f4f365acd184011a1a8eced1fba01fc2a5b90c3edc78bd6a4fadd237a1b44019"
target_path: "C:\\Nepar\\src\\CjenikPage.jsx"
timestamp: 2026-09-15T22-22-15Z
slug: src-cjenikpage-jsx
---
Method: dual-agent (A: design-review sub-agent · B: detector/browser-evidence sub-agent) — re-run after the fixes applied for the 2026-09-15 critique.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Naplata column now makes billing cadence visible everywhere; archive page's "when did this change" is still a near-raw timestamp (`2026-08-01 10:00:00`) |
| 2 | Match System / Real World | 3 | Naplata labels are natural Croatian billing vocabulary; `nepar_cijena_od` still leaks into consumer-facing footnote copy |
| 3 | User Control and Freedom | 3 | Unchanged — archive links back to /cjenik; /cjenik still doesn't link to /digitalni-cjenik (known, out of scope) |
| 4 | Consistency and Standards | 3 | Up from 2 — grouping + mobile `dl` fallback now exist on the React path; the static crawler-facing snapshot got the grouping but not the mobile fallback, a new cross-path gap |
| 5 | Error Prevention | 3 | Unchanged — `retainedSnapshots()` still has no guard against malformed `supersededAt` |
| 6 | Recognition Rather Than Recall | 4 | Naplata inline everywhere removes the need to hold billing cadence in memory while scanning prices |
| 7 | Flexibility and Efficiency | 3 | Genuinely applicable, unchanged — serves both human reader and machine/regulator well |
| 8 | Aesthetic and Minimalist Design | 3 | Up from 2 — grouping breaks the 24-row wall into digestible chunks; held back by repeated table chrome for 3-row groups and 6 duplicate ARIA labels |
| 9 | Error Recovery | n/a | Still no user-triggered error states on this static reference page |
| 10 | Help and Documentation | 3 | `aria-describedby` now correctly links the "od" asterisk to its footnote on both paths; undercut by 6 tables now sharing one identical, non-differentiating caption |
| **Total** | | **28/36** | **Good** |

*(Prior run: 26/36. Real, modest improvement — concentrated in exactly the areas the fix list named, with a new gap opened where nobody was asked to look: per-table captions and cross-path consistency.)*

## Design Specificity Verdict

**LLM assessment:** Improved but still unevenly authored. The category-separation fix (naplata dictionaries, the "NEPAR sells this to other businesses" explanatory copy, the heavy divider before that section) is genuinely bespoke and was carried correctly into *both* the React page and the static-snapshot renderer. But the pattern of the fixes themselves — applied per bullet point of a punch list rather than re-reasoned as a system — shows: the accessible `<caption>` was right for one 24-row table; when that table was split into 6 per-category tables, nobody revisited the caption text, so all 6 now announce the identical generic string to a screen reader.

**Deterministic scan:** CLI (`impeccable detect`) is clean on both files (exit 0). The browser-injected detector's structured output (`impeccableDetect()`, richer than the console log which silently dropped 3 findings) surfaced real, **verified-by-me-in-source** gaps in the line-length fix from the last pass:
- `CjenikPage.jsx:166` (the "Prodajni objekt: …" line) and `:205` (the canonical-filename download paragraph) have **no width constraint at all** — confirmed in source, still ~146 chars/line. The previous fix pass missed these two paragraphs entirely.
- `cjenikCategoryNote` (:183), `odNote` (:193), `newServiceNote` (:194) all correctly received `max-w-3xl`, but at `text-sm`/`text-xs` that's still 110–128 chars/line — a fixed pixel width doesn't bound character count once font size shrinks, so the fix under-corrected exactly where it was applied.
- The one paragraph that IS properly fixed is the `lead` paragraph (`max-w-3xl` at `text-lg`, ~79–80 chars/line) — the detector correctly stayed silent on it.
- `/cjenik/arhiva`'s lead paragraph is close but not fully compliant (~85 chars/line vs. an 80-char target) — a real if minor residual gap.

Also confirmed as **false positives**, consistent with or extending the prior run's list: `cramped-padding` on the 6 table wrappers (real `<td>`/`<th>` padding exists, the rule checks the wrong box); `gpt-thin-border-wide-shadow` and `em-dash-overuse` trace to the same site-wide consent panel and price-table placeholder cells as before. Two **newly-discovered** false positives are worth flagging to whoever maintains the Impeccable detector itself, not this codebase: `dark-glow` and `text-occlusion` both fired on the detector's *own* injected highlight-overlay UI (its finding-label badges and glow style match its own anti-pattern rules) — the tool caught itself, not the page.

**Visual evidence:** Screenshots were captured (clean and with the detector overlay) at 1280×900 and 390×844 for both routes, confirming the category grouping and naplata column render as intended.

## Overall Impression

Real progress, and the flagship fix (separating NEPAR's own services from the ones it sells to other businesses) is genuinely well executed on both rendering paths — better than a rubber-stamp pass would produce. But the fix-by-punch-list approach left three seams: the archive-date fix took the minimal option instead of the one the brief actually asked for, the line-length fix touched three paragraphs and missed two entirely, and splitting one table into six introduced a caption-uniqueness problem nobody was looking for because it wasn't a problem before the split.

## What's Working

1. **Category separation is structurally, not just cosmetically, resolved** — the explanatory sentence and the heavy `border-t-2` divider exist identically in `CjenikPage.jsx` and in `cjenikRender.js`'s static snapshot, so a crawler and a hydrated visitor see the same clarification.
2. **Naplata (billing frequency) fix is complete on every path** — desktop table, mobile `dl`, and the static HTML all show it, correctly localized.
3. **An accessibility fix nobody explicitly asked for this round**: `aria-describedby` linking the "od" asterisk to its footnote, and `tabIndex={0}` on the scrollable table region — directly answers a persona flag from the *previous* critique that wasn't on the approved fix list, showing the full report was read, not just the checklist.

## Priority Issues

**[P1] Archive version date is still a near-raw timestamp**
`CjenikArhivaPage.jsx:90` uses `snapshot.meta.publishedAt.replace("T", " ")`, producing `2026-08-01 10:00:00` as a version's headline. The original P0 write-up offered this as the *minimal* option alongside a proper `Intl.DateTimeFormat` — the minimal one shipped. It reads less like a bug now and more like a database export; a visitor still can't tell at a glance "this changed in August" without parsing a timestamp.
Fix: format with `Intl.DateTimeFormat("hr-HR", { dateStyle: "long" })` (or similar) instead of a character swap.

**[P1] Two paragraphs got no width constraint at all**
`CjenikPage.jsx:166` (point-of-sale line) and `:205` (canonical-filename paragraph) were left untouched by the line-length fix and still render at ~146 chars/line — worse than the paragraphs that were "fixed," because these weren't touched at all.
Fix: add the same width treatment as the other footnote-style paragraphs.

**[P2] Where the line-length fix WAS applied, it's insufficient at small font sizes**
`cjenikCategoryNote`, `odNote`, `newServiceNote` all carry `max-w-3xl` but render at 110–128 chars/line because they're `text-sm`/`text-xs` — a fixed-pixel max-width doesn't control character count once type shrinks.
Fix: use a character-aware constraint (`max-w-prose`, or a `ch`-based width) instead of reusing the `lead` paragraph's pixel value at a smaller font size.

**[P2] New regression: 6 tables now share one identical, non-differentiating caption**
`CjenikTable`'s `<caption className="sr-only">{copy.title}</caption>` and its `aria-label={copy.tableScrollLabel}` are page-level constants, unchanged across all 6 invocations (5 category tables + the separated "digitalni cjenik" table). A screen-reader user hears the identical announcement moving between "Redizajn" and "Usluge digitalnog cjenika."
Fix: pass the category name into `CjenikTable` and interpolate it into the caption/aria-label per table.

**[P3] Static snapshot has no mobile-responsive treatment; React path does**
`cjenikRender.js`'s `renderCjenikSection` emits a bare `<table>` with no fallback for narrow viewports, while `CjenikPage.jsx`'s `CjenikTable` now has a `dl`-based mobile pattern. This is a new cross-path inconsistency introduced by this pass, not present before the grouping fix (there was only one gap to close, and only one path got the mobile treatment).
Fix: either add an equivalent stacked fallback to the static renderer, or accept the asymmetry explicitly (the static path has no CSS framework at all by design, unlike the hydrated page) and document why.

**[P3, code quality] `groupByCategory` is duplicated verbatim in two files**
The identical function exists in both `src/CjenikPage.jsx` and `src/cjenikRender.js`. Given `cjenikData.js`'s own header insists on "jedino mjesto" (one place) for pricing logic, this small duplication is worth collapsing into a shared helper both files import.

## Persona Red Flags

**Jordan (First-Timer):** The two-product-line confusion from the last critique is genuinely resolved — structurally, not cosmetically. Remaining friction: "sidrena cijena" is still only explained in a footnote at the very bottom of the page, now separated from the tables by up to 6 intervening category sections, so Jordan scrolls further past the point of confusion to find the definition than before the grouping fix.

**Sam (Accessibility-Dependent):** Two confirmed wins since last time (asterisk-to-footnote link, keyboard-scrollable table region). New red flag: 6 tables sharing one generic caption is arguably worse for screen-reader table navigation than the single-table version — it creates false confidence ("I know what this table is") without differentiating any of them.

## Minor Observations

- `/cjenik/arhiva`'s lead paragraph is close to the 80-char target (~85) but not fully there — minor, unlike the two paragraphs on `/cjenik` that were missed entirely.
- The €0 "Provjera" row still renders as a formatted currency amount ("0 €") rather than "Besplatno" — unchanged, was out of scope for this pass.
- `retainedSnapshots()` still has no guard against a malformed `supersededAt` — unchanged, was out of scope for this pass, still worth a follow-up given the feature's legal-retention purpose.
- The desktop table (`min-w-[820px]`) still forces horizontal scroll between the 640px `sm` breakpoint and roughly 820px — a narrow leftover of the original horizontal-scroll problem for mid-size tablets.
- Two detector bugs (`dark-glow`/`text-occlusion` self-contamination) were found in the Impeccable tooling itself, unrelated to this codebase — worth reporting upstream, not actionable here.

## Questions to Consider

1. If a fix list is applied bullet-by-bullet, who notices that fixing "add grouping" invalidates an assumption baked into "add a caption" (one table → six)? Should a re-check re-read the whole page after each fix, not just verify each fix against its own bullet?
2. When a critique offers a "minimal" and a "correct" option for the same fix, should it stop doing that and only ever specify the option that actually satisfies the stated intent?
3. Is there anything (a lint rule, a snapshot test) that keeps the static-snapshot renderer and the React renderer from drifting apart structurally over time, or does that parity depend entirely on a developer remembering to update both — the same "process guarantee, not a code one" already flagged for the archive script?
