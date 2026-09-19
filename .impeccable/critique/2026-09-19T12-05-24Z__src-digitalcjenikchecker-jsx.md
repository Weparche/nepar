---
target: src/DigitalCjenikChecker.jsx checker+popup flow (4 pages)
total_score: 25
max_score: 32
na_heuristics: 7,10
p0_count: 2
p1_count: 3
target_identity: "file:C:\\Nepar\\src\\DigitalCjenikChecker.jsx"
target_fingerprint: "sha256:abd246870d89b468646588f42a206908011b0869dda57f30f2fd48d5e3c1116b"
target_path: "C:\\Nepar\\src\\DigitalCjenikChecker.jsx"
timestamp: 2026-09-19T12-05-24Z
slug: src-digitalcjenikchecker-jsx
---
# Impeccable Critique — src/DigitalCjenikChecker.jsx (checker + implementation-quote flow, all 4 pages)

Method: dual-agent (A: design review · B: detector + browser evidence), with a methodology caveat: both ran in isolated git worktrees pinned to committed HEAD (c2f61a7), missing this session's uncommitted migration work. Assessment B's structural findings reflect that pre-migration commit; Assessment A's narrative described the current state because the prompt described it directly, so its code-level claims were re-verified independently against the real working tree before acting on any of them.

## Design Health Score: 25/36 (renormalized for 2 n/a heuristics), Acceptable -> Good after fixes

| # | Heuristic | Score | Key issue (pre-fix) |
|---|---|---|---|
| 1 | Visibility of system status | 3->4 | Fixed: fetch could hang forever with no signal |
| 2 | Match with real world | 3 | Solid |
| 3 | User control & freedom | 2->3 | Fixed: no escape from a hung check/submit |
| 4 | Consistency & standards | 2->4 | Fixed: 3 different CTA labels for one action |
| 5 | Error prevention | 2->3 | Fixed: no timeout guard |
| 6 | Recognition over recall | 3 | Solid |
| 7 | Flexibility & efficiency | n/a | Not applicable to this widget |
| 8 | Aesthetic/minimalist | 3 | Green result denser than red on purpose, not clutter |
| 9 | Error recovery | 2->3 | Fixed: hung fetch had no recovery path |
| 10 | Help & documentation | n/a | Not applicable |

## Design Specificity Verdict

The compliance-gap content (Arhiva / Naziv datoteke / Sadrzaj / Strojna vidljivost / Azurnost) is genuinely specific to the NN 101/2026 regulation. The widget chrome (dark card, magnifying-glass icon, generic trust-badge checklist) is a standard "check your website" shell; specificity lives in the copy, not the visual language. Accepted as-is for this pass; no redesign requested.

## Priority Issues (all fixed)

- [P0] No fetch timeout anywhere (checker check() and contactLead.js submitContactLead) -> Fixed with AbortController + 10s timeout on both, falling back to existing unavailable/error states.
- [P0] Stale modal/form state on reopen -> Fixed: form remounts on every open transition via an incrementing session id, not just when initialWebsite changes. Verified live (type -> close -> reopen -> field empty).
- [P1] role="alert" nested inside aria-live="polite", double-announcing static content -> Fixed: removed from the new disclaimer box; the genuine validation-error usage elsewhere untouched.
- [P1] Inconsistent CTA labels for the same action across pages -> Fixed: unified to "Zatrazite ponudu" everywhere; guide page's promo link now opens the shared modal instead of navigating away.
- [P2] Green-result CTA copy contradicted the new disclaimer above it -> Fixed: renamed to "Zatrazite pomoc s uskladivanjem" / "Get help closing these gaps."
- [P3] Hardcoded DOM ids copied from the single-page original -> Fixed with useId().
- [P1] Dark surface used outside DESIGN.md's documented scope on 3 of 4 embedding pages -> Resolved via documentation: DESIGN.md now formally includes the checker as a fifth deliberate case.
- Accessibility: modal now focuses the first field on open, matching the site's existing PackageInquiryModal pattern.

## What's Working

- The compliance-gap content is specific and accurate -- the strongest asset in the component.
- URL-input forgiveness (bare-domain handling) removes real friction for non-technical users.

## Persona Red Flags

Jordan (non-technical first-timer): a green "found it" result followed immediately by an amber "5 more things you're probably missing" box could read as bad news right after good news; mitigated by leading the box with a plain-language question ("Zasto sama datoteka mozda nije dovoljna?") rather than jumping straight to jargon.
Riley (stress tester): reopening the modal after a partial fill previously reproduced the stale-state bug; now covered by the session-id remount fix.

## Minor Observations

Legal/disclaimer text is still repeated across several surfaces in one journey (top-of-checker notice, modal legal text, page footer); each instance is fine alone, not aggressively deduplicated in this pass since it wasn't the specific request.
