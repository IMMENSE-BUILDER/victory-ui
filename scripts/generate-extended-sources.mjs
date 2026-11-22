import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Extracts per-entry source for the extended library.
 *
 * Every family file declares top-level components as `export function Name(`,
 * with shared imports and helpers above the first one. For each catalogue entry
 * we emit:
 *   - `preamble`: everything above the first component (imports + shared helpers)
 *   - `entries[name]`: the declarations from the previous component's end up to
 *     this component's end, which carries the constants written just above it
 *
 * The library's copy button concatenates the two, so the copied text is the
 * component exactly as it ships, plus the imports and helpers it relies on.
 * No component source is rewritten.
 */

const DIR = "components/extended";
const OUT = "public/sources";

const files = readdirSync(DIR).filter((file) => file.endsWith(".tsx")).sort();
mkdirSync(OUT, { recursive: true });

const isComponentStart = (line) => /^export function [A-Z][A-Za-z0-9]*\s*\(/.test(line);
const isBlockEnd = (line) => line === "}";

let totalEntries = 0;
const problems = [];
let bytes = 0;

for (const file of files) {
  const source = readFileSync(join(DIR, file), "utf8");
  const eol = source.includes("\r\n") ? "\r\n" : "\n";
  const lines = source.split(/\r?\n/);

  const sectionStart = lines.findIndex((line) => /_SECTION:\s*ExtendedSection\s*=\s*\{/.test(line));
  if (sectionStart === -1) {
    problems.push(`${file}: no *_SECTION export`);
    continue;
  }

  const sectionBlock = lines.slice(sectionStart).join("\n");
  const idMatch = sectionBlock.match(/id:\s*"([a-z0-9-]+)"/);
  if (!idMatch) {
    problems.push(`${file}: section id missing`);
    continue;
  }
  const id = idMatch[1];

  // Every top-level component: start line + matching closing brace at column 0.
  const components = [];
  for (let i = 0; i < sectionStart; i++) {
    if (!isComponentStart(lines[i])) continue;
    const name = lines[i].match(/^export function ([A-Z][A-Za-z0-9]*)/)[1];
    let end = -1;
    for (let j = i + 1; j < sectionStart; j++) {
      if (isBlockEnd(lines[j])) {
        end = j;
        break;
      }
    }
    if (end === -1) {
      problems.push(`${file}: ${name} has no closing brace`);
      continue;
    }
    components.push({ name, start: i, end });
    i = end;
  }

  if (components.length === 0) {
    problems.push(`${file}: no components found`);
    continue;
  }

  const preamble = lines.slice(0, components[0].start).join(eol).trimEnd();

  // Entry name -> Demo component, from the section's entries array.
  const entriesBlock = sectionBlock.slice(sectionBlock.indexOf("entries:"));
  const entryMatches = [
    ...entriesBlock.matchAll(/\{[^{}]*?name:\s*"([^"]+)"[^{}]*?Demo:\s*([A-Z][A-Za-z0-9]+)[^{}]*?\}/g),
  ];

  const out = { id, file, preamble, entries: {} };

  for (const match of entryMatches) {
    const [, entryName, demoName] = match;
    const index = components.findIndex((component) => component.name === demoName);
    if (index === -1) {
      problems.push(`${file}: ${entryName} -> ${demoName} not found`);
      continue;
    }
    const chunkStart = index === 0 ? components[0].start : components[index - 1].end + 1;
    const code = lines.slice(chunkStart, components[index].end + 1).join(eol).trim();
    out.entries[entryName] = code;
    totalEntries += 1;
  }

  const json = JSON.stringify(out);
  bytes += Buffer.byteLength(json);
  writeFileSync(join(OUT, `${id}.json`), json, "utf8");
}

// Every catalogue entry must resolve, and every file must emit something.
const indexSource = readFileSync(join(DIR, "index.ts"), "utf8");
const exportedSections = [...indexSource.matchAll(/^\s+([A-Z_]+_SECTION),$/gm)].map((m) => m[1]);
const emitted = readdirSync(OUT).filter((f) => f.endsWith(".json")).length;

console.log(`families: ${files.length}  emitted: ${emitted}  entries: ${totalEntries}`);
console.log(`payload: ${(bytes / 1024 / 1024).toFixed(2)} MB across ${emitted} files`);
console.log(`index sections: ${exportedSections.length}`);

if (problems.length) {
  console.error("\nPROBLEMS:");
  for (const problem of problems) console.error("  " + problem);
  process.exit(1);
}

if (emitted !== files.length) {
  console.error(`\nMISMATCH: ${emitted} json files for ${files.length} family files`);
  process.exit(1);
}

console.log("\nEXTENDED SOURCES OK");
