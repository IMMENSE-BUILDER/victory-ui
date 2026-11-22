"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, RefObject } from "react";
import {
  RiAlertLine,
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiArrowRightUpLine,
  RiArticleLine,
  RiBookOpenLine,
  RiBrainLine,
  RiCheckLine,
  RiCloseLine,
  RiCpuLine,
  RiDeleteBinLine,
  RiFileCopyLine,
  RiMore2Line,
  RiPencilLine,
  RiPlayLine,
  RiSearchLine,
  RiSparklingLine,
  RiTimeLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* -------------------------------------------------------------------------- */
/*  Shared                                                                     */
/* -------------------------------------------------------------------------- */

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

function formatTokens(value: number) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function compactTokens(value: number) {
  const thousands = value / 1000;
  return `${Number.isInteger(thousands) ? thousands : thousands.toFixed(1)}k`;
}

/* -------------------------------------------------------------------------- */
/*  Prompt card                                                                */
/* -------------------------------------------------------------------------- */

const PROMPT_ACTIONS = [
  { label: "Duplicate", icon: RiFileCopyLine, danger: false },
  { label: "Edit prompt", icon: RiPencilLine, danger: false },
  { label: "Delete", icon: RiDeleteBinLine, danger: true },
] as const;

export function PromptCard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useDismiss(menuRef, () => setMenuOpen(false), menuOpen);

  const closeMenu = (restoreFocus: boolean) => {
    setMenuOpen(false);
    if (restoreFocus) triggerRef.current?.focus();
  };

  return (
    <div
      className="w-full max-w-[300px] rounded-xl border border-border-button-default bg-background-primary-default shadow-card"
      onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          event.stopPropagation();
          closeMenu(true);
        }
      }}
    >
      <div className="flex items-start gap-2 p-3">
        <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiSparklingLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Release notes from PRs</h3>
          <p className="mt-1 line-clamp-2 text-caption-1-regular text-text-secondary">
            Turn this week’s merged PRs into release notes grouped by theme. Keep each bullet under
            14 words and credit the author.
          </p>
        </div>
        <div ref={menuRef} className="relative -me-1.5 -mt-1 shrink-0">
          <button
            ref={triggerRef}
            type="button"
            aria-label="Prompt actions"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((next) => !next)}
            className="flex size-7 items-center justify-center rounded-md text-foreground-icon-tertiary transition-colors duration-150 ease hover:bg-background-tertiary-default hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <RiMore2Line className="size-4" aria-hidden />
          </button>
          {menuOpen && (
            <div
              role="menu"
              aria-label="Prompt actions"
              className="absolute end-0 top-[calc(100%+4px)] z-30 w-36 rounded-lg border border-border-button-default bg-background-primary-default p-1 shadow-dropdown"
            >
              {PROMPT_ACTIONS.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    type="button"
                    role="menuitem"
                    onClick={() => closeMenu(true)}
                    className={cx(
                      "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-start text-body-2-regular transition-colors duration-100 ease",
                      "hover:bg-dropdown-item-hover-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                      action.danger ? "text-text-destructive" : "text-text-primary",
                    )}
                  >
                    <Icon className="size-3.5 shrink-0" aria-hidden />
                    {action.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-separator-border px-3 py-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate rounded-full border border-border-button-default bg-background-secondary-default px-1.5 py-0.5 text-caption-2-medium text-text-secondary">
            Opus 4.5
          </span>
          <span className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">
            1,284 tok
          </span>
        </div>
        <button
          type="button"
          className="inline-flex h-7 shrink-0 items-center gap-1 rounded-lg bg-accent-600 px-2.5 text-caption-1-semibold text-text-white transition-colors duration-150 ease hover:bg-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <RiPlayLine className="size-3.5" aria-hidden />
          Run
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Token meter                                                                */
/* -------------------------------------------------------------------------- */

const CONTEXT_TOTAL = 200_000;
const CONTEXT_SEGMENTS = [
  { label: "System", tokens: 4_200, tone: "bg-chart-1" },
  { label: "History", tokens: 146_800, tone: "bg-chart-2" },
  { label: "Tools", tokens: 25_000, tone: "bg-chart-3" },
] as const;
const CONTEXT_USED = CONTEXT_SEGMENTS.reduce((total, segment) => total + segment.tokens, 0);
const CONTEXT_LEFT = CONTEXT_TOTAL - CONTEXT_USED;
const CONTEXT_PERCENT = Math.round((CONTEXT_USED / CONTEXT_TOTAL) * 100);
const CONTEXT_LEFT_PERCENT = Math.round((CONTEXT_LEFT / CONTEXT_TOTAL) * 100);

export function TokenMeter() {
  return (
    <div className="flex w-full max-w-[300px] flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-body-2-medium text-text-secondary">Context window</span>
        <span className="text-caption-1-medium text-status-orange-text tabular-nums">
          {CONTEXT_PERCENT}% used
        </span>
      </div>

      <div
        role="meter"
        aria-label="Context window usage"
        aria-valuemin={0}
        aria-valuemax={CONTEXT_TOTAL}
        aria-valuenow={CONTEXT_USED}
        aria-valuetext={`${formatTokens(CONTEXT_USED)} of ${formatTokens(CONTEXT_TOTAL)} tokens used`}
        className="flex h-2.5 w-full gap-px overflow-hidden rounded-full bg-background-tertiary-default"
      >
        {CONTEXT_SEGMENTS.map((segment) => (
          <span
            key={segment.label}
            aria-hidden
            className={cx("h-full", segment.tone)}
            style={{ width: `${(segment.tokens / CONTEXT_TOTAL) * 100}%` }}
            title={`${segment.label}: ${formatTokens(segment.tokens)} tokens`}
          />
        ))}
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <span className="text-caption-1-regular text-text-tertiary tabular-nums">
          <span className="text-text-primary">{formatTokens(CONTEXT_USED)}</span> /{" "}
          {formatTokens(CONTEXT_TOTAL)}
        </span>
        <span className="text-caption-1-regular text-text-tertiary tabular-nums">
          {formatTokens(CONTEXT_LEFT)} left
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {CONTEXT_SEGMENTS.map((segment) => (
          <span
            key={segment.label}
            className="flex items-center gap-1 text-caption-2-regular text-text-tertiary"
          >
            <span aria-hidden className={cx("size-1.5 rounded-full", segment.tone)} />
            {segment.label}
            <span className="text-text-secondary tabular-nums">
              {compactTokens(segment.tokens)}
            </span>
          </span>
        ))}
      </div>

      <div className="flex items-start gap-1.5 rounded-lg border border-status-orange-text/20 bg-status-orange-background px-2 py-1.5">
        <RiAlertLine className="mt-0.5 size-3.5 shrink-0 text-status-orange-text" aria-hidden />
        <p className="text-caption-2-medium text-status-orange-text">
          {CONTEXT_LEFT_PERCENT}% left before auto-compaction kicks in.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Model picker                                                               */
/* -------------------------------------------------------------------------- */

const MODELS = [
  {
    id: "opus",
    name: "Claude Opus 4.5",
    context: "200K",
    price: "$15 / $75",
  },
  {
    id: "gpt",
    name: "GPT-5.1",
    context: "400K",
    price: "$1.25 / $10",
  },
  {
    id: "gemini",
    name: "Gemini 3 Pro",
    context: "1M",
    price: "$2 / $12",
  },
] as const;

type ModelId = (typeof MODELS)[number]["id"];

export function ModelPicker() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<ModelId>("opus");
  const labelId = useId();
  const triggerId = useId();
  const listId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useDismiss(wrapperRef, () => setOpen(false), open);

  const selected = MODELS.find((model) => model.id === value) ?? MODELS[0];

  const choose = (id: ModelId) => {
    setValue(id);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleListKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const keys = ["ArrowDown", "ArrowUp", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    const options = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="option"]'),
    );
    if (options.length === 0) return;
    const current = options.indexOf(document.activeElement as HTMLButtonElement);
    let next = 0;
    if (event.key === "End") next = options.length - 1;
    else if (event.key === "ArrowDown") next = current === -1 ? 0 : (current + 1) % options.length;
    else if (event.key === "ArrowUp") {
      next = current === -1 ? options.length - 1 : (current - 1 + options.length) % options.length;
    }
    options[next]?.focus();
  };

  return (
    <div className="flex w-full max-w-[300px] flex-col gap-1">
      <span id={labelId} className="text-body-2-medium text-text-secondary">
        Model
      </span>
      <div
        ref={wrapperRef}
        className="relative"
        onKeyDown={(event) => {
          if (event.key === "Escape" && open) {
            event.stopPropagation();
            setOpen(false);
            triggerRef.current?.focus();
          }
        }}
      >
        <button
          ref={triggerRef}
          id={triggerId}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-labelledby={`${labelId} ${triggerId}`}
          onClick={() => setOpen((next) => !next)}
          className="flex w-full items-center gap-2 rounded-xl border border-border-button-default bg-background-primary-default p-2 text-start shadow-xs transition-colors duration-150 ease hover:bg-background-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background-tertiary-default text-foreground-icon-secondary">
            <RiCpuLine className="size-4" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-body-2-semibold text-text-primary">
              {selected.name}
            </span>
            <span className="block truncate text-caption-2-regular text-text-tertiary">
              {selected.context} context · {selected.price} per 1M
            </span>
          </span>
          <RiArrowDownSLine
            className={cx(
              "size-4 shrink-0 text-foreground-icon-tertiary transition-transform duration-200 ease-out",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </button>

        {open && (
          <div className="absolute inset-x-0 top-[calc(100%+6px)] z-30 rounded-xl border border-border-button-default bg-background-primary-default p-1 shadow-dropdown">
            <div
              id={listId}
              role="listbox"
              aria-labelledby={labelId}
              onKeyDown={handleListKeyDown}
            >
              {MODELS.map((model) => {
                const isSelected = model.id === value;
                return (
                  <button
                    key={model.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => choose(model.id)}
                    className={cx(
                      "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-start transition-colors duration-100 ease",
                      "hover:bg-dropdown-item-hover-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                      isSelected && "bg-background-secondary-default",
                    )}
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
                      <RiSparklingLine className="size-3" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-body-2-medium text-text-primary">
                        {model.name}
                      </span>
                      <span className="block truncate text-caption-2-regular text-text-tertiary">
                        {model.context} context · {model.price} per 1M
                      </span>
                    </span>
                    <span className="flex size-4 shrink-0 items-center justify-center text-accent-500">
                      {isSelected && <RiCheckLine className="size-4" aria-hidden />}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-1 border-t border-separator-border px-2 pt-1.5 pb-1">
              <span className="text-caption-2-regular text-text-tertiary">
                Prices are input / output per 1M tokens.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tool call row                                                              */
/* -------------------------------------------------------------------------- */

const TOOL_ARGUMENTS = [
  { key: "query", value: '"rate limit headers"', tone: "text-status-lime-text" },
  { key: "limit", value: "4", tone: "text-status-orange-text" },
] as const;

export function ToolCallRow() {
  const [open, setOpen] = useState(true);
  const panelId = useId();

  return (
    <div className="w-full max-w-[600px] overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default shadow-card">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((next) => !next)}
        className="flex w-full items-center gap-2 px-3 py-2 text-start transition-colors duration-150 ease hover:bg-background-secondary-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring"
      >
        {open ? (
          <RiArrowDownSLine className="size-4 shrink-0 text-foreground-icon-tertiary" aria-hidden />
        ) : (
          <RiArrowRightSLine
            className="size-4 shrink-0 text-foreground-icon-tertiary rtl:-scale-x-100"
            aria-hidden
          />
        )}
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiSearchLine className="size-3.5" aria-hidden />
        </span>
        <span className="min-w-0 truncate font-mono text-body-2-semibold text-text-primary">
          search_docs
        </span>
        <span className="flex shrink-0 items-center gap-1.5">
          <span
            aria-hidden
            className="size-1.5 rounded-full bg-status-lime-text ring-2 ring-status-dot-green-halo"
          />
          <span className="text-caption-2-medium text-status-lime-text">Completed</span>
        </span>
        <span className="ms-auto shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">
          412 ms
        </span>
      </button>

      {open && (
        <div id={panelId} className="border-t border-separator-border bg-background-secondary-default/40 px-3 py-2.5">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className="text-caption-2-semibold tracking-wide text-text-tertiary uppercase">
                  Arguments
                </span>
                <span className="font-mono text-caption-2-regular text-text-tertiary">JSON</span>
              </div>
              <pre
                dir="ltr"
                className="overflow-x-auto rounded-lg border border-separator-border bg-docs-code-background p-2 font-mono text-caption-1-regular leading-5"
              >
                <code>
                  <span className="block text-text-tertiary">{"{"}</span>
                  {TOOL_ARGUMENTS.map((argument, index) => (
                    <span key={argument.key} className="block ps-2">
                      <span className="text-status-blue-text">&quot;{argument.key}&quot;</span>
                      <span className="text-text-tertiary">: </span>
                      <span className={argument.tone}>{argument.value}</span>
                      {index < TOOL_ARGUMENTS.length - 1 && (
                        <span className="text-text-tertiary">,</span>
                      )}
                    </span>
                  ))}
                  <span className="block text-text-tertiary">{"}"}</span>
                </code>
              </pre>
            </div>

            <div className="min-w-0">
              <div className="mb-1 flex items-baseline justify-between gap-2">
                <span className="text-caption-2-semibold tracking-wide text-text-tertiary uppercase">
                  Result
                </span>
                <span className="text-caption-2-regular text-text-tertiary">4 passages</span>
              </div>
              <div className="flex h-full flex-col rounded-lg border border-separator-border bg-background-primary-default p-2">
                <p className="line-clamp-2 text-caption-1-regular text-text-secondary">
                  Rate limits are applied per workspace and reset on a rolling 60-second window.
                  Send a Retry-After header with 429 responses.
                </p>
                <div className="mt-auto flex items-center gap-1.5 border-t border-separator-border pt-1.5">
                  <RiBookOpenLine
                    className="size-3 shrink-0 text-foreground-icon-tertiary"
                    aria-hidden
                  />
                  <span
                    dir="ltr"
                    className="truncate text-caption-2-regular text-text-tertiary"
                  >
                    docs.example.com/api/limits
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Reasoning trace                                                            */
/* -------------------------------------------------------------------------- */

const REASONING_STEPS = [
  { text: "Grouped the failing assertions by module and test file.", duration: 1.2 },
  { text: "Compared the queue contract against the retry helper.", duration: 2.4 },
  { text: "Traced the timeout to a missing abort signal in flush().", duration: 3.1 },
  { text: "Wrote a regression test for the cancelled flush path.", duration: 1.7 },
] as const;
const REASONING_TOTAL = REASONING_STEPS.reduce((total, step) => total + step.duration, 0);
const RUNNING_TOTAL = REASONING_STEPS.slice(0, -1).reduce(
  (total, step) => total + step.duration,
  0,
);

const segmentButton =
  "h-5 rounded-full px-1.5 text-caption-2-semibold transition-colors duration-150 ease focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";

export function ReasoningTrace() {
  const [running, setRunning] = useState(true);

  return (
    <div className="w-full max-w-[600px] overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default shadow-card">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-separator-border px-3 py-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiBrainLine className="size-3.5" aria-hidden />
        </span>
        <span className="text-body-2-semibold text-text-primary">Reasoning</span>
        <span className="flex items-center gap-1.5">
          {running ? (
            <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-accent-500" />
          ) : (
            <RiCheckLine className="size-3 text-status-lime-text" aria-hidden />
          )}
          <span
            className={cx(
              "text-caption-2-medium",
              running ? "text-text-secondary" : "text-status-lime-text",
            )}
          >
            {running ? "Thinking" : "Complete"}
          </span>
        </span>
        <div className="ms-auto flex items-center gap-2">
          <span className="text-caption-2-regular text-text-tertiary tabular-nums">
            {running ? `${RUNNING_TOTAL.toFixed(1)}s` : `${REASONING_TOTAL.toFixed(1)}s`}
          </span>
          <div
            role="group"
            aria-label="Trace state"
            className="flex items-center rounded-full bg-background-secondary-default p-0.5"
          >
            <button
              type="button"
              aria-pressed={running}
              onClick={() => setRunning(true)}
              className={cx(
                segmentButton,
                running
                  ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
                  : "text-text-tertiary hover:text-text-secondary",
              )}
            >
              Running
            </button>
            <button
              type="button"
              aria-pressed={!running}
              onClick={() => setRunning(false)}
              className={cx(
                segmentButton,
                !running
                  ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
                  : "text-text-tertiary hover:text-text-secondary",
              )}
            >
              Complete
            </button>
          </div>
        </div>
      </div>

      <ol className="flex flex-col px-3 py-2">
        {REASONING_STEPS.map((step, index) => {
          const active = running && index === REASONING_STEPS.length - 1;
          const done = !active;
          return (
            <li
              key={step.text}
              aria-current={active ? "step" : undefined}
              className="relative flex gap-2.5 pb-2.5 last:pb-0"
            >
              {index < REASONING_STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute inset-y-1 start-[7px] w-px bg-separator-border"
                />
              )}
              <span
                className={cx(
                  "relative z-10 mt-0.5 flex size-[15px] shrink-0 items-center justify-center rounded-full border",
                  done
                    ? "border-accent-500 bg-accent-500 text-text-white"
                    : "border-accent-500 bg-background-primary-default",
                )}
              >
                {done ? (
                  <RiCheckLine className="size-2.5" aria-hidden />
                ) : (
                  <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-accent-500" />
                )}
                {active && <span className="sr-only">In progress</span>}
              </span>
              <p
                className={cx(
                  "min-w-0 flex-1 text-body-2-regular",
                  active ? "text-text-primary" : "text-text-secondary",
                )}
              >
                {step.text}
              </p>
              <span className="mt-0.5 shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">
                {active ? "—" : `${step.duration.toFixed(1)}s`}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 border-t border-separator-border px-3 py-1.5 text-caption-2-regular text-text-tertiary">
        <span className="flex items-center gap-1">
          <RiTimeLine className="size-3" aria-hidden />
          {running
            ? `${RUNNING_TOTAL.toFixed(1)}s elapsed`
            : `${REASONING_TOTAL.toFixed(1)}s total`}
        </span>
        <span>{running ? "3 of 4 steps complete" : "4 steps · 312 reasoning tokens"}</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Citation chip                                                              */
/* -------------------------------------------------------------------------- */

const SOURCES = [
  {
    number: 1,
    title: "Backpressure in streaming APIs",
    domain: "docs.anthropic.com",
    snippet:
      "Buffer at most one chunk per connection. When the queue is full, pause the producer instead of dropping tokens.",
  },
  {
    number: 2,
    title: "Cancellation and timeouts",
    domain: "nodejs.org",
    snippet:
      "AbortSignal propagation lets a server release a worker as soon as the client disconnects.",
  },
] as const;

export function CitationChip() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const baseId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<Array<HTMLButtonElement | null>>([]);
  useDismiss(wrapperRef, () => setOpenIndex(null), openIndex !== null);

  const closeSource = (restoreFocus: boolean) => {
    const index = openIndex;
    setOpenIndex(null);
    if (restoreFocus && index !== null) chipRefs.current[index]?.focus();
  };

  const source = openIndex !== null ? SOURCES[openIndex] : null;
  const citations = SOURCES.map((item, index) => {
    const expanded = openIndex === index;
    return (
      <span key={item.number}>
        {" "}
        <button
          ref={(node) => {
            chipRefs.current[index] = node;
          }}
          type="button"
          aria-label={`Source ${item.number}: ${item.title}`}
          aria-expanded={expanded}
          aria-controls={expanded ? `${baseId}-source-${item.number}` : undefined}
          onClick={() => setOpenIndex(expanded ? null : index)}
          className={cx(
            "inline-flex h-4 min-w-4 -translate-y-px items-center justify-center rounded-full border px-1 align-middle text-caption-2-semibold tabular-nums transition-colors duration-150 ease",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
            expanded
              ? "border-accent-600 bg-background-primary-default text-accent-600"
              : "border-border-button-default bg-background-secondary-default text-text-secondary hover:border-border-button-hover hover:text-text-primary",
          )}
        >
          {item.number}
        </button>
        {index === 0 ? ", otherwise a slow client can pin the whole worker" : "."}
      </span>
    );
  });

  return (
    <div
      ref={wrapperRef}
      className="relative w-full max-w-[300px] rounded-xl border border-border-button-default bg-background-primary-default p-3 shadow-card"
      onKeyDown={(event) => {
        if (event.key === "Escape" && openIndex !== null) {
          event.stopPropagation();
          closeSource(true);
        }
      }}
    >
      <p className="text-body-2-regular text-text-secondary">
        Streaming responses need backpressure before the first token is flushed{citations}
      </p>

      {source && (
        <div
          id={`${baseId}-source-${source.number}`}
          role="note"
          aria-label={`Source ${source.number}`}
          className="absolute inset-x-2 top-[calc(100%+6px)] z-30 rounded-xl border border-border-button-default bg-background-primary-default p-3 shadow-dropdown"
        >
          <div className="flex items-start gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
              <RiArticleLine className="size-3.5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-body-2-semibold text-text-primary">{source.title}</p>
              <p dir="ltr" className="truncate text-caption-2-regular text-text-tertiary">
                {source.domain}
              </p>
            </div>
            <button
              type="button"
              aria-label="Close source"
              onClick={() => closeSource(true)}
              className="-me-1 flex size-6 shrink-0 items-center justify-center rounded-sm text-foreground-icon-tertiary transition-colors duration-150 ease hover:bg-background-tertiary-default hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              <RiCloseLine className="size-3.5" aria-hidden />
            </button>
          </div>
          <p className="mt-2 text-caption-1-regular text-text-secondary">{source.snippet}</p>
          <div className="mt-2 flex items-center justify-between gap-2 border-t border-separator-border pt-2">
            <span className="text-caption-2-regular text-text-tertiary">Verified 4 Nov 2026</span>
            <button
              type="button"
              aria-label={`Open ${source.title}`}
              className="inline-flex items-center gap-0.5 rounded-sm text-caption-2-semibold text-accent-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              Open
              <RiArrowRightUpLine className="size-3 rtl:-scale-x-100" aria-hidden />
            </button>
          </div>
        </div>
      )}

      <div className="mt-2 flex items-center gap-1.5 border-t border-separator-border pt-2 text-caption-2-regular text-text-tertiary">
        <RiArticleLine className="size-3" aria-hidden />
        2 sources · verified 4 Nov 2026
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const AI_SECTION: ExtendedSection = {
  id: "ai",
  title: "AI",
  blurb: "Prompts, context budgets and the working parts of an agent loop.",
  file: "ai.tsx",
  entries: [
    {
      name: "Prompt Card",
      description: "A saved prompt with its model, token cost and run action.",
      Demo: PromptCard,
    },
    {
      name: "Token Meter",
      description: "A context budget split by system, history and tools.",
      Demo: TokenMeter,
    },
    {
      name: "Model Picker",
      description: "Swap models with context and price in view.",
      Demo: ModelPicker,
    },
    {
      name: "Tool Call Row",
      description: "A collapsible invocation with arguments and result.",
      Demo: ToolCallRow,
      wide: true,
    },
    {
      name: "Citation Chip",
      description: "A numbered source that opens on click.",
      Demo: CitationChip,
    },
    {
      name: "Reasoning Trace",
      description: "Steps, durations and a running or finished total.",
      Demo: ReasoningTrace,
      wide: true,
    },
  ],
};
