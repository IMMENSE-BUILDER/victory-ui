"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  RiAddLine,
  RiArrowDownLine,
  RiArrowDownSLine,
  RiArrowRightLine,
  RiBracesLine,
  RiCalendarScheduleLine,
  RiCheckLine,
  RiCloseLine,
  RiDatabase2Line,
  RiDeleteBinLine,
  RiEyeLine,
  RiEyeOffLine,
  RiFileList3Line,
  RiFlashlightLine,
  RiFlowChart,
  RiGitBranchLine,
  RiInboxLine,
  RiLoader4Line,
  RiMailSendLine,
  RiPlayLine,
  RiRefreshLine,
  RiSendPlaneLine,
  RiShoppingBag3Line,
  RiShoppingCart2Line,
  RiSlackLine,
  RiStackLine,
  RiSubtractLine,
  RiTerminalBoxLine,
  RiTimeLine,
  RiWebhookLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

type IconComponent = ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const card = "w-full rounded-xl border border-border-button-default bg-background-primary-default shadow-card";
const buttonBase =
  "inline-flex items-center justify-center gap-1.5 rounded-lg text-caption-1-semibold " +
  "transition-[background-color,color,box-shadow,transform] duration-150 ease-out active:scale-[0.98] " +
  "disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none motion-reduce:active:scale-100 " +
  focusRing;
const primaryButton = cx(buttonBase, "h-7 bg-button-primary px-2.5 text-text-white shadow-xs");
const secondaryButton = cx(
  buttonBase,
  "h-7 border border-border-button-default bg-background-primary-default px-2.5 text-text-primary shadow-xs hover:bg-background-primary-hover",
);
const iconButton = cx(
  "flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-tertiary",
  "transition-[background-color,color] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary",
  "motion-reduce:transition-none",
  focusRing,
);
const revealGrid = "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none";
const labelText = "text-caption-2-semibold tracking-wide text-text-tertiary uppercase";
const PILL_TONE = {
  neutral: "bg-background-tertiary-default text-text-secondary",
  lime: "bg-status-lime-background text-status-lime-text",
  rose: "bg-status-rose-background text-status-rose-text",
  cyan: "bg-status-cyan-background text-status-cyan-text",
} as const;

function Pill({ tone = "neutral", children }: { tone?: keyof typeof PILL_TONE; children: ReactNode }) {
  return (
    <span className={cx("inline-flex h-5 shrink-0 items-center gap-1 rounded-full px-1.5 text-caption-2-medium", PILL_TONE[tone])}>
      {children}
    </span>
  );
}

function CardHead({
  icon: Icon,
  title,
  meta,
  className,
}: {
  icon: IconComponent;
  title: string;
  meta?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx("flex items-center gap-1.5", className)}>
      <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
        <Icon className="size-3" aria-hidden />
      </span>
      <h3 className="min-w-0 flex-1 truncate text-caption-1-semibold text-text-primary">{title}</h3>
      {meta}
    </div>
  );
}
type Option = { value: string; label: string };
function MiniSelect({
  label,
  value,
  onChange,
  options,
  disabled,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly Option[];
  disabled?: boolean;
  className?: string;
}) {
  return (
    <span className={cx("relative block min-w-0", className)}>
      <select
        aria-label={label}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={cx(
          "h-7 w-full appearance-none rounded-md border border-border-button-default bg-background-primary-default ps-2 pe-5",
          "text-caption-1-medium text-text-primary shadow-xs outline-none transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
          focusRing,
          disabled && "cursor-not-allowed bg-background-secondary-default text-text-tertiary opacity-70",
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      <RiArrowDownSLine
        aria-hidden
        className="pointer-events-none absolute end-1 top-1/2 size-3.5 -translate-y-1/2 text-foreground-icon-tertiary"
      />
    </span>
  );
}

function MiniInput({
  label,
  value,
  onChange,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <input
      aria-label={label}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className={cx(
        "h-7 min-w-0 rounded-md border border-border-button-default bg-background-primary-default px-2",
        "text-caption-1-medium text-text-primary shadow-xs outline-none placeholder:text-text-placeholder",
        "transition-[background-color,border-color] duration-150 ease-out motion-reduce:transition-none",
        focusRing,
        className,
      )}
    />
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string;
  value: T;
  options: readonly { value: T; label: string; icon?: IconComponent }[];
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div role="group" aria-label={label} className={cx("flex gap-0.5 rounded-lg bg-background-secondary-default p-0.5", className)}>
      {options.map((option) => {
        const Icon = option.icon;
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cx(
              "flex h-6 min-w-0 flex-1 items-center justify-center gap-1 rounded-md px-1.5 text-caption-2-semibold",
              "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
              focusRing,
              active
                ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
                : "text-text-tertiary hover:text-text-secondary",
            )}
          >
            {Icon && <Icon className="size-3" aria-hidden />}
            <span className="truncate">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const FLOW_NODES = [
  { id: "trigger", kind: "Trigger", title: "Order created", detail: "Shopify · online store", icon: RiFlashlightLine, config: "Fires on every paid order from the online store." },
  { id: "condition", kind: "Condition", title: "Total ≥ $250", detail: "Order · subtotal", icon: RiGitBranchLine, config: "Checks the subtotal before tax, using USD." },
  { id: "action", kind: "Action", title: "Post to #fulfilment", detail: "Slack · message", icon: RiSendPlaneLine, config: "Sends the order number, total and owner to Slack." },
] as const;

type FlowId = (typeof FLOW_NODES)[number]["id"];

export function WorkflowCanvas() {
  const [selected, setSelected] = useState<FlowId>("condition");
  const index = FLOW_NODES.findIndex((node) => node.id === selected);
  const node = FLOW_NODES[index];

  return (
    <section aria-label="Order routing workflow" className={cx(card, "max-w-[520px] p-2.5")}>
      <CardHead
        icon={RiFlowChart}
        title="Order routing"
        meta={
          <>
            <span className="hidden text-caption-2-regular text-text-tertiary sm:inline">3 steps</span>
            <Pill tone="lime">
              <span className="size-1.5 rounded-full bg-status-lime-text" aria-hidden />
              Live
            </Pill>
          </>
        }
      />

      <div className="mt-2 rounded-lg border border-separator-border bg-background-secondary-default p-2">
        <div className="flex flex-col items-stretch sm:flex-row" role="group" aria-label="Workflow steps">
          {FLOW_NODES.map((item, position) => {
            const Icon = item.icon;
            const active = item.id === selected;
            return (
              <div key={item.id} className="flex min-w-0 flex-1 flex-col items-stretch sm:flex-row">
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelected(item.id)}
                  className={cx(
                    "flex min-w-0 flex-1 flex-col gap-1 rounded-lg border p-2 text-start",
                    "transition-[background-color,border-color,box-shadow,color] duration-200 ease-out motion-reduce:transition-none",
                    focusRing,
                    active
                      ? "border-accent-500 bg-background-primary-default shadow-xs"
                      : "border-border-button-default bg-background-primary-default hover:bg-background-primary-hover",
                  )}
                >
                  <span className="flex w-full items-center gap-1">
                    <span
                      className={cx(
                        "flex size-5 shrink-0 items-center justify-center rounded-md transition-colors duration-200 motion-reduce:transition-none",
                        active
                          ? "bg-accent-600 text-text-white"
                          : "bg-background-tertiary-default text-foreground-icon-secondary",
                      )}
                    >
                      <Icon className="size-3" aria-hidden />
                    </span>
                    <span className="truncate text-caption-2-semibold tracking-wide text-text-tertiary uppercase">{item.kind}</span>
                    {active && <RiCheckLine className="ms-auto size-3 text-accent-600" aria-hidden />}
                  </span>
                  <span className="w-full truncate text-caption-1-semibold text-text-primary">{item.title}</span>
                  <span className="w-full truncate text-caption-2-regular text-text-tertiary">{item.detail}</span>
                </button>

                {position < FLOW_NODES.length - 1 && (
                  <span
                    aria-hidden
                    className="flex h-4 w-full shrink-0 items-center justify-center gap-0.5 sm:h-auto sm:w-5 sm:flex-col"
                  >
                    <span
                      className={cx(
                        "h-full w-px transition-colors duration-200 motion-reduce:transition-none sm:h-px sm:w-full",
                        index > position ? "bg-accent-500" : "bg-border-button-default",
                      )}
                    />
                    <RiArrowDownLine
                      className={cx(
                        "size-3 shrink-0 transition-colors duration-200 motion-reduce:transition-none sm:hidden",
                        index > position ? "text-accent-600" : "text-foreground-icon-quaternary",
                      )}
                    />
                    <RiArrowRightLine
                      className={cx(
                        "hidden size-3 shrink-0 transition-colors duration-200 motion-reduce:transition-none sm:block rtl:-scale-x-100",
                        index > position ? "text-accent-600" : "text-foreground-icon-quaternary",
                      )}
                    />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5">
        <span
          key={selected}
          aria-live="polite"
          className="line-clamp-2 min-w-0 flex-1 animate-label-in text-caption-2-regular text-text-secondary motion-reduce:animate-none"
        >
          <span className="text-caption-2-semibold text-text-primary">Step {index + 1}:</span> {node.config}
        </span>
        <span className="flex shrink-0 items-center gap-1 text-caption-2-regular text-text-tertiary">
          <RiTimeLine className="size-3" aria-hidden />
          Last run 1.2s
        </span>
      </div>
    </section>
  );
}

const TRIGGERS = [
  { id: "order", short: "Order", name: "Order created", event: "orders/create", source: "Shopify", filter: "Paid orders only", icon: RiShoppingBag3Line },
  { id: "form", short: "Form", name: "Form submitted", event: "form/submitted", source: "Typeform", filter: "Waitlist form", icon: RiFileList3Line },
  { id: "schedule", short: "Schedule", name: "Weekday digest", event: "cron 0 9 * * 1-5", source: "Scheduler", filter: "Weekdays only", icon: RiCalendarScheduleLine },
] as const;

type TriggerId = (typeof TRIGGERS)[number]["id"];

export function TriggerCard() {
  const [triggerId, setTriggerId] = useState<TriggerId>("order");
  const [filtered, setFiltered] = useState(true);
  const trigger = TRIGGERS.find((item) => item.id === triggerId) ?? TRIGGERS[0];

  return (
    <section aria-label="Trigger configuration" className={cx(card, "max-w-[320px] p-2.5")}>
      <CardHead
        icon={RiFlashlightLine}
        title="When this happens"
        meta={
          <Pill tone="lime">
            <span className="size-1.5 animate-pulse rounded-full bg-status-lime-text motion-reduce:animate-none" aria-hidden />
            Listening
          </Pill>
        }
      />

      <Segmented
        label="Trigger type"
        value={triggerId}
        onChange={(next) => {
          setTriggerId(next);
          setFiltered(true);
        }}
        options={TRIGGERS.map((item) => ({ value: item.id, label: item.short, icon: item.icon }))}
        className="mt-2"
      />

      <div key={triggerId} className="mt-1.5 animate-label-in rounded-lg border border-separator-border bg-background-secondary-default px-2 py-1.5 motion-reduce:animate-none">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-caption-1-semibold text-text-primary">{trigger.name}</span>
          <span className="shrink-0 text-caption-2-regular text-text-tertiary">{trigger.source}</span>
        </div>
        <code dir="ltr" className="mt-0.5 block truncate text-start font-mono text-caption-2-medium text-text-secondary">
          {trigger.event}
        </code>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={filtered}
          aria-label={`Apply filter: ${trigger.filter}`}
          onClick={() => setFiltered((current) => !current)}
          className={cx("group flex items-center gap-1.5 rounded-md", focusRing)}
        >
          <span
            className={cx(
              "relative h-3.5 w-6 shrink-0 rounded-full transition-colors duration-200 ease-out motion-reduce:transition-none",
              filtered ? "bg-accent-600" : "bg-background-tertiary-default",
            )}
          >
            <span
              className={cx(
                "absolute top-0.5 size-2.5 rounded-full bg-background-primary-default shadow-xs",
                "transition-[inset-inline-start] duration-200 ease-out motion-reduce:transition-none",
                filtered ? "start-3" : "start-0.5",
              )}
            />
          </span>
          <span className="min-w-0 truncate text-caption-2-medium text-text-secondary group-hover:text-text-primary">
            {trigger.filter}
          </span>
        </button>
        <span className="shrink-0 text-caption-2-regular text-text-tertiary">{filtered ? "Filter on" : "All events"}</span>
      </div>
    </section>
  );
}

const PROVIDERS = [
  { id: "slack", name: "Slack", param: "Channel", value: "#fulfilment", summary: "posts to #fulfilment", icon: RiSlackLine },
  { id: "hubspot", name: "HubSpot", param: "Deal stage", value: "Qualified", summary: "moves the deal to Qualified", icon: RiDatabase2Line },
  { id: "gmail", name: "Gmail", param: "Subject", value: "Your order is on the way", summary: "emails the customer a shipping note", icon: RiMailSendLine },
] as const;

type ProviderId = (typeof PROVIDERS)[number]["id"];

export function ActionRow() {
  const [providerId, setProviderId] = useState<ProviderId>("slack");
  const [value, setValue] = useState<string>(PROVIDERS[0].value);
  const [saved, setSaved] = useState(false);
  const provider = PROVIDERS.find((item) => item.id === providerId) ?? PROVIDERS[0];

  const choose = (next: ProviderId) => {
    setProviderId(next);
    setValue(PROVIDERS.find((item) => item.id === next)?.value ?? "");
    setSaved(false);
  };

  return (
    <section aria-label="Action configuration" className={cx(card, "max-w-[320px] p-2.5")}>
      <CardHead
        icon={RiSendPlaneLine}
        title="Then do this"
        meta={<span className="text-caption-2-regular text-text-tertiary">Step 3 of 3</span>}
      />

      <Segmented
        label="Action provider"
        value={providerId}
        onChange={(next) => choose(next)}
        options={PROVIDERS.map((item) => ({ value: item.id, label: item.name, icon: item.icon }))}
        className="mt-2"
      />

      <div key={providerId} className="mt-2 flex animate-label-in items-end gap-1.5 motion-reduce:animate-none">
        <label className="min-w-0 flex-1">
          <span className="block text-caption-2-medium text-text-tertiary">{provider.param}</span>
          <input
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setSaved(false);
            }}
            className={cx(
              "mt-0.5 h-7 w-full rounded-md border border-border-button-default bg-background-primary-default px-2",
              "text-caption-1-medium text-text-primary shadow-xs outline-none placeholder:text-text-placeholder",
              "transition-[background-color,border-color] duration-150 ease-out motion-reduce:transition-none",
              focusRing,
            )}
          />
        </label>
        <button type="button" onClick={() => setSaved(true)} disabled={saved || value.trim().length === 0} className={cx(primaryButton, "h-7 shrink-0")}>
          {saved ? (
            <>
              <RiCheckLine className="size-3.5" aria-hidden />
              Saved
            </>
          ) : (
            "Save action"
          )}
        </button>
      </div>

      <p aria-live="polite" className="mt-1.5 truncate text-caption-2-regular text-text-tertiary">
        {saved ? (
          <span className="animate-label-in text-status-lime-text motion-reduce:animate-none">Action saved. It {provider.summary}.</span>
        ) : (
          <>This action {provider.summary}.</>
        )}
      </p>
    </section>
  );
}

const CONDITION_FIELDS: Option[] = [
  { value: "total", label: "Order total" }, { value: "weight", label: "Order weight" }, { value: "tag", label: "Customer tag" },
  { value: "country", label: "Shipping country" }, { value: "items", label: "Line items" },
];

const CONDITION_OPERATORS: Option[] = [
  { value: "greater", label: "is greater than" }, { value: "less", label: "is less than" },
  { value: "equals", label: "equals" }, { value: "contains", label: "contains" },
];

type Rule = { id: number; field: string; operator: string; value: string };

const INITIAL_RULES: Rule[] = [
  { id: 1, field: "total", operator: "greater", value: "250" }, { id: 2, field: "tag", operator: "contains", value: "wholesale" },
];

const fieldLabel = (id: string) => CONDITION_FIELDS.find((field) => field.value === id)?.label ?? id;
const operatorLabel = (id: string) => CONDITION_OPERATORS.find((operator) => operator.value === id)?.label ?? id;

export function ConditionBuilder() {
  const nextId = useRef(3);
  const [mode, setMode] = useState<"all" | "any">("all");
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);

  const update = (id: number, patch: Partial<Rule>) =>
    setRules((current) => current.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)));

  const addRule = () => {
    if (rules.length >= 4) return;
    const id = nextId.current;
    nextId.current += 1;
    setRules((current) => [...current, { id, field: "country", operator: "equals", value: "US" }]);
  };

  const removeRule = (id: number) => setRules((current) => (current.length > 1 ? current.filter((rule) => rule.id !== id) : current));

  const summary = rules
    .map((rule) => `${fieldLabel(rule.field)} ${operatorLabel(rule.operator)} ${rule.value || "…"}`)
    .join(mode === "all" ? " and " : " or ");

  return (
    <section aria-label="Condition builder" className={cx(card, "max-w-[500px] p-2.5")}>
      <div className="flex items-center gap-2">
        <CardHead
          icon={RiGitBranchLine}
          title="Only continue if"
          meta={<span className="text-caption-2-regular text-text-tertiary">{rules.length} of 4 rules</span>}
          className="min-w-0 flex-1"
        />
        <Segmented
          label="Match mode"
          value={mode}
          onChange={setMode}
          options={[
            { value: "all", label: "All" },
            { value: "any", label: "Any" },
          ]}
          className="w-24 shrink-0"
        />
      </div>

      <ul className="mt-1.5 flex flex-col gap-1">
        {rules.map((rule, position) => (
          <li key={rule.id} className="flex animate-label-in items-center gap-1 motion-reduce:animate-none">
            <MiniSelect
              label={`Field for rule ${position + 1}`}
              value={rule.field}
              onChange={(field) => update(rule.id, { field })}
              options={CONDITION_FIELDS}
              className="flex-[1.2]"
            />
            <MiniSelect
              label={`Operator for rule ${position + 1}`}
              value={rule.operator}
              onChange={(operator) => update(rule.id, { operator })}
              options={CONDITION_OPERATORS}
              className="flex-1"
            />
            <MiniInput
              label={`Value for rule ${position + 1}`}
              value={rule.value}
              onChange={(value) => update(rule.id, { value })}
              placeholder="Value"
              className="w-14 shrink-0"
            />
            <button
              type="button"
              aria-label={`Remove rule ${position + 1}`}
              disabled={rules.length === 1}
              onClick={() => removeRule(rule.id)}
              className={cx(
                "flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-tertiary",
                "transition-[background-color,color,opacity] duration-150 ease-out hover:bg-background-tertiary-default hover:text-text-primary",
                "disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none",
                focusRing,
              )}
            >
              <RiDeleteBinLine className="size-3.5" aria-hidden />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={addRule}
          disabled={rules.length >= 4}
          className={cx(
            "inline-flex h-6 items-center gap-1 rounded-md px-1.5 text-caption-2-semibold text-text-secondary",
            "transition-[background-color,color,opacity] duration-150 ease-out hover:bg-background-secondary-default hover:text-text-primary",
            "disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none",
            focusRing,
          )}
        >
          <RiAddLine className="size-3.5" aria-hidden />
          Add condition
        </button>
        <span className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">{rules.length}/4</span>
      </div>

      <p
        aria-live="polite"
        title={summary}
        className="mt-1.5 truncate rounded-md bg-background-secondary-default px-2 py-1 text-caption-2-regular text-text-secondary"
      >
        <span className="text-caption-2-semibold text-text-primary">Runs when {mode === "all" ? "all" : "any"}:</span> {summary}
      </p>
    </section>
  );
}

type RunStatus = "success" | "failed" | "running";

type Run = { id: string; name: string; status: RunStatus; time: string; duration: string; error?: string; step?: string };

const RUNS: Run[] = [
  { id: "run-1", name: "Order routing", status: "success", time: "09:42", duration: "1.2s" },
  { id: "run-2", name: "Refund alerts", status: "failed", time: "08:58", duration: "2.4s", error: "Slack returned 429 rate_limit_exceeded. The retry at 09:03 also failed.", step: "Step 3 · Post to #support" },
  { id: "run-3", name: "Daily digest", status: "running", time: "08:40", duration: "12s" },
];

const RUN_META = {
  success: { icon: RiCheckLine, tone: "bg-status-lime-background text-status-lime-text", spin: false },
  failed: { icon: RiCloseLine, tone: "bg-status-rose-background text-status-rose-text", spin: false },
  running: { icon: RiLoader4Line, tone: "bg-status-cyan-background text-status-cyan-text", spin: true },
} as const;

function RunStatusIcon({ status }: { status: RunStatus }) {
  const meta = RUN_META[status];
  const Icon = meta.icon;
  return (
    <span className={cx("flex size-4 shrink-0 items-center justify-center rounded-full", meta.tone)}>
      <Icon className={cx("size-3", meta.spin && "animate-spin motion-reduce:animate-none")} aria-hidden />
    </span>
  );
}

export function RunHistory() {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);
  const [retried, setRetried] = useState(false);

  return (
    <section aria-label="Run history" className={cx(card, "max-w-[500px] p-2.5")}>
      <CardHead
        icon={RiTimeLine}
        title="Run history"
        meta={
          <span className="text-caption-2-regular text-text-tertiary">
            <span className="text-status-lime-text">1 succeeded</span> · <span className="text-status-rose-text">1 failed</span>
          </span>
        }
      />

      <ul className="mt-1.5 flex flex-col">
        {RUNS.map((run) => {
          const open = openId === run.id;
          const row = (
            <>
              <RunStatusIcon status={run.status} />
              <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">{run.name}</span>
              <span className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">{run.time}</span>
              <span
                className={cx(
                  "w-10 shrink-0 text-end text-caption-2-medium tabular-nums",
                  run.status === "failed" ? "text-status-rose-text" : "text-text-secondary",
                )}
              >
                {run.duration}
              </span>
              {run.error ? (
                <RiArrowDownSLine
                  className={cx(
                    "size-3.5 shrink-0 text-foreground-icon-tertiary transition-transform duration-200 ease-out motion-reduce:transition-none",
                    open && "rotate-180",
                  )}
                  aria-hidden
                />
              ) : (
                <span className="size-3.5 shrink-0" aria-hidden />
              )}
            </>
          );

          return (
            <li key={run.id} className="border-b border-separator-border last:border-b-0">
              {run.error ? (
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`${baseId}-${run.id}`}
                  onClick={() => setOpenId(open ? null : run.id)}
                  className={cx(
                    "flex min-h-7 w-full items-center gap-1.5 rounded-md px-1 text-start transition-colors duration-150 ease-out hover:bg-background-secondary-default motion-reduce:transition-none",
                    focusRing,
                    open && "bg-background-secondary-default",
                  )}
                >
                  {row}
                </button>
              ) : (
                <div className="flex min-h-7 items-center gap-1.5 px-1">{row}</div>
              )}

              {run.error && (
                <div
                  id={`${baseId}-${run.id}`}
                  inert={!open}
                  className={cx(revealGrid, open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="mb-1.5 ms-5 border-s-2 border-border-error-default bg-background-secondary-default px-2 py-1.5">
                      <p className="text-caption-2-semibold text-text-primary">{run.step}</p>
                      <p className="mt-0.5 text-caption-2-regular text-text-secondary">{run.error}</p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <code dir="ltr" className="truncate text-start font-mono text-caption-2-regular text-text-tertiary">
                          err_429_slack
                        </code>
                        <button
                          type="button"
                          disabled={retried}
                          onClick={() => setRetried(true)}
                          className={cx(
                            "inline-flex h-6 shrink-0 items-center gap-1 rounded-md px-1.5 text-caption-2-semibold",
                            "text-accent-600 transition-colors duration-150 ease-out hover:bg-background-tertiary-default motion-reduce:transition-none",
                            "disabled:pointer-events-none disabled:text-status-lime-text",
                            focusRing,
                          )}
                        >
                          {retried ? <RiCheckLine className="size-3" aria-hidden /> : <RiRefreshLine className="size-3" aria-hidden />}
                          {retried ? "Retry queued" : "Retry run"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const CADENCES = [
  { id: "daily", label: "Daily" }, { id: "weekday", label: "Weekdays" }, { id: "weekly", label: "Weekly" },
] as const;

const WEEKDAYS: Option[] = [
  { value: "monday", label: "Monday" }, { value: "tuesday", label: "Tuesday" }, { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" }, { value: "friday", label: "Friday" },
];

const TIMES: Option[] = [
  { value: "07:00", label: "7:00 AM" }, { value: "09:00", label: "9:00 AM" },
  { value: "12:30", label: "12:30 PM" }, { value: "17:00", label: "5:00 PM" },
];

type Cadence = (typeof CADENCES)[number]["id"];

export function SchedulePicker() {
  const [cadence, setCadence] = useState<Cadence>("weekly");
  const [day, setDay] = useState("monday");
  const [time, setTime] = useState("09:00");

  const timeLabel = TIMES.find((option) => option.value === time)?.label ?? "9:00 AM";
  const dayOptions: Option[] =
    cadence === "weekly" ? WEEKDAYS : [{ value: cadence, label: cadence === "daily" ? "Every day" : "Monday to Friday" }];
  const dayValue = cadence === "weekly" ? day : cadence;
  const cadenceLabel =
    cadence === "daily"
      ? "Every day"
      : cadence === "weekday"
        ? "Every weekday"
        : `Every ${WEEKDAYS.find((option) => option.value === day)?.label ?? "Monday"}`;

  return (
    <section aria-label="Schedule picker" className={cx(card, "max-w-[320px] p-2.5")}>
      <CardHead icon={RiCalendarScheduleLine} title="Schedule" meta={<span className="text-caption-2-regular text-text-tertiary">GMT+1</span>} />

      <Segmented
        label="Cadence"
        value={cadence}
        onChange={(next) => setCadence(next)}
        options={CADENCES.map((item) => ({ value: item.id, label: item.label }))}
        className="mt-2"
      />

      <div className="mt-1.5 flex items-end gap-1.5">
        <div className="min-w-0 flex-1">
          <span className="block text-caption-2-medium text-text-tertiary">Day</span>
          <MiniSelect label="Day of week" value={dayValue} onChange={setDay} options={dayOptions} disabled={cadence !== "weekly"} className="mt-0.5" />
        </div>
        <div className="w-[104px] shrink-0">
          <span className="block text-caption-2-medium text-text-tertiary">Time</span>
          <MiniSelect label="Time of day" value={time} onChange={setTime} options={TIMES} className="mt-0.5" />
        </div>
      </div>

      <p
        key={`${cadence}-${day}-${time}`}
        aria-live="polite"
        className="mt-2 animate-label-in rounded-md bg-background-secondary-default px-2 py-1.5 text-caption-1-medium text-text-primary motion-reduce:animate-none"
      >
        {cadenceLabel} at {timeLabel}.
        <span className="ms-1 text-caption-2-regular text-text-tertiary">Europe/London · pauses on bank holidays.</span>
      </p>
    </section>
  );
}

const VARIABLES = [
  { token: "{{customer.name}}", label: "Customer name", value: "Maya Chen" },
  { token: "{{order.id}}", label: "Order number", value: "#1042" },
  { token: "{{order.tracking_url}}", label: "Tracking URL", value: "https://northline.co/t/9F2K" },
] as const;

export function VariableChip() {
  const menuId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("Your order is on the way.");

  const resolved = VARIABLES.reduce((text, variable) => text.split(variable.token).join(variable.value), draft);
  const usesVariable = VARIABLES.some((variable) => draft.includes(variable.token));
  const insert = (token: string) => {
    setDraft((current) => `${current}${current && !current.endsWith(" ") ? " " : ""}${token}`);
    setOpen(false);
    window.requestAnimationFrame(() => inputRef.current?.focus());
  };
  const dismiss = () => { setOpen(false); window.requestAnimationFrame(() => triggerRef.current?.focus()); };

  return (
    <div
      className="w-full max-w-[320px]"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation();
          dismiss();
        }
      }}
    >
      <section aria-label="Variable picker" className={cx(card, "p-2.5")}>
        <CardHead icon={RiBracesLine} title="Insert variable" meta={<span className="text-caption-2-regular text-text-tertiary">Email step</span>} />

        <div className="relative mt-2">
          <label htmlFor={menuId} className="block text-caption-2-medium text-text-tertiary">Message</label>
          <span className="mt-0.5 flex h-7 items-center rounded-md border border-border-button-default bg-background-primary-default shadow-xs focus-within:ring-2 focus-within:ring-border-focus-ring">
            <input
              ref={inputRef}
              id={menuId}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              className="min-w-0 flex-1 bg-transparent px-2 text-caption-1-medium text-text-primary outline-none placeholder:text-text-placeholder"
            />
            <button
              ref={triggerRef}
              type="button"
              aria-label="Insert variable"
              aria-expanded={open}
              aria-controls={`${menuId}-menu`}
              onClick={() => setOpen((current) => !current)}
              className={cx(
                "me-0.5 flex h-6 shrink-0 items-center gap-1 rounded-sm px-1.5 text-caption-2-semibold",
                "text-accent-600 transition-[background-color,color] duration-150 ease-out hover:bg-background-secondary-default motion-reduce:transition-none",
                focusRing,
                open && "bg-background-secondary-default",
              )}
            >
              <RiBracesLine className="size-3.5" aria-hidden />
              {open ? "Close" : "Variable"}
            </button>
          </span>

          {open && (
            <>
              <button
                type="button"
                tabIndex={-1}
                aria-label="Close variable menu"
                onClick={dismiss}
                className="fixed inset-0 z-10 cursor-default"
              />
              <div
                id={`${menuId}-menu`}
                role="menu"
                aria-label="Variables"
                className="absolute inset-x-0 top-full z-20 mt-1 origin-top animate-label-in rounded-lg border border-border-button-default bg-background-primary-default p-1 shadow-dropdown motion-reduce:animate-none"
              >
                {VARIABLES.map((variable) => (
                  <button
                    key={variable.token}
                    type="button"
                    role="menuitem"
                    onClick={() => insert(variable.token)}
                    className={cx(
                      "flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-start",
                      "transition-colors duration-150 ease-out hover:bg-background-secondary-default motion-reduce:transition-none",
                      focusRing,
                    )}
                  >
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-sm bg-background-tertiary-default text-accent-600">
                      <RiBracesLine className="size-3" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-caption-2-semibold text-text-primary">{variable.label}</span>
                      <span dir="ltr" className="block truncate text-start font-mono text-caption-2-regular text-text-tertiary">{variable.token}</span>
                    </span>
                    <RiAddLine className="size-3 shrink-0 text-foreground-icon-tertiary" aria-hidden />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <p className="mt-1.5 min-h-8 rounded-md bg-background-secondary-default px-2 py-1 text-caption-2-regular text-text-secondary" aria-live="polite">
          <span className="text-caption-2-semibold text-text-tertiary">Preview </span>
          <span dir="auto" className="break-words text-text-primary">{resolved}</span>
          {!usesVariable && <span className="ms-1 text-text-tertiary">· plain text</span>}
        </p>
      </section>
    </div>
  );
}

const TEST_STEPS = [
  { label: "Trigger received", detail: "orders/create · order #1042" }, { label: "Condition passed", detail: "total 312.00 ≥ 250" },
  { label: "Slack message sent", detail: "#fulfilment · 240ms" },
] as const;

const TEST_PAYLOAD = [
  '"event": "orders/create",', '"order": "#1042",', '"total": 312.00,', '"customer": "maya@northline.co"',
] as const;

type TestPhase = "idle" | "running" | "done";

export function TestRun() {
  const [phase, setPhase] = useState<TestPhase>("idle");
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (phase !== "running") return;
    const timer = window.setTimeout(() => {
      if (step >= TEST_STEPS.length - 1) setPhase("done");
      else setStep((current) => current + 1);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [phase, step]);

  const start = () => {
    setStep(0);
    setPhase("running");
  };

  const progress = phase === "done" ? 100 : phase === "running" ? ((step + 1) / TEST_STEPS.length) * 100 : 0;

  return (
    <section aria-label="Test run" className={cx(card, "max-w-[520px] p-2.5")}>
      <CardHead icon={RiTerminalBoxLine} title="Test run" meta={<Pill tone="neutral">Sample order #1042</Pill>} />

      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-separator-border bg-background-secondary-default p-2">
          <p className={labelText}>Sample payload</p>
          <code dir="ltr" className="mt-1 block text-start font-mono text-caption-2-regular leading-4 text-text-secondary">
            {TEST_PAYLOAD.map((line) => (
              <span key={line} className="block truncate">{line}</span>
            ))}
          </code>
        </div>

        <ol className="flex flex-col justify-center gap-1" aria-live="polite">
          {TEST_STEPS.map((item, position) => {
            const complete = phase === "done" || position < step;
            const active = phase === "running" && position === step;
            return (
              <li
                key={item.label}
                className={cx(
                  "flex items-center gap-1.5 rounded-md px-1 py-0.5 transition-colors duration-200 ease-out motion-reduce:transition-none",
                  active && "bg-background-secondary-default",
                )}
              >
                {complete ? (
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-status-lime-background text-status-lime-text">
                    <RiCheckLine className="size-3" aria-hidden />
                  </span>
                ) : active ? (
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-status-cyan-background text-status-cyan-text">
                    <RiLoader4Line className="size-3 animate-spin motion-reduce:animate-none" aria-hidden />
                  </span>
                ) : (
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-full border border-border-button-default text-caption-2-semibold text-text-tertiary tabular-nums">
                    {position + 1}
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span
                    className={cx(
                      "block truncate text-caption-2-semibold transition-colors duration-200 motion-reduce:transition-none",
                      active || complete ? "text-text-primary" : "text-text-tertiary",
                    )}
                  >
                    {item.label}
                  </span>
                  <span className="block truncate text-caption-2-regular text-text-tertiary">{item.detail}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div
        role="progressbar"
        aria-label="Test progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
        className="mt-2 h-1 overflow-hidden rounded-full bg-background-tertiary-default"
      >
        <div
          className="h-full rounded-full bg-accent-500 transition-[width] duration-200 ease-out motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <span
          role="status"
          className={cx(
            "min-w-0 truncate text-caption-2-regular transition-colors duration-200 motion-reduce:transition-none",
            phase === "done" ? "text-status-lime-text" : "text-text-tertiary",
          )}
        >
          {phase === "done"
            ? "Test passed · 3 steps · 1.1s"
            : phase === "running"
              ? `Running step ${step + 1} of ${TEST_STEPS.length}…`
              : "Ready to run with the last order."}
        </span>
        <button type="button" onClick={start} disabled={phase === "running"} className={cx(phase === "done" ? secondaryButton : primaryButton, "h-7 shrink-0")}>
          {phase === "done" ? (
            <>
              <RiRefreshLine className="size-3.5" aria-hidden />
              Run again
            </>
          ) : phase === "running" ? (
            <>
              <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
              Running
            </>
          ) : (
            <>
              <RiPlayLine className="size-3.5" aria-hidden />
              Run test
            </>
          )}
        </button>
      </div>
    </section>
  );
}

export function BranchNode() {
  const [testValue, setTestValue] = useState<"312" | "48">("312");
  const matches = testValue === "312";

  const branches = [
    { id: "yes", label: "If yes", title: "Priority queue", detail: "#priority · 2 min SLA", active: matches, icon: RiCheckLine },
    { id: "no", label: "If no", title: "Standard queue", detail: "#support · 1 day SLA", active: !matches, icon: RiArrowRightLine },
  ] as const;

  return (
    <section aria-label="Branch node" className={cx(card, "max-w-[320px] p-2.5")}>
      <CardHead icon={RiGitBranchLine} title="Branch" meta={<span className="text-caption-2-regular text-text-tertiary">2 paths</span>} />

      <div className="mt-2 rounded-lg border border-border-button-default bg-background-secondary-default px-2 py-1.5">
        <p className="text-caption-2-semibold text-text-tertiary">If</p>
        <p className="mt-0.5 truncate text-caption-1-semibold text-text-primary">
          Order total <span className="font-mono text-caption-2-medium text-accent-600">≥</span> $250.00
        </p>
      </div>

      <div className="relative mt-3 grid grid-cols-2 gap-2">
        <span aria-hidden className="pointer-events-none absolute -top-2 inset-x-1/4 h-2 rounded-t border-x border-t border-border-button-default" />
        <span aria-hidden className="pointer-events-none absolute -top-3 start-1/2 h-1 w-px bg-border-button-default" />

        {branches.map((branch) => {
          const Icon = branch.icon;
          return (
            <div
              key={branch.id}
              className={cx(
                "rounded-lg border p-1.5 transition-[background-color,border-color,box-shadow,opacity] duration-200 ease-out motion-reduce:transition-none",
                branch.active
                  ? "border-accent-500 bg-background-primary-default shadow-xs opacity-100"
                  : "border-border-button-default bg-background-primary-default opacity-70",
              )}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="truncate text-caption-2-semibold tracking-wide text-text-tertiary uppercase">{branch.label}</span>
                {branch.active ? (
                  <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-accent-600 text-text-white">
                    <RiCheckLine className="size-2.5" aria-hidden />
                  </span>
                ) : (
                  <Icon className="size-3 shrink-0 text-foreground-icon-quaternary rtl:-scale-x-100" aria-hidden />
                )}
              </div>
              <p className="mt-0.5 truncate text-caption-1-semibold text-text-primary">{branch.title}</p>
              <p className="truncate text-caption-2-regular text-text-tertiary">{branch.detail}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-1.5 flex items-center gap-1.5">
        <span className="shrink-0 text-caption-2-medium text-text-tertiary">Test with</span>
        <Segmented
          label="Test order total"
          value={testValue}
          onChange={setTestValue}
          options={[
            { value: "312", label: "$312" },
            { value: "48", label: "$48" },
          ]}
          className="w-28"
        />
        <span aria-live="polite" className="min-w-0 flex-1 truncate text-end text-caption-2-regular text-text-tertiary">
          {matches ? "Yes path runs." : "No path runs."}
        </span>
      </div>
    </section>
  );
}

const TEMPLATES = [
  { id: "cart", name: "Abandoned cart", detail: "Wait 1h · email · 10% coupon", runs: "1,284 runs", icon: RiShoppingCart2Line },
  { id: "triage", name: "Support triage", detail: "Form · priority · Slack alert", runs: "862 runs", icon: RiInboxLine },
  { id: "digest", name: "Friday digest", detail: "Every Friday at 4:00 PM", runs: "431 runs", icon: RiCalendarScheduleLine },
] as const;

type TemplateId = (typeof TEMPLATES)[number]["id"];

export function TemplatePicker() {
  const [usedId, setUsedId] = useState<TemplateId | null>(null);
  const used = TEMPLATES.find((template) => template.id === usedId);

  return (
    <section aria-label="Automation templates" className={cx(card, "max-w-[320px] p-2.5")}>
      <CardHead icon={RiStackLine} title="Start from a template" meta={<span className="text-caption-2-regular text-text-tertiary">3 templates</span>} />

      <ul className="mt-1.5 flex flex-col">
        {TEMPLATES.map((template) => {
          const Icon = template.icon;
          const isUsed = template.id === usedId;
          return (
            <li key={template.id} className="flex items-center gap-1.5 border-b border-separator-border py-1 last:border-b-0">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
                <Icon className="size-3.5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-caption-2-semibold text-text-primary">{template.name}</span>
                <span className="block truncate text-caption-2-regular text-text-tertiary">{template.detail}</span>
              </span>
              <button
                type="button"
                aria-label={`Use ${template.name} template`}
                aria-pressed={isUsed}
                onClick={() => setUsedId(isUsed ? null : template.id)}
                className={cx(
                  "flex h-6 shrink-0 items-center gap-1 rounded-md px-1.5 text-caption-2-semibold",
                  "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                  isUsed
                    ? "bg-status-lime-background text-status-lime-text"
                    : "border border-border-button-default bg-background-primary-default text-text-secondary shadow-xs hover:bg-background-primary-hover hover:text-text-primary",
                  focusRing,
                )}
              >
                {isUsed ? <RiCheckLine className="size-3" aria-hidden /> : <RiAddLine className="size-3" aria-hidden />}
                {isUsed ? "Added" : "Use"}
              </button>
            </li>
          );
        })}
      </ul>

      <p aria-live="polite" className="mt-1.5 rounded-md bg-background-secondary-default px-2 py-1 text-caption-2-regular text-text-secondary">
        {used ? (
          <span className="animate-label-in block truncate motion-reduce:animate-none">
            <span className="text-caption-2-semibold text-status-lime-text">Added:</span> {used.name} · {used.runs} so far.
          </span>
        ) : (
          "Templates arrive paused. Nothing sends until you turn it on."
        )}
      </p>
    </section>
  );
}

const RETRY_POLICIES = [
  { id: "exponential", label: "Exponential", waits: ["30s", "2m", "8m", "32m"], note: "Each wait quadruples." },
  { id: "linear", label: "Linear", waits: ["2m", "4m", "6m", "8m"], note: "Adds two minutes each time." }, { id: "fixed", label: "Fixed", waits: ["5m", "5m", "5m", "5m"], note: "Waits five minutes every time." },
] as const;

type RetryPolicy = (typeof RETRY_POLICIES)[number];

export function FailureRetry() {
  const [policyId, setPolicyId] = useState<RetryPolicy["id"]>("exponential");
  const [attempts, setAttempts] = useState(3);
  const policy = RETRY_POLICIES.find((item) => item.id === policyId) ?? RETRY_POLICIES[0];
  const waits = policy.waits.slice(0, attempts - 1);

  const stepperButton = cx(
    "flex size-5 items-center justify-center rounded-sm text-foreground-icon-secondary",
    "transition-[background-color,color,opacity] duration-150 ease-out hover:bg-background-secondary-default motion-reduce:transition-none",
    "disabled:pointer-events-none disabled:opacity-40",
    focusRing,
  );

  return (
    <section aria-label="Failure retry policy" className={cx(card, "max-w-[320px] p-2.5")}>
      <CardHead icon={RiRefreshLine} title="If a step fails" meta={<span className="text-caption-2-regular text-text-tertiary">Retry policy</span>} />

      <Segmented
        label="Retry policy"
        value={policyId}
        onChange={(next) => setPolicyId(next)}
        options={RETRY_POLICIES.map((item) => ({ value: item.id, label: item.label }))}
        className="mt-2"
      />

      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-caption-2-medium text-text-tertiary">Attempts</span>
        <div className="flex items-center gap-0.5 rounded-md border border-border-button-default bg-background-primary-default p-0.5 shadow-xs">
          <button type="button" aria-label="Fewer attempts" disabled={attempts <= 2} onClick={() => setAttempts((current) => Math.max(2, current - 1))} className={stepperButton}>
            <RiSubtractLine className="size-3" aria-hidden />
          </button>
          <span className="w-4 text-center text-caption-1-semibold text-text-primary tabular-nums">{attempts}</span>
          <button type="button" aria-label="More attempts" disabled={attempts >= 5} onClick={() => setAttempts((current) => Math.min(5, current + 1))} className={stepperButton}>
            <RiAddLine className="size-3" aria-hidden />
          </button>
        </div>
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-1" aria-live="polite">
        {waits.map((wait, position) => (
          <span key={`${policyId}-${wait}-${position}`} className="flex items-center gap-1">
            {position > 0 && <RiArrowRightLine className="size-2.5 text-foreground-icon-quaternary rtl:-scale-x-100" aria-hidden />}
            <span className="inline-flex h-5 animate-label-in items-center rounded-full bg-background-tertiary-default px-1.5 text-caption-2-medium text-text-secondary motion-reduce:animate-none">
              {wait}
            </span>
          </span>
        ))}
        <span className="ms-auto text-caption-2-regular text-text-tertiary">
          {waits.length} retr{waits.length === 1 ? "y" : "ies"}
        </span>
      </div>

      <p className="mt-1.5 truncate text-caption-2-regular text-text-tertiary">
        {policy.note} Stops after {attempts} attempts.
      </p>
    </section>
  );
}

type Delivery = "idle" | "sending" | "sent";

export function WebhookStep() {
  const endpointId = useId();
  const secretId = useId();
  const [endpoint, setEndpoint] = useState("https://hooks.northline.co/v1/orders");
  const [secret, setSecret] = useState("whsec_7d41c9e2a4f8");
  const [revealed, setRevealed] = useState(false);
  const [delivery, setDelivery] = useState<Delivery>("idle");

  useEffect(() => {
    if (delivery !== "sending") return;
    const timer = window.setTimeout(() => setDelivery("sent"), 900);
    return () => window.clearTimeout(timer);
  }, [delivery]);

  const edit = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setDelivery("idle");
  };

  return (
    <section aria-label="Webhook step" className={cx(card, "max-w-[320px] p-2.5")}>
      <CardHead icon={RiWebhookLine} title="Send a webhook" meta={<Pill tone="neutral">POST</Pill>} />

      <label htmlFor={endpointId} className="mt-2 block">
        <span className="block text-caption-2-medium text-text-tertiary">Endpoint</span>
        <input
          id={endpointId}
          dir="ltr"
          value={endpoint}
          onChange={(event) => edit(setEndpoint)(event.target.value)}
          className={cx(
            "mt-0.5 h-7 w-full rounded-md border border-border-button-default bg-background-primary-default px-2",
            "text-start font-mono text-caption-2-medium text-text-primary shadow-xs outline-none placeholder:text-text-placeholder",
            "transition-[background-color,border-color] duration-150 ease-out motion-reduce:transition-none",
            focusRing,
          )}
        />
      </label>

      <div className="mt-1.5">
        <label htmlFor={secretId} className="block text-caption-2-medium text-text-tertiary">Signing secret</label>
        <span className="mt-0.5 flex h-7 items-center rounded-md border border-border-button-default bg-background-primary-default shadow-xs focus-within:ring-2 focus-within:ring-border-focus-ring">
          <input
            id={secretId}
            dir="ltr"
            type={revealed ? "text" : "password"}
            value={secret}
            autoComplete="off"
            onChange={(event) => edit(setSecret)(event.target.value)}
            className="min-w-0 flex-1 bg-transparent px-2 text-start font-mono text-caption-2-medium text-text-primary outline-none"
          />
          <button
            type="button"
            aria-label={revealed ? "Hide signing secret" : "Show signing secret"}
            aria-pressed={revealed}
            onClick={() => setRevealed((current) => !current)}
            className={cx(iconButton, "me-0.5")}
          >
            {revealed ? <RiEyeOffLine className="size-3.5" aria-hidden /> : <RiEyeLine className="size-3.5" aria-hidden />}
          </button>
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span
          role="status"
          className={cx(
            "min-w-0 truncate text-caption-2-regular transition-colors duration-200 ease-out motion-reduce:transition-none",
            delivery === "sent" ? "text-status-lime-text" : "text-text-tertiary",
          )}
        >
          {delivery === "sending"
            ? "Waiting for 200…"
            : delivery === "sent"
              ? "200 OK · 240 ms · delivery 8c1f"
              : "Signed with HMAC-SHA256."}
        </span>
        <button
          type="button"
          onClick={() => setDelivery("sending")}
          disabled={delivery === "sending" || endpoint.trim().length === 0}
          className={cx(primaryButton, "h-7 shrink-0")}
        >
          {delivery === "sending" ? (
            <>
              <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
              Sending
            </>
          ) : delivery === "sent" ? (
            <>
              <RiCheckLine className="size-3.5" aria-hidden />
              Sent
            </>
          ) : (
            <>
              <RiSendPlaneLine className="size-3.5" aria-hidden />
              Send test
            </>
          )}
        </button>
      </div>
    </section>
  );
}

export const AUTOMATION_SECTION: ExtendedSection = {
  id: "automation",
  title: "Automation",
  blurb: "Triggers, branches and runs that explain themselves.",
  file: "automation.tsx",
  entries: [
    { name: "Workflow Canvas", description: "Three connected steps; select one and the path lights up.", Demo: WorkflowCanvas, wide: true },
    { name: "Trigger Card", description: "Pick a trigger, see its event and filter, and arm it.", Demo: TriggerCard },
    { name: "Action Row", description: "Choose a provider, set its parameter and save the action.", Demo: ActionRow },
    { name: "Condition Builder", description: "All or any rules, added and removed, with a live summary.", Demo: ConditionBuilder, wide: true },
    { name: "Run History", description: "Runs with status and duration; a failed run opens its error.", Demo: RunHistory, wide: true },
    { name: "Schedule Picker", description: "Cadence, day and time, read back as one sentence.", Demo: SchedulePicker },
    { name: "Variable Chip", description: "Insert a merge variable from a menu and preview it resolved.", Demo: VariableChip },
    { name: "Test Run", description: "Run a sample payload and watch each step resolve.", Demo: TestRun, wide: true },
    { name: "Branch Node", description: "An if/else split that highlights the path a value takes.", Demo: BranchNode },
    { name: "Template Picker", description: "Three automations to start from, with a one-tap use action.", Demo: TemplatePicker },
    { name: "Failure Retry", description: "Policy, attempt count and the backoff waits they produce.", Demo: FailureRetry },
    { name: "Webhook Step", description: "Endpoint, signing secret and a test delivery that returns 200.", Demo: WebhookStep },
  ],
};
