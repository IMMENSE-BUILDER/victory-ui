"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  RiAddLine,
  RiArrowDownSLine,
  RiArrowRightLine,
  RiAwardLine,
  RiBookOpenLine,
  RiCalendarLine,
  RiChat3Line,
  RiCheckLine,
  RiCloseLine,
  RiDownloadLine,
  RiErrorWarningLine,
  RiFileCopyLine,
  RiFileTextLine,
  RiFireLine,
  RiLightbulbLine,
  RiLoader4Line,
  RiPauseLine,
  RiPlayLine,
  RiQuestionLine,
  RiRefreshLine,
  RiRestartLine,
  RiSendPlaneLine,
  RiShareLine,
  RiThumbUpFill,
  RiThumbUpLine,
  RiTimerLine,
  RiTrophyLine,
  RiVerifiedBadgeLine,
} from "@remixicon/react";
import { cx } from "@/utils/cx";
import type { ExtendedSection } from "./types";

/* Shared */

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";

const cardSurface =
  "w-full rounded-xl border border-border-button-default bg-background-primary-default shadow-card";

const buttonBase = cx(
  "inline-flex items-center justify-center gap-1.5 rounded-lg text-caption-1-semibold",
  "transition-[transform,opacity,background-color,color,box-shadow,border-color] duration-150 ease-out",
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  "motion-reduce:transition-none motion-reduce:active:scale-100",
);

const primaryButton = cx(
  buttonBase,
  "h-8 bg-button-primary px-2.5 text-text-white shadow-xs",
  focusRing,
);

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

const reveal =
  "grid transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none";

type PillTone = "neutral" | "accent" | "lime" | "yellow" | "blue";

const pillTones: Record<PillTone, string> = {
  neutral: "bg-background-tertiary-default text-text-secondary",
  accent: "bg-accent-100 text-accent-700",
  lime: "bg-status-lime-background text-status-lime-text",
  yellow: "bg-status-yellow-background text-status-yellow-text",
  blue: "bg-status-blue-background text-status-blue-text",
};

function Pill({
  tone = "neutral",
  className,
  children,
}: {
  tone?: PillTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-caption-2-semibold",
        "transition-[background-color,color] duration-200 ease-out motion-reduce:transition-none",
        pillTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

function Avatar({ name, small = false }: { name: string; small?: boolean }) {
  const initials = name
    .split(" ")
    .map((part) => part.slice(0, 1))
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      aria-hidden
      className={cx(
        "flex shrink-0 items-center justify-center rounded-full bg-accent-100 text-accent-700",
        small ? "size-5 text-caption-2-semibold" : "size-7 text-caption-2-semibold",
      )}
    >
      {initials}
    </span>
  );
}

function formatClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/* 1. Course card */

const COURSE_LESSONS = [
  "Design tokens in practice",
  "Contrast and colour",
  "Spacing that scales",
  "Patterns under pressure",
] as const;

const COURSE_TOTAL = 24;

export function CourseCard() {
  const [completed, setCompleted] = useState(9);
  const [saved, setSaved] = useState(false);
  const finished = completed >= COURSE_TOTAL;
  const nextNumber = Math.min(completed + 1, COURSE_TOTAL);
  const lesson = COURSE_LESSONS[Math.max(0, completed - 9) % COURSE_LESSONS.length];
  const percent = Math.round((completed / COURSE_TOTAL) * 100);
  useEffect(() => {
    if (!saved) return;
    const timer = window.setTimeout(() => setSaved(false), 1600);
    return () => window.clearTimeout(timer);
  }, [saved, completed]);
  const continueCourse = () => {
    setCompleted((current) => Math.min(COURSE_TOTAL, current + 1));
    setSaved(true);
  };
  return (
    <section aria-label="Advanced Design Systems course" className={cx(cardSurface, "max-w-[300px] p-3")}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-caption-2-semibold tracking-wide text-accent-600 uppercase">
            In progress
          </p>
          <h3 className="mt-0.5 truncate text-title-3-semibold text-text-primary">
            Advanced Design Systems
          </h3>
        </div>
        <Pill tone="accent">{percent}%</Pill>
      </div>
      <div className="mt-2 flex items-baseline justify-between gap-2">
        <span className="text-caption-1-medium text-text-secondary tabular-nums">
          {completed} of {COURSE_TOTAL} lessons
        </span>
        <span className="text-caption-2-regular text-text-tertiary tabular-nums">
          {COURSE_TOTAL - completed} left
        </span>
      </div>
      <div
        role="progressbar"
        aria-label="Course progress"
        aria-valuemin={0}
        aria-valuemax={COURSE_TOTAL}
        aria-valuenow={completed}
        aria-valuetext={`${completed} of ${COURSE_TOTAL} lessons complete`}
        className="mt-1 h-1.5 overflow-hidden rounded-full bg-background-tertiary-default"
      >
        <div
          className="h-full rounded-full bg-accent-500 transition-[width] duration-200 ease-out motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div
        key={finished ? "complete" : completed}
        className="mt-2 flex animate-label-in items-center gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5 motion-reduce:animate-none"
      >
        <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-background-primary-default text-accent-600 shadow-xs">
          {finished ? (
            <RiTrophyLine className="size-3.5" aria-hidden />
          ) : (
            <RiPlayLine className="size-3" aria-hidden />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary">
            {finished ? "All 24 lessons complete" : `Lesson ${nextNumber}: ${lesson}`}
          </p>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            {finished ? "Your certificate is ready to share." : "12 min · Video and practice"}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={continueCourse}
        disabled={finished}
        className={cx(finished ? secondaryButton : primaryButton, "mt-2 w-full")}
      >
        {saved ? (
          <>
            <RiCheckLine className="size-3.5" aria-hidden />
            Lesson {completed} saved
          </>
        ) : finished ? (
          <>
            <RiCheckLine className="size-3.5" aria-hidden />
            Course complete
          </>
        ) : (
          <>
            Continue course
            <RiArrowRightLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
          </>
        )}
      </button>
      <span role="status" className="sr-only">
        {saved ? `Lesson ${completed} marked complete.` : ""}
      </span>
    </section>
  );
}

/* 2. Lesson list */

const MODULES = [
  {
    id: "foundations",
    title: "Foundations",
    lessons: [
      { id: "grids", title: "Grids and rhythm", minutes: 14 },
      { id: "type", title: "Type scales", minutes: 11 },
      { id: "spacing", title: "Spacing and density", minutes: 12 },
    ],
  },
  {
    id: "tokens",
    title: "Tokens",
    lessons: [
      { id: "semantic", title: "Semantic tokens", minutes: 16 },
      { id: "theme", title: "Light and dark", minutes: 13 },
      { id: "component", title: "Component tokens", minutes: 15 },
    ],
  },
  {
    id: "components",
    title: "Components",
    lessons: [
      { id: "controls", title: "Buttons and inputs", minutes: 18 },
      { id: "focus", title: "Focus and keyboard", minutes: 12 },
      { id: "motion", title: "Motion and interruption", minutes: 17 },
    ],
  },
] as const;

const INITIAL_LESSON_DONE: Record<string, boolean> = {
  grids: true,
  type: true,
  semantic: true,
  theme: true,
};

export function LessonList() {
  const baseId = useId();
  const [moduleIndex, setModuleIndex] = useState(0);
  const [done, setDone] = useState<Record<string, boolean>>(INITIAL_LESSON_DONE);
  const activeModule = MODULES[moduleIndex];
  const currentLesson = activeModule.lessons.find((lesson) => !done[lesson.id]);
  const moduleDone = activeModule.lessons.filter((lesson) => done[lesson.id]).length;
  const totalDone = MODULES.reduce(
    (total, module) => total + module.lessons.filter((lesson) => done[lesson.id]).length,
    0,
  );
  const totalLessons = MODULES.reduce((total, module) => total + module.lessons.length, 0);
  return (
    <section
      aria-labelledby={`${baseId}-title`}
      className={cx(cardSurface, "max-w-[300px] p-2.5")}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 id={`${baseId}-title`} className="text-body-2-semibold text-text-primary">
          Course outline
        </h3>
        <span className="text-caption-2-medium text-text-tertiary tabular-nums">
          {totalDone} of {totalLessons} lessons
        </span>
      </div>
      <div role="group" aria-label="Modules" className="mt-1.5 grid grid-cols-3 gap-1">
        {MODULES.map((module, index) => {
          const allDone = module.lessons.every((lesson) => done[lesson.id]);
          return (
            <button
              key={module.id}
              type="button"
              aria-pressed={moduleIndex === index}
              onClick={() => setModuleIndex(index)}
              className={cx(
                "flex h-7 items-center justify-center gap-1 rounded-md text-caption-2-semibold",
                "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                moduleIndex === index
                  ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
                  : "text-text-tertiary hover:text-text-secondary",
              )}
            >
              {allDone && <RiCheckLine className="size-3 text-status-lime-text" aria-hidden />}
              <span className="truncate">{module.title}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-1.5 flex items-baseline justify-between gap-2">
        <p className="text-caption-2-semibold text-text-tertiary uppercase">
          Module {moduleIndex + 1} · {activeModule.title}
        </p>
        <p className="text-caption-2-regular text-text-tertiary tabular-nums">
          {moduleDone} of {activeModule.lessons.length}
        </p>
      </div>
      <ul key={activeModule.id} className="mt-1 flex animate-label-in flex-col gap-0.5 motion-reduce:animate-none">
        {activeModule.lessons.map((lesson) => {
          const isDone = Boolean(done[lesson.id]);
          const isCurrent = currentLesson?.id === lesson.id;
          return (
            <li key={lesson.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={isDone}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Mark “${lesson.title}” ${isDone ? "incomplete" : "complete"}`}
                onClick={() =>
                  setDone((current) => ({ ...current, [lesson.id]: !current[lesson.id] }))
                }
                className={cx(
                  "group flex h-8 w-full items-center gap-2 rounded-md px-1.5 text-start",
                  "transition-[background-color,color] duration-150 ease-out motion-reduce:transition-none",
                  focusRing,
                  isCurrent ? "bg-accent-500/10" : "hover:bg-background-secondary-default",
                )}
              >
                <span
                  className={cx(
                    "flex size-[18px] shrink-0 items-center justify-center rounded-full border",
                    "transition-[background-color,border-color,color] duration-200 ease-out motion-reduce:transition-none",
                    isDone
                      ? "border-accent-600 bg-accent-600 text-text-white"
                      : isCurrent
                        ? "border-accent-500 bg-background-primary-default text-accent-600"
                        : "border-border-checkbox-default bg-background-primary-default text-foreground-icon-quaternary group-hover:border-border-checkbox-hover",
                  )}
                >
                  {isDone ? (
                    <RiCheckLine className="size-3" aria-hidden />
                  ) : (
                    <span className={cx("size-1.5 rounded-full", isCurrent ? "bg-accent-500" : "bg-background-tertiary-hover")} />
                  )}
                </span>
                <span
                  className={cx(
                    "min-w-0 flex-1 truncate text-caption-1-medium",
                    isDone ? "text-text-tertiary line-through" : "text-text-primary",
                  )}
                >
                  {lesson.title}
                </span>
                {isCurrent ? (
                  <Pill tone="accent">Current</Pill>
                ) : (
                  <span className="shrink-0 text-caption-2-regular text-text-tertiary tabular-nums">
                    {isDone ? "Done" : `${lesson.minutes} min`}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
      <p aria-live="polite" className="sr-only">
        {currentLesson
          ? `Current lesson: ${currentLesson.title}.`
          : `${activeModule.title} complete.`}
      </p>
    </section>
  );
}

/* 3. Weekly goal ring */

const WEEKLY_GOAL = 240;

export function WeeklyGoalRing() {
  const [minutes, setMinutes] = useState(172);
  const goalMet = minutes >= WEEKLY_GOAL;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(1, minutes / WEEKLY_GOAL);
  const offset = circumference * (1 - progress);
  return (
    <section aria-label="Weekly study goal" className={cx(cardSurface, "max-w-[300px] p-3")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Weekly goal</h3>
        <span className="text-caption-2-regular text-text-tertiary">Nov 2 – Nov 8</span>
      </div>
      <div className="mt-2 flex items-center gap-3">
        <div
          role="img"
          aria-label={`${minutes} of ${WEEKLY_GOAL} minutes studied this week`}
          className="relative size-[76px] shrink-0"
        >
          <svg viewBox="0 0 76 76" className="size-full -rotate-90" aria-hidden>
            <circle
              cx="38"
              cy="38"
              r={radius}
              fill="none"
              strokeWidth="6"
              className="stroke-background-tertiary-default"
            />
            <circle
              cx="38"
              cy="38"
              r={radius}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="stroke-accent-500 transition-[stroke-dashoffset] duration-200 ease-out motion-reduce:transition-none"
            />
          </svg>
          <span className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              key={minutes}
              className="animate-label-in text-title-3-semibold text-text-primary tabular-nums motion-reduce:animate-none"
            >
              {minutes}
            </span>
            <span className="text-caption-2-regular text-text-tertiary">of {WEEKLY_GOAL} min</span>
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-caption-1-semibold text-text-primary">
            {goalMet ? "Weekly goal met" : `${WEEKLY_GOAL - minutes} min to go`}
          </p>
          <p className="mt-0.5 text-caption-2-regular text-text-tertiary">
            4 of 6 lessons · 3 days left
          </p>
          <Pill tone="yellow" className="mt-1.5">
            <RiFireLine className="size-3" aria-hidden />
            12-day streak
          </Pill>
        </div>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setMinutes((current) => Math.min(WEEKLY_GOAL, current + 20))}
          disabled={goalMet}
          className={cx(goalMet ? secondaryButton : primaryButton, "flex-1")}
        >
          {goalMet ? (
            <>
              <RiCheckLine className="size-3.5" aria-hidden />
              Weekly goal met
            </>
          ) : (
            <>
              <RiAddLine className="size-3.5" aria-hidden />
              Log 20 minutes
            </>
          )}
        </button>
        <button
          type="button"
          aria-label="Reset weekly minutes"
          onClick={() => setMinutes(0)}
          className={cx(secondaryButton, "size-8 shrink-0 px-0")}
        >
          <RiRefreshLine className="size-3.5" aria-hidden />
        </button>
      </div>
      <span role="status" className="sr-only">
        {minutes} of {WEEKLY_GOAL} minutes studied.
      </span>
    </section>
  );
}

/* 4. Quiz question */

const QUIZ = [
  {
    prompt: "Which value keeps a button surface theme-aware?",
    options: ["background-primary-default", "a fixed grey value", "a hard-coded white", "a separate dark theme"],
    correct: 0,
    explanation: "Semantic tokens resolve per theme; fixed values do not.",
  },
  {
    prompt: "What keeps a focus ring visible everywhere?",
    options: ["A 1px grey outline", "Removing the outline", "The focus-ring token at 2px", "A hover colour change"],
    correct: 2,
    explanation: "The focus-ring token holds contrast on every surface.",
  },
] as const;

export function QuizQuestion() {
  const baseId = useId();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const question = QUIZ[index];
  const last = index === QUIZ.length - 1;
  const isCorrect = selected === question.correct;

  const check = () => {
    if (selected === null) return;
    setChecked(true);
    if (isCorrect) setScore((current) => current + 1);
  };

  const advance = () => {
    if (last) return setFinished(true);
    setIndex(index + 1);
    setSelected(null);
    setChecked(false);
  };

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setChecked(false);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <section aria-label="Quiz result" className={cx(cardSurface, "flex max-w-[300px] flex-col items-center p-3 text-center")}>
        <span className="flex size-9 items-center justify-center rounded-full bg-status-lime-background text-status-lime-text">
          <RiTrophyLine className="size-4" aria-hidden />
        </span>
        <h3 className="mt-1.5 text-title-3-semibold text-text-primary">Quiz complete</h3>
        <p className="mt-0.5 text-caption-1-regular text-text-secondary">
          {score} of {QUIZ.length} correct · tokens and focus
        </p>
        <button type="button" onClick={restart} className={cx(secondaryButton, "mt-2 w-full")}>
          <RiRefreshLine className="size-3.5" aria-hidden />
          Try again
        </button>
      </section>
    );
  }

  return (
    <section aria-labelledby={`${baseId}-prompt`} className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-caption-2-semibold text-text-tertiary uppercase">
          <RiQuestionLine className="size-3.5 text-accent-600" aria-hidden />
          Knowledge check
        </span>
        <span className="text-caption-2-medium text-text-tertiary tabular-nums">
          {index + 1} / {QUIZ.length}
        </span>
      </div>
      <h3 id={`${baseId}-prompt`} className="mt-1 text-body-2-semibold text-text-primary">
        {question.prompt}
      </h3>
      <div role="group" aria-labelledby={`${baseId}-prompt`} className="mt-1.5 grid grid-cols-2 gap-1">
        {question.options.map((option, position) => {
          const chosen = selected === position;
          const correctOption = checked && position === question.correct;
          const wrongChoice = checked && chosen && !correctOption;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={chosen}
              disabled={checked}
              onClick={() => setSelected(position)}
              className={cx(
                "flex min-h-8 items-center gap-1.5 rounded-lg border px-1.5 py-0.5 text-start disabled:pointer-events-none",
                "transition-[background-color,border-color,color] duration-150 ease-out motion-reduce:transition-none",
                focusRing,
                correctOption
                  ? "border-status-lime-text bg-status-lime-background text-status-lime-text"
                  : wrongChoice
                    ? "border-border-error-default bg-background-tertiary-error text-text-error-primary"
                    : chosen
                      ? "border-accent-500 bg-background-secondary-default text-text-primary"
                      : "border-border-button-default bg-background-primary-default text-text-secondary hover:bg-background-primary-hover",
              )}
            >
              <span
                className={cx(
                  "flex size-4 shrink-0 items-center justify-center rounded-full border text-caption-2-semibold",
                  correctOption
                    ? "border-status-lime-text bg-status-lime-text text-background-primary-default"
                    : wrongChoice
                      ? "border-border-error-default text-text-error-primary"
                      : chosen
                        ? "border-accent-600 bg-accent-600 text-text-white"
                        : "border-border-button-default text-text-tertiary",
                )}
              >
                {correctOption ? (
                  <RiCheckLine className="size-2.5" aria-hidden />
                ) : wrongChoice ? (
                  <RiCloseLine className="size-2.5" aria-hidden />
                ) : (
                  String.fromCharCode(65 + position)
                )}
              </span>
              <span dir="auto" className="min-w-0 break-words text-caption-2-medium">
                {option}
              </span>
              {checked && position === question.correct && (
                <span className="sr-only">Correct answer</span>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-1.5 flex items-end justify-between gap-2">
        <div className="min-w-0 flex-1">
          {checked ? (
            <p aria-live="polite" className="flex items-start gap-1 text-caption-2-regular">
              {isCorrect ? (
                <RiCheckLine className="mt-0.5 size-3 shrink-0 text-status-lime-text" aria-hidden />
              ) : (
                <RiErrorWarningLine className="mt-0.5 size-3 shrink-0 text-text-error-primary" aria-hidden />
              )}
              <span className={isCorrect ? "text-status-lime-text" : "text-text-error-primary"}>
                {isCorrect ? "Correct." : "Not quite."}{" "}
                <span className="text-text-secondary">{question.explanation}</span>
              </span>
            </p>
          ) : (
            <p className="flex items-center gap-1 text-caption-2-regular text-text-tertiary">
              <RiLightbulbLine className="size-3 text-accent-600" aria-hidden />
              Choose one answer.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={checked ? advance : check}
          disabled={selected === null}
          className={cx(primaryButton, "h-7 shrink-0 px-2")}
        >
          {checked ? (
            <>
              {last ? "Result" : "Next"}
              <RiArrowRightLine className="size-3 rtl:-scale-x-100" aria-hidden />
            </>
          ) : (
            <>
              Check
              <RiCheckLine className="size-3" aria-hidden />
            </>
          )}
        </button>
      </div>
    </section>
  );
}

/* 5. Flashcard */

const FLASHCARDS = [
  {
    tag: "Tokens",
    prompt: "What does a semantic token resolve to?",
    answer: "A role-based value that flips with the theme, not a fixed colour.",
  },
  {
    tag: "Motion",
    prompt: "Why avoid animating every property on interactive surfaces?",
    answer: "It moves layout properties nobody meant to animate, so the page jitters.",
  },
  {
    tag: "Access",
    prompt: "What makes a focus ring dependable?",
    answer: "The focus-ring token at 2px, drawn on :focus-visible for every control.",
  },
] as const;

export function Flashcard() {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<number[]>([]);
  const card = FLASHCARDS[index];
  const rate = (remembered: boolean) => {
    setKnown((current) =>
      remembered
        ? current.includes(index)
          ? current
          : [...current, index]
        : current.filter((item) => item !== index),
    );
    setIndex((current) => (current + 1) % FLASHCARDS.length);
    setFlipped(false);
    cardRef.current?.focus();
  };
  return (
    <section aria-label="Design systems flashcard" className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-body-2-semibold text-text-primary">
          <RiBookOpenLine className="size-3.5 text-accent-600" aria-hidden />
          Flashcard
        </h3>
        <span className="text-caption-2-medium text-text-tertiary tabular-nums">
          {index + 1} of {FLASHCARDS.length} · {known.length} known
        </span>
      </div>
      <div className="mt-1.5 [perspective:900px]">
        <button
          ref={cardRef}
          type="button"
          aria-pressed={flipped}
          aria-label={
            flipped
              ? `Answer: ${card.answer} Activate to hide it.`
              : `Question: ${card.prompt} Activate to reveal the answer.`
          }
          onClick={() => setFlipped((current) => !current)}
          style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
          className={cx(
            "relative block h-[104px] w-full text-start [transform-style:preserve-3d]",
            "transition-transform duration-200 ease-out motion-reduce:transition-none",
            focusRing,
          )}
        >
          <span
            aria-hidden={flipped}
            className={cx(
              "absolute inset-0 flex flex-col justify-between rounded-lg border border-border-button-default bg-background-secondary-default p-2.5 [backface-visibility:hidden]",
              "transition-[border-color,background-color] duration-150 ease-out motion-reduce:transition-none",
            )}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="text-caption-2-semibold tracking-wide text-accent-600 uppercase">
                {card.tag}
              </span>
              <span className="flex items-center gap-1 text-caption-2-regular text-text-tertiary">
                <RiRefreshLine className="size-3" aria-hidden />
                Flip
              </span>
            </span>
            <span className="text-body-2-semibold text-text-primary">{card.prompt}</span>
            <span className="text-caption-2-regular text-text-tertiary">
              Click or press Enter to reveal
            </span>
          </span>
          <span
            aria-hidden={!flipped}
            className="absolute inset-0 flex flex-col justify-between rounded-lg border border-accent-500/50 bg-background-primary-default p-2.5 [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            <span className="text-caption-2-semibold tracking-wide text-accent-600 uppercase">
              Answer
            </span>
            <span className="text-caption-1-regular text-text-secondary">{card.answer}</span>
            <span className="text-caption-2-regular text-text-tertiary">Rate it below</span>
          </span>
        </button>
      </div>
      <div className="mt-1.5 flex h-8 items-center gap-1.5">
        {flipped ? (
          <div key="rating" className="flex w-full animate-label-in items-center gap-1.5 motion-reduce:animate-none">
            <button type="button" onClick={() => rate(false)} className={cx(secondaryButton, "h-7 flex-1")}>
              <RiRefreshLine className="size-3.5" aria-hidden />
              Again
            </button>
            <button type="button" onClick={() => rate(true)} className={cx(primaryButton, "h-7 flex-1")}>
              <RiCheckLine className="size-3.5" aria-hidden />
              Known
            </button>
          </div>
        ) : (
          <div key="hint" className="flex w-full animate-label-in items-center justify-between gap-2 motion-reduce:animate-none">
            <span className="text-caption-2-regular text-text-tertiary">
              {known.length === FLASHCARDS.length ? "Deck complete." : "Reveal, then rate honestly."}
            </span>
            <span className="flex items-center gap-1">
              {FLASHCARDS.map((item, position) => (
                <span
                  key={item.tag}
                  className={cx(
                    "h-1.5 rounded-full transition-[width,background-color] duration-200 ease-out motion-reduce:transition-none",
                    position === index
                      ? "w-4 bg-accent-500"
                      : known.includes(position)
                        ? "w-1.5 bg-accent-300"
                        : "w-1.5 bg-background-tertiary-default",
                  )}
                />
              ))}
            </span>
          </div>
        )}
      </div>
      <span role="status" className="sr-only">
        Card {index + 1} of {FLASHCARDS.length}. {known.length} known.
      </span>
    </section>
  );
}

/* 6. Certificate */

type ShareStatus = "idle" | "copied" | "downloaded";

export function Certificate() {
  const shareId = useId();
  const [shareOpen, setShareOpen] = useState(false);
  const [status, setStatus] = useState<ShareStatus>("idle");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstActionRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!shareOpen) return;
    firstActionRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setShareOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [shareOpen]);
  useEffect(() => {
    if (status === "idle") return;
    const timer = window.setTimeout(() => setStatus("idle"), 1800);
    return () => window.clearTimeout(timer);
  }, [status]);
  const copyLink = () => {
    setStatus("copied");
    void navigator.clipboard
      ?.writeText("https://northline.co/c/NL-4821")
      .catch(() => undefined);
  };
  return (
    <section aria-label="Certificate of completion" className={cx(cardSurface, "relative max-w-[300px] overflow-hidden p-3")}>
      <span aria-hidden className="pointer-events-none absolute -end-7 -top-7 size-20 rounded-full bg-accent-500/10" />
      <div className="relative flex items-center gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-600 text-text-white shadow-xs">
          <RiAwardLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-caption-2-semibold tracking-wide text-accent-600 uppercase">
            Certificate of completion
          </p>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            Northline Academy · Verified
          </p>
        </div>
        <RiVerifiedBadgeLine className="size-4 shrink-0 text-status-lime-text" aria-hidden />
      </div>
      <div className="relative mt-2 border-y border-separator-border py-2 text-center">
        <p className="text-caption-2-regular text-text-tertiary">Awarded to</p>
        <p className="mt-0.5 text-title-3-semibold text-text-primary">Maya Chen</p>
        <p className="mt-0.5 text-caption-1-regular text-text-secondary">
          for completing <span className="text-text-primary">Design Systems Foundations</span> with distinction.
        </p>
      </div>
      <div className="relative mt-1.5 flex items-end justify-between gap-2">
        <div>
          <p className="text-caption-2-regular text-text-tertiary">14 June 2026</p>
          <p dir="ltr" className="font-mono text-caption-2-regular text-text-tertiary">
            NL-4821
          </p>
        </div>
        <button
          ref={triggerRef}
          type="button"
          aria-expanded={shareOpen}
          aria-controls={shareId}
          onClick={() => setShareOpen((current) => !current)}
          className={cx(secondaryButton, "h-7")}
        >
          <RiShareLine className="size-3.5" aria-hidden />
          {shareOpen ? "Close" : "Share"}
        </button>
      </div>
      <div
        id={shareId}
        inert={!shareOpen}
        className={cx(reveal, shareOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mt-1.5 flex items-center gap-1.5 rounded-lg bg-background-secondary-default p-1">
            <button ref={firstActionRef} type="button" onClick={copyLink} className={cx(quietButton, "h-7 flex-1")}>
              {status === "copied" ? (
                <RiCheckLine className="size-3.5 text-status-lime-text" aria-hidden />
              ) : (
                <RiFileCopyLine className="size-3.5" aria-hidden />
              )}
              {status === "copied" ? "Copied" : "Copy link"}
            </button>
            <button
              type="button"
              onClick={() => setStatus("downloaded")}
              className={cx(quietButton, "h-7 flex-1")}
            >
              {status === "downloaded" ? (
                <RiCheckLine className="size-3.5 text-status-lime-text" aria-hidden />
              ) : (
                <RiDownloadLine className="size-3.5" aria-hidden />
              )}
              {status === "downloaded" ? "Saved" : "PDF"}
            </button>
          </div>
          <p aria-live="polite" className="mt-1 text-caption-2-regular text-text-tertiary">
            {status === "copied"
              ? "Credential link copied."
              : status === "downloaded"
                ? "PDF saved to Downloads."
                : "Anyone with the link can verify this credential."}
          </p>
        </div>
      </div>
    </section>
  );
}

/* 7. Assignment row */

type SubmitStatus = "draft" | "submitting" | "submitted";

export function AssignmentRow() {
  const [status, setStatus] = useState<SubmitStatus>("draft");
  useEffect(() => {
    if (status !== "submitting") return;
    const timer = window.setTimeout(() => setStatus("submitted"), 900);
    return () => window.clearTimeout(timer);
  }, [status]);
  const statusTone = status === "submitted" ? "lime" : status === "submitting" ? "blue" : "yellow";
  return (
    <section aria-label="Essay assignment" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-start gap-2">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background-tertiary-default text-foreground-icon-secondary">
          <RiFileTextLine className="size-3.5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body-2-semibold text-text-primary">
            Essay 2 — Tokyo wayfinding
          </h3>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            Interaction Design · 40 points
          </p>
        </div>
        <Pill tone={statusTone}>
          {status === "submitted" ? "Submitted" : status === "submitting" ? "Sending" : "Draft"}
        </Pill>
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-lg bg-background-secondary-default px-2 py-1.5">
        <RiCalendarLine className="size-3.5 shrink-0 text-foreground-icon-tertiary" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary">
            Due Thu 12 Nov · 23:59
          </p>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            {status === "submitted"
              ? "Submitted Thu 5 Nov at 21:04"
              : "Draft saved 2 min ago · 1,840 words"}
          </p>
        </div>
        {status === "submitted" ? (
          <span className="flex h-7 shrink-0 items-center gap-1 rounded-lg bg-status-lime-background px-2 text-caption-1-semibold text-status-lime-text">
            <RiCheckLine className="size-3.5" aria-hidden />
            Submitted
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setStatus("submitting")}
            disabled={status === "submitting"}
            className={cx(primaryButton, "h-7 shrink-0 px-2")}
          >
            {status === "submitting" ? (
              <>
                <RiLoader4Line className="size-3.5 animate-spin motion-reduce:animate-none" aria-hidden />
                Sending
              </>
            ) : (
              <>
                Submit
                <RiArrowRightLine className="size-3 rtl:-scale-x-100" aria-hidden />
              </>
            )}
          </button>
        )}
      </div>
      <div className="mt-1 flex h-6 items-center justify-between gap-2">
        <p aria-live="polite" className="min-w-0 truncate text-caption-2-regular text-text-tertiary">
          {status === "submitted"
            ? "Your tutor will grade this by 19 Nov."
            : "You can resubmit until the deadline."}
        </p>
        {status === "submitted" && (
          <button
            type="button"
            onClick={() => setStatus("draft")}
            className={cx(quietButton, "h-6 shrink-0 px-1")}
          >
            <RiRefreshLine className="size-3" aria-hidden />
            Undo
          </button>
        )}
      </div>
    </section>
  );
}

/* 8. Gradebook cell */

const RUBRIC = [
  { label: "Thesis", score: 3, max: 3 },
  { label: "Evidence", score: 2.5, max: 4 },
  { label: "Analysis", score: 3, max: 3 },
] as const;

export function GradebookCell() {
  const baseId = useId();
  const [open, setOpen] = useState(true);
  return (
    <section aria-label="Gradebook cell for Maya Chen" className={cx(cardSurface, "max-w-[520px] p-3")}>
      <div className="flex items-start gap-2.5">
        <Avatar name="Maya Chen" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-body-2-semibold text-text-primary">Maya Chen</h3>
            <Pill tone="lime">B+</Pill>
          </div>
          <p className="truncate text-caption-2-regular text-text-tertiary">
            Essay 1 · Signage audit
          </p>
          <p className="mt-1 text-caption-1-regular text-text-secondary">
            “A confident argument. Cite the 1972 plan and tighten the final paragraph.”
          </p>
        </div>
        <div className="shrink-0 text-end">
          <p dir="ltr" className="text-title-2-semibold text-text-primary tabular-nums">
            8.5<span className="text-caption-1-medium text-text-tertiary">/10</span>
          </p>
          <p className="text-caption-2-regular text-text-tertiary">Graded 4 Nov</p>
        </div>
      </div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={baseId}
        onClick={() => setOpen((current) => !current)}
        className={cx(
          "mt-2 flex h-6 w-full items-center justify-between gap-2 rounded-sm border-t border-separator-border pt-1.5 text-start",
          focusRing,
        )}
      >
        <span className="flex items-center gap-1 text-caption-2-semibold text-text-secondary">
          <RiFileTextLine className="size-3 text-foreground-icon-tertiary" aria-hidden />
          Rubric breakdown
        </span>
        <span className="flex items-center gap-1 text-caption-2-regular text-text-tertiary">
          8.5 of 10
          <RiArrowDownSLine
            className={cx(
              "size-3.5 transition-[transform] duration-200 ease-out motion-reduce:transition-none",
              open && "rotate-180",
            )}
            aria-hidden
          />
        </span>
      </button>
      <div
        id={baseId}
        inert={!open}
        className={cx(reveal, open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
      >
        <div className="min-h-0 overflow-hidden">
          <dl className="grid grid-cols-3 gap-2 pt-1.5">
            {RUBRIC.map((row) => (
              <div key={row.label}>
                <div className="flex items-baseline justify-between gap-1">
                  <dt className="text-caption-2-medium text-text-secondary">{row.label}</dt>
                  <dd className="text-caption-2-semibold text-text-primary tabular-nums">
                    {row.score}/{row.max}
                  </dd>
                </div>
                <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-background-tertiary-default">
                  <div
                    className="h-full rounded-full bg-accent-500 transition-[width] duration-200 ease-out motion-reduce:transition-none"
                    style={{ width: open ? `${(row.score / row.max) * 100}%` : "0%" }}
                  />
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* 9. Discussion post */

const POST_BODY =
  "For the Tokyo wayfinding audit, do we count station signage as one system or one per line?";

export function DiscussionPost() {
  const replyId = useId();
  const replyTriggerRef = useRef<HTMLButtonElement>(null);
  const replyInputRef = useRef<HTMLInputElement>(null);
  const [voted, setVoted] = useState(false);
  const [replying, setReplying] = useState(false);
  const [draft, setDraft] = useState("");
  const [reply, setReply] = useState<string | null>(null);
  const [replyCount, setReplyCount] = useState(12);
  const votes = 18 + (voted ? 1 : 0);
  useEffect(() => {
    if (replying) replyInputRef.current?.focus();
  }, [replying]);
  const post = () => {
    const text = draft.trim();
    if (!text) return;
    setReply(text);
    setReplyCount((current) => current + 1);
    setDraft("");
    setReplying(false);
    replyTriggerRef.current?.focus();
  };
  return (
    <section aria-label="Discussion post by Priya Raman" className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <div className="flex items-center gap-2">
        <Avatar name="Priya Raman" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-caption-1-semibold text-text-primary">Priya Raman</p>
          <p className="text-caption-2-regular text-text-tertiary">2h ago · Cohort 7</p>
        </div>
        <Pill tone="lime">
          <RiCheckLine className="size-3" aria-hidden />
          Resolved
        </Pill>
      </div>
      <p className="mt-1.5 text-caption-1-regular text-text-secondary">{POST_BODY}</p>
      <div className="mt-1.5 rounded-lg bg-status-lime-background/50 p-1.5">
        <p className="flex items-center gap-1 text-caption-2-semibold text-status-lime-text">
          <RiCheckLine className="size-3" aria-hidden />
          Resolved answer · Lena Park
        </p>
        <p className="mt-0.5 text-caption-2-regular text-text-secondary">
          Count it as one system. The 1972 map is the source; line-level signs are evidence, not new systems.
        </p>
      </div>
      <div className="mt-1.5 flex items-center gap-0.5">
        <button
          type="button"
          aria-pressed={voted}
          aria-label={`${voted ? "Remove upvote" : "Upvote"}. ${votes} upvotes`}
          onClick={() => setVoted((current) => !current)}
          className={cx(quietButton, voted && "text-accent-600 hover:text-accent-600")}
        >
          {voted ? (
            <RiThumbUpFill className="size-3.5" aria-hidden />
          ) : (
            <RiThumbUpLine className="size-3.5" aria-hidden />
          )}
          <span key={votes} className="animate-label-in tabular-nums motion-reduce:animate-none">
            {votes}
          </span>
        </button>
        <button
          ref={replyTriggerRef}
          type="button"
          aria-expanded={replying}
          aria-controls={replyId}
          onClick={() => setReplying((current) => !current)}
          className={quietButton}
        >
          <RiChat3Line className="size-3.5" aria-hidden />
          Reply
        </button>
        <span className="ms-auto text-caption-2-regular text-text-tertiary tabular-nums">
          {replyCount} replies
        </span>
      </div>
      <div
        id={replyId}
        inert={!replying}
        className={cx(reveal, replying ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mt-1.5 flex items-center gap-1">
            <input
              ref={replyInputRef}
              value={draft}
              aria-label="Write a reply"
              placeholder="Add a reply…"
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.stopPropagation();
                  setReplying(false);
                  replyTriggerRef.current?.focus();
                }
                if (event.key === "Enter") post();
              }}
              className={cx(
                "h-8 min-w-0 flex-1 rounded-lg border border-border-button-default bg-background-primary-default px-2",
                "text-caption-1-regular text-text-primary outline-none placeholder:text-text-placeholder shadow-xs",
                focusRing,
              )}
            />
            <button
              type="button"
              aria-label="Post reply"
              onClick={post}
              disabled={!draft.trim()}
              className={cx(primaryButton, "size-8 shrink-0 px-0")}
            >
              <RiSendPlaneLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
            </button>
          </div>
        </div>
      </div>
      {reply && !replying && (
        <div className="mt-1.5 flex animate-label-in items-start gap-1.5 border-t border-separator-border pt-1.5 motion-reduce:animate-none">
          <Avatar name="You" small />
          <p className="min-w-0 text-caption-2-regular text-text-secondary">
            <span className="text-caption-2-semibold text-text-primary">You</span> · just now
            <br />
            {reply}
          </p>
        </div>
      )}
    </section>
  );
}

/* 10. Study timer */

const TIMER_MODES = {
  focus: { label: "Focus", seconds: 25 * 60, note: "Deep work · notifications off" },
  break: { label: "Break", seconds: 5 * 60, note: "Stand up and look out the window" },
} as const;

type TimerMode = keyof typeof TIMER_MODES;

export function StudyTimer() {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [seconds, setSeconds] = useState(TIMER_MODES.focus.seconds);
  const [running, setRunning] = useState(false);
  const duration = TIMER_MODES[mode].seconds;
  const elapsed = 1 - seconds / duration;
  const statusText = running
    ? mode === "focus"
      ? "In focus — phone in the drawer."
      : "On break — back in five."
    : seconds === 0
      ? mode === "focus"
        ? "Focus complete. Take the break."
        : "Break over. Back to it."
      : "Ready when you are.";
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setSeconds((current) => Math.max(0, current - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);
  useEffect(() => {
    if (seconds === 0) setRunning(false);
  }, [seconds]);
  const switchMode = (next: TimerMode) => {
    setMode(next);
    setSeconds(TIMER_MODES[next].seconds);
    setRunning(false);
  };
  return (
    <section aria-label="Study timer" className={cx(cardSurface, "max-w-[300px] p-3")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-body-2-semibold text-text-primary">
          <RiTimerLine className="size-3.5 text-accent-600" aria-hidden />
          Study timer
        </h3>
        <span className="text-caption-2-regular text-text-tertiary">Session 2 of 4</span>
      </div>
      <div role="group" aria-label="Timer mode" className="mt-1.5 grid grid-cols-2 gap-0.5 rounded-lg bg-background-secondary-default p-0.5">
        {(Object.keys(TIMER_MODES) as TimerMode[]).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={mode === option}
            onClick={() => switchMode(option)}
            className={cx(
              "flex h-7 items-center justify-center gap-1 rounded-md text-caption-1-semibold",
              "transition-[background-color,color,box-shadow] duration-150 ease-out motion-reduce:transition-none",
              focusRing,
              mode === option
                ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
                : "text-text-tertiary hover:text-text-secondary",
            )}
          >
            {TIMER_MODES[option].label}
            <span className="text-caption-2-regular text-text-tertiary">
              {TIMER_MODES[option].seconds / 60} min
            </span>
          </button>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-title-1-semibold text-text-primary tabular-nums">{formatClock(seconds)}</p>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            aria-label={running ? `Pause ${mode} timer` : `Start ${mode} timer`}
            onClick={() => setRunning((current) => !current)}
            disabled={seconds === 0}
            className={cx(primaryButton, "h-8 px-3")}
          >
            {running ? (
              <>
                <RiPauseLine className="size-3.5" aria-hidden />
                Pause
              </>
            ) : (
              <>
                <RiPlayLine className="size-3.5" aria-hidden />
                Start
              </>
            )}
          </button>
          <button
            type="button"
            aria-label="Reset timer"
            onClick={() => {
              setSeconds(duration);
              setRunning(false);
            }}
            className={cx(secondaryButton, "size-8 shrink-0 px-0")}
          >
            <RiRestartLine className="size-3.5" aria-hidden />
          </button>
        </div>
      </div>
      <p className="mt-0.5 text-caption-2-regular text-text-tertiary">{TIMER_MODES[mode].note}</p>
      <div
        role="progressbar"
        aria-label={`${TIMER_MODES[mode].label} session progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(elapsed * 100)}
        className="mt-2 h-1 overflow-hidden rounded-full bg-background-tertiary-default"
      >
        <div
          className="h-full rounded-full bg-accent-500 transition-[width] duration-200 ease-out motion-reduce:transition-none"
          style={{ width: `${Math.round(elapsed * 100)}%` }}
        />
      </div>
      <p aria-live="polite" className="mt-1 flex items-center gap-1 text-caption-2-regular text-text-tertiary">
        {running && (
          <span className="size-1.5 animate-pulse rounded-full bg-accent-500 motion-reduce:animate-none" />
        )}
        {statusText}
      </p>
    </section>
  );
}

/* 11. Syllabus */

const WEEKS = [
  {
    id: "w4",
    number: 4,
    theme: "Systems at scale",
    title: "Audit an existing product",
    readings: [
      { title: "Auditing Interfaces", meta: "ch. 3 · 18 pp" },
      { title: "Token inventory template", meta: "1 worksheet" },
    ],
  },
  {
    id: "w5",
    number: 5,
    theme: "Designing with data",
    title: "Chart selection and annotation",
    readings: [
      { title: "The Truthful Art", meta: "ch. 2 · 24 pp" },
      { title: "Annotation checklist", meta: "1 page" },
    ],
  },
  {
    id: "w6",
    number: 6,
    theme: "Prototyping motion",
    title: "Timing, easing and interruption",
    readings: [
      { title: "Motion, chapter 4", meta: "22 pp" },
      { title: "Easing reference", meta: "web · 8 min" },
    ],
  },
] as const;

export function Syllabus() {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>("w5");
  const [done, setDone] = useState<Record<string, boolean>>({ w4: true, w5: false, w6: false });
  const currentWeekId = WEEKS.find((week) => !done[week.id])?.id;
  return (
    <section aria-labelledby={`${baseId}-title`} className={cx(cardSurface, "max-w-[300px] p-2.5")}>
      <div className="flex items-baseline justify-between gap-2">
        <h3 id={`${baseId}-title`} className="text-body-2-semibold text-text-primary">
          Syllabus
        </h3>
        <span className="text-caption-2-medium text-text-tertiary">Weeks 4–6 of 8</span>
      </div>
      <ul className="mt-1">
        {WEEKS.map((week) => {
          const open = openId === week.id;
          const isDone = done[week.id];
          const panelId = `${baseId}-${week.id}`;
          return (
            <li key={week.id} className="border-b border-separator-border last:border-b-0">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-pressed={isDone}
                  aria-label={`Mark week ${week.number} ${isDone ? "incomplete" : "complete"}`}
                  onClick={() => setDone((current) => ({ ...current, [week.id]: !current[week.id] }))}
                  className={cx("flex size-6 shrink-0 items-center justify-center rounded-full", focusRing)}
                >
                  <span
                    className={cx(
                      "flex size-[18px] items-center justify-center rounded-full border text-caption-2-semibold",
                      "transition-[background-color,border-color,color] duration-200 ease-out motion-reduce:transition-none",
                      isDone
                        ? "border-accent-600 bg-accent-600 text-text-white"
                        : "border-border-checkbox-default bg-background-primary-default text-text-tertiary",
                    )}
                  >
                    {isDone ? <RiCheckLine className="size-3" aria-hidden /> : week.number}
                  </span>
                </button>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  aria-current={week.id === currentWeekId ? "step" : undefined}
                  onClick={() => setOpenId(open ? null : week.id)}
                  className={cx("flex h-8 min-w-0 flex-1 items-center gap-1.5 rounded-md text-start", focusRing)}
                >
                  <span className="min-w-0 flex-1">
                    <span
                      className={cx(
                        "block truncate text-caption-1-semibold",
                        isDone ? "text-text-tertiary line-through" : "text-text-primary",
                      )}
                    >
                      Week {week.number} · {week.theme}
                    </span>
                    <span className="block truncate text-caption-2-regular text-text-tertiary">
                      {week.title}
                    </span>
                  </span>
                  <RiArrowDownSLine
                    className={cx(
                      "size-3.5 shrink-0 text-foreground-icon-tertiary transition-[transform] duration-200 ease-out motion-reduce:transition-none",
                      open && "rotate-180",
                    )}
                    aria-hidden
                  />
                </button>
              </div>
              <div
                id={panelId}
                inert={!open}
                className={cx(reveal, open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="pb-1.5 ps-7">
                    <p className="text-caption-2-semibold text-text-tertiary uppercase">
                      {week.readings.length} readings
                    </p>
                    <ul className="mt-0.5 flex flex-col gap-0.5">
                      {week.readings.map((reading) => (
                        <li key={reading.title} className="flex items-center gap-1.5">
                          <RiFileTextLine className="size-3 shrink-0 text-foreground-icon-quaternary" aria-hidden />
                          <span className="min-w-0 flex-1 truncate text-caption-2-medium text-text-secondary">
                            {reading.title}
                          </span>
                          <span className="shrink-0 text-caption-2-regular text-text-tertiary">
                            {reading.meta}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <p aria-live="polite" className="sr-only">
        {openId
          ? `Week ${WEEKS.find((week) => week.id === openId)?.number} reading list expanded.`
          : "Reading list collapsed."}
      </p>
    </section>
  );
}

/* 12. Streak calendar */

const STREAK_TIERS = [
  0, 2, 1, 0, 3, 2, 0,
  1, 0, 2, 3, 0, 1, 0,
  2, 1, 0, 3, 2, 0, 1,
  0, 0, 2, 3, 3, 1, 2,
  2, 3, 4, 2, 3, 1, 2,
] as const;

const TIER_MINUTES = [0, 8, 16, 24, 32];
const TIER_LESSONS = [0, 1, 1, 2, 2];
const STREAK_START = new Date(Date.UTC(2026, 8, 28));
const WEEKDAY = new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" });
const DAY_MONTH = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", timeZone: "UTC" });
const STREAK_DAYS = STREAK_TIERS.map((tier, index) => {
  const date = new Date(STREAK_START);
  date.setUTCDate(STREAK_START.getUTCDate() + index);
  return {
    tier,
    label: `${WEEKDAY.format(date)} ${DAY_MONTH.format(date)}`,
    minutes: TIER_MINUTES[tier],
    lessons: TIER_LESSONS[tier],
  };
});
const ACTIVE_DAYS = STREAK_DAYS.filter((day) => day.tier > 0).length;

export function StreakCalendar() {
  const [selected, setSelected] = useState(STREAK_DAYS.length - 1);
  const day = STREAK_DAYS[selected];
  return (
    <section aria-label="Study activity over five weeks" className={cx(cardSurface, "max-w-[320px] p-2.5")}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-body-2-semibold text-text-primary">Study streak</h3>
        <Pill tone="yellow">
          <RiFireLine className="size-3" aria-hidden />
          12-day streak
        </Pill>
      </div>
      <div className="contributions-grid mt-2 flex gap-2.5" data-accent="emerald">
        <div aria-hidden className="grid h-[102px] shrink-0 grid-rows-7 gap-[3px] text-caption-2-regular text-text-tertiary">
          {["Mon", "", "Wed", "", "Fri", "", ""].map((label, position) => (
            <span key={position} className="flex items-center">
              {label}
            </span>
          ))}
        </div>
        <div
          role="group"
          aria-label="Daily study activity, 28 September to 1 November"
          className="grid grid-flow-col grid-rows-7 gap-[3px]"
        >
          {STREAK_DAYS.map((item, index) => (
            <button
              key={item.label}
              type="button"
              aria-pressed={selected === index}
              aria-label={`${item.label}: ${item.minutes} minutes, ${item.lessons} ${item.lessons === 1 ? "lesson" : "lessons"}`}
              onClick={() => setSelected(index)}
              data-tier={item.tier}
              className={cx(
                "size-3 rounded-[3px]",
                item.tier === 0 ? "bg-background-secondary-default" : "contribution-cell",
                "transition-[transform,box-shadow] duration-150 ease-out hover:scale-125 motion-reduce:transition-none motion-reduce:hover:scale-100",
                focusRing,
                selected === index &&
                  "ring-2 ring-accent-500 ring-offset-1 ring-offset-background-primary-default",
              )}
            />
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-caption-1-semibold text-text-primary">Sep 28 – Nov 1</p>
          <p className="mt-0.5 text-caption-2-regular text-text-tertiary">
            {ACTIVE_DAYS} active days
            <br />
            in the last 5 weeks
          </p>
          <div className="mt-2 flex items-center gap-1">
            <span className="text-caption-2-regular text-text-tertiary">Less</span>
            {[0, 1, 2, 3, 4].map((tier) => (
              <span
                key={tier}
                aria-hidden
                data-tier={tier}
                className={cx(
                  "size-2.5 rounded-[2px]",
                  tier === 0 ? "bg-background-secondary-default" : "contribution-cell",
                )}
              />
            ))}
            <span className="text-caption-2-regular text-text-tertiary">More</span>
          </div>
        </div>
      </div>
      <div className="mt-1.5 rounded-lg bg-background-secondary-default px-2 py-1">
        <p aria-live="polite" className="truncate text-caption-2-regular text-text-secondary">
          <span className="text-caption-2-semibold text-text-primary">{day.label}</span>
          {" · "}
          {day.minutes} min · {day.lessons} {day.lessons === 1 ? "lesson" : "lessons"}
        </p>
      </div>
    </section>
  );
}

/* Specimens */

export const LEARNING_SECTION: ExtendedSection = {
  id: "learning",
  title: "Learning",
  blurb: "Courses, practice and progress that feels earned.",
  file: "learning.tsx",
  entries: [
    { name: "Course Card", description: "Lesson count, progress and a continue action that advances both.", Demo: CourseCard },
    { name: "Lesson List", description: "Modules with completion ticks and a current lesson that moves.", Demo: LessonList },
    { name: "Weekly Goal Ring", description: "A weekly minute goal, a measured ring and a streak.", Demo: WeeklyGoalRing },
    { name: "Quiz Question", description: "Pick an answer, check it and read the explanation.", Demo: QuizQuestion },
    { name: "Flashcard", description: "Flip on click or keyboard, then rate it known or again.", Demo: Flashcard },
    { name: "Certificate", description: "An earned credential with recipient, date and share sheet.", Demo: Certificate },
    { name: "Assignment Row", description: "Due date, live status and a submit transition.", Demo: AssignmentRow },
    { name: "Gradebook Cell", description: "A score, feedback and a three-part rubric breakdown.", Demo: GradebookCell, wide: true },
    { name: "Discussion Post", description: "Upvote, reply and a resolved answer from the instructor.", Demo: DiscussionPost },
    { name: "Study Timer", description: "Focus and break modes with start, pause and reset.", Demo: StudyTimer },
    { name: "Syllabus", description: "Three weeks with topics and expandable reading lists.", Demo: Syllabus },
    { name: "Streak Calendar", description: "Five weeks of daily study, shaded by intensity.", Demo: StreakCalendar },
  ],
};
