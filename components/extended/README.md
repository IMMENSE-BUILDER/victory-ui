# Extended library

Five hundred components in forty-nine families, written for this project and kept
out of `components/base` on purpose: base is Victory UI's shipped surface, this is a
separate library that can grow, be pruned, or be promoted one family at a time.

Rendered live at `/library`. The index leads with families; opening one renders
its real components, not pictures.

## Browsing

Six chapters keep the index short at this size:

| Chapter | Families | Components | Territory |
|---|---:|---:|---|
| Foundations | 11 | 94 | Inputs, selection, forms, time, onboarding, feedback, errors, navigation, mobile, surfaces, structure |
| Data | 4 | 33 | Data display, tables, charts, analytics |
| Media | 6 | 61 | Media, music, content, news, creator, editor |
| Workspace | 6 | 66 | Files, inbox, support, collaboration, AI, automation |
| Business | 10 | 102 | Commerce, finance, billing, crypto, food, social, security, system, devtools, devices |
| Domains | 12 | 144 | Health, fitness, games, learning, travel, weather, maps, logistics, recruiting, real estate, legal, public services |

`index.ts` aggregates every `*_SECTION` into `EXTENDED_SECTIONS`, derives
`EXTENDED_COUNT`, and declares the six `EXTENDED_CHAPTERS`. The page never
hardcodes a total.

## Conventions

Every specimen follows the base set's rules:

- Semantic tokens only (`bg-background-tertiary-default`, `text-text-secondary`,
  `border-separator-border`, `bg-status-*`, `chart-*`). No raw palette classes,
  no hex.
- Composite type utilities (`text-body-2-semibold`, `text-title-3-semibold`),
  never stacked `text-sm font-medium`.
- `cx()` for class merging, `sortCx()` for variant maps.
- Logical properties (`ms`, `me`, `ps`, `pe`, `start`, `end`, `border-s`), and
  mirrored glyphs (`rtl:-scale-x-100`) wherever direction matters.
- Focus is always visible: `focus-visible:ring-2 focus-visible:ring-border-focus-ring`.
- Icons are Remix references rendered by the component, never emoji or glyph
  stand-ins.
- Interactive specimens carry real state: menus open, fields accept input,
  progress reflects the action, and every animation respects reduced motion.
- A family is one file, twelve entries, one `*_SECTION` export. Normal demos fit
  a 320px measure; `wide: true` spans two columns for genuinely wider content.

## Adding a specimen

1. Add the component and its demo to the family file.
2. Add an entry to that file's `*_SECTION.entries`:
   `{ name, description, Demo, wide? }`. `wide` spans two grid columns — use it
   for anything wider than ~330px so the three-column grid keeps full rows.
3. Nothing else: the page reads `EXTENDED_SECTIONS`.

## Adding a family

Create the file with its `*_SECTION` export, import it in `index.ts`, push it onto
`EXTENDED_SECTIONS`, and add its id to one of `EXTENDED_CHAPTERS`. The chapter
pills, family index and count follow.

## Verify

```bash
npx tsc --noEmit --incremental false
node scripts/check-extended.mjs
```

The checker proves every section is imported and mounted, every entry name and
section id is unique, every `Demo` is defined, and every section belongs to
exactly one chapter. It exits non-zero if any check fails or the total is not 500.

`GOAL-500.md` is the build contract and the record of how the library reached
this size.

## Copying a component

Every specimen carries a small **Copy code** button in its top corner. It copies
that component's own source, verbatim, prefixed with the family file's preamble
(imports and shared helpers) so the snippet runs on its own. No component source
is modified to make this work.

- scripts/generate-extended-sources.mjs writes one public/sources/<id>.json
  per family: { preamble, entries: { \"Entry Name\": \"...\" } }.
- It runs automatically as prebuild, or on demand with
  `npm run sources:extended`.
- `components/application/library/copy-source-button.tsx` fetches a family's
  JSON the first time one of its buttons is used, then caches it in memory, so
  the page never ships 500 copies of source up front.
- A family's JSON is generated from the file on disk; if a component is edited,
  rerun the generator (or build) to refresh what the button copies.
