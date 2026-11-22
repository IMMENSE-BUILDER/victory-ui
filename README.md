# Victory UI

Victory UI is a React design system for agentic interfaces: the parts an AI product needs and the parts every dashboard needs, in one visual language, as source files in your project. Its homepage is a working AI chat on your own model key.

## Why this design system?

- **Built for agent products.** Chat, thinking indicator, agent log, composer and sidebar, next to the tables, cards and forms around them.
- **Source, not a dependency.** `npx victory-ui add` copies the files into your project. Change anything.
- **One visual language.** Figma first, 400+ semantic tokens, light and dark from the same classes.
- **Accessible by default.** React Aria Components underneath, Tailwind CSS v4 on top, no runtime CSS.
- **RTL Support.** Direction-aware layouts, keyboard navigation, and overlays for Arabic, Hebrew, and other right-to-left languages.
- **Agent-native.** MCP server, agent skill, `AGENTS.md` rules and `llms.txt`, so coding agents build with the system.

## What's in this repository

- The 44 base items as source: base components, application blocks, tokens and type scale. The catalogue is below.
- The extended library: 500 project-owned components in 49 families at `/library`, built on the same tokens and type scale and kept in `components/extended`. Open a family to use the real component.
- The app: a chat at `/`, a dashboard with the two free charts, and sign-in and sign-up screens, all built from the components in this repository. Chat history stays in the visitor's browser. No database.
- `app/api/chat/route.ts`, which reads your key server-side and streams replies. The key never reaches the browser.

## Upstream credit

The **44 base items** in `/catalog` — `components/base`, `components/application` and
`components/foundations` — are adapted from [BoardUI](https://github.com/BoardUI/boardui),
Copyright (c) 2026 Mertcan Dundar Esmergul, under the MIT License. The 500-component
extended library in `/library`, and everything else in Victory UI, is original to this project.

## Bring your own key

One variable. The provider is read from the key itself:

| Key looks like | Provider | Default model |
| --- | --- | --- |
| `sk-ant-...` | Anthropic | claude-haiku-4-5 |
| `sk-or-...` | OpenRouter | openai/gpt-5-nano |
| `sk-...` | OpenAI | gpt-5.4-mini |
| `AIza...` | Google Gemini | gemini-2.5-flash |
| `vck_...` | Vercel AI Gateway | openai/gpt-5-nano |
| `gsk_...` | Groq | llama-3.3-70b-versatile |
| `xai-...` | xAI | grok-4-fast-non-reasoning |

Create the key with a spending limit where the provider offers one: OpenRouter can cap the credits a key may spend, OpenAI has usage limits per project. The key never reaches the browser, but the chat itself is open to anyone who has your URL, so the cap is what bounds the cost.

Set `CHAT_MODEL` to use a different model. For Mistral or DeepSeek, whose keys have no recognisable shape, add `AI_PROVIDER=mistral` or `AI_PROVIDER=deepseek`. For any OpenAI-compatible server (Ollama, LM Studio, vLLM, LiteLLM, Together) set `AI_BASE_URL` and `CHAT_MODEL`. Every provider's usual variable (`OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, ...) works too. See `.env.example`.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then put your key in AI_API_KEY
npm run dev
```

## Extended library

`/library` is a project-owned library of **500 components in 49 families**, separate from the 69 free Victory UI items. It follows the same semantic tokens, composite type scale, focus treatment and reduced-motion rules as the base set.

- Browse six chapters — Foundations, Data, Media, Workspace, Business, Domains — then open a family to use its live specimens.
- Search names and descriptions across all 500 without mounting every demo at once.
- Source lives in `components/extended`, one file per family, with `*_SECTION` exports aggregated by `index.ts`.
- `components/extended/README.md` covers the conventions and how to add a family.
- Every specimen has a corner **Copy code** button that copies its own source verbatim, generated into `public/sources` by `npm run sources:extended` (also runs on `prebuild`).
- Verify with `npx tsc --noEmit --incremental false` and `node scripts/check-extended.mjs`.

## Install into an existing project

Every component in this repository also installs on its own, as source, into any Next.js project.

### With an agent

Victory UI has an MCP server, so Claude Code, Cursor and any MCP client can browse the catalog and install for you. Add it once:

```bash
claude mcp add Victory UI -- npx -y Victory UI@latest mcp
```

Cursor and most other clients take the same server in their MCP config:

```json
{
  "mcpServers": {
    "Victory UI": { "command": "npx", "args": ["-y", "Victory UI@latest", "mcp"] }
  }
}
```

Then ask in plain words. "Install every free Victory UI component" installs the whole free catalog in one go. "Add a data table and stat cards to the dashboard" installs just those and wires them in. The rules in `AGENTS.md` keep whatever it builds on Victory UI's tokens and type scale. Setup for VS Code, Codex and the rest is at [victoryui.dev/mcp](https://www.victoryui.dev/mcp).

### With the CLI

```bash
npx victory-ui@latest list              # every component, one line each
npx victory-ui@latest add data-table    # one component and what it depends on
npx victory-ui@latest add --all         # everything in this repository
```


## RTL Support

Victory UI supports Arabic, Hebrew, and other right-to-left languages with the same component source. The app already uses `DirectionProvider` in `app/layout.tsx`. To switch the whole app to Arabic, change the document and provider together:

```tsx
import { DirectionProvider } from "@/components/foundations/direction/direction";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <DirectionProvider locale="ar">{children}</DirectionProvider>
      </body>
    </html>
  );
}
```

Keep the existing font classes, metadata, and theme script when updating your layout. Use `he` for Hebrew, or `en-US` with `dir="ltr"` for English. Choose a font with Arabic or Hebrew coverage. Nest providers for regions in another language; CSS direction alone does not configure React Aria keyboard navigation, calendars, or portalled menus.

In an existing project, install the foundation with `npx victory-ui@latest add direction`. Use logical styles such as `ps`/`pe`, `ms`/`me`, `start`/`end`, and `text-start`/`text-end` for your own layouts. Mirror navigation arrows and drawer motion, and pass `dir={useDirection()}` to custom portal roots. Keep email addresses, URLs, code, and OTP digits in LTR regions; their fields still align with the surrounding layout.

Translate labels, placeholders, and accessible names in your application's translation layer, and use `Intl` for dates, numbers, and currencies. The optional `template-copy` foundation provides `TemplateCopyProvider` for translating display copy. Direction and translation are configured separately; Chinese (`zh-CN`) uses LTR.

When working with an agent, ask it to read the `direction` component and usage examples, install it, and configure the matching document and provider locale. The rules in `AGENTS.md` and `.cursor/rules/Victory UI.mdc` include the direction conventions. For an older installation, preserve your customizations before refreshing component source and global styles.

See the [RTL setup guide and live Arabic/Hebrew examples](https://www.victoryui.dev/rtl).

The live examples use the actual Auth Card, Date Range Picker, Radio Cards, and Checkbox components. For example, these preferences show both checkbox states in Arabic:

```tsx
"use client";

import { DirectionProvider } from "@/components/foundations/direction/direction";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { SegmentedControl, SegmentedControlItem } from "@/components/base/segmented-control/segmented-control";

export function Preferences() {
  return (
    <DirectionProvider locale="ar">
      <div className="flex flex-col gap-4">
        <SegmentedControl aria-label="الفترة" defaultSelectedKeys={["weekly"]}>
          <SegmentedControlItem id="daily">يومي</SegmentedControlItem>
          <SegmentedControlItem id="weekly">أسبوعي</SegmentedControlItem>
          <SegmentedControlItem id="monthly">شهري</SegmentedControlItem>
          <SegmentedControlItem id="yearly">سنوي</SegmentedControlItem>
        </SegmentedControl>
        <Checkbox defaultSelected>إشعارات البريد الإلكتروني</Checkbox>
        <Checkbox>تحديثات المنتج</Checkbox>
      </div>
    </DirectionProvider>
  );
}
```

For Hebrew, use `locale="he"` with the labels `התראות בדוא״ל` and `עדכוני מוצר`. The first checkbox starts checked; the second starts unchecked. Both remain interactive and follow the provider's direction.


## Components

### Application blocks

Composed screens and panels: sidebars, chat, tables, settings, cards.

| Component | What it is | Install |
| --- | --- | --- |
| [Agent Chat](https://www.victoryui.dev/components/chat-starter) | A working chat app: app sidebar, streaming replies, thinking indicator, a composer pill with stop control, a chat-history rail with local thread switching, and a setup notice when no provider key is set. | `npx victory-ui@latest add agent-chat` |
| [Agent Log](components/application/agent-log/agent-log.tsx) | Shared streaming-log machinery: the reveal ticker, the blur-in with its soft clipping edge, and the curved tree guide that draws itself. Behind Task List and Web Search. | `npx victory-ui@latest add agent-log` |
| [Agent Thinking](https://www.victoryui.dev/components/agent-thinking) | Agent thinking indicator for chat composers — dot wave, dot spin, stars, and infinity variants with a shimmering label and elapsed timer. | `npx victory-ui@latest add agent-thinking` |
| [App Shell](components/application/app-shell/app-shell.tsx) | Page frame for the chat starter: the sidebar, a phone drawer, and a titled content card, carrying the starter's own navigation so the sidebar only links to pages the app has. | `npx victory-ui@latest add app-shell` |
| [Auth Card](https://www.victoryui.dev/components/auth-card) | Sign-in and sign-up cards with social providers stacked with labels or inline as icons, plus email fields and a CTA. | `npx victory-ui@latest add auth-card` |
| [Composer Loader](https://www.victoryui.dev/components/composer-loader) | Loading state that wraps a chat composer — an iridescent light band orbiting the rim with a soft inward bloom, fading in while the agent works. | `npx victory-ui@latest add composer-loader` |
| [Data Grid](https://www.victoryui.dev/components/data-grid) | Virtualized spreadsheet with editable cells, range selection, filters, resizable columns, undo and redo, summaries, and CSV export. | `npx victory-ui@latest add data-grid` |
| [Data Table](https://www.victoryui.dev/components/data-table) | TanStack-powered data table with sorting, selection, and pagination. | `npx victory-ui@latest add data-table` |
| [Important Alerts Card](https://www.victoryui.dev/components/medical-profile) | Scrollable alert feed with tinted icon circles and date pills. | `npx victory-ui@latest add important-alerts-card` |
| [Notification Center](https://www.victoryui.dev/components/notification-center) | Tabbed activity inbox with grouped notifications, unread state, avatars, status icons, and inline actions. | `npx victory-ui@latest add notification-center` |
| [Orders Chart Card](https://www.victoryui.dev/components/orders-chart-card) | Free chart card: a year of monthly orders as bars, this year beside last year for every month, with a count-up headline, delta chip and hover readout. | `npx victory-ui@latest add orders-chart-card` |
| [Patient Info Card](https://www.victoryui.dev/components/medical-profile) | Profile card with avatar and label/value detail rows. | `npx victory-ui@latest add patient-info-card` |
| [Revenue Chart Card](https://www.victoryui.dev/components/revenue-chart-card) | Free chart card: a year of monthly revenue as an area against the year before, with a count-up headline, delta chip and hover readout per month. | `npx victory-ui@latest add revenue-chart-card` |
| [Settings Modal](https://www.victoryui.dev/components/settings-modal) | Controlled multi-page settings dialog with General, Profile, Tools, and Storage views. | `npx victory-ui@latest add settings-modal` |
| [Sidebar](https://www.victoryui.dev/components/sidebar) | The floating dashboard sidebar with team menu, nav, announcement, and user menu. | `npx victory-ui@latest add sidebar` |
| [Stat Cards](https://www.victoryui.dev/components/stat-cards) | KPI stat card row with delta chips. | `npx victory-ui@latest add stat-cards` |
| [Theme Toggle](https://www.victoryui.dev/components/theme-toggle) | Manual light/dark control with a click-origin reveal, local persistence, and no system-theme dependency. | `npx victory-ui@latest add theme-toggle` |

### Base components

The everyday building blocks.

| Component | What it is | Install |
| --- | --- | --- |
| [Announcement](https://www.victoryui.dev/components/announcement) | Dismissible announcement card used in the sidebar footer. | `npx victory-ui@latest add announcement` |
| [Avatar](https://www.victoryui.dev/components/avatar) | Image or initials avatar in multiple sizes and tints. | `npx victory-ui@latest add avatar` |
| [Badge](https://www.victoryui.dev/components/badge) | Counter pills and the Kbd shortcut hint. | `npx victory-ui@latest add badge` |
| [Breadcrumb](https://www.victoryui.dev/components/breadcrumb) | Icon-capable breadcrumb trail. | `npx victory-ui@latest add breadcrumb` |
| [Button](https://www.victoryui.dev/components/button) | Primary, secondary, ghost, and danger buttons in three sizes with icon support. | `npx victory-ui@latest add button` |
| [Button Group](https://www.victoryui.dev/components/button-group) | Row of secondary-style buttons fused into one bordered control with hairline dividers and selectable items. | `npx victory-ui@latest add button-group` |
| [Carousel](https://www.victoryui.dev/components/carousel) | Gallery carousel built on CSS scroll-snap: swipe, arrows and a position indicator. | `npx victory-ui@latest add carousel` |
| [Checkbox](https://www.victoryui.dev/components/checkbox) | React Aria checkbox with animated tick and indeterminate state. | `npx victory-ui@latest add checkbox` |
| [Checkbox Card](https://www.victoryui.dev/components/checkbox) | Bordered selectable card driven by a checkbox. | `npx victory-ui@latest add checkbox-card` |
| [Chip](https://www.victoryui.dev/components/chip) | Status/delta chips in bold and soft variants across the accent palette. | `npx victory-ui@latest add chip` |
| [Close Button](https://www.victoryui.dev/components/close-button) | Compact dismiss button for banners, modals, and chips. | `npx victory-ui@latest add close-button` |
| [Date Picker](https://www.victoryui.dev/components/date-picker) | Single-date picker with month navigation, built on React Aria. | `npx victory-ui@latest add date-picker` |
| [Date Range Picker](https://www.victoryui.dev/components/date-picker) | Two-month range picker sharing the date-picker chrome. | `npx victory-ui@latest add date-range-picker` |
| [Divider](https://www.victoryui.dev/components/divider) | Horizontal content divider with single-line, double-line, filled, and aligned variants. | `npx victory-ui@latest add divider` |
| [Dropdown](https://www.victoryui.dev/components/dropdown) | Composable popover menu (trigger, panel, groups, rows, dividers) built on React Aria — the recipe behind the sidebar team/account menus. | `npx victory-ui@latest add dropdown` |
| [File Upload](https://www.victoryui.dev/components/file-upload) | Drag-and-drop file upload with validation, animated progress, and a completion callback. | `npx victory-ui@latest add file-upload` |
| [Icon Button](https://www.victoryui.dev/components/icon-button) | Square icon-only button in two sizes. | `npx victory-ui@latest add icon-button` |
| [Input](https://www.victoryui.dev/components/input) | Text input with label, hint text, error states, and leading icon support. | `npx victory-ui@latest add input` |
| [Input OTP](https://www.victoryui.dev/components/input-otp) | One-time-code field with a monospace box per digit, paste distribution and autofill support. | `npx victory-ui@latest add input-otp` |
| [Kbd](https://www.victoryui.dev/components/badge) | Keyboard shortcut hint pill. | `npx victory-ui@latest add kbd` |
| [Link Button](https://www.victoryui.dev/components/link-button) | Inline text action styled like a link — primary/secondary variants, three sizes, icon support, renders <a> or <button>. | `npx victory-ui@latest add link-button` |
| [Meeting Scheduler](https://www.victoryui.dev/components/date-picker) | Date + time-slot scheduler popover. | `npx victory-ui@latest add meeting-scheduler` |
| [Notification](https://www.victoryui.dev/components/notification) | Dismissible notification with status icons, avatars, action buttons, and timed countdown. | `npx victory-ui@latest add notification` |
| [Pagination](https://www.victoryui.dev/components/pagination) | Numbered pagination with prev/next and ellipsis collapsing. | `npx victory-ui@latest add pagination` |
| [Radio](https://www.victoryui.dev/components/radio) | React Aria radio group with the gradient selected dot, two sizes, and the bare RadioDot glyph for menu rows. | `npx victory-ui@latest add radio` |
| [Radio Card](https://www.victoryui.dev/components/radio) | Bordered selectable card driven by a radio — the radio flavor of Checkbox Card. | `npx victory-ui@latest add radio-card` |
| [Segmented Control](https://www.victoryui.dev/components/segmented-control) | Pill-style segmented control (Weekly / Monthly / Yearly switchers). | `npx victory-ui@latest add segmented-control` |
| [Select](https://www.victoryui.dev/components/select) | React Aria select with styled trigger, non-modal popover, and free-form item content. | `npx victory-ui@latest add select` |
| [Slider](https://www.victoryui.dev/components/slider) | Single-value and min/max range sliders with exact-value bubbles and keyboard controls. | `npx victory-ui@latest add slider` |
| [Social Button](https://www.victoryui.dev/components/social-button) | Sign-in buttons for 24 providers, with brand logos, three colour treatments and an icon-only form. | `npx victory-ui@latest add social-button` |
| [Status Dot](https://www.victoryui.dev/components/chip) | Colored status indicator dot used inside selects and tables. | `npx victory-ui@latest add status-dot` |
| [Switch](https://www.victoryui.dev/components/switch) | Skeuomorphic toggle switch in two sizes. | `npx victory-ui@latest add switch` |
| [Switch Card](https://www.victoryui.dev/components/switch) | Bordered settings row driven by a switch. | `npx victory-ui@latest add switch-card` |
| [Table](https://www.victoryui.dev/components/table) | Static table primitives matching the dashboard tables. | `npx victory-ui@latest add table` |
| [Tabs](https://www.victoryui.dev/components/tabs) | Underline and pill tab variants built on React Aria. | `npx victory-ui@latest add tabs` |
| [Textarea](https://www.victoryui.dev/components/textarea) | Multiline text field with auto-grow, character count, and Input's label, hint and states. | `npx victory-ui@latest add textarea` |
| [Tooltip](https://www.victoryui.dev/components/tooltip) | Light-surface tooltip built on React Aria. | `npx victory-ui@latest add tooltip` |
| [Tree View](https://www.victoryui.dev/components/tree-view) | Nested folders and structured content with expandable branches, selection, guide lines, and keyboard navigation. | `npx victory-ui@latest add tree-view` |

### Foundations

Tokens, type scale, global styles, utilities, and the agent rules.

| Component | What it is | Install |
| --- | --- | --- |
| [Agent rules](.cursor/rules/Victory UI.mdc) | Always-on design rules for AI agents (semantic tokens, type scale, conventions), installed as a Cursor rule file. | `npx victory-ui@latest add rules` |
| [Agent runtime](https://www.victoryui.dev/components/chat-starter) | Streaming chat endpoint for agent templates: one AI_API_KEY from OpenAI, Anthropic, Google, OpenRouter, Groq, xAI or Vercel AI Gateway (or any OpenAI-compatible server by URL), a config probe for unconfigured deploys, and the message contract the Victory UI chat UI installs against. | `npx victory-ui@latest add agent-runtime` |
| [Chevron icons](https://www.victoryui.dev/components/dropdown) | Custom chevron glyphs (select caret, sortable table headers) matching the Figma strokes. | `npx victory-ui@latest add chevrons` |
| [cx utility](utils/cx.ts) | tailwind-merge wrapper aware of Victory UI's composite text styles, plus the sortCx helper. | `npx victory-ui@latest add cx` |
| [Direction Provider](https://www.victoryui.dev/rtl#direction-provider) | Locale and layout direction for RTL and LTR regions, React Aria interactions, and portals. | `npx victory-ui@latest add direction` |
| [Directional icons](utils/directional-icon.ts) | Mirrors navigation arrows and sidebar glyphs in RTL while preserving non-directional icons. | `npx victory-ui@latest add directional-icon` |
| [Directional scrolling](utils/scroll-direction.ts) | Logical horizontal scroll offsets and item alignment for RTL and LTR carousels and tab strips. | `npx victory-ui@latest add scroll-direction` |
| [Global styles](styles/globals.css) | Tailwind entry css: dark-mode variant, base resets, component animations, and table styling. Imports theme.css and typography.css. | `npx victory-ui@latest add globals` |
| [Logo](components/foundations/brand/logo.tsx) | Victory UI brand mark placeholder — swap with your own logo component. | `npx victory-ui@latest add logo` |
| [Template copy](components/foundations/template-copy/template-copy.tsx) | Optional application translations for template labels, sample content, and accessible names, preserving identifiers and input values. | `npx victory-ui@latest add template-copy` |
| [Theme tokens](https://www.victoryui.dev/components/color) | Color primitives, semantic tokens (text/background/border/foreground/chart), radii, shadows, and button gradient utilities. | `npx victory-ui@latest add theme` |
| [Typography tokens](https://www.victoryui.dev/components/typography) | The full Figma type scale as composite text-{family}-{weight} Tailwind utilities. | `npx victory-ui@latest add typography` |
| [useCountUp hook](hooks/use-count-up.ts) | Animated rolling number hook used by chart headline figures. | `npx victory-ui@latest add use-count-up` |
| [useDismissOnOutsidePress hook](utils/use-dismiss-on-outside-press.ts) | Closes React Aria popovers on outside press without swallowing the outside click. | `npx victory-ui@latest add use-dismiss-on-outside-press` |
## Before going public

Requests bill to whoever owns the key, and anyone who has your URL can send them. Three ways to bound that, simplest first: create the key with a spending limit, turn on Vercel's deployment protection for a personal deployment, and put a rate limit in front of `/api/chat` before pointing the internet at it.

