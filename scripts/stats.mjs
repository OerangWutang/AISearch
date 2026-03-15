/**
 * stats.mjs – reports how many files SubView contains and their total size in KB.
 *
 * Usage:
 *   npm run stats            (requires a prior `npm run build`)
 *   node scripts/stats.mjs
 */

import { readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, relative } from "node:path";

const root = resolve(new URL(".", import.meta.url).pathname, "..");

/**
 * Recursively collect all files under `dir`, returning an array of
 * { path: string, bytes: number } objects.
 * Directories matching `skip` are excluded.
 */
function collectFiles(dir, skip = []) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (skip.includes(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFiles(full, skip));
    } else {
      results.push({ path: full, bytes: statSync(full).size });
    }
  }
  return results;
}

function formatKB(bytes) {
  return (bytes / 1024).toFixed(2) + " KB";
}

function printSection(label, files) {
  const total = files.reduce((s, f) => s + f.bytes, 0);
  console.log(`\n${label}`);
  console.log("─".repeat(50));
  for (const f of files) {
    const rel = relative(root, f.path);
    console.log(`  ${rel.padEnd(44)} ${formatKB(f.bytes).padStart(10)}`);
  }
  console.log("─".repeat(50));
  console.log(
    `  ${"Total".padEnd(44)} ${formatKB(total).padStart(10)}  (${files.length} file${files.length === 1 ? "" : "s"})`
  );
}

// ── Source files ──────────────────────────────────────────────────────────────
const srcDir = join(root, "src");
const srcFiles = collectFiles(srcDir);

// ── Built artifacts ───────────────────────────────────────────────────────────
const distDir = join(root, "dist");
const distExists = existsSync(distDir);
const distFiles = distExists ? collectFiles(distDir) : [];

console.log("SubView – extension size report");
console.log("================================");

printSection("Source  (src/)", srcFiles);

if (distExists) {
  printSection("Built   (dist/)", distFiles);
} else {
  console.log("\nBuilt (dist/)  –  not found. Run `npm run build` first.");
}

const srcTotal = srcFiles.reduce((s, f) => s + f.bytes, 0);
const distTotal = distFiles.reduce((s, f) => s + f.bytes, 0);

console.log("\n── Summary ──────────────────────────────────────────");
console.log(`  Source files : ${srcFiles.length} files, ${formatKB(srcTotal)}`);
if (distExists) {
  console.log(`  Built bundle : ${distFiles.length} files, ${formatKB(distTotal)}`);
}
console.log("");
