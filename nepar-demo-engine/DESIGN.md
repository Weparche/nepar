---
name: NEPAR Demo Engine
description: A precise split-pane operations ledger for reviewing leads, demo QA, and approval decisions.
colors:
  action-blue: "#2563eb"
  action-blue-soft: "#eaf1ff"
  canvas: "#f5f7fa"
  surface: "#ffffff"
  ink: "#0f172a"
  body: "#334155"
  muted: "#526278"
  line: "#dce3ec"
  environment-cyan: "#0e7490"
  danger: "#b42318"
typography:
  headline:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "clamp(1.7rem, 3vw, 2.35rem)"
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.55rem"
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: "-0.025em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "12px"
    fontWeight: 750
    lineHeight: 1.45
    letterSpacing: "0.08em"
  control:
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 700
    lineHeight: 1.45
    letterSpacing: "normal"
rounded:
  media: "8px"
  nav-item: "9px"
  toast: "10px"
  control: "12px"
  pill: "999px"
spacing:
  compact: "8px"
  control-x: "16px"
  panel: "22px"
  workspace: "28px"
components:
  button-primary:
    backgroundColor: "{colors.action-blue}"
    textColor: "{colors.surface}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
    height: "44px"
  button-danger:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.danger}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "10px 16px"
    height: "44px"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "9px 12px"
    height: "44px"
  status-badge:
    backgroundColor: "{colors.action-blue-soft}"
    textColor: "{colors.action-blue}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "4px 9px"
    height: "28px"
---

# Design System: NEPAR Demo Engine

## Overview

**Creative North Star: "The Operations Ledger"**

The NEPAR Demo Engine is a quiet, exacting work surface: part queue, part case file, part approval ledger. Its visual authority comes from disciplined columns, archival divider lines, restrained status color, and a single action blue that makes the next decision unmistakable.

The system is dense enough for repeated operational use without feeling compressed. It favors explicit facts and visible state over decoration, matching NEPAR's technically confident, precise, and approachable character. Generated customer demos may adopt their own visual worlds; they are work products shown inside this system and must not donate their theme tokens to the engine shell.

**Key Characteristics:**

- Three-pane desktop workspace with collection rail, queue, and selected-record detail.
- Cool, near-white tonal layering separated by fine archival rules.
- One action blue for selection, focus, primary action, and compact status emphasis.
- Direct Croatian operational copy, numeric alignment, and explicit human approval states.
- Responsive detail drawer that becomes the focused task surface on narrow screens.

## Colors

The palette is cool and administrative: deep navy text on paper-white surfaces, pale blue-gray structure, and one crisp blue reserved for state and action.

### Primary

- **Decision Blue:** The sole high-emphasis accent. Use it for primary actions, selected-row markers, focus outlines, active navigation, and status emphasis.
- **Decision Wash:** A low-chroma companion used behind compact status badges, never as a large decorative field.

### Secondary

- **Environment Cyan:** A small informational accent for environment context in the top bar. It is subordinate to Decision Blue and should not compete with task actions.
- **Action Red:** Destructive and rejecting actions only. Keep it textual on a neutral control until the message state requires a stronger error surface.

### Neutral

- **Ledger Canvas:** The page and queue ground; slightly darker than the selected record surface.
- **Record Paper:** Primary panel, selected row, control, and detail background.
- **Register Ink:** Headlines, high-value facts, and primary body emphasis.
- **Slate Body:** Standard operational text and neutral controls.
- **Quiet Metadata:** Secondary descriptions, labels, counts, and empty-state support copy.
- **Archive Line:** Structural dividers between panes, records, sections, and fields.

### Named Rules

**The One Decision Color Rule.** Decision Blue carries selection, focus, status emphasis, and primary action; do not introduce another competing positive accent.

**The Demo-Is-an-Artifact Rule.** A generated demo's palette belongs to the previewed customer site, not to the engine chrome.

## Typography

**Display Font:** Inter (with system sans-serif fallbacks)
**Body Font:** Inter (with system sans-serif fallbacks)
**Label Font:** Inter (with system sans-serif fallbacks)

**Character:** A single UI sans family keeps scanning fast and hierarchy predictable. Personality comes from compact negative tracking on headings, restrained uppercase ledger labels, and strong numeric values rather than a decorative type pairing.

### Hierarchy

- **Headline** (700, fluid 1.7rem–2.35rem, -0.035em): Queue titles and the principal view identity.
- **Title** (700, 1.55rem, -0.025em): Selected-record names in the detail pane.
- **Body** (400, 1rem, 1.45): Explanations, research summaries, and ordinary interface text.
- **Label** (700, 12px, 0.08em, uppercase): Pane labels and detail-section headings; keep these short and factual.
- **Metric** (700, 18px, tabular numerals): Scores and other scan-critical numeric values.

### Named Rules

**The Ledger Label Rule.** Uppercase tracking belongs to compact structural labels, never to paragraphs, record names, or primary actions.

## Layout

Desktop uses a three-pane ledger: a fixed collection rail (220px), a flexible queue with a 420px minimum, and a detail pane constrained between 320px and 430px. A 68px sticky top bar anchors authentication and environment context while each work pane scrolls independently.

At 1050px and below, the rail narrows to 190px and record detail becomes an off-canvas layer entering from the right. At 700px and below, the top bar wraps, the rail becomes a horizontally scrolling sticky collection strip, queue padding compresses, scores leave the row, and detail occupies the viewport below the header. Detail facts collapse from two columns to one.

Spacing follows a compact operational rhythm led by 8px gaps, 22px panel padding, and 28px workspace padding. Controls preserve a minimum 44px target. Long lists use ruled rows rather than isolated cards so the eye can compare records vertically.

**The Selection-to-Detail Rule.** On wide screens, queue and case file remain visible together; on narrow screens, the case file becomes the focused layer and provides a clear return action.

## Elevation & Depth

The system is flat by default. Pane hierarchy comes from tonal layering and one-pixel divider lines, not stacks of cards. Shadow is reserved for a moving detail drawer and the transient message toast, where it explains actual overlap.

### Shadow Vocabulary

- **Drawer Separation** (`-18px 0 40px rgba(15,23,42,.12)`): Separates the off-canvas detail pane from the queue during intermediate-width navigation.
- **Message Lift** (`0 12px 32px rgba(15,23,42,.18)`): Lifts transient system feedback above the workspace.
- **Selection Inset** (`inset 3px 0 #2563eb`): Marks the chosen queue record without turning it into a floating card.

### Named Rules

**The Flat Ledger Rule.** Surfaces remain flat at rest; elevation appears only when an element physically overlaps another layer or communicates transient feedback.

## Shapes

Controls use gently rounded 12px corners, rail selections use a tighter 9px radius, screenshots use 8px clipping, and toasts use 10px. Status badges are fully pill-shaped. Major panes, queue rows, and section boundaries remain square and are defined by straight rules, preserving the ledger character.

**The Rounded-Control Rule.** Round the things people touch; keep the information architecture rectilinear.

## Components

### Buttons

- **Shape:** Gently rounded controls (12px) with a 44px minimum height and firm 700 weight.
- **Primary:** Decision Blue with white text and 10px × 16px padding. Use for the single affirmative action in the current decision context.
- **Hover / Focus:** Neutral buttons move to a subtly tinted surface on hover. Keyboard focus uses a 2px Decision Blue outline offset by 2px.
- **Secondary:** White surface, Register Ink text, and an Archive Line border.
- **Destructive:** White surface and Action Red text. Keep destructive actions visibly secondary to approval.
- **Disabled:** Preserve the component silhouette and reduce opacity to 0.48; the cursor communicates unavailability.

### Chips

- **Style:** Compact status badges use Decision Wash, Decision Blue text, 4px × 9px padding, and a full pill radius.
- **State:** Use for the current record state, not as a general-purpose taxonomy decoration.

### Cards / Containers

- **Corner Style:** Major containers are square; this system does not build the workspace from floating cards.
- **Background:** Queue content sits on Ledger Canvas; selected rows and detail panes use Record Paper.
- **Shadow Strategy:** Flat at rest; refer to the overlap-only vocabulary in Elevation & Depth.
- **Border:** One-pixel Archive Lines establish hierarchy.
- **Internal Padding:** 22px on compact panels and mobile detail, 28px on desktop queue and detail.

### Inputs / Fields

- **Style:** White background, one-pixel Archive Line border, 12px radius, 9px × 12px padding, and a 44px minimum height.
- **Focus:** A 2px Decision Blue outline offset by 1px gives an immediate, high-contrast keyboard state.

### Navigation

The desktop collection rail is a cool tonal strip with full-width text buttons. The active collection changes to Record Paper, Decision Blue text, and stronger weight. On mobile, collections become a horizontally scrollable sticky strip below the wrapped top bar; labels do not wrap.

### Queue Rows

Rows are border-separated comparison units with aligned business, status, score, and disclosure columns. Hover reveals Record Paper. Selection adds the same surface plus a 3px blue inset rule; it never changes the record's content order.

### Detail Pane

The selected-record pane reads like a case file: title and badge, ruled fact sections, then actions. On smaller screens it is an inert-aware drawer with Escape dismissal and focus restoration; reduced-motion users receive no slide transition.

## Do's and Don'ts

### Do:

- **Do** keep the current record, its evidence, and its decision actions in one continuous case-file reading order.
- **Do** reserve Decision Blue for focus, selection, status emphasis, and the single primary action.
- **Do** use rules and tonal surfaces to organize dense data before adding elevation.
- **Do** preserve 44px minimum controls, visible focus, keyboard dismissal, and reduced-motion behavior.
- **Do** keep generated demo visuals isolated inside preview media or dedicated demo routes.

### Don't:

- **Don't** turn the operations ledger into a generic KPI dashboard or a grid of interchangeable cards.
- **Don't** import a customer's demo accent, typography, or shape language into the engine shell.
- **Don't** use cyan or red as competing primary-action colors.
- **Don't** hide an approval prerequisite; disabled actions must retain a concise explanation.
- **Don't** add decorative gradients, glass effects, or ambient shadows to resting workspace surfaces.
