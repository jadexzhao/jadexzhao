import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
const outDir = path.join(root, "briefcase/assets/work");
const base = process.env.PORTFOLIO_BASE_URL || "http://127.0.0.1:8877";

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

await page.goto(`${base}/projects/index.html`, { waitUntil: "networkidle" });
const bm25 = page.locator("#bm25 .work-feature__media");
await bm25.screenshot({ path: path.join(outDir, "bm25-feature.png") });

await page.goto(`${base}/nashville-acc.html`, { waitUntil: "networkidle" });
await page.screenshot({
  path: path.join(outDir, "nashville-process.png"),
  fullPage: false,
});

await browser.close();
console.log("wrote", outDir);
