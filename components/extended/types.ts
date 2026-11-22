import type { ComponentType } from "react";

/**
 * One specimen in the extended library: a component plus the live demo the
 * library page renders for it. `wide` asks the grid for two columns, used by
 * the entries that need a real measure (forms, lists, code, timelines).
 */
export type ExtendedEntry = {
  name: string;
  description: string;
  Demo: ComponentType;
  wide?: boolean;
};

/** A family of specimens, rendered as one section of the library page. */
export type ExtendedSection = {
  id: string;
  title: string;
  blurb: string;
  /** Source file inside `components/extended`, shown in the section header. */
  file: string;
  entries: ExtendedEntry[];
};
