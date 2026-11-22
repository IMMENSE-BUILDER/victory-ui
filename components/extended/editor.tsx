"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  RiAddLine,
  RiArrowDownLine,
  RiArrowGoBackLine,
  RiArrowUpLine,
  RiBold,
  RiCheckDoubleLine,
  RiCheckLine,
  RiCloseLine,
  RiCornerDownLeftLine,
  RiDeleteBinLine,
  RiDoubleQuotesL,
  RiExternalLinkLine,
  RiFigmaLine,
  RiFileCopyLine,
  RiH2,
  RiHistoryLine,
  RiItalic,
  RiLinkM,
  RiLinkUnlinkM,
  RiMarkPenLine,
  RiQuillPenLine,
  RiReplyLine,
  RiSearchLine,
  RiSendPlaneLine,
  RiSeparator,
  RiStrikethrough,
  RiSubtractLine,
  RiTableLine,
  RiText,
  RiUnderline,
  RiVimeoLine,
  RiYoutubeLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* Shared */

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const cardSurface =
  "w-full max-w-[320px] rounded-xl border border-border-button-default bg-background-primary-default shadow-card";
const buttonBase =
  "inline-flex h-7 shrink-0 items-center justify-center gap-1.5 rounded-lg px-2.5 text-caption-1-semibold " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 " +
  "motion-reduce:transition-none motion-reduce:active:scale-100";
const primaryButton = cx(buttonBase, "bg-button-primary text-text-white shadow-xs", focusRing);
const secondaryButton = cx(
  buttonBase,
  "border border-border-button-default bg-background-primary-default text-text-primary shadow-xs hover:bg-background-primary-hover",
  focusRing,
);
const quietButton = cx(
  buttonBase,
  "px-1.5 text-text-secondary hover:bg-background-secondary-default hover:text-text-primary",
  focusRing,
);
const iconButton = cx(
  "flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-tertiary",
  "transition-[background-color,color] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary",
  "disabled:pointer-events-none disabled:opacity-40",
  "motion-reduce:transition-none",
  focusRing,
);
const revealGrid = "grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none";

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded-sm bg-kbd-background px-1 py-px text-caption-2-semibold text-kbd-foreground">
      {children}
    </kbd>
  );
}

function PersonDot({ initials, tone = "blue" }: { initials: string; tone?: "blue" | "lime" }) {
  return (
    <span
      aria-hidden
      className={cx(
        "flex size-6 shrink-0 items-center justify-center rounded-full text-caption-2-semibold",
        tone === "blue"
          ? "bg-status-blue-background text-status-blue-text"
          : "bg-status-lime-background text-status-lime-text",
      )}
    >
      {initials}
    </span>
  );
}

function Switch({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx(
        "relative h-4 w-7 shrink-0 rounded-full rtl:-scale-x-100",
        "transition-[background-color] duration-150 ease-out motion-reduce:transition-none",
        checked ? "bg-accent-600" : "bg-background-tertiary-hover",
        focusRing,
      )}
    >
      <span
        aria-hidden
        className={cx(
          "absolute inset-y-0.5 start-0.5 size-3 rounded-full bg-control-indicator-background shadow-xs",
          "transition-[transform] duration-150 ease-out motion-reduce:transition-none",
          checked && "translate-x-3",
        )}
      />
    </button>
  );
}

/* 1. Format Bar */

const FORMATS = [
  { id: "bold", label: "Bold", icon: RiBold },
  { id: "italic", label: "Italic", icon: RiItalic },
  { id: "underline", label: "Underline", icon: RiUnderline },
  { id: "strike", label: "Strikethrough", icon: RiStrikethrough },
] as const;

type FormatId = (typeof FORMATS)[number]["id"];

export function FormatBar() {
  const [active, setActive] = useState<Record<FormatId, boolean>>({
    bold: true,
    italic: false,
    underline: false,
    strike: false,
  });
  const activeCount = FORMATS.filter((format) => active[format.id]).length;
  const decoration =
    active.underline && active.strike
      ? "[text-decoration-line:underline_line-through] underline-offset-2"
      : active.underline
        ? "underline underline-offset-2"
        : active.strike
          ? "line-through"
          : "";

  const toggle = (id: FormatId) => setActive((current) => ({ ...current, [id]: !current[id] }));

  return (
    <div
      className={cx(cardSurface, "p-2.5")}
      onKeyDown={(event) => {
        if (!event.metaKey && !event.ctrlKey) return;
        const key = event.key.toLowerCase();
        const id = key === "b" ? "bold" : key === "i" ? "italic" : key === "u" ? "underline" : null;
        if (!id) return;
        event.preventDefault();
        toggle(id);
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-caption-1-semibold text-text-primary">
          <RiQuillPenLine className="size-3.5 text-foreground-icon-secondary" aria-hidden />
          Ferry notes
        </p>
        <span className="text-caption-2-regular text-text-tertiary">Draft · 2 min read</span>
      </div>

      <div
        role="group"
        aria-label="Text formatting"
        className="mt-1.5 flex items-center gap-0.5 rounded-lg border border-separator-border bg-background-secondary-default p-0.5"
      >
        {FORMATS.map((format) => {
          const Icon = format.icon;
          return (
            <button
              key={format.id}
              type="button"
              aria-label={format.label}
              aria-pressed={active[format.id]}
              onClick={() => toggle(format.id)}
              className={cx(
                "flex size-7 items-center justify-center rounded-md",
                "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                active[format.id]
                  ? "bg-accent-600 text-text-white shadow-xs"
                  : "text-foreground-icon-secondary hover:bg-background-primary-default hover:text-text-primary",
              )}
            >
              <Icon className="size-3.5" aria-hidden />
            </button>
          );
        })}
      </div>

      <p className="mt-1.5 rounded-lg bg-background-secondary-default px-2 py-1.5 text-body-2-regular text-text-primary">
        <span style={{ fontWeight: active.bold ? 700 : undefined }} className={cx(active.italic && "italic")}>
          <span className={decoration}>The last ferry leaves the north crossing at dusk.</span>
        </span>
      </p>

      <div className="mt-1 flex items-center justify-between gap-2">
        <span className="text-caption-2-regular text-text-tertiary tabular-nums">
          {activeCount} of 4 styles
        </span>
        <span className="flex items-center gap-1 text-caption-2-regular text-text-tertiary">
          <Kbd>⌘B</Kbd>
          toggles bold
        </span>
      </div>
    </div>
  );
}

/* 2. Slash Menu */

const SLASH_COMMANDS = [
  { id: "heading", label: "Heading 2", hint: "H2", icon: RiH2 },
  { id: "quote", label: "Pull quote", hint: "Quote", icon: RiDoubleQuotesL },
  { id: "divider", label: "Divider", hint: "Rule", icon: RiSeparator },
  { id: "table", label: "Table", hint: "3 × 3", icon: RiTableLine },
] as const;

type SlashId = (typeof SLASH_COMMANDS)[number]["id"];

const SLASH_START = "The last ferry leaves at dusk. /";

export function SlashMenu() {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState(SLASH_START);
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState(0);
  const [inserted, setInserted] = useState<SlashId | null>(null);

  const slashIndex = value.lastIndexOf("/");
  const query = slashIndex >= 0 ? value.slice(slashIndex + 1).trim().toLowerCase() : "";
  const results = SLASH_COMMANDS.filter((command) => command.label.toLowerCase().includes(query));
  const menuOpen = open && slashIndex >= 0;
  const activeIndex = results.length ? Math.min(active, results.length - 1) : 0;
  const insertedCommand = SLASH_COMMANDS.find((command) => command.id === inserted);

  const choose = (command: (typeof SLASH_COMMANDS)[number]) => {
    const base = value.slice(0, value.lastIndexOf("/")).trimEnd();
    setValue(base || "The last ferry leaves at dusk.");
    setOpen(false);
    setInserted(command.id);
    inputRef.current?.focus();
  };

  const dismissMenu = () => {
    const base = value.slice(0, value.lastIndexOf("/")).trimEnd();
    setValue(base || "The last ferry leaves at dusk.");
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className={cx(cardSurface, "p-2.5")}>
      <div className="flex h-8 items-center gap-1.5 rounded-lg bg-background-secondary-default px-2 focus-within:ring-2 focus-within:ring-border-focus-ring">
        <RiQuillPenLine className="size-3.5 shrink-0 text-foreground-icon-secondary" aria-hidden />
        <input
          ref={inputRef}
          value={value}
          role="combobox"
          aria-label="Document line"
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? `${id}-menu` : undefined}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-activedescendant={menuOpen && results.length ? `${id}-option-${activeIndex}` : undefined}
          onChange={(event) => {
            setValue(event.target.value);
            setOpen(true);
            setActive(0);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" && slashIndex >= 0) {
              event.preventDefault();
              setOpen(true);
              setActive((index) => (results.length ? (Math.min(index, results.length - 1) + 1) % results.length : 0));
            }
            if (event.key === "ArrowUp" && slashIndex >= 0) {
              event.preventDefault();
              setOpen(true);
              setActive((index) => (results.length ? (Math.min(index, results.length - 1) + results.length - 1) % results.length : 0));
            }
            if (event.key === "Enter" && menuOpen) {
              const command = results[activeIndex];
              if (!command) return;
              event.preventDefault();
              choose(command);
            }
            if (event.key === "Escape" && menuOpen) {
              event.preventDefault();
              event.stopPropagation();
              dismissMenu();
            }
          }}
          className="min-w-0 flex-1 bg-transparent text-caption-1-medium text-text-primary outline-none placeholder:text-text-tertiary"
        />
        <span className="shrink-0 rounded-sm bg-kbd-background px-1 py-0.5 text-caption-2-medium text-kbd-foreground">
          /
        </span>
      </div>

      <div className="relative mt-1.5 h-[104px]">
        {menuOpen ? (
          <ul
            id={`${id}-menu`}
            role="listbox"
            aria-label="Insert block"
            onKeyDown={(event) => {
              if (event.key !== "Escape") return;
              event.preventDefault();
              event.stopPropagation();
              dismissMenu();
            }}
            className="absolute inset-x-0 top-0 z-10 rounded-lg border border-border-button-default bg-background-primary-default p-0.5 shadow-dropdown animate-label-in motion-reduce:animate-none"
          >
            {results.length === 0 ? (
              <li role="presentation" className="px-2 py-3 text-caption-1-regular text-text-tertiary">
                No block matches “{query}”.
              </li>
            ) : (
              results.map((command, index) => {
                const Icon = command.icon;
                return (
                  <li key={command.id} role="presentation">
                    <button
                      type="button"
                      id={`${id}-option-${index}`}
                      role="option"
                      aria-selected={index === activeIndex}
                      onPointerEnter={() => setActive(index)}
                      onClick={() => choose(command)}
                      className={cx(
                        "flex h-6 w-full items-center gap-1.5 rounded-md px-1.5 text-start",
                        "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
                        focusRing,
                        index === activeIndex
                          ? "bg-accent-500/15 text-text-primary"
                          : "text-text-secondary hover:bg-background-secondary-default",
                      )}
                    >
                      <Icon className="size-3 shrink-0 text-foreground-icon-secondary" aria-hidden />
                      <span className="min-w-0 flex-1 truncate text-caption-1-medium">{command.label}</span>
                      <span className="shrink-0 text-caption-2-regular text-text-tertiary">{command.hint}</span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        ) : inserted && insertedCommand ? (
          <div className="h-full overflow-hidden rounded-lg border border-border-button-default bg-background-secondary-default p-2 animate-label-in motion-reduce:animate-none">
            {inserted === "heading" ? (
              <p className="text-title-3-semibold text-text-primary">Before the tide</p>
            ) : inserted === "quote" ? (
              <blockquote className="border-s-2 border-accent-500 ps-2 text-caption-1-regular italic text-text-secondary">
                “We loaded the crates while the tide came in.”
              </blockquote>
            ) : inserted === "divider" ? (
              <div className="flex h-full flex-col justify-center">
                <hr className="border-separator-border" />
              </div>
            ) : (
              <div className="grid h-full grid-cols-3 gap-0.5">
                {Array.from({ length: 9 }, (_, index) => (
                  <span
                    key={index}
                    className={cx(
                      "rounded-xs border border-separator-border",
                      index < 3 ? "bg-background-tertiary-default" : "bg-background-primary-default",
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-border-button-default px-4 text-center text-caption-1-regular text-text-tertiary">
            Type / to insert a heading, quote, divider or table.
          </div>
        )}
      </div>

      <div className="mt-1 flex h-5 items-center justify-between gap-2">
        <span aria-live="polite" className="flex min-w-0 items-center gap-1 text-caption-2-regular text-text-tertiary">
          {menuOpen ? (
            <>
              <RiArrowUpLine className="size-3 shrink-0" aria-hidden />
              <RiArrowDownLine className="size-3 shrink-0" aria-hidden />
              move · Enter insert · Esc close
            </>
          ) : inserted ? (
            <>
              <RiCheckLine className="size-3 shrink-0 text-status-lime-text" aria-hidden />
              <span className="truncate">{insertedCommand?.label} inserted</span>
            </>
          ) : (
            <>
              <RiCornerDownLeftLine className="size-3 shrink-0" aria-hidden />
              Type / again for another block
            </>
          )}
        </span>
        {inserted && !menuOpen && (
          <button
            type="button"
            onClick={() => {
              setInserted(null);
              inputRef.current?.focus();
            }}
            className={cx(quietButton, "h-5 rounded-sm px-1 text-caption-2-medium")}
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}

/* 3. Link Popover */

export function LinkPopover() {
  const baseId = useId();
  const phraseRef = useRef<HTMLButtonElement>(null);
  const urlRef = useRef<HTMLInputElement>(null);
  const wasOpen = useRef(true);
  const [open, setOpen] = useState(true);
  const [url, setUrl] = useState("https://northline.co/notes/north-crossing");
  const [title, setTitle] = useState("The north crossing");
  const [newTab, setNewTab] = useState(true);
  const [appliedLink, setAppliedLink] = useState<{ url: string; title: string; newTab: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const valid = /^https?:\/\/[^\s]+\.[^\s]+$/.test(url.trim());

  useEffect(() => {
    if (open === wasOpen.current) return;
    wasOpen.current = open;
    if (open) urlRef.current?.focus();
    else phraseRef.current?.focus();
  }, [open]);

  const apply = () => {
    if (!valid) {
      setError("Enter a full https:// address.");
      return;
    }
    setError(null);
    setAppliedLink({ url: url.trim(), title: title.trim() || "Untitled link", newTab });
    setOpen(false);
  };

  return (
    <div
      className={cx(cardSurface, "p-2.5")}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          setOpen(false);
          setError(null);
        }
      }}
    >
      <p className="text-body-2-regular text-text-primary">
        Read the field notes on{" "}
        <button
          type="button"
          ref={phraseRef}
          aria-expanded={open}
          aria-controls={`${baseId}-form`}
          onClick={() => setOpen((current) => !current)}
          className={cx(
            "-mx-0.5 rounded-sm px-0.5 transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
            focusRing,
            open
              ? "bg-accent-500/15 text-text-primary"
              : appliedLink
                ? "text-status-blue-text underline decoration-status-blue-text/40 underline-offset-2"
                : "bg-background-secondary-default text-text-primary",
          )}
        >
          the north crossing
        </button>{" "}
        before the tide turns.
      </p>

      <div
        id={`${baseId}-form`}
        inert={!open}
        className={cx(revealGrid, open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mt-1.5 rounded-lg border border-border-button-default bg-background-secondary-default p-1.5">
            <div className="flex h-6 items-center gap-1.5 border-b border-separator-border pb-1">
              <RiLinkM className="size-3 shrink-0 text-foreground-icon-tertiary" aria-hidden />
              <input
                ref={urlRef}
                value={url}
                dir="ltr"
                aria-label="Link address"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${baseId}-error` : undefined}
                spellCheck={false}
                onChange={(event) => {
                  setUrl(event.target.value);
                  setError(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") apply();
                }}
                className="min-w-0 flex-1 rounded-sm bg-transparent font-mono text-caption-2-regular text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              />
            </div>
            <div className="mt-1 flex h-6 items-center gap-1.5">
              <RiText className="size-3 shrink-0 text-foreground-icon-tertiary" aria-hidden />
              <input
                value={title}
                aria-label="Link title"
                onChange={(event) => setTitle(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") apply();
                }}
                className="min-w-0 flex-1 rounded-sm bg-transparent text-caption-1-medium text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              />
            </div>
            <div className="mt-1 flex items-center gap-1.5">
              <Switch checked={newTab} label="Open link in a new tab" onChange={setNewTab} />
              <span className="text-caption-2-regular text-text-secondary">New tab</span>
              <button type="button" onClick={apply} className={cx(primaryButton, "ms-auto h-6 px-2")}>
                Apply
              </button>
              <button
                type="button"
                aria-label="Cancel link"
                onClick={() => {
                  setOpen(false);
                  setError(null);
                }}
                className={iconButton}
              >
                <RiCloseLine className="size-3.5" aria-hidden />
              </button>
            </div>
            {error && (
              <p id={`${baseId}-error`} role="alert" className="mt-1 text-caption-2-regular text-text-error-primary">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>

      {appliedLink && !open && (
        <div className="mt-1.5 flex items-center gap-1.5 rounded-lg bg-background-secondary-default px-2 py-1.5 animate-label-in motion-reduce:animate-none">
          <RiExternalLinkLine className="size-3.5 shrink-0 text-status-blue-text" aria-hidden />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-caption-1-semibold text-text-primary">{appliedLink.title}</span>
            <span dir="ltr" className="block truncate font-mono text-caption-2-regular text-text-tertiary">
              {appliedLink.url}
            </span>
          </span>
          <span className="shrink-0 text-caption-2-regular text-text-tertiary">
            {appliedLink.newTab ? "New tab" : "Same tab"}
          </span>
          <button
            type="button"
            onClick={() => {
              setUrl(appliedLink.url);
              setTitle(appliedLink.title);
              setNewTab(appliedLink.newTab);
              setOpen(true);
            }}
            className={cx(quietButton, "h-6 rounded-md px-1")}
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}

/* 4. Highlight Picker */

const HIGHLIGHTS = [
  { id: "accent", label: "Accent", swatch: "bg-accent-500", mark: "bg-accent-500/20 text-text-primary" },
  { id: "lime", label: "Lime", swatch: "bg-chart-2", mark: "bg-status-lime-background text-status-lime-text" },
  { id: "amber", label: "Amber", swatch: "bg-chart-8", mark: "bg-status-yellow-background text-status-yellow-text" },
  { id: "rose", label: "Rose", swatch: "bg-chart-3", mark: "bg-status-rose-background text-status-rose-text" },
  { id: "cyan", label: "Cyan", swatch: "bg-chart-1", mark: "bg-status-cyan-background text-status-cyan-text" },
  { id: "violet", label: "Violet", swatch: "bg-chart-5", mark: "bg-chart-5/15 text-text-primary" },
] as const;

type HighlightId = (typeof HIGHLIGHTS)[number]["id"];

export function HighlightPicker() {
  const [selected, setSelected] = useState<HighlightId | null>("amber");
  const current = HIGHLIGHTS.find((highlight) => highlight.id === selected);

  return (
    <section aria-label="Highlight picker" className={cx(cardSurface, "p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-caption-1-semibold text-text-primary">
          <RiMarkPenLine className="size-3.5 text-foreground-icon-secondary" aria-hidden />
          Highlight
        </h3>
        <span className="text-caption-2-regular text-text-tertiary">{current ? current.label : "None"}</span>
      </div>

      <div role="group" aria-label="Highlight color" className="mt-1.5 flex items-center gap-1.5">
        {HIGHLIGHTS.map((highlight) => (
          <button
            key={highlight.id}
            type="button"
            aria-label={`${highlight.label} highlight`}
            aria-pressed={selected === highlight.id}
            onClick={() => setSelected(selected === highlight.id ? null : highlight.id)}
            className={cx(
              "flex size-6 items-center justify-center rounded-full",
              "transition-[transform,box-shadow] duration-150 ease-out motion-reduce:transition-none",
              focusRing,
              selected === highlight.id
                ? "scale-105 ring-2 ring-accent-500 ring-offset-2 ring-offset-background-primary-default"
                : "hover:scale-105",
            )}
          >
            <span className={cx("size-4 rounded-full", highlight.swatch)} aria-hidden />
          </button>
        ))}
      </div>

      <p className="mt-2 rounded-lg bg-background-secondary-default px-2 py-1.5 text-body-2-regular text-text-primary">
        The last ferry leaves the{" "}
        {current ? (
          <mark
            className={cx(
              "rounded-sm px-0.5 transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
              current.mark,
            )}
          >
            north crossing
          </mark>
        ) : (
          "north crossing"
        )}{" "}
        at dusk.
      </p>

      <div className="mt-1 flex items-center justify-between gap-2">
        <span aria-live="polite" className="text-caption-2-regular text-text-tertiary">
          {current ? "2 words highlighted" : "No highlight applied"}
        </span>
        <button
          type="button"
          disabled={!selected}
          onClick={() => setSelected(null)}
          className={cx(quietButton, "h-6 rounded-sm px-1 text-caption-2-medium")}
        >
          Clear
        </button>
      </div>
    </section>
  );
}

/* 5. Inline Comment */

export function InlineComment() {
  const [resolved, setResolved] = useState(false);
  const [replying, setReplying] = useState(false);
  const [reply, setReply] = useState("");
  const [posted, setPosted] = useState<string | null>(null);
  const replyRef = useRef<HTMLInputElement>(null);
  const replyButtonRef = useRef<HTMLButtonElement>(null);
  const reopenRef = useRef<HTMLButtonElement>(null);
  const wasResolved = useRef(false);

  useEffect(() => {
    if (replying) replyRef.current?.focus();
  }, [replying]);

  useEffect(() => {
    if (resolved === wasResolved.current) return;
    wasResolved.current = resolved;
    if (resolved) reopenRef.current?.focus();
    else replyButtonRef.current?.focus();
  }, [resolved]);

  const send = () => {
    const next = reply.trim();
    if (!next) return;
    setPosted(next);
    setReply("");
    setReplying(false);
    replyButtonRef.current?.focus();
  };

  return (
    <section
      aria-label="Inline comment"
      onKeyDown={(event) => {
        if (event.key === "Escape" && replying) {
          event.stopPropagation();
          setReplying(false);
          replyButtonRef.current?.focus();
        }
      }}
      className={cx(
        "w-full max-w-[320px] rounded-xl border p-2.5 shadow-card",
        "transition-[background-color,border-color] duration-200 ease-out motion-reduce:transition-none",
        resolved
          ? "border-separator-border bg-background-secondary-default"
          : "border-border-button-default bg-background-primary-default",
      )}
    >
      <div className="flex items-center gap-1.5">
        <PersonDot initials="MC" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary">Maya Chen</p>
          <p className="truncate text-caption-2-regular text-text-tertiary">on “The North Crossing” · 12m</p>
        </div>
        {resolved && (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-status-lime-background px-1.5 py-0.5 text-caption-2-medium text-status-lime-text animate-label-in motion-reduce:animate-none">
            <RiCheckDoubleLine className="size-3" aria-hidden />
            Resolved
          </span>
        )}
      </div>

      <p
        className={cx(
          "mt-1.5 text-caption-1-regular transition-[color] duration-200 ease-out motion-reduce:transition-none",
          resolved ? "text-text-tertiary" : "text-text-secondary",
        )}
      >
        Can we keep the 18:40 crossing in the third paragraph? That is the ferry most people take.
      </p>

      {posted && (
        <div className="mt-1.5 flex items-start gap-1.5 border-s-2 border-separator-border ps-2 animate-label-in motion-reduce:animate-none">
          <PersonDot initials="JR" tone="lime" />
          <p className="min-w-0 flex-1 text-caption-2-regular text-text-secondary">
            <span className="text-caption-2-semibold text-text-primary">Jonas Reed</span> {posted}
          </p>
        </div>
      )}

      {resolved ? (
        <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-separator-border pt-1.5">
          <span className="text-caption-2-regular text-text-tertiary">Resolved by you · just now</span>
          <button
            ref={reopenRef}
            type="button"
            onClick={() => setResolved(false)}
            className={cx(quietButton, "h-6")}
          >
            <RiArrowGoBackLine className="size-3 rtl:-scale-x-100" aria-hidden />
            Reopen
          </button>
        </div>
      ) : (
        <>
          <div className="mt-1.5 flex items-center gap-1.5">
            <button
              type="button"
              ref={replyButtonRef}
              aria-expanded={replying}
              onClick={() => setReplying((current) => !current)}
              className={cx(secondaryButton, "h-6")}
            >
              <RiReplyLine className="size-3 rtl:-scale-x-100" aria-hidden />
              Reply
            </button>
            <button
              type="button"
              onClick={() => {
                setResolved(true);
                setReplying(false);
              }}
              className={cx(primaryButton, "h-6")}
            >
              <RiCheckDoubleLine className="size-3" aria-hidden />
              Resolve
            </button>
          </div>

          <div
            inert={!replying}
            className={cx(revealGrid, replying ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="flex items-center gap-1.5 py-1">
                <input
                  ref={replyRef}
                  value={reply}
                  aria-label="Reply to Maya Chen"
                  placeholder="Reply to Maya…"
                  onChange={(event) => setReply(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      send();
                    }
                  }}
                  className="h-6 min-w-0 flex-1 rounded-md bg-background-secondary-default px-2 text-caption-1-regular text-text-primary outline-none placeholder:text-text-placeholder focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                />
                <button
                  type="button"
                  aria-label="Send reply"
                  disabled={!reply.trim()}
                  onClick={send}
                  className={cx(primaryButton, "size-6 px-0")}
                >
                  <RiSendPlaneLine className="size-3" aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

/* 6. Version Chip */

const VERSION_TEXT = "The ferry leaves at dusk. We loaded the crates while the tide came in.";
const VERSION_PREVIOUS = "The ferry leaves at dusk. The north crossing closes an hour later.";

export function VersionChip() {
  const id = useId();
  const [text, setText] = useState(VERSION_TEXT);
  const [dirty, setDirty] = useState(false);
  const [version, setVersion] = useState(14);
  const [confirming, setConfirming] = useState(false);
  const [note, setNote] = useState("Saved 2 minutes ago");
  const restoreButtonRef = useRef<HTMLButtonElement>(null);

  const save = () => {
    setDirty(false);
    setVersion((current) => current + 1);
    setNote("Saved just now");
  };

  const closeConfirm = () => {
    setConfirming(false);
    restoreButtonRef.current?.focus();
  };

  const restore = () => {
    setText(VERSION_PREVIOUS);
    setVersion(13);
    setDirty(false);
    setConfirming(false);
    setNote("Restored from v13");
    restoreButtonRef.current?.focus();
  };

  return (
    <section
      aria-label="Version chip"
      className={cx(cardSurface, "p-2.5")}
      onKeyDown={(event) => {
        if (event.key === "Escape" && confirming) {
          event.stopPropagation();
          closeConfirm();
        }
      }}
    >
      <div className="flex items-center gap-1.5">
        <h3 className="min-w-0 flex-1 truncate text-caption-1-semibold text-text-primary">Ferry notes</h3>
        <span
          className={cx(
            "flex shrink-0 items-center gap-1 rounded-full border px-1.5 py-0.5 text-caption-2-medium",
            "transition-[background-color,border-color,color] duration-200 ease-out motion-reduce:transition-none",
            dirty
              ? "border-status-yellow-text/40 bg-status-yellow-background text-status-yellow-text"
              : "border-separator-border bg-background-secondary-default text-text-secondary",
          )}
        >
          <span
            className={cx("size-1.5 rounded-full", dirty ? "bg-status-yellow-text" : "bg-status-lime-text")}
            aria-hidden
          />
          v{version} · {dirty ? "Unsaved" : "Saved"}
        </span>
        <button
          type="button"
          onClick={save}
          disabled={!dirty}
          className={cx(primaryButton, "h-6 px-2")}
        >
          Save
        </button>
      </div>

      <textarea
        value={text}
        aria-label="Draft text"
        spellCheck={false}
        onChange={(event) => {
          setText(event.target.value);
          setDirty(true);
          setNote("Unsaved changes");
        }}
        className="mt-1.5 h-14 w-full resize-none rounded-lg bg-background-secondary-default px-2 py-1.5 text-caption-1-regular text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      />

      <div className="mt-1 flex h-6 items-center justify-between gap-2">
        <span aria-live="polite" className="min-w-0 truncate text-caption-2-regular text-text-tertiary">
          {dirty ? "Unsaved changes" : note}
        </span>
        <button
          type="button"
          ref={restoreButtonRef}
          aria-expanded={confirming}
          aria-controls={`${id}-confirm`}
          onClick={() => setConfirming((current) => !current)}
          className={cx(quietButton, "h-6")}
        >
          <RiHistoryLine className="size-3" aria-hidden />
          Restore v13
        </button>
      </div>

      <div
        id={`${id}-confirm`}
        inert={!confirming}
        className={cx(revealGrid, confirming ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mt-1 flex items-center gap-1.5 rounded-lg border border-border-button-default bg-background-secondary-default p-1.5">
            <p className="min-w-0 flex-1 text-caption-2-regular text-text-secondary">
              Restore v13? This replaces your draft.
            </p>
            <button type="button" onClick={closeConfirm} className={cx(quietButton, "h-6")}>
              Cancel
            </button>
            <button type="button" onClick={restore} className={cx(primaryButton, "h-6 px-2")}>
              Restore
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 7. Word Count */

const NOTE_TEXT =
  "The last ferry leaves at dusk, and the north crossing closes an hour later. We loaded the crates by the boathouse.";
const RING_RADIUS = 23;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

export function WordCount() {
  const [text, setText] = useState(NOTE_TEXT);
  const [goal, setGoal] = useState(30);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const characters = text.replace(/\s/g, "").length;
  const minutes = words === 0 ? 0 : Math.max(1, Math.ceil(words / 200));
  const percent = Math.min(100, Math.round((words / goal) * 100));
  const complete = words >= goal;
  const offset = RING_CIRCUMFERENCE - (percent / 100) * RING_CIRCUMFERENCE;

  return (
    <section aria-label="Word count" className={cx(cardSurface, "p-2.5")}>
      <div className="flex h-5 items-center justify-between gap-2">
        <h3 className="text-caption-1-semibold text-text-primary">Word count</h3>
        <div className="flex items-center gap-0.5">
          <span className="me-0.5 text-caption-2-regular text-text-tertiary">Goal</span>
          <button
            type="button"
            aria-label="Decrease word goal"
            disabled={goal <= 10}
            onClick={() => setGoal((current) => Math.max(10, current - 10))}
            className={cx(iconButton, "size-5")}
          >
            <RiSubtractLine className="size-3" aria-hidden />
          </button>
          <span aria-live="polite" className="w-6 text-center text-caption-1-semibold text-text-primary tabular-nums">{goal}</span>
          <button
            type="button"
            aria-label="Increase word goal"
            disabled={goal >= 200}
            onClick={() => setGoal((current) => Math.min(200, current + 10))}
            className={cx(iconButton, "size-5")}
          >
            <RiAddLine className="size-3" aria-hidden />
          </button>
        </div>
      </div>

      <div className="mt-1 flex items-center gap-2.5">
        <div
          role="progressbar"
          aria-label="Words toward goal"
          aria-valuemin={0}
          aria-valuemax={goal}
          aria-valuenow={Math.min(words, goal)}
          aria-valuetext={`${words} of ${goal} words`}
          className="relative size-14 shrink-0"
        >
          <svg viewBox="0 0 56 56" className="size-full -rotate-90" aria-hidden>
            <circle cx="28" cy="28" r={RING_RADIUS} fill="none" strokeWidth="5" className="stroke-background-tertiary-default" />
            <circle
              cx="28"
              cy="28"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={offset}
              className={cx(
                "transition-[stroke-dashoffset,stroke] duration-200 ease-out motion-reduce:transition-none",
                complete ? "stroke-status-lime-text" : "stroke-accent-500",
              )}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-caption-1-semibold text-text-primary tabular-nums">
            {percent}%
          </span>
        </div>

        <dl className="grid min-w-0 flex-1 grid-cols-3 gap-1">
          {[
            { label: "Words", value: words },
            { label: "Characters", value: characters },
            { label: "Read", value: `${minutes} min` },
          ].map((stat) => (
            <div key={stat.label} className="min-w-0">
              <dt className="truncate text-caption-2-regular text-text-tertiary">{stat.label}</dt>
              <dd className="text-caption-1-semibold text-text-primary tabular-nums">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <textarea
        value={text}
        aria-label="Draft excerpt"
        spellCheck={false}
        onChange={(event) => setText(event.target.value)}
        className="mt-1.5 h-12 w-full resize-none rounded-lg bg-background-secondary-default px-2 py-1 text-caption-1-regular text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
      />

      <p className="mt-1 text-caption-2-regular text-text-tertiary">
        {complete ? "Goal reached. The ring is full." : `${goal - words} words to the goal.`}
      </p>
    </section>
  );
}

/* 8. Table Inserter */

export function TableInserter() {
  const [hovered, setHovered] = useState({ rows: 3, cols: 3 });
  const [inserted, setInserted] = useState<{ rows: number; cols: number } | null>(null);
  const removeRef = useRef<HTMLButtonElement>(null);
  const insertRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (inserted) removeRef.current?.focus();
  }, [inserted]);

  const removeTable = () => {
    setInserted(null);
    window.requestAnimationFrame(() => insertRef.current?.focus());
  };

  return (
    <section aria-label="Table inserter" className={cx(cardSurface, "p-2.5")}>
      <div className="flex h-5 items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-caption-1-semibold text-text-primary">
          <RiTableLine className="size-3.5 text-foreground-icon-secondary" aria-hidden />
          Insert table
        </h3>
        <span aria-live="polite" className="text-caption-2-regular text-text-tertiary tabular-nums">
          {inserted ? `${inserted.cols} × ${inserted.rows} added` : `${hovered.cols} × ${hovered.rows}`}
        </span>
      </div>

      {inserted ? (
        <div key={`${inserted.cols}-${inserted.rows}`} className="mt-1.5 animate-label-in motion-reduce:animate-none">
          <div className="flex items-center justify-between gap-2">
            <p className="text-caption-1-semibold text-text-primary tabular-nums">
              {inserted.cols} × {inserted.rows} table
            </p>
            <button
              ref={removeRef}
              type="button"
              onClick={removeTable}
              className={cx(quietButton, "h-6")}
            >
              <RiDeleteBinLine className="size-3" aria-hidden />
              Remove
            </button>
          </div>
          <div className="mt-1 overflow-hidden rounded-md border border-border-button-default">
            <div
              className="grid"
              style={{ gridTemplateColumns: `repeat(${inserted.cols}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: inserted.cols }, (_, index) => (
                <span
                  key={`h-${index}`}
                  className="flex h-4 items-center justify-center border-e border-b border-separator-border bg-background-secondary-default text-caption-2-regular text-text-tertiary"
                >
                  {String.fromCharCode(65 + index)}
                </span>
              ))}
              {Array.from({ length: inserted.cols * inserted.rows }, (_, index) => (
                <span key={`c-${index}`} className="h-2 border-e border-b border-separator-border bg-background-primary-default" />
              ))}
            </div>
          </div>
          <p className="mt-1 text-caption-2-regular text-text-tertiary">Added after “Before the tide”.</p>
        </div>
      ) : (
        <div className="mt-1.5 flex items-start gap-3">
          <div role="group" aria-label="Table size" className="grid shrink-0 grid-cols-6 gap-1">
            {Array.from({ length: 36 }, (_, index) => {
              const row = Math.floor(index / 6) + 1;
              const col = (index % 6) + 1;
              const on = row <= hovered.rows && col <= hovered.cols;
              return (
                <button
                  key={index}
                  type="button"
                  aria-label={`${col} columns by ${row} rows`}
                  onPointerEnter={() => setHovered({ rows: row, cols: col })}
                  onFocus={() => setHovered({ rows: row, cols: col })}
                  onClick={() => setHovered({ rows: row, cols: col })}
                  className={cx(
                    "size-3.5 rounded-xs border",
                    "transition-[background-color,border-color] duration-150 ease-out motion-reduce:transition-none",
                    focusRing,
                    on
                      ? "border-accent-500 bg-accent-500/25"
                      : "border-border-button-default bg-background-secondary-default hover:bg-background-tertiary-default",
                  )}
                />
              );
            })}
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-end gap-1.5">
            <p className="text-end text-caption-2-regular text-text-tertiary">
              <span className="block text-body-2-semibold text-text-primary tabular-nums">
                {hovered.cols} × {hovered.rows}
              </span>
              columns by rows
            </p>
            <button
              ref={insertRef}
              type="button"
              onClick={() => setInserted(hovered)}
              className={cx(primaryButton, "mt-auto h-6")}
            >
              Insert table
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/* 9. Embed Card */

const EMBEDS = {
  youtube: {
    name: "YouTube",
    title: "North Crossing — 16mm ferry footage",
    meta: "4:12 · Fieldnotes Studio",
    icon: RiYoutubeLine,
    tone: "bg-status-rose-background text-status-rose-text",
  },
  vimeo: {
    name: "Vimeo",
    title: "The last ferry, 18:40",
    meta: "2:38 · Jonas Reed",
    icon: RiVimeoLine,
    tone: "bg-status-blue-background text-status-blue-text",
  },
  figma: {
    name: "Figma",
    title: "North Crossing — map annotations",
    meta: "File · 34 frames",
    icon: RiFigmaLine,
    tone: "bg-status-purple-background text-status-purple-text",
  },
} as const;

type ProviderId = keyof typeof EMBEDS;

function detectProvider(url: string): ProviderId | null {
  const value = url.toLowerCase();
  if (value.includes("youtube.com") || value.includes("youtu.be")) return "youtube";
  if (value.includes("vimeo.com")) return "vimeo";
  if (value.includes("figma.com")) return "figma";
  return null;
}

export function EmbedCard() {
  const urlRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("https://www.youtube.com/watch?v=north-crossing-16mm");
  const [inserted, setInserted] = useState(false);
  const provider = detectProvider(url);
  const preview = provider ? EMBEDS[provider] : null;
  const PreviewIcon = preview?.icon;

  return (
    <section aria-label="Embed card" className={cx(cardSurface, "p-2.5")}>
      <div className="flex h-5 items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-caption-1-semibold text-text-primary">
          <RiLinkM className="size-3.5 text-foreground-icon-secondary" aria-hidden />
          Embed
        </h3>
        <span className="text-caption-2-regular text-text-tertiary">
          {inserted ? "In Draft" : "Media block"}
        </span>
      </div>

      <div className="mt-1.5 flex h-7 items-center gap-1.5 rounded-md bg-background-secondary-default px-1.5 focus-within:ring-2 focus-within:ring-border-focus-ring">
        <RiLinkM className="size-3 shrink-0 text-foreground-icon-tertiary" aria-hidden />
        <input
          ref={urlRef}
          value={url}
          dir="ltr"
          aria-label="Embed URL"
          placeholder="https://youtu.be/…"
          spellCheck={false}
          onChange={(event) => {
            setUrl(event.target.value);
            setInserted(false);
          }}
          className="min-w-0 flex-1 bg-transparent font-mono text-caption-2-regular text-text-primary outline-none placeholder:text-text-placeholder"
        />
        {url && (
          <button
            type="button"
            aria-label="Clear embed URL"
            onClick={() => {
              setUrl("");
              setInserted(false);
              urlRef.current?.focus();
            }}
            className={cx(iconButton, "size-5")}
          >
            <RiCloseLine className="size-3" aria-hidden />
          </button>
        )}
      </div>

      <div className="mt-1.5">
        {preview && PreviewIcon ? (
          <div
            key={provider}
            className="flex items-center gap-2 rounded-lg border border-separator-border bg-background-secondary-default p-1.5 animate-label-in motion-reduce:animate-none"
          >
            <span className={cx("flex size-8 shrink-0 items-center justify-center rounded-md", preview.tone)}>
              <PreviewIcon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-caption-1-semibold text-text-primary">{preview.title}</p>
              <p className="truncate text-caption-2-regular text-text-tertiary">
                {preview.name} · {preview.meta}
              </p>
            </div>
            <button
              type="button"
              aria-pressed={inserted}
              onClick={() => setInserted((current) => !current)}
              className={cx(inserted ? secondaryButton : primaryButton, "h-6 px-2")}
            >
              {inserted ? (
                <>
                  <RiDeleteBinLine className="size-3" aria-hidden />
                  Remove
                </>
              ) : (
                "Insert"
              )}
            </button>
          </div>
        ) : (
          <div className="flex h-[46px] items-center gap-1.5 rounded-lg border border-dashed border-border-button-default px-2">
            <RiLinkUnlinkM className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
            <p className="text-caption-2-regular text-text-tertiary">
              Paste a YouTube, Vimeo or Figma link.
            </p>
          </div>
        )}
      </div>

      <div className="mt-1 flex h-4 items-center justify-between gap-2">
        <span className="text-caption-2-regular text-text-tertiary">
          {inserted ? "Embedded · opens in a new tab" : "The preview comes from the link."}
        </span>
        {inserted && (
          <span className="flex shrink-0 items-center gap-1 text-caption-2-medium text-status-lime-text">
            <RiCheckLine className="size-3" aria-hidden />
            Added
          </span>
        )}
      </div>
    </section>
  );
}

/* 10. Find Replace */

const FIND_TEXT =
  "The last ferry leaves at dusk. The ferry returns at 06:10 from the north crossing.";

function findMatches(text: string, query: string) {
  const matches: { start: number; end: number }[] = [];
  if (!query) return matches;
  const haystack = text.toLowerCase();
  const needle = query.toLowerCase();
  let index = haystack.indexOf(needle);
  while (index !== -1) {
    matches.push({ start: index, end: index + needle.length });
    index = haystack.indexOf(needle, index + needle.length);
  }
  return matches;
}

export function FindReplace() {
  const [doc, setDoc] = useState(FIND_TEXT);
  const [find, setFind] = useState("ferry");
  const [replacement, setReplacement] = useState("boat");
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [version, setVersion] = useState(0);

  const matches = findMatches(doc, find);
  const activeIndex = matches.length ? Math.min(active, matches.length - 1) : 0;
  const count = matches.length;

  const go = (delta: number) => {
    if (!count) return;
    setActive((current) => (current + delta + count) % count);
    setStatus(null);
  };

  const replaceAll = () => {
    if (!count) return;
    const pattern = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    setDoc((current) => current.replace(pattern, () => replacement));
    setStatus(`Replaced ${count} ${count === 1 ? "match" : "matches"}`);
    setVersion((current) => current + 1);
    setActive(0);
  };

  const chunks: ReactNode[] = [];
  let cursor = 0;
  matches.forEach((match, index) => {
    if (match.start > cursor) chunks.push(doc.slice(cursor, match.start));
    chunks.push(
      <mark
        key={`${match.start}-${index}`}
        className={cx(
          "rounded-sm px-0.5 transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
          index === activeIndex
            ? "bg-accent-600 text-text-white"
            : "bg-status-yellow-background text-status-yellow-text",
        )}
      >
        {doc.slice(match.start, match.end)}
      </mark>,
    );
    cursor = match.end;
  });
  if (cursor < doc.length) chunks.push(doc.slice(cursor));

  return (
    <section aria-label="Find and replace" className={cx(cardSurface, "max-w-[460px] p-2.5")}>
      <div className="flex h-5 items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-caption-1-semibold text-text-primary">
          <RiSearchLine className="size-3.5 text-foreground-icon-secondary" aria-hidden />
          Find &amp; replace
        </h3>
        <span className="rounded-full bg-background-secondary-default px-1.5 py-0.5 text-caption-2-medium text-text-tertiary tabular-nums">
          {count} {count === 1 ? "match" : "matches"}
        </span>
      </div>

      <div className="mt-1.5 grid gap-2 sm:grid-cols-[200px_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-1">
          <label className="flex flex-col gap-0.5">
            <span className="text-caption-2-regular text-text-tertiary">Find</span>
            <span className="flex h-7 items-center gap-1.5 rounded-md bg-background-secondary-default px-1.5 focus-within:ring-2 focus-within:ring-border-focus-ring">
              <RiSearchLine className="size-3 shrink-0 text-foreground-icon-tertiary" aria-hidden />
              <input
                value={find}
                onChange={(event) => {
                  setFind(event.target.value);
                  setActive(0);
                  setStatus(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    go(1);
                  }
                }}
                className="min-w-0 flex-1 bg-transparent text-caption-1-regular text-text-primary outline-none"
              />
            </span>
          </label>
          <label className="flex flex-col gap-0.5">
            <span className="text-caption-2-regular text-text-tertiary">Replace with</span>
            <span className="flex h-7 items-center gap-1.5 rounded-md bg-background-secondary-default px-1.5 focus-within:ring-2 focus-within:ring-border-focus-ring">
              <RiText className="size-3 shrink-0 text-foreground-icon-tertiary" aria-hidden />
              <input
                value={replacement}
                onChange={(event) => setReplacement(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-caption-1-regular text-text-primary outline-none"
              />
            </span>
          </label>
          <div className="mt-auto flex items-center gap-1 pt-0.5">
            <span className="min-w-0 flex-1 text-caption-2-regular text-text-tertiary tabular-nums">
              {count ? `${activeIndex + 1} of ${count}` : "No matches"}
            </span>
            <button
              type="button"
              aria-label="Previous match"
              disabled={!count}
              onClick={() => go(-1)}
              className={cx(iconButton, "size-5")}
            >
              <RiArrowUpLine className="size-3" aria-hidden />
            </button>
            <button
              type="button"
              aria-label="Next match"
              disabled={!count}
              onClick={() => go(1)}
              className={cx(iconButton, "size-5")}
            >
              <RiArrowDownLine className="size-3" aria-hidden />
            </button>
          </div>
        </div>

        <div className="min-w-0 rounded-lg bg-background-secondary-default p-2">
          <p className="text-caption-2-regular text-text-tertiary">Draft excerpt</p>
          <p
            key={version}
            className="mt-1 text-caption-1-regular text-text-primary animate-label-in motion-reduce:animate-none"
          >
            {chunks}
          </p>
        </div>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span aria-live="polite" className="min-w-0 truncate text-caption-2-regular text-text-tertiary">
          {status ?? (count ? "Use Replace all to change every match." : "No matches in this draft.")}
        </span>
        <button
          type="button"
          disabled={!count}
          onClick={replaceAll}
          className={cx(primaryButton, "h-6")}
        >
          Replace all
        </button>
      </div>
    </section>
  );
}

/* 11. Outline Rail */

const OUTLINE = [
  { level: 1, label: "The North Crossing" },
  { level: 2, label: "Before the tide" },
  { level: 2, label: "Loading the crates" },
  { level: 2, label: "After dark" },
] as const;

const OUTLINE_ROW = 28;

export function OutlineRail() {
  const [current, setCurrent] = useState(2);
  const last = OUTLINE.length - 1;

  return (
    <section aria-label="Outline rail" className={cx(cardSurface, "p-2.5")}>
      <div className="flex h-5 items-center justify-between gap-2">
        <h3 className="text-caption-1-semibold text-text-primary">On this page</h3>
        <span className="text-caption-2-regular text-text-tertiary">{OUTLINE.length} headings</span>
      </div>

      <div className="relative mt-1">
        <span aria-hidden className="absolute inset-y-0 start-0 w-px bg-separator-border" />
        <span
          aria-hidden
          className="absolute start-0 top-0 h-7 w-0.5 rounded-full bg-accent-500 transition-transform duration-200 ease-out motion-reduce:transition-none"
          style={{ transform: `translateY(${current * OUTLINE_ROW}px)` }}
        />
        {OUTLINE.map((item, index) => {
          const isCurrent = current === index;
          return (
            <button
              key={item.label}
              type="button"
              aria-current={isCurrent ? "location" : undefined}
              onClick={() => setCurrent(index)}
              className={cx(
                "flex h-7 w-full items-center gap-2 ps-3 pe-1 text-start",
                "transition-[color,background-color] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                isCurrent ? "text-text-primary" : "text-text-tertiary hover:text-text-secondary",
              )}
            >
              <span
                className={cx(
                  "min-w-0 flex-1 truncate",
                  isCurrent || item.level === 1 ? "text-caption-1-semibold" : "text-caption-1-regular",
                  item.level === 2 && "ps-1",
                )}
              >
                {item.label}
              </span>
              <span className="shrink-0 text-caption-2-regular text-text-tertiary">
                {item.level === 1 ? "H1" : "H2"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-1 flex h-6 items-center justify-between gap-2 border-t border-separator-border pt-1">
        <span className="text-caption-2-regular text-text-tertiary">
          Section {current + 1} of {OUTLINE.length}
        </span>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            aria-label="Previous heading"
            disabled={current === 0}
            onClick={() => setCurrent((index) => Math.max(0, index - 1))}
            className={cx(iconButton, "size-5")}
          >
            <RiArrowUpLine className="size-3" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next heading"
            disabled={current === last}
            onClick={() => setCurrent((index) => Math.min(last, index + 1))}
            className={cx(iconButton, "size-5")}
          >
            <RiArrowDownLine className="size-3" aria-hidden />
          </button>
        </div>
      </div>
    </section>
  );
}

/* 12. Publish Dialog */

const VISIBILITY = [
  { id: "public", label: "Public" },
  { id: "unlisted", label: "Unlisted" },
] as const;

type VisibilityId = (typeof VISIBILITY)[number]["id"];

const SCHEDULE = [
  { id: "now", label: "Now" },
  { id: "next", label: "Nov 6 · 09:00" },
] as const;

type ScheduleId = (typeof SCHEDULE)[number]["id"];

export function PublishDialog() {
  const id = useId();
  const [open, setOpen] = useState(true);
  const [visibility, setVisibility] = useState<VisibilityId>("public");
  const [slug, setSlug] = useState("the-north-crossing");
  const [schedule, setSchedule] = useState<ScheduleId>("now");
  const [published, setPublished] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(true);
  const wasPublished = useRef(false);

  const visibilityLabel = visibility === "public" ? "Public" : "Unlisted";
  const timing = schedule === "now" ? "Live now" : "Nov 6 at 09:00 GMT";
  const path = `northline.co/notes/${slug || "untitled"}`;

  useEffect(() => {
    if (open === wasOpen.current) return;
    wasOpen.current = open;
    if (open) closeRef.current?.focus();
    else triggerRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (published === wasPublished.current) return;
    wasPublished.current = published;
    closeRef.current?.focus();
  }, [published]);

  const publish = () => {
    if (!slug.trim()) {
      setError("Add a slug before publishing.");
      return;
    }
    setError(null);
    setPublished(true);
  };

  const copy = () => {
    setCopied(true);
    void navigator.clipboard?.writeText(`https://${path}`).catch(() => undefined);
  };

  if (!open) {
    return (
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        className={cx(cardSurface, "flex h-9 items-center justify-between gap-2 px-2.5 text-start", focusRing, "transition-[background-color,box-shadow] duration-150 ease-out hover:bg-background-primary-hover motion-reduce:transition-none")}
      >
        <span className="flex items-center gap-1.5 text-caption-1-semibold text-text-primary">
          <RiSendPlaneLine className="size-3.5 text-foreground-icon-secondary" aria-hidden />
          Publish note
        </span>
        <span className="text-caption-2-regular text-text-tertiary">
          {published ? (schedule === "now" ? "Published" : "Scheduled") : "Draft · v14"}
        </span>
      </button>
    );
  }

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-labelledby={`${id}-title`}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          setOpen(false);
        }
      }}
      className={cx(cardSurface, "p-2.5")}
    >
      {published ? (
        <div className="animate-label-in motion-reduce:animate-none">
          <div className="flex items-start gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-status-lime-background text-status-lime-text">
              <RiCheckLine className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <h3 id={`${id}-title`} className="text-caption-1-semibold text-text-primary">
                {schedule === "now" ? "Note published" : "Note scheduled"}
              </h3>
              <p className="text-caption-2-regular text-text-tertiary">
                {schedule === "now" ? "It is live for readers now." : "It will go live on Nov 6 at 09:00."}
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              aria-label="Close publish dialog"
              onClick={() => setOpen(false)}
              className={iconButton}
            >
              <RiCloseLine className="size-3.5" aria-hidden />
            </button>
          </div>

          <dl className="mt-1.5 flex flex-col gap-0.5 rounded-md bg-background-secondary-default px-2 py-1 text-caption-2-regular">
            <div className="flex items-center justify-between gap-2">
              <dt className="text-text-tertiary">Visibility</dt>
              <dd className="text-text-primary">{visibilityLabel}</dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="shrink-0 text-text-tertiary">URL</dt>
              <dd dir="ltr" className="min-w-0 truncate font-mono text-text-primary">
                {path}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-2">
              <dt className="text-text-tertiary">Timing</dt>
              <dd className="text-text-primary">{timing}</dd>
            </div>
          </dl>

          <div className="mt-1.5 flex items-center gap-1.5">
            <button type="button" onClick={copy} aria-live="polite" className={cx(primaryButton, "h-6")}>
              {copied ? (
                <>
                  <RiCheckLine className="size-3" aria-hidden />
                  Link copied
                </>
              ) : (
                <>
                  <RiFileCopyLine className="size-3" aria-hidden />
                  Copy link
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setPublished(false);
                setCopied(false);
              }}
              className={cx(secondaryButton, "h-6")}
            >
              Back to draft
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <h3 id={`${id}-title`} className="text-caption-1-semibold text-text-primary">
              Publish note
            </h3>
            <button
              ref={closeRef}
              type="button"
              aria-label="Close publish dialog"
              onClick={() => setOpen(false)}
              className={iconButton}
            >
              <RiCloseLine className="size-3.5" aria-hidden />
            </button>
          </div>

          <div className="mt-1.5 flex items-center justify-between gap-2">
            <span className="text-caption-2-regular text-text-tertiary">Visibility</span>
            <div role="group" aria-label="Visibility" className="flex rounded-md bg-segmented-control-background p-0.5">
              {VISIBILITY.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={visibility === option.id}
                  onClick={() => setVisibility(option.id)}
                  className={cx(
                    "h-6 rounded-sm px-2 text-caption-2-medium",
                    "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                    focusRing,
                    visibility === option.id
                      ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
                      : "text-text-tertiary hover:text-text-secondary",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-1">
            <label htmlFor={`${id}-slug`} className="text-caption-2-regular text-text-tertiary">
              Slug
            </label>
            <div className="mt-0.5 flex h-7 items-center rounded-md bg-background-secondary-default px-1.5 focus-within:ring-2 focus-within:ring-border-focus-ring" dir="ltr">
              <span className="shrink-0 font-mono text-caption-2-regular text-text-tertiary">
                northline.co/notes/
              </span>
              <input
                id={`${id}-slug`}
                value={slug}
                dir="ltr"
                spellCheck={false}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
                onChange={(event) => {
                  setSlug(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-"));
                  setError(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") publish();
                }}
                className="min-w-0 flex-1 bg-transparent font-mono text-caption-2-medium text-text-primary outline-none"
              />
            </div>
          </div>

          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="text-caption-2-regular text-text-tertiary">Schedule</span>
            <div role="group" aria-label="Publish schedule" className="flex gap-1">
              {SCHEDULE.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={schedule === option.id}
                  onClick={() => setSchedule(option.id)}
                  className={cx(
                    "h-6 rounded-md px-1.5 text-caption-2-medium",
                    "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                    focusRing,
                    schedule === option.id
                      ? "bg-background-secondary-default text-text-primary shadow-xs"
                      : "text-text-tertiary hover:bg-background-secondary-default hover:text-text-secondary",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p role="alert" id={`${id}-error`} className="mt-0.5 text-caption-2-regular text-text-error-primary">
              {error}
            </p>
          )}

          <div className="mt-1 flex items-center justify-between gap-2 border-t border-separator-border pt-1">
            <p className="min-w-0 truncate text-caption-2-regular text-text-tertiary">
              {visibilityLabel} · {schedule === "now" ? "live now" : "Nov 6 · 09:00"}
            </p>
            <button type="button" onClick={publish} className={cx(primaryButton, "h-6")}>
              {schedule === "now" ? "Publish" : "Schedule"}
            </button>
          </div>
        </>
      )}
    </section>
  );
}

/* Specimens */

export const EDITOR_SECTION: ExtendedSection = {
  id: "editor",
  title: "Editor",
  blurb: "Writing tools that stay out of the sentence.",
  file: "editor.tsx",
  entries: [
    { name: "Format Bar", description: "Bold, italic, underline and strike, with the paragraph reacting live.", Demo: FormatBar },
    { name: "Slash Menu", description: "Type / to filter insert commands, then choose with the keyboard.", Demo: SlashMenu },
    { name: "Link Popover", description: "Select a phrase, add a URL and title, then apply or edit the link.", Demo: LinkPopover },
    { name: "Highlight Picker", description: "Six token-backed highlights, previewed on a real sentence.", Demo: HighlightPicker },
    { name: "Inline Comment", description: "Reply, resolve and reopen without leaving the paragraph.", Demo: InlineComment },
    { name: "Version Chip", description: "Saved and unsaved drafts, a version label and a guarded restore.", Demo: VersionChip },
    { name: "Word Count", description: "Words, characters and reading time against an adjustable goal ring.", Demo: WordCount },
    { name: "Table Inserter", description: "Hover a 6×6 grid to size the table, then insert or remove it.", Demo: TableInserter },
    { name: "Embed Card", description: "Paste a link for a provider preview, then insert or remove the embed.", Demo: EmbedCard },
    { name: "Find Replace", description: "Find, step through matches and replace every occurrence.", Demo: FindReplace, wide: true },
    { name: "Outline Rail", description: "Headings with a current section marker and a rail that travels.", Demo: OutlineRail },
    { name: "Publish Dialog", description: "Visibility, slug and schedule, then a publish confirmation with a summary.", Demo: PublishDialog },
  ],
};
