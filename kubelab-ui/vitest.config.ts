import { svelteTesting } from "@testing-library/svelte/vite";
import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";

export default mergeConfig(
    viteConfig,
    defineConfig({
        plugins: [svelteTesting()],
        test: {
            environment: "jsdom",
            setupFiles: ["./tests/setup.ts"],
            include: ["src/**/*.test.ts"]
        }
    })
);
