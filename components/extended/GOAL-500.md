# Extended library — 500 components

## Goal

Grow `components/extended` from **116** live specimens to **500** in total, without
weakening the existing set. `EXTENDED_COUNT` in `index.ts` is the single source of
truth; the library page and its header read from it.

The library is not a gallery of pictures. Every entry is the real component, so it
must work with a keyboard, carry real state, survive light and dark mode, and move
like the rest of Victory UI.

## Loop protocol

1. Run `node scripts/check-extended.mjs` and record the count.
2. Pick the next families from the plan below. Do not exceed 12 entries per family
   file in one pass; one file per family keeps review and rollback cheap.
3. Spawn one subagent per family with the family brief, the 12 entry names and this
   file as the contract. Each subagent owns exactly one new file.
4. Integrate the new `*_SECTION` exports in `index.ts` and update the plan status.
5. Run `npx tsc --noEmit --incremental false`.
6. Run `node scripts/check-extended.mjs`; names and ids must stay unique.
7. Verify `/library` in the browser at 1440 and 390 in light and dark: count, no
   console errors, no horizontal overflow, every family filter opens.
8. Stop only at 500.

## Quality contract

- **Same world as Victory UI.** Semantic tokens only. Never raw palette classes
  (`text-gray-500`, `bg-white`, `border-neutral-200`) or hex/oklch literals. Text
  uses the composite utilities (`text-body-2-semibold`, `text-title-3-semibold`),
  never stacked size/weight/leading.
- **Source-owned.** No new dependencies. `"use client"` at the top of each family
  file. React 19 + TypeScript strict.
- **Live, not decorative.** Controls work. Menus open and close, toggles change,
  fields accept input, progress reflects the interaction. Use `useState`,
  `useId`, `useEffect` (with cleanup), and controlled values.
- **Animated with purpose.** Every specimen has at least one meaningful transition
  (open, select, complete, reorder, reveal) on `transform`, `opacity` or colour.
  150–240ms, ease-out. Never `transition-all`. Use the existing keyframes in
  `styles/globals.css` where they fit. Everything animated/pulsing respects
  `prefers-reduced-motion` (`motion-reduce:animate-none`,
  `motion-reduce:transition-none`).
- **Aligned.** Normal specimens fit a 320px measure and a 128–168px stage. Use
  `wide: true` only for genuinely wider content (tables, timelines, split views).
  The outer page already centers each demo; do not add your own page frame.
- **Accessible.** Labels on every control, `aria-pressed` / `aria-expanded` where
  relevant, Escape closes overlays, focus is always visible with
  `focus-visible:ring-2 focus-visible:ring-border-focus-ring`. Directional icons
  mirror with `rtl:-scale-x-100`; use logical spacing classes.
- **Real copy.** Names, numbers, dates, prices, statuses. No lorem ipsum, no
  placeholder-as-design, no emoji as an icon.
- **No hydration hazards.** No `Math.random()` or `Date.now()` during render.
  Fixed data lives at module scope; time-based values start in `useEffect`.
- **Unique names.** `check-extended.mjs` enforces unique section ids and entry
  names across the whole library. Read the current list before naming.

## File shape

```tsx
"use client";

import { useState } from "react";
import { RiCheckLine } from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

export function SomeDemo() { /* ... */ }

export const NAME_SECTION: ExtendedSection = {
  id: "kebab-case",
  title: "Title",
  blurb: "One sentence about the family.",
  file: "name.tsx",
  entries: [
    { name: "Some Demo", description: "What it does in one line.", Demo: SomeDemo },
  ],
};
```

Do not edit `index.ts`, the library page, the README or another family while
building a family. The integrator owns those.

## Family plan

All 32 families below shipped at 12 entries each. The status column is kept as
the delivery record.

| # | id | Title | Territory | Status |
|---|---|---|---|---|
| 1 | `onboarding` | Onboarding | First-run paths to the first real result | shipped |
| 2 | `devtools` | Devtools | Keys, hooks, deploys and logs | shipped |
| 3 | `editor` | Editor | Writing tools that stay out of the sentence | shipped |
| 4 | `files` | Files | Upload, find, share, version | shipped |
| 5 | `inbox` | Inbox | Threads, labels, staying caught up | shipped |
| 6 | `errors` | Errors | Failure, absence and waiting, said plainly | shipped |
| 7 | `health` | Health | Care plans, vitals and appointments | shipped |
| 8 | `learning` | Learning | Courses, practice and progress | shipped |
| 9 | `travel` | Travel | Itineraries, gates and trip details | shipped |
| 10 | `logistics` | Logistics | Shipments, stock and the last mile | shipped |
| 11 | `automation` | Automation | Triggers, branches and runs | shipped |
| 12 | `mobile` | Mobile | Small-screen chrome | shipped |
| 13 | `maps` | Maps | Places, routes and distance | shipped |
| 14 | `support` | Support | Queues, context and resolution | shipped |
| 15 | `recruiting` | Recruiting | Candidates, stages, interviews | shipped |
| 16 | `realestate` | Real estate | Listings, tours and the move | shipped |
| 17 | `food` | Food | Menus, orders and the table | shipped |
| 18 | `fitness` | Fitness | Sets, zones and recovery | shipped |
| 19 | `music` | Music | Playback, queues and sound | shipped |
| 20 | `weather` | Weather | Forecasts, alerts and the sky | shipped |
| 21 | `news` | News | Headlines without noise | shipped |
| 22 | `legal` | Legal | Clauses, signatures and paper trails | shipped |
| 23 | `public-services` | Public services | Cases, forms and benefits | shipped |
| 24 | `games` | Games | Quests, parties and rewards | shipped |
| 25 | `creator` | Creator | Uploads, clips and audience | shipped |
| 26 | `crypto` | Crypto | Wallets, swaps and receipts | shipped |
| 27 | `devices` | Devices | Sensors, scenes and rooms | shipped |
| 28 | `finance` | Finance | Accounts, markets and money | shipped |
| 29 | `security` | Security | Sessions, keys and access | shipped |
| 30 | `collaboration` | Collaboration | Comments, approvals and handoff | shipped |
| 31 | `billing` | Billing | Plans, usage and money | shipped |
| 32 | `analytics` | Analytics | Funnels, cohorts and questions | shipped |

32 new families × 12 entries = 384, added to the current 116 = **500**.

## Progress

| Date | Count | Note |
|---|---:|---|
| 2026-11-05 | 116 | Baseline: 17 families, 116 live specimens |
| 2026-11-05 | 188 | First wave: onboarding, devtools, editor, files, inbox, errors |
| 2026-11-05 | 260 | Second wave: health, learning, travel, logistics, automation, mobile |
| 2026-11-05 | 332 | Third wave: maps, support, recruiting, real estate, food, fitness |
| 2026-11-05 | 404 | Fourth wave: music, weather, news, legal, public services, games |
| 2026-11-05 | 476 | Fifth wave: creator, crypto, devices, finance, security, collaboration |
| 2026-11-05 | 500 | Final wave: billing, analytics. Typecheck and integrity check pass. |
