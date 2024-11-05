import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: process.env.CI ? false : true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: "html",
    use: {
        baseURL: "http://localhost:3000",
        trace: "on-first-retry",

        locale: "cs-CZ",
        timezoneId: "Europe/Prague",
        viewport: { width: 1280, height: 720 },
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    webServer: {
        command: "npm run build && npm run start",
        port: 3000,
        reuseExistingServer: !process.env.CI,
    },
});
