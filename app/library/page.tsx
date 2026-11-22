"use client";

import { useEffect, useMemo, useState } from "react";
import {
  RiApps2Line,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiSearchLine,
} from "@remixicon/react";

import { AppShell } from "@/components/application/app-shell/app-shell";
import { CopySourceButton } from "@/components/application/library/copy-source-button";
import {
  EXTENDED_CHAPTERS,
  EXTENDED_COUNT,
  EXTENDED_SECTIONS,
} from "@/components/extended";
import { cx } from "@/utils/cx";

/**
 * The extended library, at 500 specimens. The index leads with families, not
 * 500 mounted demos: choose a chapter, open a family, then use the real
 * component. Search returns names and descriptions that jump into the family,
 * so the page stays fast while the library keeps growing.
 */

const sectionById = new Map(EXTENDED_SECTIONS.map((section) => [section.id, section]));

const chapterBySection = new Map<string, (typeof EXTENDED_CHAPTERS)[number]>();
for (const chapter of EXTENDED_CHAPTERS) {
  for (const id of chapter.sectionIds) chapterBySection.set(id, chapter);
}

const chapterById = new Map(EXTENDED_CHAPTERS.map((chapter) => [chapter.id, chapter]));

const familiesInChapter = (chapterId: string) => {
  if (chapterId === "all") return EXTENDED_SECTIONS;
  const chapter = chapterById.get(chapterId);
  if (!chapter) return EXTENDED_SECTIONS;
  return chapter.sectionIds
    .map((id) => sectionById.get(id))
    .filter((section): section is (typeof EXTENDED_SECTIONS)[number] => Boolean(section));
};

const chapterCount = (chapterId: string) =>
  familiesInChapter(chapterId).reduce((total, section) => total + section.entries.length, 0);

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring";

export default function LibraryPage() {
  const [query, setQuery] = useState("");
  const [chapterId, setChapterId] = useState("all");
  const [familyId, setFamilyId] = useState("all");

  const family = familyId === "all" ? null : sectionById.get(familyId) ?? null;
  const chapter = family ? chapterBySection.get(family.id) : chapterById.get(chapterId);

  const openFamily = (id: string) => {
    const section = sectionById.get(id);
    if (!section) return;
    const parent = chapterBySection.get(id);
    setFamilyId(id);
    setChapterId(parent?.id ?? "all");
    setQuery("");
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const showChapter = (id: string) => {
    setChapterId(id);
    setFamilyId("all");
    setQuery("");
    window.history.replaceState(null, "", window.location.pathname);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const reset = () => {
    setChapterId("all");
    setFamilyId("all");
    setQuery("");
    window.history.replaceState(null, "", window.location.pathname);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  // A family is linkable: /library#ai opens the AI family directly.
  useEffect(() => {
    const openHash = () => {
      const id = window.location.hash.slice(1);
      if (!id) return;
      const section = sectionById.get(id);
      if (!section) return;
      setFamilyId(id);
      setChapterId(chapterBySection.get(id)?.id ?? "all");
      setQuery("");
    };
    openHash();
    window.addEventListener("hashchange", openHash);
    return () => window.removeEventListener("hashchange", openHash);
  }, []);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return null;
    return EXTENDED_SECTIONS.map((section) => ({
      section,
      entries: section.entries.filter((entry) =>
        `${entry.name} ${entry.description} ${section.title} ${section.blurb}`
          .toLowerCase()
          .includes(needle),
      ),
    })).filter((group) => group.entries.length > 0);
  }, [query]);

  const resultCount = results
    ? results.reduce((total, group) => total + group.entries.length, 0)
    : 0;

  const families = useMemo(
    () => (family ? [family] : familiesInChapter(chapterId)),
    [family, chapterId],
  );

  const headingCount = results
    ? `${resultCount} ${resultCount === 1 ? "match" : "matches"}`
    : family
      ? `${family.entries.length} components`
      : `${EXTENDED_SECTIONS.length} families · ${EXTENDED_COUNT} components`;

  const showIndex = !results && !family;
  const showFamily = !results && Boolean(family);

  return (
    <AppShell
      title="Library"
      heading="Library"
      icon={RiApps2Line}
      actions={null}
      columnClassName="max-w-[1040px]"
      headingClassName="text-title-1-medium"
    >
      <div className="flex w-full flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-1">
          <p className="text-body-regular text-text-secondary">
            {EXTENDED_COUNT} components in {EXTENDED_SECTIONS.length} families. Browse by family,
            search every specimen, and open a family to use the real component — open a menu, type
            in a field, dismiss a toast.
          </p>
          <p className="text-body-2-regular text-text-secondary">
            They live in{" "}
            <code className="rounded-xs bg-background-tertiary-default px-1 py-px font-mono text-caption-1-medium text-text-primary">
              components/extended
            </code>{" "}
            and stay separate from the Victory UI base set.
          </p>
        </div>

        {/* Sticky controls: search, chapter, and the families inside the open chapter. */}
        <div className="sticky top-0 z-20 -mx-1 flex flex-col gap-2 border-b border-separator-border bg-background-full/95 px-1 py-2 backdrop-blur-sm">
          <div className="flex w-full flex-col gap-1.5 sm:flex-row sm:items-center">
            <div className="flex h-8 w-full min-w-0 items-center gap-2 rounded-lg bg-background-primary-default px-2 ring-1 ring-inset ring-border-button-default focus-within:ring-2 focus-within:ring-border-button-active sm:w-auto sm:max-w-[360px] sm:flex-1">
              <RiSearchLine className="size-4 shrink-0 text-foreground-icon-secondary" aria-hidden />
              <input
                type="search"
                aria-label="Search the library"
                placeholder="Search names and descriptions"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-body-2-regular text-text-primary outline-none placeholder:text-text-secondary [&::-webkit-search-cancel-button]:appearance-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className={cx(
                    "rounded-sm text-caption-1-semibold text-text-secondary hover:text-text-primary",
                    focusRing,
                  )}
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-caption-1-medium text-text-secondary tabular-nums">
                {headingCount}
              </span>
              {(family || chapterId !== "all" || query) && (
                <button
                  type="button"
                  onClick={reset}
                  className={cx(
                    "h-7 rounded-full px-2 text-caption-1-semibold text-text-secondary hover:bg-background-primary-default hover:text-text-primary",
                    focusRing,
                  )}
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="relative -mx-1">
            <div
              className="flex items-center gap-1 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="group"
              aria-label="Filter by chapter"
            >
              {[{ id: "all", title: "All" }, ...EXTENDED_CHAPTERS].map((item) => {
                const active = chapterId === item.id && !results;
                const count = item.id === "all" ? EXTENDED_COUNT : chapterCount(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-chapter={item.id}
                    aria-pressed={active}
                    onClick={() => showChapter(item.id)}
                    className={cx(
                      "flex h-7 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-caption-1-semibold transition-colors duration-150 ease",
                      focusRing,
                      active
                        ? "bg-segmented-control-selected-background text-text-primary shadow-xs"
                        : "text-text-secondary hover:bg-background-primary-default hover:text-text-primary",
                    )}
                  >
                    {item.title}
                    <span className="text-caption-2-regular tabular-nums">{count}</span>
                  </button>
                );
              })}
            </div>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 end-0 w-8 bg-gradient-to-l from-background-full to-transparent sm:hidden"
            />
          </div>

          {showFamily && chapter && chapter.sectionIds.length > 1 && (
            <div className="relative -mx-1">
              <div
                className="flex items-center gap-1 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                role="group"
                aria-label="Families in this chapter"
              >
                {familiesInChapter(chapter.id).map((section) => {
                  const active = section.id === family?.id;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => openFamily(section.id)}
                      className={cx(
                        "h-7 shrink-0 rounded-full px-2.5 text-caption-1-semibold transition-colors duration-150 ease",
                        focusRing,
                        active
                          ? "bg-background-tertiary-default text-text-primary"
                          : "text-text-secondary hover:bg-background-primary-default hover:text-text-primary",
                      )}
                    >
                      {section.title}
                    </button>
                  );
                })}
              </div>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-0 end-0 w-8 bg-gradient-to-l from-background-full to-transparent sm:hidden"
              />
            </div>
          )}
        </div>

        {results && (
          <div className="flex flex-col gap-6">
            {resultCount === 0 ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border-button-default px-6 py-12 text-center">
                <h2 className="text-headline-semibold text-text-primary">Nothing in this drawer</h2>
                <p className="max-w-sm text-body-2-regular text-text-secondary">
                  No component matches “{query}”. Try a family name, or clear the search.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className={cx(
                    "mt-1 inline-flex h-8 items-center rounded-lg border border-border-button-default bg-background-primary-default px-2.5 text-body-2-medium text-text-primary shadow-xs hover:bg-background-primary-hover",
                    focusRing,
                  )}
                >
                  Reset filters
                </button>
              </div>
            ) : (
              results.map(({ section, entries }) => (
                <section key={section.id} className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <h2 className="text-title-2-medium text-text-primary">{section.title}</h2>
                    <span className="text-body-2-medium text-text-secondary tabular-nums">
                      {entries.length}
                    </span>
                    <span className="ms-auto hidden font-mono text-caption-2-regular text-text-secondary lg:inline">
                      components/extended/{section.file}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
                    {entries.map((entry) => (
                      <button
                        key={entry.name}
                        type="button"
                        data-result={entry.name}
                        onClick={() => openFamily(section.id)}
                        className={cx(
                          "group -mx-2 flex items-start gap-3 rounded-xl border-t border-separator-border px-2 py-3 text-start transition-colors duration-150 ease hover:bg-background-secondary-default/60",
                          focusRing,
                        )}
                      >
                        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span className="text-body-2-semibold text-text-primary">{entry.name}</span>
                          <span className="text-caption-1-regular text-text-secondary">
                            {entry.description}
                          </span>
                        </span>
                        <RiArrowRightLine
                          className="mt-0.5 size-4 shrink-0 text-foreground-icon-quaternary transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
                          aria-hidden
                        />
                      </button>
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>
        )}

        {showIndex && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 pt-2">
              <h2 className="text-title-2-medium text-text-primary">
                {chapterId === "all" ? "Browse by family" : chapter?.title}
              </h2>
              <span className="text-body-2-medium text-text-secondary tabular-nums">
                {families.length} {families.length === 1 ? "family" : "families"}
              </span>
              <span className="text-body-2-regular text-text-secondary">
                {chapterId === "all" ? "Six chapters, one visual language." : ""}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 xl:grid-cols-3">
              {families.map((section) => {
                const parent = chapterBySection.get(section.id);
                return (
                  <button
                    key={section.id}
                    type="button"
                    data-family-card={section.id}
                    onClick={() => openFamily(section.id)}
                    className={cx(
                      "group -mx-2 flex flex-col gap-2 rounded-xl border-t border-separator-border px-2 pb-6 pt-4 text-start transition-colors duration-150 ease hover:bg-background-secondary-default/60",
                      focusRing,
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-caption-2-semibold tracking-wide text-text-secondary uppercase">
                        {parent?.title ?? "Library"}
                      </span>
                      <span className="text-caption-2-medium text-text-secondary tabular-nums">
                        {section.entries.length}
                      </span>
                    </span>
                    <span className="flex items-start justify-between gap-3">
                      <span className="text-title-2-medium text-text-primary">{section.title}</span>
                      <RiArrowRightLine
                        className="mt-1 size-4 shrink-0 text-foreground-icon-quaternary transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
                        aria-hidden
                      />
                    </span>
                    <span className="text-body-2-regular text-pretty text-text-secondary">
                      {section.blurb}
                    </span>
                    <span className="text-caption-1-regular text-text-secondary">
                      {section.entries.slice(0, 3).map((entry) => entry.name).join(" · ")}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {showFamily && family && (
          <div className="flex flex-col gap-4" data-family-view={family.id}>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => showChapter(chapter?.id ?? "all")}
                className={cx(
                  "flex h-7 w-fit items-center gap-1 rounded-md pe-2 text-caption-1-semibold text-text-secondary hover:text-text-primary",
                  focusRing,
                )}
              >
                <RiArrowLeftLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
                {chapterId === "all" ? "All families" : chapter?.title}
              </button>
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <h2 className="text-title-1-medium text-text-primary">{family.title}</h2>
                <span className="text-body-2-medium text-text-secondary tabular-nums">
                  {family.entries.length}
                </span>
                <span className="text-body-2-regular text-text-secondary">{family.blurb}</span>
                <span className="ms-auto hidden font-mono text-caption-2-regular text-text-secondary lg:inline">
                  components/extended/{family.file}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2 xl:grid-cols-3">
              {family.entries.map((entry) => {
                const Demo = entry.Demo;
                return (
                  <article
                    key={entry.name}
                    data-entry={entry.name}
                    className={cx(
                      "group/entry relative flex min-w-0 flex-col gap-3 border-t border-separator-border pb-6 pt-8",
                      entry.wide && "sm:col-span-2",
                    )}
                  >
                    <CopySourceButton
                      sectionId={family.id}
                      entryName={entry.name}
                      className="absolute end-0 top-1 z-20"
                    />
                    <div className="flex min-h-[128px] flex-1 items-center justify-center sm:min-h-[168px]">
                      <Demo />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <h3 className="text-body-2-semibold text-text-primary">{entry.name}</h3>
                      <p className="text-caption-1-regular text-text-secondary">{entry.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => showChapter(chapter?.id ?? "all")}
              className={cx(
                "flex h-8 w-fit items-center gap-1 rounded-lg border border-border-button-default bg-background-primary-default px-2.5 text-body-2-medium text-text-primary shadow-xs hover:bg-background-primary-hover",
                focusRing,
              )}
            >
              <RiArrowLeftLine className="size-3.5 rtl:-scale-x-100" aria-hidden />
              Back to families
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
