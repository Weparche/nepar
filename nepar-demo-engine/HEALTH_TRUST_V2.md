# Health Trust v2

`health-trust` is a design family, not one template.

## Art directions

- `pet-first`: warm pet-led conversion experience; safe default when no stronger verified professional/facility imagery exists.
- `doctor-first`: verified named professional leads the composition. Hard-blocked without a verified real portrait.
- `clinic-first`: verified clinic/interior/equipment imagery leads the first viewport.

Selection is deterministic in `src/generation.ts` and its reason is persisted with the demo.

## Asset provenance

Every production visual carries provenance, source URL, verification timestamp, role, hero eligibility, and named-person metadata. Synthetic decorative assets cannot claim to depict a named real person. Legacy assets remain renderable as `legacy-unverified`, but never qualify for doctor-first/clinic-first selection.

## Quality model

`Technical QA` and `Visual QA` are independent. Technical QA checks loading, overflow, links, placeholders, verified contact data, images and console health. Visual QA checks art-direction match, first-view geometry, image dominance, hierarchy, CTA timing, trust strip, service rhythm and mobile sticky call behavior.

Approval is server-side blocked unless technical >= 90 and visual >= 88.

## Golden references

See `reference-designs/health-trust/README.md` for the six approved design generation IDs and design contracts.

## Deployment order

Before deploying code that writes v2 fields, apply `migrations/0003_health_trust_v2.sql` to the target D1 database. Existing non-health renderers remain routed through the legacy renderer.
