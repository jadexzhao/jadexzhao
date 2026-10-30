const { test, expect } = require("@playwright/test");

const pages = [
  { path: "/", heading: "I like figuring out how things work." },
  { path: "/projects/index.html", heading: "Things I have built" },
  { path: "/field-notes.html", heading: "Garden" },
  { path: "/about.html", heading: "Jade Zhao" },
  { path: "/bm25.html", heading: "BM25 notes search" },
];

test("garden pages have no pageerror", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  for (const item of pages) {
    const response = await page.goto(item.path);
    expect(response?.ok(), item.path).toBeTruthy();
    await expect(page.locator("h1")).toContainText(item.heading);
  }
  expect(errors, errors.join("\n")).toEqual([]);
});

test("Garden matcha story opens and turns a page", async ({ page }) => {
  await page.goto("/field-notes.html");
  await page.getByRole("link", { name: "If You Give a Developer a Matcha" }).click();
  await expect(page).toHaveURL(/matcha-story\.html$/);
  await expect(page.locator("h1")).toContainText("If You Give a Developer a Matcha");
  await page.getByRole("button", { name: "Next" }).click();
  await expect(page.getByText("Scene 2 of 8")).toBeVisible();
  await expect(page.locator(".story-scene.is-on h2")).toContainText(
    "If she builds something",
  );
});

test("Garden More experiments opens design experiments", async ({ page }) => {
  await page.goto("/field-notes.html");
  await page.getByRole("link", { name: "More experiments" }).click();
  await expect(page).toHaveURL(/design-experiments\.html$/);
  await expect(page.locator("h1")).toContainText("Design experiments");
});

test("Work search filters the archive", async ({ page }) => {
  await page.goto("/projects/index.html");
  await page.getByLabel("Search").fill("BM25");
  await expect(page.locator("#project-groups")).toContainText(
    "BM25 notes search",
  );
  await page.getByLabel("Search").fill("zzzz-no-match");
  await expect(page.locator("#project-groups")).toContainText(
    "No projects match",
  );
});

test("home nav reaches Work, Garden, About", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Work" })
    .click();
  await expect(page).toHaveURL(/projects\/index\.html$/);
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "Garden" })
    .click();
  await expect(page).toHaveURL(/field-notes\.html$/);
  await page
    .getByRole("navigation")
    .getByRole("link", { name: "About" })
    .click();
  await expect(page).toHaveURL(/about\.html$/);
});

test("Nashville assignment still serves and uses portfolio-shell only", async ({
  page,
}) => {
  const response = await page.goto("/nashville-acc.html");
  expect(response?.ok()).toBeTruthy();
  await expect(page.locator("h1")).toContainText("Town of Nashville");
  const styles = await page
    .locator('link[rel="stylesheet"]')
    .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("href")));
  expect(styles).toContain("portfolio-shell.css");
  expect(
    styles.some((href) => href && href.includes("garden-shell")),
  ).toBeFalsy();
});
