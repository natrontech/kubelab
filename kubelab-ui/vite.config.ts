import tailwindcss from "@tailwindcss/vite";
import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";
import fs from "fs";

// detect if we're running inside docker and set the backend accordingly
const pocketbase_url = fs.existsSync("/.dockerenv")
    ? "http://pb:8090" /* docker-to-docker */
    : "http://localhost:8090"; // localhost-to-localhost

const config: UserConfig = {
    plugins: [
        tailwindcss(),
        sveltekit({
            preprocess: vitePreprocess(),
            adapter: adapter({ fallback: "index.html" })
        })
    ],
    server: {
        proxy: {
            // proxy "/api" and "/_" to pocketbase_url
            "/api": pocketbase_url,
            "/_": pocketbase_url
        },
        headers: {
            "Cross-Origin-Embedder-Policy": "require-corp",
            "Cross-Origin-Opener-Policy": "same-origin"
        }
    }
};

export default config;
