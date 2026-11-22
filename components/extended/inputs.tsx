"use client";

import { useId, useState } from "react";
import type { ComponentType } from "react";
import {
  RiAddLine,
  RiArrowDownSLine,
  RiCheckLine,
  RiCloseLine,
  RiCommandLine,
  RiEyeLine,
  RiEyeOffLine,
  RiSearchLine,
  RiSubtractLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* -------------------------------------------------------------------------- */
/*  Shared field anatomy                                                       */
/* -------------------------------------------------------------------------- */

/**
 * The field shell every specimen in this family rides: the same height, radius,
 * quiet tertiary surface and inset ring as `InputBase`, so a composite control
 * sits beside a stock input without a seam.
 */
const shell =
  "flex h-9 w-full items-center gap-2 rounded-2lg bg-background-tertiary-default px-2 " +
  "ring-2 ring-inset ring-transparent transition-[background-color,box-shadow,color] duration-150 ease " +
  "hover:ring-border-button-hover focus-within:ring-border-button-active";

const fieldInput =
  "min-w-0 flex-1 bg-transparent p-0 text-body-regular text-text-primary outline-none " +
  "placeholder:text-text-tertiary disabled:cursor-not-allowed disabled:text-input-disabled-text";

const labelText = "text-body-2-medium text-text-secondary";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

function StepButton({
  icon: Icon,
  label,
  disabled,
  onClick,
}: {
  icon: IconComponent;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        "flex size-7 shrink-0 items-center justify-center rounded-md text-foreground-icon-secondary",
        "transition-[background-color,color] duration-150 ease",
        "hover:bg-background-tertiary-hover hover:text-text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
        "disabled:pointer-events-none disabled:text-foreground-icon-disabled",
      )}
    >
      <Icon className="size-4" aria-hidden />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Number stepper                                                             */
/* -------------------------------------------------------------------------- */

export function NumberStepper({
  label = "Seats",
  hint = "Between 1 and 99",
  min = 1,
  max = 99,
  step = 1,
  defaultValue = 12,
}: {
  label?: string;
  hint?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
}) {
  const id = useId();
  const [value, setValue] = useState(defaultValue);
  const set = (next: number) => setValue(Number.isNaN(next) ? min : Math.min(max, Math.max(min, next)));

  return (
    <div className="flex w-full max-w-[260px] flex-col gap-1">
      <label htmlFor={id} className={labelText}>{label}</label>
      <div className={cx(shell, "justify-between ps-1 pe-1")}>
        <StepButton icon={RiSubtractLine} label={`Decrease ${label}`} disabled={value <= min} onClick={() => set(value - step)} />
        <input
          id={id}
          inputMode="numeric"
          value={value}
          onChange={(event) => set(Number.parseInt(event.target.value, 10))}
          className={cx(fieldInput, "text-center text-body-medium tabular-nums")}
        />
        <StepButton icon={RiAddLine} label={`Increase ${label}`} disabled={value >= max} onClick={() => set(value + step)} />
      </div>
      <span className="text-caption-1-regular text-text-tertiary">{hint}</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Currency field                                                             */
/* -------------------------------------------------------------------------- */

const money = new Intl.NumberFormat("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });

export function CurrencyField({
  label = "Monthly budget",
  currency = "USD",
  symbol = "$",
  defaultValue = 4800,
}: {
  label?: string;
  currency?: string;
  symbol?: string;
  defaultValue?: number;
}) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [raw, setRaw] = useState(String(defaultValue));
  const value = Number.parseFloat(raw);
  const display = Number.isFinite(value) ? (focused ? raw : money.format(value)) : raw;

  return (
    <div className="flex w-full max-w-[260px] flex-col gap-1">
      <label htmlFor={id} className={labelText}>{label}</label>
      <div className={cx(shell, "ps-2.5")}>
        <span aria-hidden className="text-body-regular text-text-tertiary">{symbol}</span>
        <input
          id={id}
          inputMode="decimal"
          value={display}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(event) => setRaw(event.target.value.replace(/[^\d.]/g, ""))}
          className={cx(fieldInput, "tabular-nums")}
        />
        <span className="text-caption-1-semibold tracking-wide text-text-tertiary uppercase">{currency}</span>
      </div>
      <span className="text-caption-1-regular text-text-tertiary">
        {Number.isFinite(value) ? `${money.format(value * 12)} per year` : "Enter an amount"}
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Phone field                                                                */
/* -------------------------------------------------------------------------- */

const DIAL_CODES = ["+1", "+44", "+49", "+33", "+61", "+81"];

export function PhoneField({ label = "Phone number", defaultValue = "415 555 0132" }: { label?: string; defaultValue?: string }) {
  const id = useId();
  const [dial, setDial] = useState("+1");
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="flex w-full max-w-[260px] flex-col gap-1">
      <label htmlFor={id} className={labelText}>{label}</label>
      <div className={cx(shell, "ps-1")}>
        <div className="relative flex items-center">
          <select
            aria-label="Country calling code"
            value={dial}
            onChange={(event) => setDial(event.target.value)}
            className="appearance-none rounded-md bg-background-primary-default py-1.5 ps-2 pe-6 text-body-regular text-text-primary shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            {DIAL_CODES.map((code) => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
          <RiArrowDownSLine aria-hidden className="pointer-events-none absolute end-1.5 size-4 text-foreground-icon-secondary" />
        </div>
        <input
          id={id}
          type="tel"
          dir="ltr"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className={cx(fieldInput, "text-start")}
        />
      </div>
      <span className="text-caption-1-regular text-text-tertiary">We only call about the shoot.</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Password field                                                             */
/* -------------------------------------------------------------------------- */

function scorePassword(value: string) {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score += 1;
  if (value.length >= 12) score += 1;
  if (/[^a-zA-Z0-9]/.test(value)) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  return Math.min(4, score);
}

const STRENGTH = [
  { label: "Too short", className: "bg-status-rose-text", width: "w-1/5" },
  { label: "Weak", className: "bg-status-orange-text", width: "w-2/5" },
  { label: "Fair", className: "bg-status-yellow-text", width: "w-3/5" },
  { label: "Strong", className: "bg-status-lime-text", width: "w-4/5" },
  { label: "Excellent", className: "bg-state-success-base", width: "w-full" },
];

export function PasswordField({ label = "Password", defaultValue = "frontline-26" }: { label?: string; defaultValue?: string }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const score = scorePassword(value);
  const strength = STRENGTH[score];

  return (
    <div className="flex w-full max-w-[260px] flex-col gap-1">
      <label htmlFor={id} className={labelText}>{label}</label>
      <div className={cx(shell, "pe-1")}>
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          autoComplete="new-password"
          onChange={(event) => setValue(event.target.value)}
          className={cx(fieldInput, "font-sans tracking-[0.08em]")}
        />
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onClick={() => setVisible((next) => !next)}
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-foreground-icon-secondary transition-colors duration-150 ease hover:bg-background-tertiary-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          {visible ? <RiEyeOffLine className="size-4" aria-hidden /> : <RiEyeLine className="size-4" aria-hidden />}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-background-tertiary-default" role="presentation">
          <div className={cx("h-full rounded-full transition-[width,background-color] duration-300 ease-out", strength.className, strength.width)} />
        </div>
        <span className="text-caption-1-medium text-text-tertiary">{strength.label}</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Search field                                                               */
/* -------------------------------------------------------------------------- */

export function SearchField({ placeholder = "Search components", shortcut = "⌘K" }: { placeholder?: string; shortcut?: string }) {
  const id = useId();
  const [value, setValue] = useState("");

  return (
    <div className="flex w-full max-w-[280px] flex-col gap-1">
      <div className={cx(shell, "ps-2.5")}>
        <RiSearchLine aria-hidden className="size-4 shrink-0 text-foreground-icon-secondary" />
        <input
          id={id}
          type="search"
          aria-label={placeholder}
          placeholder={placeholder}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className={cx(fieldInput, "[&::-webkit-search-cancel-button]:appearance-none")}
        />
        {value ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => setValue("")}
            className="flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-secondary transition-colors duration-150 ease hover:bg-background-tertiary-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <RiCloseLine className="size-4" aria-hidden />
          </button>
        ) : (
          <kbd className="flex shrink-0 items-center rounded-sm bg-kbd-background px-1 py-0.5 text-caption-2-semibold text-kbd-foreground">
            <RiCommandLine aria-hidden className="size-3" />
            {shortcut.replace("⌘", "")}
          </kbd>
        )}
      </div>
      <span className="text-caption-1-regular text-text-tertiary">Searches names, props and descriptions.</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Tag input                                                                  */
/* -------------------------------------------------------------------------- */

export function TagInput({ label = "Topics", defaultTags = ["design system", "tokens"] }: { label?: string; defaultTags?: string[] }) {
  const id = useId();
  const [tags, setTags] = useState(defaultTags);
  const [draft, setDraft] = useState("");

  const add = () => {
    const next = draft.trim();
    if (!next || tags.includes(next)) return;
    setTags((current) => [...current, next]);
    setDraft("");
  };

  return (
    <div className="flex w-full max-w-[280px] flex-col gap-1">
      <label htmlFor={id} className={labelText}>{label}</label>
      <div className={cx(shell, "h-auto min-h-9 flex-wrap gap-1 px-1.5 py-1")}>
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex h-6 items-center gap-1 rounded-sm bg-background-primary-default px-1.5 text-caption-1-medium text-text-secondary shadow-xs"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() => setTags((current) => current.filter((item) => item !== tag))}
              className="flex size-3.5 items-center justify-center rounded-xs text-foreground-icon-tertiary transition-colors duration-150 ease hover:bg-background-tertiary-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              <RiCloseLine className="size-3" aria-hidden />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          placeholder={tags.length ? "Add another" : "Add a topic"}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              add();
            }
            if (event.key === "Backspace" && !draft) setTags((current) => current.slice(0, -1));
          }}
          onBlur={add}
          className={cx(fieldInput, "h-6 min-w-[88px] flex-1 text-body-2-regular")}
        />
      </div>
      <span className="text-caption-1-regular text-text-tertiary">Press Enter or comma to add.</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Color field                                                                */
/* -------------------------------------------------------------------------- */

export function ColorField({ label = "Accent", defaultValue = "#2440F0" }: { label?: string; defaultValue?: string }) {
  const id = useId();
  const [color, setColor] = useState(defaultValue);
  const [hex, setHex] = useState(defaultValue.replace("#", ""));
  const valid = /^[0-9a-fA-F]{6}$/.test(hex);

  const commit = (next: string) => {
    setColor(next);
    setHex(next.replace("#", "").toUpperCase());
  };

  return (
    <div className="flex w-full max-w-[260px] flex-col gap-1">
      <label htmlFor={id} className={labelText}>{label}</label>
      <div className={cx(shell, "ps-1.5")}>
        <span className="relative size-6 shrink-0 overflow-hidden rounded-sm shadow-xs ring-1 ring-black/10">
          <span aria-hidden className="absolute inset-0" style={{ backgroundColor: valid ? `#${hex}` : color }} />
          <input
            type="color"
            aria-label={`Pick ${label.toLowerCase()} color`}
            value={valid ? `#${hex}` : color}
            onChange={(event) => commit(event.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </span>
        <span aria-hidden className="text-body-regular text-text-tertiary">#</span>
        <input
          id={id}
          value={hex.toUpperCase()}
          spellCheck={false}
          onChange={(event) => setHex(event.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6))}
          className={cx(fieldInput, "font-mono text-body-2-regular tracking-wide uppercase")}
        />
        <span className="flex items-center gap-1 text-caption-1-medium text-text-tertiary">
          <RiCheckLine aria-hidden className="size-3.5" /> AA
        </span>
      </div>
      <span className="text-caption-1-regular text-text-tertiary">4.7:1 on paper, 4.9:1 on ink.</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Time field                                                                 */
/* -------------------------------------------------------------------------- */

export function TimeField({ label = "Call time" }: { label?: string }) {
  const [hour, setHour] = useState("09");
  const [minute, setMinute] = useState("30");
  const [period, setPeriod] = useState<"AM" | "PM">("AM");

  const normalize = (value: string, max: number) => {
    const digits = value.replace(/\D/g, "").slice(0, 2);
    if (!digits) return "00";
    return String(Math.min(max, Math.max(0, Number(digits)))).padStart(2, "0");
  };

  return (
    <div className="flex w-full max-w-[260px] flex-col gap-1">
      <span className={labelText}>{label}</span>
      <div className={cx(shell, "justify-between ps-2.5")}>
        <div className="flex items-center">
          <input
            aria-label="Hour"
            inputMode="numeric"
            value={hour}
            onChange={(event) => setHour(normalize(event.target.value, 12))}
            className={cx(fieldInput, "w-7 flex-none text-center text-body-medium tabular-nums")}
          />
          <span aria-hidden className="px-0.5 text-body-medium text-text-tertiary">:</span>
          <input
            aria-label="Minute"
            inputMode="numeric"
            value={minute}
            onChange={(event) => setMinute(normalize(event.target.value, 59))}
            className={cx(fieldInput, "w-7 flex-none text-center text-body-medium tabular-nums")}
          />
        </div>
        <div className="flex rounded-md bg-background-primary-default p-0.5 shadow-xs" role="group" aria-label="Meridiem">
          {(["AM", "PM"] as const).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={period === option}
              onClick={() => setPeriod(option)}
              className={cx(
                "rounded-sm px-2 py-0.5 text-caption-1-semibold transition-colors duration-150 ease",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                period === option ? "bg-segmented-control-selected-background text-text-primary shadow-xs" : "text-text-tertiary hover:text-text-secondary",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <span className="text-caption-1-regular text-text-tertiary">Local time, GMT+1.</span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const INPUTS_SECTION: ExtendedSection = {
  id: "inputs",
  title: "Inputs",
  blurb: "Fields for numbers, money, secrets and the small stuff forms forget.",
  file: "inputs.tsx",
  entries: [
    { name: "Number Stepper", description: "A bounded count with keyboard-friendly steppers.", Demo: NumberStepper, wide: false },
    { name: "Currency Field", description: "Money with a symbol, a code and a live yearly read.", Demo: CurrencyField },
    { name: "Phone Field", description: "Dial code picker fused to an LTR number field.", Demo: PhoneField },
    { name: "Password Field", description: "Reveal toggle with a measured strength meter.", Demo: PasswordField },
    { name: "Search Field", description: "Search with a shortcut hint and a clear affordance.", Demo: SearchField },
    { name: "Tag Input", description: "Free-form tokens that add on Enter or comma.", Demo: TagInput },
    { name: "Color Field", description: "Swatch, hex value and a contrast verdict in one row.", Demo: ColorField },
    { name: "Time Field", description: "Segmented hour and minute with a meridiem switch.", Demo: TimeField },
  ],
};
