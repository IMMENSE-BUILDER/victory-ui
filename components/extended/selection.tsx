"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { RefObject } from "react";
import {
  RiArrowDownSLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCheckLine,
  RiSearchLine,
  RiStarFill,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* -------------------------------------------------------------------------- */
/*  Shared                                                                     */
/* -------------------------------------------------------------------------- */

const shell =
  "flex h-9 w-full items-center gap-2 rounded-2lg bg-background-tertiary-default px-2 " +
  "ring-2 ring-inset ring-transparent transition-[background-color,box-shadow,color] duration-150 ease " +
  "hover:ring-border-button-hover focus-within:ring-border-button-active";

const fieldInput =
  "min-w-0 flex-1 bg-transparent p-0 text-body-regular text-text-primary outline-none placeholder:text-text-tertiary";

const labelText = "text-body-2-medium text-text-secondary";

const popover =
  "absolute inset-x-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-xl border border-border-button-default " +
  "bg-background-primary-default p-1 shadow-dropdown";

/** Close a popover when the pointer lands outside it. */
function useDismiss(ref: RefObject<HTMLElement | null>, onDismiss: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const handler = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onDismiss();
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [ref, onDismiss, active]);
}

function Option({
  label,
  meta,
  selected,
  onSelect,
}: {
  label: string;
  meta?: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onSelect}
      className={cx(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start transition-colors duration-100 ease",
        "hover:bg-dropdown-item-hover-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
        selected && "bg-background-tertiary-default",
      )}
    >
      <span className="flex size-4 shrink-0 items-center justify-center text-foreground-icon-primary">
        {selected && <RiCheckLine className="size-4" aria-hidden />}
      </span>
      <span className="min-w-0 flex-1 truncate text-body-regular text-text-primary">{label}</span>
      {meta && <span className="shrink-0 text-caption-1-regular text-text-tertiary">{meta}</span>}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Combobox                                                                   */
/* -------------------------------------------------------------------------- */

const COMPONENTS = [
  { name: "Combobox", group: "Selection" },
  { name: "Command Palette", group: "Navigation" },
  { name: "Comment Thread", group: "Data display" },
  { name: "Confirm Dialog", group: "Feedback" },
  { name: "Copy Button", group: "Content" },
  { name: "Currency Field", group: "Inputs" },
];

export function Combobox({ label = "Jump to component" }: { label?: string }) {
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [value, setValue] = useState<string | null>(null);
  const [active, setActive] = useState(0);

  const results = COMPONENTS.filter((item) => item.name.toLowerCase().includes(query.trim().toLowerCase()));
  useDismiss(ref, () => setOpen(false), open);

  const choose = (name: string) => {
    setValue(name);
    setQuery("");
    setOpen(false);
  };

  return (
    <div className="flex w-full max-w-[280px] flex-col gap-1">
      <label htmlFor={id} className={labelText}>{label}</label>
      <div ref={ref} className="relative">
        <div className={cx(shell, "pe-1.5")}>
          <RiSearchLine aria-hidden className="size-4 shrink-0 text-foreground-icon-secondary" />
          <input
            id={id}
            role="combobox"
            aria-expanded={open}
            aria-controls={`${id}-list`}
            aria-autocomplete="list"
            aria-activedescendant={open && results[active] ? `${id}-opt-${active}` : undefined}
            value={query || value || ""}
            placeholder="Search components"
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setValue(null);
              setOpen(true);
              setActive(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setOpen(true);
                setActive((index) => Math.min(results.length - 1, index + 1));
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((index) => Math.max(0, index - 1));
              }
              if (event.key === "Enter" && open && results[active]) {
                event.preventDefault();
                choose(results[active].name);
              }
              if (event.key === "Escape") setOpen(false);
            }}
            className={fieldInput}
          />
          <button
            type="button"
            aria-label={open ? "Close list" : "Open list"}
            onClick={() => setOpen((next) => !next)}
            className="flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-secondary hover:bg-background-tertiary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <RiArrowDownSLine className={cx("size-4 transition-transform duration-200 ease-out", open && "rotate-180")} aria-hidden />
          </button>
        </div>

        {open && (
          <div id={`${id}-list`} role="listbox" aria-label={label} className={popover}>
            {results.length === 0 ? (
              <p className="px-2 py-3 text-body-2-regular text-text-tertiary">No component matches “{query}”.</p>
            ) : (
              results.map((item, index) => (
                <button
                  key={item.name}
                  id={`${id}-opt-${index}`}
                  type="button"
                  role="option"
                  aria-selected={value === item.name}
                  onPointerEnter={() => setActive(index)}
                  onClick={() => choose(item.name)}
                  className={cx(
                    "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-start",
                    index === active && "bg-dropdown-item-hover-background",
                  )}
                >
                  <span className="truncate text-body-regular text-text-primary">{item.name}</span>
                  <span className="shrink-0 text-caption-1-regular text-text-tertiary">{item.group}</span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
      <span className="text-caption-1-regular text-text-tertiary">Arrow keys move, Enter picks.</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Multi select                                                               */
/* -------------------------------------------------------------------------- */

const CHANNELS = ["Email", "Slack", "Webhook", "SMS"];

export function MultiSelect({ label = "Notify on" }: { label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(["Email", "Slack"]);
  useDismiss(ref, () => setOpen(false), open);

  const toggle = (name: string) =>
    setSelected((current) => (current.includes(name) ? current.filter((item) => item !== name) : [...current, name]));

  return (
    <div className="flex w-full max-w-[280px] flex-col gap-1">
      <span className={labelText}>{label}</span>
      <div ref={ref} className="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((next) => !next)}
          className={cx(shell, "justify-between text-start")}
        >
          <span className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden">
            {selected.length === 0 ? (
              <span className="text-body-regular text-text-tertiary">Choose channels</span>
            ) : (
              <>
                {selected.slice(0, 2).map((name) => (
                  <span key={name} className="inline-flex h-6 items-center rounded-sm bg-background-primary-default px-1.5 text-caption-1-medium text-text-secondary shadow-xs">
                    {name}
                  </span>
                ))}
                {selected.length > 2 && (
                  <span className="text-caption-1-medium text-text-tertiary">+{selected.length - 2}</span>
                )}
              </>
            )}
          </span>
          <RiArrowDownSLine className={cx("size-4 shrink-0 text-foreground-icon-secondary transition-transform duration-200 ease-out", open && "rotate-180")} aria-hidden />
        </button>

        {open && (
          <div role="listbox" aria-multiselectable aria-label={label} className={popover}>
            {CHANNELS.map((name) => (
              <Option key={name} label={name} selected={selected.includes(name)} onSelect={() => toggle(name)} />
            ))}
            <div className="mt-1 flex items-center justify-between border-t border-separator-border px-2 pt-1.5">
              <span className="text-caption-1-regular text-text-tertiary">{selected.length} of {CHANNELS.length} on</span>
              <button
                type="button"
                onClick={() => setSelected([])}
                className="rounded-sm px-1 py-0.5 text-caption-1-semibold text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
      <span className="text-caption-1-regular text-text-tertiary">Digest lands at 09:00 in your timezone.</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Transfer list                                                              */
/* -------------------------------------------------------------------------- */

const ALL_FIELDS = ["Owner", "Stage", "Value", "Close date", "Source", "Notes"];

export function TransferList({ label = "Visible columns" }: { label?: string }) {
  const [left, setLeft] = useState(ALL_FIELDS.filter((field) => !["Stage", "Value", "Source"].includes(field)));
  const [right, setRight] = useState(["Stage", "Value", "Source"]);
  const [checkedLeft, setCheckedLeft] = useState<string[]>([]);
  const [checkedRight, setCheckedRight] = useState<string[]>([]);

  const move = (direction: "toRight" | "toLeft") => {
    if (direction === "toRight") {
      setRight((current) => [...current, ...checkedLeft]);
      setLeft((current) => current.filter((item) => !checkedLeft.includes(item)));
      setCheckedLeft([]);
    } else {
      setLeft((current) => [...current, ...checkedRight]);
      setRight((current) => current.filter((item) => !checkedRight.includes(item)));
      setCheckedRight([]);
    }
  };

  const pane = (
    title: string,
    items: string[],
    checked: string[],
    setChecked: (next: string[]) => void,
  ) => (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="px-1 text-caption-1-semibold tracking-wide text-text-tertiary uppercase">{title}</span>
      <div className="flex min-h-[128px] flex-col gap-0.5 rounded-xl bg-background-tertiary-default p-1">
        {items.length === 0 && <span className="px-2 py-3 text-body-2-regular text-text-tertiary">Nothing here</span>}
        {items.map((item) => {
          const isChecked = checked.includes(item);
          return (
            <label
              key={item}
              className={cx(
                "flex cursor-pointer items-center gap-2 rounded-md px-1.5 py-1 transition-colors duration-100 ease hover:bg-background-tertiary-hover",
                isChecked && "bg-background-primary-default shadow-xs",
              )}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() =>
                  setChecked(isChecked ? checked.filter((value) => value !== item) : [...checked, item])
                }
                className="size-3.5 shrink-0 accent-accent-500"
              />
              <span className="truncate text-body-2-regular text-text-primary">{item}</span>
            </label>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex w-full max-w-[420px] flex-col gap-1">
      <span className={labelText}>{label}</span>
      <div className="flex items-stretch gap-1.5">
        {pane("Available", left, checkedLeft, setCheckedLeft)}
        <div className="flex flex-col justify-center gap-1">
          {[
            { icon: RiArrowRightLine, direction: "toRight" as const, disabled: checkedLeft.length === 0, label: "Add columns" },
            { icon: RiArrowLeftLine, direction: "toLeft" as const, disabled: checkedRight.length === 0, label: "Remove columns" },
          ].map(({ icon: Icon, direction, disabled, label: ariaLabel }) => (
            <button
              key={direction}
              type="button"
              aria-label={ariaLabel}
              disabled={disabled}
              onClick={() => move(direction)}
              className="flex size-7 items-center justify-center rounded-md border border-border-button-default bg-background-primary-default text-foreground-icon-secondary shadow-xs transition-colors duration-150 ease hover:bg-background-primary-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:pointer-events-none disabled:text-foreground-icon-disabled"
            >
              <Icon className="size-4 rtl:-scale-x-100" aria-hidden />
            </button>
          ))}
        </div>
        {pane("Shown", right, checkedRight, setCheckedRight)}
      </div>
      <span className="text-caption-1-regular text-text-tertiary">{right.length} of {ALL_FIELDS.length} columns visible.</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  List box                                                                   */
/* -------------------------------------------------------------------------- */

const INBOX = [
  { name: "Maya Chen", subject: "Re: Q3 campaign brief", time: "09:12", unread: true },
  { name: "Jonas Reed", subject: "Shot list v4 attached", time: "08:40", unread: true },
  { name: "Studio ops", subject: "Bay 2 is free Thursday", time: "Yesterday", unread: false },
  { name: "Priya Nair", subject: "Invoice 4471 approved", time: "Mon", unread: false },
];

export function ListBox({ label = "Inbox" }: { label?: string }) {
  const [selected, setSelected] = useState("Maya Chen");

  return (
    <div className="flex w-full max-w-[300px] flex-col gap-1">
      <span className={labelText}>{label}</span>
      <div role="listbox" aria-label={label} className="overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default p-1 shadow-xs">
        {INBOX.map((item) => {
          const isSelected = selected === item.name;
          return (
            <button
              key={item.name}
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => setSelected(item.name)}
              className={cx(
                "flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-start transition-colors duration-100 ease",
                "hover:bg-background-secondary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                isSelected && "bg-background-tertiary-default",
              )}
            >
              <span className={cx("mt-1.5 size-1.5 shrink-0 rounded-full", item.unread ? "bg-accent-500" : "bg-transparent")} aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-body-2-semibold text-text-primary">{item.name}</span>
                  <span className="shrink-0 text-caption-2-regular text-text-tertiary">{item.time}</span>
                </span>
                <span className="block truncate text-caption-1-regular text-text-secondary">{item.subject}</span>
              </span>
            </button>
          );
        })}
      </div>
      <span className="text-caption-1-regular text-text-tertiary">{selected} selected · 2 unread</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Toggle group                                                               */
/* -------------------------------------------------------------------------- */

export function ToggleGroup({ label = "Alignment" }: { label?: string }) {
  const options = [
    { id: "left", glyph: "text-start", preview: "M4 5h12M4 9h8M4 13h12M4 17h6" },
    { id: "center", glyph: "text-center", preview: "M2 5h16M6 9h8M2 13h16M7 17h6" },
    { id: "right", glyph: "text-end", preview: "M4 5h12M8 9h8M4 13h12M10 17h6" },
  ];
  const [value, setValue] = useState("left");

  return (
    <div className="flex w-full max-w-[260px] flex-col gap-1">
      <span className={labelText}>{label}</span>
      <div className="inline-flex w-max rounded-lg border border-border-button-default bg-background-primary-default p-0.5 shadow-xs" role="group" aria-label={label}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            aria-label={option.id}
            aria-pressed={value === option.id}
            onClick={() => setValue(option.id)}
            className={cx(
              "flex size-7 items-center justify-center rounded-md transition-colors duration-150 ease",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
              value === option.id ? "bg-segmented-control-selected-background text-text-primary shadow-xs" : "text-foreground-icon-secondary hover:bg-background-secondary-hover",
            )}
          >
            <svg viewBox="0 0 20 20" aria-hidden className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d={option.preview} />
            </svg>
          </button>
        ))}
      </div>
      <span className="text-caption-1-regular text-text-tertiary">Applies to the selected text block.</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Rating                                                                     */
/* -------------------------------------------------------------------------- */

export function Rating({ label = "How was the handoff?", defaultValue = 4 }: { label?: string; defaultValue?: number }) {
  const [value, setValue] = useState(defaultValue);
  const [hover, setHover] = useState<number | null>(null);
  const shown = hover ?? value;

  return (
    <div className="flex w-full max-w-[280px] flex-col gap-1.5">
      <span className={labelText}>{label}</span>
      <div className="flex items-center gap-1" role="radiogroup" aria-label={label} onMouseLeave={() => setHover(null)}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star === 1 ? "" : "s"}`}
            onMouseEnter={() => setHover(star)}
            onClick={() => setValue(star)}
            className="rounded-sm p-0.5 transition-transform duration-150 ease-out hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <RiStarFill
              aria-hidden
              className={cx("size-5 transition-colors duration-150 ease", star <= shown ? "text-status-orange-text" : "text-foreground-icon-disabled")}
            />
          </button>
        ))}
        <span className="ms-1 text-body-2-medium text-text-secondary tabular-nums">{shown}/5</span>
      </div>
      <span className="text-caption-1-regular text-text-tertiary">Visible to the design team only.</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Range input                                                                */
/* -------------------------------------------------------------------------- */

export function RangeInput({ label = "Price range" }: { label?: string }) {
  const [min, setMin] = useState(120);
  const [max, setMax] = useState(480);
  const floor = 0;
  const ceiling = 600;
  const pct = (value: number) => `${Math.min(100, Math.max(0, ((value - floor) / (ceiling - floor)) * 100))}%`;

  const field = (value: number, setValue: (next: number) => void, ariaLabel: string) => (
    <div className="flex h-8 min-w-0 flex-1 items-center gap-1 rounded-lg bg-background-tertiary-default px-2 ring-1 ring-inset ring-transparent transition-colors duration-150 ease focus-within:ring-border-button-active">
      <span aria-hidden className="text-caption-1-regular text-text-tertiary">$</span>
      <input
        aria-label={ariaLabel}
        inputMode="numeric"
        value={value}
        onChange={(event) => setValue(Math.max(floor, Math.min(ceiling, Number(event.target.value.replace(/\D/g, "")) || 0)))}
        className="min-w-0 flex-1 bg-transparent p-0 text-body-2-medium text-text-primary tabular-nums outline-none"
      />
    </div>
  );

  return (
    <div className="flex w-full max-w-[280px] flex-col gap-1.5">
      <span className={labelText}>{label}</span>
      <div className="flex items-center gap-1.5">
        {field(min, (next) => setMin(Math.min(next, max - 10)), "Minimum price")}
        <span aria-hidden className="text-body-2-regular text-text-tertiary">to</span>
        {field(max, (next) => setMax(Math.max(next, min + 10)), "Maximum price")}
      </div>
      <div className="relative h-1.5 rounded-full bg-background-tertiary-default" aria-hidden>
        <span
          className="absolute inset-y-0 rounded-full bg-accent-500"
          style={{ insetInlineStart: pct(min), insetInlineEnd: `calc(100% - ${pct(max)})` }}
        />
        <span className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full border-2 border-background-primary-default bg-accent-500 shadow-sm" style={{ insetInlineStart: `calc(${pct(min)} - 6px)` }} />
        <span className="absolute top-1/2 size-3 -translate-y-1/2 rounded-full border-2 border-background-primary-default bg-accent-500 shadow-sm" style={{ insetInlineStart: `calc(${pct(max)} - 6px)` }} />
      </div>
      <span className="text-caption-1-regular text-text-tertiary">Median listing in this range is $310.</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const SELECTION_SECTION: ExtendedSection = {
  id: "selection",
  title: "Selection",
  blurb: "Picking one thing, several things, or a number between two numbers.",
  file: "selection.tsx",
  entries: [
    { name: "Combobox", description: "Type-ahead search over a filtered option list.", Demo: Combobox, wide: true },
    { name: "List Box", description: "A dense, selectable list with unread state.", Demo: ListBox },
    { name: "Multi Select", description: "Chips in the trigger, checkboxes in the list.", Demo: MultiSelect },
    { name: "Toggle Group", description: "Mutually exclusive icon toggles, pressed state exposed.", Demo: ToggleGroup },
    { name: "Rating", description: "Stars with hover preview and radio semantics.", Demo: Rating },
    { name: "Transfer List", description: "Move items between two panes with bulk checks.", Demo: TransferList, wide: true },
    { name: "Range Input", description: "Typed min and max with a live track between them.", Demo: RangeInput },
  ],
};
