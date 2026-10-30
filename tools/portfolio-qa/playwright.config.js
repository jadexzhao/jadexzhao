const { defineConfig, devices } = require("@playwright/test");

const port = process.env.PORTFOLIO_QA_PORT || "8877";
const baseURL = process.env.PORTFOLIO_BASE_URL || `http://127.0.0.1:${port}`;

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: {
    baseURL,
    trace: "off",
  },
  webServer: process.env.PORTFOLIO_BASE_URL
    ? undefined
    : {
        command: `python3 -m http.server ${port}`,
        cwd: "../../briefcase",
        url: baseURL,
        reuseExistingServer: true,
      },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
