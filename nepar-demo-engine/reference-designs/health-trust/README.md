# health-trust v2 golden references

The health-trust family is split into three materially different art directions. The ImageGen outputs created during the design review are the visual contracts; implementation uses real HTML/CSS and verified prospect data rather than text baked into mockups.

| Direction | Desktop generation ID | Mobile generation ID | First-view thesis |
|---|---|---|---|
| pet-first | `aeedb4e0-b270-4318-b700-3d443c747b9d` | `8e433b9d-bfac-4b9f-bd49-1cd1982d9294` | The relationship with the pet is the first trust signal. |
| doctor-first | `d4cbac22-eab6-4c64-8ff0-6519d75e9fd4` | `36fcc035-8b48-497c-b270-642b013d2919` | A verified professional portrait is the first trust signal. |
| clinic-first | `1c239bac-7714-4ad5-bb38-3ff8cae77e5d` | `9c5a47b3-cfac-498d-902d-39caee5204f5` | The environment and facility quality are the first trust signal. |

## Safety rule

A generated person must never be presented as a named real doctor or veterinarian. `doctor-first` requires a verified real portrait from the business website/social account or client-provided material.

## QA gate

A demo is outreach-ready only when:

- technical score >= 90
- visual score >= 88
- visual status is `passed`

The Playwright visual QA uses golden-reference geometry and composition signals, not raw pixel-diff alone.
