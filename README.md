# Arkvoid Inc. — Public Website

Official website for **Arkvoid Inc.** (`https://arkvoid.com`).

## Overview

Arkvoid Inc. is building a persistent living world of immortals, sects and spirit beasts where inhabitants remember what you did, live their own lives while you are away, and are still there when you come back.

## Tech Stack

- **Framework**: Vite + React + TypeScript (strict)
- **Styling**: Tailwind CSS v3.4 + CSS Custom Properties (`src/styles/globals.css`)
- **Motion**: GSAP (`ScrollTrigger`) + Lenis smooth scroll
- **Typography**: Self-hosted `@fontsource-variable/geist`, `@fontsource-variable/geist-mono`, `@fontsource/instrument-serif`

## Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Image Slots

Place production image assets inside `public/images/` matching the paths defined in `src/config/media.ts`. Until uploaded, `<Media />` renders an intentional architectural placeholder panel.
