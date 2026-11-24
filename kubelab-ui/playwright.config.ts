import type { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
    webServer: {
        command: "npm run build && npm run preview -- --host 127.0.0.1",
        url: "http://127.0.0.1:4173",
        timeout: 120000,
        reuseExistingServer: false
    },
    testDir: "tests",
    use: { baseURL: "http://127.0.0.1:4173" }
};

export default config;
