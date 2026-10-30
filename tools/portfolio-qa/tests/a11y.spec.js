const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

const gardenPages = [
  "/",
  "/projects/index.html",
  "/field-notes.html",
  "/about.html",
  "/bm25.html",
  "/accessibility.html",
  "/digital-humans.html",
  "/matcha-story.html",
];

test.describe("axe-core (automated only)", () => {
  for (const path of gardenPages) {
    test(`${path} has no serious or critical axe violations`, async ({
      page,
    }) => {
      await page.goto(path);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const blocking = results.violations.filter((v) =>
        ["serious", "critical"].includes(v.impact),
      );
      expect(
        blocking,
        blocking.map((v) => `${v.id}: ${v.help}`).join("\n"),
      ).toEqual([]);
    });
  }

  test("Nashville axe report is collected, not used to edit the page", async ({
    page,
  }) => {
    await page.goto("/nashville-acc.html");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    test.info().annotations.push({
      type: "nashville-axe",
      description: JSON.stringify(
        results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          nodes: v.nodes.length,
        })),
      ),
    });
    expect(page.url()).toContain("nashville-acc.html");
  });
});
