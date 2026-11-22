import { INPUTS_SECTION } from "./inputs";
import { SELECTION_SECTION } from "./selection";
import { FORMS_SECTION } from "./forms";
import { TEMPORAL_SECTION } from "./temporal";
import { ONBOARDING_SECTION } from "./onboarding";
import { FEEDBACK_SECTION } from "./feedback";
import { ERRORS_SECTION } from "./errors";
import { NAVIGATION_SECTION } from "./navigation";
import { MOBILE_SECTION } from "./mobile";
import { SURFACES_SECTION } from "./surfaces";
import { DATA_SECTION } from "./data-display";
import { TABLES_SECTION } from "./tables";
import { CHARTS_SECTION } from "./charts";
import { ANALYTICS_SECTION } from "./analytics";
import { MEDIA_SECTION } from "./media";
import { MUSIC_SECTION } from "./music";
import { CONTENT_SECTION } from "./content";
import { NEWS_SECTION } from "./news";
import { CREATOR_SECTION } from "./creator";
import { EDITOR_SECTION } from "./editor";
import { FILES_SECTION } from "./files";
import { INBOX_SECTION } from "./inbox";
import { SUPPORT_SECTION } from "./support";
import { COLLABORATION_SECTION } from "./collaboration";
import { AI_SECTION } from "./ai";
import { AUTOMATION_SECTION } from "./automation";
import { COMMERCE_SECTION } from "./commerce";
import { FINANCE_SECTION } from "./finance";
import { BILLING_SECTION } from "./billing";
import { CRYPTO_SECTION } from "./crypto";
import { FOOD_SECTION } from "./food";
import { SOCIAL_SECTION } from "./social";
import { HEALTH_SECTION } from "./health";
import { FITNESS_SECTION } from "./fitness";
import { GAMES_SECTION } from "./games";
import { LEARNING_SECTION } from "./learning";
import { TRAVEL_SECTION } from "./travel";
import { WEATHER_SECTION } from "./weather";
import { MAPS_SECTION } from "./maps";
import { LOGISTICS_SECTION } from "./logistics";
import { RECRUITING_SECTION } from "./recruiting";
import { REALESTATE_SECTION } from "./realestate";
import { LEGAL_SECTION } from "./legal";
import { PUBLIC_SERVICES_SECTION } from "./public-services";
import { SECURITY_SECTION } from "./security";
import { SYSTEM_SECTION } from "./system";
import { STRUCTURE_SECTION } from "./structure";
import { DEVTOOLS_SECTION } from "./devtools";
import { DEVICES_SECTION } from "./devices";
import type { ExtendedSection } from "./types";

/**
 * The extended library: components written for this project, grouped into
 * families. Kept out of `components/base` on purpose — the base folder is
 * Victory UI's shipped surface, and this set is a separate section that can grow,
 * be pruned, or be promoted one family at a time.
 *
 * Order is deliberate: input and selection first, then the structures that
 * compose them, then the data shapes, then the domain families.
 */
export const EXTENDED_SECTIONS: ExtendedSection[] = [
  INPUTS_SECTION,
  SELECTION_SECTION,
  FORMS_SECTION,
  TEMPORAL_SECTION,
  ONBOARDING_SECTION,
  FEEDBACK_SECTION,
  ERRORS_SECTION,
  NAVIGATION_SECTION,
  MOBILE_SECTION,
  SURFACES_SECTION,
  DATA_SECTION,
  TABLES_SECTION,
  CHARTS_SECTION,
  ANALYTICS_SECTION,
  MEDIA_SECTION,
  MUSIC_SECTION,
  CONTENT_SECTION,
  NEWS_SECTION,
  CREATOR_SECTION,
  EDITOR_SECTION,
  FILES_SECTION,
  INBOX_SECTION,
  SUPPORT_SECTION,
  COLLABORATION_SECTION,
  AI_SECTION,
  AUTOMATION_SECTION,
  COMMERCE_SECTION,
  FINANCE_SECTION,
  BILLING_SECTION,
  CRYPTO_SECTION,
  FOOD_SECTION,
  SOCIAL_SECTION,
  HEALTH_SECTION,
  FITNESS_SECTION,
  GAMES_SECTION,
  LEARNING_SECTION,
  TRAVEL_SECTION,
  WEATHER_SECTION,
  MAPS_SECTION,
  LOGISTICS_SECTION,
  RECRUITING_SECTION,
  REALESTATE_SECTION,
  LEGAL_SECTION,
  PUBLIC_SERVICES_SECTION,
  SECURITY_SECTION,
  SYSTEM_SECTION,
  DEVTOOLS_SECTION,
  DEVICES_SECTION,
  STRUCTURE_SECTION,
];

export const EXTENDED_COUNT = EXTENDED_SECTIONS.reduce((total, section) => total + section.entries.length, 0);

/**
 * Browsing chapters for the library index. The family order inside a chapter
 * follows `EXTENDED_SECTIONS`; every section belongs to exactly one chapter.
 */
export type ExtendedChapter = {
  id: string;
  title: string;
  sectionIds: string[];
};

export const EXTENDED_CHAPTERS: ExtendedChapter[] = [
  {
    id: "foundations",
    title: "Foundations",
    sectionIds: [
      "inputs",
      "selection",
      "forms",
      "temporal",
      "onboarding",
      "feedback",
      "errors",
      "navigation",
      "mobile",
      "surfaces",
      "structure",
    ],
  },
  {
    id: "data",
    title: "Data",
    sectionIds: ["data", "tables", "charts", "analytics"],
  },
  {
    id: "media",
    title: "Media",
    sectionIds: ["media", "music", "content", "news", "creator", "editor"],
  },
  {
    id: "workspace",
    title: "Workspace",
    sectionIds: ["files", "inbox", "support", "collaboration", "ai", "automation"],
  },
  {
    id: "business",
    title: "Business",
    sectionIds: [
      "commerce",
      "finance",
      "billing",
      "crypto",
      "food",
      "social",
      "security",
      "system",
      "devtools",
      "devices",
    ],
  },
  {
    id: "domains",
    title: "Domains",
    sectionIds: [
      "health",
      "fitness",
      "games",
      "learning",
      "travel",
      "weather",
      "maps",
      "logistics",
      "recruiting",
      "realestate",
      "legal",
      "public-services",
    ],
  },
];

export type { ExtendedEntry, ExtendedSection } from "./types";
