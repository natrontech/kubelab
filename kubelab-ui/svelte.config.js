// import adapter from '@sveltejs/adapter-node';
import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/kit/vite";
import preprocess from "svelte-preprocess";

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://kit.svelte.dev/docs/integrations#preprocessors
    // for more information about preprocessors
    preprocess: [
        vitePreprocess(),
        preprocess({
            postcss: true
        })
    ],
    kit: {
        // adapter: adapter({
        // 	out: 'build',
        // 	envPrefix: 'KUBELAB_',
        // 	polyfill: false
        // }),
        alias: {
            $lib: "src/lib"
        },
        adapter: adapter({
            // Prerendering turned off. Turn it on if you know what you're doing.
            prerender: { entries: [] },
            fallback: "index.html" // enable SPA mode
        }),
        csrf: {
            checkOrigin: false
        }
    },
    onwarn: (warning, handler) => {
        if (warning.code.startsWith("a11y-")) return;
        handler(warning);
    }
};

export default config;
