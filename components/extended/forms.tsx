"use client";

import { useEffect, useId, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  RiArrowDownSLine,
  RiArrowRightLine,
  RiCheckLine,
  RiCloseLine,
  RiCommandLine,
  RiCornerDownLeftLine,
  RiErrorWarningLine,
  RiLoader4Line,
  RiLockLine,
  RiMailLine,
  RiPencilLine,
  RiSaveLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* -------------------------------------------------------------------------- */
/*  Shared field anatomy                                                       */
/* -------------------------------------------------------------------------- */

const controlShell =
  "flex h-9 w-full items-center gap-2 rounded-2lg bg-background-tertiary-default px-2 ring-2 ring-inset ring-transparent transition-[background-color,box-shadow,color] duration-150 ease";

/** Quiet grey at rest, accent while focused, red when the field is invalid. */
const controlShellState = (invalid: boolean) =>
  invalid
    ? "ring-border-error-default hover:ring-border-error-default focus-within:ring-2 focus-within:ring-border-error-default"
    : "hover:ring-border-button-hover focus-within:ring-2 focus-within:ring-border-focus-ring";

const controlInput =
  "min-w-0 flex-1 bg-transparent p-0 text-body-regular text-text-primary outline-none placeholder:text-text-tertiary disabled:cursor-not-allowed disabled:text-input-disabled-text";

/** Panel-mounted fields get a hairline edge so they separate from the card in dark mode. */
const panelShell = "ring-1 ring-border-button-default";

const labelText = "flex items-center gap-1 text-body-2-medium text-text-secondary";

const primaryButton =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-button-primary px-3 text-body-2-medium text-text-white shadow-xs transition-opacity duration-150 ease hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";

const secondaryButton =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border-button-default bg-background-primary-default px-3 text-body-2-medium text-text-primary shadow-xs transition-colors duration-150 ease hover:bg-background-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";

const ghostButton =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-2.5 text-body-2-medium text-text-secondary transition-colors duration-150 ease hover:bg-background-secondary-default hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";

const choiceControl =
  "mt-0.5 size-3.5 shrink-0 accent-accent-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";

/** A grid cell: label, control, and an optional quiet hint. */
function GridField({
  id,
  label,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cx("flex min-w-0 flex-col gap-1", className)}>
      <label htmlFor={id} className="text-body-2-medium text-text-secondary">
        {label}
      </label>
      {children}
      {hint ? <span className="text-caption-2-regular text-text-tertiary">{hint}</span> : null}
    </div>
  );
}

/** A stock text input on the shared shell. */
function TextControl({
  id,
  value,
  onChange,
  placeholder,
  type = "text",
  dir,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email";
  dir?: "ltr";
}) {
  return (
    <div className={cx(controlShell, panelShell, controlShellState(false))}>
      <input
        id={id}
        type={type}
        dir={dir}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={cx(controlInput, dir === "ltr" && "text-start")}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Form field                                                                 */
/* -------------------------------------------------------------------------- */

export function FormField() {
  const id = useId();
  const [invalid, setInvalid] = useState(true);
  const [name, setName] = useState("Northwind Studio");
  const describedBy = invalid ? `${id}-hint ${id}-error` : `${id}-hint`;

  return (
    <div className="flex w-full max-w-[360px] flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className={labelText}>
          Workspace name
          <span aria-hidden className="text-text-error-primary">
            *
          </span>
          <span className="sr-only">(required)</span>
        </label>

        <div className={cx(controlShell, controlShellState(invalid))}>
          <RiPencilLine aria-hidden className="size-4 shrink-0 text-foreground-icon-secondary" />
          <input
            id={id}
            value={name}
            autoComplete="organization"
            onChange={(event) => setName(event.target.value)}
            aria-required="true"
            aria-invalid={invalid}
            aria-describedby={describedBy}
            className={controlInput}
          />
          {invalid ? (
            <RiErrorWarningLine aria-hidden className="size-4 shrink-0 text-text-error-primary" />
          ) : (
            <RiCheckLine aria-hidden className="size-4 shrink-0 text-state-success-text" />
          )}
        </div>

        <p id={`${id}-hint`} className="text-caption-1-regular text-text-tertiary">
          Shown on invoices and in the workspace switcher.
        </p>

        {invalid ? (
          <p
            id={`${id}-error`}
            role="alert"
            className="flex items-start gap-1 text-caption-1-regular text-text-error-primary"
          >
            <RiErrorWarningLine aria-hidden className="mt-px size-3.5 shrink-0" />
            This name is already taken. Try “Northwind Studio NYC”.
          </p>
        ) : (
          <p role="status" className="flex items-start gap-1 text-caption-1-regular text-state-success-text">
            <RiCheckLine aria-hidden className="mt-px size-3.5 shrink-0" />
            Available. This is how it appears on invoices.
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setInvalid((current) => !current)}
          className={cx(secondaryButton, "h-8 px-2.5")}
        >
          {invalid ? (
            <RiCheckLine aria-hidden className="size-3.5" />
          ) : (
            <RiErrorWarningLine aria-hidden className="size-3.5" />
          )}
          {invalid ? "Preview valid" : "Preview error"}
        </button>
        <span className="text-caption-2-regular text-text-tertiary">Demo state toggle</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Fieldset                                                                   */
/* -------------------------------------------------------------------------- */

export function Fieldset() {
  const id = useId();
  const [policy, setPolicy] = useState("owners");
  const [invites, setInvites] = useState(true);
  const [digest, setDigest] = useState(false);

  const policies = [
    { value: "owners", label: "Owners and admins", hint: "Recommended for teams under 50." },
    { value: "everyone", label: "Everyone in the workspace", hint: "Any member can send an invite." },
  ];

  return (
    <fieldset className="w-full min-w-0 max-w-[400px] rounded-xl border border-border-button-default bg-background-primary-default p-3 shadow-xs">
      <legend className="px-1 text-title-3-semibold text-text-primary">Workspace access</legend>

      <div className="flex flex-col gap-3">
        <p className="text-caption-1-regular text-text-tertiary">
          Choose who can invite people and how much the team hears from us.
        </p>

        <div className="flex flex-col gap-1.5">
          <span id={`${id}-policy-label`} className="text-body-2-medium text-text-secondary">
            Who can invite new members
          </span>
          <div
            role="radiogroup"
            aria-labelledby={`${id}-policy-label`}
            className="flex flex-col gap-1.5"
          >
            {policies.map((option) => {
              const selected = policy === option.value;
              return (
                <label
                  key={option.value}
                  className={cx(
                    "flex cursor-pointer items-start gap-2 rounded-lg border p-2 transition-colors duration-150 ease",
                    selected
                      ? "border-border-button-active bg-background-secondary-default"
                      : "border-border-button-default hover:bg-background-secondary-default",
                  )}
                >
                  <input
                    type="radio"
                    name={`${id}-invite-policy`}
                    value={option.value}
                    checked={selected}
                    onChange={() => setPolicy(option.value)}
                    className={choiceControl}
                  />
                  <span className="flex min-w-0 flex-col">
                    <span className="text-body-2-medium text-text-primary">{option.label}</span>
                    <span className="text-caption-1-regular text-text-tertiary">{option.hint}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div aria-hidden="true" className="border-t border-separator-border" />

        <div className="flex flex-col gap-2">
          <label className="flex cursor-pointer items-start gap-2">
            <input
              type="checkbox"
              checked={invites}
              onChange={(event) => setInvites(event.target.checked)}
              className={choiceControl}
            />
            <span className="flex min-w-0 flex-col">
              <span className="text-body-2-medium text-text-primary">Email me when someone joins</span>
              <span className="text-caption-1-regular text-text-tertiary">One note per new member, no digest.</span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-2">
            <input
              type="checkbox"
              checked={digest}
              onChange={(event) => setDigest(event.target.checked)}
              className={choiceControl}
            />
            <span className="flex min-w-0 flex-col">
              <span className="text-body-2-medium text-text-primary">Send a weekly access digest</span>
              <span className="text-caption-1-regular text-text-tertiary">
                Every Monday at 09:00, to workspace owners.
              </span>
            </span>
          </label>
        </div>

        <p className="flex items-start gap-1 border-t border-separator-border pt-2 text-caption-2-regular text-text-tertiary">
          <RiLockLine aria-hidden className="mt-px size-3.5 shrink-0" />
          <span>
            Changes apply to all 24 members.{" "}
            <button
              type="button"
              className="rounded-xs text-caption-2-semibold text-text-secondary underline-offset-2 hover:text-text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
            >
              Read the access policy
            </button>
            .
          </span>
        </p>
      </div>
    </fieldset>
  );
}

/* -------------------------------------------------------------------------- */
/*  Form grid                                                                  */
/* -------------------------------------------------------------------------- */

const INITIAL_BILLING = {
  company: "Northwind Studio",
  email: "billing@northwind.studio",
  address: "48 Mercer Street, Floor 3",
  city: "New York",
  postal: "10013",
  taxId: "US-88-1042291",
  country: "United States",
};

const COUNTRIES = ["United States", "United Kingdom", "Germany", "France", "Japan"];

export function FormGrid() {
  const id = useId();
  const [form, setForm] = useState(INITIAL_BILLING);
  const [saved, setSaved] = useState(false);

  const update = (key: keyof typeof INITIAL_BILLING) => (value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  return (
    <div className="w-full max-w-[560px] rounded-xl border border-border-button-default bg-background-primary-default p-3 shadow-xs">
      <div className="mb-3 flex items-baseline justify-between gap-2 border-b border-separator-border pb-2">
        <h3 className="text-body-2-semibold text-text-primary">Billing details</h3>
        <span className="text-caption-2-regular text-text-tertiary">Step 2 of 3</span>
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
        <GridField
          id={`${id}-company`}
          label="Company name"
          hint="The legal name printed on every receipt."
          className="sm:col-span-2"
        >
          <TextControl
            id={`${id}-company`}
            value={form.company}
            onChange={update("company")}
            placeholder="Northwind Studio"
          />
        </GridField>

        <GridField id={`${id}-email`} label="Billing email">
          <TextControl
            id={`${id}-email`}
            type="email"
            dir="ltr"
            value={form.email}
            onChange={update("email")}
            placeholder="billing@company.com"
          />
        </GridField>

        <GridField id={`${id}-country`} label="Country">
          <div className={cx(controlShell, panelShell, controlShellState(false))}>
            <select
              id={`${id}-country`}
              value={form.country}
              onChange={(event) => update("country")(event.target.value)}
              className={cx(controlInput, "cursor-pointer appearance-none")}
            >
              {COUNTRIES.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            <RiArrowDownSLine aria-hidden className="pointer-events-none size-4 shrink-0 text-foreground-icon-secondary" />
          </div>
        </GridField>

        <GridField id={`${id}-address`} label="Street address">
          <TextControl
            id={`${id}-address`}
            value={form.address}
            onChange={update("address")}
            placeholder="Street and floor"
          />
        </GridField>

        <GridField id={`${id}-city`} label="City">
          <TextControl
            id={`${id}-city`}
            value={form.city}
            onChange={update("city")}
            placeholder="City"
          />
        </GridField>

        <GridField id={`${id}-postal`} label="Postal code">
          <TextControl
            id={`${id}-postal`}
            dir="ltr"
            value={form.postal}
            onChange={update("postal")}
            placeholder="10013"
          />
        </GridField>

        <GridField id={`${id}-tax`} label="Tax ID" hint="VAT or EIN, if your company has one.">
          <TextControl
            id={`${id}-tax`}
            dir="ltr"
            value={form.taxId}
            onChange={update("taxId")}
            placeholder="US-00-0000000"
          />
        </GridField>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-separator-border pt-2 sm:col-span-2">
          <span className="text-caption-2-regular text-text-tertiary">
            {saved ? (
              <span role="status" className="flex items-center gap-1 text-state-success-text">
                <RiCheckLine aria-hidden className="size-3.5 shrink-0" />
                Saved to billing profile
              </span>
            ) : (
              "Used on invoices and receipts."
            )}
          </span>
          <button
            type="button"
            onClick={() => setSaved(true)}
            className={cx(secondaryButton, "h-8 px-2.5")}
          >
            <RiSaveLine aria-hidden className="size-3.5" />
            Save details
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Validation summary                                                         */
/* -------------------------------------------------------------------------- */

const BILLING_ISSUES = [
  {
    id: "email",
    field: "Billing email",
    message: "Use a work address, not a personal inbox.",
    anchor: "billing-email",
  },
  {
    id: "vat",
    field: "VAT number",
    message: "The format for Germany is DE plus nine digits.",
    anchor: "billing-vat",
  },
  {
    id: "address",
    field: "Billing address",
    message: "Add a street number so the invoice clears.",
    anchor: "billing-address",
  },
];

export function ValidationSummary() {
  const headingId = useId();
  const [issues, setIssues] = useState(BILLING_ISSUES);
  const total = BILLING_ISSUES.length;
  const remaining = issues.length;

  return (
    <section
      aria-labelledby={headingId}
      className={cx(
        "w-full max-w-[420px] overflow-hidden rounded-xl border bg-background-primary-default shadow-xs",
        remaining === 0 ? "border-border-button-default" : "border-border-error-default",
      )}
    >
      <header
        className={cx(
          "flex items-center gap-2 border-b border-separator-border px-3 py-2",
          remaining === 0 ? "bg-background-secondary-default" : "bg-background-tertiary-error",
        )}
      >
        <span
          className={cx(
            "flex size-6 shrink-0 items-center justify-center rounded-full bg-background-primary-default shadow-xs",
            remaining === 0 ? "text-state-success-text" : "text-text-error-primary",
          )}
        >
          {remaining === 0 ? (
            <RiCheckLine aria-hidden className="size-4" />
          ) : (
            <RiErrorWarningLine aria-hidden className="size-4" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <h3 id={headingId} className="text-headline-medium text-text-primary">
            {remaining === 0 ? "No issues left" : `${remaining} issue${remaining === 1 ? "" : "s"}`}
          </h3>
          <p className="text-caption-2-regular text-text-secondary">
            {remaining === 0
              ? "Everything on this invoice checks out."
              : "Fix these before we can charge the card on file."}
          </p>
        </div>
        {remaining > 0 && (
          <span className="rounded-full border border-border-error-default px-1.5 py-0.5 text-caption-2-semibold text-text-error-primary tabular-nums">
            {remaining}/{total}
          </span>
        )}
      </header>

      {remaining === 0 ? (
        <p role="status" className="flex items-center gap-1.5 px-3 py-3 text-body-2-regular text-state-success-text">
          <RiCheckLine aria-hidden className="size-4 shrink-0" />
          All {total} issues resolved. You can charge the card now.
        </p>
      ) : (
        <ul className="flex flex-col gap-0.5 p-1">
          {issues.map((issue) => (
            <li
              key={issue.id}
              className="flex items-start gap-1 rounded-lg px-1.5 py-1.5 transition-colors duration-100 ease hover:bg-background-secondary-default"
            >
              <a
                href={`#${issue.anchor}`}
                className="flex min-w-0 flex-1 items-start gap-2 rounded-md p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                <RiArrowRightLine
                  aria-hidden
                  className="mt-0.5 size-3.5 shrink-0 text-foreground-icon-tertiary rtl:-scale-x-100"
                />
                <span className="flex min-w-0 flex-col">
                  <span className="text-body-2-medium text-text-primary">{issue.field}</span>
                  <span className="text-caption-1-regular text-text-secondary">{issue.message}</span>
                </span>
              </a>
              <button
                type="button"
                aria-label={`Dismiss ${issue.field} issue`}
                onClick={() =>
                  setIssues((current) => current.filter((item) => item.id !== issue.id))
                }
                className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-tertiary transition-colors duration-150 ease hover:bg-background-tertiary-default hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
              >
                <RiCloseLine aria-hidden className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-separator-border px-3 py-2">
        <span className="text-caption-2-regular text-text-tertiary">Invoice 4471 · Northwind Studio</span>
        <button
          type="button"
          onClick={() => setIssues(BILLING_ISSUES)}
          disabled={remaining === total}
          className="rounded-sm text-caption-1-semibold text-text-secondary underline-offset-2 hover:text-text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:pointer-events-none disabled:text-text-disabled"
        >
          Re-check invoice
        </button>
      </footer>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Inline form                                                                */
/* -------------------------------------------------------------------------- */

export function InlineForm() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [sentTo, setSentTo] = useState("");

  useEffect(() => {
    if (status !== "loading") return;
    const timer = window.setTimeout(() => setStatus("sent"), 900);
    return () => window.clearTimeout(timer);
  }, [status]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next)) {
      setError("Enter a work email, like maya@northwind.studio.");
      return;
    }
    setError(null);
    setSentTo(next);
    setStatus("loading");
  };

  const reset = () => {
    setEmail("");
    setError(null);
    setSentTo("");
    setStatus("idle");
  };

  if (status === "sent") {
    return (
      <div
        role="status"
        className="w-full max-w-[420px] rounded-xl border border-border-button-default bg-background-primary-default p-3 shadow-xs"
      >
        <div className="flex items-start gap-2">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-background-secondary-default text-state-success-text">
            <RiCheckLine aria-hidden className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-body-2-semibold text-text-primary">You’re on the list</p>
            <p className="text-caption-1-regular text-text-secondary">
              Confirmation sent to{" "}
              <bdi dir="ltr" className="break-words text-text-primary">
                {sentTo}
              </bdi>
              .
            </p>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-separator-border pt-2">
          <span className="text-caption-2-regular text-text-tertiary">Product notes, twice a month.</span>
          <button
            type="button"
            onClick={reset}
            className="rounded-sm text-caption-1-semibold text-text-secondary underline-offset-2 hover:text-text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            Use another email
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-busy={status === "loading"}
      className="w-full max-w-[420px]"
    >
      <label htmlFor={id} className="sr-only">
        Work email
      </label>
      <div className="flex items-center gap-2">
        <div className={cx(controlShell, controlShellState(Boolean(error)), "min-w-0 flex-1")}>
          <RiMailLine aria-hidden className="size-4 shrink-0 text-foreground-icon-secondary" />
          <input
            id={id}
            type="email"
            dir="ltr"
            value={email}
            autoComplete="email"
            placeholder="you@studio.com"
            disabled={status === "loading"}
            onChange={(event) => {
              setEmail(event.target.value);
              setError(null);
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : `${id}-hint`}
            className={cx(controlInput, "text-start")}
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className={cx(primaryButton, "shrink-0 disabled:pointer-events-none disabled:opacity-60")}
        >
          {status === "loading" ? (
            <>
              <RiLoader4Line aria-hidden className="size-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Subscribe
              <RiArrowRightLine aria-hidden className="size-4 rtl:-scale-x-100" />
            </>
          )}
        </button>
      </div>

      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-1 flex items-start gap-1 text-caption-1-regular text-text-error-primary"
        >
          <RiErrorWarningLine aria-hidden className="mt-px size-3.5 shrink-0" />
          {error}
        </p>
      ) : (
        <p id={`${id}-hint`} className="mt-1 text-caption-2-regular text-text-tertiary">
          Twice a month. Unsubscribe anytime.
        </p>
      )}
    </form>
  );
}

/* -------------------------------------------------------------------------- */
/*  Form actions                                                               */
/* -------------------------------------------------------------------------- */

export function FormActions() {
  const id = useId();
  const [baseline, setBaseline] = useState("Northwind Studio");
  const [name, setName] = useState("Northwind Studio — NYC");
  const [saved, setSaved] = useState(false);
  const dirty = name !== baseline;
  const justSaved = saved && !dirty;

  const save = () => {
    setBaseline(name);
    setSaved(true);
  };

  const cancel = () => {
    setName(baseline);
    setSaved(false);
  };

  const edit = (next: string) => {
    setName(next);
    setSaved(false);
  };

  const note = justSaved ? "All changes saved" : dirty ? "Unsaved changes" : "No changes yet";

  return (
    <div className="w-full max-w-[440px] overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default shadow-xs">
      <div className="flex flex-col gap-1 p-3">
        <label htmlFor={id} className={labelText}>
          Workspace name
        </label>
        <div className={cx(controlShell, panelShell, controlShellState(false))}>
          <input
            id={id}
            value={name}
            autoComplete="organization"
            onChange={(event) => edit(event.target.value)}
            className={controlInput}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-separator-border bg-background-secondary-default px-3 py-2">
        <span
          role="status"
          className={cx(
            "flex items-center gap-1.5 text-caption-1-regular",
            justSaved
              ? "text-state-success-text"
              : dirty
                ? "text-text-secondary"
                : "text-text-tertiary",
          )}
        >
          {justSaved ? (
            <RiCheckLine aria-hidden className="size-3.5 shrink-0" />
          ) : dirty ? (
            <span aria-hidden className="size-1.5 rounded-full bg-accent-500" />
          ) : null}
          {note}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={cancel}
            disabled={!dirty}
            className={cx(
              ghostButton,
              "h-8 px-2 disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={!dirty}
            className={cx(
              primaryButton,
              "h-8 px-2.5 disabled:pointer-events-none disabled:opacity-50",
            )}
          >
            <RiSaveLine aria-hidden className="size-3.5" />
            Save
            <kbd className="ms-1 inline-flex items-center gap-0.5 rounded-sm bg-background-primary-default/20 px-1 py-0.5 text-caption-2-semibold text-text-white">
              <RiCommandLine aria-hidden className="size-3" />
              <RiCornerDownLeftLine aria-hidden className="size-3" />
              <span className="sr-only">Command Enter</span>
            </kbd>
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const FORMS_SECTION: ExtendedSection = {
  id: "forms",
  title: "Forms",
  blurb: "Labels, legends and the small print that keeps a form honest.",
  file: "forms.tsx",
  entries: [
    {
      name: "Form Field",
      description: "Label, requirement, hint and error, with a live state toggle.",
      Demo: FormField,
    },
    {
      name: "Fieldset",
      description: "A legend, grouped choices and a footnote that explains itself.",
      Demo: Fieldset,
      wide: true,
    },
    {
      name: "Form Grid",
      description: "Two columns, one full-width row, every field measured.",
      Demo: FormGrid,
      wide: true,
    },
    {
      name: "Validation Summary",
      description: "A counted error list with field links and dismissible rows.",
      Demo: ValidationSummary,
      wide: true,
    },
    {
      name: "Inline Form",
      description: "One email, one button, and a loading-to-success handoff.",
      Demo: InlineForm,
    },
    {
      name: "Form Actions",
      description: "Dirty state, cancel and save, with the shortcut on the button.",
      Demo: FormActions,
    },
  ],
};
