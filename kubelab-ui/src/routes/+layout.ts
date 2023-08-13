import { browser } from "$app/environment";
import { client } from "$lib/pocketbase";
import { redirect } from "@sveltejs/kit";

// turn off SSR - we're JAMstack here
export const ssr = false;
// Prerendering turned off. Turn it on if you know what you're doing.
export const prerender = false;
// trailing slashes make relative paths much easier
export const trailingSlash = "always";

export const load = ({ url }) => {
    const { pathname } = url;

    if (browser) {
        if (client.authStore.model) {
            if (pathname === "/login/") {
                throw redirect(307, "/app");
            }
        }
        // } else {
        //     if (pathname !== "/login/") {
        //         client.authStore.clear();
        //         throw redirect(307, "/login/");
        //     }
        // }

        if(client.authStore.isValid) {
            if (pathname === "/login/") {
                throw redirect(307, "/app");
            }
        }
        // } else {
        //     if (pathname !== "/login/") {
        //         client.authStore.clear();
        //         throw redirect(307, "/login/");
        //     }
        // }
    }

    return {
        pathname
    };
};
