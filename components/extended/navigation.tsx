"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiBold,
  RiCheckLine,
  RiCloseLine,
  RiCodeLine,
  RiFileTextLine,
  RiImageLine,
  RiItalic,
  RiLinkM,
  RiMoreLine,
  RiSearchLine,
  RiShareLine,
  RiUnderline,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

const labelText = "text-body-2-medium text-text-secondary";

const iconButton =
  "flex size-7 items-center justify-center rounded-md text-foreground-icon-secondary transition-colors duration-150 ease " +
  "hover:bg-background-secondary-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";

/* -------------------------------------------------------------------------- */
/*  Accordion                                                                  */
/* -------------------------------------------------------------------------- */

const FAQ = [
  {
    q: "Can I keep the source files?",
    a: "Yes. Every export ships the editable document beside the flattened file, so a later revision never starts from a picture.",
  },
  {
    q: "How does the brand check work?",
    a: "It reads every colour and face on the page, compares them with the kit, and lists the layers that drift. Nothing changes until you press Apply.",
  },
  {
    q: "What happens to comments on a resize?",
    a: "They stay pinned to their layer. If a layer is removed the thread is archived with it, not deleted.",
  },
];

export function Accordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="w-full max-w-[340px] divide-y divide-separator-border rounded-xl border border-border-button-default bg-background-primary-default">
      {FAQ.map((item, index) => {
        const expanded = open === index;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={expanded}
                aria-controls={`faq-${index}`}
                onClick={() => setOpen(expanded ? null : index)}
                className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-start transition-colors duration-150 ease hover:bg-background-secondary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                <span className="text-body-2-semibold text-text-primary">{item.q}</span>
                <RiArrowDownSLine
                  aria-hidden
                  className={cx("size-4 shrink-0 text-foreground-icon-secondary transition-transform duration-200 ease-out", expanded && "rotate-180")}
                />
              </button>
            </h3>
            <div
              id={`faq-${index}`}
              className={cx("grid transition-[grid-template-rows] duration-200 ease-out", expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
            >
              <div className="overflow-hidden">
                <p className="px-3 pb-3 text-body-2-regular text-text-secondary">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Popover                                                                    */
/* -------------------------------------------------------------------------- */

export function Popover() {
  const [open, setOpen] = useState(false);
  const [access, setAccess] = useState<"view" | "comment" | "edit">("comment");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((next) => !next)}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border-button-default bg-background-primary-default px-2.5 text-body-2-medium text-text-primary shadow-xs transition-colors duration-150 ease hover:bg-background-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        <RiShareLine className="size-4 text-foreground-icon-secondary" aria-hidden />
        Share
      </button>

      <div
        role="dialog"
        aria-label="Share settings"
        className={cx(
          "absolute top-[calc(100%+6px)] start-0 z-30 w-[248px] origin-top rounded-xl border border-border-button-default bg-background-primary-default p-3 shadow-dropdown",
          "transition-[opacity,transform] duration-150 ease-out",
          open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0",
        )}
      >
        <p className="text-body-2-semibold text-text-primary">Anyone with the link</p>
        <p className="mt-0.5 text-caption-1-regular text-text-secondary">/s/9f2c</p>
        <div className="mt-2.5 flex flex-col gap-1">
          {(["view", "comment", "edit"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setAccess(option)}
              className={cx(
                "flex items-center justify-between rounded-md px-2 py-1.5 text-start text-body-2-regular capitalize transition-colors duration-100 ease",
                access === option ? "bg-background-tertiary-default text-text-primary" : "text-text-secondary hover:bg-background-secondary-hover",
              )}
            >
              {option}
              {access === option && <RiCheckLine className="size-3.5 text-foreground-icon-primary" aria-hidden />}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="mt-2.5 h-7 w-full rounded-lg bg-button-primary text-caption-1-semibold text-text-white shadow-xs hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          Copy link
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Toolbar                                                                    */
/* -------------------------------------------------------------------------- */

export function Toolbar() {
  const [active, setActive] = useState<string[]>(["bold"]);

  const toggle = (id: string) =>
    setActive((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));

  const groups = [
    [
      { id: "bold", label: "Bold", icon: RiBold },
      { id: "italic", label: "Italic", icon: RiItalic },
      { id: "underline", label: "Underline", icon: RiUnderline },
    ],
    [{ id: "link", label: "Insert link", icon: RiLinkM }],
  ];

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border-button-default bg-background-primary-default p-0.5 shadow-xs" role="toolbar" aria-label="Text formatting">
      {groups.map((group, index) => (
        <div key={index} className="flex items-center gap-0.5">
          {index > 0 && <span aria-hidden className="mx-0.5 h-4 w-px bg-separator-border" />}
          {group.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-label={label}
              aria-pressed={active.includes(id)}
              onClick={() => toggle(id)}
              className={cx(
                "flex size-7 items-center justify-center rounded-md transition-colors duration-150 ease",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                active.includes(id)
                  ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
                  : "text-foreground-icon-secondary hover:bg-background-secondary-hover hover:text-text-primary",
              )}
            >
              <Icon className="size-4" aria-hidden />
            </button>
          ))}
        </div>
      ))}
      <span aria-hidden className="mx-0.5 h-4 w-px bg-separator-border" />
      <button type="button" aria-label="More formatting" className={iconButton}>
        <RiMoreLine className="size-4" aria-hidden />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Wizard steps                                                               */
/* -------------------------------------------------------------------------- */

const STEPS = ["Brief", "Assets", "Review", "Publish"];

export function WizardSteps({ current = 2 }: { current?: number }) {
  return (
    <ol className="flex w-full max-w-[360px] items-start gap-0" aria-label="Publish progress">
      {STEPS.map((step, index) => {
        const state = index < current ? "done" : index === current ? "current" : "todo";
        return (
          <li key={step} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full items-center">
              <span aria-hidden className={cx("h-px flex-1", index === 0 ? "bg-transparent" : index <= current ? "bg-accent-500" : "bg-separator-border")} />
              <span
                aria-current={state === "current" ? "step" : undefined}
                className={cx(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-caption-2-semibold transition-colors duration-200 ease",
                  state === "done" && "bg-accent-500 text-text-white",
                  state === "current" && "bg-accent-500 text-text-white shadow-checkbox-selected",
                  state === "todo" && "border border-border-button-default bg-background-primary-default text-text-tertiary",
                )}
              >
                {state === "done" ? <RiCheckLine className="size-3.5" aria-hidden /> : index + 1}
              </span>
              <span aria-hidden className={cx("h-px flex-1", index === STEPS.length - 1 ? "bg-transparent" : index < current ? "bg-accent-500" : "bg-separator-border")} />
            </div>
            <span className={cx("truncate text-caption-1-medium", state === "todo" ? "text-text-tertiary" : "text-text-primary")}>{step}</span>
          </li>
        );
      })}
    </ol>
  );
}

/* -------------------------------------------------------------------------- */
/*  Command palette                                                            */
/* -------------------------------------------------------------------------- */

const COMMANDS = [
  { group: "Create", items: [{ label: "New design", icon: RiFileTextLine, keys: "N" }, { label: "New video", icon: RiImageLine, keys: "V" }] },
  { group: "Go", items: [{ label: "Components and Blocks", icon: RiCodeLine, keys: "G C" }, { label: "Templates", icon: RiFileTextLine, keys: "G T" }] },
];

export function CommandPalette() {
  const id = useId();
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<string | null>(null);

  const flat = COMMANDS.flatMap((group) => group.items.map((item) => ({ ...item, group: group.group })));
  const results = flat.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className="w-full max-w-[340px] overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default shadow-dropdown">
      <div className="flex items-center gap-2 border-b border-separator-border px-2.5 py-2">
        <RiSearchLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
        <input
          id={id}
          autoComplete="off"
          placeholder="Type a command or search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-body-regular text-text-primary outline-none placeholder:text-text-tertiary"
        />
        <kbd className="rounded-sm bg-kbd-background px-1 py-0.5 text-caption-2-semibold text-kbd-foreground">ESC</kbd>
      </div>
      <div className="max-h-[168px] overflow-y-auto p-1">
        {results.length === 0 && <p className="px-2 py-4 text-center text-body-2-regular text-text-tertiary">No command matches.</p>}
        {COMMANDS.map((group) => {
          const items = group.items.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()));
          if (items.length === 0) return null;
          return (
            <div key={group.group} className="mb-1">
              <p className="px-2 py-1 text-caption-2-semibold tracking-wide text-text-tertiary uppercase">{group.group}</p>
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setPicked(item.label)}
                    className={cx(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start transition-colors duration-100 ease",
                      "hover:bg-dropdown-item-hover-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                      picked === item.label && "bg-background-tertiary-default",
                    )}
                  >
                    <Icon className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
                    <span className="flex-1 truncate text-body-2-regular text-text-primary">{item.label}</span>
                    <kbd className="shrink-0 rounded-xs bg-kbd-background px-1 text-caption-2-medium text-kbd-foreground">{item.keys}</kbd>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between border-t border-separator-border px-2.5 py-1.5">
        <span className="text-caption-2-regular text-text-tertiary">↑↓ navigate · ↵ run</span>
        <span className="text-caption-2-regular text-text-tertiary">{picked ? `Ran “${picked}”` : "Ready"}</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Scroll area                                                                */
/* -------------------------------------------------------------------------- */

export function ScrollArea() {
  const [scrollTop, setScrollTop] = useState(0);
  const fade = Math.min(1, scrollTop / 24);

  return (
    <div className="relative w-full max-w-[300px] overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default">
      <div className="border-b border-separator-border px-3 py-2">
        <span className="text-body-2-semibold text-text-primary">Layer notes</span>
      </div>
      <div
        className="relative"
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      >
        <div className="max-h-[148px] overflow-y-auto px-3 py-2" tabIndex={0} role="region" aria-label="Layer notes">
          {Array.from({ length: 12 }).map((_, index) => (
            <p key={index} className="border-b border-separator-border/60 py-1.5 text-body-2-regular text-text-secondary last:border-0">
              Note {index + 1} — the header keeps its 56px height at every breakpoint.
            </p>
          ))}
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-6">
          <div
            className="absolute inset-0 bg-linear-to-b from-background-primary-default to-transparent"
            style={{ opacity: fade }}
          />
          <div
            className="absolute inset-0 backdrop-blur-[1px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
            style={{ opacity: fade }}
          />
          <div
            className="absolute inset-x-0 top-0 h-4 backdrop-blur-[4px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
            style={{ opacity: fade }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-separator-border px-3 py-1.5">
        <span className="text-caption-2-regular text-text-tertiary">{scrollTop > 0 ? "Scrolled" : "At top"}</span>
        <span className="text-caption-2-regular text-text-tertiary">12 notes</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Anchor nav                                                                 */
/* -------------------------------------------------------------------------- */

const SECTIONS = ["Overview", "Tokens", "Motion", "Accessibility"];

export function AnchorNav() {
  const [active, setActive] = useState(SECTIONS[0]);

  return (
    <nav aria-label="On this page" className="flex w-full max-w-[220px] flex-col gap-0.5 border-s border-separator-border ps-3">
      {SECTIONS.map((section) => {
        const isActive = active === section;
        return (
          <a
            key={section}
            href={`#${section.toLowerCase()}`}
            aria-current={isActive ? "location" : undefined}
            onClick={(event) => {
              event.preventDefault();
              setActive(section);
            }}
            className={cx(
              "rounded-sm py-1 text-body-2-regular transition-colors duration-150 ease",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              isActive ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary",
            )}
          >
            <span className={cx("me-1.5 inline-block h-1 w-1 rounded-full align-middle", isActive ? "bg-accent-500" : "bg-transparent")} aria-hidden />
            {section}
          </a>
        );
      })}
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/*  Drawer                                                                     */
/* -------------------------------------------------------------------------- */

export function Drawer({ trigger = "Open activity" }: { trigger?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-8 items-center rounded-lg border border-border-button-default bg-background-primary-default px-2.5 text-body-2-medium text-text-primary shadow-xs transition-colors duration-150 ease hover:bg-background-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      >
        {trigger}
      </button>

      <div className={cx("fixed inset-0 z-50 transition-opacity duration-200 ease", open ? "opacity-100" : "pointer-events-none opacity-0")} aria-hidden={!open}>
        <button type="button" aria-label="Close drawer" onClick={() => setOpen(false)} className="absolute inset-0 cursor-pointer bg-black/40" tabIndex={open ? 0 : -1} />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Activity"
          className={cx(
            "absolute inset-y-0 end-0 flex w-full max-w-[320px] flex-col border-s border-border-button-default bg-background-primary-default shadow-xl",
            "transition-transform duration-200 ease-out",
            open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between border-b border-separator-border px-3 py-2.5">
            <span className="text-body-semibold text-text-primary">Activity</span>
            <button type="button" aria-label="Close" onClick={() => setOpen(false)} className={iconButton}>
              <RiCloseLine className="size-4" aria-hidden />
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-3">
            {["Maya restyled 4 layers", "Jonas left a comment", "Brand kit v3 applied", "Export finished"].map((item, index) => (
              <div key={item} className="flex gap-2">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-accent-500" aria-hidden />
                <div className="min-w-0">
                  <p className="text-body-2-medium text-text-primary">{item}</p>
                  <p className="text-caption-1-regular text-text-tertiary">{index + 1}h ago</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-separator-border p-3">
            <button
              type="button"
              className="flex h-8 w-full items-center justify-center gap-1 rounded-lg border border-border-button-default text-body-2-medium text-text-primary hover:bg-background-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              View all <RiArrowRightSLine className="size-4 rtl:-scale-x-100" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const NAVIGATION_SECTION: ExtendedSection = {
  id: "navigation",
  title: "Navigation",
  blurb: "Disclosure, wayfinding and the panels that come in from the side.",
  file: "navigation.tsx",
  entries: [
    { name: "Accordion", description: "Height-animated disclosure with one open panel.", Demo: Accordion, wide: true },
    { name: "Popover", description: "An anchored surface that dismisses on outside press.", Demo: Popover },
    { name: "Toolbar", description: "Grouped icon actions with a pressed state.", Demo: Toolbar },
    { name: "Wizard Steps", description: "Four-step progress with done, current and ahead.", Demo: WizardSteps, wide: true },
    { name: "Command Palette", description: "Search, grouped results and key hints in one field.", Demo: CommandPalette, wide: true },
    { name: "Scroll Area", description: "A clipped region that fades its top edge as it moves.", Demo: ScrollArea },
    { name: "Anchor Nav", description: "Section links with a live location marker.", Demo: AnchorNav },
    { name: "Drawer", description: "A side sheet that mirrors for right-to-left.", Demo: Drawer },
  ],
};
