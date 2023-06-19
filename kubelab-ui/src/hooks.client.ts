import { client } from "$lib/pocketbase";

import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    if (client.authStore.isValid) {
        try {
            await client.collection("users").authRefresh();
        } catch (_) {
            client.authStore.clear();
        }
    }

    const response = await resolve(event);

    return response;
};

// client.authStore.loadFromCookie(document.cookie);
// client.authStore.onChange(() => {
//     currentUser.set(client.authStore.model);
//     document.cookie = client.authStore.exportToCookie({ httpOnly: false });
// });
