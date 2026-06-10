# Landing Page Demo

## Purpose
Conversion-optimized landing page engine with swappable industry content ("verticals").

## Archetype Coverage
Marketing / Acquisition — verticalized landing pages for 5 industries.

## What's Built
- Vertical engine: 5 industry profiles (Construction, Dental, Real Estate, Trades, Legal) driven entirely by data
- 7-section conversion funnel: Hero → Proof → Services → Case Studies → Testimonials → Process → Contact
- Qualification wizard for lead capture
- Sticky mobile CTA
- All routes statically generated at build time

## Architecture
- Next.js 16 App Router, Tailwind v4, Framer Motion
- @jaostudio/engine — PageRenderer + SectionRenderer with component registry
- @jaostudio/ui — 7 section components with default registry mapping
- @jaostudio/core — theme provider, events, storage helpers
- No database — content-driven via Zod-validated vertical data

## Credentials
No authentication required.

## Commands
```
npm run dev        # Start development server
npm run build      # Production build
```
