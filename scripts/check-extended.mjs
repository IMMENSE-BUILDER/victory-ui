import fs from "node:fs";
import path from "node:path";

/**
 * Integrity check for the extended library.
 *
 * Parses every family file, counts the live specimens in each `*_SECTION`
 * entries array, and proves that section ids and entry names are unique. It
 * also checks that index.ts imports and mounts every family.
 *
 *   node scripts/check-extended.mjs [--target 500]
 */

const targetArg = process.argv.indexOf("--target");
const target = targetArg === -1 ? 500 : Number(process.argv[targetArg + 1]);
const root = process.cwd();
const dir = path.join(root, "components", "extended");

if (!fs.existsSync(dir)) {
  console.error(`Missing ${dir}`);
  process.exit(1);
}

/** Return the slice from an opening bracket to its matching close. */
function balanced(source, openIndex, open = "[", close = "]") {
  let depth = 0;
  let quote = null;
  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index];
    const previous = source[index - 1];
    if (quote) {
      if (char === quote && previous !== "\\") quote = null;
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === open) depth += 1;
    else if (char === close) {
      depth -= 1;
      if (depth === 0) return source.slice(openIndex, index + 1);
    }
  }
  return null;
}

const files = fs
  .readdirSync(dir)
  .filter((file) => file.endsWith(".tsx"))
  .sort();

const sections = [];
const problems = [];

for (const file of files) {
  const source = fs.readFileSync(path.join(dir, file), "utf8");
  const declaration = source.match(
    /export const (\w+_SECTION)\s*:\s*ExtendedSection\s*=\s*\{/,
  );
  if (!declaration) {
    problems.push(`${file}: no exported *_SECTION: ExtendedSection`);
    continue;
  }

  const exportName = declaration[1];
  const start = declaration.index;
  const entriesIndex = source.indexOf("entries:", start);
  if (entriesIndex === -1) {
    problems.push(`${file}: ${exportName} has no entries array`);
    continue;
  }
  const openIndex = source.indexOf("[", entriesIndex);
  const body = openIndex === -1 ? null : balanced(source, openIndex);
  if (!body) {
    problems.push(`${file}: ${exportName} entries array is not balanced`);
    continue;
  }

  const header = source.slice(start, entriesIndex);
  const id = header.match(/id:\s*"([^"]+)"/)?.[1] ?? "";
  const title = header.match(/title:\s*"([^"]+)"/)?.[1] ?? "";
  const blurb = header.match(/blurb:\s*"([^"]+)"/)?.[1] ?? "";
  const declaredFile = header.match(/file:\s*"([^"]+)"/)?.[1] ?? "";

  if (declaredFile && declaredFile !== file) {
    problems.push(`${file}: section says file "${declaredFile}"`);
  }

  const names = [...body.matchAll(/\{\s*name:\s*"([^"]+)"/g)].map((match) => match[1]);
  const demos = [...body.matchAll(/Demo:\s*(\w+)/g)].map((match) => match[1]);

  for (const demo of demos) {
    const defined = new RegExp(
      `(?:export\\s+)?(?:function|const|class)\\s+${demo}\\b`,
    ).test(source);
    if (!defined) problems.push(`${file}: Demo "${demo}" is not defined in the file`);
  }
  if (names.length !== demos.length) {
    problems.push(`${file}: ${names.length} names but ${demos.length} Demos`);
  }

  sections.push({ file, exportName, id, title, blurb, names, demos, count: names.length });
}

const ids = new Map();
const names = new Map();
for (const section of sections) {
  if (ids.has(section.id)) problems.push(`duplicate section id "${section.id}" (${section.file} and ${ids.get(section.id)})`);
  else ids.set(section.id, section.file);

  for (const name of section.names) {
    if (names.has(name)) problems.push(`duplicate entry name "${name}" (${section.file} and ${names.get(name)})`);
    else names.set(name, section.file);
  }
}

const indexSource = fs.readFileSync(path.join(dir, "index.ts"), "utf8");
for (const section of sections) {
  if (!indexSource.includes(`from "./${section.file.replace(/\.tsx$/, "")}"`)) {
    problems.push(`index.ts does not import ${section.file}`);
  }
  if (!indexSource.includes(`${section.exportName},`) && !indexSource.includes(`${section.exportName}]`)) {
    problems.push(`index.ts does not mount ${section.exportName}`);
  }
}

// Every section must appear in exactly one browsing chapter.
const chapterSource = indexSource.slice(indexSource.indexOf("EXTENDED_CHAPTERS"));
const chapterIds = [...chapterSource.matchAll(/sectionIds:\s*\[([\s\S]*?)\]/g)].flatMap(
  (match) => [...match[1].matchAll(/"([^"]+)"/g)].map((idMatch) => idMatch[1]),
);
const seenChapters = new Map();
for (const id of chapterIds) {
  if (seenChapters.has(id)) problems.push(`section "${id}" appears in more than one chapter`);
  else seenChapters.set(id, true);
  if (!ids.has(id)) problems.push(`chapter references unknown section "${id}"`);
}
for (const section of sections) {
  if (!seenChapters.has(section.id)) problems.push(`section "${section.id}" is not in a chapter`);
}

const total = sections.reduce((sum, section) => sum + section.count, 0);
const width = Math.max(...sections.map((section) => section.title.length), 4);

console.log(`${"Family".padEnd(width)}  Count  File`);
for (const section of sections) {
  console.log(`${section.title.padEnd(width)}  ${String(section.count).padStart(5)}  ${section.file}`);
}
console.log(`${"".padEnd(width)}  ${"-----".padStart(5)}`);
console.log(`${"Total".padEnd(width)}  ${String(total).padStart(5)}  / ${target}`);

if (problems.length > 0) {
  console.error(`\n${problems.length} problem(s):`);
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}

if (total !== target) {
  console.error(`\nExpected ${target} components, found ${total} (${target - total} to go).`);
  process.exit(1);
}

console.log("\nEXTENDED LIBRARY OK");
