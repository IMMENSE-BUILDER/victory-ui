"use client";

import { useId, useState } from "react";
import type { ComponentType } from "react";
import {
  RiAddLine,
  RiArrowGoBackLine,
  RiArrowRightLine,
  RiBillLine,
  RiBookOpenLine,
  RiCalendarEventLine,
  RiCheckLine,
  RiDeleteBinLine,
  RiGiftLine,
  RiLeafLine,
  RiMapPin2Line,
  RiMotorbikeLine,
  RiReceiptLine,
  RiRefreshLine,
  RiRestaurant2Line,
  RiRestaurantLine,
  RiShoppingBag3Line,
  RiStarFill,
  RiSubtractLine,
  RiTableLine,
  RiTimerLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* -------------------------------------------------------------------------- */
/*  Shared                                                                     */
/* -------------------------------------------------------------------------- */

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";
const cardSurface = "w-full rounded-xl border border-border-button-default bg-background-primary-default shadow-card";
const buttonBase =
  "inline-flex items-center justify-center gap-1.5 rounded-lg text-caption-1-semibold " +
  "transition-[transform,scale,opacity,background-color,color,box-shadow] duration-150 ease-out " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 " +
  "motion-reduce:transition-none motion-reduce:active:scale-100";
const primaryButton = cx(buttonBase, "h-8 bg-button-primary px-2.5 text-text-white shadow-xs", focusRing);
const secondaryButton = cx(
  buttonBase,
  "h-8 border border-border-button-default bg-background-primary-default px-2.5 text-text-primary shadow-xs hover:bg-background-primary-hover",
  focusRing,
);
const quietButton = cx(
  buttonBase,
  "h-7 px-1.5 text-text-secondary hover:bg-background-secondary-default hover:text-text-primary",
  focusRing,
);
const revealGrid = "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none";
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const pointsFormat = new Intl.NumberFormat("en-US");

function StepButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  className,
}: {
  icon: IconComponent;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        "flex size-6 shrink-0 items-center justify-center rounded-md text-foreground-icon-secondary",
        "transition-[background-color,color,opacity] duration-150 ease-out hover:bg-background-secondary-default hover:text-text-primary",
        "disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none",
        focusRing,
        className,
      )}
    >
      <Icon className="size-3.5" aria-hidden />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  1. Order card                                                              */
/* -------------------------------------------------------------------------- */

const ORDER_LINES: { name: string; qty: number; price: number }[] = [
  { name: "Smoked brisket sandwich", qty: 1, price: 16.5 },
  { name: "Charred corn agnolotti", qty: 1, price: 24 },
  { name: "House lemonade", qty: 2, price: 4.5 },
];
const ORDER_TOTAL = ORDER_LINES.reduce((sum, line) => sum + line.qty * line.price, 0);

const ORDER_STAGES = [
  {
    label: "Preparing",
    note: "The kitchen has your ticket.",
    action: "Mark picked up",
    tone: "bg-status-yellow-background text-status-yellow-text",
    icon: RiTimerLine,
  },
  {
    label: "On the way",
    note: "Sam is riding to 14 Bay St.",
    action: "Confirm delivery",
    tone: "bg-status-blue-background text-status-blue-text",
    icon: RiMotorbikeLine,
  },
  {
    label: "Delivered",
    note: "Delivered at 7:08 PM. Enjoy.",
    action: "Order again",
    tone: "bg-status-lime-background text-status-lime-text",
    icon: RiCheckLine,
  },
] as const;

export function OrderCard() {
  const [stage, setStage] = useState(0);
  const current = ORDER_STAGES[stage];
  const StatusIcon = current.icon;
  const delivered = stage === ORDER_STAGES.length - 1;

  return (
    <section aria-label={`Order 4821, ${current.label}`} className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiShoppingBag3Line className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Order #4821</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">The Pass · 14 Bay St.</p>
        </div>
        <span
          role="status"
          className={cx(
            "flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-medium",
            "transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
            current.tone,
          )}
        >
          <StatusIcon className="size-3" aria-hidden />
          {current.label}
        </span>
      </div>

      <ul className="mt-1.5 flex flex-col">
        {ORDER_LINES.map((line) => (
          <li key={line.name} className="flex items-center gap-2">
            <span className="flex size-4 shrink-0 items-center justify-center rounded-sm bg-background-tertiary-default text-caption-2-semibold text-text-secondary tabular-nums">
              {line.qty}
            </span>
            <span className="min-w-0 flex-1 truncate text-caption-1-regular text-text-secondary">
              {line.name}
            </span>
            <span className="shrink-0 text-caption-1-medium text-text-primary tabular-nums">
              <bdi dir="ltr">{money.format(line.qty * line.price)}</bdi>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-1.5 flex items-baseline justify-between border-t border-separator-border pt-1.5">
        <span className="text-caption-1-medium text-text-secondary">Total</span>
        <span className="text-body-2-semibold text-text-primary tabular-nums">
          <bdi dir="ltr">{money.format(ORDER_TOTAL)}</bdi>
        </span>
      </div>

      <p aria-live="polite" className="mt-0.5 h-4 truncate text-caption-2-regular text-text-tertiary">
        <span key={stage} className="animate-label-in motion-reduce:animate-none">{current.note}</span>
      </p>

      <button
        type="button"
        onClick={() => setStage(delivered ? 0 : stage + 1)}
        className={cx(delivered ? secondaryButton : primaryButton, "mt-1.5 h-7 w-full")}
      >
        {delivered ? <RiRefreshLine className="size-3.5" aria-hidden /> : null}
        {current.action}
        {delivered ? null : <RiArrowRightLine className="size-3.5 rtl:-scale-x-100" aria-hidden />}
      </button>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  2. Menu item                                                               */
/* -------------------------------------------------------------------------- */

const MENU_DISH = {
  name: "Charred corn agnolotti",
  price: 24,
  detail: "Brown butter, sweet corn, pickled chile and a shower of parmesan.",
  tags: ["Vegetarian", "Contains gluten"],
};

export function MenuItem() {
  const [count, setCount] = useState(0);

  return (
    <section aria-label="Menu item: charred corn agnolotti" className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <div className="flex items-start gap-2">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-status-yellow-background text-status-yellow-text">
          <RiRestaurantLine className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className="min-w-0 flex-1 text-body-2-semibold text-text-primary">{MENU_DISH.name}</h3>
            <span className="shrink-0 text-body-2-semibold text-text-primary tabular-nums">
              <bdi dir="ltr">{money.format(MENU_DISH.price)}</bdi>
            </span>
          </div>
          <p className="mt-0.5 text-caption-2-regular text-text-secondary">{MENU_DISH.detail}</p>
        </div>
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-1">
        {MENU_DISH.tags.map((tag, index) => (
          <span
            key={tag}
            className={cx(
              "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-medium",
              index === 0
                ? "bg-status-lime-background text-status-lime-text"
                : "bg-background-tertiary-default text-text-secondary",
            )}
          >
            {index === 0 ? <RiLeafLine className="size-3" aria-hidden /> : null}
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 border-t border-separator-border pt-1.5">
        <p aria-live="polite" className="flex min-w-0 items-center gap-1 truncate text-caption-2-regular text-text-tertiary">
          {count > 0 ? (
            <>
              <RiCheckLine className="size-3 shrink-0 text-status-lime-text" aria-hidden />
              <span key={count} className="animate-label-in motion-reduce:animate-none">
                {count} in your order
              </span>
            </>
          ) : (
            "Made to order · 15 min"
          )}
        </p>
        <button
          type="button"
          onClick={() => setCount((value) => value + 1)}
          className={cx(count > 0 ? secondaryButton : primaryButton, "h-7 shrink-0")}
        >
          <RiAddLine className="size-3.5" aria-hidden />
          {count > 0 ? "Add another" : "Add to order"}
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  3. Cart row                                                                */
/* -------------------------------------------------------------------------- */

const CART_ITEM = { name: "Smoked brisket sandwich", price: 16.5, max: 6 };

export function CartRow() {
  const [qty, setQty] = useState(2);
  const [removed, setRemoved] = useState(false);

  return (
    <section aria-label="Cart" className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Your cart</h3>
        <span className="text-caption-2-regular text-text-tertiary">Pickup · 15 min</span>
      </div>

      <div
        inert={removed}
        className={cx(revealGrid, removed ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100")}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mt-1.5 flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-caption-1-medium text-text-primary">{CART_ITEM.name}</p>
              <p className="truncate text-caption-2-regular text-text-tertiary">Pickles · no slaw</p>
            </div>
            <span className="shrink-0 text-body-2-semibold text-text-primary tabular-nums">
              <bdi dir="ltr">{money.format(CART_ITEM.price * qty)}</bdi>
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between gap-2">
            <div role="group" aria-label={`Quantity of ${CART_ITEM.name}`} className="flex items-center gap-0.5 rounded-lg border border-border-button-default p-0.5">
              <StepButton
                icon={RiSubtractLine}
                label={`Decrease quantity of ${CART_ITEM.name}`}
                disabled={qty === 1}
                onClick={() => setQty((value) => Math.max(1, value - 1))}
              />
              <span aria-live="polite" className="w-5 text-center text-caption-1-semibold text-text-primary tabular-nums">
                {qty}
              </span>
              <StepButton
                icon={RiAddLine}
                label={`Increase quantity of ${CART_ITEM.name}`}
                disabled={qty === CART_ITEM.max}
                onClick={() => setQty((value) => Math.min(CART_ITEM.max, value + 1))}
              />
            </div>
            <button
              type="button"
              onClick={() => setRemoved(true)}
              className={cx(quietButton, "h-7 text-caption-2-semibold text-text-tertiary hover:text-text-error-primary")}
            >
              <RiDeleteBinLine className="size-3.5" aria-hidden />
              Remove
            </button>
          </div>

          <p className="mt-1 text-caption-2-regular text-text-tertiary">Ready for pickup at 6:45 PM.</p>
        </div>
      </div>

      <div
        aria-live="polite"
        inert={!removed}
        className={cx(revealGrid, removed ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mt-1 flex items-center gap-2">
            <p className="min-w-0 flex-1 truncate text-caption-1-regular text-text-secondary">
              Removed <span className="text-text-primary">{CART_ITEM.name}</span>
            </p>
            <button
              type="button"
              onClick={() => setRemoved(false)}
              className={cx(quietButton, "h-6 shrink-0 px-1 text-caption-2-semibold")}
            >
              <RiArrowGoBackLine className="size-3 rtl:-scale-x-100" aria-hidden />
              Undo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  4. Delivery tracker                                                        */
/* -------------------------------------------------------------------------- */

const DELIVERY_STEPS = [
  { label: "Preparing", time: "6:38 PM", icon: RiTimerLine },
  { label: "Picked up", time: "6:51 PM", icon: RiShoppingBag3Line },
  { label: "En route", time: "ETA 7:04", icon: RiMotorbikeLine },
] as const;

const DELIVERY_NOTES = [
  { who: "Kitchen · The Pass", note: "Two dishes on the pass.", action: "Picked up" },
  { who: "Marco · courier", note: "Bagged and leaving the kitchen.", action: "Start route" },
  { who: "Marco · courier", note: "1.2 miles away · 6 min out.", action: "New order" },
] as const;

export function DeliveryTracker() {
  const [stage, setStage] = useState(1);
  const current = DELIVERY_NOTES[stage];
  const last = DELIVERY_STEPS.length - 1;

  return (
    <section aria-label="Delivery tracker" className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-status-blue-background text-status-blue-text">
          <RiMotorbikeLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Order #4821</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Delivery to 14 Bay St.</p>
        </div>
        <span className="shrink-0 rounded-full bg-status-lime-background px-1.5 py-0.5 text-caption-2-medium text-status-lime-text">
          On time
        </span>
      </div>

      <ol className="mt-2 flex items-start">
        {DELIVERY_STEPS.map((step, index) => {
          const done = index < stage;
          const active = index === stage;
          const StepIcon = step.icon;
          const leftDone = index > 0 && index <= stage;
          const rightDone = index < last && index < stage;
          return (
            <li key={step.label} aria-current={active ? "step" : undefined} className="flex min-w-0 flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <span
                  aria-hidden
                  className={cx(
                    "h-0.5 flex-1 transition-[background-color] duration-200 ease-out motion-reduce:transition-none",
                    index === 0 ? "opacity-0" : leftDone ? "bg-accent-500" : "bg-background-tertiary-default",
                  )}
                />
                <span
                  className={cx(
                    "mx-1 flex size-6 shrink-0 items-center justify-center rounded-full border",
                    "transition-[background-color,border-color,color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
                    done
                      ? "border-accent-600 bg-accent-600 text-text-white"
                      : active
                        ? "border-accent-500 bg-background-primary-default text-accent-600 ring-2 ring-accent-500/20"
                        : "border-border-button-default bg-background-primary-default text-text-tertiary",
                  )}
                >
                  {done ? <RiCheckLine className="size-3" aria-hidden /> : <StepIcon className="size-3" aria-hidden />}
                </span>
                <span
                  aria-hidden
                  className={cx(
                    "h-0.5 flex-1 transition-[background-color] duration-200 ease-out motion-reduce:transition-none",
                    index === last ? "opacity-0" : rightDone ? "bg-accent-500" : "bg-background-tertiary-default",
                  )}
                />
              </div>
              <span
                className={cx(
                  "mt-1 truncate text-caption-2-medium transition-[color] duration-200 ease-out motion-reduce:transition-none",
                  active ? "text-text-primary" : "text-text-tertiary",
                )}
              >
                {step.label}
              </span>
              <span className="text-caption-2-regular text-text-tertiary tabular-nums"><bdi dir="ltr">{step.time}</bdi></span>
            </li>
          );
        })}
      </ol>

      <div className="mt-2 flex items-center gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
        <span aria-hidden className="flex size-6 shrink-0 items-center justify-center rounded-full bg-background-tertiary-default text-caption-2-semibold text-text-secondary">
          {stage === 0 ? "TP" : "MC"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-2-semibold text-text-primary">{current.who}</p>
          <p aria-live="polite" className="truncate text-caption-2-regular text-text-tertiary">
            <span key={stage} className="animate-label-in motion-reduce:animate-none">{current.note}</span>
          </p>
        </div>
        <button
          type="button"
          aria-label={`${current.action}, advance order 4821`}
          onClick={() => setStage(stage === last ? 0 : stage + 1)}
          className={cx(secondaryButton, "h-6 shrink-0 px-2 text-caption-2-semibold")}
        >
          {current.action}
          <RiArrowRightLine className="size-3 rtl:-scale-x-100" aria-hidden />
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  5. Reservation picker                                                      */
/* -------------------------------------------------------------------------- */

const RESERVATION_DAYS = [
  { id: "fri", weekday: "Fri", date: "Nov 6" },
  { id: "sat", weekday: "Sat", date: "Nov 7" },
  { id: "sun", weekday: "Sun", date: "Nov 8" },
] as const;

type ReservationDay = (typeof RESERVATION_DAYS)[number]["id"];

const RESERVATION_TIMES = ["6:30 PM", "7:00 PM", "7:30 PM"] as const;

export function ReservationPicker() {
  const [party, setParty] = useState(2);
  const [day, setDay] = useState<ReservationDay>("fri");
  const [time, setTime] = useState<string>("7:00 PM");
  const [confirmed, setConfirmed] = useState(false);
  const chosenDay = RESERVATION_DAYS.find((option) => option.id === day) ?? RESERVATION_DAYS[0];

  const change = (update: () => void) => {
    update();
    setConfirmed(false);
  };

  return (
    <section aria-label="Reserve a table" className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiCalendarEventLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Reserve a table</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">The Pass · 90 min</p>
        </div>
        <div role="group" aria-label="Party size" className="flex shrink-0 items-center gap-0.5 rounded-lg border border-border-button-default p-0.5">
          <StepButton
            icon={RiSubtractLine}
            label="Fewer guests"
            disabled={party === 1}
            onClick={() => change(() => setParty((value) => Math.max(1, value - 1)))}
          />
          <span aria-live="polite" className="w-12 text-center text-caption-2-semibold text-text-primary">
            {party} {party === 1 ? "guest" : "guests"}
          </span>
          <StepButton
            icon={RiAddLine}
            label="More guests"
            disabled={party === 8}
            onClick={() => change(() => setParty((value) => Math.min(8, value + 1)))}
          />
        </div>
      </div>

      <div role="group" aria-label="Reservation date" className="mt-1.5 grid grid-cols-3 gap-1">
        {RESERVATION_DAYS.map((option) => {
          const active = day === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => change(() => setDay(option.id))}
              className={cx(
                "flex h-9 flex-col items-center justify-center rounded-lg border",
                "transition-[background-color,border-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                active
                  ? "border-accent-500 bg-background-secondary-default text-text-primary shadow-xs"
                  : "border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-primary-hover",
              )}
            >
              <span className="text-caption-2-regular text-text-tertiary">{option.weekday}</span>
              <span className="text-caption-1-semibold">{option.date}</span>
            </button>
          );
        })}
      </div>

      <div role="group" aria-label="Reservation time" className="mt-1 grid grid-cols-3 gap-1">
        {RESERVATION_TIMES.map((option) => {
          const active = time === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => change(() => setTime(option))}
              className={cx(
                "flex h-7 items-center justify-center rounded-md border text-caption-2-semibold tabular-nums",
                "transition-[background-color,border-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                active
                  ? "border-accent-500 bg-background-secondary-default text-text-primary shadow-xs"
                  : "border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-primary-hover",
              )}
            >
              <bdi dir="ltr">{option}</bdi>
            </button>
          );
        })}
      </div>

      <div className="mt-1.5 flex items-center gap-2 border-t border-separator-border pt-1.5">
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-2-medium text-text-primary">
            {party} {party === 1 ? "guest" : "guests"} · {chosenDay.weekday}, {chosenDay.date}
          </p>
          <p aria-live="polite" className="truncate text-caption-2-regular text-text-tertiary">
            <span key={`${time}-${confirmed}`} className="animate-label-in motion-reduce:animate-none">
              {confirmed ? <>Held for 10 minutes · <bdi dir="ltr">R-4821</bdi></> : <><bdi dir="ltr">{time}</bdi> · The Pass</>}
            </span>
          </p>
        </div>
        <button
          type="button"
          aria-label={confirmed ? "Release reservation hold" : `Reserve a table for ${party}`}
          onClick={() => setConfirmed((value) => !value)}
          className={cx(
            confirmed ? cx(buttonBase, "h-7 bg-status-lime-background px-2 text-status-lime-text") : primaryButton,
            "h-7 shrink-0",
          )}
        >
          {confirmed ? <RiCheckLine className="size-3.5" aria-hidden /> : null}
          {confirmed ? "Held" : "Reserve"}
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  6. Recipe card                                                             */
/* -------------------------------------------------------------------------- */

const RECIPE = {
  name: "Brown butter gnocchi",
  time: "25 min",
  pan: "1 pan · 4 ingredients",
  baseServings: 2,
  ingredients: [
    { name: "Potato gnocchi", amount: 400, unit: "g" },
    { name: "Brown butter", amount: 60, unit: "g" },
    { name: "Sage leaves", amount: 8, unit: "" },
    { name: "Parmesan", amount: 40, unit: "g" },
  ],
};

export function RecipeCard() {
  const [servings, setServings] = useState(RECIPE.baseServings);
  const scale = (amount: number) => Math.round((amount * servings) / RECIPE.baseServings);

  return (
    <section aria-label={`Recipe: ${RECIPE.name}`} className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-status-orange-background text-status-orange-text">
          <RiBookOpenLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">{RECIPE.name}</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">{RECIPE.pan}</p>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-background-tertiary-default px-1.5 py-0.5 text-caption-2-medium text-text-secondary tabular-nums">
          <RiTimerLine className="size-3" aria-hidden />
          {RECIPE.time}
        </span>
      </div>

      <div className="mt-1.5 flex items-center justify-between rounded-lg bg-background-secondary-default px-2 py-0.5">
        <span className="text-caption-1-medium text-text-secondary">Servings</span>
        <div role="group" aria-label="Servings" className="flex items-center gap-0.5">
          <StepButton
            icon={RiSubtractLine}
            label="Fewer servings"
            disabled={servings === 2}
            onClick={() => setServings((value) => Math.max(2, value - 1))}
          />
          <span aria-live="polite" className="w-4 text-center text-caption-1-semibold text-text-primary tabular-nums">
            {servings}
          </span>
          <StepButton
            icon={RiAddLine}
            label="More servings"
            disabled={servings === 6}
            onClick={() => setServings((value) => Math.min(6, value + 1))}
          />
        </div>
      </div>

      <ul className="mt-1 flex flex-col gap-0.5">
        {RECIPE.ingredients.map((ingredient) => (
          <li key={ingredient.name} className="flex items-baseline justify-between gap-2">
            <span className="truncate text-caption-1-regular text-text-secondary">{ingredient.name}</span>
            <span
              key={`${ingredient.name}-${servings}`}
              className="shrink-0 animate-number-fade font-mono text-caption-1-medium text-text-primary tabular-nums motion-reduce:animate-none"
            >
              <bdi dir="ltr">
                {scale(ingredient.amount)}
                {ingredient.unit ? ` ${ingredient.unit}` : ""}
              </bdi>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  7. Allergen chips                                                          */
/* -------------------------------------------------------------------------- */

const ALLERGENS = [
  { id: "gluten", label: "Gluten" },
  { id: "dairy", label: "Dairy" },
  { id: "nuts", label: "Nuts" },
  { id: "shellfish", label: "Shellfish" },
  { id: "eggs", label: "Eggs" },
  { id: "soy", label: "Soy" },
] as const;

type AllergenId = (typeof ALLERGENS)[number]["id"];

const ALLERGEN_MENU: { name: string; allergens: AllergenId[] }[] = [
  { name: "Charred corn agnolotti", allergens: ["gluten", "dairy", "eggs"] },
  { name: "Smoked brisket", allergens: ["soy"] },
  { name: "Corn ribs", allergens: ["dairy"] },
  { name: "Garden salad", allergens: [] },
  { name: "Calamari", allergens: ["gluten", "shellfish"] },
  { name: "Miso aubergine", allergens: ["soy"] },
  { name: "Affogato", allergens: ["dairy"] },
  { name: "Lemon tart", allergens: ["gluten", "dairy", "eggs"] },
  { name: "Focaccia", allergens: ["gluten"] },
  { name: "Sorbet", allergens: [] },
];

export function AllergenChips() {
  const [selected, setSelected] = useState<AllergenId[]>(["shellfish"]);
  const matches = ALLERGEN_MENU.filter((dish) => !dish.allergens.some((allergen) => selected.includes(allergen))).length;

  const toggle = (id: AllergenId) => {
    setSelected((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <section aria-label="Allergen filters" className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Avoid allergens</h3>
        <span className="text-caption-2-regular text-text-tertiary">{ALLERGEN_MENU.length} dishes</span>
      </div>

      <div role="group" aria-label="Exclude allergens" className="mt-1.5 flex flex-wrap gap-1">
        {ALLERGENS.map((allergen) => {
          const active = selected.includes(allergen.id);
          return (
            <button
              key={allergen.id}
              type="button"
              aria-pressed={active}
              onClick={() => toggle(allergen.id)}
              className={cx(
                "inline-flex h-6 items-center gap-1 rounded-full border px-2 text-caption-2-medium",
                "transition-[background-color,border-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                active
                  ? "border-accent-500 bg-background-secondary-default text-text-primary shadow-xs"
                  : "border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-primary-hover",
              )}
            >
              <RiCheckLine
                className={cx(
                  "size-3 text-accent-600 transition-[transform,scale,opacity] duration-150 ease-out motion-reduce:transition-none",
                  active ? "scale-100 opacity-100" : "scale-50 opacity-0",
                )}
                aria-hidden
              />
              {allergen.label}
            </button>
          );
        })}
      </div>

      <div className="mt-1.5 flex items-center gap-2 border-t border-separator-border pt-1.5">
        <p aria-live="polite" className="min-w-0 flex-1 truncate text-caption-2-regular text-text-tertiary">
          <span key={matches} className="animate-number-fade text-caption-1-semibold text-text-primary tabular-nums motion-reduce:animate-none">
            {matches} of {ALLERGEN_MENU.length} dishes
          </span>{" "}
          {selected.length ? "match your filters" : "on the menu"}
        </p>
        {selected.length > 0 ? (
          <button
            type="button"
            onClick={() => setSelected([])}
            className={cx(quietButton, "h-6 shrink-0 px-1 text-caption-2-semibold")}
          >
            <RiRefreshLine className="size-3" aria-hidden />
            Clear
          </button>
        ) : null}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  8. Split bill                                                              */
/* -------------------------------------------------------------------------- */

const SPLIT_PEOPLE = [
  { id: "maya", name: "Maya", initials: "MC" },
  { id: "dev", name: "Dev", initials: "DR" },
  { id: "priya", name: "Priya", initials: "PN" },
] as const;

type PersonId = (typeof SPLIT_PEOPLE)[number]["id"];

const SPLIT_ITEMS: { id: string; name: string; price: number; defaults: PersonId }[] = [
  { id: "agnolotti", name: "Charred corn agnolotti", price: 24, defaults: "maya" },
  { id: "brisket", name: "Smoked brisket", price: 28, defaults: "dev" },
  { id: "negroni", name: "Barrel-aged negroni", price: 14, defaults: "priya" },
];
const SPLIT_TOTAL = SPLIT_ITEMS.reduce((sum, item) => sum + item.price, 0);
const INITIAL_SPLIT: Record<string, PersonId | null> = Object.fromEntries(
  SPLIT_ITEMS.map((item) => [item.id, item.defaults]),
);

export function SplitBill() {
  const [assignments, setAssignments] = useState<Record<string, PersonId | null>>(INITIAL_SPLIT);
  const totals = SPLIT_PEOPLE.map((person) => ({
    ...person,
    total: SPLIT_ITEMS.filter((item) => assignments[item.id] === person.id).reduce(
      (sum, item) => sum + item.price,
      0,
    ),
  }));
  const unassigned = SPLIT_ITEMS.filter((item) => !assignments[item.id]).reduce(
    (sum, item) => sum + item.price,
    0,
  );

  const assign = (itemId: string, personId: PersonId) => {
    setAssignments((current) => ({
      ...current,
      [itemId]: current[itemId] === personId ? null : personId,
    }));
  };

  return (
    <section aria-label="Split the bill" className={cx(cardSurface, "max-w-[520px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-accent-600">
          <RiBillLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Split bill</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">The Pass · Table 7 · 3 items</p>
        </div>
        <span aria-live="polite" className="shrink-0 text-caption-2-regular text-text-tertiary">
          {unassigned > 0 ? (
            <>Unassigned <bdi dir="ltr" className="text-status-yellow-text">{money.format(unassigned)}</bdi></>
          ) : (
            <>Subtotal <bdi dir="ltr" className="text-text-primary">{money.format(SPLIT_TOTAL)}</bdi></>
          )}
        </span>
      </div>

      <ul className="mt-1.5 flex flex-col">
        {SPLIT_ITEMS.map((item) => (
          <li key={item.id} className="flex items-center gap-2 border-b border-separator-border py-1 last:border-b-0">
            <span className="min-w-0 flex-1 truncate text-caption-1-medium text-text-primary">{item.name}</span>
            <div role="group" aria-label={`Assign ${item.name}`} className="flex shrink-0 items-center gap-0.5">
              {SPLIT_PEOPLE.map((person) => {
                const active = assignments[item.id] === person.id;
                return (
                  <button
                    key={person.id}
                    type="button"
                    aria-label={`Assign ${item.name} to ${person.name}`}
                    aria-pressed={active}
                    onClick={() => assign(item.id, person.id)}
                    className={cx(
                      "flex size-6 items-center justify-center rounded-full text-caption-2-semibold",
                      "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                      focusRing,
                      active
                        ? "bg-accent-600 text-text-white shadow-xs"
                        : "bg-background-tertiary-default text-text-secondary hover:bg-background-tertiary-hover",
                    )}
                  >
                    {person.initials}
                  </button>
                );
              })}
            </div>
            <span className="w-12 shrink-0 text-end text-caption-1-semibold text-text-primary tabular-nums">
              <bdi dir="ltr">{money.format(item.price)}</bdi>
            </span>
          </li>
        ))}
      </ul>

      <dl className="mt-1.5 grid grid-cols-3 gap-1 rounded-lg bg-background-secondary-default p-1.5">
        {totals.map((person) => (
          <div key={person.id} className="min-w-0">
            <dt className="flex items-center gap-1 truncate text-caption-2-regular text-text-tertiary">
              <span aria-hidden className="flex size-4 shrink-0 items-center justify-center rounded-full bg-background-tertiary-default text-caption-2-semibold text-text-secondary">
                {person.initials.slice(0, 1)}
              </span>
              <span className="truncate">{person.name}</span>
            </dt>
            <dd
              key={person.total}
              className="mt-0.5 animate-number-fade text-caption-1-semibold text-text-primary tabular-nums motion-reduce:animate-none"
            >
              <bdi dir="ltr">{money.format(person.total)}</bdi>
            </dd>
          </div>
        ))}
      </dl>
      <p className="sr-only" role="status">
        {totals.map((person) => `${person.name} ${money.format(person.total)}`).join(". ")}. {unassigned > 0 ? `Unassigned ${money.format(unassigned)}.` : "All items assigned."}
      </p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  9. Table map                                                               */
/* -------------------------------------------------------------------------- */

const FLOOR_TABLES: { id: string; seats: number; note: string; x: number; y: number }[] = [
  { id: "T1", seats: 2, note: "Bar window", x: 12, y: 48 },
  { id: "T2", seats: 2, note: "Bar window", x: 32, y: 48 },
  { id: "T3", seats: 4, note: "Window", x: 68, y: 34 },
  { id: "T4", seats: 4, note: "Center room", x: 16, y: 78 },
  { id: "T5", seats: 6, note: "Garden", x: 50, y: 74 },
  { id: "T6", seats: 2, note: "Garden", x: 82, y: 74 },
];

export function TableMap() {
  const [selected, setSelected] = useState("T5");
  const table = FLOOR_TABLES.find((option) => option.id === selected) ?? FLOOR_TABLES[0];

  return (
    <section aria-label="Floor plan" className={cx(cardSurface, "max-w-[520px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
            <RiTableLine className="size-3.5" aria-hidden />
          </span>
          <div>
            <h3 className="text-body-2-semibold text-text-primary">The Pass · floor plan</h3>
            <p className="text-caption-2-regular text-text-tertiary">6 tables · 20 seats</p>
          </div>
        </div>
        <span className="shrink-0 text-caption-2-regular text-text-tertiary">Select a table</span>
      </div>

      {/* The room is measured from the bar wall, so the plan stays LTR. */}
      <div
        dir="ltr"
        role="group"
        aria-label="Floor plan, select a table"
        className="relative mt-1.5 h-[108px] overflow-hidden rounded-lg border border-separator-border bg-background-secondary-default"
      >
        <span aria-hidden className="pointer-events-none absolute left-2 top-1.5 text-caption-2-regular text-text-tertiary">
          BAR
        </span>
        <span aria-hidden className="pointer-events-none absolute right-2 top-1.5 text-caption-2-regular text-text-tertiary">
          WINDOW
        </span>
        {FLOOR_TABLES.map((option) => {
          const active = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              aria-label={`Table ${option.id.slice(1)}, ${option.seats} seats, ${option.note}`}
              onClick={() => setSelected(option.id)}
              style={{ left: `${option.x}%`, top: `${option.y}%` }}
              className={cx(
                "absolute flex min-w-9 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-md border px-1.5 py-1",
                "transition-[transform,scale,border-color,background-color,box-shadow] duration-200 ease-out motion-reduce:transition-none motion-reduce:scale-100",
                focusRing,
                active
                  ? "z-10 scale-110 border-accent-500 bg-background-primary-default shadow-sm"
                  : "border-border-button-default bg-background-primary-default shadow-xs hover:border-border-button-hover",
              )}
            >
              <span className="text-caption-2-semibold text-text-primary">{option.id}</span>
              <span aria-hidden className="flex items-center gap-0.5">
                {Array.from({ length: option.seats }).map((_, seat) => (
                  <span
                    key={seat}
                    className={cx(
                      "size-1 rounded-full transition-[background-color] duration-200 ease-out motion-reduce:transition-none",
                      active ? "bg-accent-600" : "bg-foreground-icon-quaternary",
                    )}
                  />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      <div aria-live="polite" className="mt-1.5 flex items-center gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-primary-default text-accent-600 shadow-xs">
          <RiMapPin2Line className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary">
            <span key={`${table.id}-title`} className="animate-label-in motion-reduce:animate-none">
              Table {table.id.slice(1)} · {table.seats} seats
            </span>
          </p>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            <span key={`${table.id}-note`} className="animate-label-in motion-reduce:animate-none">
              {table.note} · Available at 7:30 PM
            </span>
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-status-lime-background px-1.5 py-0.5 text-caption-2-medium text-status-lime-text">
          Available
        </span>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  10. Kitchen status                                                         */
/* -------------------------------------------------------------------------- */

type KitchenTicket = { id: string; table: string; dish: string; lane: number };

const KITCHEN_LANES = [
  { label: "Queued", dot: "bg-foreground-icon-quaternary" },
  { label: "Cooking", dot: "bg-status-orange-text" },
  { label: "Ready", dot: "bg-status-lime-text" },
] as const;

const INITIAL_TICKETS: KitchenTicket[] = [
  { id: "#4821", table: "T4", dish: "Brisket ×2 · slaw", lane: 0 },
  { id: "#4822", table: "T2", dish: "Agnolotti · negroni", lane: 0 },
  { id: "#4823", table: "T6", dish: "Corn ribs ×3", lane: 1 },
  { id: "#4824", table: "T1", dish: "Gnocchi · affogato", lane: 1 },
  { id: "#4825", table: "T3", dish: "Lemon tart ×2", lane: 2 },
];

export function KitchenStatus() {
  const [tickets, setTickets] = useState<KitchenTicket[]>(INITIAL_TICKETS);
  const [announcement, setAnnouncement] = useState("Kitchen board ready.");

  const advance = (ticket: KitchenTicket) => {
    setTickets((current) =>
      current.flatMap((item) => {
        if (item.id !== ticket.id) return [item];
        if (item.lane === KITCHEN_LANES.length - 1) return [];
        return [{ ...item, lane: item.lane + 1 }];
      }),
    );
    setAnnouncement(
      ticket.lane === KITCHEN_LANES.length - 1
        ? `Ticket ${ticket.id} served.`
        : `Ticket ${ticket.id} moved to ${KITCHEN_LANES[ticket.lane + 1].label.toLowerCase()}.`,
    );
  };

  return (
    <section aria-label="Kitchen ticket board" className={cx(cardSurface, "max-w-[540px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiRestaurant2Line className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">Kitchen</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            Dinner service · {tickets.length} open
          </p>
        </div>
        {tickets.length < INITIAL_TICKETS.length ? (
          <button
            type="button"
            onClick={() => {
              setTickets(INITIAL_TICKETS);
              setAnnouncement("Kitchen board reset.");
            }}
            className={cx(quietButton, "h-6 shrink-0 px-1 text-caption-2-semibold")}
          >
            <RiRefreshLine className="size-3" aria-hidden />
            Reset
          </button>
        ) : null}
      </div>

      <div className="mt-1.5 grid grid-cols-3 gap-1.5">
        {KITCHEN_LANES.map((lane, laneIndex) => {
          const laneTickets = tickets.filter((ticket) => ticket.lane === laneIndex);
          return (
            <div key={lane.label} className="flex min-h-[96px] flex-col gap-1 rounded-lg bg-background-secondary-default p-1.5">
              <div className="flex items-center justify-between gap-1">
                <span className="flex min-w-0 items-center gap-1 text-caption-2-semibold text-text-primary">
                  <span className={cx("size-1.5 shrink-0 rounded-full", lane.dot)} aria-hidden />
                  <span className="truncate">{lane.label}</span>
                </span>
                <span className="shrink-0 text-caption-2-medium text-text-tertiary tabular-nums">
                  {laneTickets.length}
                </span>
              </div>

              {laneTickets.length > 0 ? (
                laneTickets.map((ticket) => (
                  <button
                    key={ticket.id}
                    type="button"
                    onClick={() => advance(ticket)}
                    aria-label={
                      laneIndex === KITCHEN_LANES.length - 1
                        ? `Serve ticket ${ticket.id} for table ${ticket.table.slice(1)}`
                        : `Move ticket ${ticket.id} to ${KITCHEN_LANES[laneIndex + 1].label.toLowerCase()}`
                    }
                    className={cx(
                      "w-full animate-label-in rounded-md border border-border-button-default bg-background-primary-default px-1.5 py-1 text-start",
                      "transition-[border-color,background-color] duration-150 ease-out hover:border-border-button-hover hover:bg-background-primary-hover",
                      "motion-reduce:animate-none motion-reduce:transition-none",
                      focusRing,
                    )}
                  >
                    <span className="flex items-center gap-1">
                      <span className="min-w-0 flex-1 truncate text-caption-2-semibold text-text-primary"><bdi dir="ltr">{ticket.id}</bdi></span>
                      <span className="shrink-0 text-caption-2-regular text-text-tertiary"><bdi dir="ltr">{ticket.table}</bdi></span>
                      {laneIndex === KITCHEN_LANES.length - 1 ? (
                        <RiCheckLine className="size-3 shrink-0 text-status-lime-text" aria-hidden />
                      ) : (
                        <RiArrowRightLine className="size-3 shrink-0 text-foreground-icon-tertiary rtl:-scale-x-100" aria-hidden />
                      )}
                    </span>
                    <span className="block truncate text-caption-2-regular text-text-secondary">{ticket.dish}</span>
                  </button>
                ))
              ) : (
                <p className="my-auto text-center text-caption-2-regular text-text-tertiary">All clear</p>
              )}
            </div>
          );
        })}
      </div>
      <p className="sr-only" role="status">{announcement}</p>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  11. Loyalty card                                                           */
/* -------------------------------------------------------------------------- */

const LOYALTY = {
  tier: "Gold",
  nextTier: "Platinum",
  points: 1280,
  nextAt: 1500,
  reward: "Free flat white",
  cost: 150,
};

export function LoyaltyCard() {
  const [points, setPoints] = useState(LOYALTY.points);
  const [redeemed, setRedeemed] = useState(false);
  const progress = Math.min(100, Math.round((points / LOYALTY.nextAt) * 100));

  return (
    <section aria-label="Loyalty card" className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <div className="flex items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-status-yellow-background text-status-yellow-text">
          <RiStarFill className="size-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-body-2-semibold text-text-primary">The Pass</h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">Member since 2024 · 14 visits</p>
        </div>
        <span className="shrink-0 rounded-full border border-border-button-default px-1.5 py-0.5 text-caption-2-semibold text-text-secondary">
          {LOYALTY.tier}
        </span>
      </div>

      <div className="mt-2 flex items-baseline justify-between gap-2">
        <p aria-live="polite" className="flex items-baseline gap-1">
          <span key={points} className="animate-number-fade text-title-2-semibold text-text-primary tabular-nums motion-reduce:animate-none">
            {pointsFormat.format(points)}
          </span>
          <span className="text-caption-2-regular text-text-tertiary">points</span>
        </p>
        <span className="text-caption-2-regular text-text-tertiary tabular-nums">
          {LOYALTY.nextAt - points} to {LOYALTY.nextTier}
        </span>
      </div>

      <div
        role="progressbar"
        aria-label="Progress to Platinum"
        aria-valuemin={0}
        aria-valuemax={LOYALTY.nextAt}
        aria-valuenow={points}
        className="mt-1 h-1.5 overflow-hidden rounded-full bg-background-tertiary-default"
      >
        <div
          className="h-full rounded-full bg-accent-500 transition-[width] duration-200 ease-out motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-2 flex items-center gap-2 rounded-lg border border-separator-border bg-background-secondary-default p-1.5">
        <span
          className={cx(
            "flex size-6 shrink-0 items-center justify-center rounded-md transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
            redeemed
              ? "bg-status-lime-background text-status-lime-text"
              : "bg-background-primary-default text-accent-600",
          )}
        >
          {redeemed ? <RiCheckLine className="size-3.5" aria-hidden /> : <RiGiftLine className="size-3.5" aria-hidden />}
        </span>
        <div className="min-w-0 flex-1">
          <p aria-live="polite" className="truncate text-caption-1-semibold text-text-primary">
            {redeemed ? "Redeemed · PASS-8821" : LOYALTY.reward}
          </p>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            {redeemed ? "Show this code at the bar" : `${LOYALTY.cost} points · expires Nov 30`}
          </p>
        </div>
        {redeemed ? (
          <button
            type="button"
            onClick={() => {
              setRedeemed(false);
              setPoints(LOYALTY.points);
            }}
            className={cx(quietButton, "h-6 shrink-0 px-1 text-caption-2-semibold")}
          >
            Undo
          </button>
        ) : (
          <button
            type="button"
            disabled={points < LOYALTY.cost}
            onClick={() => {
              setPoints((value) => value - LOYALTY.cost);
              setRedeemed(true);
            }}
            className={cx(primaryButton, "h-6 shrink-0 px-2 text-caption-2-semibold")}
          >
            Redeem
          </button>
        )}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  12. Tip selector                                                           */
/* -------------------------------------------------------------------------- */

const BILL = 68.4;
const TIP_OPTIONS = [15, 18, 20, 25] as const;

type TipMode = (typeof TIP_OPTIONS)[number] | "custom";

export function TipSelector() {
  const id = useId();
  const [mode, setMode] = useState<TipMode>(18);
  const [custom, setCustom] = useState("12");
  const [paid, setPaid] = useState(false);
  const parsedCustom = Number.parseFloat(custom);
  const customTip = Number.isFinite(parsedCustom) ? Math.max(0, parsedCustom) : 0;
  const tip = mode === "custom" ? customTip : (BILL * mode) / 100;
  const total = BILL + tip;

  return (
    <section aria-label="Tip selector" className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
            <RiReceiptLine className="size-3.5" aria-hidden />
          </span>
          <h3 className="text-body-2-semibold text-text-primary">Add a tip</h3>
        </div>
        <span className="text-caption-2-regular text-text-tertiary tabular-nums">Bill <bdi dir="ltr">{money.format(BILL)}</bdi></span>
      </div>

      <div role="group" aria-label="Tip percentage" className="mt-2 grid grid-cols-5 gap-1">
        {TIP_OPTIONS.map((option) => {
          const active = mode === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setMode(option);
                setPaid(false);
              }}
              className={cx(
                "flex h-7 items-center justify-center rounded-md border text-caption-2-semibold tabular-nums",
                "transition-[background-color,border-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                active
                  ? "border-accent-500 bg-background-secondary-default text-text-primary shadow-xs"
                  : "border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-primary-hover",
              )}
            >
              {option}%
            </button>
          );
        })}
        <button
          type="button"
          aria-pressed={mode === "custom"}
          onClick={() => {
            setMode("custom");
            setPaid(false);
          }}
          className={cx(
            "flex h-7 items-center justify-center rounded-md border text-caption-2-semibold",
            "transition-[background-color,border-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
            focusRing,
            mode === "custom"
              ? "border-accent-500 bg-background-secondary-default text-text-primary shadow-xs"
              : "border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-primary-hover",
          )}
        >
          Custom
        </button>
      </div>

      {mode === "custom" ? (
        <div className="mt-1 flex animate-label-in items-center gap-1.5 motion-reduce:animate-none">
          <label htmlFor={id} className="shrink-0 text-caption-2-regular text-text-tertiary">Amount</label>
          <div className="flex h-6 min-w-0 flex-1 items-center gap-1 rounded-md bg-background-tertiary-default px-2 focus-within:ring-2 focus-within:ring-border-focus-ring">
            <span aria-hidden className="text-caption-1-medium text-text-tertiary">$</span>
            <input
              id={id}
              inputMode="decimal"
              value={custom}
              onChange={(event) => {
                setCustom(event.target.value.replace(/[^\d.]/g, ""));
                setPaid(false);
              }}
              aria-label="Custom tip amount in dollars"
              className="min-w-0 flex-1 bg-transparent p-0 text-caption-1-medium text-text-primary tabular-nums outline-none placeholder:text-text-placeholder"
            />
          </div>
          <span className="shrink-0 text-caption-2-regular text-text-tertiary">tip</span>
        </div>
      ) : null}

      <div className="mt-1.5 border-t border-separator-border pt-1.5">
        <div aria-live="polite" className="flex items-start justify-between gap-2">
          <div>
            <p className="text-caption-2-regular text-text-tertiary">
              Tip {mode === "custom" ? "custom" : `${mode}%`}
            </p>
            <p key={tip} className="animate-number-fade text-caption-1-semibold text-text-primary tabular-nums motion-reduce:animate-none">
              <bdi dir="ltr">{money.format(tip)}</bdi>
            </p>
          </div>
          <div className="text-end">
            <p className="text-caption-2-regular text-text-tertiary">Total</p>
            <p key={total} className="animate-number-fade text-caption-1-semibold text-text-primary tabular-nums motion-reduce:animate-none">
              <bdi dir="ltr">{money.format(total)}</bdi>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setPaid((value) => !value)}
          aria-label={paid ? "Payment complete, undo payment" : `Pay ${money.format(total)}`}
          className={cx(paid ? cx(buttonBase, "h-6 bg-status-lime-background text-status-lime-text") : cx(primaryButton, "h-6"), "mt-1.5 w-full")}
        >
          {paid ? (
            <>
              <RiCheckLine className="size-3.5" aria-hidden />
              Paid {money.format(total)} · undo
            </>
          ) : (
            <>
              Pay {money.format(total)}
              <RiArrowRightLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*  Specimens                                                                  */
/* -------------------------------------------------------------------------- */

export const FOOD_SECTION: ExtendedSection = {
  id: "food",
  title: "Food",
  blurb: "Menus, orders and the table in between.",
  file: "food.tsx",
  entries: [
    { name: "Order Card", description: "Items, total and a status that moves from kitchen to door.", Demo: OrderCard },
    { name: "Menu Item", description: "One dish, its price and an add button that keeps count.", Demo: MenuItem },
    { name: "Cart Row", description: "Quantity stepper, computed line total and a removable row.", Demo: CartRow },
    { name: "Delivery Tracker", description: "Prep, pickup and en-route milestones with a live next step.", Demo: DeliveryTracker },
    { name: "Reservation Picker", description: "Party size, date and time in one compact booking.", Demo: ReservationPicker },
    { name: "Recipe Card", description: "Time, servings and ingredients that scale with the table.", Demo: RecipeCard },
    { name: "Allergen Chips", description: "Toggle allergens and watch the matching dish count fall.", Demo: AllergenChips },
    { name: "Split Bill", description: "Assign dishes to people and total each share.", Demo: SplitBill, wide: true },
    { name: "Table Map", description: "Pick a table by seats and room, then read the details.", Demo: TableMap, wide: true },
    { name: "Kitchen Status", description: "Tickets move from queued to cooking to ready.", Demo: KitchenStatus, wide: true },
    { name: "Loyalty Card", description: "Points, tier progress and a reward worth redeeming.", Demo: LoyaltyCard },
    { name: "Tip Selector", description: "Percentage or custom tip with a live grand total.", Demo: TipSelector },
  ],
};
