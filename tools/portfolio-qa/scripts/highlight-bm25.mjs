import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { codeToHtml } from "shiki";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const outDir = path.join(root, "briefcase/assets/work");

const source = await readFile(
  path.join(root, "bm25-notes-search/bm25.py"),
  "utf8",
);
const excerpt = source.split("\n").slice(49, 69).join("\n");

const run = `python3 search.py fixtures "how does ranking treat a long note" --top 3

Indexed 4 markdown files
1. score=4.042  bm25-basics.md
   A long note is slightly down-weighted.
   A long note does not automatically win.`;

const opts = { theme: "min-light" };
const scoreHtml = await codeToHtml(excerpt, { ...opts, lang: "python" });
const runHtml = await codeToHtml(run, { ...opts, lang: "bash" });

await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, "bm25-score.html"), `${scoreHtml}\n`);
await writeFile(path.join(outDir, "bm25-run.html"), `${runHtml}\n`);
console.log("wrote", outDir);
