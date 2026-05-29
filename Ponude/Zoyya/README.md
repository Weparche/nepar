# Zoyya Marketplace — MVP Demo

Interactive frontend prototype showcasing a redesigned Zoyya beauty & wellness discovery marketplace. Includes desktop marketplace layout and mobile app experience with map-first discovery, search, filters, salon details, and mock booking flow.

## Tech Stack

- React + Vite + TypeScript
- Tailwind CSS
- Leaflet + OpenStreetMap
- Lucide React icons
- Playwright (visual QA)
- Impeccable (design review)

## Prerequisites

- Node.js 18+
- npm

## Installation

```bash
npm install
npx playwright install chromium
```

## Development

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
npm run preview
```

Build output goes to `dist/`. Assets are configured for subpath deployment at `/zoyya/`.

For local dev at root (without subpath), run:

```bash
VITE_BASE_PATH=/ npm run dev
```

## Deploy to nepar.hr/zoyya

Recommended path — uses the existing `nepar.hr` hosting.

### One command (build + copy)

```bash
npm run deploy:zoyya
```

This builds Zoyya and copies output to `../../public/zoyya/` in the Nepar repo.

Then build and deploy Nepar as usual:

```bash
cd ../..
npm run build
# deploy dist/ (git push, Cloudflare Pages, etc.)
```

### All-in-one (Zoyya + Nepar build)

```bash
npm run deploy:zoyya:full
```

### Live URL

[https://nepar.hr/zoyya/](https://nepar.hr/zoyya/)

---

## Deploy elsewhere (app.nepar.hr or custom server)

Build output goes to `dist/` with `base: '/zoyya/'`.

```bash
npm run build
```

Copy `dist/*` to the server folder that serves `/zoyya/`.
See `deploy/nginx-zoyya.conf` for nginx snippet.

## Playwright Visual Tests

Run visual QA tests (starts dev server automatically):

```bash
npm run test:visual
```

Interactive Playwright UI:

```bash
npm run test:visual:ui
```

### Screenshots

After running tests, screenshots are saved to:

- `screenshots/zoyya-desktop.png` (1440×1000 viewport)
- `screenshots/zoyya-mobile.png` (390×844 viewport)

## Design Review (Impeccable)

Run Impeccable anti-pattern detection on source files:

```bash
npm run design:review
```

## Reference

Visual direction based on `zoyya.png` in the project root.

## MVP Note

Booking in this demo is mock-only. In production it can connect to the existing Zoyya booking system, WhatsApp inquiry, or a salon calendar.
