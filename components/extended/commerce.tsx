"use client";

import { useId, useRef, useState } from "react";
import {
  RiAlertLine,
  RiArrowRightLine,
  RiCheckLine,
  RiCoupon3Line,
  RiDeleteBinLine,
  RiDownloadLine,
  RiErrorWarningLine,
  RiFileList3Line,
  RiPencilLine,
  RiSubtractLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* -------------------------------------------------------------------------- */
/*  Shared                                                                     */
/* -------------------------------------------------------------------------- */

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";

const primaryButton = cx(
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-button-primary px-3",
  "text-body-2-medium text-text-white shadow-xs transition-opacity duration-150 ease hover:opacity-90",
  focusRing,
);

const iconButton = cx(
  "flex size-7 shrink-0 items-center justify-center rounded-md text-foreground-icon-secondary",
  "transition-colors duration-150 ease hover:bg-background-secondary-hover hover:text-text-primary",
  focusRing,
);

/* -------------------------------------------------------------------------- */
/*  Pricing card                                                               */
/* -------------------------------------------------------------------------- */

const STUDIO_PRICES = { monthly: 49, yearly: 39 } as const;

const STUDIO_FEATURES = [
  "Unlimited projects and seats",
  "50 GB of shared asset storage",
  "Brand kits and version history",
  "Priority support, 4-hour response",
];

export function PricingCard() {
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const price = STUDIO_PRICES[cycle];
  const yearlyTotal = STUDIO_PRICES.yearly * 12;
  const yearlySaving = STUDIO_PRICES.monthly * 12 - yearlyTotal;

  return (
    <section className="flex w-full max-w-[300px] flex-col gap-3 rounded-xl border border-border-button-default bg-background-primary-default p-4 shadow-card">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-title-3-semibold text-text-primary">Studio</h3>
          <span className="rounded-full border border-accent-600 bg-background-primary-default px-2 py-0.5 text-caption-2-semibold text-accent-700">
            Most popular
          </span>
        </div>
        <p className="text-caption-1-regular text-text-secondary">For teams shipping every week.</p>
      </div>

      <div
        role="group"
        aria-label="Billing cycle"
        className="grid grid-cols-2 gap-0.5 rounded-lg bg-background-secondary-default p-0.5"
      >
        {(["monthly", "yearly"] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={cycle === option}
            onClick={() => setCycle(option)}
            className={cx(
              "inline-flex h-7 items-center justify-center rounded-md text-caption-1-semibold transition-colors duration-150 ease",
              focusRing,
              cycle === option
                ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
                : "text-text-tertiary hover:text-text-secondary",
            )}
          >
            {option === "monthly" ? "Monthly" : "Yearly"}
            {option === "yearly" && (
              <span
                className={cx(
                  "ms-1",
                  cycle === "yearly" ? "text-status-lime-text" : "text-text-tertiary",
                )}
              >
                <bdi dir="ltr">−20%</bdi>
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-0.5" aria-live="polite">
        <div className="flex items-baseline gap-1.5">
          <span className="text-title-1-semibold text-text-primary tabular-nums" dir="ltr">
            ${price}
          </span>
          <span className="text-body-2-regular text-text-tertiary">/ month</span>
        </div>
        <p className="text-caption-1-regular text-text-tertiary">
          {cycle === "yearly" ? (
            <>
              <bdi dir="ltr">${yearlyTotal}</bdi> billed yearly · save{" "}
              <bdi dir="ltr">${yearlySaving}</bdi>
            </>
          ) : (
            "Billed monthly · cancel anytime"
          )}
        </p>
      </div>

      <ul className="flex flex-col gap-1.5">
        {STUDIO_FEATURES.map((feature) => (
          <li key={feature} className="flex items-start gap-1.5">
            <RiCheckLine className="mt-0.5 size-3.5 shrink-0 text-status-lime-text" aria-hidden />
            <span className="text-body-2-regular text-text-secondary">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-1.5">
        <button type="button" className={cx(primaryButton, "w-full")}>
          Start 14-day trial
          <RiArrowRightLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
        </button>
        <p className="text-center text-caption-2-regular text-text-tertiary">
          No card required · Cancel anytime
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Plan comparison                                                            */
/* -------------------------------------------------------------------------- */

const COMPARISON_ROWS = [
  { feature: "Up to 3 editors", starter: true, studio: true },
  { feature: "Unlimited projects", starter: false, studio: true },
  { feature: "Version history", starter: false, studio: true },
  { feature: "Brand kits", starter: false, studio: true },
  { feature: "Guest reviewers", starter: true, studio: true },
  { feature: "SSO & SCIM", starter: false, studio: true },
  { feature: "Priority support", starter: false, studio: true },
] as const;

function MatrixCell({ included }: { included: boolean }) {
  return included ? (
    <span className="inline-flex size-5 items-center justify-center rounded-full bg-status-lime-background text-status-lime-text">
      <RiCheckLine className="size-3.5" aria-hidden />
      <span className="sr-only">Included</span>
    </span>
  ) : (
    <span className="inline-flex size-5 items-center justify-center text-foreground-icon-quaternary">
      <RiSubtractLine className="size-4" aria-hidden />
      <span className="sr-only">Not included</span>
    </span>
  );
}

export function PlanComparison() {
  return (
    <div className="w-full max-w-[560px] overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default shadow-card">
      <table className="w-full table-fixed border-collapse">
        <caption className="sr-only">
          Feature comparison between the Starter and Studio plans
        </caption>
        <thead>
          <tr className="border-b border-separator-border">
            <th scope="col" className="px-3 py-2.5 text-start align-bottom">
              <span className="text-caption-1-semibold text-text-tertiary">Compare plans</span>
            </th>
            <th scope="col" className="w-24 px-2 py-2.5 text-center align-bottom sm:w-28">
              <span className="block text-body-2-semibold text-text-primary">Starter</span>
              <span className="block text-caption-1-regular text-text-tertiary tabular-nums">
                <bdi dir="ltr">$0</bdi> / mo
              </span>
            </th>
            <th
              scope="col"
              className="w-24 border-s border-separator-border bg-background-secondary-default px-2 py-2.5 text-center align-bottom sm:w-28"
            >
              <span className="mx-auto mb-1 flex w-max items-center rounded-full bg-accent-600 px-1.5 py-0.5 text-caption-2-semibold text-text-white">
                Recommended
              </span>
              <span className="block text-body-2-semibold text-text-primary">Studio</span>
              <span className="block text-caption-1-regular text-text-tertiary tabular-nums">
                <bdi dir="ltr">$49</bdi> / mo
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {COMPARISON_ROWS.map((row) => (
            <tr key={row.feature} className="border-t border-separator-border">
              <th
                scope="row"
                className="px-3 py-2 text-start text-body-2-regular text-text-secondary"
              >
                {row.feature}
              </th>
              <td className="px-2 py-2 text-center">
                <MatrixCell included={row.starter} />
              </td>
              <td className="border-s border-separator-border bg-background-secondary-default px-2 py-2 text-center">
                <MatrixCell included={row.studio} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 border-t border-separator-border px-3 py-2">
        <p className="text-caption-1-regular text-text-tertiary">
          All plans include unlimited viewers, 99.9% uptime and SOC 2 reports.
        </p>
        <button
          type="button"
          className={cx(
            "shrink-0 rounded-sm text-caption-1-semibold text-text-secondary underline-offset-2 hover:text-text-primary hover:underline",
            focusRing,
          )}
        >
          Full comparison
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Usage meter                                                                */
/* -------------------------------------------------------------------------- */

const USAGE_INCLUDED = 250_000;
const USAGE_USED = 268_400;
const USAGE_PROJECTED = 312_000;
const OVERAGE_RATE = 0.4;
const OVERAGE_CALLS = USAGE_USED - USAGE_INCLUDED;
const PROJECTED_OVERAGE = ((USAGE_PROJECTED - USAGE_INCLUDED) / 1000) * OVERAGE_RATE;
const USED_PERCENT = Math.round((USAGE_USED / USAGE_INCLUDED) * 100);
const BAR_TOTAL = Math.max(USAGE_USED, USAGE_INCLUDED);
const INCLUDED_WIDTH = (Math.min(USAGE_USED, USAGE_INCLUDED) / BAR_TOTAL) * 100;
const OVERAGE_WIDTH = (Math.max(0, USAGE_USED - USAGE_INCLUDED) / BAR_TOTAL) * 100;

const numberFormat = new Intl.NumberFormat("en-US");

export function UsageMeter() {
  return (
    <section className="flex w-full max-w-[340px] flex-col gap-3 rounded-xl border border-border-button-default bg-background-primary-default p-3 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-body-2-semibold text-text-primary">API calls</h3>
          <p className="text-caption-1-regular text-text-tertiary">
            Resets <bdi dir="ltr">Dec 1, 2026</bdi>
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-full bg-status-orange-background px-2 py-0.5 text-caption-2-semibold text-status-orange-text tabular-nums">
          <bdi dir="ltr">{USED_PERCENT}%</bdi>&nbsp;of plan
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline gap-1.5">
          <span className="text-title-2-medium text-text-primary tabular-nums" dir="ltr">
            {numberFormat.format(USAGE_USED)}
          </span>
          <span className="text-body-2-regular text-text-tertiary">
            of {numberFormat.format(USAGE_INCLUDED)} included
          </span>
        </div>
        <div
          role="img"
          aria-label={`${numberFormat.format(USAGE_USED)} API calls used against ${numberFormat.format(USAGE_INCLUDED)} included, ${numberFormat.format(OVERAGE_CALLS)} over the limit`}
          className="flex h-2 w-full overflow-hidden rounded-full bg-background-secondary-default"
        >
          <span className="h-full bg-accent-500" style={{ width: `${INCLUDED_WIDTH}%` }} />
          <span className="h-full bg-status-orange-text" style={{ width: `${OVERAGE_WIDTH}%` }} />
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="flex items-center gap-1 text-caption-2-regular text-text-tertiary">
            <span aria-hidden className="size-1.5 rounded-full bg-accent-500" />
            Included {numberFormat.format(USAGE_INCLUDED)}
          </span>
          <span className="flex items-center gap-1 text-caption-2-regular text-text-tertiary">
            <span aria-hidden className="size-1.5 rounded-full bg-status-orange-text" />
            Overage {numberFormat.format(OVERAGE_CALLS)}
          </span>
          <span className="ms-auto text-caption-2-regular text-text-tertiary tabular-nums">
            <bdi dir="ltr">${OVERAGE_RATE.toFixed(2)} / 1k</bdi>
          </span>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-status-orange-background p-2.5">
        <RiAlertLine className="mt-0.5 size-4 shrink-0 text-status-orange-text" aria-hidden />
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-caption-1-semibold text-status-orange-text tabular-nums">
            <bdi dir="ltr">${PROJECTED_OVERAGE.toFixed(2)}</bdi> projected overage
          </p>
          <p className="text-caption-1-regular text-text-primary">
            At this pace you will reach {numberFormat.format(USAGE_PROJECTED)} calls by Dec 1.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-caption-1-regular text-text-tertiary">
          Overage billed on <bdi dir="ltr">Dec 1</bdi>
        </span>
        <button
          type="button"
          className={cx(
            "rounded-sm text-caption-1-semibold text-text-secondary underline-offset-2 hover:text-text-primary hover:underline",
            focusRing,
          )}
        >
          Adjust limit
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Invoice row                                                                */
/* -------------------------------------------------------------------------- */

type InvoiceStatus = "Paid" | "Past due";

const INVOICES: {
  number: string;
  date: string;
  meta: string;
  amount: string;
  status: InvoiceStatus;
}[] = [
  {
    number: "INV-2041",
    date: "Oct 1, 2026",
    meta: "5 days overdue",
    amount: "$588.00",
    status: "Past due",
  },
  {
    number: "INV-1987",
    date: "Sep 1, 2026",
    meta: "Paid Sep 3",
    amount: "$588.00",
    status: "Paid",
  },
  {
    number: "INV-1932",
    date: "Aug 1, 2026",
    meta: "Paid Aug 3",
    amount: "$588.00",
    status: "Paid",
  },
];

const INVOICE_STATUS_STYLES: Record<InvoiceStatus, string> = {
  Paid: "bg-status-lime-background text-status-lime-text",
  "Past due": "bg-status-rose-background text-status-rose-text",
};

export function InvoiceRow() {
  return (
    <section className="w-full max-w-[560px] overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default shadow-card">
      <div className="flex items-center gap-2 border-b border-separator-border px-3 py-2">
        <h3 className="text-body-2-semibold text-text-primary">Invoices</h3>
        <span className="text-caption-1-regular text-text-tertiary">3 of 24</span>
        <button
          type="button"
          className={cx(
            "ms-auto rounded-sm text-caption-1-semibold text-text-secondary underline-offset-2 hover:text-text-primary hover:underline",
            focusRing,
          )}
        >
          View all
        </button>
      </div>

      <ul className="divide-y divide-separator-border">
        {INVOICES.map((invoice) => {
          const paid = invoice.status === "Paid";
          return (
            <li key={invoice.number} className="flex items-center gap-2.5 px-3 py-2.5">
              <span className="hidden size-8 shrink-0 items-center justify-center rounded-lg bg-background-secondary-default text-foreground-icon-secondary sm:flex">
                <RiFileList3Line className="size-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-body-2-semibold text-text-primary tabular-nums"
                  dir="ltr"
                >
                  {invoice.number}
                </p>
                <p className="truncate text-caption-1-regular text-text-tertiary">
                  <bdi dir="ltr">{invoice.date}</bdi> · {invoice.meta}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span
                  className="text-body-2-semibold text-text-primary tabular-nums"
                  dir="ltr"
                >
                  {invoice.amount}
                </span>
                <span
                  className={cx(
                    "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-semibold",
                    INVOICE_STATUS_STYLES[invoice.status],
                  )}
                >
                  {paid ? (
                    <RiCheckLine className="size-3" aria-hidden />
                  ) : (
                    <RiAlertLine className="size-3" aria-hidden />
                  )}
                  {invoice.status}
                </span>
              </div>
              <button
                type="button"
                aria-label={`Download invoice ${invoice.number}`}
                className={iconButton}
              >
                <RiDownloadLine className="size-4" aria-hidden />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Payment method card                                                        */
/* -------------------------------------------------------------------------- */

export function PaymentMethodCard() {
  return (
    <section className="flex w-full max-w-[320px] flex-col gap-3 rounded-xl border border-border-button-default bg-background-primary-default p-3 shadow-card">
      <h3 className="sr-only">Payment method</h3>
      <div className="flex items-start gap-2.5">
        <span
          aria-hidden
          className="flex h-8 w-11 shrink-0 items-center justify-center rounded-md border border-border-button-default bg-background-secondary-default"
        >
          <span className="flex items-center">
            <span className="size-4 rounded-full bg-accent-500" />
            <span className="-ms-1.5 size-4 rounded-full bg-status-orange-text" />
          </span>
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-body-2-semibold text-text-primary">Mastercard</span>
            <span className="rounded-full border border-border-button-default bg-background-secondary-default px-1.5 py-0.5 text-caption-2-semibold text-text-primary">
              Default
            </span>
          </div>
          <p className="text-body-2-regular text-text-secondary tabular-nums" dir="ltr">
            •••• 4242
          </p>
          <p className="text-caption-1-regular text-text-tertiary">
            Expires <bdi dir="ltr">08 / 28</bdi>
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            aria-label="Edit Mastercard ending in 4242"
            className={iconButton}
          >
            <RiPencilLine className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Remove Mastercard ending in 4242"
            className={cx(
              iconButton,
              "hover:bg-status-rose-background hover:text-status-rose-text",
            )}
          >
            <RiDeleteBinLine className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-separator-border pt-2">
        <span className="text-caption-1-regular text-text-tertiary">Next charge</span>
        <span className="text-caption-1-medium text-text-secondary tabular-nums">
          <bdi dir="ltr">$468.00 · Dec 1</bdi>
        </span>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Coupon field                                                               */
/* -------------------------------------------------------------------------- */

const COUPON_OFFERS: Record<string, { percent: number; label: string }> = {
  SPRING20: { percent: 20, label: "20% off the annual plan" },
  LAUNCH25: { percent: 25, label: "25% off the annual plan" },
};

const ANNUAL_PLAN = 468;

export function CouponField() {
  const id = useId();
  const errorId = `${id}-error`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [applied, setApplied] = useState<string | null>("SPRING20");
  const [code, setCode] = useState("WELCOME10");
  const [error, setError] = useState<string | null>(
    "WELCOME10 expired on Oct 31. Try LAUNCH25.",
  );

  const apply = () => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      setError("Enter a promo code first.");
      return;
    }
    if (normalized === applied) {
      setError(`${normalized} is already applied.`);
      return;
    }
    if (!COUPON_OFFERS[normalized]) {
      setError(`${normalized} is not valid for this plan.`);
      return;
    }
    setApplied(normalized);
    setError(null);
    setCode("");
  };

  const remove = () => {
    setApplied(null);
    setError(null);
    setCode("");
    inputRef.current?.focus();
  };

  const offer = applied ? COUPON_OFFERS[applied] : null;
  const discount = offer ? (ANNUAL_PLAN * offer.percent) / 100 : 0;

  return (
    <section className="w-full max-w-[360px] overflow-hidden rounded-xl border border-border-button-default bg-background-primary-default shadow-card">
      <div className="flex items-center justify-between gap-2 border-b border-separator-border px-3 py-2">
        <h3 className="text-body-2-semibold text-text-primary">Promo code</h3>
        <span className="text-caption-1-regular text-text-tertiary">Annual plan</span>
      </div>

      <p className="sr-only" role="status">
        {applied && offer
          ? `${applied} applied. ${offer.label}.`
          : "No promo code applied."}
      </p>

      {applied && offer && (
        <div className="flex flex-col gap-2 px-3 py-2.5">
          <div className="flex items-start gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background-secondary-default text-foreground-icon-secondary">
              <RiCoupon3Line className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-body-2-semibold text-text-primary" dir="ltr">
                  {applied}
                </span>
                <span className="rounded-full bg-status-lime-background px-1.5 py-0.5 text-caption-2-semibold text-status-lime-text">
                  Applied
                </span>
              </div>
              <p className="text-caption-1-regular text-text-tertiary">{offer.label}</p>
            </div>
            <button
              type="button"
              onClick={remove}
              className={cx(
                "shrink-0 rounded-sm text-caption-1-semibold text-text-secondary underline-offset-2 hover:text-text-primary hover:underline",
                focusRing,
              )}
            >
              Remove
            </button>
          </div>

          <div className="flex items-center justify-between gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
            <span className="text-caption-1-regular text-text-secondary">Discount</span>
            <span className="text-body-2-semibold text-status-lime-text tabular-nums">
              <bdi dir="ltr">−${discount.toFixed(2)}</bdi>
            </span>
          </div>
        </div>
      )}

      <div className={cx("px-3 py-2.5", applied && "border-t border-separator-border")}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            apply();
          }}
          className="flex flex-col gap-1"
        >
          <label htmlFor={id} className="text-body-2-medium text-text-secondary">
            {applied ? "Add another code" : "Promo code"}
          </label>
          <div
            className={cx(
              "flex h-9 w-full items-center gap-2 rounded-2lg bg-background-secondary-default ps-2.5 pe-1 ring-2 ring-inset transition-[box-shadow] duration-150 ease",
              error
                ? "ring-border-error-default focus-within:ring-border-focus-ring"
                : "ring-transparent hover:ring-border-button-hover focus-within:ring-border-focus-ring",
            )}
          >
            <RiCoupon3Line
              className="size-4 shrink-0 text-foreground-icon-secondary"
              aria-hidden
            />
            <input
              ref={inputRef}
              id={id}
              dir="ltr"
              value={code}
              maxLength={24}
              autoComplete="off"
              spellCheck={false}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              onChange={(event) => {
                setCode(event.target.value);
                setError(null);
              }}
              placeholder="Enter a code"
              className="min-w-0 flex-1 bg-transparent p-0 text-body-regular text-text-primary uppercase outline-none placeholder:text-text-tertiary"
            />
            <button
              type="submit"
              className={cx(
                "inline-flex h-7 shrink-0 items-center rounded-md bg-button-primary px-2 text-caption-1-semibold text-text-white shadow-xs transition-opacity duration-150 ease hover:opacity-90",
                focusRing,
              )}
            >
              Apply
            </button>
          </div>

          {error ? (
            <p
              id={errorId}
              role="alert"
              className="flex items-start gap-1 text-caption-1-regular text-text-error-primary"
            >
              <RiErrorWarningLine className="mt-px size-3.5 shrink-0" aria-hidden />
              <span dir="auto">{error}</span>
            </p>
          ) : (
            <p className="text-caption-1-regular text-text-tertiary">
              One code per account. Applied at checkout.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const COMMERCE_SECTION: ExtendedSection = {
  id: "commerce",
  title: "Commerce",
  blurb: "Prices, plans and the paper trail that follows the sale.",
  file: "commerce.tsx",
  entries: [
    {
      name: "Pricing Card",
      description: "One plan, two billing cycles, and the case for upgrading.",
      Demo: PricingCard,
    },
    {
      name: "Plan Comparison",
      description: "A feature matrix with the recommended plan held in the light.",
      Demo: PlanComparison,
      wide: true,
    },
    {
      name: "Usage Meter",
      description: "Included, used and over — with the projected bill.",
      Demo: UsageMeter,
    },
    {
      name: "Invoice Row",
      description: "Three invoices, one overdue, each with its own download.",
      Demo: InvoiceRow,
      wide: true,
    },
    {
      name: "Payment Method Card",
      description: "The card on file, its expiry, and the actions that keep it current.",
      Demo: PaymentMethodCard,
    },
    {
      name: "Coupon Field",
      description: "A promo code that applies, and one that comes back rejected.",
      Demo: CouponField,
    },
  ],
};
