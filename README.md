# ThinkLens

ThinkLens is an AI decision and reasoning companion. It helps people
structure a decision, lay out the options and criteria involved, and think
through trade-offs, assumptions, and missing information — acting as a
reasoning partner rather than a tool that makes the decision for you.

This branch (`feature/foundation`) contains the foundation of the ThinkLens
web app: routing, layout, design tokens, a health-check endpoint, and a
fully interactive (client-side only, not yet persisted) Decision Setup form.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) 16
- [React](https://react.dev/) 19
- TypeScript
- [Tailwind CSS](https://tailwindcss.com/) v4
- ESLint (`eslint-config-next`)

No state-management library, backend, or database has been introduced yet —
see [Current status](#current-status) below.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Other scripts:

```bash
npm run build   # production build
npm run start   # run the production build locally
npm run lint     # ESLint
```

## Routes

| Route | Purpose |
|---|---|
| `/` | ThinkLens home / landing page |
| `/decisions` | Decision dashboard (placeholder) |
| `/decisions/new` | Create a new decision — the Decision Setup form |
| `/decisions/[id]` | Decision workspace for a single decision (placeholder) |
| `/decisions/[id]/analysis` | Reasoning / AI analysis for a decision (placeholder) |
| `/decisions/[id]/summary` | Structured decision summary (placeholder) |
| `/health` | Health-check page — fetches and renders live status from `/api/health` |
| `/api/health` | JSON health-check endpoint (`status`, `service`, `timestamp`) |

## Project structure

```
src/app/
├── layout.tsx                  Root layout — nav, fonts, metadata
├── globals.css                 Tailwind import + design tokens
├── page.tsx                    / (Home)
├── health/page.tsx             /health
├── api/health/route.ts         GET /api/health
├── decisions/
│   ├── page.tsx                 /decisions
│   ├── new/page.tsx              /decisions/new — Decision Setup
│   └── [id]/
│       ├── page.tsx               /decisions/[id]
│       ├── analysis/page.tsx      /decisions/[id]/analysis
│       └── summary/page.tsx       /decisions/[id]/summary
└── components/
    ├── nav.tsx                   Site navigation
    ├── placeholder-page.tsx      Shared layout for not-yet-built pages
    ├── decision-setup-form.tsx   Client Component parent — owns all Decision Setup state
    ├── decision-details.tsx      Title / context / deadline / urgency fields
    ├── decision-options.tsx      Options Under Consideration (add/remove/edit)
    ├── decision-criteria.tsx     Evaluation Criteria (add/remove/edit, importance)
    └── decision-context.tsx      Constraints & Stakeholders fields
```

## Design system

A small set of semantic design tokens is defined in `globals.css` and used
throughout the app instead of raw colors:

| Token | Used for |
|---|---|
| `background` | Page background |
| `foreground` | Primary text |
| `muted` | Secondary / helper text |
| `surface` | Card and section backgrounds |
| `border` | Borders |
| `accent` / `accent-hover` | Primary actions, links, focus state |

The visual style is intentionally plain: no gradients, animations, or
decorative effects — the focus is on clarity and legibility.

## Architecture notes

- **Server Components by default.** Every route (`page.tsx`) is a Server
  Component. `"use client"` is only added where a component genuinely needs
  interactivity or state.
- **Decision Setup state is lifted to one place.** `DecisionSetupForm` is
  the single Client Component boundary for `/decisions/new`. It owns all
  form state (title, context, deadline, urgency, options, criteria,
  constraints, stakeholders) and passes values and callbacks down to
  `DecisionDetails`, `DecisionOptions`, `DecisionCriteria`, and
  `DecisionContext` as props. This keeps the client-side JavaScript scoped
  to exactly one section of one page, and means a future "Continue" action
  will have access to the complete decision in one place.
- **No stable IDs from a UUID library.** Options and criteria use a small
  local ID-generation helper (a `useId()`-scoped prefix plus an
  incrementing counter) instead of adding a dependency.

## Current status

This branch covers the **foundation** phase of the project. As of this
branch:

- ✅ Routing, layout, navigation, and design tokens are in place
- ✅ `/health` fetches and renders live data from `/api/health`
- ✅ The Decision Setup form (`/decisions/new`) is fully interactive:
  add/remove/edit options and criteria, edit decision details, edit
  constraints and stakeholders — all in local component state
- 🚧 **Not yet implemented:** form validation, the Cancel/Continue actions,
  persistence (no database, no `localStorage`), API integration beyond the
  health check, and any AI-powered analysis or reasoning

Every other route (`/decisions`, `/decisions/[id]`, `/decisions/[id]/analysis`,
`/decisions/[id]/summary`) is currently a placeholder page, clearly marked
as such in the UI, awaiting a later milestone.

## Branches

- `main` — stable project documentation
- `round-1-vague` / `round-2-precise` — historical prompt-engineering
  exercises comparing a vague vs. precise prompt for an early, standalone
  HTML/CSS/JS version of the decision setup form
- `feature/foundation` (this branch) — the Next.js app foundation described
  above
