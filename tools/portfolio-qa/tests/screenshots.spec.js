const { test } = require("@playwright/test");
const path = require("path");

const shots = path.join(__dirname, "..", "screenshots");

const pages = [
  { name: "home", url: "/" },
  { name: "work", url: "/projects/index.html" },
  { name: "garden", url: "/field-notes.html" },
  { name: "about", url: "/about.html" },
  { name: "nashville", url: "/nashville-acc.html" },
];

test("desktop and mobile screenshots", async ({ page }) => {
  for (const item of pages) {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(item.url, { waitUntil: "networkidle" });
    await page.screenshot({
      path: path.join(shots, `${item.name}-desktop.png`),
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(item.url, { waitUntil: "networkidle" });
    await page.screenshot({
      path: path.join(shots, `${item.name}-mobile.png`),
      fullPage: true,
    });
  }
});
